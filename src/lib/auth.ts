import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getAdminCredentials, syncFromNetlifyBlobs } from './db';
import { safeEqualStrings, verifyPassword } from './password';

const SESSION_COOKIE_NAME = 'radeco_admin_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12; // 12 hours

/**
 * Session signing key. Never hard-coded: it is derived from secrets that are NOT in the
 * public repository (env vars, or the private password hash stored in Netlify Blobs).
 * Changing the admin password therefore invalidates every existing session.
 */
function getSessionSecret(): string {
  if (process.env.RADECO_AUTH_SECRET) return process.env.RADECO_AUTH_SECRET;
  const creds = getAdminCredentials();
  const material =
    creds.custom || !process.env.RADECO_ADMIN_PASSWORD
      ? `db|${creds.hash}|${creds.salt}`
      : `env|${process.env.RADECO_ADMIN_PASSWORD}`;
  return crypto.createHash('sha256').update(`radeco-session|${material}`).digest('hex');
}

/** True while the admin still uses the public default password. */
export function isUsingDefaultPassword(): boolean {
  return !getAdminCredentials().custom && !process.env.RADECO_ADMIN_PASSWORD;
}

export function checkAdminPassword(password: string): boolean {
  const creds = getAdminCredentials();
  if (creds.custom) return verifyPassword(password, creds.hash, creds.salt);
  if (process.env.RADECO_ADMIN_PASSWORD) {
    return safeEqualStrings(password, process.env.RADECO_ADMIN_PASSWORD);
  }
  return verifyPassword(password, creds.hash, creds.salt);
}

export function createSessionToken(username: string): string {
  const payload = JSON.stringify({
    sub: username,
    exp: Date.now() + SESSION_DURATION_MS,
    nonce: crypto.randomBytes(8).toString('hex'),
  });
  const payloadB64 = Buffer.from(payload, 'utf-8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token?: string): { valid: boolean; sub?: string } {
  if (!token || !token.includes('.')) return { valid: false };
  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) return { valid: false };

  const expectedSig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadB64)
    .digest('base64url');

  try {
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return { valid: false };
    }
    const decoded = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (!decoded.exp || Date.now() > decoded.exp) return { valid: false };
    return { valid: true, sub: decoded.sub };
  } catch {
    return { valid: false };
  }
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return false;
    await syncFromNetlifyBlobs(); // latest credentials -> correct signing key
    return verifySessionToken(token).valid;
  } catch {
    return false;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: Math.floor(SESSION_DURATION_MS / 1000),
};

export { SESSION_COOKIE_NAME, SESSION_DURATION_MS };

// Brute-force & anti-spam rate limiting store (per serverless instance)
interface RateRecord {
  count: number;
  resetAt: number;
}
const rateLimitStore = new Map<string, RateRecord>();

export function checkRateLimit(
  key: string,
  maxAttempts = 6,
  windowMs = 1000 * 60 * 10
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, retryAfterSeconds: 0 };
  }

  if (record.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return { allowed: true, remaining: maxAttempts - record.count, retryAfterSeconds: 0 };
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-nf-client-connection-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'local-ip'
  );
}

export function sanitizeText(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

/** Only allow site-relative image paths (blocks javascript:, data:, external hosts). */
export function sanitizeImagePath(input: unknown): string {
  const value = sanitizeText(input, 500);
  if (!value) return '';
  if (/^\/(images|uploads|api\/media|brand)\/[\w\-./]+$/.test(value) && !value.includes('..')) {
    return value;
  }
  return '';
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'radeco_admin_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecretKey(): string {
  return (
    process.env.RADECO_AUTH_SECRET ||
    'radeco-asturias-architectural-security-key-2026-hmac-sha256'
  );
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const usedSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, usedSalt, 64);
  return {
    hash: derivedKey.toString('hex'),
    salt: usedSalt,
  };
}

export function verifyPassword(password: string, storedHash: string, storedSalt: string): boolean {
  try {
    const derivedKey = crypto.scryptSync(password, storedSalt, 64);
    const storedBuffer = Buffer.from(storedHash, 'hex');
    if (derivedKey.length !== storedBuffer.length) return false;
    return crypto.timingSafeEqual(derivedKey, storedBuffer);
  } catch {
    return false;
  }
}

export function createSessionToken(username: string): string {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = JSON.stringify({
    sub: username,
    exp: expiresAt,
    nonce: crypto.randomBytes(8).toString('hex'),
  });
  const payloadB64 = Buffer.from(payload, 'utf-8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSecretKey())
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token?: string): { valid: boolean; sub?: string } {
  if (!token || !token.includes('.')) return { valid: false };
  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) return { valid: false };

  const expectedSig = crypto
    .createHmac('sha256', getSecretKey())
    .update(payloadB64)
    .digest('base64url');

  try {
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return { valid: false };
    }
    const decoded = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (!decoded.exp || Date.now() > decoded.exp) {
      return { valid: false };
    }
    return { valid: true, sub: decoded.sub };
  } catch {
    return { valid: false };
  }
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return verifySessionToken(token).valid;
  } catch {
    return false;
  }
}

export { SESSION_COOKIE_NAME, SESSION_DURATION_MS };

// Brute-force & anti-spam rate limiting store
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
  rateLimitStore.set(key, record);
  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    retryAfterSeconds: 0,
  };
}

export function sanitizeText(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
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


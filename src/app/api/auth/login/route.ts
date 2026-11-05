import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
  verifyPassword,
} from '@/lib/auth';
import { getAdminCredentials } from '@/lib/db';

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'local-ip';

  const rate = checkRateLimit(`admin-login:${ip}`, 6, 1000 * 60 * 10);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: `Demasiados intentos de acceso. Inténtelo de nuevo en ${rate.retryAfterSeconds} segundos.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!password) {
      return NextResponse.json(
        { error: 'Introduzca la contraseña de administrador.' },
        { status: 400 }
      );
    }

    const { hash, salt } = getAdminCredentials();
    const isValid = verifyPassword(password, hash, salt);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas. Verifique la contraseña.' },
        { status: 401 }
      );
    }

    const token = createSessionToken('radeco_admin');
    const response = NextResponse.json({ success: true });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: Math.floor(SESSION_DURATION_MS / 1000),
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Error procesando la solicitud de acceso.' },
      { status: 500 }
    );
  }
}


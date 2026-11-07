import { NextRequest, NextResponse } from 'next/server';
import {
  checkAdminPassword,
  checkRateLimit,
  createSessionToken,
  getClientIp,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from '@/lib/auth';
import { syncFromNetlifyBlobs } from '@/lib/db';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);

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
    await syncFromNetlifyBlobs();
    const body = await request.json();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!password) {
      return NextResponse.json(
        { error: 'Introduzca la contraseña de administrador.' },
        { status: 400 }
      );
    }

    const isValid = checkAdminPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas. Verifique la contraseña.' },
        { status: 401 }
      );
    }

    const token = createSessionToken('radeco_admin');
    const response = NextResponse.json({ success: true });

    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Error procesando la solicitud de acceso.' },
      { status: 500 }
    );
  }
}


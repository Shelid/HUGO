import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, isAuthenticatedAdmin, sanitizeText } from '@/lib/auth';
import {
  addLeadSubmission,
  getLeadsAdmin,
  syncFromNetlifyBlobs,
  updateLeadStatus,
} from '@/lib/db';

const ALLOWED_WORK_TYPES = new Set([
  'Cubierta',
  'Tejado',
  'Terraza',
  'Impermeabilización',
  'Reparación',
  'Rehabilitación',
  'Mantenimiento',
  'Otro',
]);

export async function GET() {
  await syncFromNetlifyBlobs();
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  return NextResponse.json({ leads: getLeadsAdmin() });
}

export async function POST(request: NextRequest) {
  await syncFromNetlifyBlobs();
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'local-ip';

  const rate = checkRateLimit(`lead-submit:${ip}`, 8, 1000 * 60 * 15);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error:
          'Se han recibido varias solicitudes desde su conexión. Por favor, espere unos minutos o contáctenos por WhatsApp.',
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Anti-spam honeypot field check
    if (body.website_url && String(body.website_url).trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    const name = sanitizeText(body.name, 120);
    const phone = sanitizeText(body.phone, 40);
    const email = sanitizeText(body.email, 120);
    const municipality = sanitizeText(body.municipality, 100);
    const workTypeRaw = sanitizeText(body.workType, 60);
    const workType = ALLOWED_WORK_TYPES.has(workTypeRaw) ? workTypeRaw : 'Cubierta';
    const description = sanitizeText(body.description, 2500);

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: 'Por favor, indique su nombre.' },
        { status: 400 }
      );
    }

    if (!phone || phone.length < 6) {
      return NextResponse.json(
        { error: 'Por favor, indique un teléfono de contacto válido.' },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'El formato del correo electrónico no es válido.' },
        { status: 400 }
      );
    }

    if (!municipality) {
      return NextResponse.json(
        { error: 'Por favor, indique el municipio en Asturias.' },
        { status: 400 }
      );
    }

    if (!description || description.length < 10) {
      return NextResponse.json(
        { error: 'Por favor, describa brevemente el trabajo o problema.' },
        { status: 400 }
      );
    }

    const photos = Array.isArray(body.photos)
      ? body.photos.map((p: unknown) => sanitizeText(p, 400)).filter(Boolean).slice(0, 6)
      : [];

    const created = addLeadSubmission({
      name,
      phone,
      email,
      municipality,
      workType,
      description,
      photos,
    });

    return NextResponse.json({ success: true, leadId: created.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Error al enviar la solicitud de presupuesto.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = sanitizeText(body.id, 100);
    const status = body.status;
    if (
      !id ||
      (status !== 'nuevo' && status !== 'en_estudio' && status !== 'presupuestado')
    ) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    updateLeadStatus(id, status);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error al actualizar estado' }, { status: 500 });
  }
}


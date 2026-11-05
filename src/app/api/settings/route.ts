import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin, sanitizeText } from '@/lib/auth';
import {
  getCompanySettings,
  syncFromNetlifyBlobs,
  updateCompanySettings,
} from '@/lib/db';

export async function GET() {
  await syncFromNetlifyBlobs();
  return NextResponse.json({ settings: getCompanySettings() });
}

export async function PUT(request: NextRequest) {
  await syncFromNetlifyBlobs();
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = updateCompanySettings({
      phone: body.phone !== undefined ? sanitizeText(body.phone, 50) : undefined,
      whatsappNumber:
        body.whatsappNumber !== undefined
          ? sanitizeText(body.whatsappNumber, 40).replace(/[^\d]/g, '')
          : undefined,
      whatsappDefaultMessage:
        body.whatsappDefaultMessage !== undefined
          ? sanitizeText(body.whatsappDefaultMessage, 300)
          : undefined,
      email: body.email !== undefined ? sanitizeText(body.email, 120) : undefined,
      businessHours:
        body.businessHours !== undefined
          ? sanitizeText(body.businessHours, 180)
          : undefined,
      defaultWarrantyWorkmanship:
        body.defaultWarrantyWorkmanship !== undefined
          ? sanitizeText(body.defaultWarrantyWorkmanship, 100)
          : undefined,
      defaultWarrantyMaterials:
        body.defaultWarrantyMaterials !== undefined
          ? sanitizeText(body.defaultWarrantyMaterials, 100)
          : undefined,
      defaultWarrantyConditions:
        body.defaultWarrantyConditions !== undefined
          ? sanitizeText(body.defaultWarrantyConditions, 2000)
          : undefined,
    });
    return NextResponse.json({ settings: updated });
  } catch {
    return NextResponse.json(
      { error: 'Error al guardar la configuración.' },
      { status: 500 }
    );
  }
}


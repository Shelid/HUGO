import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin, sanitizeText, slugify } from '@/lib/auth';
import {
  createOrUpdateProject,
  getAllProjectsAdmin,
  getCompanySettings,
  getProjectBySlug,
  getPublishedProjects,
  syncFromNetlifyBlobs,
} from '@/lib/db';
import { Project } from '@/types';

export async function GET(request: NextRequest) {
  await syncFromNetlifyBlobs();
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode');

  if (mode === 'admin') {
    const isAdmin = await isAuthenticatedAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.json({ projects: getAllProjectsAdmin() });
  }

  return NextResponse.json({ projects: getPublishedProjects() });
}

export async function POST(request: NextRequest) {
  await syncFromNetlifyBlobs();
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Acceso denegado. Inicie sesión en el panel.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = getCompanySettings();

    const title = sanitizeText(body.title, 180);
    const municipality = sanitizeText(body.municipality, 80);

    if (!title || !municipality) {
      return NextResponse.json(
        { error: 'El título y el municipio son obligatorios.' },
        { status: 400 }
      );
    }

    let baseSlug = body.slug
      ? slugify(String(body.slug))
      : slugify(`${title}-${municipality}`);

    if (!baseSlug) {
      baseSlug = `obra-${Date.now()}`;
    }

    // Ensure unique slug
    let finalSlug = baseSlug;
    let counter = 2;
    while (getProjectBySlug(finalSlug, true)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newProject: Project = {
      id: `obra-${Date.now()}`,
      slug: finalSlug,
      title,
      subtitle: sanitizeText(body.subtitle, 300),
      municipality,
      province: sanitizeText(body.province || 'Asturias', 60) || 'Asturias',
      status: body.status === 'published' ? 'published' : 'draft',
      featured: Boolean(body.featured),
      coverImage: sanitizeText(body.coverImage || '/images/projects/oviedo-after.jpg', 500),
      beforeImage: sanitizeText(body.beforeImage || '', 500) || undefined,
      afterImage: sanitizeText(body.afterImage || '', 500) || undefined,
      beforeLabel: sanitizeText(body.beforeLabel || 'Antes de la intervención', 140),
      afterLabel: sanitizeText(body.afterLabel || 'Después de la intervención RADECO', 140),
      gallery: Array.isArray(body.gallery)
        ? body.gallery.map((g: Record<string, unknown>, idx: number) => ({
            id: sanitizeText(g.id, 80) || `img-${Date.now()}-${idx}`,
            url: sanitizeText(g.url, 500),
            thumbnailUrl: g.thumbnailUrl ? sanitizeText(g.thumbnailUrl, 500) : undefined,
            alt: sanitizeText(g.alt || `${title} - ${municipality}`, 200),
            caption: sanitizeText(g.caption || '', 240),
            category:
              g.category === 'ejecucion' ||
              g.category === 'acabado' ||
              g.category === 'detalle' ||
              g.category === 'estructura'
                ? g.category
                : 'acabado',
            order: typeof g.order === 'number' ? g.order : idx + 1,
          }))
        : [],
      description: sanitizeText(body.description, 4000),
      technicalContext: sanitizeText(body.technicalContext || '', 2000),
      interventionDetails: sanitizeText(body.interventionDetails || '', 2000),
      services: Array.isArray(body.services)
        ? body.services.map((s: unknown) => sanitizeText(s, 80)).filter(Boolean)
        : ['Rehabilitación', 'Impermeabilización'],
      duration: sanitizeText(body.duration || 'Consultar', 80),
      propertyType: sanitizeText(body.propertyType || 'Residencial', 100),
      technicalSpecs: Array.isArray(body.technicalSpecs)
        ? body.technicalSpecs
            .map((spec: Record<string, unknown>) => ({
              label: sanitizeText(spec.label, 100),
              value: sanitizeText(spec.value, 220),
            }))
            .filter((s: { label: string; value: string }) => s.label && s.value)
        : [],
      warrantyWorkmanship:
        sanitizeText(body.warrantyWorkmanship, 100) || settings.defaultWarrantyWorkmanship,
      warrantyMaterials:
        sanitizeText(body.warrantyMaterials, 100) || settings.defaultWarrantyMaterials,
      warrantyConditions:
        sanitizeText(body.warrantyConditions, 2000) || settings.defaultWarrantyConditions,
      qualitySealItems: Array.isArray(body.qualitySealItems) && body.qualitySealItems.length > 0
        ? body.qualitySealItems.map((item: unknown) => sanitizeText(item, 100)).filter(Boolean)
        : [
            'Trabajo supervisado',
            'Materiales seleccionados',
            'Acabado profesional',
            'Control de calidad',
          ],
      seoTitle: sanitizeText(body.seoTitle || `${title} en ${municipality}, Asturias | RADECO`, 160),
      seoDescription: sanitizeText(
        body.seoDescription || `${title} en ${municipality}, Asturias. Proyecto ejecutado por RADECO.`,
        260
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = await createOrUpdateProject(newProject);
    return NextResponse.json({ project: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear la obra.' }, { status: 500 });
  }
}


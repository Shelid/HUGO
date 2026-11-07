import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin, sanitizeText, slugify } from '@/lib/auth';
import {
  createOrUpdateProject,
  deleteProjectById,
  getProjectById,
  getProjectBySlug,
  syncFromNetlifyBlobs,
} from '@/lib/db';
import { Project } from '@/types';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await syncFromNetlifyBlobs();
  const { id } = await context.params;
  const isAdmin = await isAuthenticatedAdmin();

  const project = getProjectById(id) || getProjectBySlug(id, isAdmin);
  if (!project) {
    return NextResponse.json({ error: 'Obra no encontrada.' }, { status: 404 });
  }

  if (project.status !== 'published' && !isAdmin) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 });
  }

  return NextResponse.json({ project });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await syncFromNetlifyBlobs();
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = getProjectById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Obra no encontrada.' }, { status: 404 });
  }

  try {
    const body = await request.json();

    const title = body.title !== undefined ? sanitizeText(body.title, 180) : existing.title;
    const municipality =
      body.municipality !== undefined
        ? sanitizeText(body.municipality, 80)
        : existing.municipality;

    let slug = existing.slug;
    if (body.slug && sanitizeText(body.slug, 150) !== existing.slug) {
      const candidate = slugify(String(body.slug));
      const conflict = getProjectBySlug(candidate, true);
      if (conflict && conflict.id !== existing.id) {
        slug = `${candidate}-${Date.now().toString().slice(-4)}`;
      } else if (candidate) {
        slug = candidate;
      }
    }

    const updated: Project = {
      ...existing,
      slug,
      title: title || existing.title,
      subtitle:
        body.subtitle !== undefined ? sanitizeText(body.subtitle, 300) : existing.subtitle,
      municipality: municipality || existing.municipality,
      province:
        body.province !== undefined ? sanitizeText(body.province, 60) : existing.province,
      status:
        body.status === 'published' || body.status === 'draft'
          ? body.status
          : existing.status,
      featured: body.featured !== undefined ? Boolean(body.featured) : existing.featured,
      coverImage:
        body.coverImage !== undefined
          ? sanitizeText(body.coverImage, 500)
          : existing.coverImage,
      beforeImage:
        body.beforeImage !== undefined
          ? sanitizeText(body.beforeImage, 500) || undefined
          : existing.beforeImage,
      afterImage:
        body.afterImage !== undefined
          ? sanitizeText(body.afterImage, 500) || undefined
          : existing.afterImage,
      beforeLabel:
        body.beforeLabel !== undefined
          ? sanitizeText(body.beforeLabel, 140)
          : existing.beforeLabel,
      afterLabel:
        body.afterLabel !== undefined
          ? sanitizeText(body.afterLabel, 140)
          : existing.afterLabel,
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
        : existing.gallery,
      description:
        body.description !== undefined
          ? sanitizeText(body.description, 4000)
          : existing.description,
      technicalContext:
        body.technicalContext !== undefined
          ? sanitizeText(body.technicalContext, 2000)
          : existing.technicalContext,
      interventionDetails:
        body.interventionDetails !== undefined
          ? sanitizeText(body.interventionDetails, 2000)
          : existing.interventionDetails,
      services: Array.isArray(body.services)
        ? body.services.map((s: unknown) => sanitizeText(s, 80)).filter(Boolean)
        : existing.services,
      duration:
        body.duration !== undefined ? sanitizeText(body.duration, 80) : existing.duration,
      propertyType:
        body.propertyType !== undefined
          ? sanitizeText(body.propertyType, 100)
          : existing.propertyType,
      technicalSpecs: Array.isArray(body.technicalSpecs)
        ? body.technicalSpecs
            .map((spec: Record<string, unknown>) => ({
              label: sanitizeText(spec.label, 100),
              value: sanitizeText(spec.value, 220),
            }))
            .filter((s: { label: string; value: string }) => s.label && s.value)
        : existing.technicalSpecs,
      warrantyWorkmanship:
        body.warrantyWorkmanship !== undefined
          ? sanitizeText(body.warrantyWorkmanship, 100)
          : existing.warrantyWorkmanship,
      warrantyMaterials:
        body.warrantyMaterials !== undefined
          ? sanitizeText(body.warrantyMaterials, 100)
          : existing.warrantyMaterials,
      warrantyConditions:
        body.warrantyConditions !== undefined
          ? sanitizeText(body.warrantyConditions, 2000)
          : existing.warrantyConditions,
      qualitySealItems: Array.isArray(body.qualitySealItems)
        ? body.qualitySealItems.map((item: unknown) => sanitizeText(item, 100)).filter(Boolean)
        : existing.qualitySealItems,
      seoTitle:
        body.seoTitle !== undefined ? sanitizeText(body.seoTitle, 160) : existing.seoTitle,
      seoDescription:
        body.seoDescription !== undefined
          ? sanitizeText(body.seoDescription, 260)
          : existing.seoDescription,
      updatedAt: new Date().toISOString(),
    };

    const saved = await createOrUpdateProject(updated);
    return NextResponse.json({ project: saved });
  } catch {
    return NextResponse.json({ error: 'Error al actualizar la obra.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await syncFromNetlifyBlobs();
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteProjectById(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Obra no encontrada.' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}


import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Clock,
  Building2,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import {
  getProjectBySlug,
  getPublishedProjects,
  syncFromNetlifyBlobs,
} from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { ProjectGallery } from '@/components/ProjectGallery';
import { WarrantyCard } from '@/components/WarrantyCard';
import { QualityBadge } from '@/components/QualityBadge';
import { AsturiasLocationMap } from '@/components/AsturiasLocationMap';

export const dynamic = 'force-dynamic';

export async function generateMetadata(context: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  await syncFromNetlifyBlobs();
  const { slug } = await context.params;
  const isAdmin = await isAuthenticatedAdmin();
  const project = getProjectBySlug(slug, isAdmin);

  if (!project) {
    return {
      title: 'Obra no encontrada | RADECO Asturias',
    };
  }

  const title =
    project.seoTitle ||
    `${project.title} en ${project.municipality}, ${project.province} | RADECO`;
  const description =
    project.seoDescription ||
    `${project.subtitle} Obra realizada en ${project.municipality}, ${project.province} por RADECO.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'es_ES',
      images: [
        {
          url: project.coverImage,
          width: 1200,
          height: 630,
          alt: `${project.title} — ${project.municipality}, ${project.province}`,
        },
      ],
    },
  };
}

export default async function ObraDetailPage(context: {
  params: Promise<{ slug: string }>;
}) {
  await syncFromNetlifyBlobs();
  const { slug } = await context.params;
  const isAdmin = await isAuthenticatedAdmin();
  const project = getProjectBySlug(slug, isAdmin);

  if (!project) {
    notFound();
  }

  const otherProjects = getPublishedProjects()
    .filter((p) => p.id !== project.id)
    .slice(0, 2);

  // Schema.org JSON-LD for individual Obra (strictly Municipality + Province, never street address)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${project.title} — ${project.municipality}, ${project.province}`,
    headline: project.subtitle,
    description: project.description,
    image: project.coverImage,
    locationCreated: {
      '@type': 'Place',
      name: `${project.municipality}, ${project.province}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: project.municipality,
        addressRegion: project.province,
        addressCountry: 'ES',
      },
    },
    creator: {
      '@type': 'RoofingContractor',
      name: 'RADECO',
      areaServed: 'Principado de Asturias, España',
    },
    keywords: project.services.join(', '),
  };

  return (
    <article className="pt-24 bg-alabaster text-obsidian">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Draft Banner if Admin is previewing a Borrador */}
      {project.status === 'draft' && (
        <div className="bg-amber-900 text-white py-2.5 px-4 text-center font-mono text-xs uppercase tracking-[0.2em]">
          Vista previa de administrador — Estado actual: BORRADOR (No visible al público)
        </div>
      )}

      {/* 1. CINEMATIC PROJECT HEADER */}
      <header className="py-16 sm:py-24 border-b border-obsidian/12 bg-limestone/40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/obras"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-obsidian/65 hover:text-obsidian"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al catálogo de obras</span>
            </Link>

            {isAdmin && (
              <Link
                href={`/admin/obras/${project.id}`}
                className="px-4 py-2 bg-obsidian text-alabaster font-mono text-[10px] uppercase tracking-[0.2em]"
              >
                Editar esta obra en Admin
              </Link>
            )}
          </div>

          {/* Location Pill: ONLY City + Asturias */}
          <div className="space-y-5 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.26em]">
              <MapPin className="w-3.5 h-3.5 text-copper" />
              <span>
                {project.municipality.toUpperCase()} · {project.province.toUpperCase()}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-[64px] font-bold tracking-tight text-obsidian leading-[1.04] uppercase">
              {project.title}
            </h1>

            <p className="font-display text-lg sm:text-2xl text-obsidian/75 leading-relaxed italic">
              &ldquo;{project.subtitle}&rdquo;
            </p>
          </div>

          {/* Large Hero Photo */}
          <div className="relative aspect-[16/9] w-full bg-obsidian border border-obsidian/20 overflow-hidden shadow-2xl">
            <img
              src={project.coverImage}
              alt={`${project.title} en ${project.municipality}, ${project.province}`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-obsidian/90 via-obsidian/45 to-transparent p-6 sm:p-8 flex flex-wrap items-end justify-between gap-4 text-alabaster">
              <div className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-[0.18em]">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-copper" />
                  📍 {project.municipality}, {project.province}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="w-4 h-4 text-copper" />
                  Duración: {project.duration}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-copper" />
                  {project.propertyType}
                </span>
              </div>

              <span className="px-3 py-1 bg-alabaster text-obsidian font-mono text-[10px] uppercase tracking-[0.22em] font-semibold">
                Expediente Verificado RADECO
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. SERVICIOS REALIZADOS & DESCRIPCIÓN TÉCNICA */}
      <section className="py-20 sm:py-28 border-b border-obsidian/12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Servicios Realizados & Ficha */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#F6F5F1] border border-obsidian/15 p-7 space-y-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-copper block">
                Alcance de la Actuación
              </span>
              <h2 className="font-display text-xl font-semibold text-obsidian uppercase tracking-wide">
                Servicios realizados
              </h2>
              <ul className="space-y-3 pt-2 border-t border-obsidian/10">
                {project.services.map((srv) => (
                  <li
                    key={srv}
                    className="flex items-center gap-3 text-sm font-medium text-obsidian"
                  >
                    <span className="w-5 h-5 bg-obsidian text-alabaster flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-copper" />
                    </span>
                    <span>{srv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {project.technicalSpecs && project.technicalSpecs.length > 0 && (
              <div className="bg-limestone/50 border border-obsidian/15 p-7 space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-copper block">
                  Especificaciones Constructivas
                </span>
                <h3 className="font-display text-lg font-semibold text-obsidian uppercase">
                  Detalles técnicos
                </h3>
                <dl className="divide-y divide-obsidian/10">
                  {project.technicalSpecs.map((spec, idx) => (
                    <div key={idx} className="py-3 space-y-1">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-obsidian/55">
                        {spec.label}
                      </dt>
                      <dd className="text-xs sm:text-sm font-medium text-obsidian">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Right Column: Memoria Descriptiva */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block">
                Memoria de Ejecución
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-semibold text-obsidian tracking-tight">
                Descripción técnica del proyecto
              </h2>
              <p className="text-base text-obsidian/80 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {(project.technicalContext || project.interventionDetails) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {project.technicalContext && (
                  <div className="p-6 bg-limestone/45 border border-obsidian/12 space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper block">
                      Diagnóstico Previo
                    </span>
                    <h3 className="font-display text-lg font-semibold text-obsidian">
                      Estado inicial
                    </h3>
                    <p className="text-xs sm:text-sm text-obsidian/75 leading-relaxed">
                      {project.technicalContext}
                    </p>
                  </div>
                )}

                {project.interventionDetails && (
                  <div className="p-6 bg-limestone/45 border border-obsidian/12 space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper block">
                      Resolución RADECO
                    </span>
                    <h3 className="font-display text-lg font-semibold text-obsidian">
                      Ejecución y remates
                    </h3>
                    <p className="text-xs sm:text-sm text-obsidian/75 leading-relaxed">
                      {project.interventionDetails}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. ANTES / DESPUÉS INTERACTIVE SLIDER */}
      {project.beforeImage && project.afterImage && (
        <section className="py-20 sm:py-28 border-b border-obsidian/12 bg-limestone/35">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block">
                Comparativa Visual Interactiva
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-obsidian uppercase tracking-tight">
                Antes / Después
              </h2>
            </div>

            <BeforeAfterSlider
              beforeImage={project.beforeImage}
              afterImage={project.afterImage}
              beforeLabel={project.beforeLabel}
              afterLabel={project.afterLabel}
              title={project.title}
            />
          </div>
        </section>
      )}

      {/* 4. GALERÍA EXCLUSIVA DE ESTA OBRA */}
      <section className="py-20 sm:py-28 border-b border-obsidian/12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-obsidian/12">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block mb-2">
                Documentación Fotográfica Exclusiva
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-obsidian uppercase tracking-tight">
                Galería de la obra
              </h2>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-obsidian/55">
              Haga clic en cualquier imagen para abrir en pantalla completa y hacer zoom
            </span>
          </div>

          <ProjectGallery images={project.gallery} projectTitle={project.title} />
        </div>
      </section>

      {/* 5. GARANTÍA Y SELLO DE CALIDAD RADECO */}
      <section className="py-20 sm:py-28 border-b border-obsidian/12 bg-limestone/40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-12">
          <WarrantyCard
            workmanship={project.warrantyWorkmanship}
            materials={project.warrantyMaterials}
            conditions={project.warrantyConditions}
          />

          <QualityBadge
            items={project.qualitySealItems}
            municipality={`${project.municipality}, ${project.province}`}
          />
        </div>
      </section>

      {/* 6. LOCALIZACIÓN MUNICIPAL (SIN DIRECCIÓN EXACTA) */}
      <section className="py-20 border-b border-obsidian/12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <AsturiasLocationMap
            municipality={project.municipality}
            province={project.province}
          />
        </div>
      </section>

      {/* 7. CTA FINAL DE LA OBRA */}
      <section className="py-20 sm:py-28 bg-obsidian text-alabaster text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-6">
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block">
            ¿Un proyecto similar en {project.municipality} o en otro punto de Asturias?
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-semibold text-white tracking-tight">
            Solicita tu presupuesto
          </h2>
          <p className="text-sm sm:text-base text-alabaster/70 leading-relaxed max-w-xl mx-auto">
            Estudiaremos las características de tu cubierta o terraza para ofrecerte una
            solución técnica duradera y garantizada.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/presupuesto"
              className="inline-flex items-center gap-3 px-9 py-4 bg-alabaster text-obsidian font-mono text-xs uppercase tracking-[0.22em] font-semibold hover:bg-white transition-colors"
            >
              <span>Contactar / Solicitar presupuesto</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/obras"
              className="inline-flex items-center gap-2 px-7 py-4 border border-white/20 text-alabaster font-mono text-xs uppercase tracking-[0.18em] hover:bg-white/5 transition-colors"
            >
              <span>Ver más obras</span>
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}


import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getPublishedProjects, loadDb } from '@/lib/db';
import { ProjectsCatalogClient } from '@/components/ProjectsCatalogClient';
import { QualityBadge } from '@/components/QualityBadge';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Obras Realizadas en Asturias | Cubiertas, Tejados y Terrazas — RADECO',
  description:
    'Catálogo de obras independientes de rehabilitación de cubiertas, reparación de tejados e impermeabilización de terrazas en Oviedo, Gijón, Mieres, Lena y toda Asturias.',
};

export default async function ObrasPage() {
  await loadDb();
  const projects = getPublishedProjects();

  return (
    <div className="pt-24 bg-alabaster text-obsidian">
      {/* Editorial Hero */}
      <section className="py-16 sm:py-24 border-b border-obsidian/12 bg-limestone/45">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl space-y-5">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block">
              Expedientes Técnicos Independientes · Asturias
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-obsidian leading-[1.06]">
              Obras ejecutadas por RADECO
            </h1>
            <p className="text-base sm:text-lg text-obsidian/75 leading-relaxed">
              Cada proyecto cuenta con su propia memoria constructiva, galería fotográfica
              exclusiva, comparativa antes/después y condiciones específicas de garantía.
            </p>
          </div>

          <Link
            href="/presupuesto"
            className="self-start lg:self-auto inline-flex items-center gap-3 px-7 py-4 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-colors"
          >
            <span>Solicitar presupuesto</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Catalog with Interactive Filters */}
      <section className="py-20 sm:py-28 border-b border-obsidian/12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <ProjectsCatalogClient projects={projects} />
        </div>
      </section>

      {/* Quality Seal */}
      <section className="py-20 max-w-[1400px] mx-auto px-4 sm:px-8">
        <QualityBadge />
      </section>
    </div>
  );
}


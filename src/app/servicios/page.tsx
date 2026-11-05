import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { SERVICES_DATA } from '@/lib/services-data';
import { ServiceCard } from '@/components/ServiceCard';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { QualityBadge } from '@/components/QualityBadge';

export const metadata: Metadata = {
  title: 'Servicios de Cubiertas, Tejados, Terrazas e Impermeabilización en Asturias',
  description:
    'Servicios especializados en cubiertas y tejados, reparación de tejados, rehabilitación de cubiertas, impermeabilización y rehabilitación de terrazas en Asturias.',
};

export default function ServiciosPage() {
  return (
    <div className="pt-24 bg-alabaster text-obsidian">
      {/* Hero */}
      <section className="py-16 sm:py-24 border-b border-obsidian/12 bg-limestone/45">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="max-w-3xl space-y-5">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block">
              Catálogo Técnico de Especialidades · Principado de Asturias
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-obsidian leading-[1.06]">
              Ingeniería y ejecución en cubiertas, terrazas e impermeabilización
            </h1>
            <p className="text-base sm:text-lg text-obsidian/75 leading-relaxed">
              En RADECO abordamos cada intervención con rigor técnico, materiales
              certificados y un profundo conocimiento de las exigencias climáticas de
              Asturias.
            </p>
          </div>
        </div>
      </section>

      {/* All 6 Services Grid */}
      <section className="py-20 sm:py-28 border-b border-obsidian/12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_DATA.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Sections for Reparación & Mantenimiento */}
      <section className="py-20 sm:py-28 border-b border-obsidian/12 bg-[#F6F5F1]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-24">
          {SERVICES_DATA.filter(
            (s) => s.slug === 'reparacion' || s.slug === 'mantenimiento'
          ).map((srv) => (
            <div
              key={srv.slug}
              id={srv.slug}
              className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 border-t border-obsidian/12"
            >
              <div className="lg:col-span-6 space-y-5">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-copper block">
                  {srv.index} · Especialidad RADECO
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-obsidian">
                  {srv.title}: {srv.shortDescription}
                </h2>
                <p className="text-sm sm:text-base text-obsidian/75 leading-relaxed">
                  {srv.overview}
                </p>
                <p className="text-sm sm:text-base text-obsidian/75 leading-relaxed">
                  {srv.technicalApproach}
                </p>
                <ul className="space-y-2.5 pt-2">
                  {srv.keyBenefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-obsidian/85">
                      <Check className="w-4 h-4 text-copper shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Link
                    href="/presupuesto"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.18em] hover:bg-charcoal transition-colors"
                  >
                    <span>Solicitar valoración técnica</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="aspect-[16/10] bg-obsidian border border-obsidian/15 overflow-hidden">
                  <img
                    src={srv.image}
                    alt={`${srv.title} en Asturias`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ProcessTimeline />

      <section className="py-20 max-w-[1400px] mx-auto px-4 sm:px-8">
        <QualityBadge />
      </section>
    </div>
  );
}


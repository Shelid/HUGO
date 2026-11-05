import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Layers,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { ServiceDetail } from '@/types';
import { getPublishedProjects } from '@/lib/db';
import { ProjectCard } from './ProjectCard';
import { QualityBadge } from './QualityBadge';
import { ContactForm } from './ContactForm';

interface ServiceDetailPageViewProps {
  service: ServiceDetail;
}

export function ServiceDetailPageView({ service }: ServiceDetailPageViewProps) {
  const allProjects = getPublishedProjects();
  const relatedProjects = allProjects.slice(0, 2);

  return (
    <div className="pt-24 bg-alabaster text-obsidian">
      {/* Architectural Hero */}
      <section className="border-b border-obsidian/12 bg-limestone/45 py-16 sm:py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-obsidian/65 hover:text-obsidian mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Servicios</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-obsidian text-alabaster font-mono text-[10px] uppercase tracking-[0.22em]">
                <span className="text-copper font-bold">{service.index}</span>
                <span>Especialidad Técnica · Asturias</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-obsidian leading-[1.06]">
                {service.title}
              </h1>

              <p className="text-base sm:text-lg text-obsidian/75 leading-relaxed">
                {service.heroSubtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/presupuesto"
                  className="inline-flex items-center gap-3 px-7 py-4 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-colors"
                >
                  <span>Solicitar presupuesto</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/obras"
                  className="inline-flex items-center gap-2 px-6 py-4 border border-obsidian/20 text-obsidian font-mono text-xs uppercase tracking-[0.18em] hover:bg-obsidian/5 transition-colors"
                >
                  <span>Ver obras ejecutadas</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[16/11] bg-obsidian border border-obsidian/20 overflow-hidden shadow-2xl">
                <img
                  src={service.image}
                  alt={`${service.title} en Asturias — RADECO`}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-obsidian/85 backdrop-blur-md border border-white/15 p-4 flex items-center justify-between text-alabaster">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                    RADECO · Ingeniería de Cubiertas
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper">
                    Principado de Asturias
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Overview & Approach */}
      <section className="py-20 sm:py-28 border-b border-obsidian/12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6 space-y-4">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-copper block">
                Enfoque Constructivo
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-semibold text-obsidian tracking-tight">
                Soluciones diseñadas para la durabilidad
              </h2>
              <p className="text-sm sm:text-base text-obsidian/75 leading-relaxed">
                {service.overview}
              </p>
              <p className="text-sm sm:text-base text-obsidian/75 leading-relaxed">
                {service.technicalApproach}
              </p>
            </div>

            <div className="lg:col-span-6 bg-[#F6F5F1] border border-obsidian/15 p-8 sm:p-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-obsidian/10">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-obsidian font-semibold">
                  Ventajas Técnicas del Sistema
                </span>
                <Layers className="w-4 h-4 text-copper" />
              </div>

              <ul className="space-y-4">
                {service.keyBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3.5 text-sm text-obsidian/85">
                    <span className="w-5 h-5 rounded-full bg-obsidian text-alabaster flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-copper" />
                    </span>
                    <span className="leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4 Specifications Grid */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-copper block mb-3">
              Especificaciones y Capas Funcionales
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-obsidian mb-8">
              Parámetros de ejecución RADECO
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.specifications.map((spec, idx) => (
                <div
                  key={spec.title}
                  className="bg-limestone/45 border border-obsidian/12 p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-xs text-copper font-semibold block mb-3">
                      0{idx + 1}
                    </span>
                    <h4 className="font-display text-lg font-semibold text-obsidian mb-2">
                      {spec.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-obsidian/70 leading-relaxed">
                      {spec.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applications */}
          <div className="bg-obsidian text-alabaster p-8 sm:p-12 border border-obsidian">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-copper block mb-2">
                  Ámbitos de Actuación en Asturias
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                  ¿Dónde aplicamos este servicio?
                </h3>
              </div>
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.applications.map((app) => (
                  <div
                    key={app}
                    className="p-4 bg-white/[0.04] border border-white/10 flex items-center gap-3 text-xs sm:text-sm text-alabaster/90"
                  >
                    <MapPin className="w-4 h-4 text-copper shrink-0" />
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects in Asturias */}
      <section className="py-20 sm:py-24 border-b border-obsidian/12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-copper block mb-2">
                Casos Reales en Asturias
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-semibold text-obsidian">
                Obras relacionadas ejecutadas por RADECO
              </h2>
            </div>
            <Link
              href="/obras"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-obsidian hover:text-copper"
            >
              <span>Ver todas las obras</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {relatedProjects.map((proj, idx) => (
              <ProjectCard key={proj.id} project={proj} index={idx} />
            ))}
          </div>

          <QualityBadge />
        </div>
      </section>

      {/* Quote Request Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block mb-2">
              Estudio Personalizado
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-obsidian mb-3">
              Solicita presupuesto para {service.title.toLowerCase()}
            </h2>
            <p className="text-sm text-obsidian/70">
              Cuéntanos tu caso en Asturias y un especialista técnico evaluará la mejor
              solución constructiva.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}


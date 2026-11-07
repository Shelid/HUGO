import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Eye,
  Hammer,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { HeroConstruction } from '@/components/HeroConstruction';
import { ServiceCard } from '@/components/ServiceCard';
import { WaterproofingCrossSection } from '@/components/WaterproofingCrossSection';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { ProjectCard } from '@/components/ProjectCard';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { QualityBadge } from '@/components/QualityBadge';
import { ContactForm } from '@/components/ContactForm';
import { SERVICES_DATA } from '@/lib/services-data';
import {
  getCompanySettings,
  getPublishedProjects,
  loadDb,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

const WHY_RADECO_PILLARS = [
  {
    code: '01',
    title: 'Experiencia',
    description:
      'Conocimiento profundo de las patologías constructivas propias del clima húmedo y lluvioso del Principado de Asturias.',
    icon: Compass,
  },
  {
    code: '02',
    title: 'Calidad',
    description:
      'Selección rigurosa de sistemas impermeabilizantes, aislamientos térmicos y coberturas de fabricantes acreditados.',
    icon: ShieldCheck,
  },
  {
    code: '03',
    title: 'Transparencia',
    description:
      'Diagnósticos honestos y presupuestos desglosados por partidas técnicas, sin costes ocultos ni soluciones improvisadas.',
    icon: Eye,
  },
  {
    code: '04',
    title: 'Acabados',
    description:
      'Atención obsesiva a los puntos singulares: cumbreras, limahoyas, encuentros de chimenea, canalones y rematería.',
    icon: Sparkles,
  },
  {
    code: '05',
    title: 'Garantía',
    description:
      'Respaldo documentado tanto en la ejecución de mano de obra como en los materiales aplicados según cada proyecto.',
    icon: Layers,
  },
  {
    code: '06',
    title: 'Atención personalizada',
    description:
      'Trato directo y supervisión técnica continua desde la primera visita de inspección hasta la entrega final de la obra.',
    icon: UserCheck,
  },
];

export default async function HomePage() {
  await loadDb();
  const projects = getPublishedProjects();
  const settings = getCompanySettings();
  const featuredProjects = projects.slice(0, 4);
  const showcaseProject = projects[0];

  return (
    <div className="bg-alabaster text-obsidian">
      {/* 1. CINEMATIC SCROLL-DRIVEN HERO CONSTRUCTION */}
      <HeroConstruction />

      {/* 2. BRAND SIGNATURE & ASTURIAS TECHNICAL BAR */}
      <section className="border-b border-obsidian/12 bg-[#F6F5F1] py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <img
              src="/brand/logo-black.png"
              alt="RADECO — Logo negro sin fondo"
              className="h-20 sm:h-24 w-auto object-contain select-none shrink-0"
            />
            <div className="border-l border-obsidian/15 pl-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-copper block mb-1">
                Ingeniería y Rehabilitación de Cubiertas
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-obsidian tracking-tight">
                RADECO · Principado de Asturias
              </h2>
              <p className="text-xs sm:text-sm text-obsidian/65 mt-1 max-w-xl">
                Especialistas en cubiertas, tejados, terrazas y soluciones avanzadas
                contra filtraciones y humedades.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-end">
            {['Oviedo', 'Gijón', 'Mieres', 'Lena', 'Avilés', 'Siero', 'Llanes'].map(
              (concejo) => (
                <span
                  key={concejo}
                  className="px-3 py-1.5 bg-limestone/70 border border-obsidian/10 font-mono text-[10px] uppercase tracking-[0.18em] text-obsidian/75"
                >
                  📍 {concejo}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN "QUÉ HACEMOS" (SERVICIOS PRINCIPALES) */}
      <section
        id="servicios"
        className="py-24 sm:py-32 bg-alabaster bg-arch-grid-light bg-grid-64"
        aria-labelledby="que-hacemos-heading"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-16 border-b border-obsidian/12">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block mb-3">
                01 · Qué Hacemos
              </span>
              <h2
                id="que-hacemos-heading"
                className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-obsidian"
              >
                Soluciones técnicas de cubierta e impermeabilización
              </h2>
            </div>
            <div className="flex flex-col sm:items-end gap-3">
              <p className="text-sm text-obsidian/70 max-w-md leading-relaxed md:text-right">
                Intervenimos con precisión constructiva en obra residencial y comunitaria
                en toda Asturias.
              </p>
              <Link
                href="/servicios"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-obsidian font-semibold hover:text-copper transition-colors"
              >
                <span>Ver todas las especialidades</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_DATA.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 3B. SIMULACIÓN TÉCNICA EN CORTE TRANSVERSAL (LLUVIA, DRENAJE W1 Y RETENCIÓN TÉRMICA) */}
      <WaterproofingCrossSection />

      {/* 4. SECCIÓN DE PROCESO ("NUESTRO PROCESO") */}
      <ProcessTimeline />

      {/* 5. SECCIÓN DE OBRAS — SISTEMA DE PROYECTOS INDEPENDIENTES */}
      <section
        id="obras"
        className="py-24 sm:py-32 bg-alabaster border-b border-obsidian/12"
        aria-labelledby="obras-heading"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-16 border-b border-obsidian/12">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block mb-3">
                02 · Expedientes de Obra en Asturias
              </span>
              <h2
                id="obras-heading"
                className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-obsidian"
              >
                Obras seleccionadas
              </h2>
            </div>
            <div className="space-y-3 md:text-right">
              <p className="text-sm text-obsidian/70 max-w-md leading-relaxed">
                Cada intervención cuenta con su propia ficha técnica, galería exclusiva,
                comparativa antes/después y condiciones de garantía.
              </p>
              <Link
                href="/obras"
                className="inline-flex items-center gap-2 px-6 py-3 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.18em] hover:bg-charcoal transition-colors"
              >
                <span>Explorar catálogo de obras</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Individual Project Cards Grid */}
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {/* Featured Interactive Before / After Transformation Showcase */}
          {showcaseProject &&
            showcaseProject.beforeImage &&
            showcaseProject.afterImage && (
              <div className="mt-24 pt-16 border-t border-obsidian/12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-4 space-y-5">
                    <span className="inline-block px-3 py-1 bg-obsidian text-alabaster font-mono text-[10px] uppercase tracking-[0.22em]">
                      Comparativa Real · {showcaseProject.municipality},{' '}
                      {showcaseProject.province}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-obsidian tracking-tight">
                      Antes y Después: precisión visible en cada detalle
                    </h3>
                    <p className="text-sm text-obsidian/70 leading-relaxed">
                      Comprueba la transformación constructiva en nuestro proyecto de{' '}
                      <strong className="text-obsidian">
                        {showcaseProject.title.toLowerCase()}
                      </strong>{' '}
                      en {showcaseProject.municipality}. Sustitución completa de capas de
                      estanqueidad, aislamiento y acabado.
                    </p>
                    <div className="pt-2">
                      <Link
                        href={`/obras/${showcaseProject.slug}`}
                        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-copper font-semibold hover:underline"
                      >
                        <span>Abrir expediente completo de esta obra</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-8">
                    <BeforeAfterSlider
                      beforeImage={showcaseProject.beforeImage}
                      afterImage={showcaseProject.afterImage}
                      beforeLabel={showcaseProject.beforeLabel}
                      afterLabel={showcaseProject.afterLabel}
                      title={`${showcaseProject.title} (${showcaseProject.municipality})`}
                    />
                  </div>
                </div>
              </div>
            )}
        </div>
      </section>

      {/* 6. SECCIÓN "POR QUÉ RADECO" (DIFERENCIALES + SELLO DE CALIDAD) */}
      <section
        id="por-que-radeco"
        className="py-24 sm:py-32 bg-limestone/45 border-b border-obsidian/12"
        aria-labelledby="por-que-heading"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-20">
          {/* Editorial Intro */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end pb-14 border-b border-obsidian/12">
            <div className="lg:col-span-7">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block mb-3">
                03 · Por Qué RADECO
              </span>
              <h2
                id="por-que-heading"
                className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-obsidian leading-[1.05]"
              >
                Calidad que permanece.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base sm:text-lg text-obsidian/80 leading-relaxed font-medium">
                &ldquo;En RADECO trabajamos para que cada cubierta, terraza e
                impermeabilización tenga una solución duradera, funcional y
                cuidadosamente ejecutada.&rdquo;
              </p>
            </div>
          </div>

          {/* 6 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_RADECO_PILLARS.map((pillar) => {
              const IconComponent = pillar.icon;
              return (
                <div
                  key={pillar.code}
                  className="bg-[#F6F5F1] border border-obsidian/12 p-8 flex flex-col justify-between hover:border-obsidian/35 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-xs font-semibold tracking-[0.22em] text-copper">
                        {pillar.code}
                      </span>
                      <div className="w-10 h-10 bg-obsidian text-alabaster flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-copper" />
                      </div>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-obsidian mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-obsidian/70 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-obsidian/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-obsidian/45">
                    <span>Estándar Constructivo</span>
                    <span>RADECO Asturias</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sello de Calidad RADECO Showcase */}
          <QualityBadge />
        </div>
      </section>

      {/* 7. SECCIÓN DE PRESUPUESTO Y CONTACTO */}
      <section
        id="presupuesto"
        className="py-24 sm:py-32 bg-alabaster"
        aria-labelledby="cta-presupuesto-heading"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Direct Callout & Info */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block mb-3">
                  04 · Estudio Técnico y Presupuesto
                </span>
                <h2
                  id="cta-presupuesto-heading"
                  className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-obsidian leading-[1.1] mb-4"
                >
                  ¿Necesitas reparar o impermeabilizar tu cubierta?
                </h2>
                <p className="text-base text-obsidian/75 leading-relaxed">
                  Cuéntanos qué necesitas y estudiaremos la mejor solución para tu
                  proyecto.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-obsidian/12">
                {[
                  'Inspección técnica en cualquier concejo de Asturias',
                  'Propuesta constructiva adaptada a la patología real',
                  'Materiales seleccionados y ejecución supervisada',
                  'Garantía de mano de obra y materiales configurable por proyecto',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3 text-sm text-obsidian/80">
                    <CheckCircle2 className="w-4 h-4 text-copper shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-limestone/65 border border-obsidian/12 space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-copper block">
                  Atención Directa RADECO
                </span>
                <p className="font-display text-lg font-semibold text-obsidian">
                  📍 {settings.region}
                </p>
                <div className="text-xs font-mono text-obsidian/75 space-y-1.5">
                  <p>Teléfono: {settings.phone}</p>
                  <p>Email: {settings.email}</p>
                  <p>Horario: {settings.businessHours}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Full Technical Quote Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


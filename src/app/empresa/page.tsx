import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowUpRight,
  Compass,
  Eye,
  Layers,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { getCompanySettings } from '@/lib/db';
import { QualityBadge } from '@/components/QualityBadge';
import { WarrantyCard } from '@/components/WarrantyCard';
import { ProcessTimeline } from '@/components/ProcessTimeline';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Empresa y Garantía | RADECO — Cubiertas, Terrazas e Impermeabilización',
  description:
    'Conozca RADECO: especialistas en cubiertas, tejados, terrazas e impermeabilización en el Principado de Asturias. Precisión técnica, Sello de Calidad y garantía.',
};

export default function EmpresaPage() {
  const settings = getCompanySettings();

  return (
    <div className="pt-24 bg-alabaster text-obsidian">
      {/* Hero */}
      <section className="py-16 sm:py-24 border-b border-obsidian/12 bg-limestone/45">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block">
              Identidad Institucional · Principado de Asturias
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-obsidian leading-[1.06]">
              Calidad que permanece.
            </h1>
            <p className="text-lg sm:text-xl text-obsidian/80 leading-relaxed font-medium">
              &ldquo;En RADECO trabajamos para que cada cubierta, terraza e
              impermeabilización tenga una solución duradera, funcional y
              cuidadosamente ejecutada.&rdquo;
            </p>
            <p className="text-sm sm:text-base text-obsidian/70 leading-relaxed">
              Nacimos con una premisa clara: elevar el estándar técnico y estético en la
              rehabilitación de cubiertas, reparación de tejados e impermeabilización de
              terrazas en Asturias, combinando el oficio constructivo con sistemas de
              ingeniería contemporánea.
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-[#F6F5F1] border border-obsidian/15 p-10 sm:p-12 text-center shadow-xl max-w-md w-full space-y-5">
              <img
                src="/brand/logo-black.png"
                alt="RADECO Logo Oficial"
                className="h-36 w-auto mx-auto object-contain"
              />
              <div className="pt-4 border-t border-obsidian/10 space-y-1">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-obsidian font-semibold">
                  Cubiertas · Terrazas · Impermeabilización
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-copper">
                  Principado de Asturias · España
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Pillars */}
      <section className="py-20 sm:py-28 border-b border-obsidian/12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-14">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block mb-2">
              Nuestros Valores Constructivos
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-obsidian tracking-tight">
              Por qué confiar tu cubierta a RADECO
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Experiencia',
                desc: 'Dominio técnico en la resolución de cubiertas inclinadas, pizarras, tejas cerámicas y terrazas planas expuestas al clima asturiano.',
                icon: Compass,
              },
              {
                title: 'Calidad',
                desc: 'Empleamos exclusivamente láminas, membranas de poliuretano, aislamientos XPS y remates metálicos de eficacia probada.',
                icon: ShieldCheck,
              },
              {
                title: 'Transparencia',
                desc: 'Explicamos con claridad el diagnóstico técnico y cada partida del presupuesto antes de iniciar cualquier intervención.',
                icon: Eye,
              },
              {
                title: 'Acabados',
                desc: 'Cuidamos tanto las capas invisibles de estanqueidad como el remate estético final de cumbreras, aleros y pavimentos.',
                icon: Sparkles,
              },
              {
                title: 'Garantía',
                desc: 'Entregamos condiciones de garantía específicas para cada obra tanto en ejecución como según fabricante de materiales.',
                icon: Layers,
              },
              {
                title: 'Atención personalizada',
                desc: 'Comunicación fluida y supervisión directa en cada fase de la obra en cualquier municipio de Asturias.',
                icon: UserCheck,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-[#F6F5F1] border border-obsidian/15 p-8 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-copper font-semibold">
                      0{i + 1}
                    </span>
                    <Icon className="w-5 h-5 text-obsidian" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-obsidian">
                    {item.title}
                  </h3>
                  <p className="text-sm text-obsidian/70 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Garantía & Sello de Calidad Section (#garantia) */}
      <section
        id="garantia"
        className="scroll-mt-24 py-20 sm:py-28 border-b border-obsidian/12 bg-limestone/40"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block">
              Compromiso y Respaldo Técnico
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-obsidian tracking-tight">
              Garantía y Sello de Calidad RADECO
            </h2>
            <p className="text-sm sm:text-base text-obsidian/75 leading-relaxed">
              Cada proyecto cuenta con parámetros de garantía configurados según la
              tipología de intervención y las especificaciones técnicas de los fabricantes
              empleados.
            </p>
          </div>

          <WarrantyCard
            workmanship={settings.defaultWarrantyWorkmanship}
            materials={settings.defaultWarrantyMaterials}
            conditions={settings.defaultWarrantyConditions}
          />

          <QualityBadge />
        </div>
      </section>

      <ProcessTimeline />

      {/* Bottom CTA */}
      <section className="py-20 text-center max-w-3xl mx-auto px-4 sm:px-8 space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-obsidian">
          ¿Hablamos sobre tu proyecto en Asturias?
        </h2>
        <p className="text-sm sm:text-base text-obsidian/70">
          Solicita una inspección y presupuesto técnico sin compromiso.
        </p>
        <Link
          href="/presupuesto"
          className="inline-flex items-center gap-3 px-8 py-4 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.2em]"
        >
          <span>Solicitar presupuesto</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}


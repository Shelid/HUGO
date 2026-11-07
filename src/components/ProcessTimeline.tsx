'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Inspección',
    subtitle: 'Evaluación presencial en obra',
    description:
      'Visitamos el inmueble en cualquier punto de Asturias para analizar visual y técnicamente el estado de la cubierta, terraza, pendientes, encuentros y evacuaciones.',
  },
  {
    number: '02',
    title: 'Diagnóstico',
    subtitle: 'Identificación de patologías reales',
    description:
      'Determinamos el origen exacto de las filtraciones, humedades o deterioros estructurales para evitar soluciones superficiales o parches temporales.',
  },
  {
    number: '03',
    title: 'Propuesta',
    subtitle: 'Presupuesto técnico detallado',
    description:
      'Entregamos una propuesta clara y desglosada con el sistema constructivo recomendado, materiales seleccionados, plazos previstos y condiciones de garantía.',
  },
  {
    number: '04',
    title: 'Ejecución',
    subtitle: 'Intervención precisa y ordenada',
    description:
      'Nuestro equipo ejecuta cada capa —estructura, aislamiento, impermeabilización y acabado— siguiendo protocolos rigurosos de seguridad, limpieza y precisión.',
  },
  {
    number: '05',
    title: 'Control de calidad',
    subtitle: 'Verificación de estanqueidad y remates',
    description:
      'Antes de dar por concluida la intervención, revisamos exhaustivamente puntos singulares, solapes, fijaciones mecánicas, limahoyas y evacuación pluvial.',
  },
  {
    number: '06',
    title: 'Entrega',
    subtitle: 'Cierre de obra y garantía documentada',
    description:
      'Realizamos la entrega final junto al cliente con el Sello de Calidad RADECO y las condiciones específicas de garantía de mano de obra y materiales.',
  },
];

export function ProcessTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [fillRatio, setFillRatio] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      ticking = false;
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      if (rect.bottom < -100 || rect.top > windowH + 100) return;

      const start = windowH * 0.75;
      const total = rect.height - windowH * 0.25;
      const current = start - rect.top;
      const rawRatio = Math.max(0, Math.min(1, current / Math.max(1, total)));
      const quantized = Math.round(rawRatio * 100) / 100;
      setFillRatio((prev) => (prev === quantized ? prev : quantized));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const activeCount = Math.max(1, Math.ceil(fillRatio * PROCESS_STEPS.length));

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-obsidian text-alabaster overflow-hidden border-y border-white/10"
      aria-labelledby="proceso-heading"
    >
      <div className="absolute inset-0 bg-arch-grid-dark bg-grid-64 opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-16 border-b border-white/10">
          <div>
            <span className="inline-block font-mono text-xs uppercase tracking-[0.25em] text-copper mb-3">
              Metodología de Ingeniería
            </span>
            <h2
              id="proceso-heading"
              className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-white"
            >
              Nuestro proceso
            </h2>
          </div>
          <p className="text-sm sm:text-base text-alabaster/65 max-w-md leading-relaxed">
            Cada obra se desarrolla bajo una secuencia técnica trazable de seis fases,
            garantizando rigor desde la primera inspección hasta la entrega final.
          </p>
        </div>

        {/* Progressive Timeline Container */}
        <div className="relative mt-16">
          {/* Vertical Progress Line (Desktop Center / Mobile Left) */}
          <div className="absolute left-5 lg:left-1/2 top-0 bottom-0 w-px bg-white/15 -translate-x-1/2" />
          <div
            className="absolute left-5 lg:left-1/2 top-0 w-0.5 bg-copper -translate-x-1/2 transition-all duration-150"
            style={{ height: `${Math.round(fillRatio * 100)}%` }}
          />

          <div className="space-y-12 lg:space-y-16">
            {PROCESS_STEPS.map((step, index) => {
              const isEven = index % 2 === 0;
              const isReached = index < activeCount;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative grid grid-cols-1 lg:grid-cols-12 items-center gap-6"
                >
                  {/* Left Side (Desktop Even Steps) */}
                  <div
                    className={`pl-14 lg:pl-0 lg:col-span-5 ${
                      isEven ? 'lg:text-right lg:pr-12' : 'lg:order-3 lg:pl-12'
                    }`}
                  >
                    <div
                      className={`p-6 sm:p-8 border transition-all duration-500 ${
                        isReached
                          ? 'bg-charcoal/95 border-copper/50 shadow-[0_12px_40px_rgba(0,0,0,0.4)]'
                          : 'bg-white/[0.02] border-white/10'
                      }`}
                    >
                      <div
                        className={`flex items-center gap-3 mb-3 ${
                          isEven ? 'lg:justify-end' : 'justify-start'
                        }`}
                      >
                        <span className="font-mono text-xs font-semibold tracking-[0.22em] text-copper">
                          {step.number} — {step.title.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-white mb-1.5">
                        {step.number} — {step.title}
                      </h3>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-alabaster/50 mb-3">
                        {step.subtitle}
                      </p>
                      <p className="text-sm text-alabaster/70 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-5 lg:static lg:col-span-2 flex justify-center -translate-x-1/2 lg:translate-x-0 lg:order-2">
                    <div
                      className={`w-10 h-10 flex items-center justify-center font-mono text-xs font-bold border transition-all duration-500 ${
                        isReached
                          ? 'bg-copper border-copper text-white scale-110 shadow-[0_0_24px_rgba(184,93,59,0.5)]'
                          : 'bg-obsidian border-white/25 text-white/50'
                      }`}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Empty Opposite Column on Desktop */}
                  <div
                    className={`hidden lg:block lg:col-span-5 ${
                      isEven ? 'lg:order-3' : 'lg:order-1'
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


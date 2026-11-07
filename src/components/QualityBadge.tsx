import React from 'react';
import { Check } from 'lucide-react';

interface QualityBadgeProps {
  items?: string[];
  municipality?: string;
}

const DEFAULT_SEAL_ITEMS = [
  'Trabajo supervisado',
  'Materiales seleccionados',
  'Acabado profesional',
  'Control de calidad',
];

export function QualityBadge({
  items = DEFAULT_SEAL_ITEMS,
  municipality = 'Asturias',
}: QualityBadgeProps) {
  const displayItems = items.length > 0 ? items : DEFAULT_SEAL_ITEMS;

  return (
    <div className="relative bg-obsidian text-alabaster border border-bronze/40 p-8 sm:p-10 overflow-hidden shadow-[0_24px_60px_rgba(11,12,14,0.22)]">
      {/* Subtle Architectural Blueprint Grid */}
      <div className="absolute inset-0 bg-arch-grid-dark bg-grid-40 opacity-30 pointer-events-none" />

      {/* Precision Corner Framing */}
      <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t border-l border-bronze/60" />
      <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t border-r border-bronze/60" />
      <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b border-l border-bronze/60" />
      <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b border-r border-bronze/60" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
        {/* Engraved Circular RADECO Certification Seal */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          {/* Outer Rotating/Engraved SVG Ring */}
          <svg
            viewBox="0 0 160 160"
            className="absolute inset-0 w-full h-full text-bronze/80"
            aria-hidden="true"
          >
            <circle
              cx="80"
              cy="80"
              r="74"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle
              cx="80"
              cy="80"
              r="64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              id="sealCirclePath"
              d="M 80, 80 m -54, 0 a 54,54 0 1,1 108,0 a 54,54 0 1,1 -108,0"
              fill="none"
            />
            <text
              fill="#F6F5F1"
              fontSize="7.5"
              fontFamily="monospace"
              letterSpacing="2.9"
            >
              <textPath href="#sealCirclePath" startOffset="4%">
                SELLO DE CALIDAD RADECO · ASTURIAS ·
              </textPath>
            </text>
          </svg>

          {/* Center Alabaster Medallion with Pure Black RADECO Emblem */}
          <div className="w-20 h-20 rounded-full bg-alabaster p-2.5 flex items-center justify-center shadow-inner border border-bronze/50">
            <img
              src="/brand/emblem-black.png"
              alt="Sello RADECO"
              decoding="async"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Right: Certification Details & Checkpoints */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-bronze/15 border border-bronze/40 font-mono text-[10px] uppercase tracking-[0.24em] text-copper mb-3">
            <span>Certificación Interna de Ejecución · {municipality}</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-2">
            Sello de Calidad RADECO
          </h3>

          <p className="text-xs sm:text-sm text-alabaster/65 leading-relaxed mb-6 max-w-xl">
            Cada proyecto ejecutado por RADECO supera una verificación técnica de
            estanqueidad, fijación mecánica y rematería antes de su entrega.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 px-4 py-3 bg-white/4 border border-white/10"
              >
                <span className="w-5 h-5 rounded-full bg-copper/20 border border-copper/50 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-copper" />
                </span>
                <span className="text-xs sm:text-sm font-medium text-white tracking-wide">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


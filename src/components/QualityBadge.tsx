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
    <div className="relative bg-[#F6F5F1] text-obsidian border-2 border-obsidian/15 p-8 sm:p-10 overflow-hidden shadow-[0_18px_50px_rgba(11,12,14,0.07)]">
      {/* Subtle Architectural Blueprint Grid */}
      <div className="absolute inset-0 bg-arch-grid-light bg-grid-40 opacity-50 pointer-events-none" />

      {/* Precision Corner Framing */}
      <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-copper" />
      <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-copper" />
      <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-copper" />
      <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-copper" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
        {/* Engraved Circular RADECO Certification Seal */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          {/* Outer Rotating/Engraved SVG Ring */}
          <svg
            viewBox="0 0 160 160"
            className="absolute inset-0 w-full h-full text-copper"
            aria-hidden="true"
          >
            <circle
              cx="80"
              cy="80"
              r="74"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <circle
              cx="80"
              cy="80"
              r="64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              id="sealCirclePath"
              d="M 80, 80 m -54, 0 a 54,54 0 1,1 108,0 a 54,54 0 1,1 -108,0"
              fill="none"
            />
            <text
              fill="#0B0C0E"
              fontSize="7.5"
              fontFamily="monospace"
              fontWeight="600"
              letterSpacing="2.9"
            >
              <textPath href="#sealCirclePath" startOffset="4%">
                SELLO DE CALIDAD RADECO · ASTURIAS ·
              </textPath>
            </text>
          </svg>

          {/* Center Alabaster Medallion with Pure Black RADECO Emblem */}
          <div className="w-20 h-20 rounded-full bg-white p-2.5 flex items-center justify-center shadow-md border border-obsidian/15">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-copper/10 border border-copper/30 font-mono text-[10px] uppercase tracking-[0.24em] text-copper font-semibold mb-3">
            <span>Certificación Interna de Ejecución · {municipality}</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-obsidian tracking-tight mb-2">
            Sello de Calidad RADECO
          </h3>

          <p className="text-xs sm:text-sm text-obsidian/70 leading-relaxed mb-6 max-w-xl">
            Cada proyecto ejecutado por RADECO supera una verificación técnica de
            estanqueidad, fijación mecánica y rematería antes de su entrega.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 px-4 py-3 bg-white border border-obsidian/12 shadow-sm"
              >
                <span className="w-5 h-5 rounded-full bg-copper text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-obsidian tracking-wide">
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


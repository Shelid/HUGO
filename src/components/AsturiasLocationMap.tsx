import React from 'react';
import { MapPin, Lock } from 'lucide-react';

interface AsturiasLocationMapProps {
  municipality: string;
  province?: string;
}

const ASTURIAS_MUNICIPALITY_NODES: {
  name: string;
  x: number;
  y: number;
}[] = [
  { name: 'Gijón', x: 305, y: 66 },
  { name: 'Avilés', x: 255, y: 68 },
  { name: 'Oviedo', x: 278, y: 112 },
  { name: 'Siero', x: 308, y: 108 },
  { name: 'Langreo', x: 318, y: 132 },
  { name: 'Mieres', x: 288, y: 146 },
  { name: 'Lena', x: 282, y: 178 },
  { name: 'Llanes', x: 445, y: 104 },
  { name: 'Villaviciosa', x: 356, y: 84 },
  { name: 'Cangas del Narcea', x: 148, y: 182 },
  { name: 'Luarca', x: 132, y: 88 },
  { name: 'Navia', x: 96, y: 86 },
];

export function AsturiasLocationMap({
  municipality,
  province = 'Asturias',
}: AsturiasLocationMapProps) {
  const normalizedTarget = municipality.trim().toLowerCase();

  const matchedNode =
    ASTURIAS_MUNICIPALITY_NODES.find((m) =>
      normalizedTarget.includes(m.name.toLowerCase()) ||
      m.name.toLowerCase().includes(normalizedTarget)
    ) || { name: municipality, x: 278, y: 112 };

  return (
    <div className="bg-[#F6F5F1] border border-obsidian/15 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
      <div className="space-y-4 max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-obsidian text-alabaster font-mono text-[10px] uppercase tracking-[0.22em]">
          <MapPin className="w-3.5 h-3.5 text-copper" />
          <span>Ubicación Municipal de la Intervención</span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-obsidian tracking-tight">
          📍 {municipality}, {province}
        </h3>

        <p className="text-xs sm:text-sm text-obsidian/70 leading-relaxed">
          Intervención ejecutada en el término municipal de{' '}
          <strong className="text-obsidian font-semibold">{municipality}</strong> (
          {province}). RADECO desarrolla actuaciones técnicas en todos los concejos del
          Principado de Asturias.
        </p>

        <div className="flex items-start gap-2.5 pt-2 text-[11px] font-mono text-obsidian/55">
          <Lock className="w-3.5 h-3.5 text-copper shrink-0 mt-0.5" />
          <span>
            Por confidencialidad y privacidad de nuestros clientes residenciales, se
            muestra únicamente el municipio y nunca la dirección exacta del inmueble.
          </span>
        </div>
      </div>

      {/* Stylized Architectural Silhouette of Principado de Asturias */}
      <div className="w-full lg:w-[460px] bg-obsidian p-5 border border-obsidian/20 relative overflow-hidden">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-alabaster/50 mb-2">
          <span>CARTOGRAFÍA REGIONAL · PRINCIPADO DE ASTURIAS</span>
          <span className="text-copper">{municipality.toUpperCase()}</span>
        </div>

        <svg
          viewBox="0 0 540 240"
          className="w-full h-auto"
          role="img"
          aria-label={`Mapa regional de Asturias destacando ${municipality}`}
        >
          {/* Subtle Grid Lines */}
          {[60, 120, 180].map((y) => (
            <line
              key={y}
              x1="20"
              y1={y}
              x2="520"
              y2={y}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
            />
          ))}
          {[100, 200, 300, 400].map((x) => (
            <line
              key={x}
              x1={x}
              y1="20"
              x2={x}
              y2="220"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
            />
          ))}

          {/* Stylized Polygon Outline of Asturias Coast & Cordillera Cantábrica */}
          <polygon
            points="42,92 85,78 135,80 185,68 238,52 268,42 308,58 358,72 415,86 485,95 502,126 462,158 408,168 352,185 295,198 225,204 155,212 95,195 54,158"
            fill="rgba(255, 255, 255, 0.04)"
            stroke="rgba(246, 245, 241, 0.35)"
            strokeWidth="1.5"
          />

          {/* Secondary Municipality Dots */}
          {ASTURIAS_MUNICIPALITY_NODES.map((node) => (
            <g key={node.name} opacity={0.45}>
              <circle cx={node.x} cy={node.y} r="2.5" fill="#F6F5F1" />
            </g>
          ))}

          {/* Highlighted Municipality Pulse */}
          <g>
            <circle
              cx={matchedNode.x}
              cy={matchedNode.y}
              r="18"
              fill="rgba(184, 93, 59, 0.22)"
              stroke="#B85D3B"
              strokeWidth="1"
            />
            <circle cx={matchedNode.x} cy={matchedNode.y} r="5" fill="#B85D3B" />
            <text
              x={matchedNode.x}
              y={matchedNode.y - 24}
              textAnchor="middle"
              fill="#F6F5F1"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {municipality.toUpperCase()} · ASTURIAS
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}


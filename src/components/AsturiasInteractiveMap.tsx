'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CloudRain,
  Compass,
  Droplets,
  Layers,
  MapPin,
  ShieldCheck,
  ThermometerSnowflake,
  Wind,
} from 'lucide-react';

interface MunicipalityData {
  id: string;
  name: string;
  zone: string;
  coords: string;
  /** SVG coordinates inside 800x440 viewBox */
  x: number;
  y: number;
  labelOffset: { dx: number; dy: number; anchor: 'start' | 'middle' | 'end' };
  rainfallMm: number;
  rainfallLevel: number; // 0-100 for gauge bar
  humidityPct: string;
  altitude: string;
  exposureTag: string;
  responseTime: string;
  commonPathology: string;
  recommendedSystem: string;
  recommendedLayers: string[];
  projectSlug?: string;
  projectTitle?: string;
}

const ASTURIAS_MUNICIPALITIES: MunicipalityData[] = [
  {
    id: 'oviedo',
    name: 'Oviedo',
    zone: 'Zona Central · Capital',
    coords: '43.3614° N, 5.8593° O',
    x: 405,
    y: 222,
    labelOffset: { dx: 0, dy: -16, anchor: 'middle' },
    rainfallMm: 960,
    rainfallLevel: 72,
    humidityPct: '79% HR',
    altitude: '232 m',
    exposureTag: 'Lluvia persistente + Niebla invernal',
    responseTime: 'Inspección en 24h',
    commonPathology:
      'Filtraciones en encuentros de chimenea, limahoyas saturadas y pérdida térmica en bajo cubierta de edificios residenciales y chalets.',
    recommendedSystem:
      'Cubierta microventilada con teja cerámica mixta Klinker, lámina transpirable W1 (185 g/m²) y aislamiento continuo XPS de 80–100 mm.',
    recommendedLayers: [
      'Teja cerámica mixta fijada en seco',
      'Doble rastrel C24 (cámara 40 mm)',
      'Lámina impermeable transpirable W1',
      'Aislamiento XPS machihembrado 100 mm',
    ],
    projectSlug: 'rehabilitacion-integral-cubierta-teja-oviedo',
    projectTitle: 'Rehabilitación integral de cubierta de teja en Oviedo',
  },
  {
    id: 'gijon',
    name: 'Gijón',
    zone: 'Costa Central · Mar Cantábrico',
    coords: '43.5453° N, 5.6615° O',
    x: 455,
    y: 128,
    labelOffset: { dx: 14, dy: -8, anchor: 'start' },
    rainfallMm: 920,
    rainfallLevel: 68,
    humidityPct: '82% HR',
    altitude: '12 m',
    exposureTag: 'Ambiente marino salino + Viento NO',
    responseTime: 'Inspección en 24h',
    commonPathology:
      'Agrietamiento de telas asfálticas antiguas en terrazas transitables, corrosión de remates metálicos por salitre y filtraciones a viviendas inferiores.',
    recommendedSystem:
      'Sistema bicapa elastomérico SBS de alta elongación o membrana líquida de poliuretano armada, formación de pendientes y rematería en zinc/aluminio marino.',
    recommendedLayers: [
      'Pavimento porcelánico desolidarizado',
      'Doble lámina SBS elastomérica termosoldada',
      'Geotextil antipunzonamiento 300 g/m²',
      'Mortero de pendientes + sumidero EPDM',
    ],
    projectSlug: 'impermeabilizacion-terraza-transitable-gijon',
    projectTitle: 'Impermeabilización de terraza transitable en Gijón',
  },
  {
    id: 'mieres',
    name: 'Mieres',
    zone: 'Cuenca del Caudal · Interior',
    coords: '43.2500° N, 5.7700° O',
    x: 418,
    y: 288,
    labelOffset: { dx: -14, dy: 4, anchor: 'end' },
    rainfallMm: 1140,
    rainfallLevel: 84,
    humidityPct: '81% HR',
    altitude: '210 m',
    exposureTag: 'Alta pluviosidad + Contraste térmico',
    responseTime: 'Inspección en 24–48h',
    commonPathology:
      'Bolsas de agua en cubiertas planas comunitarias, juntas de dilatación abiertas y condensaciones intersticiales por falta de rotura de puente térmico.',
    recommendedSystem:
      'Cubierta invertida no transitable con doble membrana impermeable, aislamiento térmico XPS de alta densidad y protección pesada de canto rodado.',
    recommendedLayers: [
      'Árido lavado / canto rodado de protección',
      'Geotextil filtrante termosoldado',
      'Poliestireno extruido XPS alta densidad',
      'Sistema bicapa impermeable adherido',
    ],
    projectSlug: 'impermeabilizacion-cubierta-plana-comunidad-mieres',
    projectTitle: 'Impermeabilización de cubierta comunitaria en Mieres',
  },
  {
    id: 'lena',
    name: 'Lena',
    zone: 'Montaña Central · Cordillera',
    coords: '43.1578° N, 5.8286° O',
    x: 412,
    y: 350,
    labelOffset: { dx: 0, dy: 22, anchor: 'middle' },
    rainfallMm: 1320,
    rainfallLevel: 96,
    humidityPct: '84% HR',
    altitude: '320–1.200 m',
    exposureTag: 'Nieve + Heladas severas + Viento sur',
    responseTime: 'Inspección en 24–48h',
    commonPathology:
      'Rotura o deslizamiento de losas de pizarra por ciclos de hielo-deshielo, sobrecarga de nieve y puentes térmicos severos en viviendas de montaña.',
    recommendedSystem:
      'Cobertura de pizarra seleccionada de alta montaña con gancho de acero inoxidable AISI 316, tablero hidrofugado, barrera de vapor y 100–120 mm de XPS.',
    recommendedLayers: [
      'Pizarra natural labrada + gancho inox AISI 316',
      'Doble rastrel de pino tratado en autoclave',
      'Membrana impermeable transpirable 185 g/m²',
      'Aislamiento XPS 100 mm + barrera de vapor',
    ],
    projectSlug: 'cubierta-pizarra-aislamiento-termico-lena',
    projectTitle: 'Cubierta de pizarra y aislamiento térmico en Lena',
  },
  {
    id: 'aviles',
    name: 'Avilés',
    zone: 'Ría y Costa Occidental-Central',
    coords: '43.5547° N, 5.9248° O',
    x: 378,
    y: 126,
    labelOffset: { dx: -14, dy: -8, anchor: 'end' },
    rainfallMm: 980,
    rainfallLevel: 74,
    humidityPct: '82% HR',
    altitude: '18 m',
    exposureTag: 'Frentes atlánticos + Lluvia oblicua',
    responseTime: 'Inspección en 24h',
    commonPathology:
      'Entrada de agua por remates laterales (hastiales), canalones desbordados ante lluvias torrenciales y deterioro de petos perimetrales.',
    recommendedSystem:
      'Sustitución integral de canalones y bajantes en zinc natural de 0,70 mm, baberos engatillados mecánicamente y sellado elástico de petos.',
    recommendedLayers: [
      'Canalón y bajante en zinc natural 0,70 mm',
      'Babero perimetral engatillado sin silicona',
      'Lámina impermeable bajo teja sellada',
      'Peine antipájaros y ventilación de alero',
    ],
  },
  {
    id: 'siero',
    name: 'Siero',
    zone: 'Área Metropolitana Central',
    coords: '43.3908° N, 5.6606° O',
    x: 462,
    y: 215,
    labelOffset: { dx: 14, dy: 4, anchor: 'start' },
    rainfallMm: 1010,
    rainfallLevel: 76,
    humidityPct: '78% HR',
    altitude: '220 m',
    exposureTag: 'Humedad ambiental + Rocío constante',
    responseTime: 'Inspección en 24h',
    commonPathology:
      'Envejecimiento de cubiertas en viviendas unifamiliares y chalets: tejas movidas, rastreles de madera podridos por falta de ventilación y goteras en limahoyas.',
    recommendedSystem:
      'Rehabilitación completa con subestructura ventilada, cumbrera en seco de alto caudal de aireación y teja cerámica plana o mixta.',
    recommendedLayers: [
      'Teja cerámica prensada con fijación mecánica',
      'Cumbrera ventilada en seco con banda de aluminio',
      'Lámina impermeable transpirable multicapa',
      'Aislamiento térmico continuo sin puentes térmicos',
    ],
  },
  {
    id: 'langreo',
    name: 'Langreo',
    zone: 'Valle del Nalón',
    coords: '43.2961° N, 5.6836° O',
    x: 472,
    y: 268,
    labelOffset: { dx: 14, dy: 6, anchor: 'start' },
    rainfallMm: 1120,
    rainfallLevel: 82,
    humidityPct: '80% HR',
    altitude: '215 m',
    exposureTag: 'Valle húmedo + Lluvias de otoño-invierno',
    responseTime: 'Inspección en 24–48h',
    commonPathology:
      'Filtraciones recurrentes en edificios comunitarios, lucernarios envejecidos y encuentros con medianeras sin solape estanco.',
    recommendedSystem:
      'Impermeabilización integral de cubierta y medianeras, renovación de claraboyas/lucernarios y aislamiento térmico de forjado superior.',
    recommendedLayers: [
      'Cobertura estanca + remate de medianera en zinc',
      'Membrana impermeabilizante continua en puntos críticos',
      'Aislamiento XPS de alta resistencia a compresión',
      'Revisión y sellado de bajantes comunitarias',
    ],
  },
  {
    id: 'llanes',
    name: 'Llanes',
    zone: 'Costa Oriental · Picos de Europa',
    coords: '43.4208° N, 4.7547° O',
    x: 682,
    y: 196,
    labelOffset: { dx: 0, dy: -16, anchor: 'middle' },
    rainfallMm: 1180,
    rainfallLevel: 88,
    humidityPct: '83% HR',
    altitude: '15 m',
    exposureTag: 'Galernas costeras + Lluvia orográfica',
    responseTime: 'Inspección en 48h',
    commonPathology:
      'Levantamiento de teja curva tradicional por rachas de viento costero y humedad capilar en muros y aleros de casonas asturianas.',
    recommendedSystem:
      'Sistema mixto patrimonial: placas bajo teja impermeables o lámina W1 sobre tablero, manteniendo la estética de teja curva envejecida fijada con gancho.',
    recommendedLayers: [
      'Teja curva envejecida con fijación oculta',
      'Placa bajo teja / lámina W1 de seguridad total',
      'Aislamiento térmico transpirable',
      'Alero tradicional restaurado y tratamiendo hidrófugo',
    ],
  },
  {
    id: 'cangas',
    name: 'Cangas del Narcea',
    zone: 'Suroccidente · Alta Montaña',
    coords: '43.1769° N, 6.5500° O',
    x: 205,
    y: 315,
    labelOffset: { dx: 0, dy: 22, anchor: 'middle' },
    rainfallMm: 1260,
    rainfallLevel: 92,
    humidityPct: '80% HR',
    altitude: '376 m',
    exposureTag: 'Clima continental de montaña + Heladas',
    responseTime: 'Inspección en 48h',
    commonPathology:
      'Degradación de cubiertas de pizarra antiguas con estructura de madera debilitada y pérdidas severas de calefacción en invierno.',
    recommendedSystem:
      'Consolidación estructural con madera laminada C24, tablero OSB-3 hidrofugado, aislamiento térmico reforzado y pizarra de primera selección.',
    recommendedLayers: [
      'Pizarra natural primera selección gran formato',
      'Lámina impermeable transpirable alta resistencia',
      'Aislamiento térmico XPS 100 mm sobre tablero OSB-3',
      'Refuerzo de cabios en madera estructural C24',
    ],
  },
];

export function AsturiasInteractiveMap() {
  const [selectedId, setSelectedId] = useState<string>('oviedo');

  const activeMunicipality =
    ASTURIAS_MUNICIPALITIES.find((m) => m.id === selectedId) ||
    ASTURIAS_MUNICIPALITIES[0];

  return (
    <section
      id="mapa-asturias"
      className="border-b border-obsidian/12 bg-[#F6F5F1] bg-arch-grid-light bg-grid-64 py-16 sm:py-24 text-obsidian relative overflow-hidden"
      aria-labelledby="asturias-map-heading"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-12">
        {/* TOP BAR: BRAND SIGNATURE & EDITORIAL HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-obsidian/12">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <img
              src="/brand/logo-black.png"
              alt="RADECO — Logo negro sin fondo"
              className="h-20 sm:h-24 w-auto object-contain select-none shrink-0"
            />
            <div className="sm:border-l sm:border-obsidian/15 sm:pl-6">
              <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-copper font-semibold mb-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Cartografía Técnica y Climatología · Principado de Asturias</span>
              </div>
              <h2
                id="asturias-map-heading"
                className="font-display text-2xl sm:text-4xl font-bold text-obsidian tracking-tight"
              >
                Soluciones adaptadas al clima de cada concejo
              </h2>
              <p className="text-xs sm:text-sm text-obsidian/70 mt-1.5 max-w-2xl leading-relaxed">
                No requiere el mismo sistema una terraza frente al salitre de{' '}
                <strong className="text-obsidian">Gijón</strong> que una cubierta de pizarra
                bajo nieve en <strong className="text-obsidian">Lena</strong>. Selecciona tu
                concejo en el mapa para consultar el diagnóstico climático y la solución
                constructiva RADECO.
              </p>
            </div>
          </div>

          {/* Quick Stats Badge */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-white border border-obsidian/12 px-4 py-3 shadow-sm">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-obsidian/50 block">
                Cobertura Regional
              </span>
              <span className="font-display text-lg font-bold text-obsidian">
                78 Concejos
              </span>
            </div>
            <div className="bg-white border border-obsidian/12 px-4 py-3 shadow-sm">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-obsidian/50 block">
                Estanqueidad CTE
              </span>
              <span className="font-display text-lg font-bold text-copper">
                Clase W1
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-white border border-obsidian/12 px-4 py-3 shadow-sm">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-obsidian/50 block">
                Visita Técnica
              </span>
              <span className="font-display text-lg font-bold text-obsidian">
                24 – 48 h
              </span>
            </div>
          </div>
        </div>

        {/* MUNICIPALITY SELECTOR PILLS (Fast access on mobile & desktop) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-obsidian/55 font-semibold">
              Seleccione un concejo para inspeccionar parámetros técnicos:
            </span>
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.2em] text-copper font-semibold">
              ● {activeMunicipality.name} seleccionado ({activeMunicipality.rainfallMm} mm/año)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {ASTURIAS_MUNICIPALITIES.map((muni) => {
              const isSelected = muni.id === selectedId;
              return (
                <button
                  key={muni.id}
                  type="button"
                  onClick={() => setSelectedId(muni.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] border transition-all ${
                    isSelected
                      ? 'bg-obsidian text-alabaster border-obsidian shadow-sm font-semibold'
                      : 'bg-white text-obsidian/75 border-obsidian/15 hover:border-copper hover:text-obsidian'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-copper animate-pulse' : 'bg-obsidian/25'
                    }`}
                  />
                  <span>{muni.name}</span>
                  {muni.projectSlug && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-sm ${
                        isSelected
                          ? 'bg-copper/25 text-copper'
                          : 'bg-limestone text-obsidian/60'
                      }`}
                    >
                      Obra
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN INTERACTIVE WORKSPACE: MAP (LEFT 7 COLS) + DOSSIER (RIGHT 5 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT: ARCHITECTURAL SVG MAP OF ASTURIAS */}
          <div className="lg:col-span-7 bg-white border border-obsidian/15 shadow-[0_18px_50px_rgba(11,12,14,0.05)] flex flex-col justify-between relative overflow-hidden">
            {/* Corner Technical Marks */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-copper pointer-events-none" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-copper pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-copper pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-copper pointer-events-none" />

            {/* Map Top Telemetry Bar */}
            <div className="px-5 py-3.5 border-b border-obsidian/10 bg-[#F9F8F5] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-copper" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-obsidian font-semibold">
                  Plano Cartográfico · Principado de Asturias (Escala Técnica)
                </span>
              </div>
              <span className="font-mono text-[10px] text-obsidian/55 tracking-[0.16em]">
                {activeMunicipality.coords}
              </span>
            </div>

            {/* Interactive SVG Map Canvas */}
            <div className="relative flex-1 flex items-center justify-center p-3 sm:p-6 bg-gradient-to-b from-[#F4F6F8] to-[#F9F8F5]">
              <svg
                viewBox="0 0 800 440"
                className="w-full h-auto max-h-[420px] select-none"
                role="img"
                aria-label="Mapa técnico interactivo del Principado de Asturias"
              >
                <defs>
                  {/* Blueprint subtle grid inside SVG */}
                  <pattern
                    id="asturiasCadGrid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#0B0C0E"
                      strokeWidth="0.5"
                      strokeOpacity="0.06"
                    />
                  </pattern>

                  {/* Elevation gradient for Asturias landmass */}
                  <linearGradient id="asturiasTerrain" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ECEAE2" />
                    <stop offset="65%" stopColor="#E2DFD5" />
                    <stop offset="100%" stopColor="#D5D0C3" />
                  </linearGradient>

                  {/* Drop shadow for landmass */}
                  <filter id="mapShadow" x="-5%" y="-5%" width="110%" height="115%">
                    <feDropShadow
                      dx="0"
                      dy="8"
                      stdDeviation="8"
                      floodColor="#0B0C0E"
                      floodOpacity="0.10"
                    />
                  </filter>
                </defs>

                {/* CAD Grid Background */}
                <rect x="0" y="0" width="800" height="440" fill="url(#asturiasCadGrid)" />

                {/* Coordinate Frame Ticks */}
                <g stroke="#0B0C0E" strokeOpacity="0.18" strokeWidth="1">
                  <line x1="40" y1="20" x2="760" y2="20" strokeDasharray="3 6" />
                  <line x1="40" y1="420" x2="760" y2="420" strokeDasharray="3 6" />
                </g>

                {/* MAR CANTÁBRICO LABEL & BATHYMETRY LINES */}
                <path
                  d="M 45,145 Q 160,120 275,112 T 465,98 T 650,142 T 765,155"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1"
                  strokeOpacity="0.35"
                  strokeDasharray="6 4"
                />
                <path
                  d="M 35,120 Q 160,92 280,86 T 470,72 T 660,118 T 770,130"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="0.8"
                  strokeOpacity="0.22"
                  strokeDasharray="3 5"
                />
                <text
                  x="230"
                  y="62"
                  fill="#0B0C0E"
                  fillOpacity="0.38"
                  fontSize="10"
                  fontFamily="monospace"
                  letterSpacing="5"
                  fontWeight="600"
                >
                  MAR CANTÁBRICO · COSTA VERDE
                </text>

                {/* CORDILLERA CANTÁBRICA LABEL (SOUTH) */}
                <text
                  x="400"
                  y="412"
                  textAnchor="middle"
                  fill="#0B0C0E"
                  fillOpacity="0.38"
                  fontSize="9.5"
                  fontFamily="monospace"
                  letterSpacing="4"
                  fontWeight="600"
                >
                  CORDILLERA CANTÁBRICA · ALTA MONTAÑA
                </text>

                {/* ASTURIAS PERIMETER SILHOUETTE (Realistic East-West Cantabrian Coast & Southern Mountain Range) */}
                <g filter="url(#mapShadow)">
                  <path
                    d="
                      M 62,175
                      L 92,166
                      L 132,160
                      L 175,152
                      L 215,146
                      L 255,140
                      L 292,144
                      L 328,132
                      L 368,122
                      L 392,102
                      L 414,94
                      L 435,114
                      L 462,122
                      L 502,134
                      L 548,145
                      L 595,154
                      L 642,166
                      L 695,176
                      L 742,182
                      L 736,218
                      L 718,248
                      L 690,262
                      L 652,276
                      L 615,286
                      L 578,312
                      L 532,334
                      L 486,348
                      L 442,366
                      L 396,374
                      L 348,364
                      L 298,372
                      L 246,380
                      L 192,368
                      L 146,345
                      L 112,310
                      L 84,268
                      L 68,225
                      Z
                    "
                    fill="url(#asturiasTerrain)"
                    stroke="#0B0C0E"
                    strokeWidth="2"
                  />
                </g>

                {/* Internal Topographic / Hydrographic Sub-Region Lines (Rivers Nalón, Narcea, Sella, Eo & Mountain Contours) */}
                <g
                  fill="none"
                  stroke="#0B0C0E"
                  strokeOpacity="0.14"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                >
                  {/* River Narcea / Nalón basin */}
                  <path d="M 332,132 Q 355,205 320,265 T 215,345" />
                  <path d="M 355,205 Q 415,230 475,275 T 530,330" />
                  {/* River Caudal axis (Oviedo - Mieres - Lena) */}
                  <path d="M 405,222 L 418,288 L 412,350" />
                  {/* Eastern Picos de Europa / Sella contour */}
                  <path d="M 565,150 Q 585,225 635,275" />
                  {/* Southern Cordillera Ridge Line */}
                  <path
                    d="M 135,325 Q 260,355 412,355 T 675,248"
                    stroke="#C86D3B"
                    strokeOpacity="0.3"
                    strokeDasharray="5 4"
                  />
                </g>

                {/* Active Radar Line Connecting Selected Municipality to Top-Right Telemetry Node */}
                <g pointerEvents="none">
                  <line
                    x1={activeMunicipality.x}
                    y1={activeMunicipality.y}
                    x2={activeMunicipality.x}
                    y2={35}
                    stroke="#C86D3B"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    strokeOpacity="0.65"
                  />
                  <line
                    x1={25}
                    y1={activeMunicipality.y}
                    x2={activeMunicipality.x}
                    y2={activeMunicipality.y}
                    stroke="#C86D3B"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    strokeOpacity="0.65"
                  />
                </g>

                {/* COMPASS ROSE (TOP LEFT) */}
                <g transform="translate(75, 70)" opacity="0.55">
                  <circle
                    cx="0"
                    cy="0"
                    r="20"
                    fill="none"
                    stroke="#0B0C0E"
                    strokeWidth="1"
                  />
                  <line x1="0" y1="-25" x2="0" y2="25" stroke="#0B0C0E" strokeWidth="1" />
                  <line x1="-25" y1="0" x2="25" y2="0" stroke="#0B0C0E" strokeWidth="1" />
                  <polygon points="0,-22 -4,-6 4,-6" fill="#C86D3B" />
                  <text
                    x="0"
                    y="-28"
                    textAnchor="middle"
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#0B0C0E"
                  >
                    N
                  </text>
                </g>

                {/* MUNICIPALITY INTERACTIVE NODES */}
                {ASTURIAS_MUNICIPALITIES.map((muni) => {
                  const isSelected = muni.id === selectedId;
                  return (
                    <g
                      key={muni.id}
                      onClick={() => setSelectedId(muni.id)}
                      className="cursor-pointer group"
                      role="button"
                      tabIndex={0}
                      aria-label={`Seleccionar concejo de ${muni.name}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedId(muni.id);
                        }
                      }}
                    >
                      {/* Invisible larger hit target for comfortable mobile tap */}
                      <circle cx={muni.x} cy={muni.y} r="24" fill="transparent" />

                      {/* Outer Radar Ring when selected */}
                      {isSelected && (
                        <>
                          <circle
                            cx={muni.x}
                            cy={muni.y}
                            r="22"
                            fill="#C86D3B"
                            fillOpacity="0.14"
                            stroke="#C86D3B"
                            strokeWidth="1.2"
                            strokeDasharray="3 2"
                          />
                          <circle
                            cx={muni.x}
                            cy={muni.y}
                            r="14"
                            fill="#C86D3B"
                            fillOpacity="0.22"
                          />
                        </>
                      )}

                      {/* Node Pin Circle */}
                      <circle
                        cx={muni.x}
                        cy={muni.y}
                        r={isSelected ? 7.5 : 5.5}
                        fill={isSelected ? '#C86D3B' : '#0B0C0E'}
                        stroke="#F6F5F1"
                        strokeWidth="2"
                      />

                      {/* Inner Center Dot */}
                      <circle
                        cx={muni.x}
                        cy={muni.y}
                        r="2"
                        fill="#F6F5F1"
                      />

                      {/* Label Tag */}
                      <g
                        transform={`translate(${muni.x + muni.labelOffset.dx}, ${
                          muni.y + muni.labelOffset.dy
                        })`}
                      >
                        <text
                          textAnchor={muni.labelOffset.anchor}
                          fontSize={isSelected ? '12' : '10.5'}
                          fontFamily="monospace"
                          fontWeight={isSelected ? '700' : '600'}
                          fill={isSelected ? '#C86D3B' : '#0B0C0E'}
                          stroke="#F6F5F1"
                          strokeWidth="3.5"
                          paintOrder="stroke"
                          letterSpacing="0.8"
                        >
                          {muni.name.toUpperCase()}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Map Footer Legend */}
            <div className="px-5 py-3.5 border-t border-obsidian/10 bg-[#F9F8F5] flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.16em] text-obsidian/65">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-copper inline-block" />
                  <span>Concejo seleccionado</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-obsidian inline-block" />
                  <span>Zona con cobertura directa RADECO</span>
                </span>
              </div>
              <span className="text-copper font-semibold">
                Toque cualquier punto del mapa para cambiar de concejo
              </span>
            </div>
          </div>

          {/* RIGHT: MUNICIPALITY TECHNICAL DOSSIER PANEL */}
          <div className="lg:col-span-5 bg-obsidian text-alabaster border border-obsidian p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_20px_50px_rgba(11,12,14,0.16)]">
            <div className="absolute inset-0 bg-arch-grid-dark bg-grid-40 opacity-25 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Top Dossier Header */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/12">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-copper block mb-1">
                    {activeMunicipality.zone}
                  </span>
                  <h3 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight flex items-center gap-2.5">
                    <MapPin className="w-6 h-6 text-copper shrink-0" />
                    <span>{activeMunicipality.name}</span>
                  </h3>
                </div>
                <span className="px-3 py-1.5 bg-copper/15 border border-copper/40 font-mono text-[10px] uppercase tracking-[0.18em] text-copper shrink-0">
                  {activeMunicipality.responseTime}
                </span>
              </div>

              {/* 3 Climatic Telemetry Boxes */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center justify-between text-sky-400 mb-1">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster/50">
                      Pluviometría
                    </span>
                    <CloudRain className="w-3.5 h-3.5" />
                  </div>
                  <p className="font-mono text-sm sm:text-base font-bold text-white">
                    {activeMunicipality.rainfallMm} mm
                  </p>
                  <div className="mt-2 h-1 w-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-sky-400 transition-all duration-500"
                      style={{ width: `${activeMunicipality.rainfallLevel}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center justify-between text-copper mb-1">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster/50">
                      Humedad Media
                    </span>
                    <Droplets className="w-3.5 h-3.5" />
                  </div>
                  <p className="font-mono text-sm sm:text-base font-bold text-white">
                    {activeMunicipality.humidityPct}
                  </p>
                  <span className="font-mono text-[9px] text-alabaster/45 block mt-1">
                    Clima Asturiano
                  </span>
                </div>

                <div className="bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center justify-between text-emerald-400 mb-1">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-alabaster/50">
                      Cota / Altitud
                    </span>
                    <ThermometerSnowflake className="w-3.5 h-3.5" />
                  </div>
                  <p className="font-mono text-sm sm:text-base font-bold text-white">
                    {activeMunicipality.altitude}
                  </p>
                  <span className="font-mono text-[9px] text-alabaster/45 block mt-1">
                    Zona CTE
                  </span>
                </div>
              </div>

              {/* Exposure Badge */}
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white/4 border border-white/10 text-xs font-mono text-alabaster/80">
                <Wind className="w-4 h-4 text-copper shrink-0" />
                <span>
                  <strong className="text-white uppercase tracking-wider">
                    Exposición Dominante:
                  </strong>{' '}
                  {activeMunicipality.exposureTag}
                </span>
              </div>

              {/* Common Pathology in this Municipality */}
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper block">
                  01 · Patología Habitual en {activeMunicipality.name}
                </span>
                <p className="text-xs sm:text-sm text-alabaster/75 leading-relaxed">
                  {activeMunicipality.commonPathology}
                </p>
              </div>

              {/* Recommended RADECO System & Layers */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-copper" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper">
                    02 · Solución Constructiva RADECO Recomendada
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed">
                  {activeMunicipality.recommendedSystem}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {activeMunicipality.recommendedLayers.map((layer, idx) => (
                    <div
                      key={layer}
                      className="flex items-center gap-2 px-3 py-2 bg-white/4 border border-white/10 text-[11px] text-alabaster/85"
                    >
                      <span className="font-mono text-[10px] text-copper font-bold">
                        0{idx + 1}
                      </span>
                      <span className="truncate">{layer}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: View Real Work in Municipality + Request Inspection */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/12 space-y-3">
              {activeMunicipality.projectSlug && (
                <Link
                  href={`/obras/${activeMunicipality.projectSlug}`}
                  className="w-full inline-flex items-center justify-between px-4 py-3 bg-white/8 hover:bg-white/14 border border-white/15 text-xs font-mono uppercase tracking-[0.16em] text-white transition-colors"
                >
                  <span className="inline-flex items-center gap-2 truncate">
                    <ShieldCheck className="w-4 h-4 text-copper shrink-0" />
                    <span className="truncate">
                      Ver obra ejecutada en {activeMunicipality.name}
                    </span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-copper shrink-0" />
                </Link>
              )}

              <Link
                href={`/presupuesto?municipio=${encodeURIComponent(activeMunicipality.name)}`}
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-copper hover:bg-bronze text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
              >
                <span>Solicitar inspección en {activeMunicipality.name}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


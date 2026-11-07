'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, CheckCircle2, Layers, Shield, Sparkles } from 'lucide-react';

interface StageInfo {
  id: number;
  code: string;
  label: string;
  title: string;
  subtitle: string;
  spec: string;
  range: [number, number];
}

const CONSTRUCTION_STAGES: StageInfo[] = [
  {
    id: 1,
    code: 'FASE 01',
    label: 'Estructura',
    title: 'Estructura portante y replanteo técnico',
    subtitle:
      'Nivelación de apoyos, vigas cumbreras y cabios estructurales verificados milimétricamente.',
    spec: 'SOPORTE ESTRUCTURAL · REPLANTEO DE PENDIENTES',
    range: [0.0, 0.17],
  },
  {
    id: 2,
    code: 'FASE 02',
    label: 'Soporte y Vapor',
    title: 'Tablero soporte y barrera de control de vapor',
    subtitle:
      'Estabilización del plano de cubierta y protección frente a condensaciones interiores.',
    spec: 'REGULARIZACIÓN DE FALDONES · CONTROL HIGROTÉRMICO',
    range: [0.17, 0.33],
  },
  {
    id: 3,
    code: 'FASE 03',
    label: 'Aislamiento',
    title: 'Aislamiento térmico continuo de alta densidad',
    subtitle:
      'Paneles machihembrados sin puentes térmicos para máximo confort y ahorro energético.',
    spec: 'XPS ALTA DENSIDAD · EFICIENCIA TÉRMICA CONTINUA',
    range: [0.33, 0.5],
  },
  {
    id: 4,
    code: 'FASE 04',
    label: 'Impermeabilización',
    title: 'Sistema de impermeabilización multicapa y sellado',
    subtitle:
      'Lámina impermeable transpirable y resolución estanca de limahoyas, chimeneas y perímetros.',
    spec: 'ESTANQUEIDAD INTEGRAL · PROTECCIÓN HIDRÓFUGA',
    range: [0.5, 0.67],
  },
  {
    id: 5,
    code: 'FASE 05',
    label: 'Cobertura y Acabado',
    title: 'Doble rastrelado ventilado, teja/pizarra y cumbrera',
    subtitle:
      'Cámara de ventilación continua bajo cobertura y fijación mecánica resistente a temporales.',
    spec: 'MICROVENTILACIÓN BAJO TEJA · REMATERÍA EN ZINC',
    range: [0.67, 0.84],
  },
  {
    id: 6,
    code: 'FASE 06',
    label: 'Identidad RADECO',
    title: 'Obra finalizada. Precisión que permanece.',
    subtitle: 'Construyendo confianza en Asturias, capa por capa.',
    spec: 'SELLO DE CALIDAD RADECO · GARANTÍA DOCUMENTADA',
    range: [0.84, 1.0],
  },
];

function clamp01(val: number): number {
  return Math.max(0, Math.min(1, val));
}

function rangeProgress(p: number, start: number, end: number): number {
  if (p <= start) return 0;
  if (p >= end) return 1;
  return (p - start) / (end - start);
}

export function HeroConstruction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    const tick = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0015) {
        currentProgressRef.current += diff * (reducedMotion ? 1 : 0.18);
        setProgress(currentProgressRef.current);
        rafId = requestAnimationFrame(tick);
      } else {
        if (currentProgressRef.current !== targetProgressRef.current) {
          currentProgressRef.current = targetProgressRef.current;
          setProgress(currentProgressRef.current);
        }
        rafId = null;
      }
    };

    const startTickIfNeeded = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const updateTargetFromScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Skip work if completely scrolled past viewport
      if (rect.bottom < -100 && targetProgressRef.current === 1) {
        return;
      }
      const scrollableHeight = rect.height - window.innerHeight;
      if (scrollableHeight <= 0) {
        targetProgressRef.current = 0;
        return;
      }
      const scrolled = -rect.top;
      const nextTarget = clamp01(scrolled / scrollableHeight);
      if (Math.abs(nextTarget - targetProgressRef.current) > 0.0005) {
        targetProgressRef.current = nextTarget;
        startTickIfNeeded();
      }
    };

    updateTargetFromScroll();
    window.addEventListener('scroll', updateTargetFromScroll, { passive: true });
    window.addEventListener('resize', updateTargetFromScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateTargetFromScroll);
      window.removeEventListener('resize', updateTargetFromScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [reducedMotion]);

  const jumpToStage = (stage: StageInfo) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const scrollable = rect.height - window.innerHeight;
    const targetP = stage.id === 6 ? 0.95 : (stage.range[0] + stage.range[1]) * 0.5;
    window.scrollTo({
      top: containerTop + scrollable * targetP,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  // Layer progress values (0 -> 1)
  const pStructure = rangeProgress(progress, 0.0, 0.15);
  const pDeck = rangeProgress(progress, 0.14, 0.30);
  const pInsulation = rangeProgress(progress, 0.28, 0.46);
  const pWaterproof = rangeProgress(progress, 0.44, 0.62);
  const pTiles = rangeProgress(progress, 0.60, 0.78);
  const pCompression = rangeProgress(progress, 0.75, 0.87); // Compresses exploded layers into finished roof
  const pFinalReveal = rangeProgress(progress, 0.84, 0.96);

  // Determine current active stage
  const activeStage =
    CONSTRUCTION_STAGES.find(
      (s, idx) =>
        progress >= s.range[0] &&
        (progress < s.range[1] || idx === CONSTRUCTION_STAGES.length - 1)
    ) || CONSTRUCTION_STAGES[0];

  // Camera movement & vertical layer explosion spacing
  // As pCompression goes 0 -> 1, the vertical spacing between layers collapses so the roof locks together!
  const explosionFactor = 1 - pCompression * 0.82;
  const cameraScale = 1 + progress * 0.08 - pFinalReveal * 0.04;
  const cameraRotateZ = (progress - 0.5) * 6 * (1 - pFinalReveal * 0.6);
  const cameraTranslateY = pFinalReveal * -18;

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[270vh] md:h-[380vh] bg-obsidian text-alabaster select-none"
      aria-label="Presentación interactiva de construcción de cubierta RADECO"
    >
      {/* Sticky Viewport Stage */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between">
        {/* Background Layer 1: Architectural Blueprint Grid & Atmospheric Gradient */}
        <div className="absolute inset-0 bg-arch-grid-dark bg-grid-64 opacity-45 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 44%, rgba(184, 93, 59, 0.12) 0%, rgba(20, 22, 25, 0.65) 48%, rgba(11, 12, 14, 0.98) 100%)',
          }}
        />

        {/* Background Layer 2: Completed Architectural Roof Photo Crossfade at Phase 6 */}
        {pCompression > 0.01 && (
          <div
            className="absolute inset-0 pointer-events-none will-change-transform"
            style={{
              opacity: pCompression * 0.42,
              transform: `scale(${1.06 - pFinalReveal * 0.05})`,
            }}
          >
            <img
              src="/images/projects/oviedo-after.jpg"
              alt="Cubierta rehabilitada por RADECO en Asturias"
              decoding="async"
              loading="eager"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-obsidian/65" />
          </div>
        )}

        {/* Top Technical Telemetry Bar (below fixed Navbar) */}
        <div className="relative z-20 pt-24 sm:pt-28 px-4 sm:px-8 max-w-[1400px] w-full mx-auto flex items-center justify-between text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-alabaster/60">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-copper animate-pulse" />
            <span>{activeStage.code} · {activeStage.label}</span>
            <span className="hidden md:inline text-white/25">|</span>
            <span className="hidden md:inline text-white/50">{activeStage.spec}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-white/45">ASTURIAS · INGENIERÍA DE CUBIERTAS</span>
            <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-alabaster font-semibold">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>

        {/* Center Main Stage: Isometric Roof Assembly + Final RADECO Brand Reveal */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 max-w-[1400px] w-full mx-auto">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Dynamic Stage Narrative (Fades out gracefully when Final Brand Reveal takes center stage) */}
            <div
              className="lg:col-span-5 space-y-4 transition-all duration-300"
              style={{
                opacity: Math.max(0, 1 - pFinalReveal * 1.6),
                transform: `translateY(${-pFinalReveal * 30}px)`,
                pointerEvents: pFinalReveal > 0.6 ? 'none' : 'auto',
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.04] border border-white/10 text-[10px] font-mono uppercase tracking-[0.22em] text-copper">
                <Layers className="w-3.5 h-3.5" />
                <span>Construyendo confianza, capa por capa</span>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight leading-[1.12] text-white">
                {activeStage.title}
              </h1>

              <p className="text-sm sm:text-base text-alabaster/70 leading-relaxed max-w-md">
                {activeStage.subtitle}
              </p>

              {/* Layer Checklist Progress Indicators */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-md">
                {[
                  { name: '01 Estructura', active: progress >= 0.02 },
                  { name: '02 Soporte', active: progress >= 0.17 },
                  { name: '03 Aislamiento', active: progress >= 0.33 },
                  { name: '04 Impermeabilización', active: progress >= 0.50 },
                  { name: '05 Teja / Pizarra', active: progress >= 0.67 },
                  { name: '06 Acabado RADECO', active: progress >= 0.84 },
                ].map((layerItem, idx) => (
                  <button
                    key={layerItem.name}
                    type="button"
                    onClick={() => jumpToStage(CONSTRUCTION_STAGES[idx])}
                    className={`text-left px-2.5 py-2 border text-[10px] font-mono uppercase tracking-wider transition-all ${
                      layerItem.active
                        ? 'border-copper/60 bg-copper/15 text-white'
                        : 'border-white/10 bg-white/[0.02] text-white/40 hover:border-white/25'
                    }`}
                  >
                    {layerItem.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right / Center Column: 3D Isometric Architectural Roof Assembly SVG */}
            <div
              className="lg:col-span-7 relative flex items-center justify-center will-change-transform"
              style={{
                opacity: Math.max(0.18, 1 - pFinalReveal * 0.78),
                transform: `translate3d(0, ${cameraTranslateY}px, 0) scale(${cameraScale}) rotate(${cameraRotateZ}deg)`,
              }}
            >
              <svg
                viewBox="0 0 800 560"
                className="w-full max-w-[680px] h-auto overflow-visible"
                role="img"
                aria-label="Arquitectura multicapa de una cubierta RADECO"
              >
                <defs>
                  <linearGradient id="wallGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#262930" />
                    <stop offset="100%" stopColor="#16181D" />
                  </linearGradient>
                  <linearGradient id="wallGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1D2026" />
                    <stop offset="100%" stopColor="#111317" />
                  </linearGradient>
                  <linearGradient id="insulationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D9B382" />
                    <stop offset="100%" stopColor="#A67C52" />
                  </linearGradient>
                  <linearGradient id="waterproofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2A3441" />
                    <stop offset="50%" stopColor="#1E2631" />
                    <stop offset="100%" stopColor="#0F141A" />
                  </linearGradient>
                  <linearGradient id="tileGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#B85D3B" />
                    <stop offset="100%" stopColor="#7C3A21" />
                  </linearGradient>
                  <linearGradient id="tileGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8F4326" />
                    <stop offset="100%" stopColor="#562614" />
                  </linearGradient>
                </defs>

                {/* Blueprint Isometric Base Grid */}
                <g opacity={0.35}>
                  <polygon
                    points="400,490 130,360 400,230 670,360"
                    fill="none"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="400"
                    y1="80"
                    x2="400"
                    y2="510"
                    stroke="rgba(184,93,59,0.35)"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                  />
                </g>

                {/* =========================================================
                    LAYER 1: ESTRUCTURA BASE & CABIOS PORTANTES
                   ========================================================= */}
                <g
                  style={{
                    opacity: clamp01(pStructure * 1.25),
                    transform: `translateY(${(1 - pStructure) * 45}px)`,
                  }}
                >
                  {/* Isometric Architectural Building Volume / Gable Support */}
                  <polygon
                    points="160,350 400,465 400,375 280,245 160,295"
                    fill="url(#wallGradLeft)"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="1.2"
                  />
                  <polygon
                    points="400,465 640,350 640,295 520,245 400,375"
                    fill="url(#wallGradRight)"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1.2"
                  />

                  {/* Ridge Beam (Viga Cumbrera) */}
                  <line
                    x1="280"
                    y1="245"
                    x2="520"
                    y2="135"
                    stroke="#D69E66"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  {/* Isometric Timber/Steel Rafters (Cabios) */}
                  {[0, 0.2, 0.4, 0.6, 0.8, 1].map((t, i) => {
                    const rx = 280 + (520 - 280) * t;
                    const ry = 245 + (135 - 245) * t;
                    const lx = 155 + (395 - 155) * t;
                    const ly = 345 + (235 - 345) * t;
                    const rrx = 400 + (640 - 400) * t;
                    const rry = 375 + (265 - 375) * t;
                    return (
                      <g key={i}>
                        {/* Left Slope Rafter */}
                        <line
                          x1={rx}
                          y1={ry}
                          x2={lx}
                          y2={ly}
                          stroke="#C89662"
                          strokeWidth="3.5"
                        />
                        {/* Right Slope Rafter */}
                        <line
                          x1={rx}
                          y1={ry}
                          x2={rrx}
                          y2={rry}
                          stroke="#9E7145"
                          strokeWidth="3.5"
                        />
                      </g>
                    );
                  })}

                  {/* Technical Callout Tag 01 */}
                  <g opacity={pStructure > 0.5 ? 0.9 : 0}>
                    <line
                      x1="155"
                      y1="345"
                      x2="95"
                      y2="345"
                      stroke="#B85D3B"
                      strokeWidth="1"
                    />
                    <text
                      x="90"
                      y="342"
                      textAnchor="end"
                      fill="#F6F5F1"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      01 · ESTRUCTURA
                    </text>
                  </g>
                </g>

                {/* =========================================================
                    LAYER 2: SOPORTE CONTINUO & BARRERA DE VAPOR
                   ========================================================= */}
                {pDeck > 0.01 && (
                  <g
                    style={{
                      opacity: clamp01(pDeck * 1.2),
                      transform: `translateY(${
                        -28 * explosionFactor - (1 - pDeck) * 55
                      }px)`,
                    }}
                  >
                    {/* Left Slope Deck */}
                    <polygon
                      points="280,245 520,135 395,235 155,345"
                      fill="rgba(48, 53, 62, 0.92)"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="1.2"
                    />
                    {/* Right Slope Deck */}
                    <polygon
                      points="280,245 520,135 640,265 400,375"
                      fill="rgba(34, 38, 46, 0.94)"
                      stroke="rgba(255,255,255,0.28)"
                      strokeWidth="1.2"
                    />
                    <line
                      x1="640"
                      y1="265"
                      x2="700"
                      y2="265"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="1"
                    />
                    <text
                      x="706"
                      y="268"
                      fill="#F6F5F1"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      02 · SOPORTE BASE
                    </text>
                  </g>
                )}

                {/* =========================================================
                    LAYER 3: AISLAMIENTO TÉRMICO CONTINUO XPS
                   ========================================================= */}
                {pInsulation > 0.01 && (
                  <g
                    style={{
                      opacity: clamp01(pInsulation * 1.2),
                      transform: `translateY(${
                        -58 * explosionFactor - (1 - pInsulation) * 65
                      }px)`,
                    }}
                  >
                    {/* Left Slope Thermal Insulation Panel */}
                    <polygon
                      points="280,245 520,135 395,235 155,345"
                      fill="url(#insulationGrad)"
                      stroke="#F6F5F1"
                      strokeWidth="1.2"
                    />
                    {/* Right Slope Thermal Insulation Panel */}
                    <polygon
                      points="280,245 520,135 640,265 400,375"
                      fill="#946B43"
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="1.2"
                    />
                    {/* Joint Grid Lines on Insulation Panels */}
                    {[0.25, 0.5, 0.75].map((t, idx) => (
                      <line
                        key={idx}
                        x1={280 + (520 - 280) * t}
                        y1={245 + (135 - 245) * t}
                        x2={400 + (640 - 400) * t}
                        y2={375 + (265 - 375) * t}
                        stroke="rgba(255,255,255,0.28)"
                        strokeWidth="1"
                      />
                    ))}
                    <line
                      x1="155"
                      y1="345"
                      x2="95"
                      y2="310"
                      stroke="#D9B382"
                      strokeWidth="1"
                    />
                    <text
                      x="90"
                      y="306"
                      textAnchor="end"
                      fill="#D9B382"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      03 · AISLAMIENTO XPS
                    </text>
                  </g>
                )}

                {/* =========================================================
                    LAYER 4: IMPERMEABILIZACIÓN MULTICAPA TRANSPIRABLE
                   ========================================================= */}
                {pWaterproof > 0.01 && (
                  <g
                    style={{
                      opacity: clamp01(pWaterproof * 1.2),
                      transform: `translateY(${
                        -88 * explosionFactor - (1 - pWaterproof) * 70
                      }px)`,
                    }}
                  >
                    {/* Left Waterproofing Membrane */}
                    <polygon
                      points="280,245 520,135 395,235 155,345"
                      fill="url(#waterproofGrad)"
                      stroke="#60A5FA"
                      strokeWidth="1.5"
                    />
                    {/* Right Waterproofing Membrane */}
                    <polygon
                      points="280,245 520,135 640,265 400,375"
                      fill="#131922"
                      stroke="#60A5FA"
                      strokeWidth="1.5"
                    />
                    {/* Sealed Seam Lines */}
                    {[0.33, 0.66].map((t, idx) => (
                      <line
                        key={idx}
                        x1={280 + (155 - 280) * t}
                        y1={245 + (345 - 245) * t}
                        x2={520 + (395 - 520) * t}
                        y2={135 + (235 - 135) * t}
                        stroke="rgba(96, 165, 250, 0.45)"
                        strokeWidth="1.2"
                        strokeDasharray="6 3"
                      />
                    ))}
                    <line
                      x1="640"
                      y1="265"
                      x2="705"
                      y2="230"
                      stroke="#60A5FA"
                      strokeWidth="1"
                    />
                    <text
                      x="710"
                      y="233"
                      fill="#93C5FD"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      04 · IMPERMEABILIZACIÓN
                    </text>
                  </g>
                )}

                {/* =========================================================
                    LAYER 5: COBERTURA FINAL (TEJA / PIZARRA + CUMBRERA)
                   ========================================================= */}
                {pTiles > 0.01 && (
                  <g
                    style={{
                      opacity: clamp01(pTiles * 1.25),
                      transform: `translateY(${
                        -118 * explosionFactor - (1 - pTiles) * 80
                      }px)`,
                    }}
                  >
                    {/* Left Roof Slope Finished Coverage */}
                    <polygon
                      points="280,245 520,135 395,235 155,345"
                      fill="url(#tileGradLeft)"
                      stroke="#F6F5F1"
                      strokeWidth="1.6"
                    />
                    {/* Right Roof Slope Finished Coverage */}
                    <polygon
                      points="280,245 520,135 640,265 400,375"
                      fill="url(#tileGradRight)"
                      stroke="#F6F5F1"
                      strokeWidth="1.6"
                    />

                    {/* Architectural Course Lines (Hiladas de Teja / Pizarra) */}
                    {[0.2, 0.4, 0.6, 0.8].map((t, idx) => (
                      <g key={idx}>
                        <line
                          x1={280 + (155 - 280) * t}
                          y1={245 + (345 - 245) * t}
                          x2={520 + (395 - 520) * t}
                          y2={135 + (235 - 135) * t}
                          stroke="rgba(255,255,255,0.25)"
                          strokeWidth="1"
                        />
                        <line
                          x1={280 + (400 - 280) * t}
                          y1={245 + (375 - 245) * t}
                          x2={520 + (640 - 520) * t}
                          y2={135 + (265 - 135) * t}
                          stroke="rgba(255,255,255,0.22)"
                          strokeWidth="1"
                        />
                      </g>
                    ))}

                    {/* Ventilated Ridge Cap (Cumbrera Ventilada en Zinc/Cerámica) */}
                    <line
                      x1="276"
                      y1="247"
                      x2="524"
                      y2="133"
                      stroke="#F6F5F1"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />

                    <line
                      x1="520"
                      y1="135"
                      x2="590"
                      y2="105"
                      stroke="#F6F5F1"
                      strokeWidth="1.2"
                    />
                    <text
                      x="596"
                      y="108"
                      fill="#F6F5F1"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      05 · COBERTURA Y CUMBRERA
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* ===============================================================
              FINAL STAGE (84% - 100%): RADECO CINEMATIC BRAND PRESENTATION
             =============================================================== */}
          <div
            className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none"
            style={{
              opacity: pFinalReveal,
              transform: `scale(${0.94 + pFinalReveal * 0.06}) translateY(${
                (1 - pFinalReveal) * 24
              }px)`,
            }}
          >
            <div
              className={`max-w-3xl w-full bg-[#F6F5F1] text-obsidian border border-obsidian/15 shadow-[0_32px_90px_rgba(0,0,0,0.85)] p-8 sm:p-12 md:p-14 text-center relative overflow-hidden ${
                pFinalReveal > 0.45 ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
            >
              {/* Subtle Architectural Corner Marks */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-obsidian/30" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-obsidian/30" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-obsidian/30" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-obsidian/30" />

              {/* Top Technical Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-obsidian/[0.05] border border-obsidian/10 text-[10px] font-mono uppercase tracking-[0.24em] text-obsidian/70 mb-6">
                <Shield className="w-3.5 h-3.5 text-copper" />
                <span>Principado de Asturias · España</span>
              </div>

              {/* Extracted Transparent All-Black RADECO Logo */}
              <div className="flex justify-center mb-5">
                <img
                  src="/brand/logo-black.png"
                  alt="RADECO — Logo Oficial"
                  className="h-28 sm:h-36 md:h-40 w-auto object-contain select-none"
                />
              </div>

              <h2 className="sr-only">RADECO</h2>

              {/* Required Subtitle */}
              <p className="font-mono text-xs sm:text-sm md:text-base uppercase tracking-[0.26em] text-obsidian font-semibold mb-3">
                Cubiertas · Terrazas · Impermeabilización
              </p>

              <p className="text-xs sm:text-sm text-obsidian/65 max-w-lg mx-auto mb-8 leading-relaxed">
                Soluciones técnicas de rehabilitación, reparación e impermeabilización
                ejecutadas con rigor constructivo, materiales seleccionados y garantía.
              </p>

              {/* Required CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  href="/presupuesto"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-all shadow-lg"
                >
                  <span>Solicitar presupuesto</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/obras"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 border border-obsidian/20 text-obsidian font-mono text-xs uppercase tracking-[0.18em] hover:bg-obsidian/5 transition-all"
                >
                  <span>Explorar obras</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scrubber & Scroll Guidance Bar */}
        <div className="relative z-20 pb-6 px-4 sm:px-8 max-w-[1400px] w-full mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                {progress < 0.88
                  ? 'Deslice para construir la cubierta paso a paso'
                  : 'Cubierta completada · RADECO Asturias'}
              </span>
              {progress < 0.88 && (
                <ArrowDown className="w-3.5 h-3.5 text-copper animate-bounce" />
              )}
            </div>

            {/* Interactive Timeline Progress Bar */}
            <div className="w-full sm:w-72 h-1.5 bg-white/10 overflow-hidden relative">
              <div
                className="h-full bg-copper transition-all duration-75"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>

            <div className="hidden md:flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.18em] text-white/50">
              <button
                type="button"
                onClick={() => jumpToStage(CONSTRUCTION_STAGES[5])}
                className="hover:text-white transition-colors underline underline-offset-4"
              >
                Ir al resultado final
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


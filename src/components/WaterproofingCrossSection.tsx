'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  CheckCircle2,
  Droplets,
  Flame,
  ShieldCheck,
  ThermometerSnowflake,
  Wind,
} from 'lucide-react';

interface ZoomStage {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  layerFocus: string;
  technicalProof: string;
  range: [number, number];
}

const ZOOM_STAGES: ZoomStage[] = [
  {
    id: 1,
    code: 'CORTE 01',
    title: 'Impacto pluvial y escorrentía sobre cobertura cerámica',
    subtitle:
      'Bajo lluvia intensa en Asturias (8,0 °C), el perfil curvo y el solape mecánico de la teja evacúan el caudal principal sin absorción ni desplazamiento por viento.',
    layerFocus: 'TEJA CERÁMICA MIXTA / PIZARRA · SOLAPE ESTANCO',
    technicalProof: 'Escorrentía primaria > 96% del caudal pluvial',
    range: [0.0, 0.25],
  },
  {
    id: 2,
    code: 'CORTE 02',
    title: 'Cámara de microventilación (40 mm) y lámina impermeable W1',
    subtitle:
      'Cualquier humedad por ventisca o condensación bajo teja es interceptada por la membrana transpirable multicapa W1 termosellada, mientras el flujo de aire ascendente seca la cámara.',
    layerFocus: 'DOBLE RASTREL VENTILADO + MEMBRANA W1 (185 g/m²)',
    technicalProof: 'Barrera hidrófuga absoluta · Permeabilidad al vapor Sd ≤ 0,02m',
    range: [0.25, 0.5],
  },
  {
    id: 3,
    code: 'CORTE 03',
    title: 'Escudo térmico XPS 100 mm y retención del calor interior (+21,5 °C)',
    subtitle:
      'El aislamiento continuo machihembrado de poliestireno extruido y la barrera de vapor reflejan el calor hacia el interior de la vivienda, eliminando puentes térmicos y condensaciones.',
    layerFocus: 'XPS 100 mm (λ 0,033 W/mK) + BARRERA DE VAPOR + TABLERO 22 mm',
    technicalProof: 'Retención térmica continua · 0% condensación intersticial',
    range: [0.5, 0.75],
  },
  {
    id: 4,
    code: 'CORTE 04',
    title: 'Encuentro de alero: vierteaguas y canalón de zinc natural',
    subtitle:
      'Tanto el agua de las tejas como el drenaje secundario de la membrana W1 desembocan mediante babero vierteaguas metálico directamente al canalón semicircular de zinc.',
    layerFocus: 'VIERTEAGUAS EN ZINC + PEINE DE ALERO + CANALÓN CON BAJANTE',
    technicalProof: 'Evacuación pluvial 100% controlada · Fachada libre de humedades',
    range: [0.75, 1.0],
  },
];

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function WaterproofingCrossSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [mode, setMode] = useState<'radeco' | 'pathology'>('radeco');

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const modeRef = useRef<'radeco' | 'pathology'>('radeco');
  const isVisibleRef = useRef(false);
  const timeRef = useRef(0);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const jumpToStage = (stage: ZoomStage) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const scrollable = Math.max(1, rect.height - window.innerHeight);
    const targetP = stage.range[0] + (stage.range[1] - stage.range[0]) * 0.5;
    window.scrollTo({
      top: top + scrollable * targetP,
      behavior: 'smooth',
    });
  };

  // High-DPI 2D Architectural Cross-Section Renderer with Zoom Camera & Fluid Dynamics
  const drawCrossSection = useCallback((p: number, time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(300, rect.width);
    const height = Math.max(300, rect.height);

    if (
      canvas.width !== Math.round(width * dpr) ||
      canvas.height !== Math.round(height * dpr)
    ) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.lineJoin = 'round';
    ctx.clearRect(0, 0, width, height);

    const isRadeco = modeRef.current === 'radeco';
    const isMobile = width < 680;

    // =========================================================================
    // WORLD COORDINATE SYSTEM (Cross-section coordinates in virtual mm/px)
    // Slope runs from upper-left (-380, -190) down to eaves at (+260, +130)
    // Slope angle: atan2(320, 640) = 26.565 degrees (Realistic 50% / 26.5° pitch)
    // =========================================================================
    const slopeAngle = Math.atan2(320, 640); // ~0.4636 rad (26.56 deg)
    const cosA = Math.cos(slopeAngle);
    const sinA = Math.sin(slopeAngle);
    // Normal pointing UP-RIGHT perpendicular to roof slope:
    const nx = sinA;
    const ny = -cosA;

    // Helper: convert (s along slope from 0..700, n perpendicular height above rafter bottom) to world (wx, wy)
    const sOriginX = -360;
    const sOriginY = -170;
    const toWorld = (s: number, n: number): { x: number; y: number } => ({
      x: sOriginX + s * cosA + n * nx,
      y: sOriginY + s * sinA + n * ny,
    });

    // Camera Zoom & Pan Trajectory based on scroll progress `p` (0..1)
    // Stop 1 (p=0.0..0.25): Upper-mid tiles & rain impact (s ~ 210, n ~ 170)
    // Stop 2 (p=0.25..0.50): Ventilated chamber & W1 membrane (s ~ 330, n ~ 135)
    // Stop 3 (p=0.50..0.75): 100mm XPS insulation, vapor barrier & interior heat (s ~ 370, n ~ 45)
    // Stop 4 (p=0.75..1.00): Eaves drip edge, zinc gutter & downspout (s ~ 590, n ~ 85)
    const t12 = smoothstep(0.15, 0.35, p);
    const t23 = smoothstep(0.42, 0.62, p);
    const t34 = smoothstep(0.68, 0.88, p);

    let camS = lerp(220, 320, t12);
    camS = lerp(camS, 360, t23);
    camS = lerp(camS, 555, t34);

    let camN = lerp(165, 130, t12);
    camN = lerp(camN, 50, t23);
    camN = lerp(camN, 80, t34);

    const camFocus = toWorld(camS, camN);
    const baseFitScale = Math.min(width / (isMobile ? 640 : 780), height / 520);
    // Gentle zoom-in during middle inspection stages
    const zoomFactor = 1.08 + Math.sin(p * Math.PI) * 0.16;
    const camScale = baseFitScale * zoomFactor;

    ctx.save();
    ctx.translate(width * 0.5, height * 0.52);
    ctx.scale(camScale, camScale);
    ctx.translate(-camFocus.x, -camFocus.y);

    // Helper: draw polygon in rotated (s, n) roof coordinates
    const drawSlopeStrip = (
      s0: number,
      s1: number,
      n0: number,
      n1: number,
      fill: string | CanvasGradient,
      stroke?: string,
      lw = 1
    ) => {
      const p0 = toWorld(s0, n0);
      const p1 = toWorld(s1, n0);
      const p2 = toWorld(s1, n1);
      const p3 = toWorld(s0, n1);
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lw;
        ctx.stroke();
      }
    };

    // =========================================================================
    // 1. INTERIOR LIVING SPACE (WARM THERMAL ZONE BELOW ROOF) & MASONRY FACADE WALL
    // =========================================================================
    const eavesS = 620;
    const wallTopPt = toWorld(eavesS - 45, 0);
    const wallOuterX = wallTopPt.x + 35;
    const wallInnerX = wallOuterX - 115;
    const wallBottomY = wallTopPt.y + 420;

    // Warm Interior Room Glow (Left of facade wall, below roof rafters)
    const roomTopLeft = toWorld(0, -10);
    const roomTopRight = toWorld(eavesS - 60, -10);
    const roomGrad = ctx.createLinearGradient(0, roomTopLeft.y, 0, wallBottomY);
    if (isRadeco) {
      roomGrad.addColorStop(0, 'rgba(217, 119, 6, 0.24)');
      roomGrad.addColorStop(0.5, 'rgba(184, 93, 59, 0.12)');
      roomGrad.addColorStop(1, 'rgba(15, 17, 21, 0.02)');
    } else {
      roomGrad.addColorStop(0, 'rgba(59, 130, 246, 0.16)');
      roomGrad.addColorStop(1, 'rgba(15, 17, 21, 0.02)');
    }
    ctx.beginPath();
    ctx.moveTo(roomTopLeft.x - 100, roomTopLeft.y);
    ctx.lineTo(roomTopRight.x, roomTopRight.y);
    ctx.lineTo(wallInnerX, wallBottomY);
    ctx.lineTo(roomTopLeft.x - 100, wallBottomY);
    ctx.closePath();
    ctx.fillStyle = roomGrad;
    ctx.fill();

    // Masonry Facade Wall & Concrete Ring Beam (Muro de Fachada + Zuncho de Coronación)
    ctx.fillStyle = '#252932';
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.rect(wallInnerX, wallTopPt.y - 10, wallOuterX - wallInnerX, wallBottomY - wallTopPt.y + 10);
    ctx.fill();
    ctx.stroke();

    // Stone / Masonry Block Courses on Facade Wall
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let wy = wallTopPt.y + 35; wy < wallBottomY; wy += 42) {
      ctx.beginPath();
      ctx.moveTo(wallInnerX, wy);
      ctx.lineTo(wallOuterX, wy);
      ctx.stroke();
    }

    // Concrete Ring Beam (Zuncho de hormigón armado en cabeza de muro)
    ctx.fillStyle = '#363C48';
    ctx.fillRect(wallInnerX, wallTopPt.y - 10, wallOuterX - wallInnerX, 45);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.strokeRect(wallInnerX, wallTopPt.y - 10, wallOuterX - wallInnerX, 45);

    // =========================================================================
    // 2. LAYER 01: CABIO ESTRUCTURAL DE MADERA LAMINADA C24 (n = 0..46)
    // =========================================================================
    const rafterGrad = ctx.createLinearGradient(
      toWorld(300, 0).x,
      toWorld(300, 0).y,
      toWorld(300, 46).x,
      toWorld(300, 46).y
    );
    rafterGrad.addColorStop(0, '#9E6B3B');
    rafterGrad.addColorStop(0.5, '#C8925E');
    rafterGrad.addColorStop(1, '#AC7846');

    drawSlopeStrip(
      -40,
      eavesS,
      0,
      46,
      rafterGrad,
      'rgba(255,255,255,0.22)',
      1.1
    );

    // Wood grain lines along the C24 structural rafter
    for (const gn of [12, 24, 35]) {
      const g0 = toWorld(-30, gn);
      const g1 = toWorld(eavesS - 5, gn);
      ctx.strokeStyle = 'rgba(68, 38, 14, 0.35)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(g0.x, g0.y);
      ctx.lineTo(g1.x, g1.y);
      ctx.stroke();
    }

    // =========================================================================
    // 3. LAYER 02: TABLERO SOPORTE HIDROFUGADO (n = 46..64) & BARRERA DE VAPOR (n = 64..70)
    // =========================================================================
    drawSlopeStrip(
      -40,
      eavesS + 5,
      46,
      64,
      '#784E28',
      'rgba(255,255,255,0.2)',
      1
    );
    // Plank joint ticks on OSB/Timber deck
    for (let js = 60; js < eavesS; js += 120) {
      const j0 = toWorld(js, 46);
      const j1 = toWorld(js, 64);
      ctx.strokeStyle = 'rgba(25, 12, 4, 0.6)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(j0.x, j0.y);
      ctx.lineTo(j1.x, j1.y);
      ctx.stroke();
    }

    // Barrera de Control de Vapor (n = 64..70)
    if (isRadeco) {
      drawSlopeStrip(
        -40,
        eavesS + 5,
        64,
        70,
        '#2563EB',
        '#93C5FD',
        1
      );
    }

    // =========================================================================
    // 4. LAYER 03: AISLAMIENTO TÉRMICO CONTINUO XPS 100mm (n = 70..134)
    // =========================================================================
    const xpsTopN = isRadeco ? 134 : 74; // In pathology mode, no XPS insulation!
    if (isRadeco) {
      const xpsGrad = ctx.createLinearGradient(
        toWorld(300, 70).x,
        toWorld(300, 70).y,
        toWorld(300, 134).x,
        toWorld(300, 134).y
      );
      xpsGrad.addColorStop(0, '#D99B52');
      xpsGrad.addColorStop(0.5, '#F3C382');
      xpsGrad.addColorStop(1, '#DFAA63');

      drawSlopeStrip(
        -40,
        eavesS + 8,
        70,
        134,
        xpsGrad,
        'rgba(255, 250, 235, 0.45)',
        1.2
      );

      // Tongue-and-groove (machihembrado) stepped joints & cellular diagonal hatching
      ctx.strokeStyle = 'rgba(120, 72, 20, 0.25)';
      ctx.lineWidth = 0.8;
      for (let hs = -20; hs < eavesS; hs += 28) {
        const h0 = toWorld(hs, 72);
        const h1 = toWorld(hs + 18, 132);
        ctx.beginPath();
        ctx.moveTo(h0.x, h0.y);
        ctx.lineTo(h1.x, h1.y);
        ctx.stroke();
      }

      // Stepped machihembrado joint at s = 240 and s = 460
      for (const mj of [220, 450]) {
        const m0 = toWorld(mj, 70);
        const m1 = toWorld(mj, 102);
        const m2 = toWorld(mj + 18, 102);
        const m3 = toWorld(mj + 18, 134);
        ctx.strokeStyle = 'rgba(92, 52, 12, 0.65)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(m0.x, m0.y);
        ctx.lineTo(m1.x, m1.y);
        ctx.lineTo(m2.x, m2.y);
        ctx.lineTo(m3.x, m3.y);
        ctx.stroke();
      }
    }

    // =========================================================================
    // 5. LAYER 04: LÁMINA IMPERMEABLE TRANSPIRABLE W1 (n = xpsTopN .. xpsTopN + 8)
    //    + VIERTEAGUAS DE ZINC EN ALERO + CANALÓN SEMICIRCULAR DE ZINC
    // =========================================================================
    const memTopN = isRadeco ? xpsTopN + 8 : xpsTopN;
    if (isRadeco) {
      drawSlopeStrip(
        -40,
        eavesS + 26,
        xpsTopN,
        memTopN,
        '#0F172A',
        '#38BDF8',
        1.4
      );

      // Thermo-welded seam markers on W1 Membrane
      for (const seamS of [180, 390, 560]) {
        const sm0 = toWorld(seamS - 12, memTopN + 1);
        const sm1 = toWorld(seamS + 12, memTopN + 1);
        ctx.strokeStyle = '#B85D3B';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(sm0.x, sm0.y);
        ctx.lineTo(sm1.x, sm1.y);
        ctx.stroke();
      }
    }

    // 5B. Half-Round Zinc Gutter (Canalón Semicircular de Zinc Natural) & Downspout at Eaves
    const gutterCenter = toWorld(eavesS + 48, memTopN - 12);
    const gutterRadius = 26;

    if (isRadeco) {
      // Zinc Drip Edge Flashing (Babero Vierteaguas de Zinc) curving into the gutter
      const drip0 = toWorld(eavesS - 20, memTopN);
      const drip1 = toWorld(eavesS + 28, memTopN);
      const drip2 = { x: gutterCenter.x - 10, y: gutterCenter.y + 4 };
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(drip0.x, drip0.y);
      ctx.lineTo(drip1.x, drip1.y);
      ctx.lineTo(drip2.x, drip2.y);
      ctx.stroke();
    }

    // Vertical Rainwater Downspout Pipe (Bajante Pluvial de Zinc) running down facade wall
    const pipeX = gutterCenter.x - 6;
    ctx.fillStyle = '#475569';
    ctx.fillRect(pipeX, gutterCenter.y + 18, 14, wallBottomY - gutterCenter.y);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.strokeRect(pipeX, gutterCenter.y + 18, 14, wallBottomY - gutterCenter.y);

    // Semicircular Zinc Gutter Body
    ctx.save();
    ctx.beginPath();
    ctx.arc(gutterCenter.x, gutterCenter.y, gutterRadius, 0, Math.PI, false);
    ctx.lineTo(gutterCenter.x - gutterRadius, gutterCenter.y);
    ctx.closePath();
    const gutterGrad = ctx.createLinearGradient(
      gutterCenter.x - gutterRadius,
      gutterCenter.y,
      gutterCenter.x + gutterRadius,
      gutterCenter.y + gutterRadius
    );
    gutterGrad.addColorStop(0, '#94A3B8');
    gutterGrad.addColorStop(0.5, '#E2E8F0');
    gutterGrad.addColorStop(1, '#64748B');
    ctx.fillStyle = gutterGrad;
    ctx.fill();
    ctx.strokeStyle = '#F8FAFC';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Water Pool inside Zinc Gutter (animated ripple)
    ctx.beginPath();
    ctx.arc(
      gutterCenter.x,
      gutterCenter.y + 2,
      gutterRadius - 4,
      0.15 * Math.PI,
      0.85 * Math.PI,
      false
    );
    ctx.closePath();
    ctx.fillStyle = isRadeco ? 'rgba(56, 189, 248, 0.78)' : 'rgba(56, 189, 248, 0.25)';
    ctx.fill();
    ctx.restore();

    // =========================================================================
    // 6. LAYER 05A: CÁMARA DE MICROVENTILACIÓN 40mm (DOBLE RASTRELADO)
    // =========================================================================
    const chamberBottomN = memTopN;
    const chamberTopN = isRadeco ? memTopN + 34 : memTopN + 12;

    if (isRadeco) {
      // Longitudinal Counter-Batten (Contrarastrel) shaded band
      drawSlopeStrip(
        -40,
        eavesS + 12,
        chamberBottomN,
        chamberBottomN + 16,
        'rgba(196, 140, 84, 0.32)',
        'rgba(218, 165, 108, 0.4)',
        0.8
      );

      // Eaves Ventilation Comb (Peine de alero antipájaros ventilado)
      const combBot = toWorld(eavesS + 14, chamberBottomN);
      const combTop = toWorld(eavesS + 14, chamberTopN + 10);
      ctx.strokeStyle = '#B85D3B';
      ctx.lineWidth = 2.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(combBot.x, combBot.y);
      ctx.lineTo(combTop.x, combTop.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Horizontal Tile Battens (Rastreles portatejas en sección transversal)
    const numCourses = 6;
    const courseSpacing = 112;
    for (let c = 0; c < numCourses; c++) {
      const battenS = 55 + c * courseSpacing;
      drawSlopeStrip(
        battenS - 14,
        battenS + 14,
        chamberTopN - 16,
        chamberTopN,
        '#D49B62',
        '#FDE68A',
        1
      );
    }

    // =========================================================================
    // 7. LAYER 05B: TEJAS CERÁMICAS CURVAS EN CORTE CON SOLAPE REALISTA
    // =========================================================================
    for (let c = numCourses - 1; c >= 0; c--) {
      const tileStartS = 40 + c * courseSpacing;
      const tileEndS = tileStartS + courseSpacing + 28; // 28mm overlap over next tile down-slope!

      // In pathology mode, tile #2 (around s = 264) has a displaced gap allowing water infiltration!
      const isBrokenTile = !isRadeco && c === 2;
      const actualEndS = isBrokenTile ? tileEndS - 22 : tileEndS;

      const tStartBot = toWorld(tileStartS, chamberTopN);
      const tStartTop = toWorld(tileStartS, chamberTopN + 18);
      const tMidTop = toWorld((tileStartS + actualEndS) * 0.5, chamberTopN + 28);
      const tEndTop = toWorld(actualEndS, chamberTopN + 26);
      const tEndBot = toWorld(actualEndS, chamberTopN + 10);
      const tNibBot = toWorld(tileStartS + 10, chamberTopN - 10); // Tile hooking nib behind batten!

      const tileGrad = ctx.createLinearGradient(tStartTop.x, tStartTop.y, tEndBot.x, tEndBot.y);
      tileGrad.addColorStop(0, '#D96B43');
      tileGrad.addColorStop(0.5, '#B85D3B');
      tileGrad.addColorStop(1, '#8C3F23');

      ctx.beginPath();
      ctx.moveTo(tStartBot.x, tStartBot.y);
      ctx.lineTo(tNibBot.x, tNibBot.y);
      ctx.lineTo(toWorld(tileStartS + 18, chamberTopN).x, toWorld(tileStartS + 18, chamberTopN).y);
      ctx.lineTo(tEndBot.x, tEndBot.y);
      ctx.lineTo(tEndTop.x, tEndTop.y);
      ctx.quadraticCurveTo(tMidTop.x, tMidTop.y, tStartTop.x, tStartTop.y);
      ctx.closePath();
      ctx.fillStyle = tileGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 238, 225, 0.45)';
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    // =========================================================================
    // 8. DYNAMIC PHYSICS SIMULATIONS:
    //    A) ASTURIAN RAIN & WATER STREAM FLOWING TO ZINC GUTTER
    //    B) SECONDARY DRAINAGE ON W1 MEMBRANE (OR PATHOLOGY INFILTRATION)
    //    C) CONVECTIVE MICROVENTILATION AIR ARROWS
    //    D) INTERIOR WARM THERMAL WAVES (+21.5°C) REBOUNDING OFF 100mm XPS
    // =========================================================================

    // 8A. Falling Asturian Rain Streaks above the roof
    ctx.save();
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.45)';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    for (let r = 0; r < 28; r++) {
      const cycle = (time * 1.4 + r * 0.17) % 1;
      const rainS = -20 + ((r * 53) % 680);
      const rainN = 320 - cycle * 145;
      const rp0 = toWorld(rainS, rainN);
      const rp1 = { x: rp0.x - 4, y: rp0.y + 18 };
      ctx.beginPath();
      ctx.moveTo(rp0.x, rp0.y);
      ctx.lineTo(rp1.x, rp1.y);
      ctx.stroke();
    }
    ctx.restore();

    // 8B. Continuous Primary Water Stream & Animated Droplets on Tile Surface -> Zinc Gutter
    ctx.save();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3.2;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.65)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    for (let s = 40; s <= eavesS + 38; s += 8) {
      const wave = Math.sin(s * 0.055 - time * 9) * 1.8;
      const pt = toWorld(s, chamberTopN + 27 + wave);
      if (s === 40) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    // Cascade arc into Zinc Gutter
    ctx.lineTo(gutterCenter.x + 2, gutterCenter.y + 4);
    ctx.stroke();

    // Animated glowing water droplets racing down the tile slope into the gutter
    for (let d = 0; d < 9; d++) {
      const dProg = ((time * 0.45 + d / 9) % 1);
      const dS = lerp(45, eavesS + 38, dProg);
      const dPt = toWorld(dS, chamberTopN + 28);
      ctx.fillStyle = '#E0F2FE';
      ctx.beginPath();
      ctx.arc(dPt.x, dPt.y, 3.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Highlighted "Hero Droplet" that tracks the user's scroll `p` from top tile to Zinc Gutter!
    const heroDropletS = lerp(95, eavesS + 42, clamp01(p * 1.08));
    const heroDropletN =
      p > 0.23 && p < 0.52 && isRadeco ? memTopN + 3 : chamberTopN + 29;
    const heroPt =
      heroDropletS <= eavesS + 35
        ? toWorld(heroDropletS, heroDropletN)
        : { x: gutterCenter.x, y: gutterCenter.y };

    // Pulsing tracking reticle around Hero Water Droplet
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(heroPt.x, heroPt.y, 11 + Math.sin(time * 6) * 2.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(heroPt.x, heroPt.y, 5.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 8C. Secondary Drainage on W1 Membrane + Microventilation Air Flow (RADECO Mode)
    //     OR Water Infiltration & Structural Dampness (Pathology Mode)
    if (isRadeco) {
      // Secondary water droplets gliding safely down the W1 Waterproofing Membrane into the Zinc Drip Edge
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      const mStart = toWorld(60, memTopN + 2.5);
      const mEnd = toWorld(eavesS + 25, memTopN + 2.5);
      ctx.beginPath();
      ctx.moveTo(mStart.x, mStart.y);
      ctx.lineTo(mEnd.x, mEnd.y);
      ctx.stroke();
      ctx.setLineDash([]);

      for (let md = 0; md < 6; md++) {
        const mdP = (time * 0.35 + md / 6) % 1;
        const mdS = lerp(70, eavesS + 26, mdP);
        const mdPt = toWorld(mdS, memTopN + 3);
        ctx.fillStyle = '#7DD3FC';
        ctx.beginPath();
        ctx.arc(mdPt.x, mdPt.y, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ascending Convective Microventilation Air Stream inside the 40mm chamber (from eaves to ridge)
      for (let air = 0; air < 5; air++) {
        const airP = 1 - ((time * 0.28 + air / 5) % 1);
        const airS = lerp(65, eavesS - 15, airP);
        const airTail = toWorld(airS + 26, memTopN + 15);
        const airHead = toWorld(airS, memTopN + 15);
        ctx.strokeStyle = 'rgba(167, 243, 208, 0.78)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(airTail.x, airTail.y);
        ctx.lineTo(airHead.x, airHead.y);
        ctx.stroke();

        // Arrowhead pointing up-slope
        ctx.fillStyle = '#6EE7B7';
        ctx.beginPath();
        ctx.arc(airHead.x, airHead.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else {
      // PATHOLOGY MODE: Water infiltrates at displaced tile #2 (s = 320), rots timber & drips into room!
      const leakS = 325;
      const leakTop = toWorld(leakS, chamberTopN + 18);
      const leakMid = toWorld(leakS, 30);

      ctx.save();
      // Red/Blue warning infiltration stream cutting straight through deck & rafter
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(leakTop.x, leakTop.y);
      ctx.lineTo(leakMid.x, leakMid.y);
      ctx.stroke();

      // Damp stain halo on timber rafter
      const stainGrad = ctx.createRadialGradient(
        leakMid.x,
        leakMid.y,
        4,
        leakMid.x,
        leakMid.y,
        58
      );
      stainGrad.addColorStop(0, 'rgba(239, 68, 68, 0.65)');
      stainGrad.addColorStop(0.6, 'rgba(30, 58, 138, 0.55)');
      stainGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = stainGrad;
      ctx.beginPath();
      ctx.arc(leakMid.x, leakMid.y, 58, 0, Math.PI * 2);
      ctx.fill();

      // Water droplets falling from rotted rafter into the home interior!
      for (let drop = 0; drop < 4; drop++) {
        const dp = (time * 0.7 + drop * 0.25) % 1;
        const dropX = leakMid.x + (drop - 1.5) * 12;
        const dropY = leakMid.y + 15 + dp * 135;
        ctx.fillStyle = '#60A5FA';
        ctx.beginPath();
        ctx.arc(dropX, dropY, 3.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Warning Label on Leak Point
      ctx.fillStyle = '#991B1B';
      ctx.fillRect(leakMid.x - 95, leakMid.y + 42, 190, 24);
      ctx.strokeStyle = '#FCA5A5';
      ctx.strokeRect(leakMid.x - 95, leakMid.y + 42, 190, 24);
      ctx.fillStyle = '#FEF2F2';
      ctx.font = '700 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ FILTRACIÓN Y HUMEDAD EN CABIO', leakMid.x, leakMid.y + 57);
      ctx.restore();
    }

    // 8D. Thermal Heat Retention Simulation (+21.5°C Interior Waves rebounding off XPS + Vapor Barrier)
    ctx.save();
    for (let th = 0; th < 4; th++) {
      const thS = 140 + th * 105;
      const bounceCycle = (time * 0.55 + th * 0.25) % 1;

      if (isRadeco) {
        // Warm thermal wave rises from interior (-85) to Vapor Barrier (64) and reflects back down!
        const nPos =
          bounceCycle < 0.5
            ? lerp(-95, 58, bounceCycle * 2)
            : lerp(58, -95, (bounceCycle - 0.5) * 2);
        const thPt = toWorld(thS, nPos);
        const shieldPt = toWorld(thS, 64);

        ctx.strokeStyle = 'rgba(251, 146, 60, 0.65)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(thPt.x, thPt.y, 10, 0, Math.PI, true);
        ctx.stroke();

        // Glowing reflection pulse on the Vapor Barrier / XPS bottom
        if (bounceCycle > 0.4 && bounceCycle < 0.6) {
          ctx.fillStyle = 'rgba(251, 191, 36, 0.85)';
          ctx.beginPath();
          ctx.arc(shieldPt.x, shieldPt.y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // In pathology mode: heat escapes straight out through the uninsulated roof!
        const escapeN = lerp(-80, 220, bounceCycle);
        const escPt = toWorld(thS, escapeN);
        ctx.fillStyle = 'rgba(248, 113, 113, 0.75)';
        ctx.beginPath();
        ctx.arc(escPt.x, escPt.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // =========================================================================
    // 9. IN-SCENE ARCHITECTURAL LAYER CALLOUT ANNOTATIONS
    // =========================================================================
    const drawSceneLabel = (
      s: number,
      n: number,
      dx: number,
      dy: number,
      text: string,
      accentColor: string
    ) => {
      const anchor = toWorld(s, n);
      const boxAnchor = { x: anchor.x + dx, y: anchor.y + dy };

      ctx.save();
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(anchor.x, anchor.y);
      ctx.lineTo(boxAnchor.x, boxAnchor.y);
      ctx.stroke();

      ctx.font = '600 10px monospace';
      const w = ctx.measureText(text).width + 14;
      const bx = dx >= 0 ? boxAnchor.x : boxAnchor.x - w;
      const by = boxAnchor.y - 11;

      ctx.fillStyle = 'rgba(11, 12, 14, 0.92)';
      ctx.fillRect(bx, by, w, 22);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, w, 22);

      ctx.fillStyle = '#F6F5F1';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bx + 7, by + 11);
      ctx.restore();
    };

    drawSceneLabel(
      195,
      chamberTopN + 24,
      36,
      -34,
      '01 · COBERTURA CERÁMICA + ESCORRENTÍA',
      '#38BDF8'
    );

    if (isRadeco) {
      drawSceneLabel(
        335,
        memTopN + 14,
        44,
        -28,
        '02 · CÁMARA VENTILADA 40mm + LÁMINA W1',
        '#6EE7B7'
      );
      drawSceneLabel(
        385,
        102,
        -48,
        36,
        '03 · AISLAMIENTO XPS 100mm + BARRERA VAPOR',
        '#FBBF24'
      );
    }

    drawSceneLabel(
      eavesS + 48,
      memTopN - 12,
      -55,
      46,
      '04 · VIERTEAGUAS Y CANALÓN DE ZINC',
      '#CBD5E1'
    );

    // Interior Comfort Label inside living zone
    const roomLabelPt = toWorld(250, -52);
    ctx.save();
    ctx.font = '700 11px monospace';
    ctx.fillStyle = isRadeco ? '#FBBF24' : '#F87171';
    ctx.fillText(
      isRadeco
        ? 'INTERIOR VIVIENDA: +21,5 °C · CALOR RETENIDO 100%'
        : 'INTERIOR VIVIENDA: 13,8 °C · PÉRDIDA TÉRMICA Y GOTERAS',
      roomLabelPt.x - 110,
      roomLabelPt.y
    );
    ctx.restore();

    ctx.restore(); // End world camera transform
    ctx.restore(); // End DPR scale
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    let lastTs = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      timeRef.current += dt;

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.001) {
        currentProgressRef.current += diff * 0.14;
        const rounded = Math.round(currentProgressRef.current * 100) / 100;
        setScrollProgress((prev) => (prev === rounded ? prev : rounded));
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      drawCrossSection(currentProgressRef.current, timeRef.current);

      if (isVisibleRef.current) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    };

    const startLoopIfVisible = () => {
      if (isVisibleRef.current && rafId === null) {
        lastTs = performance.now();
        rafId = requestAnimationFrame(loop);
      }
    };

    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      targetProgressRef.current = clamp01(-rect.top / scrollable);
      startLoopIfVisible();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = Boolean(entry?.isIntersecting);
        if (isVisibleRef.current) {
          onScroll();
          startLoopIfVisible();
        } else if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { threshold: 0.01 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [drawCrossSection]);

  const activeStage =
    ZOOM_STAGES.find(
      (s, idx) =>
        scrollProgress >= s.range[0] &&
        (scrollProgress < s.range[1] || idx === ZOOM_STAGES.length - 1)
    ) || ZOOM_STAGES[0];

  const isRadeco = mode === 'radeco';

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[280vh] md:h-[340vh] bg-obsidian text-alabaster border-t border-white/10 select-none"
      aria-labelledby="corte-transversal-heading"
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between">
        {/* Background Architectural Grid */}
        <div className="absolute inset-0 bg-arch-grid-dark bg-grid-64 opacity-30 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 60% 50%, rgba(56, 189, 248, 0.08) 0%, rgba(184, 93, 59, 0.08) 45%, rgba(11, 12, 14, 0.96) 100%)',
          }}
        />

        {/* Top Telemetry & Mode Comparison Bar */}
        <div className="relative z-20 pt-20 sm:pt-24 px-4 sm:px-8 max-w-[1440px] w-full mx-auto flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-500/15 border border-sky-400/30 font-mono text-[10px] uppercase tracking-[0.2em] text-sky-300">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>Simulación Pluvial y Térmica en Corte 1:5</span>
            </span>
            <span className="hidden xl:inline font-mono text-xs text-white/50">
              {activeStage.code} · {activeStage.layerFocus}
            </span>
          </div>

          {/* Interactive Toggle: Cubierta RADECO vs Sin Impermeabilizar */}
          <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 border border-white/15">
            <button
              type="button"
              onClick={() => setMode('radeco')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-all ${
                isRadeco
                  ? 'bg-copper text-white font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cubierta RADECO (Estanca)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('pathology')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-all ${
                !isRadeco
                  ? 'bg-red-700 text-white font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Sin Impermeabilizar (Con Filtración)</span>
            </button>
          </div>
        </div>

        {/* Center Main Stage: Left Narrative & Telemetry + Right Cross-Section Zoom Canvas */}
        <div className="relative z-10 flex-1 flex items-center px-4 sm:px-8 max-w-[1440px] w-full mx-auto overflow-hidden">
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Zoom Stage Explanation & Live Sensors */}
            <div className="lg:col-span-5 space-y-4 z-20">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-copper">
                <span>Zoom Microscópico en Tiempo Real</span>
                <span>·</span>
                <span>{Math.round(scrollProgress * 100)}% Recorrido</span>
              </div>

              <h2
                id="corte-transversal-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-[1.12]"
              >
                {activeStage.title}
              </h2>

              <p className="text-xs sm:text-sm text-alabaster/75 leading-relaxed">
                {activeStage.subtitle}
              </p>

              {/* Real-Time Telemetry Sensors (4 Live Cards) */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">
                    <span>Clima Exterior</span>
                    <ThermometerSnowflake className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <p className="font-mono text-xs sm:text-sm font-semibold text-sky-300">
                    8,0 °C · Lluvia Asturias
                  </p>
                </div>

                <div
                  className={`p-3 border transition-colors ${
                    isRadeco
                      ? 'bg-amber-500/10 border-amber-400/30'
                      : 'bg-red-950/50 border-red-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">
                    <span>Temp. Interior</span>
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <p
                    className={`font-mono text-xs sm:text-sm font-semibold ${
                      isRadeco ? 'text-amber-300' : 'text-red-300'
                    }`}
                  >
                    {isRadeco ? '+21,5 °C (Retenido)' : '13,8 °C (Fuga térmica)'}
                  </p>
                </div>

                <div className="p-3 bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">
                    <span>Microventilación</span>
                    <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="font-mono text-xs sm:text-sm font-semibold text-emerald-300">
                    {isRadeco ? 'Cámara 40mm Activa' : 'Sin ventilación (Humedad)'}
                  </p>
                </div>

                <div
                  className={`p-3 border transition-colors ${
                    isRadeco
                      ? 'bg-sky-500/10 border-sky-400/30'
                      : 'bg-red-950/50 border-red-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">
                    <span>Drenaje W1 / Zinc</span>
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <p
                    className={`font-mono text-xs sm:text-sm font-semibold ${
                      isRadeco ? 'text-sky-300' : 'text-red-300'
                    }`}
                  >
                    {isRadeco ? '100% a Canalón Zinc' : '⚠️ Filtración al cabio'}
                  </p>
                </div>
              </div>

              {/* 4-Stage Direct Camera Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                {ZOOM_STAGES.map((st) => {
                  const isCurrent = activeStage.id === st.id;
                  const isDone = scrollProgress >= st.range[1];
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => jumpToStage(st)}
                      className={`px-2.5 py-2 border text-left font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'border-sky-400 bg-sky-500/20 text-white'
                          : isDone
                          ? 'border-white/25 bg-white/[0.06] text-alabaster/90'
                          : 'border-white/10 bg-white/[0.02] text-white/45 hover:border-white/25'
                      }`}
                    >
                      <span className="truncate">{st.code}</span>
                      {isDone && <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: High-DPI Zoom Cross-Section Canvas */}
            <div className="lg:col-span-7 relative w-full h-[44vh] sm:h-[54vh] lg:h-[72vh] flex items-center justify-center border border-white/10 bg-[#0D0F13]/80">
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
                aria-label="Corte constructivo transversal de estanqueidad y aislamiento RADECO"
              />
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="relative z-20 pb-5 px-4 sm:px-8 max-w-[1440px] w-full mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                Deslice para seguir el recorrido de la gota de lluvia hasta el canalón de zinc
              </span>
              <ArrowDown className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
            </div>

            <div className="w-full sm:w-72 h-1.5 bg-white/10 overflow-hidden">
              <div
                className="h-full bg-sky-400 transition-all duration-75"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


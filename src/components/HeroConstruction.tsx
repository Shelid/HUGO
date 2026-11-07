'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowUpRight,
  Eye,
  Layers,
  Shield,
  CheckCircle2,
} from 'lucide-react';

interface StageInfo {
  id: number;
  code: string;
  label: string;
  title: string;
  subtitle: string;
  spec: string;
  thickness: string;
  material: string;
  range: [number, number];
}

const CONSTRUCTION_STAGES: StageInfo[] = [
  {
    id: 1,
    code: 'FASE 01',
    label: 'Estructura Portante',
    title: 'Forjado, hastiales, cumbrera, correas y cabios estructurales',
    subtitle:
      'Replanteo milimétrico de pendientes sobre zuncho perimetral de hormigón, viga cumbrera laminada y 18 cabios portantes C24 con herrajes galvanizados.',
    spec: 'MADERA LAMINADA C24 · HERRAJES GALVANIZADOS',
    thickness: 'Sección 160×80 mm',
    material: 'Cumbrera + correas + 18 cabios C24',
    range: [0.0, 0.17],
  },
  {
    id: 2,
    code: 'FASE 02',
    label: 'Soporte y Vapor',
    title: 'Tablero estructural hidrofugado y barrera de control de vapor',
    subtitle:
      'Entablado continuo machihembrado de arriostramiento fijado mecánicamente y desplegado en rollo de membrana de control higrotérmico.',
    spec: 'TABLERO HIDROFUGADO · CONTROL DE CONDENSACIÓN',
    thickness: 'Tablero 22 mm + film Sd>18m',
    material: 'Soporte continuo + barrera de vapor',
    range: [0.17, 0.34],
  },
  {
    id: 3,
    code: 'FASE 03',
    label: 'Aislamiento XPS',
    title: 'Aislamiento térmico continuo de alta densidad a junta trabada',
    subtitle:
      'Colocación de paneles rígidos machihembrados de poliestireno extruido de 100 mm eliminando el 100% de los puentes térmicos.',
    spec: 'POLIESTIRENO EXTRUIDO XPS · λ 0,033 W/mK',
    thickness: 'Espesor continuo 100 mm',
    material: 'Paneles XPS machihembrados 300 kPa',
    range: [0.34, 0.51],
  },
  {
    id: 4,
    code: 'FASE 04',
    label: 'Impermeabilización',
    title: 'Lámina impermeable transpirable, baberos de zinc y canalón',
    subtitle:
      'Desplegado de membrana multicapa termosellada, resolución estanca de chimenea en zinc natural y canalón perimetral con bajante.',
    spec: 'ESTANQUEIDAD W1 · REMATERÍA EN ZINC NATURAL',
    thickness: 'Membrana tricapa 185 g/m²',
    material: 'Lámina transpirable + zinc + canalón',
    range: [0.51, 0.68],
  },
  {
    id: 5,
    code: 'FASE 05',
    label: 'Cobertura Ventilada',
    title: 'Doble rastrelado ventilado, teja cerámica curva y cumbrera',
    subtitle:
      'Contrarastreles y rastreles creando cámara de microventilación continua, teja cerámica mixta fijada hilada por hilada y cumbrera ventilada.',
    spec: 'CÁMARA VENTILADA 40 mm · TEJA MIXTA / PIZARRA',
    thickness: 'Doble rastrel + teja cerámica',
    material: 'Teja cerámica + cumbrera ventilada',
    range: [0.68, 0.85],
  },
  {
    id: 6,
    code: 'FASE 06',
    label: 'Sello RADECO',
    title: 'Obra finalizada. Precisión que permanece.',
    subtitle: 'Construyendo confianza en el Principado de Asturias, capa por capa.',
    spec: 'GARANTÍA DOCUMENTADA · SELLO DE CALIDAD RADECO',
    thickness: 'Sistema multicapa completo',
    material: 'Certificación técnica RADECO Asturias',
    range: [0.85, 1.0],
  },
];

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function easeOutCubic(t: number): number {
  const c = clamp01(t);
  return 1 - Math.pow(1 - c, 3);
}

interface Vec2 {
  x: number;
  y: number;
}

export function HeroConstruction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [uiProgress, setUiProgress] = useState(0);
  const [inspectMode, setInspectMode] = useState(false);
  const [cutawayOpen, setCutawayOpen] = useState(true);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const cutawayRef = useRef(true);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    cutawayRef.current = cutawayOpen;
  }, [cutawayOpen]);

  // High-Precision 3D Axonometric Architectural Canvas Renderer
  const renderScene = useCallback((p: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(220, rect.width);
    const height = Math.max(180, rect.height);

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.lineJoin = 'round';
    ctx.clearRect(0, 0, width, height);

    // Stage sub-progresses (0..1)
    const pWalls = smoothstep(0.0, 0.06, p);
    const pRafters = smoothstep(0.02, 0.17, p);
    const pDeck = smoothstep(0.16, 0.27, p);
    const pVapor = smoothstep(0.24, 0.34, p);
    const pInsul = smoothstep(0.33, 0.50, p);
    const pMembrane = smoothstep(0.49, 0.61, p);
    const pGutters = smoothstep(0.58, 0.67, p);
    const pBattens = smoothstep(0.66, 0.73, p);
    const pTiles = smoothstep(0.71, 0.84, p);
    const pRidge = smoothstep(0.81, 0.88, p);
    const pFinish = smoothstep(0.86, 0.96, p);

    const isMobile = width < 680;
    const baseScale = Math.min(width / (isMobile ? 9.8 : 11.6), height / (isMobile ? 6.9 : 7.8));
    const zoom = 1 + Math.sin(p * Math.PI) * (isMobile ? 0.035 : 0.055);
    const scale = baseScale * zoom;

    // Smooth cinematic camera orbit as construction progresses
    const yaw = -0.66 + p * 0.15;
    const pitch = 0.53 - p * 0.035;
    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const sinPitch = Math.sin(pitch);
    const cosPitch = Math.cos(pitch);

    const centerX = width * (isMobile ? 0.5 : 0.52);
    const centerY = height * (isMobile ? 0.55 : 0.58);

    const project = (x: number, y: number, z: number): Vec2 => {
      const rx = x * cosYaw - y * sinYaw;
      const ry = x * sinYaw + y * cosYaw;
      return {
        x: centerX + rx * scale,
        y: centerY + (ry * sinPitch - z * cosPitch) * scale,
      };
    };

    const drawPoly = (
      pts: Vec2[],
      fill: string | CanvasGradient,
      stroke?: string,
      lineWidth = 0.75
    ) => {
      if (pts.length < 3) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    };

    const drawLine = (a: Vec2, b: Vec2, color: string, lw = 1, dash?: number[]) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      if (dash) ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();
    };

    const drawPrism = (
      b0: Vec2,
      b1: Vec2,
      b2: Vec2,
      b3: Vec2,
      t0: Vec2,
      t1: Vec2,
      t2: Vec2,
      t3: Vec2,
      topColor: string | CanvasGradient,
      frontLeftColor: string,
      frontRightColor: string,
      strokeColor = 'rgba(255,255,255,0.12)'
    ) => {
      drawPoly([b0, b1, t1, t0], frontLeftColor, strokeColor, 0.55);
      drawPoly([b1, b2, t2, t1], frontRightColor, strokeColor, 0.55);
      drawPoly([b3, b0, t0, t3], frontLeftColor, strokeColor, 0.55);
      drawPoly([t0, t1, t2, t3], topColor, strokeColor, 0.7);
    };

    // Roof Geometry Constants (in meters)
    const L = 3.9; // Half-length along ridge (7.80m total)
    const W = 3.1; // Half-span (6.20m total)
    const wallH = 1.08; // Eaves wall height above slab
    const ridgeH = 2.68; // Ridge height above slab
    const slopeRise = ridgeH - wallH; // 1.60m rise

    const slopePoint = (side: -1 | 1, u: number, s: number, hOffset = 0): Vec2 => {
      const y = side * s * W;
      const z = ridgeH - s * slopeRise + hOffset;
      return project(u, y, z);
    };

    const drawSlopeSlab = (
      side: -1 | 1,
      u0: number,
      u1: number,
      s0: number,
      s1: number,
      zBase: number,
      zTop: number,
      topColor: string | CanvasGradient,
      sideXColor: string,
      eavesColor: string,
      strokeColor = 'rgba(255,255,255,0.14)'
    ) => {
      const b0 = slopePoint(side, u0, s0, zBase);
      const b1 = slopePoint(side, u0, s1, zBase);
      const b2 = slopePoint(side, u1, s1, zBase);
      const b3 = slopePoint(side, u1, s0, zBase);

      const t0 = slopePoint(side, u0, s0, zTop);
      const t1 = slopePoint(side, u0, s1, zTop);
      const t2 = slopePoint(side, u1, s1, zTop);
      const t3 = slopePoint(side, u1, s0, zTop);

      if (side === -1) {
        drawPoly([b0, b1, t1, t0], sideXColor, strokeColor, 0.5);
        drawPoly([b3, b2, t2, t3], sideXColor, strokeColor, 0.55);
        drawPoly([b1, b2, t2, t1], eavesColor, strokeColor, 0.6);
      } else {
        drawPoly([b0, b3, t3, t0], eavesColor, strokeColor, 0.5);
        drawPoly([b3, b2, t2, t3], sideXColor, strokeColor, 0.6);
        drawPoly([b1, b2, t2, t1], eavesColor, strokeColor, 0.5);
      }
      drawPoly([t0, t1, t2, t3], topColor, strokeColor, 0.65);
      // Subtle studio bevel highlight along front-top edge for realistic 3D definition
      drawLine(t1, t2, 'rgba(255,255,255,0.16)', 0.65);
    };

    // Helper: Draw a Realistic 3D Cylindrical Roll on the slope at u = rollU from s0 to s1
    const drawCylinderRollOnSlope = (
      side: -1 | 1,
      rollU: number,
      s0: number,
      s1: number,
      zCenter: number,
      radius: number,
      bodyColor: string,
      highlightColor: string,
      endCapColor: string
    ) => {
      const topCenter = slopePoint(side, rollU, s0, zCenter);
      const botCenter = slopePoint(side, rollU, s1, zCenter);
      const rPx = Math.max(4, radius * scale * 0.85);

      // Shadow under roll
      drawLine(
        slopePoint(side, rollU + 0.04, s0, zCenter - radius * 0.7),
        slopePoint(side, rollU + 0.04, s1, zCenter - radius * 0.7),
        'rgba(0,0,0,0.45)',
        rPx * 1.6
      );

      // Main cylinder body
      ctx.save();
      ctx.strokeStyle = bodyColor;
      ctx.lineWidth = rPx * 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(topCenter.x, topCenter.y);
      ctx.lineTo(botCenter.x, botCenter.y);
      ctx.stroke();

      // Specular highlight along top of cylinder
      ctx.strokeStyle = highlightColor;
      ctx.lineWidth = rPx * 0.65;
      ctx.beginPath();
      ctx.moveTo(topCenter.x - 1, topCenter.y - 1.5);
      ctx.lineTo(botCenter.x - 1, botCenter.y - 1.5);
      ctx.stroke();

      // Front End-Cap of the Roll (at s1 eaves end) with hollow cardboard/plastic core
      ctx.fillStyle = endCapColor;
      ctx.beginPath();
      ctx.arc(botCenter.x, botCenter.y, rPx, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.fillStyle = '#0B0C0E';
      ctx.beginPath();
      ctx.arc(botCenter.x, botCenter.y, rPx * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // =========================================================================
    // 0. ARCHITECTURAL EXHIBITION PLINTH & CAD TELEMETRY GRID
    // =========================================================================
    ctx.save();
    // Deep ambient drop shadow
    drawPoly(
      [
        project(-L - 0.75, -W - 0.75, -0.18),
        project(L + 0.75, -W - 0.75, -0.18),
        project(L + 0.75, W + 0.75, -0.18),
        project(-L - 0.75, W + 0.75, -0.18),
      ],
      'rgba(0, 0, 0, 0.55)'
    );

    // 3D Architectural Exhibition Base Pedestal
    const pExt = 0.45;
    drawPrism(
      project(-L - pExt, -W - pExt, -0.14),
      project(L + pExt, -W - pExt, -0.14),
      project(L + pExt, W + pExt, -0.14),
      project(-L - pExt, W + pExt, -0.14),
      project(-L - pExt, -W - pExt, 0),
      project(L + pExt, -W - pExt, 0),
      project(L + pExt, W + pExt, 0),
      project(-L - pExt, W + pExt, 0),
      '#16181E',
      '#101217',
      '#0B0D11',
      'rgba(184, 93, 59, 0.28)'
    );

    // Subtle CAD grid lines on plinth
    const gridExtentX = L + 1.05;
    const gridExtentY = W + 1.05;
    for (let gx = -gridExtentX; gx <= gridExtentX + 0.01; gx += 0.85) {
      drawLine(
        project(gx, -gridExtentY, 0),
        project(gx, gridExtentY, 0),
        'rgba(246, 245, 241, 0.06)',
        0.8
      );
    }
    for (let gy = -gridExtentY; gy <= gridExtentY + 0.01; gy += 0.8) {
      drawLine(
        project(-gridExtentX, gy, 0),
        project(gridExtentX, gy, 0),
        'rgba(246, 245, 241, 0.06)',
        0.8
      );
    }

    // Technical Dimension Lines & Labels
    const dimA = project(-L, -W - 0.72, 0);
    const dimB = project(L, -W - 0.72, 0);
    drawLine(dimA, dimB, 'rgba(184, 93, 59, 0.55)', 1);
    drawLine(project(-L, -W - 0.52, 0), project(-L, -W - 0.85, 0), 'rgba(184, 93, 59, 0.55)', 1);
    drawLine(project(L, -W - 0.52, 0), project(L, -W - 0.85, 0), 'rgba(184, 93, 59, 0.55)', 1);

    const dimMid = project(0, -W - 0.95, 0);
    ctx.fillStyle = 'rgba(246, 245, 241, 0.58)';
    ctx.font = '600 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('7.80 m · LONGITUD DE CUMBRERA', dimMid.x, dimMid.y);

    const dimSpanA = project(L + 0.72, -W, 0);
    const dimSpanB = project(L + 0.72, W, 0);
    drawLine(dimSpanA, dimSpanB, 'rgba(184, 93, 59, 0.55)', 1);
    const dimSpanMid = project(L + 0.96, 0, 0);
    ctx.fillText('6.20 m · LUZ', dimSpanMid.x, dimSpanMid.y);
    ctx.restore();

    // =========================================================================
    // 1. FORJADO DE HORMIGÓN, MUROS DE CARGA Y HASTIALES CON VENTANA (FASE 01)
    // =========================================================================
    const wallRise = easeOutCubic(pWalls);
    const curWallH = wallH * wallRise;
    const curRidgeH = ridgeH * wallRise;
    const slabH = 0.24;

    // 1A. Reinforced Concrete Floor Slab (Forjado superior)
    drawPrism(
      project(-L, -W, 0),
      project(L, -W, 0),
      project(L, W, 0),
      project(-L, W, 0),
      project(-L, -W, slabH),
      project(L, -W, slabH),
      project(L, W, slabH),
      project(-L, W, slabH),
      '#2B2F37',
      '#20232A',
      '#17191F',
      'rgba(255,255,255,0.18)'
    );

    if (wallRise > 0.02) {
      const wallThick = 0.28;

      // Back-Right longitudinal eaves wall
      drawPrism(
        project(-L, W - wallThick, slabH),
        project(L, W - wallThick, slabH),
        project(L, W, slabH),
        project(-L, W, slabH),
        project(-L, W - wallThick, curWallH),
        project(L, W - wallThick, curWallH),
        project(L, W, curWallH),
        project(-L, W, curWallH),
        '#3A3F48',
        '#262A32',
        '#1D2027',
        'rgba(255,255,255,0.14)'
      );

      // Back-Left Gable Wall (X = -L)
      const gL0 = project(-L, -W, slabH);
      const gL1 = project(-L, -W, curWallH);
      const gL2 = project(-L, 0, curRidgeH);
      const gL3 = project(-L, W, curWallH);
      const gL4 = project(-L, W, slabH);

      const gLi0 = project(-L + wallThick, -W, slabH);
      const gLi1 = project(-L + wallThick, -W, curWallH);
      const gLi2 = project(-L + wallThick, 0, curRidgeH);
      const gLi3 = project(-L + wallThick, W, curWallH);
      const gLi4 = project(-L + wallThick, W, slabH);

      drawPoly([gL0, gL1, gL2, gL3, gL4], '#232730', 'rgba(255,255,255,0.15)', 0.7);
      drawPoly([gLi0, gLi1, gLi2, gLi3, gLi4], '#2D323C', 'rgba(255,255,255,0.15)', 0.7);
      drawPoly([gL1, gLi1, gLi2, gL2], '#3E434F', 'rgba(255,255,255,0.2)', 0.7);
      drawPoly([gL2, gLi2, gLi3, gL3], '#333842', 'rgba(255,255,255,0.18)', 0.7);

      // Internal central load-bearing spine wall with structural piers
      drawPrism(
        project(-L + wallThick, -0.14, slabH),
        project(L - wallThick, -0.14, slabH),
        project(L - wallThick, 0.14, slabH),
        project(-L + wallThick, 0.14, slabH),
        project(-L + wallThick, -0.14, slabH + (curRidgeH - slabH) * 0.52),
        project(L - wallThick, -0.14, slabH + (curRidgeH - slabH) * 0.52),
        project(L - wallThick, 0.14, slabH + (curRidgeH - slabH) * 0.52),
        project(-L + wallThick, 0.14, slabH + (curRidgeH - slabH) * 0.52),
        '#323640',
        '#252932',
        '#1B1E25',
        'rgba(255,255,255,0.12)'
      );

      // Front-Left longitudinal eaves wall (Y = -W)
      drawPrism(
        project(-L, -W, slabH),
        project(L, -W, slabH),
        project(L, -W + wallThick, slabH),
        project(-L, -W + wallThick, slabH),
        project(-L, -W, curWallH),
        project(L, -W, curWallH),
        project(L, -W + wallThick, curWallH),
        project(-L, -W + wallThick, curWallH),
        '#464B57',
        '#313640',
        '#252932',
        'rgba(255,255,255,0.2)'
      );

      // Horizontal ashlar stone/formwork coursing lines on Front-Left facade wall
      for (const zCourse of [0.48, 0.72, 0.94]) {
        if (curWallH > zCourse) {
          drawLine(
            project(-L, -W, zCourse),
            project(L, -W, zCourse),
            'rgba(255,255,255,0.08)',
            0.7
          );
        }
      }

      // Eaves overhang shadow cast onto Front-Left facade wall when roof deck/tiles exist
      if (pDeck > 0.2) {
        const shH = Math.min(0.22, pDeck * 0.14 + pTiles * 0.08);
        drawPoly(
          [
            project(-L, -W, curWallH - shH),
            project(L, -W, curWallH - shH),
            project(L, -W, curWallH),
            project(-L, -W, curWallH),
          ],
          'rgba(8, 9, 12, 0.55)'
        );
      }

      // Front-Right Gable Wall (X = +L) — Main visible architectural facade
      const gR0 = project(L, -W, slabH);
      const gR1 = project(L, -W, curWallH);
      const gR2 = project(L, 0, curRidgeH);
      const gR3 = project(L, W, curWallH);
      const gR4 = project(L, W, slabH);

      const gRi1 = project(L - wallThick, -W, curWallH);
      const gRi2 = project(L - wallThick, 0, curRidgeH);
      const gRi3 = project(L - wallThick, W, curWallH);

      drawPoly([gRi1, gR1, gR2, gRi2], '#484E5A', 'rgba(255,255,255,0.22)', 0.7);
      drawPoly([gRi2, gR2, gR3, gRi3], '#373C46', 'rgba(255,255,255,0.18)', 0.7);

      // Gradient fill on main gable wall for realistic architectural lighting
      const gradGable = ctx.createLinearGradient(gR2.x, gR2.y, gR0.x, gR0.y);
      gradGable.addColorStop(0, '#323742');
      gradGable.addColorStop(1, '#1F232B');
      drawPoly([gR0, gR1, gR2, gR3, gR4], gradGable, 'rgba(255,255,255,0.24)', 0.85);

      //Coursing lines on Front-Right gable wall
      for (const zC of [0.55, 0.90, 1.25, 1.60, 1.95]) {
        if (curRidgeH > zC + 0.15) {
          const ratio = Math.max(0, (zC - curWallH) / Math.max(0.01, curRidgeH - curWallH));
          const spanY = zC <= curWallH ? W : W * (1 - ratio);
          drawLine(
            project(L, -spanY, zC),
            project(L, spanY, zC),
            'rgba(255,255,255,0.07)',
            0.7
          );
        }
      }

      // Recessed Architectural Attic Window on Front-Right Gable Wall
      if (wallRise > 0.85) {
        const wy0 = -0.48;
        const wy1 = 0.48;
        const wz0 = 1.15;
        const wz1 = 1.88;
        // Deep window recess frame
        drawPoly(
          [
            project(L, wy0, wz0),
            project(L, wy1, wz0),
            project(L, wy1, wz1),
            project(L, wy0, wz1),
          ],
          '#12151B',
          'rgba(246, 245, 241, 0.35)',
          1.1
        );
        // Warm interior architectural amber glow
        drawPoly(
          [
            project(L - 0.06, wy0 + 0.05, wz0 + 0.05),
            project(L - 0.06, wy1 - 0.05, wz0 + 0.05),
            project(L - 0.06, wy1 - 0.05, wz1 - 0.05),
            project(L - 0.06, wy0 + 0.05, wz1 - 0.05),
          ],
          'rgba(217, 155, 92, 0.28)',
          'rgba(184, 93, 59, 0.5)',
          0.8
        );
        // Window mullion crossbars
        drawLine(
          project(L, 0, wz0),
          project(L, 0, wz1),
          'rgba(246, 245, 241, 0.35)',
          1
        );
        drawLine(
          project(L, wy0, (wz0 + wz1) * 0.5),
          project(L, wy1, (wz0 + wz1) * 0.5),
          'rgba(246, 245, 241, 0.35)',
          1
        );
      }
    }

    // =========================================================================
    // 2. FASE 01: VIGA CUMBRERA, CORREAS INTERMEDIAS Y 18 CABIOS C24 CON HERRAJES
    // =========================================================================
    if (pRafters > 0.005) {
      const ridgeDrop = (1 - easeOutCubic(clamp01(pRafters * 2.3))) * 0.75;
      const plateZ = wallH + ridgeDrop * 0.35;

      // Timber Wall Plates (Durmientes sobre muros de alero)
      drawPrism(
        project(-L, -W, plateZ),
        project(L, -W, plateZ),
        project(L, -W + 0.16, plateZ),
        project(-L, -W + 0.16, plateZ),
        project(-L, -W, plateZ + 0.08),
        project(L, -W, plateZ + 0.08),
        project(L, -W + 0.16, plateZ + 0.08),
        project(-L, -W + 0.16, plateZ + 0.08),
        '#C9935E',
        '#9E6E3F',
        '#7A522C',
        'rgba(0,0,0,0.4)'
      );

      // Intermediate Purlins (Correas intermedias a media pendiente s = 0.52)
      for (const side of [1, -1] as const) {
        const purlinY = side * 0.52 * W;
        const purlinZ = ridgeH - 0.52 * slopeRise - 0.09 + ridgeDrop * 0.6;
        drawPrism(
          project(-L, purlinY - 0.07, purlinZ),
          project(L, purlinY - 0.07, purlinZ),
          project(L, purlinY + 0.07, purlinZ),
          project(-L, purlinY + 0.07, purlinZ),
          project(-L, purlinY - 0.07, purlinZ + 0.11),
          project(L, purlinY - 0.07, purlinZ + 0.11),
          project(L, purlinY + 0.07, purlinZ + 0.11),
          project(-L, purlinY + 0.07, purlinZ + 0.11),
          '#CE9862',
          '#A16F40',
          '#7C532C',
          'rgba(0,0,0,0.35)'
        );
      }

      // Heavy Glulam Ridge Beam (Viga Cumbrera Laminada 24x32cm)
      const rBeamZ0 = ridgeH - 0.18 + ridgeDrop;
      const rBeamZ1 = ridgeH + 0.04 + ridgeDrop;
      drawPrism(
        project(-L, -0.11, rBeamZ0),
        project(L, -0.11, rBeamZ0),
        project(L, 0.11, rBeamZ0),
        project(-L, 0.11, rBeamZ0),
        project(-L, -0.11, rBeamZ1),
        project(L, -0.11, rBeamZ1),
        project(L, 0.11, rBeamZ1),
        project(-L, 0.11, rBeamZ1),
        '#E2AC76',
        '#B87F4A',
        '#8E5E32',
        'rgba(255,255,255,0.25)'
      );

      // Glulam lamination lines along ridge beam
      drawLine(
        project(-L, -0.11, (rBeamZ0 + rBeamZ1) * 0.5),
        project(L, -0.11, (rBeamZ0 + rBeamZ1) * 0.5),
        'rgba(90, 52, 22, 0.45)',
        0.8
      );

      // 9 Rafter Pairs (18 Cabios estructurales C24)
      const numRafters = 9;
      const rafterHalfW = 0.058;
      const rafterH = 0.125;

      for (const side of [1, -1] as const) {
        for (let i = 0; i < numRafters; i++) {
          const itemStart = 0.06 + (i / numRafters) * 0.72;
          const itemP = easeOutCubic(clamp01((pRafters - itemStart) / 0.22));
          if (itemP <= 0.01) continue;

          const uCenter = -L + 0.2 + (i / (numRafters - 1)) * (2 * L - 0.4);
          const u0 = uCenter - rafterHalfW;
          const u1 = uCenter + rafterHalfW;
          const lift = (1 - itemP) * 0.85;

          drawSlopeSlab(
            side,
            u0,
            u1,
            0.02,
            1.04,
            lift,
            rafterH + lift,
            side === -1 ? '#E3AE78' : '#C7915C',
            '#9A693B',
            '#6E4823',
            'rgba(40,22,8,0.5)'
          );

          // Galvanized Steel Joist Hangers (Estribos metálicos) at ridge & eaves
          if (itemP > 0.85) {
            const brkTop = slopePoint(side, uCenter, 0.035, rafterH + 0.005);
            const brkBot = slopePoint(side, uCenter, 0.98, rafterH + 0.005);
            ctx.fillStyle = '#CBD5E1';
            ctx.fillRect(brkTop.x - 2.2, brkTop.y - 2.2, 4.4, 4.4);
            ctx.fillStyle = '#94A3B8';
            ctx.fillRect(brkBot.x - 2, brkBot.y - 2, 4, 4);
          }
        }
      }
    }

    const showCutaway = cutawayRef.current;

    // =========================================================================
    // 3. FASE 02: TABLERO ESTRUCTURAL HIDROFUGADO & BARRERA DE VAPOR EN ROLLO 3D
    // =========================================================================
    const deckBaseZ = 0.125;
    const deckTopZ = 0.162;

    if (pDeck > 0.005) {
      const numPlanks = 6;
      for (const side of [1, -1] as const) {
        for (let r = 0; r < numPlanks; r++) {
          const startP = (r / numPlanks) * 0.75;
          const plankP = easeOutCubic(clamp01((pDeck - startP) / 0.28));
          if (plankP <= 0.01) continue;

          const s1 = 1.01 - (r / numPlanks) * 0.99;
          const s0 = 1.01 - ((r + 1) / numPlanks) * 0.99;
          const drop = (1 - plankP) * 0.5;

          const uMax =
            side === -1 && showCutaway && r < 2 ? L * (0.64 + (1 - pFinish) * 0.08) : L;

          drawSlopeSlab(
            side,
            -L,
            uMax,
            s0,
            s1,
            deckBaseZ + drop,
            deckTopZ + drop,
            side === -1 ? '#94683E' : '#75502D',
            '#5E3E20',
            '#422B14',
            'rgba(255,255,255,0.18)'
          );

          // Vertical board joint lines along plank row
          if (plankP > 0.85) {
            for (const jU of [-1.95, 0.0, 1.95]) {
              if (jU < uMax - 0.2) {
                drawLine(
                  slopePoint(side, jU, s0, deckTopZ + 0.002),
                  slopePoint(side, jU, s1, deckTopZ + 0.002),
                  'rgba(30, 16, 6, 0.45)',
                  0.8
                );
              }
            }
          }
        }
      }
    }

    // 3B. Barrera de control de vapor con rollo cilíndrico 3D
    const vaporTopZ = 0.174;
    if (pVapor > 0.005) {
      const unrollRatio = easeOutCubic(pVapor);
      for (const side of [1, -1] as const) {
        const targetUMax = side === -1 && showCutaway ? L * 0.72 : L;
        const curU = -L + (targetUMax - -L) * unrollRatio;

        drawSlopeSlab(
          side,
          -L,
          curU,
          0.02,
          1.0,
          deckTopZ,
          vaporTopZ,
          side === -1 ? 'rgba(68, 118, 172, 0.88)' : 'rgba(48, 88, 132, 0.88)',
          '#2C5278',
          '#1E3A56',
          'rgba(147, 197, 253, 0.38)'
        );

        // Technical grid lines on vapor barrier
        for (const sGrid of [0.33, 0.66]) {
          drawLine(
            slopePoint(side, -L, sGrid, vaporTopZ + 0.002),
            slopePoint(side, curU, sGrid, vaporTopZ + 0.002),
            'rgba(191, 219, 254, 0.28)',
            0.8,
            [4, 4]
          );
        }

        if (unrollRatio > 0.02 && unrollRatio < 0.98) {
          drawCylinderRollOnSlope(
            side,
            curU,
            0.03,
            0.99,
            vaporTopZ + 0.045,
            0.055,
            '#3B82F6',
            '#BFDBFE',
            '#1D4ED8'
          );
        }
      }
    }

    // =========================================================================
    // 4. FASE 03: AISLAMIENTO TÉRMICO CONTINUO XPS 100mm MACHIHEMBRADO 3D
    // =========================================================================
    const insulBaseZ = vaporTopZ;
    const insulTopZ = vaporTopZ + 0.145; // Prominent 3D thermal insulation thickness

    if (pInsul > 0.005) {
      const rows = 4;
      const cols = 6;

      for (const side of [1, -1] as const) {
        for (let r = 0; r < rows; r++) {
          const s0 = 0.02 + (r / rows) * 0.97;
          const s1 = 0.02 + ((r + 1) / rows) * 0.97;

          for (let c = 0; c < cols; c++) {
            if (side === -1 && showCutaway && r >= 2 && c >= 4) {
              continue;
            }

            const idx = r * cols + c;
            const totalBlocks = rows * cols;
            const blockStart = (idx / totalBlocks) * 0.76;
            const blockP = easeOutCubic(clamp01((pInsul - blockStart) / 0.24));
            if (blockP <= 0.01) continue;

            const uStep = (2 * L) / cols;
            const u0 = -L + c * uStep + 0.012;
            const u1 = -L + (c + 1) * uStep - 0.012;
            const drop = (1 - blockP) * 0.6;

            // Draw stepped tongue-and-groove (machihembrado) lip on lower half of panel
            const midZ = insulBaseZ + (insulTopZ - insulBaseZ) * 0.5 + drop;
            drawSlopeSlab(
              side,
              u0 + 0.02,
              u1 + 0.025,
              s0 + 0.01,
              s1 + 0.012,
              insulBaseZ + drop,
              midZ,
              '#B88244',
              '#8F6029',
              '#70491B',
              'rgba(0,0,0,0.25)'
            );

            // Main thick XPS panel body
            drawSlopeSlab(
              side,
              u0,
              u1,
              s0 + 0.006,
              s1 - 0.006,
              insulBaseZ + drop,
              insulTopZ + drop,
              side === -1 ? '#F0BE7D' : '#CF9A5B',
              '#B57F40',
              '#8F6029',
              'rgba(255, 250, 240, 0.42)'
            );
          }
        }
      }
    }

    // =========================================================================
    // 5. FASE 04: IMPERMEABILIZACIÓN MULTICAPA + CANALONES DE ZINC CON BAJANTE
    // =========================================================================
    const memBaseZ = insulTopZ;
    const memTopZ = insulTopZ + 0.024;

    if (pMembrane > 0.005) {
      const memRatio = easeOutCubic(pMembrane);
      const strips = 3;

      for (const side of [1, -1] as const) {
        for (let st = 0; st < strips; st++) {
          const stripStart = st * 0.24;
          const stP = easeOutCubic(clamp01((memRatio - stripStart) / 0.52));
          if (stP <= 0.01) continue;

          const s1 = 1.0 - (st / strips) * 0.97;
          const s0 = 1.0 - ((st + 1) / strips) * 0.97;

          const maxU = side === -1 && showCutaway && st <= 1 ? L * 0.46 : L;
          const curU = -L + (maxU - -L) * stP;

          drawSlopeSlab(
            side,
            -L,
            curU,
            s0,
            s1,
            memBaseZ,
            memTopZ,
            side === -1 ? '#1C2430' : '#141A23',
            '#0E131A',
            '#2B3748',
            'rgba(96, 165, 250, 0.35)'
          );

          // Thermo-welded overlap seam strip (banda de solape termosellada)
          if (st > 0) {
            drawLine(
              slopePoint(side, -L, s1, memTopZ + 0.004),
              slopePoint(side, curU, s1, memTopZ + 0.004),
              'rgba(184, 93, 59, 0.9)',
              1.8,
              [6, 3]
            );
          }

          if (stP > 0.02 && stP < 0.97) {
            drawCylinderRollOnSlope(
              side,
              curU,
              s0 + 0.01,
              s1 - 0.01,
              memTopZ + 0.05,
              0.06,
              '#1E293B',
              '#60A5FA',
              '#334155'
            );
          }
        }
      }
    }

    // 5B. 3D Zinc Eaves Gutter, Bracket Straps & Vertical Rainwater Downspout
    if (pGutters > 0.01) {
      const gP = easeOutCubic(pGutters);
      const gShift = (1 - gP) * 0.32;

      // Zinc Eaves Drip Flashing (Vierteaguas de alero en zinc)
      drawSlopeSlab(
        -1,
        -L,
        L,
        0.97,
        1.03,
        memBaseZ - gShift,
        memTopZ + 0.012 - gShift,
        '#94A3B8',
        '#64748B',
        '#475569',
        'rgba(255,255,255,0.35)'
      );

      // 3D Zinc Perimeter Gutter Channel (Canalón de zinc natural)
      drawSlopeSlab(
        -1,
        -L,
        L,
        1.02,
        1.085,
        memBaseZ - 0.055 - gShift,
        memTopZ + 0.025 - gShift,
        '#CBD5E1',
        '#64748B',
        '#475569',
        'rgba(255,255,255,0.45)'
      );

      // Dark inner trough of the gutter
      drawSlopeSlab(
        -1,
        -L + 0.05,
        L - 0.05,
        1.032,
        1.072,
        memTopZ + 0.02 - gShift,
        memTopZ + 0.027 - gShift,
        '#1E293B',
        '#1E293B',
        '#1E293B'
      );

      // Gutter support brackets (gafas de sujeción cada 95cm)
      for (let bu = -L + 0.4; bu <= L - 0.3; bu += 0.95) {
        const bPt1 = slopePoint(-1, bu, 1.02, memTopZ + 0.028 - gShift);
        const bPt2 = slopePoint(-1, bu, 1.085, memTopZ + 0.028 - gShift);
        drawLine(bPt1, bPt2, '#E2E8F0', 1.6);
      }

      // Vertical Zinc Downspout (Bajante pluvial en esquina frontal)
      if (gP > 0.5) {
        const dsX = L - 0.14;
        const dsY = -W - 0.08;
        const dsTop = project(dsX, dsY, wallH + 0.08);
        const dsBot = project(dsX, dsY, slabH);
        drawLine(dsTop, dsBot, '#475569', 6);
        drawLine(dsTop, dsBot, '#CBD5E1', 2.2);
      }
    }

    // =========================================================================
    // 6. CHIMENEA DE OBRA CON BABERO PERIMETRAL DE ZINC Y SOMBRERETE
    // =========================================================================
    if (wallRise > 0.2) {
      const cx0 = -1.55;
      const cx1 = -0.82;
      const cy0 = 0.72;
      const cy1 = 1.45;
      const chBaseZ = ridgeH - 0.34 * slopeRise;
      const chTopZ = ridgeH + 0.56;

      // Stepped Copper/Zinc Flashing Apron around Chimney Base (Fase 04)
      if (pMembrane > 0.35) {
        const flashP = easeOutCubic(clamp01((pMembrane - 0.35) / 0.5));
        ctx.save();
        ctx.globalAlpha = flashP;
        drawPrism(
          project(cx0 - 0.14, cy0 - 0.14, chBaseZ + 0.08),
          project(cx1 + 0.14, cy0 - 0.14, chBaseZ + 0.08),
          project(cx1 + 0.14, cy1 + 0.14, chBaseZ - 0.14),
          project(cx0 - 0.14, cy1 + 0.14, chBaseZ - 0.14),
          project(cx0 - 0.14, cy0 - 0.14, chBaseZ + 0.38),
          project(cx1 + 0.14, cy0 - 0.14, chBaseZ + 0.38),
          project(cx1 + 0.14, cy1 + 0.14, chBaseZ + 0.2),
          project(cx0 - 0.14, cy1 + 0.14, chBaseZ + 0.2),
          '#B85D3B',
          '#9A4829',
          '#7C381E',
          'rgba(255,255,255,0.4)'
        );
        ctx.restore();
      }

      // Chimney Masonry Shaft
      drawPrism(
        project(cx0, cy0, chBaseZ),
        project(cx1, cy0, chBaseZ),
        project(cx1, cy1, chBaseZ - 0.15),
        project(cx0, cy1, chBaseZ - 0.15),
        project(cx0, cy0, chTopZ),
        project(cx1, cy0, chTopZ),
        project(cx1, cy1, chTopZ),
        project(cx0, cy1, chTopZ),
        '#4B505C',
        '#363B44',
        '#262A31',
        'rgba(255,255,255,0.25)'
      );

      // Chimney Crown & Flue Pipes
      drawPrism(
        project(cx0 - 0.07, cy0 - 0.07, chTopZ),
        project(cx1 + 0.07, cy0 - 0.07, chTopZ),
        project(cx1 + 0.07, cy1 + 0.07, chTopZ),
        project(cx0 - 0.07, cy1 + 0.07, chTopZ),
        project(cx0 - 0.07, cy0 - 0.07, chTopZ + 0.08),
        project(cx1 + 0.07, cy0 - 0.07, chTopZ + 0.08),
        project(cx1 + 0.07, cy1 + 0.07, chTopZ + 0.08),
        project(cx0 - 0.07, cy1 + 0.07, chTopZ + 0.08),
        '#CBD5E1',
        '#94A3B8',
        '#64748B',
        'rgba(255,255,255,0.35)'
      );
    }

    // =========================================================================
    // 7. FASE 05A: DOBLE RASTRELADO VENTILADO (CONTRARASTRELES + RASTRELES 3D)
    // =========================================================================
    const counterBattenTopZ = memTopZ + 0.025;
    const battenBaseZ = counterBattenTopZ;
    const battenTopZ = counterBattenTopZ + 0.032;

    if (pBattens > 0.005) {
      const cbP = easeOutCubic(clamp01(pBattens * 1.6));
      const hbP = easeOutCubic(clamp01((pBattens - 0.25) / 0.75));

      for (const side of [1, -1] as const) {
        // 7A. Vertical Counter-Battens (Contrarastreles siguiendo la línea de los cabios)
        const numCB = 9;
        for (let i = 0; i < numCB; i++) {
          const uCenter = -L + 0.2 + (i / (numCB - 1)) * (2 * L - 0.4);
          if (side === -1 && showCutaway && i >= 6) continue;

          drawSlopeSlab(
            side,
            uCenter - 0.03,
            uCenter + 0.03,
            0.03,
            0.03 + 0.95 * cbP,
            memTopZ,
            counterBattenTopZ,
            '#C88E55',
            '#9A6836',
            '#734B22',
            'rgba(0,0,0,0.3)'
          );
        }

        // 7B. Horizontal Tile Battens (Rastreles horizontales portatejas)
        if (hbP > 0.01) {
          const numHorizBattens = 8;
          for (let b = 0; b < numHorizBattens; b++) {
            const sPos = 0.05 + (b / (numHorizBattens - 1)) * 0.92;
            const maxU = side === -1 && showCutaway && b >= 3 ? L * 0.32 : L;
            const curU = -L + (maxU - -L) * hbP;

            drawSlopeSlab(
              side,
              -L,
              curU,
              sPos - 0.014,
              sPos + 0.014,
              battenBaseZ,
              battenTopZ,
              '#DFAA73',
              '#B07B46',
              '#85582C',
              'rgba(0,0,0,0.35)'
            );
          }
        }
      }
    }

    // =========================================================================
    // 8. FASE 05B: COBERTURA DE TEJA CERÁMICA CURVA / MIXTA 3D HILADA POR HILADA
    // =========================================================================
    const tileBaseZ = battenTopZ;
    const tilePanTopZ = battenTopZ + 0.038;
    const tileCrestTopZ = battenTopZ + 0.076; // Raised 3D curved barrel crest!

    if (pTiles > 0.005) {
      const tileRows = 8; // Courses from eaves (r=0) up to ridge (r=7)
      const tileCols = 12; // 12 interlocking curved tiles per course

      for (const side of [1, -1] as const) {
        for (let r = 0; r < tileRows; r++) {
          const rowStart = (r / tileRows) * 0.78;
          const rowP = easeOutCubic(clamp01((pTiles - rowStart) / 0.24));
          if (rowP <= 0.01) continue;

          const s1 = 1.0 - (r / tileRows) * 0.96;
          const s0 = 1.0 - ((r + 1.15) / tileRows) * 0.96; // Realistic 15% overlap over lower course
          const rowDrop = (1 - rowP) * 0.38;

          for (let c = 0; c < tileCols; c++) {
            // Leave stepped cutaway window on Front-Left slope so all internal layers remain visible!
            if (side === -1 && showCutaway) {
              if (r <= 4 && c >= 7) continue;
              if (r === 5 && c >= 9) continue;
            }

            // Skip tiles directly inside chimney footprint on back-right slope
            const uStep = (2 * L) / tileCols;
            const u0 = -L + c * uStep + 0.006;
            const u1 = -L + (c + 1) * uStep - 0.006;
            if (side === 1 && u0 > -1.6 && u1 < -0.75 && s0 > 0.2 && s1 < 0.52) {
              continue;
            }

            const shadeVar = ((r * 7 + c * 11) % 5) * 3;
            const panColor =
              side === -1
                ? `rgb(${164 + shadeVar}, ${78 + Math.floor(shadeVar * 0.6)}, ${48 + Math.floor(shadeVar * 0.4)})`
                : `rgb(${128 + shadeVar}, ${58 + Math.floor(shadeVar * 0.5)}, ${35 + Math.floor(shadeVar * 0.3)})`;

            const crestColor =
              side === -1
                ? `rgb(${202 + shadeVar}, ${104 + Math.floor(shadeVar * 0.6)}, ${66 + Math.floor(shadeVar * 0.4)})`
                : `rgb(${156 + shadeVar}, ${74 + Math.floor(shadeVar * 0.5)}, ${45 + Math.floor(shadeVar * 0.3)})`;

            // 1. Flat interlocking valley pan (canal de la teja mixta)
            drawSlopeSlab(
              side,
              u0,
              u1,
              Math.max(0.02, s0),
              s1,
              tileBaseZ + rowDrop,
              tilePanTopZ + rowDrop,
              panColor,
              '#692C16',
              '#471B0B',
              'rgba(0, 0, 0, 0.28)'
            );

            // 2. Raised 3D curved barrel wave (cobija curva de la teja) on left 58% of each tile
            const uCrest1 = u0 + (u1 - u0) * 0.58;
            drawSlopeSlab(
              side,
              u0 + 0.01,
              uCrest1,
              Math.max(0.02, s0),
              s1 + 0.005,
              tilePanTopZ + rowDrop,
              tileCrestTopZ + rowDrop,
              crestColor,
              '#8A3E22',
              '#3D1608',
              'rgba(255, 235, 220, 0.25)'
            );
          }
        }
      }
    }

    // =========================================================================
    // 9. CUMBRERA VENTILADA ESTANCA (REMATE SUPERIOR CERÁMICO Y PEINE DE ALERO)
    // =========================================================================
    if (pRidge > 0.01) {
      const rP = easeOutCubic(pRidge);
      const ridgePieces = 12;
      const ridgeDrop = (1 - rP) * 0.4;
      const rZ0 = ridgeH + tileBaseZ - 0.01 + ridgeDrop;
      const rZ1 = ridgeH + tileCrestTopZ + 0.075 + ridgeDrop;

      // Under-ridge breathable Aluminum/Copper ventilation roll (banda bajo cumbrera ventilada)
      drawPrism(
        project(-L, -0.22, rZ0 - 0.01),
        project(L, -0.22, rZ0 - 0.01),
        project(L, 0.22, rZ0 - 0.01),
        project(-L, 0.22, rZ0 - 0.01),
        project(-L, -0.22, rZ0 + 0.015),
        project(L, -0.22, rZ0 + 0.015),
        project(L, 0.22, rZ0 + 0.015),
        project(-L, 0.22, rZ0 + 0.015),
        '#1E293B',
        '#0F172A',
        '#334155'
      );

      for (let k = 0; k < ridgePieces; k++) {
        const pieceP = clamp01(rP * ridgePieces - k);
        if (pieceP <= 0.01) continue;

        const u0 = -L + (k / ridgePieces) * (2 * L);
        const u1 = -L + ((k + 0.92) / ridgePieces) * (2 * L);

        drawPrism(
          project(u0, -0.18, rZ0),
          project(u1, -0.18, rZ0),
          project(u1, 0.18, rZ0),
          project(u0, 0.18, rZ0),
          project(u0, -0.11, rZ1),
          project(u1, -0.11, rZ1),
          project(u1, 0.11, rZ1),
          project(u0, 0.11, rZ1),
          '#DA7652',
          '#A84E2D',
          '#78331A',
          'rgba(255,255,255,0.35)'
        );
      }
    }

    // =========================================================================
    // 10. REAL-TIME 3D ARCHITECTURAL CALLOUT PINS & LEADER LINES
    // =========================================================================
    const drawCallout = (
      worldPt: Vec2,
      offsetX: number,
      offsetY: number,
      tag: string,
      label: string,
      active: boolean
    ) => {
      const endX = worldPt.x + offsetX;
      const endY = worldPt.y + offsetY;

      ctx.save();
      ctx.fillStyle = active ? '#B85D3B' : 'rgba(246,245,241,0.7)';
      ctx.beginPath();
      ctx.arc(worldPt.x, worldPt.y, active ? 4.2 : 2.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = active ? 'rgba(184, 93, 59, 0.95)' : 'rgba(246, 245, 241, 0.3)';
      ctx.lineWidth = active ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(worldPt.x, worldPt.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      ctx.font = '600 10px monospace';
      const text = `${tag} · ${label}`;
      const textW = ctx.measureText(text).width + 14;
      const boxX = offsetX >= 0 ? endX : endX - textW;
      const boxY = endY - 11;

      ctx.fillStyle = active ? 'rgba(18, 20, 24, 0.95)' : 'rgba(11, 12, 14, 0.82)';
      ctx.fillRect(boxX, boxY, textW, 22);
      ctx.strokeStyle = active ? '#B85D3B' : 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, boxY, textW, 22);

      ctx.fillStyle = active ? '#F6F5F1' : 'rgba(246,245,241,0.72)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, boxX + 7, boxY + 11);
      ctx.restore();
    };

    if (!isMobile) {
      if (pRafters > 0.25) {
        drawCallout(
          slopePoint(-1, L * 0.84, 0.78, 0.08),
          52,
          32,
          '01',
          'CABIOS LAMINADOS C24',
          p < 0.17
        );
      }
      if (pDeck > 0.35) {
        drawCallout(
          slopePoint(-1, L * 0.62, 0.65, deckTopZ),
          58,
          10,
          '02',
          'TABLERO + BARRERA VAPOR',
          p >= 0.17 && p < 0.34
        );
      }
      if (pInsul > 0.35) {
        drawCallout(
          slopePoint(-1, L * 0.18, 0.58, insulTopZ),
          -52,
          44,
          '03',
          'AISLAMIENTO XPS 100mm',
          p >= 0.34 && p < 0.51
        );
      }
      if (pMembrane > 0.35) {
        drawCallout(
          slopePoint(1, -1.2, 0.35, memTopZ + 0.28),
          -52,
          -34,
          '04',
          'LÁMINA W1 + BABERO ZINC',
          p >= 0.51 && p < 0.68
        );
      }
      if (pTiles > 0.35) {
        drawCallout(
          slopePoint(-1, -L * 0.45, 0.32, tileCrestTopZ),
          -60,
          -26,
          '05',
          'TEJA CURVA Y CUMBRERA',
          p >= 0.68
        );
      }
    }

    ctx.restore();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduced = mediaQuery.matches;

    const tick = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.001) {
        currentProgressRef.current += diff * (reduced ? 1 : 0.16);
        renderScene(currentProgressRef.current);
        setUiProgress(Math.round(currentProgressRef.current * 100) / 100);
        rafRef.current = requestAnimationFrame(tick);
      } else {
        currentProgressRef.current = targetProgressRef.current;
        renderScene(currentProgressRef.current);
        setUiProgress(Math.round(currentProgressRef.current * 100) / 100);
        rafRef.current = null;
      }
    };

    const startAnimation = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.bottom < -120 && targetProgressRef.current === 1) return;

      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const next = clamp01(-rect.top / scrollable);
      if (Math.abs(next - targetProgressRef.current) > 0.0005) {
        targetProgressRef.current = next;
        if (next < 0.82 && inspectMode) {
          setInspectMode(false);
        }
        startAnimation();
      }
    };

    const handleResize = () => {
      renderScene(currentProgressRef.current);
      handleScroll();
    };

    handleScroll();
    renderScene(currentProgressRef.current);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [renderScene, inspectMode]);

  useEffect(() => {
    renderScene(currentProgressRef.current);
  }, [cutawayOpen, renderScene]);

  const jumpToStage = (stage: StageInfo) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const scrollable = rect.height - window.innerHeight;
    const targetP =
      stage.id === 6 ? 0.96 : stage.range[0] + (stage.range[1] - stage.range[0]) * 0.65;
    if (stage.id < 6) {
      setInspectMode(false);
    }
    window.scrollTo({
      top: containerTop + scrollable * targetP,
      behavior: 'smooth',
    });
  };

  const activeStage =
    CONSTRUCTION_STAGES.find(
      (s, idx) =>
        uiProgress >= s.range[0] &&
        (uiProgress < s.range[1] || idx === CONSTRUCTION_STAGES.length - 1)
    ) || CONSTRUCTION_STAGES[0];

  const pPhotoReveal = smoothstep(0.76, 0.95, uiProgress);
  const pCardReveal = inspectMode ? 0 : smoothstep(0.86, 0.96, uiProgress);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[310vh] md:h-[420vh] bg-obsidian text-alabaster select-none"
      aria-label="Simulación constructiva 3D interactiva de cubierta RADECO"
    >
      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-between">
        {/* 1. Architectural Studio Background & Blueprint Grid */}
        <div className="absolute inset-0 bg-arch-grid-dark bg-grid-64 opacity-40 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 56% 48%, rgba(184, 93, 59, 0.15) 0%, rgba(18, 20, 24, 0.72) 52%, rgba(11, 12, 14, 0.98) 100%)',
          }}
        />

        {/* 2. Photorealistic Completed Roof Crossfade at Climax */}
        {pPhotoReveal > 0.01 && (
          <div
            className="absolute inset-0 pointer-events-none will-change-transform"
            style={{
              opacity: pPhotoReveal * 0.36,
              transform: `scale(${1.05 - pPhotoReveal * 0.04})`,
            }}
          >
            <img
              src="/images/projects/oviedo-after.jpg"
              alt="Cubierta rehabilitada en Asturias por RADECO"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/65" />
          </div>
        )}

        {/* 3. Top Technical Telemetry Bar */}
        <div className="relative z-20 shrink-0 pt-[68px] sm:pt-24 px-4 sm:px-8 max-w-[1440px] w-full mx-auto flex flex-wrap items-center justify-between gap-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-alabaster/70">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-copper animate-pulse" />
            <span className="text-white font-semibold">
              {activeStage.code} · {activeStage.label}
            </span>
            <span className="hidden md:inline text-white/25">|</span>
            <span className="hidden md:inline text-copper">{activeStage.spec}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setCutawayOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 border text-[9px] sm:text-[10px] font-mono uppercase tracking-wider transition-colors ${
                cutawayOpen
                  ? 'border-copper/60 bg-copper/15 text-alabaster'
                  : 'border-white/15 bg-white/5 text-white/60 hover:text-white'
              }`}
              title="Alternar ventana de sección técnica multicapa"
            >
              <Eye className="w-3 h-3 text-copper" />
              <span>{cutawayOpen ? 'Corte 3D: Activo' : 'Cerrada 100%'}</span>
            </button>

            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/10 border border-white/15 text-white font-semibold">
              {Math.round(uiProgress * 100)}%
            </span>
          </div>
        </div>

        {/* 4. Main Interactive Stage: Left Technical HUD + Right 3D Architectural Canvas */}
        <div className="relative z-10 flex-1 min-h-0 flex items-center px-4 sm:px-8 max-w-[1440px] w-full mx-auto overflow-hidden py-1 sm:py-2">
          <div className="w-full h-full flex flex-col lg:grid lg:grid-cols-12 gap-1.5 sm:gap-4 items-center justify-between">
            {/* Left Column: Engineering Specifications & Layer Selector */}
            <div
              className="w-full lg:col-span-5 shrink-0 space-y-1.5 sm:space-y-3 lg:space-y-4 relative z-20 transition-all duration-300"
              style={{
                opacity: Math.max(0, 1 - pCardReveal * 1.4),
                transform: `translate3d(0, ${-pCardReveal * 24}px, 0)`,
                pointerEvents: pCardReveal > 0.5 ? 'none' : 'auto',
              }}
            >
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-white/[0.05] border border-white/10 text-[10px] font-mono uppercase tracking-[0.22em] text-copper">
                <Layers className="w-3.5 h-3.5" />
                <span>Ingeniería Constructiva 3D · Paso a Paso</span>
              </div>

              <h1 className="font-display text-lg sm:text-3xl lg:text-[40px] font-semibold tracking-tight leading-[1.12] text-white line-clamp-2 lg:line-clamp-none">
                {activeStage.title}
              </h1>

              <p className="text-[11px] sm:text-sm md:text-base text-alabaster/75 leading-snug sm:leading-relaxed max-w-md line-clamp-2 lg:line-clamp-none">
                {activeStage.subtitle}
              </p>

              {/* Live Technical Telemetry Box for Current Layer */}
              <div className="grid grid-cols-2 gap-2 max-w-md">
                <div className="px-2.5 py-1.5 sm:p-3 bg-white/[0.03] border border-white/10">
                  <span className="block font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.18em] text-white/45">
                    Cota / Sección
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs text-copper font-semibold truncate block">
                    {activeStage.thickness}
                  </span>
                </div>
                <div className="px-2.5 py-1.5 sm:p-3 bg-white/[0.03] border border-white/10">
                  <span className="block font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.18em] text-white/45">
                    Sistema Aplicado
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs text-alabaster font-semibold truncate block">
                    {activeStage.material}
                  </span>
                </div>
              </div>

              {/* Interactive 6-Phase Direct Selector (3 cols on mobile saves vertical height!) */}
              <div className="grid grid-cols-3 gap-1 sm:gap-1.5 max-w-md">
                {CONSTRUCTION_STAGES.map((stage) => {
                  const isCompleted = uiProgress >= stage.range[1];
                  const isCurrent = activeStage.id === stage.id;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => jumpToStage(stage)}
                      className={`text-left px-2 py-1 sm:px-2.5 sm:py-2 border text-[9px] sm:text-[10px] font-mono uppercase tracking-wider transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'border-copper bg-copper/20 text-white shadow-[0_0_20px_rgba(184,93,59,0.25)]'
                          : isCompleted
                          ? 'border-white/25 bg-white/[0.06] text-alabaster/90'
                          : 'border-white/10 bg-white/[0.02] text-white/40 hover:border-white/25'
                      }`}
                    >
                      <span className="truncate">
                        0{stage.id} {stage.label.split(' ')[0]}
                      </span>
                      {isCompleted && <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-copper shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right / Full Column: High-DPI 3D Axonometric Architectural Canvas */}
            <div
              className="lg:col-span-7 relative w-full flex-1 min-h-[210px] lg:h-[74vh] flex items-center justify-center"
              style={{
                opacity: Math.max(0.22, 1 - pCardReveal * 0.72),
                transform: `scale(${1 - pCardReveal * 0.04})`,
              }}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
                aria-label="Modelo tridimensional de cubierta multicapa RADECO"
              />
            </div>
          </div>

          {/* 5. Phase 6 Climax: RADECO Institutional Brand Presentation Card */}
          <div
            className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none z-30"
            style={{
              opacity: pCardReveal,
              transform: `scale(${0.95 + pCardReveal * 0.05}) translate3d(0, ${
                (1 - pCardReveal) * 20
              }px, 0)`,
            }}
          >
            <div
              className={`max-w-3xl w-full bg-[#F6F5F1] text-obsidian border border-obsidian/15 shadow-[0_32px_90px_rgba(0,0,0,0.85)] p-7 sm:p-11 md:p-14 text-center relative overflow-hidden ${
                pCardReveal > 0.5 ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
            >
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-obsidian/30" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-obsidian/30" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-obsidian/30" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-obsidian/30" />

              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-obsidian/[0.05] border border-obsidian/10 text-[10px] font-mono uppercase tracking-[0.24em] text-obsidian/70 mb-5">
                <Shield className="w-3.5 h-3.5 text-copper" />
                <span>Principado de Asturias · España</span>
              </div>

              <div className="flex justify-center mb-4">
                <img
                  src="/brand/logo-black.png"
                  alt="RADECO — Logo Oficial"
                  decoding="async"
                  className="h-24 sm:h-32 md:h-36 w-auto object-contain select-none"
                />
              </div>

              <h2 className="sr-only">RADECO</h2>

              <p className="font-mono text-xs sm:text-sm md:text-base uppercase tracking-[0.26em] text-obsidian font-semibold mb-3">
                Cubiertas · Terrazas · Impermeabilización
              </p>

              <p className="text-xs sm:text-sm text-obsidian/70 max-w-lg mx-auto mb-7 leading-relaxed">
                Soluciones técnicas de rehabilitación, reparación e impermeabilización
                ejecutadas capa por capa con rigor constructivo, materiales acreditados y
                garantía en toda Asturias.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/presupuesto"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-all shadow-lg"
                >
                  <span>Solicitar presupuesto</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/obras"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 border border-obsidian/20 text-obsidian font-mono text-xs uppercase tracking-[0.18em] hover:bg-obsidian/5 transition-all"
                >
                  <span>Explorar obras</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setInspectMode(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-copper hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspeccionar modelo 3D</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Bottom Scrubber & Scroll Guidance Bar */}
        <div className="relative z-20 shrink-0 pb-3 sm:pb-5 px-4 sm:px-8 max-w-[1440px] w-full mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 pt-2 sm:pt-3 border-t border-white/10">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                {uiProgress < 0.88
                  ? 'Deslice hacia abajo para ensamblar cada capa constructiva en 3D'
                  : 'Sistema multicapa completado · RADECO Asturias'}
              </span>
              {uiProgress < 0.88 && (
                <ArrowDown className="w-3.5 h-3.5 text-copper animate-bounce" />
              )}
            </div>

            <div className="w-full sm:w-72 h-1.5 bg-white/10 overflow-hidden relative">
              <div
                className="h-full bg-copper transition-all duration-75"
                style={{ width: `${Math.round(uiProgress * 100)}%` }}
              />
            </div>

            <div className="hidden md:flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.18em] text-white/60">
              {inspectMode && uiProgress >= 0.86 ? (
                <button
                  type="button"
                  onClick={() => setInspectMode(false)}
                  className="text-copper hover:text-white transition-colors underline underline-offset-4"
                >
                  Mostrar tarjeta RADECO
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => jumpToStage(CONSTRUCTION_STAGES[5])}
                  className="hover:text-white transition-colors underline underline-offset-4"
                >
                  Ir al resultado final
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

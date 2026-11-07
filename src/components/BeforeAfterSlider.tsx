'use client';

import React, { useRef, useState, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Antes',
  afterLabel = 'Después',
  title = 'Transformación técnica de la obra',
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / Math.max(1, rect.width)) * 100;
    setSliderPos(Math.max(2, Math.min(98, percent)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore if already released
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPos((p) => Math.max(2, p - 4));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPos((p) => Math.min(98, p + 4));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono uppercase tracking-[0.18em]">
        <div className="flex items-center gap-2 text-obsidian/70">
          <span className="inline-block w-2 h-2 bg-obsidian" />
          <span>ANTES: {beforeLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-copper font-semibold">
          <span>DESPUÉS: {afterLabel}</span>
          <span className="inline-block w-2 h-2 bg-copper" />
        </div>
      </div>

      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label={`Comparador Antes y Después — ${title}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPos)}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-obsidian border border-obsidian/20 select-none cursor-ew-resize touch-pan-y focus:outline-none focus:ring-2 focus:ring-copper"
      >
        {/* Background: AFTER Image (Full width) */}
        <img
          src={afterImage}
          alt={`Después — ${title}`}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />

        {/* Foreground Clipped: BEFORE Image */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none select-none will-change-[clip-path]"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt={`Antes — ${title}`}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          />
        </div>

        {/* Top Corner Badges */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-obsidian/85 backdrop-blur-md border border-white/15 font-mono text-[10px] uppercase tracking-[0.22em] text-white pointer-events-none">
          Antes
        </div>
        <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-alabaster/95 backdrop-blur-md border border-obsidian/15 font-mono text-[10px] uppercase tracking-[0.22em] text-obsidian font-semibold pointer-events-none">
          Después · RADECO
        </div>

        {/* Vertical Divider Line & Handle */}
        <div
          className="absolute top-0 bottom-0 z-20 w-0.5 bg-alabaster shadow-[0_0_16px_rgba(0,0,0,0.8)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-alabaster text-obsidian border-2 border-obsidian shadow-xl flex items-center justify-center">
            <MoveHorizontal className="w-5 h-5" />
          </div>
        </div>
      </div>

      <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-obsidian/55">
        Deslice la barra central (o use las flechas del teclado) para comparar el estado previo y el acabado final
      </p>
    </div>
  );
}


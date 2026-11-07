'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { ProjectGalleryImage } from '@/types';

interface ProjectGalleryProps {
  images: ProjectGalleryImage[];
  projectTitle: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  ejecucion: 'Fase de Ejecución',
  acabado: 'Acabado Final',
  detalle: 'Detalle Técnico',
  estructura: 'Estructura y Aislamiento',
};

export function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const sortedImages = [...images].sort((a, b) => (a.order || 0) - (b.order || 0));

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    setZoomed(false);
  }, []);

  const showPrev = useCallback(() => {
    setZoomed(false);
    setActiveIndex((prev) =>
      prev === null ? null : (prev - 1 + sortedImages.length) % sortedImages.length
    );
  }, [sortedImages.length]);

  const showNext = useCallback(() => {
    setZoomed(false);
    setActiveIndex((prev) =>
      prev === null ? null : (prev + 1) % sortedImages.length
    );
  }, [sortedImages.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, closeLightbox, showPrev, showNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX > 50) showPrev();
    if (deltaX < -50) showNext();
    setTouchStartX(null);
  };

  if (!sortedImages.length) return null;

  return (
    <div>
      {/* Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedImages.map((img, idx) => (
          <figure
            key={img.id || idx}
            onClick={() => setActiveIndex(idx)}
            className={`group relative overflow-hidden bg-obsidian border border-obsidian/15 cursor-pointer ${
              idx === 0 && sortedImages.length % 2 !== 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
            }`}
          >
            <img
              src={img.url}
              alt={img.alt || `${projectTitle} — Imagen ${idx + 1}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-80 group-hover:opacity-65 transition-opacity" />

            {/* Top Index & Category */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
              <span className="px-2.5 py-1 bg-obsidian/80 backdrop-blur-sm border border-white/15 font-mono text-[10px] uppercase tracking-[0.2em]">
                {String(idx + 1).padStart(2, '0')} / {String(sortedImages.length).padStart(2, '0')}
              </span>
              {img.category && (
                <span className="px-2.5 py-1 bg-obsidian/80 backdrop-blur-sm border border-white/15 font-mono text-[10px] uppercase tracking-[0.18em] text-alabaster/80">
                  {CATEGORY_LABELS[img.category] || img.category}
                </span>
              )}
            </div>

            {/* Bottom Caption & Expand Icon */}
            <figcaption className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
              <p className="text-xs sm:text-sm text-alabaster/90 font-medium leading-snug">
                {img.caption || img.alt}
              </p>
              <span className="w-9 h-9 bg-alabaster text-obsidian flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                <Expand className="w-4 h-4" />
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeIndex !== null && sortedImages[activeIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-[100] bg-obsidian/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 select-none"
            role="dialog"
            aria-modal="true"
            aria-label={`Galería de ${projectTitle}`}
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between text-alabaster z-20">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
                <span className="text-copper font-semibold">
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(sortedImages.length).padStart(2, '0')}
                </span>
                <span className="hidden sm:inline text-white/30">|</span>
                <span className="hidden sm:inline text-white/75 truncate max-w-md">
                  {projectTitle}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomed((z) => !z)}
                  className="p-2.5 border border-white/15 text-alabaster hover:bg-white/10 transition-colors"
                  aria-label={zoomed ? 'Reducir zoom' : 'Ampliar imagen'}
                >
                  {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="p-2.5 border border-white/15 text-alabaster hover:bg-white/10 transition-colors"
                  aria-label="Cerrar galería"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Image Stage */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
              {sortedImages.length > 1 && (
                <button
                  type="button"
                  onClick={showPrev}
                  className="absolute left-2 sm:left-4 z-20 w-11 h-11 bg-obsidian/80 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-obsidian transition-colors"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <motion.img
                key={sortedImages[activeIndex].url}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: zoomed ? 1.65 : 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => setZoomed((z) => !z)}
                src={sortedImages[activeIndex].url}
                alt={sortedImages[activeIndex].alt}
                className={`max-h-[75vh] max-w-[90vw] object-contain border border-white/10 shadow-2xl ${
                  zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                }`}
              />

              {sortedImages.length > 1 && (
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-2 sm:right-4 z-20 w-11 h-11 bg-obsidian/80 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-obsidian transition-colors"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Bottom Caption & Thumbnails */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10 z-20">
              <p className="text-xs sm:text-sm text-alabaster/85 text-center sm:text-left">
                {sortedImages[activeIndex].caption || sortedImages[activeIndex].alt}
              </p>

              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                {sortedImages.map((thumb, idx) => (
                  <button
                    key={thumb.id || idx}
                    type="button"
                    onClick={() => {
                      setZoomed(false);
                      setActiveIndex(idx);
                    }}
                    className={`w-14 h-10 overflow-hidden border transition-all shrink-0 ${
                      idx === activeIndex
                        ? 'border-copper scale-105 opacity-100'
                        : 'border-white/20 opacity-45 hover:opacity-80'
                    }`}
                  >
                    <img
                      src={thumb.thumbnailUrl || thumb.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


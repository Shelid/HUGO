import React from 'react';

interface RadecoLogoProps {
  variant?: 'black' | 'white' | 'badge-black';
  layout?: 'horizontal' | 'stacked' | 'emblem-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export function RadecoLogo({
  variant = 'black',
  layout = 'horizontal',
  size = 'md',
  className = '',
  showSubtitle = false,
}: RadecoLogoProps) {
  const emblemSrc =
    variant === 'white' ? '/brand/emblem-white.png' : '/brand/emblem-black.png';
  const fullLogoSrc =
    variant === 'white' ? '/brand/logo-white.png' : '/brand/logo-black.png';

  if (layout === 'stacked') {
    const stackedDimensions = {
      sm: 'h-16',
      md: 'h-24',
      lg: 'h-36',
      xl: 'h-48',
    }[size];

    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        <div
          className={
            variant === 'badge-black'
              ? 'rounded-2xl bg-alabaster px-5 py-4 shadow-sm border border-black/10'
              : ''
          }
        >
          <img
            src={fullLogoSrc}
            alt="RADECO — Cubiertas, Terrazas e Impermeabilización en Asturias"
            className={`${stackedDimensions} w-auto object-contain select-none`}
          />
        </div>
        {showSubtitle && (
          <span
            className={`mt-3 font-mono text-[10px] tracking-[0.28em] uppercase ${
              variant === 'white' ? 'text-white/70' : 'text-obsidian/70'
            }`}
          >
            Cubiertas · Terrazas · Impermeabilización
          </span>
        )}
      </div>
    );
  }

  if (layout === 'emblem-only') {
    const emblemDimensions = {
      sm: 'h-8 w-8',
      md: 'h-11 w-11',
      lg: 'h-16 w-16',
      xl: 'h-24 w-24',
    }[size];

    return (
      <img
        src={emblemSrc}
        alt="Emblema RADECO"
        className={`${emblemDimensions} object-contain select-none ${className}`}
      />
    );
  }

  // Horizontal architectural lockup (Emblem + RADECO typography)
  const heightMap = {
    sm: 'h-9',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-20',
  }[size];

  const textMap = {
    sm: 'text-lg tracking-[0.18em]',
    md: 'text-xl tracking-[0.2em]',
    lg: 'text-2xl tracking-[0.22em]',
    xl: 'text-4xl tracking-[0.24em]',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-500 ${
          variant === 'badge-black'
            ? 'rounded-full bg-alabaster p-1.5 shadow-sm ring-1 ring-black/10'
            : ''
        }`}
      >
        <img
          src={emblemSrc}
          alt="Logo RADECO"
          className={`${heightMap} w-auto object-contain select-none`}
        />
      </div>
      <div className="flex flex-col justify-center">
        <span
          className={`font-display font-bold leading-none ${textMap} ${
            variant === 'white' ? 'text-white' : 'text-obsidian'
          }`}
        >
          RADECO
        </span>
        {showSubtitle && (
          <span
            className={`mt-1 font-mono text-[9px] tracking-[0.22em] uppercase ${
              variant === 'white' ? 'text-white/65' : 'text-obsidian/65'
            }`}
          >
            Asturias · Ingeniería de Cubiertas
          </span>
        )}
      </div>
    </div>
  );
}


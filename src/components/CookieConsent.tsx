'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, SlidersHorizontal } from 'lucide-react';

const COOKIE_STORAGE_KEY = 'radeco_cookie_consent_v1';

export function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (!saved) {
        setVisible(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  if (pathname?.startsWith('/admin') || !visible) {
    return null;
  }

  const saveConsent = (mode: 'all' | 'essential' | 'custom') => {
    const payload = {
      essential: true,
      analytics: mode === 'all' ? true : mode === 'essential' ? false : analyticsEnabled,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 md:right-auto md:max-w-lg z-50 bg-[#F6F5F1] text-obsidian border border-obsidian/20 shadow-[0_24px_60px_rgba(0,0,0,0.28)] p-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-copper">
          <Shield className="w-3.5 h-3.5" />
          <span>Privacidad y Gestión de Cookies (RGPD)</span>
        </div>
        <button
          type="button"
          onClick={() => setShowPrefs(!showPrefs)}
          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-obsidian/65 hover:text-obsidian"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>{showPrefs ? 'Ocultar' : 'Configurar'}</span>
        </button>
      </div>

      <p className="text-xs text-obsidian/75 leading-relaxed mb-4">
        Utilizamos cookies técnicas necesarias para el funcionamiento seguro del sitio y,
        previo consentimiento, cookies de análisis para mejorar su experiencia. Puede
        consultar nuestra{' '}
        <Link href="/cookies" className="underline text-obsidian hover:text-copper">
          Política de Cookies
        </Link>{' '}
        y{' '}
        <Link href="/privacidad" className="underline text-obsidian hover:text-copper">
          Política de Privacidad
        </Link>
        .
      </p>

      {showPrefs && (
        <div className="mb-4 p-3.5 bg-limestone/60 border border-obsidian/10 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium text-obsidian">
              Cookies técnicas y de seguridad (Obligatorias)
            </span>
            <span className="font-mono text-[10px] uppercase text-obsidian/50">
              Siempre activas
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-obsidian/10">
            <label htmlFor="chk-analytics" className="text-obsidian/80 cursor-pointer">
              Cookies analíticas de rendimiento
            </label>
            <input
              id="chk-analytics"
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              className="h-4 w-4 accent-obsidian cursor-pointer"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => saveConsent('all')}
          className="px-4 py-2.5 bg-obsidian text-alabaster font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-charcoal transition-colors"
        >
          Aceptar todas
        </button>
        <button
          type="button"
          onClick={() => saveConsent('essential')}
          className="px-4 py-2.5 border border-obsidian/20 text-obsidian font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-obsidian/5 transition-colors"
        >
          Solo necesarias
        </button>
        {showPrefs && (
          <button
            type="button"
            onClick={() => saveConsent('custom')}
            className="px-4 py-2.5 bg-copper text-white font-mono text-[10px] uppercase tracking-[0.18em] hover:opacity-90 transition-opacity"
          >
            Guardar preferencias
          </button>
        )}
      </div>
    </div>
  );
}


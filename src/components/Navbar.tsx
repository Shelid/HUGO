'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Menu, X, ShieldCheck, MapPin } from 'lucide-react';

const SERVICE_SUBLINKS = [
  { label: 'Cubiertas y tejados', href: '/servicios/cubiertas-tejados', tag: '01' },
  { label: 'Impermeabilización', href: '/servicios/impermeabilizacion', tag: '02' },
  { label: 'Terrazas', href: '/servicios/terrazas', tag: '03' },
  { label: 'Rehabilitación integral', href: '/servicios/rehabilitacion', tag: '04' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesHover, setServicesHover] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const isPast = window.scrollY > 36;
      setScrolled((prev) => (prev === isPast ? prev : isPast));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesHover(false);
  }, [pathname]);

  // Don't render public navbar inside /admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const useSolidGlass = scrolled || !isHome || mobileOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        useSolidGlass
          ? 'py-3 bg-[#F6F5F1]/92 backdrop-blur-xl border-b border-obsidian/10 shadow-[0_8px_32px_rgba(11,12,14,0.05)]'
          : 'py-5 bg-transparent border-b border-white/10'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Left: RADECO All-Black Transparent Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3.5 focus:outline-none"
          aria-label="RADECO — Ir al inicio"
        >
          <div
            className={`relative flex items-center justify-center transition-all duration-500 ${
              useSolidGlass
                ? 'h-12 w-12 rounded-xl bg-transparent p-0.5'
                : 'h-14 w-14 rounded-xl bg-[#F6F5F1] p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.28)]'
            }`}
          >
            <img
              src="/brand/logo-black.png"
              alt="RADECO Logo"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-display font-bold text-lg sm:text-xl tracking-[0.22em] transition-colors duration-300 ${
                useSolidGlass ? 'text-obsidian' : 'text-white'
              }`}
            >
              RADECO
            </span>
            <span
              className={`font-mono text-[9px] tracking-[0.22em] uppercase transition-colors duration-300 ${
                useSolidGlass ? 'text-obsidian/60' : 'text-white/65'
              }`}
            >
              Asturias · España
            </span>
          </div>
        </Link>

        {/* Center: Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Navegación principal">
          <Link
            href="/"
            className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
              useSolidGlass
                ? pathname === '/'
                  ? 'text-obsidian font-semibold'
                  : 'text-obsidian/70 hover:text-obsidian'
                : 'text-white hover:text-white/80'
            }`}
          >
            Inicio
          </Link>

          {/* Servicios with Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesHover(true)}
            onMouseLeave={() => setServicesHover(false)}
          >
            <Link
              href="/servicios"
              className={`inline-flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors py-1 ${
                useSolidGlass
                  ? pathname?.startsWith('/servicios')
                    ? 'text-obsidian font-semibold'
                    : 'text-obsidian/70 hover:text-obsidian'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              <span>Servicios</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  servicesHover ? 'rotate-180' : ''
                }`}
              />
            </Link>

            <AnimatePresence>
              {servicesHover && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-full pt-3 w-72"
                >
                  <div className="bg-[#F6F5F1] border border-obsidian/12 shadow-2xl p-2">
                    <div className="px-3 py-2 border-b border-obsidian/10 flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-obsidian/50">
                        Especialidades Técnicas
                      </span>
                      <Link
                        href="/servicios"
                        className="font-mono text-[10px] tracking-wider uppercase text-copper hover:underline"
                      >
                        Ver todos
                      </Link>
                    </div>
                    <div className="divide-y divide-obsidian/5 mt-1">
                      {SERVICE_SUBLINKS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center justify-between px-3 py-2.5 text-xs font-medium text-obsidian/80 hover:text-obsidian hover:bg-obsidian/[0.04] transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[10px] text-copper">
                              {item.tag}
                            </span>
                            <span>{item.label}</span>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-obsidian/60" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/obras"
            className={`text-sm font-medium tracking-wide transition-colors py-1 ${
              useSolidGlass
                ? pathname?.startsWith('/obras')
                  ? 'text-obsidian font-semibold'
                  : 'text-obsidian/70 hover:text-obsidian'
                : 'text-white/85 hover:text-white'
            }`}
          >
            Obras
          </Link>

          <Link
            href="/empresa#garantia"
            className={`text-sm font-medium tracking-wide transition-colors py-1 ${
              useSolidGlass
                ? 'text-obsidian/70 hover:text-obsidian'
                : 'text-white/85 hover:text-white'
            }`}
          >
            Garantía
          </Link>

          <Link
            href="/empresa"
            className={`text-sm font-medium tracking-wide transition-colors py-1 ${
              useSolidGlass
                ? pathname === '/empresa'
                  ? 'text-obsidian font-semibold'
                  : 'text-obsidian/70 hover:text-obsidian'
                : 'text-white/85 hover:text-white'
            }`}
          >
            Nosotros
          </Link>

          <Link
            href="/contacto"
            className={`text-sm font-medium tracking-wide transition-colors py-1 ${
              useSolidGlass
                ? pathname === '/contacto'
                  ? 'text-obsidian font-semibold'
                  : 'text-obsidian/70 hover:text-obsidian'
                : 'text-white/85 hover:text-white'
            }`}
          >
            Contacto
          </Link>
        </nav>

        {/* Right: CTA Button + Mobile Trigger */}
        <div className="flex items-center gap-3">
          <Link
            href="/presupuesto"
            className={`hidden sm:inline-flex items-center gap-2.5 px-5 py-2.5 text-xs font-mono uppercase tracking-[0.16em] transition-all duration-300 ${
              useSolidGlass
                ? 'bg-obsidian text-alabaster hover:bg-charcoal shadow-sm'
                : 'bg-alabaster text-obsidian hover:bg-white'
            }`}
          >
            <span>Solicitar presupuesto</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            className={`lg:hidden inline-flex items-center justify-center w-11 h-11 border transition-colors ${
              useSolidGlass
                ? 'border-obsidian/15 text-obsidian hover:bg-obsidian/5'
                : 'border-white/25 text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden bg-[#F6F5F1] border-b border-obsidian/15"
          >
            <div className="px-6 py-7 space-y-6">
              <div className="flex flex-col space-y-3">
                {[
                  { label: 'Inicio', href: '/', idx: '01' },
                  { label: 'Servicios', href: '/servicios', idx: '02' },
                  { label: 'Obras realizadas', href: '/obras', idx: '03' },
                  { label: 'Garantía y Calidad', href: '/empresa#garantia', idx: '04' },
                  { label: 'Nosotros', href: '/empresa', idx: '05' },
                  { label: 'Contacto', href: '/contacto', idx: '06' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between py-2.5 border-b border-obsidian/10 text-obsidian hover:text-copper transition-colors"
                  >
                    <span className="font-display text-lg font-medium">{link.label}</span>
                    <span className="font-mono text-xs text-obsidian/45">{link.idx}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-2 space-y-3">
                <span className="block font-mono text-[10px] tracking-[0.2em] uppercase text-obsidian/50">
                  Especialidades Principales
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {SERVICE_SUBLINKS.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="px-3 py-2 bg-obsidian/[0.04] border border-obsidian/10 text-xs font-medium text-obsidian/85 hover:border-obsidian/30"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex flex-col gap-3">
                <Link
                  href="/presupuesto"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.18em]"
                >
                  <span>Solicitar presupuesto</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center justify-between text-[11px] font-mono text-obsidian/60 pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-copper" />
                    Principado de Asturias
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-copper" />
                    Sello de Calidad RADECO
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

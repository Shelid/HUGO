'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, MapPin, Phone, Mail, Clock, Lock } from 'lucide-react';

interface FooterProps {
  phone?: string;
  email?: string;
  businessHours?: string;
}

export function Footer({
  phone = '+34 985 00 00 00',
  email = 'info@radecoasturias.es',
  businessHours = 'Lunes a Viernes: 08:30 – 19:00',
}: FooterProps) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-obsidian text-alabaster border-t border-white/10">
      {/* Upper Pre-Footer CTA Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block mb-3">
              Atención Técnica en todo el Principado de Asturias
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-3">
              ¿Necesitas reparar o impermeabilizar tu cubierta?
            </h2>
            <p className="text-sm sm:text-base text-alabaster/70 leading-relaxed">
              Cuéntanos qué necesitas y estudiaremos la mejor solución para tu proyecto.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/presupuesto"
              className="inline-flex items-center gap-3 px-8 py-4 bg-alabaster text-obsidian font-mono text-xs uppercase tracking-[0.2em] hover:bg-white transition-colors"
            >
              <span>Solicitar presupuesto</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/obras"
              className="inline-flex items-center gap-2 px-6 py-4 border border-white/20 text-alabaster font-mono text-xs uppercase tracking-[0.18em] hover:bg-white/5 transition-colors"
            >
              <span>Ver obras realizadas</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Column 1: Brand Identity */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#F6F5F1] p-2 flex items-center justify-center shrink-0">
                <img
                  src="/brand/logo-black.png"
                  alt="RADECO Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-display text-2xl font-bold tracking-[0.22em] text-white block">
                  RADECO
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper block mt-1">
                  Asturias · España
                </span>
              </div>
            </div>

            <p className="font-mono text-xs uppercase tracking-[0.22em] text-alabaster/90">
              Cubiertas · Terrazas · Impermeabilización
            </p>

            <p className="text-xs sm:text-sm text-alabaster/60 leading-relaxed max-w-sm">
              Ejecución técnica especializada en rehabilitación de cubiertas, reparación
              de tejados, impermeabilización profesional y conservación de terrazas en el
              Principado de Asturias.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
              Navegación
            </h3>
            <ul className="space-y-2.5 text-sm text-alabaster/75">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:text-white transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/obras" className="hover:text-white transition-colors">
                  Obras
                </Link>
              </li>
              <li>
                <Link href="/empresa" className="hover:text-white transition-colors">
                  Empresa
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/presupuesto" className="text-copper hover:underline">
                  Solicitar presupuesto
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
              Especialidades
            </h3>
            <ul className="space-y-2.5 text-sm text-alabaster/75">
              <li>
                <Link
                  href="/servicios/cubiertas-tejados"
                  className="hover:text-white transition-colors"
                >
                  Cubiertas y tejados
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/impermeabilizacion"
                  className="hover:text-white transition-colors"
                >
                  Impermeabilización técnica
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/terrazas"
                  className="hover:text-white transition-colors"
                >
                  Rehabilitación de terrazas
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/rehabilitacion"
                  className="hover:text-white transition-colors"
                >
                  Rehabilitación integral de cubiertas
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios#reparacion"
                  className="hover:text-white transition-colors"
                >
                  Reparación de filtraciones y goteras
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios#mantenimiento"
                  className="hover:text-white transition-colors"
                >
                  Mantenimiento y conservación
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
              Contacto Directo
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-alabaster/75">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-copper shrink-0 mt-0.5" />
                <span>Principado de Asturias, España (Oviedo · Gijón · Mieres · Lena · Avilés)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-copper shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-copper shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-copper shrink-0 mt-0.5" />
                <span>{businessHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-alabaster/50">
          <p>© RADECO — Todos los derechos reservados.</p>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/aviso-legal" className="hover:text-white transition-colors">
              Aviso legal
            </Link>
            <Link href="/privacidad" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-white/35 hover:text-white/75 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Acceso interno</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


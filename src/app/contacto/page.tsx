import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { getCompanySettings } from '@/lib/db';
import { ContactForm } from '@/components/ContactForm';
import { AsturiasLocationMap } from '@/components/AsturiasLocationMap';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contacto | RADECO — Cubiertas, Terrazas e Impermeabilización en Asturias',
  description:
    'Contacte con RADECO en el Principado de Asturias. Teléfono, WhatsApp, correo electrónico y formulario para solicitar presupuesto de cubiertas, tejados y terrazas.',
};

export default function ContactoPage() {
  const settings = getCompanySettings();
  const whatsappHref = `https://wa.me/${settings.whatsappNumber.replace(
    /[^\d]/g,
    ''
  )}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`;

  return (
    <div className="pt-24 bg-alabaster text-obsidian">
      {/* Hero */}
      <section className="py-16 sm:py-24 border-b border-obsidian/12 bg-limestone/45">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl space-y-5">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block">
              Atención Técnica Directa · Principado de Asturias
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-obsidian leading-[1.06]">
              Contacto
            </h1>
            <p className="text-base sm:text-lg text-obsidian/75 leading-relaxed">
              Estamos a su disposición en todo el Principado de Asturias para estudiar su
              proyecto de cubierta, tejado, terraza o impermeabilización.
            </p>
          </div>

          <Link
            href="/presupuesto"
            className="self-start lg:self-auto inline-flex items-center gap-3 px-7 py-4 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-colors"
          >
            <span>Solicitar presupuesto</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="py-20 sm:py-28 border-b border-obsidian/12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F6F5F1] border border-obsidian/15 p-8 space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-obsidian/10">
                <img
                  src="/brand/logo-black.png"
                  alt="RADECO Logo"
                  className="h-14 w-auto object-contain"
                />
                <div>
                  <h2 className="font-display text-2xl font-bold text-obsidian tracking-wider">
                    RADECO
                  </h2>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-copper">
                    {settings.region}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-obsidian text-alabaster flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-copper" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-obsidian/55 block">
                      Teléfono de Atención
                    </span>
                    <a
                      href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                      className="font-display text-lg font-semibold text-obsidian hover:text-copper"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-obsidian text-alabaster flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-copper" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-obsidian/55 block">
                      WhatsApp Directo
                    </span>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-lg font-semibold text-obsidian hover:text-copper underline underline-offset-4"
                    >
                      Iniciar conversación por WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-obsidian text-alabaster flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-copper" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-obsidian/55 block">
                      Correo Electrónico
                    </span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="font-display text-lg font-semibold text-obsidian hover:text-copper"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-obsidian text-alabaster flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-copper" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-obsidian/55 block">
                      Horario de atención
                    </span>
                    <p className="text-sm font-medium text-obsidian mt-0.5">
                      {settings.businessHours}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-obsidian text-alabaster flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-copper" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-obsidian/55 block">
                      Zona de Actuación
                    </span>
                    <p className="text-sm font-medium text-obsidian mt-0.5">
                      Principado de Asturias (Oviedo, Gijón, Mieres, Lena, Avilés, Siero y
                      resto de concejos)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Quote Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Regional Coverage Map */}
      <section className="py-20 max-w-[1400px] mx-auto px-4 sm:px-8">
        <AsturiasLocationMap municipality="Oviedo" province="Asturias" />
      </section>
    </div>
  );
}


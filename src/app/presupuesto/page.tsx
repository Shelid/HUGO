import type { Metadata } from 'next';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { QualityBadge } from '@/components/QualityBadge';

export const metadata: Metadata = {
  title: 'Solicitar Presupuesto | RADECO — Cubiertas, Tejados y Terrazas en Asturias',
  description:
    'Solicite presupuesto sin compromiso para reparación de tejados, rehabilitación de cubiertas, impermeabilización o terrazas en cualquier municipio de Asturias.',
};

export default function PresupuestoPage() {
  return (
    <div className="pt-24 bg-alabaster text-obsidian">
      <section className="py-16 sm:py-24 border-b border-obsidian/12 bg-limestone/45">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 max-w-3xl mx-0 space-y-5">
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-copper block">
            Valoración Técnica Personalizada · Principado de Asturias
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-obsidian leading-[1.06]">
            Solicitar presupuesto
          </h1>
          <p className="text-base sm:text-lg text-obsidian/75 leading-relaxed">
            Cuéntanos qué necesitas y estudiaremos la mejor solución para tu proyecto.
            Puedes adjuntar fotografías del estado actual de tu cubierta o terraza.
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-28 border-b border-obsidian/12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <ContactForm />
          </div>

          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="bg-[#F6F5F1] border border-obsidian/15 p-8 space-y-5">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-copper">
                <ShieldCheck className="w-4 h-4" />
                <span>Compromiso RADECO</span>
              </div>
              <h2 className="font-display text-xl font-semibold text-obsidian">
                ¿Qué incluye nuestro estudio?
              </h2>
              <ul className="space-y-3.5 text-xs sm:text-sm text-obsidian/75">
                {[
                  'Análisis técnico de la consulta y fotografías adjuntas.',
                  'Visita de inspección presencial en obra en Asturias cuando sea necesario.',
                  'Diagnóstico real del origen de filtraciones o patologías.',
                  'Propuesta detallada con materiales seleccionados y alcance.',
                  'Especificación transparente de condiciones de garantía.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-copper shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-[1400px] mx-auto px-4 sm:px-8">
        <QualityBadge />
      </section>
    </div>
  );
}


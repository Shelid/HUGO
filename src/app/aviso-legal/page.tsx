import type { Metadata } from 'next';
import { getCompanySettings } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Aviso Legal | RADECO Asturias',
  description: 'Aviso legal y condiciones de uso del sitio web de RADECO en el Principado de Asturias.',
};

export default function AvisoLegalPage() {
  const settings = getCompanySettings();

  return (
    <div className="pt-28 pb-24 bg-alabaster text-obsidian">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="border-b border-obsidian/15 pb-6">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-copper block mb-2">
            Cumplimiento Normativo · LSSI-CE (España)
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-obsidian">
            Aviso Legal
          </h1>
        </div>

        <div className="space-y-6 text-sm text-obsidian/80 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-obsidian">
              1. Información General
            </h2>
            <p>
              En cumplimiento con el deber de información dispuesto en la Ley 34/2002 de
              Servicios de la Sociedad de la Información y el Comercio Electrónico
              (LSSI-CE), se facilitan los datos identificativos del titular del sitio web:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Denominación comercial:</strong> {settings.companyName}
              </li>
              <li>
                <strong>Ámbito territorial:</strong> {settings.region}
              </li>
              <li>
                <strong>Correo electrónico de contacto:</strong> {settings.email}
              </li>
              <li>
                <strong>Teléfono de contacto:</strong> {settings.phone}
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-obsidian">
              2. Objeto y Condiciones de Uso
            </h2>
            <p>
              El presente sitio web tiene carácter institucional e informativo sobre los
              servicios de construcción, rehabilitación de cubiertas, reparación de
              tejados, impermeabilización y rehabilitación de terrazas prestados por RADECO
              en el Principado de Asturias, así como la recepción de solicitudes de
              presupuesto.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-obsidian">
              3. Propiedad Intelectual e Industrial
            </h2>
            <p>
              Todos los contenidos del sitio web, incluyendo el logotipo RADECO, diseño
              gráfico, fotografías de obras, textos técnicos y código fuente, están
              protegidos por la normativa española y europea de propiedad intelectual e
              industrial, quedando prohibida su reproducción sin autorización expresa.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-obsidian">
              4. Legislación Aplicable y Jurisdicción
            </h2>
            <p>
              Las presentes condiciones se rigen por la legislación española. Para
              cualquier controversia que pudiera derivarse del acceso o uso de este sitio
              web, las partes se someten a los Juzgados y Tribunales del Principado de
              Asturias.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}


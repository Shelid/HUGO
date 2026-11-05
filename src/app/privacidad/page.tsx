import type { Metadata } from 'next';
import { getCompanySettings } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Política de Privacidad | RADECO Asturias',
  description: 'Política de privacidad y protección de datos personales (RGPD y LOPDGDD) de RADECO.',
};

export default function PrivacidadPage() {
  const settings = getCompanySettings();

  return (
    <div className="pt-28 pb-24 bg-alabaster text-obsidian">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="border-b border-obsidian/15 pb-6">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-copper block mb-2">
            Protección de Datos · RGPD (UE) 2016/679 y LOPDGDD 3/2018
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-obsidian">
            Política de Privacidad
          </h1>
        </div>

        <div className="space-y-6 text-sm text-obsidian/80 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-obsidian">
              1. Responsable del Tratamiento
            </h2>
            <p>
              <strong>{settings.companyName}</strong> ({settings.region}), con correo de
              contacto <strong>{settings.email}</strong> y teléfono{' '}
              <strong>{settings.phone}</strong>, es el responsable del tratamiento de los
              datos personales facilitados a través de los formularios de presupuesto y
              contacto de este sitio web.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-obsidian">
              2. Finalidad del Tratamiento
            </h2>
            <p>
              Los datos recabados (nombre, teléfono, correo electrónico, municipio,
              descripción del problema e imágenes adjuntas de la cubierta o terraza) se
              utilizarán exclusivamente para estudiar su consulta, realizar la valoración
              técnica solicitada y remitirle el correspondiente presupuesto.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-obsidian">
              3. Confidencialidad de las Obras Publicadas
            </h2>
            <p>
              Por estricto respeto a la privacidad de nuestros clientes, en el catálogo de
              obras realizadas por RADECO únicamente se menciona el municipio o concejo de
              Asturias (por ejemplo, Oviedo, Gijón, Mieres o Lena), sin publicar en ningún
              caso direcciones postales completas, números de portal ni coordenadas GPS de
              viviendas particulares.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-obsidian">
              4. Derechos de los Interesados
            </h2>
            <p>
              Puede ejercer sus derechos de acceso, rectificación, supresión, oposición,
              limitación del tratamiento y portabilidad enviando una comunicación a{' '}
              <strong>{settings.email}</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}


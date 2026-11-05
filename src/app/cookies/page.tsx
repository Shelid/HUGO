import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies | RADECO Asturias',
  description: 'Información sobre el uso de cookies y gestión de preferencias en el sitio web de RADECO.',
};

export default function CookiesPage() {
  return (
    <div className="pt-28 pb-24 bg-alabaster text-obsidian">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="border-b border-obsidian/15 pb-6">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-copper block mb-2">
            Directiva Europea ePrivacy y Guía AEPD
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-obsidian">
            Política de Cookies
          </h1>
        </div>

        <div className="space-y-6 text-sm text-obsidian/80 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-obsidian">
              1. ¿Qué son las cookies?
            </h2>
            <p>
              Una cookie es un pequeño archivo que se almacena en el navegador del usuario
              al visitar determinadas páginas web con la finalidad de garantizar el
              funcionamiento técnico, recordar preferencias de privacidad o analizar de
              forma agregada la navegación.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-obsidian">
              2. Tipología de cookies utilizadas en este sitio
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Cookies técnicas y de seguridad (Estrictamente necesarias):</strong>{' '}
                Permiten recordar su elección sobre el aviso de cookies
                (<code>radeco_cookie_consent_v1</code>) y gestionar de forma segura la
                sesión autenticada del panel administrativo.
              </li>
              <li>
                <strong>Cookies analíticas (Opcionales):</strong> Solo se activan si el
                usuario otorga su consentimiento expreso en el panel de preferencias.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-obsidian">
              3. Gestión y revocación del consentimiento
            </h2>
            <p>
              Puede modificar o retirar su consentimiento en cualquier momento borrando los
              datos de navegación de su navegador para este dominio, lo que mostrará de
              nuevo el panel de configuración de cookies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}


import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { CookieConsent } from '@/components/CookieConsent';
import { getCompanySettings, loadDb } from '@/lib/db';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://radecoasturias.es'
  ),
  title: {
    default: 'RADECO | Cubiertas, Terrazas e Impermeabilización en Asturias',
    template: '%s | RADECO Asturias',
  },
  description:
    'Especialistas en cubiertas y tejados, reparación de tejados, rehabilitación de cubiertas, impermeabilización y rehabilitación de terrazas en el Principado de Asturias.',
  keywords: [
    'tejados en Asturias',
    'reparación de tejados Asturias',
    'rehabilitación de cubiertas Asturias',
    'impermeabilización de terrazas Asturias',
    'reparación de terrazas Asturias',
    'cubiertas Asturias',
    'impermeabilización Asturias',
    'reparación de tejados Oviedo',
    'tejados Mieres',
    'impermeabilización Lena',
    'cubiertas Gijón',
  ],
  openGraph: {
    title: 'RADECO — Cubiertas · Terrazas · Impermeabilización en Asturias',
    description:
      'Soluciones técnicas de rehabilitación de cubiertas, tejados, terrazas e impermeabilización en el Principado de Asturias.',
    locale: 'es_ES',
    type: 'website',
    siteName: 'RADECO Asturias',
    images: [
      {
        url: '/images/projects/oviedo-after.jpg',
        width: 1200,
        height: 630,
        alt: 'RADECO — Cubiertas, Terrazas e Impermeabilización en Asturias',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await loadDb();
  const settings = getCompanySettings();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    name: 'RADECO',
    description:
      'Empresa especializada en cubiertas y tejados, rehabilitación de cubiertas, impermeabilización y rehabilitación de terrazas en el Principado de Asturias, España.',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Principado de Asturias, España',
    },
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Asturias',
      addressCountry: 'ES',
    },
    telephone: settings.phone,
    email: settings.email,
    knowsAbout: [
      'Cubiertas y tejados',
      'Reparación de tejados',
      'Rehabilitación de cubiertas',
      'Impermeabilización',
      'Terrazas',
      'Soluciones contra humedades y filtraciones',
      'Mantenimiento y conservación de cubiertas',
    ],
  };

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-alabaster text-obsidian antialiased selection:bg-obsidian selection:text-alabaster min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer
          phone={settings.phone}
          email={settings.email}
          businessHours={settings.businessHours}
        />
        <WhatsAppButton
          phoneNumber={settings.whatsappNumber}
          defaultMessage={settings.whatsappDefaultMessage}
        />
        <CookieConsent />
      </body>
    </html>
  );
}


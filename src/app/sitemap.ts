import { MetadataRoute } from 'next';
import { getPublishedProjects } from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://radecoasturias.es';
  const projects = getPublishedProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/servicios',
    '/servicios/cubiertas-tejados',
    '/servicios/impermeabilizacion',
    '/servicios/terrazas',
    '/servicios/rehabilitacion',
    '/obras',
    '/empresa',
    '/contacto',
    '/presupuesto',
    '/aviso-legal',
    '/privacidad',
    '/cookies',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/obras/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [...staticRoutes, ...projectRoutes];
}


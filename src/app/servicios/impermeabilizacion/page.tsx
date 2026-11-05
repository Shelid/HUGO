import type { Metadata } from 'next';
import { getServiceBySlug } from '@/lib/services-data';
import { ServiceDetailPageView } from '@/components/ServiceDetailPageView';

const service = getServiceBySlug('impermeabilizacion')!;

export const metadata: Metadata = {
  title: service.seoTitle,
  description: service.seoDescription,
  keywords: service.seoKeywords,
};

export default function ImpermeabilizacionPage() {
  return <ServiceDetailPageView service={service} />;
}


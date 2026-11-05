import type { Metadata } from 'next';
import { getServiceBySlug } from '@/lib/services-data';
import { ServiceDetailPageView } from '@/components/ServiceDetailPageView';

const service = getServiceBySlug('rehabilitacion')!;

export const metadata: Metadata = {
  title: service.seoTitle,
  description: service.seoDescription,
  keywords: service.seoKeywords,
};

export default function RehabilitacionPage() {
  return <ServiceDetailPageView service={service} />;
}


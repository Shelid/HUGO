export type ProjectStatus = 'published' | 'draft';

export interface ProjectGalleryImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  alt: string;
  caption?: string;
  category?: 'ejecucion' | 'acabado' | 'detalle' | 'estructura';
  order: number;
}

export interface ProjectTechnicalSpec {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  municipality: string; // ONLY City/Municipality, NEVER street address
  province: string; // "Asturias"
  status: ProjectStatus;
  featured: boolean;
  coverImage: string;
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  gallery: ProjectGalleryImage[];
  description: string;
  technicalContext?: string;
  interventionDetails?: string;
  services: string[];
  duration: string;
  propertyType: string;
  technicalSpecs: ProjectTechnicalSpec[];
  warrantyWorkmanship: string; // Configurable in Admin, e.g. "5 años"
  warrantyMaterials: string; // Configurable in Admin, e.g. "Según fabricante"
  warrantyConditions: string; // Configurable specific conditions per project
  qualitySealItems: string[]; // Configurable quality checkpoints
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDetail {
  slug: string;
  index: string;
  title: string;
  shortDescription: string;
  heroSubtitle: string;
  overview: string;
  technicalApproach: string;
  keyBenefits: string[];
  specifications: { title: string; detail: string }[];
  applications: string[];
  image: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  region: string;
  phone: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  email: string;
  businessHours: string;
  defaultWarrantyWorkmanship: string;
  defaultWarrantyMaterials: string;
  defaultWarrantyConditions: string;
  ShowMetrics: boolean;
}

export interface LeadSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  municipality: string;
  workType: string;
  description: string;
  photos: string[];
  createdAt: string;
  status: 'nuevo' | 'en_estudio' | 'presupuestado';
}

export interface DatabaseSchema {
  projects: Project[];
  settings: CompanySettings;
  leads: LeadSubmission[];
  adminPasswordHash: string;
  adminPasswordSalt: string;
  /** true once the admin has set a private password from the panel */
  adminPasswordCustom?: boolean;
}


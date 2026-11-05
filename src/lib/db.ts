import fs from 'fs';
import os from 'os';
import path from 'path';
import { getStore } from '@netlify/blobs';
import { DatabaseSchema, Project, CompanySettings, LeadSubmission } from '@/types';
import { hashPassword } from './auth';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const TMP_DB_FILE = path.join(os.tmpdir(), 'radeco-db.json');

const DEFAULT_SETTINGS: CompanySettings = {
  companyName: 'RADECO',
  tagline: 'Cubiertas · Terrazas · Impermeabilización',
  region: 'Asturias, España',
  phone: '+34 985 00 00 00',
  whatsappNumber: '34600000000',
  whatsappDefaultMessage: 'Hola, me gustaría solicitar un presupuesto para una obra.',
  email: 'info@radecoasturias.es',
  businessHours: 'Lunes a Viernes: 08:30 – 19:00 | Sábados con cita previa',
  defaultWarrantyWorkmanship: '5 años',
  defaultWarrantyMaterials: 'Según fabricante',
  defaultWarrantyConditions:
    'La garantía de mano de obra cubre defectos derivados de la ejecución técnica de los trabajos realizados por RADECO conforme al alcance especificado en el contrato de obra. La garantía de los materiales aplicados se rige por las pólizas y condiciones técnicas de cada fabricante.',
  ShowMetrics: false,
};

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'obra-oviedo-01',
    slug: 'rehabilitacion-cubierta-oviedo',
    title: 'Rehabilitación integral de cubierta',
    subtitle:
      'Recuperación y mejora de una cubierta residencial mediante soluciones de impermeabilización y rehabilitación.',
    municipality: 'Oviedo',
    province: 'Asturias',
    status: 'published',
    featured: true,
    coverImage: '/images/projects/oviedo-after.jpg',
    beforeImage: '/images/projects/oviedo-before.jpg',
    afterImage: '/images/projects/oviedo-after.jpg',
    beforeLabel: 'Estado previo: teja envejecida, filtraciones y pérdida térmica',
    afterLabel: 'Resultado RADECO: cubierta ventilada, aislada y estanca',
    gallery: [
      {
        id: 'ov-img-1',
        url: '/images/projects/oviedo-after.jpg',
        alt: 'Vista general de la cubierta rehabilitada en Oviedo, Asturias',
        caption: 'Acabado final de cubierta inclinada con teja seleccionada y rematería de zinc.',
        category: 'acabado',
        order: 1,
      },
      {
        id: 'ov-img-2',
        url: '/images/projects/oviedo-detail-1.jpg',
        alt: 'Instalación de lámina impermeabilizante transpirable y rastreles en Oviedo',
        caption: 'Ejecución de impermeabilización transpirable multicapa y doble rastrelado ventilado.',
        category: 'ejecucion',
        order: 2,
      },
      {
        id: 'ov-img-3',
        url: '/images/projects/oviedo-detail-2.jpg',
        alt: 'Detalle técnico de cumbrera ventilada y encuentro metálico en Oviedo',
        caption: 'Resolución técnica de cumbrera ventilada en seco y sellado de encuentros.',
        category: 'detalle',
        order: 3,
      },
      {
        id: 'ov-img-4',
        url: '/images/projects/oviedo-detail-3.jpg',
        alt: 'Paneles de aislamiento térmico continuo sobre soporte en Oviedo',
        caption: 'Colocación de aislamiento térmico XPS de alta densidad sin puentes térmicos.',
        category: 'estructura',
        order: 4,
      },
    ],
    description:
      'Intervención integral sobre cubierta residencial en el concejo de Oviedo que presentaba filtraciones recurrentes, desplazamientos de piezas y ausencia de aislamiento térmico. Se procedió al levantamiento completo de la cobertura antigua, saneamiento del soporte base e instalación de un sistema multicapa compuesto por aislamiento continuo de alta densidad, lámina impermeabilizante transpirable, cámara de microventilación mediante doble rastrel y nueva cobertura cerámica fijada mecánicamente.',
    technicalContext:
      'La cubierta original carecía de barrera impermeable secundaria y ventilación bajo teja, generando condensaciones intersticiales y humedades en las estancias superiores durante los meses de mayor pluviometría.',
    interventionDetails:
      'Se ejecutó la cumbrera en seco con banda de ventilación e impermeabilización aerodinámica, renovando íntegramente los encuentros perimetrales, limahoyas y el sistema de evacuación pluvial en zinc.',
    services: ['Rehabilitación', 'Impermeabilización', 'Reparación', 'Acabado'],
    duration: '3 semanas',
    propertyType: 'Vivienda Residencial',
    technicalSpecs: [
      { label: 'Sistema constructivo', value: 'Cubierta inclinada ventilada multicapa' },
      { label: 'Impermeabilización', value: 'Lámina transpirable de alta resistencia + sellado butílico' },
      { label: 'Aislamiento térmico', value: 'Poliestireno extruido (XPS) machihembrado de alta densidad' },
      { label: 'Acabado y remates', value: 'Teja cerámica mixta hidrofugada y rematería técnica en zinc' },
    ],
    warrantyWorkmanship: '5 años',
    warrantyMaterials: 'Según fabricante',
    warrantyConditions:
      'Garantía aplicable a la ejecución de la rehabilitación e impermeabilización conforme al documento de entrega de obra y mantenimiento periódico de los elementos de evacuación pluvial. Los materiales instalados cuentan con la garantía directa de sus respectivos fabricantes.',
    qualitySealItems: [
      'Control de ejecución',
      'Materiales seleccionados',
      'Acabado profesional',
      'Trabajo supervisado',
    ],
    seoTitle: 'Rehabilitación Integral de Cubierta en Oviedo, Asturias | Obra RADECO',
    seoDescription:
      'Proyecto real de rehabilitación e impermeabilización de cubierta residencial en Oviedo, Asturias ejecutado por RADECO.',
    createdAt: '2026-09-12T10:00:00.000Z',
    updatedAt: '2026-10-15T14:30:00.000Z',
  },
  {
    id: 'obra-mieres-02',
    slug: 'impermeabilizacion-terraza-mieres',
    title: 'Impermeabilización y rehabilitación de terraza',
    subtitle:
      'Eliminación definitiva de filtraciones y renovación con sistema de impermeabilización continua y pavimento técnico.',
    municipality: 'Mieres',
    province: 'Asturias',
    status: 'published',
    featured: true,
    coverImage: '/images/projects/mieres-after.jpg',
    beforeImage: '/images/projects/mieres-before.jpg',
    afterImage: '/images/projects/mieres-after.jpg',
    beforeLabel: 'Estado previo: fisuras en pavimento, embolsamiento de agua y filtración inferior',
    afterLabel: 'Resultado RADECO: impermeabilización bicapa y pavimento porcelánico C3',
    gallery: [
      {
        id: 'mi-img-1',
        url: '/images/projects/mieres-after.jpg',
        alt: 'Terraza rehabilitada e impermeabilizada en Mieres, Asturias',
        caption: 'Superficie final en gres porcelánico antideslizante con pendientes corregidas.',
        category: 'acabado',
        order: 1,
      },
      {
        id: 'mi-img-2',
        url: '/images/projects/mieres-detail-1.jpg',
        alt: 'Aplicación de membrana impermeabilizante armada en terraza de Mieres',
        caption: 'Aplicación de membrana continua armada con geotextil y refuerzo perimetral.',
        category: 'ejecucion',
        order: 2,
      },
      {
        id: 'mi-img-3',
        url: '/images/projects/mieres-detail-2.jpg',
        alt: 'Detalle de drenaje lineal y entrega en peto perimetral en Mieres',
        caption: 'Integración de canaleta de drenaje lineal en acero inoxidable y sellado elástico.',
        category: 'detalle',
        order: 3,
      },
    ],
    description:
      'Actuación técnica en una terraza residencial en Mieres afectada por filtraciones hacia la vivienda inferior debido al agotamiento de la lámina antigua y juntas abiertas. Se realizó la demolición controlada del solado deteriorado, regularización de pendientes hacia sumideros, tratamiento de entregas en petos mediante bandas elásticas, aplicación de sistema de impermeabilización continuo armado y colocación de pavimento porcelánico exterior antideslizante.',
    technicalContext:
      'El soporte presentaba pendientes insuficientes que provocaban estancamiento de agua junto al paramento vertical y filtración por capilaridad en los encuentros de puerta balconera.',
    interventionDetails:
      'Se ejecutó una prueba de estanqueidad previa al solado y se instalaron juntas de dilatación perimetrales y de partición con masilla de poliuretano de bajo módulo.',
    services: ['Impermeabilización', 'Terrazas', 'Rehabilitación', 'Acabado'],
    duration: '2 semanas',
    propertyType: 'Terraza / Ático Residencial',
    technicalSpecs: [
      { label: 'Sistema de estanqueidad', value: 'Membrana continua de poliuretano armada + lámina desolidarizante' },
      { label: 'Puntos singulares', value: 'Bandas elastoméricas en medias cañas, sumideros y umbrales' },
      { label: 'Pavimento final', value: 'Gres porcelánico técnico exterior antideslizante (Clase C3)' },
      { label: 'Drenaje', value: 'Cazoleta sifónica renovada y canaleta lineal perimetral' },
    ],
    warrantyWorkmanship: '5 años',
    warrantyMaterials: 'Según fabricante',
    warrantyConditions:
      'Garantía de mano de obra vinculada a la estanqueidad del sistema ejecutado en condiciones de uso residencial normal y mantenimiento libre de obstrucciones en sumideros. Materiales garantizados según especificaciones del fabricante.',
    qualitySealItems: [
      'Control de ejecución',
      'Materiales seleccionados',
      'Acabado profesional',
      'Control de calidad',
    ],
    seoTitle: 'Impermeabilización y Rehabilitación de Terraza en Mieres, Asturias | RADECO',
    seoDescription:
      'Obra de impermeabilización y rehabilitación integral de terraza en Mieres, Asturias realizada por RADECO.',
    createdAt: '2026-09-20T09:00:00.000Z',
    updatedAt: '2026-10-18T11:20:00.000Z',
  },
  {
    id: 'obra-gijon-03',
    slug: 'rehabilitacion-cubierta-gijon',
    title: 'Rehabilitación de cubierta y terraza frente a ambiente marino',
    subtitle:
      'Solución integral de estanqueidad y protección anticorrosiva para edificación residencial expuesta a brisa salina.',
    municipality: 'Gijón',
    province: 'Asturias',
    status: 'published',
    featured: true,
    coverImage: '/images/projects/gijon-after.jpg',
    beforeImage: '/images/projects/gijon-before.jpg',
    afterImage: '/images/projects/gijon-after.jpg',
    beforeLabel: 'Estado previo: degradación por ambiente salino y filtraciones en encuentros',
    afterLabel: 'Resultado RADECO: cubierta técnica y terraza estanca de alta durabilidad',
    gallery: [
      {
        id: 'gi-img-1',
        url: '/images/projects/gijon-after.jpg',
        alt: 'Cubierta y terraza rehabilitada en Gijón, Asturias',
        caption: 'Vista del conjunto rehabilitado con rematería resistente a la corrosión marina.',
        category: 'acabado',
        order: 1,
      },
      {
        id: 'gi-img-2',
        url: '/images/projects/gijon-detail-1.jpg',
        alt: 'Sellado de juntas y barrera impermeable en cubierta de Gijón',
        caption: 'Ejecución de sellados de alta resistencia UV y salina en juntas estructurales.',
        category: 'ejecucion',
        order: 2,
      },
      {
        id: 'gi-img-3',
        url: '/images/projects/gijon-detail-2.jpg',
        alt: 'Acabado de encuentro entre cubierta y terraza transitable en Gijón',
        caption: 'Encuentro limpio entre faldón de cubierta, albardilla y terraza solárium.',
        category: 'detalle',
        order: 3,
      },
    ],
    description:
      'Rehabilitación técnica de cubierta mixta (inclinada y terraza plana contigua) en el municipio de Gijón. La proximidad a la costa exigió la selección de materiales inertes a la corrosión salina, la renovación completa del paquete de impermeabilización y la ejecución de remates perimetrales estancos frente a rachas de viento y lluvia horizontal.',
    technicalContext:
      'Los remates metálicos preexistentes presentaban oxidación avanzada y las juntas entre el faldón inclinado y la terraza plana permitían la entrada de agua con viento del noroeste.',
    interventionDetails:
      'Se instaló aislamiento térmico de célula cerrada, sistema de impermeabilización bicapa adherido y rematería prelacada de calidad marina con fijaciones ocultas.',
    services: ['Cubiertas y tejados', 'Impermeabilización', 'Terrazas', 'Rehabilitación'],
    duration: '3 semanas',
    propertyType: 'Vivienda Unifamiliar',
    technicalSpecs: [
      { label: 'Exposición climática', value: 'Ambiente marino / alta exigencia frente a lluvia con viento' },
      { label: 'Impermeabilización', value: 'Sistema bicapa elastomérico + membrana de poliuretano en detalles' },
      { label: 'Aislamiento', value: 'Panel térmico de alta resistencia a compresión' },
      { label: 'Rematería', value: 'Aluminio lacado con tratamiento marino y juntas de EPDM' },
    ],
    warrantyWorkmanship: '5 años',
    warrantyMaterials: 'Según fabricante',
    warrantyConditions:
      'Garantía sobre la ejecución de los trabajos de impermeabilización y cobertura según condiciones especificadas en el acta de recepción. Garantía de materiales sujeta a las condiciones del fabricante para entornos costeros.',
    qualitySealItems: [
      'Trabajo supervisado',
      'Materiales seleccionados',
      'Acabado profesional',
      'Control de calidad',
    ],
    seoTitle: 'Rehabilitación de Cubierta y Terraza en Gijón, Asturias | Obra RADECO',
    seoDescription:
      'Rehabilitación e impermeabilización de cubierta y terraza en Gijón, Asturias. Soluciones duraderas frente a la humedad y ambiente marino.',
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-22T16:00:00.000Z',
  },
  {
    id: 'obra-lena-04',
    slug: 'rehabilitacion-tejado-pizarra-lena',
    title: 'Rehabilitación de cubierta en montaña asturiana',
    subtitle:
      'Renovación estructural, aislamiento térmico reforzado y cobertura preparada para nieve y heladas.',
    municipality: 'Lena',
    province: 'Asturias',
    status: 'published',
    featured: true,
    coverImage: '/images/projects/lena-after.jpg',
    beforeImage: '/images/projects/lena-before.jpg',
    afterImage: '/images/projects/lena-after.jpg',
    beforeLabel: 'Estado previo: cubierta deteriorada por ciclos de hielo-deshielo',
    afterLabel: 'Resultado RADECO: cubierta rehabilitada con aislamiento reforzado y alta resistencia',
    gallery: [
      {
        id: 'le-img-1',
        url: '/images/projects/lena-after.jpg',
        alt: 'Cubierta rehabilitada en el concejo de Lena, Asturias',
        caption: 'Cubierta finalizada en Lena, diseñada para soportar cargas térmicas y pluviométricas de montaña.',
        category: 'acabado',
        order: 1,
      },
      {
        id: 'le-img-2',
        url: '/images/projects/lena-detail-1.jpg',
        alt: 'Estructura y cámara ventilada de cubierta en Lena, Asturias',
        caption: 'Detalle de subestructura portante, barrera de vapor y aislamiento térmico reforzado.',
        category: 'estructura',
        order: 2,
      },
    ],
    description:
      'Rehabilitación integral de cubierta en el concejo de Lena, proyectada específicamente para resistir fuertes contrastes térmicos, heladas invernales y precipitaciones intensas. Se reforzó la base estructural, se incrementó el espesor del aislamiento térmico y se ejecutó una cobertura con fijación mecánica reforzada y ganchos inoxidables.',
    technicalContext:
      'Las bajas temperaturas invernales y los ciclos de hielo-deshielo habían fracturado las piezas antiguas y deteriorado los encuentros con los muros de piedra.',
    interventionDetails:
      'Se incorporó doble lámina impermeable en aleros y limahoyas para prevenir infiltraciones por retención de nieve o hielo.',
    services: ['Cubiertas y tejados', 'Rehabilitación', 'Impermeabilización', 'Mantenimiento'],
    duration: '4 semanas',
    propertyType: 'Edificación Residencial en Entorno Rural',
    technicalSpecs: [
      { label: 'Climatología de diseño', value: 'Zona de montaña · resistencia a heladas y sobrecarga' },
      { label: 'Aislamiento térmico', value: 'Espesor reforzado de alta densidad (baja conductividad térmica)' },
      { label: 'Fijaciones', value: 'Acero inoxidable AISI 316 resistente a la intemperie' },
      { label: 'Impermeabilización', value: 'Lámina transpirable de alto gramaje con solapes termosellados' },
    ],
    warrantyWorkmanship: '5 años',
    warrantyMaterials: 'Según fabricante',
    warrantyConditions:
      'Garantía de mano de obra aplicable a la intervención ejecutada conforme a las especificaciones del proyecto. La garantía de los materiales corresponde a la otorgada por cada fabricante.',
    qualitySealItems: [
      'Control de ejecución',
      'Materiales seleccionados',
      'Acabado profesional',
      'Control de calidad',
    ],
    seoTitle: 'Rehabilitación de Tejado y Cubierta en Lena, Asturias | Obra RADECO',
    seoDescription:
      'Proyecto de rehabilitación e impermeabilización de cubierta en Lena, Asturias ejecutado por RADECO.',
    createdAt: '2026-10-10T11:00:00.000Z',
    updatedAt: '2026-10-28T17:45:00.000Z',
  },
  {
    id: 'obra-lena-draft-05',
    slug: 'cubierta-residencial-lena',
    title: 'Cubierta residencial — Lena',
    subtitle: 'Intervención de impermeabilización y sustitución de cobertura en vivienda unifamiliar.',
    municipality: 'Lena',
    province: 'Asturias',
    status: 'draft',
    featured: false,
    coverImage: '/images/projects/lena-after.jpg',
    beforeImage: '/images/projects/lena-before.jpg',
    afterImage: '/images/projects/lena-after.jpg',
    gallery: [
      {
        id: 'le-dr-1',
        url: '/images/projects/lena-after.jpg',
        alt: 'Cubierta residencial en Lena (En edición)',
        caption: 'Documentación fotográfica en fase de catalogación.',
        category: 'acabado',
        order: 1,
      },
    ],
    description:
      'Proyecto en fase de documentación final para su publicación en el catálogo de obras de RADECO. Incluye rehabilitación de faldones, impermeabilización bajo teja y renovación de canalones.',
    services: ['Cubiertas y tejados', 'Impermeabilización'],
    duration: '2 semanas',
    propertyType: 'Vivienda Unifamiliar',
    technicalSpecs: [
      { label: 'Estado documental', value: 'Borrador en revisión técnica' },
    ],
    warrantyWorkmanship: '5 años',
    warrantyMaterials: 'Según fabricante',
    warrantyConditions:
      'Condiciones de garantía pendientes de validación final en la ficha de cierre de obra.',
    qualitySealItems: [
      'Trabajo supervisado',
      'Materiales seleccionados',
      'Acabado profesional',
      'Control de calidad',
    ],
    createdAt: '2026-11-01T09:00:00.000Z',
    updatedAt: '2026-11-01T09:00:00.000Z',
  },
];

let memoryCacheDb: DatabaseSchema | null = null;

function createInitialDb(): DatabaseSchema {
  const defaultAdminPass = process.env.RADECO_ADMIN_PASSWORD || 'Radeco2026!';
  const { hash, salt } = hashPassword(defaultAdminPass);
  return {
    projects: INITIAL_PROJECTS,
    settings: DEFAULT_SETTINGS,
    leads: [],
    adminPasswordHash: hash,
    adminPasswordSalt: salt,
  };
}

function ensureDatabase(): DatabaseSchema {
  // 1. Check /tmp warm cache first (used in Netlify serverless environment after mutations)
  if (fs.existsSync(TMP_DB_FILE)) {
    try {
      const raw = fs.readFileSync(TMP_DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as DatabaseSchema;
      if (parsed && Array.isArray(parsed.projects)) {
        memoryCacheDb = parsed;
        return parsed;
      }
    } catch {
      // ignore
    }
  }

  // 2. Check bundled data/db.json
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as DatabaseSchema;
      if (!parsed.projects) parsed.projects = INITIAL_PROJECTS;
      if (!parsed.settings) parsed.settings = DEFAULT_SETTINGS;
      if (!parsed.leads) parsed.leads = [];
      memoryCacheDb = parsed;
      return parsed;
    } catch {
      // fallback
    }
  }

  if (memoryCacheDb) {
    return memoryCacheDb;
  }

  const initialDb = createInitialDb();
  memoryCacheDb = initialDb;
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: DatabaseSchema): void {
  memoryCacheDb = db;
  const serialized = JSON.stringify(db, null, 2);

  // Try writing to project data/db.json (works in local dev and build time)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, serialized, 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch {
    // On Netlify serverless functions, /var/task is read-only; write to /tmp
  }

  // Always write to /tmp/radeco-db.json as well so serverless warm instances have instant sync
  try {
    fs.writeFileSync(TMP_DB_FILE, serialized, 'utf-8');
  } catch {
    // ignore
  }

  // Async background sync to Netlify Blobs when running on Netlify
  try {
    const store = getStore('radeco-cms');
    store.setJSON('db', db).catch(() => {});
  } catch {
    // Netlify Blobs not active locally
  }
}

export async function syncFromNetlifyBlobs(): Promise<DatabaseSchema> {
  try {
    const store = getStore('radeco-cms');
    const remoteDb = (await store.get('db', { type: 'json' })) as DatabaseSchema | null;
    if (remoteDb && Array.isArray(remoteDb.projects)) {
      memoryCacheDb = remoteDb;
      try {
        fs.writeFileSync(TMP_DB_FILE, JSON.stringify(remoteDb, null, 2), 'utf-8');
      } catch {
        // ignore
      }
      return remoteDb;
    }
  } catch {
    // Not in Netlify Blobs context
  }
  return ensureDatabase();
}

export function getPublishedProjects(): Project[] {
  const db = ensureDatabase();
  return db.projects
    .filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllProjectsAdmin(): Project[] {
  const db = ensureDatabase();
  return db.projects.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getProjectBySlug(slug: string, includeDraft = false): Project | undefined {
  const db = ensureDatabase();
  return db.projects.find(
    (p) => p.slug === slug && (includeDraft || p.status === 'published')
  );
}

export function getProjectById(id: string): Project | undefined {
  const db = ensureDatabase();
  return db.projects.find((p) => p.id === id);
}

export function createOrUpdateProject(project: Project): Project {
  const db = ensureDatabase();
  const existingIndex = db.projects.findIndex((p) => p.id === project.id);
  const now = new Date().toISOString();

  const updatedProject: Project = {
    ...project,
    updatedAt: now,
    createdAt: existingIndex >= 0 ? db.projects[existingIndex].createdAt : now,
  };

  if (existingIndex >= 0) {
    db.projects[existingIndex] = updatedProject;
  } else {
    db.projects.unshift(updatedProject);
  }

  saveDatabase(db);
  return updatedProject;
}

export function deleteProjectById(id: string): boolean {
  const db = ensureDatabase();
  const initialLen = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  if (db.projects.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

export function getCompanySettings(): CompanySettings {
  const db = ensureDatabase();
  return db.settings;
}

export function updateCompanySettings(newSettings: Partial<CompanySettings>): CompanySettings {
  const db = ensureDatabase();
  db.settings = {
    ...db.settings,
    ...newSettings,
  };
  saveDatabase(db);
  return db.settings;
}

export function addLeadSubmission(
  lead: Omit<LeadSubmission, 'id' | 'createdAt' | 'status'>
): LeadSubmission {
  const db = ensureDatabase();
  const newLead: LeadSubmission = {
    ...lead,
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: 'nuevo',
  };
  db.leads.unshift(newLead);
  saveDatabase(db);
  return newLead;
}

export function getLeadsAdmin(): LeadSubmission[] {
  const db = ensureDatabase();
  return db.leads;
}

export function updateLeadStatus(id: string, status: LeadSubmission['status']): boolean {
  const db = ensureDatabase();
  const lead = db.leads.find((l) => l.id === id);
  if (!lead) return false;
  lead.status = status;
  saveDatabase(db);
  return true;
}

export function getAdminCredentials(): { hash: string; salt: string } {
  const db = ensureDatabase();
  return { hash: db.adminPasswordHash, salt: db.adminPasswordSalt };
}

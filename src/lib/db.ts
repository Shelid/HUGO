import fs from 'fs';
import os from 'os';
import path from 'path';
import { cache } from 'react';
import { getStore } from '@netlify/blobs';
import { DatabaseSchema, Project, CompanySettings, LeadSubmission } from '@/types';
import { hashPassword } from './password';
import { DEFAULT_SETTINGS, INITIAL_PROJECTS } from './seed-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const TMP_DB_FILE = path.join(os.tmpdir(), 'radeco-db.json');
const DEFAULT_ADMIN_PASSWORD = 'Radeco2026!';

let memoryDb: DatabaseSchema | null = null;

function cmsStore() {
  // Strong consistency: an edit saved in /admin is visible immediately on the next read,
  // even when it is served by a different serverless instance.
  return getStore({ name: 'radeco-cms', consistency: 'strong' });
}

function normalize(db: DatabaseSchema): DatabaseSchema {
  if (!Array.isArray(db.projects)) db.projects = INITIAL_PROJECTS;
  db.settings = { ...DEFAULT_SETTINGS, ...(db.settings || {}) };
  if (!Array.isArray(db.leads)) db.leads = [];
  if (!db.adminPasswordHash || !db.adminPasswordSalt) {
    const { hash, salt } = hashPassword(DEFAULT_ADMIN_PASSWORD);
    db.adminPasswordHash = hash;
    db.adminPasswordSalt = salt;
    db.adminPasswordCustom = false;
  }
  return db;
}

function readJsonFile(file: string): DatabaseSchema | null {
  try {
    if (!fs.existsSync(file)) return null;
    const parsed = JSON.parse(fs.readFileSync(file, 'utf-8')) as DatabaseSchema;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function loadLocal(): DatabaseSchema {
  const local = readJsonFile(TMP_DB_FILE) || readJsonFile(DB_FILE);
  if (local) return normalize(local);
  return normalize({
    projects: INITIAL_PROJECTS,
    settings: DEFAULT_SETTINGS,
    leads: [],
    adminPasswordHash: '',
    adminPasswordSalt: '',
  });
}

function ensureDatabase(): DatabaseSchema {
  if (!memoryDb) memoryDb = loadLocal();
  return memoryDb;
}

function writeLocal(serialized: string) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, serialized, 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch {
    // read-only filesystem on Netlify Functions
  }
  try {
    fs.writeFileSync(TMP_DB_FILE, serialized, 'utf-8');
  } catch {
    // ignore
  }
}

/**
 * Persists the database. The Netlify Blobs write is AWAITED: serverless functions are
 * frozen as soon as the response is sent, so a fire-and-forget write could be lost.
 */
async function saveDatabase(db: DatabaseSchema): Promise<void> {
  memoryDb = db;
  writeLocal(JSON.stringify(db, null, 2));
  try {
    await cmsStore().setJSON('db', db);
  } catch {
    // Netlify Blobs not available (local development)
  }
}

/** Loads the latest database from Netlify Blobs (falls back to local data). */
export async function syncFromNetlifyBlobs(): Promise<DatabaseSchema> {
  try {
    const remote = (await cmsStore().get('db', { type: 'json' })) as DatabaseSchema | null;
    if (remote && Array.isArray(remote.projects)) {
      memoryDb = normalize(remote);
      return memoryDb;
    }
  } catch {
    // Not running on Netlify
  }
  return ensureDatabase();
}

/** Per-request memoized loader for Server Components (layout + page + metadata share one read). */
export const loadDb = cache(syncFromNetlifyBlobs);

// ---------------------------------------------------------------- Projects

export function getPublishedProjects(): Project[] {
  return ensureDatabase()
    .projects.filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllProjectsAdmin(): Project[] {
  return [...ensureDatabase().projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getProjectBySlug(slug: string, includeDraft = false): Project | undefined {
  return ensureDatabase().projects.find(
    (p) => p.slug === slug && (includeDraft || p.status === 'published')
  );
}

export function getProjectById(id: string): Project | undefined {
  return ensureDatabase().projects.find((p) => p.id === id);
}

export async function createOrUpdateProject(project: Project): Promise<Project> {
  const db = await syncFromNetlifyBlobs();
  const existingIndex = db.projects.findIndex((p) => p.id === project.id);
  const now = new Date().toISOString();

  const updatedProject: Project = {
    ...project,
    updatedAt: now,
    createdAt: existingIndex >= 0 ? db.projects[existingIndex].createdAt : now,
  };

  if (existingIndex >= 0) db.projects[existingIndex] = updatedProject;
  else db.projects.unshift(updatedProject);

  await saveDatabase(db);
  return updatedProject;
}

export async function deleteProjectById(id: string): Promise<boolean> {
  const db = await syncFromNetlifyBlobs();
  const initialLen = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  if (db.projects.length === initialLen) return false;
  await saveDatabase(db);
  return true;
}

// ---------------------------------------------------------------- Settings

export function getCompanySettings(): CompanySettings {
  return ensureDatabase().settings;
}

export async function updateCompanySettings(
  newSettings: Partial<CompanySettings>
): Promise<CompanySettings> {
  const db = await syncFromNetlifyBlobs();
  const clean = Object.fromEntries(
    Object.entries(newSettings).filter(([, v]) => v !== undefined)
  ) as Partial<CompanySettings>;
  db.settings = { ...db.settings, ...clean };
  await saveDatabase(db);
  return db.settings;
}

// ---------------------------------------------------------------- Leads

export async function addLeadSubmission(
  lead: Omit<LeadSubmission, 'id' | 'createdAt' | 'status'>
): Promise<LeadSubmission> {
  const db = await syncFromNetlifyBlobs();
  const newLead: LeadSubmission = {
    ...lead,
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: 'nuevo',
  };
  db.leads.unshift(newLead);
  await saveDatabase(db);
  return newLead;
}

export function getLeadsAdmin(): LeadSubmission[] {
  return ensureDatabase().leads;
}

export async function updateLeadStatus(
  id: string,
  status: LeadSubmission['status']
): Promise<boolean> {
  const db = await syncFromNetlifyBlobs();
  const lead = db.leads.find((l) => l.id === id);
  if (!lead) return false;
  lead.status = status;
  await saveDatabase(db);
  return true;
}

// ---------------------------------------------------------------- Admin credentials

export function getAdminCredentials(): { hash: string; salt: string; custom: boolean } {
  const db = ensureDatabase();
  return {
    hash: db.adminPasswordHash,
    salt: db.adminPasswordSalt,
    custom: Boolean(db.adminPasswordCustom),
  };
}

export async function setAdminPassword(newPassword: string): Promise<void> {
  const db = await syncFromNetlifyBlobs();
  const { hash, salt } = hashPassword(newPassword);
  db.adminPasswordHash = hash;
  db.adminPasswordSalt = salt;
  db.adminPasswordCustom = true;
  await saveDatabase(db);
}

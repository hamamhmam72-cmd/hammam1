import { useSyncExternalStore } from "react"
import { SEED_PROJECTS } from "@/data/seed-projects"
import type { Project, ProjectInput } from "./types"

/**
 * Project storage.
 *
 * Today this reads and writes the browser's localStorage, so changes persist across sessions
 * on THIS browser. To move to a shared database (Supabase, Firebase, your own API), replace
 * `readPersisted` / `writePersisted` below; nothing else in the app needs to change.
 */
const KEY = "portfolio:projects:v1"

let projects: Project[] = load()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

function str(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback
}

function normalize(raw: unknown): Project | null {
  if (!raw || typeof raw !== "object") return null
  const r = raw as Record<string, unknown>
  const title = str(r.title).trim()
  if (!title) return null
  const now = Date.now()
  return {
    id: str(r.id) || newId(),
    title,
    description: str(r.description),
    details: str(r.details),
    image: str(r.image),
    category: str(r.category),
    tags: Array.isArray(r.tags) ? r.tags.filter((x): x is string => typeof x === "string" && !!x.trim()).map((x) => x.trim()) : [],
    liveUrl: str(r.liveUrl),
    githubUrl: str(r.githubUrl),
    year: str(r.year),
    featured: r.featured === true,
    createdAt: typeof r.createdAt === "number" ? r.createdAt : now,
    updatedAt: typeof r.updatedAt === "number" ? r.updatedAt : now,
  }
}

function readPersisted(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

function writePersisted(value: string | null): boolean {
  try {
    if (value === null) localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, value)
    return true
  } catch {
    return false
  }
}

function load(): Project[] {
  const raw = readPersisted()
  if (raw === null) return SEED_PROJECTS
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return SEED_PROJECTS
    return parsed.map(normalize).filter((p): p is Project => p !== null)
  } catch {
    return SEED_PROJECTS
  }
}

export function newId() {
  return `p_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

export type SaveResult = { ok: true; persisted: boolean } | { ok: false; error: string }

function commit(next: Project[]): SaveResult {
  const persisted = writePersisted(JSON.stringify(next))
  // If storage is full, refuse the change instead of silently losing it on reload.
  if (!persisted && readPersisted() !== null) {
    return { ok: false, error: "Browser storage is full. Remove a large image or delete a project, then try again." }
  }
  projects = next
  emit()
  return { ok: true, persisted }
}

export function createProject(input: ProjectInput): SaveResult & { id?: string } {
  const now = Date.now()
  const project: Project = { ...input, id: newId(), createdAt: now, updatedAt: now }
  const res = commit([project, ...projects])
  return res.ok ? { ...res, id: project.id } : res
}

export function updateProject(id: string, input: ProjectInput): SaveResult {
  return commit(projects.map((p) => (p.id === id ? { ...p, ...input, updatedAt: Date.now() } : p)))
}

export function deleteProject(id: string): SaveResult {
  return commit(projects.filter((p) => p.id !== id))
}

export function restoreProject(project: Project, index: number): SaveResult {
  const next = projects.filter((p) => p.id !== project.id)
  next.splice(Math.min(index, next.length), 0, project)
  return commit(next)
}

export function resetProjects(): SaveResult {
  writePersisted(null)
  projects = SEED_PROJECTS
  emit()
  return { ok: true, persisted: true }
}

export function exportProjects(): string {
  return JSON.stringify(projects, null, 2)
}

export function importProjects(json: string): { ok: true; count: number } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(json)
    if (!Array.isArray(parsed)) return { ok: false, error: "That file isn't a list of projects." }
    const next = parsed.map(normalize).filter((p): p is Project => p !== null)
    if (!next.length && parsed.length) return { ok: false, error: "No valid projects found (each needs a title)." }
    const res = commit(next)
    return res.ok ? { ok: true, count: next.length } : { ok: false, error: res.error }
  } catch {
    return { ok: false, error: "Couldn't read that file. Is it valid JSON?" }
  }
}

export function storageUsageKB(): number {
  return Math.round(((readPersisted() ?? "").length * 2) / 1024)
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY || e.key === null) {
      projects = load()
      emit()
    }
  })
}

export function useProjects(): Project[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => projects,
    () => projects,
  )
}

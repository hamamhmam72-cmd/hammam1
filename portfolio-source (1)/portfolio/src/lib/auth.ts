import { useSyncExternalStore } from "react"

/**
 * Client-side gate for the admin panel. It keeps casual visitors out of the editor, but it is
 * NOT real security: everything runs in the browser. Anything that must be private needs a server.
 */
const HASH_KEY = "portfolio:admin:passcode:v1"
const SESSION_KEY = "portfolio:admin:session:v1"
export const DEFAULT_PASSCODE = "portfolio"

const listeners = new Set<() => void>()
let memoryAuthed = false
let fails = 0
let lockedUntil = 0

function emit() {
  listeners.forEach((l) => l())
}

async function sha256(text: string): Promise<string> {
  const input = `kr-portfolio:${text}`
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input))
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("")
  }
  let h = 5381
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) | 0
  return `d${h >>> 0}`
}

function readSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1"
  } catch {
    return memoryAuthed
  }
}
function writeSession(v: boolean) {
  memoryAuthed = v
  try {
    if (v) sessionStorage.setItem(SESSION_KEY, "1")
    else sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* memory fallback already set */
  }
  emit()
}

function storedHash(): string | null {
  try {
    return localStorage.getItem(HASH_KEY)
  } catch {
    return null
  }
}

async function expectedHash() {
  return storedHash() ?? (await sha256(DEFAULT_PASSCODE))
}

export function isDefaultPasscode() {
  return storedHash() === null
}

export type LoginResult = { ok: true } | { ok: false; lockedFor?: number }

export async function login(passcode: string): Promise<LoginResult> {
  const now = Date.now()
  if (now < lockedUntil) return { ok: false, lockedFor: Math.ceil((lockedUntil - now) / 1000) }
  const ok = (await sha256(passcode)) === (await expectedHash())
  if (ok) {
    fails = 0
    writeSession(true)
    return { ok: true }
  }
  fails += 1
  if (fails >= 5) {
    lockedUntil = Date.now() + 30_000
    fails = 0
    return { ok: false, lockedFor: 30 }
  }
  return { ok: false }
}

export function logout() {
  writeSession(false)
}

export async function changePasscode(current: string, next: string): Promise<boolean> {
  if ((await sha256(current)) !== (await expectedHash())) return false
  try {
    localStorage.setItem(HASH_KEY, await sha256(next))
  } catch {
    return false
  }
  emit()
  return true
}

export function useAuth() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    readSession,
    () => false,
  )
}

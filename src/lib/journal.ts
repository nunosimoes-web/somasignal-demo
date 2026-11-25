import { regionById, type RegionId } from '../data/regions'

/** Registo opcional, guardado apenas neste navegador e só depois de a pessoa o pedir. */
export type JournalEntry = { date: string; regionId: RegionId; action: string; before: number; after: number }

const KEY = 'somasignal.journal.v1'
const LIMIT = 20
const EMPTY: JournalEntry[] = []

function isScore(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 10
}

function isEntry(value: unknown): value is JournalEntry {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const entry = value as Record<string, unknown>
  return (
    typeof entry.date === 'string' &&
    !Number.isNaN(Date.parse(entry.date)) &&
    typeof entry.regionId === 'string' &&
    regionById.has(entry.regionId as RegionId) &&
    typeof entry.action === 'string' &&
    isScore(entry.before) &&
    isScore(entry.after)
  )
}

/** Dados corrompidos ou de outra versão são ignorados em vez de partir a página. */
export function parseJournal(raw: string | null): JournalEntry[] {
  if (!raw) {
    return EMPTY
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isEntry).slice(0, LIMIT) : EMPTY
  } catch {
    return EMPTY
  }
}

const listeners = new Set<() => void>()
let cachedRaw: string | null = null
let cached: JournalEntry[] = EMPTY

function notify() {
  listeners.forEach((listener) => listener())
}

export const journalStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    window.addEventListener('storage', listener)
    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', listener)
    }
  },
  getSnapshot(): JournalEntry[] {
    let raw: string | null = null
    try {
      raw = window.localStorage.getItem(KEY)
    } catch {
      return EMPTY
    }
    if (raw !== cachedRaw) {
      cachedRaw = raw
      cached = parseJournal(raw)
    }
    return cached
  },
  getServerSnapshot(): JournalEntry[] {
    return EMPTY
  },
  /** `false` se o navegador recusar (armazenamento cheio ou bloqueado). */
  add(entry: JournalEntry): boolean {
    try {
      window.localStorage.setItem(KEY, JSON.stringify([entry, ...journalStore.getSnapshot()].slice(0, LIMIT)))
    } catch {
      return false
    }
    notify()
    return true
  },
  /** `false` se o navegador recusar: nunca dizer «apagado» sem ter apagado. */
  clear(): boolean {
    try {
      window.localStorage.removeItem(KEY)
    } catch {
      return false
    }
    notify()
    return true
  },
}

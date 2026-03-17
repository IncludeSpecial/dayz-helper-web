import type { Ammo, RaidPlan, RaidSingleState, RaidMultiState } from '~/types/raid'

const KEYS = {
  single: 'raid-single',
  multi: 'raid-multi',
  plans: 'raid-plans'
} as const

function safeParse<T> (raw: string | null, fallback: T): T {
  try {
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function normalizeAmmo (a: { weapon?: string; count?: number }): Ammo {
  return { weapon: String(a?.weapon ?? ''), count: Number(a?.count ?? 0) }
}

export function useRaidState () {
  function loadSingle (): RaidSingleState | null {
    if (import.meta.client) {
      return safeParse(localStorage.getItem(KEYS.single), null)
    }
    return null
  }

  function saveSingle (state: RaidSingleState) {
    if (import.meta.client) {
      localStorage.setItem(KEYS.single, JSON.stringify(state))
    }
  }

  function loadMulti (): RaidMultiState | null {
    if (import.meta.client) {
      const raw = safeParse<{ ammo?: unknown[]; wall?: string; mult?: number } | null>(localStorage.getItem(KEYS.multi), null)
      if (!raw) return null
      const ammo = Array.isArray(raw.ammo) ? raw.ammo.map(normalizeAmmo) : undefined
      return { ammo, wall: raw.wall, mult: raw.mult }
    }
    return null
  }

  function saveMulti (state: RaidMultiState) {
    if (import.meta.client) {
      localStorage.setItem(KEYS.multi, JSON.stringify(state))
    }
  }

  function loadPlans (): RaidPlan[] {
    if (import.meta.client) {
      const raw = safeParse<unknown[]>(localStorage.getItem(KEYS.plans), [])
      if (!Array.isArray(raw)) return []
      return raw.map((p: unknown) => {
        const x = p as Record<string, unknown>
        const ammo = Array.isArray(x.ammo) ? x.ammo.map(normalizeAmmo) : []
        return {
          id: String(x.id ?? ''),
          name: String(x.name ?? ''),
          wall: String(x.wall ?? ''),
          mult: Number(x.mult ?? 1),
          ammo
        }
      })
    }
    return []
  }

  function savePlans (plans: RaidPlan[]) {
    if (import.meta.client) {
      localStorage.setItem(KEYS.plans, JSON.stringify(plans))
    }
  }

  return {
    loadSingle,
    saveSingle,
    loadMulti,
    saveMulti,
    loadPlans,
    savePlans
  }
}

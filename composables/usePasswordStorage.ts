import type { PasswordEntry, GeneratorDefaults } from '~/types/generator'

const KEYS = {
  passwords: 'dayz-passwords',
  history: 'dayz-passwords-history',
  defaults: 'dayz-generator-defaults'
} as const

function safeParse<T> (raw: string | null, fallback: T): T {
  try {
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function usePasswordStorage () {
  const passwords = ref<PasswordEntry[]>([])
  const history = ref<PasswordEntry[]>([])
  const defaults = ref<GeneratorDefaults | null>(null)

  function load () {
    if (import.meta.client && typeof localStorage !== 'undefined') {
      passwords.value = safeParse(localStorage.getItem(KEYS.passwords), [])
      history.value = safeParse(localStorage.getItem(KEYS.history), [])
      defaults.value = safeParse(localStorage.getItem(KEYS.defaults), null)
    }
  }

  function savePasswords (value: PasswordEntry[]) {
    passwords.value = value
    if (import.meta.client) {
      localStorage.setItem(KEYS.passwords, JSON.stringify(value))
    }
  }

  function saveHistory (value: PasswordEntry[]) {
    history.value = value
    if (import.meta.client) {
      localStorage.setItem(KEYS.history, JSON.stringify(value))
    }
  }

  function saveDefaults (value: GeneratorDefaults | null) {
    defaults.value = value
    if (import.meta.client) {
      localStorage.setItem(KEYS.defaults, JSON.stringify(value))
    }
  }

  return {
    passwords,
    history,
    defaults,
    load,
    savePasswords,
    saveHistory,
    saveDefaults
  }
}

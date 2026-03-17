const STORAGE_KEY = 'theme'

export type Theme = 'light' | 'dark'

export function useTheme () {
  const isDark = computed(() => {
    if (import.meta.client) {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })

  function getStored (): Theme | null {
    if (import.meta.client && typeof localStorage !== 'undefined') {
      const v = localStorage.getItem(STORAGE_KEY)
      if (v === 'light' || v === 'dark') return v
    }
    return null
  }

  function setTheme (theme: Theme) {
    if (import.meta.client) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem(STORAGE_KEY, theme)
    }
  }

  function toggle () {
    if (import.meta.client) {
      const next: Theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
      setTheme(next)
    }
  }

  return { isDark, getStored, setTheme, toggle }
}

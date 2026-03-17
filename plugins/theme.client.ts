export default defineNuxtPlugin(() => {
  /** HI-TECH: по умолчанию тёмная тема; сохраняем выбор в localStorage. */
  const theme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null
  if (theme === 'light') {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
  }
})

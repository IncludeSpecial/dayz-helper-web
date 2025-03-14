<template>
  <Button
      variant="outline"
      size="icon"
      @click="toggleTheme"
  >
    <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    <span class="sr-only">Переключить тему</span>
  </Button>
</template>

<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'

const toggleTheme = () => {
  const isDark = document.documentElement.classList.contains('dark')
  if(isDark) {
    document.documentElement.classList.remove('dark')
    localStorage.theme = 'light'
  } else {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  }
}
</script>
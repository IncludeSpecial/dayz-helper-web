<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <!-- Фон: сетка и градиент -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.06)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.06)_1px,transparent_1px)] bg-[size:3rem_3rem] dark:opacity-70" />
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] dark:bg-primary/15" />
      <div class="absolute bottom-1/4 right-0 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[100px] dark:bg-primary/10" />
    </div>

    <main class="relative flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
      <!-- 404 -->
      <div class="relative">
        <span class="text-[clamp(6rem,20vw,14rem)] font-bold tabular-nums leading-none tracking-tighter text-foreground/5 select-none" aria-hidden="true">
          {{ error?.statusCode || 404 }}
        </span>
        <p class="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-bold text-primary drop-shadow-[0_0_24px_hsl(var(--primary)/0.4)]">
          {{ error?.statusCode || 404 }}
        </p>
      </div>

      <h1 class="mt-6 text-xl sm:text-2xl font-semibold text-foreground text-center max-w-md">
        <template v-if="is404">Страница потерялась в зоне</template>
        <template v-else>Что-то пошло не так</template>
      </h1>
      <p class="mt-3 text-muted-foreground text-center max-w-sm">
        <template v-if="is404">Такой страницы нет — возможно, ссылка устарела или опечатка в адресе.</template>
        <template v-else>{{ error?.message || 'Попробуйте обновить страницу или вернуться на главную.' }}</template>
      </p>

      <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
        <NuxtLink
          to="/"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Home class="w-4 h-4" aria-hidden="true" />
          На главную
        </NuxtLink>
        <NuxtLink
          to="/generator"
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Генератор
        </NuxtLink>
        <NuxtLink
          to="/map"
          class="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Карта
        </NuxtLink>
      </div>

      <button
        v-if="error"
        type="button"
        class="mt-8 text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        @click="handleClearError"
      >
        Сбросить ошибку
      </button>
    </main>

    <!-- Подпись -->
    <footer class="relative py-6 text-center">
      <p class="text-xs text-muted-foreground">
        DayZ Helper · Всё в браузере, без серверов
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Home } from 'lucide-vue-next'
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError | null
}>()

const is404 = computed(() => props.error?.statusCode === 404)

function handleClearError () {
  clearError({ redirect: '/' })
}
</script>

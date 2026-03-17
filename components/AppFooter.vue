<template>
  <footer class="w-full border-t border-border bg-card mt-auto dark:border-primary/20" role="contentinfo">
    <!-- Акцентная линия -->
    <div class="h-0.5 w-full bg-primary/40" aria-hidden="true" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <p class="text-sm font-medium text-foreground">
            © {{ new Date().getFullYear() }} <span class="text-primary">DayZ Helper</span>
          </p>
          <p class="text-xs text-muted-foreground max-w-md">
            Инструменты для выживания в DayZ. Всё в браузере, данные никуда не отправляются.
          </p>
        </div>

        <nav class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm" aria-label="Навигация по сайту">
          <NuxtLink
            v-for="item in footerLinks"
            :key="item.path"
            :to="item.path"
            class="text-muted-foreground hover:text-primary transition-colors"
          >
            {{ item.label }}
          </NuxtLink>
          <span class="hidden sm:inline w-px h-4 bg-border" aria-hidden="true" />
          <a
            href="https://github.com/IncludeSpecial/dayz-helper-web"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Репозиторий на GitHub"
          >
            GitHub
          </a>
          <a
            href="https://discord.gg/Ykfhf46sxB"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Discord"
          >
            Discord
          </a>
        </nav>
      </div>

      <div class="mt-6 pt-6 border-t border-border flex justify-center">
        <a
          href="#main-content"
          class="text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-2 py-1"
          aria-label="Перейти к основному содержимому"
        >
          Наверх
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { footerNavItems: footerLinks } = useSiteNav()
</script>

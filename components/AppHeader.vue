<template>
  <header class="sticky top-0 z-50 w-full border-b border-border bg-card/98 backdrop-blur-md dark:bg-card/95 dark:border-primary/20">
    <!-- Акцентная линия -->
    <div class="h-0.5 w-full bg-primary/60" aria-hidden="true" />

    <div class="h-14 flex items-center justify-between gap-4 px-4 sm:px-6 max-w-7xl mx-auto">
      <!-- Логотип -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 shrink-0 min-h-[44px] rounded-md -ml-1 pl-1 pr-2 text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="DayZ Helper — главная"
      >
        <span class="font-bold text-lg tracking-tight">DayZ</span>
        <span class="font-semibold text-primary text-lg tracking-tight">Helper</span>
      </NuxtLink>

      <!-- Десктоп: навигация -->
      <nav class="hidden md:flex items-center gap-0.5" aria-label="Навигация">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="relative px-3 py-2 rounded-md text-sm font-medium min-h-[40px] flex items-center transition-colors"
          :class="isActive(item.path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'"
          :aria-current="isActive(item.path) ? 'page' : undefined"
        >
          <span v-if="isActive(item.path)" class="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" aria-hidden="true" />
          <span class="relative">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Правая часть: тема + мобильное меню -->
      <div class="flex items-center gap-1 shrink-0">
        <ThemeToggle />
        <button
          type="button"
          class="md:hidden p-2.5 rounded-md hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
          @click="menuOpen = !menuOpen"
        >
          <Menu v-if="!menuOpen" class="w-5 h-5" aria-hidden="true" />
          <X v-else class="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Оверлей -->
    <Transition name="fade">
      <div
        v-if="menuOpen"
        class="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] top-14"
        aria-hidden="true"
        @click="menuOpen = false"
      />
    </Transition>

    <!-- Мобильное меню -->
    <Transition name="slide">
      <nav
        v-if="menuOpen"
        id="mobile-menu"
        class="md:hidden fixed left-0 right-0 z-50 top-14 bottom-0 overflow-y-auto border-t border-border bg-card"
        aria-label="Меню"
      >
        <ul class="py-4 px-4 space-y-0.5" role="list">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="flex items-center px-4 py-3.5 rounded-lg text-base font-medium min-h-[48px]"
              :class="isActive(item.path) ? 'bg-primary/15 text-primary' : 'text-foreground hover:bg-muted'"
              :aria-current="isActive(item.path) ? 'page' : undefined"
              @click="menuOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import ThemeToggle from '@/components/ThemeToggle.vue'

const menuOpen = ref(false)
const route = useRoute()
const isActive = (path: string) => route.path === path

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') menuOpen.value = false
}

onMounted(() => document.addEventListener('keydown', handleEscape))
onBeforeUnmount(() => document.removeEventListener('keydown', handleEscape))

const { headerNavItems: navItems } = useSiteNav()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

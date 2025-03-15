<template>
  <header class="border-b sticky top-0 z-50 bg-white dark:bg-neutral-950 shadow-md">
    <Container>
      <nav class="flex items-center justify-between h-16">
        <!-- Логотип -->
        <NuxtLink to="/" class="flex items-center gap-2 font-bold">
          <BadgeHelp class="w-6 h-6 text-primary" />
          <span>DayZ Helper</span>
        </NuxtLink>

        <!-- Десктопное меню -->
        <div class="hidden md:flex justify-between items-center gap-4">

          <Button variant="outline" as-child>
            <NuxtLink to="/raid" class="flex items-center gap-2 font-bold">
              Калькулятор рейда
            </NuxtLink>
          </Button>
          <Button variant="outline" as-child>
            <NuxtLink to="/map" class="flex items-center gap-2 font-bold">
              Карта
            </NuxtLink>
          </Button>
          <Button variant="outline" as-child>
            <NuxtLink to="/generator" class="flex items-center gap-2 font-bold">
              Генератор
            </NuxtLink>
          </Button>
          <Button variant="ghost" as-child>
            <NuxtLink to="/history" class="flex items-center gap-2 font-bold">
              История
            </NuxtLink>
          </Button>
          <ThemeToggle />
        </div>

        <!-- Кнопка меню для мобильных -->
        <button @click="menuOpen = !menuOpen" class="md:hidden p-2">
          <Menu class="w-6 h-6 text-primary" />
        </button>
      </nav>

      <!-- Мобильное меню -->
      <div v-if="menuOpen" class="md:hidden absolute top-16 left-0 w-full  bg-neutral-100 border-b border-neutral-200  dark:bg-neutral-950 dark:border-neutral-600 shadow-md">
        <div class="flex flex-col items-start gap-4 p-4">
          <NuxtLink to="/generator" class="w-full text-lg" @click="menuOpen = false">
            Генератор
          </NuxtLink>
          <NuxtLink to="/raid" class="w-full text-lg" @click="menuOpen = false">
            Калькулятор рейда
          </NuxtLink>
          <NuxtLink to="/map" class="w-full text-lg" @click="menuOpen = false">
            Карта
          </NuxtLink>
          <NuxtLink to="/history" class="w-full text-lg" @click="menuOpen = false">
            История
          </NuxtLink>
          <ThemeToggle />
        </div>
      </div>
    </Container>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BadgeHelp, Menu } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import Container from '@/components/ui/container/Container.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const menuOpen = ref(false)
</script>

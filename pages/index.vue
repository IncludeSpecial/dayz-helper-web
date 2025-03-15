<template>
  <div class="container mx-auto px-4 py-12 md:py-24">
    <!-- Hero Section -->
    <section class="text-center">
      <h1 class="text-5xl font-bold tracking-tight sm:text-6xl text-gray-900 dark:text-white">
        Полезные инструменты для <span class="text-red-600">DayZ</span>
      </h1>
      <p class="max-w-2xl mx-auto text-gray-500 md:text-xl dark:text-gray-400 mt-4">
        Генератор паролей, калькулятор рейда, интерактивная карта и другие инструменты — всё для удобного выживания.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
        <Button as-child size="lg">
          <NuxtLink to="/generator">
            Начать работу
            <Sparkles class="w-4 h-4 ml-2" />
          </NuxtLink>
        </Button>
      </div>
    </section>

    <!-- Features Section -->
    <section class="mt-16 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="(feature, index) in features" :key="index" class="w-full">
        <CardHeader class="pb-4">
          <component :is="feature.icon" class="w-8 h-8 text-primary" />
          <CardTitle class="mt-2 text-lg font-semibold">{{ feature.title }}</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-gray-500 dark:text-gray-400">{{ feature.description }}</p>
        </CardContent>
      </Card>
    </section>

    <!-- Tools Section -->
    <section class="mt-16 text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Доступные инструменты</h2>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        Выбирайте нужный инструмент и облегчайте своё выживание в DayZ.
      </p>
      <div class="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="(tool, index) in tools" :key="index" class="w-full">
          <CardHeader class="pb-4">
            <CardTitle class="text-lg font-semibold">{{ tool.title }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-gray-500 dark:text-gray-400">{{ tool.description }}</p>
          </CardContent>
          <CardFooter>
            <Button as-child size="sm">
              <NuxtLink :to="tool.link">Перейти</NuxtLink>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  </div>

</template>

<script setup lang="ts">

import { Sparkles, ShieldCheck, Clock, Lock } from 'lucide-vue-next'

const features = [
  { icon: ShieldCheck, title: "Безопасность", description: "Данные остаются у вас — никаких серверов и трекеров." },
  { icon: Clock, title: "Экономия времени", description: "Быстрый доступ к ключевым инструментам для DayZ." },
  { icon: Lock, title: "Конфиденциальность", description: "Полная анонимность и защита личных данных." }
]

const tools = [
  { title: "Генератор паролей", description: "Создавайте безопасные пароли для баз и замков.", link: "/generator" },
  { title: "Калькулятор рейда", description: "Рассчитайте, сколько ресурсов нужно для рейда.", link: "/raid" },
  { title: "Интерактивная карта", description: "Открывайте карту, чтобы найти нужные локации.", link: "/map" }
]
</script>

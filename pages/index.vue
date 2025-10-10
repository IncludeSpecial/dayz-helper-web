<template>
  <div class="container mx-auto px-4 py-12 md:py-20">
    <!-- HERO: new centered layout with tabs -->
    <section class="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-red-500/10 via-neutral-100 to-white dark:from-red-500/10 dark:via-neutral-900 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800">
      <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 px-3 py-1 text-sm text-neutral-600 dark:text-neutral-300 bg-white/70 dark:bg-neutral-900/50 backdrop-blur">
            <Sparkles class="w-4 h-4 text-red-600" />
            Ваш новый помощник по DayZ
          </div>
          <h1 class="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Инструменты, которые ускоряют выживание в DayZ
          </h1>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
            Создавайте безопасные пароли, планируйте рейд и ориентируйтесь по карте — быстро, удобно и без сервера.
          </p>
          <div class="mt-6 inline-flex rounded-full border border-neutral-200 dark:border-neutral-800 p-1 bg-white/70 dark:bg-neutral-900/60 backdrop-blur">
            <Button as-child size="sm" class="rounded-full">
              <NuxtLink to="/generator">Генератор</NuxtLink>
            </Button>
            <Button as-child size="sm" variant="ghost" class="rounded-full">
              <NuxtLink to="/raid">Рейд-калькулятор</NuxtLink>
            </Button>
            <Button as-child size="sm" variant="ghost" class="rounded-full">
              <NuxtLink to="/map">Карта</NuxtLink>
            </Button>
          </div>
          <!-- Quick links strip -->
          <div class="mt-4 flex flex-wrap gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            <NuxtLink to="/map" class="underline underline-offset-2">Карта</NuxtLink>
            <span>•</span>
            <NuxtLink to="/history" class="underline underline-offset-2">История паролей</NuxtLink>
          </div>
        </div>
        <div class="relative hidden md:block">
          <div class="absolute -inset-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent blur-2xl" />
          <div class="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur p-6 flex items-center justify-center">
            <img :src="logo" alt="DayZ Helper" class="w-72 h-72 object-contain" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES: modern grid with soft cards -->
    <section class="mt-16">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card v-for="(feature, index) in features" :key="index" class="h-full">
          <CardHeader class="pb-2">
            <div class="w-10 h-10 rounded-lg bg-red-600/10 text-red-600 flex items-center justify-center">
              <component :is="feature.icon" class="w-5 h-5" />
            </div>
            <CardTitle class="mt-2 text-lg">{{ feature.title }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-gray-500 dark:text-gray-400">{{ feature.description }}</p>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- WHAT'S NEW: small changelog style list -->
    <section class="mt-16">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Что нового</h2>
      <div class="grid gap-3">
        <Card>
          <CardContent class="py-4 flex items-start gap-3">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600/10 text-red-600 text-xs">1</span>
            <div>
              <p class="font-medium">Полный редизайн генератора</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Мобильные карточки, фильтры, экспорт CSV/JSON, выбор и пакетные операции.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="py-4 flex items-start gap-3">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600/10 text-red-600 text-xs">2</span>
            <div>
              <p class="font-medium">Новый калькулятор рейда</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Пресеты стен и коэффициентов, удобный мульти-режим, копирование результатов.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="py-4 flex items-start gap-3">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600/10 text-red-600 text-xs">3</span>
            <div>
              <p class="font-medium">Оптимизации и SEO</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Обновлены мета-теги, улучшена доступность и навигация.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- STATS: quick numbers -->
    <section class="mt-16">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent class="py-4 text-center">
            <div class="text-xs text-neutral-600 dark:text-neutral-400">Инструментов</div>
            <div class="text-2xl font-semibold">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="py-4 text-center">
            <div class="text-xs text-neutral-600 dark:text-neutral-400">Экспортов</div>
            <div class="text-2xl font-semibold">CSV/JSON/TXT</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="py-4 text-center">
            <div class="text-xs text-neutral-600 dark:text-neutral-400">Приватность</div>
            <div class="text-2xl font-semibold">100%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="py-4 text-center">
            <div class="text-xs text-neutral-600 dark:text-neutral-400">Мобильность</div>
            <div class="text-2xl font-semibold">Да</div>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- TOOLS: large cards with clear actions -->
    <section class="mt-16">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Инструменты</h2>
        <NuxtLink to="/generator" class="text-sm text-red-600 hover:underline">Смотреть все</NuxtLink>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card v-for="(tool, index) in tools" :key="index" class="h-full">
          <CardHeader class="pb-0">
            <CardTitle class="text-xl">{{ tool.title }}</CardTitle>
          </CardHeader>
          <CardContent class="pt-3">
            <p class="text-gray-500 dark:text-gray-400">{{ tool.description }}</p>
          </CardContent>
          <CardFooter class="pt-0">
            <Button as-child>
              <NuxtLink :to="tool.link">Перейти</NuxtLink>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>

    <!-- COMMUNITY CTA: join links -->
    <section class="mt-16">
      <Card class="bg-gradient-to-r from-neutral-100 to-white dark:from-neutral-900 dark:to-neutral-800 border-neutral-200 dark:border-neutral-700">
        <CardContent class="py-10 text-center">
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Присоединяйтесь к сообществу</h3>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Предлагайте идеи и помогайте развивать проект.</p>
          <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button as-child>
              <a href="https://github.com/IncludeSpecial/dayz-helper-web" target="_blank" rel="noopener noreferrer">GitHub</a>
            </Button>
            <Button as-child variant="outline">
              <a href="https://discord.gg/Ykfhf46sxB" target="_blank" rel="noopener noreferrer">Discord</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- FAQ -->
    <section class="mt-16">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">FAQ</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <Card v-for="(qa, i) in faq" :key="i">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">{{ qa.q }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 dark:text-gray-400">{{ qa.a }}</p>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="mt-16">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Отзывы</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card v-for="(t, i) in testimonials" :key="i">
          <CardContent class="pt-6">
            <p class="text-gray-700 dark:text-gray-300">“{{ t.text }}”</p>
            <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">— {{ t.author }}</div>
          </CardContent>
        </Card>
      </div>
    </section>
  </div>
  
</template>

<script setup lang="ts">
import { Sparkles, ShieldCheck, Clock, Lock, Map, Calculator, History } from 'lucide-vue-next'
import logo from '@/assets/logo.png'

useSeoMeta({
  title: 'DayZ Helper — инструменты для выживания',
  ogTitle: 'DayZ Helper — инструменты для выживания',
  description: 'Генератор паролей, калькулятор рейда и интерактивная карта для DayZ. Быстро, удобно, приватно.',
  ogDescription: 'Генератор паролей, калькулятор рейда и интерактивная карта для DayZ. Быстро, удобно, приватно.',
  ogImage: '/favicon.ico',
  twitterCard: 'summary'
})

const features = [
  { icon: ShieldCheck, title: 'Безопасность', description: 'Все данные остаются в вашем браузере. Никаких серверов и трекеров.' },
  { icon: Clock, title: 'Быстрота', description: 'Инструменты открываются мгновенно. Ничего лишнего.' },
  { icon: Lock, title: 'Конфиденциальность', description: 'История хранится локально и легко очищается.' },
  { icon: Map, title: 'Интерактивная карта', description: 'Ориентируйтесь быстрее с подробной картой DayZ.' },
  { icon: Calculator, title: 'Точный расчёт', description: 'Планируйте рейды по урону и типам стен.' },
  { icon: History, title: 'История', description: 'Возвращайтесь к сгенерированным паролям за последние 30 дней.' }
]

const tools = [
  { title: 'Генератор паролей', description: 'Создавайте и экспортируйте надежные цифровые пароли.', link: '/generator' },
  { title: 'Калькулятор рейда', description: 'Рассчитайте выстрелы для различных стен и оружия.', link: '/raid' },
  { title: 'Карта', description: 'Быстрый доступ к интерактивной карте DayZ.', link: '/map' },
  { title: 'История паролей', description: 'Просматривайте и очищайте историю за 30 дней.', link: '/history' }
]

const faq = [
  { q: 'Хранятся ли данные на сервере?', a: 'Нет. Данные сохраняются только в вашем браузере.' },
  { q: 'Есть мобильная версия?', a: 'Да, дизайн оптимизирован для мобильных.' },
  { q: 'Можно поделиться результатами?', a: 'Экспортируйте в CSV/JSON и отправьте файл.' },
  { q: 'Будут ли новые инструменты?', a: 'Да, в планах — трекер серверов и база знаний.' }
]

const testimonials = [
  { text: 'Супер удобно для рейдов и планирования.', author: 'Игрок DayZ' },
  { text: 'Генератор паролей спасал неоднократно.', author: 'Выживший' },
  { text: 'Простой, быстрый и без лишнего.', author: 'Командир отряда' }
]
</script>

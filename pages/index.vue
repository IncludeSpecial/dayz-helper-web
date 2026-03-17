<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section class="relative border-b border-border bg-card dark:border-primary/20 overflow-hidden">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.04)_1px,transparent_1px)] bg-[size:2rem_2rem] dark:opacity-60" aria-hidden="true" />
      <div class="relative container mx-auto px-4 py-16 md:py-24 max-w-5xl text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
          DayZ <span class="text-primary">Helper</span>
        </h1>
        <p class="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Пароли, рейд, карта и заметки — всё в браузере. Без серверов и регистрации.
        </p>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button as-child size="lg" class="font-semibold min-w-[180px]">
            <NuxtLink to="/generator" class="inline-flex items-center justify-center gap-2">
              <KeyRound class="w-5 h-5" aria-hidden="true" />
              Генератор паролей
            </NuxtLink>
          </Button>
          <Button as-child size="lg" variant="outline" class="font-medium">
            <NuxtLink to="/raid">Калькулятор рейда</NuxtLink>
          </Button>
          <Button as-child size="lg" variant="outline" class="font-medium">
            <NuxtLink to="/map">Карта</NuxtLink>
          </Button>
        </div>
        <p class="mt-6 text-sm text-muted-foreground">
          <NuxtLink to="/history" class="hover:text-primary transition-colors underline-offset-4 hover:underline">История</NuxtLink>
          <span class="mx-2">·</span>
          <NuxtLink to="/notes" class="hover:text-primary transition-colors underline-offset-4 hover:underline">Заметки</NuxtLink>
          <span class="mx-2">·</span>
          <NuxtLink to="/timer" class="hover:text-primary transition-colors underline-offset-4 hover:underline">Таймер</NuxtLink>
        </p>
      </div>
    </section>

    <!-- Инструменты — основной блок -->
    <section class="container mx-auto px-4 py-12 md:py-16 max-w-5xl" aria-labelledby="tools-heading">
      <h2 id="tools-heading" class="sr-only">Инструменты</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="tool in tools"
          :key="tool.link"
          :to="tool.link"
          class="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-glow dark:border-primary/15 dark:hover:border-primary/35 dark:hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span class="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors" aria-hidden="true">
            <component :is="tool.icon" class="w-5 h-5" />
          </span>
          <h3 class="mt-3 font-semibold text-foreground">{{ tool.title }}</h3>
          <p class="mt-1 text-sm text-muted-foreground flex-1">{{ tool.description }}</p>
          <span class="mt-3 inline-flex items-center text-sm font-medium text-primary group-hover:underline">
            Открыть
            <ArrowRight class="ml-1 w-4 h-4" aria-hidden="true" />
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- Кратко о сервисе -->
    <section class="border-t border-border bg-muted/30 dark:bg-card/50" aria-labelledby="about-heading">
      <div class="container mx-auto px-4 py-12 md:py-14 max-w-5xl">
        <h2 id="about-heading" class="text-xl font-bold text-foreground mb-8 text-center">Почему удобно</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div class="flex gap-4">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
              <ShieldCheck class="w-5 h-5" />
            </span>
            <div>
              <h3 class="font-semibold text-foreground">Всё в браузере</h3>
              <p class="text-sm text-muted-foreground mt-0.5">Данные не уходят на сервер. Пароли и заметки хранятся только у вас.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
              <Clock class="w-5 h-5" />
            </span>
            <div>
              <h3 class="font-semibold text-foreground">Быстро и просто</h3>
              <p class="text-sm text-muted-foreground mt-0.5">Открыли — сразу пользуетесь. Никаких установок и аккаунтов.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
              <Smartphone class="w-5 h-5" />
            </span>
            <div>
              <h3 class="font-semibold text-foreground">Удобно с телефона</h3>
              <p class="text-sm text-muted-foreground mt-0.5">Интерфейс адаптирован под мобильные. Можно пользоваться в игре с телефона.</p>
            </div>
          </div>
        </div>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span class="inline-flex items-center gap-1.5">
            <span class="font-mono font-semibold text-primary">8</span> инструментов
          </span>
          <span class="inline-flex items-center gap-1.5">
            <span class="font-mono font-semibold text-primary">CSV · JSON · TXT</span> экспорт
          </span>
          <span class="inline-flex items-center gap-1.5">
            <span class="font-mono font-semibold text-primary">100%</span> локально
          </span>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="container mx-auto px-4 py-12 md:py-16 max-w-3xl" aria-labelledby="faq-heading">
      <h2 id="faq-heading" class="text-xl font-bold text-foreground mb-6 text-center">Частые вопросы</h2>
      <dl class="space-y-4">
        <div v-for="(qa, i) in faq" :key="i" class="rounded-xl border border-border bg-card p-4 dark:border-primary/15">
          <dt class="font-semibold text-foreground">{{ qa.q }}</dt>
          <dd class="mt-1 text-sm text-muted-foreground">{{ qa.a }}</dd>
        </div>
      </dl>
    </section>

    <!-- Сообщество -->
    <section class="border-t border-border bg-card/50">
      <div class="container mx-auto px-4 py-10 max-w-3xl text-center">
        <p class="text-sm text-muted-foreground">Идеи и помощь в развитии проекта</p>
        <div class="mt-4 flex flex-wrap gap-3 justify-center">
          <Button as-child size="sm" class="font-medium">
            <a href="https://github.com/IncludeSpecial/dayz-helper-web" target="_blank" rel="noopener noreferrer" aria-label="Репозиторий на GitHub">GitHub</a>
          </Button>
          <Button as-child variant="outline" size="sm" class="font-medium">
            <a href="https://discord.gg/Ykfhf46sxB" target="_blank" rel="noopener noreferrer" aria-label="Discord сервер">Discord</a>
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  Clock,
  Crosshair,
  History,
  KeyRound,
  ListChecks,
  MapPin,
  ShieldCheck,
  Smartphone,
  StickyNote,
  Timer
} from 'lucide-vue-next'

useSeoMeta({
  title: 'DayZ Helper — инструменты для выживания',
  ogTitle: 'DayZ Helper — инструменты для выживания',
  description: 'Генератор паролей, калькулятор рейда и интерактивная карта для DayZ. Быстро, удобно, приватно.',
  ogDescription: 'Генератор паролей, калькулятор рейда и интерактивная карта для DayZ. Быстро, удобно, приватно.',
  ogImage: '/favicon.ico',
  twitterCard: 'summary'
})

const tools = [
  { title: 'Генератор паролей', description: 'Цифровые пароли и экспорт в CSV/JSON/TXT.', link: '/generator', icon: KeyRound },
  { title: 'Калькулятор рейда', description: 'Выстрелы под тип стены и оружие.', link: '/raid', icon: Crosshair },
  { title: 'Карта', description: 'Интерактивная карта DayZ.', link: '/map', icon: MapPin },
  { title: 'История паролей', description: 'Просмотр и экспорт за 7–30 дней.', link: '/history', icon: History },
  { title: 'Заметки', description: 'Координаты, коды, IP — в браузере.', link: '/notes', icon: StickyNote },
  { title: 'Таймер', description: 'Обратный отсчёт и секундомер.', link: '/timer', icon: Timer },
  { title: 'Чек-лист', description: 'Списки на рейд и базу.', link: '/checklist', icon: ListChecks }
]

const faq = [
  { q: 'Хранятся ли данные на сервере?', a: 'Нет. Всё сохраняется только в вашем браузере (localStorage).' },
  { q: 'Есть мобильная версия?', a: 'Да, сайт адаптирован под телефоны и планшеты.' },
  { q: 'Можно поделиться результатами?', a: 'Да — экспортируйте в CSV/JSON/TXT и отправьте файл.' },
  { q: 'Будут ли новые инструменты?', a: 'В планах — трекер серверов и расширенная справка.' }
]
</script>

<template>
  <PageContainer>
    <PageHeader
      title="Вики"
      description="Справка по медицине, управлению, выживанию и рейду. Ориентировочные данные, могут отличаться на модах."
      back-to="/"
      back-label="На главную"
    />

    <div class="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 dark:border-amber-400/30 dark:bg-amber-500/5 px-4 py-3" role="note">
      <p class="text-sm text-foreground">
        Информация в вики не является официальной и может быть неточной. Сверяйтесь с актуальной документацией игры или мода.
      </p>
    </div>

    <div class="mb-6">
      <Label for="wiki-search" class="sr-only">Поиск по вики</Label>
      <Input
        id="wiki-search"
        v-model="searchQuery"
        placeholder="Поиск по статьям..."
        class="max-w-md"
        aria-label="Поиск по вики"
      />
    </div>

    <h2 class="text-lg font-semibold text-foreground mb-4">
      Статьи
      <span class="text-muted-foreground font-normal">({{ filteredArticles.length }})</span>
    </h2>

    <div class="grid gap-4 sm:grid-cols-2">
      <NuxtLink
        v-for="article in filteredArticles"
        :key="article.slug"
        :to="`/wiki/${article.slug}`"
        class="group flex flex-col rounded-xl border border-border bg-card p-5 dark:border-primary/20 dark:shadow-glow hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <h3 class="font-semibold text-foreground group-hover:text-primary transition-colors">
          {{ article.title }}
        </h3>
        <p class="mt-1 text-sm text-muted-foreground flex-1 line-clamp-2">
          {{ article.description }}
        </p>
        <span class="mt-3 inline-flex items-center text-sm font-medium text-primary group-hover:underline">
          Читать
          <ArrowRight class="ml-1 w-4 h-4" aria-hidden="true" />
        </span>
      </NuxtLink>
    </div>

    <p v-if="!filteredArticles.length" class="text-muted-foreground py-8">
      По запросу статей не найдено.
    </p>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Вики',
  description: 'Справка по DayZ: медицина, горячие клавиши, выживание, рейд. Ориентировочные данные.'
})

const { getArticles } = useWiki()
const searchQuery = ref('')
const articles = getArticles()

const filteredArticles = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return articles
  return articles.filter(
    a =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q)
  )
})
</script>

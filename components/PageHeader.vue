<template>
  <header class="mb-8 md:mb-10">
    <NuxtLink
      v-if="backTo"
      :to="backTo"
      class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
    >
      <ArrowLeft class="w-4 h-4" aria-hidden="true" />
      {{ backLabel }}
    </NuxtLink>
    <h1 class="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
      {{ title }}
    </h1>
    <p v-if="description" class="mt-2 text-muted-foreground max-w-2xl">
      {{ description }}
    </p>
  </header>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

defineProps<{
  title: string
  description?: string
  backTo?: string
  backLabel?: string
}>()
</script>

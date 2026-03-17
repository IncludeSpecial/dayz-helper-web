<template>
  <div
    class="flex flex-col items-center justify-center py-16 md:py-24 text-center rounded-xl border border-dashed border-border bg-muted/20"
    role="status"
  >
    <component
      :is="icon"
      class="w-14 h-14 mx-auto mb-4 text-muted-foreground/50"
      aria-hidden="true"
    />
    <p class="font-medium text-muted-foreground">{{ title }}</p>
    <p v-if="description" class="text-sm text-muted-foreground mt-1 max-w-sm">{{ description }}</p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  /** Иконка (компонент Lucide и т.п.) */
  icon: Component
  /** Заголовок пустого состояния */
  title: string
  /** Описание (опционально) */
  description?: string
}>()
</script>

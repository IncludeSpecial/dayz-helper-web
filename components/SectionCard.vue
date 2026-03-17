<template>
  <section
    :id="id"
    :class="sectionClass"
    :aria-labelledby="title ? titleId : undefined"
  >
    <div v-if="title || $slots.header" class="px-5 py-4 border-b border-border bg-muted/20">
      <slot name="header">
        <h2 v-if="title" :id="titleId" class="text-lg font-semibold text-foreground flex items-center gap-2">
          <component v-if="icon" :is="icon" class="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
          {{ title }}
        </h2>
      </slot>
    </div>
    <div :class="contentClass">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Заголовок секции */
    title?: string
    /** Иконка слева от заголовка */
    icon?: Component
    /** Убрать внутренние отступы у контента */
    noPadding?: boolean
    /** Дополнительные классы для корневого section */
    class?: string
    /** id секции (для якорей) */
    id?: string
  }>(),
  { noPadding: false }
)

const titleId = computed(() => props.title ? `${(props.id || 'section')}-title` : undefined)

const sectionClass = computed(() => [
  'rounded-xl border border-border bg-card overflow-hidden dark:border-primary/20 dark:shadow-glow',
  props.class
].filter(Boolean).join(' '))

const contentClass = computed(() => props.noPadding ? '' : 'p-5')
</script>

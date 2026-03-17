<template>
  <div :class="containerClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
/** Обёртка контента страницы: общая ширина и отступы для всех внутренних страниц */
const props = withDefaults(
  defineProps<{
    /** Максимальная ширина: default (5xl), narrow (2xl), wide (6xl) */
    size?: 'default' | 'narrow' | 'wide'
  }>(),
  { size: 'default' }
)

const sizeClasses = {
  default: 'max-w-5xl',
  narrow: 'max-w-2xl',
  wide: 'max-w-6xl'
}

const containerClass = `mx-auto px-4 sm:px-6 py-8 md:py-10 ${sizeClasses[props.size]}`
</script>

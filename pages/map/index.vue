<template>
  <div class="flex flex-col min-h-screen">

    <div class="container mx-auto px-4 py-12">
      <!-- Информационный блок -->
      <div class="max-w-2xl mx-auto text-center mb-8">
        <Badge variant="outline" class="text-sm px-4 py-1">
          🗺️ Интерактивная карта
        </Badge>
        <h1 class="text-4xl font-bold mt-4">Куда бежим?</h1>
      </div>
      <!-- Карточка с картой -->
      <div class="flex items-center justify-center p-4">
        <Card class="w-full shadow-lg">
          <div class="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <div class="text-sm text-neutral-600 dark:text-neutral-300">Карта DayZ (внешний ресурс)</div>
            <div class="flex items-center gap-2">
              <Button size="sm" variant="outline" @click="reloadMap">Обновить</Button>
              <Button size="sm" @click="toggleFullscreen">На весь экран</Button>
            </div>
          </div>
          <div class="h-[65vh] md:h-[75vh] rounded-b-lg overflow-hidden" ref="mapContainer">
            <iframe
                :key="iframeKey"
                src="https://dayz.xam.nu/"
                class="w-full h-full"
            ></iframe>
          </div>
        </Card>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'

useSeoMeta({
  title: 'DayZ Helper — Карта',
  description: 'Интерактивная карта DayZ в отдельном окне с удобным полноэкранным режимом.'
})

const mapContainer = ref<HTMLElement | null>(null)
const iframeKey = ref<number>(0)
const reloadMap = () => { iframeKey.value++ }

let isFullscreen = false
const toggleFullscreen = () => {
  const el = mapContainer.value
  if (!el) return
  if (!isFullscreen) {
    el.requestFullscreen?.()
    isFullscreen = true
  } else {
    document.exitFullscreen?.()
    isFullscreen = false
  }
}

const onFsChange = () => {
  if (!document.fullscreenElement) {
    isFullscreen = false
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFsChange)
})
onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFsChange)
})
</script>

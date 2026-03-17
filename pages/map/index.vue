<template>
  <PageContainer>
    <PageHeader
      title="Интерактивная карта"
      description="DayZ (dayz.xam.nu). Откройте в новой вкладке или на весь экран."
      back-to="/"
      back-label="На главную"
    />

    <section class="rounded-xl border border-border bg-card overflow-hidden dark:border-primary/20" aria-labelledby="map-title">
      <div id="map-title" class="sr-only">Карта DayZ</div>

      <!-- Панель действий -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/20 dark:bg-muted/10">
        <span class="text-sm text-muted-foreground">dayz.xam.nu</span>
        <div class="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" type="button" @click="openInNewTab">
            В новой вкладке
          </Button>
          <Button size="sm" variant="outline" type="button" @click="reloadMap">
            Обновить
          </Button>
          <Button size="sm" type="button" @click="toggleFullscreen">
            На весь экран
          </Button>
        </div>
      </div>

      <!-- Карта -->
      <div
        ref="mapContainer"
        class="relative h-[65vh] min-h-[320px] md:h-[75vh] bg-muted/30"
      >
        <iframe
          :key="iframeKey"
          :src="MAP_URL"
          class="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          title="Интерактивная карта DayZ"
        />
      </div>
    </section>

    <p class="mt-4 text-center text-xs text-muted-foreground">
      Карта открывается с внешнего сайта. Для полноэкранного режима нажмите кнопку выше.
    </p>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Button } from '~/components/ui/button'

useSeoMeta({
  title: 'Карта',
  description: 'Интерактивная карта DayZ в отдельном окне с удобным полноэкранным режимом.'
})

const MAP_URL = 'https://dayz.xam.nu/'
const mapContainer = ref<HTMLElement | null>(null)
const iframeKey = ref(0)

function reloadMap () {
  iframeKey.value += 1
}

function openInNewTab () {
  window.open(MAP_URL, '_blank', 'noopener,noreferrer')
}

let isFullscreen = false
function toggleFullscreen () {
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

function onFullscreenChange () {
  if (!document.fullscreenElement) {
    isFullscreen = false
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
})
onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

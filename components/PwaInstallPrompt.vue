<template>
  <Teleport to="body">
    <!-- Баннер «Установить приложение» -->
    <Transition name="slide-up">
      <div
        v-if="showInstallBanner"
        class="fixed bottom-0 left-0 right-0 z-[100] safe-area-pb border-t border-border bg-card/95 backdrop-blur-md p-4 shadow-lg dark:border-primary/20"
      >
        <div class="max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-3">
          <img src="/icon.svg" alt="" class="w-12 h-12 rounded-xl shrink-0" width="48" height="48">
          <div class="flex-1 min-w-0 text-center sm:text-left">
            <p class="font-semibold text-foreground text-sm">Установить DayZ Helper</p>
            <p class="text-xs text-muted-foreground mt-0.5">Доступ с главного экрана и офлайн</p>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
              @click="installApp"
            >
              Установить
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted"
              aria-label="Закрыть"
              @click="dismissInstall"
            >
              Позже
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Обновление / офлайн -->
    <Transition name="fade">
      <div
        v-if="showRefreshBanner"
        class="fixed bottom-4 left-4 right-4 z-[100] max-w-md mx-auto rounded-xl border border-border bg-card p-4 shadow-lg dark:border-primary/20 flex flex-col gap-3"
      >
        <p class="text-sm font-medium text-foreground">
          {{ isOfflineReady ? 'Готово к работе офлайн' : 'Доступна новая версия' }}
        </p>
        <div class="flex gap-2">
          <button
            v-if="!isOfflineReady"
            type="button"
            class="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground"
            @click="refreshApp"
          >
            Обновить
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted"
            @click="closePrompt"
          >
            Закрыть
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp()

const showInstallBanner = ref(false)
const showRefreshBanner = ref(false)
const isOfflineReady = ref(false)

const installApp = async () => {
  try {
    await $pwa?.install()
    showInstallBanner.value = false
  } catch {
    showInstallBanner.value = false
  }
}

const dismissInstall = () => {
  showInstallBanner.value = false
  try {
    $pwa?.cancelInstall?.()
  } catch {}
  if (import.meta.client && typeof localStorage !== 'undefined') {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }
}

const refreshApp = () => {
  ($pwa as { updateServiceWorker?: (r?: boolean) => Promise<void> })?.updateServiceWorker?.(true)
  showRefreshBanner.value = false
}

const closePrompt = () => {
  ($pwa as { cancelPrompt?: () => Promise<void> })?.cancelPrompt?.()
  showRefreshBanner.value = false
}

onMounted(() => {
  const pwa = $pwa as { showInstallPrompt?: { value?: boolean }; offlineReady?: { value?: boolean }; needRefresh?: { value?: boolean }; install?: () => Promise<void>; cancelInstall?: () => void; updateServiceWorker?: (r?: boolean) => Promise<void>; cancelPrompt?: () => Promise<void> } | undefined
  if (!pwa) return
  if (pwa.showInstallPrompt) {
    watch(pwa.showInstallPrompt, (show) => {
      if (!show) return
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      if (dismissed) {
        const age = Date.now() - Number(dismissed)
        if (age < 7 * 24 * 60 * 60 * 1000) return
      }
      showInstallBanner.value = true
    }, { immediate: true })
  }
  if (pwa.offlineReady) {
    watch(pwa.offlineReady, (ready) => {
      if (ready) {
        isOfflineReady.value = true
        showRefreshBanner.value = true
      }
    }, { immediate: true })
  }
  if (pwa.needRefresh) {
    watch(pwa.needRefresh, (need) => {
      if (need) {
        isOfflineReady.value = false
        showRefreshBanner.value = true
      }
    }, { immediate: true })
  }
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.safe-area-pb {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
</style>

<template>
  <PageContainer>
    <PageHeader
      title="Таймер"
      description="Респавн лута, проверка базы, длительность рейда — засекайте время и не пропустите момент."
      back-to="/"
      back-label="На главную"
    />

    <!-- Режимы -->
    <div class="flex justify-center mb-8">
      <div
        class="inline-flex rounded-full border border-border bg-muted/30 p-1 dark:border-primary/25"
        role="tablist"
        aria-label="Режим таймера"
      >
        <button
          type="button"
          role="tab"
          :aria-selected="mode === 'countdown'"
          :class="mode === 'countdown' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
          @click="mode = 'countdown'"
        >
          Обратный отсчёт
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="mode === 'stopwatch'"
          :class="mode === 'stopwatch' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
          @click="mode = 'stopwatch'"
        >
          Секундомер
        </button>
      </div>
    </div>

    <!-- Обратный отсчёт -->
    <section
      v-if="mode === 'countdown'"
      class="rounded-xl border border-border bg-card p-6 dark:border-primary/20 dark:shadow-glow"
      aria-labelledby="countdown-title"
    >
      <h2 id="countdown-title" class="sr-only">Обратный отсчёт</h2>
      <div class="text-center">
        <div
          class="text-5xl md:text-6xl font-mono font-bold tabular-nums text-foreground mb-6 min-h-[4rem] flex items-center justify-center"
          aria-live="polite"
          aria-atomic="true"
          :aria-label="countdownRunning ? `Осталось ${countdownDisplay}` : countdownDone ? 'Время вышло' : countdownDisplay"
        >
          {{ countdownDisplay }}
        </div>
        <p v-if="countdownDone" class="text-primary font-semibold mb-4" role="status" aria-live="assertive">
          Готово!
        </p>

        <template v-if="!countdownRunning && !countdownDone">
          <Label for="countdown-minutes" class="text-muted-foreground text-sm">Минут</Label>
          <div class="flex flex-wrap justify-center gap-1.5 mt-2 mb-4" role="group" aria-label="Быстрый выбор">
            <button
              v-for="m in countdownPresets"
              :key="m"
              type="button"
              :aria-pressed="countdownMinutes === m"
              :aria-label="`${m} минут`"
              :class="countdownMinutes === m ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background hover:bg-muted'"
              class="h-9 min-w-[2.5rem] rounded-md border px-3 text-sm font-medium transition-colors"
              @click="countdownMinutes = m"
            >
              {{ m }}
            </button>
          </div>
          <Input
            id="countdown-minutes"
            v-model.number="countdownMinutes"
            type="number"
            min="1"
            max="999"
            class="max-w-[100px] mx-auto text-center text-lg font-mono"
            aria-label="Количество минут"
          />
        </template>

        <div class="flex flex-wrap justify-center gap-2 mt-6">
          <template v-if="!countdownRunning && !countdownDone">
            <Button :disabled="countdownMinutes < 1" @click="startCountdown">Старт</Button>
          </template>
          <template v-else-if="countdownRunning">
            <Button variant="outline" @click="pauseCountdown">Пауза</Button>
            <Button variant="destructive" @click="resetCountdown">Сброс</Button>
          </template>
          <template v-else>
            <Button @click="resetCountdown">Заново</Button>
          </template>
        </div>

        <p class="text-xs text-muted-foreground mt-6">
          <button
            v-if="canRequestNotification && notificationPermission === 'default'"
            type="button"
            class="underline hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            @click="requestNotificationPermission"
          >
            Включить уведомления по окончании
          </button>
          <span v-else-if="notificationPermission === 'granted'">Уведомления включены — придёт сигнал по окончании.</span>
          <span v-else>Разрешите уведомления в настройках браузера для сигнала по окончании.</span>
        </p>
      </div>
    </section>

    <!-- Секундомер -->
    <section
      v-if="mode === 'stopwatch'"
      class="rounded-xl border border-border bg-card p-6 dark:border-primary/20 dark:shadow-glow"
      aria-labelledby="stopwatch-title"
    >
      <h2 id="stopwatch-title" class="sr-only">Секундомер</h2>
      <div class="text-center">
        <div
          class="text-5xl md:text-6xl font-mono font-bold tabular-nums text-foreground mb-6 min-h-[4rem] flex items-center justify-center"
          aria-live="polite"
          aria-atomic="true"
          :aria-label="`Прошло времени: ${stopwatchDisplay}`"
        >
          {{ stopwatchDisplay }}
        </div>

        <div class="flex flex-wrap justify-center gap-2">
          <template v-if="!stopwatchRunning">
            <Button @click="startStopwatch">Старт</Button>
          </template>
          <template v-else>
            <Button variant="outline" @click="pauseStopwatch">Пауза</Button>
            <Button variant="secondary" @click="lapStopwatch">Круг</Button>
          </template>
          <Button
            variant="outline"
            :disabled="stopwatchElapsed === 0 && laps.length === 0"
            @click="resetStopwatch"
          >
            Сброс
          </Button>
        </div>

        <div v-if="laps.length" class="mt-8 text-left">
          <h3 class="text-sm font-semibold text-foreground mb-3">Круги</h3>
          <div class="rounded-lg border border-border bg-muted/20 max-h-40 overflow-auto">
            <ul class="divide-y divide-border" role="list">
              <li
                v-for="(lap, i) in laps"
                :key="i"
                class="flex justify-between items-center px-4 py-2.5 text-sm font-mono"
              >
                <span class="text-muted-foreground">Круг {{ laps.length - i }}</span>
                <span class="text-foreground font-medium">{{ formatMs(lap) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Таймер',
  description: 'Обратный отсчёт и секундомер для респавна лута и проверки базы.'
})

const mode = ref<'countdown' | 'stopwatch'>('countdown')
const countdownPresets = [5, 15, 30, 45, 60, 90, 120]

// Обратный отсчёт
const countdownMinutes = ref(30)
const countdownSecondsLeft = ref(0)
const countdownRunning = ref(false)
const countdownDone = ref(false)
let countdownTimer: ReturnType<typeof setInterval> | null = null

const countdownDisplay = computed(() => {
  if (countdownDone.value) return '0:00'
  const total = countdownSecondsLeft.value
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

const canRequestNotification = typeof Notification !== 'undefined'
const notificationPermission = ref<NotificationPermission>(canRequestNotification ? Notification.permission : 'denied')

function startCountdown () {
  countdownSecondsLeft.value = Math.max(1, countdownMinutes.value) * 60
  countdownDone.value = false
  countdownRunning.value = true
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    countdownSecondsLeft.value--
    if (countdownSecondsLeft.value <= 0) {
      countdownRunning.value = false
      countdownDone.value = true
      if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
      playFinishSound()
      try {
        if (canRequestNotification && notificationPermission.value === 'granted') {
          new Notification('DayZ Helper — Таймер', { body: 'Время вышло!' })
        }
      } catch {}
    }
  }, 1000)
}

function pauseCountdown () {
  countdownRunning.value = false
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

function resetCountdown () {
  pauseCountdown()
  countdownDone.value = false
  countdownSecondsLeft.value = 0
}

function requestNotificationPermission () {
  if (canRequestNotification) {
    Notification.requestPermission().then(p => {
      notificationPermission.value = p
    })
  }
}

// Короткий звук по окончании (опционально, не мешает если нет поддержки)
function playFinishSound () {
  if (import.meta.client && typeof AudioContext !== 'undefined') {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.3)
    } catch {}
  }
}

// Секундомер
const stopwatchElapsed = ref(0)
const stopwatchRunning = ref(false)
const laps = ref<number[]>([])
let stopwatchStart = 0
let stopwatchAccum = 0
let stopwatchTimer: ReturnType<typeof setInterval> | null = null

const stopwatchDisplay = computed(() => formatMs(stopwatchElapsed.value))

function formatMs (ms: number) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const tenths = Math.floor((ms % 1000) / 100)
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}.${tenths}`
}

function startStopwatch () {
  stopwatchStart = Date.now()
  stopwatchRunning.value = true
  if (stopwatchTimer) clearInterval(stopwatchTimer)
  stopwatchTimer = setInterval(() => {
    stopwatchElapsed.value = stopwatchAccum + (Date.now() - stopwatchStart)
  }, 100)
}

function pauseStopwatch () {
  stopwatchRunning.value = false
  stopwatchAccum = stopwatchElapsed.value
  if (stopwatchTimer) {
    clearInterval(stopwatchTimer)
    stopwatchTimer = null
  }
}

function lapStopwatch () {
  laps.value = [stopwatchElapsed.value, ...laps.value]
}

function resetStopwatch () {
  pauseStopwatch()
  stopwatchElapsed.value = 0
  stopwatchAccum = 0
  laps.value = []
}

onMounted(() => {
  if (canRequestNotification) notificationPermission.value = Notification.permission
})

onBeforeUnmount(() => {
  if (countdownTimer) clearInterval(countdownTimer)
  if (stopwatchTimer) clearInterval(stopwatchTimer)
})
</script>

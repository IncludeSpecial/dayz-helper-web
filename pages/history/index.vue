<template>
  <PageContainer>
    <PageHeader
      title="История паролей"
      description="Пароли за выбранный период (7, 14 или 30 дней). Фильтр, сортировка и экспорт."
      back-to="/"
      back-label="На главную"
    />

    <template v-if="allEntries.length">
      <!-- Панель фильтров -->
      <div class="rounded-xl border border-border bg-card p-5 dark:border-primary/20 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label for="date-range" class="text-muted-foreground text-sm">Период</Label>
            <Select v-model="dateRangeDays" @update:model-value="page = 1">
              <SelectTrigger id="date-range" class="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="7">Последние 7 дней</SelectItem>
                <SelectItem :value="14">Последние 14 дней</SelectItem>
                <SelectItem :value="30">Последние 30 дней</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="filter-source" class="text-muted-foreground text-sm">Фильтр по источнику</Label>
            <Input
              id="filter-source"
              :value="filterSource"
              @input="onFilterInput"
              placeholder="Например: дверь"
              class="mt-1.5"
            />
          </div>
          <div>
            <Label for="sort-by" class="text-muted-foreground text-sm">Сортировка</Label>
            <Select v-model="sortBy">
              <SelectTrigger id="sort-by" class="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">По дате</SelectItem>
                <SelectItem value="password">По паролю</SelectItem>
                <SelectItem value="source">По источнику</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="sort-dir" class="text-muted-foreground text-sm">Порядок</Label>
            <Select v-model="sortDir">
              <SelectTrigger id="sort-dir" class="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">По убыванию</SelectItem>
                <SelectItem value="asc">По возрастанию</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>Показано: {{ pagedEntries.length }} из {{ filteredEntries.length }} (всего {{ allEntries.length }})</span>
          <div class="flex flex-wrap gap-2" role="toolbar" aria-label="Действия с историей">
            <Button size="sm" variant="outline" @click="clearOld">Удалить старше 30 дней</Button>
            <Button size="sm" variant="outline" @click="clearAll">Очистить всё</Button>
            <Button size="sm" variant="outline" @click="downloadCsv">CSV</Button>
            <Button size="sm" variant="outline" @click="downloadJson">JSON</Button>
          </div>
        </div>
      </div>

      <!-- Таблица -->
      <div class="rounded-xl border border-border bg-card overflow-hidden dark:border-primary/20">
        <div class="overflow-x-auto max-h-[65vh]">
          <Table class="min-w-[600px] text-sm">
            <TableHeader class="sticky top-0 bg-muted/95 dark:bg-card z-10 border-b border-border">
              <TableRow>
                <TableHead class="w-12">№</TableHead>
                <TableHead>Пароль</TableHead>
                <TableHead class="max-w-[200px]">Источник</TableHead>
                <TableHead class="whitespace-nowrap">Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(item, index) in pagedEntries" :key="item.date + '-' + index">
                <TableCell class="text-muted-foreground">{{ (page - 1) * pageSize + index + 1 }}</TableCell>
                <TableCell class="font-mono break-all">{{ item.password }}</TableCell>
                <TableCell class="truncate max-w-[200px]" :title="item.source || '—'">{{ item.source || '—' }}</TableCell>
                <TableCell class="text-muted-foreground whitespace-nowrap">{{ formatDate(item.date) }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Пагинация -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20 text-sm">
          <div class="flex items-center gap-2">
            <Label for="page-size" class="text-muted-foreground text-xs">На странице</Label>
            <Select v-model="pageSize">
              <SelectTrigger id="page-size" class="w-[72px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="10">10</SelectItem>
                <SelectItem :value="25">25</SelectItem>
                <SelectItem :value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted-foreground">Стр. {{ page }} из {{ totalPages }}</span>
            <Button size="sm" variant="outline" class="h-8" :disabled="page <= 1" @click="prevPage">Назад</Button>
            <Button size="sm" variant="outline" class="h-8" :disabled="page >= totalPages" @click="nextPage">Вперёд</Button>
          </div>
        </div>
      </div>
    </template>

    <EmptyState
      v-else
      :icon="KeyRound"
      title="История пуста"
      description="Сгенерируйте пароли в разделе «Генератор» — они появятся здесь."
    >
      <Button as-child>
        <NuxtLink to="/generator">Перейти в генератор</NuxtLink>
      </Button>
    </EmptyState>
  </PageContainer>
</template>

<script setup lang="ts">
import type { PasswordEntry } from '~/types/generator'
import { ref, onMounted, computed } from 'vue'
import { KeyRound } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'

useSeoMeta({
  title: 'История паролей',
  description: 'Последние 7–30 дней сгенерированных паролей с фильтрами и экспортом.'
})

const { history, load, saveHistory } = usePasswordStorage()

const filterSource = ref('')
const dateRangeDays = ref<7 | 14 | 30>(30)
const sortBy = ref<'date' | 'password' | 'source'>('date')
const sortDir = ref<'asc' | 'desc'>('desc')
const page = ref(1)
const pageSize = ref(25)
let filterTimer: number | undefined

onMounted(load)

const allEntries = computed(() => {
  const now = Date.now()
  const maxDays = dateRangeDays.value
  return history.value.filter(item => {
    if (!item.date) return false
    const d = new Date(item.date).getTime()
    return (now - d) / (1000 * 60 * 60 * 24) <= maxDays
  }) as Array<PasswordEntry & { date: string }>
})

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString()

function onFilterInput (e: Event) {
  const val = (e.target as HTMLInputElement).value
  if (filterTimer) window.clearTimeout(filterTimer)
  filterTimer = window.setTimeout(() => {
    filterSource.value = val
    page.value = 1
  }, 250)
}

const filteredEntries = computed(() => {
  let list = allEntries.value.filter(item =>
    !filterSource.value || (item.source || '').toLowerCase().includes(filterSource.value.toLowerCase())
  )
  const key = sortBy.value
  list = [...list].sort((a, b) =>
    String(a[key as keyof typeof a] ?? '').localeCompare(String(b[key as keyof typeof b] ?? ''))
  )
  if (sortDir.value === 'desc') list.reverse()
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEntries.value.length / pageSize.value)))

const pagedEntries = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredEntries.value.slice(start, start + pageSize.value)
})

function prevPage () {
  if (page.value > 1) page.value -= 1
}
function nextPage () {
  if (page.value < totalPages.value) page.value += 1
}

function clearAll () {
  if (confirm('Очистить всю историю?')) saveHistory([])
}

function clearOld () {
  const now = Date.now()
  const kept = history.value.filter(item => {
    if (!item.date) return false
    const d = new Date(item.date).getTime()
    return (now - d) / (1000 * 60 * 60 * 24) <= 30
  })
  saveHistory(kept)
}

function downloadCsv () {
  const header = ['№', 'Пароль', 'Источник', 'Дата']
  const rows = filteredEntries.value.map((p, i) =>
    [String(i + 1), p.password, p.source || '—', formatDate(p.date)]
  )
  const csv = [header, ...rows]
    .map(r => r.map(f => `"${String(f).replaceAll('"', '""')}"`).join(','))
    .join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = 'dayz-passwords-history.csv'
  a.click()
}

function downloadJson () {
  const data = JSON.stringify(filteredEntries.value, null, 2)
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
  a.download = 'dayz-passwords-history.json'
  a.click()
}
</script>

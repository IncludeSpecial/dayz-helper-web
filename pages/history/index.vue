<template>

  <div class="container mx-auto px-4 py-12">
    <!-- Централизованный информационный блок -->
    <div class="max-w-2xl mx-auto text-center mb-8">
      <Badge variant="outline" class="text-sm px-4 py-1">📜 История паролей</Badge>
      <h1 class="text-4xl font-bold mt-4">История использования</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        Здесь отображаются пароли, созданные за последние 30 дней.
      </p>
    </div>

    <!-- Контент истории -->
    <div v-if="allEntries.length">
      <Card class="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>История паролей</CardTitle>
        </CardHeader>
        <CardContent>
          <!-- Toolbar -->
          <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="text-sm">Фильтр по источнику</label>
              <input class="w-full border rounded-md px-3 py-2 bg-transparent" :value="filterSource" @input="onFilterInput" placeholder="Например: дверь" />
            </div>
            <div>
              <label class="text-sm">Сортировка</label>
              <select class="w-full border rounded-md px-3 py-2 bg-transparent" v-model="sortBy">
                <option value="date">Дата</option>
                <option value="password">Пароль</option>
                <option value="source">Источник</option>
              </select>
            </div>
            <div>
              <label class="text-sm">Порядок</label>
              <select class="w-full border rounded-md px-3 py-2 bg-transparent" v-model="sortDir">
                <option value="desc">По убыванию</option>
                <option value="asc">По возрастанию</option>
              </select>
            </div>
          </div>

          <div class="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Показано: {{ pagedEntries.length }} из {{ filteredEntries.length }} (всего {{ allEntries.length }})</span>
            <button class="underline ml-auto" @click="clearOld">Удалить старше 30 дней</button>
            <button class="underline" @click="clearAll">Очистить всё</button>
            <button class="underline" @click="downloadCsv">CSV</button>
            <button class="underline" @click="downloadJson">JSON</button>
          </div>

          <div class="overflow-auto max-h-[65vh]">
            <Table class="min-w-[700px] text-sm">
              <TableHeader class="sticky top-0 bg-white dark:bg-neutral-950 z-10">
                <TableRow>
                  <TableHead>№</TableHead>
                  <TableHead>Пароль</TableHead>
                  <TableHead>Источник</TableHead>
                  <TableHead>Дата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(item, index) in pagedEntries" :key="index">
                  <TableCell>{{ (page-1)*pageSize + index + 1 }}</TableCell>
                  <TableCell class="font-mono break-all">{{ item.password }}</TableCell>
                  <TableCell class="truncate max-w-[240px]" :title="item.source || 'Без источника'">{{ item.source || 'Без источника' }}</TableCell>
                  <TableCell>{{ formatDate(item.date) }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <!-- Pagination -->
          <div class="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
            <div class="flex items-center gap-2">
              <span>На странице</span>
              <select class="border rounded-md px-2 py-1 bg-transparent" v-model.number="pageSize">
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <span>Стр. {{ page }} из {{ totalPages }}</span>
              <button class="border rounded-md px-3 py-1" :disabled="page<=1" @click="prevPage">Назад</button>
              <button class="border rounded-md px-3 py-1" :disabled="page>=totalPages" @click="nextPage">Вперёд</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <div v-else class="text-center min-h-[60vh] text-gray-500">
      История пуста.
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
useSeoMeta({ title: 'История паролей — DayZ Helper', description: 'Последние 30 дней сгенерированных паролей с фильтрами и экспортом.' })

const allEntries = ref<Array<{ password: string; source: string; date: string }>>([])
const filterSource = ref('')
const sortBy = ref<'date'|'password'|'source'>('date')
const sortDir = ref<'asc'|'desc'>('desc')
const page = ref(1)
const pageSize = ref(25)
let filterTimer: number | undefined

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem('dayz-passwords-history') || '[]')
  const now = new Date()
  const filtered = saved.filter((item: any) => {
    const passwordDate = new Date(item.date)
    const diffInDays = (now.getTime() - passwordDate.getTime()) / (1000 * 60 * 60 * 24)
    return diffInDays <= 30
  })
  allEntries.value = filtered
  localStorage.setItem('dayz-passwords-history', JSON.stringify(filtered))
})

// Форматирование даты
const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString()
const onFilterInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  if (filterTimer) window.clearTimeout(filterTimer)
  filterTimer = window.setTimeout(() => { filterSource.value = val; page.value = 1 }, 250)
}
const filteredEntries = computed(() => {
  let list = allEntries.value.filter(e => !filterSource.value || (e.source || '').toLowerCase().includes(filterSource.value.toLowerCase()))
  const sortKey = sortBy.value
  list = [...list].sort((a: any, b: any) => String(a[sortKey] || '').localeCompare(String(b[sortKey] || '')))
  if (sortDir.value === 'desc') list.reverse()
  return list
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredEntries.value.length / pageSize.value)))
const pagedEntries = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredEntries.value.slice(start, start + pageSize.value)
})
const prevPage = () => { if (page.value > 1) page.value -= 1 }
const nextPage = () => { if (page.value < totalPages.value) page.value += 1 }

// Clear helpers and export
const clearAll = () => {
  if (confirm('Очистить всю историю?')) {
    allEntries.value = []
    localStorage.removeItem('dayz-passwords-history')
  }
}
const clearOld = () => {
  const now = new Date()
  allEntries.value = allEntries.value.filter(item => {
    const d = new Date(item.date)
    return ((now.getTime() - d.getTime()) / (1000*60*60*24)) <= 30
  })
  localStorage.setItem('dayz-passwords-history', JSON.stringify(allEntries.value))
}
const downloadCsv = () => {
  const rows = [['№','Пароль','Источник','Дата'], ...filteredEntries.value.map((p, i) => [String(i+1), p.password, p.source || 'Без источника', formatDate(p.date)])]
  const csv = rows.map(r => r.map(f => `"${String(f).replaceAll('"','""')}"`).join(',')).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = 'dayz-passwords-history.csv'
  a.click()
}
const downloadJson = () => {
  const data = JSON.stringify(filteredEntries.value, null, 2)
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
  a.download = 'dayz-passwords-history.json'
  a.click()
}

// Старый clearHistory заменён на clearAll/clearOld
</script>

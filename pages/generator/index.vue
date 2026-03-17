<template>
  <PageContainer>
    <PageHeader
      title="Генератор паролей"
      description="Цифровые пароли для замков и дверей. Генерация в браузере, данные никуда не отправляются."
      back-to="/"
      back-label="На главную"
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Форма -->
      <aside class="lg:col-span-1" aria-label="Параметры генерации">
        <div class="sticky top-24 rounded-xl border border-border bg-card p-5 dark:border-primary/20 dark:shadow-glow">
          <h2 class="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Параметры</h2>

          <!-- Длина -->
          <div class="mb-4">
            <Label class="text-muted-foreground">Длина (цифр)</Label>
            <div class="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label="Быстрый выбор длины">
              <button
                v-for="n in [3, 4, 5, 6]"
                :key="n"
                type="button"
                :aria-pressed="length === n"
                :aria-label="`${n} цифр`"
                class="h-9 min-w-[2.5rem] rounded-md border px-3 text-sm font-medium transition-colors"
                :class="length === n ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background hover:bg-muted'"
                @click="length = n"
              >
                {{ n }}
              </button>
            </div>
          </div>

          <!-- Количество -->
          <div class="mb-4">
            <Label class="text-muted-foreground">Количество</Label>
            <div class="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label="Быстрый выбор количества">
              <button
                v-for="c in [1, 5, 10, 20]"
                :key="c"
                type="button"
                :aria-pressed="count === c"
                :aria-label="`${c} паролей`"
                class="h-9 min-w-[2.5rem] rounded-md border px-3 text-sm font-medium transition-colors"
                :class="count === c ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background hover:bg-muted'"
                @click="count = c"
              >
                {{ c }}
              </button>
            </div>
            <Input
              id="count"
              v-model.number="count"
              type="number"
              min="1"
              max="100"
              class="mt-2"
              aria-label="Количество паролей"
            />
          </div>

          <!-- Источник (подпись) -->
          <div class="mb-4">
            <Label for="source" class="text-muted-foreground">Подпись (опционально)</Label>
            <Input
              id="source"
              v-model="source"
              placeholder="Напр. дверь, гараж"
              class="mt-1.5"
            />
            <div v-if="suggestedSources.length" class="mt-2 flex flex-wrap gap-1.5">
              <button
                v-for="s in suggestedSources"
                :key="s"
                type="button"
                class="rounded-md border border-input bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                @click="source = s"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <form @submit.prevent="submitForm" class="space-y-3">
            <Button type="submit" class="w-full" size="lg">
              <Sparkles class="w-4 h-4 mr-2" aria-hidden="true" />
              Сгенерировать
            </Button>
            <div v-if="errors.length" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              <ul class="list-disc pl-4 space-y-0.5">
                <li v-for="err in errors" :key="err">{{ err }}</li>
              </ul>
            </div>
            <div v-if="successMessage" class="rounded-md bg-primary/10 border border-primary/30 px-3 py-2 text-sm font-medium text-primary" role="status" aria-live="polite">
              {{ successMessage }}
            </div>
          </form>
        </div>
      </aside>

      <!-- Результаты -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Панель: фильтр и сортировка -->
        <div v-if="passwords.length" class="rounded-xl border border-border bg-card p-4 dark:border-primary/20 dark:shadow-glow">
          <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <div class="flex-1 min-w-[140px]">
              <Label for="filter-source" class="text-xs text-muted-foreground">Фильтр по подписи</Label>
              <Input id="filter-source" :value="filterSource" @input="onFilterInput" placeholder="Поиск..." class="mt-1" />
            </div>
            <div class="flex gap-2 flex-wrap">
              <Select v-model="sortBy">
                <SelectTrigger class="w-[130px]">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">По дате</SelectItem>
                  <SelectItem value="password">По паролю</SelectItem>
                  <SelectItem value="source">По подписи</SelectItem>
                </SelectContent>
              </Select>
              <Select v-model="sortDir">
                <SelectTrigger class="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Убыв.</SelectItem>
                  <SelectItem value="asc">Возр.</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" @click="clearFilter">Сбросить</Button>
            </div>
          </div>
          <div v-if="quickSources.length" class="mt-3 flex flex-wrap gap-1.5">
            <button
              v-for="s in quickSources"
              :key="s"
              type="button"
              class="rounded-md border border-border bg-muted/30 px-2 py-1 text-xs hover:bg-muted"
              @click="applyQuickSource(s)"
            >
              {{ s }}
            </button>
          </div>
          <div class="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="filterExact" class="rounded border-input" />
              Точное совпадение
            </label>
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="filterWithSourceOnly" class="rounded border-input" />
              Только с подписью
            </label>
          </div>
        </div>

        <!-- Пустое состояние -->
        <div v-if="!passwords.length" class="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <KeyRound class="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" aria-hidden="true" />
          <p class="font-medium text-muted-foreground">Пока нет паролей</p>
          <p class="text-sm text-muted-foreground mt-1">Задайте параметры слева и нажмите «Сгенерировать».</p>
        </div>

        <!-- Список паролей -->
        <div v-else ref="resultsSectionRef" class="space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>Показано {{ visibleEntries.length }} из {{ passwords.length }}</span>
            <div class="flex flex-wrap gap-2" role="toolbar" aria-label="Экспорт и действия">
              <Button as-child variant="outline" size="sm">
                <a :href="downloadLink.href" :download="downloadLink.download">TXT</a>
              </Button>
              <Button as-child variant="outline" size="sm">
                <a :href="csvLink.href" :download="csvLink.download">CSV</a>
              </Button>
              <Button as-child variant="outline" size="sm">
                <a :href="jsonLink.href" :download="jsonLink.download">JSON</a>
              </Button>
              <input id="jsonImport" type="file" accept="application/json" class="hidden" @change="importJson" />
              <Button variant="outline" size="sm" @click="triggerImport">Импорт</Button>
              <Button variant="outline" size="sm" @click="copyAll">
                <Copy class="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                Копировать все
              </Button>
              <Button variant="outline" size="sm" class="text-destructive hover:text-destructive" @click="clearPasswords">Очистить</Button>
              <Button variant="destructive" size="sm" :disabled="selectedIndexes.size === 0" @click="deleteSelected">
                <Trash2 class="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                Удалить выбранные ({{ selectedIndexes.size }})
              </Button>
            </div>
          </div>

          <!-- Мобильные карточки -->
          <div class="block md:hidden space-y-3">
            <div
              v-for="({ item, originalIndex }) in pagedEntries"
              :key="originalIndex"
              class="rounded-xl border border-border bg-card p-4 dark:border-primary/15"
            >
              <div class="flex items-start justify-between gap-3">
                <label class="flex min-w-0 flex-1 cursor-pointer gap-3">
                  <input type="checkbox" :checked="selectedIndexes.has(originalIndex)" class="mt-1 rounded border-input" @change="toggleSelect(originalIndex)" />
                  <div class="min-w-0">
                    <div class="font-mono text-lg font-semibold break-all">{{ item.password }}</div>
                    <div class="text-sm text-muted-foreground">{{ item.source || '—' }}</div>
                    <div v-if="item.date" class="text-xs text-muted-foreground mt-0.5">{{ new Date(item.date).toLocaleString() }}</div>
                  </div>
                </label>
                <div class="flex shrink-0 flex-col gap-1.5">
                  <Button size="sm" variant="outline" class="h-8" @click="copyToClipboard(item.password)">Копировать</Button>
                  <Button size="sm" variant="ghost" class="h-8" @click="editPassword(originalIndex)">
                    <Pencil class="w-3.5 h-3.5" aria-hidden="true" />
                  </Button>
                  <Button size="sm" variant="ghost" class="h-8 text-destructive hover:text-destructive" @click="deletePassword(originalIndex)">
                    <Trash2 class="w-3.5 h-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Десктоп: таблица -->
          <div class="hidden md:block overflow-hidden rounded-xl border border-border bg-card dark:border-primary/15">
            <div class="overflow-auto max-h-[50vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="w-10">
                      <input type="checkbox" :checked="allSelected" aria-label="Выбрать все" @change="toggleSelectAll($event)" />
                    </TableHead>
                    <TableHead class="w-12">№</TableHead>
                    <TableHead>Пароль</TableHead>
                    <TableHead>Подпись</TableHead>
                    <TableHead class="w-[1%] text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="({ item, originalIndex }) in pagedEntries" :key="originalIndex">
                    <TableCell>
                      <input type="checkbox" :checked="selectedIndexes.has(originalIndex)" class="rounded border-input" @change="toggleSelect(originalIndex)" />
                    </TableCell>
                    <TableCell class="text-muted-foreground">{{ (page - 1) * pageSize + index + 1 }}</TableCell>
                    <TableCell class="font-mono font-medium">{{ item.password }}</TableCell>
                    <TableCell class="text-muted-foreground">{{ item.source || '—' }}</TableCell>
                    <TableCell class="text-right">
                      <div class="flex justify-end gap-1.5">
                        <Button size="sm" variant="ghost" class="h-8 w-8 p-0" @click="copyToClipboard(item.password)" title="Копировать">
                          <Copy class="w-4 h-4" aria-hidden="true" />
                        </Button>
                        <Button size="sm" variant="ghost" class="h-8 w-8 p-0" @click="editPassword(originalIndex)" title="Редактировать">
                          <Pencil class="w-4 h-4" aria-hidden="true" />
                        </Button>
                        <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive hover:text-destructive" @click="deletePassword(originalIndex)" title="Удалить">
                          <Trash2 class="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <!-- Пагинация -->
          <div v-if="totalPages > 1" class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3">
            <div class="flex items-center gap-2">
              <Label for="page-size" class="text-sm text-muted-foreground">На странице</Label>
              <Select v-model="pageSize">
                <SelectTrigger id="page-size" class="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="s in pageSizeOptions" :key="s" :value="s">{{ s }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <span class="text-sm text-muted-foreground">Стр. {{ page }} из {{ totalPages }}</span>
            <div class="flex gap-2">
              <Button variant="outline" size="sm" :disabled="page <= 1" @click="prevPage">Назад</Button>
              <Button variant="outline" size="sm" :disabled="page >= totalPages" @click="nextPage">Вперёд</Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка редактирования -->
    <Dialog v-model:open="showEditModal">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать пароль</DialogTitle>
        </DialogHeader>
        <div class="space-y-4 pt-2">
          <div class="space-y-2">
            <Label for="edit-password">Пароль</Label>
            <Input id="edit-password" v-model="editForm.password" />
          </div>
          <div class="space-y-2">
            <Label for="edit-source">Подпись</Label>
            <Input id="edit-source" v-model="editForm.source" />
          </div>
          <DialogFooter class="gap-2 sm:gap-0">
            <Button @click="saveEdit">Сохранить</Button>
            <Button variant="outline" @click="closeEditModal">Отмена</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import type { PasswordEntry } from '~/types/generator'

definePageMeta({ layout: 'default' })

import { Copy, KeyRound, Pencil, Sparkles, Trash2 } from 'lucide-vue-next'

const { passwords, history, defaults, load, savePasswords, saveHistory, saveDefaults } = usePasswordStorage()

const length = ref<number>(3)
const count = ref<number>(1)
const source = ref<string>('')
const showResults = ref(false)
const errors = ref<string[]>([])
const showEditModal = ref(false)
const editIndex = ref<number | null>(null)
const editForm = ref<PasswordEntry>({ password: '', source: '' })
const successMessage = ref<string>('')
const filterSource = ref<string>('')
const filterExact = ref<boolean>(false)
const filterWithSourceOnly = ref<boolean>(false)
const sortBy = ref<'date' | 'password' | 'source'>('date')
const sortDir = ref<'asc' | 'desc'>('desc')
const selectedIndexes = ref<Set<number>>(new Set())
const page = ref<number>(1)
const pageSizeOptions = [10, 25, 50]
const pageSize = ref<number>(25)
let filterTimer: number | undefined

const onFilterInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (filterTimer) window.clearTimeout(filterTimer)
  filterTimer = window.setTimeout(() => {
    filterSource.value = value
    page.value = 1
  }, 250)
}

const clearFilter = () => {
  filterSource.value = ''
  filterExact.value = false
  filterWithSourceOnly.value = false
  page.value = 1
}

const applyQuickSource = (s: string) => {
  filterSource.value = s
  page.value = 1
}

const suggestedSources = computed<string[]>(() => {
  const unique = Array.from(new Set(history.value.map(i => (i.source || '').trim()).filter(Boolean)))
  return unique.slice(0, 8)
})

const quickSources = computed<string[]>(() => {
  const current = Array.from(new Set(passwords.value.map(p => (p.source || '').trim()).filter(Boolean)))
  const merged = Array.from(new Set([...current, ...suggestedSources.value]))
  return merged.slice(0, 10)
})

const visibleEntries = computed(() => {
  const list = passwords.value
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(e => {
      const src = (e.item.source || '').trim()
      if (filterWithSourceOnly.value && !src) return false
      if (!filterSource.value) return true
      const needle = filterSource.value.toLowerCase().trim()
      const hay = src.toLowerCase()
      return filterExact.value ? hay === needle : hay.includes(needle)
    })
  const compare = (a: any, b: any) => {
    const key = sortBy.value
    const av = (a.item[key] || '').toString()
    const bv = (b.item[key] || '').toString()
    return av.localeCompare(bv)
  }
  const sorted = [...list].sort((a, b) => compare(a, b))
  if (sortDir.value === 'desc') sorted.reverse()
  return sorted
})

const allSelected = computed(() => selectedIndexes.value.size > 0 && selectedIndexes.value.size === visibleEntries.value.length)

const toggleSelectAll = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  selectedIndexes.value = new Set()
  if (checked) visibleEntries.value.forEach(e => selectedIndexes.value.add(e.originalIndex))
}

const totalPages = computed(() => Math.max(1, Math.ceil(visibleEntries.value.length / pageSize.value)))

const pagedEntries = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return visibleEntries.value.slice(start, start + pageSize.value)
})

const prevPage = () => { if (page.value > 1) page.value -= 1 }
const nextPage = () => { if (page.value < totalPages.value) page.value += 1 }

const toggleSelect = (originalIndex: number) => {
  if (selectedIndexes.value.has(originalIndex)) selectedIndexes.value.delete(originalIndex)
  else selectedIndexes.value.add(originalIndex)
}

const resultsSectionRef = ref<HTMLElement | null>(null)

const downloadLink = ref<{ href: string; download: string }>({ href: '', download: '' })
const csvLink = ref<{ href: string; download: string }>({ href: '', download: '' })
const jsonLink = ref<{ href: string; download: string }>({ href: '', download: '' })

function revokeExportUrls() {
  for (const r of [downloadLink, csvLink, jsonLink]) {
    if (r.value.href?.startsWith('blob:')) {
      URL.revokeObjectURL(r.value.href)
      r.value = { href: '', download: '' }
    }
  }
}

function updateExportLinks() {
  revokeExportUrls()
  const date = new Date().toISOString().split('T')[0]
  const list = passwords.value
  const noHeader = '№'
  const passwordHeader = 'Пароль'
  const sourceHeader = 'Источник'
  let maxNoWidth = Math.max(noHeader.length, list.length.toString().length)
  let maxPasswordWidth = passwordHeader.length
  let maxSourceWidth = sourceHeader.length
  list.forEach(p => {
    maxPasswordWidth = Math.max(maxPasswordWidth, p.password.length)
    maxSourceWidth = Math.max(maxSourceWidth, (p.source || 'Без источника').length)
  })
  const borderLine = `+${'-'.repeat(maxNoWidth + 2)}+${'-'.repeat(maxPasswordWidth + 2)}+${'-'.repeat(maxSourceWidth + 2)}+`
  let content = '************************************\n       DayZ Password Generator      \n************************************\n\n'
  content += borderLine + '\n'
  content += `| ${noHeader.padEnd(maxNoWidth)} | ${passwordHeader.padEnd(maxPasswordWidth)} | ${sourceHeader.padEnd(maxSourceWidth)} |\n`
  content += borderLine + '\n'
  list.forEach((p, i) => {
    const src = (p.source || 'Без источника').padEnd(maxSourceWidth)
    content += `| ${(i + 1).toString().padEnd(maxNoWidth)} | ${p.password.padEnd(maxPasswordWidth)} | ${src} |\n`
  })
  content += borderLine + '\n'
  downloadLink.value = { href: URL.createObjectURL(new Blob([content], { type: 'text/plain' })), download: `dayz-passwords-${date}.txt` }
  const rows = [['№', 'Пароль', 'Источник', 'Дата'], ...list.map((p, i) => [String(i + 1), p.password, p.source || 'Без источника', p.date || ''])]
  const csv = rows.map(r => r.map(f => `"${(f ?? '').toString().replaceAll('"', '""')}"`).join(',')).join('\n')
  csvLink.value = { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: `dayz-passwords-${date}.csv` }
  jsonLink.value = { href: URL.createObjectURL(new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' })), download: `dayz-passwords-${date}.json` }
}

watch(passwords, updateExportLinks, { deep: true })
onBeforeUnmount(revokeExportUrls)

const generatePasswords = () => {
  const now = new Date().toISOString()
  const newPasswords = Array.from({ length: count.value }, () => ({
    password: Array.from({ length: length.value }, () => Math.floor(Math.random() * 10)).join(''),
    source: source.value,
    date: now
  }))
  passwords.value = [...passwords.value, ...newPasswords]
  savePasswords(passwords.value)
  saveHistory([...history.value, ...newPasswords])
  showResults.value = true
  showSuccess('Пароли сгенерированы')
}

const validateForm = () => {
  errors.value = []
  if (![3, 4, 5, 6].includes(length.value)) errors.value.push('Длина: от 3 до 6 цифр')
  if (count.value < 1 || count.value > 100) errors.value.push('Количество: от 1 до 100')
  return errors.value.length === 0
}

const submitForm = () => {
  if (!validateForm()) return
  generatePasswords()
  saveDefaults({ length: length.value, count: count.value, source: source.value })
  source.value = ''
  nextTick(() => resultsSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    showSuccess('Скопировано')
  } catch (e) { console.error(e) }
}

const copyAll = async () => {
  if (!passwords.value.length) return
  const text = passwords.value.map((p, i) => `${i + 1}. ${p.password} — ${p.source || '—'}`).join('\n')
  try {
    await navigator.clipboard.writeText(text)
    showSuccess('Все пароли скопированы')
  } catch (e) { console.error(e) }
}

const showSuccess = (msg: string) => {
  successMessage.value = msg
  setTimeout(() => { successMessage.value = '' }, 2000)
}

const triggerImport = () => document.getElementById('jsonImport')?.click()

const importJson = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  try {
    const data = JSON.parse(await file.text())
    if (!Array.isArray(data)) throw new Error('invalid')
    passwords.value = data.map((p: any) => ({
      password: String(p.password ?? ''),
      source: String(p.source ?? ''),
      date: p.date ? String(p.date) : undefined
    }))
    savePasswords(passwords.value)
    showResults.value = passwords.value.length > 0
    showSuccess('Импорт выполнен')
  } catch {
    errors.value = ['Неверный формат JSON']
  }
  target.value = ''
}

const clearPasswords = () => {
  savePasswords([])
  showResults.value = false
}

const deletePassword = (index: number) => {
  passwords.value.splice(index, 1)
  savePasswords(passwords.value)
  if (!passwords.value.length) showResults.value = false
}

const deleteSelected = () => {
  if (selectedIndexes.value.size === 0) return
  passwords.value = passwords.value.filter((_, idx) => !selectedIndexes.value.has(idx))
  savePasswords(passwords.value)
  selectedIndexes.value.clear()
  if (!passwords.value.length) showResults.value = false
  showSuccess('Удалено')
}

const editPassword = (index: number) => {
  editIndex.value = index
  editForm.value = { ...passwords.value[index] }
  showEditModal.value = true
}

const saveEdit = () => {
  if (editIndex.value === null) return
  const prev = passwords.value[editIndex.value]
  passwords.value[editIndex.value] = { ...prev, ...editForm.value, date: prev.date || editForm.value.date }
  savePasswords(passwords.value)
  showEditModal.value = false
  editIndex.value = null
  showSuccess('Сохранено')
}

const closeEditModal = () => {
  showEditModal.value = false
  editIndex.value = null
}

onMounted(() => {
  load()
  if (passwords.value.length) showResults.value = true
  if (defaults.value?.length) length.value = defaults.value.length
  if (defaults.value?.count) count.value = defaults.value.count
  if (defaults.value?.source) source.value = defaults.value.source
  updateExportLinks()
})
</script>

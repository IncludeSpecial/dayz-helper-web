<template>

  <div class="container mx-auto px-4 py-12">
  <div class="max-w-2xl mx-auto text-center">
    <Badge variant="outline" class="text-sm px-4 py-1">🔑 Генератор паролей</Badge>
    <h1 class="text-4xl font-bold mt-4">Сгенерирует случайные пароли</h1>
    <p class="text-gray-500 dark:text-gray-400 mt-2">
      Выберите разрядность и количество, чтобы сгенерировать его для ваших нужд.
    </p>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
    <!-- Левая колонка: форма (sticky) -->
    <div class="lg:col-span-1">
      <Card class="sticky top-24">
        <CardHeader>
          <CardTitle>Параметры генерации</CardTitle>
        </CardHeader>
        <CardContent>
        <!-- Быстрые пресеты -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="space-y-2">
            <Label>Быстрый выбор длины</Label>
            <div class="flex flex-wrap gap-2">
              <Button v-for="n in [3,4,5,6]" :key="'len-'+n" variant="outline" size="sm" @click="length = n" :class="length === n ? 'bg-primary text-white' : ''">{{ n }}</Button>
            </div>
          </div>
          <div class="space-y-2">
            <Label>Быстрый выбор количества</Label>
            <div class="flex flex-wrap gap-2">
              <Button v-for="c in [1,5,10,20]" :key="'cnt-'+c" variant="outline" size="sm" @click="count = c" :class="count === c ? 'bg-primary text-white' : ''">{{ c }}</Button>
            </div>
          </div>
          <div class="space-y-2">
            <Label>Подсказки источника</Label>
            <div class="flex flex-wrap gap-2">
              <Button v-for="s in suggestedSources" :key="'src-'+s" variant="outline" size="sm" @click="source = s">{{ s }}</Button>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitForm" class="grid grid-cols-1 gap-4 mb-2">
          <!-- Длина пароля -->
          <div class="space-y-2">
            <Label for="length">Длина пароля</Label>
            <Select v-model="length">
              <SelectTrigger>
                <SelectValue placeholder="Выберите длину" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="n in [3,4,5,6]" :key="n" :value="n">{{ n }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Количество паролей -->
          <div class="space-y-2">
            <Label for="count">Количество паролей</Label>
            <Input
                id="count"
                v-model.number="count"
                type="number"
                min="1"
                max="100"
            />
          </div>

          <!-- Источник пароля -->
          <div class="space-y-2">
            <Label for="source">Источник пароля</Label>
            <Input
                id="source"
                v-model="source"
                placeholder="Например: дверь, гараж, замок"
            />
          </div>

          <!-- Кнопка отправки -->
          <Button type="submit" class="w-full">
            <Sparkles class="w-4 h-4 mr-2" />
            Сгенерировать
          </Button>

          <!-- Вывод ошибок -->
          <FormMessage v-if="errors.length" class="text-destructive">
            <div v-for="error in errors" :key="error">{{ error }}</div>
          </FormMessage>
          <div v-if="successMessage" class="text-green-600 dark:text-green-400">
            {{ successMessage }}
          </div>
        </form>
        </CardContent>
      </Card>
    </div>

    <!-- Правая колонка: результаты -->
    <div class="lg:col-span-2">
      <!-- Панель фильтрации/сортировки -->
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>Результаты</CardTitle>
        </CardHeader>
        <CardContent>
        <div v-if="passwords.length" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label for="filter-source">Фильтр по источнику</Label>
            <Input id="filter-source" :value="filterSource" @input="onFilterInput" placeholder="Например: дверь" />
          </div>
          <div>
            <Label for="sort-by">Сортировка</Label>
            <Select v-model="sortBy">
              <SelectTrigger>
                <SelectValue placeholder="Поле сортировки" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Дата</SelectItem>
                <SelectItem value="password">Пароль</SelectItem>
                <SelectItem value="source">Источник</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="sort-dir">Порядок</Label>
            <Select v-model="sortDir">
              <SelectTrigger>
                <SelectValue placeholder="Направление" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">По убыванию</SelectItem>
                <SelectItem value="asc">По возрастанию</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <!-- QoL: быстрые источники и переключатели -->
        <div v-if="passwords.length" class="mt-3 flex flex-col gap-3">
          <div class="flex flex-nowrap gap-2 overflow-x-auto -mx-1 px-1">
            <Button v-for="s in quickSources" :key="'qsrc-'+s" size="sm" variant="outline" class="shrink-0" @click="applyQuickSource(s)">{{ s }}</Button>
          </div>
          <div class="flex flex-wrap items-center gap-4 text-sm">
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="filterExact" />
              Точное совпадение
            </label>
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="filterWithSourceOnly" />
              Только с источником
            </label>
            <div class="ml-auto flex gap-2">
              <Button size="sm" variant="outline" @click="clearFilter">Сбросить</Button>
              <Button size="sm" variant="secondary" @click="reapplyFilter">Применить</Button>
            </div>
          </div>
        </div>
        <!-- Summary / Empty state -->
        <div v-if="!passwords.length" class="text-center text-gray-500 dark:text-gray-400 py-10">
          Пока нет паролей. Сгенерируйте первые в форме слева.
        </div>
        <div v-else class="text-sm text-gray-600 dark:text-gray-400 mt-4">
          Показано: {{ visibleEntries.length }} из {{ passwords.length }}
        </div>
        </CardContent>
      </Card>

      <!-- Результаты -->
      <div v-if="showResults" class="space-y-6">
        <Card>
          <CardContent class="pt-6">

          <!-- Мобильный список карточек -->
          <div class="block md:hidden space-y-3">
            <Card v-for="({ item, originalIndex }, index) in pagedEntries" :key="originalIndex">
              <CardContent class="pt-4 pb-3">
                <div class="flex items-start justify-between gap-3 min-w-0">
                  <div class="flex items-start gap-3 min-w-0">
                    <input type="checkbox" :checked="selectedIndexes.has(originalIndex)" @change="toggleSelect(originalIndex)" class="mt-1" />
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">#{{ index + 1 }}</div>
                      <div class="font-mono text-lg font-semibold break-all max-w-full">{{ item.password }}</div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">{{ item.source || 'Не указано' }}</div>
                      <div v-if="item.date" class="text-xs text-gray-500 dark:text-gray-500">{{ new Date(item.date).toLocaleString() }}</div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <Button size="sm" variant="outline" @click="copyToClipboard(item.password)">Копировать</Button>
                    <Button size="sm" variant="outline" @click="editPassword(originalIndex)">Редактировать</Button>
                    <Button size="sm" variant="destructive" @click="deletePassword(originalIndex)">Удалить</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Mobile sticky controls -->
            <div class="sticky bottom-0 left-0 right-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur border-t border-neutral-200 dark:border-neutral-800 p-3 flex flex-wrap gap-2 justify-between items-center">
              <div class="text-sm text-gray-600 dark:text-gray-400">Выбрано: {{ selectedIndexes.size }}</div>
              <div class="flex flex-nowrap gap-2 overflow-x-auto whitespace-nowrap w-full md:w-auto justify-end">
                <Button size="sm" variant="outline" @click="copyAll">Копировать все</Button>
                <Button size="sm" variant="secondary" as-child>
                  <a :href="csvLink.href" :download="csvLink.download">CSV</a>
                </Button>
                <Button size="sm" variant="secondary" as-child>
                  <a :href="jsonLink.href" :download="jsonLink.download">JSON</a>
                </Button>
                <Button size="sm" variant="outline" @click="triggerImport">Импорт</Button>
                <Button size="sm" variant="destructive" :disabled="selectedIndexes.size === 0" @click="deleteSelected">Удалить выбранные</Button>
              </div>
            </div>
          </div>

          <!-- Таблица: компактная, фиксированный заголовок, скролл (Desktop) -->
          <div class="hidden md:block overflow-auto max-h-[60vh]">
            <Table class="min-w-[600px] text-sm">
              <TableHeader class="sticky top-0 z-10 bg-white dark:bg-neutral-950">
                <TableRow>
                  <TableHead class="sticky top-0 z-10 bg-white dark:bg-neutral-950">
                    <input type="checkbox" :checked="allSelected" @change="toggleSelectAll($event)" />
                  </TableHead>
                  <TableHead class="sticky top-0 z-10 bg-white dark:bg-neutral-950">№</TableHead>
                  <TableHead class="sticky top-0 z-10 bg-white dark:bg-neutral-950">Пароль</TableHead>
                  <TableHead class="sticky top-0 z-10 bg-white dark:bg-neutral-950">Источник</TableHead>
                  <TableHead class="sticky top-0 z-10 bg-white dark:bg-neutral-950 min-w-[200px] md:min-w-[300px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="({ item, originalIndex }, index) in pagedEntries" :key="originalIndex" class="h-10">
                  <TableCell>
                    <input type="checkbox" :checked="selectedIndexes.has(originalIndex)" @change="toggleSelect(originalIndex)" />
                  </TableCell>
                  <TableCell>{{ index + 1 }}</TableCell>
                  <TableCell class="font-mono font-medium py-2">{{ item.password }}</TableCell>
                  <TableCell class="py-2">{{ item.source || 'Не указано' }}</TableCell>
                  <TableCell>
                    <div class="flex flex-wrap gap-2 min-w-0">
                      <Button variant="outline" size="sm" @click="editPassword(originalIndex)">
                        <Pencil class="w-4 h-4 mr-2" />
                        Редактировать
                      </Button>
                      <Button size="sm" @click="copyToClipboard(item.password)">
                        <Copy class="w-4 h-4 mr-2" />
                        Копировать
                      </Button>
                      <Button variant="destructive" size="sm" @click="deletePassword(originalIndex)">
                        <Trash2 class="w-4 h-4 mr-2" />
                        Удалить
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <!-- Управление результатами -->
          <div class="mt-4">
            <div class="flex flex-wrap md:flex-nowrap items-stretch gap-2 md:gap-3 overflow-x-auto -mx-1 px-1" role="toolbar" aria-label="Управление результатами">
              <!-- Группа: Скачивание -->
              <div class="flex items-stretch gap-2 shrink-0">
                <Button as-child variant="secondary" size="sm" class="shrink-0">
                  <a :href="downloadLink.href" :download="downloadLink.download">
                    <Download class="w-4 h-4 mr-2" /> TXT
                  </a>
                </Button>
                <Button as-child variant="secondary" size="sm" class="shrink-0">
                  <a :href="csvLink.href" :download="csvLink.download">
                    <Download class="w-4 h-4 mr-2" /> CSV
                  </a>
                </Button>
                <Button as-child variant="secondary" size="sm" class="shrink-0">
                  <a :href="jsonLink.href" :download="jsonLink.download">
                    <Download class="w-4 h-4 mr-2" /> JSON
                  </a>
                </Button>
              </div>
              <div class="hidden md:block w-px self-stretch bg-neutral-200 dark:bg-neutral-800" />
              <!-- Группа: Импорт / Копировать -->
              <div class="flex items-stretch gap-2 shrink-0">
                <input id="jsonImport" type="file" accept="application/json" class="hidden" @change="importJson" />
                <Button variant="outline" size="sm" class="shrink-0" @click="triggerImport">Импорт</Button>
                <Button variant="outline" size="sm" class="shrink-0" @click="copyAll">
                  <Copy class="w-4 h-4 mr-2" /> Копировать все
                </Button>
              </div>
              <div class="hidden md:block w-px self-stretch bg-neutral-200 dark:bg-neutral-800" />
              <!-- Группа: Очистка / Удаление -->
              <div class="flex items-stretch gap-2 shrink-0">
                <Button variant="destructive" size="sm" class="shrink-0" @click="clearPasswords">
                  <X class="w-4 h-4 mr-2" /> Очистить
                </Button>
                <Button variant="destructive" size="sm" class="shrink-0" @click="deleteSelected" :disabled="selectedIndexes.size === 0">
                  <Trash2 class="w-4 h-4 mr-2" /> Удалить выбранные
                </Button>
              </div>
            </div>
          </div>

          <!-- Пагинация -->
          <div class="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <Label>На странице</Label>
              <Select v-model="pageSize">
                <SelectTrigger class="w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="s in pageSizeOptions" :key="s" :value="s">{{ s }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              Страница {{ page }} из {{ totalPages }}
              <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" @click="prevPage" :disabled="page <= 1">Назад</Button>
                <Button variant="outline" size="sm" @click="nextPage" :disabled="page >= totalPages">Вперёд</Button>
              </div>
            </div>
          </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Модальное окно редактирования -->
    <Dialog v-model:open="showEditModal">
      <DialogContent class="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Редактировать пароль</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Пароль</Label>
            <Input v-model="editForm.password" />
          </div>
          <div class="space-y-2">
            <Label>Источник</Label>
            <Input v-model="editForm.source" />
          </div>
          <DialogFooter>
            <Button @click="saveEdit">Сохранить</Button>
            <Button variant="outline" @click="closeEditModal">Отмена</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  </div>
  </div>

</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// Импорт иконок
import { Copy, Download, Pencil, Sparkles, Trash2, X } from 'lucide-vue-next'

const length = ref<number>(3)
const count = ref<number>(1)
const source = ref<string>('')
const passwords = ref<Array<{ password: string; source: string; date?: string }>>([])
const showResults = ref(false)
const errors = ref<string[]>([])
const showEditModal = ref(false)
const editIndex = ref<number | null>(null)
const editForm = ref<{ password: string; source: string; date?: string }>({
  password: '',
  source: ''
})
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
const reapplyFilter = () => { page.value = 1 }
const clearFilter = () => { filterSource.value = ''; filterExact.value = false; filterWithSourceOnly.value = false; page.value = 1 }
const applyQuickSource = (s: string) => { filterSource.value = s; page.value = 1 }

const suggestedSources = computed<string[]>(() => {
  const saved = JSON.parse(localStorage.getItem('dayz-passwords-history') || '[]') as Array<{ source?: string }>
  const unique = Array.from(new Set(saved.map(i => (i.source || '').trim()).filter(Boolean)))
  return unique.slice(0, 8)
})

// Быстрые источники: объединяем подсказки + последние введенные в текущей сессии
const quickSources = computed<string[]>(() => {
  const current = Array.from(new Set(passwords.value.map(p => (p.source || '').trim()).filter(Boolean)))
  const merged = Array.from(new Set([...current, ...suggestedSources.value]))
  return merged.slice(0, 10)
})

// Видимые пароли с исходными индексами (учёт фильтра и сортировки)
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

// Селекты
const allSelected = computed(() => selectedIndexes.value.size > 0 && selectedIndexes.value.size === visibleEntries.value.length)
const toggleSelectAll = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  selectedIndexes.value = new Set()
  if (checked) {
    visibleEntries.value.forEach((e) => selectedIndexes.value.add(e.originalIndex))
  }
}
// Пагинация
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

// Загрузка сохранённых паролей
onMounted(() => {
  const saved = localStorage.getItem('dayz-passwords')
  if (saved) {
    passwords.value = JSON.parse(saved)
    showResults.value = true
  }
  // Восстановление дефолтов
  const defaults = JSON.parse(localStorage.getItem('dayz-generator-defaults') || 'null')
  if (defaults) {
    if (defaults.length) length.value = defaults.length
    if (defaults.count) count.value = defaults.count
    if (defaults.source) source.value = defaults.source
  }
})

// Ссылка для скачивания
const downloadLink = computed(() => {
  const date = new Date().toISOString().split('T')[0];

  // Заголовки столбцов
  const noHeader = "№";
  const passwordHeader = "Пароль";
  const sourceHeader = "Источник";

  // Вычисляем максимальную ширину для каждого столбца
  let maxNoWidth = Math.max(noHeader.length, passwords.value.length.toString().length);
  let maxPasswordWidth = passwordHeader.length;
  let maxSourceWidth = sourceHeader.length;

  passwords.value.forEach(p => {
    maxPasswordWidth = Math.max(maxPasswordWidth, p.password.length);
    const src = p.source || "Без источника";
    maxSourceWidth = Math.max(maxSourceWidth, src.length);
  });

  // Функция для создания строки-разделителя
  const createBorder = () =>
      `+${'-'.repeat(maxNoWidth + 2)}+${'-'.repeat(maxPasswordWidth + 2)}+${'-'.repeat(maxSourceWidth + 2)}+`;

  const borderLine = createBorder();

  // Формируем содержимое файла
  let content = "";
  content += "************************************\n";
  content += "       DayZ Password Generator      \n";
  content += "************************************\n\n";
  content += borderLine + "\n";
  content += `| ${noHeader.padEnd(maxNoWidth)} | ${passwordHeader.padEnd(maxPasswordWidth)} | ${sourceHeader.padEnd(maxSourceWidth)} |\n`;
  content += borderLine + "\n";

  passwords.value.forEach((p, index) => {
    const src = p.source || "Без источника";
    content += `| ${(index + 1).toString().padEnd(maxNoWidth)} | ${p.password.padEnd(maxPasswordWidth)} | ${src.padEnd(maxSourceWidth)} |\n`;
  });

  content += borderLine + "\n";

  return {
    href: URL.createObjectURL(new Blob([content], { type: 'text/plain' })),
    download: `dayz-passwords-${date}.txt`
  }
});

// CSV ссылка
const csvLink = computed(() => {
  const date = new Date().toISOString().split('T')[0];
  const rows = [
    ['№', 'Пароль', 'Источник', 'Дата'],
    ...passwords.value.map((p, i) => [String(i + 1), p.password, p.source || 'Без источника', p.date || ''])
  ];
  const csv = rows.map(r => r.map(field => `"${(field ?? '').toString().replaceAll('"', '""')}"`).join(',')).join('\n');
  return {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: `dayz-passwords-${date}.csv`
  }
})

// JSON ссылка
const jsonLink = computed(() => {
  const date = new Date().toISOString().split('T')[0]
  const data = JSON.stringify(passwords.value, null, 2)
  return {
    href: URL.createObjectURL(new Blob([data], { type: 'application/json' })),
    download: `dayz-passwords-${date}.json`
  }
})


// Генерация паролей
// Генерация паролей с датой создания
const generatePasswords = () => {
  const now = new Date().toISOString(); // Текущая дата в ISO формате
  const newPasswords = Array.from({ length: count.value }, () => ({
    password: Array.from({ length: length.value }, () => Math.floor(Math.random() * 10)).join(''),
    source: source.value,
    date: now, // Запоминаем дату создания
  }));

  // Обновляем текущие пароли
  passwords.value = [...passwords.value, ...newPasswords];
  localStorage.setItem('dayz-passwords', JSON.stringify(passwords.value));

  // Добавляем в историю (не удаляем предыдущие записи)
  const savedHistory = JSON.parse(localStorage.getItem('dayz-passwords-history') || '[]');
  const updatedHistory = [...savedHistory, ...newPasswords];
  localStorage.setItem('dayz-passwords-history', JSON.stringify(updatedHistory));

  showResults.value = true;
  showSuccess('Пароли сгенерированы');
};





// Валидация формы
const validateForm = () => {
  errors.value = []
  if (![3,4,5,6].includes(length.value)) {
    errors.value.push('Длина пароля должна быть от 3 до 6 символов')
  }
  if (count.value < 1 || count.value > 100) {
    errors.value.push('Количество паролей должно быть от 1 до 100')
  }
  return errors.value.length === 0
}

// Обработка отправки формы
const submitForm = () => {
  if (!validateForm()) return
  generatePasswords()
  // Сохраняем текущие дефолты
  localStorage.setItem('dayz-generator-defaults', JSON.stringify({ length: length.value, count: count.value, source: source.value }))
  source.value = ''
}

// Копирование в буфер обмена
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    showSuccess('Пароль скопирован')
  } catch (err) {
    console.error('Ошибка копирования:', err)
  }
}

const copyAll = async () => {
  if (!passwords.value.length) return
  const text = passwords.value.map((p, i) => `${i + 1}. ${p.password} — ${p.source || 'Без источника'}`).join('\n')
  try {
    await navigator.clipboard.writeText(text)
    showSuccess('Все пароли скопированы')
  } catch (err) {
    console.error('Ошибка копирования:', err)
  }
}

const showSuccess = (msg: string) => {
  successMessage.value = msg
  setTimeout(() => { successMessage.value = '' }, 2000)
}

const triggerImport = () => {
  const input = document.getElementById('jsonImport') as HTMLInputElement | null
  if (input) input.click()
}

const importJson = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    if (!Array.isArray(data)) throw new Error('invalid_format')
    const normalized = data.map((p: any) => ({
      password: String(p.password ?? ''),
      source: String(p.source ?? ''),
      date: p.date ? String(p.date) : undefined
    }))
    passwords.value = normalized
    localStorage.setItem('dayz-passwords', JSON.stringify(passwords.value))
    showResults.value = passwords.value.length > 0
    showSuccess('Импорт завершён')
  } catch (err) {
    console.error('Импорт JSON не удался', err)
    errors.value = ['Не удалось импортировать JSON']
  } finally {
    // сброс инпута для повторного выбора того же файла
    target.value = ''
  }
}

// Очистка только текущих паролей
const clearPasswords = () => {
  passwords.value = [];
  showResults.value = false;
  localStorage.removeItem('dayz-passwords'); // Удаляем только текущие пароли, а не историю
};

const deletePassword = (index: number) => {
  passwords.value.splice(index, 1)
  localStorage.setItem('dayz-passwords', JSON.stringify(passwords.value))
  if (passwords.value.length === 0) showResults.value = false
}

const deleteSelected = () => {
  if (selectedIndexes.value.size === 0) return
  const keep = passwords.value.filter((_, idx) => !selectedIndexes.value.has(idx))
  passwords.value = keep
  localStorage.setItem('dayz-passwords', JSON.stringify(passwords.value))
  selectedIndexes.value.clear()
  if (passwords.value.length === 0) showResults.value = false
  showSuccess('Выбранные пароли удалены')
}

// Редактирование пароля
const editPassword = (index: number) => {
  editIndex.value = index
  editForm.value = { ...passwords.value[index] }
  showEditModal.value = true
}

const saveEdit = () => {
  if (editIndex.value !== null) {
    const prev = passwords.value[editIndex.value]
    passwords.value[editIndex.value] = { ...prev, ...editForm.value, date: prev.date || editForm.value.date }
    localStorage.setItem('dayz-passwords', JSON.stringify(passwords.value))
    showEditModal.value = false
    showSuccess('Изменения сохранены')
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editIndex.value = null
}
</script>

<template>
  <PageContainer>
    <PageHeader
      title="Чек-лист"
      description="Списки вещей на рейд или базу — отмечайте выполненное. Всё хранится в браузере."
      back-to="/"
      back-label="На главную"
    />

    <!-- Новый список -->
    <section class="rounded-xl border border-border bg-card p-5 dark:border-primary/20 dark:shadow-glow mb-6" aria-labelledby="new-list-title">
      <h2 id="new-list-title" class="text-lg font-semibold text-foreground mb-1">Новый список</h2>
      <p class="text-sm text-muted-foreground mb-4">Например: Рейд, Что взять на базу</p>
      <div class="flex flex-wrap gap-2">
        <Input
          v-model="newListName"
          placeholder="Название списка"
          class="flex-1 min-w-[200px]"
          aria-label="Название нового списка"
          @keydown.enter.prevent="addList"
        />
        <Button :disabled="!newListName.trim()" @click="addList">
          <Plus class="w-4 h-4 mr-2" aria-hidden="true" />
          Создать
        </Button>
      </div>
    </section>

    <!-- Панель: сортировка, экспорт -->
    <div v-if="lists.length" class="mb-4 flex flex-wrap items-center gap-3">
      <Label for="sort-lists" class="text-sm text-muted-foreground">Сортировка</Label>
      <Select v-model="listSort">
        <SelectTrigger id="sort-lists" class="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Сначала новые</SelectItem>
          <SelectItem value="oldest">Сначала старые</SelectItem>
          <SelectItem value="name">По названию</SelectItem>
        </SelectContent>
      </Select>
      <Button size="sm" variant="outline" @click="exportTxt">TXT</Button>
      <Button size="sm" variant="outline" @click="exportJson">JSON</Button>
    </div>

    <!-- Списки -->
    <div v-if="lists.length" class="space-y-4">
      <h2 class="text-lg font-semibold text-foreground">
        Мои списки
        <span class="text-muted-foreground font-normal">({{ sortedLists.length }})</span>
      </h2>

      <article
        v-for="list in sortedLists"
        :key="list.id"
        class="rounded-xl border border-border bg-card p-5 dark:border-primary/20 dark:shadow-glow"
      >
        <div class="flex items-center justify-between gap-2 mb-4">
          <div class="flex-1 min-w-0">
            <input
              v-if="editingListId === list.id"
              ref="editListInputRef"
              v-model="editingListName"
              type="text"
              class="w-full text-lg font-semibold bg-transparent border-b border-primary rounded-none px-0 py-0.5 focus-visible:outline-none focus-visible:ring-0"
              aria-label="Название списка"
              @keydown.enter="saveListName(list.id)"
              @keydown.escape="cancelEditListName"
              @blur="saveListName(list.id)"
            />
            <h3
              v-else
              class="text-lg font-semibold text-foreground truncate cursor-pointer hover:text-primary transition-colors"
              @click="startEditListName(list)"
            >
              {{ list.name }}
            </h3>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8"
              title="Переименовать"
              aria-label="Переименовать список"
              @click="startEditListName(list)"
            >
              <Pencil class="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 text-destructive hover:text-destructive"
              title="Удалить список"
              aria-label="Удалить список"
              @click="deleteList(list.id)"
            >
              <Trash2 class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Добавить пункт -->
        <div class="flex gap-2 mb-4">
          <Input
            :model-value="getNewItemText(list.id)"
            placeholder="Добавить пункт..."
            class="flex-1"
            aria-label="Текст нового пункта"
            @update:model-value="(val: string) => setNewItemText(list.id, val)"
            @keydown.enter.prevent="addItem(list.id)"
          />
          <Button size="sm" :disabled="!getNewItemText(list.id).trim()" @click="addItem(list.id)">
            <Plus class="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>

        <!-- Пункты -->
        <ul v-if="list.items.length" class="space-y-1" role="list">
          <li
            v-for="item in list.items"
            :key="item.id"
            class="flex items-center gap-3 group py-1.5 rounded-md hover:bg-muted/50"
          >
            <input
              :id="`check-${list.id}-${item.id}`"
              type="checkbox"
              :checked="item.checked"
              class="h-4 w-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Отметить выполненным"
              @change="toggleItem(list.id, item.id)"
            />
            <template v-if="editingItemId === item.id">
              <input
                ref="editItemInputRef"
                v-model="editingItemText"
                type="text"
                class="flex-1 min-w-0 rounded-md border border-input bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Редактировать текст"
                @keydown.enter="saveItemEdit(list.id)"
                @keydown.escape="cancelEditItem"
                @blur="saveItemEdit(list.id)"
              />
            </template>
            <label
              v-else
              :for="`check-${list.id}-${item.id}`"
              :class="item.checked ? 'line-through text-muted-foreground' : 'text-foreground'"
              class="flex-1 min-w-0 cursor-pointer select-none truncate"
              @dblclick="startEditItem(list.id, item)"
            >
              {{ item.text }}
            </label>
            <Button
              variant="ghost"
              size="icon"
              class="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0 text-muted-foreground hover:text-destructive"
              title="Удалить пункт"
              :aria-label="`Удалить пункт: ${item.text}`"
              @click="deleteItem(list.id, item.id)"
            >
              <X class="w-3.5 h-3.5" />
            </Button>
          </li>
        </ul>
        <p v-else class="text-sm text-muted-foreground py-2">Пока пусто. Добавьте первый пункт выше.</p>

        <!-- Прогресс и действия -->
        <div v-if="list.items.length" class="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs text-muted-foreground">
            {{ list.items.filter(i => i.checked).length }} / {{ list.items.length }}
          </span>
          <Button
            v-if="list.items.some(i => i.checked)"
            size="sm"
            variant="ghost"
            class="text-muted-foreground h-8"
            @click="uncheckAll(list.id)"
          >
            Снять все галочки
          </Button>
        </div>
      </article>
    </div>

    <EmptyState
      v-else
      :icon="ListChecks"
      title="Нет списков"
      description="Создайте первый список выше — например, «Рейд» или «Что нужно для базы»."
    />
  </PageContainer>
</template>

<script setup lang="ts">
import type { Checklist } from '~/types/checklist'
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Plus, Trash2, X, ListChecks, Pencil } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Чек-лист',
  description: 'Списки на рейд и базу: отмечайте вещи и не забудьте ничего важного.'
})

const STORAGE_KEY = 'dayz-checklist'
const lists = ref<Checklist[]>([])
const newListName = ref('')
const newItemText = ref<Record<string, string>>({})
const listSort = ref<'newest' | 'oldest' | 'name'>('newest')
const editingListId = ref<string | null>(null)
const editingListName = ref('')
const editingItemId = ref<string | null>(null)
const editingItemText = ref('')
const editingItemListId = ref<string | null>(null)
const editListInputRef = ref<HTMLInputElement | null>(null)
const editItemInputRef = ref<HTMLInputElement | null>(null)

function uid () {
  return crypto.randomUUID?.() ?? String(Date.now() + Math.random())
}

function load () {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      lists.value = raw ? JSON.parse(raw) : []
    } catch {
      lists.value = []
    }
  }
}

function save () {
  if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(lists.value))
}

watch(lists, () => save(), { deep: true })

const sortedLists = computed(() => {
  const list = [...lists.value]
  if (listSort.value === 'newest') {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (listSort.value === 'oldest') {
    list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  } else {
    list.sort((a, b) => a.name.localeCompare(b.name))
  }
  return list
})

function getNewItemText (listId: string) {
  return newItemText.value[listId] ?? ''
}

function setNewItemText (listId: string, val: string) {
  newItemText.value = { ...newItemText.value, [listId]: val }
}

function addList () {
  const name = newListName.value.trim()
  if (!name) return
  lists.value = [
    { id: uid(), name, items: [], createdAt: new Date().toISOString() },
    ...lists.value
  ]
  newListName.value = ''
}

function deleteList (listId: string) {
  if (!confirm('Удалить этот список?')) return
  lists.value = lists.value.filter(l => l.id !== listId)
}

function startEditListName (list: Checklist) {
  editingListId.value = list.id
  editingListName.value = list.name
  nextTick(() => editListInputRef.value?.focus())
}

function cancelEditListName () {
  editingListId.value = null
}

function saveListName (listId: string) {
  const name = editingListName.value.trim()
  if (name) {
    const list = lists.value.find(l => l.id === listId)
    if (list) list.name = name
  }
  editingListId.value = null
}

function addItem (listId: string) {
  const list = lists.value.find(l => l.id === listId)
  const text = getNewItemText(listId).trim()
  if (!list || !text) return
  list.items.push({ id: uid(), text, checked: false })
  setNewItemText(listId, '')
}

function toggleItem (listId: string, itemId: string) {
  const list = lists.value.find(l => l.id === listId)
  const item = list?.items.find(i => i.id === itemId)
  if (item) item.checked = !item.checked
}

function deleteItem (listId: string, itemId: string) {
  const list = lists.value.find(l => l.id === listId)
  if (!list) return
  list.items = list.items.filter(i => i.id !== itemId)
}

function uncheckAll (listId: string) {
  const list = lists.value.find(l => l.id === listId)
  if (list) list.items.forEach(i => { i.checked = false })
}

function startEditItem (listId: string, item: { id: string; text: string }) {
  editingItemListId.value = listId
  editingItemId.value = item.id
  editingItemText.value = item.text
  nextTick(() => editItemInputRef.value?.focus())
}

function cancelEditItem () {
  editingItemId.value = null
  editingItemListId.value = null
}

function saveItemEdit (listId: string) {
  const text = editingItemText.value.trim()
  const list = lists.value.find(l => l.id === listId)
  const item = list?.items.find(i => i.id === editingItemId.value)
  if (item && text) item.text = text
  editingItemId.value = null
  editingItemListId.value = null
}

function exportTxt () {
  const lines = lists.value.map(list => {
    const header = `${list.name}\n${'─'.repeat(list.name.length)}`
    const items = list.items.map(i => (i.checked ? '[x] ' : '[ ] ') + i.text)
    return `${header}\n${items.join('\n')}`
  })
  const blob = new Blob([lines.join('\n\n')], { type: 'text/plain' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'dayz-checklist.txt'
  a.click()
}

function exportJson () {
  const data = JSON.stringify(lists.value, null, 2)
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
  a.download = 'dayz-checklist.json'
  a.click()
}

onMounted(load)
</script>

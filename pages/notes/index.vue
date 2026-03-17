<template>
  <PageContainer>
    <PageHeader
      title="Заметки"
      description="Координаты, коды, IP серверов — сохраняйте и копируйте в буфер одним кликом. Всё хранится только у вас в браузере."
      back-to="/"
      back-label="На главную"
    />

    <!-- Форма добавления -->
    <section class="rounded-xl border border-border bg-card p-5 dark:border-primary/20 mb-6" aria-labelledby="new-note-title">
      <h2 id="new-note-title" class="text-lg font-semibold text-foreground mb-1">Новая заметка</h2>
      <p class="text-sm text-muted-foreground mb-4">Заголовок и текст — например, координаты или код от двери</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <Label for="new-title" class="text-muted-foreground text-sm">Заголовок</Label>
          <Input
            id="new-title"
            v-model="newTitle"
            placeholder="Например: База, Код от гаража"
            class="mt-1.5"
          />
        </div>
      </div>
      <div class="mt-4">
        <Label for="new-content" class="text-muted-foreground text-sm">Текст</Label>
        <textarea
          id="new-content"
          v-model="newContent"
          placeholder="Координаты, код, IP сервера, заметка..."
          rows="3"
          class="mt-1.5 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
        />
      </div>
      <Button class="mt-4" :disabled="!newContent.trim()" @click="addNote">
        <Plus class="w-4 h-4 mr-2" aria-hidden="true" />
        Добавить
      </Button>
    </section>

    <!-- Панель: поиск, сортировка, экспорт -->
    <div v-if="notes.length" class="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div class="flex-1 min-w-0">
        <Label for="search-notes" class="sr-only">Поиск по заметкам</Label>
        <Input
          id="search-notes"
          v-model="searchQuery"
          placeholder="Поиск по заголовку и тексту..."
          class="max-w-md"
        />
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <Label for="sort-notes" class="text-sm text-muted-foreground">Сортировка</Label>
        <Select v-model="sortOrder">
          <SelectTrigger id="sort-notes" class="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Сначала новые</SelectItem>
            <SelectItem value="oldest">Сначала старые</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" @click="exportTxt">TXT</Button>
        <Button size="sm" variant="outline" @click="exportJson">JSON</Button>
      </div>
    </div>

    <!-- Список заметок -->
    <div v-if="notes.length" class="space-y-4">
      <h2 class="text-lg font-semibold text-foreground">
        Мои заметки
        <span class="text-muted-foreground font-normal">({{ sortedNotes.length }}{{ searchQuery ? ` из ${notes.length}` : '' }})</span>
      </h2>

      <div v-if="!sortedNotes.length" class="rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center">
        <p class="text-muted-foreground">По запросу ничего не найдено</p>
        <p class="text-sm text-muted-foreground mt-1">Измените поиск или очистите поле</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article
          v-for="note in sortedNotes"
          :key="note.id"
          class="rounded-xl border border-border bg-card p-4 dark:border-primary/20 group hover:border-primary/30 transition-colors"
        >
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="font-semibold text-foreground break-words pr-8">
              {{ note.title || 'Без названия' }}
              <span v-if="note.pinned" class="ml-1 text-primary" aria-label="Закреплено">📌</span>
            </h3>
            <div class="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                :title="note.pinned ? 'Открепить' : 'Закрепить'"
                :aria-label="note.pinned ? 'Открепить' : 'Закрепить'"
                @click="togglePin(note)"
              >
                <Pin class="w-4 h-4" :class="{ 'text-primary': note.pinned }" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                title="Копировать текст"
                :aria-label="`Копировать заметку ${note.title || 'без названия'}`"
                @click="copyNote(note)"
              >
                <Copy class="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                title="Редактировать"
                aria-label="Редактировать"
                @click="openEdit(note)"
              >
                <Pencil class="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8 text-destructive hover:text-destructive"
                title="Удалить"
                aria-label="Удалить"
                @click="deleteNote(note.id)"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p class="text-sm text-muted-foreground whitespace-pre-wrap break-words font-mono">{{ note.content }}</p>
          <p class="text-xs text-muted-foreground mt-3">
            {{ formatDate(note.createdAt) }}
            <span v-if="note.updatedAt"> · изменено {{ formatDate(note.updatedAt) }}</span>
          </p>
          <span v-if="copyFeedbackId === note.id" class="block text-xs text-primary font-medium mt-1" role="status" aria-live="polite">Скопировано!</span>
        </article>
      </div>
    </div>

    <EmptyState
      v-else
      :icon="StickyNote"
      title="Пока нет заметок"
      description="Добавьте первую выше — координаты, код от двери или IP сервера. Всё хранится в браузере."
    />

    <!-- Редактирование -->
    <Dialog v-model:open="editOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать заметку</DialogTitle>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div>
            <Label for="edit-title" class="text-muted-foreground text-sm">Заголовок</Label>
            <Input id="edit-title" v-model="editForm.title" class="mt-1.5" />
          </div>
          <div>
            <Label for="edit-content" class="text-muted-foreground text-sm">Текст</Label>
            <textarea
              id="edit-content"
              v-model="editForm.content"
              rows="4"
              class="mt-1.5 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="editOpen = false">Отмена</Button>
          <Button @click="saveEdit">Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import type { Note } from '~/types/notes'
import { ref, computed, onMounted } from 'vue'
import { Plus, Copy, Pencil, Trash2, StickyNote, Pin } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { useClipboard } from '@vueuse/core'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Заметки',
  description: 'Сохраняйте координаты, коды и заметки в браузере. Копируйте в игру одним кликом.'
})

const STORAGE_KEY = 'dayz-notes'
const notes = ref<Note[]>([])
const newTitle = ref('')
const newContent = ref('')
const searchQuery = ref('')
const sortOrder = ref<'newest' | 'oldest'>('newest')
const editOpen = ref(false)
const editForm = ref<{ id: string; title: string; content: string }>({ id: '', title: '', content: '' })
const copyFeedbackId = ref<string | null>(null)
const { copy: copyToClipboard } = useClipboard()

function load () {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      notes.value = Array.isArray(parsed) ? parsed : []
    } catch {
      notes.value = []
    }
  }
}

function save () {
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
  }
}

function formatDate (iso: string) {
  return new Date(iso).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })
}

const filteredNotes = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return notes.value
  return notes.value.filter(n =>
    (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q)
  )
})

const sortedNotes = computed(() => {
  const list = [...filteredNotes.value]
  list.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime()
    const timeB = new Date(b.createdAt).getTime()
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return sortOrder.value === 'newest' ? timeB - timeA : timeA - timeB
  })
  return list
})

function addNote () {
  const content = newContent.value.trim()
  if (!content) return
  const note: Note = {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    title: newTitle.value.trim(),
    content,
    createdAt: new Date().toISOString()
  }
  notes.value = [note, ...notes.value]
  save()
  newTitle.value = ''
  newContent.value = ''
}

async function copyNote (note: Note) {
  await copyToClipboard(note.content)
  copyFeedbackId.value = note.id
  setTimeout(() => { copyFeedbackId.value = null }, 2000)
}

function togglePin (note: Note) {
  note.pinned = !note.pinned
  save()
}

function openEdit (note: Note) {
  editForm.value = { id: note.id, title: note.title, content: note.content }
  editOpen.value = true
}

function saveEdit () {
  const idx = notes.value.findIndex(n => n.id === editForm.value.id)
  if (idx === -1) return
  const now = new Date().toISOString()
  notes.value[idx] = {
    ...notes.value[idx],
    title: editForm.value.title,
    content: editForm.value.content,
    updatedAt: now
  }
  save()
  editOpen.value = false
}

function deleteNote (id: string) {
  if (!confirm('Удалить заметку?')) return
  notes.value = notes.value.filter(n => n.id !== id)
  save()
}

function exportTxt () {
  const lines = sortedNotes.value.map(n => {
    const head = n.title ? `${n.title}\n` : ''
    return `${head}${n.content}\n\n— ${formatDate(n.createdAt)}`
  })
  const blob = new Blob([lines.join('\n---\n\n')], { type: 'text/plain' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'dayz-notes.txt'
  a.click()
}

function exportJson () {
  const data = JSON.stringify(notes.value, null, 2)
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
  a.download = 'dayz-notes.json'
  a.click()
}

onMounted(load)
</script>

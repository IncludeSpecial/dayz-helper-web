<template>

  <div class="container mx-auto px-4 py-12">
  <div class="max-w-2xl mx-auto text-center">
    <Badge variant="outline" class="text-sm px-4 py-1">🔑 Генератор паролей</Badge>
    <h1 class="text-4xl font-bold mt-4">Сгенерирует случайные пароли</h1>
    <p class="text-gray-500 dark:text-gray-400 mt-2">
      Выберите разрядность и количество, чтобы сгенерировать его для ваших нужд.
    </p>
  </div>
  <div class="flex items-start justify-center p-4">
    <Card class="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle class="text-center">Генератор паролей для DayZ</CardTitle>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <Button type="submit" class="md:col-span-3">
            <Sparkles class="w-4 h-4 mr-2" />
            Сгенерировать
          </Button>

          <!-- Вывод ошибок -->
          <FormMessage v-if="errors.length" class="md:col-span-3 text-destructive">
            <div v-for="error in errors" :key="error">{{ error }}</div>
          </FormMessage>
        </form>

        <!-- Результаты -->
        <div v-if="showResults" class="space-y-6">
          <h3 class="text-xl font-semibold">Сгенерированные пароли</h3>

          <!-- Таблица с паролями с горизонтальной прокруткой на узких экранах -->
          <div class="overflow-x-auto">
            <Table class="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>№</TableHead>
                  <TableHead>Пароль</TableHead>
                  <TableHead>Источник</TableHead>
                  <TableHead class="min-w-[200px] md:min-w-[300px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(item, index) in passwords" :key="index">
                  <TableCell>{{ index + 1 }}</TableCell>
                  <TableCell class="font-mono font-medium">{{ item.password }}</TableCell>
                  <TableCell>{{ item.source || 'Не указано' }}</TableCell>
                  <TableCell>
                    <div class="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" @click="editPassword(index)">
                        <Pencil class="w-4 h-4 mr-2" />
                        Редактировать
                      </Button>
                      <Button size="sm" @click="copyToClipboard(item.password)">
                        <Copy class="w-4 h-4 mr-2" />
                        Копировать
                      </Button>
                      <Button variant="destructive" size="sm" @click="deletePassword(index)">
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
          <div class="flex flex-col sm:flex-row gap-4">
            <Button as-child variant="secondary">
              <a
                  :href="downloadLink.href"
                  :download="downloadLink.download"
              >
                <Download class="w-4 h-4 mr-2" />
                Скачать пароли
              </a>
            </Button>
            <Button variant="destructive" @click="clearPasswords">
              <X class="w-4 h-4 mr-2" />
              Очистить пароли
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

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
const passwords = ref<Array<{ password: string; source: string }>>([])
const showResults = ref(false)
const errors = ref<string[]>([])
const showEditModal = ref(false)
const editIndex = ref<number | null>(null)
const editForm = ref<{ password: string; source: string }>({
  password: '',
  source: ''
})

// Загрузка сохранённых паролей
onMounted(() => {
  const saved = localStorage.getItem('dayz-passwords')
  if (saved) {
    passwords.value = JSON.parse(saved)
    showResults.value = true
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
  source.value = ''
}

// Копирование в буфер обмена
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('Пароль скопирован!')
  } catch (err) {
    console.error('Ошибка копирования:', err)
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

// Редактирование пароля
const editPassword = (index: number) => {
  editIndex.value = index
  editForm.value = { ...passwords.value[index] }
  showEditModal.value = true
}

const saveEdit = () => {
  if (editIndex.value !== null) {
    passwords.value[editIndex.value] = { ...editForm.value }
    localStorage.setItem('dayz-passwords', JSON.stringify(passwords.value))
    showEditModal.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editIndex.value = null
}
</script>

<template>
  <AppHeader />
  <main class="container mx-auto px-4 py-12">
    <!-- Централизованный информационный блок -->
    <div class="max-w-2xl mx-auto text-center mb-8">
      <Badge variant="outline" class="text-sm px-4 py-1">📜 История паролей</Badge>
      <h1 class="text-4xl font-bold mt-4">История использования</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        Здесь отображаются пароли, созданные за последние 30 дней.
      </p>
    </div>

    <!-- Контент истории -->
    <div v-if="passwords && passwords.length">
      <Card class="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>История паролей</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <Table class="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>№</TableHead>
                  <TableHead>Пароль</TableHead>
                  <TableHead>Источник</TableHead>
                  <TableHead>Дата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(item, index) in passwords" :key="index">
                  <TableCell>{{ index + 1 }}</TableCell>
                  <TableCell class="font-mono">{{ item.password }}</TableCell>
                  <TableCell>{{ item.source || 'Без источника' }}</TableCell>
                  <TableCell>{{ formatDate(item.date) }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" @click="clearHistory">
            Очистить историю
          </Button>
        </CardFooter>
      </Card>
    </div>
    <div v-else class="text-center min-h-[60vh] text-gray-500">
      История пуста.
    </div>
  </main>
  <AppFooter />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '~/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'

const passwords = ref<Array<{ password: string; source: string; date: string }>>([])

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem('dayz-passwords-history') || '[]')
  const now = new Date()
  // Фильтруем пароли, оставляя только те, что моложе 30 дней
  const filteredPasswords = saved.filter(item => {
    const passwordDate = new Date(item.date)
    const diffInDays = (now.getTime() - passwordDate.getTime()) / (1000 * 60 * 60 * 24)
    return diffInDays <= 30
  })
  passwords.value = filteredPasswords
  // Обновляем localStorage без старых записей
  localStorage.setItem('dayz-passwords-history', JSON.stringify(filteredPasswords))
})

// Форматирование даты
const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString()

// Очистка истории
const clearHistory = () => {
  if (confirm('Вы уверены, что хотите очистить всю историю?')) {
    passwords.value = []
    localStorage.removeItem('dayz-passwords-history')
  }
}
</script>

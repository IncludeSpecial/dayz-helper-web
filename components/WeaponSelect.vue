<template>
  <Select v-model="selectedWeapon" :id="id" required>
    <SelectTrigger>
      <SelectValue placeholder="Выберите оружие..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="weapon in weapons" :key="weapon.name" :value="weapon.name">
        {{ weapon.name }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'
import type { Weapon } from '~/types/weapon'

const props = defineProps<{
  id: string
  modelValue: string
  weapons: Weapon[]
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const selectedWeapon = ref(props.modelValue || '')

watch(() => props.modelValue, (newVal) => {
  selectedWeapon.value = newVal || ''
}, { immediate: true })

watch(selectedWeapon, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>
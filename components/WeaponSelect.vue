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
import { ref, watch } from 'vue';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select';

defineProps<{
  id: string;
  modelValue: string;
  weapons: Weapon[];
}>();

const emit = defineEmits(['update:modelValue']);
const selectedWeapon = ref('');

watch(selectedWeapon, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>
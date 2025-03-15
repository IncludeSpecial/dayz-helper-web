<template>
  <div class="progress-bar">
    <div class="progress-bar-inner" :style="{ width: `${value}%` }"></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0 && value <= 100
  }
})
</script>

<style scoped>
.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-inner {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}
</style>
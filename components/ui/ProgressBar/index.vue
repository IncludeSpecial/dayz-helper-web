<template>
  <div class="progress-bar">
    <div class="progress-bar-inner" :style="{ width: `${value}%` }"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
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
  background: hsl(var(--muted));
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-inner {
  height: 100%;
  background: hsl(var(--primary));
  transition: width 0.3s ease;
}

.dark .progress-bar-inner {
  box-shadow: 0 0 12px hsl(var(--primary) / 0.5);
}
</style>

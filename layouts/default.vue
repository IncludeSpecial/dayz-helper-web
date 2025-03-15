<template>


    <AppHeader/>

  <main class="pb-16">
    <SpeedInsights />

    <slot/>
  </main>

    <AppFooter/>


</template>
<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { inject } from '@vercel/analytics'
</script>

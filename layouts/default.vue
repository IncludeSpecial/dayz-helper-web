<template>


    <AppHeader/>

  <main class="pb-16">
    <SpeedInsights />
<Analytics/>
    <slot/>
  </main>

    <AppFooter/>


</template>
<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { Analytics } from '@vercel/analytics/nuxt'
import { inject } from '@vercel/analytics'
</script>

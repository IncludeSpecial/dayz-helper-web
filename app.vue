<template>
<NuxtLoadingIndicator/>

  <NuxtLayout>
<Analytics/>
    <NuxtPage />
  </NuxtLayout>

</template>
<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt';
import { inject } from '@vercel/analytics'
inject()
</script>
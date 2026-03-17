<template>
  <div class="min-h-screen flex flex-col bg-background">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      Перейти к содержимому
    </a>
    <AppHeader />
    <main id="main-content" class="flex-1 w-full pb-16 md:pb-12 pt-0" tabindex="-1">
      <slot />
    </main>
    <AppFooter />
    <BackToTop />
  </div>
</template>
<script setup lang="ts">

</script>

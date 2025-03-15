<template>
  <footer class="fixed bottom-0 left-0 z-20 w-full py-1 bg-neutral-100 border-t border-neutral-200 shadow-sm md:flex md:items-center md:justify-between md:p-6 dark:bg-neutral-900 dark:border-neutral-600">
    <Index>
      <div class="flex flex-col md:flex-row items-center justify-between gap-4  px-4">
        <!-- Авторские права -->
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <span>© {{ new Date().getFullYear() }} DayZ Helper | IncludeSpecial | Team</span>
        </div>
        <!-- Навигация -->
        <nav class="flex flex-wrap gap-4 mt-2 md:mt-0">
          <Button variant="link" size="sm" as-child>
            <a
                href="https://github.com/IncludeSpecial/dayz-helper-web"
                target="_blank"
                rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
          <Button variant="link" size="sm" as-child>
            <a
                href="https://discord.gg/Ykfhf46sxB"
                target="_blank"
                rel="noopener noreferrer"
            >
              Discord
            </a>
          </Button>
<!--          <Button variant="link" size="sm" as-child>
            <a
                href="/docs"
            >
              Документация
            </a>
          </Button>
          <Button variant="link" size="sm" as-child>
            <a
                href="/team"
            >
              Команда
            </a>
          </Button>-->
        </nav>
      </div>
    </Index>
  </footer>
</template>

<script setup lang="ts">

import { Button } from '@/components/ui/button'
import Index from '~/components/ui/container/index.vue'
</script>

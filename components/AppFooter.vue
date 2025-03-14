<template>
  <footer class="border-t  bottom-0 z-40 w-full bg-white dark:bg-neutral-950 p-4 shadow-md">
    <Container>
      <div class="flex flex-col md:flex-row items-center justify-between h-16 px-4">
        <!-- Авторские права -->
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <LockKeyhole class="w-4 h-4" />
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
    </Container>
  </footer>
</template>

<script setup lang="ts">
import { LockKeyhole } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import Container from '@/components/ui/container/Container.vue'
</script>

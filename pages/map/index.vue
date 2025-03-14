<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <main class="container mx-auto px-4 py-12">
      <!-- Информационный блок -->
      <div class="max-w-2xl mx-auto text-center mb-8">
        <Badge variant="outline" class="text-sm px-4 py-1">
          🗺️ Интерактивная карта
        </Badge>
        <h1 class="text-4xl font-bold mt-4">Куда бежим?</h1>
      </div>
      <!-- Карточка с картой -->
      <div class="flex items-center justify-center p-4">
        <Card class="w-full  shadow-lg">
          <div class="h-[65vh] rounded-lg overflow-hidden">
            <iframe
                src="https://dayz.xam.nu/"
                frameborder="0"
                class="w-full h-full"
            ></iframe>
          </div>
        </Card>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<template>
  <AppHeader />
  <main class="container mx-auto px-4 py-12">
    <!-- Центральный информационный блок -->
    <div class="max-w-2xl mx-auto text-center mb-8">
      <Badge variant="outline" class="text-sm px-4 py-1">⚔️ Калькулятор рейда</Badge>
      <h1 class="text-4xl font-bold mt-4">Расчет необходимых выстрелов</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        Выберите оружие, тип стены и укажите коэффициент здоровья для расчета количества выстрелов.
      </p>
    </div>

    <!-- Контейнер с карточкой калькулятора -->
    <div class="flex items-start justify-center p-4">
      <Card class="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle class="text-center">Калькулятор рейда</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="calculateRaid" class="space-y-6">
            <!-- Выбор оружия и типа стены -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="weapon">Выберите оружие:</Label>
                <Select v-model="selectedWeapon" id="weapon">
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите оружие..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                        v-for="weapon in weapons"
                        :key="weapon.name"
                        :value="weapon.name"
                    >
                      {{ weapon.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label for="wall_type">Тип стены:</Label>
                <Select v-model="wallType" id="wall_type">
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип стены" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wooden">Деревянная</SelectItem>
                    <SelectItem value="metal">Металлическая</SelectItem>
                    <SelectItem value="frame">Каркас</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <!-- Коэффициент здоровья -->
            <div>
              <Label for="health_multiplier">Коэффициент здоровья:</Label>
              <Input
                  id="health_multiplier"
                  type="number"
                  step="0.01"
                  min="1"
                  v-model.number="healthMultiplier"
                  required
              />
            </div>

            <!-- Кнопка расчета -->
            <Button type="submit">
              Рассчитать
            </Button>
          </form>

          <!-- Результат расчета -->
          <div v-if="resultVisible" class="mt-8">
            <Card variant="outline">
              <CardHeader>
                <CardTitle>Результат расчета</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Оружие:</strong> {{ selectedWeapon }}
                </p>
                <p>
                  <strong>Тип стены:</strong> {{ wallTypeText }}
                </p>
                <p>
                  <strong>Коэффициент здоровья:</strong> {{ healthMultiplier }}
                </p>
                <p>
                  <strong>Необходимое количество выстрелов:</strong>
                  {{ shotsNeeded }}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
  <AppFooter />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardContent, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'

interface Weapon {
  name: string;
  damage: number;
}

const weapons = ref<Weapon[]>([
  { name: "12 калибр (Дробь) (BK-12, BK-133, BK-43, Vaiga)", damage: 280 },
  { name: "7.62x54 мм (ВСД, Мосина, ВС-89)", damage: 145 },
  { name: ".308 Win (LAR, DMR, CR-550 Savanna, M70 Tundra, Blaze, Longhorn)", damage: 142 },
  { name: "Арбалет", damage: 125 },
  { name: "5.45x39 мм (KA-74, KA-74U, SSG 82)", damage: 114 },
  { name: "12 калибр (Пуля) (BK-12, BK-133, BK-43, Vaiga)", damage: 110 },
  { name: "5.56x45 мм (AUR A1, AUR AX, KA-101, LE-MAS, M16-A2, M4-A1, Pioneer)", damage: 106 },
  { name: "7.62x39 мм (KA-M, CR-527, SKS, BK-18)", damage: 90 },
  { name: "9x39 мм (SVAL, Vikhr, VSS)", damage: 75 },
  { name: ".357 (Deagle, Derringer, Revolver, Repeater)", damage: 58 },
  { name: "9x19 мм (SG5-K, Mlock-91, CR-75, P1)", damage: 39 },
  { name: ".45 ACP (USG-45, Kolt 1911, FX-45)", damage: 37 },
  { name: ".380 ACP (IJ-70, Bizon, CR-61 Skorpion)", damage: 35 },
  { name: "22 LR (MK II, Sporter)", damage: 20 }
]);

const selectedWeapon = ref<string>("")
const wallType = ref<string>("wooden")
const healthMultiplier = ref<number>(1)
const shotsNeeded = ref<number>(0)
const resultVisible = ref<boolean>(false)

const wallTypeText = computed(() => {
  switch (wallType.value) {
    case "wooden":
      return "Деревянная"
    case "metal":
      return "Металлическая"
    case "frame":
      return "Каркас"
    default:
      return ""
  }
})

const calculateRaid = () => {
  const weapon = weapons.value.find(w => w.name === selectedWeapon.value)
  if (!weapon) {
    alert("Оружие не найдено")
    return
  }
  const baseWallHealthMap: Record<string, number> = {
    wooden: 16000,
    metal: 21000,
    frame: 12000
  }
  const baseWallHealth = baseWallHealthMap[wallType.value]
  const wallHealth = baseWallHealth * healthMultiplier.value
  shotsNeeded.value = Math.max(1, Math.ceil(wallHealth / weapon.damage))
  resultVisible.value = true
}
</script>

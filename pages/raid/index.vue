<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Заголовок страницы -->
    <div class="max-w-2xl mx-auto text-center mb-12">
      <Badge variant="outline" class="text-sm px-4 py-1">⚔️ Калькулятор рейда</Badge>
      <h1 class="text-4xl font-bold mt-4">Расчет необходимых выстрелов</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        Используйте формы ниже для расчета рейда с одним или несколькими типами патронов.
      </p>
    </div>

    <!-- Первая форма: Расчет для одного типа патронов -->
    <Card class="w-full max-w-4xl mx-auto mb-12 shadow-lg">
      <CardHeader>
        <CardTitle class="text-center">Расчет для одного типа патронов</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="calculateSingleRaid" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="single_weapon">Выберите оружие:</Label>
              <WeaponSelect v-model="singleSelectedWeapon" :weapons="weapons" id="single_weapon" />
            </div>
            <div>
              <Label for="single_wall_type">Тип стены:</Label>
              <Select v-model="singleWallType" id="single_wall_type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип стены" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="(wall, key) in wallTypes" :key="key" :value="key">
                    {{ wall.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label for="single_health_multiplier">Коэффициент здоровья:</Label>
            <Input
                id="single_health_multiplier"
                type="number"
                step="0.01"
                min="1"
                v-model.number="singleHealthMultiplier"
                required
            />
          </div>
          <Button type="submit" class="w-full">Рассчитать</Button>
        </form>

        <!-- Результат расчета -->
        <div v-if="singleResultVisible" class="mt-8">
          <Card variant="outline" class="bg-gray-50 dark:bg-neutral-900">
            <CardHeader>
              <CardTitle class="text-lg">Результат</CardTitle>
            </CardHeader>
            <CardContent class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-neutral-600 dark:text-gray-300">Оружие:</p>
                <p class="font-semibold">{{ singleSelectedWeapon }}</p>
              </div>
              <div>
                <p class="text-sm text-neutral-600 dark:text-gray-300">Тип стены:</p>
                <p class="font-semibold">{{ singleWallTypeText }}</p>
              </div>
              <div>
                <p class="text-sm text-neutral-600 dark:text-gray-300">Коэффициент здоровья:</p>
                <p class="font-semibold">{{ singleHealthMultiplier }}</p>
              </div>
              <div>
                <p class="text-sm text-neutral-600 dark:text-gray-300">Выстрелов нужно:</p>
                <p class="font-semibold text-xl text-blue-600 dark:text-blue-400">{{ singleShotsNeeded }}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>

    <!-- Вторая форма: Расчет для нескольких типов патронов -->
    <Card class="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle class="text-center">Расчет для нескольких типов патронов</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="calculateMultiRaid" class="space-y-6">
          <div class="space-y-4">
            <div v-for="(ammo, index) in multiAmmoList" :key="index" class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label :for="'multi_weapon_' + index">Выберите оружие:</Label>
                <WeaponSelect v-model="ammo.weapon" :weapons="weapons" :id="'multi_weapon_' + index" />
              </div>
              <div>
                <Label :for="'ammo_count_' + index">Количество патронов:</Label>
                <Input
                    :id="'ammo_count_' + index"
                    type="number"
                    min="1"
                    v-model.number="ammo.count"
                    required
                />
              </div>
              <div class="flex items-end">
                <Button type="button" variant="destructive" @click="removeAmmo(index)" :disabled="multiAmmoList.length === 1">Удалить</Button>
              </div>
            </div>
            <Button type="button" variant="outline" @click="addAmmo" class="w-full">Добавить тип патронов</Button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="multi_wall_type">Тип стены:</Label>
              <Select v-model="multiWallType" id="multi_wall_type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип стены" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="(wall, key) in wallTypes" :key="key" :value="key">
                    {{ wall.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="multi_health_multiplier">Коэффициент здоровья:</Label>
              <Input
                  id="multi_health_multiplier"
                  type="number"
                  step="0.01"
                  min="1"
                  v-model.number="multiHealthMultiplier"
                  required
              />
            </div>
          </div>
          <Button type="submit" class="w-full">Рассчитать</Button>
        </form>

        <!-- Результат расчета -->
        <div v-if="multiResultVisible" class="mt-8">
          <Card variant="outline" class="bg-gray-50 dark:bg-neutral-900">
            <CardHeader>
              <CardTitle class="text-lg">Результат</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Основные данные -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-neutral-600 dark:text-gray-300">Тип стены:</p>
                  <p class="font-semibold">{{ multiWallTypeText }}</p>
                </div>
                <div>
                  <p class="text-sm text-neutral-600 dark:text-gray-300">Коэффициент здоровья:</p>
                  <p class="font-semibold">{{ multiHealthMultiplier }}</p>
                </div>
                <div>
                  <p class="text-sm text-neutral-600 dark:text-gray-300">Общий урон:</p>
                  <p class="font-semibold">{{ multiTotalDamage }}</p>
                </div>
                <div>
                  <p class="text-sm text-neutral-600 dark:text-gray-300">Здоровье стены:</p>
                  <p class="font-semibold">{{ multiWallHealth }}</p>
                </div>
              </div>

              <!-- Итог -->
              <p class="text-center font-semibold text-green-600 dark:text-green-400" v-if="multiTotalDamage >= multiWallHealth">
                Патронов достаточно для разрушения стены
              </p>
              <p class="text-center font-semibold text-red-600 dark:text-red-400" v-else>
                Патронов недостаточно для разрушения стены
              </p>

              <!-- Прогресс для каждой стены -->
              <div v-if="multiFullWallsDestroyed > 0 || multiRemainingDamage > 0" class="border-t pt-4">
                <h3 class="font-semibold mb-4">Прогресс разрушения стен</h3>
                <div class="space-y-4">
                  <!-- Полностью разрушенные стены -->
                  <div v-for="wall in multiFullWallsDestroyed" :key="'full-' + wall">
                    <p>Стена {{ wall }}: 100%</p>
                    <Index :value="100" class="mt-2" />
                  </div>
                  <!-- Частично разрушенная стена -->
                  <div v-if="multiRemainingDamage > 0">
                    <p>Стена {{ multiFullWallsDestroyed + 1 }}: {{ ((multiRemainingDamage / multiWallHealth) * 100).toFixed(2) }}%</p>
                    <Index :value="((multiRemainingDamage / multiWallHealth) * 100)" class="mt-2" />
                  </div>
                </div>
              </div>

              <!-- Дополнительный урон -->
              <div v-if="multiAdditionalDamageNeeded > 0" class="border-t pt-4">
                <p class="font-semibold text-red-600 dark:text-red-400">Дополнительный урон требуется: {{ multiAdditionalDamageNeeded }}</p>
                <p class="mt-2">Дополнительные патроны нужны:</p>
                <ul class="list-disc pl-5">
                  <li v-for="(ammo, index) in multiAmmoList" :key="index">
                    {{ ammo.weapon }}: {{ Math.ceil(multiAdditionalDamageNeeded / getWeaponDamage(ammo.weapon)) }}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card, CardHeader, CardContent, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select';
import { Badge } from '~/components/ui/badge';
import Index from '~/components/ui/ProgressBar/index.vue';
import WeaponSelect from '~/components/WeaponSelect.vue';

// Интерфейсы
interface Weapon {
  name: string;
  damage: number;
}

interface Ammo {
  weapon: string;
  count: number;
}

// Типы стен
const wallTypes = {
  wooden: { name: 'Деревянная', health: 16000 },
  frameWooden: { name: 'Каркас + Деревянная', health: 28000 },
  metal: { name: 'Металлическая', health: 21000 },
  frameMetal: { name: 'Каркас + Металлическая', health: 33000 },
  frame: { name: 'Каркас', health: 12000 }
};

// Список оружия
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

// Переменные для первой формы
const singleSelectedWeapon = ref<string>('');
const singleWallType = ref<string>('wooden');
const singleHealthMultiplier = ref<number>(1);
const singleShotsNeeded = ref<number>(0);
const singleResultVisible = ref<boolean>(false);

// Переменные для второй формы
const multiAmmoList = ref<Ammo[]>([{ weapon: '', count: 1 }]);
const multiWallType = ref<string>('wooden');
const multiHealthMultiplier = ref<number>(1);
const multiTotalDamage = ref<number>(0);
const multiWallHealth = ref<number>(0);
const multiAdditionalDamageNeeded = ref<number>(0);
const multiFullWallsDestroyed = ref<number>(0);
const multiRemainingDamage = ref<number>(0);
const multiResultVisible = ref<boolean>(false);

// Computed свойства
const singleWallTypeText = computed(() => wallTypes[singleWallType.value].name);
const multiWallTypeText = computed(() => wallTypes[multiWallType.value].name);

// Функции
const addAmmo = () => {
  multiAmmoList.value.push({ weapon: '', count: 1 });
};

const removeAmmo = (index: number) => {
  if (multiAmmoList.value.length > 1) {
    multiAmmoList.value.splice(index, 1);
  }
};

const getWeaponDamage = (weaponName: string) => {
  const weapon = weapons.value.find(w => w.name === weaponName);
  return weapon ? weapon.damage : 0;
};

const calculateSingleRaid = () => {
  if (!singleSelectedWeapon.value || !singleWallType.value || singleHealthMultiplier.value < 1) {
    alert('Пожалуйста, заполните все поля корректно');
    return;
  }
  const weapon = weapons.value.find(w => w.name === singleSelectedWeapon.value);
  if (!weapon) return;
  const wallHealth = wallTypes[singleWallType.value].health * singleHealthMultiplier.value;
  singleShotsNeeded.value = Math.ceil(wallHealth / weapon.damage);
  singleResultVisible.value = true;
};

const calculateMultiRaid = () => {
  if (!multiWallType.value || multiHealthMultiplier.value < 1 || multiAmmoList.value.some(ammo => !ammo.weapon || ammo.count < 1)) {
    alert('Пожалуйста, заполните все поля корректно');
    return;
  }
  multiWallHealth.value = wallTypes[multiWallType.value].health * multiHealthMultiplier.value;
  multiTotalDamage.value = multiAmmoList.value.reduce((total, ammo) => {
    const weapon = weapons.value.find(w => w.name === ammo.weapon);
    return weapon ? total + weapon.damage * ammo.count : total;
  }, 0);
  multiFullWallsDestroyed.value = Math.floor(multiTotalDamage.value / multiWallHealth.value);
  multiRemainingDamage.value = multiTotalDamage.value % multiWallHealth.value;
  multiAdditionalDamageNeeded.value = multiWallHealth.value > multiTotalDamage.value
      ? multiWallHealth.value - multiTotalDamage.value
      : 0;
  multiResultVisible.value = true;
};
</script>
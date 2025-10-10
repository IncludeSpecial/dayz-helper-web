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

    <!-- Переключатель режимов -->
    <div class="max-w-4xl mx-auto mb-6 flex items-center justify-center">
      <div class="inline-flex rounded-full border border-neutral-200 dark:border-neutral-800 p-1 bg-white/70 dark:bg-neutral-900/60 backdrop-blur">
        <Button size="sm" :variant="activeTab==='single' ? 'default' : 'ghost'" class="rounded-full" @click="activeTab='single'">Одиночный</Button>
        <Button size="sm" :variant="activeTab==='multi' ? 'default' : 'ghost'" class="rounded-full" @click="activeTab='multi'">Несколько</Button>
      </div>
    </div>

    <!-- SINGLE: расчёт для одного типа патронов -->
    <Card v-if="activeTab==='single'" class="w-full max-w-4xl mx-auto mb-12 shadow-lg border border-neutral-200 dark:border-neutral-800 rounded-xl">
      <CardHeader class="bg-gradient-to-r from-red-500/10 to-transparent rounded-t-xl">
        <CardTitle class="text-center">Расчет для одного типа патронов</CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Пресеты для одиночного расчета -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Быстрый выбор типа стены</Label>
            <div class="flex flex-wrap gap-2 mt-2">
              <Button v-for="(wall, key) in wallTypes" :key="'single-wall-'+key" size="sm" variant="outline" @click="singleWallType = key">
                {{ wall.name }}
              </Button>
            </div>
          </div>
          <div>
            <Label>Коэффициент здоровья (пресеты)</Label>
            <div class="flex flex-wrap gap-2 mt-2">
              <Button v-for="m in [1,1.25,1.5,2]" :key="'single-m-'+m" size="sm" variant="outline" @click="singleHealthMultiplier = m">x{{ m }}</Button>
            </div>
          </div>
        </div>
        <form @submit.prevent="calculateSingleRaid" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="single_weapon">Выберите оружие:</Label>
              <WeaponSelect v-model="singleSelectedWeapon" :weapons="weapons" id="single_weapon" />
              <div class="mt-2 flex flex-wrap gap-2">
                <Button v-for="w in weaponPresets" :key="'single-'+w.name" size="sm" variant="outline" @click="singleSelectedWeapon = w.name">{{ w.short }}</Button>
              </div>
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
          <div class="flex flex-col sm:flex-row gap-3">
            <Button type="submit" class="w-full sm:w-auto">Рассчитать</Button>
            <Button type="button" variant="outline" class="w-full sm:w-auto" @click="resetSingle">Сбросить</Button>
            <Button type="button" variant="outline" class="w-full sm:w-auto" @click="copySingle" :disabled="!singleResultVisible">Копировать результат</Button>
<!--            <Button type="button" variant="secondary" class="w-full sm:w-auto" @click="exportSinglePlan" :disabled="!singleResultVisible">Экспорт плана</Button>-->
          </div>
          <div v-if="singleErrors.length" class="text-destructive text-sm">
            <div v-for="err in singleErrors" :key="err">{{ err }}</div>
          </div>
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
                 <p class="font-mono font-semibold text-xl text-blue-600 dark:text-blue-400">{{ singleShotsNeeded }}</p>
              </div>
              <div>
                <p class="text-sm text-neutral-600 dark:text-gray-300">Здоровье стены:</p>
                 <p class="font-mono font-semibold">{{ wallTypes[singleWallType].health * singleHealthMultiplier }}</p>
              </div>
              <div>
                <p class="text-sm text-neutral-600 dark:text-gray-300">Урон/пуля:</p>
                 <p class="font-mono font-semibold">{{ getWeaponDamage(singleSelectedWeapon) }}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>

    <!-- Вторая форма: Расчет для нескольких типов патронов -->
    <!-- MULTI: несколько типов патронов -->
    <Card v-if="activeTab==='multi'" class="w-full max-w-4xl mx-auto shadow-lg border border-neutral-200 dark:border-neutral-800 rounded-xl">
      <CardHeader class="bg-gradient-to-r from-red-500/10 to-transparent rounded-t-xl">
        <CardTitle class="text-center">Расчет для нескольких типов патронов</CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Панель действий (минимал) -->
<!--        <div class="mb-4 flex flex-wrap items-center gap-2 text-sm">-->
<!--          <Button size="sm" variant="outline" @click="copyShareLink('multi')">Поделиться планом</Button>-->
<!--          <span v-if="shareCopied" class="text-xs text-green-600 dark:text-green-400">Ссылка скопирована</span>-->
<!--        </div>-->
        <!-- Пресеты планов -->
<!--        <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">-->
<!--          <div class="md:col-span-2 flex items-end gap-2">-->
<!--            <div class="flex-1">-->
<!--              <Label>Название плана</Label>-->
<!--              <Input v-model="planName" placeholder="Например: рейд базы у фермы" />-->
<!--            </div>-->
<!--            <Button variant="outline" @click="savePlan" :disabled="!planName.trim()">Сохранить</Button>-->
<!--          </div>-->
<!--          <div>-->
<!--            <Label>Загрузить план</Label>-->
<!--            <div class="flex items-center gap-2">-->
<!--              <select class="flex-1 border rounded-md px-3 py-2 bg-transparent" v-model="selectedPlanId">-->
<!--                <option :value="''">Не выбрано</option>-->
<!--                <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.name }}</option>-->
<!--              </select>-->
<!--              <Button variant="outline" @click="loadPlan" :disabled="!selectedPlanId">Загрузить</Button>-->
<!--              <Button variant="destructive" @click="deletePlan" :disabled="!selectedPlanId">Удалить</Button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
        <!-- Пресеты для мульти-расчета -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Быстрый выбор типа стены</Label>
            <div class="flex flex-wrap gap-2 mt-2">
              <Button v-for="(wall, key) in wallTypes" :key="'multi-wall-'+key" size="sm" variant="outline" @click="multiWallType = key">
                {{ wall.name }}
              </Button>
            </div>
          </div>
          <div>
            <Label>Коэффициент здоровья (пресеты)</Label>
            <div class="flex flex-wrap gap-2 mt-2">
              <Button v-for="m in [1,1.25,1.5,2]" :key="'multi-m-'+m" size="sm" variant="outline" @click="multiHealthMultiplier = m">x{{ m }}</Button>
            </div>
          </div>
        </div>
        <form @submit.prevent="calculateMultiRaid" class="space-y-6">
          <div class="space-y-4">
            <div v-for="(ammo, index) in multiAmmoList" :key="index" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div class="md:col-span-2">
                <Label :for="'multi_weapon_' + index">Выберите оружие:</Label>
                <WeaponSelect v-model="ammo.weapon" :weapons="weapons" :id="'multi_weapon_' + index" />
                <div class="mt-2 flex flex-wrap gap-2">
                  <Button v-for="w in weaponPresets" :key="w.name+'-'+index" size="sm" variant="outline" @click="ammo.weapon = w.name">{{ w.short }}</Button>
                </div>
              </div>
              <div>
                <Label :for="'ammo_count_' + index">Количество патронов:</Label>
                <div class="flex items-center gap-2">
                  <Button type="button" size="sm" variant="outline" @click="decrementAmmo(index)">-</Button>
                  <Input
                      :id="'ammo_count_' + index"
                      type="number"
                      min="1"
                      v-model.number="ammo.count"
                      required
                      class="w-24 text-center"
                  />
                  <Button type="button" size="sm" variant="outline" @click="incrementAmmo(index)">+</Button>
                </div>
                <div v-if="ammo.weapon" class="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-3">
                  <span>Урон/пуля: {{ getWeaponDamage(ammo.weapon) }}</span>
                  <span>|</span>
                  <span :class="getContributionClass(index)">Сумма: {{ getRowDamage(ammo) }}</span>
                  <span v-if="isMaxContributor(index)" class="inline-flex items-center px-1.5 py-0.5 rounded bg-green-600/10 text-green-600">MAX</span>
                </div>
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
          <div class="flex flex-col sm:flex-row gap-3">
            <Button type="submit" class="w-full sm:w-auto">Рассчитать</Button>
            <Button type="button" variant="outline" class="w-full sm:w-auto" @click="resetMulti">Сбросить</Button>
            <Button type="button" variant="outline" class="w-full sm:w-auto" @click="copyMulti" :disabled="!multiResultVisible">Копировать результат</Button>
<!--            <Button type="button" variant="secondary" class="w-full sm:w-auto" @click="exportPlan">Экспорт плана</Button>-->
          </div>
          <div v-if="multiErrors.length" class="text-destructive text-sm">
            <div v-for="err in multiErrors" :key="err">{{ err }}</div>
          </div>
        </form>

        <!-- Результат расчета -->
        <div v-if="multiResultVisible" class="mt-8">
            <Card variant="outline" class="bg-gray-50 dark:bg-neutral-900 relative">
            <CardHeader>
              <CardTitle class="text-lg">Результат</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Сводка -->
               <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40">
                <div>
                  <p class="text-xs text-neutral-600 dark:text-gray-400">Полностью разрушено стен</p>
                   <p class="font-mono text-xl font-semibold">{{ multiFullWallsDestroyed }}</p>
                </div>
                <div>
                  <p class="text-xs text-neutral-600 dark:text-gray-400">Прогресс следующей стены</p>
                   <p class="font-mono text-xl font-semibold">{{ nextWallProgress }}%</p>
                </div>
                <div>
                  <p class="text-xs text-neutral-600 dark:text-gray-400">Доп. урон требуется</p>
                   <p class="font-mono text-xl font-semibold" :class="multiAdditionalDamageNeeded>0 ? 'text-red-600 dark:text-red-400' : ''">{{ multiAdditionalDamageNeeded }}</p>
                </div>
              </div>
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
                   <p class="font-mono font-semibold">{{ multiTotalDamage }}</p>
                </div>
                <div>
                  <p class="text-sm text-neutral-600 dark:text-gray-300">Здоровье стены:</p>
                   <p class="font-mono font-semibold">{{ multiWallHealth }}</p>
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

               <!-- Sticky actions -->
               <div class="sticky bottom-0 left-0 right-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-t border-neutral-200 dark:border-neutral-800 px-3 py-2 mt-4 flex flex-wrap gap-2 justify-end">
                 <Button size="sm" variant="outline" @click="copyMulti">Копировать</Button>
                 <Button size="sm" variant="outline" @click="exportPlan">Экспорт TXT</Button>
                 <Button size="sm" variant="outline" @click="copyShareLink('multi')">Поделиться</Button>
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
import { useClipboard } from '@vueuse/core'
import { onMounted } from 'vue'
import { useRoute, useRouter } from '#imports'

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

// Пресеты оружия (короткие метки)
const weaponPresets = [
  { name: "12 калибр (Дробь) (BK-12, BK-133, BK-43, Vaiga)", short: "12к дробь" },
  { name: ".308 Win (LAR, DMR, CR-550 Savanna, M70 Tundra, Blaze, Longhorn)", short: ".308" },
  { name: "5.56x45 мм (AUR A1, AUR AX, KA-101, LE-MAS, M16-A2, M4-A1, Pioneer)", short: "5.56" },
  { name: "7.62x39 мм (KA-M, CR-527, SKS, BK-18)", short: "7.62x39" }
]

// Переменные для первой формы
const singleSelectedWeapon = ref<string>('');
const singleWallType = ref<string>('wooden');
const singleHealthMultiplier = ref<number>(1);
const singleShotsNeeded = ref<number>(0);
const singleResultVisible = ref<boolean>(false);
const singleErrors = ref<string[]>([]);

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
const multiErrors = ref<string[]>([]);
const activeTab = ref<'single'|'multi'>('single')
// Планы рейда
const planName = ref('')
const selectedPlanId = ref('')
type RaidPlan = { id: string, name: string, wall: string, mult: number, ammo: Ammo[] }
const plans = ref<RaidPlan[]>([])
const shareCopied = ref(false)
const route = useRoute()
const router = useRouter()

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

// Подсветка вклада
const getRowDamage = (ammo: Ammo) => (getWeaponDamage(ammo.weapon) * (ammo.count || 0))
const isMaxContributor = (index: number) => {
  const damages = multiAmmoList.value.map(getRowDamage)
  const max = Math.max(0, ...damages)
  return damages[index] === max && max > 0
}
const getContributionClass = (index: number) => (isMaxContributor(index) ? 'text-green-600 dark:text-green-400' : 'text-neutral-600 dark:text-gray-400')

const calculateSingleRaid = () => {
  singleErrors.value = []
  if (!singleSelectedWeapon.value) singleErrors.value.push('Выберите оружие')
  if (!singleWallType.value) singleErrors.value.push('Выберите тип стены')
  if (singleHealthMultiplier.value < 1) singleErrors.value.push('Коэффициент здоровья должен быть ≥ 1')
  if (singleErrors.value.length) return
  const weapon = weapons.value.find(w => w.name === singleSelectedWeapon.value);
  if (!weapon) return;
  const wallHealth = wallTypes[singleWallType.value].health * singleHealthMultiplier.value;
  singleShotsNeeded.value = Math.ceil(wallHealth / weapon.damage);
  singleResultVisible.value = true;
  // persist
  localStorage.setItem('raid-single', JSON.stringify({ weapon: singleSelectedWeapon.value, wall: singleWallType.value, mult: singleHealthMultiplier.value }))
};

// Действия single
const resetSingle = () => {
  singleSelectedWeapon.value = ''
  singleWallType.value = 'wooden'
  singleHealthMultiplier.value = 1
  singleShotsNeeded.value = 0
  singleResultVisible.value = false
}
const { copy: copyToClipboardSingle } = useClipboard()
const copySingle = async () => {
  if (!singleResultVisible.value) return
  const text = `Оружие: ${singleSelectedWeapon.value}\nСтена: ${singleWallTypeText.value}\nКоэфф.: ${singleHealthMultiplier.value}\nВыстрелов: ${singleShotsNeeded.value}`
  await copyToClipboardSingle(text)
}
const exportSinglePlan = () => {
  if (!singleResultVisible.value) return
  const wallHp = wallTypes[singleWallType.value].health * singleHealthMultiplier.value
  const dmg = getWeaponDamage(singleSelectedWeapon.value)
  const text = [
    `Оружие: ${singleSelectedWeapon.value}`,
    `Тип стены: ${singleWallTypeText.value}`,
    `Коэффициент: x${singleHealthMultiplier.value}`,
    `Здоровье стены: ${wallHp}`,
    `Урон/пуля: ${dmg}`,
    `Выстрелов нужно: ${singleShotsNeeded.value}`
  ].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
  a.download = 'dayz-raid-single.txt'
  a.click()
}

const calculateMultiRaid = () => {
  multiErrors.value = []
  if (!multiWallType.value) multiErrors.value.push('Выберите тип стены')
  if (multiHealthMultiplier.value < 1) multiErrors.value.push('Коэффициент здоровья должен быть ≥ 1')
  if (multiAmmoList.value.some(ammo => !ammo.weapon)) multiErrors.value.push('Укажите оружие для каждого элемента')
  if (multiAmmoList.value.some(ammo => ammo.count < 1)) multiErrors.value.push('Количество патронов должно быть ≥ 1')
  if (multiErrors.value.length) return
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
  // persist
  localStorage.setItem('raid-multi', JSON.stringify({ ammo: multiAmmoList.value, wall: multiWallType.value, mult: multiHealthMultiplier.value }))
};

// Экспорт плана (мульти) в текст
const exportPlan = () => {
  const lines: string[] = []
  lines.push(`Тип стены: ${multiWallTypeText.value} (HP: ${wallTypes[multiWallType.value].health})`)
  lines.push(`Коэффициент: x${multiHealthMultiplier.value}`)
  lines.push('--- Патроны ---')
  multiAmmoList.value.forEach((a, i) => {
    const dmg = getWeaponDamage(a.weapon)
    lines.push(`${i+1}. ${a.weapon} — ${a.count} шт. (урон/пуля: ${dmg}, суммарно: ${dmg * a.count})`)
  })
  lines.push('--- Итог ---')
  lines.push(`Общий урон: ${multiTotalDamage.value}`)
  lines.push(`HP стены: ${multiWallHealth.value}`)
  if (multiTotalDamage.value >= multiWallHealth.value) {
    lines.push('Достаточно урона для разрушения стены')
  } else {
    lines.push(`Не хватает урона: ${multiAdditionalDamageNeeded.value}`)
  }
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }))
  a.download = 'dayz-raid-plan.txt'
  a.click()
}

// Действия multi
const resetMulti = () => {
  multiAmmoList.value = [{ weapon: '', count: 1 }]
  multiWallType.value = 'wooden'
  multiHealthMultiplier.value = 1
  multiTotalDamage.value = 0
  multiWallHealth.value = 0
  multiAdditionalDamageNeeded.value = 0
  multiFullWallsDestroyed.value = 0
  multiRemainingDamage.value = 0
  multiResultVisible.value = false
}
const { copy: copyToClipboardMulti } = useClipboard()
const copyMulti = async () => {
  if (!multiResultVisible.value) return
  const lines: string[] = []
  lines.push(`Стена: ${multiWallTypeText.value}`)
  lines.push(`Коэфф.: ${multiHealthMultiplier.value}`)
  lines.push(`Урон общий: ${multiTotalDamage.value}`)
  lines.push(`Здоровье стены: ${multiWallHealth.value}`)
  if (multiAdditionalDamageNeeded.value > 0) {
    lines.push(`Не хватает урона: ${multiAdditionalDamageNeeded.value}`)
  }
  await copyToClipboardMulti(lines.join('\n'))
}
const incrementAmmo = (index: number) => { multiAmmoList.value[index].count += 1 }
const decrementAmmo = (index: number) => { if (multiAmmoList.value[index].count > 1) multiAmmoList.value[index].count -= 1 }

// Восстановление последних настроек
onMounted(() => {
  try {
    const s = JSON.parse(localStorage.getItem('raid-single') || 'null')
    if (s) {
      if (s.weapon) singleSelectedWeapon.value = s.weapon
      if (s.wall) singleWallType.value = s.wall
      if (s.mult) singleHealthMultiplier.value = Number(s.mult)
    }
  } catch {}
  try {
    const m = JSON.parse(localStorage.getItem('raid-multi') || 'null')
    if (m) {
      if (Array.isArray(m.ammo)) multiAmmoList.value = m.ammo.map((a: any) => ({ weapon: String(a.weapon || ''), count: Number(a.count || 0) }))
      if (m.wall) multiWallType.value = m.wall
      if (m.mult) multiHealthMultiplier.value = Number(m.mult)
    }
  } catch {}
  try {
    plans.value = JSON.parse(localStorage.getItem('raid-plans') || '[]')
  } catch { plans.value = [] }
  // Применение состояния из query
  const q = route.query
  try {
    if (q.single) {
      const s = JSON.parse(String(q.single))
      if (s.weapon) singleSelectedWeapon.value = s.weapon
      if (s.wall) singleWallType.value = s.wall
      if (s.mult) singleHealthMultiplier.value = Number(s.mult)
    }
  } catch {}
  try {
    if (q.multi) {
      const m = JSON.parse(String(q.multi))
      if (Array.isArray(m.ammo)) multiAmmoList.value = m.ammo.map((a: any) => ({ weapon: String(a.weapon || ''), count: Number(a.count || 0) }))
      if (m.wall) multiWallType.value = m.wall
      if (m.mult) multiHealthMultiplier.value = Number(m.mult)
    }
  } catch {}
})

const savePlan = () => {
  const id = crypto.randomUUID?.() || String(Date.now())
  const plan: RaidPlan = { id, name: planName.value.trim(), wall: multiWallType.value, mult: multiHealthMultiplier.value, ammo: JSON.parse(JSON.stringify(multiAmmoList.value)) }
  plans.value = [plan, ...plans.value]
  localStorage.setItem('raid-plans', JSON.stringify(plans.value))
  planName.value = ''
}
const loadPlan = () => {
  const plan = plans.value.find(p => p.id === selectedPlanId.value)
  if (!plan) return
  multiWallType.value = plan.wall
  multiHealthMultiplier.value = plan.mult
  multiAmmoList.value = JSON.parse(JSON.stringify(plan.ammo))
}
const deletePlan = () => {
  if (!selectedPlanId.value) return
  plans.value = plans.value.filter(p => p.id !== selectedPlanId.value)
  localStorage.setItem('raid-plans', JSON.stringify(plans.value))
  selectedPlanId.value = ''
}

// Share links
const copyShareLink = async (mode: 'single'|'multi') => {
  const url = new URL(window.location.href)
  if (mode === 'single') {
    url.searchParams.set('single', JSON.stringify({ weapon: singleSelectedWeapon.value, wall: singleWallType.value, mult: singleHealthMultiplier.value }))
  } else {
    url.searchParams.set('multi', JSON.stringify({ wall: multiWallType.value, mult: multiHealthMultiplier.value, ammo: multiAmmoList.value }))
  }
  await navigator.clipboard.writeText(url.toString())
  shareCopied.value = true
  setTimeout(() => (shareCopied.value = false), 1500)
}

// Plans JSON import/export
const exportPlansJson = () => {
  const data = JSON.stringify(plans.value, null, 2)
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
  a.download = 'raid-plans.json'
  a.click()
}
const triggerPlansImport = () => {
  const el = document.getElementById('plansJsonImport') as HTMLInputElement | null
  el?.click()
}
const importPlansJson = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const text = await file.text()
    const arr = JSON.parse(text)
    if (!Array.isArray(arr)) throw new Error('invalid')
    // простая валидация
    const sanitized = arr.map((p: any) => ({
      id: String(p.id || crypto.randomUUID?.() || Date.now()),
      name: String(p.name || 'Импортированный план'),
      wall: String(p.wall || 'wooden'),
      mult: Number(p.mult || 1),
      ammo: Array.isArray(p.ammo) ? p.ammo.map((a: any) => ({ weapon: String(a.weapon || ''), count: Number(a.count || 0) })) : []
    }))
    plans.value = sanitized
    localStorage.setItem('raid-plans', JSON.stringify(plans.value))
  } catch (e) {
    console.error('Import failed', e)
  } finally {
    input.value = ''
  }
}

// Computed: прогресс следующей стены
const nextWallProgress = computed(() => {
  if (!multiWallHealth.value) return 0
  return Number(((multiRemainingDamage.value / multiWallHealth.value) * 100).toFixed(2))
})
</script>
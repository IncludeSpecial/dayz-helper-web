<template>
  <PageContainer>
    <PageHeader
      title="Калькулятор рейда"
      description="Расчёт выстрелов для одного или нескольких типов патронов. Выберите оружие и тип стены."
      back-to="/"
      back-label="На главную"
    />

    <!-- Режимы -->
    <div class="flex justify-center mb-8">
      <div
        class="inline-flex rounded-full border border-border bg-muted/30 p-1 dark:border-primary/25"
        role="tablist"
        aria-label="Режим расчёта"
      >
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'single'"
          :class="activeTab === 'single' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
          @click="activeTab = 'single'"
        >
          Одиночный
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'multi'"
          :class="activeTab === 'multi' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
          @click="activeTab = 'multi'"
        >
          Несколько
        </button>
      </div>
    </div>

    <!-- Одиночный расчёт -->
    <section
      v-if="activeTab === 'single'"
      class="rounded-xl border border-border bg-card p-6 dark:border-primary/20"
      aria-labelledby="single-title"
    >
      <h2 id="single-title" class="text-lg font-semibold text-foreground mb-6">Один тип патронов</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label class="text-muted-foreground text-sm">Тип стены</Label>
          <div class="flex flex-wrap gap-2 mt-2" role="group" aria-label="Быстрый выбор стены">
            <button
              v-for="(wall, key) in wallTypes"
              :key="'single-wall-' + key"
              type="button"
              :aria-pressed="singleWallType === key"
              :class="singleWallType === key ? 'border-primary bg-primary/15 text-primary' : 'border-input hover:bg-muted/50'"
              class="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
              @click="singleWallType = key"
            >
              {{ wall.name }}
            </button>
          </div>
        </div>
        <div>
          <Label class="text-muted-foreground text-sm">Коэффициент здоровья</Label>
          <div class="flex flex-wrap gap-2 mt-2" role="group" aria-label="Пресеты коэффициента">
            <button
              v-for="m in [1, 1.25, 1.5, 2]"
              :key="'single-m-' + m"
              type="button"
              :aria-pressed="singleHealthMultiplier === m"
              :class="singleHealthMultiplier === m ? 'border-primary bg-primary/15 text-primary' : 'border-input hover:bg-muted/50'"
              class="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
              @click="singleHealthMultiplier = m"
            >
              ×{{ m }}
            </button>
          </div>
        </div>
      </div>

      <form @submit.prevent="calculateSingleRaid" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label for="single_weapon" class="text-muted-foreground">Оружие</Label>
            <WeaponSelect v-model="singleSelectedWeapon" :weapons="weapons" id="single_weapon" class="mt-1.5" />
            <div class="mt-2 flex flex-wrap gap-2">
              <button
                v-for="w in weaponPresets"
                :key="'single-' + w.name"
                type="button"
                class="rounded-md border border-input bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                @click="singleSelectedWeapon = w.name"
              >
                {{ w.short }}
              </button>
            </div>
          </div>
          <div>
            <Label for="single_wall_type" class="text-muted-foreground">Тип стены</Label>
            <Select v-model="singleWallType" id="single_wall_type" required>
              <SelectTrigger class="mt-1.5">
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
          <Label for="single_health_multiplier" class="text-muted-foreground">Коэффициент здоровья</Label>
          <Input
            id="single_health_multiplier"
            v-model.number="singleHealthMultiplier"
            type="number"
            step="0.01"
            min="1"
            required
            class="mt-1.5 max-w-[120px]"
          />
        </div>
        <div class="flex flex-wrap gap-3">
          <Button type="submit">Рассчитать</Button>
          <Button type="button" variant="outline" @click="resetSingle">Сбросить</Button>
          <Button type="button" variant="outline" :disabled="!singleResultVisible" @click="copySingle">
            Копировать результат
          </Button>
          <span v-if="copyFeedbackSingle" class="text-sm text-primary font-medium" role="status" aria-live="polite">
            {{ copyFeedbackSingle }}
          </span>
        </div>
        <div v-if="singleErrors.length" class="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          <ul class="list-disc pl-4 space-y-0.5">
            <li v-for="err in singleErrors" :key="err">{{ err }}</li>
          </ul>
        </div>
      </form>

      <!-- Результат одиночного -->
      <div v-if="singleResultVisible" class="mt-8 rounded-lg border border-border bg-muted/20 dark:border-primary/15 p-5">
        <h3 class="text-sm font-semibold text-foreground mb-4">Результат</h3>
        <dl class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <dt class="text-muted-foreground">Оружие</dt>
          <dd class="font-medium">{{ singleSelectedWeapon }}</dd>
          <dt class="text-muted-foreground">Тип стены</dt>
          <dd class="font-medium">{{ singleWallTypeText }}</dd>
          <dt class="text-muted-foreground">Коэффициент</dt>
          <dd class="font-medium">{{ singleHealthMultiplier }}</dd>
          <dt class="text-muted-foreground">Выстрелов нужно</dt>
          <dd class="font-mono font-semibold text-lg text-primary">{{ singleShotsNeeded }}</dd>
          <dt class="text-muted-foreground">Здоровье стены</dt>
          <dd class="font-mono">{{ wallTypes[singleWallType].health * singleHealthMultiplier }}</dd>
          <dt class="text-muted-foreground">Урон/пуля</dt>
          <dd class="font-mono">{{ getWeaponDamage(singleSelectedWeapon) }}</dd>
        </dl>
        <div class="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" @click="copySingle">Копировать</Button>
          <Button size="sm" variant="outline" @click="exportSinglePlan">Экспорт TXT</Button>
          <Button size="sm" variant="outline" @click="copyShareLink('single')">Поделиться</Button>
        </div>
      </div>
    </section>

    <!-- Несколько типов патронов -->
    <section
      v-if="activeTab === 'multi'"
      class="rounded-xl border border-border bg-card p-6 dark:border-primary/20"
      aria-labelledby="multi-title"
    >
      <h2 id="multi-title" class="text-lg font-semibold text-foreground mb-6">Несколько типов патронов</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label class="text-muted-foreground text-sm">Тип стены</Label>
          <div class="flex flex-wrap gap-2 mt-2" role="group" aria-label="Быстрый выбор стены">
            <button
              v-for="(wall, key) in wallTypes"
              :key="'multi-wall-' + key"
              type="button"
              :aria-pressed="multiWallType === key"
              :class="multiWallType === key ? 'border-primary bg-primary/15 text-primary' : 'border-input hover:bg-muted/50'"
              class="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
              @click="multiWallType = key"
            >
              {{ wall.name }}
            </button>
          </div>
        </div>
        <div>
          <Label class="text-muted-foreground text-sm">Коэффициент здоровья</Label>
          <div class="flex flex-wrap gap-2 mt-2" role="group" aria-label="Пресеты коэффициента">
            <button
              v-for="m in [1, 1.25, 1.5, 2]"
              :key="'multi-m-' + m"
              type="button"
              :aria-pressed="multiHealthMultiplier === m"
              :class="multiHealthMultiplier === m ? 'border-primary bg-primary/15 text-primary' : 'border-input hover:bg-muted/50'"
              class="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
              @click="multiHealthMultiplier = m"
            >
              ×{{ m }}
            </button>
          </div>
        </div>
      </div>

      <form @submit.prevent="calculateMultiRaid" class="space-y-6">
        <div class="space-y-4">
          <Label class="text-muted-foreground text-sm">Типы патронов</Label>
          <div
            v-for="(ammo, index) in multiAmmoList"
            :key="index"
            class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end rounded-lg border border-border p-4 bg-muted/10 dark:border-primary/10"
          >
            <div class="md:col-span-5">
              <Label :for="'multi_weapon_' + index" class="text-xs text-muted-foreground">Оружие</Label>
              <WeaponSelect v-model="ammo.weapon" :weapons="weapons" :id="'multi_weapon_' + index" class="mt-1" />
              <div class="mt-1.5 flex flex-wrap gap-1.5">
                <button
                  v-for="w in weaponPresets"
                  :key="w.name + '-' + index"
                  type="button"
                  class="rounded border border-input bg-background px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted"
                  @click="ammo.weapon = w.name"
                >
                  {{ w.short }}
                </button>
              </div>
            </div>
            <div class="md:col-span-3">
              <Label :for="'ammo_count_' + index" class="text-xs text-muted-foreground">Количество</Label>
              <div class="mt-1 flex items-center gap-2">
                <Button type="button" size="sm" variant="outline" class="h-9 w-9 p-0" :aria-label="'Уменьшить'" @click="decrementAmmo(index)">
                  −
                </Button>
                <Input
                  :id="'ammo_count_' + index"
                  v-model.number="ammo.count"
                  type="number"
                  min="1"
                  required
                  class="w-20 text-center"
                />
                <Button type="button" size="sm" variant="outline" class="h-9 w-9 p-0" :aria-label="'Увеличить'" @click="incrementAmmo(index)">
                  +
                </Button>
              </div>
              <p v-if="ammo.weapon" class="mt-1 text-xs text-muted-foreground">
                Урон/пуля: {{ getWeaponDamage(ammo.weapon) }} · Сумма: <span :class="isMaxContributor(index) ? 'text-primary font-medium' : ''">{{ getRowDamage(ammo) }}</span>
                <span v-if="isMaxContributor(index)" class="ml-1 text-primary">MAX</span>
              </p>
            </div>
            <div class="md:col-span-4 flex justify-end">
              <Button type="button" variant="ghost" size="sm" class="text-destructive hover:text-destructive" :disabled="multiAmmoList.length === 1" @click="removeAmmo(index)">
                Удалить
              </Button>
            </div>
          </div>
          <Button type="button" variant="outline" class="w-full" @click="addAmmo">
            + Добавить тип патронов
          </Button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label for="multi_wall_type" class="text-muted-foreground">Тип стены</Label>
            <Select v-model="multiWallType" id="multi_wall_type" required>
              <SelectTrigger class="mt-1.5">
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
            <Label for="multi_health_multiplier" class="text-muted-foreground">Коэффициент здоровья</Label>
            <Input
              id="multi_health_multiplier"
              v-model.number="multiHealthMultiplier"
              type="number"
              step="0.01"
              min="1"
              required
              class="mt-1.5 max-w-[120px]"
            />
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <Button type="submit">Рассчитать</Button>
          <Button type="button" variant="outline" @click="resetMulti">Сбросить</Button>
          <Button type="button" variant="outline" :disabled="!multiResultVisible" @click="copyMulti">
            Копировать результат
          </Button>
          <span v-if="copyFeedbackMulti" class="text-sm text-primary font-medium" role="status" aria-live="polite">
            {{ copyFeedbackMulti }}
          </span>
        </div>
        <div v-if="multiErrors.length" class="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          <ul class="list-disc pl-4 space-y-0.5">
            <li v-for="err in multiErrors" :key="err">{{ err }}</li>
          </ul>
        </div>
      </form>

      <!-- Результат мульти -->
      <div v-if="multiResultVisible" class="mt-8 rounded-lg border border-border bg-muted/20 dark:border-primary/15 overflow-hidden">
        <div class="p-5">
          <h3 class="text-sm font-semibold text-foreground mb-4">Результат</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-background/50 border border-border dark:border-primary/10 mb-5">
            <div>
              <p class="text-xs text-muted-foreground">Разрушено стен</p>
              <p class="font-mono text-xl font-semibold text-foreground">{{ multiFullWallsDestroyed }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Прогресс следующей</p>
              <p class="font-mono text-xl font-semibold text-foreground">{{ nextWallProgress }}%</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Доп. урон нужно</p>
              <p class="font-mono text-xl font-semibold" :class="multiAdditionalDamageNeeded > 0 ? 'text-destructive' : 'text-foreground'">
                {{ multiAdditionalDamageNeeded }}
              </p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Стена / общий урон</p>
              <p class="font-mono text-sm">{{ multiWallHealth }} / {{ multiTotalDamage }}</p>
            </div>
          </div>

          <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
            <dt class="text-muted-foreground">Тип стены</dt>
            <dd class="font-medium">{{ multiWallTypeText }}</dd>
            <dt class="text-muted-foreground">Коэффициент</dt>
            <dd class="font-medium">{{ multiHealthMultiplier }}</dd>
          </dl>

          <p v-if="multiTotalDamage >= multiWallHealth" class="text-center font-medium text-primary py-2">
            Патронов достаточно для разрушения стены
          </p>
          <p v-else class="text-center font-medium text-destructive py-2">
            Патронов недостаточно
          </p>

          <!-- Прогресс стен -->
          <div v-if="multiFullWallsDestroyed > 0 || multiRemainingDamage > 0" class="mt-6 pt-5 border-t border-border">
            <h4 class="font-semibold text-sm text-foreground mb-3">Прогресс разрушения</h4>
            <div class="space-y-4">
              <div v-for="n in multiFullWallsDestroyed" :key="'full-' + n" class="space-y-1">
                <p class="text-sm text-muted-foreground">Стена {{ n }}: 100%</p>
                <UiProgressBar :value="100" class="h-2" />
              </div>
              <div v-if="multiRemainingDamage > 0" class="space-y-1">
                <p class="text-sm text-muted-foreground">
                  Стена {{ multiFullWallsDestroyed + 1 }}: {{ nextWallProgress }}%
                </p>
                <UiProgressBar :value="nextWallProgress" class="h-2" />
              </div>
            </div>
          </div>

          <div v-if="multiAdditionalDamageNeeded > 0" class="mt-5 pt-5 border-t border-border">
            <p class="font-semibold text-sm text-destructive mb-2">Дополнительно нужно урона: {{ multiAdditionalDamageNeeded }}</p>
            <p class="text-xs text-muted-foreground mb-2">Доп. патронов:</p>
            <ul class="list-disc pl-5 text-sm space-y-0.5">
              <li v-for="(ammo, index) in multiAmmoList" :key="index">
                {{ ammo.weapon }}: {{ Math.ceil(multiAdditionalDamageNeeded / getWeaponDamage(ammo.weapon)) }}
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-border bg-card/80 px-4 py-3 flex flex-wrap gap-2 justify-end">
          <Button size="sm" variant="outline" @click="copyMulti">Копировать</Button>
          <span v-if="copyFeedbackMulti" class="text-sm text-primary font-medium self-center" role="status">{{ copyFeedbackMulti }}</span>
          <Button size="sm" variant="outline" @click="exportPlan">Экспорт TXT</Button>
          <Button size="sm" variant="outline" @click="copyShareLink('multi')">Поделиться</Button>
        </div>
      </div>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Weapon } from '~/types/weapon'
import type { Ammo, RaidPlan } from '~/types/raid'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'
import WeaponSelect from '~/components/WeaponSelect.vue'
import { useClipboard } from '@vueuse/core'
import { useRoute } from '#imports'

const wallTypes: Record<string, { name: string; health: number }> = {
  wooden: { name: 'Деревянная', health: 16000 },
  frameWooden: { name: 'Каркас + Деревянная', health: 28000 },
  metal: { name: 'Металлическая', health: 21000 },
  frameMetal: { name: 'Каркас + Металлическая', health: 33000 },
  frame: { name: 'Каркас', health: 12000 }
}

const weapons = ref<Weapon[]>([
  { name: '12 калибр (Дробь) (BK-12, BK-133, BK-43, Vaiga)', damage: 280 },
  { name: '7.62x54 мм (ВСД, Мосина, ВС-89)', damage: 145 },
  { name: '.308 Win (LAR, DMR, CR-550 Savanna, M70 Tundra, Blaze, Longhorn)', damage: 142 },
  { name: 'Арбалет', damage: 125 },
  { name: '5.45x39 мм (KA-74, KA-74U, SSG 82)', damage: 114 },
  { name: '12 калибр (Пуля) (BK-12, BK-133, BK-43, Vaiga)', damage: 110 },
  { name: '5.56x45 мм (AUR A1, AUR AX, KA-101, LE-MAS, M16-A2, M4-A1, Pioneer)', damage: 106 },
  { name: '7.62x39 мм (KA-M, CR-527, SKS, BK-18)', damage: 90 },
  { name: '9x39 мм (SVAL, Vikhr, VSS)', damage: 75 },
  { name: '.357 (Deagle, Derringer, Revolver, Repeater)', damage: 58 },
  { name: '9x19 мм (SG5-K, Mlock-91, CR-75, P1)', damage: 39 },
  { name: '.45 ACP (USG-45, Kolt 1911, FX-45)', damage: 37 },
  { name: '.380 ACP (IJ-70, Bizon, CR-61 Skorpion)', damage: 35 },
  { name: '22 LR (MK II, Sporter)', damage: 20 }
])

const weaponPresets = [
  { name: '12 калибр (Дробь) (BK-12, BK-133, BK-43, Vaiga)', short: '12к дробь' },
  { name: '.308 Win (LAR, DMR, CR-550 Savanna, M70 Tundra, Blaze, Longhorn)', short: '.308' },
  { name: '5.56x45 мм (AUR A1, AUR AX, KA-101, LE-MAS, M16-A2, M4-A1, Pioneer)', short: '5.56' },
  { name: '7.62x39 мм (KA-M, CR-527, SKS, BK-18)', short: '7.62x39' }
]

const singleSelectedWeapon = ref('')
const singleWallType = ref('wooden')
const singleHealthMultiplier = ref(1)
const singleShotsNeeded = ref(0)
const singleResultVisible = ref(false)
const singleErrors = ref<string[]>([])
const copyFeedbackSingle = ref('')

const multiAmmoList = ref<Ammo[]>([{ weapon: '', count: 1 }])
const multiWallType = ref('wooden')
const multiHealthMultiplier = ref(1)
const multiTotalDamage = ref(0)
const multiWallHealth = ref(0)
const multiAdditionalDamageNeeded = ref(0)
const multiFullWallsDestroyed = ref(0)
const multiRemainingDamage = ref(0)
const multiResultVisible = ref(false)
const multiErrors = ref<string[]>([])
const copyFeedbackMulti = ref('')
const activeTab = ref<'single' | 'multi'>('single')

const planName = ref('')
const selectedPlanId = ref('')
const plans = ref<RaidPlan[]>([])
const route = useRoute()
const raidState = useRaidState()

const singleWallTypeText = computed(() => wallTypes[singleWallType.value].name)
const multiWallTypeText = computed(() => wallTypes[multiWallType.value].name)
const nextWallProgress = computed(() => {
  if (!multiWallHealth.value) return 0
  return Number(((multiRemainingDamage.value / multiWallHealth.value) * 100).toFixed(2))
})

function addAmmo () {
  multiAmmoList.value.push({ weapon: '', count: 1 })
}
function removeAmmo (index: number) {
  if (multiAmmoList.value.length > 1) multiAmmoList.value.splice(index, 1)
}
function getWeaponDamage (weaponName: string) {
  const w = weapons.value.find(x => x.name === weaponName)
  return w ? w.damage : 0
}
function getRowDamage (ammo: Ammo) {
  return getWeaponDamage(ammo.weapon) * (ammo.count || 0)
}
function isMaxContributor (index: number) {
  const damages = multiAmmoList.value.map(getRowDamage)
  const max = Math.max(0, ...damages)
  return damages[index] === max && max > 0
}

function calculateSingleRaid () {
  singleErrors.value = []
  if (!singleSelectedWeapon.value) singleErrors.value.push('Выберите оружие')
  if (!singleWallType.value) singleErrors.value.push('Выберите тип стены')
  if (singleHealthMultiplier.value < 1) singleErrors.value.push('Коэффициент здоровья должен быть ≥ 1')
  if (singleErrors.value.length) return
  const weapon = weapons.value.find(w => w.name === singleSelectedWeapon.value)
  if (!weapon) return
  const wallHealth = wallTypes[singleWallType.value].health * singleHealthMultiplier.value
  singleShotsNeeded.value = Math.ceil(wallHealth / weapon.damage)
  singleResultVisible.value = true
  raidState.saveSingle({ weapon: singleSelectedWeapon.value, wall: singleWallType.value, mult: singleHealthMultiplier.value })
}

function resetSingle () {
  singleSelectedWeapon.value = ''
  singleWallType.value = 'wooden'
  singleHealthMultiplier.value = 1
  singleShotsNeeded.value = 0
  singleResultVisible.value = false
}

const { copy: copyToClipboardSingle } = useClipboard()
async function copySingle () {
  if (!singleResultVisible.value) return
  const text = `Оружие: ${singleSelectedWeapon.value}\nСтена: ${singleWallTypeText.value}\nКоэфф.: ${singleHealthMultiplier.value}\nВыстрелов: ${singleShotsNeeded.value}`
  await copyToClipboardSingle(text)
  copyFeedbackSingle.value = 'Скопировано!'
  setTimeout(() => { copyFeedbackSingle.value = '' }, 2000)
}

function exportSinglePlan () {
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

function calculateMultiRaid () {
  multiErrors.value = []
  if (!multiWallType.value) multiErrors.value.push('Выберите тип стены')
  if (multiHealthMultiplier.value < 1) multiErrors.value.push('Коэффициент здоровья должен быть ≥ 1')
  if (multiAmmoList.value.some(a => !a.weapon)) multiErrors.value.push('Укажите оружие для каждого элемента')
  if (multiAmmoList.value.some(a => a.count < 1)) multiErrors.value.push('Количество патронов ≥ 1')
  if (multiErrors.value.length) return
  multiWallHealth.value = wallTypes[multiWallType.value].health * multiHealthMultiplier.value
  multiTotalDamage.value = multiAmmoList.value.reduce((sum, a) => {
    const w = weapons.value.find(x => x.name === a.weapon)
    return sum + (w ? w.damage * a.count : 0)
  }, 0)
  multiFullWallsDestroyed.value = Math.floor(multiTotalDamage.value / multiWallHealth.value)
  multiRemainingDamage.value = multiTotalDamage.value % multiWallHealth.value
  multiAdditionalDamageNeeded.value = multiWallHealth.value > multiTotalDamage.value ? multiWallHealth.value - multiTotalDamage.value : 0
  multiResultVisible.value = true
  raidState.saveMulti({ ammo: multiAmmoList.value, wall: multiWallType.value, mult: multiHealthMultiplier.value })
}

function resetMulti () {
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
async function copyMulti () {
  if (!multiResultVisible.value) return
  const lines = [
    `Стена: ${multiWallTypeText.value}`,
    `Коэфф.: ${multiHealthMultiplier.value}`,
    `Урон общий: ${multiTotalDamage.value}`,
    `Здоровье стены: ${multiWallHealth.value}`
  ]
  if (multiAdditionalDamageNeeded.value > 0) lines.push(`Не хватает урона: ${multiAdditionalDamageNeeded.value}`)
  await copyToClipboardMulti(lines.join('\n'))
  copyFeedbackMulti.value = 'Скопировано!'
  setTimeout(() => { copyFeedbackMulti.value = '' }, 2000)
}

function incrementAmmo (index: number) {
  multiAmmoList.value[index].count += 1
}
function decrementAmmo (index: number) {
  if (multiAmmoList.value[index].count > 1) multiAmmoList.value[index].count -= 1
}

function exportPlan () {
  const lines: string[] = [
    `Тип стены: ${multiWallTypeText.value} (HP: ${wallTypes[multiWallType.value].health})`,
    `Коэффициент: x${multiHealthMultiplier.value}`,
    '--- Патроны ---'
  ]
  multiAmmoList.value.forEach((a, i) => {
    const dmg = getWeaponDamage(a.weapon)
    lines.push(`${i + 1}. ${a.weapon} — ${a.count} шт. (урон/пуля: ${dmg}, суммарно: ${dmg * a.count})`)
  })
  lines.push('--- Итог ---', `Общий урон: ${multiTotalDamage.value}`, `HP стены: ${multiWallHealth.value}`)
  if (multiTotalDamage.value >= multiWallHealth.value) lines.push('Достаточно урона для разрушения стены')
  else lines.push(`Не хватает урона: ${multiAdditionalDamageNeeded.value}`)
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }))
  a.download = 'dayz-raid-plan.txt'
  a.click()
}

async function copyShareLink (mode: 'single' | 'multi') {
  const url = new URL(window.location.href)
  if (mode === 'single') {
    url.searchParams.set('single', JSON.stringify({ weapon: singleSelectedWeapon.value, wall: singleWallType.value, mult: singleHealthMultiplier.value }))
  } else {
    url.searchParams.set('multi', JSON.stringify({ wall: multiWallType.value, mult: multiHealthMultiplier.value, ammo: multiAmmoList.value }))
  }
  await navigator.clipboard.writeText(url.toString())
  copyFeedbackMulti.value = 'Ссылка скопирована'
  setTimeout(() => { copyFeedbackMulti.value = '' }, 1500)
}

onMounted(() => {
  const s = raidState.loadSingle()
  if (s?.weapon) singleSelectedWeapon.value = s.weapon
  if (s?.wall) singleWallType.value = s.wall
  if (s?.mult != null) singleHealthMultiplier.value = Number(s.mult)
  const m = raidState.loadMulti()
  if (m?.ammo?.length) multiAmmoList.value = m.ammo
  if (m?.wall) multiWallType.value = m.wall
  if (m?.mult != null) multiHealthMultiplier.value = Number(m.mult)
  plans.value = raidState.loadPlans()
  try {
    if (route.query.single) {
      const s = JSON.parse(String(route.query.single)) as { weapon?: string; wall?: string; mult?: number }
      if (s.weapon) singleSelectedWeapon.value = s.weapon
      if (s.wall) singleWallType.value = s.wall
      if (s.mult != null) singleHealthMultiplier.value = Number(s.mult)
    }
  } catch {}
  try {
    if (route.query.multi) {
      const m = JSON.parse(String(route.query.multi)) as { ammo?: Ammo[]; wall?: string; mult?: number }
      if (Array.isArray(m.ammo)) multiAmmoList.value = m.ammo.map(a => ({ weapon: String(a.weapon ?? ''), count: Number(a.count ?? 0) }))
      if (m.wall) multiWallType.value = m.wall
      if (m.mult != null) multiHealthMultiplier.value = Number(m.mult)
    }
  } catch {}
})
</script>

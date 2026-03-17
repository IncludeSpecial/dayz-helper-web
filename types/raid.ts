/** Один тип патронов в мульти-режиме */
export interface Ammo {
  weapon: string
  count: number
}

/** Сохранённый план рейда */
export interface RaidPlan {
  id: string
  name: string
  wall: string
  mult: number
  ammo: Ammo[]
}

/** Состояние одиночного расчёта (localStorage) */
export interface RaidSingleState {
  weapon?: string
  wall?: string
  mult?: number
}

/** Состояние мульти-расчёта (localStorage) */
export interface RaidMultiState {
  ammo?: Ammo[]
  wall?: string
  mult?: number
}

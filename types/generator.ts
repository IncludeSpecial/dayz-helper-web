/** Один пароль в списке / истории */
export interface PasswordEntry {
  password: string
  source: string
  date?: string
}

/** Сохранённые настройки по умолчанию генератора */
export interface GeneratorDefaults {
  length?: number
  count?: number
  source?: string
}

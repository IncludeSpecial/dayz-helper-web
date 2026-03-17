/** Ссылка на раздел сайта (навигация, футер, карточки на главной) */
export interface NavLink {
  path: string
  label: string
}

/** Пункты навигации в хедере (без главной) */
export const headerNavItems: NavLink[] = [
  { path: '/generator', label: 'Генератор' },
  { path: '/raid', label: 'Рейд' },
  { path: '/map', label: 'Карта' },
  { path: '/history', label: 'История' },
  { path: '/notes', label: 'Заметки' },
  { path: '/timer', label: 'Таймер' },
  { path: '/checklist', label: 'Чек-лист' }
]

/** Ссылки в футере (с главной) */
export const footerNavItems: NavLink[] = [
  { path: '/', label: 'Главная' },
  ...headerNavItems
]

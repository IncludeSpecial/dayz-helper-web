import { headerNavItems, footerNavItems } from '~/utils/site-nav'

/** Навигация сайта: хедер и футер ссылки из единого источника */
export function useSiteNav () {
  return {
    headerNavItems,
    footerNavItems
  }
}

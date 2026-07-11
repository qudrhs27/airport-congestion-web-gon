import { MAX_FAVORITES, type FavoriteSlot } from '../types'

const STORAGE_KEY = 'airport-congestion-favorites'

export function loadFavorites(): FavoriteSlot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter(
        (item): item is FavoriteSlot =>
          !!item &&
          typeof item === 'object' &&
          typeof (item as FavoriteSlot).id === 'string' &&
          typeof (item as FavoriteSlot).dateValue === 'string' &&
          typeof (item as FavoriteSlot).timeValue === 'string',
      )
      .slice(0, MAX_FAVORITES)
  } catch {
    return []
  }
}

export function saveFavorites(favorites: FavoriteSlot[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.slice(0, MAX_FAVORITES)))
  } catch {
    // ignore quota / private mode errors
  }
}

export function createFavoriteId(dateValue: string, timeValue: string) {
  return `${dateValue}T${timeValue}`
}

export function formatFavoriteLabel(dateValue: string, timeValue: string) {
  const [y, m, d] = dateValue.split('-')
  const hour = timeValue.slice(0, 2)
  return `${y}.${m}.${d} · ${hour}시`
}

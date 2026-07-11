import { useState } from 'react'
import { MAX_FAVORITES, type FavoriteSlot } from '../types'
import {
  createFavoriteId,
  loadFavorites,
  saveFavorites,
} from '../utils/favoriteStorage'

export function useFavoriteSlots() {
  const [favorites, setFavorites] = useState<FavoriteSlot[]>(() => loadFavorites())

  const persist = (next: FavoriteSlot[]) => {
    setFavorites(next)
    saveFavorites(next)
  }

  const addFavorite = (dateValue: string, timeValue: string) => {
    const id = createFavoriteId(dateValue, timeValue)
    if (favorites.some((item) => item.id === id)) {
      return { ok: false as const, reason: 'duplicate' as const }
    }
    if (favorites.length >= MAX_FAVORITES) {
      return { ok: false as const, reason: 'limit' as const }
    }

    persist([{ id, dateValue, timeValue }, ...favorites])
    return { ok: true as const }
  }

  const removeFavorite = (id: string) => {
    persist(favorites.filter((item) => item.id !== id))
  }

  const isFavorite = (dateValue: string, timeValue: string) =>
    favorites.some((item) => item.id === createFavoriteId(dateValue, timeValue))

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  }
}

import type { Theme } from '../types'

export const THEME_STORAGE_KEY = 'airport-congestion-theme'

export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme()
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme
}

export function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // ignore quota / private mode errors
  }
  applyTheme(theme)
}

export const CHART_COLORS = {
  light: {
    t1Entry: '#0b6e99',
    t1Departure: '#c45c26',
    t2Entry: '#1a7a5c',
    t2Departure: '#8b5a2b',
    total: '#334155',
    highlight: '#0b6e99',
  },
  dark: {
    t1Entry: '#5ec8f0',
    t1Departure: '#f0a060',
    t2Entry: '#4ecf9a',
    t2Departure: '#d4a574',
    total: '#94a3b8',
    highlight: '#5ec8f0',
  },
} as const

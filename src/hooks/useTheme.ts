import { useState } from 'react'
import { persistTheme, resolveTheme } from '../utils/theme'
import type { Theme } from '../types'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => resolveTheme())

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    persistTheme(next)
    setTheme(next)
  }

  return { theme, toggleTheme }
}

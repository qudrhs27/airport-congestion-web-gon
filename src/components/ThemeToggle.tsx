import type { Theme } from '../types'
import './ThemeToggle.css'

type ThemeToggleProps = {
  theme: Theme
  onToggle: () => void
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title={isDark ? '라이트 모드' : '다크 모드'}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isDark ? '☀' : '☾'}
      </span>
      <span>{isDark ? '라이트' : '다크'}</span>
    </button>
  )
}

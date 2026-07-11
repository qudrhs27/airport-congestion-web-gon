import ThemeToggle from './ThemeToggle'
import LoadingSpinner from './LoadingSpinner'
import type { Theme } from '../types'
import './PageHeader.css'

type PageHeaderProps = {
  status: string
  isLoading: boolean
  theme: Theme
  onToggleTheme: () => void
}

export default function PageHeader({
  status,
  isLoading,
  theme,
  onToggleTheme,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-text">
        <h1>인천공항 승객예고</h1>
        {isLoading ? (
          <LoadingSpinner compact label="데이터 요청 중…" />
        ) : (
          <p className="page-status">{status}</p>
        )}
      </div>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </header>
  )
}

import './LoadingSpinner.css'

type LoadingSpinnerProps = {
  label?: string
  compact?: boolean
}

export default function LoadingSpinner({
  label = '데이터를 불러오는 중…',
  compact = false,
}: LoadingSpinnerProps) {
  return (
    <div
      className={`loading-spinner${compact ? ' is-compact' : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="loading-spinner-ring" aria-hidden="true" />
      <span className="loading-spinner-label">{label}</span>
    </div>
  )
}

import type { ActiveAlert } from '../hooks/useCongestionAlert'
import './AlertBanner.css'

type AlertBannerProps = {
  alert: ActiveAlert
  onDismiss: () => void
}

export default function AlertBanner({ alert, onDismiss }: AlertBannerProps) {
  if (!alert) return null

  return (
    <div className="alert-banner" role="alert">
      <div className="alert-banner-text">
        <strong>혼잡도 알림</strong>
        <p>
          {alert.timeLabel} 예상 승객 {alert.total.toLocaleString('ko-KR')}명이 기준(
          {alert.threshold.toLocaleString('ko-KR')}명)을 초과했습니다.
        </p>
      </div>
      <button type="button" className="btn btn-secondary alert-banner-dismiss" onClick={onDismiss}>
        닫기
      </button>
    </div>
  )
}

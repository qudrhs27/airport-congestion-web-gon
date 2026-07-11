import { ALERT_THRESHOLD_PRESETS, type CongestionAlertSettings } from '../types'
import './CongestionAlertSettings.css'

type CongestionAlertSettingsProps = {
  settings: CongestionAlertSettings
  onChange: (settings: CongestionAlertSettings) => void
  onRequestPermission: () => Promise<'granted' | 'denied' | 'default' | 'unsupported'>
}

export default function CongestionAlertSettingsPanel({
  settings,
  onChange,
  onRequestPermission,
}: CongestionAlertSettingsProps) {
  const handleEnableChange = async (enabled: boolean) => {
    onChange({ ...settings, enabled })
    if (enabled) {
      await onRequestPermission()
    }
  }

  return (
    <section className="feature-panel" aria-label="혼잡도 알림 설정">
      <h2 className="feature-title">혼잡도 알림 설정</h2>
      <p className="feature-desc">
        선택한 시간대의 전체 예상 승객 수가 기준 이상이면 화면에 알림을 표시합니다.
      </p>

      <label className="alert-switch">
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => void handleEnableChange(e.target.checked)}
        />
        <span>알림 사용</span>
      </label>

      <div className="alert-controls" hidden={!settings.enabled}>
        <label className="field">
          <span>알림 기준 (명)</span>
          <input
            type="number"
            min={1000}
            step={500}
            value={settings.threshold}
            onChange={(e) =>
              onChange({
                ...settings,
                threshold: Math.max(0, Number(e.target.value) || 0),
              })
            }
          />
        </label>

        <div className="alert-presets" role="group" aria-label="알림 기준 프리셋">
          {ALERT_THRESHOLD_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              className={`btn btn-secondary alert-preset${
                settings.threshold === preset.value ? ' is-active' : ''
              }`}
              onClick={() => onChange({ ...settings, threshold: preset.value })}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

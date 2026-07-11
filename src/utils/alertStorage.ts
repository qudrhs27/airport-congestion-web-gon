import {
  DEFAULT_ALERT_SETTINGS,
  type CongestionAlertSettings,
} from '../types'

const STORAGE_KEY = 'airport-congestion-alert'

export function loadAlertSettings(): CongestionAlertSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_ALERT_SETTINGS }

    const parsed = JSON.parse(raw) as Partial<CongestionAlertSettings>
    return {
      enabled: Boolean(parsed.enabled),
      threshold:
        typeof parsed.threshold === 'number' && parsed.threshold > 0
          ? parsed.threshold
          : DEFAULT_ALERT_SETTINGS.threshold,
    }
  } catch {
    return { ...DEFAULT_ALERT_SETTINGS }
  }
}

export function saveAlertSettings(settings: CongestionAlertSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // ignore quota / private mode errors
  }
}

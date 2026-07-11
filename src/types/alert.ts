export type CongestionAlertSettings = {
  enabled: boolean
  /** 전체 예상 승객 수(Total) 기준 임계값 */
  threshold: number
}

export const DEFAULT_ALERT_SETTINGS: CongestionAlertSettings = {
  enabled: false,
  threshold: 15000,
}

export const ALERT_THRESHOLD_PRESETS = [
  { label: '보통 (10,000명)', value: 10000 },
  { label: '혼잡 (15,000명)', value: 15000 },
  { label: '매우 혼잡 (20,000명)', value: 20000 },
] as const

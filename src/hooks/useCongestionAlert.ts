import { useEffect, useRef, useState } from 'react'
import type { CongestionAlertSettings, PassengerItem } from '../types'
import { loadAlertSettings, saveAlertSettings } from '../utils/alertStorage'
import { getPassengerTotal } from '../utils/passenger'

export type ActiveAlert = {
  total: number
  threshold: number
  timeLabel: string
} | null

type UseCongestionAlertOptions = {
  selectedItem: PassengerItem | null
}

export function useCongestionAlert({ selectedItem }: UseCongestionAlertOptions) {
  const [settings, setSettings] = useState<CongestionAlertSettings>(() => loadAlertSettings())
  const [activeAlert, setActiveAlert] = useState<ActiveAlert>(null)
  const lastNotifiedKey = useRef<string | null>(null)

  const updateSettings = (next: CongestionAlertSettings) => {
    setSettings(next)
    saveAlertSettings(next)
  }

  useEffect(() => {
    if (!settings.enabled || !selectedItem) {
      setActiveAlert(null)
      return
    }

    const total = getPassengerTotal(selectedItem)
    if (total < settings.threshold) {
      setActiveAlert(null)
      return
    }

    const timeLabel = selectedItem.atime.split('_')[0]
    const alert: ActiveAlert = {
      total,
      threshold: settings.threshold,
      timeLabel: `${timeLabel}시`,
    }
    setActiveAlert(alert)

    const notifyKey = `${selectedItem.adate}-${selectedItem.atime}-${settings.threshold}`
    if (lastNotifiedKey.current === notifyKey) return
    lastNotifiedKey.current = notifyKey

    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification('혼잡도 알림', {
          body: `${alert.timeLabel} 예상 승객 ${total.toLocaleString('ko-KR')}명이 기준(${settings.threshold.toLocaleString('ko-KR')}명)을 초과했습니다.`,
          tag: notifyKey,
        })
      } catch {
        // ignore notification failures
      }
    }
  }, [selectedItem, settings.enabled, settings.threshold])

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') return 'unsupported' as const
    if (Notification.permission === 'granted') return 'granted' as const
    if (Notification.permission === 'denied') return 'denied' as const
    const permission = await Notification.requestPermission()
    return permission
  }

  const dismissAlert = () => setActiveAlert(null)

  return {
    settings,
    updateSettings,
    activeAlert,
    dismissAlert,
    requestNotificationPermission,
  }
}

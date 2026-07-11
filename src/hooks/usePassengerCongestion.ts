import { useEffect, useState } from 'react'
import { fetchPassengerAnnouncement } from '../api/passengerAnnouncement'
import type { PassengerItem } from '../types'
import {
  getHourKey,
  getNowInputs,
  getSelectDate,
  getTodayAndTomorrow,
} from '../utils/dateTime'
import { findItemByHour } from '../utils/passenger'

export function usePassengerCongestion() {
  const initial = getNowInputs()
  const { today, tomorrow } = getTodayAndTomorrow()

  const [status, setStatus] = useState('데이터 요청 중...')
  const [isLoading, setIsLoading] = useState(true)
  const [items, setItems] = useState<PassengerItem[]>([])
  const [dateValue, setDateValue] = useState(initial.date)
  const [timeValue, setTimeValue] = useState(initial.time)
  const [selectedItem, setSelectedItem] = useState<PassengerItem | null>(null)
  const [detailMessage, setDetailMessage] = useState<string | undefined>()
  const [loadedSelectDate, setLoadedSelectDate] = useState('0')

  const applyTimeSlot = (list: PassengerItem[], time: string) => {
    const hourKey = getHourKey(time)
    const matched = findItemByHour(list, hourKey)

    if (!matched) {
      setSelectedItem(null)
      setDetailMessage(`${hourKey}시 시간대 데이터를 찾을 수 없습니다.`)
      return
    }

    setSelectedItem(matched)
    setDetailMessage(undefined)
  }

  const loadPassengerAnnouncement = async (selectdate: string) => {
    setIsLoading(true)
    setStatus('데이터 요청 중...')

    try {
      const list = await fetchPassengerAnnouncement(selectdate)
      setItems(list)
      setLoadedSelectDate(selectdate)
      setStatus(list.length > 0 ? `총 ${list.length}건` : '조회된 데이터가 없습니다.')
      return list
    } catch (error) {
      console.error('승객예고 데이터 조회 실패:', error)
      setStatus(`조회 실패: ${error instanceof Error ? error.message : String(error)}`)
      return [] as PassengerItem[]
    } finally {
      setIsLoading(false)
    }
  }

  const showCongestion = async () => {
    const selectdate = getSelectDate(dateValue)

    if (selectdate == null) {
      setSelectedItem(null)
      setDetailMessage('조회 가능 일자는 오늘과 내일뿐입니다.')
      return
    }

    let list = items
    if (selectdate !== loadedSelectDate || list.length === 0) {
      list = await loadPassengerAnnouncement(selectdate)
    }

    applyTimeSlot(list, timeValue)
  }

  const resetToNow = async () => {
    const now = getNowInputs()
    setDateValue(now.date)
    setTimeValue(now.time)

    const list = await loadPassengerAnnouncement('0')
    applyTimeSlot(list, now.time)
  }

  const selectSlot = async (nextDate: string, nextTime: string) => {
    setDateValue(nextDate)
    setTimeValue(nextTime)

    const selectdate = getSelectDate(nextDate)
    if (selectdate == null) {
      setSelectedItem(null)
      setDetailMessage('조회 가능 일자는 오늘과 내일뿐입니다.')
      return
    }

    let list = items
    if (selectdate !== loadedSelectDate || list.length === 0) {
      list = await loadPassengerAnnouncement(selectdate)
    }

    applyTimeSlot(list, nextTime)
  }

  useEffect(() => {
    let cancelled = false

    const boot = async () => {
      setIsLoading(true)
      setStatus('데이터 요청 중...')
      try {
        const list = await fetchPassengerAnnouncement('0')
        if (cancelled) return

        setItems(list)
        setLoadedSelectDate('0')
        setStatus(list.length > 0 ? `총 ${list.length}건` : '조회된 데이터가 없습니다.')

        const hourKey = getHourKey(getNowInputs().time)
        const matched = findItemByHour(list, hourKey)
        if (!matched) {
          setSelectedItem(null)
          setDetailMessage(`${hourKey}시 시간대 데이터를 찾을 수 없습니다.`)
          return
        }
        setSelectedItem(matched)
        setDetailMessage(undefined)
      } catch (error) {
        if (cancelled) return
        console.error('승객예고 데이터 조회 실패:', error)
        setStatus(`조회 실패: ${error instanceof Error ? error.message : String(error)}`)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [])

  return {
    status,
    isLoading,
    items,
    dateValue,
    setDateValue,
    timeValue,
    setTimeValue,
    selectedItem,
    detailMessage,
    today,
    tomorrow,
    showCongestion,
    resetToNow,
    selectSlot,
  }
}

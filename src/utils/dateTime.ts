export function toDateInputValue(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function toTimeInputValue(date: Date) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export function getNowInputs() {
  const now = new Date()
  return {
    date: toDateInputValue(now),
    time: toTimeInputValue(now),
  }
}

export function getTodayAndTomorrow() {
  const today = toDateInputValue(new Date())
  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrow = toDateInputValue(tomorrowDate)
  return { today, tomorrow }
}

/** API selectdate: 오늘=0, 내일=1. 그 외는 null */
export function getSelectDate(dateValue: string): '0' | '1' | null {
  const { today, tomorrow } = getTodayAndTomorrow()
  if (dateValue === today) return '0'
  if (dateValue === tomorrow) return '1'
  return null
}

/** 시각(시)에 해당하는 API atime 슬롯 시작 시각 (예: 14 → "14") */
export function getHourKey(timeValue: string) {
  return timeValue.slice(0, 2)
}

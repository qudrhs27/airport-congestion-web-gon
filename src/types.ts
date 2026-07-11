export type PassengerItem = {
  adate: string
  atime: string
  t1eg1: string
  t1eg2: string
  t1eg3: string
  t1eg4: string
  t1egsum1: string
  t1dg1: string
  t1dg2: string
  t1dg3: string
  t1dg4: string
  t1dg5: string
  t1dg6: string
  t1dgsum1: string
  t2eg1: string
  t2eg2: string
  t2egsum1: string
  t2dg1: string
  t2dg2: string
  t2dgsum2: string
  tmp1: string
  tmp2: string
}

export function formatTimeLabel(atime: string) {
  const [start] = atime.split('_')
  return `${start}시`
}

export function formatTimeRange(atime: string) {
  const [start, end] = atime.split('_')
  return `${start}:00–${end}:00`
}

export function toNumber(value: string) {
  const num = Number(value)
  return Number.isNaN(num) ? 0 : Math.round(num)
}

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

/** API selectdate: 오늘=0, 내일=1. 그 외는 null */
export function getSelectDate(dateValue: string): '0' | '1' | null {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (dateValue === toDateInputValue(today)) return '0'
  if (dateValue === toDateInputValue(tomorrow)) return '1'
  return null
}

/** 시각(시)에 해당하는 API atime 슬롯 시작 시각 (예: 14 → "14") */
export function getHourKey(timeValue: string) {
  return timeValue.slice(0, 2)
}

export function findItemByHour(items: PassengerItem[], hourKey: string) {
  return items.find((item) => item.atime.split('_')[0] === hourKey)
}

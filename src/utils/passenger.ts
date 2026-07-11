import type { PassengerItem } from '../types'

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

export function getPassengerTotal(item: PassengerItem) {
  return (
    toNumber(item.t1egsum1) +
    toNumber(item.t1dgsum1) +
    toNumber(item.t2egsum1) +
    toNumber(item.t2dgsum2)
  )
}

export function findItemByHour(items: PassengerItem[], hourKey: string) {
  return items.find((item) => item.atime.split('_')[0] === hourKey)
}

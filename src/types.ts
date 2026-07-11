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

export function toNumber(value: string) {
  const num = Number(value)
  return Number.isNaN(num) ? 0 : Math.round(num)
}

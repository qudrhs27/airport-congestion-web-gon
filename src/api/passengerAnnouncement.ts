import type { PassengerItem } from '../types'

function normalizeItems(rawItems: unknown): PassengerItem[] {
  if (Array.isArray(rawItems)) {
    return rawItems as PassengerItem[]
  }

  if (rawItems && typeof rawItems === 'object' && 'item' in rawItems) {
    const item = (rawItems as { item: PassengerItem | PassengerItem[] }).item
    return Array.isArray(item) ? item : [item]
  }

  return []
}

export async function fetchPassengerAnnouncement(
  selectdate: string,
): Promise<PassengerItem[]> {
  const baseUrl = import.meta.env.VITE_BASE_URL
  const apiKey = import.meta.env.VITE_API_KEY

  if (!baseUrl || !apiKey) {
    throw new Error('환경 변수가 없습니다. .env 확인 후 개발 서버를 재시작하세요.')
  }

  const query = new URLSearchParams({
    type: 'json',
    selectdate,
    numOfRows: '100',
    pageNo: '1',
  })
  const url = `${baseUrl}/getPassgrAnncmt?serviceKey=${apiKey}&${query.toString()}`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`)
  }

  const data = await res.json()
  console.log('인천공항 승객예고 데이터:', data)

  return normalizeItems(data?.response?.body?.items)
}

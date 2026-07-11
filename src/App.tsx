import { useEffect, useState } from 'react'
import PassengerChart from './PassengerChart'
import type { PassengerItem } from './types'
import './App.css'

function App() {
  const [status, setStatus] = useState('데이터 요청 중...')
  const [items, setItems] = useState<PassengerItem[]>([])

  const fetchPassengerAnnouncement = async (selectdate: string = '0') => {
    const baseUrl = import.meta.env.VITE_BASE_URL
    const apiKey = import.meta.env.VITE_API_KEY

    if (!baseUrl || !apiKey) {
      setStatus('환경 변수가 없습니다. .env 확인 후 개발 서버를 재시작하세요.')
      return
    }

    const query = new URLSearchParams({
      type: 'json',
      selectdate,
      numOfRows: '100',
      pageNo: '1',
    })
    const url = `${baseUrl}/getPassgrAnncmt?serviceKey=${apiKey}&${query.toString()}`

    setStatus('데이터 요청 중...')

    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`)

      const data = await res.json()
      console.log('인천공항 승객예고 데이터:', data)

      const rawItems = data?.response?.body?.items
      const list: PassengerItem[] = Array.isArray(rawItems)
        ? rawItems
        : rawItems?.item
          ? Array.isArray(rawItems.item)
            ? rawItems.item
            : [rawItems.item]
          : []

      setItems(list)
      setStatus(list.length > 0 ? `총 ${list.length}건` : '조회된 데이터가 없습니다.')
    } catch (error) {
      console.error('승객예고 데이터 조회 실패:', error)
      setStatus(`조회 실패: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  useEffect(() => {
    fetchPassengerAnnouncement('0')
  }, [])

  return (
    <main className="page">
      <header className="page-header">
        <h1>인천공항 승객예고</h1>
        <p className="page-status">{status}</p>
      </header>

      <section className="chart-section" aria-label="시간대별 승객예고 차트">
        <PassengerChart items={items} />
      </section>
    </main>
  )
}

export default App

import { useEffect, useState } from 'react'
import CongestionDetail from './CongestionDetail'
import PassengerChart from './PassengerChart'
import {
  findItemByHour,
  getHourKey,
  getSelectDate,
  toDateInputValue,
  toTimeInputValue,
  type PassengerItem,
} from './types'
import './App.css'

function getNowInputs() {
  const now = new Date()
  return {
    date: toDateInputValue(now),
    time: toTimeInputValue(now),
  }
}

function App() {
  const initial = getNowInputs()
  const [status, setStatus] = useState('데이터 요청 중...')
  const [items, setItems] = useState<PassengerItem[]>([])
  const [dateValue, setDateValue] = useState(initial.date)
  const [timeValue, setTimeValue] = useState(initial.time)
  const [selectedItem, setSelectedItem] = useState<PassengerItem | null>(null)
  const [detailMessage, setDetailMessage] = useState<string | undefined>()
  const [loadedSelectDate, setLoadedSelectDate] = useState('0')

  const today = toDateInputValue(new Date())
  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrow = toDateInputValue(tomorrowDate)

  const fetchPassengerAnnouncement = async (selectdate: string) => {
    const baseUrl = import.meta.env.VITE_BASE_URL
    const apiKey = import.meta.env.VITE_API_KEY

    if (!baseUrl || !apiKey) {
      setStatus('환경 변수가 없습니다. .env 확인 후 개발 서버를 재시작하세요.')
      return [] as PassengerItem[]
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
      setLoadedSelectDate(selectdate)
      setStatus(list.length > 0 ? `총 ${list.length}건` : '조회된 데이터가 없습니다.')
      return list
    } catch (error) {
      console.error('승객예고 데이터 조회 실패:', error)
      setStatus(`조회 실패: ${error instanceof Error ? error.message : String(error)}`)
      return [] as PassengerItem[]
    }
  }

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

  const handleShowCongestion = async () => {
    const selectdate = getSelectDate(dateValue)

    if (selectdate == null) {
      setSelectedItem(null)
      setDetailMessage('조회 가능 일자는 오늘과 내일뿐입니다.')
      return
    }

    let list = items
    if (selectdate !== loadedSelectDate || list.length === 0) {
      list = await fetchPassengerAnnouncement(selectdate)
    }

    applyTimeSlot(list, timeValue)
  }

  const handleResetToNow = async () => {
    const now = getNowInputs()
    setDateValue(now.date)
    setTimeValue(now.time)

    const list = await fetchPassengerAnnouncement('0')
    applyTimeSlot(list, now.time)
  }

  useEffect(() => {
    const boot = async () => {
      const list = await fetchPassengerAnnouncement('0')
      applyTimeSlot(list, getNowInputs().time)
    }
    boot()
  }, [])

  return (
    <main className="page">
      <header className="page-header">
        <h1>인천공항 승객예고</h1>
        <p className="page-status">{status}</p>
      </header>

      <section className="time-picker" aria-label="출발 시간 선택">
        <h2 className="time-picker-title">출발 시간 선택</h2>
        <p className="time-picker-desc">
          오늘·내일 날짜와 시간을 고른 뒤 해당 시간대 혼잡도를 확인하세요.
        </p>

        <div className="time-picker-row">
          <label className="field">
            <span>날짜</span>
            <input
              type="date"
              value={dateValue}
              min={today}
              max={tomorrow}
              onChange={(e) => setDateValue(e.target.value)}
            />
          </label>

          <label className="field">
            <span>시간</span>
            <input
              type="time"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
            />
          </label>
        </div>

        <div className="time-picker-actions">
          <button type="button" className="btn btn-primary" onClick={handleShowCongestion}>
            이 시간대 혼잡도 보기
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleResetToNow}>
            현재 시간으로 돌아가기
          </button>
        </div>
      </section>

      <CongestionDetail item={selectedItem} message={detailMessage} />

      <section className="chart-section" aria-label="시간대별 승객예고 차트">
        <PassengerChart items={items} highlightHour={selectedItem?.atime.split('_')[0]} />
      </section>
    </main>
  )
}

export default App

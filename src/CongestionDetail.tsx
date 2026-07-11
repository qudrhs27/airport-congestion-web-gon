import {
  formatTimeRange,
  toNumber,
  type PassengerItem,
} from './types'
import './CongestionDetail.css'

type CongestionDetailProps = {
  item: PassengerItem | null
  message?: string
}

const METRICS = [
  { key: 't1egsum1', label: 'T1 입국 합계', tone: 'entry' },
  { key: 't1dgsum1', label: 'T1 출국 합계', tone: 'departure' },
  { key: 't2egsum1', label: 'T2 입국 합계', tone: 'entry' },
  { key: 't2dgsum2', label: 'T2 출국 합계', tone: 'departure' },
] as const

function CongestionDetail({ item, message }: CongestionDetailProps) {
  if (!item) {
    return (
      <section className="detail-panel detail-empty">
        <h2>선택한 시간대 혼잡도</h2>
        <p>{message ?? '날짜와 시간을 선택한 뒤 조회해 주세요.'}</p>
      </section>
    )
  }

  const dateLabel =
    item.adate.length === 8
      ? `${item.adate.slice(0, 4)}.${item.adate.slice(4, 6)}.${item.adate.slice(6, 8)}`
      : item.adate

  const total =
    toNumber(item.t1egsum1) +
    toNumber(item.t1dgsum1) +
    toNumber(item.t2egsum1) +
    toNumber(item.t2dgsum2)

  return (
    <section className="detail-panel">
      <h2>선택한 시간대 혼잡도</h2>
      <p className="detail-meta">
        {dateLabel} · {formatTimeRange(item.atime)}
      </p>

      <div className="detail-total">
        <span className="detail-label">전체 Total</span>
        <strong className="detail-value">
          {total.toLocaleString('ko-KR')}
          <span className="detail-unit">명</span>
        </strong>
      </div>

      <ul className="detail-metrics">
        {METRICS.map((metric) => (
          <li className={`detail-metric tone-${metric.tone}`} key={metric.key}>
            <span className="detail-label">{metric.label}</span>
            <strong className="detail-value">
              {toNumber(item[metric.key]).toLocaleString('ko-KR')}
              <span className="detail-unit">명</span>
            </strong>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CongestionDetail

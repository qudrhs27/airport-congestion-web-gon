import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  formatTimeLabel,
  toNumber,
  type PassengerItem,
} from './types'
import './PassengerChart.css'

type PassengerChartProps = {
  items: PassengerItem[]
  highlightHour?: string
}

const SERIES = [
  { key: 't1Entry', name: 'T1 입국', color: '#0b6e99' },
  { key: 't1Departure', name: 'T1 출국', color: '#c45c26' },
  { key: 't2Entry', name: 'T2 입국', color: '#1a7a5c' },
  { key: 't2Departure', name: 'T2 출국', color: '#8b5a2b' },
] as const

function PassengerChart({ items, highlightHour }: PassengerChartProps) {
  const chartData = items.map((item) => ({
    time: formatTimeLabel(item.atime),
    t1Entry: toNumber(item.t1egsum1),
    t1Departure: toNumber(item.t1dgsum1),
    t2Entry: toNumber(item.t2egsum1),
    t2Departure: toNumber(item.t2dgsum2),
  }))

  const highlightLabel = highlightHour ? `${highlightHour}시` : undefined

  if (chartData.length === 0) {
    return <p className="chart-empty">표시할 차트 데이터가 없습니다.</p>
  }

  return (
    <div className="chart-panel">
      <h2 className="chart-title">시간대별 예상 승객 수</h2>
      <p className="chart-desc">터미널·출입국 합계 추이</p>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={360}>
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tick={{ fill: 'var(--text)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              tick={{ fill: 'var(--text)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              width={56}
              tickFormatter={(value: number) => value.toLocaleString('ko-KR')}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--text-h)',
              }}
              formatter={(value, name) => [
                `${Number(value).toLocaleString('ko-KR')}명`,
                String(name),
              ]}
              labelFormatter={(label) => `시간대 ${label}`}
            />
            <Legend />
            {highlightLabel && (
              <ReferenceLine
                x={highlightLabel}
                stroke="#0b6e99"
                strokeDasharray="4 4"
                label={{
                  value: '선택',
                  position: 'insideTopRight',
                  fill: '#0b6e99',
                  fontSize: 12,
                }}
              />
            )}
            {SERIES.map((series) => (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                name={series.name}
                stroke={series.color}
                strokeWidth={2.5}
                dot={{ r: 3, strokeWidth: 0, fill: series.color }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PassengerChart

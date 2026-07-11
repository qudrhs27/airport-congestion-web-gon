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

const TERMINAL_SERIES = [
  { key: 't1Entry', name: 'T1 입국', color: '#0b6e99' },
  { key: 't1Departure', name: 'T1 출국', color: '#c45c26' },
  { key: 't2Entry', name: 'T2 입국', color: '#1a7a5c' },
  { key: 't2Departure', name: 'T2 출국', color: '#8b5a2b' },
] as const

type ChartPoint = {
  time: string
  t1Entry: number
  t1Departure: number
  t2Entry: number
  t2Departure: number
  total: number
}

type ChartBlockProps = {
  title: string
  description: string
  data: ChartPoint[]
  series: readonly { key: keyof ChartPoint; name: string; color: string }[]
  highlightLabel?: string
  height?: number
}

function ChartBlock({
  title,
  description,
  data,
  series,
  highlightLabel,
  height = 320,
}: ChartBlockProps) {
  return (
    <div className="chart-block">
      <h2 className="chart-title">{title}</h2>
      <p className="chart-desc">{description}</p>
      <div className="chart-wrap" style={{ minHeight: height }}>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
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
            {series.map((item) => (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.name}
                stroke={item.color}
                strokeWidth={2.5}
                dot={{ r: 3, strokeWidth: 0, fill: item.color }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function PassengerChart({ items, highlightHour }: PassengerChartProps) {
  const chartData: ChartPoint[] = items.map((item) => {
    const t1Entry = toNumber(item.t1egsum1)
    const t1Departure = toNumber(item.t1dgsum1)
    const t2Entry = toNumber(item.t2egsum1)
    const t2Departure = toNumber(item.t2dgsum2)

    return {
      time: formatTimeLabel(item.atime),
      t1Entry,
      t1Departure,
      t2Entry,
      t2Departure,
      total: t1Entry + t1Departure + t2Entry + t2Departure,
    }
  })

  const highlightLabel = highlightHour ? `${highlightHour}시` : undefined

  if (chartData.length === 0) {
    return <p className="chart-empty">표시할 차트 데이터가 없습니다.</p>
  }

  return (
    <div className="chart-panel">
      <ChartBlock
        title="터미널별 출입국"
        description="T1·T2 입국/출국 합계를 시간대별로 비교합니다."
        data={chartData}
        series={TERMINAL_SERIES}
        highlightLabel={highlightLabel}
      />

      <ChartBlock
        title="전체 Total"
        description="시간대별 전체 예상 승객 수(터미널 합산)입니다."
        data={chartData}
        series={[{ key: 'total', name: 'Total', color: '#334155' }]}
        highlightLabel={highlightLabel}
        height={280}
      />
    </div>
  )
}

export default PassengerChart

import { useEffect, useState } from 'react'
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
  compact?: boolean
}

function useCompactLayout(breakpoint = 640) {
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${breakpoint}px)`).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const update = () => setCompact(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [breakpoint])

  return compact
}

function ChartBlock({
  title,
  description,
  data,
  series,
  highlightLabel,
  height = 320,
  compact = false,
}: ChartBlockProps) {
  const chartHeight = compact ? Math.min(height, 260) : height
  const tickSize = compact ? 10 : 12
  const yAxisWidth = compact ? 44 : 56

  return (
    <div className="chart-block">
      <h2 className="chart-title">{title}</h2>
      <p className="chart-desc">{description}</p>
      <div className="chart-wrap" style={{ minHeight: chartHeight }}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart
            data={data}
            margin={{
              top: 8,
              right: compact ? 8 : 16,
              left: 0,
              bottom: compact ? 4 : 8,
            }}
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tick={{ fill: 'var(--text)', fontSize: tickSize }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              interval={compact ? 'preserveStartEnd' : 0}
              minTickGap={compact ? 12 : 4}
            />
            <YAxis
              tick={{ fill: 'var(--text)', fontSize: tickSize }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              width={yAxisWidth}
              tickFormatter={(value: number) => value.toLocaleString('ko-KR')}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--text-h)',
                fontSize: compact ? 12 : 14,
              }}
              formatter={(value, name) => [
                `${Number(value).toLocaleString('ko-KR')}명`,
                String(name),
              ]}
              labelFormatter={(label) => `시간대 ${label}`}
            />
            <Legend wrapperStyle={{ fontSize: compact ? 12 : 14 }} />
            {highlightLabel && (
              <ReferenceLine
                x={highlightLabel}
                stroke="#0b6e99"
                strokeDasharray="4 4"
                label={{
                  value: '선택',
                  position: 'insideTopRight',
                  fill: '#0b6e99',
                  fontSize: tickSize,
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
                strokeWidth={compact ? 2 : 2.5}
                dot={{ r: compact ? 2 : 3, strokeWidth: 0, fill: item.color }}
                activeDot={{ r: compact ? 4 : 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function PassengerChart({ items, highlightHour }: PassengerChartProps) {
  const compact = useCompactLayout()

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
        compact={compact}
      />

      <ChartBlock
        title="전체 Total"
        description="시간대별 전체 예상 승객 수(터미널 합산)입니다."
        data={chartData}
        series={[{ key: 'total', name: 'Total', color: '#334155' }]}
        highlightLabel={highlightLabel}
        height={280}
        compact={compact}
      />
    </div>
  )
}

export default PassengerChart

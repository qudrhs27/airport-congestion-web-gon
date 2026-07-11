import './TimePicker.css'

type TimePickerProps = {
  dateValue: string
  timeValue: string
  today: string
  tomorrow: string
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
  onShowCongestion: () => void
  onResetToNow: () => void
}

export default function TimePicker({
  dateValue,
  timeValue,
  today,
  tomorrow,
  onDateChange,
  onTimeChange,
  onShowCongestion,
  onResetToNow,
}: TimePickerProps) {
  return (
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
            onChange={(e) => onDateChange(e.target.value)}
          />
        </label>

        <label className="field">
          <span>시간</span>
          <input
            type="time"
            value={timeValue}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </label>
      </div>

      <div className="time-picker-actions">
        <button type="button" className="btn btn-primary" onClick={onShowCongestion}>
          이 시간대 혼잡도 보기
        </button>
        <button type="button" className="btn btn-secondary" onClick={onResetToNow}>
          현재 시간으로 돌아가기
        </button>
      </div>
    </section>
  )
}

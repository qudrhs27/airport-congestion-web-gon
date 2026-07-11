import AlertBanner from './components/AlertBanner'
import CongestionAlertSettingsPanel from './components/CongestionAlertSettings'
import CongestionDetail from './components/CongestionDetail'
import FavoriteSlots from './components/FavoriteSlots'
import LoadingSpinner from './components/LoadingSpinner'
import PageHeader from './components/PageHeader'
import PassengerChart from './components/PassengerChart'
import TimePicker from './components/TimePicker'
import { useCongestionAlert } from './hooks/useCongestionAlert'
import { useFavoriteSlots } from './hooks/useFavoriteSlots'
import { usePassengerCongestion } from './hooks/usePassengerCongestion'
import { useTheme } from './hooks/useTheme'
import type { FavoriteSlot } from './types'
import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const {
    status,
    isLoading,
    items,
    dateValue,
    setDateValue,
    timeValue,
    setTimeValue,
    selectedItem,
    detailMessage,
    today,
    tomorrow,
    showCongestion,
    resetToNow,
    selectSlot,
  } = usePassengerCongestion()

  const {
    settings: alertSettings,
    updateSettings: updateAlertSettings,
    activeAlert,
    dismissAlert,
    requestNotificationPermission,
  } = useCongestionAlert({ selectedItem })

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavoriteSlots()

  const handleAddFavorite = () => {
    const result = addFavorite(dateValue, timeValue)
    if (!result.ok && result.reason === 'limit') {
      window.alert('즐겨찾기는 최대 8개까지 저장할 수 있습니다.')
    }
  }

  const handleSelectFavorite = (slot: FavoriteSlot) => {
    void selectSlot(slot.dateValue, slot.timeValue)
  }

  return (
    <main className="page">
      <PageHeader
        status={status}
        isLoading={isLoading}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <AlertBanner alert={activeAlert} onDismiss={dismissAlert} />

      <TimePicker
        dateValue={dateValue}
        timeValue={timeValue}
        today={today}
        tomorrow={tomorrow}
        onDateChange={setDateValue}
        onTimeChange={setTimeValue}
        onShowCongestion={showCongestion}
        onResetToNow={resetToNow}
      />

      <FavoriteSlots
        favorites={favorites}
        dateValue={dateValue}
        timeValue={timeValue}
        isFavorite={isFavorite(dateValue, timeValue)}
        onAdd={handleAddFavorite}
        onRemove={removeFavorite}
        onSelect={handleSelectFavorite}
      />

      <CongestionAlertSettingsPanel
        settings={alertSettings}
        onChange={updateAlertSettings}
        onRequestPermission={requestNotificationPermission}
      />

      {isLoading ? (
        <div className="loading-overlay">
          <LoadingSpinner label="혼잡도 데이터를 불러오는 중…" />
        </div>
      ) : (
        <CongestionDetail item={selectedItem} message={detailMessage} />
      )}

      <section className="chart-section" aria-label="시간대별 승객예고 차트">
        {isLoading ? (
          <div className="loading-overlay">
            <LoadingSpinner label="차트를 준비하는 중…" />
          </div>
        ) : (
          <PassengerChart
            items={items}
            highlightHour={selectedItem?.atime.split('_')[0]}
            theme={theme}
          />
        )}
      </section>
    </main>
  )
}

export default App

import type { FavoriteSlot } from '../types'
import { formatFavoriteLabel } from '../utils/favoriteStorage'
import './FavoriteSlots.css'

type FavoriteSlotsProps = {
  favorites: FavoriteSlot[]
  dateValue: string
  timeValue: string
  isFavorite: boolean
  onAdd: () => void
  onRemove: (id: string) => void
  onSelect: (slot: FavoriteSlot) => void
}

export default function FavoriteSlots({
  favorites,
  dateValue,
  timeValue,
  isFavorite,
  onAdd,
  onRemove,
  onSelect,
}: FavoriteSlotsProps) {
  return (
    <section className="feature-panel" aria-label="즐겨찾기 시간대">
      <div className="feature-heading-row">
        <div>
          <h2 className="feature-title">즐겨찾기 시간대</h2>
          <p className="feature-desc">자주 확인하는 날짜·시간을 저장해 바로 조회하세요.</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onAdd}
          disabled={isFavorite}
        >
          {isFavorite ? '이미 저장됨' : '현재 시간대 저장'}
        </button>
      </div>

      {favorites.length === 0 ? (
        <p className="favorite-empty">
          저장된 시간대가 없습니다. 날짜와 시간을 고른 뒤 저장해 보세요.
          <span className="favorite-current">
            {' '}
            (현재: {formatFavoriteLabel(dateValue, timeValue)})
          </span>
        </p>
      ) : (
        <ul className="favorite-list">
          {favorites.map((slot) => (
            <li key={slot.id} className="favorite-item">
              <button
                type="button"
                className="favorite-select"
                onClick={() => onSelect(slot)}
              >
                {formatFavoriteLabel(slot.dateValue, slot.timeValue)}
              </button>
              <button
                type="button"
                className="btn btn-secondary favorite-remove"
                onClick={() => onRemove(slot.id)}
                aria-label={`${formatFavoriteLabel(slot.dateValue, slot.timeValue)} 삭제`}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

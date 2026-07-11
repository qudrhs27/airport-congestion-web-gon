export type CongestionLevel = 'relaxed' | 'normal' | 'busy' | 'crowded'

export type CongestionLevelInfo = {
  level: CongestionLevel
  label: string
  emoji: string
  description: string
}

export function getCongestionLevel(total: number): CongestionLevelInfo {
  if (total >= 20000) {
    return {
      level: 'crowded',
      label: '매우 혼잡',
      emoji: '🥵',
      description: '예상 승객이 매우 많습니다.',
    }
  }
  if (total >= 15000) {
    return {
      level: 'busy',
      label: '혼잡',
      emoji: '😓',
      description: '대기 시간이 길어질 수 있습니다.',
    }
  }
  if (total >= 10000) {
    return {
      level: 'normal',
      label: '보통',
      emoji: '🙂',
      description: '무난한 수준의 혼잡도입니다.',
    }
  }
  return {
    level: 'relaxed',
    label: '여유',
    emoji: '😌',
    description: '비교적 한산한 시간대입니다.',
  }
}

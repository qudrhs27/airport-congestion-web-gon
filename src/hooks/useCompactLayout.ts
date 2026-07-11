import { useEffect, useState } from 'react'

export function useCompactLayout(breakpoint = 640) {
  const [compact, setCompact] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia(`(max-width: ${breakpoint}px)`).matches,
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

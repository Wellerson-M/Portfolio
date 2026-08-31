'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Lê uma media query sem chamar setState dentro de effect. No servidor devolve
 * false, então o comportamento padrão é sempre o do cliente sem preferência.
 */
export default function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

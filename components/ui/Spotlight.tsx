'use client'

import { useEffect, useRef, useState } from 'react'
import useMediaQuery from '@/components/ui/useMediaQuery'

/**
 * Efeito unico de mouse do site: uma luz clara e bem fraca seguindo o
 * cursor, so pra superficie reagir ao movimento.
 *
 * Nao renderiza em dispositivo sem ponteiro fino (touch) nem quando o usuario
 * pede movimento reduzido.
 */
export default function Spotlight() {
  const fine = useMediaQuery('(pointer: fine)')
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)')
  const enabled = fine && !calm

  const [active, setActive] = useState(false)
  const frame = useRef<number | null>(null)
  const next = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) return

    const root = document.documentElement

    const flush = () => {
      frame.current = null
      root.style.setProperty('--spot-x', `${next.current.x}px`)
      root.style.setProperty('--spot-y', `${next.current.y}px`)
    }

    const onMove = (event: MouseEvent) => {
      next.current = { x: event.clientX, y: event.clientY }
      setActive(true)
      frame.current ??= requestAnimationFrame(flush)
    }

    const onLeave = () => setActive(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onLeave)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [enabled])

  if (!enabled) return null

  return <div className="spotlight-layer" data-active={active} aria-hidden />
}

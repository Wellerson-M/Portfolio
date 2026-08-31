'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Atraso em ms, para escalonar itens de uma mesma lista. */
  delay?: number
  as?: ElementType
  className?: string
}

/** Fade curto + slide up quando a seção entra na viewport. Dispara uma vez. */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Movimento reduzido é tratado no CSS, que já deixa .reveal visível e sem
    // transição. Aqui basta observar.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-shown={shown}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}

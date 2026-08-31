'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  title: string
}

/**
 * Deploy real rodando dentro de uma moldura de celular. O iframe só é montado
 * quando a moldura entra na viewport, pra não puxar dois sites no load da home.
 */
export default function LiveFrame({ src, title }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setMounted(true)
        observer.disconnect()
      },
      { rootMargin: '200px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="mx-auto w-full max-w-[300px]">
      <div className="relative rounded-[2.25rem] border border-graphite-700 bg-graphite-850 p-2.5 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]">
        <div className="absolute top-3.5 left-1/2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-graphite-700" />
        <div className="relative aspect-[9/19] overflow-hidden rounded-[1.75rem] bg-graphite-900">
          {mounted && (
            <iframe
              src={src}
              title={title}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              className="h-full w-full border-0"
            />
          )}
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-graphite-900">
              <p className="font-mono text-xs text-ink-500">
                carregando demo<span className="caret" />
              </p>
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-[0.7rem] text-ink-600">
        deploy ao vivo, interativo
      </p>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  title: string
  device: 'phone' | 'laptop'
}

/**
 * Deploy real rodando dentro de uma moldura. O iframe só monta quando a
 * moldura entra na viewport, pra não puxar dois sites no load da home.
 */
export default function LiveFrame({ src, title, device }: Props) {
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
      { rootMargin: '250px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const frame = (
    <>
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
            carregando<span className="caret" />
          </p>
        </div>
      )}
    </>
  )

  if (device === 'laptop') {
    return (
      <div ref={ref} className="mx-auto w-full max-w-3xl">
        <div className="rounded-t-2xl border border-b-0 border-graphite-700 bg-graphite-850 p-3 sm:p-4">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-graphite-900">
            {frame}
          </div>
        </div>
        {/* Base do notebook, com o recorte do trackpad. */}
        <div className="relative h-4 rounded-b-xl border border-graphite-700 bg-graphite-800 sm:h-5">
          <div className="absolute top-0 left-1/2 h-1.5 w-24 -translate-x-1/2 rounded-b-lg bg-graphite-700" />
        </div>
        <div className="mx-auto h-1 w-[88%] rounded-b-xl bg-graphite-750/70" />
      </div>
    )
  }

  return (
    <div ref={ref} className="mx-auto w-full max-w-[340px]">
      <div className="relative rounded-[2.6rem] border border-graphite-700 bg-graphite-850 p-3 shadow-[0_36px_80px_-32px_rgba(0,0,0,0.9)]">
        <div className="absolute top-4 left-1/2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-graphite-700" />
        <div className="relative aspect-[9/19] overflow-hidden rounded-[2rem] bg-graphite-900">
          {frame}
        </div>
      </div>
    </div>
  )
}

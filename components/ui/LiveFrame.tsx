'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  title: string
  device: 'phone' | 'laptop'
  poster: string
}

/** Tamanho em que o site é desenhado antes de ser reduzido para a moldura:
 *  assim ele aparece no layout real de PC ou de celular, e não num meio-termo. */
const VIEWPORT = {
  laptop: { width: 1440, height: 900 },
  phone: { width: 390, height: 844 },
} as const

/**
 * Deploy real rodando dentro de uma moldura de notebook ou celular.
 *
 * O iframe só monta quando a moldura chega perto da tela, e o print fica por
 * cima até o site terminar de carregar. A interação é liberada com um clique,
 * pra rolagem da página não ficar presa dentro do site.
 */
export default function LiveFrame({ src, title, device, poster }: Props) {
  const screen = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const [near, setNear] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [active, setActive] = useState(false)
  const view = VIEWPORT[device]

  useEffect(() => {
    const node = screen.current
    if (!node) return

    const resize = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / view.width),
    )
    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNear(true)
        approach.disconnect()
      },
      { rootMargin: '400px' },
    )

    resize.observe(node)
    approach.observe(node)
    return () => {
      resize.disconnect()
      approach.disconnect()
    }
  }, [view.width])

  const content = (
    <div
      ref={screen}
      onMouseLeave={() => setActive(false)}
      className="relative overflow-hidden bg-graphite-900"
      style={{ aspectRatio: `${view.width} / ${view.height}` }}
    >
      {near && scale > 0 && (
        <iframe
          src={src}
          title={title}
          // Folga pra tela de abertura do app passar antes de tirar o print da frente
          onLoad={() => window.setTimeout(() => setLoaded(true), 1500)}
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          className="absolute top-0 left-0 origin-top-left border-0"
          style={{
            width: view.width,
            height: view.height,
            transform: `scale(${scale})`,
            pointerEvents: active ? 'auto' : 'none',
          }}
        />
      )}

      <Image
        src={poster}
        alt=""
        fill
        sizes={device === 'laptop' ? '900px' : '320px'}
        className={`object-cover object-top transition-opacity duration-700 ${
          loaded ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      />

      {!active && (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Interagir com ${title}`}
          className="group absolute inset-0 flex cursor-pointer items-end justify-center pb-[6%]"
        >
          <span className="rounded-full border border-graphite-600/80 bg-graphite-950/80 px-4 py-2 font-mono text-xs text-ink-200 shadow-lg backdrop-blur transition-all duration-300 group-hover:border-amber-400/70 group-hover:text-amber-200">
            {loaded ? 'clique para testar' : 'carregando…'}
          </span>
        </button>
      )}
    </div>
  )

  if (device === 'laptop') {
    return (
      <div className="mx-auto w-full max-w-4xl px-[4%]">
        {/* Tampa: moldura escura fina em volta da tela */}
        <div className="rounded-t-[1.1rem] border border-graphite-700 bg-[#1c1f24] p-[1.4%] pb-[2%] shadow-[0_50px_90px_-50px_rgba(0,0,0,0.95)]">
          <div className="overflow-hidden rounded-[0.3rem]">{content}</div>
        </div>
        {/* Base vista de frente, um pouco mais larga que a tampa */}
        <div className="relative -mx-[5%] h-3 rounded-b-[1.2rem] border border-t-0 border-graphite-600 bg-gradient-to-b from-graphite-600 to-graphite-800 sm:h-4">
          <div className="absolute top-0 left-1/2 h-1.5 w-[15%] -translate-x-1/2 rounded-b-md bg-graphite-800" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[300px]">
      <div className="relative rounded-[2.6rem] border border-graphite-700 bg-[#1c1f24] p-2.5 shadow-[0_36px_80px_-32px_rgba(0,0,0,0.9)]">
        <div className="overflow-hidden rounded-[2.1rem]">{content}</div>
        <div className="pointer-events-none absolute top-4 left-1/2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-black/60" />
      </div>
    </div>
  )
}

'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import type { Shot } from '@/lib/projects'

type Props = {
  shots: Shot[]
  shape?: Shape
}

export type Shape = 'phone' | 'screen' | 'wide'

/**
 * Cada conjunto de prints tem a proporção do que foi capturado: celular em pé,
 * mockup de sistema em 5:4, print de tela cheia em 16:9. Errar isso deixa
 * tarja sobrando na moldura ou corta a lateral da interface.
 */
const SHAPES = {
  phone: {
    stage: 'h-[26rem] sm:h-[32rem]',
    slide: 'h-[26rem] w-[12.4rem] sm:h-[32rem] sm:w-[15.3rem]',
    step: 78,
    sizes: '250px',
    fit: 'object-cover object-top',
  },
  screen: {
    stage: 'h-[15rem] sm:h-[21rem] lg:h-[25rem]',
    slide: 'h-[15rem] w-[18.75rem] sm:h-[21rem] sm:w-[26.25rem] lg:h-[25rem] lg:w-[31.25rem]',
    step: 60,
    sizes: '500px',
    fit: 'object-contain',
  },
  wide: {
    stage: 'h-[13rem] sm:h-[19rem] lg:h-[23rem]',
    slide: 'h-[13rem] w-[23.1rem] sm:h-[19rem] sm:w-[33.8rem] lg:h-[23rem] lg:w-[40.9rem]',
    step: 62,
    sizes: '660px',
    fit: 'object-contain',
  },
} as const

/**
 * Carrossel de três: o do meio nítido e em tamanho cheio, os dois vizinhos
 * menores e desfocados. Clicar num vizinho traz ele pro centro; clicar no
 * centro abre em tela cheia.
 */
export default function Carousel({ shots, shape = 'phone' }: Props) {
  const total = shots.length
  const [active, setActive] = useState(0)
  const [full, setFull] = useState(false)

  const go = useCallback(
    (delta: number) => setActive((current) => (current + delta + total) % total),
    [total],
  )

  useEffect(() => {
    if (!full) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFull(false)
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [full, go])

  const form = SHAPES[shape]

  return (
    <div>
      <div
        className={`relative flex items-center justify-center overflow-hidden ${form.stage}`}
      >
        {shots.map((shot, index) => {
          // Distância circular até o slide ativo, pra o carrossel dar a volta.
          let delta = index - active
          if (delta > total / 2) delta -= total
          if (delta < -total / 2) delta += total

          const off = Math.abs(delta)
          if (off > 1) return null

          const center = off === 0

          return (
            <button
              key={shot.src}
              type="button"
              onClick={() => (center ? setFull(true) : go(delta))}
              aria-label={center ? `Abrir em tela cheia: ${shot.alt}` : shot.alt}
              aria-current={center}
              className="carousel-slide absolute cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: `translateX(${delta * form.step}%) scale(${center ? 1 : 0.82})`,
                filter: center ? 'none' : 'blur(3px)',
                opacity: center ? 1 : 0.45,
                zIndex: center ? 2 : 1,
              }}
            >
              <span
                className={`relative block overflow-hidden rounded-xl border bg-graphite-900 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.85)] ${
                  center ? 'border-graphite-600' : 'border-graphite-800'
                } ${form.slide}`}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes={form.sizes}
                  className={form.fit}
                  priority={index === 0}
                />
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Anterior"
          className="cursor-pointer rounded-full border border-graphite-700 px-3 py-1.5 font-mono text-sm text-ink-400 transition-colors hover:border-amber-500 hover:text-amber-300"
        >
          &#8592;
        </button>

        <div className="flex items-center gap-2">
          {shots.map((shot, index) => (
            <button
              key={shot.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ir para a imagem ${index + 1}`}
              aria-current={index === active}
              className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                index === active
                  ? 'w-6 bg-amber-400'
                  : 'w-1.5 bg-graphite-700 hover:bg-graphite-600'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Próxima"
          className="cursor-pointer rounded-full border border-graphite-700 px-3 py-1.5 font-mono text-sm text-ink-400 transition-colors hover:border-amber-500 hover:text-amber-300"
        >
          &#8594;
        </button>
      </div>

      {full && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={shots[active].alt}
          onClick={() => setFull(false)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-graphite-950/96 p-5 backdrop-blur-sm sm:p-10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shots[active].src}
            alt={shots[active].alt}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[82vh] max-w-full rounded-xl border border-graphite-700 object-contain"
          />
          <div
            className="flex items-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Anterior"
              className="cursor-pointer rounded-full border border-graphite-700 px-3 py-1.5 font-mono text-sm text-ink-300 transition-colors hover:border-amber-500 hover:text-amber-300"
            >
              &#8592;
            </button>
            <span className="font-mono text-xs text-ink-500">
              {active + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima"
              className="cursor-pointer rounded-full border border-graphite-700 px-3 py-1.5 font-mono text-sm text-ink-300 transition-colors hover:border-amber-500 hover:text-amber-300"
            >
              &#8594;
            </button>
            <button
              type="button"
              onClick={() => setFull(false)}
              className="cursor-pointer rounded-full border border-graphite-700 px-3 py-1.5 font-mono text-xs text-ink-300 transition-colors hover:border-amber-500 hover:text-amber-300"
            >
              fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

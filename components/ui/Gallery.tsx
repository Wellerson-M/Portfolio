'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Shot } from '@/lib/projects'

type Props = {
  shots: Shot[]
  /** Proporção das miniaturas. Mockups de tela são largos, prints de celular são altos. */
  aspect?: 'wide' | 'tall'
  /** Permite ampliar e arrastar dentro do lightbox. Usado nos diagramas. */
  zoomable?: boolean
  className?: string
}

export default function Gallery({
  shots,
  aspect = 'wide',
  zoomable = false,
  className = '',
}: Props) {
  const [open, setOpen] = useState<number | null>(null)

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (delta: number) =>
      setOpen((current) =>
        current === null ? current : (current + delta + shots.length) % shots.length,
      ),
    [shots.length],
  )

  useEffect(() => {
    if (open === null) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close, step])

  return (
    <>
      <ul
        className={`grid gap-3 ${
          aspect === 'tall'
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        } ${className}`}
      >
        {shots.map((shot, index) => (
          <li key={shot.src}>
            <button
              type="button"
              onClick={() => setOpen(index)}
              className="group block w-full cursor-pointer text-left"
              aria-label={`Ampliar: ${shot.caption}`}
            >
              <span
                className={`relative block overflow-hidden rounded-md border border-graphite-750 bg-graphite-900 transition-colors group-hover:border-amber-600 ${
                  aspect === 'tall' ? 'aspect-[9/19]' : 'aspect-[16/10]'
                }`}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </span>
              <span className="mt-2 block font-mono text-xs text-ink-500 transition-colors group-hover:text-amber-300">
                {shot.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <Lightbox
          key={shots[open].src}
          shot={shots[open]}
          index={open}
          total={shots.length}
          zoomable={zoomable}
          onClose={close}
          onStep={step}
        />
      )}
    </>
  )
}

function Lightbox({
  shot,
  index,
  total,
  zoomable,
  onClose,
  onStep,
}: {
  shot: Shot
  index: number
  total: number
  zoomable: boolean
  onClose: () => void
  onStep: (delta: number) => void
}) {
  const [zoomed, setZoomed] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const drag = useRef<{ x: number; y: number } | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const onPointerDown = (event: React.PointerEvent) => {
    if (!zoomed) return
    drag.current = { x: event.clientX - offset.x, y: event.clientY - offset.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent) => {
    if (!drag.current) return
    setOffset({
      x: event.clientX - drag.current.x,
      y: event.clientY - drag.current.y,
    })
  }

  const onPointerUp = () => {
    drag.current = null
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shot.alt}
      className="fixed inset-0 z-50 flex flex-col bg-graphite-950/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-graphite-800 px-4 py-3 sm:px-6">
        <p className="font-mono text-xs text-ink-400">
          <span className="text-amber-300">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-ink-600"> / {String(total).padStart(2, '0')}</span>
          <span className="ml-3 text-ink-300">{shot.caption}</span>
        </p>
        <div className="flex items-center gap-1">
          {zoomable && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setZoomed((value) => !value)
                setOffset({ x: 0, y: 0 })
              }}
              className="cursor-pointer rounded border border-graphite-700 px-2.5 py-1 font-mono text-xs text-ink-300 transition-colors hover:border-amber-600 hover:text-amber-300"
            >
              {zoomed ? 'reduzir' : 'ampliar'}
            </button>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-graphite-700 px-2.5 py-1 font-mono text-xs text-ink-300 transition-colors hover:border-amber-600 hover:text-amber-300"
          >
            fechar esc
          </button>
        </div>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4 sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        {total > 1 && (
          <button
            type="button"
            onClick={() => onStep(-1)}
            aria-label="Imagem anterior"
            className="absolute left-2 z-10 cursor-pointer rounded-full border border-graphite-700 bg-graphite-900/80 px-3 py-2 font-mono text-sm text-ink-300 transition-colors hover:border-amber-600 hover:text-amber-300 sm:left-4"
          >
            &#8592;
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.src}
          alt={shot.alt}
          draggable={false}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoomed ? 2.1 : 1})`,
            cursor: zoomed ? 'grab' : 'default',
          }}
          className="max-h-full max-w-full rounded-md object-contain transition-transform duration-300 select-none"
        />

        {total > 1 && (
          <button
            type="button"
            onClick={() => onStep(1)}
            aria-label="Próxima imagem"
            className="absolute right-2 z-10 cursor-pointer rounded-full border border-graphite-700 bg-graphite-900/80 px-3 py-2 font-mono text-sm text-ink-300 transition-colors hover:border-amber-600 hover:text-amber-300 sm:right-4"
          >
            &#8594;
          </button>
        )}
      </div>
    </div>
  )
}

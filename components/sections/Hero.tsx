'use client'

import { useEffect, useState } from 'react'
import useMediaQuery from '@/components/ui/useMediaQuery'

const LINE = 'Gosto de resolver problemas com sistema.'

export default function Hero() {
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [typed, setTyped] = useState('')

  useEffect(() => {
    if (calm) return

    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setTyped(LINE.slice(0, index))
      if (index >= LINE.length) window.clearInterval(timer)
    }, 34)

    return () => window.clearInterval(timer)
  }, [calm])

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between px-6 py-10 sm:px-10 lg:px-16">
      <p className="font-mono text-xs tracking-tight text-ink-600 select-none">
        <span className="text-amber-600">~/portfolio</span>
        <span> $ whoami</span>
      </p>

      <div className="max-w-5xl">
        <h1 className="font-mono text-[length:var(--text-hero)] leading-[0.88] font-medium tracking-tighter text-ink-100">
          Wellerson
          <br />
          <span className="text-ink-400">Meredyk</span>
        </h1>

        <div className="mt-8 max-w-2xl border-l border-graphite-700 pl-5">
          <p className="text-lg text-ink-300 sm:text-xl">Engenharia de Software.</p>
          <p
            className="mt-1 min-h-[1.75rem] text-lg text-ink-100 sm:text-xl"
            aria-label={LINE}
          >
            <span aria-hidden>{calm ? LINE : typed}</span>
            <span className="caret" aria-hidden />
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-6">
        <a
          href="#sobre"
          className="group inline-flex items-center gap-2.5 font-mono text-xs text-ink-500 transition-colors hover:text-amber-300"
        >
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:translate-y-0.5"
          >
            &#8595;
          </span>
          rolar
        </a>
        <p className="hidden font-mono text-xs text-ink-600 sm:block">
          Joinville, SC
        </p>
      </div>
    </section>
  )
}

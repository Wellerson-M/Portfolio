'use client'

import { useEffect, useState } from 'react'
import useMediaQuery from '@/components/ui/useMediaQuery'
import { contact } from '@/lib/projects'

const LINE = 'Desenvolvimento web, APIs e banco de dados.'

export default function Hero() {
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [typed, setTyped] = useState('')

  // Com movimento reduzido a digitação continua, só mais rápida: é texto
  // aparecendo, não algo se deslocando pela tela.
  useEffect(() => {
    let index = 0
    const timer = window.setInterval(
      () => {
        index += 1
        setTyped(LINE.slice(0, index))
        if (index >= LINE.length) window.clearInterval(timer)
      },
      calm ? 14 : 38,
    )

    return () => window.clearInterval(timer)
  }, [calm])

  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] scroll-mt-28 flex-col justify-center px-6 pt-24 pb-24 sm:px-10 lg:px-16"
    >
      <div className="hero-in max-w-5xl">
        <p className="font-mono text-xs tracking-widest text-amber-400">
          ENGENHARIA DE SOFTWARE · JOINVILLE, SC
        </p>

        <h1 className="mt-6 font-mono text-[length:var(--text-hero)] leading-[0.9] font-medium tracking-tighter text-ink-100">
          Wellerson
          <br />
          <span className="text-ink-400">Meredyk</span>
        </h1>

        <p
          className="mt-8 min-h-[1.85rem] max-w-2xl border-l-2 border-amber-500/60 pl-5 text-lg text-ink-200 sm:text-xl"
          aria-label={LINE}
        >
          <span aria-hidden>{typed}</span>
          <span className="caret" aria-hidden />
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#projetos"
            className="rounded-full bg-amber-400 px-5 py-2.5 font-mono text-sm text-graphite-950 transition-colors hover:bg-amber-300"
          >
            ver projetos
          </a>
          <a
            href={contact.cv}
            download
            className="rounded-full border border-graphite-700 px-5 py-2.5 font-mono text-sm text-ink-200 transition-colors hover:border-amber-400/70 hover:text-amber-200"
          >
            baixar currículo
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 font-mono text-sm text-ink-400 transition-colors hover:text-amber-300"
          >
            github ↗
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 font-mono text-sm text-ink-400 transition-colors hover:text-amber-300"
          >
            linkedin ↗
          </a>
        </div>
      </div>

      <a
        href="#sobre"
        className="group absolute bottom-10 left-6 inline-flex items-center gap-2.5 font-mono text-xs text-ink-500 transition-colors hover:text-amber-300 sm:left-10 lg:left-16"
      >
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 group-hover:translate-y-0.5"
        >
          &#8595;
        </span>
        rolar
      </a>
    </section>
  )
}

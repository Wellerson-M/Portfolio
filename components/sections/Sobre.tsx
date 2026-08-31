'use client'

import { useState } from 'react'
import Reveal from '@/components/ui/Reveal'
import { SectionHeader } from '@/components/ui/bits'
import { about } from '@/lib/projects'

export default function Sobre() {
  const [open, setOpen] = useState(false)

  return (
    <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          <SectionHeader id="sobre" index="01" title="Sobre" />
          <p className="mt-4 font-mono text-xs leading-relaxed text-ink-500">
            {about.role}
          </p>
        </Reveal>

        <Reveal delay={90} className="max-w-2xl">
          <div className="space-y-5">
            {about.short.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-ink-200">
                {paragraph}
              </p>
            ))}
          </div>

          {/* O detalhe fica escondido por padrão pra seção não pesar. */}
          <div
            id="sobre-mais"
            hidden={!open}
            className="mt-6 space-y-5 border-l-2 border-graphite-750 pl-5"
          >
            {about.more.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-ink-300">
                {paragraph}
              </p>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="sobre-mais"
            className="group mt-7 inline-flex cursor-pointer items-center gap-2 rounded border border-graphite-700 px-3.5 py-2 font-mono text-sm text-ink-300 transition-colors hover:border-amber-500 hover:text-amber-300"
          >
            {open ? 'fechar' : 'sobre'}
            <span
              aria-hidden
              className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            >
              &#8595;
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  )
}

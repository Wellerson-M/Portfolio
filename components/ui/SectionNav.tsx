'use client'

import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'inicio', label: 'início' },
  { id: 'sobre', label: 'sobre' },
  { id: 'sigof', label: 'SIGOF' },
  { id: 'projetos', label: 'projetos' },
  { id: 'contato', label: 'contato' },
]

/**
 * Toggler fixo de navegação. Aparece depois que o hero sai da tela e marca a
 * seção visível no momento.
 */
export default function SectionNav() {
  const [active, setActive] = useState('inicio')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const nodes = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (node) => node !== null,
    )

    // A seção ativa é a última cujo topo já passou de um terço da viewport.
    const onScroll = () => {
      const line = window.innerHeight / 3
      let current = SECTIONS[0].id

      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= line) current = node.id
      }

      setActive(current)
      setVisible(window.scrollY > window.innerHeight * 0.6)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <nav
      aria-label="Seções"
      className={`fixed bottom-5 left-1/2 z-40 -translate-x-1/2 transition-all duration-500 sm:top-6 sm:bottom-auto ${
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0 sm:-translate-y-3'
      }`}
    >
      <ul className="flex items-center gap-0.5 rounded-full border border-graphite-750 bg-graphite-900/85 p-1 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? 'true' : undefined}
              className={`block rounded-full px-3 py-1.5 font-mono text-xs transition-colors sm:px-3.5 ${
                active === section.id
                  ? 'bg-amber-400 text-graphite-950'
                  : 'text-ink-400 hover:text-amber-300'
              }`}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

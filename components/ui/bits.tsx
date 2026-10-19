import type { ReactNode } from 'react'

/**
 * Cabeçalho de seção. A régua com o índice é o que separa uma seção da outra:
 * some pra direita e devolve o título logo abaixo.
 */
export function SectionHeader({
  index,
  title,
  id,
  note,
}: {
  index: string
  title: string
  id?: string
  note?: string
}) {
  return (
    <header id={id} className="scroll-mt-28">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs tracking-widest text-amber-400">
          {index}
        </span>
        <span
          aria-hidden
          className="h-px flex-1 bg-gradient-to-r from-graphite-700 via-graphite-800 to-transparent"
        />
      </div>

      <h2 className="mt-5 font-mono text-[length:var(--text-section)] leading-none font-medium tracking-tight text-ink-100">
        {title}
      </h2>

      {note && <p className="mt-3 max-w-md text-sm text-ink-400">{note}</p>}
    </header>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <li className="rounded border border-graphite-750 bg-graphite-850/70 px-2.5 py-1 font-mono text-xs text-ink-300">
      {children}
    </li>
  )
}

export function StackList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </ul>
  )
}

export function ExternalLink({
  href,
  children,
  emphasis = false,
}: {
  href: string
  children: ReactNode
  emphasis?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-1.5 font-mono text-sm transition-colors ${
        emphasis
          ? 'rounded border border-amber-500/60 bg-amber-500/10 px-3.5 py-2 text-amber-200 hover:border-amber-400 hover:bg-amber-500/20 hover:text-amber-100'
          : 'text-ink-400 hover:text-amber-300'
      }`}
    >
      {children}
      <span
        aria-hidden
        className="translate-y-px transition-transform duration-200 group-hover:translate-x-0.5"
      >
        &#8599;
      </span>
    </a>
  )
}

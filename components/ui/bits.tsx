import type { ReactNode } from 'react'

/** Cabeçalho de seção: índice discreto e título em monospace. */
export function SectionHeader({
  index,
  title,
  id,
}: {
  index: string
  title: string
  id?: string
}) {
  return (
    <header id={id} className="scroll-mt-28">
      <h2 className="flex items-baseline gap-3 font-mono text-[length:var(--text-section)] leading-none font-medium text-ink-100">
        <span className="text-sm font-normal text-amber-400">{index}</span>
        {title}
      </h2>
    </header>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <li className="rounded border border-graphite-750 bg-graphite-900 px-2.5 py-1 font-mono text-xs text-ink-300">
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

export function Status({
  children,
  tone = 'live',
}: {
  children: ReactNode
  tone?: 'live' | 'muted'
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs ${
        tone === 'live'
          ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
          : 'border-graphite-700 text-ink-400'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tone === 'live' ? 'bg-amber-400' : 'bg-ink-500'
        }`}
      />
      {children}
    </span>
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
          ? 'rounded border border-amber-500/60 bg-amber-500/5 px-3.5 py-2 text-amber-300 hover:border-amber-400 hover:bg-amber-500/10 hover:text-amber-200'
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

export function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-[16/9] items-center justify-center rounded-lg border border-dashed border-graphite-700 bg-graphite-900/60">
      <p className="px-4 text-center font-mono text-xs text-ink-500">{label}</p>
    </div>
  )
}

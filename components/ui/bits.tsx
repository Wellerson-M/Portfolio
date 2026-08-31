import type { ReactNode } from 'react'

/** Linha de comando decorativa, marca de terminal sem virar tema. */
export function Prompt({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-tight text-ink-600 select-none">
      <span className="text-amber-600">~/portfolio</span>
      <span className="text-ink-600"> $ </span>
      <span className="text-ink-400">{children}</span>
    </p>
  )
}

/** Cabeçalho de seção: número, comando decorativo e título. */
export function SectionHeader({
  index,
  command,
  title,
  id,
}: {
  index: string
  command: string
  title: string
  id?: string
}) {
  return (
    <header id={id} className="scroll-mt-24">
      <Prompt>{command}</Prompt>
      <h2 className="mt-3 flex items-baseline gap-3 font-mono text-[length:var(--text-section)] leading-none font-medium text-ink-100">
        <span className="text-base font-normal text-amber-500">{index}</span>
        {title}
      </h2>
    </header>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <li className="rounded border border-graphite-750 px-2 py-1 font-mono text-[0.7rem] text-ink-400">
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.7rem] ${
        tone === 'live'
          ? 'border-amber-600/50 text-amber-300'
          : 'border-graphite-700 text-ink-500'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tone === 'live' ? 'bg-amber-400' : 'bg-ink-600'
        }`}
      />
      {children}
    </span>
  )
}

/** Link externo com seta. Único estilo de CTA do site. */
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
          ? 'rounded border border-amber-600/60 px-3 py-1.5 text-amber-300 hover:border-amber-400 hover:text-amber-200'
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

/** Espaço reservado para print que ainda não existe. */
export function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-[16/10] items-center justify-center rounded-md border border-dashed border-graphite-700 bg-graphite-900/60">
      <p className="px-4 text-center font-mono text-xs text-ink-600">{label}</p>
    </div>
  )
}

import Expand from '@/components/ui/Expand'
import ProjectMedia from '@/components/ui/ProjectMedia'
import Reveal from '@/components/ui/Reveal'
import { ExternalLink, SectionHeader, StackList } from '@/components/ui/bits'
import { featured, more, type MoreItem, type Project } from '@/lib/projects'

export default function Projetos() {
  return (
    <section className="border-t border-graphite-850 px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader id="projetos" index="02" title="Projetos" />
        </Reveal>

        <div className="mt-16 space-y-32 lg:space-y-44">
          {featured.map((project) => (
            <Featured key={project.slug} project={project} />
          ))}
        </div>

        <div className="mt-36">
          <Reveal>
            <h3 className="flex items-center gap-4 font-mono text-sm text-ink-300">
              Outros projetos e trabalhos acadêmicos
              <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-graphite-750 to-transparent" />
            </h3>
          </Reveal>
          <Reveal delay={80} className="mt-6">
            <ul className="divide-y divide-graphite-850 border-y border-graphite-850">
              {more.map((item) => (
                <MoreRow key={item.name} item={item} />
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function Featured({ project }: { project: Project }) {
  const live = project.live ?? project.demo?.src

  return (
    <article className="scroll-mt-28" id={project.slug}>
      <Reveal>
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div>
            {project.note && <p className="font-mono text-xs text-amber-400">{project.note}</p>}
            <h3 className="mt-3 font-mono text-[length:var(--text-feature)] leading-none font-medium tracking-tight text-ink-100">
              {project.name}
            </h3>
            <p className="mt-4 text-lg text-ink-200">{project.tagline}</p>
            <p className="mt-4 leading-relaxed text-ink-400">{project.summary}</p>
          </div>

          <div className="flex flex-col justify-end gap-6 lg:pb-1">
            {project.points && (
              <ul className="grid gap-2.5">
                {project.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-sm text-ink-300">
                    <span aria-hidden className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
            <StackList items={project.stack} />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {live && (
                <ExternalLink href={live} emphasis>
                  abrir site
                </ExternalLink>
              )}
              {project.repo && <ExternalLink href={project.repo}>código</ExternalLink>}
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={80} className="mt-8">
        <Expand>
          <div className="grid gap-x-10 gap-y-8 border-l border-graphite-750 pl-6 md:grid-cols-3">
            {project.details.map((detail) => (
              <div key={detail.title}>
                <h4 className="font-mono text-xs tracking-wide text-amber-300">{detail.title}</h4>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-300">{detail.text}</p>
              </div>
            ))}
          </div>
          {project.code && <CodeBlock {...project.code} />}
        </Expand>
      </Reveal>

      <Reveal delay={140} className="mt-14">
        <ProjectMedia project={project} />
      </Reveal>
    </article>
  )
}

/* ------------------------------------------------------------------ */

function CodeBlock({ file, lines }: { file: string; lines: string[] }) {
  return (
    <figure className="mt-8 max-w-2xl overflow-hidden rounded-lg border border-graphite-800 bg-graphite-900/70">
      <figcaption className="border-b border-graphite-800 px-4 py-2 font-mono text-[0.7rem] text-ink-500">
        {file}
      </figcaption>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-xs leading-relaxed text-ink-300">
        {lines.map((line, index) => (
          <span key={index} className="block whitespace-pre">
            {line ? <Abl line={line} /> : ' '}
          </span>
        ))}
      </pre>
    </figure>
  )
}

/** Realce mínimo das palavras-chave de Progress, só para o trecho de código. */
const KEYWORDS = /\b(IF|THEN|DO|TRANSACTION|ON|ERROR|UNDO|LEAVE|FOR|EACH|EXCLUSIVE-LOCK|WHERE|DELETE|END|FIND|CURRENT|NO-ERROR|AVAIL)\b/g

function Abl({ line }: { line: string }) {
  const parts = line.split(KEYWORDS)
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="text-amber-300">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

/* ------------------------------------------------------------------ */

function MoreRow({ item }: { item: MoreItem }) {
  return (
    <li className="grid gap-x-8 gap-y-1.5 py-5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] sm:items-baseline">
      <div>
        <p className="font-mono text-ink-100">{item.name}</p>
        <p className="mt-0.5 text-xs text-ink-500">{item.context}</p>
      </div>
      <div>
        <p className="text-sm text-ink-300">{item.summary}</p>
        <p className="mt-1 font-mono text-xs text-ink-500">{item.stack.join(' · ')}</p>
      </div>
      <div className="sm:text-right">
        {item.repo && <ExternalLink href={item.repo}>código</ExternalLink>}
      </div>
    </li>
  )
}

import Image from 'next/image'
import Carousel from '@/components/ui/Carousel'
import LiveFrame from '@/components/ui/LiveFrame'
import Reveal from '@/components/ui/Reveal'
import { ExternalLink, SectionHeader, StackList } from '@/components/ui/bits'
import {
  coursework,
  featured,
  sideProjects,
  type Coursework,
  type Project,
  type SideProject,
} from '@/lib/projects'

export default function Projetos() {
  return (
    <section className="border-t border-graphite-850 px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader id="projetos" index="02" title="Projetos" />
        </Reveal>

        <div className="mt-16 space-y-28 lg:space-y-36">
          {featured.map((project) => (
            <Featured key={project.slug} project={project} />
          ))}
        </div>

        <div className="mt-32">
          <Reveal>
            <SubHeader title="Outros projetos" />
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {sideProjects.map((project, index) => (
              <Reveal key={project.name} delay={index * 80} className="h-full">
                <SideCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <Reveal>
            <SubHeader title="Trabalhos acadêmicos" />
          </Reveal>
          <Reveal delay={80} className="mt-6">
            <ul className="divide-y divide-graphite-850 border-y border-graphite-850">
              {coursework.map((item) => (
                <CourseRow key={item.name} item={item} />
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function SubHeader({ title }: { title: string }) {
  return (
    <h3 className="flex items-center gap-4 font-mono text-sm text-ink-300">
      {title}
      <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-graphite-800 to-transparent" />
    </h3>
  )
}

/* ------------------------------------------------------------------ */

function Featured({ project }: { project: Project }) {
  const phone = project.demo?.device === 'phone'
  const live = project.live ?? project.demo?.src

  const text = (
    <div className="max-w-xl">
      {project.note && <p className="font-mono text-xs text-amber-400">{project.note}</p>}
      <h3 className="mt-3 font-mono text-[length:var(--text-feature)] leading-none font-medium tracking-tight text-ink-100">
        {project.name}
      </h3>
      <p className="mt-4 text-lg text-ink-200">{project.tagline}</p>
      <p className="mt-4 leading-relaxed text-ink-400">{project.summary}</p>

      {project.points && (
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {project.points.map((point) => (
            <li key={point} className="flex gap-2.5 text-sm text-ink-300">
              <span aria-hidden className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-amber-400" />
              {point}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <StackList items={project.stack} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        {live && (
          <ExternalLink href={live} emphasis>
            abrir em nova aba
          </ExternalLink>
        )}
        {project.repo && <ExternalLink href={project.repo}>código</ExternalLink>}
      </div>
    </div>
  )

  // Celular cabe ao lado do texto; notebook e prints precisam da largura toda.
  if (phone && project.demo) {
    return (
      <article className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20">
        <Reveal>{text}</Reveal>
        <Reveal delay={120}>
          <LiveFrame {...project.demo} title={project.name} />
        </Reveal>
      </article>
    )
  }

  return (
    <article>
      <Reveal>{text}</Reveal>
      {project.demo && (
        <Reveal delay={120} className="mt-12">
          <LiveFrame {...project.demo} title={project.name} />
        </Reveal>
      )}
      {project.shots && (
        <Reveal delay={120} className="mt-12">
          <Carousel shots={project.shots} shape={project.shotShape ?? 'screen'} />
        </Reveal>
      )}
    </article>
  )
}

/* ------------------------------------------------------------------ */

function SideCard({ project }: { project: SideProject }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-graphite-800 bg-graphite-900/50 transition-colors duration-300 hover:border-graphite-700">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-graphite-800 bg-graphite-950/60">
        {project.image && (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="(min-width: 768px) 560px, 100vw"
            className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        )}
        {project.code && (
          <div className="absolute inset-0 flex flex-col">
            <p className="border-b border-graphite-800 px-4 py-2 font-mono text-[0.7rem] text-ink-500">
              {project.code.lang}
            </p>
            <pre className="flex-1 overflow-hidden px-4 py-3 font-mono text-[0.7rem] leading-relaxed text-ink-300 sm:text-xs">
              {project.code.lines.map((line, index) => (
                <span key={index} className="block whitespace-pre">
                  {line ? <Abl line={line} /> : ' '}
                </span>
              ))}
            </pre>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h4 className="font-mono text-xl text-ink-100">{project.name}</h4>
        <p className="mt-1 text-sm text-amber-300/90">{project.tagline}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-400">{project.summary}</p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <StackList items={project.stack} />
          {project.repo && <ExternalLink href={project.repo}>código</ExternalLink>}
        </div>
      </div>
    </article>
  )
}

/** Realce mínimo das palavras-chave de Progress, só para o trecho do card. */
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

function CourseRow({ item }: { item: Coursework }) {
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

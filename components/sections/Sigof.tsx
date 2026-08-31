import Gallery from '@/components/ui/Gallery'
import Reveal from '@/components/ui/Reveal'
import { ExternalLink, Prompt, StackList, Status } from '@/components/ui/bits'
import { sigof } from '@/lib/projects'

export default function Sigof() {
  return (
    <section className="relative border-y border-graphite-850 bg-graphite-900/40 px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Prompt>cd projetos/sigof</Prompt>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Status>em andamento</Status>
            <span className="font-mono text-xs text-ink-600">projeto em destaque</span>
          </div>
          <h2 className="mt-5 font-mono text-[length:var(--text-feature)] leading-[0.9] font-medium tracking-tighter text-ink-100">
            {sigof.name}
          </h2>
          <p className="mt-4 max-w-2xl font-mono text-sm text-ink-400">
            {sigof.subtitle}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-16">
          <Reveal delay={60} className="max-w-2xl space-y-5">
            {sigof.body.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-ink-300">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={120} className="space-y-8">
            <div>
              <h3 className="font-mono text-xs tracking-wide text-ink-600 uppercase">
                Stack
              </h3>
              <div className="mt-3">
                <StackList items={sigof.stack} />
              </div>
            </div>
            <div className="hairline h-px" />
            <div className="flex flex-col items-start gap-3">
              <ExternalLink href={sigof.repo} emphasis>
                ver repositório
              </ExternalLink>
            </div>
          </Reveal>
        </div>

        <Reveal delay={60} className="mt-20">
          <h3 className="font-mono text-sm text-ink-200">
            Mockups do RFC
            <span className="ml-2 text-xs text-ink-600">
              seis telas, clique para ampliar
            </span>
          </h3>
          <div className="mt-5">
            <Gallery shots={sigof.mockups} aspect="wide" zoomable />
          </div>
        </Reveal>

        <Reveal delay={60} className="mt-16">
          <h3 className="font-mono text-sm text-ink-200">
            Arquitetura
            <span className="ml-2 text-xs text-ink-600">
              C4 em três níveis e casos de uso, com zoom
            </span>
          </h3>
          <div className="mt-5">
            <Gallery shots={sigof.diagrams} aspect="wide" zoomable />
          </div>
        </Reveal>

        {/* Spec-Driven Development: o SIGOF levado do documento ao scaffolding. */}
        <Reveal delay={60} className="mt-20">
          <div className="rounded-lg border border-graphite-800 bg-graphite-950/60 p-6 sm:p-9">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h3 className="font-mono text-xl font-medium text-ink-100">
                {sigof.sdd.title}
              </h3>
              <ExternalLink href={sigof.sdd.repo}>Spec-kit</ExternalLink>
            </div>

            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-300">
              {sigof.sdd.body}
            </p>

            <ol className="mt-7 flex flex-wrap items-center gap-x-1 gap-y-2">
              {sigof.sdd.steps.map((step, index) => (
                <li key={step} className="flex items-center gap-1">
                  <span className="rounded border border-graphite-750 bg-graphite-900 px-2.5 py-1 font-mono text-[0.7rem] text-amber-300">
                    /{step}
                  </span>
                  {index < sigof.sdd.steps.length - 1 && (
                    <span aria-hidden className="px-0.5 font-mono text-xs text-ink-600">
                      &#8594;
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import Reveal from '@/components/ui/Reveal'
import {
  ExternalLink,
  Placeholder,
  SectionHeader,
  StackList,
  Status,
} from '@/components/ui/bits'
import { firstProject, otherProjects } from '@/lib/projects'

export default function Outros() {
  return (
    <section className="border-t border-graphite-850 px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader id="outros" index="03" title="Outros projetos" />
        </Reveal>

        <div className="mt-14 divide-y divide-graphite-850 border-y border-graphite-850">
          {otherProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 80}>
              <article className="grid gap-6 py-10 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-14">
                <div>
                  <h3 className="font-mono text-2xl font-medium tracking-tight text-ink-100">
                    {project.name}
                  </h3>
                  {project.status && (
                    <div className="mt-3">
                      <Status tone="muted">{project.status}</Status>
                    </div>
                  )}
                </div>

                <div className="max-w-2xl">
                  <p className="font-mono text-sm text-amber-300">{project.tagline}</p>

                  <div className="mt-4 space-y-3">
                    {project.body.map((paragraph) => (
                      <p key={paragraph} className="leading-relaxed text-ink-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="mt-6">
                    <StackList items={project.stack} />
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <ExternalLink href={project.repo}>repositório</ExternalLink>
                    {project.live && (
                      <ExternalLink href={project.live}>ver painel</ExternalLink>
                    )}
                  </div>

                  {project.placeholder && (
                    <div className="mt-6 max-w-sm">
                      <Placeholder label={project.placeholder} />
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* WLJ-Sports tem espaço próprio: é a narrativa de onde começou. */}
        <Reveal delay={80} className="mt-20">
          <div className="relative overflow-hidden rounded-xl border border-graphite-800 bg-graphite-900/60 p-6 sm:p-10">
            <span
              aria-hidden
              className="absolute top-0 right-0 hidden font-mono text-[7rem] leading-none font-medium tracking-tighter text-graphite-850 select-none sm:block lg:text-[10rem]"
            >
              {firstProject.year}
            </span>

            <div className="relative">
              <p className="font-mono text-xs text-amber-400">
                {firstProject.year} · onde tudo começou
              </p>

              <h3 className="mt-4 font-mono text-3xl font-medium tracking-tight text-ink-100">
                {firstProject.name}
              </h3>
              <p className="mt-2 font-mono text-sm text-ink-400">
                {firstProject.tagline}
              </p>

              <div className="mt-6 max-w-2xl space-y-4">
                {firstProject.body.map((paragraph, index) => (
                  <p
                    key={paragraph}
                    className={`leading-relaxed ${
                      index === firstProject.body.length - 1
                        ? 'text-ink-200'
                        : 'text-ink-300'
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-7">
                <StackList items={firstProject.stack} />
              </div>

              <div className="mt-7">
                <ExternalLink href={firstProject.repo}>repositório</ExternalLink>
              </div>

              {firstProject.placeholder && (
                <div className="mt-8 max-w-sm">
                  <Placeholder label={firstProject.placeholder} />
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

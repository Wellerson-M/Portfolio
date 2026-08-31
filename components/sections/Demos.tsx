import Gallery from '@/components/ui/Gallery'
import LiveFrame from '@/components/ui/LiveFrame'
import Reveal from '@/components/ui/Reveal'
import { ExternalLink, SectionHeader, StackList, Status } from '@/components/ui/bits'
import { liveProjects } from '@/lib/projects'

export default function Demos() {
  return (
    <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader
            id="demos"
            index="02"
            command="npm run dev --workspace=live"
            title="Rodando ao vivo"
          />
        </Reveal>

        <div className="mt-16 space-y-24 lg:space-y-32">
          {liveProjects.map((project, index) => (
            <article key={project.slug}>
              <div
                className={`grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-16 ${
                  index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <Reveal className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-mono text-3xl font-medium tracking-tight text-ink-100 sm:text-4xl">
                      {project.name}
                    </h3>
                    {project.status && <Status>{project.status}</Status>}
                  </div>

                  <p className="mt-3 font-mono text-sm text-ink-500">
                    {project.tagline}
                  </p>

                  <div className="mt-6 space-y-4">
                    {project.body.map((paragraph) => (
                      <p key={paragraph} className="leading-relaxed text-ink-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="mt-7">
                    <StackList items={project.stack} />
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                    {project.live && (
                      <ExternalLink href={project.live} emphasis>
                        abrir em nova aba
                      </ExternalLink>
                    )}
                    <ExternalLink href={project.repo}>repositório</ExternalLink>
                  </div>
                </Reveal>

                <Reveal delay={120}>
                  {project.live && (
                    <LiveFrame
                      src={project.live}
                      title={`Demo ao vivo do ${project.name}`}
                    />
                  )}
                </Reveal>
              </div>

              {project.shots && (
                <Reveal delay={80} className="mt-12">
                  <Gallery shots={project.shots} aspect="tall" />
                </Reveal>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

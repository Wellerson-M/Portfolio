import Carousel from '@/components/ui/Carousel'
import LiveFrame from '@/components/ui/LiveFrame'
import Reveal from '@/components/ui/Reveal'
import { ExternalLink, SectionHeader, StackList, Status } from '@/components/ui/bits'
import { liveProjects } from '@/lib/projects'

export default function Demos() {
  return (
    <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader id="projetos" index="02" title="Projetos" />
        </Reveal>

        <div className="mt-16 space-y-28 lg:space-y-36">
          {liveProjects.map((project) => (
            <article key={project.slug}>
              <Reveal className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-mono text-3xl font-medium tracking-tight text-ink-100 sm:text-4xl">
                    {project.name}
                  </h3>
                  {project.status && <Status>{project.status}</Status>}
                </div>

                <p className="mt-3 font-mono text-sm text-amber-300">
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

              {project.live && (
                <Reveal delay={100} className="mt-14">
                  <LiveFrame
                    src={project.live}
                    title={`${project.name} em execução`}
                    device={project.device ?? 'phone'}
                  />
                </Reveal>
              )}

              {project.shots && (
                <Reveal delay={80} className="mt-16">
                  <Carousel shots={project.shots} shape="phone" />
                </Reveal>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

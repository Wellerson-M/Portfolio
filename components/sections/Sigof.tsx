import Carousel from '@/components/ui/Carousel'
import Reveal from '@/components/ui/Reveal'
import { ExternalLink, Status } from '@/components/ui/bits'
import { sigof } from '@/lib/projects'

export default function Sigof() {
  return (
    <section
      id="sigof"
      className="scroll-mt-28 border-y border-graphite-850 bg-graphite-900/60 px-6 py-24 sm:px-10 lg:px-16 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <Status>{sigof.status}</Status>
            <span className="font-mono text-xs text-ink-500">projeto em destaque</span>
          </div>

          <h2 className="mt-5 font-mono text-[length:var(--text-feature)] leading-[0.9] font-medium tracking-tighter text-ink-100">
            {sigof.name}
          </h2>
          <p className="mt-3 font-mono text-sm text-amber-300">{sigof.subtitle}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-200">
            {sigof.intro}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal delay={60}>
            <h3 className="font-mono text-sm tracking-wide text-ink-500 uppercase">
              {sigof.problem.title}
            </h3>
            <p className="mt-4 leading-relaxed text-ink-300">{sigof.problem.body}</p>
          </Reveal>

          <Reveal delay={140}>
            <h3 className="font-mono text-sm tracking-wide text-ink-500 uppercase">
              {sigof.solution.title}
            </h3>
            <p className="mt-4 leading-relaxed text-ink-300">{sigof.solution.body}</p>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {sigof.solution.features.map((feature) => (
                <li key={feature} className="flex gap-2.5 text-sm text-ink-300">
                  <span aria-hidden className="mt-1 text-amber-400">
                    &#9656;
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={60} className="mt-20">
          <Carousel shots={sigof.shots} shape="screen" />
        </Reveal>

        <Reveal delay={60} className="mt-20">
          <h3 className="font-mono text-sm tracking-wide text-ink-500 uppercase">
            {sigof.build.title}
          </h3>

          <dl className="mt-6 grid gap-8 sm:grid-cols-3">
            {sigof.build.groups.map((group) => (
              <div key={group.label}>
                <dt className="font-mono text-sm text-ink-100">{group.label}</dt>
                <dd className="mt-3">
                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded border border-graphite-750 bg-graphite-950/60 px-2.5 py-1 font-mono text-xs text-ink-300"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <ExternalLink href={sigof.repo} emphasis>
              ver repositório
            </ExternalLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

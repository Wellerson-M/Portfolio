import Reveal from '@/components/ui/Reveal'
import { SectionHeader, StackList } from '@/components/ui/bits'
export default function Sobre({ about, skills }: { about: string[]; skills: string[] }) {
  return (
    <section className="border-t border-graphite-850 px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          <SectionHeader id="sobre" index="01" title="Sobre" />
        </Reveal>

        <Reveal delay={90} className="max-w-2xl">
          <div className="space-y-5">
            {about.map((paragraph, index) => (
              <p
                key={paragraph}
                className={index === 0 ? 'text-lg leading-relaxed text-ink-100' : 'leading-relaxed text-ink-300'}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <p className="mt-10 font-mono text-xs text-ink-500">com o que trabalho</p>
          <div className="mt-3">
            <StackList items={skills} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

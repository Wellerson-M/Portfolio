import Reveal from '@/components/ui/Reveal'
import { SectionHeader } from '@/components/ui/bits'
import { contact } from '@/lib/projects'

const YEAR = new Date().getFullYear()

export default function Contato() {
  const links = [
    { label: 'GitHub', value: '@Wellerson-M', href: contact.github },
    contact.linkedin
      ? { label: 'LinkedIn', value: 'wellerson-meredyk', href: contact.linkedin }
      : null,
    { label: 'E-mail', value: contact.email, href: `mailto:${contact.email}` },
  ].filter((link) => link !== null)

  return (
    <footer className="border-t border-graphite-850 bg-graphite-900/40 px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader id="contato" index="03" title="Contato" />
        </Reveal>

        <Reveal delay={80} className="mt-12">
          <p className="max-w-xl text-lg text-ink-200">
            Para falar sobre algum projeto daqui, ou sobre trabalho, é só chamar.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <ul className="divide-y divide-graphite-850 border-y border-graphite-850">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="group flex items-baseline justify-between gap-6 py-5 transition-colors"
                >
                  <span className="font-mono text-sm text-ink-400 transition-colors group-hover:text-amber-400">
                    {link.label}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-base text-ink-200 transition-colors group-hover:text-amber-300 sm:text-lg">
                    {link.value}
                    <span
                      aria-hidden
                      className="translate-y-px text-sm transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      &#8599;
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={160} className="mt-10">
          <a
            href={contact.cv}
            download
            className="inline-flex items-center gap-2 rounded border border-amber-500/60 bg-amber-500/5 px-4 py-2.5 font-mono text-sm text-amber-300 transition-colors hover:border-amber-400 hover:bg-amber-500/10 hover:text-amber-200"
          >
            <span aria-hidden>&#8595;</span>
            baixar CV
            <span className="text-ink-500">pdf</span>
          </a>
        </Reveal>

        <Reveal delay={200} className="mt-20">
          <p className="font-mono text-xs text-ink-500">
            Wellerson Meredyk · {YEAR}
          </p>
        </Reveal>
      </div>
    </footer>
  )
}

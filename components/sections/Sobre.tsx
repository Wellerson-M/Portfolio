import Reveal from '@/components/ui/Reveal'
import { SectionHeader } from '@/components/ui/bits'

export default function Sobre() {
  return (
    <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          <SectionHeader id="sobre" index="01" command="cat sobre.md" title="Sobre" />
        </Reveal>

        <Reveal delay={80} className="max-w-2xl space-y-6">
          <p className="text-lg leading-relaxed text-ink-200">
            Estudante de Engenharia de Software no 7º semestre na Católica SC, em
            Joinville, com técnico em Ciência de Dados antes disso. Trabalho na
            Aceville Transportes, e foi de lá que saiu meu TCC: um processo que vivia
            em e-mail solto e virou sistema de tickets. No dia a dia escrevo
            JavaScript e TypeScript, React e Next.js no front, Node.js no back.
          </p>
          <p className="text-lg leading-relaxed text-ink-300">
            O que me segura num projeto é entender o problema antes de escolher a
            tecnologia. Gosto de coisa com contexto real, requisito que muda no meio e
            gente usando do outro lado. Procuro estágio em desenvolvimento, de
            preferência perto de produto.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

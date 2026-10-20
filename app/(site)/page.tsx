import Contato from '@/components/sections/Contato'
import Hero from '@/components/sections/Hero'
import Projetos from '@/components/sections/Projetos'
import Sobre from '@/components/sections/Sobre'
import { getContent } from '@/lib/projects'

export default async function Home() {
  const content = await getContent()

  return (
    <main>
      <Hero line={content.line} contact={content.contact} />
      <Sobre about={content.about} skills={content.skills} />
      <Projetos featured={content.featured} more={content.more} />
      <Contato contact={content.contact} />
    </main>
  )
}

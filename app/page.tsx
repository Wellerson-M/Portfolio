import Contato from '@/components/sections/Contato'
import Demos from '@/components/sections/Demos'
import Hero from '@/components/sections/Hero'
import Outros from '@/components/sections/Outros'
import Sigof from '@/components/sections/Sigof'
import Sobre from '@/components/sections/Sobre'

export default function Home() {
  return (
    <main>
      <Hero />
      <Sobre />
      <Sigof />
      <Demos />
      <Outros />
      <Contato />
    </main>
  )
}

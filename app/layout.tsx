import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import SectionNav from '@/components/ui/SectionNav'
import Spotlight from '@/components/ui/Spotlight'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Wellerson Meredyk · Engenharia de Software',
  description:
    'Portfólio de Wellerson Meredyk, estudante de Engenharia de Software em Joinville (SC). Projetos web com demonstrações para testar.',
  openGraph: {
    title: 'Wellerson Meredyk · Engenharia de Software',
    description: 'Projetos web com demonstrações para testar.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Spotlight />
        <a
          href="#sobre"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded focus:bg-amber-400 focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-graphite-950"
        >
          Pular para o conteúdo
        </a>
        <SectionNav />
        {children}
      </body>
    </html>
  )
}

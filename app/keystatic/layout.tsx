import type { Metadata } from 'next'
import KeystaticApp from './keystatic'

// Layout próprio, sem nada do site. Fora do índice de buscadores e sem link
// em lugar nenhum do portfólio.
export const metadata: Metadata = {
  title: 'Painel',
  robots: { index: false, follow: false },
}

export default function KeystaticLayout() {
  return (
    <html lang="pt-BR">
      <body>
        <KeystaticApp />
      </body>
    </html>
  )
}

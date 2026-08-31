# Portfolio — Wellerson Meredyk

Single page em Next.js com os projetos pessoais e acadêmicos. Especificação
completa em [`PORTFOLIO-SPEC.md`](PORTFOLIO-SPEC.md).

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4, com os tokens da identidade Grafite em `app/globals.css`
- Inter (corpo) e JetBrains Mono (títulos e detalhes) via `next/font`
- Sem biblioteca de animação: os dois efeitos do site são IntersectionObserver
  e CSS puro

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
```

Outros scripts:

```bash
npm run lint     # ESLint, inclui as regras do React Compiler
npm run build    # build de produção
npm run start    # serve o build
```

## Estrutura

```
app/
  layout.tsx        fontes, metadata, spotlight, skip link
  page.tsx          ordem das seções
  globals.css       paleta grafite/âmbar, spotlight, reveal, caret
components/
  sections/         Hero, Sobre, Sigof, Demos, Outros, Contato
  ui/               Spotlight, Reveal, Gallery, LiveFrame, bits, useMediaQuery
lib/
  projects.ts       todo o conteúdo dos projetos, sem CMS
public/assets/
  notes/            prints do Notes
  denovonao/        prints do DeNovoNao
  sigof/mockups/    seis telas do RFC
  sigof/diagramas/  C4 em três níveis e casos de uso
  cv.pdf            currículo do botão de download
```

## Editar conteúdo

Todo texto de projeto, stack, link e print sai de `lib/projects.ts`. Não há CMS
e nenhuma seção tem texto hardcoded fora dele, com exceção do hero e do sobre,
que vivem nos próprios componentes por serem parágrafo único.

Para trocar ou acrescentar um print: coloque o arquivo em `public/assets/<projeto>/`
e adicione uma entrada em `shots`, com `src`, `alt` e `caption`. O `alt` é lido
por leitor de tela, então descreva a tela, não repita o nome do projeto.

## Efeitos

O site tem dois, de propósito:

1. **Spotlight do cursor** (`components/ui/Spotlight.tsx`): um círculo pequeno
   seguindo o mouse com um halo âmbar. Só monta em ponteiro fino, e some com
   `prefers-reduced-motion: reduce`.
2. **Reveal no scroll** (`components/ui/Reveal.tsx`): fade curto com slide up
   quando a seção entra na viewport, uma vez só.

Ambos respeitam movimento reduzido. O CSS de `prefers-reduced-motion` em
`globals.css` é a fonte da verdade; os componentes não duplicam a decisão.

## Demos ao vivo

Notes e DeNovoNao rodam dentro de iframe em moldura de celular, apontando para
os deploys da Vercel. O iframe só monta quando entra na viewport, para não puxar
dois sites no carregamento da home. Se algum deploy passar a mandar
`X-Frame-Options` ou `frame-ancestors`, o iframe fica em branco e a saída é
trocar por print estático mais o botão de abrir em nova aba.

## Deploy

Vercel, com o diretório raiz do projeto. Sem variável de ambiente.

```bash
npx vercel        # preview
npx vercel --prod
```

## Pendências

- Prints do SpotifyFilters, que precisa rodar local
- Prints do WLJ-Sports, que precisa do XAMPP
- URL do LinkedIn em `contact.linkedin` de `lib/projects.ts`; enquanto estiver
  vazia, a linha não é renderizada na seção de contato

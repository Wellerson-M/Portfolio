# Portfolio do Wellerson — Spec

> Este documento é a especificação completa do portfolio.
> Leia inteiro antes de escrever qualquer código.
> Se algo estiver ambíguo, **pergunte antes de assumir**.

---

## 1. Contexto

Sou o Wellerson, estudante de Engenharia de Software no 7º semestre (Católica SC, Joinville) e trabalho na Aceville Transportes como Auxiliar Administrativo, mas atuando bem além do cargo: mexo com CT-e, NF-e, classificação fiscal, dashboards analíticos e materiais de treinamento interno.

Este portfolio tem dois objetivos:

1. Vitrine dos meus projetos pessoais e acadêmicos, com foco em desenvolvimento.
2. Suporte à candidatura pro estágio TOTVS 2026 (Desenvolvimento de Software, Engenharia de Software, SRE).

**Posicionamento:** dev que gosta de resolver problemas com sistema. Nada de me vender como analista fiscal ou algo de logística. A logística é domínio, não identidade.

---

## 2. Referência de design

Inspiração base: `https://www.rhuanbello.com/`. Pegar as partes boas (minimalismo, hierarquia, sensação de dev sem exagero), **não copiar layout nem cores**.

**Diretrizes:**
- Estética minimalista, dev, sóbria. Nada extravagante.
- Detalhes sutis que remetem a terminal/IDE (fonte monospace em títulos, cursor piscando, comandos como decoração).
- Layout editorial em vez de grid de cards genérico.
- **Um efeito perceptível de mouse**, mas minimalista. Sugestões pra explorar: cursor customizado com pequeno "spotlight" iluminando a região ao redor, ou uma trilha sutil, ou hover nos projetos com leve tilt/parallax. Escolher UMA coisa e fazer bem feito, não empilhar efeitos.

**Paleta:** identidade Grafite. Dark graphite como base, acento em dourado/âmbar. Nada de neon, nada de gradiente colorido.

**Tipografia:** uma sans clean pro corpo (Inter, Geist, ou similar), uma monospace pros títulos e detalhes técnicos (JetBrains Mono, Geist Mono, ou similar).

---

## 3. Estrutura

Single page com scroll suave. Sem multi-page. Seções:

1. **Hero** — nome, uma linha do que faço, CTA de scroll.
2. **Sobre** — 2 parágrafos curtos: quem sou, o que gosto de fazer, formação/trabalho no essencial, o que tô procurando (estágio).
3. **Projeto em destaque** — SIGOF. Seção grande, case study.
4. **Projetos ativos com demo ao vivo** — Notes e DeNovoNao. Iframe live embutido.
5. **Outros projetos** — SpotifyFilters, Climax, Spec-kit, WLJ-Sports. Cards menores, mas com pesos diferentes conforme relevância.
6. **Contato** — GitHub, LinkedIn, email. Botão pra baixar o CV em PDF (o PDF está na pasta do projeto).

Hierarquia visual é essencial. SIGOF grande. Notes e DeNovoNao médios com demo real. Os outros pequenos. WLJ-Sports tem selo tipo "2022 · onde tudo começou" pra virar narrativa de evolução, não parecer projeto fraco.

---

## 4. Detalhamento por seção

### 4.1 Hero
- Nome em destaque, monospace.
- Uma linha só: algo como "Engenharia de Software. Gosto de resolver problemas com sistema."
- Indicação de scroll (seta discreta, cursor piscando, algo minimalista).
- Sem foto.

### 4.2 Sobre
- 2 parágrafos, direto ao ponto, sem "sou apaixonado por tecnologia".
- Menciona: formação (7º semestre Eng. Software, Católica SC), técnico em Ciência de Dados, atuação atual, stack preferida (JS/TS, React/Next.js, Node.js).
- Fecha com o que procuro: oportunidade de estágio, foco em produto.

### 4.3 SIGOF (destaque)
- Título grande, subtítulo curto (algo tipo "Sistema de gestão de ocorrências de frete · TCC · em andamento").
- Bloco de contexto: problema real, escopo, motivação (2-3 parágrafos).
- Galeria dos mockups do RFC com lightbox/zoom. Prints estão na pasta do projeto (verificar).
- Diagramas C4 e UML como imagens SVG, se possível com pan/zoom.
- Stack visível: React/Next.js, Node.js, PostgreSQL.
- Status: em andamento.
- Link pro repo.

### 4.4 Notes e DeNovoNao (demos ao vivo)
Cada um em uma linha ou lado a lado (decidir pela hierarquia visual):
- Título, descrição curta.
- **Iframe embutido** rodando o deploy da Vercel dentro de uma moldura estética (mockup de navegador ou celular, dependendo do projeto).
- Botão "abrir em nova aba".
- Link pro repo.
- Selo "em andamento" onde couber.

URLs:
- Notes: `https://notes-ten-tau-15.vercel.app/`
- DeNovoNao: `https://de-novo-nao.vercel.app/`

### 4.5 Outros projetos
Grid ou lista compacta com peso variável. Cada item: título, 1-2 linhas de descrição, stack, link.

- **SpotifyFilters** — precisa rodar local pra tirar print. Marcado como "desktop app". Placeholder pros prints por enquanto (adicionar depois).
- **Climax** — resumir baseado no README do repo. Print/screenshot se houver.
- **Spec-kit** — só citação curta, "experimentando com spec-driven development" ou algo do tipo. Link e pronto.
- **WLJ-Sports** — selo especial "2022 · primeiro projeto". Espaço próprio, narrativa de evolução ("onde peguei gosto por programação"). Prints do XAMPP virão depois, deixar placeholder.

### 4.6 Contato
- E-mail (perguntar qual usar).
- GitHub: `https://github.com/Wellerson-M`
- LinkedIn (perguntar URL).
- Botão "Baixar CV" (PDF está na pasta).

---

## 5. Repositórios a explorar

Antes de escrever qualquer descrição de projeto, **clone e leia cada repo abaixo**. Não confie só no que está aqui. Leia o README, olhe a estrutura de pastas, entenda a stack real, veja o package.json / requirements / equivalente. Se ficar em dúvida sobre o propósito, contexto ou como descrever, **pergunta pra mim antes de inventar**.

- `https://github.com/Wellerson-M/SIGOF` — TCC, projeto real em andamento. Já tem RFC e mockups (usar). Não é só um CRUD, tem contexto de negócio.
- `https://github.com/Wellerson-M/Notes` — frontend em desenvolvimento, testando design. Deploy: `https://notes-ten-tau-15.vercel.app/`
- `https://github.com/Wellerson-M/DeNovoNao` — MVP funcional, falta lapidar. Deploy: `https://de-novo-nao.vercel.app/`
- `https://github.com/Wellerson-M/SpotifyFilters` — precisa rodar local pra prints.
- `https://github.com/Wellerson-M/Climax` — usar o que tá no README.
- `https://github.com/Wellerson-M/Spec-kit` — só citação, sem entrar em muito detalhe.
- `https://github.com/Wellerson-M/WLJ-Sports` — 2022, primeiro projeto, feito no técnico de Ciência de Dados. Selo especial.

Repo geral: `https://github.com/Wellerson-M`

Assets já na pasta:
- Prints do Notes
- Prints do DeNovoNao
- CV em PDF (gerado pelo LinkedIn)

---

## 6. Efeitos e interações

**Regra geral:** pouco e bem feito. Nada de página cheia de animação.

- **Cursor / mouse**: escolher UMA de:
  - Cursor customizado (círculo pequeno) com spotlight suave iluminando a região atrás dele.
  - Trilha sutil no movimento.
  - Hover nos projetos com leve movimento parallax/tilt.
- **Scroll**: reveals suaves nas seções (fade + slide up curto). Nada muito longo.
- **Hero**: cursor piscando ou pequena animação de "digitação" no subtítulo, sutil.
- **Detalhes decorativos**: linhas de comando como decoração em cantos (`~/portfolio $ ls projects`, esse tipo de coisa), mas sem virar tema forçado.

---

## 7. Stack

- **Framework:** Next.js (App Router) + TypeScript.
- **Estilo:** Tailwind CSS.
- **Animações:** Framer Motion (ou alternativa leve).
- **Fontes:** Inter / Geist pro corpo, JetBrains Mono / Geist Mono pros títulos.
- **Deploy:** Vercel.
- **Sem CMS.** Conteúdo dos projetos hardcoded num arquivo `projects.ts` bem organizado.

Estrutura sugerida:
```
/app
  /page.tsx
  /layout.tsx
/components
  /sections
  /projects
  /ui
/lib
  /projects.ts    (dados dos projetos)
/public
  /assets
    /notes/       (prints)
    /denovonao/   (prints)
    /sigof/       (mockups, diagramas)
    /cv.pdf
```

---

## 8. Workflow esperado do Claude Code

1. **Ler este spec inteiro antes de qualquer coisa.**
2. Criar a estrutura base do projeto (Next.js + TS + Tailwind).
3. **Clonar cada repositório listado na seção 5** numa pasta temporária (ex: `/tmp/repos/`) e explorar cada um: README, package.json, estrutura de arquivos, tecnologias reais, propósito. Não escrever descrição de projeto sem ter olhado o código.
4. Verificar a pasta do projeto por assets já existentes (prints do Notes, DeNovoNao, CV, mockups do SIGOF).
5. Montar o site seção por seção, na ordem do documento.
6. **Sempre que houver dúvida sobre**: propósito do projeto, tom da descrição, qual print usar, hierarquia visual, cor específica, texto do sobre, informação pessoal (email, LinkedIn) → **perguntar antes de inventar**.
7. Fazer commits frequentes com mensagens claras (checkpoints).
8. Ao final, gerar um `README.md` do próprio portfolio com instruções de dev e deploy.

**Coisas que devem ser perguntadas obrigatoriamente:**
- E-mail de contato pra colocar no site.
- URL do LinkedIn.
- Texto exato da linha do hero (sugerir 2-3 opções).
- Texto do sobre (sugerir rascunho e pedir ajuste).
- Descrição de cada projeto após ler o repo (mostrar rascunho, pedir ok).
- Qual efeito de mouse implementar (mostrar as opções da seção 6).

---

## 9. O que NÃO fazer

- Não usar cores fora da paleta grafite/dourado.
- Não empilhar animações.
- Não escrever descrição genérica ("aplicação incrível utilizando as mais modernas tecnologias").
- Não replicar o CV como conteúdo do site.
- Não me vender como profissional de logística/frete.
- Não usar emoji.
- Não usar em-dash (`—`) exagerado no texto de conteúdo.
- Não deixar seção parecendo grid de cards igual todo portfolio genérico.

---

## 10. Roadmap

**v1 (agora):**
- Todas as seções montadas.
- Notes e DeNovoNao com iframe funcionando.
- SIGOF com mockups do RFC.
- Placeholders onde faltam prints (SpotifyFilters, WLJ-Sports).
- Deploy na Vercel.

**v2 (depois):**
- Prints do SpotifyFilters (rodar local).
- Prints do WLJ-Sports (XAMPP).
- Refinamento de textos.
- Analytics básico (opcional).

---

## 11. Comece por aqui

Depois de ler este documento inteiro, sua primeira ação deve ser: me confirmar que leu, listar suas dúvidas iniciais (se houver), e propor a ordem de implementação. **Não comece a codar antes disso.**

import type { Shape } from '@/components/ui/Carousel'

export type Shot = {
  src: string
  alt: string
}

export type Demo = {
  /** Endereço aberto dentro da moldura. */
  src: string
  device: 'phone' | 'laptop'
  /** Print mostrado enquanto o site carrega (e de reserva se ele sair do ar). */
  poster: string
}

export type Project = {
  slug: string
  name: string
  tagline: string
  /** Contexto curto acima do nome (TCC, freelance, uso pessoal). */
  note?: string
  summary: string
  points?: string[]
  stack: string[]
  repo?: string
  /** Link "abrir em nova aba". Sem ele, usa o endereço da demo. */
  live?: string
  demo?: Demo
  shots?: Shot[]
  shotShape?: Shape
}

export type SideProject = {
  name: string
  tagline: string
  summary: string
  stack: string[]
  repo?: string
  image?: Shot
  /** Trecho de código mostrado no lugar da imagem. */
  code?: { lang: string; lines: string[] }
}

export type Coursework = {
  name: string
  context: string
  summary: string
  stack: string[]
  repo?: string
}

/* ------------------------------------------------------------------ */
/* Sobre                                                               */
/* ------------------------------------------------------------------ */

export const about = [
  'Estudante de Engenharia de Software na Católica SC, no 7º semestre, e técnico em Desenvolvimento de Sistemas pelo SESI SENAI.',
  'Trabalho na operação de uma transportadora, lidando todo dia com CT-e e ocorrências de frete. Boa parte do que construo nasce desse contato com problemas reais, como o SIGOF, meu TCC.',
  'Busco minha primeira oportunidade como desenvolvedor.',
]

export const skills = ['TypeScript', 'JavaScript', 'Node.js', 'React', 'Next.js', 'SQL', 'Progress 4GL', 'Git']

/* ------------------------------------------------------------------ */
/* Destaques                                                           */
/* ------------------------------------------------------------------ */

export const featured: Project[] = [
  {
    slug: 'sigof',
    name: 'SIGOF',
    note: 'TCC · em desenvolvimento',
    tagline: 'Gestão de ocorrências de frete para transportadoras',
    summary:
      'Pedidos de correção de CT-e, como troca de pagador, reversão e ajuste fiscal, atualmente chegam de forma desorganizada. O SIGOF reúne esse fluxo num lugar só, com histórico do começo ao fim. É um problema que acompanho de perto no trabalho.',
    points: [
      'Protocolo por empresa e fila por prioridade',
      'Prazo de atendimento contado em horário útil',
      'Alerta de pedido duplicado e anexos no chamado',
      'Acesso por perfil, com os dados isolados por empresa',
    ],
    stack: ['TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Next.js', 'Docker'],
    repo: 'https://github.com/Wellerson-M/SIGOF',
    shotShape: 'screen',
    shots: [
      { src: '/assets/sigof/mockups/04-dashboard-analista.png', alt: 'Fila de atendimento do analista, ordenada por prioridade' },
      { src: '/assets/sigof/mockups/05-detalhes-solicitacao.png', alt: 'Solicitação aberta com histórico e conversa' },
      { src: '/assets/sigof/mockups/03-nova-solicitacao.png', alt: 'Formulário de nova solicitação' },
      { src: '/assets/sigof/mockups/06-dashboard-gerencial.png', alt: 'Painel gerencial com indicadores de atendimento' },
      { src: '/assets/sigof/mockups/02-dashboard-solicitante.png', alt: 'Painel do solicitante com as próprias solicitações' },
      { src: '/assets/sigof/mockups/01-login.png', alt: 'Tela de login' },
    ],
  },
  {
    slug: 'notes',
    name: 'Grafite Notas',
    note: 'uso pessoal · no ar',
    tagline: 'Bloco de notas para o celular que funciona sem internet',
    summary:
      'O app de notas que uso no dia a dia: tarefas, diário, agenda e ligação entre notas, tudo salvo no aparelho e sincronizado quando a conexão volta. A demonstração abre com notas fictícias, guardadas só no seu navegador.',
    stack: ['Next.js', 'React', 'TypeScript', 'IndexedDB', 'MongoDB', 'PWA'],
    repo: 'https://github.com/Wellerson-M/Notes',
    demo: {
      src: 'https://notes-ten-tau-15.vercel.app/?demo',
      device: 'phone',
      poster: '/assets/posters/notes.jpg',
    },
  },
  {
    slug: 'denovonao',
    name: 'De Novo Não',
    note: 'pessoal · no ar',
    tagline: 'Avaliações de restaurantes para não repetir pedido ruim',
    summary:
      'Cada ida a um restaurante vira um registro com nota, impressões e avisos, e o lugar ganha um histórico. As avaliações podem ser públicas ou privadas e, sem internet, ficam salvas no aparelho até a conexão voltar.',
    stack: ['Next.js', 'TypeScript', 'Express', 'MongoDB', 'JWT'],
    repo: 'https://github.com/Wellerson-M/DeNovoNao',
    demo: {
      src: 'https://de-novo-nao.vercel.app/',
      device: 'laptop',
      poster: '/assets/posters/denovonao.jpg',
    },
  },
  {
    slug: 'chale',
    name: 'Chalé Mirante dos Anjos',
    note: 'proposta de site · freelance',
    tagline: 'Site para uma hospedagem em Rodeio (SC)',
    summary:
      'Site para um chalé anunciado no Airbnb, com fotos, guia da região, avaliações dos hóspedes e reserva. Foi feito como proposta para a proprietária.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    demo: {
      src: 'https://mirantedosanjos.netlify.app/',
      device: 'laptop',
      poster: '/assets/posters/chale.jpg',
    },
  },
]

/* ------------------------------------------------------------------ */
/* Outros projetos                                                     */
/* ------------------------------------------------------------------ */

export const sideProjects: SideProject[] = [
  {
    name: 'Spotify Filters',
    tagline: 'Playlists sugeridas a partir das músicas curtidas',
    summary:
      'Lê as curtidas da conta pelo login do Spotify, classifica a vibe de cada faixa com IA e sugere playlists, que podem ser criadas direto na conta.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'Spotify API', 'OpenAI'],
    repo: 'https://github.com/Wellerson-M/SpotifyFilters',
    image: { src: '/assets/spotifyfilters/02-sugestoes.png', alt: 'Playlists sugeridas com nome, capa e número de faixas' },
  },
  {
    name: 'Videolocadora',
    tagline: 'Projeto final do Bootcamp TOTVS',
    summary:
      'Cadastros com regras de integridade entre as tabelas, relatórios e exportação em JSON e CSV, escrito em Progress OpenEdge.',
    stack: ['Progress 4GL', 'OpenEdge'],
    repo: 'https://github.com/Wellerson-M/VideoLocadora',
    code: {
      lang: 'cadAlugueis.p',
      lines: [
        'IF lResp THEN DO TRANSACTION ON ERROR UNDO, LEAVE:',
        '    FOR EACH bfItem EXCLUSIVE-LOCK',
        '        WHERE bfItem.CodAluguel = Alugueis.CodAluguel:',
        '        DELETE bfItem.',
        '    END.',
        '',
        '    FIND CURRENT Alugueis EXCLUSIVE-LOCK NO-ERROR.',
        '    IF AVAIL Alugueis THEN DELETE Alugueis.',
        'END.',
      ],
    },
  },
]

/* ------------------------------------------------------------------ */
/* Trabalhos acadêmicos                                                */
/* ------------------------------------------------------------------ */

export const coursework: Coursework[] = [
  {
    name: 'Triagem de helpdesk',
    context: 'Inteligência Artificial',
    summary: 'Classifica o tom dos chamados, define a prioridade e distribui entre os técnicos.',
    stack: ['Python', 'scikit-learn', 'lógica fuzzy', 'algoritmo genético'],
  },
  {
    name: 'Leilão de entregas',
    context: 'Inteligência Artificial',
    summary: 'Escolhe as entregas mais lucrativas do dia comparando busca A*, Simulated Annealing e algoritmo genético.',
    stack: ['Python'],
  },
  {
    name: 'Relatórios com assinatura digital',
    context: 'Segurança da Informação',
    summary: 'Envio de relatórios assinados digitalmente, com login e rotas protegidas.',
    stack: ['Node.js', 'Next.js', 'MongoDB', 'JWT'],
    repo: 'https://github.com/Wellerson-M/sistemaRelatorios',
  },
  {
    name: 'Climax',
    context: 'IoT, em dupla',
    summary: 'Sensor de temperatura e umidade com ESP32 enviando leituras por MQTT para um painel web.',
    stack: ['ESP32', 'C++', 'MQTT', 'JavaScript'],
    repo: 'https://github.com/Wellerson-M/Climax',
  },
  {
    name: 'Wade Club',
    context: 'Projeto de extensão, em dupla',
    summary: 'Loja virtual para uma marca local de roupas que vendia só pelo Instagram.',
    stack: ['PHP', 'MySQL'],
    repo: 'https://github.com/Wellerson-M/WadeClub',
  },
  {
    name: 'WLJ Sports',
    context: 'Técnico em Desenvolvimento de Sistemas, 2022',
    summary: 'Meu primeiro sistema: loja com cadastro, carrinho e painel administrativo.',
    stack: ['PHP', 'MySQL'],
    repo: 'https://github.com/Wellerson-M/WLJ-Sports',
  },
]

/* ------------------------------------------------------------------ */
/* Contato                                                             */
/* ------------------------------------------------------------------ */

export const contact = {
  email: 'wellersonmeredyk1@gmail.com',
  github: 'https://github.com/Wellerson-M',
  linkedin: 'https://www.linkedin.com/in/wellerson-meredyk-a2b38b1ab/',
  cv: '/assets/cv.pdf',
}

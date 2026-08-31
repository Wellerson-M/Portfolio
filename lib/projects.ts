export type Shot = {
  src: string
  alt: string
  caption: string
}

export type Project = {
  slug: string
  name: string
  tagline: string
  status?: string
  year?: string
  stack: string[]
  repo: string
  live?: string
  body: string[]
  shots?: Shot[]
  placeholder?: string
}

/* ------------------------------------------------------------------ */
/* Destaque: SIGOF                                                     */
/* ------------------------------------------------------------------ */

export const sigof = {
  name: 'SIGOF',
  subtitle: 'Sistema de gestão de ocorrências de frete · TCC · em andamento',
  repo: 'https://github.com/Wellerson-M/SIGOF',
  specRepo: 'https://github.com/Wellerson-M/Spec-kit',
  stack: [
    'Next.js',
    'Node.js',
    'Express',
    'PostgreSQL',
    'Prisma',
    'Redis',
    'S3/MinIO',
    'JWT + RBAC',
  ],
  body: [
    'Na Aceville, pedido de correção de CT-e circula por e-mail. Chega mensagem sem número de CT-e nem NF, só "favor reverter", e o analista caça a informação no histórico. A fila acaba ordenada por quem cobra mais, não por quem tem mais urgência.',
    'O SIGOF troca isso por ticket estruturado: protocolo gerado na abertura, fila priorizada, responsável atribuído, conversa registrada dentro do chamado e histórico auditável.',
    'O MVP é validado dentro da Aceville, mas o modelo de dados nasceu multi-tenant, com isolamento por transportadora, pensando em virar produto para transportadoras pequenas e médias. A documentação é uma RFC com C4 em três níveis, DER e fluxos de negócio.',
  ],
  sdd: {
    title: 'Do RFC ao código',
    repo: 'https://github.com/Wellerson-M/Spec-kit',
    body: 'Peguei a RFC do SIGOF e rodei o fluxo completo de spec-driven development do GitHub Spec-Kit: constituição do projeto, especificação, plano, quebra em tarefas, geração de issues e implementação até o scaffolding de backend e frontend. O ponto era medir quanta arquitetura dá pra fechar antes de escrever a primeira linha.',
    steps: [
      'constitution',
      'specify',
      'plan',
      'tasks',
      'issues',
      'implement',
    ],
  },
  mockups: [
    {
      src: '/assets/sigof/mockups/01-login.png',
      alt: 'Tela de login do SIGOF',
      caption: 'Login',
    },
    {
      src: '/assets/sigof/mockups/02-dashboard-solicitante.png',
      alt: 'Dashboard do solicitante, com lista das próprias solicitações',
      caption: 'Dashboard do solicitante',
    },
    {
      src: '/assets/sigof/mockups/03-nova-solicitacao.png',
      alt: 'Formulário de abertura de uma nova solicitação',
      caption: 'Nova solicitação',
    },
    {
      src: '/assets/sigof/mockups/04-dashboard-analista.png',
      alt: 'Dashboard do analista, com a fila de atendimento priorizada',
      caption: 'Fila do analista',
    },
    {
      src: '/assets/sigof/mockups/05-detalhes-solicitacao.png',
      alt: 'Detalhes de uma solicitação, com histórico e conversa',
      caption: 'Detalhes da solicitação',
    },
    {
      src: '/assets/sigof/mockups/06-dashboard-gerencial.png',
      alt: 'Dashboard gerencial com métricas de atendimento',
      caption: 'Dashboard gerencial',
    },
  ] satisfies Shot[],
  diagrams: [
    {
      src: '/assets/sigof/diagramas/c4-contexto.png',
      alt: 'Diagrama C4 de contexto do SIGOF',
      caption: 'C4 · contexto',
    },
    {
      src: '/assets/sigof/diagramas/c4-containers.png',
      alt: 'Diagrama C4 de containers do SIGOF',
      caption: 'C4 · containers',
    },
    {
      src: '/assets/sigof/diagramas/c4-componentes.png',
      alt: 'Diagrama C4 de componentes do SIGOF',
      caption: 'C4 · componentes',
    },
    {
      src: '/assets/sigof/diagramas/casos-de-uso.png',
      alt: 'Diagrama UML de casos de uso do SIGOF',
      caption: 'UML · casos de uso',
    },
  ] satisfies Shot[],
}

/* ------------------------------------------------------------------ */
/* Demos ao vivo                                                       */
/* ------------------------------------------------------------------ */

export const liveProjects: Project[] = [
  {
    slug: 'notes',
    name: 'Notes',
    tagline: 'Notas mobile-first como campo de teste de design',
    status: 'em andamento',
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Zustand',
      'Framer Motion',
      'Tailwind 4',
      'PWA',
    ],
    repo: 'https://github.com/Wellerson-M/Notes',
    live: 'https://notes-ten-tau-15.vercel.app/',
    body: [
      'App de notas mobile-first que uso como campo de teste de design e interação. Timeline filtrável por áudio, foto, tarefa ou nota fixada; diário com heatmap de atividade por dia; vault com biometria e auto-lock; editor com anexo de áudio, foto e tarefa, wikilink entre notas e backlinks.',
      'Roda com dados mock enquanto o front é lapidado. É daqui que veio a paleta grafite e âmbar deste portfolio.',
    ],
    shots: [
      {
        src: '/assets/notes/01-timeline.jpg',
        alt: 'Timeline de notas com filtros e nota fixada no topo',
        caption: 'Timeline com filtros',
      },
      {
        src: '/assets/notes/03-diario.jpg',
        alt: 'Diário com calendário heatmap de atividade e notas do dia',
        caption: 'Diário com heatmap',
      },
      {
        src: '/assets/notes/04-vault.jpg',
        alt: 'Vault bloqueado pedindo autenticação por biometria',
        caption: 'Vault com biometria',
      },
      {
        src: '/assets/notes/02-editor.jpg',
        alt: 'Editor de nota nova com barra de anexos e ações de IA',
        caption: 'Editor de nota',
      },
      {
        src: '/assets/notes/06-config-aparencia.jpg',
        alt: 'Configurações de aparência e de inteligência artificial',
        caption: 'Aparência e IA',
      },
    ],
  },
  {
    slug: 'denovonao',
    name: 'DeNovoNao',
    tagline: 'Histórico gastronômico pessoal, offline-first',
    status: 'MVP funcional',
    stack: [
      'Next.js',
      'TypeScript',
      'Dexie / IndexedDB',
      'Service Worker',
      'Express',
      'MongoDB',
      'JWT',
    ],
    repo: 'https://github.com/Wellerson-M/DeNovoNao',
    live: 'https://de-novo-nao.vercel.app/',
    body: [
      'Cada visita a um lugar entra como um registro novo na linha do tempo daquele restaurante, com nota, duas opiniões separadas, avisos críticos e chave de público ou privado. Dá pra ver se o lugar melhorou ou piorou entre uma ida e outra. Tem conta compartilhada entre duas pessoas e painel administrativo com moderação.',
      'Funciona offline: sem rede, a avaliação fica no IndexedDB e sincroniza sozinha na volta, com deduplicação por id de cliente pra não duplicar no reenvio.',
    ],
    shots: [
      {
        src: '/assets/denovonao/01-feed.jpg',
        alt: 'Feed inicial com busca, filtro por nota e últimas avaliações',
        caption: 'Feed com filtros',
      },
      {
        src: '/assets/denovonao/07-nova-visita.jpg',
        alt: 'Formulário de nova visita com local, data, delivery e nota',
        caption: 'Registrar visita',
      },
      {
        src: '/assets/denovonao/08-nova-visita-opinioes.jpg',
        alt: 'Campos de opinião, avisos críticos e chave de privacidade',
        caption: 'Duas opiniões por visita',
      },
      {
        src: '/assets/denovonao/03-admin-moderacao.jpg',
        alt: 'Painel administrativo na aba de moderação de avaliações',
        caption: 'Moderação',
      },
      {
        src: '/assets/denovonao/04-avaliacao-detalhe.jpg',
        alt: 'Avaliação aberta mostrando as duas opiniões e a data da visita',
        caption: 'Avaliação aberta',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Outros projetos                                                     */
/* ------------------------------------------------------------------ */

export const otherProjects: Project[] = [
  {
    slug: 'spotifyfilters',
    name: 'SpotifyFilters',
    tagline: 'Curtidas do Spotify viram sugestão de playlist',
    status: 'desktop app',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'SQLite', 'OpenAI API', 'Vitest'],
    repo: 'https://github.com/Wellerson-M/SpotifyFilters',
    body: [
      'Importa as curtidas via OAuth PKCE, enriquece com audio features, classifica a vibe de cada faixa com LLM e agrupa por clustering nas playlists sugeridas, que dá pra criar direto na conta.',
      'Tem modo manual pra quem não quer usar API paga: exporta um pacote, cola no ChatGPT e importa o retorno.',
    ],
    placeholder: 'print pendente · roda local',
  },
  {
    slug: 'climax',
    name: 'Climax',
    tagline: 'Temperatura e umidade em tempo real, do sensor ao navegador',
    stack: ['ESP32', 'DHT22', 'MQTT', 'Node.js', 'Chart.js'],
    repo: 'https://github.com/Wellerson-M/Climax',
    live: 'https://climaxtemp.netlify.app/',
    body: [
      'Um ESP32 com sensor DHT22 publica leitura a cada 30 segundos por MQTT, um serviço Node.js consome, calcula média móvel, detecta anomalia e projeta tendência por regressão linear, e o dashboard web mostra tudo em Chart.js com zoom, pan e exportação em CSV.',
      'Cinco camadas, do sensor físico até o navegador.',
    ],
  },
]

export const firstProject: Project = {
  slug: 'wlj-sports',
  name: 'WLJ-Sports',
  tagline: 'E-commerce de artigos esportivos em PHP puro',
  year: '2022',
  stack: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'XAMPP'],
  repo: 'https://github.com/Wellerson-M/WLJ-Sports',
  body: [
    'Feito no técnico de Ciência de Dados. Cadastro e login, catálogo por categoria, carrinho, favoritos, endereços, cartões e painel administrativo com CRUD de produto e usuário. Sem framework, sem ORM, query escrita na mão.',
    'Foi aqui que lógica, CRUD e banco pararam de ser matéria e viraram coisa que eu queria fazer.',
  ],
  placeholder: 'prints pendentes · precisa subir o XAMPP',
}

/* ------------------------------------------------------------------ */
/* Contato                                                             */
/* ------------------------------------------------------------------ */

export const contact = {
  email: 'wellersonmeredyk1@gmail.com',
  github: 'https://github.com/Wellerson-M',
  // Preencher com a URL real do perfil. Enquanto vazio, o link nao e renderizado.
  linkedin: '',
  cv: '/assets/cv.pdf',
}

export type Shot = {
  src: string
  alt: string
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
  device?: 'phone' | 'laptop'
  body: string[]
  shots?: Shot[]
  placeholder?: string
}

/* ------------------------------------------------------------------ */
/* Sobre                                                               */
/* ------------------------------------------------------------------ */

export const about = {
  role: 'Desenvolvedor de software · Backend · Web · Sistemas',
  short: [
    'Estudante de Engenharia de Software e desenvolvedor em formação. Trabalho principalmente com backend, APIs e banco de dados, construindo aplicações web e sistemas que atendem processos reais.',
    'Node.js, Next.js, JavaScript, TypeScript, PHP, MySQL e MongoDB são o que uso com mais frequência.',
  ],
  more: [
    'O que me interessa é entender como as coisas funcionam por dentro e transformar um processo confuso em um sistema que dá para manter. Menos ferramenta da moda, mais problema resolvido.',
    'A rotina de trabalho me aproximou de sistemas empresariais e da diferença que software faz em algo que uma equipe executa todo dia. É o tipo de problema que me atrai: pouco glamour, efeito direto.',
    'Antes da graduação fiz o técnico em Desenvolvimento de Sistemas, onde peguei a base de lógica, CRUD e banco. De lá para cá venho construindo projetos próprios e acadêmicos em aplicação web, API, banco de dados e IoT.',
    'O objetivo agora é evoluir como desenvolvedor trabalhando cada vez mais perto da construção de sistemas reais.',
  ],
}

/* ------------------------------------------------------------------ */
/* Destaque: SIGOF                                                     */
/* ------------------------------------------------------------------ */

export const sigof = {
  name: 'SIGOF',
  subtitle: 'Sistema de gestão de ocorrências de frete',
  status: 'em desenvolvimento',
  repo: 'https://github.com/Wellerson-M/SIGOF',
  intro:
    'Aplicação web para gerenciar ocorrências, correções e reversões de frete, centralizando em um só lugar informações que costumam ficar espalhadas entre processos diferentes.',
  problem: {
    title: 'O problema',
    body: 'Uma correção de frete carrega muita informação: número do documento, motivo, responsável, o que já foi tentado. Quando isso circula por mensagem solta, o contexto se perde, a mesma solicitação chega duas vezes e não sobra registro do que foi decidido. A fila acaba ordenada por quem insiste mais, não por urgência.',
  },
  solution: {
    title: 'A solução',
    body: 'O SIGOF concentra essas solicitações em uma aplicação web, com protocolo por atendimento e fluxo definido do início ao fim.',
    features: [
      'Abertura de solicitação com protocolo automático',
      'Fila priorizada e atribuição de responsável',
      'Controle de status do atendimento',
      'Histórico completo e auditável por ocorrência',
      'Comunicação registrada dentro do próprio chamado',
      'Anexo de documentos',
      'Autenticação com níveis de acesso',
      'Isolamento de dados por empresa',
    ],
  },
  build: {
    title: 'Construção',
    groups: [
      {
        label: 'Backend',
        items: [
          'Node.js',
          'Express',
          'API REST',
          'TypeScript',
          'JWT',
          'RBAC',
          'PostgreSQL',
          'Prisma',
        ],
      },
      {
        label: 'Frontend',
        items: ['Next.js', 'React', 'TypeScript', 'Componentização', 'Consumo de API'],
      },
      {
        label: 'Infraestrutura',
        items: ['Git / GitHub', 'Docker Compose', 'Variáveis de ambiente'],
      },
    ],
  },
  shots: [
    {
      src: '/assets/sigof/mockups/01-login.png',
      alt: 'Tela de login do SIGOF',
    },
    {
      src: '/assets/sigof/mockups/02-dashboard-solicitante.png',
      alt: 'Painel do solicitante com a lista das próprias solicitações',
    },
    {
      src: '/assets/sigof/mockups/03-nova-solicitacao.png',
      alt: 'Formulário de abertura de uma nova solicitação',
    },
    {
      src: '/assets/sigof/mockups/04-dashboard-analista.png',
      alt: 'Painel do analista com a fila de atendimento priorizada',
    },
    {
      src: '/assets/sigof/mockups/05-detalhes-solicitacao.png',
      alt: 'Detalhes de uma solicitação com histórico e comunicação',
    },
    {
      src: '/assets/sigof/mockups/06-dashboard-gerencial.png',
      alt: 'Painel gerencial com métricas de atendimento',
    },
  ] satisfies Shot[],
}

/* ------------------------------------------------------------------ */
/* Projetos com demo                                                   */
/* ------------------------------------------------------------------ */

export const liveProjects: Project[] = [
  {
    slug: 'notes',
    name: 'Notes',
    tagline: 'Bloco de notas com voz, templates e IA configurável',
    status: 'em desenvolvimento',
    device: 'phone',
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Zustand',
      'Framer Motion',
      'Tailwind',
      'PWA',
    ],
    repo: 'https://github.com/Wellerson-M/Notes',
    live: 'https://notes-ten-tau-15.vercel.app/',
    body: [
      'Bloco de notas para celular pensado para dar conta de tudo em um lugar só. A ideia é registrar sem atrito: escrever, ditar por voz ou puxar um dos templates prontos para os formatos que se repetem no dia a dia, em vez de começar toda nota de uma página em branco.',
      'Por cima disso existe uma camada de IA ligada por API e configurável pelo usuário, que interpreta, corrige, traduz, organiza em tópicos e ajuda a destravar ideia. O ganho não é a IA em si, é o tempo que ela tira do caminho entre pensar e ter aquilo anotado de forma utilizável.',
      'Completam o app um diário com visão do mês, ligação entre notas com backlinks, e um vault protegido por biometria para o que não deve ficar exposto.',
    ],
    shots: [
      {
        src: '/assets/notes/08-pwa-icone.jpg',
        alt: 'Ícone do app instalado na tela inicial do celular',
      },
      {
        src: '/assets/notes/01-timeline.jpg',
        alt: 'Lista de notas com filtros por tipo e nota fixada no topo',
      },
      {
        src: '/assets/notes/02-editor.jpg',
        alt: 'Editor de nota com barra de anexo, template e ações de IA',
      },
      {
        src: '/assets/notes/03-diario.jpg',
        alt: 'Diário com calendário de atividade e notas do dia selecionado',
      },
      {
        src: '/assets/notes/04-vault.jpg',
        alt: 'Vault bloqueado pedindo autenticação por biometria',
      },
      {
        src: '/assets/notes/06-config-aparencia.jpg',
        alt: 'Configurações de aparência e do provedor de IA',
      },
    ],
  },
  {
    slug: 'denovonao',
    name: 'DeNovoNao',
    tagline: 'Registro de visitas a restaurantes, offline-first',
    status: 'MVP funcional',
    device: 'laptop',
    stack: [
      'Next.js',
      'TypeScript',
      'Express',
      'MongoDB',
      'Mongoose',
      'JWT',
      'IndexedDB',
    ],
    repo: 'https://github.com/Wellerson-M/DeNovoNao',
    live: 'https://de-novo-nao.vercel.app/',
    body: [
      'Cada ida a um restaurante entra como um registro novo na linha do tempo daquele lugar, com nota, impressões separadas, avisos e a escolha entre público e privado. Assim a avaliação deixa de ser uma foto de um dia só e passa a mostrar se o lugar melhorou ou piorou entre uma visita e outra.',
      'O acesso pode ser compartilhado entre duas pessoas, que passam a alimentar o mesmo histórico, e há um painel de moderação para revisar o que foi publicado.',
      'Funciona sem internet: quando a rede cai, a avaliação fica salva no aparelho e sobe sozinha assim que a conexão volta, com controle para não duplicar o registro no reenvio.',
    ],
    shots: [
      {
        src: '/assets/denovonao/01-feed.jpg',
        alt: 'Feed inicial com busca, filtro por nota e últimas avaliações',
      },
      {
        src: '/assets/denovonao/07-nova-visita.jpg',
        alt: 'Formulário de nova visita com local, data e nota',
      },
      {
        src: '/assets/denovonao/08-nova-visita-opinioes.jpg',
        alt: 'Campos de impressões, avisos e chave de privacidade da visita',
      },
      {
        src: '/assets/denovonao/04-avaliacao-detalhe.jpg',
        alt: 'Avaliação aberta mostrando as impressões e a data da visita',
      },
      {
        src: '/assets/denovonao/03-admin-moderacao.jpg',
        alt: 'Painel de moderação das avaliações publicadas',
      },
      {
        src: '/assets/denovonao/05-login.jpg',
        alt: 'Tela de entrada com login e criação de conta',
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
    tagline: 'Organização de biblioteca musical com apoio de IA',
    status: 'aplicação local',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'SQLite', 'OpenAI API', 'Vitest'],
    repo: 'https://github.com/Wellerson-M/SpotifyFilters',
    body: [
      'Importa as músicas curtidas de uma conta do Spotify, enriquece cada faixa com características de áudio, classifica o perfil dela com IA e agrupa o resultado em playlists sugeridas, que podem ser criadas direto na conta.',
      'Também existe um modo manual, para uso sem API paga: a aplicação exporta um pacote de dados e importa de volta a sugestão gerada por fora.',
    ],
    placeholder: 'prints pendentes',
  },
  {
    slug: 'climax',
    name: 'Climax',
    tagline: 'Monitoramento de temperatura e umidade em tempo real',
    stack: ['ESP32', 'DHT22', 'MQTT', 'Node.js', 'Chart.js'],
    repo: 'https://github.com/Wellerson-M/Climax',
    live: 'https://climaxtemp.netlify.app/',
    body: [
      'Um microcontrolador com sensor de temperatura e umidade publica leituras a cada 30 segundos por MQTT. Um serviço em Node.js consome esse fluxo, calcula média móvel, detecta anomalia e projeta tendência por regressão linear.',
      'O painel web acompanha tudo em gráfico, com zoom, navegação pelo histórico e exportação dos dados.',
    ],
  },
]

export const firstProject: Project = {
  slug: 'wlj-sports',
  name: 'WLJ-Sports',
  tagline: 'E-commerce de artigos esportivos em PHP e MySQL',
  year: '2022',
  stack: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
  repo: 'https://github.com/Wellerson-M/WLJ-Sports',
  body: [
    'Loja completa construída durante o técnico: cadastro e login, catálogo por categoria, carrinho, favoritos, endereços, cartões e painel administrativo com CRUD de produto e usuário. Sem framework e sem ORM, com as consultas escritas na mão.',
    'É o projeto onde lógica, CRUD e banco de dados deixaram de ser conteúdo de aula.',
  ],
  placeholder: 'prints pendentes',
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

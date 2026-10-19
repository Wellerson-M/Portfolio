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

/** Um bloco do "ver mais": título curto e um parágrafo. */
export type Detail = {
  title: string
  text: string
}

export type Project = {
  slug: string
  name: string
  tagline: string
  /** Contexto curto acima do nome (TCC, freelance, uso pessoal). */
  note?: string
  summary: string
  points?: string[]
  details: Detail[]
  /** Trecho de código mostrado junto dos detalhes. */
  code?: { file: string; lines: string[] }
  stack: string[]
  repo?: string
  /** Link "abrir site". Sem ele, usa o endereço da demo. */
  live?: string
  demo?: Demo
  shots: Shot[]
  shotShape: Shape
}

export type MoreItem = {
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
  'Sou desenvolvedor web em Joinville (SC) e estudo Engenharia de Software na Católica SC. Antes disso, fiz o técnico em Desenvolvimento de Sistemas no SESI SENAI.',
  'Faço sites e sistemas: desde uma página para apresentar um negócio até aplicações com login, banco de dados e painel administrativo. A maioria dos projetos abaixo está no ar e dá para testar aqui mesmo.',
  'Também trabalho na operação de uma transportadora, e foi de lá que veio a ideia do SIGOF, meu TCC.',
]

export const skills = ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'MongoDB', 'Progress 4GL', 'Git']

/* ------------------------------------------------------------------ */
/* Projetos principais                                                 */
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
    details: [
      {
        title: 'Como funciona',
        text: 'Quem precisa da correção abre uma solicitação com o CT-e e a nota fiscal, e pode anexar PDF, imagem ou XML. O sistema gera o protocolo e avisa se já existe um pedido igual em aberto. O analista atende uma fila ordenada por prioridade e prazo, conversa com o solicitante dentro da própria solicitação e registra a solução. O supervisor acompanha os indicadores e exporta os dados em CSV.',
      },
      {
        title: 'Por dentro',
        text: 'API em Node.js com Express e TypeScript, banco PostgreSQL com Prisma e telas em Next.js. O prazo é contado em minutos úteis, respeitando o expediente e o fuso de cada empresa, e fica pausado enquanto o pedido aguarda documento. Várias empresas usam o mesmo sistema, e cada uma só enxerga os próprios dados.',
      },
      {
        title: 'Cuidados',
        text: 'Login com sessão em cookie protegido, bloqueio após tentativas erradas, proteção contra CSRF e trilha de auditoria. O código tem testes automatizados que rodam no GitHub Actions a cada mudança, e o ambiente sobe com Docker.',
      },
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
      'O app de notas que uso no dia a dia: tarefas, agenda, ligação entre notas e um assistente com IA. Tudo fica salvo no aparelho e sincroniza quando a conexão volta. A demonstração abre com notas fictícias, guardadas só no seu navegador.',
    details: [
      {
        title: 'Como funciona',
        text: 'Toda nota é gravada primeiro no próprio aparelho, então o app abre e salva mesmo sem internet. Quando a conexão volta, as notas alteradas sobem para o servidor e chegam aos outros aparelhos. Ele pode ser instalado na tela inicial como um aplicativo.',
      },
      {
        title: 'Recursos',
        text: 'Tarefas com lembrete, agenda com calendário, ligação entre notas e um grafo que mostra essas conexões, histórico de versões de cada nota e um cofre com senha, cifrado no aparelho. O assistente lê as notas, responde perguntas e cria notas novas por texto ou voz.',
      },
      {
        title: 'Por dentro',
        text: 'Next.js com rotas de API na Vercel. No aparelho, os dados ficam no IndexedDB; na nuvem, no MongoDB. A chave da IA (Gemini) fica só no servidor, e o modo demonstração usa um banco separado no navegador, sem tocar nos dados reais.',
      },
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'IndexedDB', 'MongoDB', 'PWA'],
    repo: 'https://github.com/Wellerson-M/Notes',
    demo: {
      src: 'https://notes-ten-tau-15.vercel.app/?demo',
      device: 'phone',
      poster: '/assets/posters/notes.webp',
    },
    shotShape: 'phone',
    shots: [
      { src: '/assets/notes/01-notas.webp', alt: 'Lista de notas com filtros e tarefas' },
      { src: '/assets/notes/02-nota-conexoes.webp', alt: 'Nota com sugestões de conexão com outras notas' },
      { src: '/assets/notes/03-nota-links.webp', alt: 'Nota com link para outra nota' },
      { src: '/assets/notes/04-agenda.webp', alt: 'Agenda com calendário do mês' },
      { src: '/assets/notes/05-grafo.webp', alt: 'Grafo de conexões entre as notas' },
      { src: '/assets/notes/06-assistente.webp', alt: 'Assistente com IA' },
      { src: '/assets/notes/07-vault.webp', alt: 'Cofre de notas com senha' },
      { src: '/assets/notes/08-temas.webp', alt: 'Configurações com escolha de tema' },
    ],
  },
  {
    slug: 'denovonao',
    name: 'De Novo Não',
    note: 'pessoal · no ar',
    tagline: 'Avaliações de restaurantes para não repetir pedido ruim',
    summary:
      'Cada ida a um restaurante vira um registro com nota, impressões e avisos, e o lugar ganha um histórico. As avaliações podem ser públicas ou privadas e, sem internet, ficam salvas no aparelho até a conexão voltar.',
    details: [
      {
        title: 'Como funciona',
        text: 'Cada visita guarda a nota, a opinião de cada pessoa do casal, avisos como "veio frio" e quanto custou. Com várias visitas ao mesmo lugar, o app mostra a média e a faixa de preço. Dá para buscar por nome ou local e filtrar pela nota.',
      },
      {
        title: 'Painel administrativo',
        text: 'Moderação das avaliações, lixeira com restauração, registro de quem fez o quê (com IP), suspensão de contas, encerramento de sessões e link de troca de senha para quem esqueceu.',
      },
      {
        title: 'Por dentro',
        text: 'Frontend em Next.js na Vercel e API em Express com TypeScript, com banco MongoDB. Login com JWT, limite de tentativas e fotos guardadas no Cloudinary. Funciona como aplicativo instalável (PWA).',
      },
    ],
    stack: ['Next.js', 'TypeScript', 'Express', 'MongoDB', 'JWT'],
    repo: 'https://github.com/Wellerson-M/DeNovoNao',
    demo: {
      src: 'https://de-novo-nao.vercel.app/',
      device: 'phone',
      poster: '/assets/posters/denovonao.webp',
    },
    shotShape: 'phone',
    shots: [
      { src: '/assets/denovonao/01-inicio.webp', alt: 'Tela inicial com busca e filtro por nota' },
      { src: '/assets/denovonao/02-avaliacao.webp', alt: 'Avaliação com a opinião de cada pessoa' },
      { src: '/assets/denovonao/03-feed.webp', alt: 'Lista de avaliações' },
      { src: '/assets/denovonao/04-login.webp', alt: 'Tela de login' },
    ],
  },
  {
    slug: 'chale',
    name: 'Chalé Mirante dos Anjos',
    note: 'proposta de site · freelance',
    tagline: 'Site para uma hospedagem em Rodeio (SC)',
    summary:
      'Site para um chalé anunciado no Airbnb, com fotos, guia da região, avaliações dos hóspedes e reserva. Foi feito como proposta para a proprietária.',
    details: [
      {
        title: 'A ideia',
        text: 'Dar ao chalé um endereço próprio, que possa ser divulgado fora do Airbnb, e levar quem chega direto às fotos, às avaliações e à reserva. Escolhendo as datas no calendário, o botão abre o Airbnb já com elas preenchidas.',
      },
      {
        title: 'Guia do Vale',
        text: 'Um guia em formato de livro, que se folheia na tela, com os lugares que a anfitriã indica na região. Cada página tem o mapa, a distância de carro e um botão que abre a rota no celular.',
      },
      {
        title: 'Por dentro',
        text: 'HTML, CSS e JavaScript puro, sem framework. Cada foto existe em três tamanhos, e o navegador baixa só o que a tela precisa, então o site continua leve no celular. Tem prévia para WhatsApp e mapa do site para buscadores.',
      },
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
    demo: {
      src: 'https://mirantedosanjos.netlify.app/',
      device: 'laptop',
      poster: '/assets/posters/chale.webp',
    },
    shotShape: 'desk',
    shots: [
      { src: '/assets/chale/01-inicio.webp', alt: 'Início do site com a vista do chalé' },
      { src: '/assets/chale/02-destaques.webp', alt: 'Destaques do chalé' },
      { src: '/assets/chale/03-galeria.webp', alt: 'Galeria de fotos por ambiente' },
      { src: '/assets/chale/04-guia.webp', alt: 'Capa do Guia do Vale' },
      { src: '/assets/chale/08-livro.webp', alt: 'Guia do Vale aberto, com o sumário' },
      { src: '/assets/chale/05-mapa.webp', alt: 'Mapa com os lugares da região' },
      { src: '/assets/chale/06-avaliacoes.webp', alt: 'Avaliações dos hóspedes' },
      { src: '/assets/chale/07-reserva.webp', alt: 'Calendário de reserva' },
    ],
  },
  {
    slug: 'videolocadora',
    name: 'Videolocadora',
    note: 'Bootcamp TOTVS · projeto final',
    tagline: 'Sistema de locadora em Progress OpenEdge',
    summary:
      'Cadastros de cidades, filmes e clientes e o registro de aluguéis, com relatórios e exportação dos dados. Feito no bootcamp de Progress da TOTVS, a linguagem por trás do ERP Datasul.',
    details: [
      {
        title: 'Como funciona',
        text: 'Cada cadastro tem navegação entre registros, inclusão, alteração e exclusão. Um aluguel reúne vários filmes, com quantidade e valor, e o total é calculado na hora. Os filmes são escolhidos numa lista dos cadastrados.',
      },
      {
        title: 'Regras de integridade',
        text: 'O sistema não deixa excluir um filme que aparece em algum aluguel, nem um cliente que tem aluguéis. Ao excluir um aluguel, os itens são apagados junto, numa única transação: ou sai tudo, ou nada.',
      },
      {
        title: 'Relatórios',
        text: 'Relatórios de clientes e de aluguéis em texto, exportação de cada cadastro e dos aluguéis completos em JSON.',
      },
    ],
    code: {
      file: 'cadAlugueis.p',
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
    stack: ['Progress 4GL', 'OpenEdge'],
    repo: 'https://github.com/Wellerson-M/VideoLocadora',
    shotShape: 'desk',
    shots: [
      { src: '/assets/videolocadora/07-alugueis.webp', alt: 'Aluguel com vários filmes e total calculado' },
      { src: '/assets/videolocadora/08-selecao-filme.webp', alt: 'Escolha do filme para o aluguel' },
      { src: '/assets/videolocadora/03-filmes.webp', alt: 'Cadastro de filmes' },
      { src: '/assets/videolocadora/04-filme-em-uso.webp', alt: 'Aviso ao tentar excluir um filme que está em aluguel' },
      { src: '/assets/videolocadora/05-clientes.webp', alt: 'Cadastro de clientes' },
      { src: '/assets/videolocadora/06-cliente-com-aluguel.webp', alt: 'Aviso ao tentar excluir um cliente com aluguéis' },
      { src: '/assets/videolocadora/02-cidades.webp', alt: 'Cadastro de cidades' },
      { src: '/assets/videolocadora/01-menu.webp', alt: 'Menu principal' },
      { src: '/assets/videolocadora/09-relatorio-clientes.webp', alt: 'Relatório de clientes' },
      { src: '/assets/videolocadora/10-exportacao-json.webp', alt: 'Aluguéis exportados em JSON' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Outros projetos e trabalhos acadêmicos                              */
/* ------------------------------------------------------------------ */

export const more: MoreItem[] = [
  {
    name: 'Spotify Filters',
    context: 'Projeto pessoal',
    summary: 'Lê as músicas curtidas pelo login do Spotify, classifica a vibe de cada faixa com IA e sugere playlists, que podem ser criadas direto na conta.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'Spotify API', 'OpenAI'],
    repo: 'https://github.com/Wellerson-M/SpotifyFilters',
  },
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

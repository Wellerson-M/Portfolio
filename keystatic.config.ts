import { collection, config, fields, singleton } from '@keystatic/core'

/*
 * Painel de conteúdo em /keystatic. Em desenvolvimento grava direto nos
 * arquivos; no site publicado, cada "salvar" vira um commit na master e a
 * Vercel publica sozinha. Só quem tem acesso de escrita ao repositório entra.
 *
 * Atenção ao mexer nos campos de imagem: o Keystatic trata a pasta de cada
 * entrada (ex.: public/assets/projetos/notes) como dele e apaga dali o que
 * não estiver referenciado. Por isso nada fora de projetos/ e outros/.
 */

const useGithub =
  process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB === '1'

// Por padrão o Keystatic renomeia cada imagem para o caminho do campo ao
// salvar (shots/0/src.webp), e renomeia de novo a cada reordenação. Assim o
// arquivo mantém o nome com que foi enviado, que dá para editar no upload.
type ImageField = ReturnType<typeof fields.image>

function keepName<F extends ImageField>(field: F): F {
  return {
    ...field,
    serialize: (...[value, args]: Parameters<ImageField['serialize']>) =>
      field.serialize(value, { ...args, suggestedFilenamePrefix: undefined }),
  }
}

const stackField = fields.array(fields.text({ label: 'Tecnologia' }), {
  label: 'Tecnologias',
  itemLabel: (props) => props.value || 'nova',
})

export default config({
  storage: useGithub
    ? { kind: 'github', repo: { owner: 'Wellerson-M', name: 'Portfolio' } }
    : { kind: 'local' },
  ui: {
    brand: { name: 'Portfólio' },
    navigation: {
      Site: ['perfil'],
      Projetos: ['projetos', 'outros'],
    },
  },
  singletons: {
    perfil: singleton({
      label: 'Topo, Sobre e Contato',
      path: 'content/perfil',
      format: { data: 'json' },
      schema: {
        line: fields.text({
          label: 'Frase do topo',
          description: 'Aparece sendo digitada logo abaixo do nome.',
          validation: { isRequired: true },
        }),
        about: fields.array(fields.text({ label: 'Parágrafo', multiline: true }), {
          label: 'Sobre',
          description: 'O primeiro parágrafo aparece em destaque.',
          itemLabel: (props) => props.value.slice(0, 70) || 'novo parágrafo',
        }),
        skills: fields.array(fields.text({ label: 'Item' }), {
          label: 'Com o que trabalho',
          itemLabel: (props) => props.value || 'novo',
        }),
        email: fields.text({ label: 'E-mail', validation: { isRequired: true } }),
        github: fields.url({ label: 'GitHub', validation: { isRequired: true } }),
        linkedin: fields.url({ label: 'LinkedIn' }),
      },
    }),
  },
  collections: {
    projetos: collection({
      label: 'Projetos principais',
      path: 'content/projetos/*',
      slugField: 'name',
      format: { data: 'json' },
      columns: ['name', 'order'],
      schema: {
        name: fields.slug({
          name: { label: 'Nome' },
          slug: {
            label: 'Identificador',
            description: 'Vira a âncora (#) do projeto e o nome da pasta dos prints. Evite trocar depois.',
          },
        }),
        order: fields.integer({
          label: 'Ordem',
          description: 'Menor aparece primeiro.',
          defaultValue: 10,
          validation: { isRequired: true },
        }),
        note: fields.text({ label: 'Contexto', description: 'Linha âmbar acima do nome (ex.: "TCC · no ar").' }),
        tagline: fields.text({ label: 'Chamada', validation: { isRequired: true } }),
        summary: fields.text({ label: 'Resumo', multiline: true, validation: { isRequired: true } }),
        points: fields.array(fields.text({ label: 'Destaque' }), {
          label: 'Destaques',
          description: 'Lista curta ao lado do resumo. Opcional.',
          itemLabel: (props) => props.value || 'novo',
        }),
        details: fields.array(
          fields.object({
            title: fields.text({ label: 'Título', validation: { isRequired: true } }),
            text: fields.text({ label: 'Texto', multiline: true, validation: { isRequired: true } }),
          }),
          {
            label: 'Blocos do "ver mais"',
            itemLabel: (props) => props.fields.title.value || 'novo bloco',
          },
        ),
        code: fields.object(
          {
            file: fields.text({ label: 'Nome do arquivo' }),
            lines: fields.text({ label: 'Código', multiline: true }),
          },
          { label: 'Trecho de código', description: 'Deixe o nome do arquivo vazio para não mostrar.' },
        ),
        stack: stackField,
        repo: fields.url({ label: 'Repositório' }),
        live: fields.url({ label: 'Site', description: 'Link "abrir site". Vazio usa o endereço da demonstração.' }),
        demo: fields.conditional(fields.checkbox({ label: 'Tem demonstração ao vivo' }), {
          true: fields.object({
            src: fields.url({ label: 'Endereço aberto na moldura', validation: { isRequired: true } }),
            device: fields.select({
              label: 'Moldura',
              options: [
                { label: 'Celular', value: 'phone' },
                { label: 'Notebook', value: 'laptop' },
              ],
              defaultValue: 'phone',
            }),
            poster: keepName(
              fields.image({
              label: 'Capa',
              description: 'Print mostrado enquanto o site carrega.',
              directory: 'public/assets/projetos',
              publicPath: '/assets/projetos/',
              validation: { isRequired: true },
              }),
            ),
          }),
          false: fields.empty(),
        }),
        shotShape: fields.select({
          label: 'Formato dos prints',
          options: [
            { label: 'Celular', value: 'phone' },
            { label: 'Tela (mockup)', value: 'screen' },
            { label: 'Desktop', value: 'desk' },
          ],
          defaultValue: 'desk',
        }),
        shotsNote: fields.text({ label: 'Aviso acima dos prints' }),
        shots: fields.array(
          fields.object({
            src: keepName(
              fields.image({
              label: 'Imagem',
              directory: 'public/assets/projetos',
              publicPath: '/assets/projetos/',
              validation: { isRequired: true },
              }),
            ),
            alt: fields.text({ label: 'Descrição', validation: { isRequired: true } }),
          }),
          {
            label: 'Prints',
            itemLabel: (props) => props.fields.alt.value || 'novo print',
          },
        ),
      },
    }),
    outros: collection({
      label: 'Outros projetos',
      path: 'content/outros/*',
      slugField: 'name',
      format: { data: 'json' },
      columns: ['name', 'order'],
      schema: {
        name: fields.slug({ name: { label: 'Nome' } }),
        order: fields.integer({
          label: 'Ordem',
          description: 'Menor aparece primeiro.',
          defaultValue: 10,
          validation: { isRequired: true },
        }),
        context: fields.text({ label: 'Contexto', validation: { isRequired: true } }),
        summary: fields.text({ label: 'Resumo', multiline: true, validation: { isRequired: true } }),
        stack: stackField,
        repo: fields.url({ label: 'Repositório' }),
        image: keepName(
          fields.image({
            label: 'Imagem',
            directory: 'public/assets/outros',
            publicPath: '/assets/outros/',
          }),
        ),
        imageAlt: fields.text({ label: 'Descrição da imagem' }),
      },
    }),
  },
})

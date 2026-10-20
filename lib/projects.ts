import { createReader } from '@keystatic/core/reader'
import type { Shape } from '@/components/ui/Carousel'
import keystaticConfig from '@/keystatic.config'

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
  /** Aviso curto logo acima dos prints (ex.: quando são mockups). */
  shotsNote?: string
}

export type MoreItem = {
  name: string
  context: string
  summary: string
  stack: string[]
  repo?: string
  image?: Shot
}

export type Contact = {
  email: string
  github: string
  linkedin?: string
  cv: string
}

export type Content = {
  line: string
  about: string[]
  skills: string[]
  featured: Project[]
  more: MoreItem[]
  contact: Contact
}

/* ------------------------------------------------------------------ */
/* Leitura                                                             */
/* ------------------------------------------------------------------ */

// O conteúdo mora em content/ e é editado pelo painel em /keystatic (veja
// keystatic.config.ts). Aqui ele só é lido no build e convertido para os
// tipos acima. O currículo fica fora do painel: é trocado pelo fluxo próprio.

const reader = createReader(process.cwd(), keystaticConfig)

const orNone = (value: string | null) => value || undefined

export async function getContent(): Promise<Content> {
  const [perfil, projetos, outros] = await Promise.all([
    reader.singletons.perfil.readOrThrow(),
    reader.collections.projetos.all(),
    reader.collections.outros.all(),
  ])

  const featured = projetos
    .sort((a, b) => a.entry.order - b.entry.order)
    .map(({ slug, entry }): Project => ({
      slug,
      name: entry.name,
      note: orNone(entry.note),
      tagline: entry.tagline,
      summary: entry.summary,
      points: entry.points.length ? [...entry.points] : undefined,
      details: entry.details.map((detail) => ({ ...detail })),
      code: entry.code.file ? { file: entry.code.file, lines: entry.code.lines.split(/\r?\n/) } : undefined,
      stack: [...entry.stack],
      repo: orNone(entry.repo),
      live: orNone(entry.live),
      demo: entry.demo.discriminant ? { ...entry.demo.value } : undefined,
      shots: entry.shots.map((shot) => ({ ...shot })),
      shotShape: entry.shotShape,
      shotsNote: orNone(entry.shotsNote),
    }))

  const more = outros
    .sort((a, b) => a.entry.order - b.entry.order)
    .map(({ entry }): MoreItem => ({
      name: entry.name,
      context: entry.context,
      summary: entry.summary,
      stack: [...entry.stack],
      repo: orNone(entry.repo),
      image: entry.image ? { src: entry.image, alt: entry.imageAlt } : undefined,
    }))

  return {
    line: perfil.line,
    about: [...perfil.about],
    skills: [...perfil.skills],
    featured,
    more,
    contact: {
      email: perfil.email,
      github: perfil.github,
      linkedin: orNone(perfil.linkedin),
      cv: '/assets/cv.pdf',
    },
  }
}

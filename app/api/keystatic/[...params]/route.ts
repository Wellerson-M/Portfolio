import { makeRouteHandler } from '@keystatic/next/route-handler'
import config from '@/keystatic.config'

// Sem as chaves do GitHub App na Vercel, o painel fica desligado em vez de
// derrubar o build do site inteiro.
const configured =
  config.storage.kind === 'local' ||
  Boolean(
    process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
      process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
      process.env.KEYSTATIC_SECRET,
  )

const offline = () => new Response('Painel não configurado.', { status: 503 })

export const { POST, GET } = configured ? makeRouteHandler({ config }) : { POST: offline, GET: offline }

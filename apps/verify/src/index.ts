import type { ExportedHandler } from '@cloudflare/workers-types'

export default {
  async fetch(request, env) {
    return Response.json({ data: 'test' })
  },
} satisfies ExportedHandler<Cloudflare.Env>

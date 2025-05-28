import { env } from 'cloudflare:workers'
import type { ExportedHandler } from '@cloudflare/workers-types'

const ttl = 600

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const hostname = url.searchParams.get('hostname')

    if (!hostname)
      return Response.json({ error: 'No hostname provided' }, { status: 400 })

    const response = (await fetch(env.VERIFY_CONFIG_URL, {
      cf: {
        cacheEverything: true,
        cacheTtl: ttl,
      },
    })
      .then((x) => x.json())
      .catch(() => ({}))) as {
      whitelist?: string[] | undefined
      blacklist?: string[] | undefined
    }

    const whitelisted =
      response.whitelist?.some((h) => hostname.endsWith(h)) ||
      extraConfig.whitelist.some((h) => hostname.endsWith(h))
    const blacklisted =
      response.blacklist?.some((h) => hostname.endsWith(h)) ||
      extraConfig.blacklist.some((h) => hostname.endsWith(h))

    const status = (() => {
      if (blacklisted) return 'blacklisted'
      if (whitelisted) return 'whitelisted'
      return 'unknown'
    })()

    return Response.json(
      { status },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': `max-age=${ttl}, stale-while-revalidate=1`,
        },
      },
    )
  },
} satisfies ExportedHandler<Cloudflare.Env>

const extraConfig = {
  blacklist: [],
  whitelist: ['porto.sh'],
} as const

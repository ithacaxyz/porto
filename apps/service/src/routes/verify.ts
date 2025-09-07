import { env } from 'cloudflare:workers'
import { Hono } from 'hono'
import { hostnames } from 'porto/trusted-hosts'

const ttl = 600

const verifyApp = new Hono<{ Bindings: Cloudflare.Env }>()

verifyApp.get('/', async (context) => {
  const hostname = context.req.query('hostname')
  if (!hostname) return context.json({ error: 'Hostname is required' }, 400)

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
    response.whitelist?.some((h) => hostname === h) ||
    extraConfig.whitelist.some((h) => hostname === h)
  const blacklisted =
    response.blacklist?.some((h) => hostname === h) ||
    extraConfig.blacklist.some((h) => hostname === h)

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
})

const extraConfig = {
  blacklist: [],
  whitelist: hostnames,
} as const

export { verifyApp }

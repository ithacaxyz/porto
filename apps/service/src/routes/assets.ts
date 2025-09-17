import { Hono } from 'hono'

const assetsApp = new Hono<{ Bindings: Cloudflare.Env }>()

assetsApp.get('/icons/token/:symbol', async (context) => {
  const symbol = context.req.param('symbol')
  const sanitizedSymbol = symbol.includes('.') ? symbol : `${symbol}.svg`

  const asset = await context.env.R2_PORTO.get(`icons/token/${sanitizedSymbol}`)
  if (!asset) return context.json({ error: 'Asset not found' }, 404)

  const contentType = asset.httpMetadata?.contentType ?? 'image/svg+xml'

  return new Response(await asset.arrayBuffer(), {
    headers: { 'Content-Type': contentType },
  })
})

assetsApp.get('/icons/chain/:chain-id', async (context) => {
  const chainId = context.req.param('chain-id')
  const sanitizedChainId = chainId.includes('.') ? chainId : `${chainId}.svg`

  const asset = await context.env.R2_PORTO.get(
    `icons/chain/${sanitizedChainId}`,
  )
  if (!asset) return context.json({ error: 'Asset not found' }, 404)

  const contentType = asset.httpMetadata?.contentType ?? 'image/svg+xml'

  return new Response(await asset.arrayBuffer(), {
    headers: { 'Content-Type': contentType },
  })
})

export { assetsApp }

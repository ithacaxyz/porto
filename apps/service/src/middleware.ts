import { getConnInfo } from 'hono/cloudflare-workers'
import { createMiddleware } from 'hono/factory'

export const rateLimitMiddleware = createMiddleware<{
  Bindings: Cloudflare.Env
}>(async (context, next) => {
  const identifier = context.req.header('route-rate-limit-identifier')
  const ip =
    context.req.header('cf-connecting-ip') ||
    getConnInfo(context).remote.address

  // TODO: remove
  if (!ip && !identifier) return next()

  if (ip && ['127.0.0.1', '::1'].includes(ip)) return next()

  const { success } = await context.env.RATE_LIMITER.limit({
    key: ip ?? identifier!,
  })

  if (!success) return context.json({ error: 'Rate limit exceeded' }, 429)

  await next()
})

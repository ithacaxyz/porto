import { Hono } from 'hono'
import { cors } from 'hono/cors'

const corsApp = new Hono<{ Bindings: Cloudflare.Env }>()

corsApp.use('*', async (context, next) => {
  const corsMiddlewareHandler = cors({
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    origin: (origin, _originContext) => {
      if (context.env.ENVIRONMENT === 'local') return origin
      return origin?.endsWith('.porto.sh') ? origin : ''
    },
  })
  return corsMiddlewareHandler(context, next)
})

corsApp.get('/', async (context) => {
  const { url, headers, method } = context.req.raw
  const destUrl = new URL(url).searchParams.get('url')

  if (!destUrl)
    return context.text('Missing destination URL search param. Try ?url=', {
      status: 400,
    })

  if (
    method === 'OPTIONS' &&
    headers.has('Origin') &&
    headers.has('Access-Control-Request-Method')
  ) {
    const responseHeaders = {
      'Access-Control-Allow-Headers':
        headers.get('Access-Control-Request-Headers') ?? '',
      'Access-Control-Allow-Methods': '*', // Allow all methods
      'Access-Control-Allow-Origin': headers.get('Origin') ?? '',
      'Access-Control-Max-Age': '86400',
    }
    return new Response(null, { headers: responseHeaders })
  }

  const proxyRequest = new Request(destUrl, {
    headers: { ...headers, Origin: '' },
    method,
  })

  try {
    const response = await fetch(proxyRequest)
    const { body, status, statusText } = response
    const headers = new Headers(response.headers)
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Credentials', 'true')
    headers.set('Access-Control-Allow-Methods', '*')

    return new Response(body, { headers, status, statusText })
  } catch (error) {
    return new Response('Error occurred while fetching the resource.', {
      status: 500,
    })
  }
})

export { corsApp }

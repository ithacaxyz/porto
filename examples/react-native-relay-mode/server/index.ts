import NodePath from 'node:path'

const server = Bun.serve({
  port: Number(Bun.env.PORT || 69_69),
  routes: {
    '/': () => new Response('ok'),
    '/.well-known/apple-app-site-association': async (request, server) => {
      const url = new URL(request.url)
      const ipAddress = server.requestIP(request)
      console.info(`Request from ${ipAddress?.address} ${url.pathname}`)

      const filePath = NodePath.join(
        import.meta.dirname,
        './apple-app-site-association',
      )

      return Response.json(await Bun.file(filePath).json())
    },
    '/.well-known/apple-app-site-association.json': async () =>
      Response.redirect('/.well-known/apple-app-site-association', 301),
    '/.well-known/assetlinks.json': async (request, server) => {
      const url = new URL(request.url)
      const ipAddress = server.requestIP(request)
      console.info(`Request from ${ipAddress?.address} ${url.pathname}`)

      const filePath = NodePath.join(import.meta.dirname, './assetlinks.json')

      return Response.json(await Bun.file(filePath).json())
    },
  },
})

const stopAndExit = () => [server.stop(), process.exit(0)]

process.on('SIGINT', () => stopAndExit())
process.on('SIGTERM', () => stopAndExit())
process.on('SIGQUIT', () => stopAndExit())

if (Bun.env.NODE_ENV === 'development')
  console.info(`Server is running on http://localhost:${server.port}`)
else console.info(`Server is running on port ${server.port}`)

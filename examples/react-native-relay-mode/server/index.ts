const server = Bun.serve({
  development: Bun.env.NODE_ENV !== 'production',
  error: (error) => {
    console.error('Error in bun server:', error)

    return new Response('Internal Server Error', { status: 500 })
  },
  port: Number(Bun.env.PORT),
  routes: {
    '/': () => new Response('ok'),

    '/.well-known/apple-app-site-association': {
      async GET(request, server) {
        const ipAddress = server.requestIP(request)
        console.info(`Request from ${ipAddress?.address}`)

        return Response.json(
          await Bun.file('./apple-app-site-association').json(),
        )
      },
    },
    '/.well-known/assetlinks.json': {
      GET: async (request, server) => {
        const ipAddress = server.requestIP(request)
        console.info(`Request from ${ipAddress?.address}`)

        return Response.json(await Bun.file('./assetlinks.json').json())
      },
    },
  },
})

const stopAndExit = () => [server.stop(), process.exit(0)]

process.on('SIGINT', () => stopAndExit())
process.on('SIGTERM', () => stopAndExit())
process.on('SIGQUIT', () => stopAndExit())

if (Bun.env.ENVIRONMENT === 'development')
  console.info(`Server is running on http://localhost:${server.port}`)
else console.info(`Server is running on port ${server.port}`)

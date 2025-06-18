import * as Http from 'node:http'
import type { AddressInfo } from 'node:net'

export type Server = Http.Server & {
  closeAsync: () => Promise<unknown>
  url: string
}

export function createServer(handler: Http.RequestListener): Promise<Server> {
  const server = Http.createServer(handler)

  console.log('Creating server')
  return new Promise((resolve, reject) => {
    server.on('error', reject)
    server.listen(() => {
      const { port } = server.address() as AddressInfo
      console.log(`Server listening on port ${port}`)
      resolve(
        Object.assign(server, {
          closeAsync() {
            return new Promise((resolve, reject) =>
              server.close((err) => (err ? reject(err) : resolve(undefined))),
            )
          },
          url: `http://localhost:${port}`,
        }),
      )
    })
  })
}

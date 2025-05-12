import * as Http from 'node:http'
import type { AddressInfo } from 'node:net'

export type Server = {
  close: () => Promise<unknown>
  url: string
}

export function createServer(handler: Http.RequestListener): Promise<Server> {
  const server = Http.createServer(handler)

  const closeAsync = () =>
    new Promise((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve(undefined))),
    )

  return new Promise((resolve) => {
    server.listen(() => {
      const { port } = server.address() as AddressInfo
      resolve({
        close: closeAsync,
        url: `http://localhost:${port}`,
      })
    })
  })
}

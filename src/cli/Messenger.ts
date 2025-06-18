import * as Url from 'node:url'
import type * as Messenger from '../core/Messenger.js'
import * as Http from './internal/http.js'

export type LocalRelay = Messenger.Messenger & { callbackUrl: string }

export async function localRelay(): Promise<LocalRelay> {
  const listenerSets = new Map<
    string,
    Set<(payload: any, event: any) => void>
  >()

  const server = await Http.createServer((req, res) => {
    const url = Url.parse(req.url!, true)

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
      res.writeHead(200)
      res.end()
      return
    }

    if (req.method === 'POST' && url.pathname === '/callback') {
      let body = ''

      req.on('data', (chunk) => (body += chunk.toString()))

      req.on('end', () => {
        try {
          const data = JSON.parse(body)

          // Handle the received data
          if (data.topic && data.payload !== undefined) {
            const listeners = listenerSets.get(data.topic)
            if (listeners) {
              const event = { data, origin: 'http://localhost' }
              for (const listener of listeners) listener(data.payload, event)
            }
          }

          res.writeHead(200, { 'Content-Type': 'text/plain' })
          res.end('ok')
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'text/plain' })
          res.end('Invalid JSON')
        }
      })
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('not found')
    }
  })

  const callbackUrl = `${server.url}/callback`

  return {
    callbackUrl,
    destroy() {
      listenerSets.clear()
      server.close()
    },
    on(topic, listener) {
      if (!listenerSets.has(topic)) listenerSets.set(topic, new Set())
      listenerSets.get(topic)!.add(listener)

      return () => {
        const listeners = listenerSets.get(topic)
        if (!listeners) return

        listeners.delete(listener)
        if (listeners.size === 0) listenerSets.delete(topic)
      }
    },
    send() {
      throw new Error('Not implemented')
    },
    sendAsync() {
      throw new Error('Not implemented')
    },
  }
}

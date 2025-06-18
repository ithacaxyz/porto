import type { ServerResponse } from 'node:http'
import * as Url from 'node:url'
import type * as Messenger from '../core/Messenger.js'
import * as Http from './internal/http.js'

export type CliRelay = Messenger.Messenger & { relayUrl: string }

export async function cliRelay(): Promise<CliRelay> {
  const listenerSets = new Map<
    string,
    Set<(payload: any, event: any) => void>
  >()

  const streams = new Set<ServerResponse>()

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

    if (req.method === 'GET' && url.pathname === '/') {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
      })

      streams.add(res)

      req.on('close', () => streams.delete(res))

      return
    }

    if (req.method === 'POST' && url.pathname === '/') {
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

  const relayUrl = server.url

  return {
    destroy() {
      listenerSets.clear()
      for (const stream of streams)
        try {
          stream.end()
        } catch {}

      streams.clear()
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
    relayUrl,
    async send(topic, payload) {
      const id = crypto.randomUUID()
      const data = { id, payload, topic }

      const eventData = `data: ${JSON.stringify(data)}\n\n`
      for (const stream of streams) {
        try {
          stream.write(eventData)
        } catch {
          streams.delete(stream)
        }
      }

      return { id, payload, topic } as never
    },
    async sendAsync() {
      throw new Error('Not implemented')
    },
  }
}

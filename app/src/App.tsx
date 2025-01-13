'use client'

import { RpcResponse } from 'ox'
import { Implementation, Porto } from 'porto'
import { Anvil } from 'porto/test'
import { useEffect, useState } from 'react'

export const porto = Porto.create({
  chains: [Anvil.chain(), ...Porto.defaultConfig.chains],
  implementation: Implementation.local(),
  transports: {
    ...Porto.defaultConfig.transports,
    [Anvil.chain().id]: Anvil.transport(),
  },
})

export function App() {
  const [request, setRequest] = useState<Porto.QueuedRequest | null>(null)

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.data.topic !== 'rpc-request') return
      const request = event.data.request satisfies Porto.QueuedRequest
      setRequest(request)
    })
  }, [])

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          if (!request) return
          try {
            const result = await porto.provider.request(request.request)
            window.parent.postMessage(
              {
                topic: 'rpc-response',
                response: RpcResponse.from({
                  id: request.request.id,
                  jsonrpc: '2.0',
                  result,
                }),
              },
              '*',
            )
          } catch (e) {
            const error = e as { code: number; message: string }
            window.parent.postMessage(
              {
                topic: 'rpc-response',
                response: RpcResponse.from({
                  id: request.request.id,
                  jsonrpc: '2.0',
                  error: {
                    code: error.code,
                    message: error.message,
                  },
                }),
              },
              '*',
            )
          }
        }}
      >
        respond
      </button>
      <button
        type="button"
        onClick={async () => {
          if (!request) return
          window.parent.postMessage(
            {
              topic: 'rpc-response',
              response: RpcResponse.from({
                id: request.request.id,
                jsonrpc: '2.0',
                error: {
                  code: 4001,
                  message: 'User rejected the request',
                },
              }),
            },
            '*',
          )
        }}
      >
        reject
      </button>
    </div>
  )
}

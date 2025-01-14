'use client'

import { Provider, RpcResponse } from 'ox'
import { Implementation, Porto, Storage } from 'porto'
import { useEffect, useState } from 'react'

export const porto = Porto.create({
  implementation: Implementation.local(),
  storage: Storage.localStorage(),
})

const parent = window.opener ?? window.parent

export function App() {
  const [requests, setRequests] = useState<readonly Porto.QueuedRequest[]>([])

  useEffect(() => {
    parent.postMessage({ topic: 'ready' }, '*')

    function onMessage(event: MessageEvent) {
      if (event.data.topic !== 'rpc-requests') return
      const requests = event.data
        .requests satisfies readonly Porto.QueuedRequest[]
      setRequests(requests)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          if (requests.length === 0) return
          const request = requests[0]!
          try {
            const result = await porto.provider.request(request.request)
            parent.postMessage(
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
            const error = e as RpcResponse.BaseError
            parent.postMessage(
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
          if (requests.length === 0) return
          const request = requests[0]!
          parent.postMessage(
            {
              topic: 'rpc-response',
              response: RpcResponse.from({
                id: request.request.id,
                jsonrpc: '2.0',
                error: {
                  code: Provider.UserRejectedRequestError.code,
                  message: 'User rejected the request.',
                },
              }),
            },
            '*',
          )
        }}
      >
        reject
      </button>
      <div>
        {requests.map((request) => (
          <div key={request.request.id}>
            {request.request.id}: {request.request.method}
            {request.status}
          </div>
        ))}
      </div>
    </div>
  )
}

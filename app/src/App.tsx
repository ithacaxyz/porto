'use client'

import { Provider, RpcResponse } from 'ox'
import { Implementation, Messenger, Porto, Storage } from 'porto'
import { useCallback, useEffect, useState } from 'react'

export const porto = Porto.create({
  implementation: Implementation.local(),
  storage: Storage.localStorage(),
})

const messenger = Messenger.bridge({
  from: Messenger.fromWindow(window),
  to: Messenger.fromWindow(window.opener ?? window.parent),
})

export function App() {
  const [requests, setRequests] = useState<readonly Porto.QueuedRequest[]>([])

  useEffect(() => {
    messenger.ready()
    return messenger.on('rpc-requests', setRequests)
  }, [])

  const reject = useCallback(async () => {
    if (requests.length === 0) return
    const request = requests[0]!
    messenger.send(
      'rpc-response',
      RpcResponse.from({
        id: request.request.id,
        jsonrpc: '2.0',
        error: {
          code: Provider.UserRejectedRequestError.code,
          message: 'User rejected the request.',
        },
      }),
    )
  }, [requests])

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          if (requests.length === 0) return
          const request = requests[0]!
          try {
            const result = await porto.provider.request(request.request)
            messenger.send(
              'rpc-response',
              RpcResponse.from({
                id: request.request.id,
                jsonrpc: '2.0',
                result,
              }),
            )
          } catch (e) {
            const error = e as RpcResponse.BaseError
            messenger.send(
              'rpc-response',
              RpcResponse.from({
                id: request.request.id,
                jsonrpc: '2.0',
                error: {
                  code: error.code,
                  message: error.message,
                },
              }),
            )
          }
        }}
      >
        respond
      </button>
      <button type="button" onClick={reject}>
        reject
      </button>
      <button type="button" onClick={reject}>
        close
      </button>
      <div>
        {requests.map((request) => (
          <div key={request.request.id}>
            {request.request.id}: {request.request.method} {request.status}
          </div>
        ))}
      </div>
    </div>
  )
}

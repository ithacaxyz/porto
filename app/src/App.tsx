'use client'

import { Provider, type RpcRequest, RpcResponse } from 'ox'
import { Implementation, Messenger, Porto, Storage } from 'porto'
import type { Schema } from 'porto/core/internal/rpcSchema'
import { useCallback, useEffect, useState } from 'react'
import LucideX from '~icons/lucide/x'

export const porto = Porto.create({
  implementation: Implementation.local(),
  storage: Storage.localStorage(),
})

const messenger = Messenger.bridge({
  from: Messenger.fromWindow(window),
  to: Messenger.fromWindow(window.opener ?? window.parent),
})

export function App() {
  const [data, setData] = useState<{
    dialog: 'iframe' | 'popup'
    hostname: string
  }>()
  const [requests, setRequests] = useState<readonly Porto.QueuedRequest[]>([])

  useEffect(() => {
    messenger.ready()

    const rpcRequestsOff = messenger.on('rpc-requests', setRequests)
    const internalOff = messenger.on('_internal', listener)
    function listener(
      payload: Parameters<Parameters<typeof messenger.on<'_internal'>>[1]>[0],
    ) {
      if (payload.type === 'initial') {
        setData((x) => ({
          ...x,
          dialog: payload.dialog,
          hostname: payload.hostname,
        }))
      }
    }

    return () => {
      rpcRequestsOff()
      internalOff()
    }
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

  const respond = useCallback(async () => {
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
  }, [requests])

  return (
    <main
      data-iframe={data?.dialog === 'iframe'}
      className="h-fit border-neutral-5 bg-neutral-0 data-[iframe=true]:rounded-[10px] data-[iframe=true]:border dark:border-neutral-6 dark:bg-neutral-1"
    >
      <header className="flex items-center justify-between border-neutral-5/50 border-b px-3 pt-2 pb-1.5 dark:border-neutral-6/60">
        <div className="flex items-center gap-2">
          <div className="font-normal text-[14px] text-neutral-10 leading-[22px]">
            {data?.hostname}
          </div>
        </div>

        <button
          type="button"
          onClick={reject}
          title="Close Dialog"
          className="-me-0.5 flex items-center justify-center rounded-md p-0.5 hover:bg-neutral-3 dark:hover:bg-neutral-4"
        >
          <LucideX className="size-4.5 text-neutral-12/50" />
        </button>
      </header>

      {requests[0]?.request && (
        <RequestContent
          request={requests[0]?.request as RequestContent.Props['request']}
          onReject={reject}
          onRespond={respond}
        />
      )}
    </main>
  )
}

function RequestContent(props: RequestContent.Props) {
  const { request, onReject, onRespond } = props

  if (request.method === 'wallet_connect') {
    const capabilities = request.params?.[0]?.capabilities
    const createAccount = capabilities?.createAccount
    return (
      <div className="flex flex-col gap-2.5 p-3">
        <div className="font-medium text-[18px]">
          {createAccount ? 'Sign up' : 'Sign in'}
        </div>

        <div className="text-[15px] leading-[22px] opacity-80">
          {createAccount
            ? 'Sign up with a passkey. This should only take a few seconds.'
            : 'Connect your account to sign in.'}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReject}
            className="h-9 w-full rounded-lg bg-neutral-3 font-medium text-[15px] leading-[22px] dark:bg-neutral-4"
          >
            No thanks
          </button>

          <button
            type="button"
            onClick={onRespond}
            className="h-9 w-full rounded-lg bg-neutral-3 font-medium text-[15px] leading-[22px] dark:bg-neutral-4"
          >
            {createAccount ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-col gap-2.5 p-3">
      <div className="text-[15px] leading-[22px] opacity-80">
        request {request.method} not implemented
      </div>
    </div>
  )
}

declare namespace RequestContent {
  type Props = {
    request: RpcRequest.RpcRequest<Schema>
    onReject: () => void
    onRespond: () => void
  }
}

import * as Provider from 'ox/Provider'
import * as RpcResponse from 'ox/RpcResponse'

import type * as Porto from '../core/Porto.js'
import type * as Remote from './Porto.js'

/**
 * Action to reject an RPC request.
 *
 * @param porto - Porto instance.
 * @param request - Request to reject.
 * @param error - Error to reject with.
 */
export async function reject(
  porto: Pick<Remote.Porto<any>, 'messenger'>,
  request: Porto.QueuedRequest['request'],
  error?: Provider.ProviderRpcError | RpcResponse.BaseError | undefined,
) {
  const error_ = error ?? new Provider.UserRejectedRequestError()
  const { messenger } = porto
  messenger.send(
    'rpc-response',
    Object.assign(
      RpcResponse.from({
        error: {
          code: error_.code,
          message: error_.message,
        },
        id: request.id,
        jsonrpc: '2.0',
      }),
      {
        _request: request,
      },
    ),
  )
}

/**
 * Action to reject all RPC requests.
 *
 * @param porto - Porto instance.
 * @param error - Error to reject with.
 */
export async function rejectAll(
  porto: Pick<Remote.Porto<any>, 'messenger' | '_internal'>,
  error?: Provider.ProviderRpcError | RpcResponse.BaseError | undefined,
) {
  const { _internal } = porto
  const requests = _internal.remoteStore.getState().requests
  for (const request of requests) await reject(porto, request.request, error)
}

/**
 * Action to respond to an RPC request.
 *
 * @param porto - Porto instance.
 * @param request - Request to respond to.
 */
export async function respond<result>(
  porto: Pick<Remote.Porto<any>, 'messenger' | 'provider'>,
  request: Porto.QueuedRequest['request'],
  options?: {
    error?: RpcResponse.ErrorObject | undefined
    onError?: (error: RpcResponse.BaseError) =>
      | undefined
      | {
          cancelResponse: boolean
        }
    result?: result | undefined
    selector?: (result: result) => unknown
  },
) {
  const { messenger, provider } = porto
  const { error, selector } = options ?? {}
  const shared = {
    id: request.id,
    jsonrpc: '2.0',
  } as const

  if (error) {
    messenger.send(
      'rpc-response',
      Object.assign(RpcResponse.from({ ...shared, error, status: 'error' }), {
        _request: request,
      }),
    )
    return
  }

  try {
    let result = options?.result ?? (await provider.request(request))
    if (selector) result = selector(result as never)
    messenger.send(
      'rpc-response',
      Object.assign(RpcResponse.from({ ...shared, result }), {
        _request: request,
      }),
    )
    return result
  } catch (e) {
    const error = e as RpcResponse.BaseError
    if (options?.onError?.(error)?.cancelResponse === true)
      // If the onError callback sets cancelResponse to true,
      // we do not send a response.
      return
    messenger.send(
      'rpc-response',
      Object.assign(RpcResponse.from({ ...shared, error, status: 'error' }), {
        _request: request,
      }),
    )
    throw error
  }
}

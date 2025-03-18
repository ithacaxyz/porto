import * as Provider from 'ox/Provider'
import * as RpcResponse from 'ox/RpcResponse'

import type * as Porto from '../core/Porto.js'
import type * as Remote from './Porto.js'

/**
 * Action to reject an RPC request.
 *
 * @param porto - Porto instance.
 * @param request - Request to reject.
 */
export async function reject(
  porto: Pick<Remote.Porto<any>, 'messenger'>,
  request: Porto.QueuedRequest,
) {
  const { messenger } = porto
  messenger.send(
    'rpc-response',
    Object.assign(
      RpcResponse.from({
        id: request.request.id,
        jsonrpc: '2.0',
        error: {
          code: Provider.UserRejectedRequestError.code,
          message: 'User rejected the request.',
        },
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
 */
export async function rejectAll(
  porto: Pick<Remote.Porto<any>, 'messenger' | '_internal'>,
) {
  const { _internal } = porto
  const requests = _internal.remoteStore.getState().requests
  for (const request of requests) await reject(porto, request)
}

/**
 * Action to respond to an RPC request.
 *
 * @param porto - Porto instance.
 * @param request - Request to respond to.
 */
export async function respond<result>(
  porto: Pick<Remote.Porto<any>, 'messenger' | 'provider'>,
  request: Porto.QueuedRequest,
  options?: {
    selector?: (result: result) => unknown
  },
) {
  const { messenger, provider } = porto
  const { selector } = options ?? {}
  const shared = { id: request.request.id, jsonrpc: '2.0' } as const
  try {
    let result = await provider.request(request.request)
    if (selector) result = selector(result as never)
    messenger.send(
      'rpc-response',
      Object.assign(RpcResponse.from({ ...shared, result }), {
        _request: request,
      }),
    )
  } catch (e) {
    const error = e as RpcResponse.BaseError
    messenger.send(
      'rpc-response',
      Object.assign(RpcResponse.from({ ...shared, error }), {
        _request: request,
      }),
    )
    throw error
  }
}

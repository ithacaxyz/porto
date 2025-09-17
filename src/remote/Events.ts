import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import * as Provider from 'ox/Provider'
import * as z from 'zod/mini'
import * as Rpc from '../core/internal/schema/rpc.js'
import type { Payload } from '../core/Messenger.js'
import * as Actions from './Actions.js'
import type * as Remote from './Porto.js'

const trustedOrigins = ['id.porto.sh', 'localhost:5174', 'localhost:5173']

/**
 * Event listener which is triggered when a request is ready
 * to be handled by the dialog.
 *
 * @param porto - Porto instance.
 * @param cb - Callback function.
 * @returns Unsubscribe function.
 */
export function onDialogRequest(
  porto: Pick<
    Remote.Porto<any>,
    '_internal' | 'methodPolicies' | 'messenger' | 'provider'
  >,
  cb: (payload: onDialogRequest.Payload) => void,
) {
  return onRequests(porto, (requests, event) => {
    let account: onDialogRequest.Payload['account']
    let request_dialog: onDialogRequest.Payload['request'] | undefined
    let requireConnection: boolean | undefined

    // Process the pending requests, as well as finding the first request
    // that requires the dialog.
    for (const r of requests) {
      const { request } = r ?? {}

      // If this request doesn't have a JSON-RPC request, skip it.
      if (!request) continue

      // If this request is a wallet_connect request, we need to make sure
      // the provided chain ids are supported by the dialog.
      if (request.method === 'wallet_connect') {
        const params = z.decode(
          Rpc.wallet_connect.Parameters,
          request.params?.[0] as never,
        )

        // Extract chainIds that the app has requested.
        const chainIds_app = params?.chainIds
        if (chainIds_app?.[0]) {
          const chainIds = porto._internal.store.getState().chainIds

          // Find the first app chain that is supported by the dialog.
          const chainId = chainIds_app.find((chainId) =>
            chainIds.includes(chainId),
          )

          // If the requested chain is not supported, respond with an error.
          if (!chainId) {
            Actions.respond(porto, request, {
              error: new Provider.UnsupportedChainIdError(),
            }).catch(() => {})
            continue
          }

          // Update the dialog chainIds so that the app chain is the "active" chain.
          porto._internal.store.setState((x) => ({
            ...x,
            chainIds: [chainId, ...x.chainIds.filter((x) => x !== chainId)],
          }))
        }
      }

      // Extract the method policy for this request. Method policies are
      // used to determine if the request should be headless (bypassed), or
      // if it is supported by the dialog.
      const policy = porto.methodPolicies?.find(
        (policy) => policy.method === request.method,
      )

      const shouldBypass = (() => {
        if (!request) return false

        const rule = policy?.modes?.headless
        if (rule) {
          if (
            typeof rule === 'object' &&
            rule.sameOrigin &&
            event.origin !== window.location.origin
          )
            return false
          return true
        }

        return false
      })()
      if (shouldBypass) {
        Actions.respond(porto, request).catch(() => {})
        continue
      }

      const rule = policy?.modes?.dialog
      const shouldDialog = (() => {
        if (!rule) return true
        if (
          typeof rule === 'object' &&
          rule.sameOrigin &&
          event.origin !== window.location.origin
        )
          return trustedOrigins.some((origin) => event.origin.endsWith(origin))
        return rule
      })()
      if (!shouldDialog) {
        Actions.respond(porto, request, {
          error: new Provider.UnsupportedMethodError(),
        }).catch(() => {})
        continue
      }

      // If this requests requires a specific account, set it.
      account ??= r.account
      // If this request requires an account connection, set it.
      requireConnection ??= policy?.requireConnection ?? true
      // At this point, we know that this request should be handled by the dialog.
      request_dialog ??= request
    }

    cb({
      account: requireConnection ? account : undefined,
      origin: event.origin,
      request: request_dialog ?? null,
    })
  })
}

export declare namespace onDialogRequest {
  type Payload = {
    account?:
      | {
          address: Address.Address
          key?:
            | {
                credentialId?: string | undefined
                publicKey: Hex.Hex
              }
            | undefined
        }
      | undefined
    request: Remote.RemoteState['requests'][number]['request'] | null
    origin: string
  }
}

/**
 * Event listener which is triggered when the remote context receives
 * an initialization message from the parent context.
 *
 * @param porto - Porto instance.
 * @param cb - Callback function.
 * @returns Unsubscribe function.
 */
export function onInitialized(
  porto: Pick<Remote.Porto<any>, 'messenger'>,
  cb: (
    payload: Extract<Payload<'__internal'>, { type: 'init' }>,
    event: MessageEvent,
  ) => void,
) {
  const { messenger } = porto
  return messenger.on('__internal', (payload, event) => {
    if (payload.type === 'init') cb(payload, event)
  })
}

/**
 * Event listener which is triggered when the remote context receives
 * an RPC request from the parent context.
 *
 * @param porto - Porto instance.
 * @param cb - Callback function.
 * @returns Unsubscribe function.
 */
export function onRequests(
  porto: Pick<Remote.Porto<any>, '_internal' | 'messenger'>,
  cb: (payload: Remote.RemoteState['requests'], event: MessageEvent) => void,
) {
  const { messenger, _internal } = porto
  return messenger.on('rpc-requests', (payload, event) => {
    const requests = payload as Remote.RemoteState['requests']
    _internal.remoteStore.setState({ requests })
    cb(requests, event)
  })
}

import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import * as Provider from 'ox/Provider'
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
  cb: (payload: {
    account?:
      | {
          address: Address.Address
          credentialId?: string | undefined
          keyId?: Hex.Hex | undefined
        }
      | undefined
    requireUpdatedAccount?: boolean | undefined
    request: Remote.RemoteState['requests'][number]['request'] | null
  }) => void,
) {
  return onRequests(porto, (requests, event) => {
    const { account, request } = requests[0] ?? {}

    if (!request) {
      cb({ request: null })
      return
    }

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
      return
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
      return
    }

    const requireUpdatedAccount = policy?.requireUpdatedAccount ?? true
    const requireConnection = policy?.requireConnection ?? true

    cb({
      account: requireConnection ? account : undefined,
      request,
      requireUpdatedAccount,
    })
  })
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
  cb: (payload: Extract<Payload<'__internal'>, { type: 'init' }>) => void,
) {
  const { messenger } = porto
  return messenger.on('__internal', (payload) => {
    if (payload.type === 'init') cb(payload)
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

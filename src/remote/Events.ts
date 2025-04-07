import * as Provider from 'ox/Provider'
import type { Payload } from '../core/Messenger.js'
import * as Actions from './Actions.js'
import type * as Remote from './Porto.js'

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
  cb: (payload: Remote.RemoteState['requests'][number]['request']) => void,
) {
  return onRequests(porto, (requests, event) => {
    const request = requests[0]?.request
    if (!request) return

    const policy = porto.methodPolicies?.find(
      (policy) => policy.method === request.method,
    )

    const shouldBypass = (() => {
      if (!request) return false

      const rule = policy?.modes.headless
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

    const rule = policy?.modes.dialog
    const shouldDialog = (() => {
      if (!policy) return true
      if (
        typeof rule === 'object' &&
        rule.sameOrigin &&
        event.origin !== window.location.origin
      )
        return false
      return rule
    })()
    if (!shouldDialog) {
      Actions.respond(porto, request, {
        error: new Provider.UnsupportedMethodError(),
      }).catch(() => {})
      return
    }

    cb(request)
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

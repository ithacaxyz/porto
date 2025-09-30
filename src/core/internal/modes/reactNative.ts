import * as Json from 'ox/Json'
import * as Provider from 'ox/Provider'
import type * as RpcResponse from 'ox/RpcResponse'

import * as Dialog from '../../Dialog.js'
import * as Mode from '../mode.js'
import { dialog } from './dialog.js'

type ReactNativeStatus = 'cancel' | 'error' | 'success' | 'unknown'
const ReactNativeStatus = {
  cancel: 'cancel',
  error: 'error',
  success: 'success',
  unknown: 'unknown',
} as const

type ReactNativeContext = {
  os?: 'ios' | 'android' | 'web' | undefined
  redirectUri: string
}

type RedirectPayload = {
  message?: string | undefined
  payload?: string | undefined
  status: ReactNativeStatus
}

let contextCache: ReactNativeContext | null | undefined

function getReactNativeContext(): ReactNativeContext | undefined {
  if (contextCache !== undefined) return contextCache ?? undefined
  if (typeof window === 'undefined') {
    contextCache = null
    return undefined
  }

  try {
    const searchParams = new URLSearchParams(window.location.search)
    const redirectUri = searchParams.get('redirectUri')
    if (!redirectUri || !URL.canParse(redirectUri)) {
      contextCache = null
      return undefined
    }

    const os = searchParams.get('os')
    const normalizedOs = (() => {
      if (os === 'ios' || os === 'android' || os === 'web') return os
      return undefined
    })()

    contextCache = { os: normalizedOs, redirectUri }
    return contextCache
  } catch {
    contextCache = null
    return undefined
  }
}

function performReactNativeRedirectURL(
  context: ReactNativeContext,
  payload: RedirectPayload,
) {
  if (typeof window === 'undefined') return

  const { redirectUri } = context

  if (!URL.canParse(redirectUri)) throw new Error('invalid redirectUri')

  const { message = '', payload: payload_ = '{}', status } = payload
  const params = new URLSearchParams({
    message,
    payload: payload_,
    status,
  })

  window.location.href = `${redirectUri}?${params.toString()}`
}

function createSuccessPayload(result: unknown): RedirectPayload {
  return {
    payload: Json.stringify(result ?? {}),
    status: ReactNativeStatus.success,
  }
}

function createErrorPayload(
  error: Pick<RpcResponse.ErrorObject, 'code' | 'message'> | undefined,
): RedirectPayload {
  if (error?.code === Provider.UserRejectedRequestError.code)
    return {
      message: 'User rejected request',
      status: ReactNativeStatus.cancel,
    }

  return {
    message: error?.message ?? 'Request failed',
    status: ReactNativeStatus.error,
  }
}

export function reactNative(parameters: reactNative.Parameters = {}) {
  const { renderer = Dialog.popup(), ...rest } = parameters

  const base = dialog({
    ...rest,
    renderer,
  })

  return Mode.from({
    ...base,
    name: 'reactNative',
    setup(options) {
      const destroyBase = base.setup(options)
      const context = getReactNativeContext()
      if (!context) return destroyBase

      const handled = new Set<string>()
      const { store } = options.internal

      const unsubscribe = store.subscribe(
        (state) => state.requestQueue,
        (requestQueue) => {
          for (const queued of requestQueue) {
            if (queued.request.method !== 'wallet_connect') continue
            const key = `${queued.request.id ?? 'unknown'}:${queued.request.method}`
            if (handled.has(key)) continue
            if (queued.status === 'pending') continue

            handled.add(key)

            if (queued.status === 'success') {
              performReactNativeRedirectURL(
                context,
                createSuccessPayload(queued.result),
              )
              continue
            }

            performReactNativeRedirectURL(
              context,
              createErrorPayload(queued.error),
            )
          }
        },
      )

      return () => {
        unsubscribe()
        destroyBase()
      }
    },
  })
}

export declare namespace reactNative {
  export type Parameters = dialog.Parameters
}

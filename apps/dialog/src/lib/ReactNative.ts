import * as Json from 'ox/Json'
import * as Provider from 'ox/Provider'
import * as React from 'react'

export function isReactNativeRequest() {
  if (typeof window === 'undefined') return false
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.has('redirectUri')
}

function userRejected(error: unknown) {
  if (error instanceof Provider.UserRejectedRequestError) return true
  if (typeof error !== 'object' || error === null) return false
  const code = Object.hasOwn(error, 'code') ? (error as any).code : undefined
  return code === Provider.UserRejectedRequestError.code
}

export function useAuthSessionRedirect(
  mutation: useAuthSessionRedirect.Options,
) {
  const hasRedirectedRef = React.useRef(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isReactNativeRequest()) return
    if (hasRedirectedRef.current) return

    const { isError, isSuccess } = mutation
    if (!isError && !isSuccess) return

    let searchParams: URLSearchParams
    try {
      searchParams = new URLSearchParams(window.location.search)
    } catch {
      return
    }

    const redirectUri = searchParams.get('redirectUri')
    if (!redirectUri) return

    const schemeRegex = /^([a-z][a-z\d+\-.]*):/i
    if (!schemeRegex.test(redirectUri)) return

    const params = new URLSearchParams()

    if (isSuccess) {
      const data = mutation.data
      if (
        data &&
        typeof data === 'object' &&
        'cancelResponse' in data &&
        data.cancelResponse
      )
        return

      params.set('status', 'success')
      if (mutation.data !== undefined)
        params.set('payload', Json.stringify(mutation.data))
    } else if (isError) {
      params.set('status', userRejected(mutation.error) ? 'cancel' : 'error')

      const message = (() => {
        if (mutation.error instanceof Error) return mutation.error.message
        if (userRejected(mutation.error)) return 'User rejected request'
        if (
          typeof mutation.error === 'object' &&
          mutation.error !== null &&
          'message' in mutation.error &&
          typeof (mutation.error as { message?: unknown }).message === 'string'
        )
          return (mutation.error as { message: string }).message
        return 'Request failed'
      })()

      if (message) params.set('message', message)
    }

    const redirectTarget = `${redirectUri}?${params.toString()}`
    hasRedirectedRef.current = true

    try {
      window.location.href = redirectTarget
    } catch {
      window.open(redirectTarget, '_blank')
    }
  }, [mutation.data, mutation.error, mutation.isError, mutation.isSuccess])
}

export declare namespace useAuthSessionRedirect {
  export type Options = {
    isError: boolean
    isSuccess: boolean
    error: unknown
    data: unknown
  }
}

import { PortoConfig } from '@porto/apps'
import * as Json from 'ox/Json'
import * as Provider from 'ox/Provider'
import * as React from 'react'

import type { porto } from './Porto'

type ChainIds = ReturnType<typeof porto._internal.store.getState>['chainIds']
type ChainId = ChainIds[number]

export const reactNativeHost = (() => {
  if (!isReactNativeRequest()) return undefined

  const current = new URL(window.location.href)
  current.pathname = current.pathname.replace(/\/[\w-]+$/, '/')
  const preserved = new URLSearchParams()
  const allowed = new Set(['relayEnv'])
  for (const [key, value] of current.searchParams.entries()) {
    if (allowed.has(key)) preserved.set(key, value)
  }
  current.search = preserved.toString()
  current.hash = ''
  return current.toString()
})()

export const reactNativePreferredChainIds = (() =>
  isReactNativeRequest()
    ? getReactNativeChainIds(
        window.location.search,
        new Set(PortoConfig.getConfig().chains.map((chain) => chain.id)),
      )
    : [])()

function getReactNativeChainIds(
  search: string,
  allowedIds: ReadonlySet<ChainId>,
): Array<ChainId> {
  const params = new URLSearchParams(search)
  const collected = new Set<ChainId>()

  const add = (value: ChainId) => allowedIds.has(value) && collected.add(value)

  function traverse(value: unknown, depth = 0) {
    if (depth > 6) return
    if (Array.isArray(value)) {
      for (const item of value) traverse(item, depth + 1)
      return
    }
    if (value && typeof value === 'object') {
      for (const [key, entry] of Object.entries(value)) {
        if (key === 'chainId') add(entry)
        else if (key === 'chainIds' && Array.isArray(entry))
          for (const id of entry) add(id)
        traverse(entry, depth + 1)
      }
    }
  }

  const decodedParams = params.get('_decoded')
  if (decodedParams)
    try {
      traverse(JSON.parse(decodedParams))
    } catch {
      // ignore parse failures – fall back to other parameters
    }

  const rawParams = params.get('params')
  if (rawParams)
    try {
      traverse(JSON.parse(rawParams))
    } catch {
      // ignore parse failures
    }

  const chainId = params.get('chainId')
  if (chainId) {
    const parsed = Number(chainId) as ChainId
    if (!Number.isNaN(parsed)) add(parsed)
  }

  return Array.from(collected)
}

declare namespace getReactNativeChainIds {
  type Parameters = {
    search: string
    allowedIds: ReadonlySet<ChainId>
  }
  type ReturnType = ChainIds
}

export function reorderChainIds(
  parameters: reorderChainIds.Parameters,
): reorderChainIds.ReturnType {
  const seen = new Set<ChainId>()
  const next = [] as Array<ChainId>

  for (const id of parameters.preferred)
    if (!seen.has(id) && parameters.current.includes(id)) {
      next.push(id)
      seen.add(id)
    }

  for (const id of parameters.current)
    if (!seen.has(id)) {
      next.push(id)
      seen.add(id)
    }

  return next as unknown as ChainIds
}

export declare namespace reorderChainIds {
  type Parameters = {
    current: ChainIds
    preferred: ReadonlyArray<ChainId>
  }
  type ReturnType = ChainIds
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

export function isReactNativeRequest() {
  if (typeof window === 'undefined') return false
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.has('redirectUri')
}

export function arraysEqual(a: readonly number[], b: readonly number[]) {
  if (a.length !== b.length) return false
  return a.every((value, index) => value === b[index])
}

function userRejected(error: unknown) {
  if (error instanceof Provider.UserRejectedRequestError) return true
  if (typeof error !== 'object' || error === null) return false
  const code = Object.hasOwn(error, 'code') ? (error as any).code : undefined
  return code === Provider.UserRejectedRequestError.code
}

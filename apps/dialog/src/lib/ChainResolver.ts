import * as React from 'react'
import { porto } from '~/lib/Porto'

export function useResolvedChainId(
  parameters: useResolvedChainId.Parameters,
): useResolvedChainId.Result {
  const { chainId } = parameters

  // Prefer `porto.chainId` (forwarded to dialog as `chainId`) from URL, else fallback to props.
  return React.useMemo(() => {
    if (typeof window === 'undefined') return chainId
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('chainId') ?? params.get('porto.chainId')
    if (!raw) return chainId
    const parsed = (() => {
      try {
        if (/^0x/i.test(raw)) return Number.parseInt(raw, 16)
        return Number.parseInt(raw, 10)
      } catch {
        return undefined as number | undefined
      }
    })()
    if (parsed === undefined || Number.isNaN(parsed)) return chainId
    // Ensure the chain is supported by the dialog; otherwise fallback to prop.
    const supported = porto._internal.config.chains.some((c) => c.id === parsed)
    return supported ? parsed : chainId
  }, [chainId])
}

declare namespace useResolvedChainId {
  export type Parameters = {
    chainId?: number | undefined
  }

  export type Result = number | undefined
}

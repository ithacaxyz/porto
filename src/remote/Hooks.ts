import { useMemo } from 'react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'

import type * as Chains from '../core/Chains.js'
import * as Porto_internal from '../core/internal/porto.js'
import type * as Porto from '../core/Porto.js'
import type * as Remote from './Porto.js'

/**
 * Hook to access and subscribe to the current chain.
 *
 * @param porto - Porto instance.
 * @returns Chain.
 */
export function useActiveChain<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(porto: Pick<Remote.Porto<chains>, '_internal'>) {
  return usePortoStore(porto, (x) => x.chain)
}

/**
 * Hook to access and subscribe to the current account.
 *
 * @param porto - Porto instance.
 * @returns Account.
 */
export function useAccount<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(porto: Pick<Remote.Porto<chains>, '_internal'>) {
  return usePortoStore(porto, (x) => x.accounts[0])
}

/**
 * Hook to access and subscribe to the current accounts.
 *
 * @param porto - Porto instance.
 * @returns Accounts.
 */
export function useAccounts<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(porto: Pick<Remote.Porto<chains>, '_internal'>) {
  return usePortoStore(porto, (x) => x.accounts)
}

/**
 * Hook to access and subscribe to the client of the Porto instance.
 *
 * @param porto - Porto instance.
 * @returns Client.
 */
export function useClient<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(
  porto: Pick<Remote.Porto<chains>, '_internal'>,
  parameters: useClient.Parameters = {},
) {
  const defaultChainId = useActiveChain(porto)?.id
  const chainId = parameters.chainId ?? defaultChainId
  return Porto_internal.getClient(porto, { chainId })
}

export namespace useClient {
  export type Parameters = {
    chainId?: number | undefined
  }
}

/**
 * Hook to access and subscribe to the store of the Porto instance.
 *
 * @param porto - Porto instance.
 * @param selector - Selector function.
 * @returns Store state.
 */
export function usePortoStore<
  slice = Porto.State,
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
>(
  porto: Pick<Remote.Porto<chains>, '_internal'>,
  selector: Parameters<
    typeof useStore<typeof porto._internal.store, slice>
  >[1] = (state) => state as slice,
) {
  const { store } = porto._internal
  return useStore(store, useShallow(selector))
}

/**
 * Hook to access and subscribe to the remote store of the Porto instance.
 *
 * @param porto - Porto instance.
 * @param selector - Selector function.
 * @returns Remote store state.
 */
export function useRemoteStore<
  slice = Remote.State,
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
>(
  porto: Pick<Remote.Porto<chains>, '_internal'>,
  selector: Parameters<
    typeof useStore<typeof porto._internal.remoteStore, slice>
  >[1] = (state) => state as slice,
) {
  const { remoteStore } = porto._internal
  return useStore(remoteStore, useShallow(selector))
}

/**
 * Hook to access and subscribe to current pending requests.
 *
 * @param porto - Porto instance.
 * @returns Requests.
 */
export function useRequests<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(porto: Pick<Remote.Porto<chains>, '_internal'>) {
  return useRemoteStore(porto, (state) =>
    state.requests.filter((x) => x.status === 'pending').map((x) => x.request),
  )
}

/**
 * Hook to access and subscribe to the next pending request.
 *
 * @param porto - Porto instance.
 * @returns Request.
 */
export function useRequest<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(porto: Pick<Remote.Porto<chains>, '_internal'>) {
  return useRemoteStore(
    porto,
    (state) =>
      state.requests.find((request) => request.status === 'pending')?.request,
  )
}

/**
 * Hook to access and subscribe to the provider client of the Porto instance.
 *
 * @param porto - Porto instance.
 * @returns Provider client.
 */
export function useProviderClient<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(porto: Pick<Remote.Porto<chains>, '_internal' | 'provider'>) {
  return useMemo(() => Porto_internal.getProviderClient(porto), [porto])
}

export namespace useProviderClient {
  export type Parameters = {
    chainId?: number | undefined
  }
}

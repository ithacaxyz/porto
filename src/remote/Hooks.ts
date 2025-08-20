import { Address } from 'ox'
import { useMemo } from 'react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'

import type * as Chains from '../core/Chains.js'
import type * as Porto from '../core/Porto.js'
import * as RelayClient from '../viem/RelayClient.js'
import * as WalletClient from '../viem/WalletClient.js'
import type * as Remote from './Porto.js'

/**
 * Hook to access and subscribe to the current account.
 * If an `address` is provided, it will return the account if exists.
 *
 * @param porto - Porto instance.
 * @param parameters - Parameters.
 * @returns Account.
 */
export function useAccount<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(
  porto: Pick<Remote.Porto<chains>, '_internal'>,
  parameters: useAccount.Parameters = {},
) {
  const { address } = parameters
  return usePortoStore(porto, (x) => {
    if (!address) return x.accounts[0]
    return x.accounts.find((x) => Address.isEqual(x.address, address))
  })
}

export namespace useAccount {
  export type Parameters = {
    address?: Address.Address | undefined
  }
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
 * Hook to access and subscribe to the current chain.
 * If a `chainId` is provided, it will return the chain if supported.
 *
 * @param porto - Porto instance.
 * @param parameters - Parameters.
 * @returns Chain.
 */
export function useChain<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(
  porto: Pick<Remote.Porto<chains>, '_internal'>,
  parameters: useChain.Parameters = {},
) {
  return usePortoStore(porto, (state) => {
    const chainId = parameters.chainId ?? state.chainIds[0]
    return porto._internal.config.chains.find((x) => x.id === chainId) as
      | chains[number]
      | undefined
  })
}

export namespace useChain {
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
 * Hook to access and subscribe to the Relay Client of the Porto instance.
 *
 * @param porto - Porto instance.
 * @returns Relay Client.
 */
export function useRelayClient<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(
  porto: Pick<Remote.Porto<chains>, '_internal'>,
  parameters: useRelayClient.Parameters = {},
) {
  const defaultChainId = useChain(porto)?.id
  const chainId = parameters.chainId ?? defaultChainId
  return RelayClient.fromPorto(porto, { chainId })
}

export namespace useRelayClient {
  export type Parameters = {
    chainId?: number | undefined
  }
}

/**
 * Hook to access and subscribe to the wallet client of the Porto instance.
 *
 * @param porto - Porto instance.
 * @returns Wallet Client.
 */
export function useWalletClient<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(porto: Pick<Remote.Porto<chains>, '_internal' | 'provider'>) {
  return useMemo(() => WalletClient.fromPorto(porto), [porto])
}

export namespace useWalletClient {
  export type Parameters = {
    chainId?: number | undefined
  }
}

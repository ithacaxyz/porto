import { PortoConfig, Query } from '@porto/apps'
import { useQueries } from '@tanstack/react-query'
import { Address } from 'ox'
import { anvil, odysseyDevnet } from 'porto/core/Chains'
import * as React from 'react'
import { useAccount, useBlockNumber, useChainId } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { urlWithCorsBypass } from '~/lib/Constants'
import { useReadBalances } from './useReadBalances'

export function addressApiEndpoint(chainId: PortoConfig.ChainId) {
  if (chainId === anvil.id || chainId === odysseyDevnet.id)
    return 'https://explorer.ithaca.xyz/api/v2'
  if (chainId === baseSepolia.id)
    return 'https://base-sepolia.blockscout.com/api/v2'
  throw new Error(`Unsupported chainId: ${chainId}`)
}

export function useAddressTransfers({
  address,
  chainIds,
}: {
  address?: Address.Address | undefined
  chainIds?: Array<PortoConfig.ChainId> | undefined
} = {}) {
  const account = useAccount()
  const chainId = useChainId()

  const userAddress = address ?? account.address
  const userChainIds = chainIds ?? [chainId]

  const { refetch: refetchBalances } = useReadBalances({
    address: userAddress,
    chainId: userChainIds[0]!,
  })

  const results = useQueries({
    combine: (result) => ({
      data: result.flatMap((query) => query.data),
      error: result.map((query) => query.error),
      isError: result.some((query) => query.isError),
      isPending: result.some((query) => query.isPending),
      isSuccess: result.every((query) => query.isSuccess),
    }),
    queries: userChainIds.map((chainId) => ({
      enabled: account.status === 'connected',
      queryFn: async () => {
        const apiEndpoint = addressApiEndpoint(chainId)
        const url = `${apiEndpoint}/addresses/${userAddress}/token-transfers`
        const response = await fetch(urlWithCorsBypass(url))
        if (!response.ok) {
          throw new Error(
            `Failed to fetch address transfers: ${response.statusText}`,
          )
        }
        const data = await response.json()
        return {
          chainId,
          items: data.items,
          next_page_params: data.next_page_params,
        } as {
          chainId: number
          items: Array<TokenTransfer>
          next_page_params: null
        }
      },
      queryKey: ['address-transfers', userAddress, chainId],
      refetchInterval: 2_500,
    })),
  })

  const refetch = React.useCallback(
    () =>
      Query.client
        .invalidateQueries({
          queryKey: ['address-transfers', userAddress],
        })
        .then(() => refetchBalances()),
    [userAddress, refetchBalances],
  )

  const { data: blockNumber } = useBlockNumber({
    watch: {
      enabled: account.status === 'connected',
      pollingInterval: 800,
    },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: refetch every block
  React.useEffect(() => {
    refetch()
  }, [blockNumber])

  const { data, error, isError, isSuccess, isPending } = results

  return {
    data,
    error,
    isError,
    isPending,
    isSuccess,
    refetch,
  }
}

export type TokenTransfer = {
  block_hash: string
  block_number: number
  from: {
    ens_domain_name: any
    hash: string
    implementations: Array<{
      address: string
      name: any
    }>
    is_contract: boolean
    is_scam: boolean
    is_verified: boolean
    metadata: any
    name: any
    private_tags: Array<any>
    proxy_type: string
    public_tags: Array<any>
    watchlist_names: Array<any>
  }
  log_index: number
  method: string
  timestamp: string
  to: {
    ens_domain_name: any
    hash: string
    implementations: Array<any>
    is_contract: boolean
    is_scam: boolean
    is_verified: boolean
    metadata: any
    name: any
    private_tags: Array<any>
    proxy_type: any
    public_tags: Array<any>
    watchlist_names: Array<any>
  }
  token: {
    address: string
    circulating_market_cap: any
    decimals: string
    exchange_rate: any
    holders: string
    icon_url: any
    name: string
    symbol: string
    total_supply: string
    type: string
    volume_24h: any
  }
  total: {
    decimals: string
    value: string
  }
  transaction_hash: string
  type: string
}

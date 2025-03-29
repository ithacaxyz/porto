import { Query } from '@porto/apps'
import { useQueries } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'ox'
import * as React from 'react'
import { useMemo } from 'react'
import { useAccount, useBalance, useBlockNumber } from 'wagmi'
import {
  base,
  baseSepolia,
  odysseyTestnet,
  optimismSepolia,
} from 'wagmi/chains'
import { urlWithCorsBypass } from '~/lib/Constants'
import { type ChainId, config } from '~/lib/Wagmi'
import { useReadBalances } from './useReadBalances'

export function addressApiEndpoint(chainId: ChainId) {
  if (chainId === base.id) return 'https://base.blockscout.com/api/v2'

  if (chainId === baseSepolia.id)
    return 'https://base-sepolia.blockscout.com/api/v2'

  if (chainId === odysseyTestnet.id) return 'https://explorer.ithaca.xyz/api/v2'

  if (chainId === optimismSepolia.id)
    return 'https://optimism-sepolia.blockscout.com/api/v2'

  throw new Error(`Unsupported chainId: ${chainId}`)
}

export function useTokenBalances({
  address,
  chainId,
}: {
  address?: Address.Address | undefined
  chainId?: ChainId | undefined
} = {}) {
  const account = useAccount()
  const userAddress = address ?? account.address

  const {
    data: tokenBalances,
    status,
    error,
    refetch,
    isError,
    isSuccess,
    isPending,
  } = useQuery({
    enabled: userAddress && Address.validate(userAddress),
    queryFn: async () => {
      const chains = config.chains.filter((c) => c.id === chainId)
      const responses = await Promise.all(
        chains.map(async (chain) => {
          const apiEndpoint = addressApiEndpoint(chain.id)
          const url = `${apiEndpoint}/addresses/${userAddress}/token-balances`
          const response = await fetch(urlWithCorsBypass(url))
          if (response.status === 404) {
            return { data: [], id: chain.id }
          }
          if (!response.ok) {
            throw new Error(
              `Failed to fetch token balances: ${response.statusText}`,
            )
          }
          return { data: await response.json(), id: chain.id }
        }),
      )
      const data = responses.map((response) => response.data)

      return data as Array<Array<TokenBalance>>
    },
    queryKey: ['token-balances', userAddress, chainId],
    refetchInterval: 2_500,
    select: (data) => data.flat(),
  })

  const { data: gasBalance, status: gasStatus } = useBalance({
    address: userAddress,
  })

  const balances = useMemo(() => {
    if (gasStatus !== 'success') return []
    const gas = {
      token: {
        decimals: gasBalance?.decimals,
        icon_url: '/icons/eth.svg',
        name: gasBalance?.symbol,
        symbol: gasBalance?.symbol,
        token_id: 'eth',
      },
      value: gasBalance?.value ?? 0n,
    } as unknown as TokenBalance
    if (!tokenBalances) return [gas]

    return [gas, ...tokenBalances]
  }, [tokenBalances, gasBalance, gasStatus])

  return {
    data: balances,
    error,
    isError,
    isPending,
    isSuccess,
    refetch,
    status,
  }
}

export type TokenBalance = {
  value: string
  token_id: string
  token: {
    type: string
    name: string
    symbol: string
    holders: number
    address: string
    decimals: string
    total_supply: string
    exchange_rate: string
    icon_url: string | null
    volume_24h: string | null
    circulating_market_cap: string | null
  }
}

export function useAddressTransfers({
  address,
  chainIds,
}: {
  address?: Address.Address | undefined
  chainIds?: Array<ChainId> | undefined
} = {}) {
  const account = useAccount()

  const userAddress = address ?? account.address
  const userChainIds = (chainIds ?? [account.chainId]) as Array<ChainId>

  const { refetch: refetchBalances } = useReadBalances({
    address: userAddress,
    chainId: userChainIds[0] as ChainId,
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
    chainId: chainIds?.length === 1 ? chainIds[0] : undefined,
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

export function useTransactionsHistory({
  address,
}: {
  address?: Address.Address
} = {}) {
  const account = useAccount()

  const userAddress = address ?? account.address

  const { data, error, isError, isPending, isSuccess } = useQueries({
    combine: (result) => ({
      data: result.flatMap((query) => query.data),
      error: result.map((query) => query.error),
      isError: result.some((query) => query.isError),
      isPending: result.some((query) => query.isPending),
      isSuccess: result.every((query) => query.isSuccess),
    }),
    queries: config.chains.map((chain) => ({
      enabled: !!userAddress && Address.validate(userAddress),
      queryFn: async () => {
        const apiEndpoint = addressApiEndpoint(chain.id)
        const url = `${apiEndpoint}/addresses/${userAddress}/transactions`
        const response = await fetch(urlWithCorsBypass(url))
        if (!response.ok) {
          throw new Error(
            `Failed to fetch transactions history: ${response.statusText}`,
          )
        }
        const data = await response.json()
        return {
          chainId: chain.id,
          items: data.items,
          next_page_params: data.next_page_params,
        } as {
          chainId: number
          items: Array<TokenTransfer>
          next_page_params: null
        }
      },
      queryKey: ['transactions-history', userAddress, chain.id],
    })),
  })

  return {
    data,
    error,
    isError,
    isPending,
    isSuccess,
  }
}

import { useQueries } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'ox'
import { useMemo } from 'react'
import { formatEther } from 'viem'
import { useAccount, useBalance } from 'wagmi'
import { baseSepolia, odysseyTestnet, optimismSepolia } from 'wagmi/chains'

import { urlWithLocalCorsBypass } from '~/lib/Constants'
import { config } from '~/lib/Wagmi'

export function addressApiEndpoint(chainId: number) {
  if (chainId === baseSepolia.id) {
    return 'https://base.blockscout.com/api/v2'
  }
  if (chainId === odysseyTestnet.id) {
    return 'https://explorer.ithaca.xyz/api/v2'
  }
  if (chainId === optimismSepolia.id) {
    return 'https://optimism-sepolia.blockscout.com/api/v2'
  }

  throw new Error(`Unsupported chainId: ${chainId}`)
}

export function useTokenBalances({
  address,
}: {
  address?: Address.Address
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
    queryKey: ['token-balances', userAddress],
    refetchInterval: 2_500,
    enabled: userAddress && Address.validate(userAddress),
    queryFn: async () => {
      try {
        // return data
        const responses = await Promise.all(
          config.chains.map(async (chain) => {
            const apiEndpoint = addressApiEndpoint(chain.id)
            const url = `${apiEndpoint}/addresses/${userAddress}/token-balances`
            const response = await fetch(urlWithLocalCorsBypass(url))
            if (response.status === 404) {
              return { id: chain.id, data: [] }
            }
            if (!response.ok) {
              throw new Error(
                `Failed to fetch token balances: ${response.statusText}`,
              )
            }
            return { id: chain.id, data: await response.json() }
          }),
        )
        const data = responses.map((response) => response.data)

        return data as Array<Array<TokenBalance>>
      } catch (error) {
        console.error('Error fetching token balances:', error)
        throw error
      }
    },
    select: (data) => data.flat(),
  })

  const { data: gasBalance, status: gasStatus } = useBalance({
    address: userAddress,
  })

  const balances = useMemo(() => {
    if (gasStatus !== 'success') return []
    const gas = {
      value: formatEther(gasBalance?.value ?? 0n),
      token: {
        token_id: 'eth',
        decimals: gasBalance?.decimals,
        name: gasBalance?.symbol,
        symbol: gasBalance?.symbol,
        icon_url: '/icons/eth.svg',
      },
    } as unknown as TokenBalance
    if (!tokenBalances) return [gas]

    return [gas, ...tokenBalances]
  }, [tokenBalances, gasBalance, gasStatus])

  return {
    data: balances,
    status,
    error,
    refetch,
    isError,
    isSuccess,
    isPending,
  }
}

export interface TokenBalance {
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
}: {
  address?: Address.Address
} = {}) {
  const account = useAccount()

  const userAddress = address ?? account.address

  const { data, error, isError, isPending, isSuccess } = useQueries({
    combine: (result) => ({
      error: result.map((query) => query.error),
      data: result.flatMap((query) => query.data),
      isError: result.some((query) => query.isError),
      isPending: result.some((query) => query.isPending),
      isSuccess: result.every((query) => query.isSuccess),
    }),
    queries: config.chains.map((chain) => ({
      enabled: !!userAddress && Address.validate(userAddress),
      queryKey: ['address-transfers', userAddress, chain.id],
      queryFn: async () => {
        const apiEndpoint = addressApiEndpoint(chain.id)
        const url = `${apiEndpoint}/addresses/${userAddress}/token-transfers`
        const response = await fetch(urlWithLocalCorsBypass(url))
        if (!response.ok) {
          throw new Error(
            `Failed to fetch address transfers: ${response.statusText}`,
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
    })),
  })

  return {
    data,
    error,
    isError,
    isSuccess,
    isPending,
  }
}

export interface TokenTransfer {
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
      error: result.map((query) => query.error),
      data: result.flatMap((query) => query.data),
      isError: result.some((query) => query.isError),
      isPending: result.some((query) => query.isPending),
      isSuccess: result.every((query) => query.isSuccess),
    }),
    queries: config.chains.map((chain) => ({
      enabled: !!userAddress && Address.validate(userAddress),
      queryKey: ['transactions-history', userAddress, chain.id],
      queryFn: async () => {
        const apiEndpoint = addressApiEndpoint(chain.id)
        const url = `${apiEndpoint}/addresses/${userAddress}/transactions`
        const response = await fetch(urlWithLocalCorsBypass(url))
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
    })),
  })

  return {
    data,
    error,
    isError,
    isSuccess,
    isPending,
  }
}

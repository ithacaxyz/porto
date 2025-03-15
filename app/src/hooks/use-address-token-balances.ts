import { useQuery } from '@tanstack/react-query'
import { Address } from 'ox'
import { useMemo } from 'react'
import { formatEther } from 'viem'
import { useAccount, useBalance } from 'wagmi'

import { addressApiEndpoint, urlWithLocalCorsBypass } from '~/lib/Constants'
import { config } from '~/lib/Wagmi'

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

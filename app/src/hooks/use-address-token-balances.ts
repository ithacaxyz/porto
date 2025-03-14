import { useQuery } from '@tanstack/react-query'
import { Address } from 'ox'
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

  const { data: balance, status: gasStatus } = useBalance({
    address: userAddress,
  })

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
    enabled:
      !!userAddress && Address.validate(userAddress) && gasStatus === 'success',
    queryFn: async () => {
      try {
        // return data
        const responses = await Promise.all(
          config.chains.map(async (chain) => {
            const apiEndpoint = addressApiEndpoint(chain.id)
            const url = `${apiEndpoint}/addresses/${userAddress}/token-balances`
            const response = await fetch(urlWithLocalCorsBypass(url))
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
    select: (data) => {
      return [
        ...(data.flat() ?? []),
        {
          value: balance?.value,
          token: {
            decimals: balance?.decimals,
            name: balance?.symbol,
            symbol: balance?.symbol,
            icon_url: '/icons/eth.svg',
          },
        } as unknown as TokenBalance,
      ].sort((a, b) => a.token.symbol.localeCompare(b.value))
    },
  })

  return {
    data: tokenBalances,
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

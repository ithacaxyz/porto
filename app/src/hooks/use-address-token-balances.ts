import { useQuery } from '@tanstack/react-query'
import { Address } from 'ox'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { baseSepolia, odysseyTestnet, optimismSepolia } from 'wagmi/chains'

import { addressApiEndpoint, urlWithLocalCorsBypass } from '~/lib/Constants'

export function useTokenBalances({
  chainId: providedChainId,
  address,
}: {
  chainId?: number
  address?: Address.Address
} = {}) {
  const account = useAccount()
  const connectedChainId = useChainId()

  const chainId = providedChainId ?? connectedChainId
  const userAddress = address ?? account.address

  const { data: balance } = useBalance({
    address: userAddress,
  })

  const { data, status, error, refetch, isError, isSuccess, isPending } =
    useQuery({
      queryKey: ['token-balances', userAddress],
      enabled: !!userAddress && Address.validate(userAddress),
      queryFn: async () => {
        try {
          // if no chainId then fetch from all 3 chains
          if (!chainId) {
            const responses = await Promise.all(
              [baseSepolia, odysseyTestnet, optimismSepolia].map(
                async (chain) => {
                  const apiEndpoint = addressApiEndpoint(chain.id)
                  const url = `${apiEndpoint}/addresses/${userAddress}/token-balances`
                  const response = await fetch(url)
                  if (!response.ok) {
                    throw new Error(
                      `Failed to fetch token balances: ${response.statusText}`,
                    )
                  }
                  return { id: chain.id, data: await response.json() }
                },
              ),
            )
            const data = await Promise.all(
              responses.map((response) => response.data),
            )
            return data as Array<TokenBalance>
          }

          const apiEndpoint = addressApiEndpoint(chainId)
          const url = `${apiEndpoint}/addresses/${userAddress}/token-balances`
          const response = await fetch(urlWithLocalCorsBypass(url))
          if (!response.ok) {
            throw new Error(
              `Failed to fetch token balances: ${response.statusText}`,
            )
          }
          const data = await response.json()
          return data as Array<TokenBalance>
        } catch (error) {
          console.error('Error fetching token balances:', error)
          throw error
        }
      },
      select: (data) =>
        [
          ...(data ?? []),
          {
            value: balance?.value,
            token: {
              decimals: balance?.decimals,
              name: balance?.symbol,
              symbol: balance?.symbol,
              icon_url: '/icons/eth.svg',
            },
          } as unknown as TokenBalance,
        ].sort((a, b) => a.token.symbol.localeCompare(b.value)),
    })

  return {
    data,
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

import { useQuery } from '@tanstack/react-query'
import { Address } from 'ox'
import { useAccount, useChainId } from 'wagmi'
import { baseSepolia, odysseyTestnet, optimismSepolia } from 'wagmi/chains'

import { addressApiEndpoint, urlWithLocalCorsBypass } from '~/lib/Constants'

export function useTokenBalance({
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

  const { data, status, error, refetch } = useQuery({
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
                const response = await fetch(urlWithLocalCorsBypass(url))
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
  })

  return { data, status, error, refetch }
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
    /**      "address": "0x706Aa5C8e5cC2c67Da21ee220718f6f6B154E75c",
      "circulating_market_cap": null,
      "decimals": "18",
      "exchange_rate": null,
      "holders": "21555",
      "icon_url": null,
      "name": "Exp",
      "symbol": "EXP",
      "total_supply": "50306251079074980000002000",
      "type": "ERC-20",
      "volume_24h": null */

    icon_url: string | null
    volume_24h: string | null
    circulating_market_cap: string | null
  }
  // token_instance: {
  //   id: string
  //   is_unique: boolean
  //   image_url?: string
  //   animation_url?: string
  //   external_app_url?: string
  //   holder_address_hash?: string
  //   metadata?: {
  //     [k: string]: unknown
  //   }
  //   owner: {
  //     hash: string
  //     name: string
  //     ens_domain_name?: string
  //     implementation_name: string
  //     metadata?: {
  //       [k: string]: unknown
  //     }
  //     is_contract: boolean
  //     private_tags: {
  //       address_hash: string
  //       display_name: string
  //       label: string
  //       [k: string]: unknown
  //     }[]
  //     watchlist_names: {
  //       display_name: string
  //       label: string
  //       [k: string]: unknown
  //     }[]
  //     public_tags: {
  //       address_hash: string
  //       display_name: string
  //       label: string
  //       [k: string]: unknown
  //     }[]
  //     is_verified: boolean
  //     [k: string]: unknown
  //   }
  //   token: {
  //     name: string
  //     type: string
  //     symbol: string
  //     address: string
  //     holders: string
  //     icon_url: string
  //     decimals: string
  //     total_supply: string
  //     exchange_rate: string
  //     circulating_market_cap: string
  //   }
  // }
}

import { useQuery } from '@tanstack/react-query'
import { Address } from 'ox'
import { useAccount, useChainId } from 'wagmi'
import { addressApiEndpoint, urlWithLocalCorsBypass } from '~/lib/Constants'

export function useTokensBalancesWithFilter({
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
    queryKey: ['tokens-balances-with-filter', chainId, userAddress],
    enabled: !!userAddress && !!chainId && Address.validate(userAddress),
    queryFn: async () => {
      try {
        const apiEndpoint = addressApiEndpoint(chainId)
        const url = `${apiEndpoint}/addresses/${userAddress}/tokens`
        const response = await fetch(urlWithLocalCorsBypass(url))
        if (!response.ok) {
          throw new Error(`Failed to fetch tokens: ${response.statusText}`)
        }
        const data = (await response.json()) as Array<TokenBalance>
        return data
      } catch (error) {
        console.error('Error fetching tokens:', error)
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
  }
  token_instance: {
    id: string
    is_unique: boolean
    image_url?: string
    animation_url?: string
    external_app_url?: string
    holder_address_hash?: string
    metadata?: {
      [k: string]: unknown
    }
    owner: {
      hash: string
      name: string
      ens_domain_name?: string
      implementation_name: string
      metadata?: {
        [k: string]: unknown
      }
      is_contract: boolean
      private_tags: {
        address_hash: string
        display_name: string
        label: string
        [k: string]: unknown
      }[]
      watchlist_names: {
        display_name: string
        label: string
        [k: string]: unknown
      }[]
      public_tags: {
        address_hash: string
        display_name: string
        label: string
        [k: string]: unknown
      }[]
      is_verified: boolean
      [k: string]: unknown
    }
    token: {
      name: string
      type: string
      symbol: string
      address: string
      holders: string
      icon_url: string
      decimals: string
      total_supply: string
      exchange_rate: string
      circulating_market_cap: string
    }
  }
}

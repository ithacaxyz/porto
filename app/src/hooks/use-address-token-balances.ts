import { useQuery } from '@tanstack/react-query'
import { Address } from 'ox'
import { useAccount } from 'wagmi'

export function useTokenBalance({
  address,
}: {
  address?: Address.Address
} = {}) {
  const account = useAccount()

  const userAddress = address ?? account.address

  const { data, status, error, refetch } = useQuery({
    queryKey: ['balances', userAddress],
    enabled: !!userAddress && Address.validate(userAddress),
    queryFn: async () => {
      const url = `https://explorer.ithaca.xyz/api/v2/addresses/${address}/token-balances`
      const response = await fetch(`https://cors.evm.workers.dev?url=${url}`)
      const data = await response.json()
      return data
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

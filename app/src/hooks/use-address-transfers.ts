import { useQueries } from '@tanstack/react-query'
import { Address } from 'ox'
import { useAccount } from 'wagmi'

import { addressApiEndpoint, urlWithLocalCorsBypass } from '~/lib/Constants'
import { config } from '~/lib/Wagmi'

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

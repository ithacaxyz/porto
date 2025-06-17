import { type PortoConfig, Query } from '@porto/apps'
import { useQuery } from '@tanstack/react-query'
import type { Address } from 'ox'
import { anvil, portoDev } from 'porto/core/Chains'
import * as React from 'react'
import { useAccount, useChainId, useWatchBlockNumber } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { urlWithCorsBypass } from '~/lib/Constants'
import { useReadBalances } from './useReadBalances'

export function addressApiEndpoint(chainId: PortoConfig.ChainId) {
  if (chainId === anvil.id || chainId === portoDev.id)
    return 'https://explorer.ithaca.xyz/api/v2'
  if (chainId === baseSepolia.id)
    return 'https://base-sepolia.blockscout.com/api/v2'
  if (chainId === base.id) return 'https://base.blockscout.com/api/v2'
  throw new Error(`Unsupported chainId: ${chainId}`)
}

export function useAddressTransfers({
  address,
  chainId,
}: {
  address?: Address.Address | undefined
  chainId?: PortoConfig.ChainId | undefined
} = {}) {
  const account = useAccount()
  const defaultChainId = chainId ?? useChainId()

  const userAddress = address ?? account.address
  const userChainId = chainId ?? defaultChainId

  const { refetch: refetchBalances } = useReadBalances({
    address: userAddress,
    chainId: userChainId,
  })

  const result = useQuery({
    enabled: account.status === 'connected',
    queryFn: async () => {
      const apiEndpoint = addressApiEndpoint(userChainId)
      const url = `${apiEndpoint}/addresses/${userAddress}/token-transfers`
      const response = await fetch(urlWithCorsBypass(url))

      const data = (await response.json()) as {
        items: Array<TokenTransfer>
        next_page_params: null
      }
      return {
        items: data.items,
        next_page_params: data.next_page_params,
      }
    },
    queryKey: ['address-transfers', userAddress, userChainId],
    refetchInterval: 2_500,
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

  useWatchBlockNumber({
    enabled: account.status === 'connected',
    onBlockNumber: (_blockNumber) => refetch(),
  })

  return {
    ...result,
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

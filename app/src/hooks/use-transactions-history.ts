import { useQuery } from '@tanstack/react-query'
import { Address } from 'ox'
import { useAccount, useChainId } from 'wagmi'
import { baseSepolia, odysseyTestnet, optimismSepolia } from 'wagmi/chains'

import { addressApiEndpoint, urlWithLocalCorsBypass } from '~/lib/Constants'

export function useTransactionsHistory({
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

  const { data, status, error, refetch, isError, isSuccess, isPending } =
    useQuery({
      queryKey: ['transactions-history', userAddress],
      enabled: !!userAddress && Address.validate(userAddress),
      queryFn: async () => {
        try {
          // if no chainId then fetch from all 3 chains
          if (!chainId) {
            const responses = await Promise.all(
              [baseSepolia, odysseyTestnet, optimismSepolia].map(
                async (chain) => {
                  const apiEndpoint = addressApiEndpoint(chain.id)
                  const url = `${apiEndpoint}/addresses/${userAddress}/transactions`
                  const response = await fetch(urlWithLocalCorsBypass(url))
                  if (!response.ok) {
                    throw new Error(
                      `Failed to fetch transactions history: ${response.statusText}`,
                    )
                  }
                  return { id: chain.id, data: await response.json() }
                },
              ),
            )
            const data = await Promise.all(
              responses.map((response) => response.data),
            )
            return data as Array<TokenTransfer>
          }

          const apiEndpoint = addressApiEndpoint(chainId)
          const url = `${apiEndpoint}/addresses/${userAddress}/transactions`
          const response = await fetch(urlWithLocalCorsBypass(url))
          if (!response.ok) {
            throw new Error(
              `Failed to fetch transactions history: ${response.statusText}`,
            )
          }
          const data = await response.json()
          return data as Array<TokenTransfer>
        } catch (error) {
          console.error('Error fetching transactions history:', error)
          throw error
        }
      },
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

export interface TokenTransfer {
  timestamp: string
  fee: {
    type: string
    value: string
  }
  gas_limit: number
  block_number: number
  status: string
  method: string
  confirmations: number
  type: number
  exchange_rate: string
  to: {
    hash: string
    implementation_name: string
    name: string
    ens_domain_name: string
    metadata: {
      slug: string
      name: string
      tagType: string
      ordinal: number
      meta: {}
    }
    is_contract: boolean
    private_tags: Array<{
      address_hash: string
      display_name: string
      label: string
    }>
    watchlist_names: Array<{
      display_name: string
      label: string
    }>
    public_tags: Array<{
      address_hash: string
      display_name: string
      label: string
    }>
    is_verified: boolean
  }
  transaction_burnt_fee: string
  max_fee_per_gas: string
  result: string
  hash: string
  gas_price: string
  priority_fee: string
  base_fee_per_gas: string
  from: {
    hash: string
    implementation_name: string
    name: string
    ens_domain_name: string
    metadata: {
      slug: string
      name: string
      tagType: string
      ordinal: number
      meta: {}
    }
    is_contract: boolean
    private_tags: Array<{
      address_hash: string
      display_name: string
      label: string
    }>
    watchlist_names: Array<{
      display_name: string
      label: string
    }>
    public_tags: Array<{
      address_hash: string
      display_name: string
      label: string
    }>
    is_verified: boolean
  }
  token_transfers: Array<{
    block_hash: string
    from: {
      hash: string
      implementation_name: string
      name: string
      ens_domain_name: string
      metadata: {
        slug: string
        name: string
        tagType: string
        ordinal: number
        meta: {}
      }
      is_contract: boolean
      private_tags: Array<{
        address_hash: string
        display_name: string
        label: string
      }>
      watchlist_names: Array<{
        display_name: string
        label: string
      }>
      public_tags: Array<{
        address_hash: string
        display_name: string
        label: string
      }>
      is_verified: boolean
    }
    log_index: number
    method: string
    timestamp: string
    to: {
      hash: string
      implementation_name: string
      name: string
      ens_domain_name: string
      metadata: {
        slug: string
        name: string
        tagType: string
        ordinal: number
        meta: {}
      }
      is_contract: boolean
      private_tags: Array<{
        address_hash: string
        display_name: string
        label: string
      }>
      watchlist_names: Array<{
        display_name: string
        label: string
      }>
      public_tags: Array<{
        address_hash: string
        display_name: string
        label: string
      }>
      is_verified: boolean
    }
    token: {
      circulating_market_cap: string
      icon_url: string
      name: string
      decimals: string
      symbol: string
      address: string
      type: string
      holders: string
      exchange_rate: string
      total_supply: string
    }
    total: {
      decimals: string
      value: string
    }
    transaction_hash: string
    type: string
  }>
  transaction_types: Array<string>
  gas_used: string
  created_contract: {
    hash: string
    implementation_name: string
    name: string
    ens_domain_name: string
    metadata: {
      slug: string
      name: string
      tagType: string
      ordinal: number
      meta: {}
    }
    is_contract: boolean
    private_tags: Array<{
      address_hash: string
      display_name: string
      label: string
    }>
    watchlist_names: Array<{
      display_name: string
      label: string
    }>
    public_tags: Array<{
      address_hash: string
      display_name: string
      label: string
    }>
    is_verified: boolean
  }
  position: number
  nonce: number
  has_error_in_internal_transactions: boolean
  actions: Array<{
    data: {
      debt_amount?: string
      debt_symbol?: string
      debt_address?: string
      collateral_amount?: string
      collateral_symbol?: string
      collateral_address?: string
      block_number?: number
      amount?: string
      symbol?: string
      address?: string
      name?: string
      to?: string
      ids?: Array<string>
      address0?: string
      address1?: string
      amount0?: string
      amount1?: string
      symbol0?: string
      symbol1?: string
    }
    protocol: string
    type: string
  }>
  decoded_input: {
    method_call: string
    method_id: string
    parameters: Array<{
      name: string
      type: string
      value: string
    }>
  }
  token_transfers_overflow: boolean
  raw_input: string
  value: string
  max_priority_fee_per_gas: string
  revert_reason: string
  confirmation_duration: Array<number>
  transaction_tag: string
}

import { useQuery } from '@tanstack/react-query'
import { Address, Hex } from 'ox'
import { Relay } from 'porto/internal'
import { Hooks } from 'porto/remote'
import { porto } from './Porto.js'

export type FeeToken = {
  address: Address.Address
  decimals: number
  symbol: string
}

export function useFetch(parameters: useFetch.Parameters) {
  const { address, symbol } = parameters

  const activeFeeToken = Hooks.usePortoStore(porto, (state) => state.feeToken)
  const client = Hooks.useClient(porto)
  const chain = Hooks.useChain(porto, parameters)

  return useQuery<FeeToken>({
    async queryFn() {
      if (!chain) throw new Error('chain is required')

      const feeTokens = await Relay.getFeeTokens(client).then(
        (feeTokens) => feeTokens[Hex.fromNumber(chain.id)],
      )
      if (!feeTokens)
        throw new Error(
          `fee tokens not found for chain ${chain.id} - ${chain.name}`,
        )

      const feeToken = feeTokens?.find((feeToken) => {
        if (address) return Address.isEqual(feeToken.address, address)
        if (symbol) return symbol === feeToken.coin
        if (activeFeeToken) return activeFeeToken === feeToken.coin
        return feeToken.coin === 'ETH'
      })

      if (!feeToken)
        throw new Error(
          `fee token ${address ?? symbol} not found. Available: ${feeTokens?.map((x) => `${x.coin} (${x.address})`).join(', ')}`,
        )
      return {
        address: feeToken.address,
        decimals: feeToken.decimals,
        symbol: feeToken.coin,
      }
    },
    queryKey: [
      'FeeToken.current',
      activeFeeToken,
      address,
      chain?.id,
      client.uid,
      symbol,
    ],
  })
}

export declare namespace useFetch {
  export type Parameters = {
    address?: Address.Address | undefined
    chainId?: number | undefined
    symbol?: string | undefined
  }
}

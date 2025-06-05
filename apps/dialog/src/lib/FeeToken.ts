import { useQuery } from '@tanstack/react-query'
import { Address } from 'ox'
import { ServerActions } from 'porto'
import * as FeeToken_typebox from 'porto/core/internal/typebox/feeToken.js'
import { Hooks } from 'porto/remote'
import { porto } from './Porto.js'

export type FeeToken = {
  address: Address.Address
  decimals: number
  kind: string
  nativeRate?: bigint | undefined
  symbol: string
}

export function useFetch(parameters: useFetch.Parameters) {
  const { addressOrSymbol } = parameters

  const activeFeeToken = Hooks.usePortoStore(porto, (state) => state.feeToken)
  const client = Hooks.useServerClient(porto)

  return useQuery<FeeToken>({
    async queryFn() {
      const feeTokens = await ServerActions.getCapabilities(client).then(
        (capabilities) => capabilities.fees.tokens,
      )

      let feeToken = feeTokens?.find((feeToken) => {
        if (addressOrSymbol) {
          if (Address.validate(addressOrSymbol))
            return Address.isEqual(feeToken.address, addressOrSymbol)
          return addressOrSymbol === feeToken.symbol
        }
        if (activeFeeToken) return activeFeeToken === feeToken.symbol
        return feeToken.symbol === 'ETH'
      })

      if (!feeToken) {
        feeToken = feeTokens?.[0]!
        console.warn(
          `Fee token ${addressOrSymbol} not found. Falling back to ${feeToken.symbol} (${feeToken.address}).`,
        )
      }

      return feeToken ?? null
    },
    queryKey: ['FeeToken.current', activeFeeToken, addressOrSymbol, client.uid],
  })
}

export declare namespace useFetch {
  export type Parameters = {
    addressOrSymbol?: FeeToken_typebox.Symbol | Address.Address | undefined
  }
}

import type { UseQueryResult } from '@tanstack/react-query'
import type { Address } from 'ox'
import type * as Quote_schema from 'porto/core/internal/relay/schema/quotes'
import type { RelayActions } from 'porto/viem'
import * as React from 'react'
import { AddFunds } from '~/routes/-components/AddFunds'

export function CheckBalance(props: CheckBalance.Props) {
  const { address, children, onReject, query } = props

  const quotes = query.data?.capabilities.quote.quotes ?? []

  // Check to see if the user has insufficient funds.
  const deficit = React.useMemo(() => {
    if (query.isPending)
      return {
        hasDeficit: false,
        isPending: true,
      }

    // find first quote with asset deficits
    const deficitQuote = quotes.find(
      (quote) => (quote.assetDeficits ?? []).length > 0,
    )

    if (deficitQuote)
      return {
        assetDeficits: deficitQuote.assetDeficits,
        chainId: deficitQuote.chainId,
        hasDeficit: true,
        isPending: false,
      }

    // Check if error indicates insufficient funds.
    if (query.error) {
      const errorMessage = (query.error?.cause as Error)?.message ?? ''
      const pattern =
        /required (\d+) of asset (0x[a-fA-F0-9]{40}) on chain (\d+)/
      const match = errorMessage.match(pattern) as [
        string,
        string,
        Address.Address,
        string,
      ]

      if (match) {
        const [, value, address, chainId] = match
        return {
          assetDeficits: [
            {
              address,
              deficit: BigInt(value!),
              required: BigInt(value!),
            },
          ],
          chainId: Number(chainId!),
          hasDeficit: true,
          isPending: false,
        }
      }

      // Check for generic InsufficientBalance error.
      if (/InsufficientBalance/i.test(errorMessage)) {
        return {
          hasDeficit: true,
          isPending: false,
        }
      }
    }

    return {
      hasDeficit: false,
      isPending: false,
    }
  }, [query.isPending, quotes, query.error])

  const [showAddFunds, setShowAddFunds] = React.useState(false)

  if (showAddFunds && deficit.hasDeficit)
    return (
      <AddFunds
        address={address}
        assetDeficits={deficit.assetDeficits}
        chainId={deficit.chainId}
        onApprove={() => {
          setShowAddFunds(false)
          query.refetch()
        }}
        onReject={() => {
          setShowAddFunds(false)
          onReject()
        }}
      />
    )

  return children({
    ...deficit,
    onAddFunds: () => {
      if (deficit.hasDeficit) setShowAddFunds(true)
    },
  })
}

export namespace CheckBalance {
  // Add 20% to the deficit to account for fee fluctuations.
  export function addFeeBuffer(value: bigint): bigint {
    return (value * 120n) / 100n
  }

  export type Deficit = {
    hasDeficit: boolean
    isPending: boolean
    chainId?: number
    assetDeficits?: Array<Quote_schema.AssetDeficit>
    onAddFunds: () => void
  }

  export type Props = {
    address?: Address.Address | undefined
    children: (deficit: Deficit) => React.ReactNode
    onReject: () => void
    query: UseQueryResult<
      RelayActions.prepareCalls.ReturnType,
      RelayActions.prepareCalls.ErrorType
    >
  }
}

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

    const deficitQuote = quotes.find(
      (quote) => quote.assetDeficits && quote.assetDeficits.length > 0,
    )

    if (!deficitQuote)
      return {
        hasDeficit: false,
        isPending: false,
      }

    return {
      assetDeficits: deficitQuote.assetDeficits,
      chainId: deficitQuote.chainId,
      hasDeficit: true,
      isPending: false,
    }
  }, [query.isPending, quotes])

  const [showAddFunds, setShowAddFunds] = React.useState(false)

  if (showAddFunds && deficit.hasDeficit)
    return (
      <AddFunds
        address={address}
        assetDeficits={deficit.assetDeficits}
        chainId={deficit.chainId}
        onApprove={() => {
          query.refetch()
          setShowAddFunds(false)
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

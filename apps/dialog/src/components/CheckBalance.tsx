import { Spinner } from '@porto/apps/components'
import type { UseQueryResult } from '@tanstack/react-query'
import { Address, Value } from 'ox'
import type * as FeeToken_schema from 'porto/core/internal/schema/feeToken.js'
import type { ServerActions } from 'porto/viem'
import * as React from 'react'
import * as FeeTokens from '~/lib/FeeTokens'
import { AddFunds } from '~/routes/-components/AddFunds'

export function CheckBalance(props: CheckBalance.Props) {
  const { address, children, onReject, query } = props

  const [step, setStep] = React.useState<'default' | 'success'>('default')

  const feeTokens = FeeTokens.fetch.useQuery({
    addressOrSymbol: props.feeToken,
  })

  const quotes = query.data?.capabilities.quote.quotes ?? []

  // Check to see if the user has insufficient funds.
  const deficitToken = React.useMemo(() => {
    // Find a quote that has a fee deficit.
    const deficitQuote = quotes.find((quote, index) => {
      const isMultichainDestination =
        index === quotes.length - 1 && quotes.length > 1
      if (isMultichainDestination) return false
      return quote.feeTokenDeficit > 0n
    })
    if (deficitQuote) {
      const { chainId, feeTokenDeficit, intent } = deficitQuote
      return {
        address: intent.paymentToken,
        chainId,
        value: feeTokenDeficit,
      }
    }

    // If an error is thrown requiring funds; extract the deficit, token, and chain id.
    const pattern = /required (\d+) of asset (0x[a-fA-F0-9]{40}) on chain (\d+)/
    const insufficientFundsMatch = (query.error?.cause as Error)?.message.match(
      pattern,
    )
    if (!insufficientFundsMatch) return undefined

    const [, value, address, chainId] = insufficientFundsMatch
    return {
      address: address as Address.Address,
      chainId: Number(chainId!),
      value: BigInt(value!),
    }
  }, [quotes, query.error?.cause])

  const value = React.useMemo(() => {
    if (!deficitToken) return undefined
    if (deficitToken.value === 0n) return undefined
    const feeToken = feeTokens.data?.find((token) =>
      Address.isEqual(token.address, deficitToken.address),
    )
    if (!feeToken) return undefined
    return Value.format(deficitToken.value, feeToken.decimals)
  }, [deficitToken, feeTokens.data])

  if (step === 'success') return children
  if (query.isPending)
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="size-[24px]">
          <Spinner className="text-th_base-secondary" />
        </div>
      </div>
    )
  if (!deficitToken) return children
  return (
    <AddFunds
      address={address}
      chainId={deficitToken.chainId}
      onApprove={() => {
        query.refetch()
        setStep('success')
      }}
      onReject={onReject}
      tokenAddress={deficitToken.address}
      value={value}
    />
  )
}

export namespace CheckBalance {
  export type Props = {
    address?: Address.Address | undefined
    chainId?: number | undefined
    children: React.ReactNode
    feeToken?: FeeToken_schema.Symbol | Address.Address | undefined
    onReject: () => void
    query: UseQueryResult<
      ServerActions.prepareCalls.ReturnType,
      ServerActions.prepareCalls.ErrorType
    >
  }
}

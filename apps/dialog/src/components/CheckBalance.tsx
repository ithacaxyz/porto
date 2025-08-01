import { Spinner } from '@porto/apps/components'
import type { UseQueryResult } from '@tanstack/react-query'
import type { Address } from 'ox'
import type * as FeeToken_schema from 'porto/core/internal/schema/feeToken.js'
import * as React from 'react'
import * as FeeTokens from '~/lib/FeeTokens'
import { AddFunds } from '~/routes/-components/AddFunds'

export function CheckBalance(props: CheckBalance.Props) {
  const { address, children, onReject, query } = props

  const [step, setStep] = React.useState<'default' | 'success'>('default')

  const feeTokens = FeeTokens.fetch.useQuery({
    addressOrSymbol: props.feeToken,
  })
  const feeToken = feeTokens.data?.[0]

  const hasInsufficientBalance = query.error?.message?.includes('PaymentError')

  if (step === 'success') return children
  if (query.isPending)
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="size-[24px]">
          <Spinner className="text-th_base-secondary" />
        </div>
      </div>
    )
  if (!hasInsufficientBalance) return children
  return (
    <AddFunds
      address={address}
      onApprove={() => {
        query.refetch()
        setStep('success')
      }}
      onReject={onReject}
      tokenAddress={feeToken?.address}
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
    query: UseQueryResult
  }
}

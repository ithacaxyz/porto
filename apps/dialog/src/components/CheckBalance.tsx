import { Button, Spinner } from '@porto/apps/components'
import { UseQueryResult } from '@tanstack/react-query'
import { Address } from 'ox'
import * as FeeToken_typebox from 'porto/core/internal/typebox/feeToken.js'
import * as React from 'react'
import * as FeeToken from '~/lib/FeeToken'
import { AddFunds } from '~/routes/-components/AddFunds'
import { Layout } from '~/routes/-components/Layout'
import TriangleAlert from '~icons/lucide/triangle-alert'

export function CheckBalance(props: CheckBalance.Props) {
  const { address, children, onReject, query } = props

  const [step, setStep] = React.useState<'add-funds' | 'default' | 'success'>(
    'default',
  )

  const feeToken = FeeToken.useFetch({
    addressOrSymbol: props.feeToken,
  })

  const hasInsufficientBalance = query.error?.message?.includes('PaymentError')

  if (step === 'success') return children
  if (step === 'add-funds')
    return (
      <AddFunds
        address={address}
        onApprove={() => setStep('success')}
        onReject={onReject}
        onSuccess={() => query.refetch()}
        tokenAddress={feeToken.data?.address!}
      />
    )
  if (query.isPending)
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="size-[24px]">
          <Spinner className="text-secondary" />
        </div>
      </div>
    )
  if (!hasInsufficientBalance) return children
  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          content={
            <>You will need more {feeToken?.data?.symbol} to continue.</>
          }
          icon={TriangleAlert}
          title="Insufficient balance"
          variant="warning"
        />
      </Layout.Header>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            className="flex-grow"
            onClick={onReject}
            type="button"
            variant="default"
          >
            Cancel
          </Button>

          <Button
            className="flex-grow"
            onClick={() => setStep('add-funds')}
            type="button"
            variant="accent"
          >
            Add Funds
          </Button>
        </Layout.Footer.Actions>

        {address && <Layout.Footer.Account address={address} />}
      </Layout.Footer>
    </Layout>
  )
}

export namespace CheckBalance {
  export type Props = {
    address?: Address.Address | undefined
    chainId?: number | undefined
    children: React.ReactNode
    feeToken?: FeeToken_typebox.Symbol | Address.Address | undefined
    onReject: () => void
    query: UseQueryResult
  }
}

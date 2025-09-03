import type { UseQueryResult } from '@tanstack/react-query'
import { Address, Value } from 'ox'
import type * as Token from 'porto/core/internal/schema/token.js'
import type { RelayActions } from 'porto/viem'
import * as React from 'react'
import { zeroAddress } from 'viem'
import * as Tokens from '~/lib/Tokens'
import { AddFunds } from '~/routes/-components/AddFunds'
import { Layout } from '~/routes/-components/Layout'

export function CheckBalance(props: CheckBalance.Props) {
  const { address, children, feeToken, onReject, query } = props

  const [step, setStep] = React.useState<'default' | 'success'>('default')

  const { data: token } = Tokens.getToken.useQuery({
    addressOrSymbol: feeToken,
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
      // If we are being sponsored, we will have no deficit.
      if (
        !Address.isEqual(deficitQuote.intent.payer, zeroAddress) &&
        !Address.isEqual(deficitQuote.intent.payer, deficitQuote.intent.eoa)
      )
        return

      const { chainId, feeTokenDeficit, intent } = deficitQuote
      return {
        address: intent.paymentToken,
        chainId,
        value: feeTokenDeficit,
      }
    }

    // TODO: Test this error in provider.test.ts
    // If an error is thrown requiring funds; extract the deficit, token, and chain id.
    const pattern = /required (\d+) of asset (0x[a-fA-F0-9]{40}) on chain (\d+)/
    const errorMessage = (query.error?.cause as Error)?.message ?? ''
    const insufficientFundsMatch = errorMessage.match(pattern)
    if (!insufficientFundsMatch) {
      // TODO: Remove once other pattern is back
      const pattern = /InsufficientBalance/
      if (token && pattern.test(errorMessage))
        return {
          address: token.address,
        } as const
      return undefined
    }

    const [, value, address, chainId] = insufficientFundsMatch
    return {
      address: address as Address.Address,
      chainId: Number(chainId!),
      value: BigInt(value!),
    }
  }, [quotes, query.error?.cause, token])

  const value = React.useMemo(() => {
    if (!deficitToken) return undefined
    if (!deficitToken.address) return undefined
    if (!deficitToken.value) return undefined
    if (deficitToken.value === 0n) return undefined
    if (!token) return undefined
    // Add 20% to the deficit to account for fee fluctuations.
    const value = deficitToken.value * (120n / 100n)
    return Value.format(value, token.decimals)
  }, [deficitToken, token])

  if (step === 'success') return children
  if (query.isPending) return <Layout loading />
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
    feeToken?: Token.Symbol | Address.Address | undefined
    onReject: () => void
    query: UseQueryResult<
      RelayActions.prepareCalls.ReturnType,
      RelayActions.prepareCalls.ErrorType
    >
  }
}

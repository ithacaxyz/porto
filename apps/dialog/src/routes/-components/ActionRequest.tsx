import { FeeToken, PortoConfig } from '@porto/apps'
import { Button, Spinner } from '@porto/apps/components'
import { useQuery } from '@tanstack/react-query'
import { cx } from 'cva'
import { Address, Json, RpcSchema } from 'ox'
import { Chains, Delegation, RpcSchema as RpcSchema_porto } from 'porto'
import * as Quote_relay from 'porto/core/internal/relay/typebox/quote'
import * as Rpc from 'porto/core/internal/typebox/request'
import * as Schema from 'porto/core/internal/typebox/schema'
import { Porto as Porto_ } from 'porto/remote'
import { Hooks } from 'porto/remote'
import * as React from 'react'
import { Call } from 'viem'

import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import * as Price from '~/lib/Price'
import { Layout } from '~/routes/-components/Layout'
import { ValueFormatter } from '~/utils'
import ArrowDownLeft from '~icons/lucide/arrow-down-left'
import ArrowUpRight from '~icons/lucide/arrow-up-right'
import TriangleAlert from '~icons/lucide/triangle-alert'
import Star from '~icons/ph/star-four-bold'
import { AddFunds } from './AddFunds'

export function ActionRequest(props: ActionRequest.Props) {
  const { address, onReject } = props

  const [step, setStep] = React.useState<
    | {
        props: {
          tokenAddress: Address.Address
        }
        type: 'add-funds'
      }
    | {
        props?:
          | {
              checkBalance?: boolean | undefined
            }
          | undefined
        type: 'default'
      }
  >({
    type: 'default',
  })

  if (step.type === 'add-funds')
    return (
      <AddFunds
        {...step.props}
        address={address}
        onApprove={() =>
          setStep({ props: { checkBalance: false }, type: 'default' })
        }
        onReject={onReject}
      />
    )
  return (
    <ActionRequest.Inner
      {...props}
      {...step.props}
      onAddFunds={({ token }) => {
        setStep({
          props: { tokenAddress: token },
          type: 'add-funds',
        })
      }}
    />
  )
}

export namespace ActionRequest {
  export type Props = Omit<Inner.Props, 'onAddFunds'>

  export function Inner(props: Inner.Props) {
    const {
      address,
      calls,
      chainId,
      checkBalance = true,
      loading,
      onAddFunds,
      onApprove,
      onReject,
      request,
    } = props

    const account = Hooks.useAccount(porto, { address })
    const chain = Hooks.useChain(porto, { chainId })
    const client = Hooks.useClient(porto)
    const origin = Dialog.useStore((state) => state.referrer?.origin)
    const providerClient = Hooks.useProviderClient(porto)

    const feeToken = React.useMemo(() => {
      if (!chain) return undefined
      const address =
        props.feeToken ?? PortoConfig.feeTokens[chain.id]?.[0].address
      return FeeToken.feeTokens[chain.id][address.toLowerCase()]
    }, [chain, props.feeToken])

    // TODO: use eventual Wagmi Hook (`usePrepareCalls`).
    const prepareCalls = useQuery({
      async queryFn() {
        if (!account) throw new Error('account is required.')

        const key = account.keys?.find(
          (key) => key.role === 'admin' && key.privateKey,
        )
        if (!key) throw new Error('no key found.')

        // TODO: use eventual Viem Action (`prepareCalls`).
        const raw = await providerClient.request(
          {
            method: 'wallet_prepareCalls',
            params: [
              {
                // Note: Using IIFE for inferred return type.
                ...(() => {
                  // If the request was from an `eth_sendTransaction`, marshal it
                  // into a `wallet_sendCalls` request.
                  if (request.method === 'eth_sendTransaction') {
                    const { chainId, data, to, value } = request.params[0]
                    return {
                      calls: [{ data, to: to!, value }],
                      chainId,
                    }
                  }

                  // Otherwise, we are dealing with a `wallet_sendCalls` request.
                  return request.params[0]
                })(),
                key,
              },
            ],
          },
          { retryCount: 0 },
        )

        return Schema.Decode(Rpc.wallet_prepareCalls.Response, raw)
      },
      queryKey: [
        'prepareCalls',
        account?.address,
        Json.stringify(request),
        providerClient.uid,
      ],
    })

    // TODO: extract from a `quote` capability on `wallet_prepareCalls` response
    //       instead of introspecting the context.
    const quote = useQuote(porto, {
      chainId,
      context: prepareCalls.data?.context,
    })

    const fiatFee = Price.useFiatPrice({
      value: quote?.fee.native.value,
    })
    const tokenFee = quote?.fee

    const simulate = useQuery({
      gcTime: 0,
      queryFn: async () => {
        const { balances, results } = await Delegation.simulate(client, {
          account: account!.address!,
          calls,
        })
        const failure = results.find((x) => x.status === 'failure')
        if (failure) throw failure.error
        return { balances, results }
      },
      queryKey: ['simulate', client.uid, Json.stringify(calls)],
      staleTime: 0,
    })
    const balances =
      simulate.data?.balances.filter((x) => x.value.diff !== 0n) ?? []

    const hasInsufficientBalance =
      checkBalance && prepareCalls.error?.message?.includes('PaymentError')

    const status = React.useMemo(() => {
      if (hasInsufficientBalance) return 'insufficient-balance'
      if (prepareCalls.isPending || simulate.isPending) return 'pending'
      if (prepareCalls.isError || simulate.isError) return 'error'
      if (prepareCalls.isSuccess || simulate.isSuccess) return 'success'
      return 'idle'
    }, [
      hasInsufficientBalance,
      prepareCalls.isError,
      prepareCalls.isPending,
      prepareCalls.isSuccess,
      simulate.isError,
      simulate.isPending,
      simulate.isSuccess,
    ])

    const warning = status === 'insufficient-balance' || status === 'error'

    return (
      <Layout loading={loading} loadingTitle="Sending...">
        <Layout.Header>
          <Layout.Header.Default
            content={<>Review the action to perform below.</>}
            icon={warning ? TriangleAlert : Star}
            title="Action Request"
            variant={warning ? 'warning' : 'default'}
          />
        </Layout.Header>

        <Layout.Content>
          <div className="space-y-3">
            {status === 'insufficient-balance' && (
              <div className="rounded-lg bg-warningTint px-3 py-2 text-warning">
                <div className="font-medium text-[14px]">
                  Insufficient balance
                </div>
                <p className="text-[14px] text-primary">
                  You will need more {feeToken?.symbol} to continue.
                </p>
              </div>
            )}

            {status === 'pending' && (
              <div className="space-y-2 rounded-lg bg-surface p-3">
                <div className="flex size-[24px] w-full items-center justify-center">
                  <Spinner className="text-secondary" />
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-lg bg-warningTint px-3 py-2 text-warning">
                <div className="font-medium text-[14px]">Error</div>
                <div className="space-y-2 text-[14px] text-primary">
                  <p>
                    An error occurred while simulating the action. Proceed with
                    caution.
                  </p>
                  <p>
                    Contact{' '}
                    <span className="font-medium">{origin?.hostname}</span> for
                    more information.
                  </p>
                </div>
              </div>
            )}

            {(status === 'success' || status === 'error') && (
              <div className="space-y-3 rounded-lg bg-surface p-3">
                {balances.length > 0 && (
                  <>
                    <div className="space-y-2">
                      {balances.map((balance) => {
                        const { token, value } = balance
                        if (value.diff === BigInt(0)) return null

                        const { decimals, symbol } = token

                        const receiving = value.diff > BigInt(0)
                        const formatted = ValueFormatter.format(
                          value.diff,
                          decimals,
                        )

                        const Icon = receiving ? ArrowDownLeft : ArrowUpRight

                        return (
                          <div
                            className="flex gap-2 font-medium"
                            key={token.address}
                          >
                            <div
                              className={cx(
                                'flex size-[24px] items-center justify-center rounded-full',
                                {
                                  'bg-destructiveTint': !receiving,
                                  'bg-successTint': receiving,
                                },
                              )}
                            >
                              <Icon
                                className={cx('size-4 text-current', {
                                  'text-destructive': !receiving,
                                  'text-success': receiving,
                                })}
                              />
                            </div>
                            <div>
                              {receiving ? 'Receive' : 'Send'}{' '}
                              <span
                                className={
                                  receiving
                                    ? 'text-success'
                                    : 'text-destructive'
                                }
                              >
                                {formatted}
                              </span>{' '}
                              {symbol}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="h-[1px] w-full bg-gray6" />
                  </>
                )}

                <div className="space-y-1">
                  <div
                    className={cx(
                      'flex h-[32px] justify-between text-[14px] leading-4',
                      {
                        'h-[inherit] leading-[inherit]':
                          fiatFee.isFetched || !quote,
                      },
                    )}
                  >
                    <span className="text-[14px] text-secondary leading-4">
                      Fees (est.)
                    </span>
                    <div className="text-right">
                      {fiatFee.isFetched || !quote ? (
                        <>
                          <div className="font-medium leading-4">
                            {fiatFee?.data?.display ?? 'Unknown'}
                          </div>
                          {tokenFee && (
                            <div className="leading-4">
                              <span className="text-secondary text-xs">
                                {tokenFee.display}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="font-medium text-secondary">
                          Loading...
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-[14px]">
                    <span className="text-[14px] text-secondary">
                      Duration (est.)
                    </span>
                    <span className="font-medium">2 seconds</span>
                  </div>

                  {chain?.name && (
                    <div className="flex justify-between text-[14px]">
                      <span className="text-[14px] text-secondary">
                        Network
                      </span>
                      <span className="font-medium">{chain?.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Layout.Content>

        <Layout.Footer>
          {status === 'insufficient-balance' && (
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
                onClick={() =>
                  onAddFunds({
                    token: feeToken!.address,
                  })
                }
                type="button"
                variant="accent"
              >
                Add Funds
              </Button>
            </Layout.Footer.Actions>
          )}

          {status === 'success' && (
            <Layout.Footer.Actions>
              <Button
                className="flex-grow"
                onClick={onReject}
                type="button"
                variant="destructive"
              >
                Deny
              </Button>

              <Button
                className="flex-grow"
                onClick={onApprove}
                type="button"
                variant="success"
              >
                Approve
              </Button>
            </Layout.Footer.Actions>
          )}

          {status === 'error' && (
            <Layout.Footer.Actions>
              <Button
                className="flex-grow"
                onClick={onReject}
                type="button"
                variant="destructive"
              >
                Deny
              </Button>
              <Button
                className="flex-grow"
                onClick={onApprove}
                type="button"
                variant="default"
              >
                Approve anyway
              </Button>
            </Layout.Footer.Actions>
          )}

          {account?.address && (
            <Layout.Footer.Account address={account.address} />
          )}
        </Layout.Footer>
      </Layout>
    )
  }

  export namespace Inner {
    export type Props = {
      address?: Address.Address | undefined
      calls: readonly Call[]
      chainId?: number | undefined
      checkBalance?: boolean | undefined
      feeToken?: Address.Address | undefined
      loading?: boolean | undefined
      onAddFunds: (p: { token: Address.Address }) => void
      onApprove: () => void
      onReject: () => void
      quote?: Quote | undefined
      request: RpcSchema.ExtractRequest<
        RpcSchema_porto.Schema,
        'eth_sendTransaction' | 'wallet_sendCalls'
      >
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////

export type Quote = {
  fee: Price.Price & {
    native: Price.Price
  }
  ttl: number
}

/**
 * Hook to extract a quote from a `wallet_prepareCalls` context.
 *
 * @param porto - Porto instance.
 * @param parameters - Parameters.
 * @returns Quote.
 */
export function useQuote<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(
  porto: Pick<Porto_.Porto<chains>, '_internal'>,
  parameters: useQuote.Parameters,
): Quote | undefined {
  const { chainId } = parameters
  const context = parameters.context as Quote_relay.Quote | undefined
  const { op, nativeFeeEstimate, txGas, ttl } = context ?? {}
  const { paymentToken, paymentMaxAmount } = op ?? {}

  const chain = Hooks.useChain(porto, { chainId })!

  const fee = React.useMemo(() => {
    if (!nativeFeeEstimate || !txGas || !paymentMaxAmount) return undefined

    const nativeConfig = {
      decimals: chain.nativeCurrency.decimals,
      symbol: chain.nativeCurrency.symbol,
      token: '0x0000000000000000000000000000000000000000',
      value: nativeFeeEstimate.maxFeePerGas * txGas,
    } as const

    const config = paymentToken
      ? {
          ...(FeeToken.feeTokens as any)[chain.id][paymentToken],
          token: paymentToken,
          value: paymentMaxAmount,
        }
      : nativeConfig

    const fee = Price.from(config)
    const native = Price.from(nativeConfig)
    return {
      ...fee,
      native,
    }
  }, [
    chain.id,
    chain.nativeCurrency.decimals,
    chain.nativeCurrency.symbol,
    nativeFeeEstimate,
    txGas,
    paymentMaxAmount,
    paymentToken,
  ])

  if (!fee) return undefined
  if (!ttl) return undefined
  return {
    fee,
    ttl,
  }
}

export namespace useQuote {
  export type Parameters = {
    chainId?: number | undefined
    context: unknown
  }
}

import { Porto } from '@porto/apps'
import { Button, Spinner } from '@porto/apps/components'
import { useQuery } from '@tanstack/react-query'
import { cx } from 'cva'
import { Address, Json, RpcSchema } from 'ox'
import { Delegation, RpcSchema as RpcSchema_porto } from 'porto'
import * as Rpc from 'porto/core/internal/typebox/request'
import * as Schema from 'porto/core/internal/typebox/schema'
import { Hooks } from 'porto/remote'
import { Call } from 'viem'

import * as Dialog from '~/lib/Dialog'
import * as Quote from '~/lib/Quote'
import { Layout } from '~/routes/-components/Layout'
import { ValueFormatter } from '~/utils'
import ArrowDownLeft from '~icons/lucide/arrow-down-left'
import ArrowUpRight from '~icons/lucide/arrow-up-right'
import TriangleAlert from '~icons/lucide/triangle-alert'
import Star from '~icons/ph/star-four-bold'

const porto = Porto.porto

export function ActionRequest(props: ActionRequest.Props) {
  const { address, calls, chainId, loading, onApprove, onReject, request } =
    props

  const account = Hooks.useAccount(porto, { address })
  const chain = Hooks.useChain(porto, { chainId })
  const client = Hooks.useClient(porto)
  const origin = Dialog.useStore((state) => state.referrer?.origin)
  const providerClient = Hooks.useProviderClient(porto)

  // TODO: use eventual Wagmi Hook (`usePrepareCalls`).
  const prepareCalls = useQuery({
    gcTime: 0,
    async queryFn() {
      if (!account) throw new Error('account is required.')

      const key = account.keys?.find(
        (key) => key.role === 'admin' && key.privateKey,
      )
      if (!key) throw new Error('no key found.')

      // TODO: use eventual Viem Action (`prepareCalls`).
      const raw = await providerClient.request({
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
      })

      return Schema.Decode(Rpc.wallet_prepareCalls.Response, raw)
    },
    queryKey: [
      'prepareCalls',
      account?.address,
      Json.stringify(request),
      providerClient.uid,
    ],
    refetchInterval: 15_000,
    staleTime: 0,
  })

  // TODO: extract from a `quote` capability on `wallet_prepareCalls` response
  //       instead of introspecting the context.
  const quote = Quote.useQuote(porto, {
    chainId,
    context: prepareCalls.data?.context,
  })

  const fee_fiat = Quote.useFiatFee(quote)
  const fee_token = quote?.fee

  const simulate = useQuery({
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
  })
  const balances =
    simulate.data?.balances.filter((x) => x.value.diff !== 0n) ?? []

  return (
    <Layout loading={loading} loadingTitle="Sending...">
      <Layout.Header>
        <Layout.Header.Default
          content={<>Review the action to perform below.</>}
          icon={simulate.status === 'error' ? TriangleAlert : Star}
          title="Action Request"
          variant={simulate.status === 'error' ? 'warning' : 'default'}
        />
      </Layout.Header>

      <Layout.Content>
        <div className="space-y-3">
          {simulate.isPending && (
            <div className="space-y-2 rounded-lg bg-surface p-3">
              <div className="flex size-[24px] w-full items-center justify-center">
                <Spinner className="text-secondary" />
              </div>
            </div>
          )}

          {simulate.isError && (
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

          {(simulate.isSuccess || simulate.isError) && (
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
                                receiving ? 'text-success' : 'text-destructive'
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
                        prepareCalls.isFetched &&
                        fee_fiat.isFetched &&
                        !fee_fiat.data,
                    },
                  )}
                >
                  <span className="text-[14px] text-secondary">
                    Fees (est.)
                  </span>
                  <div className="text-right">
                    {prepareCalls.isFetched && fee_fiat.isFetched ? (
                      <>
                        <div className="font-medium">
                          {fee_fiat?.data?.display ?? 'Unknown'}
                        </div>
                        {fee_token && (
                          <div>
                            <span className="text-secondary text-xs">
                              {fee_token.display}
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
                    <span className="text-[14px] text-secondary">Network</span>
                    <span className="font-medium">{chain?.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Layout.Content>

      <Layout.Footer>
        {simulate.isSuccess && (
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

        {simulate.isError && (
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

export namespace ActionRequest {
  export type Props = {
    address?: Address.Address | undefined
    calls: readonly Call[]
    chainId?: number | undefined
    loading?: boolean | undefined
    onApprove: () => void
    onReject: () => void
    quote?: Quote.Quote | undefined
    request: RpcSchema.ExtractRequest<
      RpcSchema_porto.Schema,
      'eth_sendTransaction' | 'wallet_sendCalls'
    >
  }
}

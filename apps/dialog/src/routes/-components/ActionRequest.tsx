import { Porto } from '@porto/apps'
import { Button, Spinner } from '@porto/apps/components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { cx } from 'cva'
import type { RpcSchema } from 'ox'
import { Delegation } from 'porto'
import { Actions, Hooks } from 'porto/remote'

import { Layout } from '~/components/Layout'
import * as Dialog from '~/lib/Dialog'
import { ValueFormatter } from '~/utils'
import ArrowDownLeft from '~icons/lucide/arrow-down-left'
import ArrowUpRight from '~icons/lucide/arrow-up-right'
import TriangleAlert from '~icons/lucide/triangle-alert'
import Star from '~icons/ph/star-four-bold'

const porto = Porto.porto

export function ActionRequest(props: ActionRequest.Props) {
  const { calls } = props

  const account = Hooks.useAccount(porto)
  const client = Hooks.useClient(porto)
  const origin = Dialog.useStore((state) => state.referrer?.origin)
  const chainId =
    typeof props.chainId === 'number'
      ? props.chainId
      : Hooks.useChain(porto)?.id

  // TODO
  chainId

  const request = Hooks.useRequest(porto)
  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, request!)
    },
  })

  const simulate = useQuery({
    queryKey: ['simulate', client.uid, calls],
    queryFn: async () => {
      const { balances, results } = await Delegation.simulate(client, {
        account: account!.address!,
        calls: calls as any,
      })
      const failure = results.find((x) => x.status === 'failure')
      if (failure) throw failure.error
      return { balances, results }
    },
  })
  const balances =
    simulate.data?.balances.filter((x) => x.value.diff !== 0n) ?? []

  return (
    <Layout loading={respond.isPending} loadingTitle="Sending...">
      <Layout.Header>
        <Layout.Header.Default
          title="Action Request"
          icon={simulate.status === 'error' ? TriangleAlert : Star}
          content={<>Review the action to perform below.</>}
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
                          key={token.address}
                          className="flex gap-2 font-medium"
                        >
                          <div
                            className={cx(
                              'flex size-[24px] items-center justify-center rounded-full',
                              {
                                'bg-successTint': receiving,
                                'bg-destructiveTint': !receiving,
                              },
                            )}
                          >
                            <Icon
                              className={cx('size-4 text-current', {
                                'text-success': receiving,
                                'text-destructive': !receiving,
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
                {/* TODO: Fees */}
                <div className="flex justify-between text-[14px]">
                  <span className="text-[14px] text-secondary">
                    Fees (est.)
                  </span>
                  <span className="font-medium">$0.01</span>
                </div>

                {/* TODO: Duration */}
                <div className="flex justify-between text-[14px]">
                  <span className="text-[14px] text-secondary">
                    Duration (est.)
                  </span>
                  <span className="font-medium">2 seconds</span>
                </div>

                {/* TODO: Network */}
                <div className="flex justify-between text-[14px]">
                  <span className="text-[14px] text-secondary">Network</span>
                  <span className="font-medium">Odyssey Testnet</span>
                </div>
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
              type="button"
              variant="destructive"
              onClick={() => Actions.reject(porto, request!)}
            >
              Deny
            </Button>

            <Button
              className="flex-grow"
              type="button"
              variant="success"
              onClick={() => respond.mutate()}
            >
              Approve
            </Button>
          </Layout.Footer.Actions>
        )}

        {simulate.isError && (
          <Layout.Footer.Actions>
            <Button
              className="flex-grow"
              type="button"
              variant="destructive"
              onClick={() => Actions.reject(porto, request!)}
            >
              Deny
            </Button>
            <Button
              className="flex-grow"
              type="button"
              variant="default"
              onClick={() => respond.mutate()}
            >
              Approve anyway
            </Button>
          </Layout.Footer.Actions>
        )}
        <Layout.Footer.Account />
      </Layout.Footer>
    </Layout>
  )
}

export namespace ActionRequest {
  export type Props = {
    calls: RpcSchema.ExtractParams<
      RpcSchema.Wallet,
      'wallet_sendCalls'
    >[0]['calls']
    chainId?: number | undefined
  }
}

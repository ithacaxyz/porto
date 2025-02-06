import { useMutation, useQuery } from '@tanstack/react-query'
import { cx } from 'cva'
import type { RpcSchema } from 'ox'
import { Delegation } from 'porto'
import { Actions, Hooks } from 'porto/remote'

import { Button } from '~/components/Button'
import { Layout } from '~/components/Layout'
import { Spinner } from '~/components/Spinner'
import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import { ValueFormatter } from '~/utils'
import ArrowDownLeft from '~icons/lucide/arrow-down-left'
import ArrowUpRight from '~icons/lucide/arrow-up-right'
import TriangleAlert from '~icons/lucide/triangle-alert'
import Star from '~icons/ph/star-four-bold'

export function TransactionRequest(props: TransactionRequest.Props) {
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
          variant={simulate.status === 'error' ? 'destructive' : 'default'}
        />
      </Layout.Header>

      <Layout.Content>
        {simulate.status === 'pending' && (
          <div className="space-y-2 rounded-lg bg-gray3 p-3">
            <div className="flex size-[24px] w-full items-center justify-center">
              <Spinner className="text-gray10" />
            </div>
          </div>
        )}

        {simulate.status === 'success' && (
          <div className="space-y-3 rounded-lg bg-gray3 p-3">
            <div className="space-y-2">
              {balances.map((balance) => {
                const { token, value } = balance
                if (value.diff === BigInt(0)) return null

                const { decimals, symbol } = token

                const receiving = value.diff > BigInt(0)
                const formatted = ValueFormatter.format(value.diff, decimals)

                const Icon = receiving ? ArrowDownLeft : ArrowUpRight

                return (
                  <div key={token.address} className="flex gap-2 font-medium">
                    <div
                      className={cx(
                        'flex size-[24px] items-center justify-center rounded-full',
                        {
                          'bg-green4': receiving,
                          'bg-red4': !receiving,
                        },
                      )}
                    >
                      <Icon
                        className={cx('size-4 text-current', {
                          'text-green10': receiving,
                          'text-red10': !receiving,
                        })}
                      />
                    </div>
                    <div>
                      {receiving ? 'Receive' : 'Send'}{' '}
                      <span
                        className={receiving ? 'text-green10' : 'text-red10'}
                      >
                        {formatted}
                      </span>{' '}
                      {symbol}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* <div className="h-[1px] w-full bg-gray6" />

            <div className="space-y-1">
              <div className="flex justify-between font-medium text-[14px]">
                <span className="text-[14px] text-gray10">Fees</span>
                <span>TODO</span>
              </div>
            </div> */}
          </div>
        )}

        {simulate.status === 'error' && (
          <div className="rounded-lg bg-red3 px-3 py-2 text-red10">
            <div className="font-medium text-[14px]">Error</div>
            <div className="text-[14px] text-gray12">
              An error occurred while simulating the action. Contact{' '}
              <span className="font-medium">{origin?.hostname}</span> for more
              information.
            </div>
          </div>
        )}
      </Layout.Content>

      <Layout.Footer>
        {simulate.status === 'success' && (
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

        {simulate.status === 'error' && (
          <Layout.Footer.Actions>
            <Button
              className="flex-grow"
              type="button"
              onClick={() => Actions.reject(porto, request!)}
            >
              Close
            </Button>
          </Layout.Footer.Actions>
        )}
        <Layout.Footer.Wallet />
      </Layout.Footer>
    </Layout>
  )
}

export namespace TransactionRequest {
  export type Props = {
    calls: RpcSchema.ExtractParams<
      RpcSchema.Wallet,
      'wallet_sendCalls'
    >[0]['calls']
    chainId?: number | undefined
  }
}

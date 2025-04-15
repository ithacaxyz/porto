import { Button } from '@porto/apps/components'
import { useQuery } from '@tanstack/react-query'
import { Hex } from 'ox'
import type * as Address from 'ox/Address'
import { Key, Relay } from 'porto/internal'
import { Hooks } from 'porto/remote'
import * as React from 'react'

import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import * as Price from '~/lib/Price'
import { Layout } from '~/routes/-components/Layout'
import { StringFormatter } from '~/utils'
import TriangleAlert from '~icons/lucide/triangle-alert'
import WalletIcon from '~icons/lucide/wallet-cards'
import * as ActionRequest from './ActionRequest'

export function GrantAdmin(props: GrantAdmin.Props) {
  const { authorizeKey, loading, onApprove, onReject } = props

  const account = Hooks.useAccount(porto)
  const client = Hooks.useClient(porto)
  const chain = Hooks.useChain(porto)
  const feeToken = ActionRequest.useFeeToken(porto, {
    chainId: chain?.id,
    feeToken: props.feeToken,
  })
  const origin = Dialog.useStore((state) => state.referrer?.origin)

  const prepareCalls = useQuery({
    enabled: !!account && !!chain,
    queryFn: async () => {
      if (!account || !chain) throw new Error('Account and chain required')

      const adminKey = account.keys?.find(
        (key) => key.role === 'admin' && key.privateKey,
      )
      if (!adminKey) throw new Error('Admin key not found')

      const { context } = await Relay.prepareCalls(client, {
        account,
        authorizeKeys: [Key.from(authorizeKey)],
        feeToken: feeToken?.address,
        key: adminKey,
      })

      return context
    },
    queryKey: [
      'prepareCalls',
      account?.address,
      authorizeKey.publicKey,
      client.uid,
      feeToken?.address,
    ],
  })

  const quote = ActionRequest.useQuote(porto, {
    chainId: chain?.id,
    context: prepareCalls.data,
  })

  const fiatFee = Price.useFiatPrice({
    value: quote?.fee.native.value,
  })

  const status = React.useMemo(() => {
    if (prepareCalls.isPending) return 'pending'
    if (prepareCalls.isError) return 'error'
    if (prepareCalls.isSuccess) return 'success'
    return 'idle'
  }, [prepareCalls.isError, prepareCalls.isPending, prepareCalls.isSuccess])

  const warning = status === 'error'

  return (
    <Layout loading={loading} loadingTitle="Authorizing...">
      <Layout.Header>
        <Layout.Header.Default
          content={
            <div>
              You will allow this account to recover your passkey if it is ever
              lost.
            </div>
          }
          icon={warning ? TriangleAlert : undefined}
          title="Add backup method"
          variant={warning ? 'warning' : 'default'}
        />
      </Layout.Header>
      <Layout.Content>
        <div className="space-y-3">
          {status === 'error' && (
            <div className="rounded-lg bg-warningTint px-3 py-2 text-warning">
              <div className="font-medium text-[14px]">Error</div>
              <div className="space-y-2 text-[14px] text-primary">
                <p>
                  An error occurred while calculating fees. This may be due to
                  network issues or insufficient funds.
                </p>
                <p>
                  Contact{' '}
                  <span className="font-medium">{origin?.hostname}</span> if
                  this issue persists.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center rounded-md bg-surface p-2">
            {account?.address && (
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-jade4">
                  <WalletIcon className="h-4 w-4 text-jade9" />
                </div>
                <span className="font-medium font-mono text-base">
                  {StringFormatter.truncate(authorizeKey.publicKey)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Layout.Content>

      <Layout.Content>
        <p className="mb-1 text-[14px] text-secondary">More details</p>
        <div className="space-y-2 rounded-md bg-surface p-3">
          <div className="flex h-[38px] items-start justify-between">
            <span className="text-[14px] text-secondary leading-4">
              Fees (est.)
            </span>
            <div className="text-right text-[14px]">
              {fiatFee.isFetched ? (
                <>
                  <div className="font-medium leading-4">
                    {fiatFee.data?.display}
                  </div>
                  {quote?.fee && (
                    <div>
                      <span className="text-secondary text-xs">
                        {quote.fee.display}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <span className="font-medium text-secondary">Loading...</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-secondary">Duration (est.)</span>
            <span className="font-medium text-[14px]">2 seconds</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-secondary">Network</span>
            <span className="font-medium text-[14px]">{chain?.name}</span>
          </div>
        </div>
      </Layout.Content>

      <Layout.Footer>
        <Layout.Footer.Actions>
          {status === 'error' ? (
            <>
              <Button className="flex-1" onClick={onReject} type="button">
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={onApprove}
                type="button"
                variant="default"
              >
                Attempt anyway
              </Button>
            </>
          ) : (
            <>
              <Button className="flex-1" onClick={onReject} type="button">
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={onApprove}
                type="button"
                variant="accent"
              >
                Add
              </Button>
            </>
          )}
        </Layout.Footer.Actions>

        {account?.address && (
          <Layout.Footer.Account address={account.address} />
        )}
      </Layout.Footer>
    </Layout>
  )
}

export declare namespace GrantAdmin {
  type Props = {
    authorizeKey: {
      publicKey: Hex.Hex
      type: 'address' | 'p256' | 'secp256k1' | 'webauthn-p256'
    }
    feeToken?: Address.Address | undefined
    loading: boolean
    onApprove: () => void
    onReject: () => void
  }
}

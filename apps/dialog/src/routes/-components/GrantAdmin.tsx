import { Button } from '@porto/apps/components'
import { Hex } from 'ox'
import type * as Address from 'ox/Address'
import { Key } from 'porto/internal'
import { Hooks } from 'porto/remote'

import { CheckBalance } from '~/components/CheckBalance'
import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import * as Relay from '~/lib/Relay'
import { Layout } from '~/routes/-components/Layout'
import { StringFormatter } from '~/utils'
import TriangleAlert from '~icons/lucide/triangle-alert'
import WalletIcon from '~icons/lucide/wallet-cards'
import { ActionRequest } from './ActionRequest'

export function GrantAdmin(props: GrantAdmin.Props) {
  const { authorizeKey, feeToken, loading, onApprove, onReject } = props

  const account = Hooks.useAccount(porto)
  const origin = Dialog.useStore((state) => state.referrer?.origin)

  const prepareCallsQuery = Relay.usePrepareCalls({
    authorizeKeys: [Key.from(authorizeKey)],
    feeToken,
  })

  const quote = prepareCallsQuery.data?.capabilities.quote

  return (
    <CheckBalance onReject={onReject} query={prepareCallsQuery}>
      <Layout loading={loading} loadingTitle="Authorizing...">
        <Layout.Header>
          <Layout.Header.Default
            content={
              <div>
                You will allow this account to recover your passkey if it is
                ever lost.
              </div>
            }
            icon={prepareCallsQuery.isError ? TriangleAlert : undefined}
            title="Add backup method"
            variant={prepareCallsQuery.isError ? 'warning' : 'default'}
          />
        </Layout.Header>
        <Layout.Content>
          <ActionRequest.PaneWithDetails
            loading={prepareCallsQuery.isPending}
            quote={quote}
            variant={prepareCallsQuery.isError ? 'warning' : 'default'}
          >
            {prepareCallsQuery.isError && (
              <div>
                <div className="space-y-2 text-[14px] text-primary">
                  <p className="font-medium text-warning">Error</p>
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

            {account?.address && (
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-jade4">
                  <WalletIcon className="h-4 w-4 text-jade9" />
                </div>
                <span className="font-medium font-mono text-base">
                  {StringFormatter.truncate(authorizeKey.publicKey)}
                </span>
              </div>
            )}
          </ActionRequest.PaneWithDetails>
        </Layout.Content>

        <Layout.Footer>
          <Layout.Footer.Actions>
            {prepareCallsQuery.isError ? (
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
    </CheckBalance>
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

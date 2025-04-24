import { Button } from '@porto/apps/components'
import { Address, Hex } from 'ox'
import { Key } from 'porto/internal'
import { Hooks } from 'porto/wagmi'

import { CheckBalance } from '~/components/CheckBalance'
import * as Dialog from '~/lib/Dialog'
import * as Relay from '~/lib/Relay'
import { Layout } from '~/routes/-components/Layout'
import { StringFormatter } from '~/utils'
import WalletIcon from '~icons/lucide/wallet-cards'
import { ActionRequest } from './ActionRequest'

export function RevokeAdmin(props: RevokeAdmin.Props) {
  const { feeToken, loading, onApprove, onReject, revokeKeyId } = props

  const admins = Hooks.useAdmins()
  const revokeKey = admins?.data?.keys?.find(
    (admin) => admin.id === revokeKeyId,
  )
  const origin = Dialog.useStore((state) => state.referrer?.origin)

  const prepareCallsQuery = Relay.usePrepareCalls({
    enabled: !!revokeKey,
    feeToken,
    revokeKeys: revokeKey ? [Key.from(revokeKey)] : [],
  })

  const quote = prepareCallsQuery.data?.capabilities.quote

  return (
    <CheckBalance onReject={onReject} query={prepareCallsQuery}>
      <Layout loading={loading} loadingTitle="Removing...">
        <Layout.Header>
          <Layout.Header.Default
            content={
              <div>
                Remove the ability of the following wallet to recover this
                passkey if it is lost.
              </div>
            }
            title="Remove recovery method"
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

            {revokeKey && (
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-jade4">
                  <WalletIcon className="h-4 w-4 text-jade9" />
                </div>
                <span className="font-medium font-mono text-base">
                  {StringFormatter.truncate(revokeKey.publicKey)}
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
                  Remove
                </Button>
              </>
            )}
          </Layout.Footer.Actions>

          {admins.data?.address && (
            <Layout.Footer.Account address={admins.data.address} />
          )}
        </Layout.Footer>
      </Layout>
    </CheckBalance>
  )
}

export declare namespace RevokeAdmin {
  type Props = {
    feeToken?: Address.Address | undefined
    loading: boolean
    onApprove: () => void
    onReject: () => void
    revokeKeyId: Hex.Hex
  }
}

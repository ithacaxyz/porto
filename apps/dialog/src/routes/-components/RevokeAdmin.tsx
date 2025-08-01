import { Button } from '@porto/apps/components'
import type { Address, Hex } from 'ox'
import { Key } from 'porto'
import type * as FeeToken_schema from 'porto/core/internal/schema/feeToken'
import { Hooks } from 'porto/wagmi'

import { CheckBalance } from '~/components/CheckBalance'
import * as Calls from '~/lib/Calls'
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

  const prepareCallsQuery = Calls.prepareCalls.useQuery({
    enabled: !!revokeKey,
    feeToken,
    revokeKeys: revokeKey ? [Key.from(revokeKey)] : [],
  })
  const { feeTotals, quote } = prepareCallsQuery.data?.capabilities ?? {}
  const quotes = quote?.quotes ?? []

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
            error={prepareCallsQuery.error}
            errorMessage="An error occurred while calculating fees. This may be due to network issues or insufficient funds."
            feeTotals={feeTotals}
            loading={prepareCallsQuery.isPending}
            quotes={quotes}
          >
            {revokeKey && (
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-th_badge-positive">
                  <WalletIcon className="h-4 w-4 text-th_badge-positive" />
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
                  variant="primary"
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
    feeToken?: FeeToken_schema.Symbol | Address.Address | undefined
    loading: boolean
    onApprove: () => void
    onReject: () => void
    revokeKeyId: Hex.Hex
  }
}

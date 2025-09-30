import { Button } from '@porto/ui'
import type { Address, Hex } from 'ox'
import { Key } from 'porto'
import type * as Token from 'porto/core/internal/schema/token'
import { Hooks } from 'porto/wagmi'

import * as Calls from '~/lib/Calls'
import { Layout } from '~/routes/-components/Layout'
import { StringFormatter } from '~/utils'
import WalletIcon from '~icons/lucide/wallet-cards'
import { ActionPreview } from './ActionPreview'
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
  const { capabilities } = prepareCallsQuery.data ?? {}
  const { feeTotals, quote } = capabilities ?? {}
  const quotes = quote?.quotes ?? []

  return (
    <ActionPreview
      account={admins.data?.address}
      actions={
        <Layout.Footer.Actions>
          <Button disabled={loading} onClick={onReject} width="grow">
            Cancel
          </Button>
          <Button
            loading={loading && 'Removing…'}
            onClick={onApprove}
            variant={prepareCallsQuery.isError ? 'secondary' : 'primary'}
            width="grow"
          >
            {prepareCallsQuery.isError ? 'Attempt anyway' : 'Remove'}
          </Button>
        </Layout.Footer.Actions>
      }
      error={prepareCallsQuery.error}
      header={
        <Layout.Header.Default
          content={
            <div>
              Remove the ability of the following wallet to recover this passkey
              if it is lost.
            </div>
          }
          title="Remove recovery method"
        />
      }
      onReject={onReject}
      queryParams={{ address: admins.data?.address }}
      quotes={
        prepareCallsQuery.isPending ? undefined : capabilities?.quote?.quotes
      }
    >
      <ActionRequest.PaneWithDetails
        error={prepareCallsQuery.error}
        errorMessage="An error occurred while calculating fees. This may be due to network issues or insufficient funds."
        feeTotals={feeTotals}
        quotes={quotes}
        status={prepareCallsQuery.status}
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
    </ActionPreview>
  )
}

export declare namespace RevokeAdmin {
  type Props = {
    feeToken?: Token.Symbol | Address.Address | undefined
    loading: boolean
    onApprove: () => void
    onReject: () => void
    revokeKeyId: Hex.Hex
  }
}

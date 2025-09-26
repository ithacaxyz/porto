import { Button } from '@porto/ui'
import type { Hex } from 'ox'
import type * as Address from 'ox/Address'
import { Key } from 'porto'
import type * as Token from 'porto/core/internal/schema/token.js'
import { Hooks } from 'porto/remote'

import * as Calls from '~/lib/Calls'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import { StringFormatter } from '~/utils'
import TriangleAlert from '~icons/lucide/triangle-alert'
import WalletIcon from '~icons/lucide/wallet-cards'
import { ActionPreview } from './ActionPreview'
import { ActionRequest } from './ActionRequest'

export function GrantAdmin(props: GrantAdmin.Props) {
  const { authorizeKey, feeToken, loading, onApprove, onReject } = props

  const account = Hooks.useAccount(porto)

  const prepareCallsQuery = Calls.prepareCalls.useQuery({
    authorizeKeys: [Key.from(authorizeKey)],
    feeToken,
  })
  const { capabilities } = prepareCallsQuery.data ?? {}
  const { feeTotals, quote } = capabilities ?? {}
  const quotes = quote?.quotes ?? []

  return (
    <ActionPreview
      account={account?.address}
      actions={
        <Layout.Footer.Actions>
          <Button disabled={loading} onClick={onReject} width="grow">
            Cancel
          </Button>
          <Button
            loading={loading && 'Authorizing…'}
            onClick={onApprove}
            variant={prepareCallsQuery.isError ? 'secondary' : 'primary'}
            width="grow"
          >
            {prepareCallsQuery.isError ? 'Attempt anyway' : 'Add'}
          </Button>
        </Layout.Footer.Actions>
      }
      error={prepareCallsQuery.error}
      header={
        <Layout.Header.Default
          content={
            <div>
              You will allow this account to recover your passkey if it is ever
              lost.
            </div>
          }
          icon={prepareCallsQuery.isError ? TriangleAlert : undefined}
          title="Add recovery method"
          variant={prepareCallsQuery.isError ? 'warning' : 'default'}
        />
      }
      onReject={onReject}
      queryParams={{ address: account?.address }}
      quotes={prepareCallsQuery.isPending ? undefined : quotes}
    >
      <ActionRequest.PaneWithDetails
        error={prepareCallsQuery.error}
        errorMessage="An error occurred while calculating fees. This may be due to network issues or insufficient funds."
        feeTotals={feeTotals}
        quotes={quotes}
        status={prepareCallsQuery.status}
      >
        {account?.address && (
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-th_badge-positive">
              <WalletIcon className="h-4 w-4 text-th_badge-positive" />
            </div>
            <span className="font-medium font-mono text-base">
              {StringFormatter.truncate(authorizeKey.publicKey)}
            </span>
          </div>
        )}
      </ActionRequest.PaneWithDetails>
    </ActionPreview>
  )
}

export declare namespace GrantAdmin {
  type Props = {
    authorizeKey: {
      publicKey: Hex.Hex
      type: 'address' | 'p256' | 'secp256k1' | 'webauthn-p256'
    }
    feeToken?: Token.Symbol | Address.Address | undefined
    loading: boolean
    onApprove: () => void
    onReject: () => void
  }
}

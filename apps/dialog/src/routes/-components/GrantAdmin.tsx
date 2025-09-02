import { Button } from '@porto/ui'
import type { Hex } from 'ox'
import type * as Address from 'ox/Address'
import { Key } from 'porto'
import type * as FeeToken_schema from 'porto/core/internal/schema/feeToken.js'
import { Hooks } from 'porto/remote'

import { CheckBalance } from '~/components/CheckBalance'
import * as Calls from '~/lib/Calls'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import { StringFormatter } from '~/utils'
import TriangleAlert from '~icons/lucide/triangle-alert'
import WalletIcon from '~icons/lucide/wallet-cards'
import { ActionRequest } from './ActionRequest'

export function GrantAdmin(props: GrantAdmin.Props) {
  const { authorizeKey, feeToken, loading, onApprove, onReject, chainId } =
    props

  const account = Hooks.useAccount(porto)

  // Prefer `porto.chainId` (forwarded to dialog as `chainId`) from URL, else fallback to props.
  const resolvedChainId = (() => {
    if (typeof window === 'undefined') return chainId
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('chainId') ?? params.get('porto.chainId')
    if (!raw) return chainId
    let parsed: number | undefined
    try {
      parsed = /^0x/i.test(raw)
        ? Number.parseInt(raw, 16)
        : Number.parseInt(raw, 10)
    } catch {
      parsed = undefined
    }
    if (parsed === undefined || Number.isNaN(parsed)) return chainId
    const supported = porto._internal.config.chains.some((c) => c.id === parsed)
    return supported ? parsed : chainId
  })()

  const prepareCallsQuery = Calls.prepareCalls.useQuery({
    authorizeKeys: [Key.from(authorizeKey)],
    chainId: resolvedChainId,
    feeToken,
  })
  const { capabilities } = prepareCallsQuery.data ?? {}
  const { feeTotals, quote } = capabilities ?? {}
  const quotes = quote?.quotes ?? []

  return (
    <CheckBalance onReject={onReject} query={prepareCallsQuery}>
      <Layout>
        <Layout.Header>
          <Layout.Header.Default
            content={
              <div>
                You will allow this account to recover your passkey if it is
                ever lost.
              </div>
            }
            icon={prepareCallsQuery.isError ? TriangleAlert : undefined}
            title="Add recovery method"
            variant={prepareCallsQuery.isError ? 'warning' : 'default'}
          />
        </Layout.Header>
        <Layout.Content>
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
        </Layout.Content>

        <Layout.Footer>
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
    chainId?: number | undefined
    feeToken?: FeeToken_schema.Symbol | Address.Address | undefined
    loading: boolean
    onApprove: () => void
    onReject: () => void
  }
}

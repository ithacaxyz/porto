import { Button } from '@porto/apps/components'
import type { Hex } from 'ox'
import type * as Address from 'ox/Address'
import { Key } from 'porto'
import type * as FeeToken_typebox from 'porto/core/internal/typebox/feeToken.js'
import { Hooks } from 'porto/remote'

import { CheckBalance } from '~/components/CheckBalance'
import { porto } from '~/lib/Porto'
import * as RpcServer from '~/lib/RpcServer'
import { Layout } from '~/routes/-components/Layout'
import { StringFormatter } from '~/utils'
import TriangleAlert from '~icons/lucide/triangle-alert'
import WalletIcon from '~icons/lucide/wallet-cards'
import { ActionRequest } from './ActionRequest'

export function GrantAdmin(props: GrantAdmin.Props) {
  const { authorizeKey, feeToken, loading, onApprove, onReject } = props

  const account = Hooks.useAccount(porto)

  const prepareCallsQuery = RpcServer.usePrepareCalls({
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
            title="Add recovery method"
            variant={prepareCallsQuery.isError ? 'warning' : 'default'}
          />
        </Layout.Header>
        <Layout.Content>
          <ActionRequest.PaneWithDetails
            error={prepareCallsQuery.error}
            errorMessage="An error occurred while calculating fees. This may be due to network issues or insufficient funds."
            loading={prepareCallsQuery.isPending}
            quote={quote}
          >
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
    feeToken?: FeeToken_typebox.Symbol | Address.Address | undefined
    loading: boolean
    onApprove: () => void
    onReject: () => void
  }
}

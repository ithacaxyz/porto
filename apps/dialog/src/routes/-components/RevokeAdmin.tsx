import { Button } from '@porto/apps/components'
import { Hex } from 'ox'
import { Hooks } from 'porto/remote'

import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import { StringFormatter } from '~/utils'
import WalletIcon from '~icons/lucide/wallet-cards'

export function RevokeAdmin(props: RevokeAdmin.Props) {
  const { authorizeKey, loading, onApprove, onReject } = props

  const account = Hooks.useAccount(porto)

  return (
    <Layout loading={loading} loadingTitle="Authorizing...">
      <Layout.Header>
        <Layout.Header.Default
          content={
            <div>
              Remove the ability of the following wallet to recover this passkey if it is lost.
            </div>
          }
          title="Remove recovery method"
        />
      </Layout.Header>
      <Layout.Content>
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
      </Layout.Content>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button className="flex-1" onClick={onReject} type="button">
            Cancel
          </Button>

          <Button
            className="flex-1"
            onClick={onApprove}
            type="button"
            variant="destructive"
          >
            Remove
          </Button>
        </Layout.Footer.Actions>

        {account?.address && (
          <Layout.Footer.Account address={account.address} />
        )}
      </Layout.Footer>
    </Layout>
  )
}

export declare namespace RevokeAdmin {
  type Props = {
    authorizeKey: {
      publicKey: Hex.Hex
    }
    loading: boolean
    onApprove: () => void
    onReject: () => void
  }
}

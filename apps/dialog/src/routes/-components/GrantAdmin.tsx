import { Button } from '@porto/apps/components'
import { type RpcSchema } from 'ox'
import type { RpcSchema as porto_RpcSchema } from 'porto'
import { Hooks } from 'porto/remote'

import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import { StringFormatter } from '~/utils'
import WalletIcon from '~icons/lucide/wallet-cards'

export function GrantAdmin(props: GrantAdmin.Props) {
  const { address, key, loading, onApprove, onReject } = props

  const account = Hooks.useAccount(porto, { address })

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
          title="Add backup method"
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
                {StringFormatter.truncate(key.publicKey)}
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
            variant="accent"
          >
            Add
          </Button>
        </Layout.Footer.Actions>

        {account?.address && (
          <Layout.Footer.Account address={account.address} />
        )}
      </Layout.Footer>
    </Layout>
  )
}

export declare namespace GrantAdmin {
  type Props = RpcSchema.ExtractParams<
    porto_RpcSchema.Schema,
    'experimental_grantAdmin'
  >['0'] & {
    loading: boolean
    onApprove: () => void
    onReject: () => void
  }
}

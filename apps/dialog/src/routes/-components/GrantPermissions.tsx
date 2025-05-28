import { Button } from '@porto/apps/components'
import { type RpcSchema } from 'ox'
import type { RpcSchema as porto_RpcSchema } from 'porto'
import { Hooks } from 'porto/remote'

import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import LucideDiamondPlus from '~icons/lucide/diamond-plus'
import { NotFound } from './NotFound'
import { Permissions } from './Permissions'

export function GrantPermissions(props: GrantPermissions.Props) {
  const { address, permissions, loading, onApprove, onReject } = props

  const account = Hooks.useAccount(porto, { address })

  if (!permissions?.spend) return <NotFound />
  if (permissions.spend.length === 0) return <NotFound />

  return (
    <Layout loading={loading} loadingTitle="Authorizing...">
      <Layout.Header>
        <Layout.Header.Default
          content={
            <div>You must update the following permissions to continue:</div>
          }
          icon={LucideDiamondPlus}
          title="Update permissions"
          variant="warning"
        />
      </Layout.Header>
      <Layout.Content className="pl-0">
        <Permissions
          calls={permissions.calls ?? []}
          spend={permissions.spend}
          title="Permissions requested"
        />
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
            Grant
          </Button>
        </Layout.Footer.Actions>

        {account?.address && (
          <Layout.Footer.Account address={account.address} />
        )}
      </Layout.Footer>
    </Layout>
  )
}

export declare namespace GrantPermissions {
  type Props = RpcSchema.ExtractParams<
    porto_RpcSchema.Schema,
    'wallet_grantPermissions'
  >['0'] & {
    loading: boolean
    onApprove: () => void
    onReject: () => void
  }
}

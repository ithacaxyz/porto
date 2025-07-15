import { Button } from '@porto/apps/components'
import type { Address } from 'ox'
import type * as PermissionsRequest from 'porto/core/internal/permissionsRequest'
import { Hooks } from 'porto/remote'

import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import LucideDiamondPlus from '~icons/lucide/diamond-plus'
import { Permissions } from './Permissions'

export function GrantPermissions(props: GrantPermissions.Props) {
  const { address, loading, onApprove, onReject, request } = props

  const account = Hooks.useAccount(porto, { address })

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
          calls={request?.permissions.calls ?? []}
          spend={request?.permissions.spend ?? []}
          title="Permissions requested"
        />
      </Layout.Content>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            className="flex-1"
            data-testid="cancel"
            onClick={onReject}
            type="button"
          >
            Cancel
          </Button>

          <Button
            className="flex-1"
            data-testid="grant"
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
  type Props = {
    address?: Address.Address | undefined
    loading: boolean
    onApprove: () => void
    onReject: () => void
    request?: PermissionsRequest.PermissionsRequest | undefined
  }
}

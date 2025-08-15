import { Button } from '@porto/ui'
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
    <Layout>
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
            data-testid="cancel"
            disabled={loading}
            onClick={onReject}
            width="grow"
          >
            Cancel
          </Button>
          <Button
            data-testid="grant"
            loading={loading && 'Authorizing…'}
            onClick={onApprove}
            variant="primary"
            width="grow"
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

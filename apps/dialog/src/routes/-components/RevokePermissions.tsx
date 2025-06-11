import { Button } from '@porto/apps/components'
import { Hex, type RpcSchema } from 'ox'
import type { RpcSchema as porto_RpcSchema } from 'porto'
import { Hooks } from 'porto/wagmi'
import { CheckBalance } from '~/components/CheckBalance'
import * as Dialog from '~/lib/Dialog'
import * as RpcServer from '~/lib/RpcServer'
import { Layout } from '~/routes/-components/Layout'
import { Permissions } from './Permissions'

export function RevokePermissions(props: RevokePermissions.Props) {
  const { id, loading, onApprove, onReject, capabilities } = props

  const { data } = Hooks.usePermissions()
  const permissions = data?.find((x) => x.id === id)?.permissions
  const hostname = Dialog.useStore((state) => state.referrer?.url?.hostname)

  const prepareCallsQuery = RpcServer.usePrepareCalls({
    enabled: !!permissions,
    feeToken: capabilities?.feeToken,
  })

  return (
    <CheckBalance onReject={onReject} query={prepareCallsQuery}>
      <Layout loading={loading} loadingTitle="Authorizing...">
        <Layout.Header>
          <Layout.Header.Default
            content={
              <>
                Remove the ability for{' '}
                {hostname ? (
                  <span className="font-medium">{hostname}</span>
                ) : (
                  'this website'
                )}{' '}
                to spend with the following rule.
              </>
            }
            title="Revoke permissions"
            variant="warning"
          />
        </Layout.Header>

        {permissions && (
          <Layout.Content className="pl-0">
            <Permissions
              calls={permissions.calls ?? []}
              spend={permissions.spend?.map((x) => ({
                ...x,
                limit: Hex.fromNumber(x.limit),
              }))}
            />
          </Layout.Content>
        )}

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
              Revoke
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
      </Layout>
    </CheckBalance>
  )
}

export declare namespace RevokePermissions {
  type Props = RpcSchema.ExtractParams<
    porto_RpcSchema.Schema,
    'wallet_revokePermissions'
  >[number] & {
    loading: boolean
    onApprove: () => void
    onReject: () => void
  }
}

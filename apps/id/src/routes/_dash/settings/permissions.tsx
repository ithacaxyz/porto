import * as UI from '@porto/ui'
import { CatchBoundary, createFileRoute } from '@tanstack/react-router'
import { Json } from 'ox'
import { Hooks } from 'porto/wagmi'
import type { getPermissions } from 'porto/wagmi/Actions'
import { DateFormatter, StringFormatter, ValueFormatter } from '~/utils'

export const Route = createFileRoute('/_dash/settings/permissions')({
  component: RouteComponent,
})

function RouteComponent() {
  const { account } = Route.useRouteContext()

  const permissions = Hooks.usePermissions()
  const revokePermissions = Hooks.useRevokePermissions()

  return (
    <CatchBoundary
      getResetKey={() => 'permissions'}
      onCatch={(error, errorInfo) => {
        console.error(error, errorInfo)
      }}
    >
      <section className="w-full overflow-x-auto">
        <div>Hello "/_dash/settings/permissions"!</div>
        <div>Account: {account?.address}</div>
        <p>
          Chains with permissions: {permissions.data?.length} (
          {permissions.data?.map((permission) => permission.chainId).join(', ')}
          )
        </p>
        <ul>
          {permissions.data?.map((permission, index) => (
            <div key={permission.id}>
              <p>#{index + 1}</p>
              <PermissionRow
                onAction={() => {
                  revokePermissions.mutate({
                    address: account.address,
                    chainId: permission.chainId as never,
                    id: permission.id,
                  })
                }}
                permission={permission}
              />
            </div>
          ))}
        </ul>
        <details>
          <summary>raw permissions</summary>
          <pre>{Json.stringify(permissions.data, null, 2)}</pre>
        </details>
      </section>
    </CatchBoundary>
  )
}

type Permission = Awaited<ReturnType<typeof getPermissions>>[number]

function PermissionRow(props: PermissionRow.Props) {
  const { permission, onAction } = props

  return (
    <div>
      <p>Chain: {permission.chainId}</p>
      <p>ID: {StringFormatter.truncate(permission.id)}</p>
      <p>
        Expires in: {DateFormatter.timeToDuration(permission.expiry * 1_000)}
      </p>
      <p>Spend:</p>
      <ol>
        {permission.permissions.spend?.map((spend) => (
          <li key={spend.token ?? spend.period}>
            <ul>
              <li>
                Limit: {ValueFormatter.format(spend.limit)} {spend.token}
              </li>
              <li>Period: {spend.period}</li>
              <li>Token: {spend.token}</li>
            </ul>
          </li>
        ))}
      </ol>
      <p>Calls:</p>
      <ol>
        {permission.permissions.calls?.map((call) => (
          <li key={call.to ?? call.signature}>
            <ul>
              <li>To: {call.to}</li>
              <li>Signature: {call.signature}</li>
            </ul>
          </li>
        ))}
      </ol>
      <UI.Button onClick={onAction} type="button" variant="strong">
        Revoke
      </UI.Button>
    </div>
  )
}

declare namespace PermissionRow {
  type Props = {
    permission: Permission
    onAction: React.MouseEventHandler<HTMLButtonElement>
  }
}

import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'
import * as React from 'react'
import * as PermissionsRequest from '~/lib/PermissionsRequest'
import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { Email } from '../-components/Email'
import { SignUp } from '../-components/SignUp'

export const Route = createFileRoute('/dialog/wallet_prepareUpgradeAccount')({
  component: RouteComponent,
  validateSearch: (search) => {
    const request = Router.parseSearchRequest(search, {
      method: 'wallet_prepareUpgradeAccount',
    })
    return request
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const { params = [] } = request
  const { capabilities } = params[0] ?? {}

  const grantPermissionsQuery = PermissionsRequest.useResolve(
    capabilities?.grantPermissions,
  )
  const grantPermissions = grantPermissionsQuery.data

  const respond = useMutation({
    async mutationFn({ email }: { email?: string | undefined } = {}) {
      if (!request) throw new Error('no request found.')
      if (request.method !== 'wallet_prepareUpgradeAccount')
        throw new Error(
          'request is not a wallet_prepareUpgradeAccount request.',
        )

      const params = request.params ?? []

      return Actions.respond(porto, {
        ...request,
        params: [
          {
            ...params[0],
            capabilities: {
              ...params[0]?.capabilities,
              email: Boolean(email),
              grantPermissions: grantPermissions?._encoded,
              label: email,
            },
          },
        ],
      } as typeof request)
    },
  })

  const status = React.useMemo(() => {
    if (capabilities?.grantPermissions && grantPermissionsQuery.isFetching)
      return 'loading'
    if (respond.isPending) return 'responding'
    return undefined
  }, [
    capabilities?.grantPermissions,
    grantPermissionsQuery.isFetching,
    respond.isPending,
  ])

  if (capabilities?.email ?? true)
    return (
      <Email
        actions={['sign-up']}
        onApprove={(options) => respond.mutate(options)}
        permissions={grantPermissions?.permissions}
        status={status}
      />
    )

  return (
    <SignUp
      enableSignIn={false}
      onApprove={() => respond.mutate({})}
      onReject={() => Actions.reject(porto, request)}
      permissions={grantPermissions?.permissions}
      status={status}
    />
  )
}

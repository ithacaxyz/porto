import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'

import * as PermissionsRequest from '~/lib/PermissionsRequest'
import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { GrantPermissions } from '../-components/GrantPermissions'

export const Route = createFileRoute('/dialog/wallet_grantPermissions')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'wallet_grantPermissions',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const parameters = request.params[0]

  const grantPermissionsQuery = PermissionsRequest.useResolve(parameters)
  const grantPermissions = grantPermissionsQuery.data

  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, {
        ...request,
        params: [grantPermissions?._encoded],
      })
    },
  })

  return (
    <GrantPermissions
      address={undefined}
      loading={respond.isPending}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, request)}
      request={grantPermissions}
    />
  )
}

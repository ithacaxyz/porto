import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as Provider from 'ox/Provider'
import { Actions } from 'porto/remote'

import * as PermissionsRequest from '~/lib/PermissionsRequest'
import { porto } from '~/lib/Porto'
import { useAuthSessionRedirect } from '~/lib/ReactNative'
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
    async mutationFn({ reject }: { reject?: boolean } = {}) {
      if (reject) {
        await Actions.reject(porto, request)
        throw new Provider.UserRejectedRequestError()
      }
      return Actions.respond(porto, {
        ...request,
        params: [grantPermissions?._encoded],
      })
    },
  })

  useAuthSessionRedirect(respond)

  return (
    <GrantPermissions
      address={undefined}
      loading={respond.isPending}
      onApprove={() => respond.mutate()}
      onReject={() => respond.mutate({ reject: true })}
      request={grantPermissions}
    />
  )
}

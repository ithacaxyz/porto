import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'

import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { RevokePermissions } from '../-components/RevokePermissions'

export const Route = createFileRoute('/dialog/wallet_revokePermissions')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'wallet_revokePermissions',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const parameters = request.params[0]

  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, request)
    },
  })

  return (
    <RevokePermissions
      {...parameters}
      loading={respond.isPending}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, request)}
    />
  )
}

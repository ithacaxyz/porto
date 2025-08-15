import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'

import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { RevokeAdmin } from '../-components/RevokeAdmin'

export const Route = createFileRoute('/dialog/wallet_revokeAdmin')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'wallet_revokeAdmin',
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
    <RevokeAdmin
      feeToken={parameters.capabilities?.feeToken}
      loading={respond.isPending}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, request)}
      revokeKeyId={parameters.id}
    />
  )
}

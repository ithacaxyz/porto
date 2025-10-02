import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Hex } from 'ox'
import { Actions } from 'porto/remote'

import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { GrantAdmin } from '../-components/GrantAdmin'

export const Route = createFileRoute('/dialog/wallet_grantAdmin')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'wallet_grantAdmin',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const parameters = request.params?.[0] ?? {}

  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, request)
    },
  })

  // Don't render until we have the required data
  if (!parameters.key || !parameters.chainId) return null

  return (
    <div>
      <GrantAdmin
        authorizeKey={parameters.key}
        chainId={Hex.toNumber(parameters.chainId)}
        feeToken={parameters.capabilities?.feeToken}
        loading={respond.isPending}
        onApprove={() => respond.mutate()}
        onReject={() => Actions.reject(porto, request)}
      />
    </div>
  )
}

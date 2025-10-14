import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as Provider from 'ox/Provider'
import { Actions } from 'porto/remote'

import { porto } from '~/lib/Porto'
import { useAuthSessionRedirect } from '~/lib/ReactNative'
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
  const parameters = request.params?.[0] ?? {}

  const respond = useMutation({
    async mutationFn({ reject }: { reject?: boolean } = {}) {
      if (reject) {
        await Actions.reject(porto, request)
        throw new Provider.UserRejectedRequestError()
      }
      return Actions.respond(porto, request)
    },
  })

  useAuthSessionRedirect(respond)

  // Don't render until we have the required data
  if (!parameters.id) return null

  return (
    <RevokeAdmin
      feeToken={parameters.capabilities?.feeToken}
      loading={respond.isPending}
      onApprove={() => respond.mutate({})}
      onReject={() => respond.mutate({ reject: true })}
      revokeKeyId={parameters.id}
    />
  )
}

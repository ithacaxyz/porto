import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as Provider from 'ox/Provider'
import { Actions } from 'porto/remote'

import { porto } from '~/lib/Porto'
import { useAuthSessionRedirect } from '~/lib/ReactNative'
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
  const parameters = request.params[0]
  const decoded = request._decoded.params[0]

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

  return (
    <div>
      <GrantAdmin
        authorizeKey={parameters.key}
        chainId={decoded.chainId}
        feeToken={parameters.capabilities?.feeToken}
        loading={respond.isPending}
        onApprove={() => respond.mutate({})}
        onReject={() => respond.mutate({ reject: true })}
      />
    </div>
  )
}

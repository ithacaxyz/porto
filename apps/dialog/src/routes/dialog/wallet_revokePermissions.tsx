import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Key } from 'porto'
import { Actions, Hooks } from 'porto/remote'

import { CheckBalance } from '~/components/CheckBalance'
import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import * as RpcServer from '~/lib/RpcServer'
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

  const { data } = Hooks.usePermissions()
  const permissions = data?.find((x) => x.id === parameters.id)?.permissions
  const revokeKey = permissions?.keys?.find((key) => key.id === parameters.id)

  const prepareCallsQuery = RpcServer.usePrepareCalls({
    enabled: !!revokeKey,
    feeToken: parameters.capabilities?.feeToken,
    revokeKeys: revokeKey ? [Key.from(revokeKey)] : [],
  })

  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, request)
    },
  })

  return (
    <CheckBalance
      address={parameters.address}
      feeToken={parameters.capabilities?.feeToken}
      onReject={() => Actions.reject(porto, request)}
      query={prepareCallsQuery}
    >
      <RevokePermissions
        {...parameters}
        loading={respond.isPending}
        onApprove={() => respond.mutate()}
        onReject={() => Actions.reject(porto, request)}
      />
    </CheckBalance>
  )
}

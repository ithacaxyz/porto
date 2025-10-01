import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'
import { porto } from '~/lib/Porto'
import { useAuthSessionRedirect } from '~/lib/ReactNative'
import * as Router from '~/lib/Router'
import { AddFunds } from '../-components/AddFunds'

export const Route = createFileRoute('/dialog/wallet_addFunds')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'wallet_addFunds',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const { address, chainId } =
    request._decoded.method === 'wallet_addFunds'
      ? request._decoded.params[0]
      : {}

  const respond = useMutation({
    mutationFn(result: Parameters<AddFunds.Props['onApprove']>[0]) {
      return Actions.respond(porto, request, { result })
    },
  })

  useAuthSessionRedirect(respond)

  return (
    <AddFunds
      address={address}
      chainId={chainId}
      onApprove={(result) => respond.mutate(result)}
      onReject={() => Actions.reject(porto, request)}
    />
  )
}

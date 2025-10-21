import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as Provider from 'ox/Provider'
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
  const { address, chainId, value } =
    request._decoded.method === 'wallet_addFunds'
      ? request._decoded.params[0]
      : {}

  const respond = useMutation({
    async mutationFn(
      result: Parameters<AddFunds.Props['onApprove']>[0] | { reject: true },
    ) {
      // Handle rejection through mutation to support React Native redirect
      if ('reject' in result && result.reject) {
        await Actions.reject(porto, request)
        throw new Provider.UserRejectedRequestError()
      }
      return Actions.respond(porto, request, { result })
    },
  })

  useAuthSessionRedirect(respond)

  return (
    <AddFunds
      address={address}
      chainId={chainId}
      onApprove={(result) => respond.mutate(result)}
      onReject={() => respond.mutate({ reject: true })}
      value={value}
    />
  )
}

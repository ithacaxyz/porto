import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'
import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { AddFunds } from '../-components/AddFunds'

export const Route = createFileRoute('/dialog/experimental_addFunds')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'experimental_addFunds',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const { address, token, value } = request._decoded.params[0]

  return (
    <AddFunds
      address={address}
      onApprove={(result) => Actions.respond(porto, request!, { result })}
      onReject={() => Actions.reject(porto, request)}
      tokenAddress={token}
      value={value}
    />
  )
}

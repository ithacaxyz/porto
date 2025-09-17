import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'
import { porto } from '~/lib/Porto'
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
  const { address, chainId, token, value } = request._decoded.params[0]

  return (
    <AddFunds
      address={address}
      assetDeficits={
        token && [
          {
            address: token,
            deficit: 0n,
            required: 0n,
          },
        ]
      }
      chainId={chainId}
      onApprove={(result) => Actions.respond(porto, request!, { result })}
      onReject={() => Actions.reject(porto, request)}
      value={value}
    />
  )
}

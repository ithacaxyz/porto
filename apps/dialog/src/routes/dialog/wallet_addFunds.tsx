import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'
import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { AddFunds } from '../-components/AddFunds'

export const Route = createFileRoute('/dialog/wallet_addFunds')({
  component: RouteComponent,
  head: (_ctx) => ({
    scripts: [{ src: 'https://widget.mercuryo.io/embed.2.1.js' }],
  }),
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'wallet_addFunds',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  // @ts-expect-error - TODO: fix this
  const { address, token, value } = request._decoded.params[0]

  return (
    <AddFunds
      address={address}
      // @ts-expect-error - TODO: fix this
      onApprove={(result) => Actions.respond(porto, request!, { result })}
      // @ts-expect-error - TODO: fix this
      onReject={() => Actions.reject(porto, request)}
      tokenAddress={token}
      value={value}
    />
  )
}

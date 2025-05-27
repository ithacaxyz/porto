import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'

import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { UpdateAccount } from '../-components/UpdateAccount'

export const Route = createFileRoute('/dialog/wallet_updateAccount')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'wallet_updateAccount',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  return (
    <UpdateAccount
      onCancel={() => Actions.reject(porto, request)}
      onSuccess={(data) =>
        Actions.respond(porto, request, {
          result: { id: data.id },
        })
      }
    />
  )
}

import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'

import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { GrantAdmin } from '../-components/GrantAdmin'

export const Route = createFileRoute('/dialog/experimental_grantAdmin')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'experimental_grantAdmin',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const parameters = request.params[0]

  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, request)
    },
  })

  return (
    <div>
      <GrantAdmin
        authorizeKey={parameters.key}
        loading={respond.isPending}
        onApprove={() => respond.mutate()}
        onReject={() => Actions.reject(porto, request)}
      />
    </div>
  )
}

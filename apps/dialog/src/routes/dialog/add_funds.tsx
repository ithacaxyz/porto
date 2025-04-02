import { Porto } from '@porto/apps'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'

import * as Router from '~/lib/Router'
import { AddFunds } from '../-components/AddFunds'

const porto = Porto.porto

export const Route = createFileRoute('/dialog/add_funds')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, { method: 'add_funds' })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const parameters = request.params?.[0]

  const respond = useMutation({
    async mutationFn() {
      const result = await Actions.respond(porto, request!)
      return result
    },
  })

  return (
    <AddFunds
      {...parameters}
      loading={respond.isPending}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, request)}
    />
  )
}

import { Porto } from '@porto/apps'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'
import * as React from 'react'

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

  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, request!)
    },
  })

  React.useEffect(() => {
    console.info(respond.data)
  }, [respond.data])

  return <AddFunds />
}

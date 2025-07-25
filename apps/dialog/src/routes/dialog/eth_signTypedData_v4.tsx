import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'

import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { SignTypedData } from '../-components/SignTypedData'

export const Route = createFileRoute('/dialog/eth_signTypedData_v4')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'eth_signTypedData_v4',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const [address, typedDataString] = request.params

  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, request)
    },
  })

  return (
    <SignTypedData
      address={address}
      loading={respond.isPending}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, request)}
      typedDataString={typedDataString}
    />
  )
}

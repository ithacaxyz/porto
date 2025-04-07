import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'
import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { ActionRequest } from '../-components/ActionRequest'

export const Route = createFileRoute('/dialog/eth_sendTransaction')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'eth_sendTransaction',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const { chainId, data, from, to, value } = request._decoded.params[0]

  const calls = [{ data, to: to!, value }] as const

  const respond = useMutation({
    mutationFn() {
      // TODO: sign quote.
      return Actions.respond(porto, request)
    },
  })

  return (
    <ActionRequest
      address={from}
      calls={calls}
      chainId={chainId}
      loading={respond.isPending}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, request)}
      request={request}
    />
  )
}

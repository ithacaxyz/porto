import { Porto } from '@porto/apps'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'

import * as Router from '~/lib/Router'
import { ActionRequest } from '../-components/ActionRequest'

const porto = Porto.porto

export const Route = createFileRoute('/dialog/wallet_sendCalls')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, { method: 'wallet_sendCalls' })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const { calls, chainId } = request._decoded.params[0] ?? {}

  const respond = useMutation({
    mutationFn() {
      // TODO: sign quote.
      return Actions.respond(porto, request!)
    },
  })

  return (
    <ActionRequest
      calls={calls}
      chainId={chainId}
      loading={respond.isPending}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, request!)}
      request={request}
    />
  )
}

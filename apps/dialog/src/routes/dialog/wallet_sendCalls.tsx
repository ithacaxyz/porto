import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'

import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { ActionRequest } from '../-components/ActionRequest'

export const Route = createFileRoute('/dialog/wallet_sendCalls')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, { method: 'wallet_sendCalls' })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const { capabilities, calls, chainId, from } =
    request._decoded.params[0] ?? {}

  const { feeToken, merchantRpcUrl } = capabilities ?? {}

  const respond = useMutation({
    mutationFn() {
      // TODO: sign quote.
      return Actions.respond(porto, request!)
    },
  })

  return (
    <ActionRequest
      address={from}
      calls={calls}
      chainId={chainId}
      feeToken={feeToken}
      loading={respond.isPending}
      merchantRpcUrl={merchantRpcUrl}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, request!)}
    />
  )
}

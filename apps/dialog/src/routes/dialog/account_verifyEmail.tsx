import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'

import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { VerifyEmail } from '../-components/VerifyEmail'

export const Route = createFileRoute('/dialog/account_verifyEmail')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'account_verifyEmail',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const [{ email, walletAddress }] = request.params

  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, request)
    },
  })

  return (
    <VerifyEmail
      address={walletAddress}
      email={email}
      loading={respond.isPending}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, request)}
    />
  )
}

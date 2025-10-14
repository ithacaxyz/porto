import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as Provider from 'ox/Provider'
import { Actions } from 'porto/remote'

import { porto } from '~/lib/Porto'
import { useAuthSessionRedirect } from '~/lib/ReactNative'
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
    async mutationFn({ reject }: { reject?: boolean }) {
      if (reject) {
        await Actions.reject(porto, request)
        throw new Provider.UserRejectedRequestError()
      }
      return Actions.respond(porto, request)
    },
  })

  useAuthSessionRedirect(respond)

  return (
    <VerifyEmail
      address={walletAddress}
      email={email}
      loading={respond.isPending}
      onApprove={() => respond.mutate({})}
      onReject={() => respond.mutate({ reject: true })}
    />
  )
}

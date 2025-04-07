import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions, Hooks } from 'porto/remote'
import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { SignUp } from '../-components/SignUp'

export const Route = createFileRoute('/dialog/experimental_createAccount')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'experimental_createAccount',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const address = Hooks.usePortoStore(
    porto,
    (state) => state.accounts[0]?.address,
  )

  const respond = useMutation({
    mutationFn() {
      if (!request) throw new Error('no request found.')
      return Actions.respond(porto, request)
    },
  })

  return (
    <SignUp
      enableSignIn={!address}
      loading={respond.isPending}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, request)}
    />
  )
}

import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Hex, Siwe } from 'ox'
import { Actions } from 'porto/remote'
import { useMemo } from 'react'

import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { SignMessage } from '../-components/SignMessage'

export const Route = createFileRoute('/dialog/personal_sign')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'personal_sign',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const [hex, address] = request.params

  const message = useMemo(() => Hex.toString(hex), [hex])
  const siwe = useMemo(() => Siwe.parseMessage(message), [message])

  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, request)
    },
  })

  if (Object.keys(siwe).length > 0)
    return (
      <SignMessage.Siwe
        address={address}
        loading={respond.isPending}
        onApprove={() => respond.mutate()}
        onReject={() => Actions.reject(porto, request)}
      />
    )
  return (
    <SignMessage
      address={address}
      loading={respond.isPending}
      message={message}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, request)}
    />
  )
}

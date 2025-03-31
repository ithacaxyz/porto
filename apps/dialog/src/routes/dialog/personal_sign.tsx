import { Porto } from '@porto/apps'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Hex, Siwe } from 'ox'
import { Actions } from 'porto/remote'
import { useMemo } from 'react'

import type * as Router from '~/lib/Router'
import { SignMessage } from '../-components/SignMessage'

const porto = Porto.porto

export const Route = createFileRoute('/dialog/personal_sign')({
  component: RouteComponent,
  validateSearch(search): Router.RpcRequestToSearch<'personal_sign'> {
    return search as never
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const hex = request.params[0]

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
        loading={respond.isPending}
        onApprove={() => respond.mutate()}
        onReject={() => Actions.reject(porto, request)}
      />
    )
  return (
    <SignMessage
      message={message}
      loading={respond.isPending}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, request)}
    />
  )
}

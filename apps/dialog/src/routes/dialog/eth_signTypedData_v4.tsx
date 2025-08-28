import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'
import * as React from 'react'

import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import * as TypedMessages from '~/lib/TypedMessages'
import {
  SignPermit,
  SignTypedMessage,
  SignTypedMessageInvalid,
} from '../-components/SignTypedMessage'

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
  const [_address, data] = request.params

  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, request)
    },
  })

  const handleSign = () => respond.mutate()
  const handleReject = () => Actions.reject(porto, request)

  const parsedData = React.useMemo(() => {
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }, [data])

  if (TypedMessages.isPermit(parsedData))
    return (
      <SignPermit
        data={parsedData}
        isPending={respond.isPending}
        onReject={handleReject}
        onSign={handleSign}
      />
    )

  if (TypedMessages.isTypedMessage(parsedData))
    return (
      <SignTypedMessage
        data={parsedData}
        isPending={respond.isPending}
        onReject={handleReject}
        onSign={handleSign}
      />
    )

  return (
    <SignTypedMessageInvalid
      data={data}
      isPending={respond.isPending}
      onReject={handleReject}
      onSign={handleSign}
    />
  )
}

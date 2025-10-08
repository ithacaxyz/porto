import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as Provider from 'ox/Provider'
import { Actions } from 'porto/remote'
import * as React from 'react'

import { porto } from '~/lib/Porto'
import { useAuthSessionRedirect } from '~/lib/ReactNative'
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
    async mutationFn({ reject }: { reject?: boolean } = {}) {
      if (reject) {
        await Actions.reject(porto, request)
        throw new Provider.UserRejectedRequestError()
      }
      return Actions.respond(porto, request)
    },
  })

  useAuthSessionRedirect(respond)

  const handleSign = () => respond.mutate({})
  const handleReject = () => respond.mutate({ reject: true })

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
        amount={BigInt(parsedData.message.value)}
        approving={respond.isPending}
        chainId={Number(parsedData.domain.chainId)}
        deadline={Number(parsedData.message.deadline)}
        onReject={handleReject}
        onSign={handleSign}
        permitType="erc-2612"
        spender={parsedData.message.spender}
        tokenContract={parsedData.domain.verifyingContract}
      />
    )

  if (TypedMessages.isPermit2(parsedData))
    return (
      <SignPermit
        amount={BigInt(parsedData.message.details.amount)}
        approving={respond.isPending}
        chainId={Number(parsedData.domain.chainId)}
        deadline={Number(parsedData.message.details.expiration)}
        onReject={handleReject}
        onSign={handleSign}
        permitType="permit2"
        spender={parsedData.message.spender}
        tokenContract={parsedData.message.details.token}
      />
    )

  if (TypedMessages.isTypedMessage(parsedData))
    return (
      <SignTypedMessage
        approving={respond.isPending}
        data={parsedData}
        onReject={handleReject}
        onSign={handleSign}
      />
    )

  return (
    <SignTypedMessageInvalid
      approving={respond.isPending}
      data={data}
      onReject={handleReject}
      onSign={handleSign}
    />
  )
}

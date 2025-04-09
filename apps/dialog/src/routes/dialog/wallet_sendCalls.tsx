import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Address } from 'ox'
import { Actions } from 'porto/remote'
import * as React from 'react'

import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { ActionRequest } from '../-components/ActionRequest'
import { AddFunds } from '../-components/AddFunds'

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

  const feeToken = capabilities?.feeToken

  const [screen, setScreen] = React.useState<
    | {
        props: {
          tokenAddress: Address.Address
        }
        type: 'add-funds'
      }
    | {
        props?:
          | {
              checkBalances?: boolean | undefined
            }
          | undefined
        type: 'default'
      }
  >({
    type: 'default',
  })

  const respond = useMutation({
    mutationFn() {
      // TODO: sign quote.
      return Actions.respond(porto, request!)
    },
  })

  if (screen.type === 'add-funds')
    return (
      <AddFunds
        {...screen.props}
        address={from}
        onApprove={() =>
          setScreen({ props: { checkBalances: false }, type: 'default' })
        }
        onReject={() => Actions.reject(porto, request!)}
      />
    )
  return (
    <ActionRequest
      {...screen.props}
      address={from}
      calls={calls}
      chainId={chainId}
      feeToken={feeToken}
      loading={respond.isPending}
      onAddFunds={({ token }) => {
        setScreen({
          props: { tokenAddress: token },
          type: 'add-funds',
        })
      }}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, request!)}
      request={request}
    />
  )
}

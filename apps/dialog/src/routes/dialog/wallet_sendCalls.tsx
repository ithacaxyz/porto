import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Signature } from 'ox'
import { Actions, Hooks } from 'porto/remote'

import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import * as RpcServer from '~/lib/RpcServer'
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

  const account = Hooks.useAccount(porto, { address: from })

  const prepareCallsQuery = RpcServer.usePrepareCalls({
    address: from,
    calls,
    chainId,
    feeToken,
    merchantRpcUrl,
    authorizeKeys: [],
    revokeKeys: [],
  })

  const respond = useMutation({
    async mutationFn() {
      if (!account) throw new Error('Account not found')
      if (!prepareCallsQuery.data) throw new Error('Prepare calls data not available')

      const { digest, capabilities } = prepareCallsQuery.data
      const { quote } = capabilities

      if (!quote) {
        // If no quote available, respond without signing
        return Actions.respond(porto, request!)
      }

      // Sign the digest
      const signature = await account.sign({ hash: digest })
      const parsedSignature = Signature.from(signature)

      // Create signed quote by adding signature fields
      const signedQuote = {
        ...quote,
        hash: digest,
        r: parsedSignature.r,
        s: parsedSignature.s,
        yParity: parsedSignature.yParity,
      }

      // Respond with signed quote
      return Actions.respond(porto, request!, {
        result: {
          quote: signedQuote,
        },
      })
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

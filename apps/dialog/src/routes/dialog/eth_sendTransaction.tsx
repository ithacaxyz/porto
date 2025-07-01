import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Signature } from 'ox'
import { Actions, Hooks } from 'porto/remote'
import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import * as RpcServer from '~/lib/RpcServer'
import { ActionRequest } from '../-components/ActionRequest'

export const Route = createFileRoute('/dialog/eth_sendTransaction')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'eth_sendTransaction',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const { chainId, data, from, to, value } = request._decoded.params[0]

  const calls = [{ data, to: to!, value }] as const

  const account = Hooks.useAccount(porto, { address: from })

  const prepareCallsQuery = RpcServer.usePrepareCalls({
    address: from,
    calls,
    chainId,
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
        return Actions.respond(porto, request)
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
      return Actions.respond(porto, request, {
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
      loading={respond.isPending}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, request)}
    />
  )
}

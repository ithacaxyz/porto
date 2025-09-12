import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Provider, RpcResponse } from 'ox'
import { Actions, Hooks } from 'porto/remote'
import { RelayActions } from 'porto/viem'
import { waitForCallsStatus } from 'viem/actions'
import type * as Calls from '~/lib/Calls'
import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
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
  const capabilities = request.params[0].capabilities
  const { chainId, data, from, to, value } = request._decoded.params[0]

  const calls = [{ data, to: to!, value }] as const
  const { feeToken, merchantUrl } = capabilities ?? {}

  const account = Hooks.useAccount(porto, { address: from })
  const client = Hooks.useRelayClient(porto, { chainId })

  const respond = useMutation({
    // TODO: use EIP-1193 Provider + `wallet_sendPreparedCalls` in the future
    // to dedupe.
    async mutationFn(data: Calls.prepareCalls.useQuery.Data) {
      const { capabilities, context, key } = data

      if (!account) throw new Error('account not found.')
      if (!key) throw new Error('key not found.')

      const signature = await RelayActions.signCalls(data, {
        account,
      })

      const { id } = await RelayActions.sendPreparedCalls(client, {
        capabilities: capabilities.feeSignature
          ? {
              feeSignature: capabilities.feeSignature,
            }
          : undefined,
        context,
        key,
        signature,
      })

      const { receipts } = await waitForCallsStatus(client, {
        id,
      })
      const hash = receipts?.[0]?.transactionHash

      if (!hash) {
        const error =
          status === 'success'
            ? new Provider.UnknownBundleIdError({
                message: 'Call bundle with id: ' + id + ' not found.',
              })
            : new RpcResponse.TransactionRejectedError({
                message: 'Transaction failed under call bundle id: ' + id + '.',
              })
        return Actions.respond(porto, request, {
          error,
        })
      }
      return Actions.respond(porto, request!, {
        result: hash,
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
      merchantUrl={merchantUrl}
      onApprove={(data) => respond.mutate(data)}
      onReject={() => Actions.reject(porto, request)}
    />
  )
}

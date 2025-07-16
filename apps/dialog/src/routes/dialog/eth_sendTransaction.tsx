import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Provider } from 'ox'
import { Account, Key } from 'porto'
import { Actions, Hooks } from 'porto/remote'
import { ServerActions } from 'porto/viem'
import { waitForCallsStatus } from 'viem/actions'
import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import type * as RpcServer from '~/lib/RpcServer'
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
  const client = Hooks.useServerClient(porto, { chainId })

  const respond = useMutation({
    async mutationFn(data: RpcServer.prepareCalls.useQuery.Data) {
      if (!account) throw new Error('account not found.')

      const key = Account.getKey(account, { role: 'admin' })
      if (!key) throw new Error('admin key not found.')

      const { capabilities, context, digest } = data

      const signature = await Key.sign(key, {
        payload: digest,
        wrap: false,
      })

      const { id } = await ServerActions.sendPreparedCalls(client, {
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

      if (!hash)
        return Actions.respond(porto, request, {
          error: new Provider.UnknownBundleIdError(),
        })
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
      loading={respond.isPending}
      onApprove={(data) => respond.mutate(data)}
      onReject={() => Actions.reject(porto, request)}
    />
  )
}

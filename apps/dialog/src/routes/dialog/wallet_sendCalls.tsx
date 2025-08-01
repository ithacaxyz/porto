import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Account, Key } from 'porto'
import { Actions, Hooks } from 'porto/remote'
import { ServerActions } from 'porto/viem'
import type * as Calls from '~/lib/Calls'
import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
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
  const client = Hooks.useServerClient(porto, { chainId })

  const respond = useMutation({
    // TODO: use EIP-1193 Provider + `wallet_sendPreparedCalls` in the future
    // to dedupe.
    async mutationFn(data: Calls.prepareCalls.useQuery.Data) {
      if (!account) throw new Error('account not found.')

      const key = Account.getKey(account, { role: 'admin' })
      if (!key) throw new Error('admin key not found.')

      const { capabilities, context, digest } = data

      const signature = await Key.sign(key, {
        payload: digest,
        wrap: false,
      })

      const result = await ServerActions.sendPreparedCalls(client, {
        capabilities: capabilities.feeSignature
          ? {
              feeSignature: capabilities.feeSignature,
            }
          : undefined,
        context,
        key,
        signature,
      })

      return Actions.respond(porto, request!, {
        result,
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
      onApprove={(data) => respond.mutate(data)}
      onReject={() => Actions.reject(porto, request!)}
    />
  )
}

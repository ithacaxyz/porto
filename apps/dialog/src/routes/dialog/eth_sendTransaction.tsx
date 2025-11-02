import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Provider, RpcResponse } from 'ox'
import { Actions, Hooks } from 'porto/remote'
import { RelayActions } from 'porto/viem'
import { waitForCallsStatus } from 'viem/actions'
import type * as Calls from '~/lib/Calls'
import { useGuestMode } from '~/lib/guestMode'
import { porto } from '~/lib/Porto'
import { useAuthSessionRedirect } from '~/lib/ReactNative'
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
  const { capabilities, chainId, data, to, value } = request._decoded.params[0]

  const calls = [{ data, to: to!, value }] as const
  const { feeToken, merchantUrl } = capabilities ?? {}

  const currentAccount = Hooks.useAccount(porto)
  const client = Hooks.useRelayClient(porto, { chainId })

  const { guestModeAccount, guestStatus, onSignIn, onSignUp } =
    useGuestMode(currentAccount)

  const account = currentAccount ?? guestModeAccount

  const preview = account
    ? { account, address: account.address, guest: false }
    : undefined

  const respond = useMutation({
    // TODO: use EIP-1193 Provider + `wallet_sendPreparedCalls` in the future
    // to dedupe.
    async mutationFn(
      data: Calls.prepareCalls.useQuery.Data | { reject: true },
    ) {
      // Handle rejection through mutation to support React Native redirect
      if ('reject' in data && data.reject) {
        await Actions.reject(porto, request)
        throw new Provider.UserRejectedRequestError()
      }

      const { capabilities, context, key } =
        data as Calls.prepareCalls.useQuery.Data

      if (!account) throw new Error('account not found.')
      if (!key) throw new Error('key not found.')

      const signature = await RelayActions.signCalls(
        data as Calls.prepareCalls.useQuery.Data,
        {
          account,
        },
      )

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

  useAuthSessionRedirect(respond)

  return (
    <ActionRequest
      address={preview?.address}
      calls={calls}
      chainId={chainId}
      feeToken={feeToken}
      guestMode={preview?.guest}
      guestStatus={guestStatus}
      loading={respond.isPending}
      merchantUrl={merchantUrl}
      onApprove={(data) => respond.mutate(data)}
      onGuestSignIn={onSignIn}
      onGuestSignUp={onSignUp}
      onReject={() => respond.mutate({ reject: true })}
    />
  )
}

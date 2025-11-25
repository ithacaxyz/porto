import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as Provider from 'ox/Provider'
import { Actions, Hooks } from 'porto/remote'
import { RelayActions } from 'porto/viem'
import * as React from 'react'
import type * as Calls from '~/lib/Calls'
import { useGuestMode } from '~/lib/guestMode'
import { porto } from '~/lib/Porto'
import { useAuthSessionRedirect } from '~/lib/ReactNative'
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
  const { capabilities, calls, chainId } = request._decoded.params[0] ?? {}

  const { feeToken, merchantUrl, requiredFunds } = capabilities ?? {}

  const currentAccount = Hooks.useAccount(porto)
  const client = Hooks.useRelayClient(porto, { chainId })

  const { guestModeAccount, guestStatus, onSignIn, onSignUp } =
    useGuestMode(currentAccount)

  const account = currentAccount ?? guestModeAccount

  const preview = React.useMemo(() => {
    if (account) return { account, address: account.address, guest: false }
    return undefined
  }, [account])

  const respond = useMutation({
    // TODO: use EIP-1193 Provider + `wallet_sendPreparedCalls` in the future
    // to dedupe.
    async mutationFn(
      data: Calls.prepareCalls.useQuery.Data | { reject: true },
    ) {
      // Handle rejection through mutation to support React Native redirect
      if ('reject' in data && data.reject) {
        await Actions.reject(porto, request!)
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

      const result = await RelayActions.sendPreparedCalls(client, {
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
      requiredFunds={requiredFunds}
    />
  )
}

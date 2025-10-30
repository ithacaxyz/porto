import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Provider, RpcResponse } from 'ox'
import type * as Messenger from 'porto/core/Messenger'
import { Actions, Hooks } from 'porto/remote'
import { type Account, RelayActions } from 'porto/viem'
import * as React from 'react'
import { waitForCallsStatus } from 'viem/actions'
import type * as Calls from '~/lib/Calls'
import * as Dialog from '~/lib/Dialog'
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
  const capabilities = request.params[0].capabilities
  const { chainId, data, from, to, value } = request._decoded.params[0]

  const calls = [{ data, to: to!, value }] as const
  const { feeToken, merchantUrl } = capabilities ?? {}

  const currentAccount = Hooks.useAccount(porto, { address: from })
  const client = Hooks.useRelayClient(porto, { chainId })

  const [authenticatedAccount, setAuthenticatedAccount] =
    React.useState<Account.Account>()
  const [guestStatus, setGuestStatus] = React.useState<
    'disabled' | 'enabled' | 'signing-in' | 'signing-up'
  >('disabled')

  const handleGuestSignIn = React.useCallback(async () => {
    setGuestStatus('signing-in')
    try {
      const response = await porto.provider.request({
        method: 'wallet_connect',
        params: [{}],
      })
      const newAccount = response.accounts?.[0]
      const [portoAccount] = porto._internal.store.getState().accounts
      if (newAccount && portoAccount) {
        setAuthenticatedAccount(portoAccount)
        porto.messenger.send('account', {
          account: newAccount as Messenger.Payload<'account'>['account'],
        })
        setGuestStatus('disabled')
      }
    } catch (error) {
      if (Dialog.handleWebAuthnIframeError(error)) return
      setGuestStatus('enabled')
    }
  }, [])

  const handleGuestSignUp = React.useCallback(async (email?: string) => {
    setGuestStatus('signing-up')
    try {
      const response = await porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: {
              createAccount: email ? { label: email } : true,
              email: Boolean(email),
            },
          },
        ],
      })
      const newAccount = response.accounts?.[0]
      const [portoAccount] = porto._internal.store.getState().accounts
      if (newAccount && portoAccount) {
        setAuthenticatedAccount(portoAccount)
        porto.messenger.send('account', {
          account: newAccount as Messenger.Payload<'account'>['account'],
        })
        setGuestStatus('disabled')
      }
    } catch (error) {
      if (Dialog.handleWebAuthnIframeError(error)) return
      setGuestStatus('enabled')
    }
  }, [])

  const account = from ? currentAccount : authenticatedAccount

  const preview = account
    ? { account, address: account.address, guest: false }
    : undefined

  React.useEffect(() => {
    if (!from && !authenticatedAccount) {
      setGuestStatus('enabled')
    }
  }, [from, authenticatedAccount])

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
      onGuestSignIn={handleGuestSignIn}
      onGuestSignUp={handleGuestSignUp}
      onReject={() => respond.mutate({ reject: true })}
    />
  )
}

import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Hex, Secp256k1 } from 'ox'
import * as Provider from 'ox/Provider'
import { preGeneratedAccounts } from 'porto/core/internal/modes/relay'
import { Actions, Hooks } from 'porto/remote'
import { Account, RelayActions } from 'porto/viem'
import * as React from 'react'
import type * as Calls from '~/lib/Calls'
import * as Dialog from '~/lib/Dialog'
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
  const { capabilities, calls, chainId, from } =
    request._decoded.params[0] ?? {}

  const { feeToken, merchantUrl, requiredFunds } = capabilities ?? {}

  const currentAccount = Hooks.useAccount(porto, { address: from })
  const client = Hooks.useRelayClient(porto, { chainId })

  const [authenticatedAccount, setAuthenticatedAccount] =
    React.useState<Account.Account>()
  const [guestStatus, setGuestStatus] = React.useState<
    'disabled' | 'enabled' | 'signing-in' | 'signing-up'
  >('disabled')

  const [preGeneratedAccount] =
    React.useState<Account.Account<'privateKey'> | null>(() =>
      from ? null : Account.fromPrivateKey(Secp256k1.randomPrivateKey()),
    )

  const handleGuestSignIn = React.useCallback(async () => {
    setGuestStatus('signing-in')
    try {
      if (preGeneratedAccount)
        preGeneratedAccounts.setAccount(request.id, preGeneratedAccount)

      const response = await porto.provider.request({
        method: 'wallet_connect',
        params: [{}],
      })
      const newAccount = response.accounts?.[0]
      if (newAccount) {
        const portoAccount = porto._internal.store.getState().accounts[0]
        if (portoAccount) {
          setAuthenticatedAccount(portoAccount)
          setGuestStatus('disabled')

          if (chainId)
            porto.provider.request({
              method: 'wallet_sendCalls',
              params: [
                {
                  calls: calls.map((call) => ({
                    ...call,
                    value: call.value ? Hex.fromNumber(call.value) : undefined,
                  })),
                  capabilities: capabilities as any,
                  chainId: Hex.fromNumber(chainId),
                  from: portoAccount.address,
                },
              ],
            })
        }
      }
    } catch (error) {
      if (Dialog.handleWebAuthnIframeError(error)) return
      setGuestStatus('enabled')
    }
  }, [preGeneratedAccount, request.id, calls, capabilities, chainId])

  const handleGuestSignUp = React.useCallback(
    async (email?: string) => {
      setGuestStatus('signing-up')
      try {
        // Store pre-generated EOA for account creation
        if (preGeneratedAccount)
          preGeneratedAccounts.setAccount(request.id, preGeneratedAccount)

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
        if (newAccount) {
          const portoAccount = porto._internal.store.getState().accounts[0]
          if (portoAccount) {
            setAuthenticatedAccount(portoAccount)
            setGuestStatus('disabled')

            if (chainId)
              porto.provider.request({
                method: 'wallet_sendCalls',
                params: [
                  {
                    calls: calls.map((call) => ({
                      ...call,
                      value: call.value
                        ? Hex.fromNumber(call.value)
                        : undefined,
                    })),
                    capabilities: capabilities as any,
                    chainId: Hex.fromNumber(chainId),
                    from: portoAccount.address,
                  },
                ],
              })
          }
        }
      } catch (error) {
        if (Dialog.handleWebAuthnIframeError(error)) return
        setGuestStatus('enabled')
      }
    },
    [preGeneratedAccount, request.id, calls, capabilities, chainId],
  )

  const account = from ? currentAccount : authenticatedAccount

  const preview = React.useMemo(() => {
    if (account) return { account, address: account.address, guest: false }
    if (preGeneratedAccount)
      return {
        account: preGeneratedAccount,
        address: preGeneratedAccount.address,
        guest: true,
      }
    return undefined
  }, [account, preGeneratedAccount])

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
      onGuestSignIn={handleGuestSignIn}
      onGuestSignUp={handleGuestSignUp}
      onReject={() => respond.mutate({ reject: true })}
      requiredFunds={requiredFunds}
    />
  )
}

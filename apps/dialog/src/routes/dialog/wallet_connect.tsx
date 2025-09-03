import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as Provider from 'ox/Provider'
import { Actions, Hooks } from 'porto/remote'
import * as React from 'react'

import * as Dialog from '~/lib/Dialog'
import * as PermissionsRequest from '~/lib/PermissionsRequest'
import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { Email } from '../-components/Email'
import { SignIn } from '../-components/SignIn'
import { SignUp } from '../-components/SignUp'

export const Route = createFileRoute('/dialog/wallet_connect')({
  component: RouteComponent,
  validateSearch: (search) => {
    const request = Router.parseSearchRequest(search, {
      method: 'wallet_connect',
    })
    return request
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const { params = [] } = request
  const { capabilities } = params[0] ?? {}

  const address = Hooks.usePortoStore(
    porto,
    (state) => state.accounts[0]?.address,
  )
  const referrerURL = Dialog.useStore((state) => state.referrer?.url)

  const actions = React.useMemo<readonly ('sign-in' | 'sign-up')[]>(() => {
    if (capabilities?.createAccount) return ['sign-up']
    if (address) return ['sign-in']
    return ['sign-in', 'sign-up']
  }, [capabilities?.createAccount, address])

  const grantPermissionsQuery = PermissionsRequest.useResolve(
    capabilities?.grantPermissions,
  )
  const grantPermissions = grantPermissionsQuery.data

  const respond = useMutation({
    async mutationFn({
      email,
      signIn,
      selectAccount,
    }: {
      email?: string
      signIn?: boolean
      selectAccount?: boolean
    }) {
      if (!request) throw new Error('no request found.')
      if (request.method !== 'wallet_connect')
        throw new Error('request is not a wallet_connect request.')

      const params = request.params ?? []

      const relayUrl = new URLSearchParams(window.location.search).get(
        'relayUrl',
      )
      const capabilities = params[0]?.capabilities
      const grantAdmins = capabilities?.grantAdmins

      // If any admins need to be authorized, we need to check the
      // authority & validity of the request.
      if (grantAdmins && grantAdmins.length > 0) {
        // If the request did not come from a local relay (CLI), do
        // not allow.
        if (!relayUrl || new URL(relayUrl).hostname !== 'localhost')
          return Actions.respond(porto, request, {
            error: new Provider.UnauthorizedError(),
          }).catch(() => { })

        // If the keys are not trusted by the relay, do not allow.
        const publicKeys = grantAdmins.map((admin) => admin.publicKey)
        const isValid = await verifyKeys(relayUrl, publicKeys)
        if (!isValid)
          return Actions.respond(porto, request, {
            error: new Provider.UnauthorizedError(),
          }).catch(() => { })
      }

      let response
      try {
        response = await Actions.respond(
          porto,
          {
            ...request,
            params: [
              {
                ...params[0],
                capabilities: {
                  ...capabilities,
                  createAccount: email
                    ? {
                      ...(typeof capabilities?.createAccount === 'object'
                        ? capabilities?.createAccount
                        : {}),
                      label: email,
                    }
                    : capabilities?.createAccount || !signIn,
                  email: Boolean(email),
                  grantPermissions: grantPermissions?._encoded,
                  selectAccount,
                  ...(capabilities?.signInWithEthereum && {
                    signInWithEthereum: {
                      ...capabilities?.signInWithEthereum,
                      domain:
                        capabilities?.signInWithEthereum.domain ??
                        referrerURL?.hostname,
                      uri:
                        capabilities?.signInWithEthereum.uri ?? referrerURL?.href,
                    },
                  }),
                },
              },
            ],
          },
          {
            onError: (e) => {
              // This detects an error that can sometimes happen when calling
              // navigator.credentials.create() from inside an iframe, notably
              // the Firefox + Bitwarden extension combination.
              // See https://github.com/bitwarden/clients/issues/12590
              if (
                e?.message?.includes("Invalid 'sameOriginWithAncestors' value")
              ) {
                Dialog.store.setState({
                  error: {
                    action: 'retry-in-popup',
                    message:
                      'Your browser doesn\'t support passkey creation in the current context.',
                    name: 'CREDENTIAL_CREATION_FAILED',
                    secondaryMessage:
                      'Please try again in a popup window for better compatibility.',
                    title: 'Passkey creation not supported',
                  },
                })
                // Prevent the response from being sent,
                // since the error is handled by the dialog.
                return { cancelResponse: true }
              }

              // For SIWE endpoint errors, we need to send them back to the provider
              // so they can be displayed on the login form
              let errorMessage = e?.message || 'Authentication failed'

              // Extract error details from SIWE endpoint errors
              if (e?.name === 'SiweEndpointError') {
                const siweError = e as any
                if (siweError.response?.errors && siweError.response.errors.length > 0) {
                  errorMessage = siweError.response.errors[0].message || errorMessage
                }
              } else if (e?.name === 'RpcResponse.InternalError' && e?.cause?.name === 'SiweEndpointError') {
                const siweError = e.cause as any
                if (siweError.response?.errors && siweError.response.errors.length > 0) {
                  errorMessage = siweError.response.errors[0].message || errorMessage
                }
              }

              // Check if this is a user rejection error
              if (e?.message === 'User rejected the request.') {
                Actions.reject(porto, request).catch(() => { })
                return { cancelResponse: true }
              }

              // Don't return cancelResponse here - let the error be handled by the catch block
              // This will ensure proper error propagation
              throw new Error(errorMessage)
            },
          },
        )
      } catch (error) {
        // Send error response and return early
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
        await Actions.respond(porto, request, {
          error: {
            code: 4001,
            message: errorMessage
          }
        }).catch(() => { })
        return // Exit early since we've handled the error
      }

      if (!response) {
        // This shouldn't happen, but just in case
        return
      }

      const { accounts } = response as { accounts: { address: string }[] }
      const address = accounts[0]?.address

      if (address && email)
        Dialog.store.setState((state) => ({
          ...state,
          accountMetadata: {
            ...state.accountMetadata,
            [address]: { email },
          },
        }))

      return response
    },
  })

  const status = React.useMemo(() => {
    if (capabilities?.grantPermissions && grantPermissionsQuery.isFetching)
      return 'loading'
    if (respond.isPending) return 'responding'
    return undefined
  }, [
    capabilities?.grantPermissions,
    grantPermissionsQuery.isFetching,
    respond.isPending,
  ])

  if (respond.isSuccess) return

  if (capabilities?.email ?? true)
    return (
      <Email
        actions={actions}
        defaultValue={
          typeof capabilities?.createAccount === 'object'
            ? capabilities?.createAccount?.label || ''
            : undefined
        }
        onApprove={(options) => respond.mutate(options)}
        permissions={grantPermissions?.permissions}
        status={status}
      />
    )

  if (actions.includes('sign-up'))
    return (
      <SignUp
        enableSignIn={actions.includes('sign-in')}
        onApprove={(options) => respond.mutate(options)}
        onReject={() => Actions.reject(porto, request)}
        permissions={grantPermissions?.permissions}
        status={status}
      />
    )

  return (
    <SignIn
      onApprove={(options) => respond.mutate(options)}
      permissions={grantPermissions?.permissions}
      status={status}
    />
  )
}

/** Utility to verify CLI public keys via relay. */
async function verifyKeys(
  relayUrl: string,
  publicKeys: string[],
): Promise<boolean> {
  try {
    const response = await fetch(`${relayUrl}/.well-known/keys`)
    if (!response.ok) return false

    const data = await response.json()
    const validKeys = data.keys as string[]

    // Check if all provided public keys are in the valid keys list
    return publicKeys.every((key) => validKeys.includes(key))
  } catch (error) {
    console.error('Failed to verify CLI keys:', error)
    return false
  }
}

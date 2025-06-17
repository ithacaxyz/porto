import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions, Hooks } from 'porto/remote'

import * as Dialog from '~/lib/Dialog'
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

  const signIn =
    (address && !capabilities?.createAccount) ||
    capabilities?.createAccount === false

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

      return Actions.respond(
        porto,
        {
          ...request,
          params: [
            {
              ...params[0],
              capabilities: {
                ...params[0]?.capabilities,
                createAccount: email
                  ? {
                      ...(typeof params[0]?.capabilities?.createAccount ===
                      'object'
                        ? params[0]?.capabilities?.createAccount
                        : {}),
                      label: email,
                    }
                  : params[0]?.capabilities?.createAccount || !signIn,
                email: Boolean(email),
                selectAccount,
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
                    'Your browser doesn’t support passkey creation in the current context.',
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
          },
        },
      )
    },
  })

  if (capabilities?.email ?? true)
    return (
      <Email
        defaultValue={
          typeof capabilities?.createAccount === 'object'
            ? capabilities?.createAccount?.label || ''
            : undefined
        }
        loading={respond.isPending}
        onApprove={(options) => respond.mutate(options)}
        permissions={capabilities?.grantPermissions?.permissions}
      />
    )

  if (signIn)
    return (
      <SignIn
        loading={respond.isPending}
        onApprove={(options) => respond.mutate(options)}
        permissions={capabilities?.grantPermissions?.permissions}
      />
    )

  return (
    <SignUp
      enableSignIn={!capabilities?.createAccount}
      loading={respond.isPending}
      onApprove={(options) => respond.mutate(options)}
      onReject={() => Actions.reject(porto, request)}
      permissions={capabilities?.grantPermissions?.permissions}
    />
  )
}

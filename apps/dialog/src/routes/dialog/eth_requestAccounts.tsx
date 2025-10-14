import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import type { RpcSchema } from 'ox'
import * as Provider from 'ox/Provider'
import type { RpcSchema as porto_RpcSchema } from 'porto'
import { Actions, Hooks } from 'porto/remote'
import { porto } from '~/lib/Porto'
import { useAuthSessionRedirect } from '~/lib/ReactNative'
import * as Router from '~/lib/Router'
import { SignIn } from '../-components/SignIn'
import { SignUp } from '../-components/SignUp'

export const Route = createFileRoute('/dialog/eth_requestAccounts')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'eth_requestAccounts',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const address = Hooks.usePortoStore(
    porto,
    (state) => state.accounts[0]?.address,
  )

  const respond = useMutation({
    async mutationFn({
      signIn,
      selectAccount,
      reject,
    }: {
      signIn?: boolean
      selectAccount?: boolean
      reject?: boolean
    }) {
      if (!request) throw new Error('no request found.')

      // Handle rejection through mutation to support React Native redirect
      if (reject) {
        await Actions.reject(porto, request)
        throw new Provider.UserRejectedRequestError()
      }

      return Actions.respond<
        RpcSchema.ExtractReturnType<porto_RpcSchema.Schema, 'wallet_connect'>
      >(
        porto,
        {
          ...request,
          method: 'wallet_connect',
          params: [
            {
              capabilities: {
                createAccount: !signIn,
                selectAccount,
              },
            },
          ],
        },
        {
          selector(result) {
            return result.accounts.map((x) => x.address)
          },
        },
      )
    },
  })

  useAuthSessionRedirect(respond)

  if (address)
    return (
      <SignIn
        onApprove={({ selectAccount }) =>
          respond.mutate({ selectAccount, signIn: true })
        }
        status={respond.isPending ? 'responding' : undefined}
      />
    )
  return (
    <SignUp
      enableSignIn={true}
      onApprove={({ signIn, selectAccount }) =>
        respond.mutate({ selectAccount, signIn })
      }
      onReject={() => respond.mutate({ reject: true })}
      status={respond.isPending ? 'responding' : undefined}
    />
  )
}

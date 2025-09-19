import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import type { RpcSchema } from 'ox'
import type { RpcSchema as porto_RpcSchema } from 'porto'
import { Actions, Hooks } from 'porto/remote'
import { porto } from '~/lib/Porto'
import * as Referrer from '~/lib/Referrer'
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

  const trusted = Referrer.useTrusted(['allow-blind-sign'])

  const respond = useMutation({
    mutationFn({
      enableBlindSigning,
      signIn,
      selectAccount,
    }: {
      enableBlindSigning?: boolean
      signIn?: boolean
      selectAccount?: boolean
    }) {
      if (!request) throw new Error('no request found.')

      const params = (request.params as any)?.[0] ?? {}
      const capabilities = params.capabilities ?? {}

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
                blindSignKey:
                  enableBlindSigning && trusted
                    ? capabilities?.blindSignKey
                    : undefined,
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

  if (address)
    return (
      <SignIn
        allowBlindSigning={trusted}
        onApprove={({ selectAccount, enableBlindSigning }) =>
          respond.mutate({ enableBlindSigning, selectAccount, signIn: true })
        }
        status={respond.isPending ? 'responding' : undefined}
      />
    )
  return (
    <SignUp
      allowBlindSigning={trusted}
      enableSignIn={true}
      onApprove={({ signIn, selectAccount, enableBlindSigning }) =>
        respond.mutate({ enableBlindSigning, selectAccount, signIn })
      }
      onReject={() => Actions.reject(porto, request)}
      status={respond.isPending ? 'responding' : undefined}
    />
  )
}

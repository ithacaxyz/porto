import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions, Hooks } from 'porto/remote'
import { useEffect } from 'react'

import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { SignIn } from '../-components/SignIn'
import { SignUp } from '../-components/SignUp'

export const Route = createFileRoute('/dialog/wallet_connect')({
  component: RouteComponent,
  validateSearch: (search) => {
    const request = Router.parseSearchRequest(search, {
      method: 'wallet_connect',
    })
    return {
      ...request,
      step: search.step as 'signIn' | 'signUp',
    }
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const request = Route.useSearch()
  const { params = [], step } = request
  const { capabilities } = params[0] ?? {}

  const address = Hooks.usePortoStore(
    porto,
    (state) => state.accounts[0]?.address,
  )

  const signIn = address && !capabilities?.createAccount

  useEffect(() => {
    if (signIn) {
      navigate({
        replace: true,
        search: (prev) => ({ ...prev, step: 'signIn' }),
      })
    } else {
      navigate({
        replace: true,
        search: (prev) => ({ ...prev, step: 'signUp' }),
      })
    }
  }, [navigate, signIn])

  const respond = useMutation({
    mutationFn({
      signIn,
      selectAccount,
    }: {
      signIn?: boolean
      selectAccount?: boolean
    }) {
      if (!request) throw new Error('no request found.')
      if (request.method !== 'wallet_connect')
        throw new Error('request is not a wallet_connect request.')

      const params = request.params ?? []

      return Actions.respond(porto, {
        ...request,
        params: [
          {
            ...params[0],
            capabilities: {
              ...params[0]?.capabilities,
              createAccount: !signIn,
              selectAccount,
            },
          },
        ],
      } as typeof request)
    },
  })

  if (step === 'signIn')
    return (
      <SignIn
        capabilities={capabilities}
        loading={respond.isPending}
        onApprove={(options) => respond.mutate(options)}
      />
    )
  if (step === 'signUp' && capabilities?.createAccount)
    return (
      <SignUp
        capabilities={capabilities}
        enableSignIn={!capabilities?.createAccount}
        loading={respond.isPending}
        onApprove={(options) => respond.mutate(options)}
        onReject={() => Actions.reject(porto, request)}
      />
    )
  return (
    <SignUp
      capabilities={capabilities}
      enableSignIn={!capabilities?.createAccount}
      loading={respond.isPending}
      onApprove={(options) => respond.mutate(options)}
      onReject={() => Actions.reject(porto, request)}
    />
  )
}

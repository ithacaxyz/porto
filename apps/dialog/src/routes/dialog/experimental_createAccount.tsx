import { Porto } from '@porto/apps'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import type { RpcSchema } from 'ox'
import type { RpcSchema as porto_RpcSchema } from 'porto'
import { Actions, Hooks } from 'porto/remote'

import { SignUp } from '../-components/SignUp'

const porto = Porto.porto

export const Route = createFileRoute('/dialog/experimental_createAccount')({
  component: RouteComponent,
  validateSearch(
    search,
  ): RpcSchema.ExtractParams<
    porto_RpcSchema.Schema,
    'experimental_createAccount'
  > {
    return search as never
  },
})

function RouteComponent() {
  const address = Hooks.usePortoStore(
    porto,
    (state) => state.accounts[0]?.address,
  )

  const queued = Hooks.useRequest(porto)
  const respond = useMutation({
    mutationFn() {
      if (!queued) throw new Error('no request queued.')
      return Actions.respond(porto, queued)
    },
  })

  return (
    <SignUp
      enableSignIn={!address}
      loading={respond.isPending}
      onApprove={() => respond.mutate()}
      onReject={() => Actions.reject(porto, queued!)}
    />
  )
}

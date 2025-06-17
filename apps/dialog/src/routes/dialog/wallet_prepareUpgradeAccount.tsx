import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Actions } from 'porto/remote'

import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { Email } from '../-components/Email'
import { SignUp } from '../-components/SignUp'

export const Route = createFileRoute('/dialog/wallet_prepareUpgradeAccount')({
  component: RouteComponent,
  validateSearch: (search) => {
    const request = Router.parseSearchRequest(search, {
      method: 'wallet_prepareUpgradeAccount',
    })
    return request
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const { params = [] } = request
  const { capabilities } = params[0] ?? {}

  const respond = useMutation({
    async mutationFn({ email }: { email?: string | undefined } = {}) {
      if (!request) throw new Error('no request found.')
      if (request.method !== 'wallet_prepareUpgradeAccount')
        throw new Error(
          'request is not a wallet_prepareUpgradeAccount request.',
        )

      const params = request.params ?? []

      return Actions.respond(porto, {
        ...request,
        params: [
          {
            ...params[0],
            capabilities: {
              ...params[0]?.capabilities,
              email: Boolean(email),
              label: email,
            },
          },
        ],
      } as typeof request)
    },
  })

  if (capabilities?.email ?? true)
    return (
      <Email
        loading={respond.isPending}
        onApprove={(options) => respond.mutate(options)}
        permissions={capabilities?.grantPermissions?.permissions}
        variant="upgrade"
      />
    )

  return (
    <SignUp
      enableSignIn={false}
      loading={respond.isPending}
      onApprove={() => respond.mutate({})}
      onReject={() => Actions.reject(porto, request)}
      permissions={capabilities?.grantPermissions?.permissions}
    />
  )
}

import { Button, Details } from '@porto/ui'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as Provider from 'ox/Provider'
import { Actions } from 'porto/remote'
import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import { useAuthSessionRedirect } from '~/lib/ReactNative'
import * as Router from '~/lib/Router'
import * as WebAuthnPrf from '~/lib/WebAuthnPrf'
import LucideKeyRound from '~icons/lucide/key-round'
import { Layout } from '../-components/Layout'

export const Route = createFileRoute('/dialog/wallet_getAppPrf')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'wallet_getAppPrf',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const parameters = request.params[0]
  const referrer = Dialog.useStore((state) => state.referrer)
  const account = (request as any).account?.address

  const respond = useMutation({
    async mutationFn({ reject }: { reject?: boolean } = {}) {
      if (reject) {
        await Actions.reject(porto, request)
        throw new Provider.UserRejectedRequestError()
      }

      try {
        const state = porto._internal.store.getState()
        const selectedAccount =
          state.accounts.find((x) => x.address === account) ?? state.accounts[0]
        if (!selectedAccount) throw new Provider.UnauthorizedError()

        const appOrigin = WebAuthnPrf.validateAppReferrer({
          origin: referrer?.origin,
          url: referrer?.url,
        })

        const metadata = WebAuthnPrf.loadAccountMetadata(
          selectedAccount.address,
        )
        if (!metadata)
          throw new Provider.UnsupportedMethodError({
            message: 'No PRF metadata found for the selected account.',
          })
        if (!metadata.prfEnabled)
          throw new Provider.UnsupportedMethodError({
            message: 'The selected account credential is not PRF-enabled.',
          })

        WebAuthnPrf.assertAccountCredentialBinding({
          account: selectedAccount,
          metadata,
        })

        const output = await WebAuthnPrf.getAppPrf({
          account: selectedAccount.address,
          appOrigin,
          credentialId: metadata.credentialId,
          purpose: parameters.purpose,
          rpId: metadata.rpId,
          salt: parameters.salt,
          vaultId: parameters.vaultId,
        })

        return Actions.respond(porto, request, {
          result: {
            account: selectedAccount.address,
            credentialId: metadata.credentialId,
            output,
            prfSupported: true,
            rpId: metadata.rpId,
          },
        })
      } catch (error) {
        const parsed = Provider.parseError(error)
        await Actions.respond(porto, request, {
          error: {
            code: (parsed as { code?: number }).code ?? -32603,
            message:
              parsed instanceof Error ? parsed.message : 'PRF request failed.',
          },
        })
        throw parsed
      }
    },
  })

  useAuthSessionRedirect(respond)

  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          icon={LucideKeyRound}
          subContent={referrer?.url?.host}
          title="Unlock PRF"
        />
      </Layout.Header>
      <Layout.Content>
        <Details>
          <Details.Item label="Purpose" value={parameters.purpose} />
          <Details.Item label="Vault" value={parameters.vaultId} />
          {respond.error && (
            <Details.Item
              label="Error"
              value={
                respond.error instanceof Error
                  ? respond.error.message
                  : String(respond.error)
              }
            />
          )}
        </Details>
      </Layout.Content>
      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            disabled={respond.isPending}
            onClick={() => respond.mutate({ reject: true })}
            variant="negative-secondary"
            width="grow"
          >
            Cancel
          </Button>
          <Button
            loading={respond.isPending ? 'Unlocking...' : undefined}
            onClick={() => respond.mutate({})}
            variant="positive"
            width="grow"
          >
            Unlock
          </Button>
        </Layout.Footer.Actions>
      </Layout.Footer>
    </Layout>
  )
}

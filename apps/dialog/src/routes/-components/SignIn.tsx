import { Button } from '@porto/apps/components'
import { Hooks } from 'porto/remote'

import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import { Permissions } from '~/routes/-components/Permissions'
import LucideLogIn from '~icons/lucide/log-in'

export function SignIn(props: SignIn.Props) {
  const { loading, onApprove, permissions } = props

  const account = Hooks.useAccount(porto)
  const hostname = Dialog.useStore((state) => state.referrer?.url.hostname)

  return (
    <Layout loading={loading} loadingTitle="Signing in...">
      <Layout.Header className="flex-grow">
        <Layout.Header.Default
          content={
            <>
              Authenticate with your Porto account to start using{' '}
              <span className="font-medium">{hostname}</span>.
            </>
          }
          icon={LucideLogIn}
          title="Get started"
        />
      </Layout.Header>

      <Permissions title="Permissions requested" {...permissions} />

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            className="flex-grow"
            onClick={() => onApprove({ signIn: false })}
            type="button"
          >
            Sign up
          </Button>

          <Button
            className="flex-grow"
            onClick={() => onApprove({ signIn: true })}
            type="button"
            variant="accent"
          >
            Sign in
          </Button>
        </Layout.Footer.Actions>

        {account && (
          <Layout.Footer.Account
            address={account.address}
            onClick={() => onApprove({ selectAccount: true, signIn: true })}
          />
        )}
      </Layout.Footer>
    </Layout>
  )
}

declare namespace SignIn {
  type Props = {
    loading: boolean
    onApprove: (p: { signIn?: boolean; selectAccount?: boolean }) => void
    permissions?: Permissions.Props
  }
}

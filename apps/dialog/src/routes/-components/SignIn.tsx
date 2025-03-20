import { Button } from '@porto/apps/components'

import { Layout } from '~/components/Layout'
import * as Dialog from '~/lib/Dialog'
import LucideLogIn from '~icons/lucide/log-in'

export function SignIn(props: SignIn.Props) {
  const { loading, onApprove } = props

  const hostname = Dialog.useStore((state) => state.referrer?.origin.hostname)

  return (
    <Layout loading={loading} loadingTitle="Signing in...">
      <Layout.Header className="flex-grow">
        <Layout.Header.Default
          title="Sign in"
          icon={LucideLogIn}
          content={
            <>
              Sign in with your wallet to continue using{' '}
              <span className="font-medium">{hostname}</span>.
            </>
          }
        />
      </Layout.Header>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button type="button" onClick={() => onApprove({ signIn: false })}>
            Sign up
          </Button>

          <Button
            className="flex-grow"
            type="button"
            variant="accent"
            onClick={() => onApprove({ signIn: true })}
          >
            Sign in
          </Button>
        </Layout.Footer.Actions>

        <Layout.Footer.Account
          onClick={() => onApprove({ signIn: true, selectAccount: true })}
        />
      </Layout.Footer>
    </Layout>
  )
}

export declare namespace SignIn {
  type Props = {
    loading: boolean
    onApprove: (p: { signIn?: boolean; selectAccount?: boolean }) => void
  }
}

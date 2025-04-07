import { Button } from '@porto/apps/components'
import { Hooks } from 'porto/remote'

import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import LucideLogIn from '~icons/lucide/log-in'

export function SignIn(props: SignIn.Props) {
  const { loading, onApprove } = props

  const account = Hooks.useAccount(porto)
  const hostname = Dialog.useStore((state) => state.referrer?.origin.hostname)

  return (
    <Layout loading={loading} loadingTitle="Signing in...">
      <Layout.Header className="flex-grow">
        <Layout.Header.Default
          content={
            <>
              Sign in with your wallet to continue using{' '}
              <span className="font-medium">{hostname}</span>.
            </>
          }
          icon={LucideLogIn}
          title="Sign in"
        />
      </Layout.Header>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button onClick={() => onApprove({ signIn: false })} type="button">
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

        <Layout.Footer.Account
          address={account!.address}
          onClick={() => onApprove({ selectAccount: true, signIn: true })}
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

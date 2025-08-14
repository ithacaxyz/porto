import { Button } from '@porto/ui'
import { Hooks } from 'porto/remote'

import * as React from 'react'
import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import { Permissions } from '~/routes/-components/Permissions'
import LucideLogIn from '~icons/lucide/log-in'

export function SignIn(props: SignIn.Props) {
  const { onApprove, permissions, status } = props

  const account = Hooks.useAccount(porto)
  const hostname = Dialog.useStore((state) => state.referrer?.url?.hostname)

  const [mode, setMode] = React.useState<'sign-in' | 'sign-up'>('sign-in')
  const signingIn = mode === 'sign-in' && status === 'responding'
  const signingUp = mode === 'sign-up' && status === 'responding'

  return (
    <Layout>
      <Layout.Header className="flex-grow">
        <Layout.Header.Default
          content={
            <>
              Authenticate with your Porto account to start using{' '}
              {hostname ? (
                <span className="font-medium">{hostname}</span>
              ) : (
                'this website'
              )}
              .
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
            data-testid="sign-up"
            disabled={status === 'loading' || signingIn}
            loading={signingUp && 'Signing up…'}
            onClick={() => {
              setMode('sign-up')
              onApprove({ signIn: false })
            }}
            width="grow"
          >
            Sign up
          </Button>
          <Button
            data-testid="sign-in"
            disabled={status === 'loading' || signingUp}
            loading={signingIn && 'Signing in…'}
            onClick={() => {
              setMode('sign-in')
              onApprove({ signIn: true })
            }}
            variant="primary"
            width="grow"
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
    onApprove: (p: { signIn?: boolean; selectAccount?: boolean }) => void
    permissions?: Permissions.Props
    status?: 'loading' | 'responding' | undefined
  }
}

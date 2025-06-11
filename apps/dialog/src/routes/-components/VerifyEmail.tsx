import { Button } from '@porto/apps/components'
import { Address } from 'ox'
import { Hooks } from 'porto/remote'

import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import LucideLogIn from '~icons/lucide/log-in'

export function VerifyEmail(props: VerifyEmail.Props) {
  const { address, email, loading, onApprove, onReject } = props

  const account = Hooks.useAccount(porto, { address })

  return (
    <Layout loading={loading} loadingTitle="Verifying...">
      <Layout.Header>
        <Layout.Header.Default
          icon={LucideLogIn}
          title="Verify Email"
          variant="default"
        />
      </Layout.Header>

      <Layout.Content>
        <div className="rounded-lg bg-surface">
          <div className="px-3 pt-2 font-medium text-[14px] text-secondary">
            Email
          </div>
          <div className="max-h-[160px] overflow-auto px-3 pb-2">
            <pre className="whitespace-pre-wrap font-sans text-[14px] text-primary">
              {email}
            </pre>
          </div>
        </div>
      </Layout.Content>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            className="flex-grow"
            onClick={() => onReject()}
            type="button"
          >
            No thanks
          </Button>

          <Button
            className="flex-grow"
            onClick={() => onApprove()}
            type="button"
            variant="accent"
          >
            Verify email
          </Button>
        </Layout.Footer.Actions>

        {account?.address && (
          <Layout.Footer.Account address={account.address} />
        )}
      </Layout.Footer>
    </Layout>
  )
}

export namespace VerifyEmail {
  export type Props = {
    address?: Address.Address | undefined
    email: string
    loading?: boolean | undefined
    onApprove: () => void
    onReject: () => void
  }
}

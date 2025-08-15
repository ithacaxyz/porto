import { Button } from '@porto/ui'
import type { Address } from 'ox'
import { Hooks } from 'porto/remote'

import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import LucideLogIn from '~icons/lucide/log-in'

export function VerifyEmail(props: VerifyEmail.Props) {
  const { address, email, loading, onApprove, onReject } = props

  const account = Hooks.useAccount(porto, { address })

  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          icon={LucideLogIn}
          title="Verify Email"
          variant="default"
        />
      </Layout.Header>

      <Layout.Content>
        <div className="rounded-lg bg-th_base-alt">
          <div className="px-3 pt-2 font-medium text-[14px] text-th_base-secondary">
            Email
          </div>
          <div className="max-h-[160px] overflow-auto px-3 pb-2">
            <pre className="whitespace-pre-wrap font-sans text-[14px] text-th_base">
              {email}
            </pre>
          </div>
        </div>
      </Layout.Content>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button disabled={loading} onClick={() => onReject()} width="grow">
            No thanks
          </Button>
          <Button
            loading={loading && 'Verifying…'}
            onClick={() => onApprove()}
            variant="primary"
            width="grow"
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

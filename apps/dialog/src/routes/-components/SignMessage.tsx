import { Button } from '@porto/apps/components'
import { Address } from 'ox'
import { Hooks } from 'porto/remote'

import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import LucideLogIn from '~icons/lucide/log-in'

export function SignMessage(props: SignMessage.Props) {
  const { address, message, loading, onApprove, onReject } = props

  const account = Hooks.useAccount(porto, { address })

  return (
    <Layout loading={loading} loadingTitle="Signing...">
      <Layout.Header>
        <Layout.Header.Default
          content={<>Review the message to sign below.</>}
          icon={LucideLogIn}
          title="Sign Message"
          variant="default"
        />
      </Layout.Header>

      <Layout.Content>
        <div className="rounded-lg bg-surface">
          <div className="px-3 pt-2 font-medium text-[14px] text-secondary">
            Message
          </div>
          <div className="max-h-[160px] overflow-auto px-3 pb-2">
            <pre className="whitespace-pre-wrap font-sans text-[14px] text-primary">
              {message}
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
            Sign message
          </Button>
        </Layout.Footer.Actions>

        {account?.address && (
          <Layout.Footer.Account address={account.address} />
        )}
      </Layout.Footer>
    </Layout>
  )
}

export namespace SignMessage {
  export type Props = {
    address?: Address.Address | undefined
    message: string
    loading?: boolean | undefined
    onApprove: () => void
    onReject: () => void
  }

  export function Siwe(props: Siwe.Props) {
    const { address, loading, onApprove, onReject } = props

    const account = Hooks.useAccount(porto, { address })
    const hostname = Dialog.useStore((state) => state.referrer?.url.hostname)

    return (
      <Layout loading={loading} loadingTitle="Authenticating...">
        <Layout.Header className="flex-grow">
          <Layout.Header.Default
            content={
              <>
                Authenticate <span className="font-medium">{hostname}</span>{' '}
                with your passkey to continue.
              </>
            }
            icon={LucideLogIn}
            title="Authenticate"
          />
        </Layout.Header>

        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button onClick={() => onReject()} type="button">
              No thanks
            </Button>

            <Button
              className="flex-grow"
              onClick={() => onApprove()}
              type="button"
              variant="accent"
            >
              Approve
            </Button>
          </Layout.Footer.Actions>

          {account?.address && (
            <Layout.Footer.Account address={account.address} />
          )}
        </Layout.Footer>
      </Layout>
    )
  }

  export namespace Siwe {
    export type Props = {
      address?: Address.Address | undefined
      loading?: boolean | undefined
      onApprove: () => void
      onReject: () => void
    }
  }
}

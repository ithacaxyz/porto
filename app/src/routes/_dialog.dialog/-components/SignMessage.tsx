import { useMutation } from '@tanstack/react-query'
import { Actions, Hooks } from 'porto/remote'

import { Button } from '~/components/Button'
import { Layout } from '~/components/Layout'
import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import LucideLogIn from '~icons/lucide/log-in'

export function SignMessage({ message }: SignMessage.Props) {
  const request = Hooks.useRequest(porto)

  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, request!)
    },
  })

  return (
    <Layout loading={respond.isPending} loadingTitle="Signing...">
      <Layout.Header>
        <Layout.Header.Default
          title="Sign Message"
          icon={LucideLogIn}
          content={<>Review the message to sign below.</>}
          variant="default"
        />
      </Layout.Header>

      <Layout.Content>
        <div className="rounded-lg bg-surface">
          <div className="px-3 pt-2 font-medium text-[14px] text-secondary">
            Message
          </div>
          <div className="max-h-[160px] overflow-scroll px-3 pb-2">
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
            type="button"
            onClick={() => Actions.reject(porto, request!)}
          >
            No thanks
          </Button>

          <Button
            className="flex-grow"
            type="button"
            variant="accent"
            onClick={() => respond.mutate()}
          >
            Sign message
          </Button>
        </Layout.Footer.Actions>

        <Layout.Footer.Wallet />
      </Layout.Footer>
    </Layout>
  )
}

export namespace SignMessage {
  export type Props = {
    message: string
  }

  export function Siwe() {
    const request = Hooks.useRequest(porto)

    const respond = useMutation({
      mutationFn() {
        return Actions.respond(porto, request!)
      },
    })

    const hostname = Dialog.useStore((state) => state.referrer?.origin.hostname)

    return (
      <Layout loading={respond.isPending} loadingTitle="Authenticating...">
        <Layout.Header className="flex-grow">
          <Layout.Header.Default
            title="Authenticate"
            icon={LucideLogIn}
            content={
              <>
                Authenticate <span className="font-medium">{hostname}</span>{' '}
                with your passkey to continue.
              </>
            }
          />
        </Layout.Header>

        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button
              type="button"
              onClick={() => Actions.reject(porto, request!)}
            >
              No thanks
            </Button>

            <Button
              className="flex-grow"
              type="button"
              variant="accent"
              onClick={() => respond.mutate()}
            >
              Approve
            </Button>
          </Layout.Footer.Actions>

          <Layout.Footer.Wallet />
        </Layout.Footer>
      </Layout>
    )
  }
}

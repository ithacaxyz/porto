import { Button, LightDarkImage } from '@porto/ui'
import { useState } from 'react'
import * as Dialog from '~/lib/Dialog'
import { Layout } from '~/routes/-components/Layout'
import { Permissions } from '~/routes/-components/Permissions'
import ChevronRight from '~icons/lucide/chevron-right'
import LucideLogIn from '~icons/lucide/log-in'
import Question from '~icons/mingcute/question-line'

export function SignUp(props: SignUp.Props) {
  const { enableSignIn, onApprove, onReject, permissions, status } = props

  const [showLearn, setShowLearn] = useState(false)

  const hostname = Dialog.useStore((state) => state.referrer?.url?.hostname)

  if (showLearn) return <SignUp.Learn onDone={() => setShowLearn(false)} />

  return (
    <Layout>
      <Layout.Header className="flex-grow">
        <Layout.Header.Default
          content={
            <>
              Create a new passkey wallet to start using{' '}
              {hostname ? (
                <span className="font-medium">{hostname}</span>
              ) : (
                'this website'
              )}
              .
            </>
          }
          icon={LucideLogIn}
          title="Sign up"
        />
      </Layout.Header>

      <Permissions title="Permissions requested" {...permissions} />

      <Layout.Footer>
        <Layout.Footer.Actions>
          {enableSignIn ? (
            <Button
              data-testid="sign-in"
              disabled={status === 'loading'}
              onClick={() => onApprove({ selectAccount: true, signIn: true })}
            >
              Sign in
            </Button>
          ) : (
            <Button data-testid="cancel" onClick={onReject}>
              No thanks
            </Button>
          )}

          <Button
            data-testid="sign-up"
            disabled={status === 'loading'}
            loading={status === 'responding' && 'Signing up…'}
            onClick={() => onApprove({ signIn: false })}
            variant="primary"
            width="grow"
          >
            Sign up
          </Button>
        </Layout.Footer.Actions>

        <button
          className="flex w-full cursor-pointer items-center justify-between border-th_base border-t p-3 pb-0"
          onClick={() => setShowLearn(true)}
          type="button"
        >
          <div className="flex items-center gap-1.5">
            <Question className="mt-px size-5 text-th_base-secondary" />
            <span className="font-medium text-[14px]">
              Learn about passkeys
            </span>
          </div>
          <ChevronRight className="size-5 text-th_base opacity-50" />
        </button>
      </Layout.Footer>
    </Layout>
  )
}

export namespace SignUp {
  export type Props = {
    enableSignIn?: boolean
    onApprove: (p: { signIn?: boolean; selectAccount?: boolean }) => void
    onReject: () => void
    permissions?: Permissions.Props
    status?: 'loading' | 'responding' | undefined
  }

  export function Learn({ onDone }: { onDone: () => void }) {
    return (
      <Layout>
        <Layout.Header className="flex-grow space-y-2">
          <LightDarkImage
            alt="Diagram illustrating how passkeys work"
            className="block w-full text-transparent"
            dark="/dialog/passkey-diagram-dark.svg"
            height={75}
            light="/dialog/passkey-diagram.svg"
            width={258}
          />

          <Layout.Header.Default
            content={
              <div className="space-y-2">
                <div>
                  Passkeys let you sign in to your wallet in seconds. Passkeys
                  are the safest way to authenticate on the internet.
                </div>
                <div className="text-th_base-secondary">
                  Your passkeys are protected by your device, browser, or
                  password manager like 1Password.
                </div>
              </div>
            }
            title="About Passkeys"
          />
        </Layout.Header>

        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button onClick={onDone} width="full">
              Back
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
      </Layout>
    )
  }
}

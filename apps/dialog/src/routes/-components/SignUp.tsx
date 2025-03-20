import { Button } from '@porto/apps/components'
import { useState } from 'react'

import { Layout } from '~/components/Layout'
import { PasskeyDiagramCard } from '~/components/PasskeyDiagramCard'
import * as Dialog from '~/lib/Dialog'
import ChevronRight from '~icons/lucide/chevron-right'
import LucideLogIn from '~icons/lucide/log-in'
import Question from '~icons/mingcute/question-line'

export function SignUp(props: SignUp.Props) {
  const { enableSignIn, loading, onApprove, onReject } = props

  const [showLearn, setShowLearn] = useState(false)

  const hostname = Dialog.useStore((state) => state.referrer?.origin.hostname)

  if (showLearn) return <SignUp.Learn onDone={() => setShowLearn(false)} />
  return (
    <Layout loading={loading} loadingTitle="Signing up...">
      <Layout.Header className="flex-grow">
        <Layout.Header.Default
          title="Sign up"
          icon={LucideLogIn}
          content={
            <>
              Create a new passkey wallet to start using{' '}
              <span className="font-medium">{hostname}</span>.
            </>
          }
        />
      </Layout.Header>

      <Layout.Footer>
        <Layout.Footer.Actions>
          {enableSignIn ? (
            <Button
              type="button"
              onClick={() => onApprove({ signIn: true, selectAccount: true })}
            >
              Sign in
            </Button>
          ) : (
            <Button type="button" onClick={onReject}>
              No thanks
            </Button>
          )}

          <Button
            className="flex-grow"
            type="button"
            variant="accent"
            onClick={() => onApprove({})}
          >
            Sign up
          </Button>
        </Layout.Footer.Actions>

        <button
          className="flex w-full cursor-pointer items-center justify-between border-primary border-t px-3 pt-3"
          onClick={() => setShowLearn(true)}
          type="button"
        >
          <div className="flex items-center gap-1">
            <Question />
            <span className="font-medium text-[14px]">
              Learn about passkeys
            </span>
          </div>
          <div className="text-secondary">
            <ChevronRight />
          </div>
        </button>
      </Layout.Footer>
    </Layout>
  )
}

export namespace SignUp {
  export type Props = {
    enableSignIn?: boolean
    loading?: boolean
    onApprove: (p: { signIn?: boolean; selectAccount?: boolean }) => void
    onReject: () => void
  }

  export function Learn({ onDone }: { onDone: () => void }) {
    return (
      <Layout>
        <Layout.Header className="flex-grow space-y-2">
          <PasskeyDiagramCard />

          <Layout.Header.Default
            title="About Passkeys"
            content={
              <div className="space-y-2">
                <div>
                  Passkeys let you sign in to your wallet in seconds. Passkeys
                  are the safest way to authenticate on the internet.
                </div>
                <div className="text-secondary">
                  Your passkeys are protected by your device, browser, or
                  password manager like 1Password.
                </div>
              </div>
            }
          />
        </Layout.Header>

        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button className="flex-grow" type="button" onClick={onDone}>
              Back
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
      </Layout>
    )
  }
}

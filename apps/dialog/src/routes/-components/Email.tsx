import { Input } from '@porto/apps/components'
import { Button, TextButton } from '@porto/ui'
import { cx } from 'cva'
import { Hooks } from 'porto/remote'
import * as React from 'react'
import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import { Permissions } from '~/routes/-components/Permissions'
import { StringFormatter } from '~/utils'
import LucideHaze from '~icons/lucide/haze'
import IconScanFace from '~icons/porto/scan-face'

export function Email(props: Email.Props) {
  const { defaultValue = '', onApprove, permissions, status } = props

  const [actions, setActions] = React.useState<
    readonly ('sign-in' | 'sign-up')[]
  >(props.actions ?? ['sign-in', 'sign-up'])

  const account = Hooks.useAccount(porto)
  const email = Dialog.useStore((state) =>
    account?.address
      ? state.accountMetadata[account.address]?.email
      : undefined,
  )
  const customFeatures = Dialog.useStore((state) => state.customFeatures)
  const customLabels = Dialog.useStore((state) => state.customLabels)
  const displayName = (() => {
    if (!account) return undefined
    if (email) return email
    return StringFormatter.truncate(account.address)
  })()

  const cli = Dialog.useStore((state) =>
    state.referrer?.url?.toString().startsWith('cli'),
  )
  const hostname = Dialog.useStore((state) => state.referrer?.url?.hostname)

  const [mode, setMode] = React.useState<'sign-in' | 'sign-up'>('sign-in')
  const signingIn = mode === 'sign-in' && status === 'responding'
  const signingUp = mode === 'sign-up' && status === 'responding'

  const onSignUpSubmit = React.useCallback<
    React.FormEventHandler<HTMLFormElement>
  >(
    async (event) => {
      event.preventDefault()
      const formData = new FormData(event.target as HTMLFormElement)
      const email = formData.get('email')?.toString()
      setMode('sign-up')
      onApprove({ email, signIn: false })
    },
    [onApprove],
  )

  const content = React.useMemo(() => {
    if (cli) return undefined
    return (
      <>
        {customLabels?.signInPrompt ? (
          // Custom sign-in prompt (no Porto branding)
          customLabels.signInPrompt
        ) : (
          // Default: "Use Porto to sign in to" with Porto bolded
          <>
            Use <span className="font-medium">Porto</span> to sign in to
          </>
        )}{' '}
        {hostname ? (
          <>
            <span className="font-medium">{hostname}</span>
            {actions.includes('sign-up') ? ' and more' : ''}
          </>
        ) : (
          'this website'
        )}
        .
      </>
    )
  }, [actions, cli, customLabels?.signInPrompt, hostname])

  const [invalid, setInvalid] = React.useState(false)

  return (
    <Layout>
      <Layout.Header className="flex-grow">
        <Layout.Header.Default
          content={content}
          icon={LucideHaze}
          title={actions.includes('sign-up') ? 'Get started' : 'Sign in'}
        />
      </Layout.Header>

      <Permissions title="Permissions requested" {...permissions} />

      <div className="group flex min-h-[48px] w-full flex-col items-center justify-center space-y-3 px-3 pb-3">
        {actions.includes('sign-in') && (
          <Button
            data-testid="sign-in"
            disabled={status === 'loading' || signingUp}
            icon={<IconScanFace className="size-5.25" />}
            loading={signingIn && 'Signing in…'}
            onClick={() => {
              setMode('sign-in')
              onApprove({ signIn: true })
            }}
            type="button"
            variant="primary"
            width="full"
          >
            {actions.includes('sign-up')
              ? (customLabels?.signIn ?? 'Sign in with Porto')
              : (customLabels?.signInAlt ?? 'Continue with Porto')}
          </Button>
        )}

        {actions.includes('sign-up') &&
        customFeatures?.createAccount !== false ? (
          <form
            className="flex w-full flex-grow flex-col gap-2"
            onInvalid={(event) => {
              event.preventDefault()
              setInvalid(true)
            }}
            onSubmit={onSignUpSubmit}
          >
            {/* If "Sign in" button is present, show the "First time?" text for sign up. */}
            {actions.includes('sign-in') && (
              <div className="-tracking-[2.8%] flex items-center whitespace-nowrap text-[12px] text-th_base-secondary leading-[17px]">
                First time?
                <div className="ms-2 h-px w-full bg-th_separator" />
              </div>
            )}
            {customFeatures?.emailInput === false ? (
              // Hidden input when emailInput is disabled
              <input name="email" type="hidden" value="" />
            ) : (
              <div className="relative flex items-center">
                <label className="sr-only" htmlFor="email">
                  Email
                </label>
                <Input
                  className={cx(
                    'w-full bg-th_field',
                    invalid && 'not-focus-visible:border-th_negative',
                  )}
                  defaultValue={defaultValue}
                  disabled={status === 'loading' || signingIn}
                  name="email"
                  onChange={() => setInvalid(false)}
                  placeholder={
                    customLabels?.exampleEmail ?? 'example@ithaca.xyz'
                  }
                  type="email"
                />
                <div className="-tracking-[2.8%] absolute end-3 text-[12px] text-th_base-secondary leading-normal">
                  Optional
                </div>
              </div>
            )}
            <Button
              data-testid="sign-up"
              disabled={status === 'loading' || signingIn}
              loading={signingUp && 'Signing up…'}
              size="medium"
              type="submit"
              variant={actions.includes('sign-in') ? 'secondary' : 'primary'}
            >
              {invalid ? (
                'Invalid email'
              ) : actions.includes('sign-in') ? (
                (customLabels?.createAccount ?? 'Create Porto account')
              ) : (
                <div className="flex gap-2">
                  <IconScanFace className="size-5.25" />
                  {customLabels?.signUp ?? 'Sign up with Porto'}
                </div>
              )}
            </Button>
          </form>
        ) : (
          // If no sign up button, this means the user is already logged in, however
          // the user may want to sign in with a different passkey.
          <div className="flex w-full justify-between gap-2">
            <div>
              {displayName ? (
                <>
                  <span className="text-th_base-secondary">Using</span>{' '}
                  <span className="text-th_base">{displayName}</span>
                </>
              ) : (
                // Empty placeholder to maintain layout spacing
                <span>&nbsp;</span>
              )}
            </div>
            {(() => {
              const showSignUp = customFeatures?.signUpLink !== false

              // Always show Switch link, conditionally show Sign up link
              return (
                <div className="flex items-center gap-0.5">
                  <TextButton
                    color="link"
                    onClick={() => {
                      onApprove({ selectAccount: true, signIn: true })
                    }}
                  >
                    {customLabels?.switchAccount ?? 'Switch'}
                  </TextButton>
                  {showSignUp && (
                    <>
                      <div className="text-th_base-secondary">⋅</div>
                      <TextButton
                        color="link"
                        onClick={() => {
                          setActions(['sign-up'])
                        }}
                      >
                        {customLabels?.signUpLink ?? 'Sign up'}
                      </TextButton>
                    </>
                  )}
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </Layout>
  )
}

export namespace Email {
  export type Props = {
    actions?: readonly ('sign-in' | 'sign-up')[]
    defaultValue?: string | undefined
    onApprove: (p: {
      email?: string
      selectAccount?: boolean
      signIn?: boolean
    }) => void
    permissions?: Permissions.Props
    status?: 'loading' | 'responding' | undefined
  }
}

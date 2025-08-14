import { Button as UiButton } from '@porto/ui'
import { Button, Input } from '@porto/apps/components'
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
  const {
    actions = ['sign-in', 'sign-up'],
    defaultValue = '',
    onApprove,
    permissions,
    status,
  } = props

  const account = Hooks.useAccount(porto)
  const email = Dialog.useStore((state) =>
    account?.address
      ? state.accountMetadata[account.address]?.email
      : undefined,
  )
  const displayName = (() => {
    if (!account) return undefined
    if (email) return email
    return StringFormatter.truncate(account.address)
  })()

  const cli = Dialog.useStore((state) =>
    state.referrer?.url?.toString().startsWith('cli'),
  )
  const hostname = Dialog.useStore((state) => state.referrer?.url?.hostname)

  const onSignUpSubmit = React.useCallback<
    React.FormEventHandler<HTMLFormElement>
  >(
    async (event) => {
      event.preventDefault()
      const formData = new FormData(event.target as HTMLFormElement)
      const email = formData.get('email')?.toString()
      onApprove({ email, signIn: false })
    },
    [onApprove],
  )

  const content = React.useMemo(() => {
    if (cli) return undefined
    return (
      <>
        Use <span className="font-medium">Porto</span> to sign in to{' '}
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
  }, [actions, cli, hostname])

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
          <UiButton
            data-testid="sign-in"
            wide
            icon={<IconScanFace className="size-5.25" />}
            disabled={status === 'loading'}
            loading={status === 'responding' && 'Signing in…'}
            onClick={() => {
              onApprove({ signIn: true })
            }}
            size="medium"
            type="button"
            variant="primary"
          >
            {actions.includes('sign-up')
              ? 'Sign in with Porto'
              : 'Continue with Porto'}
          </UiButton>
        )}

        {actions.includes('sign-up') ? (
          <form
            className="flex w-full flex-grow flex-col gap-2"
            onSubmit={onSignUpSubmit}
          >
            {/* If "Sign in" button is present, show the "First time?" text for sign up. */}
            {actions.includes('sign-in') && (
              <div className="-tracking-[2.8%] flex items-center whitespace-nowrap text-[12px] text-th_base-secondary leading-[17px]">
                First time?
                <div className="ms-2 h-px w-full bg-th_separator" />
              </div>
            )}
            <div className="relative flex items-center">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <Input
                className="w-full user-invalid:bg-th_field user-invalid:ring-th_base-negative"
                defaultValue={defaultValue}
                disabled={status === 'loading'}
                name="email"
                placeholder="example@ithaca.xyz"
                type="email"
              />
              <div className="-tracking-[2.8%] absolute end-3 text-[12px] text-th_base-secondary leading-normal">
                Optional
              </div>
            </div>
            <UiButton
              data-testid="sign-up"
              disabled={status === 'loading'}
              loading={status === 'responding' && 'Signing up…'}
              size="medium"
              variant={actions.includes('sign-in') ? 'secondary' : 'primary'}
            >
              <span className="hidden group-has-[:user-invalid]:block">
                Invalid email
              </span>
              <span className="flex gap-2 group-has-[:user-invalid]:hidden">
                {actions.includes('sign-in') ? (
                  'Create Porto account'
                ) : (
                  <>
                    <IconScanFace className="size-5.25" />
                    Sign up with Porto
                  </>
                )}
              </span>
            </UiButton>
          </form>
        ) : (
          // If no sign up button, this means the user is already logged in, however
          // the user may want to sign in with a different passkey.
          <div className="flex w-full justify-between gap-2">
            <div>
              <span className="text-th_base-secondary">Using</span>{' '}
              {displayName}
            </div>
            <button
              className="text-th_link"
              onClick={() => {
                onApprove({ selectAccount: true, signIn: true })
              }}
              type="button"
            >
              Switch
            </button>
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

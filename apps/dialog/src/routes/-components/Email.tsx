import { Button, Input } from '@porto/apps/components'
import { Hooks } from 'porto/remote'
import * as React from 'react'
import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import { Permissions } from '~/routes/-components/Permissions'
import { StringFormatter } from '~/utils'
import LucideLogIn from '~icons/lucide/log-in'
import IconScanFace from '~icons/porto/scan-face'

export function Email(props: Email.Props) {
  const {
    actions = ['sign-in', 'sign-up'],
    defaultValue = '',
    loading,
    onApprove,
    permissions,
  } = props

  const [loadingTitle, setLoadingTitle] = React.useState('Signing up...')

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

  const onSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault()
      const formData = new FormData(event.target as HTMLFormElement)
      const email = formData.get('email')?.toString()
      setLoadingTitle('Signing up...')
      onApprove({ email, signIn: false })
    },
    [onApprove],
  )

  const content = React.useMemo(() => {
    if (cli) return undefined
    if (actions.includes('sign-in'))
      return (
        <>
          By continuing, you will be signed in as{' '}
          <span className="font-medium">{displayName}</span>
        </>
      )
    return (
      <>
        Create a <span className="font-medium text-accent">Porto</span> account
        to sign in to{' '}
        {hostname ? (
          <>
            <span className="font-medium">{hostname}</span> and more
          </>
        ) : (
          'this website'
        )}
        .
      </>
    )
  }, [actions, cli, displayName, hostname])

  return (
    <Layout loading={loading} loadingTitle={loadingTitle}>
      <Layout.Header className="flex-grow">
        <Layout.Header.Default
          content={content}
          icon={LucideLogIn}
          title={actions.includes('sign-up') ? 'Get started' : 'Sign in'}
        />
      </Layout.Header>

      <Permissions title="Permissions requested" {...permissions} />

      <div className="group flex min-h-[48px] w-full flex-col items-center justify-center space-y-3 px-3 pb-3">
        {actions.includes('sign-in') && (
          <Button
            className="flex w-full gap-2"
            data-testid="sign-in"
            onClick={() => {
              setLoadingTitle('Signing in...')
              onApprove({ signIn: true })
            }}
            type="button"
            variant="accent"
          >
            <IconScanFace className="size-5.25" />
            {actions.includes('sign-up') ? 'Sign in' : 'Continue'}
          </Button>
        )}

        {actions.includes('sign-up') ? (
          <form
            className="flex w-full flex-grow flex-col gap-2"
            onSubmit={onSubmit}
          >
            {/* If "Sign in" button is present, show the "First time?" text for sign up. */}
            {actions.includes('sign-in') && (
              <div className="-tracking-[2.8%] flex items-center whitespace-nowrap text-[12px] text-gray9 leading-[17px]">
                First time?
                <div className="ms-2 h-px w-full bg-gray4" />
              </div>
            )}
            <div className="relative flex items-center">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <Input
                className="w-full user-invalid:bg-gray3 user-invalid:ring-red9"
                defaultValue={defaultValue}
                name="email"
                placeholder="example@ithaca.xyz"
                type="email"
              />
              <div className="-tracking-[2.8%] absolute end-3 text-[12px] text-gray9 leading-normal">
                Optional
              </div>
            </div>
            <Button
              className="w-full gap-2 group-has-[:user-invalid]:cursor-not-allowed group-has-[:user-invalid]:text-gray10"
              data-testid="sign-up"
              type="submit"
              variant={actions.includes('sign-in') ? 'default' : 'accent'}
            >
              <span className="hidden group-has-[:user-invalid]:block">
                Invalid email
              </span>
              <span className="flex gap-2 group-has-[:user-invalid]:hidden">
                {!actions.includes('sign-in') && (
                  <IconScanFace className="size-5.25" />
                )}
                Create account
              </span>
            </Button>
          </form>
        ) : (
          // If no sign up button, this means the user is already logged in, however
          // the user may want to sign in with a different passkey.
          <Button
            className="flex w-full gap-2"
            onClick={() => {
              setLoadingTitle('Signing in...')
              onApprove({ selectAccount: true, signIn: true })
            }}
            type="button"
            variant="default"
          >
            Change account
          </Button>
        )}
      </div>
    </Layout>
  )
}

export namespace Email {
  export type Props = {
    actions?: readonly ('sign-in' | 'sign-up')[]
    defaultValue?: string | undefined
    loading: boolean
    onApprove: (p: {
      email?: string
      selectAccount?: boolean
      signIn?: boolean
    }) => void
    permissions?: Permissions.Props
  }
}

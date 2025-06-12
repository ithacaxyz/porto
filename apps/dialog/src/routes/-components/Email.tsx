import { Button, Input } from '@porto/apps/components'
import * as React from 'react'
import * as Dialog from '~/lib/Dialog'
import { Layout } from '~/routes/-components/Layout'
import { Permissions } from '~/routes/-components/Permissions'
import LucideLogIn from '~icons/lucide/log-in'
import IconScanFace from '~icons/porto/scan-face'

export function Email(props: Email.Props) {
  const { loading, onApprove, permissions, variant = 'sign-in' } = props

  const hostname = Dialog.useStore((state) => state.referrer?.url?.hostname)

  const onSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault()
      const formData = new FormData(event.target as HTMLFormElement)
      const email = formData.get('email')?.toString()
      onApprove({ email, signIn: false })
    },
    [onApprove],
  )

  return (
    <Layout loading={loading} loadingTitle="Signing up...">
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

      <div className="group flex min-h-[48px] w-full flex-col items-center justify-center space-y-3 px-3 pb-3">
        {variant === 'sign-in' && (
          <Button
            className="flex w-full gap-2"
            data-testid="sign-in"
            onClick={() => onApprove({ signIn: true })}
            type="button"
            variant="accent"
          >
            <IconScanFace className="size-5.25" />
            Sign in
          </Button>
        )}

        <form
          className="flex w-full flex-grow flex-col gap-2"
          onSubmit={onSubmit}
        >
          {variant === 'sign-in' && (
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
            variant={variant === 'sign-in' ? 'default' : 'accent'}
          >
            <span className="hidden group-has-[:user-invalid]:block">
              Invalid email
            </span>
            <span className="block group-has-[:user-invalid]:hidden">
              Create account
            </span>
          </Button>
        </form>
      </div>
    </Layout>
  )
}

export namespace Email {
  export type Props = {
    loading: boolean
    onApprove: (p: { email?: string; signIn?: boolean }) => void
    permissions?: Permissions.Props
    variant?: 'sign-in' | 'upgrade'
  }
}

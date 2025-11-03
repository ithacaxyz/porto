import { Input } from '@porto/apps/components'
import { Button } from '@porto/ui'
import { cx } from 'cva'
import * as React from 'react'
import type { GuestStatus } from '~/lib/guestMode'

export function GuestCheckoutSection(props: GuestCheckoutSection.Props) {
  const { guestStatus, onGuestSignIn, onGuestSignUp, label } = props

  const [invalid, setInvalid] = React.useState(false)

  const onSignUpSubmit = React.useCallback<
    React.FormEventHandler<HTMLFormElement>
  >(
    async (event) => {
      event.preventDefault()
      const formData = new FormData(event.target as HTMLFormElement)
      const email = String(formData.get('email'))
      onGuestSignUp(email)
    },
    [onGuestSignUp],
  )

  return (
    <div className="flex w-full flex-col gap-[8px] px-3">
      <Button
        data-testid="sign-in"
        disabled={guestStatus === 'signing-up'}
        loading={guestStatus === 'signing-in' && 'Signing in…'}
        onClick={onGuestSignIn}
        variant="primary"
        width="full"
      >
        {label ?? 'Sign in to proceed'}
      </Button>

      <div className="-tracking-[2.8%] flex items-center whitespace-nowrap text-[12px] text-th_base-secondary leading-[17px]">
        First time, or lost access?
        <div className="ms-2 h-px w-full bg-th_separator" />
      </div>

      <form
        className="flex w-full flex-col gap-2"
        onInvalid={(event) => {
          event.preventDefault()
          setInvalid(true)
        }}
        onSubmit={onSignUpSubmit}
      >
        <div className="relative flex items-center">
          <label className="sr-only" htmlFor="email">
            Email
          </label>
          <Input
            className={cx(
              'w-full bg-th_field',
              invalid && 'not-focus-visible:border-th_negative',
            )}
            disabled={guestStatus === 'signing-in'}
            name="email"
            onChange={() => setInvalid(false)}
            placeholder="example@ithaca.xyz"
            type="email"
          />
          <div className="-tracking-[2.8%] absolute end-3 text-[12px] text-th_base-secondary leading-normal">
            Optional
          </div>
        </div>
        <Button
          data-testid="sign-up"
          disabled={guestStatus === 'signing-in'}
          loading={guestStatus === 'signing-up' && 'Signing up…'}
          type="submit"
          variant="secondary"
          width="full"
        >
          {invalid ? 'Invalid email' : 'Create account'}
        </Button>
      </form>
    </div>
  )
}

export namespace GuestCheckoutSection {
  export type Props = {
    guestStatus: GuestStatus
    onGuestSignIn: () => void
    onGuestSignUp: (email?: string) => void
    label?: string
  }
}

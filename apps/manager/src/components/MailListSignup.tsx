import * as Ariakit from '@ariakit/react'
import { Spinner } from '@porto/apps/components'
import { cx } from 'cva'
import * as React from 'react'

import SendHorizontalIcon from '~icons/lucide/send-horizontal'
import XIcon from '~icons/lucide/x'

export function MailListSignup() {
  const store = Ariakit.useFormStore({
    defaultValues: {
      email: '',
    },
  })
  const [status, setStatus] = React.useState<
    'IDLE' | 'VALIDATING' | 'SUBMITTING' | 'VALID' | 'INVALID' | 'DONE'
  >('IDLE')

  const [focused, setFocused] = React.useState(false)

  store.useValidate((state) => {
    console.info(status)
    if (focused) return setStatus('VALID')
    const errors = Object.values(state.errors)
    if (state.validating) return setStatus('VALIDATING')
    if (state.submitting) return setStatus('SUBMITTING')
    return setStatus(errors.length ? 'INVALID' : 'VALID')
  })

  store.useSubmit(async (state) => {
    const { values, valid, validating } = state
    if (!valid || validating || status === 'DONE') return

    try {
      const response = await fetch('https://ithaca.xyz/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      })

      if (response.ok) throw new Error('Invalid email')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      console.error(errorMessage)
      store.setErrors((errors) => ({ ...errors, email: errorMessage }))
      setStatus('INVALID')
    }
  })

  return (
    <Ariakit.Form
      store={store}
      className="flex flex-row justify-between gap-x-2 rounded-full bg-gray3 px-3 py-2"
    >
      <img alt="icon" src="/icons/mushroom.svg" className="my-auto size-6" />
      <Ariakit.FormLabel
        name={store.names.email}
        className="my-auto mr-auto font-medium text-gray10 text-xs sm:text-base"
      >
        Power up your wallet!
      </Ariakit.FormLabel>
      <Ariakit.TooltipProvider>
        <Ariakit.TooltipAnchor
          className="link"
          render={(props) => {
            const error = store.getError('email')
            if (!error || status !== 'INVALID') return null
            return (
              <XIcon
                {...props}
                className="my-auto size-6 rounded-full bg-red3 p-1 text-red9"
              />
            )
          }}
        />
        <Ariakit.Tooltip className="tooltip">
          <Ariakit.FormError name={store.names.email} />
        </Ariakit.Tooltip>
      </Ariakit.TooltipProvider>
      <Ariakit.FormInput
        disabled
        type="email"
        required={true}
        name={store.names.email}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Get email updates…"
        className={cx(
          'w-[160px] rounded-full border border-gray8 bg-gray2 px-3 py-1 text-sm placeholder:text-gray10 aria-invalid:border-red8 sm:w-[250px]',
          'text-xs focus:outline-none focus:ring-2 focus:ring-blue9 sm:text-base',
        )}
      />
      <Ariakit.FormSubmit
        disabled
        clickOnEnter={true}
        className="rounded-full bg-gray5 p-2 sm:ml-1"
      >
        <span className="sr-only">Send</span>
        {status === 'SUBMITTING' ? (
          <Spinner className="size-5 animate-spin text-gray5 hover:cursor-wait" />
        ) : (
          <SendHorizontalIcon
            className={cx(
              'size-3.5 sm:size-5',
              status === 'VALID' ? 'text-blue9' : 'text-gray9',
            )}
          />
        )}
      </Ariakit.FormSubmit>
    </Ariakit.Form>
  )
}

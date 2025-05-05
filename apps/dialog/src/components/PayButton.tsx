import * as Ariakit from '@ariakit/react'
import { cx } from 'cva'
import AppleIcon from '~icons/basil/apple-solid'
import GoogleIcon from '~icons/devicon/google'
import ArrowRightIcon from '~icons/lucide/arrow-right'
import CardIcon from '~icons/lucide/credit-card'

/**
 * Google Pay guidelines:
 *   - https://developers.google.com/pay/api/web/guides/brand-guidelines
 *
 * Apple Pay guidelines:
 *   - https://developer.apple.com/documentation/ApplePayontheWeb#topics
 *   - https://applepaydemo.apple.com/
 */

export function PayButton(props: PayButton.Props) {
  const { variant, timeEstimate, ...buttonProps } = props

  const className =
    'px-3 h-10 w-full select-none rounded-lg bg-black py-1.5 font-semibold text-md flex flex-row items-center cursor-pointer!'

  if (variant === 'card')
    return (
      <Ariakit.Button
        data-id="onramp"
        {...buttonProps}
        className={cx(
          className,
          'border border-surface bg-surface text-left text-primary hover:not-active:bg-surfaceHover',
        )}
      >
        <CardIcon className="mr-2 inline size-6" />
        <span>Debit or Credit</span>
        <span className="ml-auto font-normal text-gray10 text-sm">
          ~{timeEstimate}
          <ArrowRightIcon className="ml-1 inline size-4" />
        </span>
      </Ariakit.Button>
    )

  return (
    <Ariakit.Button
      data-id="onramp"
      {...buttonProps}
      className={cx(
        className,
        'justify-center text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90',
      )}
    >
      <span>Pay with</span>
      {variant === 'apple' ? (
        <>
          <AppleIcon className="ml-1 inline size-5" />
          <span className="mt-0.5 text-lg">Pay</span>
        </>
      ) : (
        <>
          <GoogleIcon className="mr-0.5 ml-1.5 inline size-4.5" />
          <span className="text-lg">Pay</span>
        </>
      )}
    </Ariakit.Button>
  )
}

export declare namespace PayButton {
  type Props = React.ComponentPropsWithoutRef<'button'> & {
    variant: 'apple' | 'google' | 'card'
    timeEstimate?: 'instant' | `${number} mins` | undefined
  }
}

import * as Ariakit from '@ariakit/react'
import { Button } from '@porto/apps/components'
import { cx } from 'cva'

import AppleIcon from '~icons/basil/apple-solid'
import GoogleIcon from '~icons/devicon/google'

/**
 * A component that renders a provider-specific (e.g., Apple Pay, Google Pay) "Pay with" payment button.
 *
 * Google Pay guidelines:
 *   - https://developers.google.com/pay/api/web/guides/brand-guidelines
 *
 * Apple Pay guidelines:
 *   - https://developer.apple.com/documentation/ApplePayontheWeb#topics
 *   - https://applepaydemo.apple.com/
 *
 * Stripe-hosted guidelines:
 *   - https://docs.stripe.com/crypto/onramp/standalone-onramp-quickstart
 */
export function PayButton(props: PayButton.Props) {
  const { variant, url, ...rest } = props

  if (variant === 'stripe') {
    return (
      <Ariakit.Button
        className={cx(
          'flex h-button w-full cursor-pointer! flex-row items-center justify-center rounded-default px-5 font-[500] text-[16px]',
          'bg-gradient-to-r from-[#DCF1D9] via-[#BFFFE7] to-[#DCF1D9] text-[#000000] transition-all duration-300 hover:from-[#D0E5CD] hover:via-[#B3F3DB] hover:to-[#D0E5CD]',
        )}
        {...rest}
        // biome-ignore lint/a11y/useAnchorContent: AriaKit composition
        render={<a href={url} rel="noreferrer" target="_blank" />}
      >
        <span>
          Deposit with <span className="sr-only">Stripe Link</span>
        </span>
        <img
          alt="Stripe Link"
          className="mr-0.5 ml-1.5 inline size-13"
          src="/dialog/icons/stripe-link.svg"
        />
      </Ariakit.Button>
    )
  }
  return (
    <Button className="w-full cursor-pointer!" variant="invert">
      Pay with
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
    </Button>
  )
}

export declare namespace PayButton {
  type Props = React.ComponentPropsWithoutRef<'button'> & {
    variant: 'apple' | 'google' | 'stripe'
    url?: string | undefined
  }
}

import { Button } from '@porto/apps/components'

import AppleIcon from '~icons/basil/apple-solid'
import GoogleIcon from '~icons/devicon/google'

/**
 * A component that renders a provider-specific (e.g. Apple Pay, Google Pay) "Pay with" payment button.
 *
 * Google Pay guidelines:
 *   - https://developers.google.com/pay/api/web/guides/brand-guidelines
 *
 * Apple Pay guidelines:
 *   - https://developer.apple.com/documentation/ApplePayontheWeb#topics
 *   - https://applepaydemo.apple.com/
 */
export function PayButton(props: PayButton.Props) {
  const { variant } = props

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
    variant: 'apple' | 'google'
  }
}

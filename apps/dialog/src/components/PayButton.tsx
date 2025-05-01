import * as Ariakit from '@ariakit/react'
import { cx } from 'cva'
import AppleIcon from '~icons/basil/apple-solid'
import GoogleIcon from '~icons/devicon/google'
import RightArrowIcon from '~icons/lucide/arrow-right'
import CardIcon from '~icons/lucide/credit-card'

export function PayButton(props: PayButton.Props) {
  const { variant, timeEstimate, ...buttonProps } = props

  const className =
    'px-3 max-w-[300px] h-10.5 w-full select-none rounded-lg bg-black py-1.5 font-semibold text-md flex flex-row items-center'

  if (variant === 'card')
    return (
      <Ariakit.Button
        {...buttonProps}
        className={cx(
          className,
          'border border-surface bg-surface text-left text-primary text-surface hover:not-active:bg-surfaceHover',
        )}
      >
        <CardIcon className="mr-2 inline size-6" />
        <span>Debit or Credit</span>
        <span className="ml-auto font-normal text-gray10 text-sm">
          {timeEstimate}
          <RightArrowIcon className="ml-1 inline size-5" />
        </span>
      </Ariakit.Button>
    )

  return (
    <Ariakit.Button
      {...buttonProps}
      className={cx(
        className,
        'justify-center gap-1 text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90',
      )}
    >
      <span>Pay with</span>
      {variant === 'apple' ? (
        <AppleIcon className="ml-1 inline size-5" />
      ) : (
        <GoogleIcon className="ml-1 inline size-5" />
      )}
      <span>Pay</span>
    </Ariakit.Button>
  )
}

export declare namespace PayButton {
  type Props = React.ComponentPropsWithoutRef<'button'> & {
    variant: 'apple' | 'google' | 'card'
    timeEstimate?: 'instant' | `${number} mins`
  }
}

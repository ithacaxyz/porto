import { type VariantProps, cva } from 'cva'
import * as React from 'react'

export function Button(props: Button.Props) {
  const { className, disabled, size, variant, asChild = false, ...rest } = props
  return (
    <button
      className={Button.className({ className, disabled, size, variant })}
      disabled={disabled ?? false}
      {...rest}
    />
  )
}

export const ButtonWithRef = React.forwardRef<HTMLButtonElement, Button.Props>(
  (props, ref) => {
    const {
      className,
      disabled,
      size,
      variant,
      asChild = false,
      ...rest
    } = props
    return (
      <button
        ref={ref}
        className={Button.className({ className, disabled, size, variant })}
        disabled={disabled ?? false}
        {...rest}
      />
    )
  },
)

export namespace Button {
  export const displayName = 'Button'

  export interface Props
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
      VariantProps<typeof className> {
    asChild?: boolean
  }

  export const className = cva(
    'inline-flex items-center justify-center rounded-default whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
      variants: {
        variant: {
          default:
            'text-primary bg-surface hover:not-active:bg-surfaceHover text-surface border border-surface',
          default2:
            'text-primary bg-gray5 hover:not-active:bg-gray7 text-surface border border-surface',
          ghost:
            'text-primary bg-transparent hover:not-active:bg-surfaceHover border border-gray8 hover:border-gray9 hover:active:border-gray10',
          invert: 'text-invert bg-invert hover:not-active:bg-invertHover',
          accent: 'text-white bg-accent hover:not-active:bg-accentHover',
          destructive:
            'text-destructive bg-destructive hover:not-active:bg-destructiveHover',
          success: 'text-white bg-success hover:not-active:bg-successHover',
          warning: 'text-white bg-warning hover:not-active:bg-warningHover',
        },
        disabled: {
          true: 'pointer-events-none opacity-50',
        },
        size: {
          default: 'h-button px-5 text-[15px]',
          sm: 'h-11 px-4 text-[15px]',
          lg: 'h-13 px-6 text-[17px]',
          xl: 'h-15 px-8 text-[19px]',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    },
  )
}

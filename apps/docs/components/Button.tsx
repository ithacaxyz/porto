import { cva, type VariantProps } from 'cva'
import type * as React from 'react'

export function Button(props: Button.Props) {
  const {
    className,
    disabled,
    size,
    static: static_,
    variant,
    asChild = false,
    ...rest
  } = props
  return (
    <button
      className={Button.className({
        className,
        disabled,
        size,
        static: static_,
        variant,
      })}
      {...rest}
    />
  )
}

export namespace Button {
  export const displayName = 'Button'

  export interface Props
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
      VariantProps<typeof className> {
    asChild?: boolean
  }

  export const className = cva(
    'inline-flex relative items-center justify-center rounded-default whitespace-nowrap font-[400] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
      defaultVariants: {
        size: 'default',
        variant: 'default',
      },
      variants: {
        disabled: {
          true: 'pointer-events-none opacity-50',
        },
        size: {
          default: 'h-[40px] px-[18px]',
          small: 'h-[32px] px-[14px] text-[13px]',
        },
        static: {
          true: 'pointer-events-none',
        },
        variant: {
          accent: 'text-white bg-accent hover:not-active:bg-accentHover',
          accentTint:
            'text-accent bg-accentTint hover:not-active:bg-accentTintHover',
          default:
            'text-primary bg-surface hover:not-active:bg-surfaceHover text-surface border border-surface',
          destructive:
            'text-destructive bg-destructive hover:not-active:bg-destructiveHover',
          ghost: 'text-primary bg-transparent hover:not-active:bg-surfaceHover',
          invert: 'text-invert bg-invert hover:not-active:bg-invertHover',
        },
      },
    },
  )
}

import { type VariantProps, cva } from 'cva'
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
    'inline-flex items-center justify-center rounded-default whitespace-nowrap font-[400] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
      variants: {
        disabled: {
          true: 'pointer-events-none opacity-50',
        },
        static: {
          true: 'pointer-events-none',
        },
        variant: {
          default:
            'text-primary bg-surface hover:not-active:bg-surfaceHover text-surface border border-surface',
          accent: 'text-white bg-accent hover:not-active:bg-accentHover',
          accentTint:
            'text-accent bg-accentTint hover:not-active:bg-accentTintHover',
          destructive:
            'text-destructive bg-destructive hover:not-active:bg-destructiveHover',
        },
        size: {
          small: 'h-[32px] px-[14px] text-[13px]',
          default: 'h-[40px] px-[18px] text-[15px]',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    },
  )
}

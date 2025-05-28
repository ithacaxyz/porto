import { cva, type VariantProps } from 'cva'
import type * as React from 'react'
import { cloneElement } from 'react'

export function Button(props: Button.Props) {
  const {
    className,
    disabled,
    render,
    size,
    static: static_,
    variant,
    ...rest
  } = props
  const Element = render
    ? (props: Button.Props) => cloneElement(render, props)
    : 'button'
  return (
    <Element
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
    render?: React.ReactElement
  }

  export const className = cva(
    'relative inline-flex items-center justify-center whitespace-nowrap rounded-default font-[400] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
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
          accent: 'bg-accent text-white hover:not-active:bg-accentHover',
          accentTint:
            'bg-accentTint text-accent hover:not-active:bg-accentTintHover',
          default:
            'border border-surface bg-surface text-primary text-surface hover:not-active:bg-surfaceHover',
          destructive:
            'bg-destructive text-destructive hover:not-active:bg-destructiveHover',
          ghost: 'bg-transparent text-primary hover:not-active:bg-surfaceHover',
          invert: 'bg-invert text-invert hover:not-active:bg-invertHover',
        },
      },
    },
  )
}

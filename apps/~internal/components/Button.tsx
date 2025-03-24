import { type VariantProps, cva } from 'cva'
import { cloneElement } from 'react'

export function Button(props: Button.Props) {
  const { className, disabled, size, render, variant, ...rest } = props
  const Element = render
    ? (props: Button.Props) => cloneElement(render, props)
    : 'button'
  return (
    <Element
      className={Button.className({ className, disabled, size, variant })}
      disabled={disabled ?? false}
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
    'inline-flex items-center justify-center rounded-default whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
      variants: {
        variant: {
          default:
            'text-primary bg-surface hover:not-active:bg-surfaceHover text-surface border border-surface',
          outline:
            'text-primary bg-transparent hover:not-active:bg-primaryHover border border-gray6',
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
          square: 'size-[var(--height-button)] text-[15px]',
          small: 'h-[28px] px-2 text-[13px]',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    },
  )
}

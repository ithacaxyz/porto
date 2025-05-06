import { cva, type VariantProps } from 'cva'
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
    'inline-flex items-center justify-center whitespace-nowrap rounded-default border border-transparent font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
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
          default: 'h-button px-5 text-[15px]',
          small: 'h-[28px] px-2 text-[13px]',
          square: 'size-[var(--height-button)] text-[15px]',
        },
        variant: {
          accent:
            'border border-accent bg-accent text-white hover:not-active:border-accentHover hover:not-active:bg-accentHover',
          default:
            'border border-surface bg-surface text-primary text-surface hover:not-active:bg-surfaceHover',
          destructive:
            'bg-destructive text-destructive hover:not-active:bg-destructiveHover',
          invert: 'bg-invert text-invert hover:not-active:bg-invertHover',
          outline:
            'border border-gray6 bg-transparent text-primary hover:not-active:bg-primaryHover',
          success: 'bg-success text-white hover:not-active:bg-successHover',
          violet: 'bg-violet text-white hover:not-active:bg-violetHover',
          warning: 'bg-warning text-white hover:not-active:bg-warningHover',
        },
      },
    },
  )
}

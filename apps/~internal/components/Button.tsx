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
            'border border-th_primary bg-th_primary text-th_primary hover:not-active:border-th_primary-hovered hover:not-active:bg-th_primary-hovered',
          default:
            'border border-th_secondary bg-th_secondary text-th_secondary hover:not-active:border-th_secondary-hovered hover:not-active:bg-th_secondary-hovered',
          destructive:
            'bg-destructive text-destructive hover:not-active:bg-destructiveHover',
          invert: 'bg-invert text-invert hover:not-active:bg-invertHover',
          outline:
            'border border-gray6 bg-transparent text-th_base hover:not-active:bg-th_base-hovered',
          primary:
            'border border-th_primary bg-th_primary text-th_primary hover:not-active:border-th_primary-hovered hover:not-active:bg-th_primary-hovered',
          success: 'bg-success text-white hover:not-active:bg-successHover',
          warning: 'bg-warning text-white hover:not-active:bg-warningHover',
        },
      },
    },
  )
}

import { type VariantProps, cva } from 'cva'
import type * as React from 'react'

export function Button(props: Button.Props) {
  const { className, size, variant, asChild = false, ...rest } = props
  return (
    <button
      className={Button.className({ className, size, variant })}
      {...rest}
    />
  )
}

export namespace Button {
  export const displayName = 'Button'

  export interface Props
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof className> {
    asChild?: boolean
  }

  export const className = cva(
    'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
      variants: {
        variant: {
          default:
            'text-gray12 bg-blackA1 dark:bg-whiteA1 border border-blackA1 dark:border-whiteA1',
          primary: 'text-white bg-blue10',
        },
        size: {
          default: 'h-9 px-5 rounded-lg text-[15px]',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    },
  )
}

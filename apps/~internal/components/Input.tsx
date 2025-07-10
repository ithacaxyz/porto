import { cva, type VariantProps } from 'cva'

export function Input(props: Input.Props) {
  const { className, disabled, size, variant, ...rest } = props
  return (
    <input
      className={Input.className({ className, disabled, size, variant })}
      disabled={disabled ?? false}
      {...rest}
    />
  )
}

export namespace Input {
  export const displayName = 'Input'

  export interface Props
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'disabled' | 'size'
      >,
      VariantProps<typeof className> {}

  export const className = cva(
    'inline-flex items-center justify-center rounded-default border border-gray3 font-medium ring-blue6 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
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
          default: '-tracking-[2.8%] h-10 px-3 text-[15px]',
        },
        variant: {
          default: 'border bg-transparent text-gray12 placeholder:text-gray8',
        },
      },
    },
  )
}

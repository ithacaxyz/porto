import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { css, cx } from '../../styled-system/css'

export interface TextButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

export function TextButton({ children, className, ...props }: TextButtonProps) {
  return (
    <button
      type="button"
      className={cx(
        css({
          _active: {
            transform: 'translateY(1px)',
          },
          _focusVisible: {
            outline: '2px solid var(--color-th_focus)',
            outlineOffset: 2,
          },
          color: 'inherit',
          fontSize: 'inherit',
          cursor: 'pointer!',
          borderRadius: 2,
          whiteSpace: 'nowrap',
        }),
      )}
      {...props}
    >
      {children}
    </button>
  )
}

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { css, cx } from '../../styled-system/css'

export interface TextButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

export function TextButton({ children, className, ...props }: TextButtonProps) {
  return (
    <button
      className={cx(
        css({
          _active: {
            transform: 'translateY(1px)',
          },
          _focusVisible: {
            outline: '2px solid var(--color-th_focus)',
            outlineOffset: 2,
          },
          borderRadius: 2,
          color: 'inherit',
          cursor: 'pointer!',
          fontSize: 'inherit',
          whiteSpace: 'nowrap',
        }),
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

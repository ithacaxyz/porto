import type { ButtonHTMLAttributes } from 'react'
import { css, cx } from '../../styled-system/css'

export function ButtonArea({
  children,
  className,
  type = 'button',
  ...props
}: ButtonArea.Props) {
  return (
    <button
      className={cx(
        css({
          _active: {
            transform: 'translateY(1px)',
          },
          _disabled: {
            pointerEvents: 'none',
          },
          _focusVisible: {
            outline: '2px solid var(--color-th_focus)',
          },
          cursor: 'pointer!',
          display: 'inline-flex',
          flex: '0 0 auto',
          outlineOffset: 2,
        }),
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

export namespace ButtonArea {
  export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}
}

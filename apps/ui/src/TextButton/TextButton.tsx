import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { css, cx } from '../../styled-system/css'

export function TextButton({
  children,
  className,
  color = 'inherit',
  style,
  ...props
}: TextButton.Props) {
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
        className,
      )}
      style={{
        color: TextButton.isSpecialColor(color)
          ? TextButton.specialColors[color]
          : color,
        ...style,
      }}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

export namespace TextButton {
  export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode
    color?: keyof typeof specialColors | (string & {}) | undefined
  }

  export const specialColors = {
    link: 'var(--color-th_link)',
  } as const

  export function isSpecialColor(
    color: string,
  ): color is keyof typeof specialColors {
    return Object.hasOwn(specialColors, color)
  }
}

import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { css, cx } from '../../styled-system/css'

const buttonAreaStyles = css({
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
})

export function ButtonArea({
  children,
  className,
  type = 'button',
  ...props
}: ButtonArea.Props) {
  return (
    <button className={cx(buttonAreaStyles, className)} type={type} {...props}>
      {children}
    </button>
  )
}

export namespace ButtonArea {
  export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

  export function Anchor({
    children,
    className,
    external,
    href,
    ...props
  }: Anchor.Props) {
    return (
      <a
        className={cx(buttonAreaStyles, className)}
        href={href}
        rel={external ? 'noopener noreferrer' : undefined}
        target={external ? '_blank' : undefined}
        {...props}
      >
        {children}
      </a>
    )
  }

  export namespace Anchor {
    export interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
      external?: boolean
      href: string
    }
  }
}

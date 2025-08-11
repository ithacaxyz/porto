import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { css, cva, cx } from '../../styled-system/css'
import { Frame } from '../Frame/Frame.js'

type ButtonSize = 'small' | 'medium' | 'large'

export function Button({
  children,
  className,
  disabled,
  icon,
  shape = 'normal',
  size,
  variant = 'secondary',
  wide,
  ...props
}: Button.Props) {
  const frame = Frame.useFrame(true)
  size ??= { dialog: 'medium', full: 'large' }
  return (
    <button
      className={cx(
        css({
          _active: {
            transform: 'translateY(1px)',
          },
          _dark: {
            '&:hover:not(:disabled)': {
              backgroundColor: 'hsl(from var(--button-bg) h s calc(l + 2))',
              borderColor: 'hsl(from var(--button-bd) h s calc(l + 2))',
            },
          },
          _disabled: {
            backgroundColor: 'var(--background-color-th_disabled)',
            borderColor: 'var(--border-color-th_disabled)',
            color: 'var(--text-color-th_disabled)',
            pointerEvents: 'none',
          },
          _focusVisible: {
            outline: '2px solid var(--color-th_focus)',
            outlineOffset: 2,
          },
          '&:hover:not(:disabled)': {
            backgroundColor: 'hsl(from var(--button-bg) h s calc(l - 2))',
            borderColor: 'hsl(from var(--button-bd) h s calc(l - 2))',
          },
          alignItems: 'center',
          backgroundColor: 'var(--button-bg)',
          border: '1px solid transparent',
          borderColor: 'var(--button-bd)',
          borderRadius: 'var(--radius-th_medium)',
          cursor: 'pointer!',
          display: 'inline-flex',
          gap: 8,
          justifyContent: 'center',
          whiteSpace: 'nowrap',
        }),
        cva({
          variants: {
            buttonVariant: {
              negative: {
                '--button-bd': 'var(--border-color-th_negative)',
                '--button-bg': 'var(--background-color-th_negative)',
                color: 'var(--text-color-th_negative)',
              },
              'negative-secondary': {
                '--button-bd': 'var(--border-color-th_negative-secondary)',
                '--button-bg': 'var(--background-color-th_negative-secondary)',
                color: 'var(--text-color-th_negative-secondary)',
              },
              positive: {
                '--button-bd': 'var(--border-color-th_positive)',
                '--button-bg': 'var(--background-color-th_positive)',
                color: 'var(--text-color-th_positive)',
              },
              primary: {
                '--button-bd': 'var(--border-color-th_primary)',
                '--button-bg': 'var(--background-color-th_primary)',
                color: 'var(--text-color-th_primary)',
              },
              secondary: {
                '--button-bd': 'var(--border-color-th_secondary)',
                '--button-bg': 'var(--background-color-th_secondary)',
                color: 'var(--text-color-th_secondary)',
              },
              strong: {
                '--button-bd': 'var(--border-color-th_strong)',
                '--button-bg': 'var(--background-color-th_strong)',
                color: 'var(--text-color-th_strong)',
              },
            },
            size: {
              large: {
                borderRadius: 26,
                fontSize: 18,
                height: 52,
                paddingInline: 20,
              },
              medium: {
                borderRadius: 8,
                fontSize: 15,
                height: 38,
                paddingInline: 16,
              },
              small: {
                borderRadius: 6,
                fontSize: 13,
                height: 28,
                paddingInline: 8,
              },
            },
          },
        })({
          buttonVariant: variant,
          size:
            typeof size === 'string'
              ? size
              : (frame && size[frame.mode]) || 'medium',
        }),
        wide && css({ width: '100%' }),
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

export namespace Button {
  export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode
    size?: ButtonSize | Record<Frame.Mode, ButtonSize>
    variant?:
      | 'negative'
      | 'negative-secondary'
      | 'positive'
      | 'primary'
      | 'secondary'
      | 'strong'
    shape?: 'normal' | 'square' // TODO: implement
    wide?: boolean
  }
}

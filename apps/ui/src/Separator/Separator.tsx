import type { HTMLAttributes } from 'react'
import { css, cx } from '../../styled-system/css'
import { Frame } from '../Frame/Frame.js'

export function Separator({
  label,
  className,
  position = 'start',
  size,
  spacing,
  ...props
}: Separator.Props) {
  const frame = Frame.useFrame(true)
  const mode = frame?.mode ?? 'dialog'
  size ??= mode === 'dialog' ? 'small' : 'medium'

  return (
    <div
      className={cx(
        css({
          alignItems: 'center',
          color: 'var(--text-color-th_base-secondary)',
          display: 'flex',
          letterSpacing: -0.5,
          userSelect: 'none',
          whiteSpace: 'nowrap',
          width: '100%',
        }),
        size === 'small' &&
          css({
            fontSize: 12,
            gap: 8,
          }),
        size === 'medium' &&
          css({
            fontSize: 14,
            gap: 12,
          }),
        className,
      )}
      style={{
        paddingBlock: spacing ?? (size === 'small' ? 8 : 16),
      }}
      {...props}
    >
      {position === 'center' && (
        <div
          className={css({
            backgroundColor: 'var(--color-th_separator)',
            height: 1,
            width: '100%',
          })}
        />
      )}
      {label}
      <div
        className={css({
          backgroundColor: 'var(--color-th_separator)',
          height: 1,
          width: '100%',
        })}
      />
    </div>
  )
}

export namespace Separator {
  export interface Props extends HTMLAttributes<HTMLDivElement> {
    label?: string
    position?: 'start' | 'center'
    size?: 'small' | 'medium'
    spacing?: number
  }
}

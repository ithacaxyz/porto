import type { InputHTMLAttributes, ReactNode } from 'react'
import { css, cva, cx } from '../../styled-system/css'
import type { FrameMode } from '../Frame/Frame.js'
import { Frame } from '../Frame/Frame.js'

type InputSize = 'medium' | 'large'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  contextual?: ReactNode
  size?: InputSize | Record<FrameMode, InputSize>
  variant?: 'negative' | 'primary' | 'secondary'
}

export function Input({
  autoComplete,
  className,
  contextual,
  disabled,
  size,
  ...props
}: InputProps) {
  const mode = Frame.useMode()
  size ??= { dialog: 'medium', full: 'large' }
  return (
    <div
      className={cx(
        css({
          _focusWithin: {
            outline: '2px solid var(--color-th_focus)',
            outlineOffset: -1,
          },
          backgroundColor: 'var(--background-color-th_field)',
          border: '1px solid var(--border-color-th_field)',
          borderRadius: 'var(--radius-th_medium)',
          color: 'var(--text-color-th_field)',
          display: 'inline-flex',
          position: 'relative',
          width: '100%',
        }),
        cva({
          variants: {
            size: {
              large: {
                borderRadius: 26,
                fontSize: 18,
                height: 52,
              },
              medium: {
                borderRadius: 8,
                fontSize: 15,
                height: 36,
              },
            },
          },
        })({
          size: typeof size === 'string' ? size : (size[mode] ?? 'medium'),
        }),
        disabled &&
          css({
            backgroundColor: 'var(--background-color-th_disabled)',
            borderColor: 'var(--border-color-th_disabled)',
            color: 'var(--text-color-th_disabled)',
            pointerEvents: 'none',
          }),
      )}
    >
      <input
        className={cx(
          css({
            _focus: {
              outline: 'none',
            },
            '&::placeholder': {
              color: 'var(--text-color-th_field-tertiary)',
            },
            alignItems: 'center',
            color: 'inherit',
            display: 'flex',
            flex: '1 1 auto',
            fontSize: 'inherit',
            height: '100%',
            minWidth: 0,
          }),
          cva({
            variants: {
              size: {
                large: {
                  paddingInline: 20,
                },
                medium: {
                  paddingInline: 16,
                },
              },
            },
          })({
            size: typeof size === 'string' ? size : (size[mode] ?? 'medium'),
          }),
          className,
        )}
        data-1p-ignore={autoComplete === 'off' ? true : undefined}
        disabled={disabled}
        {...props}
      />
      {contextual && (
        <div
          className={cx(
            css({
              alignItems: 'center',
              color: 'var(--text-color-th_field-secondary)',
              display: 'flex',
              height: '100%',
            }),
            mode === 'dialog' &&
              css({
                fontSize: 12,
                paddingRight: 16,
              }),
            mode === 'full' &&
              css({
                fontSize: 13,
                paddingRight: 20,
              }),
          )}
        >
          {contextual}
        </div>
      )}
    </div>
  )
}

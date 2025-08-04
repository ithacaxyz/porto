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
  className,
  contextual,
  disabled,
  size,
  ...props
}: InputProps) {
  const mode = Frame.useMode()
  if (!size) size = { dialog: 'medium', full: 'large' }
  return (
    <div
      className={cx(
        css({
          display: 'inline-flex',
          width: '100%',
          position: 'relative',
          backgroundColor: 'var(--background-color-th_field)',
          border: '1px solid var(--border-color-th_field)',
          borderRadius: 'var(--radius-th_medium)',
          color: 'var(--text-color-th_field)',
          _focusWithin: {
            outline: '2px solid var(--color-th_focus)',
            outlineOffset: -1,
          },
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
            '&::placeholder': {
              color: 'var(--text-color-th_field-tertiary)',
            },
            _focus: {
              outline: 'none',
            },
            flex: '1 1 auto',
            minWidth: 0,
            height: '100%',
            alignItems: 'center',
            display: 'flex',
            color: 'inherit',
            fontSize: 'inherit',
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
        disabled={disabled}
        {...props}
      />
      {contextual && (
        <div
          className={cx(
            css({
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              color: 'var(--text-color-th_field-secondary)',
            }),
            mode === 'dialog' &&
              css({
                paddingRight: 16,
                fontSize: 12,
              }),
            mode === 'full' &&
              css({
                paddingRight: 20,
                fontSize: 13,
              }),
          )}
        >
          {contextual}
        </div>
      )}
    </div>
  )
}

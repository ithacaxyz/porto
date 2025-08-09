import type { InputHTMLAttributes, ReactNode, RefObject } from 'react'
import { useState, useRef } from 'react'
import { css, cva, cx } from '../../styled-system/css'
import type { FrameMode } from '../Frame/Frame.js'
import { Frame } from '../Frame/Frame.js'
import { TextButton } from '../TextButton/TextButton.js'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  adornments?: {
    end?: Adornment
    start?: Adornment
  }
  onChange: (value: string) => void
  removeCompletion?: boolean
  size?: InputSize | Record<FrameMode, InputSize>
  variant?: 'negative' | 'primary' | 'secondary'
  value: string
  formatValue?: (value: string) => string
}

type InputSize = 'medium' | 'large'

type AdornmentFill = {
  type: 'fill'
  value: string
  label: ReactNode
}

function isAdornmentFill(
  adornment: ReactNode | AdornmentFill,
): adornment is AdornmentFill {
  return (
    typeof adornment === 'object' &&
    adornment !== null &&
    'type' in adornment &&
    adornment.type === 'fill'
  )
}

type Adornment = ReactNode | AdornmentFill

export function Input({
  adornments,
  className,
  disabled,
  onChange,
  removeCompletion = true,
  size,
  value,
  formatValue,
  ...props
}: InputProps) {
  const { mode } = Frame.useFrame()
  size ??= { dialog: 'medium', full: 'large' }

  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      className={cx(
        css({
          backgroundColor: 'var(--background-color-th_field)',
          border: '1px solid var(--border-color-th_field)',
          borderRadius: 'var(--radius-th_medium)',
          color: 'var(--text-color-th_field)',
          display: 'inline-flex',
          position: 'relative',
          width: '100%',
        }),
        isFocused &&
          css({
            outline: '2px solid var(--color-th_focus)',
            outlineOffset: -1,
          }),
        cva({
          variants: {
            size: {
              large: {
                borderRadius: 26,
                fontSize: 18,
                height: 52,
                '--input-padding-inline': '20px',
                '--adornment-font-size': 13,
              },
              medium: {
                borderRadius: 8,
                fontSize: 15,
                height: 38,
                '--input-padding-inline': '16px',
                '--adornment-font-size': 12,
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
      {adornments?.start && (
        <Adornment
          adornment={adornments.start}
          inputRef={inputRef}
          onChange={onChange}
          position="start"
        />
      )}
      <input
        ref={inputRef}
        autoCapitalize={removeCompletion ? 'off' : undefined}
        autoComplete={removeCompletion ? 'off' : undefined}
        autoCorrect={removeCompletion ? 'off' : undefined}
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
          !adornments?.start &&
            css({ paddingLeft: 'var(--input-padding-inline)' }),
          !adornments?.end &&
            css({ paddingRight: 'var(--input-padding-inline)' }),
          className,
        )}
        data-1p-ignore={removeCompletion ? true : undefined}
        disabled={disabled}
        spellCheck={removeCompletion ? false : undefined}
        onChange={(event) => {
          onChange(event.target.value)
        }}
        value={isFocused || !formatValue ? value : formatValue(value)}
        {...props}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
      />
      {adornments?.end && (
        <Adornment
          adornment={adornments.end}
          inputRef={inputRef}
          onChange={onChange}
          position="end"
        />
      )}
    </div>
  )
}

function Adornment({
  adornment,
  inputRef,
  onChange,
  position,
}: {
  adornment: Adornment
  inputRef: RefObject<HTMLInputElement | null>
  onChange: (value: string) => void
  position: 'start' | 'end'
}) {
  return (
    <div
      className={cx(
        css({
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          paddingInline: 'var(--input-padding-inline)',
          fontSize: 'var(--adornment-font-size)',
        }),
        position === 'start' &&
          css({
            color: 'inherit',
            paddingRight: 0,
          }),
        position === 'end' &&
          css({
            color: 'var(--text-color-th_field-secondary)',
            paddingLeft: 0,
          }),
      )}
    >
      {isAdornmentFill(adornment) ? (
        <TextButton
          onClick={() => {
            onChange(adornment.value)
            inputRef.current?.focus()
          }}
        >
          {adornment.label}
        </TextButton>
      ) : (
        adornment
      )}
    </div>
  )
}

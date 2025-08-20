import type { InputHTMLAttributes, ReactNode, RefObject } from 'react'
import { useRef, useState } from 'react'
import { css, cva, cx } from '../../styled-system/css'
import { Frame } from '../Frame/Frame.js'
import { TextButton } from '../TextButton/TextButton.js'

export function Input({
  adornments,
  className,
  disabled,
  invalid,
  onChange,
  removeCompletion = true,
  size = { dialog: 'medium', full: 'large' },
  value,
  formatValue,
  ...props
}: Input.Props) {
  const frame = Frame.useFrame(true)
  const mode = frame?.mode ?? 'dialog'

  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      className={cx(
        css({
          '&:has(input:focus-visible)': {
            outline: '2px solid var(--color-th_focus)',
            outlineOffset: -1,
          },
          '&:is(div):has(input:invalid, input[aria-invalid="true"])': {
            outline: '2px solid var(--border-color-th_field-error)',
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
                '--adornment-font-size': 13,
                '--input-padding-inline': '20px',
                borderRadius: 26,
                fontSize: 18,
                height: 52,
              },
              medium: {
                '--adornment-font-size': 12,
                '--input-padding-inline': '16px',
                borderRadius: 8,
                fontSize: 15,
                height: 38,
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
            color: 'var(--text-color-th_disabled)!',
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
        aria-invalid={invalid ? 'true' : undefined}
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
            background: 'transparent',
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
        onChange={(event) => {
          onChange(event.target.value)
        }}
        ref={inputRef}
        spellCheck={removeCompletion ? false : undefined}
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
  adornment: Input.Adornment
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
          fontSize: 'var(--adornment-font-size)',
          height: '100%',
          paddingInline: 'var(--input-padding-inline)',
          whiteSpace: 'nowrap',
        }),
        position === 'start' &&
          css({
            color: 'inherit',
            paddingRight: 4,
          }),
        position === 'end' &&
          css({
            color: 'var(--text-color-th_field-secondary)',
            paddingLeft: 4,
          }),
      )}
    >
      {Input.isAdornmentFill(adornment) ? (
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

export namespace Input {
  export interface Props
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
    adornments?: { end?: Adornment; start?: Adornment }
    formatValue?: (value: string) => string
    invalid?: boolean
    onChange: (value: string) => void
    removeCompletion?: boolean
    size?: Size | Record<Frame.ModeName, Size>
    value: string
    variant?: 'negative' | 'primary' | 'secondary'
  }

  export type Size = 'medium' | 'large'

  export type AdornmentFill = {
    type: 'fill'
    value: string
    label: ReactNode
  }

  export function isAdornmentFill(
    adornment: ReactNode | AdornmentFill,
  ): adornment is AdornmentFill {
    return (
      typeof adornment === 'object' &&
      adornment !== null &&
      'type' in adornment &&
      adornment.type === 'fill'
    )
  }

  export type Adornment = ReactNode | AdornmentFill
}

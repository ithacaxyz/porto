import type { InputHTMLAttributes, ReactNode, RefObject } from 'react'
import { useMemo, useRef, useState } from 'react'
import LucideCheck from '~icons/lucide/check'
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
  value: value_,
  formatValue,
  onFocus,
  onBlur,
  ...props
}: Input.Props) {
  const frame = Frame.useFrame(true)
  const mode = frame?.mode ?? 'dialog'

  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { adornmentStart, value } = Input.useExtractPhonePrefix(
    adornments?.start,
    isFocused,
    value_,
  )

  return (
    <div
      className={cx(
        css({
          '&:has(input:focus-visible)': {
            outline: '2px solid var(--color-th_focus)',
            outlineOffset: -1,
          },
          '&:is(div):has(input:invalid, input[aria-invalid="true"])': {
            borderColor: 'var(--border-color-th_field-error)',
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
      <Adornment
        adornment={adornmentStart}
        inputRef={inputRef}
        onChange={onChange}
        position="start"
      />
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
          !adornments?.end &&
            css({
              paddingRight: 'var(--input-padding-inline)',
            }),
          !adornmentStart &&
            css({
              paddingLeft: 'var(--input-padding-inline)',
            }),
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
        onBlur={(e) => {
          setIsFocused(false)
          onBlur?.(e)
        }}
        onFocus={(e) => {
          setIsFocused(true)
          onFocus?.(e)
        }}
      />
      <Adornment
        adornment={adornments?.end}
        inputRef={inputRef}
        onChange={onChange}
        position="end"
      />
    </div>
  )
}

function Adornment({
  adornment,
  inputRef,
  onChange,
  position,
}: {
  adornment?: Input.Adornment | undefined
  inputRef: RefObject<HTMLInputElement | null>
  onChange: (value: string) => void
  position: 'start' | 'end'
}) {
  if (!adornment) return null
  if (Input.isAdornmentPhonePrefix(adornment)) return null
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
        position === 'end' &&
          Input.isAdornmentValid(adornment) &&
          css({ paddingRight: 14 }),
        Input.isAdornmentSolid(adornment) &&
          (position === 'start'
            ? css({ paddingLeft: 0, paddingRight: 8 })
            : css({ paddingLeft: 8, paddingRight: 0 })),
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
      ) : Input.isAdornmentRequired(adornment) ? (
        <div
          className={css({
            color: 'var(--text-color-th_field-tertiary)',
            fontSize: 12,
          })}
        >
          {adornment.label ?? 'Required'}
        </div>
      ) : Input.isAdornmentSolid(adornment) ? (
        <div
          className={css({
            alignItems: 'center',
            borderRight: '1px solid var(--border-color-th_field)',
            color: 'var(--text-color-th_field-secondary)',
            display: 'flex',
            fontWeight: 500,
            height: '100%',
            paddingLeft: 12,
            paddingRight: 12,
          })}
        >
          {adornment.label}
        </div>
      ) : Input.isAdornmentValid(adornment) ? (
        <div
          className={css({
            alignItems: 'center',
            color: 'var(--text-color-th_base-positive)',
            display: 'flex',
            fontSize: 12,
          })}
        >
          {adornment.label ?? (
            <LucideCheck
              className={css({
                height: 16,
                width: 16,
              })}
            />
          )}
        </div>
      ) : (
        adornment
      )}
    </div>
  )
}

export namespace Input {
  export interface Props
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
    adornments?: {
      end?: Exclude<Adornment, AdornmentPhonePrefix>
      start?: Adornment
    }
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

  export type AdornmentRequired = {
    type: 'required'
    label?: ReactNode
  }

  export type AdornmentSolid = {
    type: 'solid'
    label: ReactNode
  }

  export type AdornmentValid = {
    type: 'valid'
    label?: ReactNode
  }

  export type AdornmentPhonePrefix = {
    type: 'phone-prefix'
    prefixes: string[]
  }

  export type Adornment =
    | ReactNode
    | AdornmentFill
    | AdornmentRequired
    | AdornmentSolid
    | AdornmentValid
    | AdornmentPhonePrefix

  function adornmentCheck<T extends string>(
    type: T,
  ): (adornment: Adornment) => adornment is Extract<Adornment, { type: T }> {
    return (
      adornment: Adornment,
    ): adornment is Extract<Adornment, { type: T }> =>
      typeof adornment === 'object' &&
      adornment !== null &&
      'type' in adornment &&
      adornment.type === type
  }

  export const isAdornmentFill = adornmentCheck('fill')
  export const isAdornmentRequired = adornmentCheck('required')
  export const isAdornmentSolid = adornmentCheck('solid')
  export const isAdornmentValid = adornmentCheck('valid')
  export const isAdornmentPhonePrefix = adornmentCheck('phone-prefix')

  export function useExtractPhonePrefix(
    adornmentStart: Adornment | undefined,
    isFocused: boolean,
    value: string,
  ) {
    return useMemo(() => {
      if (!adornmentStart || !Input.isAdornmentPhonePrefix(adornmentStart))
        return { adornmentStart, value }

      if (isFocused) return { adornmentStart: null, value }

      for (const prefix of adornmentStart.prefixes)
        if (value.startsWith(prefix))
          return {
            adornmentStart: { label: prefix, type: 'solid' } as const,
            value: value.slice(prefix.length).trim(),
          }

      return { adornmentStart: null, value }
    }, [adornmentStart, isFocused, value])
  }
}

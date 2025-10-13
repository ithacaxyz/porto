import {
  type ClipboardEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { css, cx } from '../../styled-system/css'

export function OtpInput({
  autoFocus = false,
  disabled = false,
  status = 'default',
  length = 4,
  mode = 'auto',
  onChange,
  onFill,
  value = '',
}: OtpInput.Props) {
  const [digits, setDigits] = useState(() =>
    Array.from({ length }, (_, index) => value[index] ?? ''),
  )

  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const otp = digits.join('')
    onChange?.(otp)
    if (digits.every(Boolean)) onFill?.(otp)
  }, [digits, onChange, onFill])

  const updateDigit = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return
    setDigits((digits) => digits.map((d, i) => (i === index ? value : d)))
    if (value) refs.current[index + 1]?.focus()
  }

  const clearDigit = (index: number) => {
    setDigits((digits) => digits.map((d, i) => (i === index ? '' : d)))
    refs.current[index]?.focus()
  }

  const handleDigitKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    // digit filled: clear
    if (event.key === 'Backspace' && digits[index]) {
      event.preventDefault()
      clearDigit(index)
      return
    }

    // digit empty & non first: clear previous & focus
    if (event.key === 'Backspace' && index > 0) {
      event.preventDefault()
      clearDigit(index - 1)
      return
    }

    // focus previous if any
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      refs.current[index - 1]?.focus()
      return
    }

    // focus next if any
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      refs.current[index + 1]?.focus()
      return
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '') // remove non-digits
    if (pasted.length !== length) return
    event.preventDefault()
    setDigits((digits) => digits.map((d, i) => pasted[i] ?? d))
    refs.current[length - 1]?.focus()
  }

  return (
    <div
      className={cx(
        css({
          display: 'flex',
          gap: 6,
        }),
        mode === 'wide' &&
          css({
            justifyContent: 'space-between',
            width: '100%',
          }),
        mode === 'fill' &&
          css({
            width: '100%',
          }),
      )}
    >
      {Array.from({ length }).map((_, index) => (
        <div
          className={cx(
            css({
              backgroundColor: 'var(--background-color-th_field)',
              borderRadius: 'var(--radius-th_medium)',
              height: 38,
              position: 'relative',
            }),
            (mode === 'auto' || mode === 'wide') &&
              css({
                width: 38,
              }),
            mode === 'fill' &&
              css({
                flex: 1,
              }),
            status === 'invalid' &&
              css({
                backgroundColor: 'var(--background-color-th_field-negative)',
              }),
            status === 'valid' &&
              css({
                backgroundColor: 'var(--background-color-th_field-positive)',
              }),
            disabled &&
              css({
                backgroundColor: 'var(--background-color-th_disabled)',
              }),
          )}
          // biome-ignore lint/suspicious/noArrayIndexKey: digits are identified by their index
          key={index}
        >
          {!digits[index] && (
            <div
              className={css({
                color: 'var(--text-color-th_field-tertiary)',
                display: 'grid',
                inset: 0,
                placeItems: 'center',
                position: 'absolute',
              })}
            >
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative */}
              <svg fill="none" height={10} width={10}>
                <path
                  d="m3.958 9.734.141-3.242-2.624 1.699L.433 6.557 3.366 5 .433 3.456l1.042-1.634 2.637 1.699L3.958.266h2.097L5.9 3.508l2.625-1.686 1.042 1.621L6.634 5l2.933 1.557L8.525 8.19 5.9 6.505l.155 3.23H3.958Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
          <input
            aria-invalid={status === 'invalid'}
            // biome-ignore lint/a11y/noAutofocus: _
            autoFocus={index === 0 && autoFocus}
            className={cx(
              css({
                _focus: {
                  outline: 'none',
                },
                '&:focus-visible': {
                  outline: '2px solid var(--color-th_focus)',
                  outlineOffset: -1,
                },
                '&[aria-invalid="true"]': {
                  borderColor: 'var(--border-color-th_field-negative)',
                },
                background: 'transparent',
                border: '1px solid var(--border-color-th_field)',
                borderRadius: 'var(--radius-th_medium)',
                fontSize: 15,
                fontWeight: 500,
                inset: 0,
                position: 'absolute',
                textAlign: 'center',
              }),
              status === 'valid' &&
                css({
                  borderColor: 'var(--border-color-th_field-positive)',
                }),
              !disabled &&
                css({
                  color: 'var(--text-color-th_field)',
                }),
              disabled &&
                css({
                  backgroundColor: 'var(--background-color-th_disabled)',
                  borderColor: 'var(--border-color-th_disabled)',
                  color: 'var(--text-color-th_disabled)!',
                  pointerEvents: 'none',
                }),
            )}
            disabled={disabled}
            inputMode="numeric"
            maxLength={1}
            onChange={(event) => updateDigit(index, event.target.value.trim())}
            onFocus={(event) => event.currentTarget.select()}
            onKeyDown={(event) => handleDigitKeyDown(index, event)}
            onPaste={index === 0 ? handlePaste : undefined}
            pattern="\d"
            ref={(el) => {
              refs.current[index] = el
            }}
            type="text"
            value={digits[index]}
          />
        </div>
      ))}
    </div>
  )
}

export namespace OtpInput {
  export interface Props {
    autoFocus?: boolean
    disabled?: boolean
    length?: number
    mode?: 'auto' | 'wide' | 'fill'
    onChange?: (value: string) => void
    onFill?: (value: string) => void
    status?: 'default' | 'valid' | 'invalid'
    value?: string
  }
}

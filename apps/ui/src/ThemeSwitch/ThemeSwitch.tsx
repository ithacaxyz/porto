import type { ButtonHTMLAttributes } from 'react'
import { css, cx } from '../../styled-system/css'
import { IconMoon } from './IconMoon.js'
import { IconSun } from './IconSun.js'

type ColorScheme = 'light' | 'dark'

export function ThemeSwitch({
  className,
  colorScheme,
  onChange,
  ...props
}: ThemeSwitch.Props) {
  return (
    <button
      aria-checked={colorScheme === 'dark'}
      aria-label="Dark mode"
      className={cx(
        css({
          _focusVisible: {
            outline: '2px solid var(--color-th_focus)',
            outlineOffset: 2,
          },
          alignItems: 'center',
          border: '1px solid var(--border-color-th_field)',
          borderRadius: 13,
          cursor: 'pointer!',
          display: 'inline-flex',
          gap: 8,
          height: 26,
          paddingInline: 4,
          transition: '50ms transform ease-out',
          width: 50,
        }),
        className,
      )}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ')
          onChange(colorScheme === 'light' ? 'dark' : 'light')
        if (event.key === 'ArrowLeft') onChange('light')
        if (event.key === 'ArrowRight') onChange('dark')
      }}
      onPointerDown={(e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return
        onChange(colorScheme === 'light' ? 'dark' : 'light')
      }}
      role="switch"
      title={`Switch to ${colorScheme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
      {...props}
    >
      <ColorSchemeIcon colorScheme="light" current={colorScheme} />
      <ColorSchemeIcon colorScheme="dark" current={colorScheme} />
    </button>
  )
}

function ColorSchemeIcon({
  current,
  colorScheme,
}: {
  current: ColorScheme
  colorScheme: ColorScheme
}) {
  const active = colorScheme === current
  return (
    <div
      style={{
        color: active
          ? 'var(--text-color-th_base)'
          : 'var(--text-color-th_base-secondary)',
      }}
    >
      {colorScheme === 'dark' ? <IconMoon /> : <IconSun />}
    </div>
  )
}

export namespace ThemeSwitch {
  export interface Props
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    colorScheme: ColorScheme
    onChange: (colorScheme: ColorScheme) => void
  }
}

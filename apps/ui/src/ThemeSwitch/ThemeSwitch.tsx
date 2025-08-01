import { a, useSpring } from '@react-spring/web'
import type { ButtonHTMLAttributes } from 'react'
import { css, cx } from '../../styled-system/css'
import { IconMoon } from './IconMoon'
import { IconSun } from './IconSun'

type ColorScheme = 'light' | 'dark'

export interface ThemeSwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  colorScheme: ColorScheme
  onChange: (colorScheme: ColorScheme) => void
}

export function ThemeSwitch({
  className,
  colorScheme,
  onChange,
  ...props
}: ThemeSwitchProps) {
  return (
    <button
      className={cx(
        css({
          _focusVisible: {
            outline: '2px solid var(--color-th_focus)',
            outlineOffset: 2,
          },
          alignItems: 'center',
          border: '1px solid var(--border-color-th_field)',
          borderRadius: 13,
          color: 'var(--text-color-th_base-secondary)',
          cursor: 'pointer!',
          display: 'flex',
          gap: 8,
          height: 26,
          paddingInline: 4,
          transition: '50ms transform ease-out',
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
  const styles = useSpring({
    config: {
      friction: 100,
      mass: 1,
      tension: 1600,
    },
    to: active
      ? [
          { immediate: true, transform: 'scale(0.8)' },
          { opacity: 1, transform: 'scale(1)' },
        ]
      : [{ transform: 'scale(1)' }],
  })
  return (
    <a.div
      style={{
        ...styles,
        color: active ? 'var(--text-color-th_base)' : undefined,
      }}
    >
      {colorScheme === 'dark' ? <IconMoon /> : <IconSun />}
    </a.div>
  )
}

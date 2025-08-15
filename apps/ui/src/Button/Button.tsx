import { a, useSpring } from '@react-spring/web'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useRef } from 'react'
import { css, cva, cx } from '../../styled-system/css'
import { Frame } from '../Frame/Frame.js'
import { Spinner } from '../Spinner/Spinner.js'

type ButtonSize = 'small' | 'medium' | 'large'

export function Button({
  children,
  className,
  disabled,
  icon,
  loading,
  shape = 'normal',
  size,
  variant = 'secondary',
  width = 'auto',
  type = 'button',
  ...props
}: Button.Props) {
  const frame = Frame.useFrame(true)
  size ??= { dialog: 'medium', full: 'large' }

  const loadingRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  const firstRender = useRef(true)

  const loadingSpring = useSpring({
    config: {
      friction: 80,
      mass: 1,
      tension: 1200,
    },
    from: {
      containerWidth: 0,
      labelOpacity: 1,
      loadingOpacity: 0,
    },
    to: async (next) => {
      const targetRef = loading ? loadingRef : labelRef
      const width = targetRef.current?.clientWidth ?? 0
      if (width === 0) return
      await Promise.all([
        next(
          loading
            ? { immediate: true, labelOpacity: 0 }
            : { immediate: true, loadingOpacity: 0 },
        ),
        next({
          containerWidth: width,
          immediate: firstRender.current,
          labelOpacity: loading ? 0 : 1,
          loadingOpacity: loading ? 1 : 0,
        }),
      ])
      firstRender.current = false
    },
  })

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
          flex: '0 0 auto',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
        }),
        width === 'full' && css({ width: '100%' }),
        width === 'grow' && css({ flexGrow: 1 }),
        cva({
          variants: {
            colors: {
              // disabled is a color variant rather than being applied when
              // the button is disabled, this is because in certain cases we
              // want the button to be disabled, but not to look like our
              // default disabled state, e.g. when the button is loading.
              disabled: {
                '--button-bd': 'var(--border-color-th_disabled)',
                '--button-bg': 'var(--background-color-th_disabled)',
                color: 'var(--text-color-th_disabled)',
              },
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
                borderRadius: 21,
                fontSize: 16,

                // large button temporarily made smaller, until we move
                // to layouts adapted to larger (52px tall) buttons.
                // height: 52,
                // borderRadius: 26,
                height: 42,
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
          colors: disabled ? 'disabled' : variant,
          size:
            typeof size === 'string'
              ? size
              : (frame && size[frame.mode]) || 'medium',
        }),
        className,
      )}
      disabled={Boolean(loading) || disabled}
      type={type}
      {...props}
      style={{
        ...props.style,
        width: typeof width === 'number' ? width : undefined,
      }}
    >
      <a.div
        className={css({
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        })}
        style={{
          width: loadingSpring.containerWidth.to((v) =>
            v === 0 ? 'auto' : `${v}px`,
          ),
        }}
      >
        {loading && (
          <a.div
            className={css({
              alignItems: 'center',
              display: 'flex',
              inset: '0 auto 0 0',
              position: 'absolute',
            })}
            ref={loadingRef}
            style={{
              gap: size === 'small' ? 6 : 8,
              opacity: loadingSpring.loadingOpacity,
            }}
          >
            <Spinner size={size === 'small' ? 'small' : 'medium'} />
            {loading === true ? 'Loading…' : loading}
          </a.div>
        )}
        <a.div
          className={css({
            alignItems: 'center',
            display: 'flex',
            inset: '0 auto 0 0',
            position: 'absolute',
          })}
          ref={labelRef}
          style={{
            gap: size === 'small' ? 6 : 8,
            opacity: loadingSpring.labelOpacity,
            visibility: loading ? 'hidden' : 'visible',
          }}
        >
          {icon}
          {children}
        </a.div>
      </a.div>
    </button>
  )
}

export namespace Button {
  export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode
    loading?: boolean | ReactNode
    size?: ButtonSize | Record<Frame.Mode, ButtonSize>
    shape?: 'normal' | 'square' // TODO: implement
    variant?:
      | 'negative'
      | 'negative-secondary'
      | 'positive'
      | 'primary'
      | 'secondary'
      | 'strong'
    width?: 'auto' | 'full' | 'grow' | number | undefined
  }
}

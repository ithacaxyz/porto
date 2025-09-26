import type { ButtonHTMLAttributes, ReactNode } from 'react'
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

  if (loading === true) loading = 'Loading…'

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
          touchAction: 'none',
          whiteSpace: 'nowrap',
        }),
        width === 'full' && css({ width: '100%' }),
        width === 'grow' && css({ flexGrow: 1 }),
        cva({
          compoundVariants: [
            {
              css: { borderRadius: 8 },
              shape: 'square',
              size: 'large',
            },
          ],
          variants: {
            buttonVariant: {
              content: {
                _dark: {
                  '&:hover:not(:disabled)': {
                    backgroundColor: 'var(--background-color-th_base-hovered)',
                    borderColor: 'transparent',
                  },
                },
                '--button-bd': 'transparent',
                '--button-bg': 'transparent',
                '&:hover:not(:disabled)': {
                  backgroundColor: 'var(--background-color-th_base-hovered)',
                  borderColor: 'transparent',
                },
                color: 'currentColor',
              },
              // disabled is a color variant rather than being applied when
              // the button is disabled, this is because in certain cases we
              // want the button to be disabled, but not to look like our
              // default disabled state, e.g. when the button is loading.
              disabled: {
                '--button-bd': 'var(--border-color-th_disabled)',
                '--button-bg': 'var(--background-color-th_disabled)',
                color: 'var(--text-color-th_disabled)',
              },
              distinct: {
                '--button-bd': 'var(--border-color-th_distinct)',
                '--button-bg': 'var(--background-color-th_distinct)',
                color: 'var(--text-color-th_distinct)',
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
                fontWeight: 600,
              },
            },
            shape: {
              normal: {},
              square: {
                aspectRatio: 1,
                padding: '0!',
                width: 'auto',
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
          buttonVariant: disabled ? 'disabled' : variant,
          shape,
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
      <div
        className={css({
          alignItems: 'center',
          display: 'flex',
          gap: size === 'small' ? 6 : 8,
          height: '100%',
        })}
      >
        {loading ? (
          <>
            <Spinner size={size === 'small' ? 'small' : 'medium'} />
            {loading}
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </div>
    </button>
  )
}

export namespace Button {
  export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode
    loading?: boolean | ReactNode
    size?: ButtonSize | Record<Frame.ModeName, ButtonSize>
    shape?: 'normal' | 'square'
    variant?:
      | 'content'
      | 'distinct'
      | 'negative'
      | 'negative-secondary'
      | 'positive'
      | 'primary'
      | 'secondary'
      | 'strong'
    width?: 'auto' | 'full' | 'grow' | number | undefined
  }
}

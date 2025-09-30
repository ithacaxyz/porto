import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from 'react'
import { css, cva, cx } from '../../styled-system/css'
import { Frame } from '../Frame/Frame.js'
import { Spinner } from '../Spinner/Spinner.js'

export function Button({
  children,
  className,
  disabled,
  icon,
  loading,
  shape = 'normal',
  size,
  style,
  type = 'button',
  variant = 'secondary',
  width = 'auto',
  ...props
}: Button.Props) {
  const resolvedSize = Button.useResolvedSize(size)

  if (loading === true) loading = 'Loading…'

  const frame = Frame.useFrame(true)

  return (
    <button
      disabled={Boolean(loading) || disabled}
      type={type}
      {...Button.styles({
        className,
        disabled: Boolean(loading) || disabled,
        frame,
        shape,
        size: resolvedSize,
        style,
        variant,
        width,
      })}
      {...props}
    >
      <Button.Inner icon={icon} loading={loading} size={resolvedSize}>
        {children}
      </Button.Inner>
    </button>
  )
}

export namespace Button {
  export type Size = 'small' | 'medium' | 'large'
  export type Shape = 'normal' | 'square'
  export type Variant =
    | 'content'
    | 'distinct'
    | 'negative'
    | 'negative-secondary'
    | 'positive'
    | 'primary'
    | 'secondary'
    | 'strong'
  export type Width = 'auto' | 'full' | 'grow' | number | undefined

  export interface BaseProps {
    icon?: ReactNode
    loading?: boolean | ReactNode
    size?: Size | Record<Frame.ModeName, Size>
    shape?: Shape
    variant?: Variant
    width?: Width
  }

  export interface Props
    extends ButtonHTMLAttributes<HTMLButtonElement>,
      BaseProps {}

  export function useResolvedSize(
    size?: Size | Record<Frame.ModeName, Size>,
  ): Size {
    const frame = Frame.useFrame(true)
    const resolvedSize = size ?? { dialog: 'medium', full: 'large' }
    return typeof resolvedSize === 'string'
      ? resolvedSize
      : (frame && resolvedSize[frame.mode]) || 'medium'
  }

  export function styles({
    className,
    disabled,
    frame,
    shape,
    size,
    style,
    variant,
    width,
  }: {
    className?: string | undefined
    disabled?: boolean | undefined
    frame?: Frame.Context | null
    shape: Shape
    size: Size | Record<Frame.ModeName, Size>
    style?: CSSProperties
    variant: Variant
    width: Width
  }) {
    return {
      className: cx(
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
      ),
      style: {
        ...style,
        width: typeof width === 'number' ? width : undefined,
      },
    }
  }

  export function Inner({ children, icon, loading, size }: Inner.Props) {
    return (
      <div
        className={cx(
          css({
            alignItems: 'center',
            display: 'flex',
            height: '100%',
          }),
          size === 'small' ? css({ gap: 6 }) : css({ gap: 8 }),
        )}
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
    )
  }

  export namespace Inner {
    export interface Props {
      children?: ReactNode
      icon?: ReactNode
      loading?: boolean | ReactNode
      size: Button.Size
    }
  }

  export function Anchor({
    children,
    className,
    external,
    href,
    icon,
    loading,
    shape = 'normal',
    size,
    style,
    variant = 'secondary',
    width = 'auto',
    ...props
  }: Anchor.Props) {
    const resolvedSize = Button.useResolvedSize(size)
    const frame = Frame.useFrame(true)

    return (
      <a
        href={href}
        rel={external ? 'noopener noreferrer' : undefined}
        target={external ? '_blank' : undefined}
        {...Button.styles({
          className,
          frame,
          shape,
          size: resolvedSize,
          style,
          variant,
          width,
        })}
        {...props}
      >
        <Inner icon={icon} loading={loading} size={resolvedSize}>
          {children}
        </Inner>
      </a>
    )
  }

  export namespace Anchor {
    export interface Props
      extends AnchorHTMLAttributes<HTMLAnchorElement>,
        BaseProps {
      external?: boolean
      href: string
    }
  }
}

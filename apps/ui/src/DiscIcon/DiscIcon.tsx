import type { ImgHTMLAttributes, ReactNode } from 'react'
import { Children, createContext, useContext, useEffect, useState } from 'react'
import { css, cx } from '../../styled-system/css'

const DiscIconContext = createContext<
  | {
      border?: boolean | number
      size?: DiscIcon.Size
    }
  | undefined
>(undefined)

export function DiscIcon({
  src,
  fallback,
  size,
  border,
  alt,
  title,
  className,
  children,
  ...props
}: DiscIcon.Props) {
  const context = useContext(DiscIconContext)

  const [error, setError] = useState(false)
  useEffect(() => setError(false), [])

  size ??= context?.size ?? 'medium'
  if (typeof size === 'string') size = DiscIcon.sizes[size]

  border ??= context?.border ?? false
  if (typeof border === 'boolean')
    border = border ? (size <= 16 ? 1 : size <= 20 ? 2 : 3) : 0

  return (
    <div
      className={cx(
        css({
          background: 'var(--background-color-th_badge)',
          borderRadius: '50%',
          display: 'grid',
          overflow: 'hidden',
          placeItems: 'center',
        }),
        className,
      )}
      style={{
        height: size,
        width: size,
      }}
      title={title}
    >
      {children ? (
        <div
          className={css({
            display: 'grid',
            placeItems: 'center',
          })}
          style={{
            height: size - border * 2,
            width: size - border * 2,
          }}
        >
          {children}
        </div>
      ) : (error || !src) && fallback && typeof fallback !== 'string' ? (
        <div
          className={css({
            display: 'grid',
            placeItems: 'center',
          })}
          style={{
            height: size - border * 2,
            width: size - border * 2,
          }}
        >
          {fallback}
        </div>
      ) : src ? (
        <img
          alt={alt}
          className={css({
            display: 'block',
          })}
          height={size - border * 2}
          onError={() => setError(true)}
          src={error && typeof fallback === 'string' ? fallback : src}
          width={size - border * 2}
          {...props}
        />
      ) : null}
    </div>
  )
}

export namespace DiscIcon {
  export interface Props extends ImgHTMLAttributes<HTMLImageElement> {
    src?: string
    fallback?: string | ReactNode
    size?: Size | undefined
    border?: boolean | number
    alt?: string
    title?: string
    children?: ReactNode
  }

  export type Size = 'small' | 'medium' | 'large' | number

  export const sizes = {
    large: 38,
    medium: 24,
    small: 16,
  }

  export function Stack({
    border = true,
    children,
    className,
    gap,
    size = 'medium',
  }: Stack.Props) {
    if (typeof size !== 'number') size = sizes[size]
    gap ??= size * -0.3
    return (
      <DiscIconContext.Provider value={{ border, size }}>
        <div
          className={cx(
            css({
              alignItems: 'center',
              display: 'flex',
            }),
            className,
          )}
        >
          {Children.map(children, (child, index) => (
            <div style={{ marginLeft: index === 0 ? 0 : gap }}>{child}</div>
          ))}
        </div>
      </DiscIconContext.Provider>
    )
  }

  export namespace Stack {
    export interface Props {
      border?: boolean | number
      children: React.ReactNode
      className?: string
      gap?: number
      size?: Size
    }
  }
}

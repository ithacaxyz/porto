import type { ImgHTMLAttributes, ReactNode } from 'react'
import { Children, createContext, useContext, useEffect, useState } from 'react'
import { css, cx } from '../../styled-system/css'

const DiscIconContext = createContext<
  { size?: DiscIcon.Size; border?: boolean } | undefined
>(undefined)

export function DiscIcon({
  src,
  fallback,
  size,
  border,
  alt,
  title,
  className,
  ...props
}: DiscIcon.Props) {
  const context = useContext(DiscIconContext)

  const [error, setError] = useState(false)
  useEffect(() => setError(false), [])

  const size_ = size ?? context?.size ?? 'medium'
  const sizeResolved =
    typeof size_ === 'string'
      ? { large: 38, medium: 24, small: 16 }[size_]
      : size_

  const border_ = border ?? context?.border ?? false
  const borderWidth = border_ ? (sizeResolved < 20 ? 2 : 3) : 0

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
        height: sizeResolved,
        width: sizeResolved,
      }}
      title={title}
    >
      {(error || !src) && fallback && typeof fallback !== 'string' ? (
        <div
          className={css({
            display: 'grid',
            placeItems: 'center',
          })}
          style={{
            height: sizeResolved - borderWidth * 2,
            width: sizeResolved - borderWidth * 2,
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
          height={sizeResolved - borderWidth * 2}
          onError={() => setError(true)}
          src={error && typeof fallback === 'string' ? fallback : src}
          width={sizeResolved - borderWidth * 2}
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
    border?: boolean
    alt?: string
    title?: string
  }

  export type Size = 'small' | 'medium' | 'large' | number

  export function Stack({
    children,
    size = 'medium',
    border = true,
    gap,
    className,
  }: Stack.Props) {
    const sizeResolved =
      typeof size === 'string'
        ? { large: 38, medium: 24, small: 16 }[size]
        : size

    const defaultGap = (() => {
      if (sizeResolved < 20) return -2
      if (sizeResolved <= 24) return -4
      return -Math.round(sizeResolved * 0.3)
    })()

    const marginLeft = gap ?? defaultGap

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
          {Children.map(children, (child, index) => {
            if (index === 0) return child
            return <div style={{ marginLeft }}>{child}</div>
          })}
        </div>
      </DiscIconContext.Provider>
    )
  }

  export namespace Stack {
    export interface Props {
      children: React.ReactNode
      size?: Size
      border?: boolean
      gap?: number
      className?: string
    }
  }
}

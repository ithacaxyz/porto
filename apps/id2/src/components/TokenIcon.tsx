import { cx } from 'cva'
import type { ImgHTMLAttributes } from 'react'
import * as React from 'react'

const iconsUrl = '/token-icons'
const fallback = `${iconsUrl}/fallback.svg`

export function TokenIcon({
  symbol,
  size = 'medium',
  className,
  ...props
}: TokenIcon.Props) {
  const [iconSrc, setIconSrc] = React.useState(
    symbol ? `${iconsUrl}/${symbol.toLowerCase()}.svg` : fallback,
  )

  React.useEffect(() => {
    setIconSrc(symbol ? `${iconsUrl}/${symbol.toLowerCase()}.svg` : fallback)
  }, [symbol])

  if (typeof size === 'string') size = { large: 32, medium: 24 }[size]

  return (
    <div
      className={cx(
        'grid place-items-center overflow-hidden rounded-full bg-gray7',
        className,
      )}
      style={{
        height: size,
        width: size,
      }}
    >
      <img
        alt={symbol}
        className={cx('block', iconSrc === fallback && 'size-3', className)}
        onError={() => setIconSrc(fallback)}
        src={iconSrc}
        title={symbol}
        {...props}
      />
    </div>
  )
}

export namespace TokenIcon {
  export interface Props extends ImgHTMLAttributes<HTMLImageElement> {
    symbol?: string | undefined
    size?: Size | undefined
  }

  export type Size = 'medium' | 'large' | number
}

import type { ImgHTMLAttributes } from 'react'
import { useState } from 'react'
import { css, cx } from '../../styled-system/css'
import { Ui } from '../Ui/Ui.js'

export function TokenIcon({
  symbol,
  size = 'medium',
  className,
  ...props
}: TokenIcon.Props) {
  const ui = Ui.useUi()

  const iconsUrl = `${ui.assetsBaseUrl}/token-icons`
  const fallback = `${iconsUrl}/fallback.svg`

  const [iconSrc, setIconSrc] = useState(
    symbol ? `${iconsUrl}/${symbol.toLowerCase()}.svg` : fallback,
  )

  if (typeof size === 'string') size = { large: 32, medium: 24 }[size]

  return (
    <div
      className={cx(
        css({
          background: 'var(--background-color-th_badge)',
          border: '3px solid var(--background-color-th_badge)',
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
    >
      <img
        alt={symbol}
        className={cx(
          css({
            display: 'block',
          }),
          className,
        )}
        height={size - 3 * 2}
        onError={() => setIconSrc(fallback)}
        src={iconSrc}
        title={symbol}
        width={size - 3 * 2}
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

import type { ImgHTMLAttributes } from 'react'
import { DiscIcon } from '../DiscIcon/DiscIcon.js'
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
  const src = symbol ? `${iconsUrl}/${symbol.toLowerCase()}.svg` : fallback

  return (
    <DiscIcon
      alt={symbol}
      className={className}
      fallback={fallback}
      size={size}
      src={src}
      title={symbol}
      {...props}
    />
  )
}

TokenIcon.Stack = DiscIcon.Stack

export namespace TokenIcon {
  export interface Props extends ImgHTMLAttributes<HTMLImageElement> {
    symbol?: string | undefined
    size?: Size | undefined
  }

  export type Size = 'small' | 'medium' | 'large' | number
}

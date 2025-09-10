import { DiscIcon } from '../DiscIcon/DiscIcon.js'
import { Ui } from '../Ui/Ui.js'

export function TokenIcon({
  symbol,
  size,
  className,
  ...props
}: TokenIcon.Props) {
  const { assetsBaseUrl } = Ui.useUi()
  const fallback = `${assetsBaseUrl}/token-icons/fallback.svg`
  const src = symbol
    ? `${assetsBaseUrl}/token-icons/${symbol.toLowerCase()}.svg`
    : fallback
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

export namespace TokenIcon {
  export interface Props extends Omit<DiscIcon.Props, 'src' | 'fallback'> {
    symbol?: string | undefined
  }
  export const Stack = DiscIcon.Stack
}

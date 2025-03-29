import type { Address } from 'ox'

import { useErc20Info } from '~/hooks/useTokenInfo'
import { StringFormatter } from '~/utils'

export function TokenSymbol({
  address,
  display,
}: {
  address?: Address.Address | undefined
  display?: 'SYMBOL' | 'NAME' | 'ADDRESS'
}) {
  const { data: tokenInfo } = useErc20Info(address)

  if (!address) return null

  if (!tokenInfo?.symbol || display === 'ADDRESS')
    return StringFormatter.truncate(address, { start: 4, end: 4 })

  return display === 'NAME' ? tokenInfo.name : tokenInfo.symbol
}

import type { Address } from 'ox'
import { useErc20Info, useErc721Info } from '~/hooks/useTokenInfo'
import { useTokenStandard } from '~/hooks/useTokenStandard'
import { StringFormatter } from '~/utils'

export function TokenSymbol({
  address,
  display,
}: {
  address?: Address.Address | undefined
  display?: 'symbol' | 'name' | 'address'
}) {
  const tokenStandard = useTokenStandard(address)

  const { data: tokenInfoErc20 } = useErc20Info({
    address,
    enabled: tokenStandard.standard === 'ERC20',
  })

  const { data: tokenInfo721 } = useErc721Info({
    address,
    enabled: tokenStandard.standard === 'ERC721',
  })

  const tokenInfo =
    tokenStandard.standard === 'ERC20' ? tokenInfoErc20 : tokenInfo721

  if (!address) return null

  if (!tokenInfo?.symbol || display === 'address')
    return StringFormatter.truncate(address, { end: 4, start: 4 })

  return display === 'name' ? tokenInfo.name : tokenInfo.symbol
}

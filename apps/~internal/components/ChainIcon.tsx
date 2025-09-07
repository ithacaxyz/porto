import { icons } from 'virtual:chain-icons'
import { Chains } from 'porto'
import type { Chain } from 'viem'
import IconUnknown from '~icons/porto/unknown'

export function ChainIcon(
  props: React.SVGProps<SVGSVGElement> & { chainId: number },
) {
  const { chainId, ...rest } = props

  const chain = getChain(chainId)

  const Icon = icons[chainId] ?? IconUnknown
  return (
    <div title={chain?.name || `Unknown Chain (${chainId})`}>
      <Icon {...rest} />
    </div>
  )
}

const chainsCache = new Map<number, Chain | null>()
const getChain = (chainId: number) => {
  if (!chainsCache.has(chainId))
    chainsCache.set(chainId, Chains.all.find((c) => c.id === chainId) ?? null)
  return chainsCache.get(chainId)
}

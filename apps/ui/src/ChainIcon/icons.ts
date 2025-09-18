import type { ComponentType } from 'react'
import IconArbitrum from '~icons/chains/arbitrum'
import IconArbitrumSepolia from '~icons/chains/arbitrumSepolia'
import IconBase from '~icons/chains/base'
import IconBaseSepolia from '~icons/chains/baseSepolia'
import IconBsc from '~icons/chains/bsc'
import IconCelo from '~icons/chains/celo'
import IconMainnet from '~icons/chains/mainnet'
import IconOptimism from '~icons/chains/optimism'
import IconOptimismSepolia from '~icons/chains/optimismSepolia'
import IconPolygon from '~icons/chains/polygon'
import IconSepolia from '~icons/chains/sepolia'

export const chainIcons: Record<
  number,
  ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  1: IconMainnet,
  10: IconOptimism,
  56: IconBsc,
  137: IconPolygon,
  8453: IconBase,
  42161: IconArbitrum,
  42220: IconCelo,
  84532: IconBaseSepolia,
  421614: IconArbitrumSepolia,
  11155111: IconSepolia,
  11155420: IconOptimismSepolia,
}

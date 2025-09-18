import { Chains } from 'porto'
import type { Chain } from 'viem'
import { DiscIcon } from '../DiscIcon/DiscIcon.js'
import { chainIcons } from './icons.js'

export function ChainIcon({
  chainId,
  size,
  className,
  ...props
}: ChainIcon.Props) {
  const chain = getChain(chainId)
  const Icon = chainIcons[chainId]
  return (
    <DiscIcon
      className={className}
      fallback={<Fallback />}
      size={size}
      title={chain?.name || `Unknown Chain (${chainId})`}
      {...props}
    >
      {Icon && <Icon height="100%" width="100%" />}
    </DiscIcon>
  )
}

export namespace ChainIcon {
  export interface Props
    extends Omit<DiscIcon.Props, 'src' | 'fallback' | 'children'> {
    chainId: number
  }
  export const Stack = DiscIcon.Stack
}

const chainsCache = new Map<number, Chain | null>()
const getChain = (chainId: number) => {
  if (!chainsCache.has(chainId))
    chainsCache.set(chainId, Chains.all.find((c) => c.id === chainId) ?? null)
  return chainsCache.get(chainId)
}

function Fallback() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: the parent title always takes precedence
    <svg fill="currentColor" viewBox="0 0 18 18">
      <path d="M8.63766 11.3179C8.33742 11.3179 8.093 11.0765 8.08929 10.7762C8.0558 9.8216 8.46429 9.21225 9.3817 8.65707C10.192 8.16283 10.4799 7.77014 10.4799 7.07955V7.06601C10.4799 6.30772 9.88393 5.74577 8.96652 5.74577C8.04707 5.74577 7.45244 6.30207 7.39371 7.18794C7.39321 7.19545 7.38699 7.20142 7.37946 7.20142L6.01354 7.20813C6.00607 7.20816 6 7.20212 6 7.19465C6.06027 5.66452 7.09821 4.5 9.04018 4.5C10.808 4.5 12 5.56297 12 7.00508V7.01862C12 8.06127 11.4777 8.79925 10.5938 9.33412C9.72991 9.84868 9.48214 10.2075 9.48214 10.9049C9.48214 11.133 9.29724 11.3179 9.06914 11.3179H8.63766ZM8.87277 14.5C8.2567 14.5 7.83482 14.0938 7.83482 13.4912C7.83482 12.8819 8.2567 12.4756 8.87277 12.4756C9.48884 12.4756 9.90402 12.8819 9.90402 13.4912C9.90402 14.0938 9.48884 14.5 8.87277 14.5Z" />
    </svg>
  )
}

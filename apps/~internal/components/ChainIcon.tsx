import { icons } from 'virtual:chain-icons'
import IconUnknown from '~icons/porto/unknown'

export function ChainIcon(
  props: React.SVGProps<SVGSVGElement> & { chainId: number },
) {
  const { chainId, ...rest } = props

  const Icon = icons[chainId] ?? IconUnknown
  return <Icon {...rest} />
}

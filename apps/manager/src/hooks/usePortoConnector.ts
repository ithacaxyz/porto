import { useConnectors } from 'wagmi'
import { config } from '~/lib/Wagmi'

export function usePortoConnector() {
  return useConnectors({ config }).find((x) => x.id === 'xyz.ithaca.porto')
}

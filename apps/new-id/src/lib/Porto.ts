import { Env, PortoConfig } from '@porto/apps'
import { Mode, type Porto, Storage } from 'porto'

const getHost = () => {
  const url = new URL(PortoConfig.getDialogHost())
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    url.port = window.location.port
  }
  return url.href
}

export const config = {
  ...PortoConfig.getConfig(),
  experimental: {
    applePayOnramp: Env.get() === 'prod',
  },
  mode: Mode.dialog({
    host: getHost(),
  }),
  storage: Storage.combine(Storage.cookie(), Storage.localStorage()),
} as const satisfies Porto.Config

import { PortoConfig } from '@porto/apps'
import { Mode, type Porto, Storage } from 'porto'

export const config = {
  ...PortoConfig.getConfig(
    import.meta.env.VITE_VERCEL_ENV === 'production' ? 'prod' : undefined,
  ),
  mode: Mode.dialog({
    host: 'https://id.porto.sh/dialog?relayEnv=prod',
  }),
  storage: Storage.combine(Storage.cookie(), Storage.localStorage()),
} as const satisfies Porto.Config

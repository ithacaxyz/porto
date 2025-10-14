import { PortoConfig } from '@porto/apps'
import { Porto, Storage } from 'porto'

export const config = {
  ...PortoConfig.getConfig(
    import.meta.env.VITE_VERCEL_ENV === 'production' ? 'prod' : undefined,
  ),
  storage: Storage.combine(Storage.cookie(), Storage.localStorage()),
} as const satisfies Porto.Config

export const porto = Porto.create(
  PortoConfig.getConfig(
    import.meta.env.VITE_VERCEL_ENV === 'production' ? 'prod' : undefined,
  ),
)

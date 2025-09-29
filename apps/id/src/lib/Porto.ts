import 'porto/register'
import { PortoConfig } from '@porto/apps'
import { Mode, type Porto, Storage } from 'porto'

const host = (() => {
  const url = new URL(PortoConfig.getDialogHost())
  if (import.meta.env.DEV) url.port = window.location.port
  return url.href
})()

export const config = {
  ...PortoConfig.getConfig(
    import.meta.env.VITE_VERCEL_ENV === 'production' ? 'prod' : undefined,
  ),
  mode: Mode.dialog({
    host,
  }),
  storage: Storage.combine(Storage.cookie(), Storage.localStorage()),
} as const satisfies Porto.Config

// export const porto = Porto.create(config)

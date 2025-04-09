import { Env, PortoConfig } from '@porto/apps'
import { Mode, Porto } from 'porto'

const env = Env.get()

const host = (() => {
  const url = new URL(PortoConfig.dialogHosts[env] as string)
  if (import.meta.env.DEV) url.port = window.location.port
  return url.href
})()

export const porto = Porto.create({
  ...PortoConfig.getConfig(env),
  mode: Mode.dialog({
    host,
  }),
})

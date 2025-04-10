import { PortoConfig } from '@porto/apps'
import { Mode, Porto } from 'porto'

const host = (() => {
  const url = new URL(PortoConfig.getDialogHost())
  if (import.meta.env.DEV) url.port = window.location.port
  return url.href
})()

export const porto = Porto.create({
  ...PortoConfig.getConfig(),
  mode: Mode.dialog({
    host,
  }),
})

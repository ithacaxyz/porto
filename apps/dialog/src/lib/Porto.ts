import { PortoConfig } from '@porto/apps'
import { Storage } from 'porto'
import { Porto } from 'porto/remote'

export const porto = Porto.create({
  ...PortoConfig.getConfig(),
  storage: Storage.combine(Storage.cookie(), Storage.localStorage()),
})

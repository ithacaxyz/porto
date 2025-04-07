import { Env, Porto as PortoConfig } from '@porto/apps'
import { Storage } from 'porto'
import { Porto } from 'porto/remote'

export const porto = Porto.create({
  ...PortoConfig.config[Env.get()],
  storage: Storage.combine(Storage.cookie(), Storage.localStorage()),
})

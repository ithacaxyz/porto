import { Storage } from 'porto'
import { Porto } from 'porto/remote'

export const porto = Porto.create({
  storage: Storage.combine(Storage.cookie(), Storage.localStorage()),
})

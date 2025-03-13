import { Implementation, Storage } from 'porto'
import { Porto } from 'porto/remote'

export const porto = Porto.create({
  // implementation: Implementation.local(),
  storage: Storage.combine(Storage.cookie(), Storage.localStorage()),
})

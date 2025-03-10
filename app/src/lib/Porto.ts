import { Porto as AppPorto, Implementation, Storage } from 'porto'
import { Porto } from 'porto/remote'

export const porto = Porto.create({
  storage: Storage.cookie(),
})

export const appPorto = AppPorto.create({
  implementation: Implementation.local(),
})

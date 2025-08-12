import type * as Porto from '../Porto.js'

export async function waitForHydration(store: Porto.Store) {
  if (store.persist.hasHydrated()) return
  await new Promise((resolve) => {
    setTimeout(() => resolve(true), 32)
    store.persist.onFinishHydration(() => resolve(true))
  })
}

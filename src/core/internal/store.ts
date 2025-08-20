import type * as Porto from '../Porto.js'

export async function waitForHydration(store: Porto.Store) {
  if (store.persist.hasHydrated()) return
  await new Promise((resolve) => {
    store.persist.onFinishHydration(() => resolve(true))
    setTimeout(() => resolve(true), 100)
  })
}

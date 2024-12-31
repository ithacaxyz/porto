import * as instances from './src/anvil.js'

export default async function () {
  // Set up Anvil instances
  const shutdown = await Promise.all(
    Object.values(instances).map((instance) => instance.start()),
  )

  // Teardown
  return () => Promise.all(shutdown.map((fn) => fn()))
}

import * as anvilInstances from './src/anvil.js'
import * as relayInstances from './src/relay.js'

export default async function () {
  // Set up Anvil instances
  const shutdownAnvil = await Promise.all(
    Object.values(anvilInstances).map((instance) => instance.start()),
  )
  const shutdownRelay = await Promise.all(
    Object.values(relayInstances).map((instance) => instance.start()),
  )

  // Teardown
  return () =>
    Promise.all([...shutdownAnvil, ...shutdownRelay].map((fn) => fn()))
}

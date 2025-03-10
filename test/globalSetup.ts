import * as Anvil from './src/anvil.js'
import * as Relay from './src/relay.js'

export default async function () {
  // Set up Anvil instances
  const shutdownAnvil = await Promise.all(
    Object.values(Anvil.instances).map((instance) => instance.start()),
  )
  const shutdownRelay = await Promise.all(
    Object.values(Relay.instances).map((instance) => instance.start()),
  )

  // Teardown
  return () =>
    Promise.all([...shutdownAnvil, ...shutdownRelay].map((fn) => fn()))
}

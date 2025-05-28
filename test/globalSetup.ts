import * as Anvil from './src/anvil.js'
import * as RpcServer from './src/rpcServer.js'

export default async function () {
  // Set up Anvil instances
  const shutdownAnvil = await Promise.all(
    Object.values(Anvil.instances).map(async (instance) => {
      const stop = await instance.start()
      await fetch(`${instance.rpcUrl}/start`)
      return stop
    }),
  )
  const shutdownRpcServer = await Promise.all(
    Object.values(RpcServer.instances).map(async (instance) => {
      const stop = await instance.start()
      await fetch(`${instance.rpcUrl}/start`)
      return stop
    }),
  )

  // Teardown
  return () =>
    Promise.all([...shutdownAnvil, ...shutdownRpcServer].map((fn) => fn()))
}

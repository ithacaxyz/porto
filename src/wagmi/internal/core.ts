import {
  type BaseError,
  type Config,
  type Connector,
  ConnectorAlreadyConnectedError,
  type CreateConnectorFn,
  ProviderNotFoundError,
} from '@wagmi/core'
import {
  type ConnectReturnType,
  getConnectorClient,
  disconnect as wagmi_disconnect,
} from '@wagmi/core/actions'
import {
  type Address,
  type Chain,
  ChainMismatchError,
  createClient,
  custom,
  type EIP1193Provider,
} from 'viem'
import type { PartialBy } from '../../core/internal/types.js'
import type * as RpcSchema from '../../core/RpcSchema.js'
import * as AccountActions from '../../viem/AccountActions.js'
import * as WalletActions from '../../viem/WalletActions.js'
import type { ChainIdParameter, ConnectorParameter } from './types.js'

export async function connect<config extends Config>(
  config: config,
  parameters: connect.Parameters,
): Promise<connect.ReturnType> {
  // "Register" connector if not already created
  let connector: Connector
  if (typeof parameters.connector === 'function') {
    connector = config._internal.connectors.setup(parameters.connector)
  } else connector = parameters.connector

  // Check if connector is already connected
  if (connector.uid === config.state.current && !parameters.force)
    throw new ConnectorAlreadyConnectedError()

  try {
    config.setState((x) => ({ ...x, status: 'connecting' }))
    connector.emitter.emit('message', { type: 'connecting' })

    const provider = (await connector.getProvider()) as
      | EIP1193Provider
      | undefined
    if (!provider) throw new ProviderNotFoundError()

    const client = createClient({
      transport: (opts) => custom(provider)({ ...opts, retryCount: 0 }),
    })

    const chainIds_request = parameters.chainIds ?? [config.state.chainId]

    const { accounts, chainIds } = await WalletActions.connect(client, {
      ...parameters,
      chainIds: chainIds_request,
    })
    const addresses = accounts.map((x) => x.address) as unknown as readonly [
      Address,
      ...Address[],
    ]

    // we already connected, but call `connector.connect` so connector even listeners are set up
    await connector.connect({
      chainId: chainIds_request[0],
      isReconnecting: true,
    })

    connector.emitter.off('connect', config._internal.events.connect)
    connector.emitter.on('change', config._internal.events.change)
    connector.emitter.on('disconnect', config._internal.events.disconnect)

    await config.storage?.setItem('recentConnectorId', connector.id)
    config.setState((x) => ({
      ...x,
      connections: new Map(x.connections).set(connector.uid, {
        accounts: addresses,
        chainId: chainIds[0]!,
        connector,
      }),
      current: connector.uid,
      status: 'connected',
    }))

    return { accounts, chainIds }
  } catch (error) {
    config.setState((x) => ({
      ...x,
      // Keep existing connector connected in case of error
      status: x.current ? 'connected' : 'disconnected',
    }))
    throw error
  }
}

export declare namespace connect {
  type Parameters = RpcSchema.wallet_connect.Capabilities & {
    connector: Connector | CreateConnectorFn
    chainIds?: readonly [number, ...number[]] | undefined
    force?: boolean | undefined
  }

  type ReturnType = RpcSchema.wallet_connect.Response

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function disconnect(
  config: Config,
  parameters: disconnect.Parameters = {},
): Promise<disconnect.ReturnType> {
  const connector = (() => {
    if (parameters.connector) return parameters.connector
    const { connections, current } = config.state
    const connection = connections.get(current!)
    return connection?.connector
  })()

  const provider = (await connector?.getProvider()) as
    | EIP1193Provider
    | undefined

  await wagmi_disconnect(config, parameters)

  if (!provider) return

  const client = createClient({
    transport: (opts) => custom(provider)({ ...opts, retryCount: 0 }),
  })
  await WalletActions.disconnect(client)
}

export declare namespace disconnect {
  type Parameters = ConnectorParameter

  // biome-ignore lint/suspicious/noConfusingVoidType: _
  type ReturnType = void

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function addFunds<config extends Config>(
  config: config,
  parameters: addFunds.Parameters<config>,
): Promise<addFunds.ReturnType> {
  const { address, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account: address,
    chainId,
    connector,
  })

  return WalletActions.addFunds(client, parameters)
}

export declare namespace addFunds {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter &
    WalletActions.addFunds.Parameters

  type ReturnType = WalletActions.addFunds.ReturnType

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function getAdmins<config extends Config>(
  config: config,
  parameters: getAdmins.Parameters<config>,
): Promise<getAdmins.ReturnType> {
  const { address, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account: address,
    chainId,
    connector,
  })

  return WalletActions.getAdmins(client, parameters)
}

export declare namespace getAdmins {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter &
    WalletActions.getAdmins.Parameters

  type ReturnType = WalletActions.getAdmins.ReturnType

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function getAssets<config extends Config>(
  config: config,
  parameters: getAssets.Parameters = {},
): Promise<getAssets.ReturnType> {
  const { account, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    connector,
  })

  return WalletActions.getAssets(client as any, parameters)
}

export declare namespace getAssets {
  type Parameters = ConnectorParameter &
    PartialBy<WalletActions.getAssets.Parameters, 'account'>

  type ReturnType = WalletActions.getAssets.ReturnType

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function getPermissions<config extends Config>(
  config: config,
  parameters: getPermissions.Parameters<config> = {},
): Promise<getPermissions.ReturnType> {
  const { address, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account: address,
    chainId,
    connector,
  })

  return WalletActions.getPermissions(client, parameters)
}

export declare namespace getPermissions {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter &
    WalletActions.getPermissions.Parameters

  type ReturnType = WalletActions.getPermissions.ReturnType

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function grantAdmin<config extends Config>(
  config: config,
  parameters: grantAdmin.Parameters<config>,
): Promise<grantAdmin.ReturnType> {
  const { address, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account: address,
    chainId,
    connector,
  })

  return WalletActions.grantAdmin(client, parameters)
}

export declare namespace grantAdmin {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter &
    WalletActions.grantAdmin.Parameters

  type ReturnType = WalletActions.grantAdmin.ReturnType

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function grantPermissions<config extends Config>(
  config: config,
  parameters: grantPermissions.Parameters<config>,
): Promise<grantPermissions.ReturnType> {
  const { address, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account: address,
    chainId,
    connector,
  })

  return WalletActions.grantPermissions(client, parameters)
}

export declare namespace grantPermissions {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter &
    WalletActions.grantPermissions.Parameters

  type ReturnType = WalletActions.grantPermissions.ReturnType

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function revokeAdmin<config extends Config>(
  config: config,
  parameters: revokeAdmin.Parameters<config>,
) {
  const { address, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account: address,
    chainId,
    connector,
  })

  return WalletActions.revokeAdmin(client, parameters)
}

export declare namespace revokeAdmin {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter &
    WalletActions.revokeAdmin.Parameters

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function revokePermissions<config extends Config>(
  config: config,
  parameters: revokePermissions.Parameters<config>,
) {
  const { address, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account: address,
    chainId,
    connector,
  })

  return WalletActions.revokePermissions(client, parameters)
}

export declare namespace revokePermissions {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter &
    WalletActions.revokePermissions.Parameters

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function upgradeAccount<config extends Config>(
  config: config,
  parameters: upgradeAccount.Parameters<config>,
): Promise<upgradeAccount.ReturnType> {
  // "Register" connector if not already created
  let connector: Connector
  if (typeof parameters.connector === 'function') {
    connector = config._internal.connectors.setup(parameters.connector)
  } else connector = parameters.connector

  // Check if connector is already connected
  if (connector.uid === config.state.current)
    throw new ConnectorAlreadyConnectedError()

  if (parameters.chainId && parameters.chainId !== config.state.chainId)
    throw new ChainMismatchError({
      chain:
        config.chains.find((chain) => chain.id === parameters.chainId) ??
        ({
          id: parameters.chainId,
          name: `Chain ${parameters.chainId}`,
        } as Chain),
      currentChainId: config.state.chainId,
    })

  try {
    config.setState((x) => ({ ...x, status: 'connecting' }))
    connector.emitter.emit('message', { type: 'connecting' })

    const provider = (await connector.getProvider()) as
      | EIP1193Provider
      | undefined
    if (!provider) throw new ProviderNotFoundError()

    const client = createClient({
      transport: (opts) => custom(provider)({ ...opts, retryCount: 0 }),
    })

    await WalletActions.upgradeAccount(client, parameters)

    // we already connected, but call `connector.connect` so connector even listeners are set up
    const data = await connector.connect({
      chainId: parameters.chainId,
      isReconnecting: true,
    })
    const accounts = data.accounts as readonly [Address, ...Address[]]

    connector.emitter.off('connect', config._internal.events.connect)
    connector.emitter.on('change', config._internal.events.change)
    connector.emitter.on('disconnect', config._internal.events.disconnect)

    await config.storage?.setItem('recentConnectorId', connector.id)
    config.setState((x) => ({
      ...x,
      connections: new Map(x.connections).set(connector.uid, {
        accounts,
        chainId: data.chainId,
        connector,
      }),
      current: connector.uid,
      status: 'connected',
    }))

    return { accounts, chainId: data.chainId }
  } catch (error) {
    config.setState((x) => ({
      ...x,
      // Keep existing connector connected in case of error
      status: x.current ? 'connected' : 'disconnected',
    }))
    throw error
  }
}

export declare namespace upgradeAccount {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    WalletActions.upgradeAccount.Parameters & {
      connector: Connector | CreateConnectorFn
    }

  type ReturnType<config extends Config = Config> = ConnectReturnType<config>

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function verifyEmail<config extends Config>(
  config: config,
  parameters: verifyEmail.Parameters<config>,
): Promise<verifyEmail.ReturnType> {
  const { chainId, connector, walletAddress } = parameters

  const client = await getConnectorClient(config, {
    account: walletAddress,
    chainId,
    connector,
  })

  return AccountActions.verifyEmail(client, parameters)
}

export declare namespace verifyEmail {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter &
    AccountActions.verifyEmail.Parameters

  type ReturnType = AccountActions.verifyEmail.ReturnType

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

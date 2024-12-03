import type { RpcSchema } from 'ox'
import {
  type Address,
  type Chain,
  ChainMismatchError,
  type EIP1193Provider,
  type Hex,
  type PrivateKeyAccount,
} from 'viem'
import {
  type BaseErrorType,
  type Config,
  type Connector,
  ConnectorAlreadyConnectedError,
  type CreateConnectorFn,
  ProviderNotFoundError,
} from 'wagmi'
import {
  type ConnectReturnType,
  getConnectorClient,
  disconnect as wagmi_disconnect,
} from 'wagmi/actions'

import type {
  CreateAccountParameters,
  GrantSessionParameters,
  Schema,
} from '../rpcSchema.js'
import type { ChainIdParameter, ConnectorParameter } from './types.js'

export async function connect<config extends Config>(
  config: config,
  parameters: connect.Parameters<config>,
): Promise<connect.ReturnType<config>> {
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

    const { createAccount, grantSession } = parameters
    const method = 'experimental_connect'
    type method = typeof method
    await provider.request<{
      Method: method
      Parameters?: RpcSchema.ExtractParams<Schema, method>
      ReturnType: RpcSchema.ExtractReturnType<Schema, method>
    }>({
      method,
      params: [{ capabilities: { createAccount, grantSession } }],
    })
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

export declare namespace connect {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> & {
    connector: Connector | CreateConnectorFn
    createAccount?: boolean | CreateAccountParameters | undefined
    grantSession?: boolean | GrantSessionParameters | undefined
  }

  type ReturnType<config extends Config = Config> = ConnectReturnType<config>

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseErrorType
}

export async function createAccount<config extends Config>(
  config: config,
  parameters: createAccount.Parameters<config>,
): Promise<createAccount.ReturnType<config>> {
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

    const { label } = parameters
    const method = 'experimental_createAccount'
    type method = typeof method
    await provider.request<{
      Method: method
      Parameters?: RpcSchema.ExtractParams<Schema, method>
      ReturnType: RpcSchema.ExtractReturnType<Schema, method>
    }>({
      method,
      params: [{ label }],
    })

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

export declare namespace createAccount {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> & {
    connector: Connector | CreateConnectorFn
    label?: string | undefined
  }

  type ReturnType<config extends Config = Config> = ConnectReturnType<config>

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseErrorType
}

export async function disconnect(
  config: Config,
  parameters: disconnect.Parameters,
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

  const method = 'experimental_disconnect'
  type method = typeof method
  await provider?.request<{
    Method: method
    Parameters: never
    ReturnType: never
  }>({ method })
}

export declare namespace disconnect {
  type Parameters = ConnectorParameter

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  type ReturnType = void

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseErrorType
}

export async function grantSession<config extends Config>(
  config: config,
  parameters: grantSession.Parameters<config>,
): Promise<grantSession.ReturnType> {
  const { address, chainId, connector, expiry } = parameters

  const client = await getConnectorClient(config, {
    account: address,
    chainId,
    connector,
  })

  const method = 'experimental_grantSession'
  type method = typeof method
  return client.request<{
    Method: method
    Parameters?: RpcSchema.ExtractParams<Schema, method>
    ReturnType: RpcSchema.ExtractReturnType<Schema, method>
  }>({
    method,
    params: [{ address, expiry }],
  })
}

export declare namespace grantSession {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter & {
      address?: Address | undefined
      expiry?: number | undefined
    }

  type ReturnType = {
    expiry: number
    id: Hex
  }

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseErrorType
}

export async function importAccount<config extends Config>(
  config: config,
  parameters: importAccount.Parameters<config>,
): Promise<importAccount.ReturnType> {
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

    const { account, grantSession, label } = parameters

    const experimental_prepareImportAccount =
      'experimental_prepareImportAccount'
    type experimental_prepareImportAccount =
      typeof experimental_prepareImportAccount
    const { context, signPayloads } = await provider.request<{
      Method: experimental_prepareImportAccount
      Parameters?: RpcSchema.ExtractParams<
        Schema,
        experimental_prepareImportAccount
      >
      ReturnType: RpcSchema.ExtractReturnType<
        Schema,
        experimental_prepareImportAccount
      >
    }>({
      method: experimental_prepareImportAccount,
      params: [
        { address: account.address, capabilities: { grantSession }, label },
      ],
    })

    const signatures = await Promise.all(
      signPayloads.map((hash) => account.sign({ hash })),
    )

    const experimental_importAccount = 'experimental_importAccount'
    type experimental_importAccount = typeof experimental_importAccount
    await provider.request<{
      Method: experimental_importAccount
      Parameters?: RpcSchema.ExtractParams<Schema, experimental_importAccount>
      ReturnType: RpcSchema.ExtractReturnType<
        Schema,
        experimental_importAccount
      >
    }>({
      method: experimental_importAccount,
      params: [{ context, signatures }],
    })

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

export declare namespace importAccount {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> & {
    account: PrivateKeyAccount
    connector: Connector | CreateConnectorFn
    grantSession?: boolean | GrantSessionParameters | undefined
    label?: string | undefined
  }

  type ReturnType<config extends Config = Config> = ConnectReturnType<config>

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseErrorType
}

export async function sessions<config extends Config>(
  config: config,
  parameters: sessions.Parameters<config>,
): Promise<sessions.ReturnType> {
  const { address, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account: address,
    chainId,
    connector,
  })

  const method = 'experimental_sessions'
  type method = typeof method
  return client.request<{
    Method: method
    Parameters?: RpcSchema.ExtractParams<Schema, method>
    ReturnType: RpcSchema.ExtractReturnType<Schema, method>
  }>({
    method,
    params: [{ address }],
  })
}

export declare namespace sessions {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter & {
      address?: Address | undefined
    }

  type ReturnType = readonly {
    expiry: number
    id: Hex
  }[]

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseErrorType
}

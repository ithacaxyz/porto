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
import type * as RpcSchema_ox from 'ox/RpcSchema'
import {
  type Address,
  type Chain,
  ChainMismatchError,
  type EIP1193Provider,
  type PrivateKeyAccount,
} from 'viem'
import * as Request from '../../core/internal/typebox/request.js'
import * as Rpc from '../../core/internal/typebox/rpc.js'
import * as Schema from '../../core/internal/typebox/schema.js'
import type * as RpcSchema from '../../core/RpcSchema.js'
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
  if (connector.uid === config.state.current && !parameters.force)
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

    const { createAccount, credentialId, grantPermissions, keyId } = parameters
    const method = 'wallet_connect'
    type method = typeof method
    await provider.request<{
      Method: method
      Parameters?: RpcSchema_ox.ExtractParams<RpcSchema.Schema, method>
      ReturnType: RpcSchema_ox.ExtractReturnType<RpcSchema.Schema, method>
    }>({
      method,
      params: [
        {
          capabilities: Schema.Encode(Request.wallet_connect.Capabilities, {
            createAccount,
            credentialId,
            grantPermissions,
            keyId,
          }),
        },
      ],
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
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    Schema.StaticDecode<typeof Request.wallet_connect.Capabilities> & {
      connector: Connector | CreateConnectorFn
      force?: boolean | undefined
    }

  type ReturnType<config extends Config = Config> = ConnectReturnType<config>

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
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
      Parameters?: RpcSchema_ox.ExtractParams<RpcSchema.Schema, method>
      ReturnType: RpcSchema_ox.ExtractReturnType<RpcSchema.Schema, method>
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
  type ErrorType = BaseError
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

  const method = 'wallet_disconnect'
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

  const method = 'experimental_getAdmins'
  type method = typeof method
  const response = await client.request<{
    Method: method
    Parameters?: RpcSchema_ox.ExtractParams<RpcSchema.Schema, method>
    ReturnType: RpcSchema_ox.ExtractReturnType<RpcSchema.Schema, method>
  }>({
    method,
    params: [{ address }],
  })

  return Schema.Decode(Rpc.experimental_getAdmins.Response, response)
}

export declare namespace getAdmins {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter & {
      address?: Address | undefined
    }

  type ReturnType = Schema.StaticDecode<
    typeof Rpc.experimental_getAdmins.Response
  >

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function getPermissions<config extends Config>(
  config: config,
  parameters: getPermissions.Parameters<config>,
): Promise<getPermissions.ReturnType> {
  const { address, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account: address,
    chainId,
    connector,
  })

  const method = 'experimental_getPermissions'
  type method = typeof method
  const response = await client.request<{
    Method: method
    Parameters?: RpcSchema_ox.ExtractParams<RpcSchema.Schema, method>
    ReturnType: RpcSchema_ox.ExtractReturnType<RpcSchema.Schema, method>
  }>({
    method,
    params: [{ address }],
  })

  return Schema.Decode(Rpc.experimental_getPermissions.Response, response)
}

export declare namespace getPermissions {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter & {
      address?: Address | undefined
    }

  type ReturnType = Schema.StaticDecode<
    typeof Rpc.experimental_getPermissions.Response
  >

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function grantAdmin<config extends Config>(
  config: config,
  parameters: grantAdmin.Parameters<config>,
): Promise<grantAdmin.ReturnType> {
  const { address, chainId, connector, ...key } = parameters

  const client = await getConnectorClient(config, {
    account: address,
    chainId,
    connector,
  })

  const method = 'experimental_grantAdmin'
  type method = typeof method
  const response = await client.request<{
    Method: method
    Parameters?: RpcSchema_ox.ExtractParams<RpcSchema.Schema, method>
    ReturnType: RpcSchema_ox.ExtractReturnType<RpcSchema.Schema, method>
  }>({
    method,
    params: [
      Schema.Encode(Rpc.experimental_grantAdmin.Parameters, {
        address,
        ...key,
      } satisfies Rpc.experimental_grantAdmin.Parameters),
    ],
  })

  return Schema.Decode(Rpc.experimental_grantAdmin.Response, response)
}

export declare namespace grantAdmin {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Schema.StaticDecode<typeof Rpc.experimental_grantAdmin.Parameters> & {
      address?: Address | undefined
    }

  type ReturnType = Schema.StaticDecode<
    typeof Rpc.experimental_grantAdmin.Response
  >

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function grantPermissions<config extends Config>(
  config: config,
  parameters: grantPermissions.Parameters<config>,
): Promise<grantPermissions.ReturnType> {
  const { address, chainId, connector, ...key } = parameters

  const client = await getConnectorClient(config, {
    account: address,
    chainId,
    connector,
  })

  const method = 'experimental_grantPermissions'
  type method = typeof method
  const response = await client.request<{
    Method: method
    Parameters?: RpcSchema_ox.ExtractParams<RpcSchema.Schema, method>
    ReturnType: RpcSchema_ox.ExtractReturnType<RpcSchema.Schema, method>
  }>({
    method,
    params: [
      Schema.Encode(Rpc.experimental_grantPermissions.Parameters, {
        address,
        ...key,
      } satisfies Rpc.experimental_grantPermissions.Parameters),
    ],
  })

  return Schema.Decode(Rpc.experimental_grantPermissions.Response, response)
}

export declare namespace grantPermissions {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Schema.StaticDecode<typeof Rpc.experimental_grantPermissions.Parameters> & {
      address?: Address | undefined
    }

  type ReturnType = Schema.StaticDecode<
    typeof Rpc.experimental_grantPermissions.Response
  >

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function revokeAdmin<config extends Config>(
  config: config,
  parameters: revokeAdmin.Parameters<config>,
) {
  const { address, chainId, connector, feeToken, id } = parameters

  const client = await getConnectorClient(config, {
    account: address,
    chainId,
    connector,
  })

  const method = 'experimental_revokeAdmin'
  type method = typeof method
  return client.request<{
    Method: method
    Parameters?: RpcSchema_ox.ExtractParams<RpcSchema.Schema, method>
    ReturnType: RpcSchema_ox.ExtractReturnType<RpcSchema.Schema, method>
  }>({
    method,
    params: [{ address, capabilities: { feeToken }, id }],
  })
}

export declare namespace revokeAdmin {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Schema.StaticDecode<
      typeof Request.experimental_revokeAdmin.Capabilities
    > & {
      address?: Address | undefined
      id: Schema.StaticDecode<
        typeof Rpc.experimental_revokeAdmin.Parameters
      >['id']
    }

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

export async function revokePermissions<config extends Config>(
  config: config,
  parameters: revokePermissions.Parameters<config>,
) {
  const { address, chainId, connector, feeToken, id } = parameters

  const client = await getConnectorClient(config, {
    account: address,
    chainId,
    connector,
  })

  const method = 'experimental_revokePermissions'
  type method = typeof method
  return client.request<{
    Method: method
    Parameters?: RpcSchema_ox.ExtractParams<RpcSchema.Schema, method>
    ReturnType: RpcSchema_ox.ExtractReturnType<RpcSchema.Schema, method>
  }>({
    method,
    params: [{ address, capabilities: { feeToken }, id }],
  })
}

export declare namespace revokePermissions {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Schema.StaticDecode<
      typeof Request.experimental_revokePermissions.Capabilities
    > & {
      address?: Address | undefined
      id: Schema.StaticDecode<
        typeof Rpc.experimental_revokePermissions.Parameters
      >['id']
    }

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

    const { account, feeToken, grantPermissions, label } = parameters

    const method = 'experimental_prepareUpgradeAccount'
    type method = typeof method
    const { context, signPayloads } = await provider.request<{
      Method: method
      Parameters?: RpcSchema_ox.ExtractParams<RpcSchema.Schema, method>
      ReturnType: RpcSchema_ox.ExtractReturnType<RpcSchema.Schema, method>
    }>({
      method: method,
      params: [
        {
          address: account.address,
          capabilities: Schema.Encode(
            Request.experimental_prepareUpgradeAccount.Capabilities,
            {
              feeToken,
              grantPermissions,
            } satisfies Request.experimental_prepareUpgradeAccount.Capabilities,
          ),
          label,
        },
      ],
    })

    const signatures = await Promise.all(
      signPayloads.map((hash) => account.sign({ hash })),
    )

    const experimental_upgradeAccount = 'experimental_upgradeAccount'
    type experimental_upgradeAccount = typeof experimental_upgradeAccount
    await provider.request<{
      Method: experimental_upgradeAccount
      Parameters?: Schema.Static<
        typeof Rpc.experimental_upgradeAccount.Request.properties.params
      >
      ReturnType: Schema.Static<typeof Rpc.experimental_upgradeAccount.Response>
    }>({
      method: experimental_upgradeAccount,
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

export declare namespace upgradeAccount {
  type Parameters<config extends Config = Config> = ChainIdParameter<config> &
    Schema.StaticDecode<
      typeof Request.experimental_prepareUpgradeAccount.Capabilities
    > & {
      account: PrivateKeyAccount
      connector: Connector | CreateConnectorFn
      label?: string | undefined
    }

  type ReturnType<config extends Config = Config> = ConnectReturnType<config>

  // TODO: Exhaustive ErrorType
  type ErrorType = BaseError
}

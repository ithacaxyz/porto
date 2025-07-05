/**
 * Porto Wallet Actions.
 *
 * Note: These Actions will eventually be upstreamed into `viem` once an
 * API is solidified & stable.
 */

import {
  type Call,
  type Calls,
  type Chain,
  type Client,
  encodeFunctionData,
  type Narrow,
  type PrivateKeyAccount,
  type Transport,
  type WalletActions as viem_WalletActions,
} from 'viem'
import {
  getAddresses,
  getCallsStatus,
  getCapabilities,
  getChainId,
  requestAddresses,
  sendCalls,
  showCallsStatus,
  signMessage,
  signTypedData,
  waitForCallsStatus,
  writeContract,
} from 'viem/actions'
import * as Typebox from '../core/internal/typebox/typebox.js'
import * as RpcSchema from '../core/RpcSchema.js'
import type * as Account from './Account.js'
import type * as RpcSchema_viem from './RpcSchema.js'

const supportedWalletActions = [
  'getAddresses',
  'getCallsStatus',
  'getCapabilities',
  'getChainId',
  'requestAddresses',
  'sendCalls',
  'showCallsStatus',
  'signMessage',
  'signTypedData',
  'showCallsStatus',
  'waitForCallsStatus',
  'writeContract',
] as const satisfies (keyof viem_WalletActions)[]

export async function connect(
  client: Client,
  parameters: connect.Parameters = {},
): Promise<connect.ReturnType> {
  const method = 'wallet_connect' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      {
        capabilities: Typebox.Encode(
          RpcSchema.wallet_connect.Capabilities,
          Typebox.Clean(
            RpcSchema.wallet_connect.Capabilities,
            Typebox.Clone(
              parameters,
            ) satisfies RpcSchema.wallet_connect.Capabilities,
          ),
        ),
      },
    ],
  })

  return Typebox.Decode(
    RpcSchema.wallet_connect.Response,
    response satisfies Typebox.Static<typeof RpcSchema.wallet_connect.Response>,
  )
}

export declare namespace connect {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_connect.Capabilities
  >

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_connect.Response
  >
}

export async function disconnect(client: Client) {
  const method = 'wallet_disconnect' as const
  type Method = typeof method
  await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
  })
}

export async function addFunds(
  client: Client,
  parameters: addFunds.Parameters,
): Promise<addFunds.ReturnType> {
  const method = 'wallet_addFunds' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [Typebox.Encode(RpcSchema.wallet_addFunds.Parameters, parameters)],
  })

  return Typebox.Decode(
    RpcSchema.wallet_addFunds.Response,
    response satisfies Typebox.Static<
      typeof RpcSchema.wallet_addFunds.Response
    >,
  )
}

export declare namespace addFunds {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_addFunds.Parameters
  >

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_addFunds.Response
  >
}

export async function getAdmins(
  client: Client,
  parameters: getAdmins.Parameters = {},
): Promise<getAdmins.ReturnType> {
  const method = 'wallet_getAdmins' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(
        RpcSchema.wallet_getAdmins.Parameters,
        Typebox.Clean(
          RpcSchema.wallet_getAdmins.Parameters,
          parameters satisfies RpcSchema.wallet_getAdmins.Parameters,
        ),
      ),
    ],
  })

  return Typebox.Decode(
    RpcSchema.wallet_getAdmins.Response,
    response satisfies Typebox.Static<
      typeof RpcSchema.wallet_getAdmins.Response
    >,
  )
}

export declare namespace getAdmins {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_getAdmins.Parameters
  >

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_getAdmins.Response
  >
}

export async function getPermissions(
  client: Client,
  parameters: getPermissions.Parameters = {},
): Promise<getPermissions.ReturnType> {
  const method = 'wallet_getPermissions' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(
        RpcSchema.wallet_getPermissions.Parameters,
        Typebox.Clean(
          RpcSchema.wallet_getPermissions.Parameters,
          parameters satisfies RpcSchema.wallet_getPermissions.Parameters,
        ),
      ),
    ],
  })

  return Typebox.Decode(
    RpcSchema.wallet_getPermissions.Response,
    response satisfies Typebox.Static<
      typeof RpcSchema.wallet_getPermissions.Response
    >,
  )
}

export declare namespace getPermissions {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_getPermissions.Parameters
  >

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_getPermissions.Response
  >
}

export async function grantAdmin(
  client: Client,
  parameters: grantAdmin.Parameters,
): Promise<grantAdmin.ReturnType> {
  const method = 'wallet_grantAdmin' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(
        RpcSchema.wallet_grantAdmin.Parameters,
        Typebox.Clean(
          RpcSchema.wallet_grantAdmin.Parameters,
          parameters satisfies RpcSchema.wallet_grantAdmin.Parameters,
        ),
      ),
    ],
  })

  return Typebox.Decode(
    RpcSchema.wallet_grantAdmin.Response,
    response satisfies Typebox.Static<
      typeof RpcSchema.wallet_grantAdmin.Response
    >,
  )
}

export declare namespace grantAdmin {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_grantAdmin.Parameters.properties.capabilities
  > &
    Omit<
      Typebox.StaticDecode<typeof RpcSchema.wallet_grantAdmin.Parameters>,
      'capabilities'
    >

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_grantAdmin.Response
  >
}

export async function grantPermissions(
  client: Client,
  parameters: grantPermissions.Parameters,
): Promise<grantPermissions.ReturnType> {
  const method = 'wallet_grantPermissions' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(
        RpcSchema.wallet_grantPermissions.Parameters,
        Typebox.Clean(
          RpcSchema.wallet_grantPermissions.Parameters,
          parameters satisfies RpcSchema.wallet_grantPermissions.Parameters,
        ),
      ),
    ],
  })

  return Typebox.Decode(
    RpcSchema.wallet_grantPermissions.Response,
    response satisfies Typebox.Static<
      typeof RpcSchema.wallet_grantPermissions.Response
    >,
  )
}

export declare namespace grantPermissions {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_grantPermissions.Parameters
  >

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_grantPermissions.Response
  >
}

export async function prepareCalls<
  const calls extends readonly unknown[] = readonly unknown[],
>(
  client: Client,
  parameters: prepareCalls.Parameters<calls>,
): Promise<prepareCalls.ReturnType> {
  const method = 'wallet_prepareCalls' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(
        RpcSchema.wallet_prepareCalls.Parameters,
        Typebox.Clean(
          RpcSchema.wallet_prepareCalls.Parameters,
          Typebox.Clone({
            ...parameters,
            calls: (parameters.calls ?? []).map((c) => {
              const call = c as Call
              const data = (() => {
                if (!call.abi) return call.data
                return encodeFunctionData(call)
              })()
              return {
                ...call,
                data,
              }
            }),
          } satisfies RpcSchema.wallet_prepareCalls.Parameters),
        ),
      ),
    ],
  })

  return Typebox.Decode(
    RpcSchema.wallet_prepareCalls.Response,
    response satisfies Typebox.Static<
      typeof RpcSchema.wallet_prepareCalls.Response
    >,
  )
}

export declare namespace prepareCalls {
  type Parameters<calls extends readonly unknown[] = readonly unknown[]> = Omit<
    Typebox.StaticDecode<typeof RpcSchema.wallet_prepareCalls.Parameters>,
    'calls'
  > & {
    calls?: Calls<Narrow<calls>> | undefined
  }

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_prepareCalls.Response
  >
}

export async function revokeAdmin(
  client: Client,
  parameters: revokeAdmin.Parameters,
) {
  const method = 'wallet_revokeAdmin' as const
  type Method = typeof method
  await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(
        RpcSchema.wallet_revokeAdmin.Parameters,
        Typebox.Clean(
          RpcSchema.wallet_revokeAdmin.Parameters,
          parameters satisfies RpcSchema.wallet_revokeAdmin.Parameters,
        ),
      ),
    ],
  })
  return undefined
}

export declare namespace revokeAdmin {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_revokeAdmin.Parameters
  >
}

export async function revokePermissions(
  client: Client,
  parameters: revokePermissions.Parameters,
) {
  const { address, id, ...capabilities } = parameters
  const method = 'wallet_revokePermissions' as const
  type Method = typeof method
  await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(RpcSchema.wallet_revokePermissions.Parameters, {
        address,
        capabilities,
        id,
      } satisfies RpcSchema.wallet_revokePermissions.Parameters),
    ],
  })
  return undefined
}

export declare namespace revokePermissions {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_revokePermissions.Parameters.properties.capabilities
  > &
    Omit<
      Typebox.StaticDecode<
        typeof RpcSchema.wallet_revokePermissions.Parameters
      >,
      'capabilities'
    >
}

export async function sendPreparedCalls(
  client: Client,
  parameters: sendPreparedCalls.Parameters,
): Promise<sendPreparedCalls.ReturnType> {
  const method = 'wallet_sendPreparedCalls' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(
        RpcSchema.wallet_sendPreparedCalls.Parameters,
        Typebox.Clean(
          RpcSchema.wallet_sendPreparedCalls.Parameters,
          parameters satisfies RpcSchema.wallet_sendPreparedCalls.Parameters,
        ),
      ),
    ],
  })

  return Typebox.Decode(
    RpcSchema.wallet_sendPreparedCalls.Response,
    response satisfies Typebox.Static<
      typeof RpcSchema.wallet_sendPreparedCalls.Response
    >,
  )
}

export declare namespace sendPreparedCalls {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_sendPreparedCalls.Parameters
  >

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_sendPreparedCalls.Response
  >
}

export async function upgradeAccount(
  client: Client,
  parameters: upgradeAccount.Parameters,
): Promise<upgradeAccount.ReturnType> {
  const { account, chainId, ...capabilities } = parameters

  const method = 'wallet_prepareUpgradeAccount' as const
  type Method = typeof method
  const { context, digests } = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(RpcSchema.wallet_prepareUpgradeAccount.Parameters, {
        address: account.address,
        capabilities,
        chainId,
      } satisfies RpcSchema.wallet_prepareUpgradeAccount.Parameters),
    ],
  })

  const signatures = {
    auth: await account.sign({ hash: digests.auth }),
    exec: await account.sign({ hash: digests.exec }),
  }

  const method_upgrade = 'wallet_upgradeAccount' as const
  type Method_upgrade = typeof method_upgrade
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method_upgrade }>
  >({
    method: method_upgrade,
    params: [
      Typebox.Encode(RpcSchema.wallet_upgradeAccount.Parameters, {
        context,
        signatures,
      } satisfies RpcSchema.wallet_upgradeAccount.Parameters),
    ],
  })

  return Typebox.Decode(
    RpcSchema.wallet_upgradeAccount.Response,
    response satisfies Typebox.Static<
      typeof RpcSchema.wallet_upgradeAccount.Response
    >,
  )
}

export declare namespace upgradeAccount {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_prepareUpgradeAccount.Parameters.properties.capabilities
  > &
    Omit<
      Typebox.StaticDecode<
        typeof RpcSchema.wallet_prepareUpgradeAccount.Parameters
      >,
      'address' | 'capabilities'
    > & {
      account: PrivateKeyAccount | Account.Account
    }

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_upgradeAccount.Response
  >
}

export type Decorator<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account.Account | undefined = Account.Account | undefined,
> = Pick<
  viem_WalletActions<chain, account>,
  (typeof supportedWalletActions)[number]
> & {
  connect: (parameters: connect.Parameters) => Promise<connect.ReturnType>
  disconnect: () => Promise<void>
  getPermissions: (
    parameters: getPermissions.Parameters,
  ) => Promise<getPermissions.ReturnType>
  grantPermissions: (
    parameters: grantPermissions.Parameters,
  ) => Promise<grantPermissions.ReturnType>
  prepareCalls: (
    parameters: prepareCalls.Parameters,
  ) => Promise<prepareCalls.ReturnType>
  revokePermissions: (parameters: revokePermissions.Parameters) => Promise<void>
  sendPreparedCalls: (
    parameters: sendPreparedCalls.Parameters,
  ) => Promise<sendPreparedCalls.ReturnType>
  upgradeAccount: (
    parameters: upgradeAccount.Parameters,
  ) => Promise<upgradeAccount.ReturnType>
}

export function decorator<
  chain extends Chain | undefined,
  account extends Account.Account | undefined,
>(client: Client<Transport, chain, account>): Decorator<chain, account> {
  return {
    connect: (parameters) => connect(client, parameters),
    disconnect: () => disconnect(client),
    getAddresses: () => getAddresses(client),
    getCallsStatus: (parameters) => getCallsStatus(client, parameters),
    getCapabilities: () => getCapabilities(client),
    getChainId: () => getChainId(client),
    getPermissions: (parameters) => getPermissions(client, parameters),
    grantPermissions: (parameters) => grantPermissions(client, parameters),
    prepareCalls: (parameters) => prepareCalls(client, parameters),
    requestAddresses: () => requestAddresses(client),
    revokePermissions: (parameters) => revokePermissions(client, parameters),
    sendCalls: (parameters) => sendCalls(client, parameters),
    sendPreparedCalls: (parameters) => sendPreparedCalls(client, parameters),
    showCallsStatus: (parameters) => showCallsStatus(client, parameters),
    signMessage: (parameters) => signMessage(client, parameters),
    signTypedData: (parameters) => signTypedData(client, parameters),
    upgradeAccount: (parameters) => upgradeAccount(client, parameters),
    waitForCallsStatus: (parameters) => waitForCallsStatus(client, parameters),
    writeContract: (parameters) => writeContract(client, parameters),
  }
}

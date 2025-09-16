/**
 * Porto Wallet Actions.
 *
 * Note: These Actions will eventually be upstreamed into `viem` once an
 * API is solidified & stable.
 */

import * as Hex from 'ox/Hex'
import {
  type Call,
  type Calls,
  type Chain,
  type Client,
  encodeFunctionData,
  type Narrow,
  type PrivateKeyAccount,
  type Transport,
  type ValueOf,
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
import * as z from 'zod/mini'
import * as RpcSchema from '../core/RpcSchema.js'
import * as Account from './Account.js'
import type { GetAccountParameter } from './internal/utils.js'
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
    params: [z.encode(RpcSchema.wallet_addFunds.Parameters, parameters)],
  })

  return z.decode(RpcSchema.wallet_addFunds.Response, response)
}

export declare namespace addFunds {
  type Parameters = RpcSchema.wallet_addFunds.Parameters

  type ReturnType = RpcSchema.wallet_addFunds.Response
}

export async function getAssets<
  chain extends Chain | undefined,
  account extends Account.Account | undefined,
>(
  client: Client<Transport, chain, account>,
  ...parameters: account extends undefined
    ? [getAssets.Parameters<account>]
    : [getAssets.Parameters<account>] | []
): Promise<getAssets.ReturnType> {
  const { account = client.account, ...rest } = parameters[0] ?? {}

  const account_ = account ? Account.from(account) : undefined
  if (!account_) throw new Error('account is required')

  const method = 'wallet_getAssets' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      z.encode(RpcSchema.wallet_getAssets.Parameters, {
        ...rest,
        account: account_.address,
      }),
    ],
  })

  const value = z.decode(RpcSchema.wallet_getAssets.Response, response)
  const decoded = Object.entries(value).reduce(
    (acc, [key, value]) => {
      acc[Hex.toNumber(key as `0x${string}`)] = value
      return acc
    },
    {} as Record<number, ValueOf<typeof value>>,
  )

  return decoded
}

export declare namespace getAssets {
  type Parameters<account extends Account.Account | undefined = undefined> =
    Omit<RpcSchema.wallet_getAssets.Parameters, 'account'> &
      GetAccountParameter<account>

  type ReturnType = RpcSchema.wallet_getAssets.Response
}

export async function connect(
  client: Client,
  parameters: connect.Parameters = {},
): Promise<connect.ReturnType> {
  const { chainIds, ...capabilities } = parameters
  const method = 'wallet_connect' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      z.encode(RpcSchema.wallet_connect.Parameters, {
        capabilities,
        chainIds,
      }),
    ],
  })

  return z.decode(RpcSchema.wallet_connect.Response, response)
}

export declare namespace connect {
  type Parameters = RpcSchema.wallet_connect.Capabilities &
    Omit<RpcSchema.wallet_connect.Parameters, 'capabilities'>

  type ReturnType = RpcSchema.wallet_connect.Response
}

export async function disconnect(client: Client) {
  const method = 'wallet_disconnect' as const
  type Method = typeof method
  await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
  } as never)
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
    params: [z.encode(RpcSchema.wallet_getAdmins.Parameters, parameters)],
  })

  return z.decode(RpcSchema.wallet_getAdmins.Response, response)
}

export declare namespace getAdmins {
  type Parameters = RpcSchema.wallet_getAdmins.Parameters

  type ReturnType = RpcSchema.wallet_getAdmins.Response
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
    params: [z.encode(RpcSchema.wallet_getPermissions.Parameters, parameters)],
  })

  return z.decode(RpcSchema.wallet_getPermissions.Response, response)
}

export declare namespace getPermissions {
  type Parameters = RpcSchema.wallet_getPermissions.Parameters

  type ReturnType = RpcSchema.wallet_getPermissions.Response
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
    params: [z.encode(RpcSchema.wallet_grantAdmin.Parameters, parameters)],
  })

  return z.decode(RpcSchema.wallet_grantAdmin.Response, response)
}

export declare namespace grantAdmin {
  type Parameters = RpcSchema.wallet_grantAdmin.Capabilities &
    Omit<RpcSchema.wallet_grantAdmin.Parameters, 'capabilities'>

  type ReturnType = RpcSchema.wallet_grantAdmin.Response
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
      z.encode(RpcSchema.wallet_grantPermissions.Parameters, parameters),
    ],
  })

  return z.decode(RpcSchema.wallet_grantPermissions.Response, response)
}

export declare namespace grantPermissions {
  type Parameters = RpcSchema.wallet_grantPermissions.Parameters

  type ReturnType = RpcSchema.wallet_grantPermissions.Response
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
      z.encode(RpcSchema.wallet_prepareCalls.Parameters, {
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
      }),
    ],
  })

  return z.decode(RpcSchema.wallet_prepareCalls.Response, response)
}

export declare namespace prepareCalls {
  type Parameters<calls extends readonly unknown[] = readonly unknown[]> = Omit<
    RpcSchema.wallet_prepareCalls.Parameters,
    'calls'
  > & {
    calls?: Calls<Narrow<calls>> | undefined
  }

  type ReturnType = RpcSchema.wallet_prepareCalls.Response
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
    params: [z.encode(RpcSchema.wallet_revokeAdmin.Parameters, parameters)],
  })
  return undefined
}

export declare namespace revokeAdmin {
  type Parameters = RpcSchema.wallet_revokeAdmin.Parameters
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
      z.encode(RpcSchema.wallet_revokePermissions.Parameters, {
        address,
        capabilities,
        id,
      }),
    ],
  })
  return undefined
}

export declare namespace revokePermissions {
  type Parameters = RpcSchema.wallet_revokePermissions.Capabilities &
    Omit<RpcSchema.wallet_revokePermissions.Parameters, 'capabilities'>
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
      z.encode(RpcSchema.wallet_sendPreparedCalls.Parameters, parameters),
    ],
  })

  return z.decode(RpcSchema.wallet_sendPreparedCalls.Response, response)
}

export declare namespace sendPreparedCalls {
  type Parameters = RpcSchema.wallet_sendPreparedCalls.Parameters

  type ReturnType = RpcSchema.wallet_sendPreparedCalls.Response
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
      z.encode(RpcSchema.wallet_prepareUpgradeAccount.Parameters, {
        address: account.address,
        capabilities,
        chainId,
      }),
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
      z.encode(RpcSchema.wallet_upgradeAccount.Parameters, {
        context,
        signatures,
      }),
    ],
  })

  return z.decode(RpcSchema.wallet_upgradeAccount.Response, response)
}

export declare namespace upgradeAccount {
  type Parameters = RpcSchema.wallet_prepareUpgradeAccount.Capabilities &
    Omit<
      RpcSchema.wallet_prepareUpgradeAccount.Parameters,
      'address' | 'capabilities'
    > & {
      account: PrivateKeyAccount | Account.Account
    }

  type ReturnType = RpcSchema.wallet_upgradeAccount.Response
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

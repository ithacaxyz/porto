import * as AbiItem from 'ox/AbiItem'
import type * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import type * as z from 'zod/mini'

import type * as Account from '../../viem/Account.js'
import type * as Key from '../../viem/Key.js'
import type { RelayClient } from '../../viem/RelayClient.js'
import type * as Chains from '../Chains.js'
import type * as RpcSchema from '../RpcSchema.js'
import * as Call from './call.js'
import type * as PermissionsRequest from './permissionsRequest.js'
import type * as Porto from './porto.js'
import type * as Capabilities from './schema/capabilities.js'
import type * as RpcRequest from './schema/request.js'
import type * as Token from './schema/token.js'
import type { Assign, PartialBy } from './types.js'

export type ActionsInternal<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = Pick<Porto.Internal<chains>, 'config' | 'store'> & {
  /** Viem Client. */
  client: RelayClient
  /** RPC Request. */
  request: RpcRequest.Request
}

type PrepareCallsContext = {
  calls?: readonly Call.Call[] | undefined
  nonce?: bigint | undefined
  [key: string]: unknown
}

export type Mode = {
  actions: {
    addFunds: (parameters: {
      /** Address to add funds to. */
      address: Address.Address
      /** Internal properties. */
      internal: ActionsInternal
      /** Token to add funds to. */
      token?: Address.Address | undefined
      /** Amount to add. */
      value?: string | undefined
    }) => Promise<{ id: Hex.Hex }>

    createAccount: (parameters: {
      /** Admins to grant. */
      admins?: readonly Pick<Key.Key, 'publicKey' | 'type'>[] | undefined
      /** Whether to link `label` to account address as email. */
      email?: boolean | undefined
      /** Internal properties. */
      internal: ActionsInternal
      /** Label to associate with the WebAuthn credential. */
      label?: string | undefined
      /** Permissions to grant. */
      permissions?: PermissionsRequest.PermissionsRequest | undefined
      /** Adds support for offchain authentication using ERC-4361. */
      signInWithEthereum?: Capabilities.signInWithEthereum.Request | undefined
    }) => Promise<{
      /** Account. */
      account: Account.Account & {
        signInWithEthereum?:
          | {
              message: string
              signature: Hex.Hex
            }
          | undefined
      }
    }>

    disconnect?:
      | ((parameters: {
          /** Internal properties. */
          internal: ActionsInternal
        }) => Promise<void>)
      | undefined

    getAccountVersion: (parameters: {
      /** Address of the account to get the version of. */
      address: Address.Address
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<{
      /** Latest version. */
      latest: string
      /** Current version. */
      current: string
    }>

    getAssets: (
      parameters: RpcRequest.wallet_getAssets.Parameters & {
        /** Internal properties. */
        internal: ActionsInternal
      },
    ) => Promise<RpcSchema.wallet_getAssets.Response>

    getCallsStatus: (parameters: {
      /** ID of the calls to get the status of. */
      id: Hex.Hex
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<z.input<typeof RpcSchema.wallet_getCallsStatus.Response>>

    getCapabilities: (parameters: {
      /** Chain IDs to get the capabilities for. */
      chainIds?: readonly Hex.Hex[] | undefined
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<z.input<typeof RpcSchema.wallet_getCapabilities.Response>>

    getKeys: (parameters: {
      /** Account to get the keys for. */
      account: Account.Account
      /** Chain IDs to get the keys for. */
      chainIds?: readonly number[] | undefined
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<readonly Key.Key[]>

    grantAdmin: (parameters: {
      /** Account to grant admin for. */
      account: Account.Account
      /** Internal properties. */
      internal: ActionsInternal
      /** Fee token to use for execution. If not provided, the native token (e.g. ETH) will be used. */
      feeToken?: Token.Symbol | Address.Address | undefined
      /** Key to authorize as an admin. */
      key: Key.from.Value
    }) => Promise<{
      /** Key the admin is granted to. */
      key: Key.Key
    }>

    grantPermissions: (parameters: {
      /** Account to grant permissions for. */
      account: Account.Account
      /** Internal properties. */
      internal: ActionsInternal
      /** Permissions to grant. */
      permissions?: PermissionsRequest.PermissionsRequest | undefined
    }) => Promise<{
      /** Key the permissions are granted to. */
      key: Key.Key
    }>

    loadAccounts: (parameters: {
      /** Address of the account to load. */
      address?: Hex.Hex | undefined
      /** Key to use to load an existing account. */
      key?:
        | {
            /** Credential ID. May be `undefined` when the key is not a WebAuthn credential. */
            credentialId?: string | undefined
            /** Public key. */
            publicKey: Hex.Hex
          }
        | undefined
      /** Internal properties. */
      internal: ActionsInternal
      /** Permissions to grant. */
      permissions?: PermissionsRequest.PermissionsRequest | undefined
      /** Adds support for offchain authentication using ERC-4361. */
      signInWithEthereum?: Capabilities.signInWithEthereum.Request | undefined
    }) => Promise<{
      /** Accounts. */
      accounts: readonly (Account.Account & {
        signInWithEthereum?:
          | {
              message: string
              signature: Hex.Hex
            }
          | undefined
      })[]
    }>

    prepareCalls: (parameters: {
      /** Account to execute the calls with. */
      account: Account.Account
      /** Calls to execute. */
      calls: readonly Call.Call[]
      /** Key that will be used to sign over the digest. */
      key?: Pick<Key.Key, 'prehash' | 'publicKey' | 'type'> | undefined
      /** Fee token to use for execution. If not provided, the native token (e.g. ETH) will be used. */
      feeToken?: Token.Symbol | Address.Address | undefined
      /** Internal properties. */
      internal: ActionsInternal
      /** Merchant RPC URL. */
      merchantUrl?: string | undefined
      /** Required funds to execute the calls. */
      requiredFunds?:
        | RpcSchema.wallet_prepareCalls.Capabilities['requiredFunds']
        | undefined
    }) => Promise<{
      /** Account to execute the calls with. */
      account: Account.Account
      /** Chain ID. */
      chainId?: number | undefined
      /** Capabilities. */
      capabilities?:
        | RpcSchema.wallet_prepareCalls.Response['capabilities']
        | undefined
      /** Context for `sendPreparedCalls` */
      context: PrepareCallsContext
      /** Digest to sign. */
      digest: Hex.Hex
      /** Key that will sign over the digest. */
      key: Pick<Key.Key, 'prehash' | 'publicKey' | 'type'>
      /** EIP-712 typed data. */
      typedData: RpcSchema.wallet_prepareCalls.Response['typedData']
    }>

    prepareUpgradeAccount: (parameters: {
      /** Address of the account to import. */
      address: Address.Address
      /** Whether to link `label` to account address as email. */
      email?: boolean | undefined
      /** Label to associate with the account. */
      label?: string | undefined
      /** Internal properties. */
      internal: ActionsInternal
      /** Permissions to grant. */
      permissions?: PermissionsRequest.PermissionsRequest | undefined
    }) => Promise<{
      /** Digests to sign. */
      digests: {
        auth: Hex.Hex
        exec: Hex.Hex
      }
      /** Filled context for the `createAccount` implementation. */
      context: unknown
    }>

    revokeAdmin: (parameters: {
      /** Account to revoke the permissions for. */
      account: Account.Account
      /** Fee token to use for execution. If not provided, the native token (e.g. ETH) will be used. */
      feeToken?: Token.Symbol | Address.Address | undefined
      /** ID of the admin to revoke. */
      id: Hex.Hex
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<void>

    revokePermissions: (parameters: {
      /** Account to revoke the permissions for. */
      account: Account.Account
      /** Fee token to use for execution. If not provided, the native token (e.g. ETH) will be used. */
      feeToken?: Token.Symbol | Address.Address | undefined
      /** ID of the permissions to revoke. */
      id: Hex.Hex
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<void>

    sendCalls: (parameters: {
      /** Account to execute the calls with. */
      account: Account.Account
      /** Whether the returned bundle identifier is the transaction hash. */
      asTxHash?: boolean | undefined
      /** Calls to execute. */
      calls: readonly Call.Call[]
      /** Fee token to use for execution. If not provided, the native token (e.g. ETH) will be used. */
      feeToken?: Token.Symbol | Address.Address | undefined
      /** Internal properties. */
      internal: ActionsInternal
      /** Required funds to execute the calls. */
      requiredFunds?:
        | RpcSchema.wallet_prepareCalls.Capabilities['requiredFunds']
        | undefined
      /** Permissions ID to use to execute the calls. */
      permissionsId?: Hex.Hex | null | undefined
      /** Merchant RPC URL. */
      merchantUrl?: string | undefined
    }) => Promise<{ id: Hex.Hex }>

    sendPreparedCalls: (parameters: {
      /** Account. */
      account: Account.Account
      /** Context. */
      context: PrepareCallsContext
      /** Key. */
      key: Pick<Key.Key, 'prehash' | 'publicKey' | 'type'>
      /** Signature for execution. */
      signature: Hex.Hex
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<Hex.Hex>

    signPersonalMessage: (parameters: {
      /** Account to sign the message with. */
      account: Account.Account
      /** Data to sign. */
      data: Hex.Hex
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<Hex.Hex>

    signTypedData: (parameters: {
      /** Account to sign the message with. */
      account: Account.Account
      /** Data to sign. */
      data: string
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<Hex.Hex>

    switchChain?:
      | ((parameters: {
          /** Chain ID to switch to. */
          chainId: number
          /** Internal properties. */
          internal: ActionsInternal
        }) => Promise<void>)
      | undefined

    upgradeAccount: (parameters: {
      /** Account to upgrade. */
      account: Account.Account
      /** Preparation context (from `prepareUpgradeAccount`). */
      context: unknown
      /** Internal properties. */
      internal: ActionsInternal
      /** Preparation signatures (from `prepareUpgradeAccount`). */
      signatures: {
        auth: Hex.Hex
        exec: Hex.Hex
      }
    }) => Promise<{
      /** Account. */
      account: Account.Account
    }>

    verifyEmail: (parameters: {
      /** Account to sign the email + token with. */
      account: Account.Account
      /** Chain ID to verify against. */
      chainId: number
      /** Email to link to wallet address. */
      email: string
      /** Generated token value. */
      token: string
      /** Wallet address to link to email. */
      walletAddress: Address.Address
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<null>
  }
  config?: unknown | undefined
  name: string
  setup: (parameters: {
    /** Internal properties. */
    internal: Porto.Internal
  }) => () => void
}

/**
 * Instantiates a mode.
 *
 * @param mode - Mode.
 * @returns Mode.
 */
export function from<const mode extends from.Parameters>(
  mode: mode | from.Parameters,
): Assign<Mode, mode> {
  return {
    ...mode,
    setup: mode.setup ?? (() => () => {}),
  } as never
}

export declare namespace from {
  type Parameters = PartialBy<Mode, 'setup'>
}

/**
 * Returns the calls needed to authorize the given keys (and permissions).
 *
 * @param keys - Keys to authorize.
 * @returns Calls to authorize the given keys.
 */
export function getAuthorizeCalls(
  keys: readonly Key.Key[],
): readonly Call.Call[] {
  return keys.flatMap((key) => {
    const { permissions, role } = key

    const permissionCalls: Call.Call[] = []

    // Set call scopes.
    if (permissions?.calls)
      permissionCalls.push(
        ...permissions.calls.map((scope) => {
          const selector = (() => {
            if (!scope.signature) return undefined
            if (scope.signature.startsWith('0x'))
              return scope.signature as Hex.Hex
            return AbiItem.getSelector(scope.signature)
          })()
          return Call.setCanExecute({
            key,
            selector,
            to: scope.to,
          })
        }),
      )
    else if (role === 'session')
      permissionCalls.push(Call.setCanExecute({ key }))

    // Set spend limits.
    if (permissions?.spend)
      permissionCalls.push(
        ...permissions.spend.map((spend) =>
          Call.setSpendLimit({ key, ...spend }),
        ),
      )
    // If no spend limits are provided for a session, set a default of 0
    // (account cannot spend ERC20, ERC721, ETH, etc).
    else if (role === 'session')
      permissionCalls.push(
        Call.setSpendLimit({ key, limit: 0n, period: 'year' }),
      )

    // Set authorized contracts for signature verification.
    if (permissions?.signatureVerification) {
      const { addresses } = permissions.signatureVerification
      permissionCalls.push(
        ...addresses.map((address) =>
          Call.setSignatureCheckerApproval({
            address,
            enabled: true,
            key,
          }),
        ),
      )
    }

    return [Call.authorize({ key }), ...permissionCalls]
  })
}

/**
 *
 * @param parameters
 * @returns
 */
export async function getAuthorizedExecuteKey(parameters: {
  account: Account.Account
  calls: readonly Call.Call[]
  permissionsId?: Hex.Hex | null | undefined
}): Promise<Key.Key | undefined> {
  const { account, calls, permissionsId } = parameters

  // If a key is provided, use it.
  if (typeof permissionsId !== 'undefined') {
    if (permissionsId === null) return undefined
    const key = account.keys?.find(
      (key) => key.publicKey === permissionsId && key.privateKey,
    )
    if (!key)
      throw new Error(`permission (id: ${permissionsId}) does not exist.`)
    return key
  }

  // Otherwise, try and find a valid session key.
  const sessionKey = account.keys?.find((key) => {
    if (!key.privateKey) return false
    if (key.role !== 'session') return false
    if (key.expiry < BigInt(Math.floor(Date.now() / 1000))) return false

    // Check if every call is covered by a call permission.
    const hasValidScope = calls.every((call) =>
      key.permissions?.calls?.some((scope) => {
        if (scope.to && scope.to !== call.to) return false
        if (scope.signature) {
          if (!call.data) return false
          const selector = Hex.slice(call.data, 0, 4)
          if (Hex.validate(scope.signature)) return scope.signature === selector
          if (AbiItem.getSelector(scope.signature) !== selector) return false
        }
        return true
      }),
    )
    if (hasValidScope) return true

    return false
  })

  // Fall back to an admin key.
  const adminKey = account.keys?.find(
    (key) => key.role === 'admin' && key.privateKey,
  )

  return sessionKey ?? adminKey
}

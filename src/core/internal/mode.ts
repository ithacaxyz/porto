import * as AbiItem from 'ox/AbiItem'
import type * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import type * as Account from './account.js'
import * as Call from './call.js'
import type * as Key from './key.js'
import type * as PermissionsRequest from './permissionsRequest.js'
import type * as Porto from './porto.js'
import type * as Rpc from './typebox/rpc.js'
import type { Compute, PartialBy } from './types.js'

type Request = Rpc.parseRequest.ReturnType

type ActionsInternal = Pick<Porto.Internal, 'config' | 'store'> & {
  /** Viem Client. */
  client: Porto.Client
  /** RPC Request. */
  request: Request
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
      token: Address.Address
      /** Amount to add. */
      value?: bigint | undefined
    }) => Promise<{ id: Hex.Hex }>

    createAccount: (parameters: {
      /** Internal properties. */
      internal: ActionsInternal
      /** Label to associate with the WebAuthn credential. */
      label?: string | undefined
      /** Permissions to grant. */
      permissions?: PermissionsRequest.PermissionsRequest | undefined
    }) => Promise<{
      /** Account. */
      account: Account.Account
    }>

    grantAdmin: (parameters: {
      /** Account to authorize the keys for. */
      account: Account.Account
      /** Internal properties. */
      internal: ActionsInternal
      /** Fee token to use for execution. If not provided, the native token (e.g. ETH) will be used. */
      feeToken?: Address.Address | undefined
      /** Key to authorize. */
      key: Key.from.Value
    }) => Promise<{ key: Key.Key }>

    grantPermissions: (parameters: {
      /** Account to authorize the keys for. */
      account: Account.Account
      /** Internal properties. */
      internal: ActionsInternal
      /** Permissions to grant. */
      permissions?: PermissionsRequest.PermissionsRequest | undefined
    }) => Promise<{ key: Key.Key }>

    loadAccounts: (parameters: {
      /** Credential ID to use to load an existing account. */
      credentialId?: string | undefined
      /** Key ID of the account to load. */
      keyId?: Hex.Hex | undefined
      /** Internal properties. */
      internal: ActionsInternal
      /** Permissions to grant. */
      permissions?: PermissionsRequest.PermissionsRequest | undefined
    }) => Promise<{
      /** Accounts. */
      accounts: readonly Account.Account[]
    }>

    prepareCalls: (parameters: {
      /** Account to execute the calls with. */
      account: Account.Account
      /** Calls to execute. */
      calls: readonly Call.Call[]
      /** Key that will be used to sign over the digest. */
      key: Pick<Key.Key, 'prehash' | 'publicKey' | 'type'>
      /** Fee token to use for execution. If not provided, the native token (e.g. ETH) will be used. */
      feeToken?: Address.Address | undefined
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<{
      /** Account to execute the calls with. */
      account: Account.Account
      /** Context for `sendPreparedCalls` */
      context: PrepareCallsContext
      /** Key that will sign over the digest. */
      key: Pick<Key.Key, 'prehash' | 'publicKey' | 'type'>
      /** Payloads to sign. */
      signPayloads: readonly Hex.Hex[]
    }>

    prepareUpgradeAccount: (parameters: {
      /** Address of the account to import. */
      address: Address.Address
      /** Fee token to use for execution. If not provided, the native token (e.g. ETH) will be used. */
      feeToken?: Address.Address | undefined
      /** Label to associate with the account. */
      label?: string | undefined
      /** Internal properties. */
      internal: ActionsInternal
      /** Permissions to grant. */
      permissions?: PermissionsRequest.PermissionsRequest | undefined
    }) => Promise<{
      /** Filled context for the `createAccount` implementation. */
      context: unknown
      /** Hex payloads to sign over. */
      signPayloads: readonly Hex.Hex[]
    }>

    revokeAdmin: (parameters: {
      /** Account to revoke the permissions for. */
      account: Account.Account
      /** Fee token to use for execution. If not provided, the native token (e.g. ETH) will be used. */
      feeToken?: Address.Address | undefined
      /** ID of the admin to revoke. */
      id: Hex.Hex
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<void>

    revokePermissions: (parameters: {
      /** Account to revoke the permissions for. */
      account: Account.Account
      /** Fee token to use for execution. If not provided, the native token (e.g. ETH) will be used. */
      feeToken?: Address.Address | undefined
      /** ID of the permissions to revoke. */
      id: Hex.Hex
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<void>

    sendCalls: (parameters: {
      /** Account to execute the calls with. */
      account: Account.Account
      /** Calls to execute. */
      calls: readonly Call.Call[]
      /** Fee token to use for execution. If not provided, the native token (e.g. ETH) will be used. */
      feeToken?: Address.Address | undefined
      /** Permissions ID to use to execute the calls. */
      permissionsId?: Hex.Hex | undefined
      /** Internal properties. */
      internal: ActionsInternal
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

    upgradeAccount: (parameters: {
      /** Account to upgrade. */
      account: Account.Account
      /** Preparation context (from `prepareUpgradeAccount`). */
      context: unknown
      /** Internal properties. */
      internal: ActionsInternal
      /** Preparation signatures (from `prepareUpgradeAccount`). */
      signatures: readonly Hex.Hex[]
    }) => Promise<{
      /** Account. */
      account: Account.Account
    }>
  }
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
): Compute<mode & Pick<Mode, 'setup'>> {
  return {
    ...mode,
    setup: mode.setup ?? (() => {}),
  } as mode & Pick<Mode, 'setup'>
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
  permissionsId?: Hex.Hex | undefined
}): Promise<Key.Key | undefined> {
  const { account, calls, permissionsId } = parameters

  // If a key is provided, use it.
  if (permissionsId) {
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

    const hasValidScope = key.permissions?.calls?.some((scope) =>
      calls.some((call) => {
        if (scope.to && scope.to !== call.to) return false
        if (scope.signature) {
          if (!call.data) return false
          const selector = Hex.slice(call.data, 0, 4)
          if (Hex.validate(scope.signature) && scope.signature !== selector)
            return false
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

import * as AbiParameters from 'ox/AbiParameters'
import * as Address from 'ox/Address'
import type * as Errors from 'ox/Errors'
import type * as Hex from 'ox/Hex'
import * as Secp256k1 from 'ox/Secp256k1'
import * as Signature from 'ox/Signature'

import type { Chain } from '../Chains.js'
import * as Account from './account.js'
import * as Key from './key.js'
import type { Client } from './porto.js'
import type * as Capabilities from './relay/typebox/capabilities.js'
import type { MaybePromise, OneOf, RequiredBy } from './types.js'
import * as Actions from './viem/relay.js'

/**
 * Creates a new Porto Account via the Relay.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function createAccount(
  client: Client,
  parameters: createAccount.Parameters,
): Promise<createAccount.ReturnType> {
  if (parameters.signatures) {
    const { account, context, signatures } = parameters
    await Actions.createAccount(client, {
      context,
      signatures,
    })
    return account
  }

  // Create root id signer
  const idSigner_root = createIdSigner()

  const keys =
    typeof parameters.keys === 'function'
      ? await parameters.keys({ ids: [idSigner_root.id] })
      : parameters.keys
  const keys_relay = keys.map(Key.toRelay)
  const signers = [idSigner_root, ...keys.slice(1).map(createIdSigner)]

  const request = await prepareCreateAccount(client, { ...parameters, keys })

  const signatures = signers.map((signer, index) =>
    signer.sign({ digest: request.digests[index]! }),
  )

  await createAccount(client, {
    ...request,
    signatures: signatures.map((signature, index) => ({
      publicKey: keys_relay[index]!.publicKey,
      type: keys_relay[index]!.type,
      value: signature,
    })),
  })

  const account = Account.from({
    address: request.account.address,
    keys: keys.map((key, index) => ({
      ...key,
      id: signers[index]!.id,
    })),
  })

  return account
}

export namespace createAccount {
  export type Parameters = OneOf<
    | {
        account: RequiredBy<Account.Account, 'keys'>
        context: Actions.createAccount.Parameters['context']
        signatures: Actions.createAccount.Parameters['signatures']
      }
    | (Omit<prepareCreateAccount.Parameters, 'keys'> & {
        /**
         * Keys to authorize.
         *
         * Accepts:
         * - An array of keys.
         * - A function that returns an array of keys. The function will be called
         *   with the key's unique `id` as a parameter.
         */
        keys:
          | readonly Key.Key[]
          | ((p: { ids: readonly Hex.Hex[] }) => MaybePromise<
              readonly Key.Key[]
            >)
      })
  >

  export type ReturnType = RequiredBy<Account.Account, 'keys'>

  export type ErrorType =
    | Actions.createAccount.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Creates an ephemeral signer to sign over an Account's key identifier.
 *
 * @returns ID Signer.
 */
function createIdSigner(): createIdSigner.ReturnType {
  const privateKey = Secp256k1.randomPrivateKey()
  const publicKey = Secp256k1.getPublicKey({ privateKey })
  const id = Address.fromPublicKey(publicKey)
  return {
    id,
    sign({ digest }) {
      return Signature.toHex(Secp256k1.sign({ payload: digest, privateKey }))
    },
  } as const
}

export namespace createIdSigner {
  export type ReturnType = {
    id: Hex.Hex
    sign(p: { digest: Hex.Hex }): Hex.Hex
  }
}

/**
 * Gets the accounts for a given key identifier.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Accounts.
 */
export async function getAccounts(
  client: Client,
  parameters: getAccounts.Parameters,
): Promise<getAccounts.ReturnType> {
  const { keyId } = parameters
  const accounts = await Actions.getAccounts(client, { keyId })
  return accounts.map((account) => {
    const keys = account.keys.map(Key.fromRelay)
    return Account.from({
      address: account.address,
      keys,
    })
  })
}

export namespace getAccounts {
  export type Parameters = Omit<Actions.getAccounts.Parameters, 'id'> & {
    keyId: Hex.Hex
  }

  export type ReturnType = readonly RequiredBy<Account.Account, 'keys'>[]

  export type ErrorType = Actions.getAccounts.ErrorType
}

/**
 * Gets the digest to sign over a candidate key identifier.
 *
 * @param parameters - Parameters.
 * @returns Digest.
 */
export function getIdDigest(parameters: getIdDigest.Parameters): Hex.Hex {
  const { id, key } = parameters
  return AbiParameters.encode(
    [{ type: 'bytes' }, { type: 'address' }],
    [Key.hash(key), id],
  )
}

export namespace getIdDigest {
  export type Parameters = {
    id: Hex.Hex
    key: Key.Key
  }
}

/**
 * Gets the keys for an account.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Account keys.
 */
export async function getKeys(
  client: Client,
  parameters: getKeys.Parameters,
): Promise<getKeys.ReturnType> {
  const account = Account.from(parameters.account)
  const keys = await Actions.getKeys(client, { address: account.address })
  return keys.map(Key.fromRelay)
}

export namespace getKeys {
  export type Parameters = Omit<Actions.getKeys.Parameters, 'address'> & {
    account: Account.Account | Address.Address
  }

  export type ReturnType = readonly Key.Key[]

  export type ErrorType = Actions.getKeys.ErrorType
}

/**
 * Prepares the digest to sign over and fills the request to send a call bundle.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Prepare call bundle parameters.
 * @returns Prepared properties.
 */
export async function prepareCalls<const calls extends readonly unknown[]>(
  client: Client,
  parameters: prepareCalls.Parameters<calls>,
) {
  const { calls, key, feeToken, nonce, pre, revokeKeys } = parameters

  const account = Account.from(parameters.account)

  const idSigner = createIdSigner()
  const authorizeKeys = (parameters.authorizeKeys ?? []).map((key) => {
    if (key.role === 'admin')
      return Key.toRelay({
        ...key,
        signature: idSigner.sign({
          digest: getIdDigest({ id: idSigner.id, key }),
        }),
      })
    return Key.toRelay(key)
  })

  const hash = Key.hash(key)

  const preOp = typeof pre === 'boolean' ? pre : false
  const preOps =
    typeof pre === 'object'
      ? pre.map(({ context, signature }) => ({
          ...context.op,
          signature,
        }))
      : undefined

  const { capabilities, context, digest } = await Actions.prepareCalls(client, {
    address: account.address,
    calls: (calls ?? []) as any,
    capabilities: {
      authorizeKeys,
      meta: {
        feeToken,
        keyHash: hash,
        nonce,
      },
      preOp,
      preOps,
      revokeKeys: revokeKeys?.map((key) => ({
        hash: key.hash,
      })),
    },
  })
  return {
    capabilities,
    context: { ...context, key },
    digest,
  } as const
}

export namespace prepareCalls {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
  > = {
    /** Additional keys to authorize on the account. */
    authorizeKeys?: readonly Key.Key[] | undefined
    /** Account to prepare the calls for. */
    account: Account.Account
    /** Calls to prepare. */
    calls?: Actions.prepareCalls.Parameters<calls>['calls'] | undefined
    /** Key that will be used to sign the calls. */
    key: Pick<Key.Key, 'publicKey' | 'prehash' | 'type'>
    /**
     * Indicates if the bundle is a pre-bundle, and should be executed before
     * the main bundle.
     *
     * Accepts:
     * - `true`: Indicates this is a pre-bundle.
     * - An array: Set of prepared pre-bundles.
     */
    pre?:
      | true
      | readonly {
          context: prepareCalls.ReturnType['context']
          signature: Hex.Hex
        }[]
      | undefined
    /** Additional keys to revoke from the account. */
    revokeKeys?: readonly Key.Key[] | undefined
  } & Omit<Capabilities.meta.Request, 'keyHash'>

  export type ReturnType = {
    capabilities: Actions.prepareCalls.ReturnType['capabilities']
    context: Actions.prepareCalls.ReturnType['context'] & {
      key: Parameters['key']
    }
    digest: Actions.prepareCalls.ReturnType['digest']
  }

  export type ErrorType =
    | Actions.prepareCalls.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Prepares a new Porto Account via the Relay.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function prepareCreateAccount(
  client: Client,
  parameters: prepareCreateAccount.Parameters,
) {
  const {
    chain = client.chain,
    delegation = chain.contracts.delegation.address,
    keys,
  } = parameters

  const authorizeKeys = keys.map(Key.toRelay)

  const { address, capabilities, context, digests } =
    await Actions.prepareCreateAccount(client, {
      capabilities: {
        authorizeKeys,
        delegation,
      },
      chain,
    })

  const account = Account.from({
    address,
    keys,
  })

  return {
    account,
    capabilities,
    context,
    digests,
  }
}

export namespace prepareCreateAccount {
  export type Parameters = {
    /** Chain to prepare the account for. */
    chain?: Chain | undefined
    /** Contract address to delegate to. */
    delegation?: Address.Address | undefined
    /** Keys to authorize. */
    keys: readonly Key.Key[]
  }

  export type ReturnType = {
    account: RequiredBy<Account.Account, 'keys'>
    capabilities: Actions.prepareCreateAccount.ReturnType['capabilities']
    context: Actions.prepareCreateAccount.ReturnType['context']
    digests: Actions.prepareCreateAccount.ReturnType['digests']
  }

  export type ErrorType =
    | Actions.prepareCreateAccount.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Prepares an account upgrade.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function prepareUpgradeAccount(
  client: Client,
  parameters: prepareUpgradeAccount.Parameters,
) {
  const {
    address,
    delegation = client.chain.contracts.delegation.address,
    feeToken,
  } = parameters

  // Create root id signer
  const idSigner_root = createIdSigner()

  const keys =
    typeof parameters.keys === 'function'
      ? await parameters.keys({ ids: [idSigner_root.id] })
      : parameters.keys
  const keys_relay = keys.map(Key.toRelay)
  const signers = [idSigner_root, ...keys.slice(1).map(createIdSigner)]

  const authorizeKeys = signers.map((signer, index) => ({
    ...keys_relay[index]!,
    signature: signer.sign({
      digest: getIdDigest({ id: signer.id, key: keys[index]! }),
    }),
  }))

  const { capabilities, context, digests } =
    await Actions.prepareUpgradeAccount(client, {
      address,
      capabilities: {
        authorizeKeys,
        delegation,
        feeToken,
      },
    })

  const account = Account.from({
    address,
    keys,
  })

  return {
    capabilities,
    context: {
      ...context,
      account,
    },
    digests,
  }
}

export declare namespace prepareUpgradeAccount {
  export type Parameters = {
    /** Address of the account to upgrade. */
    address: Address.Address
    /** Contract address to delegate to. */
    delegation?: Address.Address | undefined
    /** Fee token. */
    feeToken?: Address.Address | undefined
    /**
     * Keys to authorize.
     *
     * Accepts:
     * - An array of keys.
     * - A function that returns an array of keys. The function will be called
     *   with the key's unique `id` as a parameter.
     */
    keys:
      | readonly Key.Key[]
      | ((p: { ids: readonly Hex.Hex[] }) => MaybePromise<readonly Key.Key[]>)
  }

  export type ReturnType = Omit<
    Actions.prepareUpgradeAccount.ReturnType,
    'context'
  > & {
    context: Actions.prepareUpgradeAccount.ReturnType['context'] & {
      account: Account.Account
    }
  }

  export type ErrorType =
    | Actions.prepareUpgradeAccount.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Broadcasts a call bundle to the Relay.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Bundle identifier.
 */
export async function sendCalls<const calls extends readonly unknown[]>(
  client: Client,
  parameters: sendCalls.Parameters<calls>,
) {
  // If a signature is provided, broadcast the calls to the Relay.
  if (parameters.signature) {
    const { context, signature } = parameters
    const key = Key.toRelay(Key.from(context.key))
    return await Actions.sendPreparedCalls(client, {
      context,
      signature: {
        prehash: context.key.prehash,
        publicKey: key.publicKey,
        type: key.type,
        value: signature,
      },
    })
  }

  // If no signature is provided, prepare the calls and sign them.

  const account = Account.from(parameters.account)
  const key = parameters.key ?? Account.getKey(account, parameters)
  if (!key) throw new Error('key is required')

  // Prepare pre-bundles.
  const pre = await Promise.all(
    (parameters.pre ?? []).map(async (pre) => {
      if (pre.signature) return pre

      const { authorizeKeys, key, calls, revokeKeys } = pre
      const { context, digest } = await prepareCalls(client, {
        account,
        authorizeKeys,
        feeToken: parameters.feeToken,
        calls,
        key,
        pre: true,
        revokeKeys,
      })
      const signature = await Key.sign(key, {
        payload: digest,
      })
      return { context, signature }
    }),
  )

  // Prepare main bundle.
  const { context, digest } = await prepareCalls(client, {
    ...parameters,
    key,
    pre,
  })

  // Sign over the bundles.
  const signature = await Key.sign(key, {
    payload: digest,
    wrap: false,
  })

  // Broadcast the bundle to the Relay.
  return await sendCalls(client, { context, signature })
}

export declare namespace sendCalls {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
  > = OneOf<
    | {
        /** Context. */
        context: prepareCalls.ReturnType['context']
        /** Signature. */
        signature: Hex.Hex
      }
    | (Omit<prepareCalls.Parameters<calls>, 'key' | 'pre'> & {
        /** Key to sign the bundle with. */
        key?: Key.Key | undefined
        /** Pre-bundle to execute before the main bundle. */
        pre?:
          | readonly OneOf<
              | {
                  context: prepareCalls.ReturnType['context']
                  signature: Hex.Hex
                }
              | (Pick<
                  prepareCalls.Parameters<calls>,
                  'authorizeKeys' | 'calls' | 'revokeKeys'
                > & {
                  key: Key.Key
                })
            >[]
          | undefined
      })
  >

  export type ReturnType = Actions.sendPreparedCalls.ReturnType

  export type ErrorType =
    | Actions.sendPreparedCalls.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Broadcasts an account upgrade.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function upgradeAccount(
  client: Client,
  parameters: upgradeAccount.Parameters,
) {
  const { context, signatures } = parameters

  const { bundles } = await Actions.upgradeAccount(client, {
    context,
    signatures,
  })

  return {
    account: context.account,
    bundles,
  }
}

export declare namespace upgradeAccount {
  export type Parameters = {
    context: prepareUpgradeAccount.ReturnType['context']
    signatures: readonly Hex.Hex[]
  }

  export type ReturnType = Actions.upgradeAccount.ReturnType & {
    account: Account.Account
  }

  export type ErrorType =
    | Actions.upgradeAccount.ErrorType
    | Errors.GlobalErrorType
}

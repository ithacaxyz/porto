import * as AbiParameters from 'ox/AbiParameters'
import * as Address from 'ox/Address'
import type * as Errors from 'ox/Errors'
import type * as Hex from 'ox/Hex'
import * as Secp256k1 from 'ox/Secp256k1'
import * as Signature from 'ox/Signature'
import {
  type Calls,
  type Client,
  createClient,
  type GetChainParameter,
  http,
  type Narrow,
  type Transport,
  zeroAddress,
} from 'viem'
import type { Chain } from '../core/Chains.js'
import type * as Capabilities from '../core/internal/rpcServer/typebox/capabilities.js'
import type * as Quote from '../core/internal/rpcServer/typebox/quote.js'
import type { MaybePromise, OneOf, RequiredBy } from '../core/internal/types.js'
import * as U from '../core/internal/utils.js'
import * as Account from './Account.js'
import * as ServerActions from './internal/serverActions.js'
import type { GetAccountParameter } from './internal/utils.js'
import * as Key from './Key.js'

export {
  getCallsStatus,
  getCapabilities,
  health,
} from './internal/serverActions.js'

/**
 * Creates a new Porto Account via the RPC.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function createAccount<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: createAccount.Parameters<chain>,
): Promise<createAccount.ReturnType> {
  if (parameters.signatures) {
    const { account, context, signatures } = parameters
    await ServerActions.createAccount(client, {
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

  const hasSessionKey = keys.some((x) => x.role === 'session')
  const orchestrator = hasSessionKey
    ? (await ServerActions.getCapabilities(client)).contracts.orchestrator
        .address
    : undefined

  const keys_rpc = keys.map((key) =>
    Key.toRpcServer(key, {
      orchestrator,
    }),
  )
  const signers = [idSigner_root, ...keys.slice(1).map(createIdSigner)]

  const request = await prepareCreateAccount(client, {
    ...parameters,
    keys,
  } as never)

  const signatures = signers.map((signer, index) =>
    signer.sign({ digest: request.digests[index]! }),
  )

  await createAccount(client, {
    ...request,
    signatures: signatures.map((signature, index) => ({
      publicKey: keys_rpc[index]!.publicKey,
      type: keys_rpc[index]!.type,
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
  export type Parameters<chain extends Chain | undefined = Chain | undefined> =
    GetChainParameter<chain> &
      OneOf<
        | {
            account: RequiredBy<Account.Account, 'keys'>
            context: ServerActions.createAccount.Parameters['context']
            signatures: ServerActions.createAccount.Parameters['signatures']
          }
        | (Omit<prepareCreateAccount.Parameters, 'chain' | 'keys'> & {
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
              | ((p: {
                  ids: readonly Hex.Hex[]
                }) => MaybePromise<readonly Key.Key[]>)
          })
      >

  export type ReturnType = RequiredBy<Account.Account, 'keys'>

  export type ErrorType =
    | ServerActions.createAccount.ErrorType
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
export async function getAccounts<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getAccounts.Parameters<chain>,
): Promise<getAccounts.ReturnType> {
  const { chain, keyId } = parameters
  const accounts = await ServerActions.getAccounts(client, { chain, keyId })
  return accounts.map((account) => {
    const keys = account.keys.map(Key.fromRpcServer)
    return Account.from({
      address: account.address,
      keys,
    })
  })
}

export namespace getAccounts {
  export type Parameters<chain extends Chain | undefined = Chain | undefined> =
    GetChainParameter<chain> & {
      keyId: Hex.Hex
    }

  export type ReturnType = readonly RequiredBy<Account.Account, 'keys'>[]

  export type ErrorType = ServerActions.getAccounts.ErrorType
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
export async function getKeys<
  chain extends Chain | undefined,
  account extends Account.Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: getKeys.Parameters<chain, account>,
): Promise<getKeys.ReturnType> {
  const { account = client.account, chain } = parameters
  const account_ = account ? Account.from(account) : undefined
  if (!account_) throw new Error('account is required.')
  const keys = await ServerActions.getKeys(client, {
    address: account_.address,
    chain,
  })
  return keys.map(Key.fromRpcServer)
}

export namespace getKeys {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account.Account | undefined = Account.Account | undefined,
  > = GetChainParameter<chain> & GetAccountParameter<account>

  export type ReturnType = readonly Key.Key[]

  export type ErrorType = ServerActions.getKeys.ErrorType
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
export async function prepareCalls<
  const calls extends readonly unknown[],
  chain extends Chain | undefined,
  account extends Account.Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: prepareCalls.Parameters<calls, chain, account>,
): Promise<prepareCalls.ReturnType> {
  const {
    account = client.account,
    calls,
    chain,
    key,
    feeToken,
    nonce,
    permissionsFeeLimit,
    preCalls,
    revokeKeys,
    sponsorUrl,
  } = parameters

  const account_ = account ? Account.from(account) : undefined

  const hasSessionKey = parameters.authorizeKeys?.some(
    (x) => x.role === 'session',
  )
  const orchestrator = hasSessionKey
    ? (await ServerActions.getCapabilities(client)).contracts.orchestrator
        .address
    : undefined

  const idSigner = createIdSigner()
  const authorizeKeys = (parameters.authorizeKeys ?? []).map((key) => {
    if (key.role === 'admin')
      return Key.toRpcServer(
        {
          ...key,
          signature: idSigner.sign({
            digest: getIdDigest({ id: idSigner.id, key }),
          }),
        },
        { orchestrator },
      )

    const permissions = resolvePermissions(key, {
      feeToken,
      permissionsFeeLimit,
    })
    return Key.toRpcServer(
      {
        ...key,
        permissions,
      },
      { orchestrator },
    )
  })

  const preCall = typeof preCalls === 'boolean' ? preCalls : false
  const signedPreCalls =
    typeof preCalls === 'object'
      ? preCalls.map(({ context, signature }) => ({
          ...(context.preCall as any),
          signature,
        }))
      : undefined

  const client_ = sponsorUrl
    ? createClient({
        chain: client.chain,
        transport: http(sponsorUrl),
      })
    : client

  const { capabilities, context, digest } = await ServerActions.prepareCalls(
    client_,
    {
      address: account_?.address,
      calls: (calls ?? []) as any,
      capabilities: {
        authorizeKeys,
        meta: {
          feeToken,
          nonce,
        },
        preCall,
        preCalls: signedPreCalls,
        revokeKeys: revokeKeys?.map((key) => ({
          hash: key.hash,
        })),
      },
      chain,
      key: key ? Key.toRpcServer(key) : undefined,
    },
  )
  return {
    capabilities: { ...capabilities, quote: context.quote as any },
    context,
    digest,
    key,
  } as const
}

export namespace prepareCalls {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
    chain extends Chain | undefined = Chain | undefined,
    account extends Account.Account | undefined = Account.Account | undefined,
  > = GetChainParameter<chain> &
    GetAccountParameter<account, false> & {
      /** Additional keys to authorize on the account. */
      authorizeKeys?: readonly Key.Key[] | undefined
      /** Calls to prepare. */
      calls?: Calls<Narrow<calls>> | undefined
      /** Key that will be used to sign the calls. */
      key?: Pick<Key.Key, 'publicKey' | 'prehash' | 'type'> | undefined
      /** Permissions fee limit. */
      permissionsFeeLimit?: bigint | undefined
      /**
       * Indicates if the bundle is "pre-calls", and should be executed before
       * the main bundle.
       *
       * Accepts:
       * - `true`: Indicates this is pre-calls.
       * - An array: Set of prepared pre-calls.
       */
      preCalls?:
        | true
        | readonly {
            context: prepareCalls.ReturnType['context']
            signature: Hex.Hex
          }[]
        | undefined
      /** Additional keys to revoke from the account. */
      revokeKeys?: readonly Key.Key[] | undefined
      /** Sponsor URL. */
      sponsorUrl?: string | undefined
    } & Omit<Capabilities.meta.Request, 'keyHash'>

  export type ReturnType = {
    capabilities: ServerActions.prepareCalls.ReturnType['capabilities'] & {
      quote: Quote.Quote
    }
    context: ServerActions.prepareCalls.ReturnType['context']
    digest: ServerActions.prepareCalls.ReturnType['digest']
    key: Parameters['key']
  }

  export type ErrorType =
    | ServerActions.prepareCalls.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Prepares a new Porto Account via the RPC.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function prepareCreateAccount<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: prepareCreateAccount.Parameters<chain>,
) {
  const { chain = client.chain, keys } = parameters

  const { contracts } = await ServerActions.getCapabilities(client)

  const delegation = parameters.delegation ?? contracts.accountProxy.address
  const hasSessionKey = keys.some((x) => x.role === 'session')
  const orchestrator = hasSessionKey
    ? contracts.orchestrator.address
    : undefined

  const authorizeKeys = keys.map((key) =>
    Key.toRpcServer(key, {
      orchestrator,
    }),
  )

  const { address, capabilities, context, digests } =
    await ServerActions.prepareCreateAccount(client, {
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
  export type Parameters<chain extends Chain | undefined = Chain | undefined> =
    GetChainParameter<chain> & {
      /** Contract address to delegate to. */
      delegation?: Address.Address | undefined
      /** Keys to authorize. */
      keys: readonly Key.Key[]
    }

  export type ReturnType = {
    account: RequiredBy<Account.Account, 'keys'>
    capabilities: ServerActions.prepareCreateAccount.ReturnType['capabilities']
    context: ServerActions.prepareCreateAccount.ReturnType['context']
    digests: ServerActions.prepareCreateAccount.ReturnType['digests']
  }

  export type ErrorType =
    | ServerActions.prepareCreateAccount.ErrorType
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
export async function prepareUpgradeAccount<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: prepareUpgradeAccount.Parameters<chain>,
): Promise<prepareUpgradeAccount.ReturnType> {
  const { address, chain, feeToken, permissionsFeeLimit } = parameters

  const { contracts } = await ServerActions.getCapabilities(client)

  // Create root id signer
  const idSigner_root = createIdSigner()

  const keys =
    typeof parameters.keys === 'function'
      ? await parameters.keys({ ids: [idSigner_root.id] })
      : parameters.keys

  const delegation = parameters.delegation ?? contracts.accountProxy.address
  const hasSessionKey = keys.some((x) => x.role === 'session')
  const orchestrator = hasSessionKey
    ? contracts.orchestrator.address
    : undefined

  const keys_rpc = keys.map((key) => {
    const permissions =
      key.role === 'session'
        ? resolvePermissions(key, {
            feeToken,
            permissionsFeeLimit,
          })
        : undefined
    return Key.toRpcServer(
      {
        ...key,
        permissions,
      },
      { orchestrator },
    )
  })
  const signers = [idSigner_root, ...keys.slice(1).map(createIdSigner)]

  const authorizeKeys = signers.map((signer, index) => ({
    ...keys_rpc[index]!,
    signature: signer.sign({
      digest: getIdDigest({ id: signer.id, key: keys[index]! }),
    }),
  }))

  const { capabilities, context, digests, typedData } =
    await ServerActions.prepareUpgradeAccount(client, {
      address,
      capabilities: {
        authorizeKeys,
        delegation,
        feeToken,
      },
      chain,
    })

  const account = U.normalizeValue(
    Account.from({
      address,
      keys,
    }),
  )

  return {
    capabilities,
    context: {
      ...context,
      account,
    },
    digests,
    typedData,
  }
}

export declare namespace prepareUpgradeAccount {
  export type Parameters<chain extends Chain | undefined = Chain | undefined> =
    GetChainParameter<chain> & {
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
      /** Permissions fee limit. */
      permissionsFeeLimit?: bigint | undefined
    }

  export type ReturnType = Omit<
    ServerActions.prepareUpgradeAccount.ReturnType,
    'context'
  > & {
    context: ServerActions.prepareUpgradeAccount.ReturnType['context'] & {
      account: Account.Account
    }
  }

  export type ErrorType =
    | ServerActions.prepareUpgradeAccount.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Broadcasts a call bundle to the RPC Server.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Bundle identifier.
 */
export async function sendCalls<
  const calls extends readonly unknown[],
  chain extends Chain | undefined,
  account extends Account.Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: sendCalls.Parameters<calls, chain, account>,
): Promise<sendCalls.ReturnType> {
  const { account = client.account, chain } = parameters

  // If no signature is provided, prepare the calls and sign them.
  const account_ = account ? Account.from(account) : undefined
  if (!account_) throw new Error('account is required.')

  const key = parameters.key ?? Account.getKey(account_, parameters)
  if (!key) throw new Error('key is required')

  // Prepare pre-calls.
  const preCalls = await Promise.all(
    (parameters.preCalls ?? []).map(async (pre) => {
      if (pre.signature) return pre

      const { authorizeKeys, key, calls, revokeKeys } = pre
      const { context, digest } = await prepareCalls(client, {
        account: account_,
        authorizeKeys,
        calls,
        chain,
        feeToken: parameters.feeToken,
        key,
        preCalls: true,
        revokeKeys,
      })
      const signature = await Key.sign(key, {
        payload: digest,
      })
      return { context, signature }
    }),
  )

  // Prepare main bundle.
  const { capabilities, context, digest } = await prepareCalls(client, {
    ...parameters,
    account: account_,
    chain,
    key,
    preCalls,
  } as never)

  // Sign over the bundles.
  const signature = await Key.sign(key, {
    payload: digest,
    wrap: false,
  })

  // Broadcast the bundle to the RPC Server.
  return await sendPreparedCalls(client, {
    capabilities: capabilities.feeSignature
      ? {
          feeSignature: capabilities.feeSignature,
        }
      : undefined,
    context,
    key,
    signature,
  })
}

export declare namespace sendCalls {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
    chain extends Chain | undefined = Chain | undefined,
    account extends Account.Account | undefined = Account.Account | undefined,
  > = Omit<
    prepareCalls.Parameters,
    'account' | 'calls' | 'chain' | 'key' | 'preCalls'
  > &
    GetAccountParameter<account> &
    GetChainParameter<chain> & {
      /** Calls to execute. */
      calls?: Calls<Narrow<calls>> | undefined
      /** Key to sign the bundle with. */
      key?: Key.Key | undefined
      /** Calls to execute before the main bundle. */
      preCalls?:
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
      /** Sponsor URL. */
      sponsorUrl?: string | undefined
    }

  export type ReturnType = ServerActions.sendPreparedCalls.ReturnType

  export type ErrorType =
    | ServerActions.sendPreparedCalls.ErrorType
    | Errors.GlobalErrorType
}

export async function sendPreparedCalls(
  client: Client,
  parameters: sendPreparedCalls.Parameters,
): Promise<sendPreparedCalls.ReturnType> {
  const { capabilities, context, key, signature } = parameters
  return await ServerActions.sendPreparedCalls(client, {
    capabilities,
    context,
    key: Key.toRpcServer(key),
    signature,
  })
}

export declare namespace sendPreparedCalls {
  export type Parameters = {
    /** Capabilities. */
    capabilities?:
      | ServerActions.sendPreparedCalls.Parameters['capabilities']
      | undefined
    /** Context. */
    context: prepareCalls.ReturnType['context']
    /** Key. */
    key: Pick<Key.Key, 'publicKey' | 'prehash' | 'type'>
    /** Signature. */
    signature: Hex.Hex
  }

  export type ReturnType = ServerActions.sendPreparedCalls.ReturnType

  export type ErrorType = ServerActions.sendPreparedCalls.ErrorType
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

  const { bundles } = await ServerActions.upgradeAccount(client, {
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

  export type ReturnType = ServerActions.upgradeAccount.ReturnType & {
    account: Account.Account
  }

  export type ErrorType =
    | ServerActions.upgradeAccount.ErrorType
    | Errors.GlobalErrorType
}

export type Decorator<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account.Account | undefined = Account.Account | undefined,
> = {
  /**
   * Creates a new Porto Account.
   *
   * @example
   * TODO
   *
   * @param client - Client to use.
   * @param parameters - Parameters.
   * @returns Result.
   */
  createAccount: (
    parameters: createAccount.Parameters<chain>,
  ) => Promise<createAccount.ReturnType>
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
  getAccounts: (
    parameters: getAccounts.Parameters<chain>,
  ) => Promise<getAccounts.ReturnType>
  /**
   * Gets the status of a call bundle.
   *
   * @example
   * TODO
   *
   * @param client - The client to use.
   * @param parameters - Parameters.
   * @returns Result.
   */
  getCallsStatus: (
    parameters: ServerActions.getCallsStatus.Parameters,
  ) => Promise<ServerActions.getCallsStatus.ReturnType>
  /**
   * Gets the capabilities for a given chain ID.
   *
   * @example
   * TODO
   *
   * @param client - The client to use.
   * @param options - Options.
   * @returns Result.
   */
  getCapabilities: <
    const chainIds extends readonly number[] | undefined = undefined,
    const raw extends boolean = false,
  >() => Promise<ServerActions.getCapabilities.ReturnType<chainIds, raw>>
  /**
   * Gets the keys for a given account.
   *
   * @example
   * TODO
   *
   * @param client - The client to use.
   * @param parameters - Parameters.
   * @returns Result.
   */
  getKeys: (
    parameters: getKeys.Parameters<chain, account>,
  ) => Promise<getKeys.ReturnType>
  /**
   * Gets the health of the RPC.
   *
   * @example
   * TODO
   *
   * @param client - The client to use.
   * @returns Result.
   */
  health: () => Promise<ServerActions.health.ReturnType>
  /**
   * Prepares a call bundle.
   *
   * @example
   * TODO
   *
   * @param client - The client to use.
   * @param parameters - Parameters.
   * @returns Result.
   */
  prepareCalls: <const calls extends readonly unknown[]>(
    parameters: prepareCalls.Parameters<calls, chain, account>,
  ) => Promise<prepareCalls.ReturnType>
  /**
   * Prepares a new account creation.
   *
   * @example
   * TODO
   *
   * @param client - The client to use.
   * @param parameters - Parameters.
   * @returns Result.
   */
  prepareCreateAccount: (
    parameters: prepareCreateAccount.Parameters<chain>,
  ) => Promise<prepareCreateAccount.ReturnType>
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
  prepareUpgradeAccount: (
    parameters: prepareUpgradeAccount.Parameters<chain>,
  ) => Promise<prepareUpgradeAccount.ReturnType>
  /**
   * Broadcasts a call bundle.
   *
   * @example
   * TODO
   *
   * @param client - Client to use.
   * @param parameters - Parameters.
   * @returns Result.
   */
  sendCalls: <const calls extends readonly unknown[]>(
    parameters: sendCalls.Parameters<calls, chain, account>,
  ) => Promise<sendCalls.ReturnType>
  /**
   * Broadcasts a signed call bundle.
   *
   * @example
   * TODO
   *
   * @param client - The client to use.
   * @param parameters - Parameters.
   * @returns Result.
   */
  sendPreparedCalls: (
    parameters: sendPreparedCalls.Parameters,
  ) => Promise<sendPreparedCalls.ReturnType>
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
  upgradeAccount: (
    parameters: upgradeAccount.Parameters,
  ) => Promise<upgradeAccount.ReturnType>
  /**
   * Verifies a signature.
   *
   * @example
   * TODO
   *
   * @param client - The client to use.
   * @param parameters - Parameters.
   * @returns Result.
   */
  verifySignature: (
    parameters: ServerActions.verifySignature.Parameters<chain>,
  ) => Promise<ServerActions.verifySignature.ReturnType>
}

export function decorator<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account.Account | undefined = Account.Account | undefined,
>(client: Client<transport, chain, account>): Decorator<chain, account> {
  return {
    createAccount: (parameters) => createAccount(client, parameters),
    getAccounts: (parameters) => getAccounts(client, parameters),
    getCallsStatus: (parameters) =>
      ServerActions.getCallsStatus(client, parameters),
    getCapabilities: () => ServerActions.getCapabilities(client),
    getKeys: (parameters) => getKeys(client, parameters),
    health: () => ServerActions.health(client),
    prepareCalls: (parameters) => prepareCalls(client, parameters),
    prepareCreateAccount: (parameters) =>
      prepareCreateAccount(client, parameters),
    prepareUpgradeAccount: (parameters) =>
      prepareUpgradeAccount(client, parameters),
    sendCalls: (parameters) => sendCalls(client, parameters),
    sendPreparedCalls: (parameters) => sendPreparedCalls(client, parameters),
    upgradeAccount: (parameters) => upgradeAccount(client, parameters),
    verifySignature: (parameters) =>
      ServerActions.verifySignature(client, parameters),
  }
}

function resolvePermissions(
  key: Key.Key,
  options: {
    feeToken?: Address.Address | undefined
    permissionsFeeLimit?: bigint | undefined
  },
) {
  const { feeToken = zeroAddress, permissionsFeeLimit } = options

  const spend = key.permissions?.spend ? [...key.permissions.spend] : []

  if (spend && permissionsFeeLimit) {
    let index = -1
    let minPeriod: number = Key.toSerializedSpendPeriod.year

    for (let i = 0; i < spend.length; i++) {
      const s = spend[i]!
      if (s.token && Address.isEqual(feeToken, s.token)) {
        index = i
        break
      }

      const period = Key.toSerializedSpendPeriod[s.period]
      if (period < minPeriod) minPeriod = period
    }

    // If there is a token assigned to a spend permission and the fee token
    // is the same, update the limit to account for the fee.
    if (index !== -1)
      spend[index] = {
        ...spend[index]!,
        limit: spend[index]!.limit + permissionsFeeLimit,
      }
    // Update the spend permissions to account for the fee token.
    else if (typeof minPeriod === 'number')
      spend.push({
        limit: permissionsFeeLimit,
        period:
          Key.fromSerializedSpendPeriod[
            minPeriod as keyof typeof Key.fromSerializedSpendPeriod
          ],
        token: feeToken,
      })
  }

  return { ...key.permissions, spend }
}

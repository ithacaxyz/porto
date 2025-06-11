import * as Address from 'ox/Address'
import type * as Errors from 'ox/Errors'
import * as Hex from 'ox/Hex'
import * as Secp256k1 from 'ox/Secp256k1'
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
import type { OneOf, RequiredBy } from '../core/internal/types.js'
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
 * Creates a new Porto Account using an ephemeral EOA.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function createAccount<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: createAccount.Parameters<chain>,
): Promise<createAccount.ReturnType> {
  const account = Account.fromPrivateKey(Secp256k1.randomPrivateKey(), {
    keys: parameters.authorizeKeys,
  })
  return await upgradeAccount(client, {
    ...(parameters as any),
    account,
  })
}

export declare namespace createAccount {
  export type Parameters<chain extends Chain | undefined = Chain | undefined> =
    Omit<upgradeAccount.UnpreparedParameters<chain>, 'account'>

  export type ReturnType = RequiredBy<Account.Account, 'keys'>
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

  const authorizeKeys = (parameters.authorizeKeys ?? []).map((key) => {
    if (key.role === 'admin') return Key.toRpcServer(key, { orchestrator })

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
  const {
    address,
    authorizeKeys: keys,
    chain,
    feeToken,
    permissionsFeeLimit,
  } = parameters

  const { contracts } = await ServerActions.getCapabilities(client)

  const delegation = parameters.delegation ?? contracts.accountProxy.address
  const hasSessionKey = keys.some((x) => x.role === 'session')
  const orchestrator = hasSessionKey
    ? contracts.orchestrator.address
    : undefined

  const authorizeKeys = keys.map((key) => {
    const permissions =
      key.role === 'session'
        ? resolvePermissions(key, {
            feeToken,
            permissionsFeeLimit,
          })
        : {}
    return Key.toRpcServer({ ...key, permissions }, { orchestrator })
  })

  const { capabilities, chainId, context, digests, typedData } =
    await ServerActions.prepareUpgradeAccount(client, {
      address,
      authorizeKeys,
      chain,
      delegation,
    })

  const account = Account.from({
    address,
    keys,
  })

  return {
    capabilities,
    chainId,
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
      /** Keys to authorize. */
      authorizeKeys: readonly Key.Key[]
      /** Contract address to delegate to. */
      delegation?: Address.Address | undefined
      /** Fee token. */
      feeToken?: Address.Address | undefined
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
 * Sets email for address
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function setEmail<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: setEmail.Parameters,
): Promise<setEmail.ReturnType>
export async function setEmail(
  client: Client,
  parameters: setEmail.Parameters,
) {
  const { email, walletAddress } = parameters
  return await ServerActions.setEmail(client, {
    email,
    walletAddress,
  })
}

export declare namespace setEmail {
  export type Parameters = ServerActions.setEmail.Parameters

  export type ReturnType = ServerActions.setEmail.ReturnType

  export type ErrorType =
    | ServerActions.setEmail.ErrorType
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
export async function upgradeAccount<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: upgradeAccount.Parameters<chain>,
): Promise<upgradeAccount.ReturnType>
export async function upgradeAccount(
  client: Client,
  parameters: upgradeAccount.Parameters,
) {
  if (parameters.account) {
    const { account } = parameters
    const { digests, ...request } = await prepareUpgradeAccount(client, {
      ...parameters,
      address: account.address,
    })

    const signatures = {
      auth: await account.sign({ hash: digests.auth }),
      exec: await account.sign({ hash: digests.exec }),
    }

    return await upgradeAccount(client, {
      ...request,
      signatures,
    })
  }

  const { context, signatures } = parameters

  const account = Account.from(context.account)

  await ServerActions.upgradeAccount(client, {
    context,
    signatures,
  })

  return account
}

export declare namespace upgradeAccount {
  type Parameters<chain extends Chain | undefined = Chain | undefined> = OneOf<
    PreparedParameters | UnpreparedParameters<chain>
  >

  type PreparedParameters = {
    context: prepareUpgradeAccount.ReturnType['context']
    signatures: ServerActions.upgradeAccount.Parameters['signatures']
  }

  type UnpreparedParameters<
    chain extends Chain | undefined = Chain | undefined,
  > = Omit<prepareUpgradeAccount.Parameters<chain>, 'address'> & {
    account: Account.Account<'privateKey'>
  }

  type ReturnType = RequiredBy<Account.Account, 'keys'>

  type ErrorType =
    | ServerActions.upgradeAccount.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Verifies email for address
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function verifyEmail<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: verifyEmail.Parameters,
): Promise<verifyEmail.ReturnType>
export async function verifyEmail(
  client: Client,
  parameters: verifyEmail.Parameters,
) {
  const { chainId, email, signature, token, walletAddress } = parameters
  return await ServerActions.verifyEmail(client, {
    chainId,
    email,
    signature,
    token,
    walletAddress,
  })
}

export declare namespace verifyEmail {
  export type Parameters = ServerActions.verifyEmail.Parameters

  export type ReturnType = ServerActions.verifyEmail.ReturnType

  export type ErrorType =
    | ServerActions.verifyEmail.ErrorType
    | Errors.GlobalErrorType
}

export type Decorator<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account.Account | undefined = Account.Account | undefined,
> = {
  /**
   * Creates a new Porto Account using an ephemeral EOA.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns Result.
   */
  createAccount: (
    parameters: createAccount.Parameters<chain>,
  ) => Promise<createAccount.ReturnType>
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
    parameters: upgradeAccount.Parameters<chain>,
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
  transport extends Transport,
  chain extends Chain | undefined,
  account extends Account.Account | undefined,
>(client: Client<transport, chain, account>): Decorator<chain, account> {
  return {
    createAccount: (parameters) => createAccount(client, parameters),
    getCallsStatus: (parameters) =>
      ServerActions.getCallsStatus(client, parameters),
    getCapabilities: () => ServerActions.getCapabilities(client),
    getKeys: (parameters) => getKeys(client, parameters),
    health: () => ServerActions.health(client),
    prepareCalls: (parameters) => prepareCalls(client, parameters),
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

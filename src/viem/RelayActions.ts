import type * as Address from 'ox/Address'
import type * as Errors from 'ox/Errors'
import type * as Hex from 'ox/Hex'
import * as Secp256k1 from 'ox/Secp256k1'
import {
  type Calls,
  type Client,
  createClient,
  http,
  type Narrow,
  type Transport,
} from 'viem'
import type { Chain } from '../core/Chains.js'
import type * as Capabilities from '../core/internal/relay/schema/capabilities.js'
import type * as Quotes from '../core/internal/relay/schema/quotes.js'
import type { OneOf, PartialBy, RequiredBy } from '../core/internal/types.js'
import type { relay } from '../core/Mode.js'
import * as Account from './Account.js'
import * as RelayActions from './internal/relayActions.js'
import type {
  GetAccountParameter,
  GetChainParameter,
} from './internal/utils.js'
import * as Key from './Key.js'

export {
  addFaucetFunds,
  getAssets,
  getAuthorization,
  getCallsStatus,
  getCapabilities,
  health,
  verifySignature,
} from './internal/relayActions.js'

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
  parameters: getKeys.Parameters<account>,
): Promise<getKeys.ReturnType> {
  const { account = client.account, chainIds } = parameters
  const account_ = account ? Account.from(account) : undefined
  if (!account_) throw new Error('account is required.')
  const keys = await RelayActions.getKeys(client, {
    address: account_.address,
    chainIds,
  })
  return Object.entries(keys).flatMap(([chainId, keys]) =>
    keys.map((key) => Key.fromRelay(key, { chainId: Number(chainId) })),
  )
}

export namespace getKeys {
  export type Parameters<
    account extends Account.Account | undefined = Account.Account | undefined,
  > = GetAccountParameter<account> &
    Pick<RelayActions.getKeys.Parameters, 'chainIds'>

  export type ReturnType = readonly Key.Key[]

  export type ErrorType = RelayActions.getKeys.ErrorType
}

/**
 * Gets onramp contact info for address.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function getOnrampContactInfo<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getOnrampContactInfo.Parameters,
): Promise<getOnrampContactInfo.ReturnType>
export async function getOnrampContactInfo(
  client: Client,
  parameters: getOnrampContactInfo.Parameters,
) {
  const { address, secret } = parameters
  return await RelayActions.getOnrampContactInfo(client, {
    address,
    secret,
  })
}

export declare namespace getOnrampContactInfo {
  export type Parameters = RelayActions.getOnrampContactInfo.Parameters

  export type ReturnType = RelayActions.getOnrampContactInfo.ReturnType

  export type ErrorType =
    | RelayActions.getOnrampContactInfo.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Gets onramp status for address.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function onrampStatus<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: onrampStatus.Parameters,
): Promise<onrampStatus.ReturnType>
export async function onrampStatus(
  client: Client,
  parameters: onrampStatus.Parameters,
) {
  const { address } = parameters
  return await RelayActions.onrampStatus(client, {
    address,
  })
}

export declare namespace onrampStatus {
  export type Parameters = RelayActions.onrampStatus.Parameters

  export type ReturnType = RelayActions.onrampStatus.ReturnType

  export type ErrorType =
    | RelayActions.onrampStatus.ErrorType
    | Errors.GlobalErrorType
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
    chain = client.chain,
    feePayer,
    merchantUrl,
    nonce,
    preCalls,
    requiredFunds,
    revokeKeys,
  } = parameters

  const account_ = account ? Account.from(account) : undefined
  const key =
    parameters.key ??
    (account_ ? Account.getKey(account_, { role: 'admin' }) : undefined)

  const hasSessionKey = parameters.authorizeKeys?.some(
    (x) => x.role === 'session',
  )
  const {
    contracts,
    fees: { tokens },
  } = await RelayActions.getCapabilities(client, { chainId: chain?.id })
  const orchestrator = hasSessionKey
    ? contracts.orchestrator.address
    : undefined

  const authorizeKeys = (parameters.authorizeKeys ?? []).map((key) =>
    Key.toRelay(key, { feeTokens: tokens, orchestrator }),
  )

  // If a fee token is provided, use it.
  // Otherwise, if there are spend permissions set, we cannot predictably
  // infer the fee token (not pass it) as the fee token needs to have
  // an assigned spend permission set. It is assumed that the first spend
  // permission is the one that is used for the fee token.
  const feeToken = (() => {
    if (parameters.feeToken) return parameters.feeToken
    return key?.permissions?.spend?.[0]?.token
  })()

  const preCall = typeof preCalls === 'boolean' ? preCalls : false
  const signedPreCalls =
    typeof preCalls === 'object'
      ? preCalls.map(({ context, signature }) => ({
          ...(context.preCall as any),
          signature,
        }))
      : undefined

  const args = {
    address: account_?.address,
    calls: (calls ?? []) as never,
    capabilities: {
      authorizeKeys,
      meta: {
        feePayer,
        feeToken,
        nonce,
      },
      preCall,
      preCalls: signedPreCalls,
      requiredFunds,
      revokeKeys: revokeKeys?.map((key) => ({
        hash: key.hash,
      })),
    },
    chain: chain as never,
    key: key ? Key.toRelay(key, { feeTokens: tokens }) : undefined,
  } as const

  const result = await (async () => {
    if (merchantUrl) {
      const client_ = createClient({
        chain: client.chain,
        transport: http(merchantUrl),
      })
      // Prepare with Merchant RPC.
      return await RelayActions.prepareCalls(client_, args).catch((e) => {
        console.error(e)
        // Fall back to default client.
        return RelayActions.prepareCalls(client, args)
      })
    }
    return await RelayActions.prepareCalls(client, args)
  })()

  const { capabilities, context, digest, signature, typedData } = result

  if (merchantUrl) {
    const isValid = await RelayActions.verifyPrepareCallsResponse(client, {
      response: result._raw,
      signature,
    })
    if (!isValid)
      throw new Error(
        `cannot verify integrity of \`wallet_prepareCalls\` response from ${merchantUrl}`,
      )
  }

  return {
    capabilities: { ...capabilities, quote: context.quote as any },
    context,
    digest,
    key,
    typedData,
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
      key?:
        | Pick<Key.Key, 'permissions' | 'publicKey' | 'prehash' | 'type'>
        | undefined
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
      /** Required funds to execute the calls. */
      requiredFunds?: Capabilities.requiredFunds.Request | undefined
      /** Additional keys to revoke from the account. */
      revokeKeys?: readonly Key.Key[] | undefined
      /** Merchant RPC URL. */
      merchantUrl?: string | undefined
    } & Omit<Capabilities.meta.Request, 'keyHash'>

  export type ReturnType = {
    capabilities: RelayActions.prepareCalls.ReturnType['capabilities'] & {
      quote: Quotes.Signed
    }
    context: RelayActions.prepareCalls.ReturnType['context']
    digest: RelayActions.prepareCalls.ReturnType['digest']
    key: Parameters['key']
    typedData: RelayActions.prepareCalls.ReturnType['typedData']
  }

  export type ErrorType =
    | RelayActions.prepareCalls.ErrorType
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
  const { address, authorizeKeys: keys, chain = client.chain } = parameters

  if (!chain) throw new Error('chain is required.')

  const {
    contracts,
    fees: { tokens },
  } = await RelayActions.getCapabilities(client, { chainId: chain.id })

  const delegation = parameters.delegation ?? contracts.accountProxy.address
  const hasSessionKey = keys.some((x) => x.role === 'session')
  const orchestrator = hasSessionKey
    ? contracts.orchestrator.address
    : undefined

  const authorizeKeys = keys.map((key) => {
    const permissions = key.role === 'session' ? key.permissions : {}
    return Key.toRelay(
      { ...key, permissions },
      { feeTokens: tokens, orchestrator },
    )
  })

  const { capabilities, chainId, context, digests, typedData } =
    await RelayActions.prepareUpgradeAccount(client, {
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
    }

  export type ReturnType = Omit<
    RelayActions.prepareUpgradeAccount.ReturnType,
    'context'
  > & {
    context: RelayActions.prepareUpgradeAccount.ReturnType['context'] & {
      account: Account.Account
    }
  }

  export type ErrorType =
    | RelayActions.prepareUpgradeAccount.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Resends phone verification code for address
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function resendVerifyPhone<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: resendVerifyPhone.Parameters,
): Promise<resendVerifyPhone.ReturnType>
export async function resendVerifyPhone(
  client: Client,
  parameters: resendVerifyPhone.Parameters,
) {
  const { phone, walletAddress } = parameters
  return await RelayActions.resendVerifyPhone(client, {
    phone,
    walletAddress,
  })
}

export declare namespace resendVerifyPhone {
  export type Parameters = RelayActions.resendVerifyPhone.Parameters

  export type ReturnType = RelayActions.resendVerifyPhone.ReturnType

  export type ErrorType =
    | RelayActions.resendVerifyPhone.ErrorType
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
export async function sendCalls<
  const calls extends readonly unknown[],
  chain extends Chain | undefined,
  account extends Account.Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: sendCalls.Parameters<calls, chain, account>,
): Promise<sendCalls.ReturnType> {
  const {
    account = client.account,
    chain = client.chain,
    webAuthn,
  } = parameters

  if (!chain) throw new Error('`chain` is required.')

  // If no signature is provided, prepare the calls and sign them.
  const account_ = account ? Account.from(account) : undefined
  if (!account_) throw new Error('`account` is required.')

  const key = parameters.key ?? Account.getKey(account_, parameters)
  if (!key && !account_.sign)
    throw new Error('`key` or `account` with `sign` is required')

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
        address: null,
        payload: digest,
        webAuthn,
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
  const signature = await (async () => {
    if (key)
      return await Key.sign(key, {
        address: null,
        payload: digest,
        webAuthn,
        wrap: false,
      })
    return await account_.sign({
      hash: digest,
    })
  })()

  // Broadcast the bundle to the Relay.
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
      /** Merchant RPC URL. */
      merchantUrl?: string | undefined
      webAuthn?: relay.Parameters['webAuthn']
    }

  export type ReturnType = RelayActions.sendPreparedCalls.ReturnType

  export type ErrorType =
    | RelayActions.sendPreparedCalls.ErrorType
    | Errors.GlobalErrorType
}

export async function signCalls(
  request: prepareCalls.ReturnType,
  options: signCalls.Options,
) {
  const isPrecall = Boolean(request.context.preCall)
  const { account, key } = options

  if (account) {
    const keyIndex = account.keys?.findIndex(
      (k) => k.publicKey === request.key?.publicKey,
    )
    if (keyIndex === -1) throw new Error('key not found')
    return await Account.sign(account, {
      key: keyIndex,
      payload: request.digest,
      replaySafe: false,
      wrap: isPrecall,
    })
  }
  if (key)
    return await Key.sign(key, {
      address: null,
      payload: request.digest,
      wrap: isPrecall,
    })
  throw new Error('no key or account provided')
}

export declare namespace signCalls {
  export type Options = OneOf<
    | {
        account: Account.Account
      }
    | {
        key: Key.Key
      }
  >
}

export async function sendPreparedCalls(
  client: Client,
  parameters: sendPreparedCalls.Parameters,
): Promise<sendPreparedCalls.ReturnType> {
  const { capabilities, context, key, signature } = parameters
  return await RelayActions.sendPreparedCalls(client, {
    capabilities,
    context,
    key: key ? Key.toRelay(key) : undefined,
    signature,
  })
}

export declare namespace sendPreparedCalls {
  export type Parameters = {
    /** Capabilities. */
    capabilities?:
      | RelayActions.sendPreparedCalls.Parameters['capabilities']
      | undefined
    /** Context. */
    context: prepareCalls.ReturnType['context']
    /** Key. */
    key?: Pick<Key.Key, 'publicKey' | 'prehash' | 'type'> | undefined
    /** Signature. */
    signature: Hex.Hex
  }

  export type ReturnType = RelayActions.sendPreparedCalls.ReturnType

  export type ErrorType = RelayActions.sendPreparedCalls.ErrorType
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
  return await RelayActions.setEmail(client, {
    email,
    walletAddress,
  })
}

export declare namespace setEmail {
  export type Parameters = RelayActions.setEmail.Parameters

  export type ReturnType = RelayActions.setEmail.ReturnType

  export type ErrorType =
    | RelayActions.setEmail.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Sets phone for address
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function setPhone<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: setPhone.Parameters,
): Promise<setPhone.ReturnType>
export async function setPhone(
  client: Client,
  parameters: setPhone.Parameters,
) {
  const { phone, walletAddress } = parameters
  return await RelayActions.setPhone(client, {
    phone,
    walletAddress,
  })
}

export declare namespace setPhone {
  export type Parameters = RelayActions.setPhone.Parameters

  export type ReturnType = RelayActions.setPhone.ReturnType

  export type ErrorType =
    | RelayActions.setPhone.ErrorType
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
// @ts-expect-error
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
    const authorizeKeys = [
      ...(account.keys ?? []),
      ...(parameters.authorizeKeys ?? []),
    ].filter(
      (key, index, array) => array.findIndex((k) => k.id === key.id) === index,
    )
    const { digests, ...request } = await prepareUpgradeAccount(client, {
      ...parameters,
      address: account.address,
      authorizeKeys,
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

  await RelayActions.upgradeAccount(client, {
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
    signatures: RelayActions.upgradeAccount.Parameters['signatures']
  }

  type UnpreparedParameters<
    chain extends Chain | undefined = Chain | undefined,
  > = PartialBy<
    Omit<prepareUpgradeAccount.Parameters<chain>, 'address'>,
    'authorizeKeys'
  > & {
    account: Account.Account<'privateKey'>
  }

  type ReturnType = RequiredBy<Account.Account, 'keys'>

  type ErrorType =
    | RelayActions.upgradeAccount.ErrorType
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
  return await RelayActions.verifyEmail(client, {
    chainId,
    email,
    signature,
    token,
    walletAddress,
  })
}

export declare namespace verifyEmail {
  export type Parameters = RelayActions.verifyEmail.Parameters

  export type ReturnType = RelayActions.verifyEmail.ReturnType

  export type ErrorType =
    | RelayActions.verifyEmail.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Verifies phone for address
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function verifyPhone<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: verifyPhone.Parameters,
): Promise<verifyPhone.ReturnType>
export async function verifyPhone(
  client: Client,
  parameters: verifyPhone.Parameters,
) {
  const { code, phone, walletAddress } = parameters
  return await RelayActions.verifyPhone(client, {
    code,
    phone,
    walletAddress,
  })
}

export declare namespace verifyPhone {
  export type Parameters = RelayActions.verifyPhone.Parameters

  export type ReturnType = RelayActions.verifyPhone.ReturnType

  export type ErrorType =
    | RelayActions.verifyPhone.ErrorType
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
    parameters: RelayActions.getCallsStatus.Parameters,
  ) => Promise<RelayActions.getCallsStatus.ReturnType>
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
  >() => Promise<RelayActions.getCapabilities.ReturnType<chainIds, raw>>
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
    parameters: getKeys.Parameters<account>,
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
  health: () => Promise<RelayActions.health.ReturnType>
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
    parameters: RelayActions.verifySignature.Parameters<chain>,
  ) => Promise<RelayActions.verifySignature.ReturnType>
}

export function decorator<
  transport extends Transport,
  chain extends Chain | undefined,
  account extends Account.Account | undefined,
>(client: Client<transport, chain, account>): Decorator<chain, account> {
  return {
    createAccount: (parameters) => createAccount(client, parameters),
    getCallsStatus: (parameters) =>
      RelayActions.getCallsStatus(client, parameters),
    getCapabilities: () => RelayActions.getCapabilities(client),
    getKeys: (parameters) => getKeys(client, parameters),
    health: () => RelayActions.health(client),
    prepareCalls: (parameters) => prepareCalls(client, parameters),
    prepareUpgradeAccount: (parameters) =>
      prepareUpgradeAccount(client, parameters),
    sendCalls: (parameters) => sendCalls(client, parameters),
    sendPreparedCalls: (parameters) => sendPreparedCalls(client, parameters),
    upgradeAccount: (parameters) => upgradeAccount(client, parameters),
    verifySignature: (parameters) =>
      RelayActions.verifySignature(client, parameters),
  }
}

import type * as Errors from 'ox/Errors'
import type * as Hex from 'ox/Hex'

import * as Account from '../account.js'
import * as Key from '../key.js'
import type { Client } from '../porto.js'
import * as Actions from './actions.js'
import type * as Capabilities from './typebox/capabilities.js'

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
export async function prepare<const calls extends readonly unknown[]>(
  client: Client,
  parameters: prepare.Parameters<calls>,
) {
  const { authorizeKeys, calls, key, feeToken, nonce, revokeKeys } = parameters
  const account = Account.from(parameters.account)
  const { capabilities, context, digest } = await Actions.prepareCalls(client, {
    account: account.address,
    calls: (calls ?? []) as any,
    capabilities: {
      authorizeKeys: authorizeKeys?.map(Key.toRelay),
      meta: {
        feeToken,
        keyHash: key.hash,
        nonce,
      },
      revokeKeys: revokeKeys?.map((key) => ({
        hash: key.hash,
      })),
    },
  })
  return {
    capabilities,
    context: { ...context, key },
    digest,
  }
}

export namespace prepare {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
  > = {
    /** Additional keys to authorize on the account. */
    authorizeKeys?: readonly Key.Key[] | undefined
    /** Account to prepare the calls for. */
    account: Account.Account
    /** Key that will be used to sign the calls. */
    key: Key.Key
    /** Calls to prepare. */
    calls?: Actions.prepareCalls.Parameters<calls>['calls'] | undefined
    /** Additional keys to revoke from the account. */
    revokeKeys?: readonly Key.Key[] | undefined
  } & Omit<Capabilities.meta.Request, 'keyHash'>

  export type ReturnType = {
    capabilities: Actions.prepareCalls.ReturnType['capabilities']
    context: Actions.prepareCalls.ReturnType['context'] & {
      key: Key.Key
    }
    digest: Actions.prepareCalls.ReturnType['digest']
  }

  export type ErrorType =
    | Actions.prepareCalls.ErrorType
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
export async function send<const calls extends readonly unknown[]>(
  client: Client,
  parameters: send.Parameters<calls>,
) {
  const account = Account.from(parameters.account)
  const key = parameters.key ?? Account.getKey(account, parameters)

  if (!key) throw new Error('key is required')

  const { context, digest } = await prepare(client, {
    ...parameters,
    key,
  })

  const signature = await Key.sign(key, {
    payload: digest,
  })

  return await sendPrepared(client, { context, signature })
}

export namespace send {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
  > = Omit<prepare.Parameters<calls>, 'key'> & {
    /** Key to sign the call bundle with. */
    key?: Key.Key | undefined
  }

  export type ReturnType = sendPrepared.ReturnType

  export type ErrorType =
    | prepare.ErrorType
    | sendPrepared.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Sends a prepared & signed call bundle to the Relay.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Bundle identifier.
 */
export async function sendPrepared(
  client: Client,
  parameters: sendPrepared.Parameters,
) {
  const { context, signature } = parameters
  const key = Key.toRelay(context.key)
  return await Actions.sendPreparedCalls(client, {
    context,
    signature: {
      publicKey: key.publicKey,
      type: key.type,
      value: signature,
    },
  })
}

export namespace sendPrepared {
  export type Parameters = {
    /** Context. */
    context: prepare.ReturnType['context']
    /** Signature. */
    signature: Hex.Hex
  }

  export type ReturnType = Actions.sendPreparedCalls.ReturnType

  export type ErrorType =
    | Actions.sendPreparedCalls.ErrorType
    | Errors.GlobalErrorType
}

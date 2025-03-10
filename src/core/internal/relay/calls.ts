import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'

import * as Account from '../account.js'
import * as Key from '../key.js'
import type { Client } from '../porto.js'
import * as Actions from './actions.js'
import type * as Capabilities from './typebox/capabilities.js'

export async function prepare<const calls extends readonly unknown[]>(
  client: Client,
  parameters: prepare.Parameters<calls>,
) {
  const { authorizeKeys, calls, key, feeToken, nonce, revokeKeys } = parameters
  const account = Account.from(parameters.account)
  const { capabilities, context, digest } = await Actions.prepareCalls(client, {
    account: account.address,
    calls,
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
    account: Account.Account | Address.Address
    /** Key that will be used to sign the calls. */
    key: Key.Key
    /** Calls to prepare. */
    calls: Actions.prepareCalls.Parameters<calls>['calls']
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
}

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
}

import { TransformEncodeCheckError } from '@sinclair/typebox/value'
import type * as Address from 'ox/Address'
import * as Errors from 'ox/Errors'
import * as Json from 'ox/Json'

import type { Client } from '../porto.js'
import { type StaticDecode, Value } from '../typebox/schema.js'
import * as Rpc from './typebox/rpc.js'

export async function createAccount(
  client: Client,
  parameters: createAccount.Parameters,
): Promise<createAccount.ReturnType> {
  const { delegation = client.chain.contracts.delegation.address, keys } =
    parameters
  try {
    const result = await client.request({
      method: 'wallet_createAccount',
      params: [
        {
          capabilities: Value.Encode(Rpc.wallet_createAccount.Capabilities, {
            authorizeKeys: keys,
            delegation,
          }),
        },
      ],
    })
    const { address, capabilities } = Value.Parse(
      Rpc.wallet_createAccount.Response,
      result,
    )
    return {
      address,
      delegation,
      keys: capabilities.authorizeKeys,
    }
  } catch (error) {
    throw getError(error)
  }
}

export namespace createAccount {
  export type Parameters = {
    keys: StaticDecode<
      typeof Rpc.wallet_createAccount.Capabilities
    >['authorizeKeys']
    delegation?: Address.Address | undefined
  }

  export type ReturnType = {
    address: Address.Address
    delegation: Address.Address
    keys: StaticDecode<
      typeof Rpc.wallet_createAccount.ResponseCapabilities
    >['authorizeKeys']
  }
}

function getError(error: unknown) {
  if (error instanceof TransformEncodeCheckError)
    return new SchemaCoderError(error)
  return error
}

export class SchemaCoderError extends Errors.BaseError<TransformEncodeCheckError> {
  override readonly name = 'Actions.SchemaCoderError'

  constructor(cause: TransformEncodeCheckError) {
    const message = (() => {
      let reason = cause.error.errors[0]?.First()
      if (!reason) reason = cause.error
      if (!reason) return cause.message
      return [
        reason?.message,
        '',
        'Path: ' + reason?.path.slice(1).replaceAll('/', '.'),
        reason?.value && 'Value: ' + Json.stringify(reason.value),
      ]
        .filter((x) => typeof x === 'string')
        .join('\n')
    })()

    super(message, {
      cause,
    })
  }
}

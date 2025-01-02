import * as AbiFunction from 'ox/AbiFunction'
import type * as Address from 'ox/Address'

import { delegationAbi } from './generated.js'
import * as Key from './key.js'

/**
 * Instantiates values to populate a call to authorize a key.
 *
 * @param parameters - Parameters.
 * @returns Instantiated values.
 */
export function authorize(parameters: authorize.Parameters) {
  const { key, to } = parameters
  return {
    data: AbiFunction.encodeData(
      AbiFunction.fromAbi(delegationAbi, 'authorize'),
      [Key.serialize(key)],
    ),
    to,
  }
}

export declare namespace authorize {
  export type Parameters = {
    /** Key to authorize. */
    key: Key.Key
    /** Address of the account to authorize the key on. */
    to: Address.Address
  }
}

/**
 * Instantiates values to populate a call to set the label of a delegated account.
 *
 * @param parameters - Parameters.
 * @returns Instantiated values.
 */
export function setLabel(parameters: setLabel.Parameters) {
  const { label, to } = parameters
  return {
    data: AbiFunction.encodeData(
      AbiFunction.fromAbi(delegationAbi, 'setLabel'),
      [label],
    ),
    to,
  }
}

export declare namespace setLabel {
  export type Parameters = {
    /** Label to set. */
    label: string
    /** Address of the account to set the label on. */
    to: Address.Address
  }
}

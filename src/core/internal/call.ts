import * as AbiFunction from 'ox/AbiFunction'
import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'

import { delegationAbi } from './generated.js'
import * as Key from './key.js'

/** Stub address for self-execution. */
export const self = '0x2323232323232323232323232323232323232323'

export type Call = {
  to: Address.Address
  value?: bigint | undefined
  data?: Hex.Hex | undefined
}

/**
 * Instantiates values to populate a call to authorize a key.
 *
 * @param parameters - Parameters.
 * @returns Instantiated values.
 */
export function authorize(parameters: authorize.Parameters) {
  const { key } = parameters
  return {
    data: AbiFunction.encodeData(
      AbiFunction.fromAbi(delegationAbi, 'authorize'),
      [Key.serialize(key)],
    ),
    to: self,
  } as const satisfies Call
}

export declare namespace authorize {
  export type Parameters = {
    /** Key to authorize. */
    key: Key.Key
  }
}

const anyHash =
  '0x3232323232323232323232323232323232323232323232323232323232323232'
const anyTarget = '0x3232323232323232323232323232323232323232'
const anySelector = '0x32323232'

/**
 * Instantiates values to populate a call to set the label of a delegated account.
 *
 * @param parameters - Parameters.
 * @returns Instantiated values.
 */
export function setCanExecute(parameters: setCanExecute.Parameters = {}) {
  const {
    enabled = true,
    key,
    selector = anySelector,
    to = anyTarget,
  } = parameters
  const hash = key ? Key.hash(key) : anyHash

  return {
    data: AbiFunction.encodeData(
      AbiFunction.fromAbi(delegationAbi, 'setCanExecute'),
      [hash, to, selector, enabled],
    ),
    to: self,
  } as const satisfies Call
}

export declare namespace setCanExecute {
  export type Parameters = {
    /** Whether to enable execution. */
    enabled?: boolean | undefined
    /** Key to authorize. */
    key?: Key.Key | undefined
    /** Target to authorize. */
    to?: Address.Address | undefined
    /** Function selector to authorize. */
    selector?: Hex.Hex | undefined
  }
}

/**
 * Instantiates values to populate a call to set the label of a delegated account.
 *
 * @param parameters - Parameters.
 * @returns Instantiated values.
 */
export function setLabel(parameters: setLabel.Parameters) {
  const { label } = parameters
  return {
    data: AbiFunction.encodeData(
      AbiFunction.fromAbi(delegationAbi, 'setLabel'),
      [label],
    ),
    to: self,
  } as const satisfies Call
}

export declare namespace setLabel {
  export type Parameters = {
    /** Label to set. */
    label: string
  }
}

/**
 * Instantiates values to populate a call to set the spend limit of a key.
 *
 * @param parameters - Parameters.
 * @returns Instantiated values.
 */
export function setSpendLimit(parameters: setSpendLimit.Parameters) {
  const { key, period, limit } = parameters
  const token = parameters.token ?? '0x0000000000000000000000000000000000000000'
  return {
    data: AbiFunction.encodeData(
      AbiFunction.fromAbi(delegationAbi, 'setSpendLimit'),
      [Key.hash(key), token, Key.toSerializedSpendPeriod[period], limit],
    ),
    to: self,
  } as const satisfies Call
}

export declare namespace setSpendLimit {
  export type Parameters = {
    /** Key to set the spend limit of. */
    key: Key.Key
    /** Limit to set. */
    limit: bigint
    /** Period to set. */
    period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
    /** Token to set. */
    token?: Address.Address | undefined
  }
}

/**
 * Instantiates values to populate a call to remove the spend limit of a key.
 *
 * @param parameters - Parameters.
 * @returns Instantiated values.
 */
export function removeSpendLimit(parameters: removeSpendLimit.Parameters) {
  const { key, token, period } = parameters
  return {
    data: AbiFunction.encodeData(
      AbiFunction.fromAbi(delegationAbi, 'removeSpendLimit'),
      [Key.hash(key), token, Key.toSerializedSpendPeriod[period]],
    ),
    to: self,
  } as const satisfies Call
}

export declare namespace removeSpendLimit {
  export type Parameters = {
    /** Key to set the spend limit of. */
    key: Key.Key
    /** Period to set. */
    period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
    /** Token to set. */
    token: Address.Address
  }
}

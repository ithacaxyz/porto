import * as Value from 'ox/Value'
import type * as Capabilities_relay from './relay/schema/capabilities.js'
import type * as Capabilities from './schema/capabilities.js'
import type * as Token from './schema/token.js'

/**
 * Transforms into Relay-formatted required funds.
 *
 * @param requiredFunds - The required funds object to convert.
 * @param options - The options for the conversion.
 * @returns The converted required funds object.
 */
// TODO: perhaps Relay should support `Capabilities.requiredFunds.Request` format.
export function toRelay(
  requiredFunds: toRelay.Value,
  options: toRelay.Options,
): toRelay.ReturnType {
  const { tokens } = options

  const interopTokens = tokens.filter((token) => token.interop)

  return requiredFunds.map((requiredFund) => {
    if (requiredFund.address) return requiredFund

    const interopToken = interopTokens.find(
      (token) => token.symbol === requiredFund.symbol,
    )
    if (!interopToken)
      throw new Error(`interop token not found: ${requiredFund.symbol}`)

    return {
      address: interopToken.address,
      value: Value.from(requiredFund.value, interopToken.decimals),
    }
  })
}

export namespace toRelay {
  export type Value = Capabilities.requiredFunds.Request

  export type Options = {
    tokens: readonly Token.Token[]
  }
  export type ReturnType = Capabilities_relay.requiredFunds.Request
}

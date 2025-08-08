import * as Value from 'ox/Value'
import type * as Capabilities_rpcServer from './rpcServer/schema/capabilities.js'
import type * as Capabilities from './schema/capabilities.js'
import type * as FeeToken from './schema/feeToken.js'

/**
 * Transforms into RPC Server-formatted required funds.
 *
 * @param requiredFunds - The required funds object to convert.
 * @param options - The options for the conversion.
 * @returns The converted required funds object.
 */
// TODO: perhaps RPC Server should support `Capabilities.requiredFunds.Request` format.
export function toRpcServer(
  requiredFunds: toRpcServer.Value,
  options: toRpcServer.Options,
): toRpcServer.ReturnType {
  const { feeTokens } = options

  const interopTokens = feeTokens.filter((feeToken) => feeToken.interop)

  const [activeFeeToken] = feeTokens
  if (!activeFeeToken) throw new Error('fee token not found.')

  return requiredFunds.map((requiredFund) => {
    if (requiredFund.address) return requiredFund

    const interopToken = interopTokens.find(
      (feeToken) => feeToken.symbol === requiredFund.symbol,
    )
    if (!interopToken)
      throw new Error(`interop token not found: ${requiredFund.symbol}`)

    return {
      address: interopToken.address,
      value: Value.from(requiredFund.value, interopToken.decimals),
    }
  })
}

export namespace toRpcServer {
  export type Value = Capabilities.requiredFunds.Request

  export type Options = {
    feeTokens: readonly FeeToken.FeeToken[]
  }
  export type ReturnType = Capabilities_rpcServer.requiredFunds.Request
}

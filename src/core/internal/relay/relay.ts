import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import type { Client } from 'viem'

import * as Action from './action.js'
import * as ActionRequest from './actionRequest.js'
import * as Quote from './quote.js'

export async function estimateFee(
  client: Client,
  options: estimateFee.Options,
): Promise<Quote.Quote<true>> {
  const { token = '0x0000000000000000000000000000000000000000', ...action } =
    options

  const request = ActionRequest.toRpc(action)

  const result = await client.request<any>({
    method: 'relay_estimateFee',
    params: [request, token],
  })

  return Quote.fromRpc(result) as never
}

export declare namespace estimateFee {
  type Options = ActionRequest.ActionRequest & {
    token?: Address.Address | undefined
  }
}

export async function sendAction(
  client: Client,
  options: sendAction.Options,
): Promise<Hex.Hex> {
  const request = Action.toRpc(options)
  const quote = Quote.toRpc(options.quote)

  const hash = await client.request<any>({
    method: 'relay_sendAction',
    params: [request, quote],
  })

  return hash
}

export declare namespace sendAction {
  type Options = Action.Action & { quote: Quote.Quote<true> }
}

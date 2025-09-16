/**
 * Porto Account Actions.
 */

import type { Client } from 'viem'
import * as z from 'zod/mini'
import * as RpcSchema from '../core/RpcSchema.js'
import type * as RpcSchema_viem from './RpcSchema.js'

export async function verifyEmail(
  client: Client,
  parameters: verifyEmail.Parameters,
): Promise<verifyEmail.ReturnType> {
  const method = 'account_verifyEmail' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [z.encode(RpcSchema.account_verifyEmail.Parameters, parameters)],
  })

  return z.decode(RpcSchema.account_verifyEmail.Response, response)
}

export declare namespace verifyEmail {
  type Parameters = RpcSchema.account_verifyEmail.Parameters

  type ReturnType = RpcSchema.account_verifyEmail.Response
}

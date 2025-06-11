/**
 * Porto Account Actions.
 */

import type { Client } from 'viem'
import * as Typebox from '../core/internal/typebox/typebox.js'
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
    params: [
      Typebox.Encode(
        RpcSchema.account_verifyEmail.Parameters,
        Typebox.Clean(
          RpcSchema.account_verifyEmail.Parameters,
          parameters satisfies RpcSchema.account_verifyEmail.Parameters,
        ),
      ),
    ],
  })

  return Typebox.Decode(
    RpcSchema.account_verifyEmail.Response,
    response satisfies Typebox.Static<
      typeof RpcSchema.account_verifyEmail.Response
    >,
  )
}

export declare namespace verifyEmail {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.account_verifyEmail.Parameters
  >

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.account_verifyEmail.Response
  >
}

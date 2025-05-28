// TODO: add node:http adapter.

import { Address, Hex, RpcRequest, RpcResponse, TypedData } from 'ox'
import { createClient, rpcSchema } from 'viem'
import type * as RpcSchema from '../core/internal/rpcServer/rpcSchema.js'
import * as Rpc from '../core/internal/rpcServer/typebox/rpc.js'
import * as Typebox from '../core/internal/typebox/typebox.js'
import type { OneOf } from '../core/internal/types.js'
import * as Key from '../core/Key.js'
import * as Porto from '../core/Porto.js'

export function rpcHandler(options: rpcHandler.Options) {
  const {
    address,
    key: k,
    transports = Porto.defaultConfig.transports,
  } = options

  const from = (() => {
    if (k.type === 'secp256k1') return Key.fromSecp256k1
    if (k.type === 'p256') return Key.fromP256
    throw new Error('unsupported key type')
  })()
  const key = from(k)

  return async (r: Request) => {
    const request = (await r
      .json()
      .then(RpcRequest.from)) as RpcRequest.RpcRequest<RpcSchema.Schema>

    if (request.method !== 'wallet_prepareCalls')
      throw new RpcResponse.MethodNotSupportedError()

    const chainId = request.params[0]!.chainId
    if (!chainId)
      throw new RpcResponse.InvalidParamsError({
        message: 'chainId is required.',
      })

    const transport = transports[chainId as keyof typeof transports]
    const client = createClient({
      rpcSchema: rpcSchema<RpcSchema.Viem>(),
      transport,
    })

    try {
      const result = await client.request({
        ...request,
        params: [
          {
            ...request.params[0]!,
            capabilities: {
              ...request.params[0]!.capabilities,
              meta: {
                ...request.params[0]!.capabilities.meta,
                feePayer: address,
              },
            },
          },
        ],
      })
      const { typedData } = Typebox.Decode(
        Rpc.wallet_prepareCalls.Response,
        result,
      )

      if (Address.isEqual(typedData.message.eoa as Address.Address, address))
        throw new RpcResponse.InvalidParamsError({
          message: 'eoa cannot be fee payer.',
        })

      const signature = await Key.sign(key, {
        payload: TypedData.getSignPayload(typedData),
      })

      const response = RpcResponse.from(
        {
          result: {
            ...result,
            capabilities: {
              ...result.capabilities,
              feeSignature: signature,
            },
          },
        },
        { request },
      )
      return Response.json(response)
    } catch (e) {
      const error = (() => {
        const error = RpcResponse.parseError(e as Error)
        if (error.cause && 'code' in error.cause && error.cause.code === 3)
          return error.cause as any
        return error
      })()
      return Response.json(RpcResponse.from({ error }, { request }))
    }
  }
}

export declare namespace rpcHandler {
  export type Options = {
    address: Address.Address
    key: Pick<OneOf<Key.Secp256k1Key | Key.P256Key>, 'type'> & {
      privateKey: Hex.Hex
    }
    transports?: Porto.Config['transports'] | undefined
  }
}

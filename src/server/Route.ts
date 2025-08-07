import * as Schema from 'effect/Schema'
import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import * as RpcResponse from 'ox/RpcResponse'
import * as TypedData from 'ox/TypedData'
import { createClient, rpcSchema } from 'viem'
import type * as Chains from '../core/Chains.js'
import type * as RpcSchema_internal from '../core/internal/rpcServer/rpcSchema.js'
import * as Request from '../core/internal/rpcServer/schema/request.js'
import * as Rpc from '../core/internal/rpcServer/schema/rpc.js'
import type { MaybePromise, OneOf } from '../core/internal/types.js'
import * as Porto from '../core/Porto.js'
import type * as RpcSchema from '../core/RpcSchema.js'
import * as Key from '../viem/Key.js'
import { Router } from './Router.js'

/**
 * Defines a Merchant RPC request handler. This will return a function that
 * accepts a [Fetch API `Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)
 * instance and returns a [Fetch API `Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 * instance.
 *
 * @param options - Options.
 * @returns Request handler.
 */
export function merchant<
  const chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(options: merchant.Options<chains>) {
  const {
    address,
    chains = Porto.defaultConfig.chains,
    transports = Porto.defaultConfig.transports,
  } = options

  const from = (() => {
    if (typeof options.key === 'string') return undefined
    if (options.key.type === 'secp256k1') return Key.fromSecp256k1
    if (options.key.type === 'p256') return Key.fromP256
    throw new Error('unsupported key type')
  })()
  const key = from
    ? from(options.key as never)
    : Key.fromSecp256k1({
        privateKey: options.key as Hex.Hex,
      })

  const router = new Router.Base()

  router.hono.get('*', (c) => c.text('ok'))

  router.hono.post('*', async (c) => {
    let request: Request.validate.ReturnType<typeof Request.Schema> =
      await c.req.json()
    try {
      request = Request.validate(Request.Schema)(request)
    } catch (e) {
      const error = e as RpcResponse.ErrorObject
      return c.json(
        RpcResponse.from(
          {
            error: {
              code: error.code,
              message: error.message,
            },
          },
          { request },
        ),
      )
    }

    switch (request.method) {
      case 'wallet_prepareCalls': {
        const chainId = request.params[0]!.chainId
        if (!chainId)
          throw new RpcResponse.InvalidParamsError({
            message: 'chainId is required.',
          })

        const chain = chains.find((c) => c.id === chainId)

        const transport = transports[chainId as keyof typeof transports]
        if (!transport)
          throw new RpcResponse.InvalidParamsError({
            message: `chain (id: ${chainId}) not supported.`,
          })

        const client = createClient({
          chain,
          rpcSchema: rpcSchema<RpcSchema_internal.Viem>(),
          transport,
        })

        const sponsor = (() => {
          if (typeof options.sponsor === 'function')
            return options.sponsor(request.params[0]! as never)
          if (typeof options.sponsor === 'boolean') return options.sponsor
          return true
        })()

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
                    ...(sponsor
                      ? {
                          feePayer: address,
                        }
                      : {}),
                  },
                },
              },
            ],
          })
          const { typedData } = Schema.decodeSync(
            Rpc.wallet_prepareCalls.Response,
          )(result)

          const signature = sponsor
            ? await Key.sign(key, {
                payload: TypedData.getSignPayload(typedData),
              })
            : undefined

          const response = RpcResponse.from(
            {
              result: {
                ...result,
                capabilities: {
                  ...result.capabilities,
                  ...(sponsor
                    ? {
                        feeSignature: signature,
                      }
                    : {}),
                },
              },
            },
            { request },
          )

          return c.json(response)
        } catch (e) {
          const error = (() => {
            const error = RpcResponse.parseError(e as Error)
            if (error.cause && 'code' in error.cause && error.cause.code === 3)
              return error.cause as any
            return error
          })()
          return c.json(RpcResponse.from({ error }, { request }))
        }
      }
      default: {
        const error = new RpcResponse.MethodNotSupportedError()
        return c.json(RpcResponse.from({ error }, { request }))
      }
    }
  })

  return router
}

export declare namespace merchant {
  export type Options<
    chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
      Chains.Chain,
      ...Chains.Chain[],
    ],
  > = {
    /** Address of the Merchant Account. */
    address: Address.Address
    /** Supported chains. */
    chains?: Porto.Config<chains>['chains'] | undefined
    /** An Admin Key of the Merchant Account to use for signing. */
    key:
      | Hex.Hex
      | (Pick<OneOf<Key.Secp256k1Key | Key.P256Key>, 'type'> & {
          privateKey: Hex.Hex
        })
    /** Whether to sponsor calls or not, and the condition to do so. */
    sponsor?:
      | boolean
      | ((
          request: RpcSchema.wallet_prepareCalls.Parameters,
        ) => MaybePromise<boolean>)
      | undefined
    /** Supported transports. */
    transports?: Porto.Config<chains>['transports'] | undefined
  }
}

// TODO: add `requestListener`.

import { type Address, type Hex, RpcRequest, RpcResponse, TypedData } from 'ox'
import { createClient, rpcSchema } from 'viem'

import type * as Chains from '../core/Chains.js'
import type * as RpcSchema_internal from '../core/internal/rpcServer/rpcSchema.js'
import * as Rpc from '../core/internal/rpcServer/typebox/rpc.js'
import * as Typebox from '../core/internal/typebox/typebox.js'
import type { MaybePromise, OneOf } from '../core/internal/types.js'
import * as Porto from '../core/Porto.js'
import type * as RpcSchema from '../core/RpcSchema.js'
import * as Key from '../viem/Key.js'

/**
 * Defines a Merchant RPC request handler. This will return a function that
 * accepts a [Fetch API `Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)
 * instance and returns a [Fetch API `Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 * instance.
 *
 * @param options - Options.
 * @returns Request handler.
 */
export function requestHandler<
  const chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(options: requestHandler.Options<chains>) {
  const {
    address,
    base,
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

  return async (r: Request) => {
    if (base && !new URL(r.url).pathname.startsWith(base))
      return new Response(null, { status: 404 })

    if (r.method === 'GET') return GET()
    if (r.method === 'OPTIONS') return OPTIONS()

    const request = (await r
      .json()
      .then(
        RpcRequest.from,
      )) as RpcRequest.RpcRequest<RpcSchema_internal.Schema>

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
          const { typedData } = Typebox.Decode(
            Rpc.wallet_prepareCalls.Response,
            result,
          )

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

          return withCors(Response.json(response))
        } catch (e) {
          const error = (() => {
            const error = RpcResponse.parseError(e as Error)
            if (error.cause && 'code' in error.cause && error.cause.code === 3)
              return error.cause as any
            return error
          })()
          return withCors(
            Response.json(RpcResponse.from({ error }, { request })),
          )
        }
      }
      default: {
        const error = new RpcResponse.MethodNotSupportedError()
        return withCors(Response.json(RpcResponse.from({ error }, { request })))
      }
    }
  }
}

export declare namespace requestHandler {
  export type Options<
    chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
      Chains.Chain,
      ...Chains.Chain[],
    ],
  > = {
    /** Address of the Merchant Account. */
    address: Address.Address
    /** Base path of the request handler. */
    base?: string | undefined
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

/**
 * Defines a `GET` request handler for the Merchant RPC.
 * Mainly a convenience function for Next.js.
 *
 * @returns Request handler.
 */
export function GET() {
  return withCors(new Response('hello porto'))
}

/**
 * Defines a `POST` request handler for the Merchant RPC.
 * Mainly a convenience function for Next.js.
 *
 * @param options - Options.
 * @returns Request handler.
 */
export function POST(options: requestHandler.Options) {
  return requestHandler(options)
}

/**
 * Defines an `OPTIONS` request handler for the Merchant RPC.
 * Mainly a convenience function for Next.js.
 *
 * @returns Request handler.
 */
export function OPTIONS() {
  return withCors(new Response())
}

/** @internal */
function withCors(response: Response) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return response
}

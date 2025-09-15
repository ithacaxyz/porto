import { type Env, type ExecutionContext, Hono } from 'hono'
import { cors } from 'hono/cors'
import { poweredBy } from 'hono/powered-by'
import type { BlankEnv, BlankSchema, Schema as hono_Schema } from 'hono/types'
import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import * as RpcResponse from 'ox/RpcResponse'
import * as TypedData from 'ox/TypedData'
import { createClient, rpcSchema } from 'viem'
import * as z from 'zod/mini'
import type * as RpcSchema_relay from '../core/internal/relay/rpcSchema.js'
import type { MaybePromise, OneOf } from '../core/internal/types.js'
import * as Porto from '../core/Porto.js'
import * as Key from '../viem/Key.js'
import * as MerchantSchema from './internal/merchantSchema.js'
import * as RequestListener from './internal/requestListener.js'

/**
 * Creates a new Route.
 *
 * @param options - constructor options
 * @returns Route instance
 */
export function from<
  env extends Env = BlankEnv,
  schema extends hono_Schema = BlankSchema,
  basePath extends string = '/',
>(options: from.Options<basePath> = {}) {
  return new from.Inner<env, schema, basePath>(options)
}

export namespace from {
  export type Options<basePath extends string = '/'> =
    Inner.ConstructorOptions<basePath>

  export class Inner<
    env extends Env = BlankEnv,
    schema extends hono_Schema = BlankSchema,
    basePath extends string = '/',
  > {
    hono: Hono<env, schema, basePath>

    /**
     * Creates a new Handler instance.
     *
     * @param options - constructor options
     */
    constructor(options: Inner.ConstructorOptions<basePath> = {}) {
      const hono = new Hono<env, schema, basePath>().basePath(
        options.basePath ?? '/',
      )
      hono.use('*', cors(options.cors))
      hono.use('*', poweredBy({ serverName: 'Porto' }))

      this.hono = hono
    }

    /**
     * Returns a Fetch API compatible handler, used to serve requests.
     *
     * @param request - request object
     * @param env - env object
     * @param executionCtx - context of execution
     * @returns response object
     *
     */
    fetch = (
      request: Request,
      env?: env['Bindings'] | {} | undefined,
      executionCtx?: ExecutionContext | undefined,
    ) => {
      return this.hono.fetch(request, env, executionCtx)
    }

    /**
     * Wraps a fetch handler in a Node.js request listener that can be used with:
     *
     * - [`http.createServer()`](https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener)
     * - [`https.createServer()`](https://nodejs.org/api/https.html#httpscreateserveroptions-requestlistener)
     * - [`http2.createServer()`](https://nodejs.org/api/http2.html#http2createserveroptions-onrequesthandler)
     * - [`http2.createSecureServer()`](https://nodejs.org/api/http2.html#http2createsecureserveroptions-onrequesthandler)
     *
     * @returns A Node.js request listener function.
     */
    get listener() {
      return RequestListener.fromFetchHandler(this.fetch)
    }
  }

  export declare namespace Inner {
    type ConstructorOptions<basePath extends string = '/'> = {
      /**
       * Base path of the request handler.
       */
      basePath?: basePath | string | undefined
      /**
       * CORS configuration.
       */
      cors?: Parameters<typeof cors>[0] | undefined
    }
  }
}

/**
 * Defines a Merchant RPC request handler. This will return a function that
 * accepts a [Fetch API `Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)
 * instance and returns a [Fetch API `Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 * instance.
 *
 * @param options - Options.
 * @returns Request handler.
 */
export function merchant(options: merchant.Options) {
  const { address, basePath, relay = Porto.defaultConfig.relay } = options

  const client = createClient({
    rpcSchema: rpcSchema<RpcSchema_relay.Viem>(),
    transport: relay,
  })

  const fromKey = (() => {
    if (typeof options.key === 'string') return undefined
    if (options.key.type === 'secp256k1') return Key.fromSecp256k1
    if (options.key.type === 'p256') return Key.fromP256
    throw new Error('unsupported key type')
  })()
  const key = fromKey
    ? fromKey(options.key as never)
    : Key.fromSecp256k1({
        privateKey: options.key as Hex.Hex,
      })

  const router = from({ basePath })

  router.hono.get('/', (c) => c.text('ok'))

  router.hono.post('/', async (c) => {
    let request: MerchantSchema.JsonRpcRequest = await c.req.json()
    try {
      request = MerchantSchema.validate(MerchantSchema.JsonRpcRequest, request)
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
          const { typedData } = z.decode(
            MerchantSchema.wallet_prepareCalls.Response,
            result,
          )

          const signature = sponsor
            ? await Key.sign(key, {
                address: null,
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
  export type Options = {
    /** Address of the Merchant Account. */
    address: Address.Address
    /** Base path of the request handler. */
    basePath?: string | undefined
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
          request: MerchantSchema.wallet_prepareCalls.Parameters,
        ) => MaybePromise<boolean>)
      | undefined
    /** Relay transport override. */
    relay?: Porto.Config['relay'] | undefined
  }
}

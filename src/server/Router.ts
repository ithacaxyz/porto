import { type Env, type ExecutionContext, Hono } from 'hono'
import { cors } from 'hono/cors'
import { poweredBy } from 'hono/powered-by'
import type { BlankEnv, BlankSchema, Schema } from 'hono/types'
import * as RequestListener from './internal/requestListener.js'

export function Router<
  env extends Env = BlankEnv,
  schema extends Schema = BlankSchema,
  basePath extends string = '/',
>(options: Router.Base.ConstructorOptions = {}) {
  const handler = new Router.Base<env, schema, basePath>(options)
  handler.hono.get('/', (c) =>
    c.text(`
█▀█ █▀█ █▀█ ▀█▀ █▀█
█▀▀ █▄█ █▀▄  █  █▄█
`),
  )
  return handler
}

export namespace Router {
  export class Base<
    env extends Env = BlankEnv,
    schema extends Schema = BlankSchema,
    basePath extends string = '/',
  > {
    hono: Hono<env, schema, basePath>

    /**
     * Creates a new Handler instance.
     *
     * @param options - constructor options
     */
    constructor(options: Base.ConstructorOptions = {}) {
      const hono = new Hono<env, schema, basePath>()
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

    /**
     * `.route()` allows grouping other Porto handlers in routes.
     *
     * @example
     * TODO
     *
     * @param path - base Path
     * @param app - other Porto handler
     * @returns routed Porto handler
     */
    route<
      path extends string,
      env extends Env,
      schema extends Schema,
      subBasePath extends string,
    >(path: path, app: Base<env, schema, subBasePath>) {
      this.hono.route(path, app.hono)
      return this
    }
  }

  export declare namespace Base {
    type ConstructorOptions = { cors?: Parameters<typeof cors>[0] | undefined }
  }
}

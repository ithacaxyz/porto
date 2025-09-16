import type { Env } from 'hono'
import type { BlankEnv, BlankSchema, Schema } from 'hono/types'
import * as Route from './Route.js'

export function Router<
  env extends Env = BlankEnv,
  schema extends Schema = BlankSchema,
  basePath extends string = '/',
>(options: Router.Options<basePath> = {}) {
  const handler = new Router.Inner<env, schema, basePath>(options)
  handler.hono.get('/', (c) =>
    c.text(`
█▀█ █▀█ █▀█ ▀█▀ █▀█
█▀▀ █▄█ █▀▄  █  █▄█
`),
  )
  return handler
}

export namespace Router {
  export type Options<basePath extends string = '/'> = Omit<
    Inner.ConstructorOptions<basePath>,
    'defaultPath'
  >

  export class Inner<
    env extends Env = BlankEnv,
    schema extends Schema = BlankSchema,
    basePath extends string = '/',
  > extends Route.from.Inner<env, schema, basePath> {
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
    >(
      path: path,
      app: Route.from.Inner<env, schema, subBasePath>,
    ): Inner<env, schema, subBasePath> {
      this.hono.route(path, app.hono)
      return this as never
    }
  }

  export declare namespace Inner {
    type ConstructorOptions<basePath extends string = '/'> =
      Route.from.Inner.ConstructorOptions<basePath>
  }
}

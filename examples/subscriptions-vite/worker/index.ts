import { env } from 'cloudflare:workers'
import { Route, Router } from 'porto/server'

export default Router({ basePath: '/porto' }).route(
  '/merchant',
  Route.merchant({
    address: env.MERCHANT_ADDRESS,
    key: env.MERCHANT_PRIVATE_KEY,
  }),
) satisfies ExportedHandler<Env>

import { env } from 'cloudflare:workers'
import { Route, Router } from 'porto/server'
import * as Contracts from '../src/contracts.ts'

export default Router({ basePath: '/porto' }).route(
  '/merchant',
  Route.merchant({
    address: env.MERCHANT_ADDRESS,
    key: env.MERCHANT_PRIVATE_KEY,
    sponsor(request) {
      return request.calls.every((call) => call.to === Contracts.exp1Address)
    },
  }),
) satisfies ExportedHandler<Env>

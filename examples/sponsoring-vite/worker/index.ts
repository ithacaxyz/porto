import { env } from 'cloudflare:workers'
import { Route, Router } from 'porto/server'
import * as Contracts from '../src/contracts.ts'

export default Router().route(
  '/rpc',
  Route.merchant({
    address: env.MERCHANT_ADDRESS as `0x${string}`,
    key: env.MERCHANT_PRIVATE_KEY as `0x${string}`,
    sponsor(request) {
      return request.calls.every((call) => call.to === Contracts.exp1Address)
    },
  }),
) satisfies ExportedHandler<Env>

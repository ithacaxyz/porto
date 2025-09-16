import { Route, Router } from 'porto/server'
import * as Contracts from '../../contracts'

export const route = Router({ basePath: '/porto' }).route(
  '/merchant',
  Route.merchant({
    address: process.env.MERCHANT_ADDRESS,
    key: process.env.MERCHANT_PRIVATE_KEY,
    sponsor(request) {
      return request.calls.every((call) => call.to === Contracts.exp1Address)
    },
  }),
)

export const GET = route.fetch
export const OPTIONS = route.fetch
export const POST = route.fetch

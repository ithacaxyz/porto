import { Route } from 'porto/server'
import * as Contracts from '../contracts'

const route = Route.merchant({
  address: process.env.NEXT_PUBLIC_MERCHANT_ADDRESS,
  key: process.env.NEXT_PUBLIC_MERCHANT_PRIVATE_KEY,
  sponsor(request) {
    return request.calls.every((call) => call.to === Contracts.exp1Address)
  },
})

export const GET = route.fetch
export const OPTIONS = route.fetch
export const POST = route.fetch

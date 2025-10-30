import { env } from 'cloudflare:workers'
import { Route, Router } from 'porto/server'
import { isAddress, isHex } from 'viem'

import * as Contracts from '../src/contracts.ts'

const MERCHANT_ADDRESS = env.MERCHANT_ADDRESS
if (!isAddress(MERCHANT_ADDRESS))
  throw new Error('MERCHANT_ADDRESS is not a valid address')
const MERCHANT_PRIVATE_KEY = env.MERCHANT_PRIVATE_KEY
if (!isHex(MERCHANT_PRIVATE_KEY))
  throw new Error('MERCHANT_PRIVATE_KEY is not a valid private key')

export default Router({ basePath: '/porto' }).route(
  '/merchant',
  Route.merchant({
    address: MERCHANT_ADDRESS,
    key: MERCHANT_PRIVATE_KEY,
    sponsor(request) {
      return request.calls.every((call) => call.to === Contracts.exp1Address)
    },
  }),
) satisfies ExportedHandler<Env>

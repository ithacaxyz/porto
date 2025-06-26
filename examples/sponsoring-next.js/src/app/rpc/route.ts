import { MerchantRpc } from 'porto/server'
import * as Contracts from '../../contracts.ts'

export const GET = MerchantRpc.GET

export const OPTIONS = MerchantRpc.OPTIONS

export const POST = MerchantRpc.POST({
  address: process.env.NEXT_PUBLIC_MERCHANT_ADDRESS,
  key: process.env.NEXT_PUBLIC_MERCHANT_PRIVATE_KEY,
  sponsor(request) {
    return request.calls.every((call) => call.to === Contracts.exp1Address)
  },
})

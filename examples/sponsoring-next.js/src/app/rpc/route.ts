import { MerchantRpc } from 'porto/server'

export const GET = MerchantRpc.GET

export const OPTIONS = MerchantRpc.OPTIONS

export const POST = MerchantRpc.POST({
  address: process.env.NEXT_PUBLIC_MERCHANT_ADDRESS,
  key: process.env.NEXT_PUBLIC_MERCHANT_PRIVATE_KEY,
})

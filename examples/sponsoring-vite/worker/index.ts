import { env } from 'cloudflare:workers'
import { MerchantRpc } from 'porto/server'
import * as Contracts from '../src/contracts.ts'

export default {
  fetch: MerchantRpc.requestHandler({
    address: env.MERCHANT_ADDRESS as `0x${string}`,
    base: '/rpc',
    key: env.MERCHANT_PRIVATE_KEY as `0x${string}`,
    sponsor(request) {
      return request.calls.every((call) => call.to === Contracts.exp1Address)
    },
  }),
} satisfies ExportedHandler<Env>

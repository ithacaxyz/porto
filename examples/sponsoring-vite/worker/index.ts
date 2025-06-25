import { env } from 'cloudflare:workers'
import { MerchantRpc } from 'porto/server'

export default {
  fetch: MerchantRpc.requestHandler({
    address: env.MERCHANT_ADDRESS as `0x${string}`,
    base: '/rpc',
    key: env.MERCHANT_PRIVATE_KEY as `0x${string}`,
  }),
} satisfies ExportedHandler<Env>

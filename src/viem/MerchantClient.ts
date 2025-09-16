import {
  type Account,
  type Chain,
  createClient,
  http,
  type Transport,
  type Client as viem_Client,
} from 'viem'
import type * as RpcSchema from './RpcSchema.js'

export type MerchantClient = viem_Client<
  Transport,
  Chain | undefined,
  Account | undefined,
  RpcSchema.Merchant
>

const clientCache = new Map<string, any>()

export function fromUrl(url: string): MerchantClient {
  const key = ['merchant', url].filter(Boolean).join(':')
  if (clientCache.has(key)) return clientCache.get(key)!
  const client = createClient({
    transport: http(url),
  })
  clientCache.set(key, client)
  return client as never
}

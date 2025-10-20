import { Value } from 'ox'
import { Porto } from 'porto'
import { baseSepolia } from 'porto/core/Chains'
import { porto as portoConnector } from 'porto/wagmi'
import { createClient, custom } from 'viem'
import { createConfig, http } from 'wagmi'
import { exp1Address, exp2Address, expNftAddress } from './contracts.ts'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [portoConnector({ merchantUrl: '/porto/merchant' })],
  multiInjectedProviderDiscovery: false,
  transports: {
    [baseSepolia.id]: http(),
  },
})

export const porto = Porto.create({
  chains: [baseSepolia],
  merchantUrl: '/porto/merchant',
})

export const client = createClient({
  chain: baseSepolia,
  transport: http('https://rpc.porto.sh'),
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

export const permissions = () =>
  ({
    expiry: Math.floor(Date.now() / 1_000) + 60 * 60 * 24 * 30, // 30 days
    feeToken: {
      limit: Value.fromEther('10000'),
      symbol: 'EXP',
    },
    permissions: {
      calls: [
        {
          to: exp1Address,
        },
        {
          to: exp2Address,
        },
        {
          signature: 'mint(address)',
          to: expNftAddress,
        },
      ],
      spend: [
        {
          limit: Value.fromEther('50000'),
          period: 'month',
          token: exp1Address,
        },
      ],
    },
  }) as const

/**
 * @see https://docs.privy.io/recipes/react/eip-7702#detect-current-7702-authorization-state-and-implementation-address
 */
export function parseEip7702AuthorizedAddress(
  code: string | null | undefined,
): `0x${string}` | null {
  if (!code || code === '0x' || code === '0x0') return null
  const normalized = code.toLowerCase()
  const MAGIC = '0xef0100'
  const idx = normalized.indexOf(MAGIC)
  if (idx === -1) return null
  return ('0x' +
    normalized.slice(
      idx + MAGIC.length,
      idx + MAGIC.length + 40,
    )) as `0x${string}`
}

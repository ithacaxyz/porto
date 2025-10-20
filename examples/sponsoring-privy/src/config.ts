import { type Address, Hex, Value } from 'ox'
import { Porto } from 'porto'
import { createClient, custom } from 'viem'
import { baseSepolia } from 'viem/chains'

import { exp1Address, exp2Address, expNftAddress } from './contracts.ts'

export const porto = Porto.create({
  merchantUrl: '/api/merchant',
})

export const client = createClient({
  chain: baseSepolia,
  transport: custom(porto.provider),
})

export const permissions = () =>
  ({
    expiry: Math.floor(Date.now() / 1_000) + 60 * 60 * 24 * 30, // 30 days
    feeToken: {
      limit: '1',
      symbol: 'EXP',
    },
    permissions: {
      calls: [
        {
          to: exp1Address[
            baseSepolia.id as keyof typeof exp1Address
          ] as Address.Address,
        },
        {
          to: exp2Address[
            baseSepolia.id as keyof typeof exp2Address
          ] as Address.Address,
        },
        {
          signature: 'mint(address)',
          to: expNftAddress[
            baseSepolia.id as keyof typeof expNftAddress
          ] as Address.Address,
        },
      ],
      spend: [
        {
          limit: Hex.fromNumber(Value.fromEther('50000')),
          period: 'month',
          token: exp1Address[
            baseSepolia.id as keyof typeof exp1Address
          ] as Address.Address,
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

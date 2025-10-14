import { Hex, Value } from 'ox'
import { Porto } from 'porto/react-native'
import { baseSepolia } from 'viem/chains'

import { exp1Address, exp2Address } from './contracts'

export const porto = Porto.create()

const chainId = baseSepolia.id

export const permissions = () =>
  ({
    expiry: Math.floor(Date.now() / 1_000) + 60 * 60, // 1 hour
    feeToken: {
      limit: '1',
      symbol: 'EXP',
    },
    permissions: {
      calls: [
        { to: exp1Address[chainId as keyof typeof exp1Address] },
        { to: exp2Address[chainId as keyof typeof exp2Address] },
        {
          signature: 'mint()',
          to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
        },
      ],
      spend: [
        {
          limit: Hex.fromNumber(Value.fromEther('50')),
          period: 'minute',
          token: exp1Address[chainId as keyof typeof exp1Address],
        },
      ],
    },
  }) as const

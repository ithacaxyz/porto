import { Hex, Value } from 'ox'
import { Mode, Porto } from 'porto'

import { baseSepolia } from 'viem/chains'
import { exp1Address, exp2Address } from './contracts'
import { createFn, getFn, rp } from './passkeys'

export const porto = Porto.create({
  mode: Mode.relay({
    keystoreHost: rp.id,
    webAuthn: { createFn, getFn },
  }),
})

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

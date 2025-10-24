import { Hex, Value } from 'ox'
import { Mode, Porto } from 'porto'
import { baseSepolia } from 'porto/core/Chains'
import { RelayClient } from 'porto/viem'

import { exp1Address, exp2Address } from './contracts'
import { createFn, getFn, rp } from './passkeys'

export const porto = Porto.create({
  chains: [baseSepolia],
  mode: Mode.relay({
    keystoreHost: rp.id,
    webAuthn: { createFn, getFn },
  }),
})

export const client = RelayClient.fromPorto(porto, { chainId: baseSepolia.id })

export const permissions = () =>
  ({
    expiry: Math.floor(Date.now() / 1_000) + 60 * 60, // 1 hour
    feeToken: {
      limit: '10',
      symbol: 'EXP',
    },
    permissions: {
      calls: [
        { to: exp1Address },
        { to: exp2Address },
        {
          signature: 'mint()',
          to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
        },
      ],
      spend: [
        {
          limit: Hex.fromNumber(Value.fromEther('50000')),
          period: 'minute',
          token: exp1Address,
        },
      ],
    },
  }) as const

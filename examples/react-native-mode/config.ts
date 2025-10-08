import 'porto-924/react-native'

import { Hex, Value } from 'ox'
import { Mode, Porto } from 'porto-924'
import { baseSepolia } from 'porto-924/Chains'
import { exp1Address, exp2Address } from './contracts'

export const porto = Porto.create({
  chains: [baseSepolia],
  mode: Mode.reactNative(),
})

const chainId = baseSepolia.id

export const permissions = () => {
  const exp1Token = exp1Address[chainId as keyof typeof exp1Address]
  if (!exp1Token) {
    console.warn(`exp1 address not defined for chainId ${chainId}`)
    return undefined
  }
  const exp2Token = exp2Address[chainId as keyof typeof exp2Address]
  if (!exp2Token) {
    console.warn(`exp2 address not defined for chainId ${chainId}`)
    return undefined
  }
  return {
    expiry: Math.floor(Date.now() / 1_000) + 60 * 60, // 1 hour
    feeToken: {
      limit: '1',
      symbol: 'EXP',
    },
    permissions: {
      calls: [
        {
          to: exp1Token,
        },
        {
          to: exp2Token,
        },
        {
          signature: 'mint()',
          to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
        },
      ],
      spend: [
        {
          limit: Hex.fromNumber(Value.fromEther('50')),
          period: 'minute',
          token: exp1Token,
        },
      ],
    },
  } as const
}

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Value } from 'ox'
import { Mode } from 'porto'
import { baseSepolia } from 'porto/core/Chains'
import { porto as portoConnector } from 'porto/wagmi'
import { Platform } from 'react-native'
import { createConfig, createStorage, http } from 'wagmi'

import { exp1Address, exp2Address } from './contracts.ts'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    portoConnector({
      ...Platform.select({
        default: { mode: Mode.reactNative() },
        web: { mode: Mode.dialog() },
      }),
    }),
  ],
  multiInjectedProviderDiscovery: false,
  storage: createStorage({ storage: AsyncStorage }),
  transports: {
    [baseSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

export const chainId = baseSepolia.id

export const permissions = () => {
  const exp1Token = exp1Address[chainId as keyof typeof exp1Address]
  const exp2Token = exp2Address[chainId as keyof typeof exp2Address]

  return {
    expiry: Math.floor(Date.now() / 1_000) + 60 * 60, // 1 hour
    feeToken: {
      limit: '1',
      symbol: 'EXP',
    },
    permissions: {
      calls: [
        { to: exp1Token },
        { to: exp2Token },
        {
          signature: 'mint()',
          to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
        },
      ],
      spend: [
        {
          limit: Value.fromEther('50'),
          period: 'minute',
          token: exp1Token,
        },
      ],
    },
  } as const
}

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Value } from 'ox'
import { baseSepolia } from 'porto/core/Chains'
import { Mode } from 'porto/react-native'
import { porto as portoConnector } from 'porto/wagmi'
import * as Passkeys from 'react-native-passkeys'
import { createConfig, createStorage, http } from 'wagmi'

import { exp1Address, exp2Address } from './contracts.ts'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    portoConnector({
      mode: Mode.reactNative({
        supportAccountUpgrades: {
          keyStoreHost: 'portox.up.railway.app',
          passkeysModule: Passkeys,
        },
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
          limit: Value.fromEther('500'),
          period: 'minute',
          token: exp1Address,
        },
      ],
    },
  }) as const

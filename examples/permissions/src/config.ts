import { porto } from 'porto/wagmi'
import { parseEther } from 'viem'
import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { exp1Config } from './contracts'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [porto()],
  multiInjectedProviderDiscovery: false,
  pollingInterval: 1_000,
  transports: {
    [baseSepolia.id]: http(),
  },
})

export const permissions = () =>
  ({
    expiry: Math.floor(Date.now() / 1_000) + 60 * 60, // 1 hour
    permissions: {
      calls: [{ to: exp1Config.address }],
      spend: [
        {
          limit: parseEther('10'),
          period: 'hour',
          token: exp1Config.address,
        },
      ],
    },
  }) as const

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

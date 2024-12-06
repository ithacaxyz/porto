import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'
import { odysseyTestnet } from 'viem/chains'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [],
  plugins: [
    foundry({
      deployments: {
        ExperimentalDelegation: {
          [odysseyTestnet.id]: '0xa4D1493aC6bB7f49f9C5fF0c1164455Ab27C8a9B',
        },
        ExperimentERC20: {
          [odysseyTestnet.id]: '0xfCFEe8f32576a608FF224bbb3eBcaAc7B3E8094C',
        },
      },
      project: 'contracts',
    }),
  ],
})

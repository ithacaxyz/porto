import { Chains, Mode, Storage } from 'porto'
import { Porto } from 'porto/remote'
import { http } from 'viem'

import { exp1Address } from '../_generated/contracts'
import * as Env from './Env'

export const config = {
  anvil: {
    chains: [Chains.odysseyTestnet],
    mode: Mode.relay({
      feeToken: exp1Address,
    }),
    transports: {
      [Chains.odysseyTestnet.id]: {
        default: http('http://127.0.0.1:8545/1'),
        relay: http('http://127.0.0.1:9119/1'),
      },
    },
  },
  stg: {
    chains: [Chains.odysseyTestnet],
    mode: Mode.relay({
      feeToken: exp1Address,
    }),
    transports: {
      [Chains.odysseyTestnet.id]: {
        default: http(),
        relay: http('https://relay-staging.ithaca.xyz'),
      },
    },
  },
  prod: {
    chains: [Chains.odysseyTestnet],
    mode: Mode.contract(),
    transports: {
      [Chains.odysseyTestnet.id]: {
        default: http(),
        relay: http('https://relay.ithaca.xyz'),
      },
    },
  },
} as const satisfies Record<Env.Env, Partial<Porto.Config>>

export const dialogHosts = {
  anvil: import.meta.env.PROD
    ? undefined
    : 'https://anvil.localhost:5174/dialog/',
  stg: import.meta.env.PROD
    ? 'https://stg.id.porto.sh/dialog/'
    : 'https://stg.localhost:5174/dialog/',
  prod: import.meta.env.PROD
    ? 'https://id.porto.sh/dialog/'
    : 'https://localhost:5174/dialog/',
} as const satisfies Record<Env.Env, string | undefined>

export const dialogModes = {
  anvil: Mode.relay({
    feeToken: exp1Address,
  }),
  stg: Mode.relay({
    feeToken: exp1Address,
  }),
  prod: Mode.contract(),
} as const satisfies Record<Env.Env, Mode.Mode>

export const porto = Porto.create({
  ...config[Env.get()],
  storage: Storage.combine(Storage.cookie(), Storage.localStorage()),
})

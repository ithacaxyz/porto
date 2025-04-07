import { Address } from 'ox'
import { Chains, Mode } from 'porto'
import { Porto } from 'porto/remote'
import { http } from 'viem'

import { exp1Address } from '../_generated/contracts'
import * as Env from './Env'
import * as Sentry from './Sentry'

export const chains = Porto.defaultConfig.chains

export const feeToken = {
  [Chains.odysseyTestnet.id]: exp1Address,
} satisfies Record<number, Address.Address>

export const config = {
  anvil: {
    chains,
    mode: Mode.relay({
      feeToken,
    }),
    transports: {
      [Chains.odysseyTestnet.id]: {
        default: http('http://127.0.0.1:8545/1'),
        relay: http('http://127.0.0.1:9119/1'),
      },
    },
  },
  prod: {
    chains,
    mode: Mode.contract(),
    transports: {
      [Chains.odysseyTestnet.id]: {
        default: http(),
        relay: http('https://relay.ithaca.xyz', Sentry.httpTransportOptions()),
      },
    },
  },
  stg: {
    chains,
    mode: Mode.relay({
      feeToken,
    }),
    transports: {
      [Chains.odysseyTestnet.id]: {
        default: http(),
        relay: http(
          'https://relay-staging.ithaca.xyz',
          Sentry.httpTransportOptions(),
        ),
      },
    },
  },
} as const satisfies Record<Env.Env, Partial<Porto.Config>>

export const dialogHosts = {
  anvil: import.meta.env.PROD
    ? undefined
    : 'https://anvil.localhost:5174/dialog/',
  prod: import.meta.env.PROD
    ? 'https://id.porto.sh/dialog/'
    : 'https://localhost:5174/dialog/',
  stg: import.meta.env.PROD
    ? 'https://stg.id.porto.sh/dialog/'
    : 'https://stg.localhost:5174/dialog/',
} as const satisfies Record<Env.Env, string | undefined>

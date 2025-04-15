import { Value } from 'ox'
import { Chains, Mode } from 'porto'
import { Porto } from 'porto/remote'
import { http, ValueOf } from 'viem'

import { exp1Address } from '../_generated/contracts'
import * as Env from './Env'
import * as Sentry from './Sentry'

export const feeTokens = {
  [Chains.odysseyTestnet.id]: [
    {
      address: exp1Address[Chains.odysseyTestnet.id],
      permissionSpendLimit: {
        limit: Value.fromEther('0.01'),
        period: 'minute',
      },
    },
  ],
  [Chains.odysseyDevnet.id]: [
    {
      address: exp1Address[Chains.odysseyDevnet.id],
      permissionSpendLimit: {
        limit: Value.fromEther('0.01'),
        period: 'minute',
      },
    },
  ],
} as const satisfies Mode.relay.Parameters['feeTokens']

const config = {
  anvil: {
    chains: [Chains.odysseyTestnet],
    mode: Mode.relay({
      feeTokens,
    }),
    transports: {
      [Chains.odysseyTestnet.id]: {
        default: http('http://127.0.0.1:8545'),
        relay: http('http://127.0.0.1:9119'),
      },
    },
  },
  prod: {
    chains: [Chains.odysseyTestnet],
    mode: Mode.contract(),
    transports: {
      [Chains.odysseyTestnet.id]: {
        default: http(),
        relay: http('https://relay.ithaca.xyz', Sentry.httpTransportOptions()),
      },
    },
  },
  stg: {
    chains: [Chains.odysseyDevnet],
    mode: Mode.relay({
      feeTokens,
    }),
    transports: {
      [Chains.odysseyDevnet.id]: {
        default: http(),
        relay: http(
          'https://relay-staging.ithaca.xyz',
          Sentry.httpTransportOptions(),
        ),
      },
    },
  },
} as const satisfies Record<Env.Env, Partial<Porto.Config>>

const dialogHosts = {
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

export function getConfig(
  env = Env.get(),
): Porto.Config<readonly [Chain, ...Chain[]]> {
  return config[env] as never
}

export function getDialogHost(env = Env.get()): string {
  if (
    import.meta.env.VITE_VERCEL_ENV === 'preview' &&
    import.meta.env.VITE_VERCEL_BRANCH_URL
  )
    return (
      'https://' +
      import.meta.env.VITE_VERCEL_BRANCH_URL.replace(
        /(.*)(-git.*)/,
        'dialogporto$2',
      ) +
      '/dialog/?env=' +
      env
    )
  return dialogHosts[env] as string
}

export type Chain = ValueOf<typeof config>['chains'][number]
export type ChainId = Chain['id']

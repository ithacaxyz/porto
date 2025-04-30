import { Chains, Mode } from 'porto'
import { Porto } from 'porto/remote'
import { http, ValueOf } from 'viem'

import * as Env from './Env'
import * as Sentry from './Sentry'

const config = {
  anvil: {
    chains: [Chains.anvil],
    mode: Mode.relay({
      feeToken: 'EXP1',
    }),
    transports: {
      [Chains.anvil.id]: {
        default: http('http://127.0.0.1:8545'),
        relay: http('http://127.0.0.1:9119'),
      },
    },
  },
  dev: {
    chains: [Chains.portoDev],
    mode: Mode.relay({
      feeToken: 'EXP',
    }),
    storageKey: 'porto.store.dev',
    transports: {
      [Chains.portoDev.id]: {
        default: http(),
        relay: http(
          'https://relay-dev.ithaca.xyz',
          Sentry.httpTransportOptions(),
        ),
      },
    },
  },
  prod: {
    chains: [Chains.baseSepolia],
    mode: Mode.relay(),
    transports: {
      [Chains.baseSepolia.id]: {
        default: http(),
        relay: http('https://relay.ithaca.xyz', Sentry.httpTransportOptions()),
      },
    },
  },
  stg: {
    chains: [Chains.baseSepolia],
    mode: Mode.relay(),
    storageKey: 'porto.store.stg',
    transports: {
      [Chains.baseSepolia.id]: {
        default: http(),
        relay: http('https://relay.ithaca.xyz', Sentry.httpTransportOptions()),
      },
    },
  },
} as const satisfies Record<Env.Env, Partial<Porto.Config>>

const dialogHosts = {
  anvil: import.meta.env.PROD
    ? undefined
    : 'https://anvil.localhost:5174/dialog/',
  dev: import.meta.env.PROD
    ? 'https://dev.id.porto.sh/dialog/'
    : 'https://dev.localhost:5174/dialog/',
  prod: import.meta.env.PROD
    ? 'https://stg.id.porto.sh/dialog/'
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
  return dialogHosts[env] + '?env=' + env
}

export type Chain = ValueOf<typeof config>['chains'][number]
export type ChainId = Chain['id']

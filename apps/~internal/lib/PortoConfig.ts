import { Chains, Mode } from 'porto'
import { Porto } from 'porto/remote'
import { http, ValueOf } from 'viem'

import * as Env from './Env'
import * as Sentry from './Sentry'

const config = {
  anvil: {
    chains: [Chains.anvil],
    mode: Mode.rpcServer({
      persistPreCalls: false,
    }),
  },
  dev: {
    chains: [Chains.portoDev],
    mode: Mode.rpcServer({
      persistPreCalls: false,
    }),
    storageKey: 'porto.store.dev',
    transports: {
      [Chains.portoDev.id]: http(undefined, Sentry.httpTransportOptions()),
    },
  },
  prod: {
    chains: [Chains.baseSepolia],
    mode: Mode.rpcServer({
      persistPreCalls: false,
    }),
    transports: {
      [Chains.baseSepolia.id]: http(undefined, Sentry.httpTransportOptions()),
    },
  },
  stg: {
    chains: [Chains.baseSepolia],
    mode: Mode.rpcServer({
      persistPreCalls: false,
    }),
    storageKey: 'porto.store.stg',
    transports: {
      [Chains.baseSepolia.id]: http(undefined, Sentry.httpTransportOptions()),
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

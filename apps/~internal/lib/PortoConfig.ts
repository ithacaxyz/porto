import { Chains, Mode } from 'porto'
import type { Porto } from 'porto/remote'
import { http, type ValueOf } from 'viem'

import * as Env from './Env'
import * as Sentry from './Sentry'

const mock = import.meta.env.MODE === 'test'

const config = {
  anvil: {
    chains: [Chains.anvilParos, Chains.anvilTinos, Chains.anvilLeros],
    mode: Mode.rpcServer({
      mock,
      persistPreCalls: false,
    }),
  },
  dev: {
    chains: [Chains.portoDevParos, Chains.portoDevLeros, Chains.portoDevTinos],
    feeToken: 'EXP',
    mode: Mode.rpcServer({
      mock,
      persistPreCalls: false,
    }),
    storageKey: 'porto.store.dev',
    transports: {
      [Chains.portoDevParos.id]: http(undefined, Sentry.httpTransportOptions()),
      [Chains.portoDevLeros.id]: http(undefined, Sentry.httpTransportOptions()),
      [Chains.portoDevTinos.id]: http(undefined, Sentry.httpTransportOptions()),
    },
  },
  prod: {
    chains: [Chains.base],
    feeToken: 'USDC',
    mode: Mode.rpcServer({
      mock,
      persistPreCalls: false,
    }),
    transports: {
      [Chains.base.id]: http(undefined, Sentry.httpTransportOptions()),
    },
  },
  stg: {
    chains: [Chains.baseSepolia],
    feeToken: 'EXP',
    mode: Mode.rpcServer({
      mock,
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
    ? 'https://id.porto.sh/dialog/'
    : 'https://prod.localhost:5174/dialog/',
  stg: import.meta.env.PROD
    ? 'https://stg.id.porto.sh/dialog/'
    : 'https://localhost:5174/dialog/',
} as const satisfies Record<Env.Env, string | undefined>

export function getConfig(
  env = Env.get(),
): Porto.Config<readonly [Chain, ...Chain[]]> {
  return config[env] as never
}

export function getDialogHost(env = Env.get()): string {
  const url = (() => {
    if (import.meta.env.VITE_DIALOG_HOST)
      return import.meta.env.VITE_DIALOG_HOST
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
        '/dialog/'
      )
    return dialogHosts[env]
  })()
  return url + '?env=' + env
}

export type Chain = ValueOf<typeof config>['chains'][number]
export type ChainId = Chain['id']

import * as UserAgent from '../../core/internal/userAgent.js'

export type MethodPolicy = {
  method: string
  modes?:
    | {
        headless?:
          | true
          | {
              sameOrigin?: boolean | undefined
            }
          | undefined
        dialog?:
          | true
          | {
              sameOrigin?: boolean | undefined
            }
          | undefined
      }
    | undefined
  requireConnection?: boolean | undefined
}
export type MethodPolicies = readonly MethodPolicy[]

export const methodPolicies = [
  {
    method: 'eth_requestAccounts',
    modes: {
      dialog: true,
      headless: {
        sameOrigin: true,
      },
    },
    requireConnection: false,
  },
  {
    method: 'wallet_getAccountVersion',
    modes: {
      headless: true,
    },
  },
  {
    method: 'wallet_getKeys',
    modes: {
      headless: true,
    },
  },
  {
    method: 'wallet_getPermissions',
    modes: {
      headless: true,
    },
  },
  {
    method: 'wallet_grantAdmin',
    modes: {
      dialog: {
        sameOrigin: true,
      },
    },
  },
  {
    method: 'wallet_revokeAdmin',
    modes: {
      dialog: {
        sameOrigin: true,
      },
    },
  },
  {
    method: 'wallet_upgradeAccount',
    modes: {
      headless: true,
    },
  },
  {
    method: 'wallet_connect',
    modes: {
      dialog: true,
      headless: !UserAgent.isSafari()
        ? {
            sameOrigin: true,
          }
        : undefined,
    },
    requireConnection: false,
  },
  {
    method: 'wallet_getAssets',
    modes: {
      headless: true,
    },
  },
  {
    method: 'wallet_getCallsStatus',
    modes: {
      headless: true,
    },
  },
  {
    method: 'wallet_getCapabilities',
    modes: {
      headless: true,
    },
  },
  {
    method: 'wallet_prepareCalls',
    modes: {
      headless: true,
    },
  },
  {
    method: 'wallet_sendPreparedCalls',
    modes: {
      headless: true,
    },
  },
  {
    method: 'wallet_switchEthereumChain',
    modes: {
      headless: true,
    },
  },
] as const satisfies MethodPolicies

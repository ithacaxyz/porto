import { exp1Config } from '@porto/apps/contracts'
import { Value } from 'ox'
import type { config } from '../wagmi.config'

export type ChainId = (typeof config)['state']['chainId']

export const permissions = (chainId: ChainId) => {
  const exp1Token =
    exp1Config.address[chainId as keyof (typeof exp1Config)['address']]
  if (!exp1Token) {
    console.warn(`exp1 address not defined for chainId ${chainId}`)
    return undefined
  }
  return {
    expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    feeToken: {
      limit: '1',
      symbol: 'EXP',
    },
    permissions: {
      calls: [{ to: exp1Token }],
      spend: [
        {
          limit: Value.fromEther('99'),
          period: 'hour',
          token: exp1Token,
        },
      ],
    },
  } as const
}

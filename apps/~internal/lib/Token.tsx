import { Address } from 'ox'
import { Chains } from 'porto'

import { exp1Address, exp2Address } from '../_generated/contracts'
import { chains } from './Porto'

export type Token = {
  decimals: number
  name: string
  symbol: string
}

export const tokens = {
  [Chains.odysseyTestnet.id]: {
    [exp1Address.toLowerCase()]: {
      decimals: 18,
      name: 'Exp',
      symbol: 'EXP',
    },
    [exp2Address.toLowerCase()]: {
      decimals: 18,
      name: 'Exp2',
      symbol: 'EXP2',
    },
  },
} as const satisfies Record<
  (typeof chains)[number]['id'],
  Record<Address.Address, Token>
>

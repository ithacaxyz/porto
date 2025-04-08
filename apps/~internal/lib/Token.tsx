import { Address } from 'ox'
import { Chains } from 'porto'

import { exp1Address, exp2Address } from '../_generated/contracts'

export type Token = {
  decimals: number
  name: string
  symbol: string
}

export const tokens = {
  [Chains.odysseyDevnet.id]: {
    [exp1Address[Chains.odysseyDevnet.id].toLowerCase()]: {
      decimals: 18,
      name: 'Exp',
      symbol: 'EXP',
    },
    [exp2Address[Chains.odysseyDevnet.id].toLowerCase()]: {
      decimals: 18,
      name: 'Exp2',
      symbol: 'EXP2',
    },
  },
  [Chains.odysseyTestnet.id]: {
    [exp1Address[Chains.odysseyTestnet.id].toLowerCase()]: {
      decimals: 18,
      name: 'Exp',
      symbol: 'EXP',
    },
    [exp2Address[Chains.odysseyTestnet.id].toLowerCase()]: {
      decimals: 18,
      name: 'Exp2',
      symbol: 'EXP2',
    },
  },
} as const satisfies Record<number, Record<Address.Address, Token>>

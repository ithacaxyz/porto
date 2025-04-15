// TODO: move into `porto/remote`.

import { Address } from 'ox'
import { Chains } from 'porto'

import { exp1Address, exp2Address } from '../_generated/contracts'

export type Token = {
  address: Address.Address
  decimals: number
  name: string
  symbol: string
}

export const feeTokens = {
  [Chains.odysseyDevnet.id]: {
    [exp1Address[Chains.odysseyDevnet.id].toLowerCase()]: {
      address: exp1Address[Chains.odysseyDevnet.id],
      decimals: 18,
      name: 'Exp',
      symbol: 'EXP',
    },
    [exp2Address[Chains.odysseyDevnet.id].toLowerCase()]: {
      address: exp2Address[Chains.odysseyDevnet.id],
      decimals: 18,
      name: 'Exp2',
      symbol: 'EXP2',
    },
  },
  [Chains.odysseyTestnet.id]: {
    [exp1Address[Chains.odysseyTestnet.id].toLowerCase()]: {
      address: exp1Address[Chains.odysseyTestnet.id],
      decimals: 18,
      name: 'Exp',
      symbol: 'EXP',
    },
    [exp2Address[Chains.odysseyTestnet.id].toLowerCase()]: {
      address: exp2Address[Chains.odysseyTestnet.id],
      decimals: 18,
      name: 'Exp2',
      symbol: 'EXP2',
    },
  },
} as const satisfies Record<number, Record<Address.Address, Token>>

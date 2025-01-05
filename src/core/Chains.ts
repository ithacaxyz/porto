import type * as Address from 'ox/Address'
import type { Chain as Chain_viem } from 'viem'
import * as chains from 'viem/chains'
import { delegationAddress } from './internal/generated.js'

export type Chain = Chain_viem & {
  contracts: Chain_viem['contracts'] & {
    delegation: {
      address: Address.Address
    }
  }
}

export function define<const chain extends Chain>(chain: chain): chain {
  return chain
}

export const odysseyTestnet = /*#__PURE__*/ define({
  ...chains.odysseyTestnet,
  contracts: {
    ...chains.odysseyTestnet.contracts,
    delegation: {
      address: delegationAddress[chains.odysseyTestnet.id],
    },
  },
})

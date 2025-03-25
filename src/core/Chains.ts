import type * as Address from 'ox/Address'
import type { Chain as Chain_viem } from 'viem'
import * as chains from 'viem/chains'

export type Chain = Chain_viem & {
  contracts: Chain_viem['contracts'] & {
    delegation: {
      address: Address.Address
    }
    entryPoint: {
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
    // TODO(relay): use EIP7702Proxy
    delegation: {
      address: '0xfa7c48c1cf01fad4ad16b17b5ae8ba3bd4bcedce',
    },
    entryPoint: {
      address: '0x5197adb49b4ecaa8e00f60f43757d3f5ad630227',
    },
  },
})

import type Address from 'ox/Address'
import { erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'
import type { PortoConfig } from '../lib'

const functionNames = ['balanceOf', 'decimals', 'symbol', 'name']

export function useReadBalance(props: useReadBalance.Props) {
  const { address, chainId: _ } = props

  return useReadContracts({
    contracts: functionNames.map((name) => ({
      abi: erc20Abi,
      address,
      functionName: name,
    })),
  })
}

export declare namespace useReadBalance {
  type Props = {
    address: Address.Address
    chainId: PortoConfig.ChainId
    functionNames: []
  }
}

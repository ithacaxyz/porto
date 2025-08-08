// [!region exp]
export const expAbi = [
  // ...
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // ...
] as const

export const expAddress = '0xaf3b0a5b4becc4fa1dfafe74580efa19a2ea49fa' as const

export const expConfig = { abi: expAbi, address: expAddress } as const
// [!endregion exp]

// [!region nft]
export const nftAbi = [
  // ...
  {
    inputs: [],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // ...
] as const

export const nftAddress = '0xFcc74F42621D03Fd234d5f40931D8B82923E4D29'

export const nftConfig = { abi: nftAbi, address: nftAddress } as const
// [!endregion nft]

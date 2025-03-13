export const ExperimentERC20 = {
  abi: [
    { type: 'fallback', stateMutability: 'payable' },
    { type: 'receive', stateMutability: 'payable' },
    {
      type: 'function',
      name: 'DOMAIN_SEPARATOR',
      inputs: [],
      outputs: [{ name: 'result', type: 'bytes32' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'allowance',
      inputs: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
      ],
      outputs: [{ name: 'result', type: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'approve',
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      outputs: [{ name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'balanceOf',
      inputs: [{ name: 'owner', type: 'address' }],
      outputs: [{ name: 'result', type: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'burnForEther',
      inputs: [{ name: 'amount', type: 'uint256' }],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'decimals',
      inputs: [],
      outputs: [{ name: '', type: 'uint8' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'mint',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'mintForEther',
      inputs: [],
      outputs: [],
      stateMutability: 'payable',
    },
    {
      type: 'function',
      name: 'name',
      inputs: [],
      outputs: [{ name: '', type: 'string' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'nonces',
      inputs: [{ name: 'owner', type: 'address' }],
      outputs: [{ name: 'result', type: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'permit',
      inputs: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
        { name: 'v', type: 'uint8' },
        { name: 'r', type: 'bytes32' },
        { name: 's', type: 'bytes32' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'symbol',
      inputs: [],
      outputs: [{ name: '', type: 'string' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'totalSupply',
      inputs: [],
      outputs: [{ name: 'result', type: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'transfer',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      outputs: [{ name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'transferFrom',
      inputs: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      outputs: [{ name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
    },
    {
      type: 'event',
      name: 'Approval',
      inputs: [
        {
          name: 'owner',
          type: 'address',
          indexed: true,
        },
        {
          name: 'spender',
          type: 'address',
          indexed: true,
        },
        {
          name: 'amount',
          type: 'uint256',
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Transfer',
      inputs: [
        {
          name: 'from',
          type: 'address',
          indexed: true,
        },
        { name: 'to', type: 'address', indexed: true },
        {
          name: 'amount',
          type: 'uint256',
          indexed: false,
        },
      ],
      anonymous: false,
    },
    { type: 'error', name: 'AllowanceOverflow', inputs: [] },
    { type: 'error', name: 'AllowanceUnderflow', inputs: [] },
    { type: 'error', name: 'InsufficientAllowance', inputs: [] },
    { type: 'error', name: 'InsufficientBalance', inputs: [] },
    { type: 'error', name: 'InvalidPermit', inputs: [] },
    { type: 'error', name: 'Permit2AllowanceIsFixedAtInfinity', inputs: [] },
    { type: 'error', name: 'PermitExpired', inputs: [] },
    { type: 'error', name: 'TotalSupplyOverflow', inputs: [] },
  ],
  address: '0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c',
} as const

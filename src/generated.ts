//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BaseUltraVerifier
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const baseUltraVerifierAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getVerificationKeyHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proof', internalType: 'bytes', type: 'bytes' },
      { name: '_publicInputs', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'verify',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  { type: 'error', inputs: [], name: 'INVALID_VERIFICATION_KEY' },
  { type: 'error', inputs: [], name: 'MOD_EXP_FAILURE' },
  { type: 'error', inputs: [], name: 'OPENING_COMMITMENT_FAILED' },
  { type: 'error', inputs: [], name: 'PAIRING_FAILED' },
  { type: 'error', inputs: [], name: 'PAIRING_PREAMBLE_FAILED' },
  { type: 'error', inputs: [], name: 'POINT_NOT_ON_CURVE' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'actual', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'PUBLIC_INPUT_COUNT_INVALID',
  },
  { type: 'error', inputs: [], name: 'PUBLIC_INPUT_GE_P' },
  { type: 'error', inputs: [], name: 'PUBLIC_INPUT_INVALID_BN128_G1_POINT' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ExperimentalDelegation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Odyssey Testnet Odyssey Explorer__](https://odyssey-explorer.ithaca.xyz/address/0xb46b3f3f7F8B198894d1787b9d6c0effbd3928c9)
 */
export const experimentalDelegationAbi = [
  { type: 'fallback', stateMutability: 'payable' },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'OWNER_METADATA',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'keys_',
        internalType: 'struct ExperimentalDelegation.Key[]',
        type: 'tuple[]',
        components: [
          { name: 'expiry', internalType: 'uint256', type: 'uint256' },
          {
            name: 'keyType',
            internalType: 'enum ExperimentalDelegation.KeyType',
            type: 'uint8',
          },
          {
            name: 'publicKey',
            internalType: 'struct ECDSA.PublicKey',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'authorize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'keys_',
        internalType: 'struct ExperimentalDelegation.Key[]',
        type: 'tuple[]',
        components: [
          { name: 'expiry', internalType: 'uint256', type: 'uint256' },
          {
            name: 'keyType',
            internalType: 'enum ExperimentalDelegation.KeyType',
            type: 'uint8',
          },
          {
            name: 'publicKey',
            internalType: 'struct ECDSA.PublicKey',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'authorize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'calls', internalType: 'bytes', type: 'bytes' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'calls', internalType: 'bytes', type: 'bytes' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getKeys',
    outputs: [
      {
        name: '',
        internalType: 'struct ExperimentalDelegation.Key[]',
        type: 'tuple[]',
        components: [
          { name: 'expiry', internalType: 'uint256', type: 'uint256' },
          {
            name: 'keyType',
            internalType: 'enum ExperimentalDelegation.KeyType',
            type: 'uint8',
          },
          {
            name: 'publicKey',
            internalType: 'struct ECDSA.PublicKey',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'label_', internalType: 'string', type: 'string' },
      {
        name: 'keys_',
        internalType: 'struct ExperimentalDelegation.Key[]',
        type: 'tuple[]',
        components: [
          { name: 'expiry', internalType: 'uint256', type: 'uint256' },
          {
            name: 'keyType',
            internalType: 'enum ExperimentalDelegation.KeyType',
            type: 'uint8',
          },
          {
            name: 'publicKey',
            internalType: 'struct ECDSA.PublicKey',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
      {
        name: 'signature',
        internalType: 'struct ECDSA.Signature',
        type: 'tuple',
        components: [
          { name: 'r', internalType: 'uint256', type: 'uint256' },
          { name: 's', internalType: 'uint256', type: 'uint256' },
          { name: 'yParity', internalType: 'uint8', type: 'uint8' },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'label_', internalType: 'string', type: 'string' },
      {
        name: 'keys_',
        internalType: 'struct ExperimentalDelegation.Key[]',
        type: 'tuple[]',
        components: [
          { name: 'expiry', internalType: 'uint256', type: 'uint256' },
          {
            name: 'keyType',
            internalType: 'enum ExperimentalDelegation.KeyType',
            type: 'uint8',
          },
          {
            name: 'publicKey',
            internalType: 'struct ECDSA.PublicKey',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'isValidSignature',
    outputs: [{ name: 'magicValue', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'keys',
    outputs: [
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      {
        name: 'keyType',
        internalType: 'enum ExperimentalDelegation.KeyType',
        type: 'uint8',
      },
      {
        name: 'publicKey',
        internalType: 'struct ECDSA.PublicKey',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'label',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'keyIndex', internalType: 'uint32', type: 'uint32' }],
    name: 'revoke',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'keyIndex', internalType: 'uint32', type: 'uint32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'revoke',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'zkLoginAccount',
    outputs: [
      { name: 'accountId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'authProviderId', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'publicKeyRegistry',
        internalType: 'contract PublicKeyRegistry',
        type: 'address',
      },
      {
        name: 'proofVerifier',
        internalType: 'contract UltraVerifier',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct ZkLogin.AccountData',
        type: 'tuple',
        components: [
          { name: 'accountId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'authProviderId', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'publicKeyRegistry',
            internalType: 'contract PublicKeyRegistry',
            type: 'address',
          },
          {
            name: 'proofVerifier',
            internalType: 'contract UltraVerifier',
            type: 'address',
          },
        ],
      },
    ],
    name: 'zkLoginAddBackup',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proof', internalType: 'bytes', type: 'bytes' },
      { name: 'publicKeyHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'jwtIat', internalType: 'uint256', type: 'uint256' },
      {
        name: 'newKey',
        internalType: 'struct ExperimentalDelegation.Key',
        type: 'tuple',
        components: [
          { name: 'expiry', internalType: 'uint256', type: 'uint256' },
          {
            name: 'keyType',
            internalType: 'enum ExperimentalDelegation.KeyType',
            type: 'uint8',
          },
          {
            name: 'publicKey',
            internalType: 'struct ECDSA.PublicKey',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'zkLoginRecover',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InvalidAuthority' },
  { type: 'error', inputs: [], name: 'InvalidSignature' },
  { type: 'error', inputs: [], name: 'KeyExpiredOrUnauthorized' },
  {
    type: 'error',
    inputs: [
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'length', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'StringsInsufficientHexLength',
  },
] as const

/**
 * [__View Contract on Odyssey Testnet Odyssey Explorer__](https://odyssey-explorer.ithaca.xyz/address/0xb46b3f3f7F8B198894d1787b9d6c0effbd3928c9)
 */
export const experimentalDelegationAddress = {
  911867: '0xb46b3f3f7F8B198894d1787b9d6c0effbd3928c9',
} as const

/**
 * [__View Contract on Odyssey Testnet Odyssey Explorer__](https://odyssey-explorer.ithaca.xyz/address/0xb46b3f3f7F8B198894d1787b9d6c0effbd3928c9)
 */
export const experimentalDelegationConfig = {
  address: experimentalDelegationAddress,
  abi: experimentalDelegationAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IMulticall3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iMulticall3Abi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'returnData', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call3[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call3Value[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3Value',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'blockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBasefee',
    outputs: [{ name: 'basefee', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'blockNumber', internalType: 'uint256', type: 'uint256' }],
    name: 'getBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlockNumber',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChainId',
    outputs: [{ name: 'chainid', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockCoinbase',
    outputs: [{ name: 'coinbase', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockDifficulty',
    outputs: [{ name: 'difficulty', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockGasLimit',
    outputs: [{ name: 'gaslimit', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [{ name: 'timestamp', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'getEthBalance',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLastBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryAggregate',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryBlockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ownable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ownableAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PublicKeyRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const publicKeyRegistryAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'providerId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'publicKeyHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'checkPublicKey',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'isPublicKeyHashValid',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'providerId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'publicKeyHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'valid', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPublicKeyValid',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'validity',
        internalType: 'struct PublicKeyRegistry.PublicKeyValidity[]',
        type: 'tuple[]',
        components: [
          { name: 'providerId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'publicKeyHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'valid', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'setPublicKeysValid',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Receiver
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const receiverAbi = [
  { type: 'fallback', stateMutability: 'payable' },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Strings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stringsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'length', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'StringsInsufficientHexLength',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UUPSUpgradeable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const uupsUpgradeableAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  { type: 'error', inputs: [], name: 'UnauthorizedCallContext' },
  { type: 'error', inputs: [], name: 'UpgradeFailed' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UltraVerifier
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ultraVerifierAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getVerificationKeyHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proof', internalType: 'bytes', type: 'bytes' },
      { name: '_publicInputs', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'verify',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  { type: 'error', inputs: [], name: 'INVALID_VERIFICATION_KEY' },
  { type: 'error', inputs: [], name: 'MOD_EXP_FAILURE' },
  { type: 'error', inputs: [], name: 'OPENING_COMMITMENT_FAILED' },
  { type: 'error', inputs: [], name: 'PAIRING_FAILED' },
  { type: 'error', inputs: [], name: 'PAIRING_PREAMBLE_FAILED' },
  { type: 'error', inputs: [], name: 'POINT_NOT_ON_CURVE' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'actual', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'PUBLIC_INPUT_COUNT_INVALID',
  },
  { type: 'error', inputs: [], name: 'PUBLIC_INPUT_GE_P' },
  { type: 'error', inputs: [], name: 'PUBLIC_INPUT_INVALID_BN128_G1_POINT' },
] as const

export const abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "entryPoint",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "fallback",
    "stateMutability": "payable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "ANY_FN_SEL",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ANY_KEYHASH",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ANY_TARGET",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "CALL_TYPEHASH",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "DOMAIN_TYPEHASH",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "EMPTY_CALLDATA_FN_SEL",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ENTRY_POINT",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "EXECUTE_TYPEHASH",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MULTICHAIN_NONCE_PREFIX",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approvedImplementationCallers",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approvedImplementations",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approvedSignatureCheckers",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "authorize",
    "inputs": [
      {
        "name": "key",
        "type": "tuple",
        "internalType": "struct DelegationNew.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum DelegationNew.KeyType"
          },
          {
            "name": "isSuperAdmin",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "publicKey",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "canExecute",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "canExecutePackedInfos",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "checkAndIncrementNonce",
    "inputs": [
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "computeDigest",
    "inputs": [
      {
        "name": "calls",
        "type": "tuple[]",
        "internalType": "struct ERC7821.Call[]",
        "components": [
          {
            "name": "to",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "result",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [
      {
        "name": "fields",
        "type": "bytes1",
        "internalType": "bytes1"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "extensions",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "mode",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "executionData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getKey",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "key",
        "type": "tuple",
        "internalType": "struct DelegationNew.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum DelegationNew.KeyType"
          },
          {
            "name": "isSuperAdmin",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "publicKey",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getKeys",
    "inputs": [],
    "outputs": [
      {
        "name": "keys",
        "type": "tuple[]",
        "internalType": "struct DelegationNew.Key[]",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum DelegationNew.KeyType"
          },
          {
            "name": "isSuperAdmin",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "publicKey",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "keyHashes",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "seqKey",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hash",
    "inputs": [
      {
        "name": "key",
        "type": "tuple",
        "internalType": "struct DelegationNew.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum DelegationNew.KeyType"
          },
          {
            "name": "isSuperAdmin",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "publicKey",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "initializePREP",
    "inputs": [
      {
        "name": "initData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "invalidateNonce",
    "inputs": [
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isPREP",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isValidSignature",
    "inputs": [
      {
        "name": "digest",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "keyAt",
    "inputs": [
      {
        "name": "i",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct DelegationNew.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum DelegationNew.KeyType"
          },
          {
            "name": "isSuperAdmin",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "publicKey",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "keyCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "label",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pay",
    "inputs": [
      {
        "name": "paymentAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "keyHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "userOpDigest",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "encodedUserOp",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rPREP",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "removeSpendLimit",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "period",
        "type": "uint8",
        "internalType": "enum GuardedExecutor.SpendPeriod"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "revoke",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setCanExecute",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "fnSel",
        "type": "bytes4",
        "internalType": "bytes4"
      },
      {
        "name": "can",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setImplementationApproval",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "isApproved",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setImplementationCallerApproval",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "caller",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "isApproved",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setLabel",
    "inputs": [
      {
        "name": "newLabel",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setSignatureCheckerApproval",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "checker",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "isApproved",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setSpendLimit",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "period",
        "type": "uint8",
        "internalType": "enum GuardedExecutor.SpendPeriod"
      },
      {
        "name": "limit",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "spendAndExecuteInfos",
    "inputs": [
      {
        "name": "keyHashes",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "outputs": [
      {
        "name": "spends",
        "type": "tuple[][]",
        "internalType": "struct GuardedExecutor.SpendInfo[][]",
        "components": [
          {
            "name": "token",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "period",
            "type": "uint8",
            "internalType": "enum GuardedExecutor.SpendPeriod"
          },
          {
            "name": "limit",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "spent",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lastUpdated",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "currentSpent",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "current",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "executes",
        "type": "bytes32[][]",
        "internalType": "bytes32[][]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "spendInfos",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "results",
        "type": "tuple[]",
        "internalType": "struct GuardedExecutor.SpendInfo[]",
        "components": [
          {
            "name": "token",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "period",
            "type": "uint8",
            "internalType": "enum GuardedExecutor.SpendPeriod"
          },
          {
            "name": "limit",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "spent",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lastUpdated",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "currentSpent",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "current",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "startOfSpendPeriod",
    "inputs": [
      {
        "name": "unixTimestamp",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "period",
        "type": "uint8",
        "internalType": "enum GuardedExecutor.SpendPeriod"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "supportsExecutionMode",
    "inputs": [
      {
        "name": "mode",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "unwrapAndValidateSignature",
    "inputs": [
      {
        "name": "digest",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "isValid",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "keyHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "upgradeProxyDelegation",
    "inputs": [
      {
        "name": "newImplementation",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Authorized",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "key",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct DelegationNew.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum DelegationNew.KeyType"
          },
          {
            "name": "isSuperAdmin",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "publicKey",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CanExecuteSet",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "target",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "fnSel",
        "type": "bytes4",
        "indexed": false,
        "internalType": "bytes4"
      },
      {
        "name": "can",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ImplementationApprovalSet",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "isApproved",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ImplementationCallerApprovalSet",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "caller",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "isApproved",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LabelSet",
    "inputs": [
      {
        "name": "newLabel",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "NonceInvalidated",
    "inputs": [
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Revoked",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SignatureCheckerApprovalSet",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "checker",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "isApproved",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SpendLimitRemoved",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "token",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "period",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum GuardedExecutor.SpendPeriod"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SpendLimitSet",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "token",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "period",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum GuardedExecutor.SpendPeriod"
      },
      {
        "name": "limit",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "BatchOfBatchesDecodingError",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CannotSelfExecute",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ExceededSpendLimit",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ExceedsCapacity",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FnSelectorNotRecognized",
    "inputs": []
  },
  {
    "type": "error",
    "name": "IndexOutOfBounds",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidNonce",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidPREP",
    "inputs": []
  },
  {
    "type": "error",
    "name": "KeyDoesNotExist",
    "inputs": []
  },
  {
    "type": "error",
    "name": "KeyHashIsZero",
    "inputs": []
  },
  {
    "type": "error",
    "name": "KeyTypeCannotBeSuperAdmin",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NewSequenceMustBeLarger",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NoSpendPermissions",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OpDataError",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SuperAdminCanExecuteEverything",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SuperAdminCanSpendAnything",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Unauthorized",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UnauthorizedCall",
    "inputs": [
      {
        "name": "keyHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsupportedExecutionMode",
    "inputs": []
  }
] as const;

export const code = "0x610140604052604051615857380380615857833981016040819052610023916100e7565b306080524660a052606080610072604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526006835265036392e302e360d41b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610114565b5f602082840312156100f7575f5ffd5b81516001600160a01b038116811461010d575f5ffd5b9392505050565b60805160a05160c05160e05161010051610120516156e06101775f395f818161068f015281816116e001528181611d8e01528181611e4d015261483d01525f6131ec01525f6132a601525f61328001525f61323001525f61320d01526156e05ff3fe608060405260043610610280575f3560e01c80637b8e4ecc1161014e578063cebfe336116100c0578063e9ae5c5311610079578063e9ae5c531461087e578063f81d87a714610891578063faba56d8146108b0578063fac750e0146108cf578063fcd4e707146108e3578063ff619c6b1461090b57610287565b8063cebfe336146107ad578063d03c7914146107cc578063dcc09ebf146107eb578063e28250b414610817578063e537b27b14610833578063e5adda711461085257610287565b8063ad07708311610112578063ad077083146106e3578063b70e36f014610702578063b75c7dc614610721578063bc2c554a14610740578063bf5309691461076d578063cb4774c41461078c57610287565b80637b8e4ecc1461064357806384b0196e1461065757806394430fa51461067e5780639e49fbf1146106b1578063a840fe49146106c457610287565b80632f3f30c7116101f2578063598daac4116101ab578063598daac4146105735780635f7c23ab1461059257806360d2f33d146105be5780636c95d5a7146105f15780636fd91454146106055780637656d3041461062457610287565b80632f3f30c7146104b257806335058501146104cc57806336745d10146104e65780633e1b0812146105155780634223b5c214610534578063515c9d6d1461055357610287565b8063164b859911610244578063164b8599146103bf5780631a37ef23146103de5780631a912f3e146103fd57806320606b701461043e5780632081a278146104715780632150c5181461049057610287565b80630cef73b4146102c057806311a86fd6146102fb57806312aaac701461033a578063136a12f7146103665780631626ba7e1461038757610287565b3661028757005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a02821417156102b257806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102cb575f5ffd5b506102df6102da366004614b85565b61092a565b6040805192151583526020830191909152015b60405180910390f35b348015610306575f5ffd5b5061032273323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102f2565b348015610345575f5ffd5b50610359610354366004614bcc565b610b26565b6040516102f29190614c72565b348015610371575f5ffd5b50610385610380366004614ca7565b610c15565b005b348015610392575f5ffd5b506103a66103a1366004614b85565b610d3a565b6040516001600160e01b031990911681526020016102f2565b3480156103ca575f5ffd5b506103856103d9366004614d01565b610da2565b3480156103e9575f5ffd5b506103856103f8366004614d45565b610e69565b348015610408575f5ffd5b506104307f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102f2565b348015610449575f5ffd5b506104307f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b34801561047c575f5ffd5b5061038561048b366004614d6e565b610ec0565b34801561049b575f5ffd5b506104a461100f565b6040516102f2929190614dda565b3480156104bd575f5ffd5b506103a6630707070760e51b81565b3480156104d7575f5ffd5b506103a6631919191960e11b81565b3480156104f1575f5ffd5b50610505610500366004614e47565b611179565b60405190151581526020016102f2565b348015610520575f5ffd5b5061043061052f366004614e85565b6112dd565b34801561053f575f5ffd5b5061035961054e366004614bcc565b611313565b34801561055e575f5ffd5b506104305f51602061568b5f395f51905f5281565b34801561057e575f5ffd5b5061038561058d366004614eab565b61134b565b34801561059d575f5ffd5b506105b16105ac366004614d45565b61149d565b6040516102f29190614eee565b3480156105c9575f5ffd5b506104307f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b3480156105fc575f5ffd5b506105056114b0565b348015610610575f5ffd5b5061043061061f366004614f79565b6114cd565b34801561062f575f5ffd5b5061038561063e366004614fc0565b6115e9565b34801561064e575f5ffd5b506105b161169b565b348015610662575f5ffd5b5061066b6116af565b6040516102f29796959493929190614fe4565b348015610689575f5ffd5b506103227f000000000000000000000000000000000000000000000000000000000000000081565b6103856106bf366004614bcc565b6116d5565b3480156106cf575f5ffd5b506104306106de36600461513f565b611734565b3480156106ee575f5ffd5b506105b16106fd366004614bcc565b61176d565b34801561070d575f5ffd5b5061038561071c366004614bcc565b61177b565b34801561072c575f5ffd5b5061038561073b366004614bcc565b6117e3565b34801561074b575f5ffd5b5061075f61075a3660046151ec565b611838565b6040516102f29291906152b8565b348015610778575f5ffd5b50610385610787366004614e47565b61196f565b348015610797575f5ffd5b506107a0611a13565b6040516102f29190615376565b3480156107b8575f5ffd5b506104306107c736600461513f565b611a27565b3480156107d7575f5ffd5b506105056107e6366004614bcc565b611a8f565b3480156107f6575f5ffd5b5061080a610805366004614bcc565b611ab2565b6040516102f29190615388565b348015610822575f5ffd5b50686d3d4e7fb92a52381454610430565b34801561083e575f5ffd5b5061038561084d36600461539a565b611c76565b34801561085d575f5ffd5b5061087161086c366004614bcc565b611d27565b6040516102f291906153cd565b61038561088c366004614b85565b611d3a565b34801561089c575f5ffd5b506103856108ab3660046153df565b611d66565b3480156108bb575f5ffd5b506104306108ca36600461543a565b611f3e565b3480156108da575f5ffd5b50610430612052565b3480156108ee575f5ffd5b506108f861c1d081565b60405161ffff90911681526020016102f2565b348015610916575f5ffd5b5061050561092536600461545b565b612065565b5f806041831460408414171561095a573061094686868661227f565b6001600160a01b03161491505f9050610b1e565b602183101561096d57505f905080610b1e565b506020198281018381118185180281189385019182013591601f19013560ff161561099e5761099b86612307565b95505b505f6109a982610b26565b805190915064ffffffffff1642811090151516156109ca575f925050610b1e565b5f816020015160028111156109e1576109e1614be3565b03610a3c575f80603f86118735810290602089013502915091505f5f610a20856060015180516020820151604090920151603f90911191820292910290565b91509150610a318a85858585612325565b965050505050610b1c565b600181602001516002811115610a5457610a54614be3565b03610ad957606081810151805160208083015160409384015184518084018d9052855180820385018152601f8c018590049094028101870186529485018a8152603f9490941091820295910293610ad0935f92610ac9928d918d918291018382808284375f920191909152506123be92505050565b85856124a6565b94505050610b1c565b600281602001516002811115610af157610af1614be3565b03610b1c57610b198160600151806020019051810190610b1191906154b2565b8787876125c5565b92505b505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f828152686d3d4e7fb92a52381760205260408120610b66906126a5565b8051909150610b885760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610b9c8383016020015190565b60d881901c855260c881901c915060d01c60ff166002811115610bc157610bc1614be3565b84602001906002811115610bd757610bd7614be3565b90816002811115610bea57610bea614be3565b90525060ff811615156040850152610c0783838151811082025290565b606085015250919392505050565b333014610c34576040516282b42960e81b815260040160405180910390fd5b8380610c5357604051638707510560e01b815260040160405180910390fd5b5f51602061568b5f395f51905f528514610c8e57610c708561270b565b15610c8e57604051630442081560e01b815260040160405180910390fd5b610c98848461276f565b15610cb6576040516303a6f8c760e21b815260040160405180910390fd5b610cd960e084901c606086901b1783610800610cd189612797565b9291906127e6565b50604080518681526001600160a01b03861660208201526001600160e01b0319851681830152831515606082015290517f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e19181900360800190a15050505050565b5f5f5f610d4886868661092a565b90925090508115158115151615610d7e57610d628161270b565b80610d7b5750610d7b33610d758361280f565b9061283e565b91505b81610d8d5763ffffffff610d93565b631626ba7e5b60e01b925050505b9392505050565b333014610dc1576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813610dde686d3d4e7fb92a5238198561283e565b610dfa576040516282b42960e81b815260040160405180910390fd5b610e138383610200610e0b886128e8565b929190612921565b50826001600160a01b0316846001600160a01b03167f22e306b6bdb65906c2b1557fba289ced7fe45decec4c8df8dbc9c21a65ac305284604051610e5b911515815260200190565b60405180910390a350505050565b333014610e88576040516282b42960e81b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c5251905550565b50565b333014610edf576040516282b42960e81b815260040160405180910390fd5b8280610efe57604051638707510560e01b815260040160405180910390fd5b610f078461270b565b15610f255760405163f2fee1e160e01b815260040160405180910390fd5b5f610f2f85612797565b6001600160a01b0385165f908152600282016020526040902060019091019150610f7d846005811115610f6457610f64614be3565b8254600160ff9092169190911b80198216845516151590565b15610f9d575f610f8c8261293c565b03610f9d57610f9b8286612957565b505b610fcc816001015f866005811115610fb757610fb7614be3565b60ff1681526020019081526020015f205f9055565b7fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a27868686604051610fff939291906154cd565b60405180910390a1505050505050565b6060805f61101b612052565b9050806001600160401b038111156110355761103561507a565b60405190808252806020026020018201604052801561108457816020015b604080516080810182525f80825260208083018290529282015260608082015282525f199092019101816110535790505b509250806001600160401b0381111561109f5761109f61507a565b6040519080825280602002602001820160405280156110c8578160200160208202803683370190505b5091505f805b8281101561116e575f6110ef82686d3d4e7fb92a5238135b60030190612a8c565b90505f6110fb82610b26565b805190915064ffffffffff16428110901515161561111a575050611166565b8087858151811061112d5761112d6154f0565b60200260200101819052508186858151811061114b5761114b6154f0565b60209081029190910101528361116081615518565b94505050505b6001016110ce565b508084528252509091565b686d3d4e7fb92a523814545f90686d3d4e7fb92a52381390156111a05760019150506112d7565b365f365f6111ae8888612ad5565b604080518481526001850160051b8101909152939750919550935091505f5b8481101561126f57600581901b860135860180359060208082013591604081013501908101903561125f856112507f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876112318888612b41565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b50505050508060010190506111cd565b505f61128e3061128784805160051b60209091012090565b8635612b52565b905080156020841017156112b55760405163e483bbcb60e01b815260040160405180910390fd5b6001870181905585856112c982825f612b83565b600199505050505050505050505b92915050565b6001600160c01b0381165f908152686d3d4e7fb92a5238156020526040808220549083901b67ffffffffffffffff1916176112d7565b604080516080810182525f80825260208201819052918101919091526060808201526112d761035483686d3d4e7fb92a5238136110e6565b33301461136a576040516282b42960e81b815260040160405180910390fd5b838061138957604051638707510560e01b815260040160405180910390fd5b6113928561270b565b156113b05760405163f2fee1e160e01b815260040160405180910390fd5b5f6113ba86612797565b60010190506113cb81866040613019565b506001600160a01b0385165f90815260018201602052604090206114118560058111156113fa576113fa614be3565b8254600160ff9092169190911b8082178455161590565b505f816001015f87600581111561142a5761142a614be3565b60ff1681526020019081526020015f2090505f61144682613055565b8681529050611455828261309f565b7f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a8989898960405161148a9493929190615530565b60405180910390a1505050505050505050565b60606112d76114ab836128e8565b6130e8565b5f6114c830686d3d4e7fb92a523813600101546131bc565b905090565b5f806114e98460408051828152600190920160051b8201905290565b90505f5b8481101561156657600581901b86013586018035801530021790602080820135916040810135019081019035611556856112507f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876112318888612b41565b50505050508060010190506114ed565b5061c1d060f084901c145f6115c07f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b9050816115d5576115d0816131ea565b6115de565b6115de81613300565b979650505050505050565b333014611608576040516282b42960e81b815260040160405180910390fd5b5f838152686d3d4e7fb92a523817602052604090205460ff1661163e5760405163395ed8c160e21b815260040160405180910390fd5b61164f8282610200610e0b8761280f565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc998360405161168e911515815260200190565b60405180910390a3505050565b60606114c8686d3d4e7fb92a5238196130e8565b600f60f81b6060805f8080836116c3613374565b97989097965046955030945091925090565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461171d576040516282b42960e81b815260040160405180910390fd5b610ebd686d3d4e7fb92a5238135b600201826133b5565b5f6112d78260200151600281111561174e5761174e614be3565b60ff168360600151805190602001205f1c5f9182526020526040902090565b60606112d76114ab8361280f565b33301461179a576040516282b42960e81b815260040160405180910390fd5b6117ad686d3d4e7fb92a523815826133cc565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b333014611802576040516282b42960e81b815260040160405180910390fd5b61180b81613436565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b038111156118545761185461507a565b60405190808252806020026020018201604052801561188757816020015b60608152602001906001900390816118725790505b509250806001600160401b038111156118a2576118a261507a565b6040519080825280602002602001820160405280156118d557816020015b60608152602001906001900390816118c05790505b5091505f5b81811015611966576119038686838181106118f7576118f76154f0565b90506020020135611ab2565b848281518110611915576119156154f0565b6020026020010181905250611941868683818110611935576119356154f0565b90506020020135611d27565b838281518110611953576119536154f0565b60209081029190910101526001016118da565b50509250929050565b33301461198e576040516282b42960e81b815260040160405180910390fd5b6119d682828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f920191909152506119d09250612698915050565b906134a1565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611a0792919061558a565b60405180910390a15050565b60606114c8686d3d4e7fb92a5238136126a5565b5f333014611a47576040516282b42960e81b815260040160405180910390fd5b611a50826134f9565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611a829190614c72565b60405180910390a2919050565b5f6112d76001600160f81b031980841614611aa9846135a2565b15159015151790565b60605f611abe83612797565b6001019050611ad96040518060200160405280606081525090565b5f611ae3836135b4565b90505f5b81811015611c6c575f611afa8583613605565b6001600160a01b0381165f9081526001870160205260408120919250611b1f8261365e565b90505f5b8151811015611c5d575f828281518110611b3f57611b3f6154f0565b602002602001015190505f611b68856001015f8460ff1681526020019081526020015f20613055565b9050611ba56040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166005811115611bba57611bba614be3565b81602001906005811115611bd057611bd0614be3565b90816005811115611be357611be3614be3565b9052506001600160a01b03871681528151604080830191909152820151608082015260208201516060820152611c284260ff851660058111156108ca576108ca614be3565b60c08201819052608082015160608301519111150260a082015280611c4d8b826136b7565b5050505050806001019050611b23565b50505050806001019050611ae7565b5050519392505050565b333014611c95576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813611cb6686d3d4e7fb92a5238198484610200612921565b5081611cdd576001600160a01b0383165f9081526007820160205260409020805460010190555b826001600160a01b03167f31471c9e79dc8535d9341d73e61eaf5e72e4134b3e5b16943305041201581d8883604051611d1a911515815260200190565b60405180910390a2505050565b60606112d7611d3583612797565b613760565b6001600160f81b03198084169003611d5b57611d568282613819565b505050565b611d568383836138b6565b813580830190604081901c602084101715611d7f575f5ffd5b50611df8336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611def30611dc06020860186614d45565b6001600160a01b03161430611ddb6080870160608801614d45565b6001600160a01b0316149015159015151790565b15159015151690565b611e14576040516282b42960e81b815260040160405180910390fd5b30611e256080830160608401614d45565b6001600160a01b031603611e9e575f611e46856102da6101c085018561559d565b5090505f197f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03163103611e7f575060015b80611e9c576040516282b42960e81b815260040160405180910390fd5b505b611ec9611eb160a0830160808401614d45565b611ec36101a084016101808501614d45565b88613938565b841580611eda5750611eda8561270b565b611f36575f611ee886612797565b600181019150611f34906002015f611f0660a0860160808701614d45565b6001600160a01b0316815260208101919091526040015f20611f2e60a0850160808601614d45565b8961395b565b505b505050505050565b5f80826005811115611f5257611f52614be3565b03611f6557603c808404025b90506112d7565b6001826005811115611f7957611f79614be3565b03611f8a57610e1080840402611f5e565b6002826005811115611f9e57611f9e614be3565b03611fb0576201518080840402611f5e565b6003826005811115611fc457611fc4614be3565b03611fea576007600362015180808604918201929092069003620545ff85110202611f5e565b5f5f611ff585613a80565b509092509050600484600581111561200f5761200f614be3565b036120295761202082826001613b2a565b925050506112d7565b600584600581111561203d5761203d614be3565b0361204e5761202082600180613b2a565b5f5ffd5b5f6114c8686d3d4e7fb92a523816613b81565b5f8461207357506001612277565b61207c8561270b565b1561208957506001612277565b631919191960e11b6004831061209d575082355b826120ac5750630707070760e51b5b6120b6858261276f565b156120c4575f915050612277565b5f6120ce87612797565b90506120d981613b81565b15612196576120f460e083901c606088901b175b8290613bcd565b1561210457600192505050612277565b6121176332323232606088901b176120ed565b1561212757600192505050612277565b61214d60e083901c73191919191919191919191919191919191919191960611b176120ed565b1561215d57600192505050612277565b6121867f32323232323232323232323232323232323232320000000000000000323232326120ed565b1561219657600192505050612277565b6121ac5f51602061568b5f395f51905f52612797565b90506121b781613b81565b15612271576121cf60e083901c606088901b176120ed565b156121df57600192505050612277565b6121f26332323232606088901b176120ed565b1561220257600192505050612277565b61222860e083901c73191919191919191919191919191919191919191960611b176120ed565b1561223857600192505050612277565b6122617f32323232323232323232323232323232323232320000000000000000323232326120ed565b1561227157600192505050612277565b5f925050505b949350505050565b5f604051826040811461229a57604181146122c157506122f2565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526122d2565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d6122ff575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d61232057fe5b919050565b5f6040518681528560208201528460408201528360608201528260808201525f5f5260205f60a0836101005afa503d612389576d1ab2e8006fd8b71907bf06a5bdee3b6123895760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa61238957fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6123f36040518060c0016040528060608152602001606081526020015f81526020015f81526020015f81526020015f81525090565b815160c081106124a05760208301818101818251018281108260c0830111171561241f575050506124a0565b808151019250806020820151018181108382111782851084861117171561244957505050506124a0565b828151602083010111838551602087010111171561246a57505050506124a0565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f5f5f6124b588600180613c51565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561259957602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061259957fe5b50505082156125ba576125b78287608001518860a001518888612325565b92505b505095945050505050565b5f6001600160a01b0385161561227757604051853b6126555782604081146125f5576041811461261c575061268f565b60208581013560ff81901c601b0190915285356040526001600160ff1b031660605261262d565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f6060528060405261268f565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b686d3d4e7fb92a52381390565b60405181546020820190600881901c5f8260ff8417146126d357505080825260ff8116601f808211156126f5575b855f5260205f205b8160051c810154828601526020820191508282106126db57505b508084525f920191825250602001604052919050565b5f818152686d3d4e7fb92a52381760205260408120805460ff808216908114801590910260089290921c0217806127555760405163395ed8c160e21b815260040160405180910390fd5b612762825f198301613d42565b60ff161515949350505050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f51602061568b5f395f51905f5283146127bb576127b683613daf565b6127ca565b5f51602061568b5f395f51905f525b68a3bbbebc65eb8804df6009525f908152602990209392505050565b5f826127fb576127f68585613ddc565b612806565b612806858584613eda565b95945050505050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81208190610d9b565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016128795763f5a267f15f526004601cfd5b8261288b5768fbb67fda52d4bfb8bf92505b80546001600160601b0381166128cf5760019250838160601c03156128e057600182015460601c84146128e057600282015460601c84146128e0575b5f92506128e0565b81602052835f5260405f2054151592505b505092915050565b6001600160a01b0381165f908152686d3d4e7fb92a52381a602052604081208054601f5263d4203f8b6004528152603f81208190610d9b565b5f82612931576127f68585612957565b612806858584613019565b5f81545b80156124a057600191820191811901811618612940565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016129925763f5a267f15f526004601cfd5b826129a45768fbb67fda52d4bfb8bf92505b80546001600160601b03811680612a1e5760019350848260601c036129dc5760018301805484556002840180549091555f9055612a83565b84600184015460601c036129fd5760028301805460018501555f9055612a83565b84600284015460601c03612a16575f6002840155612a83565b5f9350612a83565b82602052845f5260405f20805480612a37575050612a83565b60018360011c039250826001820314612a67578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612ab683613b81565b82106112d757604051634e23d03560e01b815260040160405180910390fd5b365f8080612ae38686613ef7565b93509350612af986866040908111913510171590565b15612b3857602085870103866020013580880160208101945080359350828482011182851760401c1715612b345763ba597e7e5f526004601cfd5b5050505b92959194509250565b5f8183604051375060405120919050565b5f82815260a082901c602052604090206001600160a01b0316612b76848284613f8d565b610d9b57505f9392505050565b801580612b945750612b948161270b565b15612ba457611d56838383613fe9565b5f612bae82612797565b6001019050612c1c6040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f612c26836135b4565b90505f5b81811015612c78575f612c3d8583613605565b90506001600160a01b03811615612c6f576040840151612c5d9082614040565b506060840151612c6d905f6136b7565b505b50600101612c2a565b505f5f5b86811015612e3657600581901b880135880180358015300217906020808201359160408101350190810190358215612cbb57612cb883876155df565b95505b6004811015612ccd5750505050612e2e565b813560e01c63a9059cbb819003612d03576040890151612ced9086614040565b50612d01602484013560608b01519061405f565b505b8063ffffffff1663095ea7b303612d4b5760248301355f03612d29575050505050612e2e565b8851612d359086614040565b50612d49600484013560208b01519061405f565b505b8063ffffffff166387517c4503612dc3576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba314612d85575050505050612e2e565b60448301355f03612d9a575050505050612e2e565b612dad600484013560808b01519061405f565b50612dc1602484013560a08b01519061405f565b505b8063ffffffff1663598daac403612e28576001600160a01b0385163014612dee575050505050612e2e565b8a600484013514612e03575050505050612e2e565b612e16602484013560408b01519061405f565b506060890151612e26905f6136b7565b505b50505050505b600101612c7c565b50604083015151606084015151612e4d9190614075565b5f612e80612e5e8560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b60408501515151811015612ecc57604085015151600582901b0160200151612ec282612eb0833061414b565b85919060059190911b82016020015290565b5050600101612e84565b50612ed8888888613fe9565b5f8080526001860160205260408120612ef1918461395b565b5f5b60408501515151811015612f7f57604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b018352939093206060890151518301820151928601909101519091612f759183918591612f709190612f6590612f5c893061414b565b80821191030290565b808218908210021890565b61395b565b5050600101612ef3565b505f5b84515151811015612fc457845151600582901b0160200151612fbb81612fb584896020015161413b90919063ffffffff16565b5f614175565b50600101612f82565b505f5b6080850151515181101561300e57608085015151600582901b016020015161300581613000848960a0015161413b90919063ffffffff16565b6141bf565b50600101612fc7565b505050505050505050565b5f613024848461421a565b90508015610d9b5781613036856135b4565b1115610d9b5760405163155176b960e11b815260040160405180910390fd5b61307660405180606001604052805f81526020015f81526020015f81525090565b5f613080836126a5565b905080515f146124a0575f61309482614375565b602001949350505050565b604080518251602080830191909152830151818301529082015160608201526130e49083906130df906080016040516020818303038152906040526144a4565b6134a1565b5050565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c925083831415830281528161317657821561317157600191508185015460601c92508215613171578284141590920260208301525060028381015460601c918215613171576003915083831415830260408201525b6131a6565b600191821c915b828110156131a4578581015460601c858114158102600583901b840152935060010161317d565b505b8186528160051b81016040525050505050919050565b5f5f6131c7846145c0565b905082156001600160a01b03821615171580156122775750612277848483613f8d565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f00000000000000000000000000000000000000000000000000000000000000004614166132dd5750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f5f5f61330b613374565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526006835265036392e302e360d41b9083015291565b5f5f6133c184846145de565b600101905550505050565b604081811c5f90815260208490522080546001600160401b0383161015613406576040516312ee5c9360e01b815260040160405180910390fd5b61343061342a836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f818152686d3d4e7fb92a52381760209081526040808320839055686d3d4e7fb92a523818909152902080546001019055686d3d4e7fb92a523813613484686d3d4e7fb92a52381683613ddc565b6130e45760405163395ed8c160e21b815260040160405180910390fd5b80518060081b60ff175f60fe83116134ca575050601f8281015160081b821790808311156134f1575b60208401855f5260205f205b828201518360051c8201556020830192508483106134d65750505b509092555050565b5f81604001511561352e576135118260200151614624565b61352e576040516321b9b33960e21b815260040160405180910390fd5b61353782611734565b90505f686d3d4e7fb92a52381360608401518451602080870151604080890151905195965061358e9561356c959493016155f2565b60408051601f198184030181529181525f8581526004850160205220906134a1565b61359b6003820183614640565b5050919050565b5f6135ac82614752565b151592915050565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c15176135fd576001935083830154156135fd576002935083830154156135fd57600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf82141582029150613638846135b4565b831061365757604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b80156136a15761ffff8116613686576010918201911c61366b565b8183526020600582901b16909201916001918201911c61366b565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c55360208403518181061582820402905080831061374f5782811781018115826020018701604051181761371b57828102601f19870152850160200160405261374f565b602060405101816020018101604052808a52601f19855b888101518382015281018061373257509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf9060208401816137d957835480156137d3578084141502815260018481015490925080156137d3578084141502602082015260028481015490925080156137d3576003925083811415810260408301525b50613804565b8160011c91505f5b8281101561380257848101548481141502600582901b8301526001016137e1565b505b8185528160051b810160405250505050919050565b686d3d4e7fb92a523813823560601c601483811881851002188085019080851190850302613850686d3d4e7fb92a5238198461283e565b61386c576040516282b42960e81b815260040160405180910390fd5b33301461389c5761388033610d75856128e8565b61389c576040516282b42960e81b815260040160405180910390fd5b604051818382375f388383875af4611f34573d5f823e3d81fd5b5f6138c084614752565b9050806003036138db576138d584848461479b565b50505050565b365f365f846138f157637f1812755f526004601cfd5b5085358087016020810194503592505f9060401160028614111561391f575050602080860135860190810190355b61392e88888887878787614833565b5050505050505050565b6001600160a01b03831661395057611d56828261498f565b611d568383836149a8565b8061396557505050565b5f61396f8461365e565b905080515f0361399257604051635ee7e5b160e01b815260040160405180910390fd5b5f5b8151811015613a79575f8282815181106139b0576139b06154f0565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f6139dd82613055565b90505f6139f9428560ff1660058111156108ca576108ca614be3565b90508082604001511015613a1557604082018190525f60208301525b815f01518783602001818151613a2b91906155df565b9150818152501115613a605760405163482a648960e11b81526001600160a01b03891660048201526024015b60405180910390fd5b613a6a838361309f565b50505050806001019050613994565b5050505050565b5f8080613b1d613a936201518086615641565b5f5f5f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c92508061359b5781545f93501561359b5760019250828201541561359b5760029250828201541561359b575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613bfa5763f5a267f15f526004601cfd5b82613c0c5768fbb67fda52d4bfb8bf92505b801954613c3d57805460019250831461365757600181015483146136575760028101548314613657575f9150613657565b602052505f90815260409020541515919050565b6060835180156122ff576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613ccc579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f82548060ff821714613d8a57601e8311613d615780831a9150613657565b8060ff168311613d8557835f52601f83038060051c60205f200154601f82161a9250505b613657565b8060081c831161365757835f528260051c60205f200154601f84161a91505092915050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81206112d7565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613e095763f5a267f15f526004601cfd5b82613e1b5768fbb67fda52d4bfb8bf92505b80195480613e7c576001925083825403613e485760018201805483556002830180549091555f90556128e0565b83600183015403613e665760028201805460018401555f90556128e0565b836002830154036128c7575f60028301556128e0565b81602052835f5260405f20805480613e955750506128e0565b60018360011c039250826001820314613ebf57828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f613ee58484614640565b90508015610d9b578161303685613b81565b365f833580850160208587010360208201945081359350808460051b8301118360401c1715613f2d5763ba597e7e5f526004601cfd5b8315613f83578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c1715613f7a5763ba597e7e5f526004601cfd5b50505082613f37575b5050509250929050565b5f82815260208082206080909152601f8390526305d78094600b526019602720613fdf6001600160a01b03871680151590613fcb84601b8a886149e8565b6001600160a01b0316149015159015151690565b9695505050505050565b5f82613ff55750505050565b600581901b84013584018035801530021790602080820135916040810135019081019035614026848484848a614a22565b50505050838390508160010191508103613ff55750505050565b604080516060815290819052610d9b83836001600160a01b03166136b7565b604080516060815290819052610d9b83836136b7565b604051815183511461409357634e487b715f5260326020526024601cfd5b825161409e57505050565b5f5f6140a985614a60565b6140b285614a60565b915091506140bf85614a8f565b6140c885614ae4565b848403601f196020870187518752875160051b3684830137845160051b5b8086015181860151835b82815114614100576020016140f0565b86018051820180825282111561412257634e487b715f5260116020526024601cfd5b5050508201806140e65750505050826040525050505050565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f5114166141b557803d853b1517106141b557633e3f8f735f526004601cfd5b505f603452505050565b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af1611d56576396b3de235f526004601cfd5b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016142555763f5a267f15f526004601cfd5b826142675768fbb67fda52d4bfb8bf92505b80546001600160601b0381168260205280614329578160601c80614295578560601b84556001945050612a83565b8581036142a25750612a83565b600184015460601c806142c3578660601b6001860155600195505050612a83565b8681036142d1575050612a83565b600285015460601c806142f3578760601b600287015560019650505050612a83565b87810361430257505050612a83565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f20805461436b57600191821c808301825591945081614357578560601b600317845550612a83565b8560601b8285015582600201845550612a83565b5050505092915050565b60606143cd565b6fffffffffffffffffffffffffffffffff811160071b81811c6001600160401b031060061b1781811c63ffffffff1060051b1781811c61ffff1060041b1790811c60ff1060039190911c17601f1890565b8151156123205760405190506004820180518351846020010160ff8115190460071b196020850183198552866020015b8051805f1a61445657600190811a0160808111614436578036843780830192506002820191508482106144305750614486565b506143fd565b5f198352918201607f190191600291909101908482106144305750614486565b80835283811684011783171961446b8161437c565b901501828286038281118184180218019250018381106143fd575b509290935250601f198382030183525f815260200160405250919050565b6040518151602082019083015b80841461459f576001840193508351601f1a8061453e575b60208501518061450d5785830360208181189082110218607f839003818111818318021896870196928301929050601f811161450657505061452e565b50506144c9565b6145168161437c565b90508583038181118183180218958601959190910190505b60f01b82526002909101906144b1565b60ff81036145905760208086015119801561455f5761455c8161437c565b91505b508583038181118282180218601f81811890821102186080811760f01b8552959095019450506002909101906144b1565b808353506001820191506144b1565b50600482018051199052601f198282030182525f8152602001604052919050565b5f60205f5f843c5f5160f01c61ef011460035160601c029050919050565b604081811c5f90815260208490522080546001600160401b0380841682149082101661461d57604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f8082600281111561463857614638614be3565b141592915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf830361466d5763f5a267f15f526004601cfd5b8261467f5768fbb67fda52d4bfb8bf92505b80195481602052806147235781548061469f5784835560019350506128e0565b8481036146ac57506128e0565b6001830154806146c7578560018501556001945050506128e0565b8581036146d55750506128e0565b6002840154806146f157866002860155600195505050506128e0565b868103614700575050506128e0565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f208054612a8357600191821c8381018690558083019182905590821b82178319559092506128e0565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c17156147e057633995943b5f526004601cfd5b505f5b838114611f3457365f8260051b850135808601602081019350803592505084828401118160401c171561481d57633995943b5f526004601cfd5b50614829898383611d3a565b50506001016147e3565b6001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016330361489557602081146148845760405163438e981560e11b815260040160405180910390fd5b61489084848435612b83565b611f34565b806148c4573330146148b9576040516282b42960e81b815260040160405180910390fd5b61489084845f612b83565b60208110156148e65760405163438e981560e11b815260040160405180910390fd5b81356148fa686d3d4e7fb92a52381361172b565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f5f61495761493d8888866114cd565b60208087108188180218808801908088039088110261092a565b9150915081614978576040516282b42960e81b815260040160405180910390fd5b614983878783612b83565b50505050505050505050565b5f385f3884865af16130e45763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f5114166141b557803d853b1517106141b5576390b8ec185f526004601cfd5b5f604051855f5260ff851660205283604052826060526020604060805f60015afa505f6060523d6060185191508060405250949350505050565b614a2e81868585612065565b614a53578085848460405163f78c1b5360e01b8152600401613a579493929190615660565b613a798585858585614b2d565b604051815160051b8101602001818084035b808201518252816020019150828203614a72575060405250919050565b80515f82528060051b8201601f19602084015b602001828111614add5780518282018051828111614ac257505050614aa2565b5b602082015283018051828111614ac3575060200152614aa2565b5050509052565b6002815110610ebd576020810160408201600183510160051b83015b8151835114614b1457602083019250815183525b602082019150808203614b0057505081900360051c9052565b604051828482375f388483888a5af1611f36573d5f823e3d81fd5b5f5f83601f840112614b58575f5ffd5b5081356001600160401b03811115614b6e575f5ffd5b60208301915083602082850101111561461d575f5ffd5b5f5f5f60408486031215614b97575f5ffd5b8335925060208401356001600160401b03811115614bb3575f5ffd5b614bbf86828701614b48565b9497909650939450505050565b5f60208284031215614bdc575f5ffd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f602082015160038110614c4657614c46614be3565b806020850152506040820151151560408401526060820151608060608501526122776080850182614bf7565b602081525f610d9b6020830184614c25565b6001600160a01b0381168114610ebd575f5ffd5b80358015158114612320575f5ffd5b5f5f5f5f60808587031215614cba575f5ffd5b843593506020850135614ccc81614c84565b925060408501356001600160e01b031981168114614ce8575f5ffd5b9150614cf660608601614c98565b905092959194509250565b5f5f5f60608486031215614d13575f5ffd5b8335614d1e81614c84565b92506020840135614d2e81614c84565b9150614d3c60408501614c98565b90509250925092565b5f60208284031215614d55575f5ffd5b8135610d9b81614c84565b803560068110612320575f5ffd5b5f5f5f60608486031215614d80575f5ffd5b833592506020840135614d9281614c84565b9150614d3c60408501614d60565b5f8151808452602084019350602083015f5b82811015614dd0578151865260209586019590910190600101614db2565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b82811015614e3157605f19878603018452614e1c858351614c25565b94506020938401939190910190600101614e00565b5050505082810360208401526128068185614da0565b5f5f60208385031215614e58575f5ffd5b82356001600160401b03811115614e6d575f5ffd5b614e7985828601614b48565b90969095509350505050565b5f60208284031215614e95575f5ffd5b81356001600160c01b0381168114610d9b575f5ffd5b5f5f5f5f60808587031215614ebe575f5ffd5b843593506020850135614ed081614c84565b9250614ede60408601614d60565b9396929550929360600135925050565b602080825282518282018190525f918401906040840190835b81811015614f2e5783516001600160a01b0316835260209384019390920191600101614f07565b509095945050505050565b5f5f83601f840112614f49575f5ffd5b5081356001600160401b03811115614f5f575f5ffd5b6020830191508360208260051b850101111561461d575f5ffd5b5f5f5f60408486031215614f8b575f5ffd5b83356001600160401b03811115614fa0575f5ffd5b614fac86828701614f39565b909790965060209590950135949350505050565b5f5f5f60608486031215614fd2575f5ffd5b833592506020840135614d2e81614c84565b60ff60f81b8816815260e060208201525f61500260e0830189614bf7565b82810360408401526150148189614bf7565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b8181101561506957835183526020938401939092019160010161504b565b50909b9a5050505050505050505050565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b03811182821017156150b0576150b061507a565b60405290565b5f82601f8301126150c5575f5ffd5b81356001600160401b038111156150de576150de61507a565b604051601f8201601f19908116603f011681016001600160401b038111828210171561510c5761510c61507a565b604052818152838201602001851015615123575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f6020828403121561514f575f5ffd5b81356001600160401b03811115615164575f5ffd5b820160808185031215615175575f5ffd5b61517d61508e565b813564ffffffffff81168114615191575f5ffd5b81526020820135600381106151a4575f5ffd5b60208201526151b560408301614c98565b604082015260608201356001600160401b038111156151d2575f5ffd5b6151de868285016150b6565b606083015250949350505050565b5f5f602083850312156151fd575f5ffd5b82356001600160401b03811115615212575f5ffd5b614e7985828601614f39565b6006811061522e5761522e614be3565b9052565b5f8151808452602084019350602083015f5b82811015614dd057815180516001600160a01b031687526020808201515f9161526f908a018261521e565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e09095019460209190910190600101615244565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561530f57605f198786030184526152fa858351615232565b945060209384019391909101906001016152de565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b8381101561536857601f19868403018552615352838351614da0565b6020958601959093509190910190600101615336565b509098975050505050505050565b602081525f610d9b6020830184614bf7565b602081525f610d9b6020830184615232565b5f5f604083850312156153ab575f5ffd5b82356153b681614c84565b91506153c460208401614c98565b90509250929050565b602081525f610d9b6020830184614da0565b5f5f5f5f5f608086880312156153f3575f5ffd5b85359450602086013593506040860135925060608601356001600160401b0381111561541d575f5ffd5b61542988828901614b48565b969995985093965092949392505050565b5f5f6040838503121561544b575f5ffd5b823591506153c460208401614d60565b5f5f5f5f6060858703121561546e575f5ffd5b84359350602085013561548081614c84565b925060408501356001600160401b0381111561549a575f5ffd5b6154a687828801614b48565b95989497509550505050565b5f602082840312156154c2575f5ffd5b8151610d9b81614c84565b8381526001600160a01b038316602082015260608101612277604083018461521e565b634e487b7160e01b5f52603260045260245ffd5b634e487b7160e01b5f52601160045260245ffd5b5f6001820161552957615529615504565b5060010190565b8481526001600160a01b038416602082015260808101615553604083018561521e565b82606083015295945050505050565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f612277602083018486615562565b5f5f8335601e198436030181126155b2575f5ffd5b8301803591506001600160401b038211156155cb575f5ffd5b60200191503681900382131561461d575f5ffd5b808201808211156112d7576112d7615504565b5f85518060208801845e60d886901b6001600160d81b0319169083019081526003851061562157615621614be3565b60f894851b600582015292151590931b6006830152506007019392505050565b5f8261565b57634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f90613fdf908301848661556256fe3232323232323232323232323232323232323232323232323232323232323232a26469706673582212208777e1d8f9a17b8bd7f81ef6bf8453b2f3ee447f86be7133626abaffab6c776864736f6c634300081d0033" as const;


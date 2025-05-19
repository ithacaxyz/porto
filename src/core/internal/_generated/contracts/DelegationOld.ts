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
        "internalType": "struct DelegationOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum DelegationOld.KeyType"
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
        "internalType": "struct DelegationOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum DelegationOld.KeyType"
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
        "internalType": "struct DelegationOld.Key[]",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum DelegationOld.KeyType"
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
        "internalType": "struct DelegationOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum DelegationOld.KeyType"
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
        "internalType": "struct DelegationOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum DelegationOld.KeyType"
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
    "name": "upgradeHook",
    "inputs": [
      {
        "name": "previousVersion",
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
    "stateMutability": "nonpayable"
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
        "internalType": "struct DelegationOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum DelegationOld.KeyType"
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

export const code = "0x610140604052604051615b00380380615b00833981016040819052610023916100e6565b306080524660a052606080610071604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610113565b5f602082840312156100f6575f5ffd5b81516001600160a01b038116811461010c575f5ffd5b9392505050565b60805160a05160c05160e051610100516101205161598361017d5f395f81816106b901528181610960015281816118fb01528181611fac015281816120700152614a8d01525f61347d01525f61353701525f61351101525f6134c101525f61349e01526159835ff3fe60806040526004361061028b575f3560e01c80637656d30411610159578063cebfe336116100c0578063e9ae5c5311610079578063e9ae5c53146108a8578063f81d87a7146108bb578063faba56d8146108da578063fac750e0146108f9578063fcd4e7071461090d578063ff619c6b1461093557610292565b8063cebfe336146107d7578063d03c7914146107f6578063dcc09ebf14610815578063e28250b414610841578063e537b27b1461085d578063e5adda711461087c57610292565b8063ad07708311610112578063ad0770831461070d578063b70e36f01461072c578063b75c7dc61461074b578063bc2c554a1461076a578063bf53096914610797578063cb4774c4146107b657610292565b80637656d3041461064e5780637b8e4ecc1461066d57806384b0196e1461068157806394430fa5146106a85780639e49fbf1146106db578063a840fe49146106ee57610292565b80632150c518116101fd578063515c9d6d116101b6578063515c9d6d1461057d578063598daac41461059d5780635f7c23ab146105bc57806360d2f33d146105e85780636c95d5a71461061b5780636fd914541461062f57610292565b80632150c518146104ca5780632f3f30c7146104ec578063350585011461050657806336745d10146105205780633e1b08121461053f5780634223b5c21461055e57610292565b8063164b85991161024f578063164b8599146103ca57806317e69ab8146103e95780631a37ef23146104185780631a912f3e1461043757806320606b70146104785780632081a278146104ab57610292565b80630cef73b4146102cb57806311a86fd61461030657806312aaac7014610345578063136a12f7146103715780631626ba7e1461039257610292565b3661029257005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a02821417156102bd57806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102d6575f5ffd5b506102ea6102e5366004614dd5565b610954565b6040805192151583526020830191909152015b60405180910390f35b348015610311575f5ffd5b5061032d73323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102fd565b348015610350575f5ffd5b5061036461035f366004614e1c565b610ba2565b6040516102fd9190614ec2565b34801561037c575f5ffd5b5061039061038b366004614f00565b610c91565b005b34801561039d575f5ffd5b506103b16103ac366004614dd5565b610db6565b6040516001600160e01b031990911681526020016102fd565b3480156103d5575f5ffd5b506103906103e4366004614f5c565b610e1e565b3480156103f4575f5ffd5b50610408610403366004614e1c565b610ee5565b60405190151581526020016102fd565b348015610423575f5ffd5b50610390610432366004614fa4565b610fac565b348015610442575f5ffd5b5061046a7f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102fd565b348015610483575f5ffd5b5061046a7f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b3480156104b6575f5ffd5b506103906104c5366004614fcd565b6110db565b3480156104d5575f5ffd5b506104de61122a565b6040516102fd929190615042565b3480156104f7575f5ffd5b506103b1630707070760e51b81565b348015610511575f5ffd5b506103b1631919191960e11b81565b34801561052b575f5ffd5b5061040861053a3660046150af565b611394565b34801561054a575f5ffd5b5061046a6105593660046150ed565b6114f8565b348015610569575f5ffd5b50610364610578366004614e1c565b61152e565b348015610588575f5ffd5b5061046a5f51602061592e5f395f51905f5281565b3480156105a8575f5ffd5b506103906105b7366004615113565b611566565b3480156105c7575f5ffd5b506105db6105d6366004614fa4565b6116b8565b6040516102fd9190615156565b3480156105f3575f5ffd5b5061046a7f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b348015610626575f5ffd5b506104086116cb565b34801561063a575f5ffd5b5061046a6106493660046151e1565b6116e8565b348015610659575f5ffd5b50610390610668366004615228565b611804565b348015610678575f5ffd5b506105db6118b6565b34801561068c575f5ffd5b506106956118ca565b6040516102fd979695949392919061524c565b3480156106b3575f5ffd5b5061032d7f000000000000000000000000000000000000000000000000000000000000000081565b6103906106e9366004614e1c565b6118f0565b3480156106f9575f5ffd5b5061046a6107083660046153a7565b611952565b348015610718575f5ffd5b506105db610727366004614e1c565b61198b565b348015610737575f5ffd5b50610390610746366004614e1c565b611999565b348015610756575f5ffd5b50610390610765366004614e1c565b611a01565b348015610775575f5ffd5b50610789610784366004615454565b611a56565b6040516102fd929190615520565b3480156107a2575f5ffd5b506103906107b13660046150af565b611b8d565b3480156107c1575f5ffd5b506107ca611c31565b6040516102fd91906155de565b3480156107e2575f5ffd5b5061046a6107f13660046153a7565b611c45565b348015610801575f5ffd5b50610408610810366004614e1c565b611cad565b348015610820575f5ffd5b5061083461082f366004614e1c565b611cd0565b6040516102fd91906155f0565b34801561084c575f5ffd5b50686d3d4e7fb92a5238145461046a565b348015610868575f5ffd5b50610390610877366004615602565b611e94565b348015610887575f5ffd5b5061089b610896366004614e1c565b611f45565b6040516102fd9190615639565b6103906108b6366004614dd5565b611f58565b3480156108c6575f5ffd5b506103906108d536600461564b565b611f84565b3480156108e5575f5ffd5b5061046a6108f43660046156a6565b612163565b348015610904575f5ffd5b5061046a612277565b348015610918575f5ffd5b5061092261c1d081565b60405161ffff90911681526020016102fd565b348015610940575f5ffd5b5061040861094f3660046156d0565b61228a565b63060f052a5f908152807f00000000000000000000000000000000000000000000000000000000000000006020826004601c845afa80155f5117156109a057639e87fac85f526004601cfd5b50604184146040851417156109d157306109bb8787876124a4565b6001600160a01b03161492505f9150610b9a9050565b60218410156109e657505f9150819050610b9a565b60201984810185811181871802811895870191820135935090601f19013560ff1615610a1857610a158761252c565b96505b505f610a2383610ba2565b805190915064ffffffffff164281109015151615610a45575f93505050610b9a565b5f81602001516002811115610a5c57610a5c614e33565b03610ab7575f80603f8711883581029060208a013502915091505f5f610a9b856060015180516020820151604090920151603f90911191820292910290565b91509150610aac8b85858585612545565b975050505050610b97565b600181602001516002811115610acf57610acf614e33565b03610b5457606081810151805160208083015160409384015184518084018e9052855180820385018152601f8d018590049094028101870186529485018b8152603f9490941091820295910293610b4b935f92610b44928e918e918291018382808284375f920191909152506125de92505050565b85856126c6565b95505050610b97565b600281602001516002811115610b6c57610b6c614e33565b03610b9757610b948160600151806020019051810190610b8c9190615727565b8888886127e5565b93505b50505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f828152686d3d4e7fb92a52381760205260408120610be2906128c5565b8051909150610c045760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610c188383016020015190565b60d881901c855260c881901c915060d01c60ff166002811115610c3d57610c3d614e33565b84602001906002811115610c5357610c53614e33565b90816002811115610c6657610c66614e33565b90525060ff811615156040850152610c8383838151811082025290565b606085015250919392505050565b333014610cb0576040516282b42960e81b815260040160405180910390fd5b8380610ccf57604051638707510560e01b815260040160405180910390fd5b5f51602061592e5f395f51905f528514610d0a57610cec8561292b565b15610d0a57604051630442081560e01b815260040160405180910390fd5b610d14848461298f565b15610d32576040516303a6f8c760e21b815260040160405180910390fd5b610d5560e084901c606086901b1783610800610d4d896129b7565b929190612a06565b50604080518681526001600160a01b03861660208201526001600160e01b0319851681830152831515606082015290517f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e19181900360800190a15050505050565b5f5f5f610dc4868686610954565b90925090508115158115151615610dfa57610dde8161292b565b80610df75750610df733610df183612a2f565b90612a5e565b91505b81610e095763ffffffff610e0f565b631626ba7e5b60e01b925050505b9392505050565b333014610e3d576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813610e5a686d3d4e7fb92a52381985612a5e565b610e76576040516282b42960e81b815260040160405180910390fd5b610e8f8383610200610e8788612b08565b929190612b41565b50826001600160a01b0316846001600160a01b03167f22e306b6bdb65906c2b1557fba289ced7fe45decec4c8df8dbc9c21a65ac305284604051610ed7911515815260200190565b60405180910390a350505050565b5f333014610f05576040516282b42960e81b815260040160405180910390fd5b5f610f3e610f3a610f3760017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615756565b90565b5c90565b90507fb25b31941c18d9284933e01fdeb815f311ca97e440b9178abfddc11b69baaa648114610f6b575f5ffd5b610fa1610f9c610f3760017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615756565b612b5c565b60019150505b919050565b333014610fcb576040516282b42960e81b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c525190555f611006612b62565b915061106290507fb25b31941c18d9284933e01fdeb815f311ca97e440b9178abfddc11b69baaa6461105c610f3760017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615756565b90612ba2565b306317e69ab861107183612ba9565b6040518263ffffffff1660e01b815260040161108f91815260200190565b6020604051808303815f875af11580156110ab573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906110cf9190615769565b6110d7575f5ffd5b5050565b3330146110fa576040516282b42960e81b815260040160405180910390fd5b828061111957604051638707510560e01b815260040160405180910390fd5b6111228461292b565b156111405760405163f2fee1e160e01b815260040160405180910390fd5b5f61114a856129b7565b6001600160a01b0385165f90815260028201602052604090206001909101915061119884600581111561117f5761117f614e33565b8254600160ff9092169190911b80198216845516151590565b156111b8575f6111a782612bd1565b036111b8576111b68286612bec565b505b6111e7816001015f8660058111156111d2576111d2614e33565b60ff1681526020019081526020015f205f9055565b7fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a2786868660405161121a93929190615784565b60405180910390a1505050505050565b6060805f611236612277565b9050806001600160401b03811115611250576112506152e2565b60405190808252806020026020018201604052801561129f57816020015b604080516080810182525f80825260208083018290529282015260608082015282525f1990920191018161126e5790505b509250806001600160401b038111156112ba576112ba6152e2565b6040519080825280602002602001820160405280156112e3578160200160208202803683370190505b5091505f805b82811015611389575f61130a82686d3d4e7fb92a5238135b60030190612d21565b90505f61131682610ba2565b805190915064ffffffffff164281109015151615611335575050611381565b80878581518110611348576113486157a7565b602002602001018190525081868581518110611366576113666157a7565b60209081029190910101528361137b816157bb565b94505050505b6001016112e9565b508084528252509091565b686d3d4e7fb92a523814545f90686d3d4e7fb92a52381390156113bb5760019150506114f2565b365f365f6113c98888612d6a565b604080518481526001850160051b8101909152939750919550935091505f5b8481101561148a57600581901b860135860180359060208082013591604081013501908101903561147a8561146b7f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b0388168761144c8888612dd6565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b50505050508060010190506113e8565b505f6114a9306114a284805160051b60209091012090565b8635612de7565b905080156020841017156114d05760405163e483bbcb60e01b815260040160405180910390fd5b6001870181905585856114e482825f612e18565b600199505050505050505050505b92915050565b6001600160c01b0381165f908152686d3d4e7fb92a5238156020526040808220549083901b67ffffffffffffffff1916176114f2565b604080516080810182525f80825260208201819052918101919091526060808201526114f261035f83686d3d4e7fb92a523813611301565b333014611585576040516282b42960e81b815260040160405180910390fd5b83806115a457604051638707510560e01b815260040160405180910390fd5b6115ad8561292b565b156115cb5760405163f2fee1e160e01b815260040160405180910390fd5b5f6115d5866129b7565b60010190506115e6818660406132ae565b506001600160a01b0385165f908152600182016020526040902061162c85600581111561161557611615614e33565b8254600160ff9092169190911b8082178455161590565b505f816001015f87600581111561164557611645614e33565b60ff1681526020019081526020015f2090505f611661826132ea565b86815290506116708282613334565b7f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a898989896040516116a594939291906157d3565b60405180910390a1505050505050505050565b60606114f26116c683612b08565b613379565b5f6116e330686d3d4e7fb92a5238136001015461344d565b905090565b5f806117048460408051828152600190920160051b8201905290565b90505f5b8481101561178157600581901b860135860180358015300217906020808201359160408101350190810190356117718561146b7f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b0388168761144c8888612dd6565b5050505050806001019050611708565b5061c1d060f084901c145f6117db7f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b9050816117f0576117eb8161347b565b6117f9565b6117f981613591565b979650505050505050565b333014611823576040516282b42960e81b815260040160405180910390fd5b5f838152686d3d4e7fb92a523817602052604090205460ff166118595760405163395ed8c160e21b815260040160405180910390fd5b61186a8282610200610e8787612a2f565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc99836040516118a9911515815260200190565b60405180910390a3505050565b60606116e3686d3d4e7fb92a523819613379565b600f60f81b6060805f8080836118de612b62565b97989097965046955030945091925090565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611938576040516282b42960e81b815260040160405180910390fd5b61194f686d3d4e7fb92a5238135b60020182613605565b50565b5f6114f28260200151600281111561196c5761196c614e33565b60ff168360600151805190602001205f1c5f9182526020526040902090565b60606114f26116c683612a2f565b3330146119b8576040516282b42960e81b815260040160405180910390fd5b6119cb686d3d4e7fb92a5238158261361c565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b333014611a20576040516282b42960e81b815260040160405180910390fd5b611a2981613686565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b03811115611a7257611a726152e2565b604051908082528060200260200182016040528015611aa557816020015b6060815260200190600190039081611a905790505b509250806001600160401b03811115611ac057611ac06152e2565b604051908082528060200260200182016040528015611af357816020015b6060815260200190600190039081611ade5790505b5091505f5b81811015611b8457611b21868683818110611b1557611b156157a7565b90506020020135611cd0565b848281518110611b3357611b336157a7565b6020026020010181905250611b5f868683818110611b5357611b536157a7565b90506020020135611f45565b838281518110611b7157611b716157a7565b6020908102919091010152600101611af8565b50509250929050565b333014611bac576040516282b42960e81b815260040160405180910390fd5b611bf482828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250611bee92506128b8915050565b906136f1565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611c2592919061582d565b60405180910390a15050565b60606116e3686d3d4e7fb92a5238136128c5565b5f333014611c65576040516282b42960e81b815260040160405180910390fd5b611c6e82613749565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611ca09190614ec2565b60405180910390a2919050565b5f6114f26001600160f81b031980841614611cc7846137f2565b15159015151790565b60605f611cdc836129b7565b6001019050611cf76040518060200160405280606081525090565b5f611d0183613804565b90505f5b81811015611e8a575f611d188583613855565b6001600160a01b0381165f9081526001870160205260408120919250611d3d826138ae565b90505f5b8151811015611e7b575f828281518110611d5d57611d5d6157a7565b602002602001015190505f611d86856001015f8460ff1681526020019081526020015f206132ea565b9050611dc36040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166005811115611dd857611dd8614e33565b81602001906005811115611dee57611dee614e33565b90816005811115611e0157611e01614e33565b9052506001600160a01b03871681528151604080830191909152820151608082015260208201516060820152611e464260ff851660058111156108f4576108f4614e33565b60c08201819052608082015160608301519111150260a082015280611e6b8b82613907565b5050505050806001019050611d41565b50505050806001019050611d05565b5050519392505050565b333014611eb3576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813611ed4686d3d4e7fb92a5238198484610200612b41565b5081611efb576001600160a01b0383165f9081526007820160205260409020805460010190555b826001600160a01b03167f31471c9e79dc8535d9341d73e61eaf5e72e4134b3e5b16943305041201581d8883604051611f38911515815260200190565b60405180910390a2505050565b60606114f2611f53836129b7565b6139b0565b6001600160f81b03198084169003611f7957611f748282613a69565b505050565b611f74838383613b06565b813580830190604081901c602084101715611f9d575f5ffd5b50612016336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461200d30611fde6020860186614fa4565b6001600160a01b03161430611ff96080870160608801614fa4565b6001600160a01b0316149015159015151790565b15159015151690565b612032576040516282b42960e81b815260040160405180910390fd5b306120436080830160608401614fa4565b6001600160a01b0316036120c3575f80612065866102e56101c0860186615840565b915091508096505f197f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031631036120a357600191505b816120c0576040516282b42960e81b815260040160405180910390fd5b50505b6120ee6120d660a0830160808401614fa4565b6120e86101a084016101808501614fa4565b88613b88565b8415806120ff57506120ff8561292b565b61215b575f61210d866129b7565b600181019150612159906002015f61212b60a0860160808701614fa4565b6001600160a01b0316815260208101919091526040015f2061215360a0850160808601614fa4565b89613bab565b505b505050505050565b5f8082600581111561217757612177614e33565b0361218a57603c808404025b90506114f2565b600182600581111561219e5761219e614e33565b036121af57610e1080840402612183565b60028260058111156121c3576121c3614e33565b036121d5576201518080840402612183565b60038260058111156121e9576121e9614e33565b0361220f576007600362015180808604918201929092069003620545ff85110202612183565b5f5f61221a85613cd0565b509092509050600484600581111561223457612234614e33565b0361224e5761224582826001613d7a565b925050506114f2565b600584600581111561226257612262614e33565b036122735761224582600180613d7a565b5f5ffd5b5f6116e3686d3d4e7fb92a523816613dd1565b5f846122985750600161249c565b6122a18561292b565b156122ae5750600161249c565b631919191960e11b600483106122c2575082355b826122d15750630707070760e51b5b6122db858261298f565b156122e9575f91505061249c565b5f6122f3876129b7565b90506122fe81613dd1565b156123bb5761231960e083901c606088901b175b8290613e1d565b156123295760019250505061249c565b61233c6332323232606088901b17612312565b1561234c5760019250505061249c565b61237260e083901c73191919191919191919191919191919191919191960611b17612312565b156123825760019250505061249c565b6123ab7f3232323232323232323232323232323232323232000000000000000032323232612312565b156123bb5760019250505061249c565b6123d15f51602061592e5f395f51905f526129b7565b90506123dc81613dd1565b15612496576123f460e083901c606088901b17612312565b156124045760019250505061249c565b6124176332323232606088901b17612312565b156124275760019250505061249c565b61244d60e083901c73191919191919191919191919191919191919191960611b17612312565b1561245d5760019250505061249c565b6124867f3232323232323232323232323232323232323232000000000000000032323232612312565b156124965760019250505061249c565b5f925050505b949350505050565b5f60405182604081146124bf57604181146124e65750612517565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526124f7565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d612524575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d610fa757fe5b5f6040518681528560208201528460408201528360608201528260808201525f5f5260205f60a0836101005afa503d6125a9576d1ab2e8006fd8b71907bf06a5bdee3b6125a95760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa6125a957fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6126136040518060c0016040528060608152602001606081526020015f81526020015f81526020015f81526020015f81525090565b815160c081106126c05760208301818101818251018281108260c0830111171561263f575050506126c0565b808151019250806020820151018181108382111782851084861117171561266957505050506126c0565b828151602083010111838551602087010111171561268a57505050506126c0565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f5f5f6126d588600180613ea1565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c51015116146020831188161696505085156127b957602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d90506127b957fe5b50505082156127da576127d78287608001518860a001518888612545565b92505b505095945050505050565b5f6001600160a01b0385161561249c57604051853b612875578260408114612815576041811461283c57506128af565b60208581013560ff81901c601b0190915285356040526001600160ff1b031660605261284d565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f606052806040526128af565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b686d3d4e7fb92a52381390565b60405181546020820190600881901c5f8260ff8417146128f357505080825260ff8116601f80821115612915575b855f5260205f205b8160051c810154828601526020820191508282106128fb57505b508084525f920191825250602001604052919050565b5f818152686d3d4e7fb92a52381760205260408120805460ff808216908114801590910260089290921c0217806129755760405163395ed8c160e21b815260040160405180910390fd5b612982825f198301613f92565b60ff161515949350505050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f51602061592e5f395f51905f5283146129db576129d683613fff565b6129ea565b5f51602061592e5f395f51905f525b68a3bbbebc65eb8804df6009525f908152602990209392505050565b5f82612a1b57612a16858561402c565b612a26565b612a2685858461412a565b95945050505050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81208190610e17565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612a995763f5a267f15f526004601cfd5b82612aab5768fbb67fda52d4bfb8bf92505b80546001600160601b038116612aef5760019250838160601c0315612b0057600182015460601c8414612b0057600282015460601c8414612b00575b5f9250612b00565b81602052835f5260405f2054151592505b505092915050565b6001600160a01b0381165f908152686d3d4e7fb92a52381a602052604081208054601f5263d4203f8b6004528152603f81208190610e17565b5f82612b5157612a168585612bec565b612a268585846132ae565b5f815d50565b604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b80825d5050565b805160218110612bc05763ec92f9a35f526004601cfd5b9081015160209190910360031b1b90565b5f81545b80156126c057600191820191811901811618612bd5565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612c275763f5a267f15f526004601cfd5b82612c395768fbb67fda52d4bfb8bf92505b80546001600160601b03811680612cb35760019350848260601c03612c715760018301805484556002840180549091555f9055612d18565b84600184015460601c03612c925760028301805460018501555f9055612d18565b84600284015460601c03612cab575f6002840155612d18565b5f9350612d18565b82602052845f5260405f20805480612ccc575050612d18565b60018360011c039250826001820314612cfc578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612d4b83613dd1565b82106114f257604051634e23d03560e01b815260040160405180910390fd5b365f8080612d788686614147565b93509350612d8e86866040908111913510171590565b15612dcd57602085870103866020013580880160208101945080359350828482011182851760401c1715612dc95763ba597e7e5f526004601cfd5b5050505b92959194509250565b5f8183604051375060405120919050565b5f82815260a082901c602052604090206001600160a01b0316612e0b8482846141dd565b610e1757505f9392505050565b801580612e295750612e298161292b565b15612e3957611f74838383614239565b5f612e43826129b7565b6001019050612eb16040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f612ebb83613804565b90505f5b81811015612f0d575f612ed28583613855565b90506001600160a01b03811615612f04576040840151612ef29082614290565b506060840151612f02905f613907565b505b50600101612ebf565b505f5f5b868110156130cb57600581901b880135880180358015300217906020808201359160408101350190810190358215612f5057612f4d8387615882565b95505b6004811015612f6257505050506130c3565b813560e01c63a9059cbb819003612f98576040890151612f829086614290565b50612f96602484013560608b0151906142af565b505b8063ffffffff1663095ea7b303612fe05760248301355f03612fbe5750505050506130c3565b8851612fca9086614290565b50612fde600484013560208b0151906142af565b505b8063ffffffff166387517c4503613058576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba31461301a5750505050506130c3565b60448301355f0361302f5750505050506130c3565b613042600484013560808b0151906142af565b50613056602484013560a08b0151906142af565b505b8063ffffffff1663598daac4036130bd576001600160a01b03851630146130835750505050506130c3565b8a6004840135146130985750505050506130c3565b6130ab602484013560408b0151906142af565b5060608901516130bb905f613907565b505b50505050505b600101612f11565b506040830151516060840151516130e291906142c5565b5f6131156130f38560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b6040850151515181101561316157604085015151600582901b016020015161315782613145833061439b565b85919060059190911b82016020015290565b5050600101613119565b5061316d888888614239565b5f80805260018601602052604081206131869184613bab565b5f5b6040850151515181101561321457604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b01835293909320606089015151830182015192860190910151909161320a918391859161320591906131fa906131f1893061439b565b80821191030290565b808218908210021890565b613bab565b5050600101613188565b505f5b8451515181101561325957845151600582901b01602001516132508161324a84896020015161438b90919063ffffffff16565b5f6143c5565b50600101613217565b505f5b608085015151518110156132a357608085015151600582901b016020015161329a81613295848960a0015161438b90919063ffffffff16565b61440f565b5060010161325c565b505050505050505050565b5f6132b9848461446a565b90508015610e1757816132cb85613804565b1115610e175760405163155176b960e11b815260040160405180910390fd5b61330b60405180606001604052805f81526020015f81526020015f81525090565b5f613315836128c5565b905080515f146126c0575f613329826145c5565b602001949350505050565b604080518251602080830191909152830151818301529082015160608201526110d7908390613374906080016040516020818303038152906040526146f4565b6136f1565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c925083831415830281528161340757821561340257600191508185015460601c92508215613402578284141590920260208301525060028381015460601c918215613402576003915083831415830260408201525b613437565b600191821c915b82811015613435578581015460601c858114158102600583901b840152935060010161340e565b505b8186528160051b81016040525050505050919050565b5f5f61345884614810565b905082156001600160a01b038216151715801561249c575061249c8484836141dd565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f000000000000000000000000000000000000000000000000000000000000000046141661356e5750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f5f5f61359c612b62565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b5f5f613611848461482e565b600101905550505050565b604081811c5f90815260208490522080546001600160401b0383161015613656576040516312ee5c9360e01b815260040160405180910390fd5b61368061367a836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f818152686d3d4e7fb92a52381760209081526040808320839055686d3d4e7fb92a523818909152902080546001019055686d3d4e7fb92a5238136136d4686d3d4e7fb92a5238168361402c565b6110d75760405163395ed8c160e21b815260040160405180910390fd5b80518060081b60ff175f60fe831161371a575050601f8281015160081b82179080831115613741575b60208401855f5260205f205b828201518360051c8201556020830192508483106137265750505b509092555050565b5f81604001511561377e576137618260200151614874565b61377e576040516321b9b33960e21b815260040160405180910390fd5b61378782611952565b90505f686d3d4e7fb92a5238136060840151845160208087015160408089015190519596506137de956137bc95949301615895565b60408051601f198184030181529181525f8581526004850160205220906136f1565b6137eb6003820183614890565b5050919050565b5f6137fc826149a2565b151592915050565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c151761384d5760019350838301541561384d5760029350838301541561384d57600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf8214158202915061388884613804565b83106138a757604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b80156138f15761ffff81166138d6576010918201911c6138bb565b8183526020600582901b16909201916001918201911c6138bb565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c55360208403518181061582820402905080831061399f5782811781018115826020018701604051181761396b57828102601f19870152850160200160405261399f565b602060405101816020018101604052808a52601f19855b888101518382015281018061398257509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf906020840181613a295783548015613a2357808414150281526001848101549092508015613a2357808414150260208201526002848101549092508015613a23576003925083811415810260408301525b50613a54565b8160011c91505f5b82811015613a5257848101548481141502600582901b830152600101613a31565b505b8185528160051b810160405250505050919050565b686d3d4e7fb92a523813823560601c601483811881851002188085019080851190850302613aa0686d3d4e7fb92a52381984612a5e565b613abc576040516282b42960e81b815260040160405180910390fd5b333014613aec57613ad033610df185612b08565b613aec576040516282b42960e81b815260040160405180910390fd5b604051818382375f388383875af4612159573d5f823e3d81fd5b5f613b10846149a2565b905080600303613b2b57613b258484846149eb565b50505050565b365f365f84613b4157637f1812755f526004601cfd5b5085358087016020810194503592505f90604011600286141115613b6f575050602080860135860190810190355b613b7e88888887878787614a83565b5050505050505050565b6001600160a01b038316613ba057611f748282614bdf565b611f74838383614bf8565b80613bb557505050565b5f613bbf846138ae565b905080515f03613be257604051635ee7e5b160e01b815260040160405180910390fd5b5f5b8151811015613cc9575f828281518110613c0057613c006157a7565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f613c2d826132ea565b90505f613c49428560ff1660058111156108f4576108f4614e33565b90508082604001511015613c6557604082018190525f60208301525b815f01518783602001818151613c7b9190615882565b9150818152501115613cb05760405163482a648960e11b81526001600160a01b03891660048201526024015b60405180910390fd5b613cba8383613334565b50505050806001019050613be4565b5050505050565b5f8080613d6d613ce362015180866158e4565b5f5f5f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c9250806137eb5781545f9350156137eb576001925082820154156137eb576002925082820154156137eb575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613e4a5763f5a267f15f526004601cfd5b82613e5c5768fbb67fda52d4bfb8bf92505b801954613e8d5780546001925083146138a757600181015483146138a757600281015483146138a7575f91506138a7565b602052505f90815260409020541515919050565b606083518015612524576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613f1c579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f82548060ff821714613fda57601e8311613fb15780831a91506138a7565b8060ff168311613fd557835f52601f83038060051c60205f200154601f82161a9250505b6138a7565b8060081c83116138a757835f528260051c60205f200154601f84161a91505092915050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81206114f2565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036140595763f5a267f15f526004601cfd5b8261406b5768fbb67fda52d4bfb8bf92505b801954806140cc5760019250838254036140985760018201805483556002830180549091555f9055612b00565b836001830154036140b65760028201805460018401555f9055612b00565b83600283015403612ae7575f6002830155612b00565b81602052835f5260405f208054806140e5575050612b00565b60018360011c03925082600182031461410f57828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f6141358484614890565b90508015610e1757816132cb85613dd1565b365f833580850160208587010360208201945081359350808460051b8301118360401c171561417d5763ba597e7e5f526004601cfd5b83156141d3578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c17156141ca5763ba597e7e5f526004601cfd5b50505082614187575b5050509250929050565b5f82815260208082206080909152601f8390526305d78094600b52601960272061422f6001600160a01b0387168015159061421b84601b8a88614c38565b6001600160a01b0316149015159015151690565b9695505050505050565b5f826142455750505050565b600581901b84013584018035801530021790602080820135916040810135019081019035614276848484848a614c72565b505050508383905081600101915081036142455750505050565b604080516060815290819052610e1783836001600160a01b0316613907565b604080516060815290819052610e178383613907565b60405181518351146142e357634e487b715f5260326020526024601cfd5b82516142ee57505050565b5f5f6142f985614cb0565b61430285614cb0565b9150915061430f85614cdf565b61431885614d34565b848403601f196020870187518752875160051b3684830137845160051b5b8086015181860151835b8281511461435057602001614340565b86018051820180825282111561437257634e487b715f5260116020526024601cfd5b5050508201806143365750505050826040525050505050565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f51141661440557803d853b15171061440557633e3f8f735f526004601cfd5b505f603452505050565b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af1611f74576396b3de235f526004601cfd5b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016144a55763f5a267f15f526004601cfd5b826144b75768fbb67fda52d4bfb8bf92505b80546001600160601b0381168260205280614579578160601c806144e5578560601b84556001945050612d18565b8581036144f25750612d18565b600184015460601c80614513578660601b6001860155600195505050612d18565b868103614521575050612d18565b600285015460601c80614543578760601b600287015560019650505050612d18565b87810361455257505050612d18565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f2080546145bb57600191821c8083018255919450816145a7578560601b600317845550612d18565b8560601b8285015582600201845550612d18565b5050505092915050565b606061461d565b6fffffffffffffffffffffffffffffffff811160071b81811c6001600160401b031060061b1781811c63ffffffff1060051b1781811c61ffff1060041b1790811c60ff1060039190911c17601f1890565b815115610fa75760405190506004820180518351846020010160ff8115190460071b196020850183198552866020015b8051805f1a6146a657600190811a01608081116146865780368437808301925060028201915084821061468057506146d6565b5061464d565b5f198352918201607f1901916002919091019084821061468057506146d6565b8083528381168401178317196146bb816145cc565b9015018282860382811181841802180192500183811061464d575b509290935250601f198382030183525f815260200160405250919050565b6040518151602082019083015b8084146147ef576001840193508351601f1a8061478e575b60208501518061475d5785830360208181189082110218607f839003818111818318021896870196928301929050601f811161475657505061477e565b5050614719565b614766816145cc565b90508583038181118183180218958601959190910190505b60f01b8252600290910190614701565b60ff81036147e0576020808601511980156147af576147ac816145cc565b91505b508583038181118282180218601f81811890821102186080811760f01b855295909501945050600290910190614701565b80835350600182019150614701565b50600482018051199052601f198282030182525f8152602001604052919050565b5f60205f5f843c5f5160f01c61ef011460035160601c029050919050565b604081811c5f90815260208490522080546001600160401b0380841682149082101661486d57604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f8082600281111561488857614888614e33565b141592915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036148bd5763f5a267f15f526004601cfd5b826148cf5768fbb67fda52d4bfb8bf92505b8019548160205280614973578154806148ef578483556001935050612b00565b8481036148fc5750612b00565b60018301548061491757856001850155600194505050612b00565b858103614925575050612b00565b6002840154806149415786600286015560019550505050612b00565b86810361495057505050612b00565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f208054612d1857600191821c8381018690558083019182905590821b8217831955909250612b00565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c1715614a3057633995943b5f526004601cfd5b505f5b83811461215957365f8260051b850135808601602081019350803592505084828401118160401c1715614a6d57633995943b5f526004601cfd5b50614a79898383611f58565b5050600101614a33565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163303614ae55760208114614ad45760405163438e981560e11b815260040160405180910390fd5b614ae084848435612e18565b612159565b80614b1457333014614b09576040516282b42960e81b815260040160405180910390fd5b614ae084845f612e18565b6020811015614b365760405163438e981560e11b815260040160405180910390fd5b8135614b4a686d3d4e7fb92a523813611946565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f5f614ba7614b8d8888866116e8565b602080871081881802188088019080880390881102610954565b9150915081614bc8576040516282b42960e81b815260040160405180910390fd5b614bd3878783612e18565b50505050505050505050565b5f385f3884865af16110d75763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f51141661440557803d853b151710614405576390b8ec185f526004601cfd5b5f604051855f5260ff851660205283604052826060526020604060805f60015afa505f6060523d6060185191508060405250949350505050565b614c7e8186858561228a565b614ca3578085848460405163f78c1b5360e01b8152600401613ca79493929190615903565b613cc98585858585614d7d565b604051815160051b8101602001818084035b808201518252816020019150828203614cc2575060405250919050565b80515f82528060051b8201601f19602084015b602001828111614d2d5780518282018051828111614d1257505050614cf2565b5b602082015283018051828111614d13575060200152614cf2565b5050509052565b600281511061194f576020810160408201600183510160051b83015b8151835114614d6457602083019250815183525b602082019150808203614d5057505081900360051c9052565b604051828482375f388483888a5af161215b573d5f823e3d81fd5b5f5f83601f840112614da8575f5ffd5b5081356001600160401b03811115614dbe575f5ffd5b60208301915083602082850101111561486d575f5ffd5b5f5f5f60408486031215614de7575f5ffd5b8335925060208401356001600160401b03811115614e03575f5ffd5b614e0f86828701614d98565b9497909650939450505050565b5f60208284031215614e2c575f5ffd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f602082015160038110614e9657614e96614e33565b8060208501525060408201511515604084015260608201516080606085015261249c6080850182614e47565b602081525f610e176020830184614e75565b6001600160a01b038116811461194f575f5ffd5b801515811461194f575f5ffd5b8035610fa781614ee8565b5f5f5f5f60808587031215614f13575f5ffd5b843593506020850135614f2581614ed4565b925060408501356001600160e01b031981168114614f41575f5ffd5b91506060850135614f5181614ee8565b939692955090935050565b5f5f5f60608486031215614f6e575f5ffd5b8335614f7981614ed4565b92506020840135614f8981614ed4565b91506040840135614f9981614ee8565b809150509250925092565b5f60208284031215614fb4575f5ffd5b8135610e1781614ed4565b803560068110610fa7575f5ffd5b5f5f5f60608486031215614fdf575f5ffd5b833592506020840135614ff181614ed4565b9150614fff60408501614fbf565b90509250925092565b5f8151808452602084019350602083015f5b8281101561503857815186526020958601959091019060010161501a565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561509957605f19878603018452615084858351614e75565b94506020938401939190910190600101615068565b505050508281036020840152612a268185615008565b5f5f602083850312156150c0575f5ffd5b82356001600160401b038111156150d5575f5ffd5b6150e185828601614d98565b90969095509350505050565b5f602082840312156150fd575f5ffd5b81356001600160c01b0381168114610e17575f5ffd5b5f5f5f5f60808587031215615126575f5ffd5b84359350602085013561513881614ed4565b925061514660408601614fbf565b9396929550929360600135925050565b602080825282518282018190525f918401906040840190835b818110156151965783516001600160a01b031683526020938401939092019160010161516f565b509095945050505050565b5f5f83601f8401126151b1575f5ffd5b5081356001600160401b038111156151c7575f5ffd5b6020830191508360208260051b850101111561486d575f5ffd5b5f5f5f604084860312156151f3575f5ffd5b83356001600160401b03811115615208575f5ffd5b615214868287016151a1565b909790965060209590950135949350505050565b5f5f5f6060848603121561523a575f5ffd5b833592506020840135614f8981614ed4565b60ff60f81b8816815260e060208201525f61526a60e0830189614e47565b828103604084015261527c8189614e47565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b818110156152d15783518352602093840193909201916001016152b3565b50909b9a5050505050505050505050565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b0381118282101715615318576153186152e2565b60405290565b5f82601f83011261532d575f5ffd5b81356001600160401b03811115615346576153466152e2565b604051601f8201601f19908116603f011681016001600160401b0381118282101715615374576153746152e2565b60405281815283820160200185101561538b575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f602082840312156153b7575f5ffd5b81356001600160401b038111156153cc575f5ffd5b8201608081850312156153dd575f5ffd5b6153e56152f6565b813564ffffffffff811681146153f9575f5ffd5b815260208201356003811061540c575f5ffd5b602082015261541d60408301614ef5565b604082015260608201356001600160401b0381111561543a575f5ffd5b6154468682850161531e565b606083015250949350505050565b5f5f60208385031215615465575f5ffd5b82356001600160401b0381111561547a575f5ffd5b6150e1858286016151a1565b6006811061549657615496614e33565b9052565b5f8151808452602084019350602083015f5b8281101561503857815180516001600160a01b031687526020808201515f916154d7908a0182615486565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e090950194602091909101906001016154ac565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561557757605f1987860301845261556285835161549a565b94506020938401939190910190600101615546565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b838110156155d057601f198684030185526155ba838351615008565b602095860195909350919091019060010161559e565b509098975050505050505050565b602081525f610e176020830184614e47565b602081525f610e17602083018461549a565b5f5f60408385031215615613575f5ffd5b823561561e81614ed4565b9150602083013561562e81614ee8565b809150509250929050565b602081525f610e176020830184615008565b5f5f5f5f5f6080868803121561565f575f5ffd5b85359450602086013593506040860135925060608601356001600160401b03811115615689575f5ffd5b61569588828901614d98565b969995985093965092949392505050565b5f5f604083850312156156b7575f5ffd5b823591506156c760208401614fbf565b90509250929050565b5f5f5f5f606085870312156156e3575f5ffd5b8435935060208501356156f581614ed4565b925060408501356001600160401b0381111561570f575f5ffd5b61571b87828801614d98565b95989497509550505050565b5f60208284031215615737575f5ffd5b8151610e1781614ed4565b634e487b7160e01b5f52601160045260245ffd5b818103818111156114f2576114f2615742565b5f60208284031215615779575f5ffd5b8151610e1781614ee8565b8381526001600160a01b03831660208201526060810161249c6040830184615486565b634e487b7160e01b5f52603260045260245ffd5b5f600182016157cc576157cc615742565b5060010190565b8481526001600160a01b0384166020820152608081016157f66040830185615486565b82606083015295945050505050565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f61249c602083018486615805565b5f5f8335601e19843603018112615855575f5ffd5b8301803591506001600160401b0382111561586e575f5ffd5b60200191503681900382131561486d575f5ffd5b808201808211156114f2576114f2615742565b5f85518060208801845e60d886901b6001600160d81b031916908301908152600385106158c4576158c4614e33565b60f894851b600582015292151590931b6006830152506007019392505050565b5f826158fe57634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f9061422f908301848661580556fe3232323232323232323232323232323232323232323232323232323232323232a264697066735822122044607c63a50a3a94caf4c91681d5ede98b5ba9d65a2313a54807ce231f5a0ba864736f6c634300081d0033" as const;


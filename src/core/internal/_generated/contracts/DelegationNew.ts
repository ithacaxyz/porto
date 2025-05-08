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

export const code = "0x610140604052604051615aa9380380615aa9833981016040819052610023916100e7565b306080524660a052606080610072604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526006835265036392e302e360d41b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610114565b5f602082840312156100f7575f5ffd5b81516001600160a01b038116811461010d575f5ffd5b9392505050565b60805160a05160c05160e05161010051610120516159326101775f395f81816106b9015281816118a901528181611f5a0152818161201e0152614a3c01525f61342c01525f6134e601525f6134c001525f61347001525f61344d01526159325ff3fe60806040526004361061028b575f3560e01c80637656d30411610159578063cebfe336116100c0578063e9ae5c5311610079578063e9ae5c53146108a8578063f81d87a7146108bb578063faba56d8146108da578063fac750e0146108f9578063fcd4e7071461090d578063ff619c6b1461093557610292565b8063cebfe336146107d7578063d03c7914146107f6578063dcc09ebf14610815578063e28250b414610841578063e537b27b1461085d578063e5adda711461087c57610292565b8063ad07708311610112578063ad0770831461070d578063b70e36f01461072c578063b75c7dc61461074b578063bc2c554a1461076a578063bf53096914610797578063cb4774c4146107b657610292565b80637656d3041461064e5780637b8e4ecc1461066d57806384b0196e1461068157806394430fa5146106a85780639e49fbf1146106db578063a840fe49146106ee57610292565b80632150c518116101fd578063515c9d6d116101b6578063515c9d6d1461057d578063598daac41461059d5780635f7c23ab146105bc57806360d2f33d146105e85780636c95d5a71461061b5780636fd914541461062f57610292565b80632150c518146104ca5780632f3f30c7146104ec578063350585011461050657806336745d10146105205780633e1b08121461053f5780634223b5c21461055e57610292565b8063164b85991161024f578063164b8599146103ca57806317e69ab8146103e95780631a37ef23146104185780631a912f3e1461043757806320606b70146104785780632081a278146104ab57610292565b80630cef73b4146102cb57806311a86fd61461030657806312aaac7014610345578063136a12f7146103715780631626ba7e1461039257610292565b3661029257005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a02821417156102bd57806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102d6575f5ffd5b506102ea6102e5366004614d84565b610954565b6040805192151583526020830191909152015b60405180910390f35b348015610311575f5ffd5b5061032d73323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102fd565b348015610350575f5ffd5b5061036461035f366004614dcb565b610b50565b6040516102fd9190614e71565b34801561037c575f5ffd5b5061039061038b366004614eaf565b610c3f565b005b34801561039d575f5ffd5b506103b16103ac366004614d84565b610d64565b6040516001600160e01b031990911681526020016102fd565b3480156103d5575f5ffd5b506103906103e4366004614f0b565b610dcc565b3480156103f4575f5ffd5b50610408610403366004614dcb565b610e93565b60405190151581526020016102fd565b348015610423575f5ffd5b50610390610432366004614f53565b610f5a565b348015610442575f5ffd5b5061046a7f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102fd565b348015610483575f5ffd5b5061046a7f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b3480156104b6575f5ffd5b506103906104c5366004614f7c565b611089565b3480156104d5575f5ffd5b506104de6111d8565b6040516102fd929190614ff1565b3480156104f7575f5ffd5b506103b1630707070760e51b81565b348015610511575f5ffd5b506103b1631919191960e11b81565b34801561052b575f5ffd5b5061040861053a36600461505e565b611342565b34801561054a575f5ffd5b5061046a61055936600461509c565b6114a6565b348015610569575f5ffd5b50610364610578366004614dcb565b6114dc565b348015610588575f5ffd5b5061046a5f5160206158dd5f395f51905f5281565b3480156105a8575f5ffd5b506103906105b73660046150c2565b611514565b3480156105c7575f5ffd5b506105db6105d6366004614f53565b611666565b6040516102fd9190615105565b3480156105f3575f5ffd5b5061046a7f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b348015610626575f5ffd5b50610408611679565b34801561063a575f5ffd5b5061046a610649366004615190565b611696565b348015610659575f5ffd5b506103906106683660046151d7565b6117b2565b348015610678575f5ffd5b506105db611864565b34801561068c575f5ffd5b50610695611878565b6040516102fd97969594939291906151fb565b3480156106b3575f5ffd5b5061032d7f000000000000000000000000000000000000000000000000000000000000000081565b6103906106e9366004614dcb565b61189e565b3480156106f9575f5ffd5b5061046a610708366004615356565b611900565b348015610718575f5ffd5b506105db610727366004614dcb565b611939565b348015610737575f5ffd5b50610390610746366004614dcb565b611947565b348015610756575f5ffd5b50610390610765366004614dcb565b6119af565b348015610775575f5ffd5b50610789610784366004615403565b611a04565b6040516102fd9291906154cf565b3480156107a2575f5ffd5b506103906107b136600461505e565b611b3b565b3480156107c1575f5ffd5b506107ca611bdf565b6040516102fd919061558d565b3480156107e2575f5ffd5b5061046a6107f1366004615356565b611bf3565b348015610801575f5ffd5b50610408610810366004614dcb565b611c5b565b348015610820575f5ffd5b5061083461082f366004614dcb565b611c7e565b6040516102fd919061559f565b34801561084c575f5ffd5b50686d3d4e7fb92a5238145461046a565b348015610868575f5ffd5b506103906108773660046155b1565b611e42565b348015610887575f5ffd5b5061089b610896366004614dcb565b611ef3565b6040516102fd91906155e8565b6103906108b6366004614d84565b611f06565b3480156108c6575f5ffd5b506103906108d53660046155fa565b611f32565b3480156108e5575f5ffd5b5061046a6108f4366004615655565b612111565b348015610904575f5ffd5b5061046a612225565b348015610918575f5ffd5b5061092261c1d081565b60405161ffff90911681526020016102fd565b348015610940575f5ffd5b5061040861094f36600461567f565b612238565b5f80604183146040841417156109845730610970868686612452565b6001600160a01b03161491505f9050610b48565b602183101561099757505f905080610b48565b506020198281018381118185180281189385019182013591601f19013560ff16156109c8576109c5866124da565b95505b505f6109d382610b50565b805190915064ffffffffff1642811090151516156109f4575f925050610b48565b5f81602001516002811115610a0b57610a0b614de2565b03610a66575f80603f86118735810290602089013502915091505f5f610a4a856060015180516020820151604090920151603f90911191820292910290565b91509150610a5b8a858585856124f3565b965050505050610b46565b600181602001516002811115610a7e57610a7e614de2565b03610b0357606081810151805160208083015160409384015184518084018d9052855180820385018152601f8c018590049094028101870186529485018a8152603f9490941091820295910293610afa935f92610af3928d918d918291018382808284375f9201919091525061258c92505050565b8585612674565b94505050610b46565b600281602001516002811115610b1b57610b1b614de2565b03610b4657610b438160600151806020019051810190610b3b91906156d6565b878787612793565b92505b505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f828152686d3d4e7fb92a52381760205260408120610b9090612873565b8051909150610bb25760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610bc68383016020015190565b60d881901c855260c881901c915060d01c60ff166002811115610beb57610beb614de2565b84602001906002811115610c0157610c01614de2565b90816002811115610c1457610c14614de2565b90525060ff811615156040850152610c3183838151811082025290565b606085015250919392505050565b333014610c5e576040516282b42960e81b815260040160405180910390fd5b8380610c7d57604051638707510560e01b815260040160405180910390fd5b5f5160206158dd5f395f51905f528514610cb857610c9a856128d9565b15610cb857604051630442081560e01b815260040160405180910390fd5b610cc2848461293d565b15610ce0576040516303a6f8c760e21b815260040160405180910390fd5b610d0360e084901c606086901b1783610800610cfb89612965565b9291906129b4565b50604080518681526001600160a01b03861660208201526001600160e01b0319851681830152831515606082015290517f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e19181900360800190a15050505050565b5f5f5f610d72868686610954565b90925090508115158115151615610da857610d8c816128d9565b80610da55750610da533610d9f836129dd565b90612a0c565b91505b81610db75763ffffffff610dbd565b631626ba7e5b60e01b925050505b9392505050565b333014610deb576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813610e08686d3d4e7fb92a52381985612a0c565b610e24576040516282b42960e81b815260040160405180910390fd5b610e3d8383610200610e3588612ab6565b929190612aef565b50826001600160a01b0316846001600160a01b03167f22e306b6bdb65906c2b1557fba289ced7fe45decec4c8df8dbc9c21a65ac305284604051610e85911515815260200190565b60405180910390a350505050565b5f333014610eb3576040516282b42960e81b815260040160405180910390fd5b5f610eec610ee8610ee560017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615705565b90565b5c90565b90507fb25b31941c18d9284933e01fdeb815f311ca97e440b9178abfddc11b69baaa648114610f19575f5ffd5b610f4f610f4a610ee560017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615705565b612b0a565b60019150505b919050565b333014610f79576040516282b42960e81b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c525190555f610fb4612b10565b915061101090507fb25b31941c18d9284933e01fdeb815f311ca97e440b9178abfddc11b69baaa6461100a610ee560017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615705565b90612b51565b306317e69ab861101f83612b58565b6040518263ffffffff1660e01b815260040161103d91815260200190565b6020604051808303815f875af1158015611059573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061107d9190615718565b611085575f5ffd5b5050565b3330146110a8576040516282b42960e81b815260040160405180910390fd5b82806110c757604051638707510560e01b815260040160405180910390fd5b6110d0846128d9565b156110ee5760405163f2fee1e160e01b815260040160405180910390fd5b5f6110f885612965565b6001600160a01b0385165f90815260028201602052604090206001909101915061114684600581111561112d5761112d614de2565b8254600160ff9092169190911b80198216845516151590565b15611166575f61115582612b80565b03611166576111648286612b9b565b505b611195816001015f86600581111561118057611180614de2565b60ff1681526020019081526020015f205f9055565b7fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a278686866040516111c893929190615733565b60405180910390a1505050505050565b6060805f6111e4612225565b9050806001600160401b038111156111fe576111fe615291565b60405190808252806020026020018201604052801561124d57816020015b604080516080810182525f80825260208083018290529282015260608082015282525f1990920191018161121c5790505b509250806001600160401b0381111561126857611268615291565b604051908082528060200260200182016040528015611291578160200160208202803683370190505b5091505f805b82811015611337575f6112b882686d3d4e7fb92a5238135b60030190612cd0565b90505f6112c482610b50565b805190915064ffffffffff1642811090151516156112e357505061132f565b808785815181106112f6576112f6615756565b60200260200101819052508186858151811061131457611314615756565b6020908102919091010152836113298161576a565b94505050505b600101611297565b508084528252509091565b686d3d4e7fb92a523814545f90686d3d4e7fb92a52381390156113695760019150506114a0565b365f365f6113778888612d19565b604080518481526001850160051b8101909152939750919550935091505f5b8481101561143857600581901b8601358601803590602080820135916040810135019081019035611428856114197f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876113fa8888612d85565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b5050505050806001019050611396565b505f6114573061145084805160051b60209091012090565b8635612d96565b9050801560208410171561147e5760405163e483bbcb60e01b815260040160405180910390fd5b60018701819055858561149282825f612dc7565b600199505050505050505050505b92915050565b6001600160c01b0381165f908152686d3d4e7fb92a5238156020526040808220549083901b67ffffffffffffffff1916176114a0565b604080516080810182525f80825260208201819052918101919091526060808201526114a061035f83686d3d4e7fb92a5238136112af565b333014611533576040516282b42960e81b815260040160405180910390fd5b838061155257604051638707510560e01b815260040160405180910390fd5b61155b856128d9565b156115795760405163f2fee1e160e01b815260040160405180910390fd5b5f61158386612965565b60010190506115948186604061325d565b506001600160a01b0385165f90815260018201602052604090206115da8560058111156115c3576115c3614de2565b8254600160ff9092169190911b8082178455161590565b505f816001015f8760058111156115f3576115f3614de2565b60ff1681526020019081526020015f2090505f61160f82613299565b868152905061161e82826132e3565b7f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a898989896040516116539493929190615782565b60405180910390a1505050505050505050565b60606114a061167483612ab6565b613328565b5f61169130686d3d4e7fb92a523813600101546133fc565b905090565b5f806116b28460408051828152600190920160051b8201905290565b90505f5b8481101561172f57600581901b8601358601803580153002179060208082013591604081013501908101903561171f856114197f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876113fa8888612d85565b50505050508060010190506116b6565b5061c1d060f084901c145f6117897f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b90508161179e576117998161342a565b6117a7565b6117a781613540565b979650505050505050565b3330146117d1576040516282b42960e81b815260040160405180910390fd5b5f838152686d3d4e7fb92a523817602052604090205460ff166118075760405163395ed8c160e21b815260040160405180910390fd5b6118188282610200610e35876129dd565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc9983604051611857911515815260200190565b60405180910390a3505050565b6060611691686d3d4e7fb92a523819613328565b600f60f81b6060805f80808361188c612b10565b97989097965046955030945091925090565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146118e6576040516282b42960e81b815260040160405180910390fd5b6118fd686d3d4e7fb92a5238135b600201826135b4565b50565b5f6114a08260200151600281111561191a5761191a614de2565b60ff168360600151805190602001205f1c5f9182526020526040902090565b60606114a0611674836129dd565b333014611966576040516282b42960e81b815260040160405180910390fd5b611979686d3d4e7fb92a523815826135cb565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b3330146119ce576040516282b42960e81b815260040160405180910390fd5b6119d781613635565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b03811115611a2057611a20615291565b604051908082528060200260200182016040528015611a5357816020015b6060815260200190600190039081611a3e5790505b509250806001600160401b03811115611a6e57611a6e615291565b604051908082528060200260200182016040528015611aa157816020015b6060815260200190600190039081611a8c5790505b5091505f5b81811015611b3257611acf868683818110611ac357611ac3615756565b90506020020135611c7e565b848281518110611ae157611ae1615756565b6020026020010181905250611b0d868683818110611b0157611b01615756565b90506020020135611ef3565b838281518110611b1f57611b1f615756565b6020908102919091010152600101611aa6565b50509250929050565b333014611b5a576040516282b42960e81b815260040160405180910390fd5b611ba282828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250611b9c9250612866915050565b906136a0565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611bd39291906157dc565b60405180910390a15050565b6060611691686d3d4e7fb92a523813612873565b5f333014611c13576040516282b42960e81b815260040160405180910390fd5b611c1c826136f8565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611c4e9190614e71565b60405180910390a2919050565b5f6114a06001600160f81b031980841614611c75846137a1565b15159015151790565b60605f611c8a83612965565b6001019050611ca56040518060200160405280606081525090565b5f611caf836137b3565b90505f5b81811015611e38575f611cc68583613804565b6001600160a01b0381165f9081526001870160205260408120919250611ceb8261385d565b90505f5b8151811015611e29575f828281518110611d0b57611d0b615756565b602002602001015190505f611d34856001015f8460ff1681526020019081526020015f20613299565b9050611d716040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166005811115611d8657611d86614de2565b81602001906005811115611d9c57611d9c614de2565b90816005811115611daf57611daf614de2565b9052506001600160a01b03871681528151604080830191909152820151608082015260208201516060820152611df44260ff851660058111156108f4576108f4614de2565b60c08201819052608082015160608301519111150260a082015280611e198b826138b6565b5050505050806001019050611cef565b50505050806001019050611cb3565b5050519392505050565b333014611e61576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813611e82686d3d4e7fb92a5238198484610200612aef565b5081611ea9576001600160a01b0383165f9081526007820160205260409020805460010190555b826001600160a01b03167f31471c9e79dc8535d9341d73e61eaf5e72e4134b3e5b16943305041201581d8883604051611ee6911515815260200190565b60405180910390a2505050565b60606114a0611f0183612965565b61395f565b6001600160f81b03198084169003611f2757611f228282613a18565b505050565b611f22838383613ab5565b813580830190604081901c602084101715611f4b575f5ffd5b50611fc4336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611fbb30611f8c6020860186614f53565b6001600160a01b03161430611fa76080870160608801614f53565b6001600160a01b0316149015159015151790565b15159015151690565b611fe0576040516282b42960e81b815260040160405180910390fd5b30611ff16080830160608401614f53565b6001600160a01b031603612071575f80612013866102e56101c08601866157ef565b915091508096505f197f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316310361205157600191505b8161206e576040516282b42960e81b815260040160405180910390fd5b50505b61209c61208460a0830160808401614f53565b6120966101a084016101808501614f53565b88613b37565b8415806120ad57506120ad856128d9565b612109575f6120bb86612965565b600181019150612107906002015f6120d960a0860160808701614f53565b6001600160a01b0316815260208101919091526040015f2061210160a0850160808601614f53565b89613b5a565b505b505050505050565b5f8082600581111561212557612125614de2565b0361213857603c808404025b90506114a0565b600182600581111561214c5761214c614de2565b0361215d57610e1080840402612131565b600282600581111561217157612171614de2565b03612183576201518080840402612131565b600382600581111561219757612197614de2565b036121bd576007600362015180808604918201929092069003620545ff85110202612131565b5f5f6121c885613c7f565b50909250905060048460058111156121e2576121e2614de2565b036121fc576121f382826001613d29565b925050506114a0565b600584600581111561221057612210614de2565b03612221576121f382600180613d29565b5f5ffd5b5f611691686d3d4e7fb92a523816613d80565b5f846122465750600161244a565b61224f856128d9565b1561225c5750600161244a565b631919191960e11b60048310612270575082355b8261227f5750630707070760e51b5b612289858261293d565b15612297575f91505061244a565b5f6122a187612965565b90506122ac81613d80565b15612369576122c760e083901c606088901b175b8290613dcc565b156122d75760019250505061244a565b6122ea6332323232606088901b176122c0565b156122fa5760019250505061244a565b61232060e083901c73191919191919191919191919191919191919191960611b176122c0565b156123305760019250505061244a565b6123597f32323232323232323232323232323232323232320000000000000000323232326122c0565b156123695760019250505061244a565b61237f5f5160206158dd5f395f51905f52612965565b905061238a81613d80565b15612444576123a260e083901c606088901b176122c0565b156123b25760019250505061244a565b6123c56332323232606088901b176122c0565b156123d55760019250505061244a565b6123fb60e083901c73191919191919191919191919191919191919191960611b176122c0565b1561240b5760019250505061244a565b6124347f32323232323232323232323232323232323232320000000000000000323232326122c0565b156124445760019250505061244a565b5f925050505b949350505050565b5f604051826040811461246d576041811461249457506124c5565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526124a5565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d6124d2575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d610f5557fe5b5f6040518681528560208201528460408201528360608201528260808201525f5f5260205f60a0836101005afa503d612557576d1ab2e8006fd8b71907bf06a5bdee3b6125575760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa61255757fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6125c16040518060c0016040528060608152602001606081526020015f81526020015f81526020015f81526020015f81525090565b815160c0811061266e5760208301818101818251018281108260c083011117156125ed5750505061266e565b8081510192508060208201510181811083821117828510848611171715612617575050505061266e565b8281516020830101118385516020870101111715612638575050505061266e565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f5f5f61268388600180613e50565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561276757602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061276757fe5b5050508215612788576127858287608001518860a0015188886124f3565b92505b505095945050505050565b5f6001600160a01b0385161561244a57604051853b6128235782604081146127c357604181146127ea575061285d565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526127fb565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f6060528060405261285d565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b686d3d4e7fb92a52381390565b60405181546020820190600881901c5f8260ff8417146128a157505080825260ff8116601f808211156128c3575b855f5260205f205b8160051c810154828601526020820191508282106128a957505b508084525f920191825250602001604052919050565b5f818152686d3d4e7fb92a52381760205260408120805460ff808216908114801590910260089290921c0217806129235760405163395ed8c160e21b815260040160405180910390fd5b612930825f198301613f41565b60ff161515949350505050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f5160206158dd5f395f51905f5283146129895761298483613fae565b612998565b5f5160206158dd5f395f51905f525b68a3bbbebc65eb8804df6009525f908152602990209392505050565b5f826129c9576129c48585613fdb565b6129d4565b6129d48585846140d9565b95945050505050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81208190610dc5565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612a475763f5a267f15f526004601cfd5b82612a595768fbb67fda52d4bfb8bf92505b80546001600160601b038116612a9d5760019250838160601c0315612aae57600182015460601c8414612aae57600282015460601c8414612aae575b5f9250612aae565b81602052835f5260405f2054151592505b505092915050565b6001600160a01b0381165f908152686d3d4e7fb92a52381a602052604081208054601f5263d4203f8b6004528152603f81208190610dc5565b5f82612aff576129c48585612b9b565b6129d485858461325d565b5f815d50565b604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526006835265036392e302e360d41b9083015291565b80825d5050565b805160218110612b6f5763ec92f9a35f526004601cfd5b9081015160209190910360031b1b90565b5f81545b801561266e57600191820191811901811618612b84565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612bd65763f5a267f15f526004601cfd5b82612be85768fbb67fda52d4bfb8bf92505b80546001600160601b03811680612c625760019350848260601c03612c205760018301805484556002840180549091555f9055612cc7565b84600184015460601c03612c415760028301805460018501555f9055612cc7565b84600284015460601c03612c5a575f6002840155612cc7565b5f9350612cc7565b82602052845f5260405f20805480612c7b575050612cc7565b60018360011c039250826001820314612cab578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612cfa83613d80565b82106114a057604051634e23d03560e01b815260040160405180910390fd5b365f8080612d2786866140f6565b93509350612d3d86866040908111913510171590565b15612d7c57602085870103866020013580880160208101945080359350828482011182851760401c1715612d785763ba597e7e5f526004601cfd5b5050505b92959194509250565b5f8183604051375060405120919050565b5f82815260a082901c602052604090206001600160a01b0316612dba84828461418c565b610dc557505f9392505050565b801580612dd85750612dd8816128d9565b15612de857611f228383836141e8565b5f612df282612965565b6001019050612e606040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f612e6a836137b3565b90505f5b81811015612ebc575f612e818583613804565b90506001600160a01b03811615612eb3576040840151612ea1908261423f565b506060840151612eb1905f6138b6565b505b50600101612e6e565b505f5f5b8681101561307a57600581901b880135880180358015300217906020808201359160408101350190810190358215612eff57612efc8387615831565b95505b6004811015612f115750505050613072565b813560e01c63a9059cbb819003612f47576040890151612f31908661423f565b50612f45602484013560608b01519061425e565b505b8063ffffffff1663095ea7b303612f8f5760248301355f03612f6d575050505050613072565b8851612f79908661423f565b50612f8d600484013560208b01519061425e565b505b8063ffffffff166387517c4503613007576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba314612fc9575050505050613072565b60448301355f03612fde575050505050613072565b612ff1600484013560808b01519061425e565b50613005602484013560a08b01519061425e565b505b8063ffffffff1663598daac40361306c576001600160a01b0385163014613032575050505050613072565b8a600484013514613047575050505050613072565b61305a602484013560408b01519061425e565b50606089015161306a905f6138b6565b505b50505050505b600101612ec0565b506040830151516060840151516130919190614274565b5f6130c46130a28560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b6040850151515181101561311057604085015151600582901b0160200151613106826130f4833061434a565b85919060059190911b82016020015290565b50506001016130c8565b5061311c8888886141e8565b5f80805260018601602052604081206131359184613b5a565b5f5b604085015151518110156131c357604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b0183529390932060608901515183018201519286019091015190916131b991839185916131b491906131a9906131a0893061434a565b80821191030290565b808218908210021890565b613b5a565b5050600101613137565b505f5b8451515181101561320857845151600582901b01602001516131ff816131f984896020015161433a90919063ffffffff16565b5f614374565b506001016131c6565b505f5b6080850151515181101561325257608085015151600582901b016020015161324981613244848960a0015161433a90919063ffffffff16565b6143be565b5060010161320b565b505050505050505050565b5f6132688484614419565b90508015610dc5578161327a856137b3565b1115610dc55760405163155176b960e11b815260040160405180910390fd5b6132ba60405180606001604052805f81526020015f81526020015f81525090565b5f6132c483612873565b905080515f1461266e575f6132d882614574565b602001949350505050565b60408051825160208083019190915283015181830152908201516060820152611085908390613323906080016040516020818303038152906040526146a3565b6136a0565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c92508383141583028152816133b65782156133b157600191508185015460601c925082156133b1578284141590920260208301525060028381015460601c9182156133b1576003915083831415830260408201525b6133e6565b600191821c915b828110156133e4578581015460601c858114158102600583901b84015293506001016133bd565b505b8186528160051b81016040525050505050919050565b5f5f613407846147bf565b905082156001600160a01b038216151715801561244a575061244a84848361418c565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f000000000000000000000000000000000000000000000000000000000000000046141661351d5750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f5f5f61354b612b10565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b5f5f6135c084846147dd565b600101905550505050565b604081811c5f90815260208490522080546001600160401b0383161015613605576040516312ee5c9360e01b815260040160405180910390fd5b61362f613629836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f818152686d3d4e7fb92a52381760209081526040808320839055686d3d4e7fb92a523818909152902080546001019055686d3d4e7fb92a523813613683686d3d4e7fb92a52381683613fdb565b6110855760405163395ed8c160e21b815260040160405180910390fd5b80518060081b60ff175f60fe83116136c9575050601f8281015160081b821790808311156136f0575b60208401855f5260205f205b828201518360051c8201556020830192508483106136d55750505b509092555050565b5f81604001511561372d576137108260200151614823565b61372d576040516321b9b33960e21b815260040160405180910390fd5b61373682611900565b90505f686d3d4e7fb92a52381360608401518451602080870151604080890151905195965061378d9561376b95949301615844565b60408051601f198184030181529181525f8581526004850160205220906136a0565b61379a600382018361483f565b5050919050565b5f6137ab82614951565b151592915050565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c15176137fc576001935083830154156137fc576002935083830154156137fc57600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf82141582029150613837846137b3565b831061385657604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b80156138a05761ffff8116613885576010918201911c61386a565b8183526020600582901b16909201916001918201911c61386a565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c55360208403518181061582820402905080831061394e5782811781018115826020018701604051181761391a57828102601f19870152850160200160405261394e565b602060405101816020018101604052808a52601f19855b888101518382015281018061393157509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf9060208401816139d857835480156139d2578084141502815260018481015490925080156139d2578084141502602082015260028481015490925080156139d2576003925083811415810260408301525b50613a03565b8160011c91505f5b82811015613a0157848101548481141502600582901b8301526001016139e0565b505b8185528160051b810160405250505050919050565b686d3d4e7fb92a523813823560601c601483811881851002188085019080851190850302613a4f686d3d4e7fb92a52381984612a0c565b613a6b576040516282b42960e81b815260040160405180910390fd5b333014613a9b57613a7f33610d9f85612ab6565b613a9b576040516282b42960e81b815260040160405180910390fd5b604051818382375f388383875af4612107573d5f823e3d81fd5b5f613abf84614951565b905080600303613ada57613ad484848461499a565b50505050565b365f365f84613af057637f1812755f526004601cfd5b5085358087016020810194503592505f90604011600286141115613b1e575050602080860135860190810190355b613b2d88888887878787614a32565b5050505050505050565b6001600160a01b038316613b4f57611f228282614b8e565b611f22838383614ba7565b80613b6457505050565b5f613b6e8461385d565b905080515f03613b9157604051635ee7e5b160e01b815260040160405180910390fd5b5f5b8151811015613c78575f828281518110613baf57613baf615756565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f613bdc82613299565b90505f613bf8428560ff1660058111156108f4576108f4614de2565b90508082604001511015613c1457604082018190525f60208301525b815f01518783602001818151613c2a9190615831565b9150818152501115613c5f5760405163482a648960e11b81526001600160a01b03891660048201526024015b60405180910390fd5b613c6983836132e3565b50505050806001019050613b93565b5050505050565b5f8080613d1c613c926201518086615893565b5f5f5f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c92508061379a5781545f93501561379a5760019250828201541561379a5760029250828201541561379a575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613df95763f5a267f15f526004601cfd5b82613e0b5768fbb67fda52d4bfb8bf92505b801954613e3c57805460019250831461385657600181015483146138565760028101548314613856575f9150613856565b602052505f90815260409020541515919050565b6060835180156124d2576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613ecb579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f82548060ff821714613f8957601e8311613f605780831a9150613856565b8060ff168311613f8457835f52601f83038060051c60205f200154601f82161a9250505b613856565b8060081c831161385657835f528260051c60205f200154601f84161a91505092915050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81206114a0565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036140085763f5a267f15f526004601cfd5b8261401a5768fbb67fda52d4bfb8bf92505b8019548061407b5760019250838254036140475760018201805483556002830180549091555f9055612aae565b836001830154036140655760028201805460018401555f9055612aae565b83600283015403612a95575f6002830155612aae565b81602052835f5260405f20805480614094575050612aae565b60018360011c0392508260018203146140be57828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f6140e4848461483f565b90508015610dc5578161327a85613d80565b365f833580850160208587010360208201945081359350808460051b8301118360401c171561412c5763ba597e7e5f526004601cfd5b8315614182578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c17156141795763ba597e7e5f526004601cfd5b50505082614136575b5050509250929050565b5f82815260208082206080909152601f8390526305d78094600b5260196027206141de6001600160a01b038716801515906141ca84601b8a88614be7565b6001600160a01b0316149015159015151690565b9695505050505050565b5f826141f45750505050565b600581901b84013584018035801530021790602080820135916040810135019081019035614225848484848a614c21565b505050508383905081600101915081036141f45750505050565b604080516060815290819052610dc583836001600160a01b03166138b6565b604080516060815290819052610dc583836138b6565b604051815183511461429257634e487b715f5260326020526024601cfd5b825161429d57505050565b5f5f6142a885614c5f565b6142b185614c5f565b915091506142be85614c8e565b6142c785614ce3565b848403601f196020870187518752875160051b3684830137845160051b5b8086015181860151835b828151146142ff576020016142ef565b86018051820180825282111561432157634e487b715f5260116020526024601cfd5b5050508201806142e55750505050826040525050505050565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f5114166143b457803d853b1517106143b457633e3f8f735f526004601cfd5b505f603452505050565b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af1611f22576396b3de235f526004601cfd5b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016144545763f5a267f15f526004601cfd5b826144665768fbb67fda52d4bfb8bf92505b80546001600160601b0381168260205280614528578160601c80614494578560601b84556001945050612cc7565b8581036144a15750612cc7565b600184015460601c806144c2578660601b6001860155600195505050612cc7565b8681036144d0575050612cc7565b600285015460601c806144f2578760601b600287015560019650505050612cc7565b87810361450157505050612cc7565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f20805461456a57600191821c808301825591945081614556578560601b600317845550612cc7565b8560601b8285015582600201845550612cc7565b5050505092915050565b60606145cc565b6fffffffffffffffffffffffffffffffff811160071b81811c6001600160401b031060061b1781811c63ffffffff1060051b1781811c61ffff1060041b1790811c60ff1060039190911c17601f1890565b815115610f555760405190506004820180518351846020010160ff8115190460071b196020850183198552866020015b8051805f1a61465557600190811a01608081116146355780368437808301925060028201915084821061462f5750614685565b506145fc565b5f198352918201607f1901916002919091019084821061462f5750614685565b80835283811684011783171961466a8161457b565b901501828286038281118184180218019250018381106145fc575b509290935250601f198382030183525f815260200160405250919050565b6040518151602082019083015b80841461479e576001840193508351601f1a8061473d575b60208501518061470c5785830360208181189082110218607f839003818111818318021896870196928301929050601f811161470557505061472d565b50506146c8565b6147158161457b565b90508583038181118183180218958601959190910190505b60f01b82526002909101906146b0565b60ff810361478f5760208086015119801561475e5761475b8161457b565b91505b508583038181118282180218601f81811890821102186080811760f01b8552959095019450506002909101906146b0565b808353506001820191506146b0565b50600482018051199052601f198282030182525f8152602001604052919050565b5f60205f5f843c5f5160f01c61ef011460035160601c029050919050565b604081811c5f90815260208490522080546001600160401b0380841682149082101661481c57604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f8082600281111561483757614837614de2565b141592915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf830361486c5763f5a267f15f526004601cfd5b8261487e5768fbb67fda52d4bfb8bf92505b80195481602052806149225781548061489e578483556001935050612aae565b8481036148ab5750612aae565b6001830154806148c657856001850155600194505050612aae565b8581036148d4575050612aae565b6002840154806148f05786600286015560019550505050612aae565b8681036148ff57505050612aae565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f208054612cc757600191821c8381018690558083019182905590821b8217831955909250612aae565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c17156149df57633995943b5f526004601cfd5b505f5b83811461210757365f8260051b850135808601602081019350803592505084828401118160401c1715614a1c57633995943b5f526004601cfd5b50614a28898383611f06565b50506001016149e2565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163303614a945760208114614a835760405163438e981560e11b815260040160405180910390fd5b614a8f84848435612dc7565b612107565b80614ac357333014614ab8576040516282b42960e81b815260040160405180910390fd5b614a8f84845f612dc7565b6020811015614ae55760405163438e981560e11b815260040160405180910390fd5b8135614af9686d3d4e7fb92a5238136118f4565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f5f614b56614b3c888886611696565b602080871081881802188088019080880390881102610954565b9150915081614b77576040516282b42960e81b815260040160405180910390fd5b614b82878783612dc7565b50505050505050505050565b5f385f3884865af16110855763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f5114166143b457803d853b1517106143b4576390b8ec185f526004601cfd5b5f604051855f5260ff851660205283604052826060526020604060805f60015afa505f6060523d6060185191508060405250949350505050565b614c2d81868585612238565b614c52578085848460405163f78c1b5360e01b8152600401613c5694939291906158b2565b613c788585858585614d2c565b604051815160051b8101602001818084035b808201518252816020019150828203614c71575060405250919050565b80515f82528060051b8201601f19602084015b602001828111614cdc5780518282018051828111614cc157505050614ca1565b5b602082015283018051828111614cc2575060200152614ca1565b5050509052565b60028151106118fd576020810160408201600183510160051b83015b8151835114614d1357602083019250815183525b602082019150808203614cff57505081900360051c9052565b604051828482375f388483888a5af1612109573d5f823e3d81fd5b5f5f83601f840112614d57575f5ffd5b5081356001600160401b03811115614d6d575f5ffd5b60208301915083602082850101111561481c575f5ffd5b5f5f5f60408486031215614d96575f5ffd5b8335925060208401356001600160401b03811115614db2575f5ffd5b614dbe86828701614d47565b9497909650939450505050565b5f60208284031215614ddb575f5ffd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f602082015160038110614e4557614e45614de2565b8060208501525060408201511515604084015260608201516080606085015261244a6080850182614df6565b602081525f610dc56020830184614e24565b6001600160a01b03811681146118fd575f5ffd5b80151581146118fd575f5ffd5b8035610f5581614e97565b5f5f5f5f60808587031215614ec2575f5ffd5b843593506020850135614ed481614e83565b925060408501356001600160e01b031981168114614ef0575f5ffd5b91506060850135614f0081614e97565b939692955090935050565b5f5f5f60608486031215614f1d575f5ffd5b8335614f2881614e83565b92506020840135614f3881614e83565b91506040840135614f4881614e97565b809150509250925092565b5f60208284031215614f63575f5ffd5b8135610dc581614e83565b803560068110610f55575f5ffd5b5f5f5f60608486031215614f8e575f5ffd5b833592506020840135614fa081614e83565b9150614fae60408501614f6e565b90509250925092565b5f8151808452602084019350602083015f5b82811015614fe7578151865260209586019590910190600101614fc9565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561504857605f19878603018452615033858351614e24565b94506020938401939190910190600101615017565b5050505082810360208401526129d48185614fb7565b5f5f6020838503121561506f575f5ffd5b82356001600160401b03811115615084575f5ffd5b61509085828601614d47565b90969095509350505050565b5f602082840312156150ac575f5ffd5b81356001600160c01b0381168114610dc5575f5ffd5b5f5f5f5f608085870312156150d5575f5ffd5b8435935060208501356150e781614e83565b92506150f560408601614f6e565b9396929550929360600135925050565b602080825282518282018190525f918401906040840190835b818110156151455783516001600160a01b031683526020938401939092019160010161511e565b509095945050505050565b5f5f83601f840112615160575f5ffd5b5081356001600160401b03811115615176575f5ffd5b6020830191508360208260051b850101111561481c575f5ffd5b5f5f5f604084860312156151a2575f5ffd5b83356001600160401b038111156151b7575f5ffd5b6151c386828701615150565b909790965060209590950135949350505050565b5f5f5f606084860312156151e9575f5ffd5b833592506020840135614f3881614e83565b60ff60f81b8816815260e060208201525f61521960e0830189614df6565b828103604084015261522b8189614df6565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b81811015615280578351835260209384019390920191600101615262565b50909b9a5050505050505050505050565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b03811182821017156152c7576152c7615291565b60405290565b5f82601f8301126152dc575f5ffd5b81356001600160401b038111156152f5576152f5615291565b604051601f8201601f19908116603f011681016001600160401b038111828210171561532357615323615291565b60405281815283820160200185101561533a575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f60208284031215615366575f5ffd5b81356001600160401b0381111561537b575f5ffd5b82016080818503121561538c575f5ffd5b6153946152a5565b813564ffffffffff811681146153a8575f5ffd5b81526020820135600381106153bb575f5ffd5b60208201526153cc60408301614ea4565b604082015260608201356001600160401b038111156153e9575f5ffd5b6153f5868285016152cd565b606083015250949350505050565b5f5f60208385031215615414575f5ffd5b82356001600160401b03811115615429575f5ffd5b61509085828601615150565b6006811061544557615445614de2565b9052565b5f8151808452602084019350602083015f5b82811015614fe757815180516001600160a01b031687526020808201515f91615486908a0182615435565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e0909501946020919091019060010161545b565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561552657605f19878603018452615511858351615449565b945060209384019391909101906001016154f5565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b8381101561557f57601f19868403018552615569838351614fb7565b602095860195909350919091019060010161554d565b509098975050505050505050565b602081525f610dc56020830184614df6565b602081525f610dc56020830184615449565b5f5f604083850312156155c2575f5ffd5b82356155cd81614e83565b915060208301356155dd81614e97565b809150509250929050565b602081525f610dc56020830184614fb7565b5f5f5f5f5f6080868803121561560e575f5ffd5b85359450602086013593506040860135925060608601356001600160401b03811115615638575f5ffd5b61564488828901614d47565b969995985093965092949392505050565b5f5f60408385031215615666575f5ffd5b8235915061567660208401614f6e565b90509250929050565b5f5f5f5f60608587031215615692575f5ffd5b8435935060208501356156a481614e83565b925060408501356001600160401b038111156156be575f5ffd5b6156ca87828801614d47565b95989497509550505050565b5f602082840312156156e6575f5ffd5b8151610dc581614e83565b634e487b7160e01b5f52601160045260245ffd5b818103818111156114a0576114a06156f1565b5f60208284031215615728575f5ffd5b8151610dc581614e97565b8381526001600160a01b03831660208201526060810161244a6040830184615435565b634e487b7160e01b5f52603260045260245ffd5b5f6001820161577b5761577b6156f1565b5060010190565b8481526001600160a01b0384166020820152608081016157a56040830185615435565b82606083015295945050505050565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f61244a6020830184866157b4565b5f5f8335601e19843603018112615804575f5ffd5b8301803591506001600160401b0382111561581d575f5ffd5b60200191503681900382131561481c575f5ffd5b808201808211156114a0576114a06156f1565b5f85518060208801845e60d886901b6001600160d81b0319169083019081526003851061587357615873614de2565b60f894851b600582015292151590931b6006830152506007019392505050565b5f826158ad57634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f906141de90830184866157b456fe3232323232323232323232323232323232323232323232323232323232323232a2646970667358221220ac05d7784f4de3b3ed3805f40121851e23030460e64732c5139259541a9d06e964736f6c634300081d0033" as const;


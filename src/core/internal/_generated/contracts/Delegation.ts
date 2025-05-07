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
        "internalType": "struct Delegation.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum Delegation.KeyType"
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
        "internalType": "struct Delegation.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum Delegation.KeyType"
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
        "internalType": "struct Delegation.Key[]",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum Delegation.KeyType"
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
        "internalType": "struct Delegation.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum Delegation.KeyType"
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
        "internalType": "struct Delegation.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum Delegation.KeyType"
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
        "internalType": "struct Delegation.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum Delegation.KeyType"
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

export const code = "0x61014060405260405161585c38038061585c833981016040819052610023916100e6565b306080524660a052606080610071604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264302e312e3160d81b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610113565b5f602082840312156100f6575f5ffd5b81516001600160a01b038116811461010c575f5ffd5b9392505050565b60805160a05160c05160e05161010051610120516156e66101765f395f818161068f015281816116e001528181611d8e01528181611e52015261484301525f6131f301525f6132ad01525f61328701525f61323701525f61321401526156e65ff3fe608060405260043610610280575f3560e01c80637b8e4ecc1161014e578063cebfe336116100c0578063e9ae5c5311610079578063e9ae5c531461087e578063f81d87a714610891578063faba56d8146108b0578063fac750e0146108cf578063fcd4e707146108e3578063ff619c6b1461090b57610287565b8063cebfe336146107ad578063d03c7914146107cc578063dcc09ebf146107eb578063e28250b414610817578063e537b27b14610833578063e5adda711461085257610287565b8063ad07708311610112578063ad077083146106e3578063b70e36f014610702578063b75c7dc614610721578063bc2c554a14610740578063bf5309691461076d578063cb4774c41461078c57610287565b80637b8e4ecc1461064357806384b0196e1461065757806394430fa51461067e5780639e49fbf1146106b1578063a840fe49146106c457610287565b80632f3f30c7116101f2578063598daac4116101ab578063598daac4146105735780635f7c23ab1461059257806360d2f33d146105be5780636c95d5a7146105f15780636fd91454146106055780637656d3041461062457610287565b80632f3f30c7146104b257806335058501146104cc57806336745d10146104e65780633e1b0812146105155780634223b5c214610534578063515c9d6d1461055357610287565b8063164b859911610244578063164b8599146103bf5780631a37ef23146103de5780631a912f3e146103fd57806320606b701461043e5780632081a278146104715780632150c5181461049057610287565b80630cef73b4146102c057806311a86fd6146102fb57806312aaac701461033a578063136a12f7146103665780631626ba7e1461038757610287565b3661028757005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a02821417156102b257806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102cb575f5ffd5b506102df6102da366004614b8b565b61092a565b6040805192151583526020830191909152015b60405180910390f35b348015610306575f5ffd5b5061032273323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102f2565b348015610345575f5ffd5b50610359610354366004614bd2565b610b26565b6040516102f29190614c78565b348015610371575f5ffd5b50610385610380366004614cad565b610c15565b005b348015610392575f5ffd5b506103a66103a1366004614b8b565b610d3a565b6040516001600160e01b031990911681526020016102f2565b3480156103ca575f5ffd5b506103856103d9366004614d07565b610da2565b3480156103e9575f5ffd5b506103856103f8366004614d4b565b610e69565b348015610408575f5ffd5b506104307f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102f2565b348015610449575f5ffd5b506104307f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b34801561047c575f5ffd5b5061038561048b366004614d74565b610ec0565b34801561049b575f5ffd5b506104a461100f565b6040516102f2929190614de0565b3480156104bd575f5ffd5b506103a6630707070760e51b81565b3480156104d7575f5ffd5b506103a6631919191960e11b81565b3480156104f1575f5ffd5b50610505610500366004614e4d565b611179565b60405190151581526020016102f2565b348015610520575f5ffd5b5061043061052f366004614e8b565b6112dd565b34801561053f575f5ffd5b5061035961054e366004614bd2565b611313565b34801561055e575f5ffd5b506104305f5160206156915f395f51905f5281565b34801561057e575f5ffd5b5061038561058d366004614eb1565b61134b565b34801561059d575f5ffd5b506105b16105ac366004614d4b565b61149d565b6040516102f29190614ef4565b3480156105c9575f5ffd5b506104307f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b3480156105fc575f5ffd5b506105056114b0565b348015610610575f5ffd5b5061043061061f366004614f7f565b6114cd565b34801561062f575f5ffd5b5061038561063e366004614fc6565b6115e9565b34801561064e575f5ffd5b506105b161169b565b348015610662575f5ffd5b5061066b6116af565b6040516102f29796959493929190614fea565b348015610689575f5ffd5b506103227f000000000000000000000000000000000000000000000000000000000000000081565b6103856106bf366004614bd2565b6116d5565b3480156106cf575f5ffd5b506104306106de366004615145565b611734565b3480156106ee575f5ffd5b506105b16106fd366004614bd2565b61176d565b34801561070d575f5ffd5b5061038561071c366004614bd2565b61177b565b34801561072c575f5ffd5b5061038561073b366004614bd2565b6117e3565b34801561074b575f5ffd5b5061075f61075a3660046151f2565b611838565b6040516102f29291906152be565b348015610778575f5ffd5b50610385610787366004614e4d565b61196f565b348015610797575f5ffd5b506107a0611a13565b6040516102f2919061537c565b3480156107b8575f5ffd5b506104306107c7366004615145565b611a27565b3480156107d7575f5ffd5b506105056107e6366004614bd2565b611a8f565b3480156107f6575f5ffd5b5061080a610805366004614bd2565b611ab2565b6040516102f2919061538e565b348015610822575f5ffd5b50686d3d4e7fb92a52381454610430565b34801561083e575f5ffd5b5061038561084d3660046153a0565b611c76565b34801561085d575f5ffd5b5061087161086c366004614bd2565b611d27565b6040516102f291906153d3565b61038561088c366004614b8b565b611d3a565b34801561089c575f5ffd5b506103856108ab3660046153e5565b611d66565b3480156108bb575f5ffd5b506104306108ca366004615440565b611f45565b3480156108da575f5ffd5b50610430612059565b3480156108ee575f5ffd5b506108f861c1d081565b60405161ffff90911681526020016102f2565b348015610916575f5ffd5b50610505610925366004615461565b61206c565b5f806041831460408414171561095a5730610946868686612286565b6001600160a01b03161491505f9050610b1e565b602183101561096d57505f905080610b1e565b506020198281018381118185180281189385019182013591601f19013560ff161561099e5761099b8661230e565b95505b505f6109a982610b26565b805190915064ffffffffff1642811090151516156109ca575f925050610b1e565b5f816020015160028111156109e1576109e1614be9565b03610a3c575f80603f86118735810290602089013502915091505f5f610a20856060015180516020820151604090920151603f90911191820292910290565b91509150610a318a8585858561232c565b965050505050610b1c565b600181602001516002811115610a5457610a54614be9565b03610ad957606081810151805160208083015160409384015184518084018d9052855180820385018152601f8c018590049094028101870186529485018a8152603f9490941091820295910293610ad0935f92610ac9928d918d918291018382808284375f920191909152506123c592505050565b85856124ad565b94505050610b1c565b600281602001516002811115610af157610af1614be9565b03610b1c57610b198160600151806020019051810190610b1191906154b8565b8787876125cc565b92505b505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f828152686d3d4e7fb92a52381760205260408120610b66906126ac565b8051909150610b885760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610b9c8383016020015190565b60d881901c855260c881901c915060d01c60ff166002811115610bc157610bc1614be9565b84602001906002811115610bd757610bd7614be9565b90816002811115610bea57610bea614be9565b90525060ff811615156040850152610c0783838151811082025290565b606085015250919392505050565b333014610c34576040516282b42960e81b815260040160405180910390fd5b8380610c5357604051638707510560e01b815260040160405180910390fd5b5f5160206156915f395f51905f528514610c8e57610c7085612712565b15610c8e57604051630442081560e01b815260040160405180910390fd5b610c988484612776565b15610cb6576040516303a6f8c760e21b815260040160405180910390fd5b610cd960e084901c606086901b1783610800610cd18961279e565b9291906127ed565b50604080518681526001600160a01b03861660208201526001600160e01b0319851681830152831515606082015290517f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e19181900360800190a15050505050565b5f5f5f610d4886868661092a565b90925090508115158115151615610d7e57610d6281612712565b80610d7b5750610d7b33610d7583612816565b90612845565b91505b81610d8d5763ffffffff610d93565b631626ba7e5b60e01b925050505b9392505050565b333014610dc1576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813610dde686d3d4e7fb92a52381985612845565b610dfa576040516282b42960e81b815260040160405180910390fd5b610e138383610200610e0b886128ef565b929190612928565b50826001600160a01b0316846001600160a01b03167f22e306b6bdb65906c2b1557fba289ced7fe45decec4c8df8dbc9c21a65ac305284604051610e5b911515815260200190565b60405180910390a350505050565b333014610e88576040516282b42960e81b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c5251905550565b50565b333014610edf576040516282b42960e81b815260040160405180910390fd5b8280610efe57604051638707510560e01b815260040160405180910390fd5b610f0784612712565b15610f255760405163f2fee1e160e01b815260040160405180910390fd5b5f610f2f8561279e565b6001600160a01b0385165f908152600282016020526040902060019091019150610f7d846005811115610f6457610f64614be9565b8254600160ff9092169190911b80198216845516151590565b15610f9d575f610f8c82612943565b03610f9d57610f9b828661295e565b505b610fcc816001015f866005811115610fb757610fb7614be9565b60ff1681526020019081526020015f205f9055565b7fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a27868686604051610fff939291906154d3565b60405180910390a1505050505050565b6060805f61101b612059565b9050806001600160401b0381111561103557611035615080565b60405190808252806020026020018201604052801561108457816020015b604080516080810182525f80825260208083018290529282015260608082015282525f199092019101816110535790505b509250806001600160401b0381111561109f5761109f615080565b6040519080825280602002602001820160405280156110c8578160200160208202803683370190505b5091505f805b8281101561116e575f6110ef82686d3d4e7fb92a5238135b60030190612a93565b90505f6110fb82610b26565b805190915064ffffffffff16428110901515161561111a575050611166565b8087858151811061112d5761112d6154f6565b60200260200101819052508186858151811061114b5761114b6154f6565b6020908102919091010152836111608161551e565b94505050505b6001016110ce565b508084528252509091565b686d3d4e7fb92a523814545f90686d3d4e7fb92a52381390156111a05760019150506112d7565b365f365f6111ae8888612adc565b604080518481526001850160051b8101909152939750919550935091505f5b8481101561126f57600581901b860135860180359060208082013591604081013501908101903561125f856112507f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876112318888612b48565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b50505050508060010190506111cd565b505f61128e3061128784805160051b60209091012090565b8635612b59565b905080156020841017156112b55760405163e483bbcb60e01b815260040160405180910390fd5b6001870181905585856112c982825f612b8a565b600199505050505050505050505b92915050565b6001600160c01b0381165f908152686d3d4e7fb92a5238156020526040808220549083901b67ffffffffffffffff1916176112d7565b604080516080810182525f80825260208201819052918101919091526060808201526112d761035483686d3d4e7fb92a5238136110e6565b33301461136a576040516282b42960e81b815260040160405180910390fd5b838061138957604051638707510560e01b815260040160405180910390fd5b61139285612712565b156113b05760405163f2fee1e160e01b815260040160405180910390fd5b5f6113ba8661279e565b60010190506113cb81866040613020565b506001600160a01b0385165f90815260018201602052604090206114118560058111156113fa576113fa614be9565b8254600160ff9092169190911b8082178455161590565b505f816001015f87600581111561142a5761142a614be9565b60ff1681526020019081526020015f2090505f6114468261305c565b868152905061145582826130a6565b7f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a8989898960405161148a9493929190615536565b60405180910390a1505050505050505050565b60606112d76114ab836128ef565b6130ef565b5f6114c830686d3d4e7fb92a523813600101546131c3565b905090565b5f806114e98460408051828152600190920160051b8201905290565b90505f5b8481101561156657600581901b86013586018035801530021790602080820135916040810135019081019035611556856112507f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876112318888612b48565b50505050508060010190506114ed565b5061c1d060f084901c145f6115c07f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b9050816115d5576115d0816131f1565b6115de565b6115de81613307565b979650505050505050565b333014611608576040516282b42960e81b815260040160405180910390fd5b5f838152686d3d4e7fb92a523817602052604090205460ff1661163e5760405163395ed8c160e21b815260040160405180910390fd5b61164f8282610200610e0b87612816565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc998360405161168e911515815260200190565b60405180910390a3505050565b60606114c8686d3d4e7fb92a5238196130ef565b600f60f81b6060805f8080836116c361337b565b97989097965046955030945091925090565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461171d576040516282b42960e81b815260040160405180910390fd5b610ebd686d3d4e7fb92a5238135b600201826133bb565b5f6112d78260200151600281111561174e5761174e614be9565b60ff168360600151805190602001205f1c5f9182526020526040902090565b60606112d76114ab83612816565b33301461179a576040516282b42960e81b815260040160405180910390fd5b6117ad686d3d4e7fb92a523815826133d2565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b333014611802576040516282b42960e81b815260040160405180910390fd5b61180b8161343c565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b0381111561185457611854615080565b60405190808252806020026020018201604052801561188757816020015b60608152602001906001900390816118725790505b509250806001600160401b038111156118a2576118a2615080565b6040519080825280602002602001820160405280156118d557816020015b60608152602001906001900390816118c05790505b5091505f5b81811015611966576119038686838181106118f7576118f76154f6565b90506020020135611ab2565b848281518110611915576119156154f6565b6020026020010181905250611941868683818110611935576119356154f6565b90506020020135611d27565b838281518110611953576119536154f6565b60209081029190910101526001016118da565b50509250929050565b33301461198e576040516282b42960e81b815260040160405180910390fd5b6119d682828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f920191909152506119d0925061269f915050565b906134a7565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611a07929190615590565b60405180910390a15050565b60606114c8686d3d4e7fb92a5238136126ac565b5f333014611a47576040516282b42960e81b815260040160405180910390fd5b611a50826134ff565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611a829190614c78565b60405180910390a2919050565b5f6112d76001600160f81b031980841614611aa9846135a8565b15159015151790565b60605f611abe8361279e565b6001019050611ad96040518060200160405280606081525090565b5f611ae3836135ba565b90505f5b81811015611c6c575f611afa858361360b565b6001600160a01b0381165f9081526001870160205260408120919250611b1f82613664565b90505f5b8151811015611c5d575f828281518110611b3f57611b3f6154f6565b602002602001015190505f611b68856001015f8460ff1681526020019081526020015f2061305c565b9050611ba56040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166005811115611bba57611bba614be9565b81602001906005811115611bd057611bd0614be9565b90816005811115611be357611be3614be9565b9052506001600160a01b03871681528151604080830191909152820151608082015260208201516060820152611c284260ff851660058111156108ca576108ca614be9565b60c08201819052608082015160608301519111150260a082015280611c4d8b826136bd565b5050505050806001019050611b23565b50505050806001019050611ae7565b5050519392505050565b333014611c95576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813611cb6686d3d4e7fb92a5238198484610200612928565b5081611cdd576001600160a01b0383165f9081526007820160205260409020805460010190555b826001600160a01b03167f31471c9e79dc8535d9341d73e61eaf5e72e4134b3e5b16943305041201581d8883604051611d1a911515815260200190565b60405180910390a2505050565b60606112d7611d358361279e565b613766565b6001600160f81b03198084169003611d5b57611d56828261381f565b505050565b611d568383836138bc565b813580830190604081901c602084101715611d7f575f5ffd5b50611df8336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611def30611dc06020860186614d4b565b6001600160a01b03161430611ddb6080870160608801614d4b565b6001600160a01b0316149015159015151790565b15159015151690565b611e14576040516282b42960e81b815260040160405180910390fd5b30611e256080830160608401614d4b565b6001600160a01b031603611ea5575f80611e47866102da6101c08601866155a3565b915091508096505f197f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03163103611e8557600191505b81611ea2576040516282b42960e81b815260040160405180910390fd5b50505b611ed0611eb860a0830160808401614d4b565b611eca6101a084016101808501614d4b565b8861393e565b841580611ee15750611ee185612712565b611f3d575f611eef8661279e565b600181019150611f3b906002015f611f0d60a0860160808701614d4b565b6001600160a01b0316815260208101919091526040015f20611f3560a0850160808601614d4b565b89613961565b505b505050505050565b5f80826005811115611f5957611f59614be9565b03611f6c57603c808404025b90506112d7565b6001826005811115611f8057611f80614be9565b03611f9157610e1080840402611f65565b6002826005811115611fa557611fa5614be9565b03611fb7576201518080840402611f65565b6003826005811115611fcb57611fcb614be9565b03611ff1576007600362015180808604918201929092069003620545ff85110202611f65565b5f5f611ffc85613a86565b509092509050600484600581111561201657612016614be9565b036120305761202782826001613b30565b925050506112d7565b600584600581111561204457612044614be9565b036120555761202782600180613b30565b5f5ffd5b5f6114c8686d3d4e7fb92a523816613b87565b5f8461207a5750600161227e565b61208385612712565b156120905750600161227e565b631919191960e11b600483106120a4575082355b826120b35750630707070760e51b5b6120bd8582612776565b156120cb575f91505061227e565b5f6120d58761279e565b90506120e081613b87565b1561219d576120fb60e083901c606088901b175b8290613bd3565b1561210b5760019250505061227e565b61211e6332323232606088901b176120f4565b1561212e5760019250505061227e565b61215460e083901c73191919191919191919191919191919191919191960611b176120f4565b156121645760019250505061227e565b61218d7f32323232323232323232323232323232323232320000000000000000323232326120f4565b1561219d5760019250505061227e565b6121b35f5160206156915f395f51905f5261279e565b90506121be81613b87565b15612278576121d660e083901c606088901b176120f4565b156121e65760019250505061227e565b6121f96332323232606088901b176120f4565b156122095760019250505061227e565b61222f60e083901c73191919191919191919191919191919191919191960611b176120f4565b1561223f5760019250505061227e565b6122687f32323232323232323232323232323232323232320000000000000000323232326120f4565b156122785760019250505061227e565b5f925050505b949350505050565b5f60405182604081146122a157604181146122c857506122f9565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526122d9565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d612306575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d61232757fe5b919050565b5f6040518681528560208201528460408201528360608201528260808201525f5f5260205f60a0836101005afa503d612390576d1ab2e8006fd8b71907bf06a5bdee3b6123905760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa61239057fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6123fa6040518060c0016040528060608152602001606081526020015f81526020015f81526020015f81526020015f81525090565b815160c081106124a75760208301818101818251018281108260c08301111715612426575050506124a7565b808151019250806020820151018181108382111782851084861117171561245057505050506124a7565b828151602083010111838551602087010111171561247157505050506124a7565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f5f5f6124bc88600180613c57565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c51015116146020831188161696505085156125a057602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d90506125a057fe5b50505082156125c1576125be8287608001518860a00151888861232c565b92505b505095945050505050565b5f6001600160a01b0385161561227e57604051853b61265c5782604081146125fc57604181146126235750612696565b60208581013560ff81901c601b0190915285356040526001600160ff1b0316606052612634565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f60605280604052612696565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b686d3d4e7fb92a52381390565b60405181546020820190600881901c5f8260ff8417146126da57505080825260ff8116601f808211156126fc575b855f5260205f205b8160051c810154828601526020820191508282106126e257505b508084525f920191825250602001604052919050565b5f818152686d3d4e7fb92a52381760205260408120805460ff808216908114801590910260089290921c02178061275c5760405163395ed8c160e21b815260040160405180910390fd5b612769825f198301613d48565b60ff161515949350505050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f5160206156915f395f51905f5283146127c2576127bd83613db5565b6127d1565b5f5160206156915f395f51905f525b68a3bbbebc65eb8804df6009525f908152602990209392505050565b5f82612802576127fd8585613de2565b61280d565b61280d858584613ee0565b95945050505050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81208190610d9b565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016128805763f5a267f15f526004601cfd5b826128925768fbb67fda52d4bfb8bf92505b80546001600160601b0381166128d65760019250838160601c03156128e757600182015460601c84146128e757600282015460601c84146128e7575b5f92506128e7565b81602052835f5260405f2054151592505b505092915050565b6001600160a01b0381165f908152686d3d4e7fb92a52381a602052604081208054601f5263d4203f8b6004528152603f81208190610d9b565b5f82612938576127fd858561295e565b61280d858584613020565b5f81545b80156124a757600191820191811901811618612947565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016129995763f5a267f15f526004601cfd5b826129ab5768fbb67fda52d4bfb8bf92505b80546001600160601b03811680612a255760019350848260601c036129e35760018301805484556002840180549091555f9055612a8a565b84600184015460601c03612a045760028301805460018501555f9055612a8a565b84600284015460601c03612a1d575f6002840155612a8a565b5f9350612a8a565b82602052845f5260405f20805480612a3e575050612a8a565b60018360011c039250826001820314612a6e578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612abd83613b87565b82106112d757604051634e23d03560e01b815260040160405180910390fd5b365f8080612aea8686613efd565b93509350612b0086866040908111913510171590565b15612b3f57602085870103866020013580880160208101945080359350828482011182851760401c1715612b3b5763ba597e7e5f526004601cfd5b5050505b92959194509250565b5f8183604051375060405120919050565b5f82815260a082901c602052604090206001600160a01b0316612b7d848284613f93565b610d9b57505f9392505050565b801580612b9b5750612b9b81612712565b15612bab57611d56838383613fef565b5f612bb58261279e565b6001019050612c236040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f612c2d836135ba565b90505f5b81811015612c7f575f612c44858361360b565b90506001600160a01b03811615612c76576040840151612c649082614046565b506060840151612c74905f6136bd565b505b50600101612c31565b505f5f5b86811015612e3d57600581901b880135880180358015300217906020808201359160408101350190810190358215612cc257612cbf83876155e5565b95505b6004811015612cd45750505050612e35565b813560e01c63a9059cbb819003612d0a576040890151612cf49086614046565b50612d08602484013560608b015190614065565b505b8063ffffffff1663095ea7b303612d525760248301355f03612d30575050505050612e35565b8851612d3c9086614046565b50612d50600484013560208b015190614065565b505b8063ffffffff166387517c4503612dca576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba314612d8c575050505050612e35565b60448301355f03612da1575050505050612e35565b612db4600484013560808b015190614065565b50612dc8602484013560a08b015190614065565b505b8063ffffffff1663598daac403612e2f576001600160a01b0385163014612df5575050505050612e35565b8a600484013514612e0a575050505050612e35565b612e1d602484013560408b015190614065565b506060890151612e2d905f6136bd565b505b50505050505b600101612c83565b50604083015151606084015151612e54919061407b565b5f612e87612e658560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b60408501515151811015612ed357604085015151600582901b0160200151612ec982612eb78330614151565b85919060059190911b82016020015290565b5050600101612e8b565b50612edf888888613fef565b5f8080526001860160205260408120612ef89184613961565b5f5b60408501515151811015612f8657604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b018352939093206060890151518301820151928601909101519091612f7c9183918591612f779190612f6c90612f638930614151565b80821191030290565b808218908210021890565b613961565b5050600101612efa565b505f5b84515151811015612fcb57845151600582901b0160200151612fc281612fbc84896020015161414190919063ffffffff16565b5f61417b565b50600101612f89565b505f5b6080850151515181101561301557608085015151600582901b016020015161300c81613007848960a0015161414190919063ffffffff16565b6141c5565b50600101612fce565b505050505050505050565b5f61302b8484614220565b90508015610d9b578161303d856135ba565b1115610d9b5760405163155176b960e11b815260040160405180910390fd5b61307d60405180606001604052805f81526020015f81526020015f81525090565b5f613087836126ac565b905080515f146124a7575f61309b8261437b565b602001949350505050565b604080518251602080830191909152830151818301529082015160608201526130eb9083906130e6906080016040516020818303038152906040526144aa565b6134a7565b5050565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c925083831415830281528161317d57821561317857600191508185015460601c92508215613178578284141590920260208301525060028381015460601c918215613178576003915083831415830260408201525b6131ad565b600191821c915b828110156131ab578581015460601c858114158102600583901b8401529350600101613184565b505b8186528160051b81016040525050505050919050565b5f5f6131ce846145c6565b905082156001600160a01b038216151715801561227e575061227e848483613f93565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f00000000000000000000000000000000000000000000000000000000000000004614166132e45750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f5f5f61331261337b565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264302e312e3160d81b9083015291565b5f5f6133c784846145e4565b600101905550505050565b604081811c5f90815260208490522080546001600160401b038316101561340c576040516312ee5c9360e01b815260040160405180910390fd5b613436613430836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f818152686d3d4e7fb92a52381760209081526040808320839055686d3d4e7fb92a523818909152902080546001019055686d3d4e7fb92a52381361348a686d3d4e7fb92a52381683613de2565b6130eb5760405163395ed8c160e21b815260040160405180910390fd5b80518060081b60ff175f60fe83116134d0575050601f8281015160081b821790808311156134f7575b60208401855f5260205f205b828201518360051c8201556020830192508483106134dc5750505b509092555050565b5f81604001511561353457613517826020015161462a565b613534576040516321b9b33960e21b815260040160405180910390fd5b61353d82611734565b90505f686d3d4e7fb92a52381360608401518451602080870151604080890151905195965061359495613572959493016155f8565b60408051601f198184030181529181525f8581526004850160205220906134a7565b6135a16003820183614646565b5050919050565b5f6135b282614758565b151592915050565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c1517613603576001935083830154156136035760029350838301541561360357600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf8214158202915061363e846135ba565b831061365d57604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b80156136a75761ffff811661368c576010918201911c613671565b8183526020600582901b16909201916001918201911c613671565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c5536020840351818106158282040290508083106137555782811781018115826020018701604051181761372157828102601f198701528501602001604052613755565b602060405101816020018101604052808a52601f19855b888101518382015281018061373857509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf9060208401816137df57835480156137d9578084141502815260018481015490925080156137d9578084141502602082015260028481015490925080156137d9576003925083811415810260408301525b5061380a565b8160011c91505f5b8281101561380857848101548481141502600582901b8301526001016137e7565b505b8185528160051b810160405250505050919050565b686d3d4e7fb92a523813823560601c601483811881851002188085019080851190850302613856686d3d4e7fb92a52381984612845565b613872576040516282b42960e81b815260040160405180910390fd5b3330146138a25761388633610d75856128ef565b6138a2576040516282b42960e81b815260040160405180910390fd5b604051818382375f388383875af4611f3b573d5f823e3d81fd5b5f6138c684614758565b9050806003036138e1576138db8484846147a1565b50505050565b365f365f846138f757637f1812755f526004601cfd5b5085358087016020810194503592505f90604011600286141115613925575050602080860135860190810190355b61393488888887878787614839565b5050505050505050565b6001600160a01b03831661395657611d568282614995565b611d568383836149ae565b8061396b57505050565b5f61397584613664565b905080515f0361399857604051635ee7e5b160e01b815260040160405180910390fd5b5f5b8151811015613a7f575f8282815181106139b6576139b66154f6565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f6139e38261305c565b90505f6139ff428560ff1660058111156108ca576108ca614be9565b90508082604001511015613a1b57604082018190525f60208301525b815f01518783602001818151613a3191906155e5565b9150818152501115613a665760405163482a648960e11b81526001600160a01b03891660048201526024015b60405180910390fd5b613a7083836130a6565b5050505080600101905061399a565b5050505050565b5f8080613b23613a996201518086615647565b5f5f5f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c9250806135a15781545f9350156135a1576001925082820154156135a1576002925082820154156135a1575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613c005763f5a267f15f526004601cfd5b82613c125768fbb67fda52d4bfb8bf92505b801954613c4357805460019250831461365d576001810154831461365d576002810154831461365d575f915061365d565b602052505f90815260409020541515919050565b606083518015612306576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613cd2579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f82548060ff821714613d9057601e8311613d675780831a915061365d565b8060ff168311613d8b57835f52601f83038060051c60205f200154601f82161a9250505b61365d565b8060081c831161365d57835f528260051c60205f200154601f84161a91505092915050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81206112d7565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613e0f5763f5a267f15f526004601cfd5b82613e215768fbb67fda52d4bfb8bf92505b80195480613e82576001925083825403613e4e5760018201805483556002830180549091555f90556128e7565b83600183015403613e6c5760028201805460018401555f90556128e7565b836002830154036128ce575f60028301556128e7565b81602052835f5260405f20805480613e9b5750506128e7565b60018360011c039250826001820314613ec557828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f613eeb8484614646565b90508015610d9b578161303d85613b87565b365f833580850160208587010360208201945081359350808460051b8301118360401c1715613f335763ba597e7e5f526004601cfd5b8315613f89578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c1715613f805763ba597e7e5f526004601cfd5b50505082613f3d575b5050509250929050565b5f82815260208082206080909152601f8390526305d78094600b526019602720613fe56001600160a01b03871680151590613fd184601b8a886149ee565b6001600160a01b0316149015159015151690565b9695505050505050565b5f82613ffb5750505050565b600581901b8401358401803580153002179060208082013591604081013501908101903561402c848484848a614a28565b50505050838390508160010191508103613ffb5750505050565b604080516060815290819052610d9b83836001600160a01b03166136bd565b604080516060815290819052610d9b83836136bd565b604051815183511461409957634e487b715f5260326020526024601cfd5b82516140a457505050565b5f5f6140af85614a66565b6140b885614a66565b915091506140c585614a95565b6140ce85614aea565b848403601f196020870187518752875160051b3684830137845160051b5b8086015181860151835b82815114614106576020016140f6565b86018051820180825282111561412857634e487b715f5260116020526024601cfd5b5050508201806140ec5750505050826040525050505050565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f5114166141bb57803d853b1517106141bb57633e3f8f735f526004601cfd5b505f603452505050565b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af1611d56576396b3de235f526004601cfd5b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be19830161425b5763f5a267f15f526004601cfd5b8261426d5768fbb67fda52d4bfb8bf92505b80546001600160601b038116826020528061432f578160601c8061429b578560601b84556001945050612a8a565b8581036142a85750612a8a565b600184015460601c806142c9578660601b6001860155600195505050612a8a565b8681036142d7575050612a8a565b600285015460601c806142f9578760601b600287015560019650505050612a8a565b87810361430857505050612a8a565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f20805461437157600191821c80830182559194508161435d578560601b600317845550612a8a565b8560601b8285015582600201845550612a8a565b5050505092915050565b60606143d3565b6fffffffffffffffffffffffffffffffff811160071b81811c6001600160401b031060061b1781811c63ffffffff1060051b1781811c61ffff1060041b1790811c60ff1060039190911c17601f1890565b8151156123275760405190506004820180518351846020010160ff8115190460071b196020850183198552866020015b8051805f1a61445c57600190811a016080811161443c57803684378083019250600282019150848210614436575061448c565b50614403565b5f198352918201607f19019160029190910190848210614436575061448c565b80835283811684011783171961447181614382565b90150182828603828111818418021801925001838110614403575b509290935250601f198382030183525f815260200160405250919050565b6040518151602082019083015b8084146145a5576001840193508351601f1a80614544575b6020850151806145135785830360208181189082110218607f839003818111818318021896870196928301929050601f811161450c575050614534565b50506144cf565b61451c81614382565b90508583038181118183180218958601959190910190505b60f01b82526002909101906144b7565b60ff8103614596576020808601511980156145655761456281614382565b91505b508583038181118282180218601f81811890821102186080811760f01b8552959095019450506002909101906144b7565b808353506001820191506144b7565b50600482018051199052601f198282030182525f8152602001604052919050565b5f60205f5f843c5f5160f01c61ef011460035160601c029050919050565b604081811c5f90815260208490522080546001600160401b0380841682149082101661462357604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f8082600281111561463e5761463e614be9565b141592915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036146735763f5a267f15f526004601cfd5b826146855768fbb67fda52d4bfb8bf92505b8019548160205280614729578154806146a55784835560019350506128e7565b8481036146b257506128e7565b6001830154806146cd578560018501556001945050506128e7565b8581036146db5750506128e7565b6002840154806146f757866002860155600195505050506128e7565b868103614706575050506128e7565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f208054612a8a57600191821c8381018690558083019182905590821b82178319559092506128e7565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c17156147e657633995943b5f526004601cfd5b505f5b838114611f3b57365f8260051b850135808601602081019350803592505084828401118160401c171561482357633995943b5f526004601cfd5b5061482f898383611d3a565b50506001016147e9565b6001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016330361489b576020811461488a5760405163438e981560e11b815260040160405180910390fd5b61489684848435612b8a565b611f3b565b806148ca573330146148bf576040516282b42960e81b815260040160405180910390fd5b61489684845f612b8a565b60208110156148ec5760405163438e981560e11b815260040160405180910390fd5b8135614900686d3d4e7fb92a52381361172b565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f5f61495d6149438888866114cd565b60208087108188180218808801908088039088110261092a565b915091508161497e576040516282b42960e81b815260040160405180910390fd5b614989878783612b8a565b50505050505050505050565b5f385f3884865af16130eb5763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f5114166141bb57803d853b1517106141bb576390b8ec185f526004601cfd5b5f604051855f5260ff851660205283604052826060526020604060805f60015afa505f6060523d6060185191508060405250949350505050565b614a348186858561206c565b614a59578085848460405163f78c1b5360e01b8152600401613a5d9493929190615666565b613a7f8585858585614b33565b604051815160051b8101602001818084035b808201518252816020019150828203614a78575060405250919050565b80515f82528060051b8201601f19602084015b602001828111614ae35780518282018051828111614ac857505050614aa8565b5b602082015283018051828111614ac9575060200152614aa8565b5050509052565b6002815110610ebd576020810160408201600183510160051b83015b8151835114614b1a57602083019250815183525b602082019150808203614b0657505081900360051c9052565b604051828482375f388483888a5af1611f3d573d5f823e3d81fd5b5f5f83601f840112614b5e575f5ffd5b5081356001600160401b03811115614b74575f5ffd5b602083019150836020828501011115614623575f5ffd5b5f5f5f60408486031215614b9d575f5ffd5b8335925060208401356001600160401b03811115614bb9575f5ffd5b614bc586828701614b4e565b9497909650939450505050565b5f60208284031215614be2575f5ffd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f602082015160038110614c4c57614c4c614be9565b8060208501525060408201511515604084015260608201516080606085015261227e6080850182614bfd565b602081525f610d9b6020830184614c2b565b6001600160a01b0381168114610ebd575f5ffd5b80358015158114612327575f5ffd5b5f5f5f5f60808587031215614cc0575f5ffd5b843593506020850135614cd281614c8a565b925060408501356001600160e01b031981168114614cee575f5ffd5b9150614cfc60608601614c9e565b905092959194509250565b5f5f5f60608486031215614d19575f5ffd5b8335614d2481614c8a565b92506020840135614d3481614c8a565b9150614d4260408501614c9e565b90509250925092565b5f60208284031215614d5b575f5ffd5b8135610d9b81614c8a565b803560068110612327575f5ffd5b5f5f5f60608486031215614d86575f5ffd5b833592506020840135614d9881614c8a565b9150614d4260408501614d66565b5f8151808452602084019350602083015f5b82811015614dd6578151865260209586019590910190600101614db8565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b82811015614e3757605f19878603018452614e22858351614c2b565b94506020938401939190910190600101614e06565b50505050828103602084015261280d8185614da6565b5f5f60208385031215614e5e575f5ffd5b82356001600160401b03811115614e73575f5ffd5b614e7f85828601614b4e565b90969095509350505050565b5f60208284031215614e9b575f5ffd5b81356001600160c01b0381168114610d9b575f5ffd5b5f5f5f5f60808587031215614ec4575f5ffd5b843593506020850135614ed681614c8a565b9250614ee460408601614d66565b9396929550929360600135925050565b602080825282518282018190525f918401906040840190835b81811015614f345783516001600160a01b0316835260209384019390920191600101614f0d565b509095945050505050565b5f5f83601f840112614f4f575f5ffd5b5081356001600160401b03811115614f65575f5ffd5b6020830191508360208260051b8501011115614623575f5ffd5b5f5f5f60408486031215614f91575f5ffd5b83356001600160401b03811115614fa6575f5ffd5b614fb286828701614f3f565b909790965060209590950135949350505050565b5f5f5f60608486031215614fd8575f5ffd5b833592506020840135614d3481614c8a565b60ff60f81b8816815260e060208201525f61500860e0830189614bfd565b828103604084015261501a8189614bfd565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b8181101561506f578351835260209384019390920191600101615051565b50909b9a5050505050505050505050565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b03811182821017156150b6576150b6615080565b60405290565b5f82601f8301126150cb575f5ffd5b81356001600160401b038111156150e4576150e4615080565b604051601f8201601f19908116603f011681016001600160401b038111828210171561511257615112615080565b604052818152838201602001851015615129575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f60208284031215615155575f5ffd5b81356001600160401b0381111561516a575f5ffd5b82016080818503121561517b575f5ffd5b615183615094565b813564ffffffffff81168114615197575f5ffd5b81526020820135600381106151aa575f5ffd5b60208201526151bb60408301614c9e565b604082015260608201356001600160401b038111156151d8575f5ffd5b6151e4868285016150bc565b606083015250949350505050565b5f5f60208385031215615203575f5ffd5b82356001600160401b03811115615218575f5ffd5b614e7f85828601614f3f565b6006811061523457615234614be9565b9052565b5f8151808452602084019350602083015f5b82811015614dd657815180516001600160a01b031687526020808201515f91615275908a0182615224565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e0909501946020919091019060010161524a565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561531557605f19878603018452615300858351615238565b945060209384019391909101906001016152e4565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b8381101561536e57601f19868403018552615358838351614da6565b602095860195909350919091019060010161533c565b509098975050505050505050565b602081525f610d9b6020830184614bfd565b602081525f610d9b6020830184615238565b5f5f604083850312156153b1575f5ffd5b82356153bc81614c8a565b91506153ca60208401614c9e565b90509250929050565b602081525f610d9b6020830184614da6565b5f5f5f5f5f608086880312156153f9575f5ffd5b85359450602086013593506040860135925060608601356001600160401b03811115615423575f5ffd5b61542f88828901614b4e565b969995985093965092949392505050565b5f5f60408385031215615451575f5ffd5b823591506153ca60208401614d66565b5f5f5f5f60608587031215615474575f5ffd5b84359350602085013561548681614c8a565b925060408501356001600160401b038111156154a0575f5ffd5b6154ac87828801614b4e565b95989497509550505050565b5f602082840312156154c8575f5ffd5b8151610d9b81614c8a565b8381526001600160a01b03831660208201526060810161227e6040830184615224565b634e487b7160e01b5f52603260045260245ffd5b634e487b7160e01b5f52601160045260245ffd5b5f6001820161552f5761552f61550a565b5060010190565b8481526001600160a01b0384166020820152608081016155596040830185615224565b82606083015295945050505050565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f61227e602083018486615568565b5f5f8335601e198436030181126155b8575f5ffd5b8301803591506001600160401b038211156155d1575f5ffd5b602001915036819003821315614623575f5ffd5b808201808211156112d7576112d761550a565b5f85518060208801845e60d886901b6001600160d81b0319169083019081526003851061562757615627614be9565b60f894851b600582015292151590931b6006830152506007019392505050565b5f8261566157634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f90613fe5908301848661556856fe3232323232323232323232323232323232323232323232323232323232323232a26469706673582212203d0a04153498cd7071028a678d2e45fb6712eb4954d51b0fccd6e5b60e5fcf7064736f6c634300081d0033" as const;


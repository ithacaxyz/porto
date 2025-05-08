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

export const code = "0x610140604052604051615747380380615747833981016040819052610023916100e6565b306080524660a052606080610071604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264302e312e3160d81b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610113565b5f602082840312156100f6575f5ffd5b81516001600160a01b038116811461010c575f5ffd5b9392505050565b60805160a05160c05160e05161010051610120516155d861016f5f395f818161068f015281816116e001528181611d8e015261477701525f61313b01525f6131f501525f6131cf01525f61317f01525f61315c01526155d85ff3fe608060405260043610610280575f3560e01c80637b8e4ecc1161014e578063cebfe336116100c0578063e9ae5c5311610079578063e9ae5c531461087e578063f81d87a714610891578063faba56d8146108b0578063fac750e0146108cf578063fcd4e707146108e3578063ff619c6b1461090b57610287565b8063cebfe336146107ad578063d03c7914146107cc578063dcc09ebf146107eb578063e28250b414610817578063e537b27b14610833578063e5adda711461085257610287565b8063ad07708311610112578063ad077083146106e3578063b70e36f014610702578063b75c7dc614610721578063bc2c554a14610740578063bf5309691461076d578063cb4774c41461078c57610287565b80637b8e4ecc1461064357806384b0196e1461065757806394430fa51461067e5780639e49fbf1146106b1578063a840fe49146106c457610287565b80632f3f30c7116101f2578063598daac4116101ab578063598daac4146105735780635f7c23ab1461059257806360d2f33d146105be5780636c95d5a7146105f15780636fd91454146106055780637656d3041461062457610287565b80632f3f30c7146104b257806335058501146104cc57806336745d10146104e65780633e1b0812146105155780634223b5c214610534578063515c9d6d1461055357610287565b8063164b859911610244578063164b8599146103bf5780631a37ef23146103de5780631a912f3e146103fd57806320606b701461043e5780632081a278146104715780632150c5181461049057610287565b80630cef73b4146102c057806311a86fd6146102fb57806312aaac701461033a578063136a12f7146103665780631626ba7e1461038757610287565b3661028757005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a02821417156102b257806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102cb575f5ffd5b506102df6102da366004614abf565b61092a565b6040805192151583526020830191909152015b60405180910390f35b348015610306575f5ffd5b5061032273323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102f2565b348015610345575f5ffd5b50610359610354366004614b06565b610b26565b6040516102f29190614bac565b348015610371575f5ffd5b50610385610380366004614be1565b610c15565b005b348015610392575f5ffd5b506103a66103a1366004614abf565b610d3a565b6040516001600160e01b031990911681526020016102f2565b3480156103ca575f5ffd5b506103856103d9366004614c3b565b610da2565b3480156103e9575f5ffd5b506103856103f8366004614c7f565b610e69565b348015610408575f5ffd5b506104307f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102f2565b348015610449575f5ffd5b506104307f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b34801561047c575f5ffd5b5061038561048b366004614ca8565b610ec0565b34801561049b575f5ffd5b506104a461100f565b6040516102f2929190614d14565b3480156104bd575f5ffd5b506103a6630707070760e51b81565b3480156104d7575f5ffd5b506103a6631919191960e11b81565b3480156104f1575f5ffd5b50610505610500366004614d81565b611179565b60405190151581526020016102f2565b348015610520575f5ffd5b5061043061052f366004614dbf565b6112dd565b34801561053f575f5ffd5b5061035961054e366004614b06565b611313565b34801561055e575f5ffd5b506104305f5160206155835f395f51905f5281565b34801561057e575f5ffd5b5061038561058d366004614de5565b61134b565b34801561059d575f5ffd5b506105b16105ac366004614c7f565b61149d565b6040516102f29190614e28565b3480156105c9575f5ffd5b506104307f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b3480156105fc575f5ffd5b506105056114b0565b348015610610575f5ffd5b5061043061061f366004614eb3565b6114cd565b34801561062f575f5ffd5b5061038561063e366004614efa565b6115e9565b34801561064e575f5ffd5b506105b161169b565b348015610662575f5ffd5b5061066b6116af565b6040516102f29796959493929190614f1e565b348015610689575f5ffd5b506103227f000000000000000000000000000000000000000000000000000000000000000081565b6103856106bf366004614b06565b6116d5565b3480156106cf575f5ffd5b506104306106de366004615079565b611734565b3480156106ee575f5ffd5b506105b16106fd366004614b06565b61176d565b34801561070d575f5ffd5b5061038561071c366004614b06565b61177b565b34801561072c575f5ffd5b5061038561073b366004614b06565b6117e3565b34801561074b575f5ffd5b5061075f61075a366004615126565b611838565b6040516102f29291906151f2565b348015610778575f5ffd5b50610385610787366004614d81565b61196f565b348015610797575f5ffd5b506107a0611a13565b6040516102f291906152b0565b3480156107b8575f5ffd5b506104306107c7366004615079565b611a27565b3480156107d7575f5ffd5b506105056107e6366004614b06565b611a8f565b3480156107f6575f5ffd5b5061080a610805366004614b06565b611ab2565b6040516102f291906152c2565b348015610822575f5ffd5b50686d3d4e7fb92a52381454610430565b34801561083e575f5ffd5b5061038561084d3660046152d4565b611c76565b34801561085d575f5ffd5b5061087161086c366004614b06565b611d27565b6040516102f29190615307565b61038561088c366004614abf565b611d3a565b34801561089c575f5ffd5b506103856108ab366004615319565b611d66565b3480156108bb575f5ffd5b506104306108ca366004615374565b611e8d565b3480156108da575f5ffd5b50610430611fa1565b3480156108ee575f5ffd5b506108f861c1d081565b60405161ffff90911681526020016102f2565b348015610916575f5ffd5b50610505610925366004615395565b611fb4565b5f806041831460408414171561095a57306109468686866121ce565b6001600160a01b03161491505f9050610b1e565b602183101561096d57505f905080610b1e565b506020198281018381118185180281189385019182013591601f19013560ff161561099e5761099b86612256565b95505b505f6109a982610b26565b805190915064ffffffffff1642811090151516156109ca575f925050610b1e565b5f816020015160028111156109e1576109e1614b1d565b03610a3c575f80603f86118735810290602089013502915091505f5f610a20856060015180516020820151604090920151603f90911191820292910290565b91509150610a318a85858585612274565b965050505050610b1c565b600181602001516002811115610a5457610a54614b1d565b03610ad957606081810151805160208083015160409384015184518084018d9052855180820385018152601f8c018590049094028101870186529485018a8152603f9490941091820295910293610ad0935f92610ac9928d918d918291018382808284375f9201919091525061230d92505050565b85856123f5565b94505050610b1c565b600281602001516002811115610af157610af1614b1d565b03610b1c57610b198160600151806020019051810190610b1191906153ec565b878787612514565b92505b505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f828152686d3d4e7fb92a52381760205260408120610b66906125f4565b8051909150610b885760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610b9c8383016020015190565b60d881901c855260c881901c915060d01c60ff166002811115610bc157610bc1614b1d565b84602001906002811115610bd757610bd7614b1d565b90816002811115610bea57610bea614b1d565b90525060ff811615156040850152610c0783838151811082025290565b606085015250919392505050565b333014610c34576040516282b42960e81b815260040160405180910390fd5b8380610c5357604051638707510560e01b815260040160405180910390fd5b5f5160206155835f395f51905f528514610c8e57610c708561265a565b15610c8e57604051630442081560e01b815260040160405180910390fd5b610c9884846126be565b15610cb6576040516303a6f8c760e21b815260040160405180910390fd5b610cd960e084901c606086901b1783610800610cd1896126e6565b929190612735565b50604080518681526001600160a01b03861660208201526001600160e01b0319851681830152831515606082015290517f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e19181900360800190a15050505050565b5f5f5f610d4886868661092a565b90925090508115158115151615610d7e57610d628161265a565b80610d7b5750610d7b33610d758361275e565b9061278d565b91505b81610d8d5763ffffffff610d93565b631626ba7e5b60e01b925050505b9392505050565b333014610dc1576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813610dde686d3d4e7fb92a5238198561278d565b610dfa576040516282b42960e81b815260040160405180910390fd5b610e138383610200610e0b88612837565b929190612870565b50826001600160a01b0316846001600160a01b03167f22e306b6bdb65906c2b1557fba289ced7fe45decec4c8df8dbc9c21a65ac305284604051610e5b911515815260200190565b60405180910390a350505050565b333014610e88576040516282b42960e81b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c5251905550565b50565b333014610edf576040516282b42960e81b815260040160405180910390fd5b8280610efe57604051638707510560e01b815260040160405180910390fd5b610f078461265a565b15610f255760405163f2fee1e160e01b815260040160405180910390fd5b5f610f2f856126e6565b6001600160a01b0385165f908152600282016020526040902060019091019150610f7d846005811115610f6457610f64614b1d565b8254600160ff9092169190911b80198216845516151590565b15610f9d575f610f8c8261288b565b03610f9d57610f9b82866128a6565b505b610fcc816001015f866005811115610fb757610fb7614b1d565b60ff1681526020019081526020015f205f9055565b7fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a27868686604051610fff93929190615407565b60405180910390a1505050505050565b6060805f61101b611fa1565b9050806001600160401b0381111561103557611035614fb4565b60405190808252806020026020018201604052801561108457816020015b604080516080810182525f80825260208083018290529282015260608082015282525f199092019101816110535790505b509250806001600160401b0381111561109f5761109f614fb4565b6040519080825280602002602001820160405280156110c8578160200160208202803683370190505b5091505f805b8281101561116e575f6110ef82686d3d4e7fb92a5238135b600301906129db565b90505f6110fb82610b26565b805190915064ffffffffff16428110901515161561111a575050611166565b8087858151811061112d5761112d61542a565b60200260200101819052508186858151811061114b5761114b61542a565b60209081029190910101528361116081615452565b94505050505b6001016110ce565b508084528252509091565b686d3d4e7fb92a523814545f90686d3d4e7fb92a52381390156111a05760019150506112d7565b365f365f6111ae8888612a24565b604080518481526001850160051b8101909152939750919550935091505f5b8481101561126f57600581901b860135860180359060208082013591604081013501908101903561125f856112507f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876112318888612a90565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b50505050508060010190506111cd565b505f61128e3061128784805160051b60209091012090565b8635612aa1565b905080156020841017156112b55760405163e483bbcb60e01b815260040160405180910390fd5b6001870181905585856112c982825f612ad2565b600199505050505050505050505b92915050565b6001600160c01b0381165f908152686d3d4e7fb92a5238156020526040808220549083901b67ffffffffffffffff1916176112d7565b604080516080810182525f80825260208201819052918101919091526060808201526112d761035483686d3d4e7fb92a5238136110e6565b33301461136a576040516282b42960e81b815260040160405180910390fd5b838061138957604051638707510560e01b815260040160405180910390fd5b6113928561265a565b156113b05760405163f2fee1e160e01b815260040160405180910390fd5b5f6113ba866126e6565b60010190506113cb81866040612f68565b506001600160a01b0385165f90815260018201602052604090206114118560058111156113fa576113fa614b1d565b8254600160ff9092169190911b8082178455161590565b505f816001015f87600581111561142a5761142a614b1d565b60ff1681526020019081526020015f2090505f61144682612fa4565b86815290506114558282612fee565b7f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a8989898960405161148a949392919061546a565b60405180910390a1505050505050505050565b60606112d76114ab83612837565b613037565b5f6114c830686d3d4e7fb92a5238136001015461310b565b905090565b5f806114e98460408051828152600190920160051b8201905290565b90505f5b8481101561156657600581901b86013586018035801530021790602080820135916040810135019081019035611556856112507f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876112318888612a90565b50505050508060010190506114ed565b5061c1d060f084901c145f6115c07f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b9050816115d5576115d081613139565b6115de565b6115de8161324f565b979650505050505050565b333014611608576040516282b42960e81b815260040160405180910390fd5b5f838152686d3d4e7fb92a523817602052604090205460ff1661163e5760405163395ed8c160e21b815260040160405180910390fd5b61164f8282610200610e0b8761275e565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc998360405161168e911515815260200190565b60405180910390a3505050565b60606114c8686d3d4e7fb92a523819613037565b600f60f81b6060805f8080836116c36132c3565b97989097965046955030945091925090565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461171d576040516282b42960e81b815260040160405180910390fd5b610ebd686d3d4e7fb92a5238135b60020182613303565b5f6112d78260200151600281111561174e5761174e614b1d565b60ff168360600151805190602001205f1c5f9182526020526040902090565b60606112d76114ab8361275e565b33301461179a576040516282b42960e81b815260040160405180910390fd5b6117ad686d3d4e7fb92a5238158261331a565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b333014611802576040516282b42960e81b815260040160405180910390fd5b61180b81613384565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b0381111561185457611854614fb4565b60405190808252806020026020018201604052801561188757816020015b60608152602001906001900390816118725790505b509250806001600160401b038111156118a2576118a2614fb4565b6040519080825280602002602001820160405280156118d557816020015b60608152602001906001900390816118c05790505b5091505f5b81811015611966576119038686838181106118f7576118f761542a565b90506020020135611ab2565b8482815181106119155761191561542a565b60200260200101819052506119418686838181106119355761193561542a565b90506020020135611d27565b8382815181106119535761195361542a565b60209081029190910101526001016118da565b50509250929050565b33301461198e576040516282b42960e81b815260040160405180910390fd5b6119d682828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f920191909152506119d092506125e7915050565b906133ef565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611a079291906154c4565b60405180910390a15050565b60606114c8686d3d4e7fb92a5238136125f4565b5f333014611a47576040516282b42960e81b815260040160405180910390fd5b611a5082613447565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611a829190614bac565b60405180910390a2919050565b5f6112d76001600160f81b031980841614611aa9846134f0565b15159015151790565b60605f611abe836126e6565b6001019050611ad96040518060200160405280606081525090565b5f611ae383613502565b90505f5b81811015611c6c575f611afa8583613553565b6001600160a01b0381165f9081526001870160205260408120919250611b1f826135ac565b90505f5b8151811015611c5d575f828281518110611b3f57611b3f61542a565b602002602001015190505f611b68856001015f8460ff1681526020019081526020015f20612fa4565b9050611ba56040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166005811115611bba57611bba614b1d565b81602001906005811115611bd057611bd0614b1d565b90816005811115611be357611be3614b1d565b9052506001600160a01b03871681528151604080830191909152820151608082015260208201516060820152611c284260ff851660058111156108ca576108ca614b1d565b60c08201819052608082015160608301519111150260a082015280611c4d8b82613605565b5050505050806001019050611b23565b50505050806001019050611ae7565b5050519392505050565b333014611c95576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813611cb6686d3d4e7fb92a5238198484610200612870565b5081611cdd576001600160a01b0383165f9081526007820160205260409020805460010190555b826001600160a01b03167f31471c9e79dc8535d9341d73e61eaf5e72e4134b3e5b16943305041201581d8883604051611d1a911515815260200190565b60405180910390a2505050565b60606112d7611d35836126e6565b6136ae565b6001600160f81b03198084169003611d5b57611d568282613767565b505050565b611d56838383613804565b813580830190604081901c602084101715611d7f575f5ffd5b50611dd1336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161430611dbd6020850185614c7f565b6001600160a01b0316149015159015151690565b611ded576040516282b42960e81b815260040160405180910390fd5b611e18611e0060a0830160808401614c7f565b611e126101a084016101808501614c7f565b88613886565b841580611e295750611e298561265a565b611e85575f611e37866126e6565b600181019150611e83906002015f611e5560a0860160808701614c7f565b6001600160a01b0316815260208101919091526040015f20611e7d60a0850160808601614c7f565b896138a9565b505b505050505050565b5f80826005811115611ea157611ea1614b1d565b03611eb457603c808404025b90506112d7565b6001826005811115611ec857611ec8614b1d565b03611ed957610e1080840402611ead565b6002826005811115611eed57611eed614b1d565b03611eff576201518080840402611ead565b6003826005811115611f1357611f13614b1d565b03611f39576007600362015180808604918201929092069003620545ff85110202611ead565b5f5f611f44856139ce565b5090925090506004846005811115611f5e57611f5e614b1d565b03611f7857611f6f82826001613a78565b925050506112d7565b6005846005811115611f8c57611f8c614b1d565b03611f9d57611f6f82600180613a78565b5f5ffd5b5f6114c8686d3d4e7fb92a523816613acf565b5f84611fc2575060016121c6565b611fcb8561265a565b15611fd8575060016121c6565b631919191960e11b60048310611fec575082355b82611ffb5750630707070760e51b5b61200585826126be565b15612013575f9150506121c6565b5f61201d876126e6565b905061202881613acf565b156120e55761204360e083901c606088901b175b8290613b1b565b15612053576001925050506121c6565b6120666332323232606088901b1761203c565b15612076576001925050506121c6565b61209c60e083901c73191919191919191919191919191919191919191960611b1761203c565b156120ac576001925050506121c6565b6120d57f323232323232323232323232323232323232323200000000000000003232323261203c565b156120e5576001925050506121c6565b6120fb5f5160206155835f395f51905f526126e6565b905061210681613acf565b156121c05761211e60e083901c606088901b1761203c565b1561212e576001925050506121c6565b6121416332323232606088901b1761203c565b15612151576001925050506121c6565b61217760e083901c73191919191919191919191919191919191919191960611b1761203c565b15612187576001925050506121c6565b6121b07f323232323232323232323232323232323232323200000000000000003232323261203c565b156121c0576001925050506121c6565b5f925050505b949350505050565b5f60405182604081146121e957604181146122105750612241565b60208581013560ff81901c601b0190915285356040526001600160ff1b0316606052612221565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d61224e575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d61226f57fe5b919050565b5f6040518681528560208201528460408201528360608201528260808201525f5f5260205f60a0836101005afa503d6122d8576d1ab2e8006fd8b71907bf06a5bdee3b6122d85760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa6122d857fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6123426040518060c0016040528060608152602001606081526020015f81526020015f81526020015f81526020015f81525090565b815160c081106123ef5760208301818101818251018281108260c0830111171561236e575050506123ef565b808151019250806020820151018181108382111782851084861117171561239857505050506123ef565b82815160208301011183855160208701011117156123b957505050506123ef565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f5f5f61240488600180613b9f565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c51015116146020831188161696505085156124e857602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d90506124e857fe5b5050508215612509576125068287608001518860a001518888612274565b92505b505095945050505050565b5f6001600160a01b038516156121c657604051853b6125a4578260408114612544576041811461256b57506125de565b60208581013560ff81901c601b0190915285356040526001600160ff1b031660605261257c565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f606052806040526125de565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b686d3d4e7fb92a52381390565b60405181546020820190600881901c5f8260ff84171461262257505080825260ff8116601f80821115612644575b855f5260205f205b8160051c8101548286015260208201915082821061262a57505b508084525f920191825250602001604052919050565b5f818152686d3d4e7fb92a52381760205260408120805460ff808216908114801590910260089290921c0217806126a45760405163395ed8c160e21b815260040160405180910390fd5b6126b1825f198301613c90565b60ff161515949350505050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f5160206155835f395f51905f52831461270a5761270583613cfd565b612719565b5f5160206155835f395f51905f525b68a3bbbebc65eb8804df6009525f908152602990209392505050565b5f8261274a576127458585613d2a565b612755565b612755858584613e28565b95945050505050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81208190610d9b565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016127c85763f5a267f15f526004601cfd5b826127da5768fbb67fda52d4bfb8bf92505b80546001600160601b03811661281e5760019250838160601c031561282f57600182015460601c841461282f57600282015460601c841461282f575b5f925061282f565b81602052835f5260405f2054151592505b505092915050565b6001600160a01b0381165f908152686d3d4e7fb92a52381a602052604081208054601f5263d4203f8b6004528152603f81208190610d9b565b5f826128805761274585856128a6565b612755858584612f68565b5f81545b80156123ef5760019182019181190181161861288f565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016128e15763f5a267f15f526004601cfd5b826128f35768fbb67fda52d4bfb8bf92505b80546001600160601b0381168061296d5760019350848260601c0361292b5760018301805484556002840180549091555f90556129d2565b84600184015460601c0361294c5760028301805460018501555f90556129d2565b84600284015460601c03612965575f60028401556129d2565b5f93506129d2565b82602052845f5260405f208054806129865750506129d2565b60018360011c0392508260018203146129b6578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612a0583613acf565b82106112d757604051634e23d03560e01b815260040160405180910390fd5b365f8080612a328686613e45565b93509350612a4886866040908111913510171590565b15612a8757602085870103866020013580880160208101945080359350828482011182851760401c1715612a835763ba597e7e5f526004601cfd5b5050505b92959194509250565b5f8183604051375060405120919050565b5f82815260a082901c602052604090206001600160a01b0316612ac5848284613edb565b610d9b57505f9392505050565b801580612ae35750612ae38161265a565b15612af357611d56838383613f23565b5f612afd826126e6565b6001019050612b6b6040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f612b7583613502565b90505f5b81811015612bc7575f612b8c8583613553565b90506001600160a01b03811615612bbe576040840151612bac9082613f7a565b506060840151612bbc905f613605565b505b50600101612b79565b505f5f5b86811015612d8557600581901b880135880180358015300217906020808201359160408101350190810190358215612c0a57612c0783876154d7565b95505b6004811015612c1c5750505050612d7d565b813560e01c63a9059cbb819003612c52576040890151612c3c9086613f7a565b50612c50602484013560608b015190613f99565b505b8063ffffffff1663095ea7b303612c9a5760248301355f03612c78575050505050612d7d565b8851612c849086613f7a565b50612c98600484013560208b015190613f99565b505b8063ffffffff166387517c4503612d12576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba314612cd4575050505050612d7d565b60448301355f03612ce9575050505050612d7d565b612cfc600484013560808b015190613f99565b50612d10602484013560a08b015190613f99565b505b8063ffffffff1663598daac403612d77576001600160a01b0385163014612d3d575050505050612d7d565b8a600484013514612d52575050505050612d7d565b612d65602484013560408b015190613f99565b506060890151612d75905f613605565b505b50505050505b600101612bcb565b50604083015151606084015151612d9c9190613faf565b5f612dcf612dad8560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b60408501515151811015612e1b57604085015151600582901b0160200151612e1182612dff8330614085565b85919060059190911b82016020015290565b5050600101612dd3565b50612e27888888613f23565b5f8080526001860160205260408120612e4091846138a9565b5f5b60408501515151811015612ece57604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b018352939093206060890151518301820151928601909101519091612ec49183918591612ebf9190612eb490612eab8930614085565b80821191030290565b808218908210021890565b6138a9565b5050600101612e42565b505f5b84515151811015612f1357845151600582901b0160200151612f0a81612f0484896020015161407590919063ffffffff16565b5f6140af565b50600101612ed1565b505f5b60808501515151811015612f5d57608085015151600582901b0160200151612f5481612f4f848960a0015161407590919063ffffffff16565b6140f9565b50600101612f16565b505050505050505050565b5f612f738484614154565b90508015610d9b5781612f8585613502565b1115610d9b5760405163155176b960e11b815260040160405180910390fd5b612fc560405180606001604052805f81526020015f81526020015f81525090565b5f612fcf836125f4565b905080515f146123ef575f612fe3826142af565b602001949350505050565b6040805182516020808301919091528301518183015290820151606082015261303390839061302e906080016040516020818303038152906040526143de565b6133ef565b5050565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c92508383141583028152816130c55782156130c057600191508185015460601c925082156130c0578284141590920260208301525060028381015460601c9182156130c0576003915083831415830260408201525b6130f5565b600191821c915b828110156130f3578581015460601c858114158102600583901b84015293506001016130cc565b505b8186528160051b81016040525050505050919050565b5f5f613116846144fa565b905082156001600160a01b03821615171580156121c657506121c6848483613edb565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f000000000000000000000000000000000000000000000000000000000000000046141661322c5750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f5f5f61325a6132c3565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264302e312e3160d81b9083015291565b5f5f61330f8484614518565b600101905550505050565b604081811c5f90815260208490522080546001600160401b0383161015613354576040516312ee5c9360e01b815260040160405180910390fd5b61337e613378836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f818152686d3d4e7fb92a52381760209081526040808320839055686d3d4e7fb92a523818909152902080546001019055686d3d4e7fb92a5238136133d2686d3d4e7fb92a52381683613d2a565b6130335760405163395ed8c160e21b815260040160405180910390fd5b80518060081b60ff175f60fe8311613418575050601f8281015160081b8217908083111561343f575b60208401855f5260205f205b828201518360051c8201556020830192508483106134245750505b509092555050565b5f81604001511561347c5761345f826020015161455e565b61347c576040516321b9b33960e21b815260040160405180910390fd5b61348582611734565b90505f686d3d4e7fb92a5238136060840151845160208087015160408089015190519596506134dc956134ba959493016154ea565b60408051601f198184030181529181525f8581526004850160205220906133ef565b6134e9600382018361457a565b5050919050565b5f6134fa8261468c565b151592915050565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c151761354b5760019350838301541561354b5760029350838301541561354b57600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf8214158202915061358684613502565b83106135a557604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b80156135ef5761ffff81166135d4576010918201911c6135b9565b8183526020600582901b16909201916001918201911c6135b9565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c55360208403518181061582820402905080831061369d5782811781018115826020018701604051181761366957828102601f19870152850160200160405261369d565b602060405101816020018101604052808a52601f19855b888101518382015281018061368057509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf90602084018161372757835480156137215780841415028152600184810154909250801561372157808414150260208201526002848101549092508015613721576003925083811415810260408301525b50613752565b8160011c91505f5b8281101561375057848101548481141502600582901b83015260010161372f565b505b8185528160051b810160405250505050919050565b686d3d4e7fb92a523813823560601c60148381188185100218808501908085119085030261379e686d3d4e7fb92a5238198461278d565b6137ba576040516282b42960e81b815260040160405180910390fd5b3330146137ea576137ce33610d7585612837565b6137ea576040516282b42960e81b815260040160405180910390fd5b604051818382375f388383875af4611e83573d5f823e3d81fd5b5f61380e8461468c565b905080600303613829576138238484846146d5565b50505050565b365f365f8461383f57637f1812755f526004601cfd5b5085358087016020810194503592505f9060401160028614111561386d575050602080860135860190810190355b61387c8888888787878761476d565b5050505050505050565b6001600160a01b03831661389e57611d5682826148c9565b611d568383836148e2565b806138b357505050565b5f6138bd846135ac565b905080515f036138e057604051635ee7e5b160e01b815260040160405180910390fd5b5f5b81518110156139c7575f8282815181106138fe576138fe61542a565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f61392b82612fa4565b90505f613947428560ff1660058111156108ca576108ca614b1d565b9050808260400151101561396357604082018190525f60208301525b815f0151878360200181815161397991906154d7565b91508181525011156139ae5760405163482a648960e11b81526001600160a01b03891660048201526024015b60405180910390fd5b6139b88383612fee565b505050508060010190506138e2565b5050505050565b5f8080613a6b6139e16201518086615539565b5f5f5f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c9250806134e95781545f9350156134e9576001925082820154156134e9576002925082820154156134e9575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613b485763f5a267f15f526004601cfd5b82613b5a5768fbb67fda52d4bfb8bf92505b801954613b8b5780546001925083146135a557600181015483146135a557600281015483146135a5575f91506135a5565b602052505f90815260409020541515919050565b60608351801561224e576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613c1a579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f82548060ff821714613cd857601e8311613caf5780831a91506135a5565b8060ff168311613cd357835f52601f83038060051c60205f200154601f82161a9250505b6135a5565b8060081c83116135a557835f528260051c60205f200154601f84161a91505092915050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81206112d7565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613d575763f5a267f15f526004601cfd5b82613d695768fbb67fda52d4bfb8bf92505b80195480613dca576001925083825403613d965760018201805483556002830180549091555f905561282f565b83600183015403613db45760028201805460018401555f905561282f565b83600283015403612816575f600283015561282f565b81602052835f5260405f20805480613de357505061282f565b60018360011c039250826001820314613e0d57828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f613e33848461457a565b90508015610d9b5781612f8585613acf565b365f833580850160208587010360208201945081359350808460051b8301118360401c1715613e7b5763ba597e7e5f526004601cfd5b8315613ed1578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c1715613ec85763ba597e7e5f526004601cfd5b50505082613e85575b5050509250929050565b5f82815260208082206080909152601f8390526305d78094600b526019602720613f196001600160a01b03871680151590611dbd84601b8a88614922565b9695505050505050565b5f82613f2f5750505050565b600581901b84013584018035801530021790602080820135916040810135019081019035613f60848484848a61495c565b50505050838390508160010191508103613f2f5750505050565b604080516060815290819052610d9b83836001600160a01b0316613605565b604080516060815290819052610d9b8383613605565b6040518151835114613fcd57634e487b715f5260326020526024601cfd5b8251613fd857505050565b5f5f613fe38561499a565b613fec8561499a565b91509150613ff9856149c9565b61400285614a1e565b848403601f196020870187518752875160051b3684830137845160051b5b8086015181860151835b8281511461403a5760200161402a565b86018051820180825282111561405c57634e487b715f5260116020526024601cfd5b5050508201806140205750505050826040525050505050565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f5114166140ef57803d853b1517106140ef57633e3f8f735f526004601cfd5b505f603452505050565b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af1611d56576396b3de235f526004601cfd5b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be19830161418f5763f5a267f15f526004601cfd5b826141a15768fbb67fda52d4bfb8bf92505b80546001600160601b0381168260205280614263578160601c806141cf578560601b845560019450506129d2565b8581036141dc57506129d2565b600184015460601c806141fd578660601b60018601556001955050506129d2565b86810361420b5750506129d2565b600285015460601c8061422d578760601b6002870155600196505050506129d2565b87810361423c575050506129d2565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f2080546142a557600191821c808301825591945081614291578560601b6003178455506129d2565b8560601b82850155826002018455506129d2565b5050505092915050565b6060614307565b6fffffffffffffffffffffffffffffffff811160071b81811c6001600160401b031060061b1781811c63ffffffff1060051b1781811c61ffff1060041b1790811c60ff1060039190911c17601f1890565b81511561226f5760405190506004820180518351846020010160ff8115190460071b196020850183198552866020015b8051805f1a61439057600190811a01608081116143705780368437808301925060028201915084821061436a57506143c0565b50614337565b5f198352918201607f1901916002919091019084821061436a57506143c0565b8083528381168401178317196143a5816142b6565b90150182828603828111818418021801925001838110614337575b509290935250601f198382030183525f815260200160405250919050565b6040518151602082019083015b8084146144d9576001840193508351601f1a80614478575b6020850151806144475785830360208181189082110218607f839003818111818318021896870196928301929050601f8111614440575050614468565b5050614403565b614450816142b6565b90508583038181118183180218958601959190910190505b60f01b82526002909101906143eb565b60ff81036144ca5760208086015119801561449957614496816142b6565b91505b508583038181118282180218601f81811890821102186080811760f01b8552959095019450506002909101906143eb565b808353506001820191506143eb565b50600482018051199052601f198282030182525f8152602001604052919050565b5f60205f5f843c5f5160f01c61ef011460035160601c029050919050565b604081811c5f90815260208490522080546001600160401b0380841682149082101661455757604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f8082600281111561457257614572614b1d565b141592915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036145a75763f5a267f15f526004601cfd5b826145b95768fbb67fda52d4bfb8bf92505b801954816020528061465d578154806145d957848355600193505061282f565b8481036145e6575061282f565b6001830154806146015785600185015560019450505061282f565b85810361460f57505061282f565b60028401548061462b578660028601556001955050505061282f565b86810361463a5750505061282f565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f2080546129d257600191821c8381018690558083019182905590821b821783195590925061282f565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c171561471a57633995943b5f526004601cfd5b505f5b838114611e8357365f8260051b850135808601602081019350803592505084828401118160401c171561475757633995943b5f526004601cfd5b50614763898383611d3a565b505060010161471d565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001633036147cf57602081146147be5760405163438e981560e11b815260040160405180910390fd5b6147ca84848435612ad2565b611e83565b806147fe573330146147f3576040516282b42960e81b815260040160405180910390fd5b6147ca84845f612ad2565b60208110156148205760405163438e981560e11b815260040160405180910390fd5b8135614834686d3d4e7fb92a52381361172b565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f5f6148916148778888866114cd565b60208087108188180218808801908088039088110261092a565b91509150816148b2576040516282b42960e81b815260040160405180910390fd5b6148bd878783612ad2565b50505050505050505050565b5f385f3884865af16130335763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f5114166140ef57803d853b1517106140ef576390b8ec185f526004601cfd5b5f604051855f5260ff851660205283604052826060526020604060805f60015afa505f6060523d6060185191508060405250949350505050565b61496881868585611fb4565b61498d578085848460405163f78c1b5360e01b81526004016139a59493929190615558565b6139c78585858585614a67565b604051815160051b8101602001818084035b8082015182528160200191508282036149ac575060405250919050565b80515f82528060051b8201601f19602084015b602001828111614a1757805182820180518281116149fc575050506149dc565b5b6020820152830180518281116149fd5750602001526149dc565b5050509052565b6002815110610ebd576020810160408201600183510160051b83015b8151835114614a4e57602083019250815183525b602082019150808203614a3a57505081900360051c9052565b604051828482375f388483888a5af1611e85573d5f823e3d81fd5b5f5f83601f840112614a92575f5ffd5b5081356001600160401b03811115614aa8575f5ffd5b602083019150836020828501011115614557575f5ffd5b5f5f5f60408486031215614ad1575f5ffd5b8335925060208401356001600160401b03811115614aed575f5ffd5b614af986828701614a82565b9497909650939450505050565b5f60208284031215614b16575f5ffd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f602082015160038110614b8057614b80614b1d565b806020850152506040820151151560408401526060820151608060608501526121c66080850182614b31565b602081525f610d9b6020830184614b5f565b6001600160a01b0381168114610ebd575f5ffd5b8035801515811461226f575f5ffd5b5f5f5f5f60808587031215614bf4575f5ffd5b843593506020850135614c0681614bbe565b925060408501356001600160e01b031981168114614c22575f5ffd5b9150614c3060608601614bd2565b905092959194509250565b5f5f5f60608486031215614c4d575f5ffd5b8335614c5881614bbe565b92506020840135614c6881614bbe565b9150614c7660408501614bd2565b90509250925092565b5f60208284031215614c8f575f5ffd5b8135610d9b81614bbe565b80356006811061226f575f5ffd5b5f5f5f60608486031215614cba575f5ffd5b833592506020840135614ccc81614bbe565b9150614c7660408501614c9a565b5f8151808452602084019350602083015f5b82811015614d0a578151865260209586019590910190600101614cec565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b82811015614d6b57605f19878603018452614d56858351614b5f565b94506020938401939190910190600101614d3a565b5050505082810360208401526127558185614cda565b5f5f60208385031215614d92575f5ffd5b82356001600160401b03811115614da7575f5ffd5b614db385828601614a82565b90969095509350505050565b5f60208284031215614dcf575f5ffd5b81356001600160c01b0381168114610d9b575f5ffd5b5f5f5f5f60808587031215614df8575f5ffd5b843593506020850135614e0a81614bbe565b9250614e1860408601614c9a565b9396929550929360600135925050565b602080825282518282018190525f918401906040840190835b81811015614e685783516001600160a01b0316835260209384019390920191600101614e41565b509095945050505050565b5f5f83601f840112614e83575f5ffd5b5081356001600160401b03811115614e99575f5ffd5b6020830191508360208260051b8501011115614557575f5ffd5b5f5f5f60408486031215614ec5575f5ffd5b83356001600160401b03811115614eda575f5ffd5b614ee686828701614e73565b909790965060209590950135949350505050565b5f5f5f60608486031215614f0c575f5ffd5b833592506020840135614c6881614bbe565b60ff60f81b8816815260e060208201525f614f3c60e0830189614b31565b8281036040840152614f4e8189614b31565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b81811015614fa3578351835260209384019390920191600101614f85565b50909b9a5050505050505050505050565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b0381118282101715614fea57614fea614fb4565b60405290565b5f82601f830112614fff575f5ffd5b81356001600160401b0381111561501857615018614fb4565b604051601f8201601f19908116603f011681016001600160401b038111828210171561504657615046614fb4565b60405281815283820160200185101561505d575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f60208284031215615089575f5ffd5b81356001600160401b0381111561509e575f5ffd5b8201608081850312156150af575f5ffd5b6150b7614fc8565b813564ffffffffff811681146150cb575f5ffd5b81526020820135600381106150de575f5ffd5b60208201526150ef60408301614bd2565b604082015260608201356001600160401b0381111561510c575f5ffd5b61511886828501614ff0565b606083015250949350505050565b5f5f60208385031215615137575f5ffd5b82356001600160401b0381111561514c575f5ffd5b614db385828601614e73565b6006811061516857615168614b1d565b9052565b5f8151808452602084019350602083015f5b82811015614d0a57815180516001600160a01b031687526020808201515f916151a9908a0182615158565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e0909501946020919091019060010161517e565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561524957605f1987860301845261523485835161516c565b94506020938401939190910190600101615218565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b838110156152a257601f1986840301855261528c838351614cda565b6020958601959093509190910190600101615270565b509098975050505050505050565b602081525f610d9b6020830184614b31565b602081525f610d9b602083018461516c565b5f5f604083850312156152e5575f5ffd5b82356152f081614bbe565b91506152fe60208401614bd2565b90509250929050565b602081525f610d9b6020830184614cda565b5f5f5f5f5f6080868803121561532d575f5ffd5b85359450602086013593506040860135925060608601356001600160401b03811115615357575f5ffd5b61536388828901614a82565b969995985093965092949392505050565b5f5f60408385031215615385575f5ffd5b823591506152fe60208401614c9a565b5f5f5f5f606085870312156153a8575f5ffd5b8435935060208501356153ba81614bbe565b925060408501356001600160401b038111156153d4575f5ffd5b6153e087828801614a82565b95989497509550505050565b5f602082840312156153fc575f5ffd5b8151610d9b81614bbe565b8381526001600160a01b0383166020820152606081016121c66040830184615158565b634e487b7160e01b5f52603260045260245ffd5b634e487b7160e01b5f52601160045260245ffd5b5f600182016154635761546361543e565b5060010190565b8481526001600160a01b03841660208201526080810161548d6040830185615158565b82606083015295945050505050565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f6121c660208301848661549c565b808201808211156112d7576112d761543e565b5f85518060208801845e60d886901b6001600160d81b0319169083019081526003851061551957615519614b1d565b60f894851b600582015292151590931b6006830152506007019392505050565b5f8261555357634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f90613f19908301848661549c56fe3232323232323232323232323232323232323232323232323232323232323232a2646970667358221220a5e78c348d9f95ce06078f7c9a2440c9c6889227ee63e56801fda8f57628a85364736f6c634300081d0033" as const;


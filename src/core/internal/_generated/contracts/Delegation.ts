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
    "name": "compensate",
    "inputs": [
      {
        "name": "paymentToken",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "paymentRecipient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "paymentAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "eoa",
        "type": "address",
        "internalType": "address"
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
        "name": "paymentSignature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
    "name": "OpDataTooShort",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PREPAlreadyInitialized",
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

export const code = "0x610140604052604051615332380380615332833981016040819052610023916100e6565b306080524660a052606080610071604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264181718171960d91b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610113565b5f602082840312156100f6575f80fd5b81516001600160a01b038116811461010c575f80fd5b9392505050565b60805160a05160c05160e05161010051610120516151c361016f5f395f818161068401528181611176015281816119fa015261431e01525f612f9d01525f61305701525f61303101525f612fe101525f612fbe01526151c35ff3fe608060405260043610610275575f3560e01c80637656d3041161014e578063ce835432116100c0578063e5adda7111610079578063e5adda7114610853578063e9ae5c531461087f578063faba56d814610892578063fac750e0146108b1578063fcd4e707146108c5578063ff619c6b146108ed5761027c565b8063ce8354321461078f578063cebfe336146107ae578063d03c7914146107cd578063dcc09ebf146107ec578063e28250b414610818578063e537b27b146108345761027c565b8063ad07708311610112578063ad077083146106c5578063b70e36f0146106e4578063b75c7dc614610703578063bc2c554a14610722578063bf5309691461074f578063cb4774c41461076e5761027c565b80637656d304146106195780637b8e4ecc1461063857806384b0196e1461064c57806394430fa514610673578063a840fe49146106a65761027c565b80632f3f30c7116101e7578063515c9d6d116101ab578063515c9d6d14610548578063598daac4146105685780635f7c23ab1461058757806360d2f33d146105b35780636c95d5a7146105e65780636fd91454146105fa5761027c565b80632f3f30c7146104a757806335058501146104c157806336745d10146104db5780633e1b08121461050a5780634223b5c2146105295761027c565b8063164b859911610239578063164b8599146103b45780631a37ef23146103d35780631a912f3e146103f257806320606b70146104335780632081a278146104665780632150c518146104855761027c565b80630cef73b4146102b557806311a86fd6146102f057806312aaac701461032f578063136a12f71461035b5780631626ba7e1461037c5761027c565b3661027c57005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a02821417156102a757806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102c0575f80fd5b506102d46102cf366004614674565b61090c565b6040805192151583526020830191909152015b60405180910390f35b3480156102fb575f80fd5b5061031773323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102e7565b34801561033a575f80fd5b5061034e6103493660046146bb565b610b08565b6040516102e79190614761565b348015610366575f80fd5b5061037a610375366004614796565b610bf7565b005b348015610387575f80fd5b5061039b610396366004614674565b610d1c565b6040516001600160e01b031990911681526020016102e7565b3480156103bf575f80fd5b5061037a6103ce3660046147f0565b610d88565b3480156103de575f80fd5b5061037a6103ed366004614834565b610e4f565b3480156103fd575f80fd5b506104257f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102e7565b34801561043e575f80fd5b506104257f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b348015610471575f80fd5b5061037a61048036600461485d565b610ea6565b348015610490575f80fd5b50610499611000565b6040516102e79291906148c9565b3480156104b2575f80fd5b5061039b630707070760e51b81565b3480156104cc575f80fd5b5061039b631919191960e11b81565b3480156104e6575f80fd5b506104fa6104f5366004614936565b61116a565b60405190151581526020016102e7565b348015610515575f80fd5b50610425610524366004614974565b611324565b348015610534575f80fd5b5061034e6105433660046146bb565b61135a565b348015610553575f80fd5b506104255f8051602061516e83398151915281565b348015610573575f80fd5b5061037a61058236600461499a565b611392565b348015610592575f80fd5b506105a66105a1366004614834565b6114cd565b6040516102e791906149dd565b3480156105be575f80fd5b506104257f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b3480156105f1575f80fd5b506104fa6114e0565b348015610605575f80fd5b50610425610614366004614a68565b6114fd565b348015610624575f80fd5b5061037a610633366004614aaf565b611619565b348015610643575f80fd5b506105a66116cb565b348015610657575f80fd5b506106606116df565b6040516102e79796959493929190614ad3565b34801561067e575f80fd5b506103177f000000000000000000000000000000000000000000000000000000000000000081565b3480156106b1575f80fd5b506104256106c0366004614c2e565b611705565b3480156106d0575f80fd5b506105a66106df3660046146bb565b61173e565b3480156106ef575f80fd5b5061037a6106fe3660046146bb565b61174c565b34801561070e575f80fd5b5061037a61071d3660046146bb565b6117b4565b34801561072d575f80fd5b5061074161073c366004614cdb565b611809565b6040516102e7929190614da7565b34801561075a575f80fd5b5061037a610769366004614936565b611940565b348015610779575f80fd5b506107826119e4565b6040516102e79190614e65565b34801561079a575f80fd5b5061037a6107a9366004614e77565b6119f8565b3480156107b9575f80fd5b506104256107c8366004614c2e565b611aac565b3480156107d8575f80fd5b506104fa6107e73660046146bb565b611b14565b3480156107f7575f80fd5b5061080b6108063660046146bb565b611b37565b6040516102e79190614f08565b348015610823575f80fd5b50686d3d4e7fb92a52381454610425565b34801561083f575f80fd5b5061037a61084e366004614f1a565b611cf1565b34801561085e575f80fd5b5061087261086d3660046146bb565b611da2565b6040516102e79190614f4d565b61037a61088d366004614674565b611db5565b34801561089d575f80fd5b506104256108ac366004614f5f565b611de1565b3480156108bc575f80fd5b50610425611ef5565b3480156108d0575f80fd5b506108da61c1d081565b60405161ffff90911681526020016102e7565b3480156108f8575f80fd5b506104fa610907366004614f80565b611f08565b5f806041831460408414171561093c5730610928868686612122565b6001600160a01b03161491505f9050610b00565b602183101561094f57505f905080610b00565b506020198281018381118185180281189385019182013591601f19013560ff16156109805761097d866121aa565b95505b505f61098b82610b08565b805190915064ffffffffff1642811090151516156109ac575f925050610b00565b5f816020015160028111156109c3576109c36146d2565b03610a1e575f80603f86118735810290602089013502915091505f80610a02856060015180516020820151604090920151603f90911191820292910290565b91509150610a138a858585856121c8565b965050505050610afe565b600181602001516002811115610a3657610a366146d2565b03610abb57606081810151805160208083015160409384015184518084018d9052855180820385018152601f8c018590049094028101870186529485018a8152603f9490941091820295910293610ab2935f92610aab928d918d918291018382808284375f9201919091525061226192505050565b8585612345565b94505050610afe565b600281602001516002811115610ad357610ad36146d2565b03610afe57610afb8160600151806020019051810190610af39190614fd7565b878787612464565b92505b505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f828152686d3d4e7fb92a52381760205260408120610b4890612544565b8051909150610b6a5760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610b7e8383016020015190565b60d881901c855260c881901c915060d01c60ff166002811115610ba357610ba36146d2565b84602001906002811115610bb957610bb96146d2565b90816002811115610bcc57610bcc6146d2565b90525060ff811615156040850152610be983838151811082025290565b606085015250919392505050565b333014610c16576040516282b42960e81b815260040160405180910390fd5b8380610c3557604051638707510560e01b815260040160405180910390fd5b5f8051602061516e8339815191528514610c7057610c52856125aa565b15610c7057604051630442081560e01b815260040160405180910390fd5b610c7a84846125be565b15610c98576040516303a6f8c760e21b815260040160405180910390fd5b610cbb60e084901c606086901b1783610800610cb3896125e6565b929190612635565b50604080518681526001600160a01b03861660208201526001600160e01b0319851681830152831515606082015290517f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e19181900360800190a15050505050565b5f805f610d2a86868661090c565b90925090508115158115151615610d6457610d4481610b08565b6040015180610d615750610d6133610d5b8361265e565b9061268d565b91505b81610d735763ffffffff610d79565b631626ba7e5b60e01b925050505b9392505050565b333014610da7576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813610dc4686d3d4e7fb92a5238198561268d565b610de0576040516282b42960e81b815260040160405180910390fd5b610df98383610200610df188612737565b929190612770565b50826001600160a01b0316846001600160a01b03167f22e306b6bdb65906c2b1557fba289ced7fe45decec4c8df8dbc9c21a65ac305284604051610e41911515815260200190565b60405180910390a350505050565b333014610e6e576040516282b42960e81b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c5251905550565b50565b333014610ec5576040516282b42960e81b815260040160405180910390fd5b8280610ee457604051638707510560e01b815260040160405180910390fd5b610eed846125aa565b15610f0b5760405163f2fee1e160e01b815260040160405180910390fd5b5f610f15856125e6565b6001600160a01b0385165f908152600282016020526040902060019091019150610f63846005811115610f4a57610f4a6146d2565b8254600160ff9092169190911b80198216845516151590565b15610f83575f610f728261278b565b03610f8357610f8182866127a6565b505b806001015f856005811115610f9a57610f9a6146d2565b60ff168152602081019190915260409081015f9081208181556001810182905560020155517fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a2790610ff090889088908890614ff2565b60405180910390a1505050505050565b6060805f61100c611ef5565b9050806001600160401b0381111561102657611026614b69565b60405190808252806020026020018201604052801561107557816020015b604080516080810182525f80825260208083018290529282015260608082015282525f199092019101816110445790505b509250806001600160401b0381111561109057611090614b69565b6040519080825280602002602001820160405280156110b9578160200160208202803683370190505b5091505f805b8281101561115f575f6110e082686d3d4e7fb92a5238135b600301906128db565b90505f6110ec82610b08565b805190915064ffffffffff16428110901515161561110b575050611157565b8087858151811061111e5761111e615015565b60200260200101819052508186858151811061113c5761113c615015565b6020908102919091010152836111518161503d565b94505050505b6001016110bf565b508084528252509091565b5f336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146111b3576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a52381454686d3d4e7fb92a52381390156111e75760405163b62ba30f60e01b815260040160405180910390fd5b365f365f6111f58888612924565b604080518481526001850160051b8101909152939750919550935091505f5b848110156112b657600581901b86013586018035906020808201359160408101350190810190356112a6856112977f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876112788888612990565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b5050505050806001019050611214565b505f6112d5306112ce84805160051b60209091012090565b86356129a1565b905080156020841017156112fc5760405163e483bbcb60e01b815260040160405180910390fd5b60018701819055858561131082825f6129d2565b600199505050505050505050505b92915050565b6001600160c01b0381165f908152686d3d4e7fb92a5238156020526040808220549083901b67ffffffffffffffff19161761131e565b604080516080810182525f808252602082018190529181019190915260608082015261131e61034983686d3d4e7fb92a5238136110d7565b3330146113b1576040516282b42960e81b815260040160405180910390fd5b83806113d057604051638707510560e01b815260040160405180910390fd5b6113d9856125aa565b156113f75760405163f2fee1e160e01b815260040160405180910390fd5b5f611401866125e6565b600101905061141281866040612e5d565b506001600160a01b0385165f9081526001820160205260409020611458856005811115611441576114416146d2565b8254600160ff9092169190911b8082178455161590565b5083816001015f876005811115611471576114716146d2565b60ff1681526020019081526020015f205f01819055507f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a878787876040516114bc9493929190615055565b60405180910390a150505050505050565b606061131e6114db83612737565b612e99565b5f6114f830686d3d4e7fb92a52381360010154612f6d565b905090565b5f806115198460408051828152600190920160051b8201905290565b90505f5b8481101561159657600581901b86013586018035801530021790602080820135916040810135019081019035611586856112977f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876112788888612990565b505050505080600101905061151d565b5061c1d060f084901c145f6115f07f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b9050816116055761160081612f9b565b61160e565b61160e816130b1565b979650505050505050565b333014611638576040516282b42960e81b815260040160405180910390fd5b5f838152686d3d4e7fb92a523817602052604090205460ff1661166e5760405163395ed8c160e21b815260040160405180910390fd5b61167f8282610200610df18761265e565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc99836040516116be911515815260200190565b60405180910390a3505050565b60606114f8686d3d4e7fb92a523819612e99565b600f60f81b6060805f8080836116f3613125565b97989097965046955030945091925090565b5f61131e8260200151600281111561171f5761171f6146d2565b60ff168360600151805190602001205f1c5f9182526020526040902090565b606061131e6114db8361265e565b33301461176b576040516282b42960e81b815260040160405180910390fd5b61177e686d3d4e7fb92a52381582613165565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b3330146117d3576040516282b42960e81b815260040160405180910390fd5b6117dc816131cf565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b0381111561182557611825614b69565b60405190808252806020026020018201604052801561185857816020015b60608152602001906001900390816118435790505b509250806001600160401b0381111561187357611873614b69565b6040519080825280602002602001820160405280156118a657816020015b60608152602001906001900390816118915790505b5091505f5b81811015611937576118d48686838181106118c8576118c8615015565b90506020020135611b37565b8482815181106118e6576118e6615015565b602002602001018190525061191286868381811061190657611906615015565b90506020020135611da2565b83828151811061192457611924615015565b60209081029190910101526001016118ab565b50509250929050565b33301461195f576040516282b42960e81b815260040160405180910390fd5b6119a782828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f920191909152506119a19250612537915050565b9061323e565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad82826040516119d89291906150af565b60405180910390a15050565b60606114f8686d3d4e7fb92a523813612544565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b039081163314309187169190911416611a4b576040516282b42960e81b815260040160405180910390fd5b611a56888888613296565b831580611a675750611a67846125aa565b611aa2575f611a75856125e6565b6001600160a01b038a165f908152600282016020526040902060019091019150611aa0908a896132b9565b505b5050505050505050565b5f333014611acc576040516282b42960e81b815260040160405180910390fd5b611ad5826133c8565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611b079190614761565b60405180910390a2919050565b5f61131e6001600160f81b031980841614611b2e84613471565b15159015151790565b60605f611b43836125e6565b6001019050611b5e6040518060200160405280606081525090565b5f611b6883613483565b90505f5b81811015611ce7575f611b7f85836134d4565b6001600160a01b0381165f9081526001870160205260408120919250611ba48261352d565b90505f5b8151811015611cd8575f828281518110611bc457611bc4615015565b602002602001015190505f846001015f8360ff1681526020019081526020015f209050611c226040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166005811115611c3757611c376146d2565b81602001906005811115611c4d57611c4d6146d2565b90816005811115611c6057611c606146d2565b9052506001600160a01b0387168152815460408201526002820154608082015260018201546060820152611ca34260ff851660058111156108ac576108ac6146d2565b60c08201819052608082015160608301519111150260a082015280611cc88b82613586565b5050505050806001019050611ba8565b50505050806001019050611b6c565b5050519392505050565b333014611d10576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813611d31686d3d4e7fb92a5238198484610200612770565b5081611d58576001600160a01b0383165f9081526007820160205260409020805460010190555b826001600160a01b03167f31471c9e79dc8535d9341d73e61eaf5e72e4134b3e5b16943305041201581d8883604051611d95911515815260200190565b60405180910390a2505050565b606061131e611db0836125e6565b61362f565b6001600160f81b03198084169003611dd657611dd182826136e8565b505050565b611dd183838361378e565b5f80826005811115611df557611df56146d2565b03611e0857603c808404025b905061131e565b6001826005811115611e1c57611e1c6146d2565b03611e2d57610e1080840402611e01565b6002826005811115611e4157611e416146d2565b03611e53576201518080840402611e01565b6003826005811115611e6757611e676146d2565b03611e8d576007600362015180808604918201929092069003620545ff85110202611e01565b5f80611e9885613806565b5090925090506004846005811115611eb257611eb26146d2565b03611ecc57611ec3828260016138b0565b9250505061131e565b6005846005811115611ee057611ee06146d2565b03611ef157611ec3826001806138b0565b5f80fd5b5f6114f8686d3d4e7fb92a523816613907565b5f84611f165750600161211a565b611f1f856125aa565b15611f2c5750600161211a565b631919191960e11b60048310611f40575082355b82611f4f5750630707070760e51b5b611f5985826125be565b15611f67575f91505061211a565b5f611f71876125e6565b9050611f7c81613907565b1561203957611f9760e083901c606088901b175b8290613953565b15611fa75760019250505061211a565b611fba6332323232606088901b17611f90565b15611fca5760019250505061211a565b611ff060e083901c73191919191919191919191919191919191919191960611b17611f90565b156120005760019250505061211a565b6120297f3232323232323232323232323232323232323232000000000000000032323232611f90565b156120395760019250505061211a565b61204f5f8051602061516e8339815191526125e6565b905061205a81613907565b156121145761207260e083901c606088901b17611f90565b156120825760019250505061211a565b6120956332323232606088901b17611f90565b156120a55760019250505061211a565b6120cb60e083901c73191919191919191919191919191919191919191960611b17611f90565b156120db5760019250505061211a565b6121047f3232323232323232323232323232323232323232000000000000000032323232611f90565b156121145760019250505061211a565b5f925050505b949350505050565b5f604051826040811461213d57604181146121645750612195565b60208581013560ff81901c601b0190915285356040526001600160ff1b0316606052612175565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d6121a2575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d6121c357fe5b919050565b5f6040518681528560208201528460408201528360608201528260808201525f805260205f60a0836101005afa503d61222c576d1ab2e8006fd8b71907bf06a5bdee3b61222c5760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa61222c57fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6040805160c0810182526060808252602082018190525f92820183905281018290526080810182905260a0810191909152815160c0811061233f5760208301818101818251018281108260c083011117156122be5750505061233f565b80815101925080602082015101818110838211178285108486111717156122e8575050505061233f565b8281516020830101118385516020870101111715612309575050505061233f565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f805f612354886001806139d7565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561243857602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061243857fe5b5050508215612459576124568287608001518860a0015188886121c8565b92505b505095945050505050565b5f6001600160a01b0385161561211a57604051853b6124f457826040811461249457604181146124bb575061252e565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526124cc565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f6060528060405261252e565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b686d3d4e7fb92a52381390565b60405181546020820190600881901c5f8260ff84171461257257505080825260ff8116601f80821115612594575b855f5260205f205b8160051c8101548286015260208201915082821061257a57505b508084525f920191825250602001604052919050565b5f6125b482610b08565b6040015192915050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f8051602061516e833981519152831461260a5761260583613ac8565b612619565b5f8051602061516e8339815191525b68a3bbbebc65eb8804df6009525f908152602990209392505050565b5f8261264a576126458585613af5565b612655565b612655858584613bf3565b95945050505050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81208190610d81565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016126c85763f5a267f15f526004601cfd5b826126da5768fbb67fda52d4bfb8bf92505b80546001600160601b03811661271e5760019250838160601c031561272f57600182015460601c841461272f57600282015460601c841461272f575b5f925061272f565b81602052835f5260405f2054151592505b505092915050565b6001600160a01b0381165f908152686d3d4e7fb92a52381a602052604081208054601f5263d4203f8b6004528152603f81208190610d81565b5f826127805761264585856127a6565b612655858584612e5d565b5f81545b801561233f5760019182019181190181161861278f565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016127e15763f5a267f15f526004601cfd5b826127f35768fbb67fda52d4bfb8bf92505b80546001600160601b0381168061286d5760019350848260601c0361282b5760018301805484556002840180549091555f90556128d2565b84600184015460601c0361284c5760028301805460018501555f90556128d2565b84600284015460601c03612865575f60028401556128d2565b5f93506128d2565b82602052845f5260405f208054806128865750506128d2565b60018360011c0392508260018203146128b6578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf8114150261290583613907565b821061131e57604051634e23d03560e01b815260040160405180910390fd5b365f80806129328686613c10565b9350935061294886866040908111913510171590565b1561298757602085870103866020013580880160208101945080359350828482011182851760401c17156129835763ba597e7e5f526004601cfd5b5050505b92959194509250565b5f8183604051375060405120919050565b5f82815260a082901c602052604090206001600160a01b03166129c5848284613ca6565b610d8157505f9392505050565b8015806129e357506129e3816125aa565b156129f357611dd1838383613d02565b5f6129fd826125e6565b6001019050612a6b6040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f612a7583613483565b90505f5b81811015612ac7575f612a8c85836134d4565b90506001600160a01b03811615612abe576040840151612aac9082613d59565b506060840151612abc905f613586565b505b50600101612a79565b505f805b86811015612c8557600581901b880135880180358015300217906020808201359160408101350190810190358215612b0a57612b0783876150c2565b95505b6004811015612b1c5750505050612c7d565b813560e01c63a9059cbb819003612b52576040890151612b3c9086613d59565b50612b50602484013560608b015190613d78565b505b8063ffffffff1663095ea7b303612b9a5760248301355f03612b78575050505050612c7d565b8851612b849086613d59565b50612b98600484013560208b015190613d78565b505b8063ffffffff166387517c4503612c12576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba314612bd4575050505050612c7d565b60448301355f03612be9575050505050612c7d565b612bfc600484013560808b015190613d78565b50612c10602484013560a08b015190613d78565b505b8063ffffffff1663598daac403612c77576001600160a01b0385163014612c3d575050505050612c7d565b8a600484013514612c52575050505050612c7d565b612c65602484013560408b015190613d78565b506060890151612c75905f613586565b505b50505050505b600101612acb565b50604083015151606084015151612c9c9190613d8e565b5f612ccf612cad8560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b60408501515151811015612d1b57604085015151600582901b0160200151612d1182612cff8330613e64565b85919060059190911b82016020015290565b5050600101612cd3565b50612d27888888613d02565b5f8080526001860160205260408120612d4091846132b9565b5f5b60408501515151811015612dce57604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b018352939093206060890151518301820151928601909101519091612dc49183918591612dbf9190612db490612dab8930613e64565b80821191030290565b808218908210021890565b6132b9565b5050600101612d42565b505f5b84515151811015612e1357845151600582901b0160200151612e0a81612e04848960200151613e5490919063ffffffff16565b5f613e8e565b50600101612dd1565b505f5b60808501515151811015611aa057608085015151600582901b0160200151612e5481612e4f848960a00151613e5490919063ffffffff16565b613ed8565b50600101612e16565b5f612e688484613f33565b90508015610d815781612e7a85613483565b1115610d815760405163155176b960e11b815260040160405180910390fd5b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c9250838314158302815281612f27578215612f2257600191508185015460601c92508215612f22578284141590920260208301525060028381015460601c918215612f22576003915083831415830260408201525b612f57565b600191821c915b82811015612f55578581015460601c858114158102600583901b8401529350600101612f2e565b505b8186528160051b81016040525050505050919050565b5f80612f788461408e565b905082156001600160a01b038216151715801561211a575061211a848483613ca6565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f000000000000000000000000000000000000000000000000000000000000000046141661308e5750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f805f6130bc613125565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264181718171960d91b9083015291565b604081811c5f90815260208490522080546001600160401b038316101561319f576040516312ee5c9360e01b815260040160405180910390fd5b6131c96131c3836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f818152686d3d4e7fb92a52381760209081526040808320839055686d3d4e7fb92a523818909152902080546001019055686d3d4e7fb92a52381361321d686d3d4e7fb92a52381683613af5565b61323a5760405163395ed8c160e21b815260040160405180910390fd5b5050565b80518060081b60ff175f60fe8311613267575050601f8281015160081b8217908083111561328e575b60208401855f5260205f205b828201518360051c8201556020830192508483106132735750505b509092555050565b6001600160a01b0383166132ae57611dd182826140ac565b611dd18383836140c5565b806132c357505050565b5f6132cd8461352d565b905080515f036132f057604051635ee7e5b160e01b815260040160405180910390fd5b5f5b81518110156133c1575f82828151811061330e5761330e615015565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f61334b428460ff1660058111156108ac576108ac6146d2565b9050808260020154101561336757600282018190555f60018301555b815f015486836001015f82825461337e91906150c2565b92505081905511156133b35760405163482a648960e11b81526001600160a01b03881660048201526024015b60405180910390fd5b5050508060010190506132f2565b5050505050565b5f8160400151156133fd576133e08260200151614105565b6133fd576040516321b9b33960e21b815260040160405180910390fd5b61340682611705565b90505f686d3d4e7fb92a52381360608401518451602080870151604080890151905195965061345d9561343b959493016150d5565b60408051601f198184030181529181525f85815260048501602052209061323e565b61346a6003820183614121565b5050919050565b5f61347b82614233565b151592915050565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c15176134cc576001935083830154156134cc576002935083830154156134cc57600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf8214158202915061350784613483565b831061352657604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b80156135705761ffff8116613555576010918201911c61353a565b8183526020600582901b16909201916001918201911c61353a565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c55360208403518181061582820402905080831061361e578281178101811582602001870160405118176135ea57828102601f19870152850160200160405261361e565b602060405101816020018101604052808a52601f19855b888101518382015281018061360157509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf9060208401816136a857835480156136a2578084141502815260018481015490925080156136a2578084141502602082015260028481015490925080156136a2576003925083811415810260408301525b506136d3565b8160011c91505f5b828110156136d157848101548481141502600582901b8301526001016136b0565b505b8185528160051b810160405250505050919050565b686d3d4e7fb92a523813823560601c60148381188185100218808501908085119085030261371f686d3d4e7fb92a5238198461268d565b61373b576040516282b42960e81b815260040160405180910390fd5b33301461376b5761374f33610d5b85612737565b61376b576040516282b42960e81b815260040160405180910390fd5b604051818382375f388383875af4613785573d5f823e3d81fd5b50505050505050565b5f61379884614233565b9050806003036137b3576137ad84848461427c565b50505050565b365f365f846137c957637f1812755f526004601cfd5b5085358087016020810194503592505f906040116002861411156137f7575050602080860135860190810190355b611aa288888887878787614314565b5f80806138a36138196201518086615124565b5f805f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c92508061346a5781545f93501561346a5760019250828201541561346a5760029250828201541561346a575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036139805763f5a267f15f526004601cfd5b826139925768fbb67fda52d4bfb8bf92505b8019546139c357805460019250831461352657600181015483146135265760028101548314613526575f9150613526565b602052505f90815260409020541515919050565b6060835180156121a2576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613a52579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f812061131e565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613b225763f5a267f15f526004601cfd5b82613b345768fbb67fda52d4bfb8bf92505b80195480613b95576001925083825403613b615760018201805483556002830180549091555f905561272f565b83600183015403613b7f5760028201805460018401555f905561272f565b83600283015403612716575f600283015561272f565b81602052835f5260405f20805480613bae57505061272f565b60018360011c039250826001820314613bd857828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f613bfe8484614121565b90508015610d815781612e7a85613907565b365f833580850160208587010360208201945081359350808460051b8301118360401c1715613c465763ba597e7e5f526004601cfd5b8315613c9c578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c1715613c935763ba597e7e5f526004601cfd5b50505082613c50575b5050509250929050565b5f82815260208082206080909152601f8390526305d78094600b526019602720613cf86001600160a01b03871680151590613ce484601b8a88614472565b6001600160a01b0316149015159015151690565b9695505050505050565b5f82613d0e5750505050565b600581901b84013584018035801530021790602080820135916040810135019081019035613d3f848484848a6144ac565b50505050838390508160010191508103613d0e5750505050565b604080516060815290819052610d8183836001600160a01b0316613586565b604080516060815290819052610d818383613586565b6040518151835114613dac57634e487b715f5260326020526024601cfd5b8251613db757505050565b5f80613dc2856144ea565b613dcb856144ea565b91509150613dd885614519565b613de18561456e565b848403601f196020870187518752875160051b3684830137845160051b5b8086015181860151835b82815114613e1957602001613e09565b860180518201808252821115613e3b57634e487b715f5260116020526024601cfd5b505050820180613dff5750505050826040525050505050565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f511416613ece57803d853b151710613ece57633e3f8f735f526004601cfd5b505f603452505050565b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af1611dd1576396b3de235f526004601cfd5b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301613f6e5763f5a267f15f526004601cfd5b82613f805768fbb67fda52d4bfb8bf92505b80546001600160601b0381168260205280614042578160601c80613fae578560601b845560019450506128d2565b858103613fbb57506128d2565b600184015460601c80613fdc578660601b60018601556001955050506128d2565b868103613fea5750506128d2565b600285015460601c8061400c578760601b6002870155600196505050506128d2565b87810361401b575050506128d2565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f20805461408457600191821c808301825591945081614070578560601b6003178455506128d2565b8560601b82850155826002018455506128d2565b5050505092915050565b5f60205f80843c5f5160f01c61ef011460035160601c029050919050565b5f385f3884865af161323a5763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416613ece57803d853b151710613ece576390b8ec185f526004601cfd5b5f80826002811115614119576141196146d2565b141592915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf830361414e5763f5a267f15f526004601cfd5b826141605768fbb67fda52d4bfb8bf92505b80195481602052806142045781548061418057848355600193505061272f565b84810361418d575061272f565b6001830154806141a85785600185015560019450505061272f565b8581036141b657505061272f565b6002840154806141d2578660028601556001955050505061272f565b8681036141e15750505061272f565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f2080546128d257600191821c8381018690558083019182905590821b821783195590925061272f565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c17156142c157633995943b5f526004601cfd5b505f5b83811461378557365f8260051b850135808601602081019350803592505084828401118160401c17156142fe57633995943b5f526004601cfd5b5061430a898383611db5565b50506001016142c4565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163303614377576020811015614366576040516355fe73fd60e11b815260040160405180910390fd5b614372848484356129d2565b613785565b806143a65733301461439b576040516282b42960e81b815260040160405180910390fd5b61437284845f6129d2565b60208110156143c8576040516355fe73fd60e11b815260040160405180910390fd5b81356143dd686d3d4e7fb92a523815826145b7565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f8061443a6144208888866114fd565b60208087108188180218808801908088039088110261090c565b915091508161445b576040516282b42960e81b815260040160405180910390fd5b6144668787836129d2565b50505050505050505050565b5f604051855f5260ff851660205283604052826060526020604060805f60015afa505f6060523d6060185191508060405250949350505050565b6144b881868585611f08565b6144dd578085848460405163f78c1b5360e01b81526004016133aa9493929190615143565b6133c185858585856145ce565b604051815160051b8101602001818084035b8082015182528160200191508282036144fc575060405250919050565b80515f82528060051b8201601f19602084015b602001828111614567578051828201805182811161454c5750505061452c565b5b60208201528301805182811161454d57506020015261452c565b5050509052565b6002815110610ea3576020810160408201600183510160051b83015b815183511461459e57602083019250815183525b60208201915080820361458a57505081900360051c9052565b5f806145c384846145f1565b600101905550505050565b604051828482375f388483888a5af16145e9573d5f823e3d81fd5b505050505050565b604081811c5f90815260208490522080546001600160401b0380841682149082101661463057604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f8083601f840112614647575f80fd5b5081356001600160401b0381111561465d575f80fd5b602083019150836020828501011115614630575f80fd5b5f805f60408486031215614686575f80fd5b8335925060208401356001600160401b038111156146a2575f80fd5b6146ae86828701614637565b9497909650939450505050565b5f602082840312156146cb575f80fd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f602082015160038110614735576147356146d2565b8060208501525060408201511515604084015260608201516080606085015261211a60808501826146e6565b602081525f610d816020830184614714565b6001600160a01b0381168114610ea3575f80fd5b803580151581146121c3575f80fd5b5f805f80608085870312156147a9575f80fd5b8435935060208501356147bb81614773565b925060408501356001600160e01b0319811681146147d7575f80fd5b91506147e560608601614787565b905092959194509250565b5f805f60608486031215614802575f80fd5b833561480d81614773565b9250602084013561481d81614773565b915061482b60408501614787565b90509250925092565b5f60208284031215614844575f80fd5b8135610d8181614773565b8035600681106121c3575f80fd5b5f805f6060848603121561486f575f80fd5b83359250602084013561488181614773565b915061482b6040850161484f565b5f8151808452602084019350602083015f5b828110156148bf5781518652602095860195909101906001016148a1565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561492057605f1987860301845261490b858351614714565b945060209384019391909101906001016148ef565b505050508281036020840152612655818561488f565b5f8060208385031215614947575f80fd5b82356001600160401b0381111561495c575f80fd5b61496885828601614637565b90969095509350505050565b5f60208284031215614984575f80fd5b81356001600160c01b0381168114610d81575f80fd5b5f805f80608085870312156149ad575f80fd5b8435935060208501356149bf81614773565b92506149cd6040860161484f565b9396929550929360600135925050565b602080825282518282018190525f918401906040840190835b81811015614a1d5783516001600160a01b03168352602093840193909201916001016149f6565b509095945050505050565b5f8083601f840112614a38575f80fd5b5081356001600160401b03811115614a4e575f80fd5b6020830191508360208260051b8501011115614630575f80fd5b5f805f60408486031215614a7a575f80fd5b83356001600160401b03811115614a8f575f80fd5b614a9b86828701614a28565b909790965060209590950135949350505050565b5f805f60608486031215614ac1575f80fd5b83359250602084013561481d81614773565b60ff60f81b8816815260e060208201525f614af160e08301896146e6565b8281036040840152614b0381896146e6565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b81811015614b58578351835260209384019390920191600101614b3a565b50909b9a5050505050505050505050565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b0381118282101715614b9f57614b9f614b69565b60405290565b5f82601f830112614bb4575f80fd5b81356001600160401b03811115614bcd57614bcd614b69565b604051601f8201601f19908116603f011681016001600160401b0381118282101715614bfb57614bfb614b69565b604052818152838201602001851015614c12575f80fd5b816020850160208301375f918101602001919091529392505050565b5f60208284031215614c3e575f80fd5b81356001600160401b03811115614c53575f80fd5b820160808185031215614c64575f80fd5b614c6c614b7d565b813564ffffffffff81168114614c80575f80fd5b8152602082013560038110614c93575f80fd5b6020820152614ca460408301614787565b604082015260608201356001600160401b03811115614cc1575f80fd5b614ccd86828501614ba5565b606083015250949350505050565b5f8060208385031215614cec575f80fd5b82356001600160401b03811115614d01575f80fd5b61496885828601614a28565b60068110614d1d57614d1d6146d2565b9052565b5f8151808452602084019350602083015f5b828110156148bf57815180516001600160a01b031687526020808201515f91614d5e908a0182614d0d565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e09095019460209190910190600101614d33565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b82811015614dfe57605f19878603018452614de9858351614d21565b94506020938401939190910190600101614dcd565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b83811015614e5757601f19868403018552614e4183835161488f565b6020958601959093509190910190600101614e25565b509098975050505050505050565b602081525f610d8160208301846146e6565b5f805f805f805f8060e0898b031215614e8e575f80fd5b8835614e9981614773565b97506020890135614ea981614773565b9650604089013595506060890135614ec081614773565b94506080890135935060a0890135925060c08901356001600160401b03811115614ee8575f80fd5b614ef48b828c01614637565b999c989b5096995094979396929594505050565b602081525f610d816020830184614d21565b5f8060408385031215614f2b575f80fd5b8235614f3681614773565b9150614f4460208401614787565b90509250929050565b602081525f610d81602083018461488f565b5f8060408385031215614f70575f80fd5b82359150614f446020840161484f565b5f805f8060608587031215614f93575f80fd5b843593506020850135614fa581614773565b925060408501356001600160401b03811115614fbf575f80fd5b614fcb87828801614637565b95989497509550505050565b5f60208284031215614fe7575f80fd5b8151610d8181614773565b8381526001600160a01b03831660208201526060810161211a6040830184614d0d565b634e487b7160e01b5f52603260045260245ffd5b634e487b7160e01b5f52601160045260245ffd5b5f6001820161504e5761504e615029565b5060010190565b8481526001600160a01b0384166020820152608081016150786040830185614d0d565b82606083015295945050505050565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f61211a602083018486615087565b8082018082111561131e5761131e615029565b5f85518060208801845e60d886901b6001600160d81b03191690830190815260038510615104576151046146d2565b60f894851b600582015292151590931b6006830152506007019392505050565b5f8261513e57634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f90613cf8908301848661508756fe3232323232323232323232323232323232323232323232323232323232323232a26469706673582212206c78f3ed6ca142e4cd02c7b92c1f6dd2a383182808d761b3ec08784730a4d4f664736f6c634300081a0033" as const;


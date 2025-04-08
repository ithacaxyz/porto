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
    "inputs": []
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
    "name": "NewSequenceMustBeLarger",
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

export const code = "0x61014060405260405161529c38038061529c833981016040819052610023916100e6565b306080524660a052606080610071604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264181718171960d91b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610113565b5f602082840312156100f6575f80fd5b81516001600160a01b038116811461010c575f80fd5b9392505050565b60805160a05160c05160e051610100516101205161512d61016f5f395f81816106840152818161114f01528181611ce1015261422801525f612f8801525f61304201525f61301c01525f612fcc01525f612fa9015261512d5ff3fe608060405260043610610275575f3560e01c80637656d3041161014e578063cebfe336116100c0578063e9ae5c5311610079578063e9ae5c5314610860578063f5f996bd14610873578063faba56d814610892578063fac750e0146108b1578063fcd4e707146108c5578063ff619c6b146108ed5761027c565b8063cebfe3361461078f578063d03c7914146107ae578063dcc09ebf146107cd578063e28250b4146107f9578063e537b27b14610815578063e5adda71146108345761027c565b8063ad07708311610112578063ad077083146106c5578063b70e36f0146106e4578063b75c7dc614610703578063bc2c554a14610722578063bf5309691461074f578063cb4774c41461076e5761027c565b80637656d304146106195780637b8e4ecc1461063857806384b0196e1461064c57806394430fa514610673578063a840fe49146106a65761027c565b80632f3f30c7116101e7578063515c9d6d116101ab578063515c9d6d14610548578063598daac4146105685780635f7c23ab1461058757806360d2f33d146105b35780636c95d5a7146105e65780636fd91454146105fa5761027c565b80632f3f30c7146104a757806335058501146104c157806336745d10146104db5780633e1b08121461050a5780634223b5c2146105295761027c565b8063164b859911610239578063164b8599146103b45780631a37ef23146103d35780631a912f3e146103f257806320606b70146104335780632081a278146104665780632150c518146104855761027c565b80630cef73b4146102b557806311a86fd6146102f057806312aaac701461032f578063136a12f71461035b5780631626ba7e1461037c5761027c565b3661027c57005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a02821417156102a757806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102c0575f80fd5b506102d46102cf3660046145e7565b61090c565b6040805192151583526020830191909152015b60405180910390f35b3480156102fb575f80fd5b5061031773323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102e7565b34801561033a575f80fd5b5061034e61034936600461462e565b610b08565b6040516102e791906146d4565b348015610366575f80fd5b5061037a610375366004614709565b610bf7565b005b348015610387575f80fd5b5061039b6103963660046145e7565b610d1c565b6040516001600160e01b031990911681526020016102e7565b3480156103bf575f80fd5b5061037a6103ce366004614763565b610d88565b3480156103de575f80fd5b5061037a6103ed3660046147a7565b610e4f565b3480156103fd575f80fd5b506104257f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102e7565b34801561043e575f80fd5b506104257f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b348015610471575f80fd5b5061037a6104803660046147d0565b610ea6565b348015610490575f80fd5b50610499610fd9565b6040516102e792919061483c565b3480156104b2575f80fd5b5061039b630707070760e51b81565b3480156104cc575f80fd5b5061039b631919191960e11b81565b3480156104e6575f80fd5b506104fa6104f53660046148a9565b611143565b60405190151581526020016102e7565b348015610515575f80fd5b506104256105243660046148e7565b6112fd565b348015610534575f80fd5b5061034e61054336600461462e565b611333565b348015610553575f80fd5b506104255f805160206150d883398151915281565b348015610573575f80fd5b5061037a61058236600461490d565b61136b565b348015610592575f80fd5b506105a66105a13660046147a7565b61147f565b6040516102e79190614950565b3480156105be575f80fd5b506104257f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b3480156105f1575f80fd5b506104fa611492565b348015610605575f80fd5b506104256106143660046149db565b6114af565b348015610624575f80fd5b5061037a610633366004614a22565b6115cb565b348015610643575f80fd5b506105a661167d565b348015610657575f80fd5b50610660611691565b6040516102e79796959493929190614a46565b34801561067e575f80fd5b506103177f000000000000000000000000000000000000000000000000000000000000000081565b3480156106b1575f80fd5b506104256106c0366004614ba1565b6116b7565b3480156106d0575f80fd5b506105a66106df36600461462e565b6116f0565b3480156106ef575f80fd5b5061037a6106fe36600461462e565b6116fe565b34801561070e575f80fd5b5061037a61071d36600461462e565b611766565b34801561072d575f80fd5b5061074161073c366004614c4e565b6117bb565b6040516102e7929190614d1a565b34801561075a575f80fd5b5061037a6107693660046148a9565b6118f2565b348015610779575f80fd5b50610782611996565b6040516102e79190614dd8565b34801561079a575f80fd5b506104256107a9366004614ba1565b6119aa565b3480156107b9575f80fd5b506104fa6107c836600461462e565b611a12565b3480156107d8575f80fd5b506107ec6107e736600461462e565b611a35565b6040516102e79190614dea565b348015610804575f80fd5b50686d3d4e7fb92a52381454610425565b348015610820575f80fd5b5061037a61082f366004614dfc565b611bef565b34801561083f575f80fd5b5061085361084e36600461462e565b611ca0565b6040516102e79190614e2f565b61037a61086e3660046145e7565b611cb3565b34801561087e575f80fd5b5061037a61088d366004614e41565b611cdf565b34801561089d575f80fd5b506104256108ac366004614ec9565b611d46565b3480156108bc575f80fd5b50610425611e5a565b3480156108d0575f80fd5b506108da61c1d081565b60405161ffff90911681526020016102e7565b3480156108f8575f80fd5b506104fa610907366004614eea565b611e6d565b5f806041831460408414171561093c5730610928868686612087565b6001600160a01b03161491505f9050610b00565b602183101561094f57505f905080610b00565b506020198281018381118185180281189385019182013591601f19013560ff16156109805761097d8661210f565b95505b505f61098b82610b08565b805190915064ffffffffff1642811090151516156109ac575f925050610b00565b5f816020015160028111156109c3576109c3614645565b03610a1e575f80603f86118735810290602089013502915091505f80610a02856060015180516020820151604090920151603f90911191820292910290565b91509150610a138a8585858561212d565b965050505050610afe565b600181602001516002811115610a3657610a36614645565b03610abb57606081810151805160208083015160409384015184518084018d9052855180820385018152601f8c018590049094028101870186529485018a8152603f9490941091820295910293610ab2935f92610aab928d918d918291018382808284375f920191909152506121c692505050565b85856122aa565b94505050610afe565b600281602001516002811115610ad357610ad3614645565b03610afe57610afb8160600151806020019051810190610af39190614f41565b8787876123c9565b92505b505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f828152686d3d4e7fb92a52381760205260408120610b48906124a9565b8051909150610b6a5760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610b7e8383016020015190565b60d881901c855260c881901c915060d01c60ff166002811115610ba357610ba3614645565b84602001906002811115610bb957610bb9614645565b90816002811115610bcc57610bcc614645565b90525060ff811615156040850152610be983838151811082025290565b606085015250919392505050565b333014610c16576040516282b42960e81b815260040160405180910390fd5b8380610c3557604051638707510560e01b815260040160405180910390fd5b5f805160206150d88339815191528514610c7057610c528561250f565b15610c7057604051630442081560e01b815260040160405180910390fd5b610c7a8484612523565b15610c98576040516303a6f8c760e21b815260040160405180910390fd5b610cbb60e084901c606086901b1783610800610cb38961254b565b92919061259a565b50604080518681526001600160a01b03861660208201526001600160e01b0319851681830152831515606082015290517f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e19181900360800190a15050505050565b5f805f610d2a86868661090c565b90925090508115158115151615610d6457610d4481610b08565b6040015180610d615750610d6133610d5b836125c3565b906125f2565b91505b81610d735763ffffffff610d79565b631626ba7e5b60e01b925050505b9392505050565b333014610da7576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813610dc4686d3d4e7fb92a523819856125f2565b610de0576040516282b42960e81b815260040160405180910390fd5b610df98383610200610df18861269c565b9291906126d5565b50826001600160a01b0316846001600160a01b03167f22e306b6bdb65906c2b1557fba289ced7fe45decec4c8df8dbc9c21a65ac305284604051610e41911515815260200190565b60405180910390a350505050565b333014610e6e576040516282b42960e81b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c5251905550565b50565b333014610ec5576040516282b42960e81b815260040160405180910390fd5b8280610ee457604051638707510560e01b815260040160405180910390fd5b5f610eee8561254b565b6001600160a01b0385165f908152600282016020526040902060019091019150610f3c846005811115610f2357610f23614645565b8254600160ff9092169190911b80198216845516151590565b15610f5c575f610f4b826126f0565b03610f5c57610f5a828661270b565b505b806001015f856005811115610f7357610f73614645565b60ff168152602081019190915260409081015f9081208181556001810182905560020155517fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a2790610fc990889088908890614f5c565b60405180910390a1505050505050565b6060805f610fe5611e5a565b9050806001600160401b03811115610fff57610fff614adc565b60405190808252806020026020018201604052801561104e57816020015b604080516080810182525f80825260208083018290529282015260608082015282525f1990920191018161101d5790505b509250806001600160401b0381111561106957611069614adc565b604051908082528060200260200182016040528015611092578160200160208202803683370190505b5091505f805b82811015611138575f6110b982686d3d4e7fb92a5238135b60030190612840565b90505f6110c582610b08565b805190915064ffffffffff1642811090151516156110e4575050611130565b808785815181106110f7576110f7614f7f565b60200260200101819052508186858151811061111557611115614f7f565b60209081029190910101528361112a81614fa7565b94505050505b600101611098565b508084528252509091565b5f336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461118c576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a52381454686d3d4e7fb92a52381390156111c05760405163b62ba30f60e01b815260040160405180910390fd5b365f365f6111ce8888612889565b604080518481526001850160051b8101909152939750919550935091505f5b8481101561128f57600581901b860135860180359060208082013591604081013501908101903561127f856112707f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b0388168761125188886128f5565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b50505050508060010190506111ed565b505f6112ae306112a784805160051b60209091012090565b8635612906565b905080156020841017156112d55760405163e483bbcb60e01b815260040160405180910390fd5b6001870181905585856112e982825f612937565b600199505050505050505050505b92915050565b6001600160c01b0381165f908152686d3d4e7fb92a5238156020526040808220549083901b67ffffffffffffffff1916176112f7565b604080516080810182525f80825260208201819052918101919091526060808201526112f761034983686d3d4e7fb92a5238136110b0565b33301461138a576040516282b42960e81b815260040160405180910390fd5b83806113a957604051638707510560e01b815260040160405180910390fd5b5f6113b38661254b565b60010190506113c481866040612e48565b506001600160a01b0385165f908152600182016020526040902061140a8560058111156113f3576113f3614645565b8254600160ff9092169190911b8082178455161590565b5083816001015f87600581111561142357611423614645565b60ff1681526020019081526020015f205f01819055507f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a8787878760405161146e9493929190614fbf565b60405180910390a150505050505050565b60606112f761148d8361269c565b612e84565b5f6114aa30686d3d4e7fb92a52381360010154612f58565b905090565b5f806114cb8460408051828152600190920160051b8201905290565b90505f5b8481101561154857600581901b86013586018035801530021790602080820135916040810135019081019035611538856112707f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b0388168761125188886128f5565b50505050508060010190506114cf565b5061c1d060f084901c145f6115a27f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b9050816115b7576115b281612f86565b6115c0565b6115c08161309c565b979650505050505050565b3330146115ea576040516282b42960e81b815260040160405180910390fd5b5f838152686d3d4e7fb92a523817602052604090205460ff166116205760405163395ed8c160e21b815260040160405180910390fd5b6116318282610200610df1876125c3565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc9983604051611670911515815260200190565b60405180910390a3505050565b60606114aa686d3d4e7fb92a523819612e84565b600f60f81b6060805f8080836116a5613110565b97989097965046955030945091925090565b5f6112f7826020015160028111156116d1576116d1614645565b60ff168360600151805190602001205f1c5f9182526020526040902090565b60606112f761148d836125c3565b33301461171d576040516282b42960e81b815260040160405180910390fd5b611730686d3d4e7fb92a52381582613150565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b333014611785576040516282b42960e81b815260040160405180910390fd5b61178e816131ba565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b038111156117d7576117d7614adc565b60405190808252806020026020018201604052801561180a57816020015b60608152602001906001900390816117f55790505b509250806001600160401b0381111561182557611825614adc565b60405190808252806020026020018201604052801561185857816020015b60608152602001906001900390816118435790505b5091505f5b818110156118e95761188686868381811061187a5761187a614f7f565b90506020020135611a35565b84828151811061189857611898614f7f565b60200260200101819052506118c48686838181106118b8576118b8614f7f565b90506020020135611ca0565b8382815181106118d6576118d6614f7f565b602090810291909101015260010161185d565b50509250929050565b333014611911576040516282b42960e81b815260040160405180910390fd5b61195982828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250611953925061249c915050565b90613229565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad828260405161198a929190615019565b60405180910390a15050565b60606114aa686d3d4e7fb92a5238136124a9565b5f3330146119ca576040516282b42960e81b815260040160405180910390fd5b6119d382613281565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611a0591906146d4565b60405180910390a2919050565b5f6112f76001600160f81b031980841614611a2c846132f6565b15159015151790565b60605f611a418361254b565b6001019050611a5c6040518060200160405280606081525090565b5f611a6683613308565b90505f5b81811015611be5575f611a7d8583613359565b6001600160a01b0381165f9081526001870160205260408120919250611aa2826133b2565b90505f5b8151811015611bd6575f828281518110611ac257611ac2614f7f565b602002602001015190505f846001015f8360ff1681526020019081526020015f209050611b206040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166005811115611b3557611b35614645565b81602001906005811115611b4b57611b4b614645565b90816005811115611b5e57611b5e614645565b9052506001600160a01b0387168152815460408201526002820154608082015260018201546060820152611ba14260ff851660058111156108ac576108ac614645565b60c08201819052608082015160608301519111150260a082015280611bc68b8261340b565b5050505050806001019050611aa6565b50505050806001019050611a6a565b5050519392505050565b333014611c0e576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813611c2f686d3d4e7fb92a52381984846102006126d5565b5081611c56576001600160a01b0383165f9081526007820160205260409020805460010190555b826001600160a01b03167f31471c9e79dc8535d9341d73e61eaf5e72e4134b3e5b16943305041201581d8883604051611c93911515815260200190565b60405180910390a2505050565b60606112f7611cae8361254b565b6134b4565b6001600160f81b03198084169003611cd457611ccf828261356d565b505050565b611ccf83838361360a565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b039081163314309186169190911416611d32576040516282b42960e81b815260040160405180910390fd5b611d3d87878761368c565b50505050505050565b5f80826005811115611d5a57611d5a614645565b03611d6d57603c808404025b90506112f7565b6001826005811115611d8157611d81614645565b03611d9257610e1080840402611d66565b6002826005811115611da657611da6614645565b03611db8576201518080840402611d66565b6003826005811115611dcc57611dcc614645565b03611df2576007600362015180808604918201929092069003620545ff85110202611d66565b5f80611dfd856136af565b5090925090506004846005811115611e1757611e17614645565b03611e3157611e2882826001613759565b925050506112f7565b6005846005811115611e4557611e45614645565b03611e5657611e2882600180613759565b5f80fd5b5f6114aa686d3d4e7fb92a5238166137b0565b5f84611e7b5750600161207f565b611e848561250f565b15611e915750600161207f565b631919191960e11b60048310611ea5575082355b82611eb45750630707070760e51b5b611ebe8582612523565b15611ecc575f91505061207f565b5f611ed68761254b565b9050611ee1816137b0565b15611f9e57611efc60e083901c606088901b175b82906137fc565b15611f0c5760019250505061207f565b611f1f6332323232606088901b17611ef5565b15611f2f5760019250505061207f565b611f5560e083901c73191919191919191919191919191919191919191960611b17611ef5565b15611f655760019250505061207f565b611f8e7f3232323232323232323232323232323232323232000000000000000032323232611ef5565b15611f9e5760019250505061207f565b611fb45f805160206150d883398151915261254b565b9050611fbf816137b0565b1561207957611fd760e083901c606088901b17611ef5565b15611fe75760019250505061207f565b611ffa6332323232606088901b17611ef5565b1561200a5760019250505061207f565b61203060e083901c73191919191919191919191919191919191919191960611b17611ef5565b156120405760019250505061207f565b6120697f3232323232323232323232323232323232323232000000000000000032323232611ef5565b156120795760019250505061207f565b5f925050505b949350505050565b5f60405182604081146120a257604181146120c957506120fa565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526120da565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d612107575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d61212857fe5b919050565b5f6040518681528560208201528460408201528360608201528260808201525f805260205f60a0836101005afa503d612191576d1ab2e8006fd8b71907bf06a5bdee3b6121915760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa61219157fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6040805160c0810182526060808252602082018190525f92820183905281018290526080810182905260a0810191909152815160c081106122a45760208301818101818251018281108260c08301111715612223575050506122a4565b808151019250806020820151018181108382111782851084861117171561224d57505050506122a4565b828151602083010111838551602087010111171561226e57505050506122a4565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f805f6122b988600180613880565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561239d57602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061239d57fe5b50505082156123be576123bb8287608001518860a00151888861212d565b92505b505095945050505050565b5f6001600160a01b0385161561207f57604051853b6124595782604081146123f957604181146124205750612493565b60208581013560ff81901c601b0190915285356040526001600160ff1b0316606052612431565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f60605280604052612493565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b686d3d4e7fb92a52381390565b60405181546020820190600881901c5f8260ff8417146124d757505080825260ff8116601f808211156124f9575b855f5260205f205b8160051c810154828601526020820191508282106124df57505b508084525f920191825250602001604052919050565b5f61251982610b08565b6040015192915050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f805160206150d8833981519152831461256f5761256a83613971565b61257e565b5f805160206150d88339815191525b68a3bbbebc65eb8804df6009525f908152602990209392505050565b5f826125af576125aa858561399e565b6125ba565b6125ba858584613a9c565b95945050505050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81208190610d81565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be19830161262d5763f5a267f15f526004601cfd5b8261263f5768fbb67fda52d4bfb8bf92505b80546001600160601b0381166126835760019250838160601c031561269457600182015460601c841461269457600282015460601c8414612694575b5f9250612694565b81602052835f5260405f2054151592505b505092915050565b6001600160a01b0381165f908152686d3d4e7fb92a52381a602052604081208054601f5263d4203f8b6004528152603f81208190610d81565b5f826126e5576125aa858561270b565b6125ba858584612e48565b5f81545b80156122a4576001918201918119018116186126f4565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016127465763f5a267f15f526004601cfd5b826127585768fbb67fda52d4bfb8bf92505b80546001600160601b038116806127d25760019350848260601c036127905760018301805484556002840180549091555f9055612837565b84600184015460601c036127b15760028301805460018501555f9055612837565b84600284015460601c036127ca575f6002840155612837565b5f9350612837565b82602052845f5260405f208054806127eb575050612837565b60018360011c03925082600182031461281b578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf8114150261286a836137b0565b82106112f757604051634e23d03560e01b815260040160405180910390fd5b365f80806128978686613ab9565b935093506128ad86866040908111913510171590565b156128ec57602085870103866020013580880160208101945080359350828482011182851760401c17156128e85763ba597e7e5f526004601cfd5b5050505b92959194509250565b5f8183604051375060405120919050565b5f82815260a082901c602052604090206001600160a01b031661292a848284613b4f565b610d8157505f9392505050565b8061294757611ccf838383613bab565b5f6129518261254b565b60010190506129bf6040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f6129c983613308565b90505f5b81811015612a1b575f6129e08583613359565b90506001600160a01b03811615612a12576040840151612a009082613c02565b506060840151612a10905f61340b565b505b506001016129cd565b505f805b86811015612bd957600581901b880135880180358015300217906020808201359160408101350190810190358215612a5e57612a5b838761502c565b95505b6004811015612a705750505050612bd1565b813560e01c63a9059cbb819003612aa6576040890151612a909086613c02565b50612aa4602484013560608b015190613c21565b505b8063ffffffff1663095ea7b303612aee5760248301355f03612acc575050505050612bd1565b8851612ad89086613c02565b50612aec600484013560208b015190613c21565b505b8063ffffffff166387517c4503612b66576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba314612b28575050505050612bd1565b60448301355f03612b3d575050505050612bd1565b612b50600484013560808b015190613c21565b50612b64602484013560a08b015190613c21565b505b8063ffffffff1663598daac403612bcb576001600160a01b0385163014612b91575050505050612bd1565b8a600484013514612ba6575050505050612bd1565b612bb9602484013560408b015190613c21565b506060890151612bc9905f61340b565b505b50505050505b600101612a1f565b50604083015151606084015151612bf09190613c37565b5f612c23612c018560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b60408501515151811015612c6f57604085015151600582901b0160200151612c6582612c538330613d0d565b85919060059190911b82016020015290565b5050600101612c27565b50612c7b888888613bab565b5f8080526001860160205260409020612c949083613d37565b5f5b60408501515151811015612d4657604085015151600582901b01602001515f906001600160a01b0381165f9081526001890160205260408120919250612cdb826126f0565b03612ce7575050612d3e565b612d3b81612d36612d05868b60600151613cfd90919063ffffffff16565b612d2b612d18898960051b016020015190565b612d228830613d0d565b80821191030290565b808218908210021890565b613d37565b50505b600101612c96565b505f5b84515151811015612dbf57845151600582901b01602001515f906001600160a01b0381165f908152600189016020526040812091925090612d89906126f0565b03612d945750612db7565b612db581612daf848960200151613cfd90919063ffffffff16565b5f613e0d565b505b600101612d49565b505f5b60808501515151811015612e3d57608085015151600582901b01602001515f906001600160a01b0381165f908152600189016020526040812091925090612e08906126f0565b03612e135750612e35565b612e3381612e2e848960a00151613cfd90919063ffffffff16565b613e57565b505b600101612dc2565b505050505050505050565b5f612e538484613eb2565b90508015610d815781612e6585613308565b1115610d815760405163155176b960e11b815260040160405180910390fd5b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c9250838314158302815281612f12578215612f0d57600191508185015460601c92508215612f0d578284141590920260208301525060028381015460601c918215612f0d576003915083831415830260408201525b612f42565b600191821c915b82811015612f40578581015460601c858114158102600583901b8401529350600101612f19565b505b8186528160051b81016040525050505050919050565b5f80612f638461400d565b905082156001600160a01b038216151715801561207f575061207f848483613b4f565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f00000000000000000000000000000000000000000000000000000000000000004614166130795750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f805f6130a7613110565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264181718171960d91b9083015291565b604081811c5f90815260208490522080546001600160401b038316101561318a576040516312ee5c9360e01b815260040160405180910390fd5b6131b46131ae836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f818152686d3d4e7fb92a52381760209081526040808320839055686d3d4e7fb92a523818909152902080546001019055686d3d4e7fb92a523813613208686d3d4e7fb92a5238168361399e565b6132255760405163395ed8c160e21b815260040160405180910390fd5b5050565b80518060081b60ff175f60fe8311613252575050601f8281015160081b82179080831115613279575b60208401855f5260205f205b828201518360051c82015560208301925084831061325e5750505b509092555050565b5f61328b826116b7565b90505f686d3d4e7fb92a5238136060840151845160208087015160408089015190519596506132e2956132c09594930161503f565b60408051601f198184030181529181525f858152600485016020522090613229565b6132ef600382018361402b565b5050919050565b5f6133008261413d565b151592915050565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c1517613351576001935083830154156133515760029350838301541561335157600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf8214158202915061338c84613308565b83106133ab57604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b80156133f55761ffff81166133da576010918201911c6133bf565b8183526020600582901b16909201916001918201911c6133bf565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c5536020840351818106158282040290508083106134a35782811781018115826020018701604051181761346f57828102601f1987015285016020016040526134a3565b602060405101816020018101604052808a52601f19855b888101518382015281018061348657509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf90602084018161352d57835480156135275780841415028152600184810154909250801561352757808414150260208201526002848101549092508015613527576003925083811415810260408301525b50613558565b8160011c91505f5b8281101561355657848101548481141502600582901b830152600101613535565b505b8185528160051b810160405250505050919050565b686d3d4e7fb92a523813823560601c6014838118818510021880850190808511908503026135a4686d3d4e7fb92a523819846125f2565b6135c0576040516282b42960e81b815260040160405180910390fd5b3330146135f0576135d433610d5b8561269c565b6135f0576040516282b42960e81b815260040160405180910390fd5b604051818382375f388383875af4611d3d573d5f823e3d81fd5b5f6136148461413d565b90508060030361362f57613629848484614186565b50505050565b365f365f8461364557637f1812755f526004601cfd5b5085358087016020810194503592505f90604011600286141115613673575050602080860135860190810190355b6136828888888787878761421e565b5050505050505050565b6001600160a01b0383166136a457611ccf828261437c565b611ccf838383614395565b5f808061374c6136c2620151808661508e565b5f805f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c9250806132ef5781545f9350156132ef576001925082820154156132ef576002925082820154156132ef575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036138295763f5a267f15f526004601cfd5b8261383b5768fbb67fda52d4bfb8bf92505b80195461386c5780546001925083146133ab57600181015483146133ab57600281015483146133ab575f91506133ab565b602052505f90815260409020541515919050565b606083518015612107576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f5184526004840193508284106138fb579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81206112f7565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036139cb5763f5a267f15f526004601cfd5b826139dd5768fbb67fda52d4bfb8bf92505b80195480613a3e576001925083825403613a0a5760018201805483556002830180549091555f9055612694565b83600183015403613a285760028201805460018401555f9055612694565b8360028301540361267b575f6002830155612694565b81602052835f5260405f20805480613a57575050612694565b60018360011c039250826001820314613a8157828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f613aa7848461402b565b90508015610d815781612e65856137b0565b365f833580850160208587010360208201945081359350808460051b8301118360401c1715613aef5763ba597e7e5f526004601cfd5b8315613b45578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c1715613b3c5763ba597e7e5f526004601cfd5b50505082613af9575b5050509250929050565b5f82815260208082206080909152601f8390526305d78094600b526019602720613ba16001600160a01b03871680151590613b8d84601b8a886143d5565b6001600160a01b0316149015159015151690565b9695505050505050565b5f82613bb75750505050565b600581901b84013584018035801530021790602080820135916040810135019081019035613be8848484848a61440f565b50505050838390508160010191508103613bb75750505050565b604080516060815290819052610d8183836001600160a01b031661340b565b604080516060815290819052610d81838361340b565b6040518151835114613c5557634e487b715f5260326020526024601cfd5b8251613c6057505050565b5f80613c6b8561445d565b613c748561445d565b91509150613c818561448c565b613c8a856144e1565b848403601f196020870187518752875160051b3684830137845160051b5b8086015181860151835b82815114613cc257602001613cb2565b860180518201808252821115613ce457634e487b715f5260116020526024601cfd5b505050820180613ca85750505050826040525050505050565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b80613d40575050565b5f613d4a836133b2565b90505f5b8151811015613629575f828281518110613d6a57613d6a614f7f565b602002602001015190505f856001015f8360ff1681526020019081526020015f2090505f613da7428460ff1660058111156108ac576108ac614645565b90508082600201541015613dc357600282018190555f60018301555b815f015486836001015f828254613dda919061502c565b9250508190551115613dff5760405163483f424d60e11b815260040160405180910390fd5b505050806001019050613d4e565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f511416613e4d57803d853b151710613e4d57633e3f8f735f526004601cfd5b505f603452505050565b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af1611ccf576396b3de235f526004601cfd5b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301613eed5763f5a267f15f526004601cfd5b82613eff5768fbb67fda52d4bfb8bf92505b80546001600160601b0381168260205280613fc1578160601c80613f2d578560601b84556001945050612837565b858103613f3a5750612837565b600184015460601c80613f5b578660601b6001860155600195505050612837565b868103613f69575050612837565b600285015460601c80613f8b578760601b600287015560019650505050612837565b878103613f9a57505050612837565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f20805461400357600191821c808301825591945081613fef578560601b600317845550612837565b8560601b8285015582600201845550612837565b5050505092915050565b5f60205f80843c5f5160f01c61ef011460035160601c029050919050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036140585763f5a267f15f526004601cfd5b8261406a5768fbb67fda52d4bfb8bf92505b801954816020528061410e5781548061408a578483556001935050612694565b8481036140975750612694565b6001830154806140b257856001850155600194505050612694565b8581036140c0575050612694565b6002840154806140dc5786600286015560019550505050612694565b8681036140eb57505050612694565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f20805461283757600191821c8381018690558083019182905590821b8217831955909250612694565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c17156141cb57633995943b5f526004601cfd5b505f5b838114611d3d57365f8260051b850135808601602081019350803592505084828401118160401c171561420857633995943b5f526004601cfd5b50614214898383611cb3565b50506001016141ce565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163303614281576020811015614270576040516355fe73fd60e11b815260040160405180910390fd5b61427c84848435612937565b611d3d565b806142b0573330146142a5576040516282b42960e81b815260040160405180910390fd5b61427c84845f612937565b60208110156142d2576040516355fe73fd60e11b815260040160405180910390fd5b81356142e7686d3d4e7fb92a5238158261452a565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f8061434461432a8888866114af565b60208087108188180218808801908088039088110261090c565b9150915081614365576040516282b42960e81b815260040160405180910390fd5b614370878783612937565b50505050505050505050565b5f385f3884865af16132255763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416613e4d57803d853b151710613e4d576390b8ec185f526004601cfd5b5f604051855f5260ff851660205283604052826060526020604060805f60015afa505f6060523d6060185191508060405250949350505050565b61441b81868585611e6d565b614449578085848460405163f78c1b5360e01b815260040161444094939291906150ad565b60405180910390fd5b6144568585858585614541565b5050505050565b604051815160051b8101602001818084035b80820151825281602001915082820361446f575060405250919050565b80515f82528060051b8201601f19602084015b6020018281116144da57805182820180518281116144bf5750505061449f565b5b6020820152830180518281116144c057506020015261449f565b5050509052565b6002815110610ea3576020810160408201600183510160051b83015b815183511461451157602083019250815183525b6020820191508082036144fd57505081900360051c9052565b5f806145368484614564565b600101905550505050565b604051828482375f388483888a5af161455c573d5f823e3d81fd5b505050505050565b604081811c5f90815260208490522080546001600160401b038084168214908210166145a357604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f8083601f8401126145ba575f80fd5b5081356001600160401b038111156145d0575f80fd5b6020830191508360208285010111156145a3575f80fd5b5f805f604084860312156145f9575f80fd5b8335925060208401356001600160401b03811115614615575f80fd5b614621868287016145aa565b9497909650939450505050565b5f6020828403121561463e575f80fd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f6020820151600381106146a8576146a8614645565b8060208501525060408201511515604084015260608201516080606085015261207f6080850182614659565b602081525f610d816020830184614687565b6001600160a01b0381168114610ea3575f80fd5b80358015158114612128575f80fd5b5f805f806080858703121561471c575f80fd5b84359350602085013561472e816146e6565b925060408501356001600160e01b03198116811461474a575f80fd5b9150614758606086016146fa565b905092959194509250565b5f805f60608486031215614775575f80fd5b8335614780816146e6565b92506020840135614790816146e6565b915061479e604085016146fa565b90509250925092565b5f602082840312156147b7575f80fd5b8135610d81816146e6565b803560068110612128575f80fd5b5f805f606084860312156147e2575f80fd5b8335925060208401356147f4816146e6565b915061479e604085016147c2565b5f8151808452602084019350602083015f5b82811015614832578151865260209586019590910190600101614814565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561489357605f1987860301845261487e858351614687565b94506020938401939190910190600101614862565b5050505082810360208401526125ba8185614802565b5f80602083850312156148ba575f80fd5b82356001600160401b038111156148cf575f80fd5b6148db858286016145aa565b90969095509350505050565b5f602082840312156148f7575f80fd5b81356001600160c01b0381168114610d81575f80fd5b5f805f8060808587031215614920575f80fd5b843593506020850135614932816146e6565b9250614940604086016147c2565b9396929550929360600135925050565b602080825282518282018190525f918401906040840190835b818110156149905783516001600160a01b0316835260209384019390920191600101614969565b509095945050505050565b5f8083601f8401126149ab575f80fd5b5081356001600160401b038111156149c1575f80fd5b6020830191508360208260051b85010111156145a3575f80fd5b5f805f604084860312156149ed575f80fd5b83356001600160401b03811115614a02575f80fd5b614a0e8682870161499b565b909790965060209590950135949350505050565b5f805f60608486031215614a34575f80fd5b833592506020840135614790816146e6565b60ff60f81b8816815260e060208201525f614a6460e0830189614659565b8281036040840152614a768189614659565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b81811015614acb578351835260209384019390920191600101614aad565b50909b9a5050505050505050505050565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b0381118282101715614b1257614b12614adc565b60405290565b5f82601f830112614b27575f80fd5b81356001600160401b03811115614b4057614b40614adc565b604051601f8201601f19908116603f011681016001600160401b0381118282101715614b6e57614b6e614adc565b604052818152838201602001851015614b85575f80fd5b816020850160208301375f918101602001919091529392505050565b5f60208284031215614bb1575f80fd5b81356001600160401b03811115614bc6575f80fd5b820160808185031215614bd7575f80fd5b614bdf614af0565b813564ffffffffff81168114614bf3575f80fd5b8152602082013560038110614c06575f80fd5b6020820152614c17604083016146fa565b604082015260608201356001600160401b03811115614c34575f80fd5b614c4086828501614b18565b606083015250949350505050565b5f8060208385031215614c5f575f80fd5b82356001600160401b03811115614c74575f80fd5b6148db8582860161499b565b60068110614c9057614c90614645565b9052565b5f8151808452602084019350602083015f5b8281101561483257815180516001600160a01b031687526020808201515f91614cd1908a0182614c80565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e09095019460209190910190600101614ca6565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b82811015614d7157605f19878603018452614d5c858351614c94565b94506020938401939190910190600101614d40565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b83811015614dca57601f19868403018552614db4838351614802565b6020958601959093509190910190600101614d98565b509098975050505050505050565b602081525f610d816020830184614659565b602081525f610d816020830184614c94565b5f8060408385031215614e0d575f80fd5b8235614e18816146e6565b9150614e26602084016146fa565b90509250929050565b602081525f610d816020830184614802565b5f805f805f805f60c0888a031215614e57575f80fd5b8735614e62816146e6565b96506020880135614e72816146e6565b9550604088013594506060880135614e89816146e6565b93506080880135925060a08801356001600160401b03811115614eaa575f80fd5b614eb68a828b016145aa565b989b979a50959850939692959293505050565b5f8060408385031215614eda575f80fd5b82359150614e26602084016147c2565b5f805f8060608587031215614efd575f80fd5b843593506020850135614f0f816146e6565b925060408501356001600160401b03811115614f29575f80fd5b614f35878288016145aa565b95989497509550505050565b5f60208284031215614f51575f80fd5b8151610d81816146e6565b8381526001600160a01b03831660208201526060810161207f6040830184614c80565b634e487b7160e01b5f52603260045260245ffd5b634e487b7160e01b5f52601160045260245ffd5b5f60018201614fb857614fb8614f93565b5060010190565b8481526001600160a01b038416602082015260808101614fe26040830185614c80565b82606083015295945050505050565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f61207f602083018486614ff1565b808201808211156112f7576112f7614f93565b5f85518060208801845e60d886901b6001600160d81b0319169083019081526003851061506e5761506e614645565b60f894851b600582015292151590931b6006830152506007019392505050565b5f826150a857634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f90613ba19083018486614ff156fe3232323232323232323232323232323232323232323232323232323232323232a264697066735822122029437e47abbf5fd259124fb02c871492b40a2c734cb6a0ef5e7fc7e993e14d9c64736f6c634300081a0033" as const;


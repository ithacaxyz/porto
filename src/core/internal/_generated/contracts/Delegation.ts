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
            "name": "target",
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
    "name": "UnsupportedExecutionMode",
    "inputs": []
  }
] as const;

export const code = "0x610140604052604051615214380380615214833981016040819052610023916100e6565b306080524660a052606080610071604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610113565b5f602082840312156100f6575f80fd5b81516001600160a01b038116811461010c575f80fd5b9392505050565b60805160a05160c05160e05161010051610120516150a561016f5f395f81816106a30152818161114f0152818161136d015261427a01525f612fa101525f61305b01525f61303501525f612fe501525f612fc201526150a55ff3fe608060405260043610610275575f3560e01c80636fd914541161014e578063cb4774c4116100c0578063e5adda7111610079578063e5adda7114610853578063e9ae5c531461087f578063faba56d814610892578063fac750e0146108b1578063fcd4e707146108c5578063ff619c6b146108ed5761027c565b8063cb4774c41461078d578063cebfe336146107ae578063d03c7914146107cd578063dcc09ebf146107ec578063e28250b414610818578063e537b27b146108345761027c565b8063a840fe4911610112578063a840fe49146106c5578063ad077083146106e4578063b70e36f014610703578063b75c7dc614610722578063bc2c554a14610741578063bf5309691461076e5761027c565b80636fd91454146106195780637656d304146106385780637b8e4ecc1461065757806384b0196e1461066b57806394430fa5146106925761027c565b80632f3f30c7116101e7578063515c9d6d116101ab578063515c9d6d1461054857806356298c9814610568578063598daac4146105875780635f7c23ab146105a657806360d2f33d146105d25780636c95d5a7146106055761027c565b80632f3f30c7146104a757806335058501146104c157806336745d10146104db5780633e1b08121461050a5780634223b5c2146105295761027c565b8063164b859911610239578063164b8599146103b45780631a37ef23146103d35780631a912f3e146103f257806320606b70146104335780632081a278146104665780632150c518146104855761027c565b80630cef73b4146102b557806311a86fd6146102f057806312aaac701461032f578063136a12f71461035b5780631626ba7e1461037c5761027c565b3661027c57005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a02821417156102a757806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102c0575f80fd5b506102d46102cf3660046145ce565b61090c565b6040805192151583526020830191909152015b60405180910390f35b3480156102fb575f80fd5b5061031773323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102e7565b34801561033a575f80fd5b5061034e610349366004614615565b610b08565b6040516102e791906146bb565b348015610366575f80fd5b5061037a6103753660046146f0565b610bf7565b005b348015610387575f80fd5b5061039b6103963660046145ce565b610d1c565b6040516001600160e01b031990911681526020016102e7565b3480156103bf575f80fd5b5061037a6103ce36600461474a565b610d88565b3480156103de575f80fd5b5061037a6103ed36600461478e565b610e4f565b3480156103fd575f80fd5b506104257f84fa2cf05cd88e992eae77e851af68a4ee278dcff6ef504e487a55b3baadfbe581565b6040519081526020016102e7565b34801561043e575f80fd5b506104257f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b348015610471575f80fd5b5061037a6104803660046147b7565b610ea6565b348015610490575f80fd5b50610499610fd9565b6040516102e7929190614823565b3480156104b2575f80fd5b5061039b630707070760e51b81565b3480156104cc575f80fd5b5061039b631919191960e11b81565b3480156104e6575f80fd5b506104fa6104f5366004614890565b611143565b60405190151581526020016102e7565b348015610515575f80fd5b506104256105243660046148ce565b6112fd565b348015610534575f80fd5b5061034e610543366004614615565b611333565b348015610553575f80fd5b506104255f8051602061505083398151915281565b348015610573575f80fd5b5061037a6105823660046148f4565b61136b565b348015610592575f80fd5b5061037a6105a1366004614944565b6113cf565b3480156105b1575f80fd5b506105c56105c036600461478e565b6114e3565b6040516102e79190614987565b3480156105dd575f80fd5b506104257fe5dcff20fdd02f442e4306a50171756423d892722700f22b6731c9a4c7133acb81565b348015610610575f80fd5b506104fa6114f6565b348015610624575f80fd5b50610425610633366004614a12565b611513565b348015610643575f80fd5b5061037a610652366004614a59565b61162f565b348015610662575f80fd5b506105c56116e1565b348015610676575f80fd5b5061067f6116f5565b6040516102e79796959493929190614a7d565b34801561069d575f80fd5b506103177f000000000000000000000000000000000000000000000000000000000000000081565b3480156106d0575f80fd5b506104256106df366004614bd8565b61171b565b3480156106ef575f80fd5b506105c56106fe366004614615565b611754565b34801561070e575f80fd5b5061037a61071d366004614615565b611762565b34801561072d575f80fd5b5061037a61073c366004614615565b6117ca565b34801561074c575f80fd5b5061076061075b366004614c85565b61181f565b6040516102e7929190614d51565b348015610779575f80fd5b5061037a610788366004614890565b611956565b348015610798575f80fd5b506107a16119fa565b6040516102e79190614e0f565b3480156107b9575f80fd5b506104256107c8366004614bd8565b611a0e565b3480156107d8575f80fd5b506104fa6107e7366004614615565b611a76565b3480156107f7575f80fd5b5061080b610806366004614615565b611a99565b6040516102e79190614e21565b348015610823575f80fd5b50686d3d4e7fb92a52381454610425565b34801561083f575f80fd5b5061037a61084e366004614e33565b611c53565b34801561085e575f80fd5b5061087261086d366004614615565b611d04565b6040516102e79190614e66565b61037a61088d3660046145ce565b611d17565b34801561089d575f80fd5b506104256108ac366004614e78565b611d43565b3480156108bc575f80fd5b50610425611e57565b3480156108d0575f80fd5b506108da61c1d081565b60405161ffff90911681526020016102e7565b3480156108f8575f80fd5b506104fa610907366004614e99565b611e6a565b5f806041831460408414171561093c5730610928868686612084565b6001600160a01b03161491505f9050610b00565b602183101561094f57505f905080610b00565b506020198281018381118185180281189385019182013591601f19013560ff16156109805761097d8661210c565b95505b505f61098b82610b08565b805190915064ffffffffff1642811090151516156109ac575f925050610b00565b5f816020015160028111156109c3576109c361462c565b03610a1e575f80603f86118735810290602089013502915091505f80610a02856060015180516020820151604090920151603f90911191820292910290565b91509150610a138a8585858561212a565b965050505050610afe565b600181602001516002811115610a3657610a3661462c565b03610abb57606081810151805160208083015160409384015184518084018d9052855180820385018152601f8c018590049094028101870186529485018a8152603f9490941091820295910293610ab2935f92610aab928d918d918291018382808284375f920191909152506121bc92505050565b85856122a0565b94505050610afe565b600281602001516002811115610ad357610ad361462c565b03610afe57610afb8160600151806020019051810190610af39190614ef0565b8787876123bf565b92505b505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f828152686d3d4e7fb92a52381760205260408120610b489061249f565b8051909150610b6a5760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610b7e8383016020015190565b60d881901c855260c881901c915060d01c60ff166002811115610ba357610ba361462c565b84602001906002811115610bb957610bb961462c565b90816002811115610bcc57610bcc61462c565b90525060ff811615156040850152610be983838151811082025290565b606085015250919392505050565b333014610c16576040516282b42960e81b815260040160405180910390fd5b8380610c3557604051638707510560e01b815260040160405180910390fd5b5f805160206150508339815191528514610c7057610c5285612505565b15610c7057604051630442081560e01b815260040160405180910390fd5b610c7a8484612519565b15610c98576040516303a6f8c760e21b815260040160405180910390fd5b610cbb60e084901c606086901b1783610800610cb389612541565b929190612590565b50604080518681526001600160a01b03861660208201526001600160e01b0319851681830152831515606082015290517f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e19181900360800190a15050505050565b5f805f610d2a86868661090c565b90925090508115158115151615610d6457610d4481610b08565b6040015180610d615750610d6133610d5b836125b9565b906125e8565b91505b81610d735763ffffffff610d79565b631626ba7e5b60e01b925050505b9392505050565b333014610da7576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813610dc4686d3d4e7fb92a523819856125e8565b610de0576040516282b42960e81b815260040160405180910390fd5b610df98383610200610df188612692565b9291906126cb565b50826001600160a01b0316846001600160a01b03167f22e306b6bdb65906c2b1557fba289ced7fe45decec4c8df8dbc9c21a65ac305284604051610e41911515815260200190565b60405180910390a350505050565b333014610e6e576040516282b42960e81b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c5251905550565b50565b333014610ec5576040516282b42960e81b815260040160405180910390fd5b8280610ee457604051638707510560e01b815260040160405180910390fd5b5f610eee85612541565b6001600160a01b0385165f908152600282016020526040902060019091019150610f3c846005811115610f2357610f2361462c565b8254600160ff9092169190911b80198216845516151590565b15610f5c575f610f4b826126e6565b03610f5c57610f5a8286612701565b505b806001015f856005811115610f7357610f7361462c565b60ff168152602081019190915260409081015f9081208181556001810182905560020155517fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a2790610fc990889088908890614f0b565b60405180910390a1505050505050565b6060805f610fe5611e57565b9050806001600160401b03811115610fff57610fff614b13565b60405190808252806020026020018201604052801561104e57816020015b604080516080810182525f80825260208083018290529282015260608082015282525f1990920191018161101d5790505b509250806001600160401b0381111561106957611069614b13565b604051908082528060200260200182016040528015611092578160200160208202803683370190505b5091505f805b82811015611138575f6110b982686d3d4e7fb92a5238135b60030190612836565b90505f6110c582610b08565b805190915064ffffffffff1642811090151516156110e4575050611130565b808785815181106110f7576110f7614f2e565b60200260200101819052508186858151811061111557611115614f2e565b60209081029190910101528361112a81614f56565b94505050505b600101611098565b508084528252509091565b5f336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461118c576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a52381454686d3d4e7fb92a52381390156111c05760405163b62ba30f60e01b815260040160405180910390fd5b365f365f6111ce888861287f565b604080518481526001850160051b8101909152939750919550935091505f5b8481101561128f57600581901b860135860180359060208082013591604081013501908101903561127f856112707f84fa2cf05cd88e992eae77e851af68a4ee278dcff6ef504e487a55b3baadfbe56001600160a01b0388168761125188886128eb565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b50505050508060010190506111ed565b505f6112ae306112a784805160051b60209091012090565b86356128fc565b905080156020841017156112d55760405163e483bbcb60e01b815260040160405180910390fd5b6001870181905585856112e982825f61292d565b600199505050505050505050505b92915050565b6001600160c01b0381165f908152686d3d4e7fb92a5238156020526040808220549083901b67ffffffffffffffff1916176112f7565b604080516080810182525f80825260208201819052918101919091526060808201526112f761034983686d3d4e7fb92a5238136110b0565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0390811633143091831691909114166113be576040516282b42960e81b815260040160405180910390fd5b6113c9848484612e3e565b50505050565b3330146113ee576040516282b42960e81b815260040160405180910390fd5b838061140d57604051638707510560e01b815260040160405180910390fd5b5f61141786612541565b600101905061142881866040612e61565b506001600160a01b0385165f908152600182016020526040902061146e8560058111156114575761145761462c565b8254600160ff9092169190911b8082178455161590565b5083816001015f8760058111156114875761148761462c565b60ff1681526020019081526020015f205f01819055507f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a878787876040516114d29493929190614f6e565b60405180910390a150505050505050565b60606112f76114f183612692565b612e9d565b5f61150e30686d3d4e7fb92a52381360010154612f71565b905090565b5f8061152f8460408051828152600190920160051b8201905290565b90505f5b848110156115ac57600581901b8601358601803580153002179060208082013591604081013501908101903561159c856112707f84fa2cf05cd88e992eae77e851af68a4ee278dcff6ef504e487a55b3baadfbe56001600160a01b0388168761125188886128eb565b5050505050806001019050611533565b5061c1d060f084901c145f6116067fe5dcff20fdd02f442e4306a50171756423d892722700f22b6731c9a4c7133acb83855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b90508161161b5761161681612f9f565b611624565b611624816130b5565b979650505050505050565b33301461164e576040516282b42960e81b815260040160405180910390fd5b5f838152686d3d4e7fb92a523817602052604090205460ff166116845760405163395ed8c160e21b815260040160405180910390fd5b6116958282610200610df1876125b9565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc99836040516116d4911515815260200190565b60405180910390a3505050565b606061150e686d3d4e7fb92a523819612e9d565b600f60f81b6060805f808083611709613129565b97989097965046955030945091925090565b5f6112f7826020015160028111156117355761173561462c565b60ff168360600151805190602001205f1c5f9182526020526040902090565b60606112f76114f1836125b9565b333014611781576040516282b42960e81b815260040160405180910390fd5b611794686d3d4e7fb92a52381582613169565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b3330146117e9576040516282b42960e81b815260040160405180910390fd5b6117f2816131d3565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b0381111561183b5761183b614b13565b60405190808252806020026020018201604052801561186e57816020015b60608152602001906001900390816118595790505b509250806001600160401b0381111561188957611889614b13565b6040519080825280602002602001820160405280156118bc57816020015b60608152602001906001900390816118a75790505b5091505f5b8181101561194d576118ea8686838181106118de576118de614f2e565b90506020020135611a99565b8482815181106118fc576118fc614f2e565b602002602001018190525061192886868381811061191c5761191c614f2e565b90506020020135611d04565b83828151811061193a5761193a614f2e565b60209081029190910101526001016118c1565b50509250929050565b333014611975576040516282b42960e81b815260040160405180910390fd5b6119bd82828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f920191909152506119b79250612492915050565b90613242565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad82826040516119ee929190614fa0565b60405180910390a15050565b606061150e686d3d4e7fb92a52381361249f565b5f333014611a2e576040516282b42960e81b815260040160405180910390fd5b611a378261329a565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611a6991906146bb565b60405180910390a2919050565b5f6112f76001600160f81b031980841614611a908461330f565b15159015151790565b60605f611aa583612541565b6001019050611ac06040518060200160405280606081525090565b5f611aca83613321565b90505f5b81811015611c49575f611ae18583613372565b6001600160a01b0381165f9081526001870160205260408120919250611b06826133cb565b90505f5b8151811015611c3a575f828281518110611b2657611b26614f2e565b602002602001015190505f846001015f8360ff1681526020019081526020015f209050611b846040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166005811115611b9957611b9961462c565b81602001906005811115611baf57611baf61462c565b90816005811115611bc257611bc261462c565b9052506001600160a01b0387168152815460408201526002820154608082015260018201546060820152611c054260ff851660058111156108ac576108ac61462c565b60c08201819052608082015160608301519111150260a082015280611c2a8b82613424565b5050505050806001019050611b0a565b50505050806001019050611ace565b5050519392505050565b333014611c72576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813611c93686d3d4e7fb92a52381984846102006126cb565b5081611cba576001600160a01b0383165f9081526007820160205260409020805460010190555b826001600160a01b03167f31471c9e79dc8535d9341d73e61eaf5e72e4134b3e5b16943305041201581d8883604051611cf7911515815260200190565b60405180910390a2505050565b60606112f7611d1283612541565b6134cd565b6001600160f81b03198084169003611d3857611d338282613586565b505050565b611d3383838361362c565b5f80826005811115611d5757611d5761462c565b03611d6a57603c808404025b90506112f7565b6001826005811115611d7e57611d7e61462c565b03611d8f57610e1080840402611d63565b6002826005811115611da357611da361462c565b03611db5576201518080840402611d63565b6003826005811115611dc957611dc961462c565b03611def576007600362015180808604918201929092069003620545ff85110202611d63565b5f80611dfa856136a8565b5090925090506004846005811115611e1457611e1461462c565b03611e2e57611e2582826001613752565b925050506112f7565b6005846005811115611e4257611e4261462c565b03611e5357611e2582600180613752565b5f80fd5b5f61150e686d3d4e7fb92a5238166137a9565b5f84611e785750600161207c565b611e8185612505565b15611e8e5750600161207c565b631919191960e11b60048310611ea2575082355b82611eb15750630707070760e51b5b611ebb8582612519565b15611ec9575f91505061207c565b5f611ed387612541565b9050611ede816137a9565b15611f9b57611ef960e083901c606088901b175b82906137f5565b15611f095760019250505061207c565b611f1c6332323232606088901b17611ef2565b15611f2c5760019250505061207c565b611f5260e083901c73191919191919191919191919191919191919191960611b17611ef2565b15611f625760019250505061207c565b611f8b7f3232323232323232323232323232323232323232000000000000000032323232611ef2565b15611f9b5760019250505061207c565b611fb15f80516020615050833981519152612541565b9050611fbc816137a9565b1561207657611fd460e083901c606088901b17611ef2565b15611fe45760019250505061207c565b611ff76332323232606088901b17611ef2565b156120075760019250505061207c565b61202d60e083901c73191919191919191919191919191919191919191960611b17611ef2565b1561203d5760019250505061207c565b6120667f3232323232323232323232323232323232323232000000000000000032323232611ef2565b156120765760019250505061207c565b5f925050505b949350505050565b5f604051826040811461209f57604181146120c657506120f7565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526120d7565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d612104575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d61212557fe5b919050565b5f6040518681528560208201528460408201528360608201528260808201525f805260205f60a0836101005afa503d6121875760203d60a0836dd01ea45f9efd5c54f037fa57ea1a5afa503d6121875763d0d5039b3d526004601cfd5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6040805160c0810182526060808252602082018190525f92820183905281018290526080810182905260a0810191909152815160c0811061229a5760208301818101818251018281108260c083011117156122195750505061229a565b8081510192508060208201510181811083821117828510848611171715612243575050505061229a565b8281516020830101118385516020870101111715612264575050505061229a565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f805f6122af88600180613879565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561239357602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061239357fe5b50505082156123b4576123b18287608001518860a00151888861212a565b92505b505095945050505050565b5f6001600160a01b0385161561207c57604051853b61244f5782604081146123ef57604181146124165750612489565b60208581013560ff81901c601b0190915285356040526001600160ff1b0316606052612427565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f60605280604052612489565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b686d3d4e7fb92a52381390565b60405181546020820190600881901c5f8260ff8417146124cd57505080825260ff8116601f808211156124ef575b855f5260205f205b8160051c810154828601526020820191508282106124d557505b508084525f920191825250602001604052919050565b5f61250f82610b08565b6040015192915050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f805160206150508339815191528314612565576125608361396a565b612574565b5f805160206150508339815191525b68a3bbbebc65eb8804df6009525f908152602990209392505050565b5f826125a5576125a08585613997565b6125b0565b6125b0858584613a95565b95945050505050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81208190610d81565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016126235763f5a267f15f526004601cfd5b826126355768fbb67fda52d4bfb8bf92505b80546001600160601b0381166126795760019250838160601c031561268a57600182015460601c841461268a57600282015460601c841461268a575b5f925061268a565b81602052835f5260405f2054151592505b505092915050565b6001600160a01b0381165f908152686d3d4e7fb92a52381a602052604081208054601f5263d4203f8b6004528152603f81208190610d81565b5f826126db576125a08585612701565b6125b0858584612e61565b5f81545b801561229a576001918201918119018116186126ea565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be19830161273c5763f5a267f15f526004601cfd5b8261274e5768fbb67fda52d4bfb8bf92505b80546001600160601b038116806127c85760019350848260601c036127865760018301805484556002840180549091555f905561282d565b84600184015460601c036127a75760028301805460018501555f905561282d565b84600284015460601c036127c0575f600284015561282d565b5f935061282d565b82602052845f5260405f208054806127e157505061282d565b60018360011c039250826001820314612811578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612860836137a9565b82106112f757604051634e23d03560e01b815260040160405180910390fd5b365f808061288d8686613ab2565b935093506128a386866040908111913510171590565b156128e257602085870103866020013580880160208101945080359350828482011182851760401c17156128de5763ba597e7e5f526004601cfd5b5050505b92959194509250565b5f8183604051375060405120919050565b5f82815260a082901c602052604090206001600160a01b0316612920848284613b48565b610d8157505f9392505050565b8061293d57611d33838383613ba4565b5f61294782612541565b60010190506129b56040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f6129bf83613321565b90505f5b81811015612a11575f6129d68583613372565b90506001600160a01b03811615612a085760408401516129f69082613bfb565b506060840151612a06905f613424565b505b506001016129c3565b505f805b86811015612bcf57600581901b880135880180358015300217906020808201359160408101350190810190358215612a5457612a518387614fce565b95505b6004811015612a665750505050612bc7565b813560e01c63a9059cbb819003612a9c576040890151612a869086613bfb565b50612a9a602484013560608b015190613c1a565b505b8063ffffffff1663095ea7b303612ae45760248301355f03612ac2575050505050612bc7565b8851612ace9086613bfb565b50612ae2600484013560208b015190613c1a565b505b8063ffffffff166387517c4503612b5c576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba314612b1e575050505050612bc7565b60448301355f03612b33575050505050612bc7565b612b46600484013560808b015190613c1a565b50612b5a602484013560a08b015190613c1a565b505b8063ffffffff1663598daac403612bc1576001600160a01b0385163014612b87575050505050612bc7565b8a600484013514612b9c575050505050612bc7565b612baf602484013560408b015190613c1a565b506060890151612bbf905f613424565b505b50505050505b600101612a15565b50604083015151606084015151612be69190613c30565b5f612c19612bf78560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b60408501515151811015612c6557604085015151600582901b0160200151612c5b82612c498330613d06565b85919060059190911b82016020015290565b5050600101612c1d565b50612c71888888613ba4565b5f8080526001860160205260409020612c8a9083613d30565b5f5b60408501515151811015612d3c57604085015151600582901b01602001515f906001600160a01b0381165f9081526001890160205260408120919250612cd1826126e6565b03612cdd575050612d34565b612d3181612d2c612cfb868b60600151613cf690919063ffffffff16565b612d21612d0e898960051b016020015190565b612d188830613d06565b80821191030290565b808218908210021890565b613d30565b50505b600101612c8c565b505f5b84515151811015612db557845151600582901b01602001515f906001600160a01b0381165f908152600189016020526040812091925090612d7f906126e6565b03612d8a5750612dad565b612dab81612da5848960200151613cf690919063ffffffff16565b5f613e06565b505b600101612d3f565b505f5b60808501515151811015612e3357608085015151600582901b01602001515f906001600160a01b0381165f908152600189016020526040812091925090612dfe906126e6565b03612e095750612e2b565b612e2981612e24848960a00151613cf690919063ffffffff16565b613e50565b505b600101612db8565b505050505050505050565b6001600160a01b038316612e5657611d338282613eab565b611d33838383613ec4565b5f612e6c8484613f04565b90508015610d815781612e7e85613321565b1115610d815760405163155176b960e11b815260040160405180910390fd5b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c9250838314158302815281612f2b578215612f2657600191508185015460601c92508215612f26578284141590920260208301525060028381015460601c918215612f26576003915083831415830260408201525b612f5b565b600191821c915b82811015612f59578581015460601c858114158102600583901b8401529350600101612f32565b505b8186528160051b81016040525050505050919050565b5f80612f7c8461405f565b905082156001600160a01b038216151715801561207c575061207c848483613b48565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f00000000000000000000000000000000000000000000000000000000000000004614166130925750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f805f6130c0613129565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b604081811c5f90815260208490522080546001600160401b03831610156131a3576040516312ee5c9360e01b815260040160405180910390fd5b6131cd6131c7836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f818152686d3d4e7fb92a52381760209081526040808320839055686d3d4e7fb92a523818909152902080546001019055686d3d4e7fb92a523813613221686d3d4e7fb92a52381683613997565b61323e5760405163395ed8c160e21b815260040160405180910390fd5b5050565b80518060081b60ff175f60fe831161326b575050601f8281015160081b82179080831115613292575b60208401855f5260205f205b828201518360051c8201556020830192508483106132775750505b509092555050565b5f6132a48261171b565b90505f686d3d4e7fb92a5238136060840151845160208087015160408089015190519596506132fb956132d995949301614fe1565b60408051601f198184030181529181525f858152600485016020522090613242565b613308600382018361407d565b5050919050565b5f6133198261418f565b151592915050565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c151761336a5760019350838301541561336a5760029350838301541561336a57600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf821415820291506133a584613321565b83106133c457604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b801561340e5761ffff81166133f3576010918201911c6133d8565b8183526020600582901b16909201916001918201911c6133d8565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c5536020840351818106158282040290508083106134bc5782811781018115826020018701604051181761348857828102601f1987015285016020016040526134bc565b602060405101816020018101604052808a52601f19855b888101518382015281018061349f57509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf90602084018161354657835480156135405780841415028152600184810154909250801561354057808414150260208201526002848101549092508015613540576003925083811415810260408301525b50613571565b8160011c91505f5b8281101561356f57848101548481141502600582901b83015260010161354e565b505b8185528160051b810160405250505050919050565b686d3d4e7fb92a523813823560601c6014838118818510021880850190808511908503026135bd686d3d4e7fb92a523819846125e8565b6135d9576040516282b42960e81b815260040160405180910390fd5b333014613609576135ed33610d5b85612692565b613609576040516282b42960e81b815260040160405180910390fd5b604051818382375f388383875af4613623573d5f823e3d81fd5b50505050505050565b5f6136368461418f565b90508060030361364b576113c98484846141d8565b365f365f8461366157637f1812755f526004601cfd5b5085358087016020810194503592505f9060401160028614111561368f575050602080860135860190810190355b61369e88888887878787614270565b5050505050505050565b5f80806137456136bb6201518086615030565b5f805f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c9250806133085781545f9350156133085760019250828201541561330857600292508282015415613308575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036138225763f5a267f15f526004601cfd5b826138345768fbb67fda52d4bfb8bf92505b8019546138655780546001925083146133c457600181015483146133c457600281015483146133c4575f91506133c4565b602052505f90815260409020541515919050565b606083518015612104576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f5184526004840193508284106138f4579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81206112f7565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036139c45763f5a267f15f526004601cfd5b826139d65768fbb67fda52d4bfb8bf92505b80195480613a37576001925083825403613a035760018201805483556002830180549091555f905561268a565b83600183015403613a215760028201805460018401555f905561268a565b83600283015403612671575f600283015561268a565b81602052835f5260405f20805480613a5057505061268a565b60018360011c039250826001820314613a7a57828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f613aa0848461407d565b90508015610d815781612e7e856137a9565b365f833580850160208587010360208201945081359350808460051b8301118360401c1715613ae85763ba597e7e5f526004601cfd5b8315613b3e578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c1715613b355763ba597e7e5f526004601cfd5b50505082613af2575b5050509250929050565b5f82815260208082206080909152601f8390526305d78094600b526019602720613b9a6001600160a01b03871680151590613b8684601b8a886143ce565b6001600160a01b0316149015159015151690565b9695505050505050565b5f82613bb05750505050565b600581901b84013584018035801530021790602080820135916040810135019081019035613be1848484848a614408565b50505050838390508160010191508103613bb05750505050565b604080516060815290819052610d8183836001600160a01b0316613424565b604080516060815290819052610d818383613424565b6040518151835114613c4e57634e487b715f5260326020526024601cfd5b8251613c5957505050565b5f80613c6485614444565b613c6d85614444565b91509150613c7a85614473565b613c83856144c8565b848403601f196020870187518752875160051b3684830137845160051b5b8086015181860151835b82815114613cbb57602001613cab565b860180518201808252821115613cdd57634e487b715f5260116020526024601cfd5b505050820180613ca15750505050826040525050505050565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b80613d39575050565b5f613d43836133cb565b90505f5b81518110156113c9575f828281518110613d6357613d63614f2e565b602002602001015190505f856001015f8360ff1681526020019081526020015f2090505f613da0428460ff1660058111156108ac576108ac61462c565b90508082600201541015613dbc57600282018190555f60018301555b815f015486836001015f828254613dd39190614fce565b9250508190551115613df85760405163483f424d60e11b815260040160405180910390fd5b505050806001019050613d47565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f511416613e4657803d853b151710613e4657633e3f8f735f526004601cfd5b505f603452505050565b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af1611d33576396b3de235f526004601cfd5b5f385f3884865af161323e5763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416613e4657803d853b151710613e46576390b8ec185f526004601cfd5b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301613f3f5763f5a267f15f526004601cfd5b82613f515768fbb67fda52d4bfb8bf92505b80546001600160601b0381168260205280614013578160601c80613f7f578560601b8455600194505061282d565b858103613f8c575061282d565b600184015460601c80613fad578660601b600186015560019550505061282d565b868103613fbb57505061282d565b600285015460601c80613fdd578760601b60028701556001965050505061282d565b878103613fec5750505061282d565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f20805461405557600191821c808301825591945081614041578560601b60031784555061282d565b8560601b828501558260020184555061282d565b5050505092915050565b5f60205f80843c5f5160f01c61ef011460035160601c029050919050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036140aa5763f5a267f15f526004601cfd5b826140bc5768fbb67fda52d4bfb8bf92505b8019548160205280614160578154806140dc57848355600193505061268a565b8481036140e9575061268a565b6001830154806141045785600185015560019450505061268a565b85810361411257505061268a565b60028401548061412e578660028601556001955050505061268a565b86810361413d5750505061268a565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f20805461282d57600191821c8381018690558083019182905590821b821783195590925061268a565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c171561421d57633995943b5f526004601cfd5b505f5b83811461362357365f8260051b850135808601602081019350803592505084828401118160401c171561425a57633995943b5f526004601cfd5b50614266898383611d17565b5050600101614220565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001633036142d35760208110156142c2576040516355fe73fd60e11b815260040160405180910390fd5b6142ce8484843561292d565b613623565b80614302573330146142f7576040516282b42960e81b815260040160405180910390fd5b6142ce84845f61292d565b6020811015614324576040516355fe73fd60e11b815260040160405180910390fd5b8135614339686d3d4e7fb92a52381582614511565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f8061439661437c888886611513565b60208087108188180218808801908088039088110261090c565b91509150816143b7576040516282b42960e81b815260040160405180910390fd5b6143c287878361292d565b50505050505050505050565b5f604051855f5260ff851660205283604052826060526020604060805f60015afa505f6060523d6060185191508060405250949350505050565b61441481868585611e6a565b614430576040516282b42960e81b815260040160405180910390fd5b61443d8585858585614528565b5050505050565b604051815160051b8101602001818084035b808201518252816020019150828203614456575060405250919050565b80515f82528060051b8201601f19602084015b6020018281116144c157805182820180518281116144a657505050614486565b5b6020820152830180518281116144a7575060200152614486565b5050509052565b6002815110610ea3576020810160408201600183510160051b83015b81518351146144f857602083019250815183525b6020820191508082036144e457505081900360051c9052565b5f8061451d848461454b565b600101905550505050565b604051828482375f388483888a5af1614543573d5f823e3d81fd5b505050505050565b604081811c5f90815260208490522080546001600160401b0380841682149082101661458a57604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f8083601f8401126145a1575f80fd5b5081356001600160401b038111156145b7575f80fd5b60208301915083602082850101111561458a575f80fd5b5f805f604084860312156145e0575f80fd5b8335925060208401356001600160401b038111156145fc575f80fd5b61460886828701614591565b9497909650939450505050565b5f60208284031215614625575f80fd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f60208201516003811061468f5761468f61462c565b8060208501525060408201511515604084015260608201516080606085015261207c6080850182614640565b602081525f610d81602083018461466e565b6001600160a01b0381168114610ea3575f80fd5b80358015158114612125575f80fd5b5f805f8060808587031215614703575f80fd5b843593506020850135614715816146cd565b925060408501356001600160e01b031981168114614731575f80fd5b915061473f606086016146e1565b905092959194509250565b5f805f6060848603121561475c575f80fd5b8335614767816146cd565b92506020840135614777816146cd565b9150614785604085016146e1565b90509250925092565b5f6020828403121561479e575f80fd5b8135610d81816146cd565b803560068110612125575f80fd5b5f805f606084860312156147c9575f80fd5b8335925060208401356147db816146cd565b9150614785604085016147a9565b5f8151808452602084019350602083015f5b828110156148195781518652602095860195909101906001016147fb565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561487a57605f1987860301845261486585835161466e565b94506020938401939190910190600101614849565b5050505082810360208401526125b081856147e9565b5f80602083850312156148a1575f80fd5b82356001600160401b038111156148b6575f80fd5b6148c285828601614591565b90969095509350505050565b5f602082840312156148de575f80fd5b81356001600160c01b0381168114610d81575f80fd5b5f805f8060808587031215614907575f80fd5b8435614912816146cd565b93506020850135614922816146cd565b9250604085013591506060850135614939816146cd565b939692955090935050565b5f805f8060808587031215614957575f80fd5b843593506020850135614969816146cd565b9250614977604086016147a9565b9396929550929360600135925050565b602080825282518282018190525f918401906040840190835b818110156149c75783516001600160a01b03168352602093840193909201916001016149a0565b509095945050505050565b5f8083601f8401126149e2575f80fd5b5081356001600160401b038111156149f8575f80fd5b6020830191508360208260051b850101111561458a575f80fd5b5f805f60408486031215614a24575f80fd5b83356001600160401b03811115614a39575f80fd5b614a45868287016149d2565b909790965060209590950135949350505050565b5f805f60608486031215614a6b575f80fd5b833592506020840135614777816146cd565b60ff60f81b8816815260e060208201525f614a9b60e0830189614640565b8281036040840152614aad8189614640565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b81811015614b02578351835260209384019390920191600101614ae4565b50909b9a5050505050505050505050565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b0381118282101715614b4957614b49614b13565b60405290565b5f82601f830112614b5e575f80fd5b81356001600160401b03811115614b7757614b77614b13565b604051601f8201601f19908116603f011681016001600160401b0381118282101715614ba557614ba5614b13565b604052818152838201602001851015614bbc575f80fd5b816020850160208301375f918101602001919091529392505050565b5f60208284031215614be8575f80fd5b81356001600160401b03811115614bfd575f80fd5b820160808185031215614c0e575f80fd5b614c16614b27565b813564ffffffffff81168114614c2a575f80fd5b8152602082013560038110614c3d575f80fd5b6020820152614c4e604083016146e1565b604082015260608201356001600160401b03811115614c6b575f80fd5b614c7786828501614b4f565b606083015250949350505050565b5f8060208385031215614c96575f80fd5b82356001600160401b03811115614cab575f80fd5b6148c2858286016149d2565b60068110614cc757614cc761462c565b9052565b5f8151808452602084019350602083015f5b8281101561481957815180516001600160a01b031687526020808201515f91614d08908a0182614cb7565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e09095019460209190910190600101614cdd565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b82811015614da857605f19878603018452614d93858351614ccb565b94506020938401939190910190600101614d77565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b83811015614e0157601f19868403018552614deb8383516147e9565b6020958601959093509190910190600101614dcf565b509098975050505050505050565b602081525f610d816020830184614640565b602081525f610d816020830184614ccb565b5f8060408385031215614e44575f80fd5b8235614e4f816146cd565b9150614e5d602084016146e1565b90509250929050565b602081525f610d8160208301846147e9565b5f8060408385031215614e89575f80fd5b82359150614e5d602084016147a9565b5f805f8060608587031215614eac575f80fd5b843593506020850135614ebe816146cd565b925060408501356001600160401b03811115614ed8575f80fd5b614ee487828801614591565b95989497509550505050565b5f60208284031215614f00575f80fd5b8151610d81816146cd565b8381526001600160a01b03831660208201526060810161207c6040830184614cb7565b634e487b7160e01b5f52603260045260245ffd5b634e487b7160e01b5f52601160045260245ffd5b5f60018201614f6757614f67614f42565b5060010190565b8481526001600160a01b038416602082015260808101614f916040830185614cb7565b82606083015295945050505050565b60208152816020820152818360408301375f818301604090810191909152601f909201601f19160101919050565b808201808211156112f7576112f7614f42565b5f85518060208801845e60d886901b6001600160d81b031916908301908152600385106150105761501061462c565b60f894851b600582015292151590931b6006830152506007019392505050565b5f8261504a57634e487b7160e01b5f52601260045260245ffd5b50049056fe3232323232323232323232323232323232323232323232323232323232323232a2646970667358221220c9d7a01184ef98bb05a9b516ef8cd84759c265b8c4e82bfb54523456b73928ed64736f6c634300081a0033" as const;


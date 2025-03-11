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

export const code = "0x610140604052604051614cfe380380614cfe833981016040819052610023916100e6565b306080524660a052606080610071604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610113565b5f602082840312156100f6575f80fd5b81516001600160a01b038116811461010c575f80fd5b9392505050565b60805160a05160c05160e0516101005161012051614b8f61016f5f395f818161067e01528181610fb4015281816111d20152613ea101525f612c1b01525f612cd501525f612caf01525f612c5f01525f612c3c0152614b8f5ff3fe60806040526004361061025f575f3560e01c80636fd9145411610143578063cebfe336116100b5578063e5adda7111610079578063e5adda7114610801578063e9ae5c531461082d578063faba56d814610840578063fac750e01461085f578063fcd4e70714610873578063ff619c6b1461089b57610266565b8063cebfe3361461075c578063d03c79141461077b578063dcc09ebf1461079a578063e28250b4146107c6578063e537b27b146107e257610266565b8063a840fe4911610107578063a840fe49146106a0578063ad077083146106bf578063b70e36f0146106de578063b75c7dc6146106fd578063bf5309691461071c578063cb4774c41461073b57610266565b80636fd91454146105f45780637656d304146106135780637b8e4ecc1461063257806384b0196e1461064657806394430fa51461066d57610266565b80632f3f30c7116101dc578063515c9d6d116101a0578063515c9d6d1461051057806356298c9814610543578063598daac4146105625780635f7c23ab1461058157806360d2f33d146105ad5780636c95d5a7146105e057610266565b80632f3f30c71461046f578063350585011461048957806336745d10146104a35780633e1b0812146104d25780634223b5c2146104f157610266565b8063164b859911610223578063164b85991461039e5780631a37ef23146103bd5780631a912f3e146103dc57806320606b701461041d5780632081a2781461045057610266565b80630cef73b41461029f57806311a86fd6146102da57806312aaac7014610319578063136a12f7146103455780631626ba7e1461036657610266565b3661026657005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a028214171561029157806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102aa575f80fd5b506102be6102b9366004614294565b6108ba565b6040805192151583526020830191909152015b60405180910390f35b3480156102e5575f80fd5b5061030173323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102d1565b348015610324575f80fd5b506103386103333660046142db565b610ab6565b6040516102d19190614334565b348015610350575f80fd5b5061036461035f3660046143aa565b610ba5565b005b348015610371575f80fd5b50610385610380366004614294565b610ce7565b6040516001600160e01b031990911681526020016102d1565b3480156103a9575f80fd5b506103646103b8366004614404565b610d53565b3480156103c8575f80fd5b506103646103d7366004614448565b610e1a565b3480156103e7575f80fd5b5061040f7f84fa2cf05cd88e992eae77e851af68a4ee278dcff6ef504e487a55b3baadfbe581565b6040519081526020016102d1565b348015610428575f80fd5b5061040f7f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b34801561045b575f80fd5b5061036461046a366004614471565b610e71565b34801561047a575f80fd5b50610385630707070760e51b81565b348015610494575f80fd5b50610385631919191960e11b81565b3480156104ae575f80fd5b506104c26104bd3660046144a3565b610fa8565b60405190151581526020016102d1565b3480156104dd575f80fd5b5061040f6104ec3660046144e1565b611162565b3480156104fc575f80fd5b5061033861050b3660046142db565b611198565b34801561051b575f80fd5b5061040f7f323232323232323232323232323232323232323232323232323232323232323281565b34801561054e575f80fd5b5061036461055d366004614507565b6111d0565b34801561056d575f80fd5b5061036461057c366004614557565b611234565b34801561058c575f80fd5b506105a061059b366004614448565b611352565b6040516102d1919061459a565b3480156105b8575f80fd5b5061040f7fe5dcff20fdd02f442e4306a50171756423d892722700f22b6731c9a4c7133acb81565b3480156105eb575f80fd5b506104c2611365565b3480156105ff575f80fd5b5061040f61060e3660046145e5565b611382565b34801561061e575f80fd5b5061036461062d366004614658565b61149e565b34801561063d575f80fd5b506105a0611550565b348015610651575f80fd5b5061065a611564565b6040516102d1979695949392919061467c565b348015610678575f80fd5b506103017f000000000000000000000000000000000000000000000000000000000000000081565b3480156106ab575f80fd5b5061040f6106ba3660046147d7565b61158a565b3480156106ca575f80fd5b506105a06106d93660046142db565b6115c3565b3480156106e9575f80fd5b506103646106f83660046142db565b6115d1565b348015610708575f80fd5b506103646107173660046142db565b611639565b348015610727575f80fd5b506103646107363660046144a3565b61168e565b348015610746575f80fd5b5061074f611732565b6040516102d19190614884565b348015610767575f80fd5b5061040f6107763660046147d7565b611746565b348015610786575f80fd5b506104c26107953660046142db565b6117ae565b3480156107a5575f80fd5b506107b96107b43660046142db565b6117d1565b6040516102d191906148aa565b3480156107d1575f80fd5b50686d3d4e7fb92a5238145461040f565b3480156107ed575f80fd5b506103646107fc366004614938565b61198c565b34801561080c575f80fd5b5061082061081b3660046142db565b611a3d565b6040516102d1919061496b565b61036461083b366004614294565b611a5e565b34801561084b575f80fd5b5061040f61085a3660046149a2565b611a8a565b34801561086a575f80fd5b5061040f611b9e565b34801561087e575f80fd5b5061088861c1d081565b60405161ffff90911681526020016102d1565b3480156108a6575f80fd5b506104c26108b53660046149c3565b611bb1565b5f80604183146040841417156108ea57306108d6868686611e0e565b6001600160a01b03161491505f9050610aae565b60218310156108fd57505f905080610aae565b506020198281018381118185180281189385019182013591601f19013560ff161561092e5761092b86611e96565b95505b505f61093982610ab6565b805190915064ffffffffff16428110901515161561095a575f925050610aae565b5f81602001516002811115610971576109716142f2565b036109cc575f80603f86118735810290602089013502915091505f806109b0856060015180516020820151604090920151603f90911191820292910290565b915091506109c18a85858585611eb4565b965050505050610aac565b6001816020015160028111156109e4576109e46142f2565b03610a6957606081810151805160208083015160409384015184518084018d9052855180820385018152601f8c018590049094028101870186529485018a8152603f9490941091820295910293610a60935f92610a59928d918d918291018382808284375f92019190915250611f4692505050565b858561202a565b94505050610aac565b600281602001516002811115610a8157610a816142f2565b03610aac57610aa98160600151806020019051810190610aa19190614a1a565b878787612149565b92505b505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f828152686d3d4e7fb92a52381760205260408120610af690612229565b8051909150610b185760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610b2c8383016020015190565b60d881901c855260c881901c915060d01c60ff166002811115610b5157610b516142f2565b84602001906002811115610b6757610b676142f2565b90816002811115610b7a57610b7a6142f2565b90525060ff811615156040850152610b9783838151811082025290565b606085015250919392505050565b333014610bc4576040516282b42960e81b815260040160405180910390fd5b8380610be357604051638707510560e01b815260040160405180910390fd5b7f32323232323232323232323232323232323232323232323232323232323232328514610c3157610c138561228f565b15610c3157604051630442081560e01b815260040160405180910390fd5b610c3b84846122a3565b15610c59576040516303a6f8c760e21b815260040160405180910390fd5b5f858152683c149ebf7b8e6c5e2260205260409020610c8690606086901b60e086901c17846108006122cb565b50604080518681526001600160a01b03861660208201526001600160e01b0319851681830152831515606082015290517f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e19181900360800190a15050505050565b5f805f610cf58686866108ba565b90925090508115158115151615610d2f57610d0f81610ab6565b6040015180610d2c5750610d2c33610d26836122f4565b90612323565b91505b81610d3e5763ffffffff610d44565b631626ba7e5b60e01b925050505b9392505050565b333014610d72576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813610d8f686d3d4e7fb92a52381985612323565b610dab576040516282b42960e81b815260040160405180910390fd5b610dc48383610200610dbc886123cd565b929190612406565b50826001600160a01b0316846001600160a01b03167f22e306b6bdb65906c2b1557fba289ced7fe45decec4c8df8dbc9c21a65ac305284604051610e0c911515815260200190565b60405180910390a350505050565b333014610e39576040516282b42960e81b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c5251905550565b50565b333014610e90576040516282b42960e81b815260040160405180910390fd5b8280610eaf57604051638707510560e01b815260040160405180910390fd5b5f848152683c149ebf7b8e6c5e23602090815260408083206001600160a01b038716845260018101909252909120610f0b846005811115610ef257610ef26142f2565b8254600160ff9092169190911b80198216845516151590565b15610f2b575f610f1a82612421565b03610f2b57610f29828661243c565b505b806001015f856005811115610f4257610f426142f2565b60ff168152602081019190915260409081015f9081208181556001810182905560020155517fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a2790610f9890889088908890614a35565b60405180910390a1505050505050565b5f336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610ff1576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a52381454686d3d4e7fb92a52381390156110255760405163b62ba30f60e01b815260040160405180910390fd5b365f365f6110338888612571565b604080518481526001850160051b8101909152939750919550935091505f5b848110156110f457600581901b86013586018035906020808201359160408101350190810190356110e4856110d57f84fa2cf05cd88e992eae77e851af68a4ee278dcff6ef504e487a55b3baadfbe56001600160a01b038816876110b688886125dd565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b5050505050806001019050611052565b505f6111133061110c84805160051b60209091012090565b86356125ee565b9050801560208410171561113a5760405163e483bbcb60e01b815260040160405180910390fd5b60018701819055858561114e82825f61261f565b600199505050505050505050505b92915050565b6001600160c01b0381165f908152686d3d4e7fb92a5238156020526040808220549083901b67ffffffffffffffff19161761115c565b604080516080810182525f808252602082018190529181019190915260608082015261115c610333686d3d4e7fb92a52381684612a6f565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b039081163314309183169190911416611223576040516282b42960e81b815260040160405180910390fd5b61122e848484612ab8565b50505050565b333014611253576040516282b42960e81b815260040160405180910390fd5b838061127257604051638707510560e01b815260040160405180910390fd5b5f858152683c149ebf7b8e6c5e23602052604090819020906112979082908790612adb565b506001600160a01b0385165f90815260018201602052604090206112dd8560058111156112c6576112c66142f2565b8254600160ff9092169190911b8082178455161590565b5083816001015f8760058111156112f6576112f66142f2565b60ff1681526020019081526020015f205f01819055507f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a878787876040516113419493929190614a58565b60405180910390a150505050505050565b606061115c611360836123cd565b612b17565b5f61137d30686d3d4e7fb92a52381360010154612beb565b905090565b5f8061139e8460408051828152600190920160051b8201905290565b90505f5b8481101561141b57600581901b8601358601803580153002179060208082013591604081013501908101903561140b856110d57f84fa2cf05cd88e992eae77e851af68a4ee278dcff6ef504e487a55b3baadfbe56001600160a01b038816876110b688886125dd565b50505050508060010190506113a2565b5061c1d060f084901c145f6114757fe5dcff20fdd02f442e4306a50171756423d892722700f22b6731c9a4c7133acb83855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b90508161148a5761148581612c19565b611493565b61149381612d2f565b979650505050505050565b3330146114bd576040516282b42960e81b815260040160405180910390fd5b5f838152686d3d4e7fb92a523817602052604090205460ff166114f35760405163395ed8c160e21b815260040160405180910390fd5b6115048282610200610dbc876122f4565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc9983604051611543911515815260200190565b60405180910390a3505050565b606061137d686d3d4e7fb92a523819612b17565b600f60f81b6060805f808083611578612da3565b97989097965046955030945091925090565b5f61115c826020015160028111156115a4576115a46142f2565b60ff168360600151805190602001205f1c5f9182526020526040902090565b606061115c611360836122f4565b3330146115f0576040516282b42960e81b815260040160405180910390fd5b611603686d3d4e7fb92a52381582612de3565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b333014611658576040516282b42960e81b815260040160405180910390fd5b61166181612e4d565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b3330146116ad576040516282b42960e81b815260040160405180910390fd5b6116f582828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f920191909152506116ef925061221c915050565b90612ebc565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611726929190614a8a565b60405180910390a15050565b606061137d686d3d4e7fb92a523813612229565b5f333014611766576040516282b42960e81b815260040160405180910390fd5b61176f82612f14565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f5836040516117a19190614334565b60405180910390a2919050565b5f61115c6001600160f81b0319808416146117c884612f89565b15159015151790565b5f818152683c149ebf7b8e6c5e2360209081526040918290208251918201909252606080825291905f61180383612f9b565b90505f5b81811015611982575f61181a8583612fec565b6001600160a01b0381165f908152600187016020526040812091925061183f82613045565b90505f5b8151811015611973575f82828151811061185f5761185f614ab8565b602002602001015190505f846001015f8360ff1681526020019081526020015f2090506118bd6040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff1660058111156118d2576118d26142f2565b816020019060058111156118e8576118e86142f2565b908160058111156118fb576118fb6142f2565b9052506001600160a01b038716815281546040820152600282015460808201526001820154606082015261193e4260ff8516600581111561085a5761085a6142f2565b60c08201819052608082015160608301519111150260a0820152806119638b8261309e565b5050505050806001019050611843565b50505050806001019050611807565b5050519392505050565b3330146119ab576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a5238136119cc686d3d4e7fb92a5238198484610200612406565b50816119f3576001600160a01b0383165f9081526007820160205260409020805460010190555b826001600160a01b03167f31471c9e79dc8535d9341d73e61eaf5e72e4134b3e5b16943305041201581d8883604051611a30911515815260200190565b60405180910390a2505050565b5f818152683c149ebf7b8e6c5e226020526040902060609061115c90613149565b6001600160f81b03198084169003611a7f57611a7a8282613202565b505050565b611a7a8383836132a8565b5f80826005811115611a9e57611a9e6142f2565b03611ab157603c808404025b905061115c565b6001826005811115611ac557611ac56142f2565b03611ad657610e1080840402611aaa565b6002826005811115611aea57611aea6142f2565b03611afc576201518080840402611aaa565b6003826005811115611b1057611b106142f2565b03611b36576007600362015180808604918201929092069003620545ff85110202611aaa565b5f80611b4185613324565b5090925090506004846005811115611b5b57611b5b6142f2565b03611b7557611b6c828260016133ce565b9250505061115c565b6005846005811115611b8957611b896142f2565b03611b9a57611b6c826001806133ce565b5f80fd5b5f61137d686d3d4e7fb92a523816613425565b5f84611bbf57506001611e06565b611bc88561228f565b15611bd557506001611e06565b631919191960e11b60048310611be9575082355b82611bf85750630707070760e51b5b611c0285826122a3565b15611c10575f915050611e06565b5f868152683c149ebf7b8e6c5e2260205260409020611c2e81613425565b15611ceb57611c4960e083901c606088901b175b8290613471565b15611c5957600192505050611e06565b611c6c6332323232606088901b17611c42565b15611c7c57600192505050611e06565b611ca260e083901c73191919191919191919191919191919191919191960611b17611c42565b15611cb257600192505050611e06565b611cdb7f3232323232323232323232323232323232323232000000000000000032323232611c42565b15611ceb57600192505050611e06565b507f32323232323232323232323232323232323232323232323232323232323232325f52683c149ebf7b8e6c5e226020527ffb84170d4bff97a96c3c5a06f0790a3c8dd48293c91f0bf923a0298133450503611d4681613425565b15611e0057611d5e60e083901c606088901b17611c42565b15611d6e57600192505050611e06565b611d816332323232606088901b17611c42565b15611d9157600192505050611e06565b611db760e083901c73191919191919191919191919191919191919191960611b17611c42565b15611dc757600192505050611e06565b611df07f3232323232323232323232323232323232323232000000000000000032323232611c42565b15611e0057600192505050611e06565b5f925050505b949350505050565b5f6040518260408114611e295760418114611e505750611e81565b60208581013560ff81901c601b0190915285356040526001600160ff1b0316606052611e61565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d611e8e575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d611eaf57fe5b919050565b5f6040518681528560208201528460408201528360608201528260808201525f805260205f60a0836101005afa503d611f115760203d60a0836dd01ea45f9efd5c54f037fa57ea1a5afa503d611f115763d0d5039b3d526004601cfd5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6040805160c0810182526060808252602082018190525f92820183905281018290526080810182905260a0810191909152815160c081106120245760208301818101818251018281108260c08301111715611fa357505050612024565b8081510192508060208201510181811083821117828510848611171715611fcd5750505050612024565b8281516020830101118385516020870101111715611fee5750505050612024565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f805f612039886001806134f5565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561211d57602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061211d57fe5b505050821561213e5761213b8287608001518860a001518888611eb4565b92505b505095945050505050565b5f6001600160a01b03851615611e0657604051853b6121d957826040811461217957604181146121a05750612213565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526121b1565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f60605280604052612213565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b686d3d4e7fb92a52381390565b60405181546020820190600881901c5f8260ff84171461225757505080825260ff8116601f80821115612279575b855f5260205f205b8160051c8101548286015260208201915082821061225f57505b508084525f920191825250602001604052919050565b5f61229982610ab6565b6040015192915050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f826122e0576122db85856135e6565b6122eb565b6122eb8585846136e4565b95945050505050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81208190610d4c565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be19830161235e5763f5a267f15f526004601cfd5b826123705768fbb67fda52d4bfb8bf92505b80546001600160601b0381166123b45760019250838160601c03156123c557600182015460601c84146123c557600282015460601c84146123c5575b5f92506123c5565b81602052835f5260405f2054151592505b505092915050565b6001600160a01b0381165f908152686d3d4e7fb92a52381a602052604081208054601f5263d4203f8b6004528152603f81208190610d4c565b5f82612416576122db858561243c565b6122eb858584612adb565b5f81545b801561202457600191820191811901811618612425565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016124775763f5a267f15f526004601cfd5b826124895768fbb67fda52d4bfb8bf92505b80546001600160601b038116806125035760019350848260601c036124c15760018301805484556002840180549091555f9055612568565b84600184015460601c036124e25760028301805460018501555f9055612568565b84600284015460601c036124fb575f6002840155612568565b5f9350612568565b82602052845f5260405f2080548061251c575050612568565b60018360011c03925082600182031461254c578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b365f808061257f8686613701565b9350935061259586866040908111913510171590565b156125d457602085870103866020013580880160208101945080359350828482011182851760401c17156125d05763ba597e7e5f526004601cfd5b5050505b92959194509250565b5f8183604051375060405120919050565b5f82815260a082901c602052604090206001600160a01b0316612612848284613797565b610d4c57505f9392505050565b8061262f57611a7a8383836137f3565b5f818152683c149ebf7b8e6c5e23602052604090206126ad6040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f6126b783612f9b565b90505f5b81811015612709575f6126ce8583612fec565b90506001600160a01b038116156127005760408401516126ee908261384a565b5060608401516126fe905f61309e565b505b506001016126bb565b505f805b8681101561289257600581901b88013588018035801530021790602080820135916040810135019081019035821561274c576127498387614acc565b95505b600481101561275e575050505061288a565b813560e01c63a9059cbb8190036127ac576127798a86612323565b61278757505050505061288a565b6040890151612796908661384a565b506127aa602484013560608b015190613869565b505b8063ffffffff1663095ea7b30361280c576127c78a86612323565b6127d557505050505061288a565b60248301355f036127ea57505050505061288a565b88516127f6908661384a565b5061280a600484013560208b015190613869565b505b8063ffffffff166387517c4503612884576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba31461284657505050505061288a565b60448301355f0361285b57505050505061288a565b61286e600484013560808b015190613869565b50612882602484013560a08b015190613869565b505b50505050505b60010161270d565b505f80805260018501602052604090206128ac908261387f565b6040830151516060840151516128c2919061393d565b5f6128f56128d38560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b6040850151515181101561294157604085015151600582901b0160200151612937826129258330613a03565b85919060059190911b82016020015290565b50506001016128f9565b5061294d8888886137f3565b5f5b604085015151518110156129e657604085015151600582901b01602001515f6129788230613a03565b6001600160a01b0383165f90815260018a016020908152604090912060608a015151600587901b01909101519192506129dc916129d7906129cc6129c2898960051b016020015190565b8680821191030290565b808218908210021890565b61387f565b505060010161294f565b505f5b84515151811015612a2257845151600582901b0160200151612a1a9060208781015151600585901b0101515f613a2d565b6001016129e9565b505f5b60808501515151811015612a6457608085015151600582901b0160200151612a5c9060a087015151600584901b0160200151613a77565b600101612a25565b505050505050505050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612a9983613425565b821061115c57604051634e23d03560e01b815260040160405180910390fd5b6001600160a01b038316612ad057611a7a8282613ad2565b611a7a838383613aeb565b5f612ae68484613b2b565b90508015610d4c5781612af885612f9b565b1115610d4c5760405163155176b960e11b815260040160405180910390fd5b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c9250838314158302815281612ba5578215612ba057600191508185015460601c92508215612ba0578284141590920260208301525060028381015460601c918215612ba0576003915083831415830260408201525b612bd5565b600191821c915b82811015612bd3578581015460601c858114158102600583901b8401529350600101612bac565b505b8186528160051b81016040525050505050919050565b5f80612bf684613c86565b905082156001600160a01b0382161517158015611e065750611e06848483613797565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f0000000000000000000000000000000000000000000000000000000000000000461416612d0c5750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f805f612d3a612da3565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b604081811c5f90815260208490522080546001600160401b0383161015612e1d576040516312ee5c9360e01b815260040160405180910390fd5b612e47612e41836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f818152686d3d4e7fb92a52381760209081526040808320839055686d3d4e7fb92a523818909152902080546001019055686d3d4e7fb92a523813612e9b686d3d4e7fb92a523816836135e6565b612eb85760405163395ed8c160e21b815260040160405180910390fd5b5050565b80518060081b60ff175f60fe8311612ee5575050601f8281015160081b82179080831115612f0c575b60208401855f5260205f205b828201518360051c820155602083019250848310612ef15750505b509092555050565b5f612f1e8261158a565b90505f686d3d4e7fb92a523813606084015184516020808701516040808901519051959650612f7595612f5395949301614aeb565b60408051601f198184030181529181525f858152600485016020522090612ebc565b612f826003820183613ca4565b5050919050565b5f612f9382613db6565b151592915050565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c1517612fe457600193508383015415612fe457600293508383015415612fe457600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf8214158202915061301f84612f9b565b831061303e57604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b80156130885761ffff811661306d576010918201911c613052565b8183526020600582901b16909201916001918201911c613052565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c55360208403518181061582820402905080831061313857828117810160608614826020018701604051181761310457828102601f198701528501602001604052613138565b602060405101816020018101604052808a52601f19855b888101518382015281018061311b57509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf9060208401816131c257835480156131bc578084141502815260018481015490925080156131bc578084141502602082015260028481015490925080156131bc576003925083811415810260408301525b506131ed565b8160011c91505f5b828110156131eb57848101548481141502600582901b8301526001016131ca565b505b8185528160051b810160405250505050919050565b686d3d4e7fb92a523813823560601c601483811881851002188085019080851190850302613239686d3d4e7fb92a52381984612323565b613255576040516282b42960e81b815260040160405180910390fd5b3330146132855761326933610d26856123cd565b613285576040516282b42960e81b815260040160405180910390fd5b604051818382375f388383875af461329f573d5f823e3d81fd5b50505050505050565b5f6132b284613db6565b9050806003036132c75761122e848484613dff565b365f365f846132dd57637f1812755f526004601cfd5b5085358087016020810194503592505f9060401160028614111561330b575050602080860135860190810190355b61331a88888887878787613e97565b5050505050505050565b5f80806133c16133376201518086614b3a565b5f805f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c925080612f825781545f935015612f8257600192508282015415612f8257600292508282015415612f82575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf830361349e5763f5a267f15f526004601cfd5b826134b05768fbb67fda52d4bfb8bf92505b8019546134e157805460019250831461303e576001810154831461303e576002810154831461303e575f915061303e565b602052505f90815260409020541515919050565b606083518015611e8e576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613570579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036136135763f5a267f15f526004601cfd5b826136255768fbb67fda52d4bfb8bf92505b801954806136865760019250838254036136525760018201805483556002830180549091555f90556123c5565b836001830154036136705760028201805460018401555f90556123c5565b836002830154036123ac575f60028301556123c5565b81602052835f5260405f2080548061369f5750506123c5565b60018360011c0392508260018203146136c957828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f6136ef8484613ca4565b90508015610d4c5781612af885613425565b365f833580850160208587010360208201945081359350808460051b8301118360401c17156137375763ba597e7e5f526004601cfd5b831561378d578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c17156137845763ba597e7e5f526004601cfd5b50505082613741575b5050509250929050565b5f82815260208082206080909152601f8390526305d78094600b5260196027206137e96001600160a01b038716801515906137d584601b8a88613ff5565b6001600160a01b0316149015159015151690565b9695505050505050565b5f826137ff5750505050565b600581901b84013584018035801530021790602080820135916040810135019081019035613830848484848a61402f565b505050508383905081600101915081036137ff5750505050565b604080516060815290819052610d4c83836001600160a01b031661309e565b604080516060815290819052610d4c838361309e565b80613888575050565b5f61389283612421565b90505f5b8181101561122e575f6138a9858361406b565b60ff81165f8181526001880160205260408120929350906138d7904290600581111561085a5761085a6142f2565b905080826002015410156138f357600282018190555f60018301555b815f015486836001015f82825461390a9190614acc565b925050819055111561392f5760405163483f424d60e11b815260040160405180910390fd5b505050806001019050613896565b604051815183511461395b57634e487b715f5260326020526024601cfd5b825161396657505050565b5f806139718561410a565b61397a8561410a565b9150915061398785614139565b6139908561418e565b848403601f196020870187518752875160051b3684830137845160051b5b8086015181860151835b828151146139c8576020016139b8565b8601805182018082528211156139ea57634e487b715f5260116020526024601cfd5b5050508201806139ae5750505050826040525050505050565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f511416613a6d57803d853b151710613a6d57633e3f8f735f526004601cfd5b505f603452505050565b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af1611a7a576396b3de235f526004601cfd5b5f385f3884865af1612eb85763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416613a6d57803d853b151710613a6d576390b8ec185f526004601cfd5b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301613b665763f5a267f15f526004601cfd5b82613b785768fbb67fda52d4bfb8bf92505b80546001600160601b0381168260205280613c3a578160601c80613ba6578560601b84556001945050612568565b858103613bb35750612568565b600184015460601c80613bd4578660601b6001860155600195505050612568565b868103613be2575050612568565b600285015460601c80613c04578760601b600287015560019650505050612568565b878103613c1357505050612568565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f208054613c7c57600191821c808301825591945081613c68578560601b600317845550612568565b8560601b8285015582600201845550612568565b5050505092915050565b5f60205f80843c5f5160f01c61ef011460035160601c029050919050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613cd15763f5a267f15f526004601cfd5b82613ce35768fbb67fda52d4bfb8bf92505b8019548160205280613d8757815480613d035784835560019350506123c5565b848103613d1057506123c5565b600183015480613d2b578560018501556001945050506123c5565b858103613d395750506123c5565b600284015480613d5557866002860155600195505050506123c5565b868103613d64575050506123c5565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f20805461256857600191821c8381018690558083019182905590821b82178319559092506123c5565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c1715613e4457633995943b5f526004601cfd5b505f5b83811461329f57365f8260051b850135808601602081019350803592505084828401118160401c1715613e8157633995943b5f526004601cfd5b50613e8d898383611a5e565b5050600101613e47565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163303613efa576020811015613ee9576040516355fe73fd60e11b815260040160405180910390fd5b613ef58484843561261f565b61329f565b80613f2957333014613f1e576040516282b42960e81b815260040160405180910390fd5b613ef584845f61261f565b6020811015613f4b576040516355fe73fd60e11b815260040160405180910390fd5b8135613f60686d3d4e7fb92a523815826141d7565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f80613fbd613fa3888886611382565b6020808710818818021880880190808803908811026108ba565b9150915081613fde576040516282b42960e81b815260040160405180910390fd5b613fe987878361261f565b50505050505050505050565b5f604051855f5260ff851660205283604052826060526020604060805f60015afa505f6060523d6060185191508060405250949350505050565b61403b81868585611bb1565b614057576040516282b42960e81b815260040160405180910390fd5b61406485858585856141ee565b5050505050565b5f825461010083101561409a575f5b808414614093576001821981018316909218910161407a565b50806140a7575b634e23d0355f526004601cfd5b7e1f0d1e100c1d070f090b19131c1706010e11080a1a141802121b15031604056001821901909116608081901c151560071b81811c60401c151560061b1781811c63ffffffff1060051b1790811c63d76453e004601f169190911a179392505050565b604051815160051b8101602001818084035b80820151825281602001915082820361411c575060405250919050565b80515f82528060051b8201601f19602084015b602001828111614187578051828201805182811161416c5750505061414c565b5b60208201528301805182811161416d57506020015261414c565b5050509052565b6002815110610e6e576020810160408201600183510160051b83015b81518351146141be57602083019250815183525b6020820191508082036141aa57505081900360051c9052565b5f806141e38484614211565b600101905550505050565b604051828482375f388483888a5af1614209573d5f823e3d81fd5b505050505050565b604081811c5f90815260208490522080546001600160401b0380841682149082101661425057604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f8083601f840112614267575f80fd5b5081356001600160401b0381111561427d575f80fd5b602083019150836020828501011115614250575f80fd5b5f805f604084860312156142a6575f80fd5b8335925060208401356001600160401b038111156142c2575f80fd5b6142ce86828701614257565b9497909650939450505050565b5f602082840312156142eb575f80fd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b6020815264ffffffffff82511660208201525f60208301516003811061435c5761435c6142f2565b806040840152506040830151151560608301526060830151608080840152611e0660a0840182614306565b6001600160a01b0381168114610e6e575f80fd5b80358015158114611eaf575f80fd5b5f805f80608085870312156143bd575f80fd5b8435935060208501356143cf81614387565b925060408501356001600160e01b0319811681146143eb575f80fd5b91506143f96060860161439b565b905092959194509250565b5f805f60608486031215614416575f80fd5b833561442181614387565b9250602084013561443181614387565b915061443f6040850161439b565b90509250925092565b5f60208284031215614458575f80fd5b8135610d4c81614387565b803560068110611eaf575f80fd5b5f805f60608486031215614483575f80fd5b83359250602084013561449581614387565b915061443f60408501614463565b5f80602083850312156144b4575f80fd5b82356001600160401b038111156144c9575f80fd5b6144d585828601614257565b90969095509350505050565b5f602082840312156144f1575f80fd5b81356001600160c01b0381168114610d4c575f80fd5b5f805f806080858703121561451a575f80fd5b843561452581614387565b9350602085013561453581614387565b925060408501359150606085013561454c81614387565b939692955090935050565b5f805f806080858703121561456a575f80fd5b84359350602085013561457c81614387565b925061458a60408601614463565b9396929550929360600135925050565b602080825282518282018190525f918401906040840190835b818110156145da5783516001600160a01b03168352602093840193909201916001016145b3565b509095945050505050565b5f805f604084860312156145f7575f80fd5b83356001600160401b0381111561460c575f80fd5b8401601f8101861361461c575f80fd5b80356001600160401b03811115614631575f80fd5b8660208260051b8401011115614645575f80fd5b6020918201979096509401359392505050565b5f805f6060848603121561466a575f80fd5b83359250602084013561443181614387565b60ff60f81b8816815260e060208201525f61469a60e0830189614306565b82810360408401526146ac8189614306565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b818110156147015783518352602093840193909201916001016146e3565b50909b9a5050505050505050505050565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b038111828210171561474857614748614712565b60405290565b5f82601f83011261475d575f80fd5b81356001600160401b0381111561477657614776614712565b604051601f8201601f19908116603f011681016001600160401b03811182821017156147a4576147a4614712565b6040528181528382016020018510156147bb575f80fd5b816020850160208301375f918101602001919091529392505050565b5f602082840312156147e7575f80fd5b81356001600160401b038111156147fc575f80fd5b82016080818503121561480d575f80fd5b614815614726565b813564ffffffffff81168114614829575f80fd5b815260208201356003811061483c575f80fd5b602082015261484d6040830161439b565b604082015260608201356001600160401b0381111561486a575f80fd5b6148768682850161474e565b606083015250949350505050565b602081525f610d4c6020830184614306565b600681106148a6576148a66142f2565b9052565b602080825282518282018190525f918401906040840190835b818110156145da57835180516001600160a01b03168452602080820151906148ed90860182614896565b5060408101516040850152606081015160608501526080810151608085015260a081015160a085015260c081015160c08501525060e0830192506020840193506001810190506148c3565b5f8060408385031215614949575f80fd5b823561495481614387565b91506149626020840161439b565b90509250929050565b602080825282518282018190525f918401906040840190835b818110156145da578351835260209384019390920191600101614984565b5f80604083850312156149b3575f80fd5b8235915061496260208401614463565b5f805f80606085870312156149d6575f80fd5b8435935060208501356149e881614387565b925060408501356001600160401b03811115614a02575f80fd5b614a0e87828801614257565b95989497509550505050565b5f60208284031215614a2a575f80fd5b8151610d4c81614387565b8381526001600160a01b038316602082015260608101611e066040830184614896565b8481526001600160a01b038416602082015260808101614a7b6040830185614896565b82606083015295945050505050565b60208152816020820152818360408301375f818301604090810191909152601f909201601f19160101919050565b634e487b7160e01b5f52603260045260245ffd5b8082018082111561115c57634e487b7160e01b5f52601160045260245ffd5b5f85518060208801845e60d886901b6001600160d81b03191690830190815260038510614b1a57614b1a6142f2565b60f894851b600582015292151590931b6006830152506007019392505050565b5f82614b5457634e487b7160e01b5f52601260045260245ffd5b50049056fea264697066735822122089b82ff7c969d2665284fd3685f03982ac91ab101132f15c6ae64f47329e1c8264736f6c634300081a0033" as const;


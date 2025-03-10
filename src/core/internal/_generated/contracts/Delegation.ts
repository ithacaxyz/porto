export const abi = [
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

export const code = "0x610120604052348015610010575f80fd5b50306080524660a05260608061005f604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a0902061010052506100c89050565b60805160a05160c05160e051610100516149b56101055f395f6127d301525f61288d01525f61286701525f61281701525f6127f401526149b55ff3fe608060405260043610610254575f3560e01c80636fd9145411610138578063cb4774c4116100b5578063e537b27b11610079578063e537b27b146107e7578063e9ae5c5314610806578063faba56d814610819578063fac750e014610838578063fcd4e7071461084c578063ff619c6b146108745761025b565b8063cb4774c414610740578063cebfe33614610761578063d03c791414610780578063dcc09ebf1461079f578063e28250b4146107cb5761025b565b8063a840fe49116100fc578063a840fe49146106a5578063ad077083146106c4578063b70e36f0146106e3578063b75c7dc614610702578063bf530969146107215761025b565b80636fd91454146106055780637656d304146106245780637b8e4ecc1461064357806384b0196e1461065757806394430fa51461067e5761025b565b80632f3f30c7116101d1578063515c9d6d11610195578063515c9d6d1461053457806356298c9814610554578063598daac4146105735780635f7c23ab1461059257806360d2f33d146105be5780636c95d5a7146105f15761025b565b80632f3f30c714610464578063350585011461047e57806336745d10146104985780633e1b0812146104c75780634223b5c2146105155761025b565b8063164b859911610218578063164b8599146103935780631a37ef23146103b25780631a912f3e146103d157806320606b70146104125780632081a278146104455761025b565b80630cef73b41461029457806311a86fd6146102cf57806312aaac701461030e578063136a12f71461033a5780631626ba7e1461035b5761025b565b3661025b57005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a028214171561028657806020526020603cf35b50633c10b94e5f526004601cfd5b34801561029f575f80fd5b506102b36102ae3660046140d1565b610895565b6040805192151583526020830191909152015b60405180910390f35b3480156102da575f80fd5b506102f673323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102c6565b348015610319575f80fd5b5061032d610328366004614118565b6108af565b6040516102c69190614171565b348015610345575f80fd5b506103596103543660046141e7565b61099f565b005b348015610366575f80fd5b5061037a6103753660046140d1565b610acb565b6040516001600160e01b031990911681526020016102c6565b34801561039e575f80fd5b506103596103ad366004614241565b610b37565b3480156103bd575f80fd5b506103596103cc366004614285565b610bfe565b3480156103dc575f80fd5b506104047f84fa2cf05cd88e992eae77e851af68a4ee278dcff6ef504e487a55b3baadfbe581565b6040519081526020016102c6565b34801561041d575f80fd5b506104047f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b348015610450575f80fd5b5061035961045f3660046142ae565b610c55565b34801561046f575f80fd5b5061037a630707070760e51b81565b348015610489575f80fd5b5061037a631919191960e11b81565b3480156104a3575f80fd5b506104b76104b23660046142e0565b610d68565b60405190151581526020016102c6565b3480156104d2575f80fd5b506104046104e136600461431e565b6001600160c01b0381165f908152686d3d4e7fb92a5238156020526040908190205491901b67ffffffffffffffff19161790565b348015610520575f80fd5b5061032d61052f366004614118565b610f0d565b34801561053f575f80fd5b506104045f8051602061496083398151915281565b34801561055f575f80fd5b5061035961056e366004614344565b610f45565b34801561057e575f80fd5b5061035961058d366004614394565b610fb1565b34801561059d575f80fd5b506105b16105ac366004614285565b6110cf565b6040516102c691906143d7565b3480156105c9575f80fd5b506104047fe5dcff20fdd02f442e4306a50171756423d892722700f22b6731c9a4c7133acb81565b3480156105fc575f80fd5b506104b76110e2565b348015610610575f80fd5b5061040461061f366004614422565b6110ff565b34801561062f575f80fd5b5061035961063e366004614495565b61121b565b34801561064e575f80fd5b506105b16112cd565b348015610662575f80fd5b5061066b6112e1565b6040516102c697969594939291906144b9565b348015610689575f80fd5b506102f673307af7d28afee82092aa95d35644898311ca536081565b3480156106b0575f80fd5b506104046106bf366004614614565b611307565b3480156106cf575f80fd5b506105b16106de366004614118565b611340565b3480156106ee575f80fd5b506103596106fd366004614118565b61134e565b34801561070d575f80fd5b5061035961071c366004614118565b611413565b34801561072c575f80fd5b5061035961073b3660046142e0565b611468565b34801561074b575f80fd5b50610754611500565b6040516102c691906146c1565b34801561076c575f80fd5b5061040461077b366004614614565b611514565b34801561078b575f80fd5b506104b761079a366004614118565b61157c565b3480156107aa575f80fd5b506107be6107b9366004614118565b61159f565b6040516102c691906146e7565b3480156107d6575f80fd5b50686d3d4e7fb92a52381454610404565b3480156107f2575f80fd5b50610359610801366004614775565b611762565b6103596108143660046140d1565b611813565b348015610824575f80fd5b506104046108333660046147a8565b61184c565b348015610843575f80fd5b50610404611960565b348015610857575f80fd5b5061086161c1d081565b60405161ffff90911681526020016102c6565b34801561087f575f80fd5b506104b761088e3660046147c9565b611973565b565b5f806108a2858585611c0f565b915091505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f828152686d3d4e7fb92a523817602052604081206108ef90611e17565b905080515f036109125760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f6109268383016020015190565b60d881901c855260c881901c915060d01c60ff16600281111561094b5761094b61412f565b846020019060028111156109615761096161412f565b908160028111156109745761097461412f565b90525060ff81161515604085015261099183838151811082025290565b606085015250919392505050565b3330146109be576040516282b42960e81b815260040160405180910390fd5b83806109dd57604051638707510560e01b815260040160405180910390fd5b6109e685611e7d565b15610a0457604051630442081560e01b815260040160405180910390fd5b610a0e8484611e91565b15610a2c576040516303a6f8c760e21b815260040160405180910390fd5b5f83815260188590526004869052603881208152683c149ebf7b8e6c5e226020818152604092839020805460ff191686151590811790915583518981526001600160a01b038916928101929092526001600160e01b03198716938201939093526060810192909252907f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e1906080015b60405180910390a1505050505050565b5f805f610ad9868686611c0f565b90925090508115158115151615610b1357610af3816108af565b6040015180610b105750610b1033610b0a83611eb9565b90611ee8565b91505b81610b225763ffffffff610b28565b631626ba7e5b60e01b925050505b9392505050565b333014610b56576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813610b73686d3d4e7fb92a52381985611ee8565b610b8f576040516282b42960e81b815260040160405180910390fd5b610ba88383610200610ba088611f92565b929190611fcb565b50826001600160a01b0316846001600160a01b03167f22e306b6bdb65906c2b1557fba289ced7fe45decec4c8df8dbc9c21a65ac305284604051610bf0911515815260200190565b60405180910390a350505050565b333014610c1d576040516282b42960e81b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c5251905550565b50565b333014610c74576040516282b42960e81b815260040160405180910390fd5b8280610c9357604051638707510560e01b815260040160405180910390fd5b5f848152683c149ebf7b8e6c5e2360205260409020610cb28185611ff4565b506001600160a01b0384165f9081526001820160205260409020610cfa846005811115610ce157610ce161412f565b8254600160ff9092169190911b80198216845516151590565b50806001015f856005811115610d1257610d1261412f565b60ff168152602081019190915260409081015f9081208181556001810182905560020155517fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a2790610abb90889088908890614820565b5f3373307af7d28afee82092aa95d35644898311ca536014610d9c576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a52381454686d3d4e7fb92a5238139015610dd05760405163b62ba30f60e01b815260040160405180910390fd5b365f365f610dde8888612129565b604080518481526001850160051b8101909152939750919550935091505f5b84811015610e9f57600581901b8601358601803590602080820135916040810135019081019035610e8f85610e807f84fa2cf05cd88e992eae77e851af68a4ee278dcff6ef504e487a55b3baadfbe56001600160a01b03881687610e618888612195565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b5050505050806001019050610dfd565b505f610ebe30610eb784805160051b60209091012090565b86356121a6565b90508015602084101715610ee55760405163e483bbcb60e01b815260040160405180910390fd5b600187018190558585610ef982825f6121d7565b600199505050505050505050505b92915050565b604080516080810182525f8082526020820181905291810191909152606080820152610f07610328686d3d4e7fb92a52381684612627565b3373307af7d28afee82092aa95d35644898311ca536014610f78576040516282b42960e81b815260040160405180910390fd5b6001600160a01b0381163014610fa0576040516282b42960e81b815260040160405180910390fd5b610fab848484612670565b50505050565b333014610fd0576040516282b42960e81b815260040160405180910390fd5b8380610fef57604051638707510560e01b815260040160405180910390fd5b5f858152683c149ebf7b8e6c5e23602052604090819020906110149082908790612693565b506001600160a01b0385165f908152600182016020526040902061105a8560058111156110435761104361412f565b8254600160ff9092169190911b8082178455161590565b5083816001015f8760058111156110735761107361412f565b60ff1681526020019081526020015f205f01819055507f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a878787876040516110be9493929190614843565b60405180910390a150505050505050565b6060610f076110dd83611f92565b6126cf565b5f6110fa30686d3d4e7fb92a523813600101546127a3565b905090565b5f8061111b8460408051828152600190920160051b8201905290565b90505f5b8481101561119857600581901b8601358601803580153002179060208082013591604081013501908101903561118885610e807f84fa2cf05cd88e992eae77e851af68a4ee278dcff6ef504e487a55b3baadfbe56001600160a01b03881687610e618888612195565b505050505080600101905061111f565b5061c1d060f084901c145f6111f27fe5dcff20fdd02f442e4306a50171756423d892722700f22b6731c9a4c7133acb83855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b90508161120757611202816127d1565b611210565b611210816128e7565b979650505050505050565b33301461123a576040516282b42960e81b815260040160405180910390fd5b5f838152686d3d4e7fb92a523817602052604090205460ff166112705760405163395ed8c160e21b815260040160405180910390fd5b6112818282610200610ba087611eb9565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc99836040516112c0911515815260200190565b60405180910390a3505050565b60606110fa686d3d4e7fb92a5238196126cf565b600f60f81b6060805f8080836112f561295b565b97989097965046955030945091925090565b5f610f07826020015160028111156113215761132161412f565b60ff168360600151805190602001205f1c5f9182526020526040902090565b6060610f076110dd83611eb9565b33301461136d576040516282b42960e81b815260040160405180910390fd5b604081811c5f908152686d3d4e7fb92a5238156020522080546001600160401b03831610156113af576040516312ee5c9360e01b815260040160405180910390fd5b6113d96113d3836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b81556040518281527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c1906020015b60405180910390a15050565b333014611432576040516282b42960e81b815260040160405180910390fd5b61143b8161299b565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b333014611487576040516282b42960e81b815260040160405180910390fd5b6114cf82828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f920191909152506114c99250611e0a915050565b90612a0a565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611407929190614875565b60606110fa686d3d4e7fb92a523813611e17565b5f333014611534576040516282b42960e81b815260040160405180910390fd5b61153d82612a62565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f58360405161156f9190614171565b60405180910390a2919050565b5f610f076001600160f81b03198084161461159684612ad7565b15159015151790565b5f818152683c149ebf7b8e6c5e2360209081526040918290208251918201909252606080825291905f6115d183612ae9565b90505f5b81811015611758575f6115e88583612b3a565b6001600160a01b0381165f908152600187016020526040812091925061160d82612b93565b90505f5b8151811015611749575f82828151811061162d5761162d6148a3565b602002602001015190505f846001015f8360ff1681526020019081526020015f20905061168b6040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff1660058111156116a0576116a061412f565b816020019060058111156116b6576116b661412f565b908160058111156116c9576116c961412f565b9052506001600160a01b038716815281546040820152600282015460808201526001820154606082015261170c4260ff851660058111156108335761083361412f565b60c08201819052608082015110611727578060600151611729565b5f5b60a0820152806117398b82612bec565b5050505050806001019050611611565b505050508060010190506115d5565b5050519392505050565b333014611781576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a5238136117a2686d3d4e7fb92a5238198484610200611fcb565b50816117c9576001600160a01b0383165f9081526007820160205260409020805460010190555b826001600160a01b03167f31471c9e79dc8535d9341d73e61eaf5e72e4134b3e5b16943305041201581d8883604051611806911515815260200190565b60405180910390a2505050565b6001600160f81b031980841690036118345761182f8282612c97565b61183f565b61183f838383612d3d565b611847612db9565b505050565b5f808260058111156118605761186061412f565b0361187357603c808404025b9050610f07565b60018260058111156118875761188761412f565b0361189857610e108084040261186c565b60028260058111156118ac576118ac61412f565b036118be57620151808084040261186c565b60038260058111156118d2576118d261412f565b036118f8576007600362015180808604918201929092069003620545ff8511020261186c565b5f8061190385612e07565b509092509050600484600581111561191d5761191d61412f565b036119375761192e82826001612eb1565b92505050610f07565b600584600581111561194b5761194b61412f565b0361195c5761192e82600180612eb1565b5f80fd5b5f6110fa686d3d4e7fb92a523816612f08565b5f8461198157506001611c07565b61198a85611e7d565b1561199757506001611c07565b683c149ebf7b8e6c5e22631919191960e11b600484106119b5575083355b836119c45750630707070760e51b5b6119ce8682611e91565b156119dd575f92505050611c07565b5f818152601887905260048890526038812081526020839052604090205460ff1615611a0e57600192505050611c07565b631919191960e11b5f908152601887905260048890526038812081526020839052604090205460ff1615611a4757600192505050611c07565b5f81815273323232323232323232323232323232323232323260185260048890526038812081526020839052604090205460ff1615611a8b57600192505050611c07565b631919191960e11b5f90815273323232323232323232323232323232323232323260185260048890526038812081526020839052604090205460ff1615611ad757600192505050611c07565b5f81815260188790525f805160206149608339815191526004526038812081526020839052604090205460ff1615611b1457600192505050611c07565b631919191960e11b5f90815260188790525f805160206149608339815191526004526038812081526020839052604090205460ff1615611b5957600192505050611c07565b5f8181527332323232323232323232323232323232323232326018525f805160206149608339815191526004526038812081526020839052604090205460ff1615611ba957600192505050611c07565b631919191960e11b5f9081527332323232323232323232323232323232323232326018525f805160206149608339815191526004526038812081526020839052604090205460ff1615611c0157600192505050611c07565b5f925050505b949350505050565b5f8060418314604084141715611c3f5730611c2b868686612f54565b6001600160a01b03161491505f90506108a7565b6021831015611c5257505f9050806108a7565b506020198281018381118185180281189385019182013591601f19013560ff1615611c8357611c8086612fdc565b95505b505f611c8e826108af565b805190915064ffffffffff164281109015151615611caf575f9250506108a7565b5f81602001516002811115611cc657611cc661412f565b03611d21575f80603f86118735810290602089013502915091505f80611d05856060015180516020820151604090920151603f90911191820292910290565b91509150611d168a85858585612ffa565b965050505050611e01565b600181602001516002811115611d3957611d3961412f565b03611dbe57606081810151805160208083015160409384015184518084018d9052855180820385018152601f8c018590049094028101870186529485018a8152603f9490941091820295910293611db5935f92611dae928d918d918291018382808284375f9201919091525061308c92505050565b8585613170565b94505050611e01565b600281602001516002811115611dd657611dd661412f565b03611e0157611dfe8160600151806020019051810190611df691906148b7565b87878761328f565b92505b50935093915050565b686d3d4e7fb92a52381390565b60405181546020820190600881901c5f8260ff841714611e4557505080825260ff8116601f80821115611e67575b855f5260205f205b8160051c81015482860152602082019150828210611e4d57505b508084525f920191825250602001604052919050565b5f611e87826108af565b6040015192915050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81208190610b30565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301611f235763f5a267f15f526004601cfd5b82611f355768fbb67fda52d4bfb8bf92505b80546001600160601b038116611f795760019250838160601c0315611f8a57600182015460601c8414611f8a57600282015460601c8414611f8a575b5f9250611f8a565b81602052835f5260405f2054151592505b505092915050565b6001600160a01b0381165f908152686d3d4e7fb92a52381a602052604081208054601f5263d4203f8b6004528152603f81208190610b30565b5f82611fe057611fdb8585611ff4565b611feb565b611feb858584612693565b95945050505050565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be19830161202f5763f5a267f15f526004601cfd5b826120415768fbb67fda52d4bfb8bf92505b80546001600160601b038116806120bb5760019350848260601c036120795760018301805484556002840180549091555f9055612120565b84600184015460601c0361209a5760028301805460018501555f9055612120565b84600284015460601c036120b3575f6002840155612120565b5f9350612120565b82602052845f5260405f208054806120d4575050612120565b60018360011c039250826001820314612104578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b365f80806121378686613362565b9350935061214d86866040908111913510171590565b1561218c57602085870103866020013580880160208101945080359350828482011182851760401c17156121885763ba597e7e5f526004601cfd5b5050505b92959194509250565b5f8183604051375060405120919050565b5f82815260a082901c602052604090206001600160a01b03166121ca8482846133f8565b610b3057505f9392505050565b806121e757611847838383613454565b5f818152683c149ebf7b8e6c5e23602052604090206122656040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f61226f83612ae9565b90505f5b818110156122c1575f6122868583612b3a565b90506001600160a01b038116156122b85760408401516122a690826134ab565b5060608401516122b6905f612bec565b505b50600101612273565b505f805b8681101561244a57600581901b8801358801803580153002179060208082013591604081013501908101903582156123045761230183876148d2565b95505b60048110156123165750505050612442565b813560e01c63a9059cbb819003612364576123318a86611ee8565b61233f575050505050612442565b604089015161234e90866134ab565b50612362602484013560608b0151906134ca565b505b8063ffffffff1663095ea7b3036123c45761237f8a86611ee8565b61238d575050505050612442565b60248301355f036123a2575050505050612442565b88516123ae90866134ab565b506123c2600484013560208b0151906134ca565b505b8063ffffffff166387517c450361243c576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba3146123fe575050505050612442565b60448301355f03612413575050505050612442565b612426600484013560808b0151906134ca565b5061243a602484013560a08b0151906134ca565b505b50505050505b6001016122c5565b505f808052600185016020526040902061246490826134e0565b60408301515160608401515161247a919061359e565b5f6124ad61248b8560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b604085015151518110156124f957604085015151600582901b01602001516124ef826124dd8330613664565b85919060059190911b82016020015290565b50506001016124b1565b50612505888888613454565b5f5b6040850151515181101561259e57604085015151600582901b01602001515f6125308230613664565b6001600160a01b0383165f90815260018a016020908152604090912060608a015151600587901b01909101519192506125949161258f9061258461257a898960051b016020015190565b8680821191030290565b808218908210021890565b6134e0565b5050600101612507565b505f5b845151518110156125da57845151600582901b01602001516125d29060208781015151600585901b0101515f61368e565b6001016125a1565b505f5b6080850151515181101561261c57608085015151600582901b01602001516126149060a087015151600584901b01602001516136d8565b6001016125dd565b505050505050505050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf8114150261265183612f08565b8210610f0757604051634e23d03560e01b815260040160405180910390fd5b6001600160a01b038316612688576118478282613733565b61184783838361374c565b5f61269e848461378c565b90508015610b3057816126b085612ae9565b1115610b305760405163155176b960e11b815260040160405180910390fd5b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c925083831415830281528161275d57821561275857600191508185015460601c92508215612758578284141590920260208301525060028381015460601c918215612758576003915083831415830260408201525b61278d565b600191821c915b8281101561278b578581015460601c858114158102600583901b8401529350600101612764565b505b8186528160051b81016040525050505050919050565b5f806127ae846138e7565b905082156001600160a01b0382161517158015611c075750611c078484836133f8565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f00000000000000000000000000000000000000000000000000000000000000004614166128c45750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f805f6128f261295b565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b5f818152686d3d4e7fb92a52381760209081526040808320839055686d3d4e7fb92a523818909152902080546001019055686d3d4e7fb92a5238136129e9686d3d4e7fb92a52381683613905565b612a065760405163395ed8c160e21b815260040160405180910390fd5b5050565b80518060081b60ff175f60fe8311612a33575050601f8281015160081b82179080831115612a5a575b60208401855f5260205f205b828201518360051c820155602083019250848310612a3f5750505b509092555050565b5f612a6c82611307565b90505f686d3d4e7fb92a523813606084015184516020808701516040808901519051959650612ac395612aa1959493016148f1565b60408051601f198184030181529181525f858152600485016020522090612a0a565b612ad06003820183613a03565b5050919050565b5f612ae182613b15565b151592915050565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c1517612b3257600193508383015415612b3257600293508383015415612b3257600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf82141582029150612b6d84612ae9565b8310612b8c57604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b8015612bd65761ffff8116612bbb576010918201911c612ba0565b8183526020600582901b16909201916001918201911c612ba0565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c553602084035181810615828204029050808310612c86578281178101606086148260200187016040511817612c5257828102601f198701528501602001604052612c86565b602060405101816020018101604052808a52601f19855b8881015183820152810180612c6957509184029181019190915294505b505082019390935291909152919050565b686d3d4e7fb92a523813823560601c601483811881851002188085019080851190850302612cce686d3d4e7fb92a52381984611ee8565b612cea576040516282b42960e81b815260040160405180910390fd5b333014612d1a57612cfe33610b0a85611f92565b612d1a576040516282b42960e81b815260040160405180910390fd5b604051818382375f388383875af4612d34573d5f823e3d81fd5b50505050505050565b5f612d4784613b15565b905080600303612d5c57610fab848484613b5e565b365f365f84612d7257637f1812755f526004601cfd5b5085358087016020810194503592505f90604011600286141115612da0575050602080860135860190810190355b612daf88888887878787613bf6565b5050505050505050565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5460601b61089357307f94e11c6e41e7fb92cb8bb65e13fdfbd4eba8b831292a1a220f7915c78c7c078f5d565b5f8080612ea4612e1a6201518086614940565b5f805f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c925080612ad05781545f935015612ad057600192508282015415612ad057600292508282015415612ad0575060039392505050565b5f6040518260408114612f6f5760418114612f965750612fc7565b60208581013560ff81901c601b0190915285356040526001600160ff1b0316606052612fa7565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d612fd4575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d612ff557fe5b919050565b5f6040518681528560208201528460408201528360608201528260808201525f805260205f60a0836101005afa503d6130575760203d60a0836dd01ea45f9efd5c54f037fa57ea1a5afa503d6130575763d0d5039b3d526004601cfd5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6040805160c0810182526060808252602082018190525f92820183905281018290526080810182905260a0810191909152815160c0811061316a5760208301818101818251018281108260c083011117156130e95750505061316a565b8081510192508060208201510181811083821117828510848611171715613113575050505061316a565b8281516020830101118385516020870101111715613134575050505061316a565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f805f61317f88600180613d7c565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561326357602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061326357fe5b5050508215613284576132818287608001518860a001518888612ffa565b92505b505095945050505050565b5f6001600160a01b03851615611c0757604051853b61331f5782604081146132bf57604181146132e65750613359565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526132f7565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f60605280604052613359565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b365f833580850160208587010360208201945081359350808460051b8301118360401c17156133985763ba597e7e5f526004601cfd5b83156133ee578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c17156133e55763ba597e7e5f526004601cfd5b505050826133a2575b5050509250929050565b5f82815260208082206080909152601f8390526305d78094600b52601960272061344a6001600160a01b0387168015159061343684601b8a88613e6d565b6001600160a01b0316149015159015151690565b9695505050505050565b5f826134605750505050565b600581901b84013584018035801530021790602080820135916040810135019081019035613491848484848a613ea7565b505050508383905081600101915081036134605750505050565b604080516060815290819052610b3083836001600160a01b0316612bec565b604080516060815290819052610b308383612bec565b806134e9575050565b5f6134f383613ee3565b90505f5b81811015610fab575f61350a8583613efe565b60ff81165f81815260018801602052604081209293509061353890429060058111156108335761083361412f565b9050808260020154101561355457600282018190555f60018301555b815f015486836001015f82825461356b91906148d2565b92505081905511156135905760405163483f424d60e11b815260040160405180910390fd5b5050508060010190506134f7565b60405181518351146135bc57634e487b715f5260326020526024601cfd5b82516135c757505050565b5f806135d285613f9d565b6135db85613f9d565b915091506135e885613fcc565b6135f185614021565b848403601f196020870187518752875160051b3684830137845160051b5b8086015181860151835b8281511461362957602001613619565b86018051820180825282111561364b57634e487b715f5260116020526024601cfd5b50505082018061360f5750505050826040525050505050565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f5114166136ce57803d853b1517106136ce57633e3f8f735f526004601cfd5b505f603452505050565b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af1611847576396b3de235f526004601cfd5b5f385f3884865af1612a065763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f5114166136ce57803d853b1517106136ce576390b8ec185f526004601cfd5b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016137c75763f5a267f15f526004601cfd5b826137d95768fbb67fda52d4bfb8bf92505b80546001600160601b038116826020528061389b578160601c80613807578560601b84556001945050612120565b8581036138145750612120565b600184015460601c80613835578660601b6001860155600195505050612120565b868103613843575050612120565b600285015460601c80613865578760601b600287015560019650505050612120565b87810361387457505050612120565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f2080546138dd57600191821c8083018255919450816138c9578560601b600317845550612120565b8560601b8285015582600201845550612120565b5050505092915050565b5f60205f80843c5f5160f01c61ef011460035160601c029050919050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036139325763f5a267f15f526004601cfd5b826139445768fbb67fda52d4bfb8bf92505b801954806139a55760019250838254036139715760018201805483556002830180549091555f9055611f8a565b8360018301540361398f5760028201805460018401555f9055611f8a565b83600283015403611f71575f6002830155611f8a565b81602052835f5260405f208054806139be575050611f8a565b60018360011c0392508260018203146139e857828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613a305763f5a267f15f526004601cfd5b82613a425768fbb67fda52d4bfb8bf92505b8019548160205280613ae657815480613a62578483556001935050611f8a565b848103613a6f5750611f8a565b600183015480613a8a57856001850155600194505050611f8a565b858103613a98575050611f8a565b600284015480613ab45786600286015560019550505050611f8a565b868103613ac357505050611f8a565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f20805461212057600191821c8381018690558083019182905590821b8217831955909250611f8a565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c1715613ba357633995943b5f526004601cfd5b505f5b838114612d3457365f8260051b850135808601602081019350803592505084828401118160401c1715613be057633995943b5f526004601cfd5b50613bec898383611813565b5050600101613ba6565b73307af7d28afee82092aa95d35644898311ca535f193301613c45576020811015613c34576040516355fe73fd60e11b815260040160405180910390fd5b613c40848484356121d7565b612d34565b80613c7457333014613c69576040516282b42960e81b815260040160405180910390fd5b613c4084845f6121d7565b6020811015613c96576040516355fe73fd60e11b815260040160405180910390fd5b8135604081811c5f908152686d3d4e7fb92a5238156020522080546001600160401b03808210908416821416613cdf57604051633ab3447f60e11b815260040160405180910390fd5b6001810182556040518381527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150505f80613d44613d2a8888866110ff565b602080871081881802188088019080880390881102610895565b9150915081613d65576040516282b42960e81b815260040160405180910390fd5b613d708787836121d7565b50505050505050505050565b606083518015612fd4576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613df7579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f604051855f5260ff851660205283604052826060526020604060805f60015afa505f6060523d6060185191508060405250949350505050565b613eb381868585611973565b613ecf576040516282b42960e81b815260040160405180910390fd5b613edc858585858561406a565b5050505050565b5f81545b801561316a57600191820191811901811618613ee7565b5f8254610100831015613f2d575f5b808414613f265760018219810183169092189101613f0d565b5080613f3a575b634e23d0355f526004601cfd5b7e1f0d1e100c1d070f090b19131c1706010e11080a1a141802121b15031604056001821901909116608081901c151560071b81811c60401c151560061b1781811c63ffffffff1060051b1790811c63d76453e004601f169190911a179392505050565b604051815160051b8101602001818084035b808201518252816020019150828203613faf575060405250919050565b80515f82528060051b8201601f19602084015b60200182811161401a5780518282018051828111613fff57505050613fdf565b5b602082015283018051828111614000575060200152613fdf565b5050509052565b6002815110610c52576020810160408201600183510160051b83015b815183511461405157602083019250815183525b60208201915080820361403d57505081900360051c9052565b604051828482375f388483888a5af1614085573d5f823e3d81fd5b505050505050565b5f8083601f84011261409d575f80fd5b5081356001600160401b038111156140b3575f80fd5b6020830191508360208285010111156140ca575f80fd5b9250929050565b5f805f604084860312156140e3575f80fd5b8335925060208401356001600160401b038111156140ff575f80fd5b61410b8682870161408d565b9497909650939450505050565b5f60208284031215614128575f80fd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b6020815264ffffffffff82511660208201525f6020830151600381106141995761419961412f565b806040840152506040830151151560608301526060830151608080840152611c0760a0840182614143565b6001600160a01b0381168114610c52575f80fd5b80358015158114612ff5575f80fd5b5f805f80608085870312156141fa575f80fd5b84359350602085013561420c816141c4565b925060408501356001600160e01b031981168114614228575f80fd5b9150614236606086016141d8565b905092959194509250565b5f805f60608486031215614253575f80fd5b833561425e816141c4565b9250602084013561426e816141c4565b915061427c604085016141d8565b90509250925092565b5f60208284031215614295575f80fd5b8135610b30816141c4565b803560068110612ff5575f80fd5b5f805f606084860312156142c0575f80fd5b8335925060208401356142d2816141c4565b915061427c604085016142a0565b5f80602083850312156142f1575f80fd5b82356001600160401b03811115614306575f80fd5b6143128582860161408d565b90969095509350505050565b5f6020828403121561432e575f80fd5b81356001600160c01b0381168114610b30575f80fd5b5f805f8060808587031215614357575f80fd5b8435614362816141c4565b93506020850135614372816141c4565b9250604085013591506060850135614389816141c4565b939692955090935050565b5f805f80608085870312156143a7575f80fd5b8435935060208501356143b9816141c4565b92506143c7604086016142a0565b9396929550929360600135925050565b602080825282518282018190525f918401906040840190835b818110156144175783516001600160a01b03168352602093840193909201916001016143f0565b509095945050505050565b5f805f60408486031215614434575f80fd5b83356001600160401b03811115614449575f80fd5b8401601f81018613614459575f80fd5b80356001600160401b0381111561446e575f80fd5b8660208260051b8401011115614482575f80fd5b6020918201979096509401359392505050565b5f805f606084860312156144a7575f80fd5b83359250602084013561426e816141c4565b60ff60f81b8816815260e060208201525f6144d760e0830189614143565b82810360408401526144e98189614143565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b8181101561453e578351835260209384019390920191600101614520565b50909b9a5050505050505050505050565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b03811182821017156145855761458561454f565b60405290565b5f82601f83011261459a575f80fd5b81356001600160401b038111156145b3576145b361454f565b604051601f8201601f19908116603f011681016001600160401b03811182821017156145e1576145e161454f565b6040528181528382016020018510156145f8575f80fd5b816020850160208301375f918101602001919091529392505050565b5f60208284031215614624575f80fd5b81356001600160401b03811115614639575f80fd5b82016080818503121561464a575f80fd5b614652614563565b813564ffffffffff81168114614666575f80fd5b8152602082013560038110614679575f80fd5b602082015261468a604083016141d8565b604082015260608201356001600160401b038111156146a7575f80fd5b6146b38682850161458b565b606083015250949350505050565b602081525f610b306020830184614143565b600681106146e3576146e361412f565b9052565b602080825282518282018190525f918401906040840190835b8181101561441757835180516001600160a01b031684526020808201519061472a908601826146d3565b5060408101516040850152606081015160608501526080810151608085015260a081015160a085015260c081015160c08501525060e083019250602084019350600181019050614700565b5f8060408385031215614786575f80fd5b8235614791816141c4565b915061479f602084016141d8565b90509250929050565b5f80604083850312156147b9575f80fd5b8235915061479f602084016142a0565b5f805f80606085870312156147dc575f80fd5b8435935060208501356147ee816141c4565b925060408501356001600160401b03811115614808575f80fd5b6148148782880161408d565b95989497509550505050565b8381526001600160a01b038316602082015260608101611c0760408301846146d3565b8481526001600160a01b03841660208201526080810161486660408301856146d3565b82606083015295945050505050565b60208152816020820152818360408301375f818301604090810191909152601f909201601f19160101919050565b634e487b7160e01b5f52603260045260245ffd5b5f602082840312156148c7575f80fd5b8151610b30816141c4565b80820180821115610f0757634e487b7160e01b5f52601160045260245ffd5b5f85518060208801845e60d886901b6001600160d81b031916908301908152600385106149205761492061412f565b60f894851b600582015292151590931b6006830152506007019392505050565b5f8261495a57634e487b7160e01b5f52601260045260245ffd5b50049056fe3232323232323232323232323232323232323232323232323232323232323232a26469706673582212208364f163889392cd6c8d0047aa59f0cc7af845a8281a2f12a893c8fe9a92fe6264736f6c634300081a0033" as const;


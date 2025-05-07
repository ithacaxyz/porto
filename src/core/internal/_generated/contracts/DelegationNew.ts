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
    "name": "OpDataTooShort",
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

export const code = "0x6101406040526040516156c73803806156c7833981016040819052610023916100e7565b306080524660a052606080610072604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526006835265036392e302e360d41b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610114565b5f602082840312156100f7575f5ffd5b81516001600160a01b038116811461010d575f5ffd5b9392505050565b60805160a05160c05160e051610100516101205161555e6101695f395f818161068401528181611d11015261469e01525f6130be01525f61317801525f61315201525f61310201525f6130df015261555e5ff3fe608060405260043610610275575f3560e01c80637656d3041161014e578063cebfe336116100c0578063e9ae5c5311610079578063e9ae5c5314610860578063f81d87a714610873578063faba56d814610892578063fac750e0146108b1578063fcd4e707146108c5578063ff619c6b146108ed5761027c565b8063cebfe3361461078f578063d03c7914146107ae578063dcc09ebf146107cd578063e28250b4146107f9578063e537b27b14610815578063e5adda71146108345761027c565b8063ad07708311610112578063ad077083146106c5578063b70e36f0146106e4578063b75c7dc614610703578063bc2c554a14610722578063bf5309691461074f578063cb4774c41461076e5761027c565b80637656d304146106195780637b8e4ecc1461063857806384b0196e1461064c57806394430fa514610673578063a840fe49146106a65761027c565b80632f3f30c7116101e7578063515c9d6d116101ab578063515c9d6d14610548578063598daac4146105685780635f7c23ab1461058757806360d2f33d146105b35780636c95d5a7146105e65780636fd91454146105fa5761027c565b80632f3f30c7146104a757806335058501146104c157806336745d10146104db5780633e1b08121461050a5780634223b5c2146105295761027c565b8063164b859911610239578063164b8599146103b45780631a37ef23146103d35780631a912f3e146103f257806320606b70146104335780632081a278146104665780632150c518146104855761027c565b80630cef73b4146102b557806311a86fd6146102f057806312aaac701461032f578063136a12f71461035b5780631626ba7e1461037c5761027c565b3661027c57005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a02821417156102a757806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102c0575f5ffd5b506102d46102cf366004614a45565b61090c565b6040805192151583526020830191909152015b60405180910390f35b3480156102fb575f5ffd5b5061031773323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102e7565b34801561033a575f5ffd5b5061034e610349366004614a8c565b610b08565b6040516102e79190614b32565b348015610366575f5ffd5b5061037a610375366004614b67565b610bf7565b005b348015610387575f5ffd5b5061039b610396366004614a45565b610d1c565b6040516001600160e01b031990911681526020016102e7565b3480156103bf575f5ffd5b5061037a6103ce366004614bc1565b610d84565b3480156103de575f5ffd5b5061037a6103ed366004614c05565b610e4b565b3480156103fd575f5ffd5b506104257f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102e7565b34801561043e575f5ffd5b506104257f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b348015610471575f5ffd5b5061037a610480366004614c2e565b610ea2565b348015610490575f5ffd5b50610499610ff1565b6040516102e7929190614c9a565b3480156104b2575f5ffd5b5061039b630707070760e51b81565b3480156104cc575f5ffd5b5061039b631919191960e11b81565b3480156104e6575f5ffd5b506104fa6104f5366004614d07565b61115b565b60405190151581526020016102e7565b348015610515575f5ffd5b50610425610524366004614d45565b6112bf565b348015610534575f5ffd5b5061034e610543366004614a8c565b6112f5565b348015610553575f5ffd5b506104255f5160206155095f395f51905f5281565b348015610573575f5ffd5b5061037a610582366004614d6b565b61132d565b348015610592575f5ffd5b506105a66105a1366004614c05565b61147f565b6040516102e79190614dae565b3480156105be575f5ffd5b506104257f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b3480156105f1575f5ffd5b506104fa611492565b348015610605575f5ffd5b50610425610614366004614e39565b6114af565b348015610624575f5ffd5b5061037a610633366004614e80565b6115cb565b348015610643575f5ffd5b506105a661167d565b348015610657575f5ffd5b50610660611691565b6040516102e79796959493929190614ea4565b34801561067e575f5ffd5b506103177f000000000000000000000000000000000000000000000000000000000000000081565b3480156106b1575f5ffd5b506104256106c0366004614fff565b6116b7565b3480156106d0575f5ffd5b506105a66106df366004614a8c565b6116f0565b3480156106ef575f5ffd5b5061037a6106fe366004614a8c565b6116fe565b34801561070e575f5ffd5b5061037a61071d366004614a8c565b611766565b34801561072d575f5ffd5b5061074161073c3660046150ac565b6117bb565b6040516102e7929190615178565b34801561075a575f5ffd5b5061037a610769366004614d07565b6118f2565b348015610779575f5ffd5b50610782611996565b6040516102e79190615236565b34801561079a575f5ffd5b506104256107a9366004614fff565b6119aa565b3480156107b9575f5ffd5b506104fa6107c8366004614a8c565b611a12565b3480156107d8575f5ffd5b506107ec6107e7366004614a8c565b611a35565b6040516102e79190615248565b348015610804575f5ffd5b50686d3d4e7fb92a52381454610425565b348015610820575f5ffd5b5061037a61082f36600461525a565b611bf9565b34801561083f575f5ffd5b5061085361084e366004614a8c565b611caa565b6040516102e7919061528d565b61037a61086e366004614a45565b611cbd565b34801561087e575f5ffd5b5061037a61088d36600461529f565b611ce9565b34801561089d575f5ffd5b506104256108ac3660046152fa565b611e10565b3480156108bc575f5ffd5b50610425611f24565b3480156108d0575f5ffd5b506108da61c1d081565b60405161ffff90911681526020016102e7565b3480156108f8575f5ffd5b506104fa61090736600461531b565b611f37565b5f806041831460408414171561093c5730610928868686612151565b6001600160a01b03161491505f9050610b00565b602183101561094f57505f905080610b00565b506020198281018381118185180281189385019182013591601f19013560ff16156109805761097d866121d9565b95505b505f61098b82610b08565b805190915064ffffffffff1642811090151516156109ac575f925050610b00565b5f816020015160028111156109c3576109c3614aa3565b03610a1e575f80603f86118735810290602089013502915091505f5f610a02856060015180516020820151604090920151603f90911191820292910290565b91509150610a138a858585856121f7565b965050505050610afe565b600181602001516002811115610a3657610a36614aa3565b03610abb57606081810151805160208083015160409384015184518084018d9052855180820385018152601f8c018590049094028101870186529485018a8152603f9490941091820295910293610ab2935f92610aab928d918d918291018382808284375f9201919091525061229092505050565b8585612378565b94505050610afe565b600281602001516002811115610ad357610ad3614aa3565b03610afe57610afb8160600151806020019051810190610af39190615372565b878787612497565b92505b505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f828152686d3d4e7fb92a52381760205260408120610b4890612577565b8051909150610b6a5760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610b7e8383016020015190565b60d881901c855260c881901c915060d01c60ff166002811115610ba357610ba3614aa3565b84602001906002811115610bb957610bb9614aa3565b90816002811115610bcc57610bcc614aa3565b90525060ff811615156040850152610be983838151811082025290565b606085015250919392505050565b333014610c16576040516282b42960e81b815260040160405180910390fd5b8380610c3557604051638707510560e01b815260040160405180910390fd5b5f5160206155095f395f51905f528514610c7057610c52856125dd565b15610c7057604051630442081560e01b815260040160405180910390fd5b610c7a8484612641565b15610c98576040516303a6f8c760e21b815260040160405180910390fd5b610cbb60e084901c606086901b1783610800610cb389612669565b9291906126b8565b50604080518681526001600160a01b03861660208201526001600160e01b0319851681830152831515606082015290517f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e19181900360800190a15050505050565b5f5f5f610d2a86868661090c565b90925090508115158115151615610d6057610d44816125dd565b80610d5d5750610d5d33610d57836126e1565b90612710565b91505b81610d6f5763ffffffff610d75565b631626ba7e5b60e01b925050505b9392505050565b333014610da3576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813610dc0686d3d4e7fb92a52381985612710565b610ddc576040516282b42960e81b815260040160405180910390fd5b610df58383610200610ded886127ba565b9291906127f3565b50826001600160a01b0316846001600160a01b03167f22e306b6bdb65906c2b1557fba289ced7fe45decec4c8df8dbc9c21a65ac305284604051610e3d911515815260200190565b60405180910390a350505050565b333014610e6a576040516282b42960e81b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c5251905550565b50565b333014610ec1576040516282b42960e81b815260040160405180910390fd5b8280610ee057604051638707510560e01b815260040160405180910390fd5b610ee9846125dd565b15610f075760405163f2fee1e160e01b815260040160405180910390fd5b5f610f1185612669565b6001600160a01b0385165f908152600282016020526040902060019091019150610f5f846005811115610f4657610f46614aa3565b8254600160ff9092169190911b80198216845516151590565b15610f7f575f610f6e8261280e565b03610f7f57610f7d8286612829565b505b610fae816001015f866005811115610f9957610f99614aa3565b60ff1681526020019081526020015f205f9055565b7fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a27868686604051610fe19392919061538d565b60405180910390a1505050505050565b6060805f610ffd611f24565b9050806001600160401b0381111561101757611017614f3a565b60405190808252806020026020018201604052801561106657816020015b604080516080810182525f80825260208083018290529282015260608082015282525f199092019101816110355790505b509250806001600160401b0381111561108157611081614f3a565b6040519080825280602002602001820160405280156110aa578160200160208202803683370190505b5091505f805b82811015611150575f6110d182686d3d4e7fb92a5238135b6003019061295e565b90505f6110dd82610b08565b805190915064ffffffffff1642811090151516156110fc575050611148565b8087858151811061110f5761110f6153b0565b60200260200101819052508186858151811061112d5761112d6153b0565b602090810291909101015283611142816153d8565b94505050505b6001016110b0565b508084528252509091565b686d3d4e7fb92a523814545f90686d3d4e7fb92a52381390156111825760019150506112b9565b365f365f61119088886129a7565b604080518481526001850160051b8101909152939750919550935091505f5b8481101561125157600581901b8601358601803590602080820135916040810135019081019035611241856112327f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876112138888612a13565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b50505050508060010190506111af565b505f6112703061126984805160051b60209091012090565b8635612a24565b905080156020841017156112975760405163e483bbcb60e01b815260040160405180910390fd5b6001870181905585856112ab82825f612a55565b600199505050505050505050505b92915050565b6001600160c01b0381165f908152686d3d4e7fb92a5238156020526040808220549083901b67ffffffffffffffff1916176112b9565b604080516080810182525f80825260208201819052918101919091526060808201526112b961034983686d3d4e7fb92a5238136110c8565b33301461134c576040516282b42960e81b815260040160405180910390fd5b838061136b57604051638707510560e01b815260040160405180910390fd5b611374856125dd565b156113925760405163f2fee1e160e01b815260040160405180910390fd5b5f61139c86612669565b60010190506113ad81866040612eeb565b506001600160a01b0385165f90815260018201602052604090206113f38560058111156113dc576113dc614aa3565b8254600160ff9092169190911b8082178455161590565b505f816001015f87600581111561140c5761140c614aa3565b60ff1681526020019081526020015f2090505f61142882612f27565b86815290506114378282612f71565b7f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a8989898960405161146c94939291906153f0565b60405180910390a1505050505050505050565b60606112b961148d836127ba565b612fba565b5f6114aa30686d3d4e7fb92a5238136001015461308e565b905090565b5f806114cb8460408051828152600190920160051b8201905290565b90505f5b8481101561154857600581901b86013586018035801530021790602080820135916040810135019081019035611538856112327f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876112138888612a13565b50505050508060010190506114cf565b5061c1d060f084901c145f6115a27f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b9050816115b7576115b2816130bc565b6115c0565b6115c0816131d2565b979650505050505050565b3330146115ea576040516282b42960e81b815260040160405180910390fd5b5f838152686d3d4e7fb92a523817602052604090205460ff166116205760405163395ed8c160e21b815260040160405180910390fd5b6116318282610200610ded876126e1565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc9983604051611670911515815260200190565b60405180910390a3505050565b60606114aa686d3d4e7fb92a523819612fba565b600f60f81b6060805f8080836116a5613246565b97989097965046955030945091925090565b5f6112b9826020015160028111156116d1576116d1614aa3565b60ff168360600151805190602001205f1c5f9182526020526040902090565b60606112b961148d836126e1565b33301461171d576040516282b42960e81b815260040160405180910390fd5b611730686d3d4e7fb92a52381582613287565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b333014611785576040516282b42960e81b815260040160405180910390fd5b61178e816132f1565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b038111156117d7576117d7614f3a565b60405190808252806020026020018201604052801561180a57816020015b60608152602001906001900390816117f55790505b509250806001600160401b0381111561182557611825614f3a565b60405190808252806020026020018201604052801561185857816020015b60608152602001906001900390816118435790505b5091505f5b818110156118e95761188686868381811061187a5761187a6153b0565b90506020020135611a35565b848281518110611898576118986153b0565b60200260200101819052506118c48686838181106118b8576118b86153b0565b90506020020135611caa565b8382815181106118d6576118d66153b0565b602090810291909101015260010161185d565b50509250929050565b333014611911576040516282b42960e81b815260040160405180910390fd5b61195982828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250611953925061256a915050565b9061335c565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad828260405161198a92919061544a565b60405180910390a15050565b60606114aa686d3d4e7fb92a523813612577565b5f3330146119ca576040516282b42960e81b815260040160405180910390fd5b6119d3826133b4565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611a059190614b32565b60405180910390a2919050565b5f6112b96001600160f81b031980841614611a2c8461345d565b15159015151790565b60605f611a4183612669565b6001019050611a5c6040518060200160405280606081525090565b5f611a668361346f565b90505f5b81811015611bef575f611a7d85836134c0565b6001600160a01b0381165f9081526001870160205260408120919250611aa282613519565b90505f5b8151811015611be0575f828281518110611ac257611ac26153b0565b602002602001015190505f611aeb856001015f8460ff1681526020019081526020015f20612f27565b9050611b286040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166005811115611b3d57611b3d614aa3565b81602001906005811115611b5357611b53614aa3565b90816005811115611b6657611b66614aa3565b9052506001600160a01b03871681528151604080830191909152820151608082015260208201516060820152611bab4260ff851660058111156108ac576108ac614aa3565b60c08201819052608082015160608301519111150260a082015280611bd08b82613572565b5050505050806001019050611aa6565b50505050806001019050611a6a565b5050519392505050565b333014611c18576040516282b42960e81b815260040160405180910390fd5b686d3d4e7fb92a523813611c39686d3d4e7fb92a52381984846102006127f3565b5081611c60576001600160a01b0383165f9081526007820160205260409020805460010190555b826001600160a01b03167f31471c9e79dc8535d9341d73e61eaf5e72e4134b3e5b16943305041201581d8883604051611c9d911515815260200190565b60405180910390a2505050565b60606112b9611cb883612669565b61361b565b6001600160f81b03198084169003611cde57611cd982826136d4565b505050565b611cd9838383613771565b813580830190604081901c602084101715611d02575f5ffd5b50611d54336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161430611d406020850185614c05565b6001600160a01b0316149015159015151690565b611d70576040516282b42960e81b815260040160405180910390fd5b611d9b611d8360a0830160808401614c05565b611d956101a084016101808501614c05565b886137f3565b841580611dac5750611dac856125dd565b611e08575f611dba86612669565b600181019150611e06906002015f611dd860a0860160808701614c05565b6001600160a01b0316815260208101919091526040015f20611e0060a0850160808601614c05565b89613816565b505b505050505050565b5f80826005811115611e2457611e24614aa3565b03611e3757603c808404025b90506112b9565b6001826005811115611e4b57611e4b614aa3565b03611e5c57610e1080840402611e30565b6002826005811115611e7057611e70614aa3565b03611e82576201518080840402611e30565b6003826005811115611e9657611e96614aa3565b03611ebc576007600362015180808604918201929092069003620545ff85110202611e30565b5f5f611ec78561393b565b5090925090506004846005811115611ee157611ee1614aa3565b03611efb57611ef2828260016139e5565b925050506112b9565b6005846005811115611f0f57611f0f614aa3565b03611f2057611ef2826001806139e5565b5f5ffd5b5f6114aa686d3d4e7fb92a523816613a3c565b5f84611f4557506001612149565b611f4e856125dd565b15611f5b57506001612149565b631919191960e11b60048310611f6f575082355b82611f7e5750630707070760e51b5b611f888582612641565b15611f96575f915050612149565b5f611fa087612669565b9050611fab81613a3c565b1561206857611fc660e083901c606088901b175b8290613a88565b15611fd657600192505050612149565b611fe96332323232606088901b17611fbf565b15611ff957600192505050612149565b61201f60e083901c73191919191919191919191919191919191919191960611b17611fbf565b1561202f57600192505050612149565b6120587f3232323232323232323232323232323232323232000000000000000032323232611fbf565b1561206857600192505050612149565b61207e5f5160206155095f395f51905f52612669565b905061208981613a3c565b15612143576120a160e083901c606088901b17611fbf565b156120b157600192505050612149565b6120c46332323232606088901b17611fbf565b156120d457600192505050612149565b6120fa60e083901c73191919191919191919191919191919191919191960611b17611fbf565b1561210a57600192505050612149565b6121337f3232323232323232323232323232323232323232000000000000000032323232611fbf565b1561214357600192505050612149565b5f925050505b949350505050565b5f604051826040811461216c576041811461219357506121c4565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526121a4565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d6121d1575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d6121f257fe5b919050565b5f6040518681528560208201528460408201528360608201528260808201525f5f5260205f60a0836101005afa503d61225b576d1ab2e8006fd8b71907bf06a5bdee3b61225b5760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa61225b57fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6122c56040518060c0016040528060608152602001606081526020015f81526020015f81526020015f81526020015f81525090565b815160c081106123725760208301818101818251018281108260c083011117156122f157505050612372565b808151019250806020820151018181108382111782851084861117171561231b5750505050612372565b828151602083010111838551602087010111171561233c5750505050612372565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f5f5f61238788600180613b0c565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561246b57602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061246b57fe5b505050821561248c576124898287608001518860a0015188886121f7565b92505b505095945050505050565b5f6001600160a01b0385161561214957604051853b6125275782604081146124c757604181146124ee5750612561565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526124ff565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f60605280604052612561565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b686d3d4e7fb92a52381390565b60405181546020820190600881901c5f8260ff8417146125a557505080825260ff8116601f808211156125c7575b855f5260205f205b8160051c810154828601526020820191508282106125ad57505b508084525f920191825250602001604052919050565b5f818152686d3d4e7fb92a52381760205260408120805460ff808216908114801590910260089290921c0217806126275760405163395ed8c160e21b815260040160405180910390fd5b612634825f198301613bfd565b60ff161515949350505050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f5160206155095f395f51905f52831461268d5761268883613c6a565b61269c565b5f5160206155095f395f51905f525b68a3bbbebc65eb8804df6009525f908152602990209392505050565b5f826126cd576126c88585613c97565b6126d8565b6126d8858584613d95565b95945050505050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81208190610d7d565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be19830161274b5763f5a267f15f526004601cfd5b8261275d5768fbb67fda52d4bfb8bf92505b80546001600160601b0381166127a15760019250838160601c03156127b257600182015460601c84146127b257600282015460601c84146127b2575b5f92506127b2565b81602052835f5260405f2054151592505b505092915050565b6001600160a01b0381165f908152686d3d4e7fb92a52381a602052604081208054601f5263d4203f8b6004528152603f81208190610d7d565b5f82612803576126c88585612829565b6126d8858584612eeb565b5f81545b801561237257600191820191811901811618612812565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016128645763f5a267f15f526004601cfd5b826128765768fbb67fda52d4bfb8bf92505b80546001600160601b038116806128f05760019350848260601c036128ae5760018301805484556002840180549091555f9055612955565b84600184015460601c036128cf5760028301805460018501555f9055612955565b84600284015460601c036128e8575f6002840155612955565b5f9350612955565b82602052845f5260405f20805480612909575050612955565b60018360011c039250826001820314612939578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf8114150261298883613a3c565b82106112b957604051634e23d03560e01b815260040160405180910390fd5b365f80806129b58686613db2565b935093506129cb86866040908111913510171590565b15612a0a57602085870103866020013580880160208101945080359350828482011182851760401c1715612a065763ba597e7e5f526004601cfd5b5050505b92959194509250565b5f8183604051375060405120919050565b5f82815260a082901c602052604090206001600160a01b0316612a48848284613e48565b610d7d57505f9392505050565b801580612a665750612a66816125dd565b15612a7657611cd9838383613e90565b5f612a8082612669565b6001019050612aee6040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f612af88361346f565b90505f5b81811015612b4a575f612b0f85836134c0565b90506001600160a01b03811615612b41576040840151612b2f9082613ee7565b506060840151612b3f905f613572565b505b50600101612afc565b505f5f5b86811015612d0857600581901b880135880180358015300217906020808201359160408101350190810190358215612b8d57612b8a838761545d565b95505b6004811015612b9f5750505050612d00565b813560e01c63a9059cbb819003612bd5576040890151612bbf9086613ee7565b50612bd3602484013560608b015190613f06565b505b8063ffffffff1663095ea7b303612c1d5760248301355f03612bfb575050505050612d00565b8851612c079086613ee7565b50612c1b600484013560208b015190613f06565b505b8063ffffffff166387517c4503612c95576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba314612c57575050505050612d00565b60448301355f03612c6c575050505050612d00565b612c7f600484013560808b015190613f06565b50612c93602484013560a08b015190613f06565b505b8063ffffffff1663598daac403612cfa576001600160a01b0385163014612cc0575050505050612d00565b8a600484013514612cd5575050505050612d00565b612ce8602484013560408b015190613f06565b506060890151612cf8905f613572565b505b50505050505b600101612b4e565b50604083015151606084015151612d1f9190613f1c565b5f612d52612d308560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b60408501515151811015612d9e57604085015151600582901b0160200151612d9482612d828330613ff2565b85919060059190911b82016020015290565b5050600101612d56565b50612daa888888613e90565b5f8080526001860160205260408120612dc39184613816565b5f5b60408501515151811015612e5157604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b018352939093206060890151518301820151928601909101519091612e479183918591612e429190612e3790612e2e8930613ff2565b80821191030290565b808218908210021890565b613816565b5050600101612dc5565b505f5b84515151811015612e9657845151600582901b0160200151612e8d81612e87848960200151613fe290919063ffffffff16565b5f61401c565b50600101612e54565b505f5b60808501515151811015612ee057608085015151600582901b0160200151612ed781612ed2848960a00151613fe290919063ffffffff16565b614066565b50600101612e99565b505050505050505050565b5f612ef684846140c1565b90508015610d7d5781612f088561346f565b1115610d7d5760405163155176b960e11b815260040160405180910390fd5b612f4860405180606001604052805f81526020015f81526020015f81525090565b5f612f5283612577565b905080515f14612372575f612f668261421c565b602001949350505050565b60408051825160208083019190915283015181830152908201516060820152612fb6908390612fb19060800160405160208183030381529060405261434b565b61335c565b5050565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c925083831415830281528161304857821561304357600191508185015460601c92508215613043578284141590920260208301525060028381015460601c918215613043576003915083831415830260408201525b613078565b600191821c915b82811015613076578581015460601c858114158102600583901b840152935060010161304f565b505b8186528160051b81016040525050505050919050565b5f5f61309984614467565b905082156001600160a01b03821615171580156121495750612149848483613e48565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f00000000000000000000000000000000000000000000000000000000000000004614166131af5750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f5f5f6131dd613246565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b604080518082018252600a8152692232b632b3b0ba34b7b760b11b60208083019190915282518084019093526006835265036392e302e360d41b9083015291565b604081811c5f90815260208490522080546001600160401b03831610156132c1576040516312ee5c9360e01b815260040160405180910390fd5b6132eb6132e5836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f818152686d3d4e7fb92a52381760209081526040808320839055686d3d4e7fb92a523818909152902080546001019055686d3d4e7fb92a52381361333f686d3d4e7fb92a52381683613c97565b612fb65760405163395ed8c160e21b815260040160405180910390fd5b80518060081b60ff175f60fe8311613385575050601f8281015160081b821790808311156133ac575b60208401855f5260205f205b828201518360051c8201556020830192508483106133915750505b509092555050565b5f8160400151156133e9576133cc8260200151614485565b6133e9576040516321b9b33960e21b815260040160405180910390fd5b6133f2826116b7565b90505f686d3d4e7fb92a5238136060840151845160208087015160408089015190519596506134499561342795949301615470565b60408051601f198184030181529181525f85815260048501602052209061335c565b61345660038201836144a1565b5050919050565b5f613467826145b3565b151592915050565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c15176134b8576001935083830154156134b8576002935083830154156134b857600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf821415820291506134f38461346f565b831061351257604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b801561355c5761ffff8116613541576010918201911c613526565b8183526020600582901b16909201916001918201911c613526565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c55360208403518181061582820402905080831061360a578281178101811582602001870160405118176135d657828102601f19870152850160200160405261360a565b602060405101816020018101604052808a52601f19855b88810151838201528101806135ed57509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf906020840181613694578354801561368e5780841415028152600184810154909250801561368e5780841415026020820152600284810154909250801561368e576003925083811415810260408301525b506136bf565b8160011c91505f5b828110156136bd57848101548481141502600582901b83015260010161369c565b505b8185528160051b810160405250505050919050565b686d3d4e7fb92a523813823560601c60148381188185100218808501908085119085030261370b686d3d4e7fb92a52381984612710565b613727576040516282b42960e81b815260040160405180910390fd5b3330146137575761373b33610d57856127ba565b613757576040516282b42960e81b815260040160405180910390fd5b604051818382375f388383875af4611e06573d5f823e3d81fd5b5f61377b846145b3565b905080600303613796576137908484846145fc565b50505050565b365f365f846137ac57637f1812755f526004601cfd5b5085358087016020810194503592505f906040116002861411156137da575050602080860135860190810190355b6137e988888887878787614694565b5050505050505050565b6001600160a01b03831661380b57611cd982826147f2565b611cd983838361480b565b8061382057505050565b5f61382a84613519565b905080515f0361384d57604051635ee7e5b160e01b815260040160405180910390fd5b5f5b8151811015613934575f82828151811061386b5761386b6153b0565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f61389882612f27565b90505f6138b4428560ff1660058111156108ac576108ac614aa3565b905080826040015110156138d057604082018190525f60208301525b815f015187836020018181516138e6919061545d565b915081815250111561391b5760405163482a648960e11b81526001600160a01b03891660048201526024015b60405180910390fd5b6139258383612f71565b5050505080600101905061384f565b5050505050565b5f80806139d861394e62015180866154bf565b5f5f5f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c9250806134565781545f9350156134565760019250828201541561345657600292508282015415613456575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613ab55763f5a267f15f526004601cfd5b82613ac75768fbb67fda52d4bfb8bf92505b801954613af857805460019250831461351257600181015483146135125760028101548314613512575f9150613512565b602052505f90815260409020541515919050565b6060835180156121d1576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613b87579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f82548060ff821714613c4557601e8311613c1c5780831a9150613512565b8060ff168311613c4057835f52601f83038060051c60205f200154601f82161a9250505b613512565b8060081c831161351257835f528260051c60205f200154601f84161a91505092915050565b5f818152686d3d4e7fb92a523818602052604081208054601f5263d4203f8b6004528152603f81206112b9565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613cc45763f5a267f15f526004601cfd5b82613cd65768fbb67fda52d4bfb8bf92505b80195480613d37576001925083825403613d035760018201805483556002830180549091555f90556127b2565b83600183015403613d215760028201805460018401555f90556127b2565b83600283015403612799575f60028301556127b2565b81602052835f5260405f20805480613d505750506127b2565b60018360011c039250826001820314613d7a57828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f613da084846144a1565b90508015610d7d5781612f0885613a3c565b365f833580850160208587010360208201945081359350808460051b8301118360401c1715613de85763ba597e7e5f526004601cfd5b8315613e3e578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c1715613e355763ba597e7e5f526004601cfd5b50505082613df2575b5050509250929050565b5f82815260208082206080909152601f8390526305d78094600b526019602720613e866001600160a01b03871680151590611d4084601b8a8861484b565b9695505050505050565b5f82613e9c5750505050565b600581901b84013584018035801530021790602080820135916040810135019081019035613ecd848484848a614885565b50505050838390508160010191508103613e9c5750505050565b604080516060815290819052610d7d83836001600160a01b0316613572565b604080516060815290819052610d7d8383613572565b6040518151835114613f3a57634e487b715f5260326020526024601cfd5b8251613f4557505050565b5f5f613f50856148c3565b613f59856148c3565b91509150613f66856148f2565b613f6f85614947565b848403601f196020870187518752875160051b3684830137845160051b5b8086015181860151835b82815114613fa757602001613f97565b860180518201808252821115613fc957634e487b715f5260116020526024601cfd5b505050820180613f8d5750505050826040525050505050565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f51141661405c57803d853b15171061405c57633e3f8f735f526004601cfd5b505f603452505050565b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af1611cd9576396b3de235f526004601cfd5b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016140fc5763f5a267f15f526004601cfd5b8261410e5768fbb67fda52d4bfb8bf92505b80546001600160601b03811682602052806141d0578160601c8061413c578560601b84556001945050612955565b8581036141495750612955565b600184015460601c8061416a578660601b6001860155600195505050612955565b868103614178575050612955565b600285015460601c8061419a578760601b600287015560019650505050612955565b8781036141a957505050612955565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f20805461421257600191821c8083018255919450816141fe578560601b600317845550612955565b8560601b8285015582600201845550612955565b5050505092915050565b6060614274565b6fffffffffffffffffffffffffffffffff811160071b81811c6001600160401b031060061b1781811c63ffffffff1060051b1781811c61ffff1060041b1790811c60ff1060039190911c17601f1890565b8151156121f25760405190506004820180518351846020010160ff8115190460071b196020850183198552866020015b8051805f1a6142fd57600190811a01608081116142dd578036843780830192506002820191508482106142d7575061432d565b506142a4565b5f198352918201607f190191600291909101908482106142d7575061432d565b80835283811684011783171961431281614223565b901501828286038281118184180218019250018381106142a4575b509290935250601f198382030183525f815260200160405250919050565b6040518151602082019083015b808414614446576001840193508351601f1a806143e5575b6020850151806143b45785830360208181189082110218607f839003818111818318021896870196928301929050601f81116143ad5750506143d5565b5050614370565b6143bd81614223565b90508583038181118183180218958601959190910190505b60f01b8252600290910190614358565b60ff8103614437576020808601511980156144065761440381614223565b91505b508583038181118282180218601f81811890821102186080811760f01b855295909501945050600290910190614358565b80835350600182019150614358565b50600482018051199052601f198282030182525f8152602001604052919050565b5f60205f5f843c5f5160f01c61ef011460035160601c029050919050565b5f8082600281111561449957614499614aa3565b141592915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036144ce5763f5a267f15f526004601cfd5b826144e05768fbb67fda52d4bfb8bf92505b8019548160205280614584578154806145005784835560019350506127b2565b84810361450d57506127b2565b600183015480614528578560018501556001945050506127b2565b8581036145365750506127b2565b60028401548061455257866002860155600195505050506127b2565b868103614561575050506127b2565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f20805461295557600191821c8381018690558083019182905590821b82178319559092506127b2565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c171561464157633995943b5f526004601cfd5b505f5b838114611e0657365f8260051b850135808601602081019350803592505084828401118160401c171561467e57633995943b5f526004601cfd5b5061468a898383611cbd565b5050600101614644565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001633036146f75760208110156146e6576040516355fe73fd60e11b815260040160405180910390fd5b6146f284848435612a55565b611e06565b806147265733301461471b576040516282b42960e81b815260040160405180910390fd5b6146f284845f612a55565b6020811015614748576040516355fe73fd60e11b815260040160405180910390fd5b813561475d686d3d4e7fb92a52381582614990565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f5f6147ba6147a08888866114af565b60208087108188180218808801908088039088110261090c565b91509150816147db576040516282b42960e81b815260040160405180910390fd5b6147e6878783612a55565b50505050505050505050565b5f385f3884865af1612fb65763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f51141661405c57803d853b15171061405c576390b8ec185f526004601cfd5b5f604051855f5260ff851660205283604052826060526020604060805f60015afa505f6060523d6060185191508060405250949350505050565b61489181868585611f37565b6148b6578085848460405163f78c1b5360e01b815260040161391294939291906154de565b61393485858585856149a7565b604051815160051b8101602001818084035b8082015182528160200191508282036148d5575060405250919050565b80515f82528060051b8201601f19602084015b602001828111614940578051828201805182811161492557505050614905565b5b602082015283018051828111614926575060200152614905565b5050509052565b6002815110610e9f576020810160408201600183510160051b83015b815183511461497757602083019250815183525b60208201915080820361496357505081900360051c9052565b5f5f61499c84846149c2565b600101905550505050565b604051828482375f388483888a5af1611e08573d5f823e3d81fd5b604081811c5f90815260208490522080546001600160401b03808416821490821016614a0157604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f5f83601f840112614a18575f5ffd5b5081356001600160401b03811115614a2e575f5ffd5b602083019150836020828501011115614a01575f5ffd5b5f5f5f60408486031215614a57575f5ffd5b8335925060208401356001600160401b03811115614a73575f5ffd5b614a7f86828701614a08565b9497909650939450505050565b5f60208284031215614a9c575f5ffd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f602082015160038110614b0657614b06614aa3565b806020850152506040820151151560408401526060820151608060608501526121496080850182614ab7565b602081525f610d7d6020830184614ae5565b6001600160a01b0381168114610e9f575f5ffd5b803580151581146121f2575f5ffd5b5f5f5f5f60808587031215614b7a575f5ffd5b843593506020850135614b8c81614b44565b925060408501356001600160e01b031981168114614ba8575f5ffd5b9150614bb660608601614b58565b905092959194509250565b5f5f5f60608486031215614bd3575f5ffd5b8335614bde81614b44565b92506020840135614bee81614b44565b9150614bfc60408501614b58565b90509250925092565b5f60208284031215614c15575f5ffd5b8135610d7d81614b44565b8035600681106121f2575f5ffd5b5f5f5f60608486031215614c40575f5ffd5b833592506020840135614c5281614b44565b9150614bfc60408501614c20565b5f8151808452602084019350602083015f5b82811015614c90578151865260209586019590910190600101614c72565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b82811015614cf157605f19878603018452614cdc858351614ae5565b94506020938401939190910190600101614cc0565b5050505082810360208401526126d88185614c60565b5f5f60208385031215614d18575f5ffd5b82356001600160401b03811115614d2d575f5ffd5b614d3985828601614a08565b90969095509350505050565b5f60208284031215614d55575f5ffd5b81356001600160c01b0381168114610d7d575f5ffd5b5f5f5f5f60808587031215614d7e575f5ffd5b843593506020850135614d9081614b44565b9250614d9e60408601614c20565b9396929550929360600135925050565b602080825282518282018190525f918401906040840190835b81811015614dee5783516001600160a01b0316835260209384019390920191600101614dc7565b509095945050505050565b5f5f83601f840112614e09575f5ffd5b5081356001600160401b03811115614e1f575f5ffd5b6020830191508360208260051b8501011115614a01575f5ffd5b5f5f5f60408486031215614e4b575f5ffd5b83356001600160401b03811115614e60575f5ffd5b614e6c86828701614df9565b909790965060209590950135949350505050565b5f5f5f60608486031215614e92575f5ffd5b833592506020840135614bee81614b44565b60ff60f81b8816815260e060208201525f614ec260e0830189614ab7565b8281036040840152614ed48189614ab7565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b81811015614f29578351835260209384019390920191600101614f0b565b50909b9a5050505050505050505050565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b0381118282101715614f7057614f70614f3a565b60405290565b5f82601f830112614f85575f5ffd5b81356001600160401b03811115614f9e57614f9e614f3a565b604051601f8201601f19908116603f011681016001600160401b0381118282101715614fcc57614fcc614f3a565b604052818152838201602001851015614fe3575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f6020828403121561500f575f5ffd5b81356001600160401b03811115615024575f5ffd5b820160808185031215615035575f5ffd5b61503d614f4e565b813564ffffffffff81168114615051575f5ffd5b8152602082013560038110615064575f5ffd5b602082015261507560408301614b58565b604082015260608201356001600160401b03811115615092575f5ffd5b61509e86828501614f76565b606083015250949350505050565b5f5f602083850312156150bd575f5ffd5b82356001600160401b038111156150d2575f5ffd5b614d3985828601614df9565b600681106150ee576150ee614aa3565b9052565b5f8151808452602084019350602083015f5b82811015614c9057815180516001600160a01b031687526020808201515f9161512f908a01826150de565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e09095019460209190910190600101615104565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b828110156151cf57605f198786030184526151ba8583516150f2565b9450602093840193919091019060010161519e565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b8381101561522857601f19868403018552615212838351614c60565b60209586019590935091909101906001016151f6565b509098975050505050505050565b602081525f610d7d6020830184614ab7565b602081525f610d7d60208301846150f2565b5f5f6040838503121561526b575f5ffd5b823561527681614b44565b915061528460208401614b58565b90509250929050565b602081525f610d7d6020830184614c60565b5f5f5f5f5f608086880312156152b3575f5ffd5b85359450602086013593506040860135925060608601356001600160401b038111156152dd575f5ffd5b6152e988828901614a08565b969995985093965092949392505050565b5f5f6040838503121561530b575f5ffd5b8235915061528460208401614c20565b5f5f5f5f6060858703121561532e575f5ffd5b84359350602085013561534081614b44565b925060408501356001600160401b0381111561535a575f5ffd5b61536687828801614a08565b95989497509550505050565b5f60208284031215615382575f5ffd5b8151610d7d81614b44565b8381526001600160a01b03831660208201526060810161214960408301846150de565b634e487b7160e01b5f52603260045260245ffd5b634e487b7160e01b5f52601160045260245ffd5b5f600182016153e9576153e96153c4565b5060010190565b8481526001600160a01b03841660208201526080810161541360408301856150de565b82606083015295945050505050565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f612149602083018486615422565b808201808211156112b9576112b96153c4565b5f85518060208801845e60d886901b6001600160d81b0319169083019081526003851061549f5761549f614aa3565b60f894851b600582015292151590931b6006830152506007019392505050565b5f826154d957634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f90613e86908301848661542256fe3232323232323232323232323232323232323232323232323232323232323232a264697066735822122072918e0c4b187446e5267249687d50bde7fc965047a7c83935f79fde1a3a89c164736f6c634300081d0033" as const;


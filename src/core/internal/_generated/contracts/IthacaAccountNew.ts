export const abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "orchestrator",
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
    "name": "ORCHESTRATOR",
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
        "internalType": "struct IthacaAccountNew.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccountNew.KeyType"
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
    "name": "callCheckerInfos",
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
        "internalType": "struct GuardedExecutor.CallCheckerInfo[]",
        "components": [
          {
            "name": "target",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "checker",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "stateMutability": "view"
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
    "name": "getContextKeyHash",
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
        "internalType": "struct IthacaAccountNew.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccountNew.KeyType"
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
        "internalType": "struct IthacaAccountNew.Key[]",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccountNew.KeyType"
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
        "internalType": "struct IthacaAccountNew.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccountNew.KeyType"
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
        "internalType": "struct IthacaAccountNew.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccountNew.KeyType"
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
        "name": "intentDigest",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "encodedIntent",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
    "name": "setCallChecker",
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
        "name": "checker",
        "type": "address",
        "internalType": "address"
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
        "name": "result",
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
    "name": "upgradeProxyAccount",
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
        "internalType": "struct IthacaAccountNew.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccountNew.KeyType"
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
    "name": "CallCheckerSet",
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
        "name": "checker",
        "type": "address",
        "indexed": false,
        "internalType": "address"
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
    "name": "InvalidPublicKey",
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
    "name": "NewImplementationIsZero",
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

export const code = "0x610140604052604051615c62380380615c62833981016040819052610023916100ea565b306080524660a052606080610075604080518082018252600d81526c125d1a1858d85058d8dbdd5b9d609a1b60208083019190915282518084019093526006835265036392e302e360d41b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610117565b5f602082840312156100fa575f5ffd5b81516001600160a01b0381168114610110575f5ffd5b9392505050565b60805160a05160c05160e0516101005161012051615ae16101815f395f8181610742015281816108d3015281816118e001528181611f8401528181612044015261371801525f612e9401525f612f4e01525f612f2801525f612ed801525f612eb50152615ae15ff3fe60806040526004361061025f575f3560e01c80638e87cf4711610143578063cb4774c4116100b5578063e9ae5c5311610079578063e9ae5c531461081b578063f81d87a71461082e578063faba56d81461084d578063fac750e01461086c578063fcd4e70714610880578063ff619c6b146108a857610266565b8063cb4774c414610764578063cebfe33614610785578063d03c7914146107a4578063dcc09ebf146107c3578063e5adda71146107ef57610266565b8063b70e36f011610107578063b70e36f014610693578063b75c7dc6146106b2578063bc2c554a146106d1578063be766d15146106fe578063bf53096914610712578063c885f95a1461073157610266565b80638e87cf47146105ea578063912aa1b8146106165780639e49fbf114610635578063a840fe4914610648578063ad0770831461066757610266565b80632f3f30c7116101dc57806357022451116101a05780635702245114610514578063598daac41461053357806360d2f33d146105525780636fd91454146105855780637656d304146105a457806384b0196e146105c357610266565b80632f3f30c714610482578063350585011461049c5780633e1b0812146104b65780634223b5c2146104d5578063515c9d6d146104f457610266565b806317e69ab81161022357806317e69ab81461039e5780631a912f3e146103cd57806320606b701461040e5780632081a278146104415780632150c5181461046057610266565b80630cef73b41461029f57806311a86fd6146102da57806312aaac7014610319578063136a12f7146103455780631626ba7e1461036657610266565b3661026657005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a028214171561029157806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102aa575f5ffd5b506102be6102b9366004614eb0565b6108c7565b6040805192151583526020830191909152015b60405180910390f35b3480156102e5575f5ffd5b5061030173323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102d1565b348015610324575f5ffd5b50610338610333366004614ef7565b610bc8565b6040516102d19190614f9d565b348015610350575f5ffd5b5061036461035f366004614fdb565b610cb7565b005b348015610371575f5ffd5b50610385610380366004614eb0565b610de1565b6040516001600160e01b031990911681526020016102d1565b3480156103a9575f5ffd5b506103bd6103b8366004614ef7565b610e49565b60405190151581526020016102d1565b3480156103d8575f5ffd5b506104007f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102d1565b348015610419575f5ffd5b506104007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b34801561044c575f5ffd5b5061036461045b366004615045565b610f10565b34801561046b575f5ffd5b5061047461105f565b6040516102d19291906150ba565b34801561048d575f5ffd5b50610385630707070760e51b81565b3480156104a7575f5ffd5b50610385631919191960e11b81565b3480156104c1575f5ffd5b506104006104d0366004615127565b6111c9565b3480156104e0575f5ffd5b506103386104ef366004614ef7565b611201565b3480156104ff575f5ffd5b506104005f516020615a6c5f395f51905f5281565b34801561051f575f5ffd5b5061036461052e36600461514d565b611239565b34801561053e575f5ffd5b5061036461054d36600461518c565b611326565b34801561055d575f5ffd5b506104007f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b348015610590575f5ffd5b5061040061059f36600461520f565b611478565b3480156105af575f5ffd5b506103646105be366004615256565b6115b7565b3480156105ce575f5ffd5b506105d7611671565b6040516102d1979695949392919061528a565b3480156105f5575f5ffd5b50610609610604366004614ef7565b611697565b6040516102d19190615320565b348015610621575f5ffd5b5061036461063036600461537a565b61177f565b610364610643366004614ef7565b6118d5565b348015610653575f5ffd5b5061040061066236600461545a565b611937565b348015610672575f5ffd5b50610686610681366004614ef7565b611970565b6040516102d19190615507565b34801561069e575f5ffd5b506103646106ad366004614ef7565b611983565b3480156106bd575f5ffd5b506103646106cc366004614ef7565b6119eb565b3480156106dc575f5ffd5b506106f06106eb366004615547565b611a40565b6040516102d192919061561f565b348015610709575f5ffd5b50610400611b77565b34801561071d575f5ffd5b5061036461072c3660046156dd565b611bcc565b34801561073c575f5ffd5b506103017f000000000000000000000000000000000000000000000000000000000000000081565b34801561076f575f5ffd5b50610778611c70565b6040516102d1919061570f565b348015610790575f5ffd5b5061040061079f36600461545a565b611c89565b3480156107af575f5ffd5b506103bd6107be366004614ef7565b611cf1565b3480156107ce575f5ffd5b506107e26107dd366004614ef7565b611d03565b6040516102d19190615721565b3480156107fa575f5ffd5b5061080e610809366004614ef7565b611ec7565b6040516102d19190615733565b610364610829366004614eb0565b611eda565b348015610839575f5ffd5b50610364610848366004615745565b611f5c565b348015610858575f5ffd5b506104006108673660046157a0565b612137565b348015610877575f5ffd5b5061040061226f565b34801561088b575f5ffd5b5061089561c1d081565b60405161ffff90911681526020016102d1565b3480156108b3575f5ffd5b506103bd6108c23660046157ca565b612282565b63060f052a5f908152807f00000000000000000000000000000000000000000000000000000000000000006020826004601c845afa80155f51171561091357639e87fac85f526004601cfd5b5060418414604085141715610944573061092e878787612556565b6001600160a01b03161492505f9150610bc09050565b602184101561095957505f9150819050610bc0565b60201984810185811181871802811895870191820135935090601f19013560ff161561098b57610988876125de565b96505b505f61099683610bc8565b805190915064ffffffffff1642811090151516156109b8575f93505050610bc0565b5f816020015160038111156109cf576109cf614f0e565b03610a2a575f80603f8711883581029060208a013502915091505f5f610a0e856060015180516020820151604090920151603f90911191820292910290565b91509150610a1f8b858585856125f7565b975050505050610bbd565b600181602001516003811115610a4257610a42614f0e565b03610ac757606081810151805160208083015160409384015184518084018e9052855180820385018152601f8d018590049094028101870186529485018b8152603f9490941091820295910293610abe935f92610ab7928e918e918291018382808284375f9201919091525061269092505050565b8585612778565b95505050610bbd565b600281602001516003811115610adf57610adf614f0e565b03610b0e57610b078160600151806020019051810190610aff9190615821565b888888612897565b9350610bbd565b600381602001516003811115610b2657610b26614f0e565b03610bbd57806060015151602014610b515760405163145a1fdd60e31b815260040160405180910390fd5b5f8160600151610b609061583c565b60601c9050604051638afc93b48152886020820152846040820152606080820152866080820152868860a08301375f5f526084870160205f82601c8501865afa915050638afc93b45f5160e01c14811615610bba57600195505b50505b50505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f82815268448e3efef2f6a7f2f960205260408120610c0890612977565b8051909150610c2a5760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610c3e8383016020015190565b60d881901c855260c881901c915060d01c60ff166003811115610c6357610c63614f0e565b84602001906003811115610c7957610c79614f0e565b90816003811115610c8c57610c8c614f0e565b90525060ff811615156040850152610ca983838151811082025290565b606085015250919392505050565b333014610cd6576040516282b42960e81b815260040160405180910390fd5b8380610cf557604051638707510560e01b815260040160405180910390fd5b5f516020615a6c5f395f51905f528514610d3057610d12856129dd565b15610d3057604051630442081560e01b815260040160405180910390fd5b610d3a8484612a41565b15610d58576040516303a6f8c760e21b815260040160405180910390fd5b610d7b60e084901c606086901b1783610800610d7389612a69565b929190612ab8565b50604080518681526001600160a01b03861660208201526001600160e01b031985169181019190915282151560608201527f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e1906080015b60405180910390a15050505050565b5f5f5f610def8686866108c7565b90925090508115158115151615610e2557610e09816129dd565b80610e225750610e2233610e1c83612ae1565b90612b10565b91505b81610e345763ffffffff610e3a565b631626ba7e5b60e01b925050505b9392505050565b5f333014610e69576040516282b42960e81b815260040160405180910390fd5b5f610ea2610e9e610e9b60017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615894565b90565b5c90565b90507f0a9f35b227e9f474cb86caa2e9b62847626fede22333cf52c7abea325d2eaa358114610ecf575f5ffd5b610f05610f00610e9b60017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615894565b612bba565b60019150505b919050565b333014610f2f576040516282b42960e81b815260040160405180910390fd5b8280610f4e57604051638707510560e01b815260040160405180910390fd5b610f57846129dd565b15610f755760405163f2fee1e160e01b815260040160405180910390fd5b5f610f7f85612a69565b6001600160a01b0385165f908152600282016020526040902060019091019150610fcd846006811115610fb457610fb4614f0e565b8254600160ff9092169190911b80198216845516151590565b15610fed575f610fdc82612bc0565b03610fed57610feb8286612bdb565b505b61101c816001015f86600681111561100757611007614f0e565b60ff1681526020019081526020015f205f9055565b7fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a2786868660405161104f939291906158a7565b60405180910390a1505050505050565b6060805f61106b61226f565b9050806001600160401b0381111561108557611085615395565b6040519080825280602002602001820160405280156110d457816020015b604080516080810182525f80825260208083018290529282015260608082015282525f199092019101816110a35790505b509250806001600160401b038111156110ef576110ef615395565b604051908082528060200260200182016040528015611118578160200160208202803683370190505b5091505f805b828110156111be575f61113f8268448e3efef2f6a7f2f65b60020190612d10565b90505f61114b82610bc8565b805190915064ffffffffff16428110901515161561116a5750506111b6565b8087858151811061117d5761117d6158ca565b60200260200101819052508186858151811061119b5761119b6158ca565b6020908102919091010152836111b0816158de565b94505050505b60010161111e565b508084528252509091565b6001600160c01b0381165f90815268448e3efef2f6a7f2f76020526040808220549083901b67ffffffffffffffff1916175b92915050565b604080516080810182525f80825260208201819052918101919091526060808201526111fb6103338368448e3efef2f6a7f2f6611136565b333014611258576040516282b42960e81b815260040160405180910390fd5b828061127757604051638707510560e01b815260040160405180910390fd5b5f516020615a6c5f395f51905f5284146112b257611294846129dd565b156112b25760405163f2fee1e160e01b815260040160405180910390fd5b5f6112bc85612a69565b60030190506112db8185856001600160a01b0381161515610800612d59565b50604080518681526001600160a01b0380871660208301528516918101919091527f7e2baa9c3a554d7c6587682e28fe9607c29d1d8c8a46968368d5614607c6079990606001610dd2565b333014611345576040516282b42960e81b815260040160405180910390fd5b838061136457604051638707510560e01b815260040160405180910390fd5b61136d856129dd565b1561138b5760405163f2fee1e160e01b815260040160405180910390fd5b5f61139586612a69565b60010190506113a681866040612d84565b506001600160a01b0385165f90815260018201602052604090206113ec8560068111156113d5576113d5614f0e565b8254600160ff9092169190911b8082178455161590565b505f816001015f87600681111561140557611405614f0e565b60ff1681526020019081526020015f2090505f61142182612dc0565b86815290506114308282612e0a565b7f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a8989898960405161146594939291906158f6565b60405180910390a1505050505050505050565b5f806114948460408051828152600190920160051b8201905290565b90505f5b84811015611534575f5f365f6114af8a8a87612e4f565b92965090945092509050611524856115157f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876114f68888612e81565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b5050505050806001019050611498565b5061c1d060f084901c145f61158e7f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b9050816115a35761159e81612e92565b6115ac565b6115ac81612fa8565b979650505050505050565b3330146115d6576040516282b42960e81b815260040160405180910390fd5b5f83815268448e3efef2f6a7f2f9602052604090205460ff1661160c5760405163395ed8c160e21b815260040160405180910390fd5b611625828261020061161d87612ae1565b92919061301c565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc9983604051611664911515815260200190565b60405180910390a3505050565b600f60f81b6060805f808083611685613037565b97989097965046955030945091925090565b60605f6116a383612a69565b60030190506116b18161307b565b6001600160401b038111156116c8576116c8615395565b60405190808252806020026020018201604052801561170c57816020015b604080518082019091525f80825260208201528152602001906001900390816116e65790505b5091505f5b8251811015611778576117248282613085565b848381518110611736576117366158ca565b60200260200101515f01858481518110611752576117526158ca565b6020908102919091018101516001600160a01b0393841691015291169052600101611711565b5050919050565b33301461179e576040516282b42960e81b815260040160405180910390fd5b6001600160a01b0381166117c557604051634adebaa360e11b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c525190555f611800613037565b915061185c90507f0a9f35b227e9f474cb86caa2e9b62847626fede22333cf52c7abea325d2eaa35611856610e9b60017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615894565b906130bf565b306317e69ab861186b836130c6565b6040518263ffffffff1660e01b815260040161188991815260200190565b6020604051808303815f875af11580156118a5573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906118c99190615928565b6118d1575f5ffd5b5050565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461191d576040516282b42960e81b815260040160405180910390fd5b61193468448e3efef2f6a7f2f65b600101826130ee565b50565b5f6111fb8260200151600381111561195157611951614f0e565b60ff168360600151805190602001205f1c5f9182526020526040902090565b60606111fb61197e83612ae1565b613105565b3330146119a2576040516282b42960e81b815260040160405180910390fd5b6119b568448e3efef2f6a7f2f7826131d9565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b333014611a0a576040516282b42960e81b815260040160405180910390fd5b611a1381613243565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b03811115611a5c57611a5c615395565b604051908082528060200260200182016040528015611a8f57816020015b6060815260200190600190039081611a7a5790505b509250806001600160401b03811115611aaa57611aaa615395565b604051908082528060200260200182016040528015611add57816020015b6060815260200190600190039081611ac85790505b5091505f5b81811015611b6e57611b0b868683818110611aff57611aff6158ca565b90506020020135611d03565b848281518110611b1d57611b1d6158ca565b6020026020010181905250611b49868683818110611b3d57611b3d6158ca565b90506020020135611ec7565b838281518110611b5b57611b5b6158ca565b6020908102919091010152600101611ae2565b50509250929050565b5f80611ba5611b9460015f516020615a8c5f395f51905f52615894565b604080516020810190915290815290565b9050611bb081515c90565b5f03611bbd57505f919050565b611bc6816132ae565b91505090565b333014611beb576040516282b42960e81b815260040160405180910390fd5b611c3382828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250611c2d925061296a915050565b906132ce565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611c6492919061596b565b60405180910390a15050565b6060611c8468448e3efef2f6a7f2f6612977565b905090565b5f333014611ca9576040516282b42960e81b815260040160405180910390fd5b611cb282613326565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611ce49190614f9d565b60405180910390a2919050565b5f611cfb826133c8565b151592915050565b60605f611d0f83612a69565b6001019050611d2a6040518060200160405280606081525090565b5f611d3483613411565b90505f5b81811015611ebd575f611d4b8583613462565b6001600160a01b0381165f9081526001870160205260408120919250611d70826134bb565b90505f5b8151811015611eae575f828281518110611d9057611d906158ca565b602002602001015190505f611db9856001015f8460ff1681526020019081526020015f20612dc0565b9050611df66040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166006811115611e0b57611e0b614f0e565b81602001906006811115611e2157611e21614f0e565b90816006811115611e3457611e34614f0e565b9052506001600160a01b03871681528151604080830191909152820151608082015260208201516060820152611e794260ff8516600681111561086757610867614f0e565b60c08201819052608082015160608301519111150260a082015280611e9e8b82613514565b5050505050806001019050611d74565b50505050806001019050611d38565b5050519392505050565b60606111fb611ed583612a69565b6135bd565b5f611ee4846133c8565b905080600303611eff57611ef9848484613676565b50505050565b365f365f84611f1557637f1812755f526004601cfd5b5085358087016020810194503592505f90604011600286141115611f43575050602080860135860190810190355b611f528888888787878761370e565b5050505050505050565b813580830190604081901c602084101715611f75575f5ffd5b50611fea336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611fe130611fb6602086018661537a565b6001600160a01b03161430611fd1608087016060880161537a565b6001600160a01b03161417151590565b15159015151690565b612006576040516282b42960e81b815260040160405180910390fd5b30612017608083016060840161537a565b6001600160a01b031603612097575f80612039866102b961028086018661597e565b915091508096505f197f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316310361207757600191505b81612094576040516282b42960e81b815260040160405180910390fd5b50505b6120c26120aa60a083016080840161537a565b6120bc6102608401610240850161537a565b88613926565b8415806120d357506120d3856129dd565b61212f575f6120e186612a69565b60018101915061212d906002015f6120ff60a086016080870161537a565b6001600160a01b0316815260208101919091526040015f2061212760a085016080860161537a565b8961394e565b505b505050505050565b5f8082600681111561214b5761214b614f0e565b0361215e57603c808404025b90506111fb565b600182600681111561217257612172614f0e565b0361218357610e1080840402612157565b600282600681111561219757612197614f0e565b036121a9576201518080840402612157565b60038260068111156121bd576121bd614f0e565b036121e3576007600362015180808604918201929092069003620545ff85110202612157565b5f5f6121ee85613a73565b509092509050600484600681111561220857612208614f0e565b036122225761221982826001613b1d565b925050506111fb565b600584600681111561223657612236614f0e565b036122475761221982600180613b1d565b600684600681111561225b5761225b614f0e565b0361226b576001925050506111fb565b5f5ffd5b5f611c8468448e3efef2f6a7f2f8613b74565b5f846122905750600161254e565b612299856129dd565b156122a65750600161254e565b631919191960e11b600483106122ba575082355b826122c95750630707070760e51b5b6122d38582612a41565b156122e1575f91505061254e565b5f6122eb87612a69565b90506122f681613b74565b156123b35761231160e083901c606088901b175b8290613bc0565b156123215760019250505061254e565b6123346332323232606088901b1761230a565b156123445760019250505061254e565b61236a60e083901c73191919191919191919191919191919191919191960611b1761230a565b1561237a5760019250505061254e565b6123a37f323232323232323232323232323232323232323200000000000000003232323261230a565b156123b35760019250505061254e565b6123c95f516020615a6c5f395f51905f52612a69565b90506123d481613b74565b1561248e576123ec60e083901c606088901b1761230a565b156123fc5760019250505061254e565b61240f6332323232606088901b1761230a565b1561241f5760019250505061254e565b61244560e083901c73191919191919191919191919191919191919191960611b1761230a565b156124555760019250505061254e565b61247e7f323232323232323232323232323232323232323200000000000000003232323261230a565b1561248e5760019250505061254e565b61249c878888898989613c44565b156124ac5760019250505061254e565b6124ce8788733232323232323232323232323232323232323232898989613c44565b156124de5760019250505061254e565b6124f95f516020615a6c5f395f51905f528888808989613c44565b156125095760019250505061254e565b6125385f516020615a6c5f395f51905f5288733232323232323232323232323232323232323232898989613c44565b156125485760019250505061254e565b5f925050505b949350505050565b5f6040518260408114612571576041811461259857506125c9565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526125a9565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d6125d6575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d610f0b57fe5b5f6040518681528560208201528460408201528360608201528260808201525f5f5260205f60a0836101005afa503d61265b576d1ab2e8006fd8b71907bf06a5bdee3b61265b5760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa61265b57fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6126c56040518060c0016040528060608152602001606081526020015f81526020015f81526020015f81526020015f81525090565b815160c081106127725760208301818101818251018281108260c083011117156126f157505050612772565b808151019250806020820151018181108382111782851084861117171561271b5750505050612772565b828151602083010111838551602087010111171561273c5750505050612772565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f5f5f61278788600180613cf2565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561286b57602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061286b57fe5b505050821561288c576128898287608001518860a0015188886125f7565b92505b505095945050505050565b5f6001600160a01b0385161561254e57604051853b6129275782604081146128c757604181146128ee5750612961565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526128ff565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f60605280604052612961565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b68448e3efef2f6a7f2f690565b60405181546020820190600881901c5f8260ff8417146129a557505080825260ff8116601f808211156129c7575b855f5260205f205b8160051c810154828601526020820191508282106129ad57505b508084525f920191825250602001604052919050565b5f81815268448e3efef2f6a7f2f960205260408120805460ff808216908114801590910260089290921c021780612a275760405163395ed8c160e21b815260040160405180910390fd5b612a34825f198301613de3565b60ff161515949350505050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f516020615a6c5f395f51905f528314612a8d57612a8883613e50565b612a9c565b5f516020615a6c5f395f51905f525b68b11ddb8fabd886bebb6009525f908152602990209392505050565b5f82612acd57612ac88585613e7d565b612ad8565b612ad8858584613f7b565b95945050505050565b5f81815268448e3efef2f6a7f2fa602052604081208054601f5263d4203f8b6004528152603f81208190610e42565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612b4b5763f5a267f15f526004601cfd5b82612b5d5768fbb67fda52d4bfb8bf92505b80546001600160601b038116612ba15760019250838160601c0315612bb257600182015460601c8414612bb257600282015460601c8414612bb2575b5f9250612bb2565b81602052835f5260405f2054151592505b505092915050565b5f815d50565b5f81545b801561277257600191820191811901811618612bc4565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612c165763f5a267f15f526004601cfd5b82612c285768fbb67fda52d4bfb8bf92505b80546001600160601b03811680612ca25760019350848260601c03612c605760018301805484556002840180549091555f9055612d07565b84600184015460601c03612c815760028301805460018501555f9055612d07565b84600284015460601c03612c9a575f6002840155612d07565b5f9350612d07565b82602052845f5260405f20805480612cbb575050612d07565b60018360011c039250826001820314612ceb578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612d3a83613b74565b82106111fb57604051634e23d03560e01b815260040160405180910390fd5b5f82612d6e57612d698686613f98565b612d7a565b612d7a86868685613fc9565b9695505050505050565b5f612d8f8484614004565b90508015610e425781612da185613411565b1115610e425760405163155176b960e11b815260040160405180910390fd5b612de160405180606001604052805f81526020015f81526020015f81525090565b5f612deb83612977565b905080515f14612772575f612dff8261415f565b602001949350505050565b604080518251602080830191909152830151818301529082015160608201526118d1908390612e4a906080016040516020818303038152906040526142ab565b6132ce565b60051b82013590910180356001600160a01b031680153002179260208083013593506040830135909201918201913590565b5f8183604051375060405120919050565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f0000000000000000000000000000000000000000000000000000000000000000461416612f855750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f5f5f612fb3613037565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b5f8261302c57612ac88585612bdb565b612ad8858584612d84565b604080518082018252600d81526c125d1a1858d85058d8dbdd5b9d609a1b60208083019190915282518084019093526006835265036392e302e360d41b9083015291565b5f6111fb82613411565b5f8060018401816130968686613462565b6001600160a01b038082168352602083019390935260409091015f205490969116945092505050565b80825d5050565b8051602181106130dd5763ec92f9a35f526004601cfd5b9081015160209190910360031b1b90565b5f5f6130fa84846144d8565b600101905550505050565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c925083831415830281528161319357821561318e57600191508185015460601c9250821561318e578284141590920260208301525060028381015460601c91821561318e576003915083831415830260408201525b6131c3565b600191821c915b828110156131c1578581015460601c858114158102600583901b840152935060010161319a565b505b8186528160051b81016040525050505050919050565b604081811c5f90815260208490522080546001600160401b0383161015613213576040516312ee5c9360e01b815260040160405180910390fd5b61323d613237836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f81815268448e3efef2f6a7f2f96020908152604080832083905568448e3efef2f6a7f2fa90915290208054600101905568448e3efef2f6a7f2f661329168448e3efef2f6a7f2f883613e7d565b6118d15760405163395ed8c160e21b815260040160405180910390fd5b80515f90805c806132c65763bc7ec7795f526004601cfd5b015c92915050565b80518060081b60ff175f60fe83116132f7575050601f8281015160081b8217908083111561331e575b60208401855f5260205f205b828201518360051c8201556020830192508483106133035750505b509092555050565b5f81604001511561335b5761333e826020015161451e565b61335b576040516321b9b33960e21b815260040160405180910390fd5b61336482611937565b90505f68448e3efef2f6a7f2f66060840151845160208087015160408089015190519596506133bb95613399959493016159c0565b60408051601f198184030181529181525f8581526003850160205220906132ce565b611778600282018361453a565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c151761345a5760019350838301541561345a5760029350838301541561345a57600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf8214158202915061349584613411565b83106134b457604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b80156134fe5761ffff81166134e3576010918201911c6134c8565b8183526020600582901b16909201916001918201911c6134c8565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c5536020840351818106158282040290508083106135ac5782811781018115826020018701604051181761357857828102601f1987015285016020016040526135ac565b602060405101816020018101604052808a52601f19855b888101518382015281018061358f57509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf90602084018161363657835480156136305780841415028152600184810154909250801561363057808414150260208201526002848101549092508015613630576003925083811415810260408301525b50613661565b8160011c91505f5b8281101561365f57848101548481141502600582901b83015260010161363e565b505b8185528160051b810160405250505050919050565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c17156136bb57633995943b5f526004601cfd5b505f5b83811461212d57365f8260051b850135808601602081019350803592505084828401118160401c17156136f857633995943b5f526004601cfd5b50613704898383611eda565b50506001016136be565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001633036137d4576020811461375f5760405163438e981560e11b815260040160405180910390fd5b60408051602081019091528235906137949082908061378c60015f516020615a8c5f395f51905f52615894565b90529061464c565b61379f858583614666565b60408051602081019091526137ce90806137c760015f516020615a8c5f395f51905f52615894565b9052614acf565b5061212d565b80613808573330146137f8576040516282b42960e81b815260040160405180910390fd5b61380384845f614666565b61212d565b602081101561382a5760405163438e981560e11b815260040160405180910390fd5b813561383e68448e3efef2f6a7f2f661192b565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f5f61389b613881888886611478565b6020808710818818021880880190808803908811026108c7565b91509150816138bc576040516282b42960e81b815260040160405180910390fd5b6138e781604051806020016040528060015f516020615a8c5f395f51905f525f1c61378c9190615894565b6138f2878783614666565b604080516020810190915261391a90806137c760015f516020615a8c5f395f51905f52615894565b50505050505050505050565b6001600160a01b0383166139435761393e8282614af0565b505050565b61393e838383614b09565b8061395857505050565b5f613962846134bb565b905080515f0361398557604051635ee7e5b160e01b815260040160405180910390fd5b5f5b8151811015613a6c575f8282815181106139a3576139a36158ca565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f6139d082612dc0565b90505f6139ec428560ff16600681111561086757610867614f0e565b90508082604001511015613a0857604082018190525f60208301525b815f01518783602001818151613a1e9190615a0f565b9150818152501115613a535760405163482a648960e11b81526001600160a01b03891660048201526024015b60405180910390fd5b613a5d8383612e0a565b50505050806001019050613987565b5050505050565b5f8080613b10613a866201518086615a22565b5f5f5f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c9250806117785781545f9350156117785760019250828201541561177857600292508282015415611778575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613bed5763f5a267f15f526004601cfd5b82613bff5768fbb67fda52d4bfb8bf92505b801954613c305780546001925083146134b457600181015483146134b457600281015483146134b4575f91506134b4565b602052505f90815260409020541515919050565b5f5f5f613c5d87613c548b612a69565b60030190614b53565b915091508115613ce4576040516001629e639560e01b031981526001600160a01b0382169063ff619c6b90613c9c908b908a908a908a90600401615a41565b602060405180830381865afa158015613cb7573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190613cdb9190615928565b92505050612d7a565b505f98975050505050505050565b6060835180156125d6576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613d6d579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f82548060ff821714613e2b57601e8311613e025780831a91506134b4565b8060ff168311613e2657835f52601f83038060051c60205f200154601f82161a9250505b6134b4565b8060081c83116134b457835f528260051c60205f200154601f84161a91505092915050565b5f81815268448e3efef2f6a7f2fa602052604081208054601f5263d4203f8b6004528152603f81206111fb565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613eaa5763f5a267f15f526004601cfd5b82613ebc5768fbb67fda52d4bfb8bf92505b80195480613f1d576001925083825403613ee95760018201805483556002830180549091555f9055612bb2565b83600183015403613f075760028201805460018401555f9055612bb2565b83600283015403612b99575f6002830155612bb2565b81602052835f5260405f20805480613f36575050612bb2565b60018360011c039250826001820314613f6057828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f613f86848461453a565b90508015610e425781612da185613b74565b6001600160a01b0381165f908152600183016020526040812080546001600160a01b0319169055610e428383612bdb565b6001600160a01b038381165f908152600186016020526040812080546001600160a01b03191692851692909217909155612ad8858584612d84565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be19830161403f5763f5a267f15f526004601cfd5b826140515768fbb67fda52d4bfb8bf92505b80546001600160601b0381168260205280614113578160601c8061407f578560601b84556001945050612d07565b85810361408c5750612d07565b600184015460601c806140ad578660601b6001860155600195505050612d07565b8681036140bb575050612d07565b600285015460601c806140dd578760601b600287015560019650505050612d07565b8781036140ec57505050612d07565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f20805461415557600191821c808301825591945081614141578560601b600317845550612d07565b8560601b8285015582600201845550612d07565b5050505092915050565b6060815115610f0b576040519050600482018051835184602001017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f6020850183198552866020015b8051805f1a61420057600190811a01608081116141e05760028201915080368437918201918482106141da575061428d565b506141a8565b5f198352918201607f190191600291909101908482106141da575061428d565b80835283811684011783171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f8601f6f8421084210842108cc6318c6db6d54be660204081020408185821060071b86811c6001600160401b031060061b1795861c0260181a1c161a90911860031c0191820191018381106141a8578381111561428d57838103820391505b509290935250601f198382030183525f815260200160405250919050565b6060614303565b6fffffffffffffffffffffffffffffffff811160071b81811c6001600160401b031060061b1781811c63ffffffff1060051b1781811c61ffff1060041b1790811c60ff1060039190911c17601f1890565b50604051815182017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f60208301845b8381146144b457600101805160ff16806143bc575b60208201518061438b5782860360208181189082110218607f839003818111818318021893840193928301929050601f81116143845750506143ac565b5050614347565b614394816142b2565b90508286038181118183180218928301929190910190505b60f01b8252600290910190614332565b60ff810361440f576020808301511980156143dd576143da816142b2565b91505b508286038181118282180218601f81811890821102186080811760f01b85526002909401939290920191506143329050565b80835350602081015160018381018290528482168501821791198581168601179190911684171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f86f8421084210842108cc6318c6db6d54be660204081020408184821060071b85811c6001600160401b031060061b1794851c0260181a1c601f161a90911860031c018286038181119181189190910218928301019101614332565b50600484018051199052601f198482030184525f8152602001604052509092915050565b604081811c5f90815260208490522080546001600160401b0380841682149082101661451757604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f8082600381111561453257614532614f0e565b141592915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036145675763f5a267f15f526004601cfd5b826145795768fbb67fda52d4bfb8bf92505b801954816020528061461d57815480614599578483556001935050612bb2565b8481036145a65750612bb2565b6001830154806145c157856001850155600194505050612bb2565b8581036145cf575050612bb2565b6002840154806145eb5786600286015560019550505050612bb2565b8681036145fa57505050612bb2565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f208054612d0757600191821c8381018690558083019182905590821b8217831955909250612bb2565b5f825f015190506001815c01828183015d80825d50505050565b8015806146775750614677816129dd565b156146875761393e838383614b8d565b5f61469182612a69565b60010190506146ff6040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f61470983613411565b90505f5b8181101561475b575f6147208583613462565b90506001600160a01b038116156147525760408401516147409082614bd7565b506060840151614750905f613514565b505b5060010161470d565b505f5f5b868110156148ec575f5f365f6147768c8c87612e4f565b9350935093509350825f146147925761478f8387615a0f565b95505b60048110156147a457505050506148e4565b813560e01c63a9059cbb8190036147da5760408901516147c49086614bd7565b506147d8602484013560608b015190614bf6565b505b8063ffffffff1663095ea7b3036148425760248301355f036148005750505050506148e4565b885161480c9086614bd7565b50614820600484013560208b015190614bf6565b5060408901516148309086614bd7565b506060890151614840905f613514565b505b8063ffffffff166387517c45036148de576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba31461487c5750505050506148e4565b60448301355f036148915750505050506148e4565b6148a4600484013560808b015190614bf6565b506148b8602484013560a08b015190614bf6565b506148cc600484013560408b015190614bf6565b5060608901516148dc905f613514565b505b50505050505b60010161475f565b506040830151516060840151516149039190614c0c565b5f6149366149148560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b6040850151515181101561498257604085015151600582901b0160200151614978826149668330614d4f565b85919060059190911b82016020015290565b505060010161493a565b5061498e888888614b8d565b5f80805260018601602052604081206149a7918461394e565b5f5b60408501515151811015614a3557604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b018352939093206060890151518301820151928601909101519091614a2b9183918591614a269190614a1b90614a128930614d4f565b80821191030290565b808218908210021890565b61394e565b50506001016149a9565b505f5b84515151811015614a7a57845151600582901b0160200151614a7181614a6b848960200151614d3f90919063ffffffff16565b5f614d79565b50600101614a38565b505f5b60808501515151811015614ac457608085015151600582901b0160200151614abb81614ab6848960a00151614d3f90919063ffffffff16565b614db9565b50600101614a7d565b505050505050505050565b8051805c80614ae55763bc7ec7795f526004601cfd5b60018103825d505050565b5f385f3884865af16118d15763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416614b4957803d853b151710614b49576390b8ec185f526004601cfd5b505f603452505050565b6001600160a01b038181165f90815260018401602052604081205490911680151580614b845750614b848484614e14565b91509250929050565b5f82614b995750505050565b5f5f365f614ba8888887612e4f565b9350935093509350614bbd848484848a614e1f565b50505050838390508160010191508103614b995750505050565b604080516060815290819052610e4283836001600160a01b0316613514565b604080516060815290819052610e428383613514565b614c99565b805181602083015b8281511015614c4557805160209290920180518252918252614c45868301878301805182519091529052565b602001848110614c1957508251815184528152614c6c858201868501805182519091529052565b808360400111614c8157614c81858285614c11565b838160600111613a6c57613a6c858560208401614c11565b805180835114614cb557634e487b715f5260326020526024601cfd5b6002811061393e57828203602084018260051b8101614cd5838284614c11565b82820151604087015b8051845114614cfa5781858501525f9150602084019350805184525b8085015191820191821015614d1b57634e487b715f5260116020526024601cfd5b602081019050828103614cde57509282019290925284900360051c93849052505052565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f511416614b4957803d853b151710614b4957633e3f8f735f526004601cfd5b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af161393e576396b3de235f526004601cfd5b5f610e428383612b10565b614e2b81868585612282565b614e50578085848460405163f78c1b5360e01b8152600401613a4a9493929190615a41565b613a6c8585858585604051828482375f388483888a5af161212f573d5f823e3d81fd5b5f5f83601f840112614e83575f5ffd5b5081356001600160401b03811115614e99575f5ffd5b602083019150836020828501011115614517575f5ffd5b5f5f5f60408486031215614ec2575f5ffd5b8335925060208401356001600160401b03811115614ede575f5ffd5b614eea86828701614e73565b9497909650939450505050565b5f60208284031215614f07575f5ffd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f602082015160048110614f7157614f71614f0e565b8060208501525060408201511515604084015260608201516080606085015261254e6080850182614f22565b602081525f610e426020830184614f50565b6001600160a01b0381168114611934575f5ffd5b8015158114611934575f5ffd5b8035610f0b81614fc3565b5f5f5f5f60808587031215614fee575f5ffd5b84359350602085013561500081614faf565b925060408501356001600160e01b03198116811461501c575f5ffd5b9150606085013561502c81614fc3565b939692955090935050565b803560078110610f0b575f5ffd5b5f5f5f60608486031215615057575f5ffd5b83359250602084013561506981614faf565b915061507760408501615037565b90509250925092565b5f8151808452602084019350602083015f5b828110156150b0578151865260209586019590910190600101615092565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561511157605f198786030184526150fc858351614f50565b945060209384019391909101906001016150e0565b505050508281036020840152612ad88185615080565b5f60208284031215615137575f5ffd5b81356001600160c01b0381168114610e42575f5ffd5b5f5f5f6060848603121561515f575f5ffd5b83359250602084013561517181614faf565b9150604084013561518181614faf565b809150509250925092565b5f5f5f5f6080858703121561519f575f5ffd5b8435935060208501356151b181614faf565b92506151bf60408601615037565b9396929550929360600135925050565b5f5f83601f8401126151df575f5ffd5b5081356001600160401b038111156151f5575f5ffd5b6020830191508360208260051b8501011115614517575f5ffd5b5f5f5f60408486031215615221575f5ffd5b83356001600160401b03811115615236575f5ffd5b615242868287016151cf565b909790965060209590950135949350505050565b5f5f5f60608486031215615268575f5ffd5b83359250602084013561527a81614faf565b9150604084013561518181614fc3565b60ff60f81b8816815260e060208201525f6152a860e0830189614f22565b82810360408401526152ba8189614f22565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b8181101561530f5783518352602093840193909201916001016152f1565b50909b9a5050505050505050505050565b602080825282518282018190525f918401906040840190835b8181101561536f57835180516001600160a01b039081168552602091820151168185015290930192604090920191600101615339565b509095945050505050565b5f6020828403121561538a575f5ffd5b8135610e4281614faf565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b03811182821017156153cb576153cb615395565b60405290565b5f82601f8301126153e0575f5ffd5b81356001600160401b038111156153f9576153f9615395565b604051601f8201601f19908116603f011681016001600160401b038111828210171561542757615427615395565b60405281815283820160200185101561543e575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f6020828403121561546a575f5ffd5b81356001600160401b0381111561547f575f5ffd5b820160808185031215615490575f5ffd5b6154986153a9565b813564ffffffffff811681146154ac575f5ffd5b81526020820135600481106154bf575f5ffd5b60208201526154d060408301614fd0565b604082015260608201356001600160401b038111156154ed575f5ffd5b6154f9868285016153d1565b606083015250949350505050565b602080825282518282018190525f918401906040840190835b8181101561536f5783516001600160a01b0316835260209384019390920191600101615520565b5f5f60208385031215615558575f5ffd5b82356001600160401b0381111561556d575f5ffd5b615579858286016151cf565b90969095509350505050565b6007811061559557615595614f0e565b9052565b5f8151808452602084019350602083015f5b828110156150b057815180516001600160a01b031687526020808201515f916155d6908a0182615585565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e090950194602091909101906001016155ab565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561567657605f19878603018452615661858351615599565b94506020938401939190910190600101615645565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b838110156156cf57601f198684030185526156b9838351615080565b602095860195909350919091019060010161569d565b509098975050505050505050565b5f5f602083850312156156ee575f5ffd5b82356001600160401b03811115615703575f5ffd5b61557985828601614e73565b602081525f610e426020830184614f22565b602081525f610e426020830184615599565b602081525f610e426020830184615080565b5f5f5f5f5f60808688031215615759575f5ffd5b85359450602086013593506040860135925060608601356001600160401b03811115615783575f5ffd5b61578f88828901614e73565b969995985093965092949392505050565b5f5f604083850312156157b1575f5ffd5b823591506157c160208401615037565b90509250929050565b5f5f5f5f606085870312156157dd575f5ffd5b8435935060208501356157ef81614faf565b925060408501356001600160401b03811115615809575f5ffd5b61581587828801614e73565b95989497509550505050565b5f60208284031215615831575f5ffd5b8151610e4281614faf565b805160208201516bffffffffffffffffffffffff19811691906014821015611778576bffffffffffffffffffffffff1960149290920360031b82901b161692915050565b634e487b7160e01b5f52601160045260245ffd5b818103818111156111fb576111fb615880565b8381526001600160a01b03831660208201526060810161254e6040830184615585565b634e487b7160e01b5f52603260045260245ffd5b5f600182016158ef576158ef615880565b5060010190565b8481526001600160a01b0384166020820152608081016159196040830185615585565b82606083015295945050505050565b5f60208284031215615938575f5ffd5b8151610e4281614fc3565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f61254e602083018486615943565b5f5f8335601e19843603018112615993575f5ffd5b8301803591506001600160401b038211156159ac575f5ffd5b602001915036819003821315614517575f5ffd5b5f85518060208801845e60d886901b6001600160d81b031916908301908152600485106159ef576159ef614f0e565b60f894851b600582015292151590931b6006830152506007019392505050565b808201808211156111fb576111fb615880565b5f82615a3c57634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f90612d7a908301848661594356fe3232323232323232323232323232323232323232323232323232323232323232def24cb3236edf62937b12ea8dc676927599974e90729c6e9eafa9f05b03eab8a2646970667358221220759c53996dbb15661bd1cb67b53e538892cb59a5f8d34c6b0868879f871e952964736f6c634300081d0033" as const;


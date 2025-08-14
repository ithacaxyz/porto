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

export const code = "0x610140604052604051615c34380380615c34833981016040819052610023916100ea565b306080524660a052606080610075604080518082018252600d81526c125d1a1858d85058d8dbdd5b9d609a1b60208083019190915282518084019093526006835265036392e302e360d41b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610117565b5f602082840312156100fa575f80fd5b81516001600160a01b0381168114610110575f80fd5b9392505050565b60805160a05160c05160e0516101005161012051615aba61017a5f395f8181610742015281816108d3015281816118e001528181611f8401526136f101525f612e6d01525f612f2701525f612f0101525f612eb101525f612e8e0152615aba5ff3fe60806040526004361061025f575f3560e01c80638e87cf4711610143578063cb4774c4116100b5578063e9ae5c5311610079578063e9ae5c531461081b578063f81d87a71461082e578063faba56d81461084d578063fac750e01461086c578063fcd4e70714610880578063ff619c6b146108a857610266565b8063cb4774c414610764578063cebfe33614610785578063d03c7914146107a4578063dcc09ebf146107c3578063e5adda71146107ef57610266565b8063b70e36f011610107578063b70e36f014610693578063b75c7dc6146106b2578063bc2c554a146106d1578063be766d15146106fe578063bf53096914610712578063c885f95a1461073157610266565b80638e87cf47146105ea578063912aa1b8146106165780639e49fbf114610635578063a840fe4914610648578063ad0770831461066757610266565b80632f3f30c7116101dc57806357022451116101a05780635702245114610514578063598daac41461053357806360d2f33d146105525780636fd91454146105855780637656d304146105a457806384b0196e146105c357610266565b80632f3f30c714610482578063350585011461049c5780633e1b0812146104b65780634223b5c2146104d5578063515c9d6d146104f457610266565b806317e69ab81161022357806317e69ab81461039e5780631a912f3e146103cd57806320606b701461040e5780632081a278146104415780632150c5181461046057610266565b80630cef73b41461029f57806311a86fd6146102da57806312aaac7014610319578063136a12f7146103455780631626ba7e1461036657610266565b3661026657005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a028214171561029157806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102aa575f80fd5b506102be6102b9366004614e89565b6108c7565b6040805192151583526020830191909152015b60405180910390f35b3480156102e5575f80fd5b5061030173323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102d1565b348015610324575f80fd5b50610338610333366004614ed0565b610bc8565b6040516102d19190614f76565b348015610350575f80fd5b5061036461035f366004614fb4565b610cb7565b005b348015610371575f80fd5b50610385610380366004614e89565b610de1565b6040516001600160e01b031990911681526020016102d1565b3480156103a9575f80fd5b506103bd6103b8366004614ed0565b610e49565b60405190151581526020016102d1565b3480156103d8575f80fd5b506104007f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102d1565b348015610419575f80fd5b506104007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b34801561044c575f80fd5b5061036461045b36600461501e565b610f10565b34801561046b575f80fd5b5061047461105f565b6040516102d1929190615093565b34801561048d575f80fd5b50610385630707070760e51b81565b3480156104a7575f80fd5b50610385631919191960e11b81565b3480156104c1575f80fd5b506104006104d0366004615100565b6111c9565b3480156104e0575f80fd5b506103386104ef366004614ed0565b611201565b3480156104ff575f80fd5b506104005f80516020615a4583398151915281565b34801561051f575f80fd5b5061036461052e366004615126565b611239565b34801561053e575f80fd5b5061036461054d366004615165565b611326565b34801561055d575f80fd5b506104007f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b348015610590575f80fd5b5061040061059f3660046151e8565b611478565b3480156105af575f80fd5b506103646105be36600461522f565b6115b7565b3480156105ce575f80fd5b506105d7611671565b6040516102d19796959493929190615263565b3480156105f5575f80fd5b50610609610604366004614ed0565b611697565b6040516102d191906152f9565b348015610621575f80fd5b50610364610630366004615353565b61177f565b610364610643366004614ed0565b6118d5565b348015610653575f80fd5b50610400610662366004615433565b611937565b348015610672575f80fd5b50610686610681366004614ed0565b611970565b6040516102d191906154e0565b34801561069e575f80fd5b506103646106ad366004614ed0565b611983565b3480156106bd575f80fd5b506103646106cc366004614ed0565b6119eb565b3480156106dc575f80fd5b506106f06106eb366004615520565b611a40565b6040516102d19291906155f8565b348015610709575f80fd5b50610400611b77565b34801561071d575f80fd5b5061036461072c3660046156b6565b611bcc565b34801561073c575f80fd5b506103017f000000000000000000000000000000000000000000000000000000000000000081565b34801561076f575f80fd5b50610778611c70565b6040516102d191906156e8565b348015610790575f80fd5b5061040061079f366004615433565b611c89565b3480156107af575f80fd5b506103bd6107be366004614ed0565b611cf1565b3480156107ce575f80fd5b506107e26107dd366004614ed0565b611d03565b6040516102d191906156fa565b3480156107fa575f80fd5b5061080e610809366004614ed0565b611ec7565b6040516102d1919061570c565b610364610829366004614e89565b611eda565b348015610839575f80fd5b5061036461084836600461571e565b611f5c565b348015610858575f80fd5b50610400610867366004615779565b612114565b348015610877575f80fd5b5061040061224c565b34801561088b575f80fd5b5061089561c1d081565b60405161ffff90911681526020016102d1565b3480156108b3575f80fd5b506103bd6108c23660046157a3565b61225f565b63060f052a5f908152807f00000000000000000000000000000000000000000000000000000000000000006020826004601c845afa80155f51171561091357639e87fac85f526004601cfd5b5060418414604085141715610944573061092e878787612533565b6001600160a01b03161492505f9150610bc09050565b602184101561095957505f9150819050610bc0565b60201984810185811181871802811895870191820135935090601f19013560ff161561098b57610988876125bb565b96505b505f61099683610bc8565b805190915064ffffffffff1642811090151516156109b8575f93505050610bc0565b5f816020015160038111156109cf576109cf614ee7565b03610a2a575f80603f8711883581029060208a013502915091505f80610a0e856060015180516020820151604090920151603f90911191820292910290565b91509150610a1f8b858585856125d4565b975050505050610bbd565b600181602001516003811115610a4257610a42614ee7565b03610ac757606081810151805160208083015160409384015184518084018e9052855180820385018152601f8d018590049094028101870186529485018b8152603f9490941091820295910293610abe935f92610ab7928e918e918291018382808284375f9201919091525061266d92505050565b8585612751565b95505050610bbd565b600281602001516003811115610adf57610adf614ee7565b03610b0e57610b078160600151806020019051810190610aff91906157fa565b888888612870565b9350610bbd565b600381602001516003811115610b2657610b26614ee7565b03610bbd57806060015151602014610b515760405163145a1fdd60e31b815260040160405180910390fd5b5f8160600151610b6090615815565b60601c9050604051638afc93b48152886020820152846040820152606080820152866080820152868860a08301375f80526084870160205f82601c8501865afa915050638afc93b45f5160e01c14811615610bba57600195505b50505b50505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f82815268448e3efef2f6a7f2f960205260408120610c0890612950565b8051909150610c2a5760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610c3e8383016020015190565b60d881901c855260c881901c915060d01c60ff166003811115610c6357610c63614ee7565b84602001906003811115610c7957610c79614ee7565b90816003811115610c8c57610c8c614ee7565b90525060ff811615156040850152610ca983838151811082025290565b606085015250919392505050565b333014610cd6576040516282b42960e81b815260040160405180910390fd5b8380610cf557604051638707510560e01b815260040160405180910390fd5b5f80516020615a458339815191528514610d3057610d12856129b6565b15610d3057604051630442081560e01b815260040160405180910390fd5b610d3a8484612a1a565b15610d58576040516303a6f8c760e21b815260040160405180910390fd5b610d7b60e084901c606086901b1783610800610d7389612a42565b929190612a91565b50604080518681526001600160a01b03861660208201526001600160e01b031985169181019190915282151560608201527f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e1906080015b60405180910390a15050505050565b5f805f610def8686866108c7565b90925090508115158115151615610e2557610e09816129b6565b80610e225750610e2233610e1c83612aba565b90612ae9565b91505b81610e345763ffffffff610e3a565b631626ba7e5b60e01b925050505b9392505050565b5f333014610e69576040516282b42960e81b815260040160405180910390fd5b5f610ea2610e9e610e9b60017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a61586d565b90565b5c90565b90507f0a9f35b227e9f474cb86caa2e9b62847626fede22333cf52c7abea325d2eaa358114610ecf575f80fd5b610f05610f00610e9b60017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a61586d565b612b93565b60019150505b919050565b333014610f2f576040516282b42960e81b815260040160405180910390fd5b8280610f4e57604051638707510560e01b815260040160405180910390fd5b610f57846129b6565b15610f755760405163f2fee1e160e01b815260040160405180910390fd5b5f610f7f85612a42565b6001600160a01b0385165f908152600282016020526040902060019091019150610fcd846006811115610fb457610fb4614ee7565b8254600160ff9092169190911b80198216845516151590565b15610fed575f610fdc82612b99565b03610fed57610feb8286612bb4565b505b61101c816001015f86600681111561100757611007614ee7565b60ff1681526020019081526020015f205f9055565b7fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a2786868660405161104f93929190615880565b60405180910390a1505050505050565b6060805f61106b61224c565b9050806001600160401b038111156110855761108561536e565b6040519080825280602002602001820160405280156110d457816020015b604080516080810182525f80825260208083018290529282015260608082015282525f199092019101816110a35790505b509250806001600160401b038111156110ef576110ef61536e565b604051908082528060200260200182016040528015611118578160200160208202803683370190505b5091505f805b828110156111be575f61113f8268448e3efef2f6a7f2f65b60020190612ce9565b90505f61114b82610bc8565b805190915064ffffffffff16428110901515161561116a5750506111b6565b8087858151811061117d5761117d6158a3565b60200260200101819052508186858151811061119b5761119b6158a3565b6020908102919091010152836111b0816158b7565b94505050505b60010161111e565b508084528252509091565b6001600160c01b0381165f90815268448e3efef2f6a7f2f76020526040808220549083901b67ffffffffffffffff1916175b92915050565b604080516080810182525f80825260208201819052918101919091526060808201526111fb6103338368448e3efef2f6a7f2f6611136565b333014611258576040516282b42960e81b815260040160405180910390fd5b828061127757604051638707510560e01b815260040160405180910390fd5b5f80516020615a4583398151915284146112b257611294846129b6565b156112b25760405163f2fee1e160e01b815260040160405180910390fd5b5f6112bc85612a42565b60030190506112db8185856001600160a01b0381161515610800612d32565b50604080518681526001600160a01b0380871660208301528516918101919091527f7e2baa9c3a554d7c6587682e28fe9607c29d1d8c8a46968368d5614607c6079990606001610dd2565b333014611345576040516282b42960e81b815260040160405180910390fd5b838061136457604051638707510560e01b815260040160405180910390fd5b61136d856129b6565b1561138b5760405163f2fee1e160e01b815260040160405180910390fd5b5f61139586612a42565b60010190506113a681866040612d5d565b506001600160a01b0385165f90815260018201602052604090206113ec8560068111156113d5576113d5614ee7565b8254600160ff9092169190911b8082178455161590565b505f816001015f87600681111561140557611405614ee7565b60ff1681526020019081526020015f2090505f61142182612d99565b86815290506114308282612de3565b7f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a8989898960405161146594939291906158cf565b60405180910390a1505050505050505050565b5f806114948460408051828152600190920160051b8201905290565b90505f5b84811015611534575f80365f6114af8a8a87612e28565b92965090945092509050611524856115157f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876114f68888612e5a565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b5050505050806001019050611498565b5061c1d060f084901c145f61158e7f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b9050816115a35761159e81612e6b565b6115ac565b6115ac81612f81565b979650505050505050565b3330146115d6576040516282b42960e81b815260040160405180910390fd5b5f83815268448e3efef2f6a7f2f9602052604090205460ff1661160c5760405163395ed8c160e21b815260040160405180910390fd5b611625828261020061161d87612aba565b929190612ff5565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc9983604051611664911515815260200190565b60405180910390a3505050565b600f60f81b6060805f808083611685613010565b97989097965046955030945091925090565b60605f6116a383612a42565b60030190506116b181613054565b6001600160401b038111156116c8576116c861536e565b60405190808252806020026020018201604052801561170c57816020015b604080518082019091525f80825260208201528152602001906001900390816116e65790505b5091505f5b825181101561177857611724828261305e565b848381518110611736576117366158a3565b60200260200101515f01858481518110611752576117526158a3565b6020908102919091018101516001600160a01b0393841691015291169052600101611711565b5050919050565b33301461179e576040516282b42960e81b815260040160405180910390fd5b6001600160a01b0381166117c557604051634adebaa360e11b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c525190555f611800613010565b915061185c90507f0a9f35b227e9f474cb86caa2e9b62847626fede22333cf52c7abea325d2eaa35611856610e9b60017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a61586d565b90613098565b306317e69ab861186b8361309f565b6040518263ffffffff1660e01b815260040161188991815260200190565b6020604051808303815f875af11580156118a5573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906118c99190615901565b6118d1575f80fd5b5050565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461191d576040516282b42960e81b815260040160405180910390fd5b61193468448e3efef2f6a7f2f65b600101826130c7565b50565b5f6111fb8260200151600381111561195157611951614ee7565b60ff168360600151805190602001205f1c5f9182526020526040902090565b60606111fb61197e83612aba565b6130de565b3330146119a2576040516282b42960e81b815260040160405180910390fd5b6119b568448e3efef2f6a7f2f7826131b2565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b333014611a0a576040516282b42960e81b815260040160405180910390fd5b611a138161321c565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b03811115611a5c57611a5c61536e565b604051908082528060200260200182016040528015611a8f57816020015b6060815260200190600190039081611a7a5790505b509250806001600160401b03811115611aaa57611aaa61536e565b604051908082528060200260200182016040528015611add57816020015b6060815260200190600190039081611ac85790505b5091505f5b81811015611b6e57611b0b868683818110611aff57611aff6158a3565b90506020020135611d03565b848281518110611b1d57611b1d6158a3565b6020026020010181905250611b49868683818110611b3d57611b3d6158a3565b90506020020135611ec7565b838281518110611b5b57611b5b6158a3565b6020908102919091010152600101611ae2565b50509250929050565b5f80611ba5611b9460015f80516020615a6583398151915261586d565b604080516020810190915290815290565b9050611bb081515c90565b5f03611bbd57505f919050565b611bc681613287565b91505090565b333014611beb576040516282b42960e81b815260040160405180910390fd5b611c3382828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250611c2d9250612943915050565b906132a7565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611c64929190615944565b60405180910390a15050565b6060611c8468448e3efef2f6a7f2f6612950565b905090565b5f333014611ca9576040516282b42960e81b815260040160405180910390fd5b611cb2826132ff565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611ce49190614f76565b60405180910390a2919050565b5f611cfb826133a1565b151592915050565b60605f611d0f83612a42565b6001019050611d2a6040518060200160405280606081525090565b5f611d34836133ea565b90505f5b81811015611ebd575f611d4b858361343b565b6001600160a01b0381165f9081526001870160205260408120919250611d7082613494565b90505f5b8151811015611eae575f828281518110611d9057611d906158a3565b602002602001015190505f611db9856001015f8460ff1681526020019081526020015f20612d99565b9050611df66040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166006811115611e0b57611e0b614ee7565b81602001906006811115611e2157611e21614ee7565b90816006811115611e3457611e34614ee7565b9052506001600160a01b03871681528151604080830191909152820151608082015260208201516060820152611e794260ff8516600681111561086757610867614ee7565b60c08201819052608082015160608301519111150260a082015280611e9e8b826134ed565b5050505050806001019050611d74565b50505050806001019050611d38565b5050519392505050565b60606111fb611ed583612a42565b613596565b5f611ee4846133a1565b905080600303611eff57611ef984848461364f565b50505050565b365f365f84611f1557637f1812755f526004601cfd5b5085358087016020810194503592505f90604011600286141115611f43575050602080860135860190810190355b611f52888888878787876136e7565b5050505050505050565b813580830190604081901c602084101715611f75575f80fd5b50611fea336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611fe130611fb66020860186615353565b6001600160a01b03161430611fd16080870160608801615353565b6001600160a01b03161417151590565b15159015151690565b612006576040516282b42960e81b815260040160405180910390fd5b306120176080830160608401615353565b6001600160a01b031603612074575f80612039866102b9610280860186615957565b975091508690506001600160c01b0332311061205457600191505b81612071576040516282b42960e81b815260040160405180910390fd5b50505b61209f61208760a0830160808401615353565b61209961026084016102408501615353565b886138ff565b8415806120b057506120b0856129b6565b61210c575f6120be86612a42565b60018101915061210a906002015f6120dc60a0860160808701615353565b6001600160a01b0316815260208101919091526040015f2061210460a0850160808601615353565b89613927565b505b505050505050565b5f8082600681111561212857612128614ee7565b0361213b57603c808404025b90506111fb565b600182600681111561214f5761214f614ee7565b0361216057610e1080840402612134565b600282600681111561217457612174614ee7565b03612186576201518080840402612134565b600382600681111561219a5761219a614ee7565b036121c0576007600362015180808604918201929092069003620545ff85110202612134565b5f806121cb85613a4c565b50909250905060048460068111156121e5576121e5614ee7565b036121ff576121f682826001613af6565b925050506111fb565b600584600681111561221357612213614ee7565b03612224576121f682600180613af6565b600684600681111561223857612238614ee7565b03612248576001925050506111fb565b5f80fd5b5f611c8468448e3efef2f6a7f2f8613b4d565b5f8461226d5750600161252b565b612276856129b6565b156122835750600161252b565b631919191960e11b60048310612297575082355b826122a65750630707070760e51b5b6122b08582612a1a565b156122be575f91505061252b565b5f6122c887612a42565b90506122d381613b4d565b15612390576122ee60e083901c606088901b175b8290613b99565b156122fe5760019250505061252b565b6123116332323232606088901b176122e7565b156123215760019250505061252b565b61234760e083901c73191919191919191919191919191919191919191960611b176122e7565b156123575760019250505061252b565b6123807f32323232323232323232323232323232323232320000000000000000323232326122e7565b156123905760019250505061252b565b6123a65f80516020615a45833981519152612a42565b90506123b181613b4d565b1561246b576123c960e083901c606088901b176122e7565b156123d95760019250505061252b565b6123ec6332323232606088901b176122e7565b156123fc5760019250505061252b565b61242260e083901c73191919191919191919191919191919191919191960611b176122e7565b156124325760019250505061252b565b61245b7f32323232323232323232323232323232323232320000000000000000323232326122e7565b1561246b5760019250505061252b565b612479878888898989613c1d565b156124895760019250505061252b565b6124ab8788733232323232323232323232323232323232323232898989613c1d565b156124bb5760019250505061252b565b6124d65f80516020615a458339815191528888808989613c1d565b156124e65760019250505061252b565b6125155f80516020615a4583398151915288733232323232323232323232323232323232323232898989613c1d565b156125255760019250505061252b565b5f925050505b949350505050565b5f604051826040811461254e576041811461257557506125a6565b60208581013560ff81901c601b0190915285356040526001600160ff1b0316606052612586565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d6125b3575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d610f0b57fe5b5f6040518681528560208201528460408201528360608201528260808201525f805260205f60a0836101005afa503d612638576d1ab2e8006fd8b71907bf06a5bdee3b6126385760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa61263857fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6040805160c0810182526060808252602082018190525f92820183905281018290526080810182905260a0810191909152815160c0811061274b5760208301818101818251018281108260c083011117156126ca5750505061274b565b80815101925080602082015101818110838211178285108486111717156126f4575050505061274b565b8281516020830101118385516020870101111715612715575050505061274b565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f805f61276088600180613ccb565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561284457602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061284457fe5b5050508215612865576128628287608001518860a0015188886125d4565b92505b505095945050505050565b5f6001600160a01b0385161561252b57604051853b6129005782604081146128a057604181146128c7575061293a565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526128d8565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f6060528060405261293a565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b68448e3efef2f6a7f2f690565b60405181546020820190600881901c5f8260ff84171461297e57505080825260ff8116601f808211156129a0575b855f5260205f205b8160051c8101548286015260208201915082821061298657505b508084525f920191825250602001604052919050565b5f81815268448e3efef2f6a7f2f960205260408120805460ff808216908114801590910260089290921c021780612a005760405163395ed8c160e21b815260040160405180910390fd5b612a0d825f198301613dbc565b60ff161515949350505050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f80516020615a458339815191528314612a6657612a6183613e29565b612a75565b5f80516020615a458339815191525b68b11ddb8fabd886bebb6009525f908152602990209392505050565b5f82612aa657612aa18585613e56565b612ab1565b612ab1858584613f54565b95945050505050565b5f81815268448e3efef2f6a7f2fa602052604081208054601f5263d4203f8b6004528152603f81208190610e42565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612b245763f5a267f15f526004601cfd5b82612b365768fbb67fda52d4bfb8bf92505b80546001600160601b038116612b7a5760019250838160601c0315612b8b57600182015460601c8414612b8b57600282015460601c8414612b8b575b5f9250612b8b565b81602052835f5260405f2054151592505b505092915050565b5f815d50565b5f81545b801561274b57600191820191811901811618612b9d565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612bef5763f5a267f15f526004601cfd5b82612c015768fbb67fda52d4bfb8bf92505b80546001600160601b03811680612c7b5760019350848260601c03612c395760018301805484556002840180549091555f9055612ce0565b84600184015460601c03612c5a5760028301805460018501555f9055612ce0565b84600284015460601c03612c73575f6002840155612ce0565b5f9350612ce0565b82602052845f5260405f20805480612c94575050612ce0565b60018360011c039250826001820314612cc4578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612d1383613b4d565b82106111fb57604051634e23d03560e01b815260040160405180910390fd5b5f82612d4757612d428686613f71565b612d53565b612d5386868685613fa2565b9695505050505050565b5f612d688484613fdd565b90508015610e425781612d7a856133ea565b1115610e425760405163155176b960e11b815260040160405180910390fd5b612dba60405180606001604052805f81526020015f81526020015f81525090565b5f612dc483612950565b905080515f1461274b575f612dd882614138565b602001949350505050565b604080518251602080830191909152830151818301529082015160608201526118d1908390612e2390608001604051602081830303815290604052614284565b6132a7565b60051b82013590910180356001600160a01b031680153002179260208083013593506040830135909201918201913590565b5f8183604051375060405120919050565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f0000000000000000000000000000000000000000000000000000000000000000461416612f5e5750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f805f612f8c613010565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b5f8261300557612aa18585612bb4565b612ab1858584612d5d565b604080518082018252600d81526c125d1a1858d85058d8dbdd5b9d609a1b60208083019190915282518084019093526006835265036392e302e360d41b9083015291565b5f6111fb826133ea565b5f80600184018161306f868661343b565b6001600160a01b038082168352602083019390935260409091015f205490969116945092505050565b80825d5050565b8051602181106130b65763ec92f9a35f526004601cfd5b9081015160209190910360031b1b90565b5f806130d384846144b1565b600101905550505050565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c925083831415830281528161316c57821561316757600191508185015460601c92508215613167578284141590920260208301525060028381015460601c918215613167576003915083831415830260408201525b61319c565b600191821c915b8281101561319a578581015460601c858114158102600583901b8401529350600101613173565b505b8186528160051b81016040525050505050919050565b604081811c5f90815260208490522080546001600160401b03831610156131ec576040516312ee5c9360e01b815260040160405180910390fd5b613216613210836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f81815268448e3efef2f6a7f2f96020908152604080832083905568448e3efef2f6a7f2fa90915290208054600101905568448e3efef2f6a7f2f661326a68448e3efef2f6a7f2f883613e56565b6118d15760405163395ed8c160e21b815260040160405180910390fd5b80515f90805c8061329f5763bc7ec7795f526004601cfd5b015c92915050565b80518060081b60ff175f60fe83116132d0575050601f8281015160081b821790808311156132f7575b60208401855f5260205f205b828201518360051c8201556020830192508483106132dc5750505b509092555050565b5f8160400151156133345761331782602001516144f7565b613334576040516321b9b33960e21b815260040160405180910390fd5b61333d82611937565b90505f68448e3efef2f6a7f2f66060840151845160208087015160408089015190519596506133949561337295949301615999565b60408051601f198184030181529181525f8581526003850160205220906132a7565b6117786002820183614513565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c1517613433576001935083830154156134335760029350838301541561343357600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf8214158202915061346e846133ea565b831061348d57604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b80156134d75761ffff81166134bc576010918201911c6134a1565b8183526020600582901b16909201916001918201911c6134a1565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c5536020840351818106158282040290508083106135855782811781018115826020018701604051181761355157828102601f198701528501602001604052613585565b602060405101816020018101604052808a52601f19855b888101518382015281018061356857509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf90602084018161360f57835480156136095780841415028152600184810154909250801561360957808414150260208201526002848101549092508015613609576003925083811415810260408301525b5061363a565b8160011c91505f5b8281101561363857848101548481141502600582901b830152600101613617565b505b8185528160051b810160405250505050919050565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c171561369457633995943b5f526004601cfd5b505f5b83811461210a57365f8260051b850135808601602081019350803592505084828401118160401c17156136d157633995943b5f526004601cfd5b506136dd898383611eda565b5050600101613697565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001633036137ad57602081146137385760405163438e981560e11b815260040160405180910390fd5b604080516020810190915282359061376d9082908061376560015f80516020615a6583398151915261586d565b905290614625565b61377885858361463f565b60408051602081019091526137a790806137a060015f80516020615a6583398151915261586d565b9052614aa8565b5061210a565b806137e1573330146137d1576040516282b42960e81b815260040160405180910390fd5b6137dc84845f61463f565b61210a565b60208110156138035760405163438e981560e11b815260040160405180910390fd5b813561381768448e3efef2f6a7f2f661192b565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f8061387461385a888886611478565b6020808710818818021880880190808803908811026108c7565b9150915081613895576040516282b42960e81b815260040160405180910390fd5b6138c081604051806020016040528060015f80516020615a658339815191525f1c613765919061586d565b6138cb87878361463f565b60408051602081019091526138f390806137a060015f80516020615a6583398151915261586d565b50505050505050505050565b6001600160a01b03831661391c576139178282614ac9565b505050565b613917838383614ae2565b8061393157505050565b5f61393b84613494565b905080515f0361395e57604051635ee7e5b160e01b815260040160405180910390fd5b5f5b8151811015613a45575f82828151811061397c5761397c6158a3565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f6139a982612d99565b90505f6139c5428560ff16600681111561086757610867614ee7565b905080826040015110156139e157604082018190525f60208301525b815f015187836020018181516139f791906159e8565b9150818152501115613a2c5760405163482a648960e11b81526001600160a01b03891660048201526024015b60405180910390fd5b613a368383612de3565b50505050806001019050613960565b5050505050565b5f8080613ae9613a5f62015180866159fb565b5f805f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c9250806117785781545f9350156117785760019250828201541561177857600292508282015415611778575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613bc65763f5a267f15f526004601cfd5b82613bd85768fbb67fda52d4bfb8bf92505b801954613c0957805460019250831461348d576001810154831461348d576002810154831461348d575f915061348d565b602052505f90815260409020541515919050565b5f805f613c3687613c2d8b612a42565b60030190614b2c565b915091508115613cbd576040516001629e639560e01b031981526001600160a01b0382169063ff619c6b90613c75908b908a908a908a90600401615a1a565b602060405180830381865afa158015613c90573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190613cb49190615901565b92505050612d53565b505f98975050505050505050565b6060835180156125b3576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613d46579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f82548060ff821714613e0457601e8311613ddb5780831a915061348d565b8060ff168311613dff57835f52601f83038060051c60205f200154601f82161a9250505b61348d565b8060081c831161348d57835f528260051c60205f200154601f84161a91505092915050565b5f81815268448e3efef2f6a7f2fa602052604081208054601f5263d4203f8b6004528152603f81206111fb565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613e835763f5a267f15f526004601cfd5b82613e955768fbb67fda52d4bfb8bf92505b80195480613ef6576001925083825403613ec25760018201805483556002830180549091555f9055612b8b565b83600183015403613ee05760028201805460018401555f9055612b8b565b83600283015403612b72575f6002830155612b8b565b81602052835f5260405f20805480613f0f575050612b8b565b60018360011c039250826001820314613f3957828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f613f5f8484614513565b90508015610e425781612d7a85613b4d565b6001600160a01b0381165f908152600183016020526040812080546001600160a01b0319169055610e428383612bb4565b6001600160a01b038381165f908152600186016020526040812080546001600160a01b03191692851692909217909155612ab1858584612d5d565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016140185763f5a267f15f526004601cfd5b8261402a5768fbb67fda52d4bfb8bf92505b80546001600160601b03811682602052806140ec578160601c80614058578560601b84556001945050612ce0565b8581036140655750612ce0565b600184015460601c80614086578660601b6001860155600195505050612ce0565b868103614094575050612ce0565b600285015460601c806140b6578760601b600287015560019650505050612ce0565b8781036140c557505050612ce0565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f20805461412e57600191821c80830182559194508161411a578560601b600317845550612ce0565b8560601b8285015582600201845550612ce0565b5050505092915050565b6060815115610f0b576040519050600482018051835184602001017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f6020850183198552866020015b8051805f1a6141d957600190811a01608081116141b95760028201915080368437918201918482106141b35750614266565b50614181565b5f198352918201607f190191600291909101908482106141b35750614266565b80835283811684011783171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f8601f6f8421084210842108cc6318c6db6d54be660204081020408185821060071b86811c6001600160401b031060061b1795861c0260181a1c161a90911860031c019182019101838110614181578381111561426657838103820391505b509290935250601f198382030183525f815260200160405250919050565b60606142dc565b6fffffffffffffffffffffffffffffffff811160071b81811c6001600160401b031060061b1781811c63ffffffff1060051b1781811c61ffff1060041b1790811c60ff1060039190911c17601f1890565b50604051815182017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f60208301845b83811461448d57600101805160ff1680614395575b6020820151806143645782860360208181189082110218607f839003818111818318021893840193928301929050601f811161435d575050614385565b5050614320565b61436d8161428b565b90508286038181118183180218928301929190910190505b60f01b825260029091019061430b565b60ff81036143e8576020808301511980156143b6576143b38161428b565b91505b508286038181118282180218601f81811890821102186080811760f01b855260029094019392909201915061430b9050565b80835350602081015160018381018290528482168501821791198581168601179190911684171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f86f8421084210842108cc6318c6db6d54be660204081020408184821060071b85811c6001600160401b031060061b1794851c0260181a1c601f161a90911860031c01828603818111918118919091021892830101910161430b565b50600484018051199052601f198482030184525f8152602001604052509092915050565b604081811c5f90815260208490522080546001600160401b038084168214908210166144f057604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f8082600381111561450b5761450b614ee7565b141592915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036145405763f5a267f15f526004601cfd5b826145525768fbb67fda52d4bfb8bf92505b80195481602052806145f657815480614572578483556001935050612b8b565b84810361457f5750612b8b565b60018301548061459a57856001850155600194505050612b8b565b8581036145a8575050612b8b565b6002840154806145c45786600286015560019550505050612b8b565b8681036145d357505050612b8b565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f208054612ce057600191821c8381018690558083019182905590821b8217831955909250612b8b565b5f825f015190506001815c01828183015d80825d50505050565b8015806146505750614650816129b6565b1561466057613917838383614b66565b5f61466a82612a42565b60010190506146d86040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f6146e2836133ea565b90505f5b81811015614734575f6146f9858361343b565b90506001600160a01b0381161561472b5760408401516147199082614bb0565b506060840151614729905f6134ed565b505b506001016146e6565b505f805b868110156148c5575f80365f61474f8c8c87612e28565b9350935093509350825f1461476b5761476883876159e8565b95505b600481101561477d57505050506148bd565b813560e01c63a9059cbb8190036147b357604089015161479d9086614bb0565b506147b1602484013560608b015190614bcf565b505b8063ffffffff1663095ea7b30361481b5760248301355f036147d95750505050506148bd565b88516147e59086614bb0565b506147f9600484013560208b015190614bcf565b5060408901516148099086614bb0565b506060890151614819905f6134ed565b505b8063ffffffff166387517c45036148b7576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba3146148555750505050506148bd565b60448301355f0361486a5750505050506148bd565b61487d600484013560808b015190614bcf565b50614891602484013560a08b015190614bcf565b506148a5600484013560408b015190614bcf565b5060608901516148b5905f6134ed565b505b50505050505b600101614738565b506040830151516060840151516148dc9190614be5565b5f61490f6148ed8560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b6040850151515181101561495b57604085015151600582901b01602001516149518261493f8330614d28565b85919060059190911b82016020015290565b5050600101614913565b50614967888888614b66565b5f80805260018601602052604081206149809184613927565b5f5b60408501515151811015614a0e57604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b018352939093206060890151518301820151928601909101519091614a0491839185916149ff91906149f4906149eb8930614d28565b80821191030290565b808218908210021890565b613927565b5050600101614982565b505f5b84515151811015614a5357845151600582901b0160200151614a4a81614a44848960200151614d1890919063ffffffff16565b5f614d52565b50600101614a11565b505f5b60808501515151811015614a9d57608085015151600582901b0160200151614a9481614a8f848960a00151614d1890919063ffffffff16565b614d92565b50600101614a56565b505050505050505050565b8051805c80614abe5763bc7ec7795f526004601cfd5b60018103825d505050565b5f385f3884865af16118d15763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416614b2257803d853b151710614b22576390b8ec185f526004601cfd5b505f603452505050565b6001600160a01b038181165f90815260018401602052604081205490911680151580614b5d5750614b5d8484614ded565b91509250929050565b5f82614b725750505050565b5f80365f614b81888887612e28565b9350935093509350614b96848484848a614df8565b50505050838390508160010191508103614b725750505050565b604080516060815290819052610e4283836001600160a01b03166134ed565b604080516060815290819052610e4283836134ed565b614c72565b805181602083015b8281511015614c1e57805160209290920180518252918252614c1e868301878301805182519091529052565b602001848110614bf257508251815184528152614c45858201868501805182519091529052565b808360400111614c5a57614c5a858285614bea565b838160600111613a4557613a45858560208401614bea565b805180835114614c8e57634e487b715f5260326020526024601cfd5b6002811061391757828203602084018260051b8101614cae838284614bea565b82820151604087015b8051845114614cd35781858501525f9150602084019350805184525b8085015191820191821015614cf457634e487b715f5260116020526024601cfd5b602081019050828103614cb757509282019290925284900360051c93849052505052565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f511416614b2257803d853b151710614b2257633e3f8f735f526004601cfd5b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af1613917576396b3de235f526004601cfd5b5f610e428383612ae9565b614e048186858561225f565b614e29578085848460405163f78c1b5360e01b8152600401613a239493929190615a1a565b613a458585858585604051828482375f388483888a5af161210c573d5f823e3d81fd5b5f8083601f840112614e5c575f80fd5b5081356001600160401b03811115614e72575f80fd5b6020830191508360208285010111156144f0575f80fd5b5f805f60408486031215614e9b575f80fd5b8335925060208401356001600160401b03811115614eb7575f80fd5b614ec386828701614e4c565b9497909650939450505050565b5f60208284031215614ee0575f80fd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f602082015160048110614f4a57614f4a614ee7565b8060208501525060408201511515604084015260608201516080606085015261252b6080850182614efb565b602081525f610e426020830184614f29565b6001600160a01b0381168114611934575f80fd5b8015158114611934575f80fd5b8035610f0b81614f9c565b5f805f8060808587031215614fc7575f80fd5b843593506020850135614fd981614f88565b925060408501356001600160e01b031981168114614ff5575f80fd5b9150606085013561500581614f9c565b939692955090935050565b803560078110610f0b575f80fd5b5f805f60608486031215615030575f80fd5b83359250602084013561504281614f88565b915061505060408501615010565b90509250925092565b5f8151808452602084019350602083015f5b8281101561508957815186526020958601959091019060010161506b565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b828110156150ea57605f198786030184526150d5858351614f29565b945060209384019391909101906001016150b9565b505050508281036020840152612ab18185615059565b5f60208284031215615110575f80fd5b81356001600160c01b0381168114610e42575f80fd5b5f805f60608486031215615138575f80fd5b83359250602084013561514a81614f88565b9150604084013561515a81614f88565b809150509250925092565b5f805f8060808587031215615178575f80fd5b84359350602085013561518a81614f88565b925061519860408601615010565b9396929550929360600135925050565b5f8083601f8401126151b8575f80fd5b5081356001600160401b038111156151ce575f80fd5b6020830191508360208260051b85010111156144f0575f80fd5b5f805f604084860312156151fa575f80fd5b83356001600160401b0381111561520f575f80fd5b61521b868287016151a8565b909790965060209590950135949350505050565b5f805f60608486031215615241575f80fd5b83359250602084013561525381614f88565b9150604084013561515a81614f9c565b60ff60f81b8816815260e060208201525f61528160e0830189614efb565b82810360408401526152938189614efb565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b818110156152e85783518352602093840193909201916001016152ca565b50909b9a5050505050505050505050565b602080825282518282018190525f918401906040840190835b8181101561534857835180516001600160a01b039081168552602091820151168185015290930192604090920191600101615312565b509095945050505050565b5f60208284031215615363575f80fd5b8135610e4281614f88565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b03811182821017156153a4576153a461536e565b60405290565b5f82601f8301126153b9575f80fd5b81356001600160401b038111156153d2576153d261536e565b604051601f8201601f19908116603f011681016001600160401b03811182821017156154005761540061536e565b604052818152838201602001851015615417575f80fd5b816020850160208301375f918101602001919091529392505050565b5f60208284031215615443575f80fd5b81356001600160401b03811115615458575f80fd5b820160808185031215615469575f80fd5b615471615382565b813564ffffffffff81168114615485575f80fd5b8152602082013560048110615498575f80fd5b60208201526154a960408301614fa9565b604082015260608201356001600160401b038111156154c6575f80fd5b6154d2868285016153aa565b606083015250949350505050565b602080825282518282018190525f918401906040840190835b818110156153485783516001600160a01b03168352602093840193909201916001016154f9565b5f8060208385031215615531575f80fd5b82356001600160401b03811115615546575f80fd5b615552858286016151a8565b90969095509350505050565b6007811061556e5761556e614ee7565b9052565b5f8151808452602084019350602083015f5b8281101561508957815180516001600160a01b031687526020808201515f916155af908a018261555e565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e09095019460209190910190600101615584565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561564f57605f1987860301845261563a858351615572565b9450602093840193919091019060010161561e565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b838110156156a857601f19868403018552615692838351615059565b6020958601959093509190910190600101615676565b509098975050505050505050565b5f80602083850312156156c7575f80fd5b82356001600160401b038111156156dc575f80fd5b61555285828601614e4c565b602081525f610e426020830184614efb565b602081525f610e426020830184615572565b602081525f610e426020830184615059565b5f805f805f60808688031215615732575f80fd5b85359450602086013593506040860135925060608601356001600160401b0381111561575c575f80fd5b61576888828901614e4c565b969995985093965092949392505050565b5f806040838503121561578a575f80fd5b8235915061579a60208401615010565b90509250929050565b5f805f80606085870312156157b6575f80fd5b8435935060208501356157c881614f88565b925060408501356001600160401b038111156157e2575f80fd5b6157ee87828801614e4c565b95989497509550505050565b5f6020828403121561580a575f80fd5b8151610e4281614f88565b805160208201516bffffffffffffffffffffffff19811691906014821015611778576bffffffffffffffffffffffff1960149290920360031b82901b161692915050565b634e487b7160e01b5f52601160045260245ffd5b818103818111156111fb576111fb615859565b8381526001600160a01b03831660208201526060810161252b604083018461555e565b634e487b7160e01b5f52603260045260245ffd5b5f600182016158c8576158c8615859565b5060010190565b8481526001600160a01b0384166020820152608081016158f2604083018561555e565b82606083015295945050505050565b5f60208284031215615911575f80fd5b8151610e4281614f9c565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f61252b60208301848661591c565b5f808335601e1984360301811261596c575f80fd5b8301803591506001600160401b03821115615985575f80fd5b6020019150368190038213156144f0575f80fd5b5f85518060208801845e60d886901b6001600160d81b031916908301908152600485106159c8576159c8614ee7565b60f894851b600582015292151590931b6006830152506007019392505050565b808201808211156111fb576111fb615859565b5f82615a1557634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f90612d53908301848661591c56fe3232323232323232323232323232323232323232323232323232323232323232def24cb3236edf62937b12ea8dc676927599974e90729c6e9eafa9f05b03eab8a2646970667358221220d3f1dc0884edc0f2fc36a94d8e83f4e801084f55f528b3a78e186a99311875d964736f6c634300081a0033" as const;


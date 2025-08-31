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
    "name": "SIGN_TYPEHASH",
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

export const code = "0x610140604052604051615d53380380615d53833981016040819052610023916100ea565b306080524660a052606080610075604080518082018252600d81526c125d1a1858d85058d8dbdd5b9d609a1b60208083019190915282518084019093526006835265036392e302e360d41b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610117565b5f602082840312156100fa575f5ffd5b81516001600160a01b0381168114610110575f5ffd5b9392505050565b60805160a05160c05160e0516101005161012051615bd961017a5f395f8181610780015281816109110152818161199b0152818161203f01526137b001525f612f2c01525f612fe601525f612fc001525f612f7001525f612f4d0152615bd95ff3fe60806040526004361061026a575f3560e01c80638e87cf4711610143578063cb4774c4116100b5578063e9ae5c5311610079578063e9ae5c5314610859578063f81d87a71461086c578063faba56d81461088b578063fac750e0146108aa578063fcd4e707146108be578063ff619c6b146108e657610271565b8063cb4774c4146107a2578063cebfe336146107c3578063d03c7914146107e2578063dcc09ebf14610801578063e5adda711461082d57610271565b8063b70e36f011610107578063b70e36f0146106d1578063b75c7dc6146106f0578063bc2c554a1461070f578063be766d151461073c578063bf53096914610750578063c885f95a1461076f57610271565b80638e87cf4714610628578063912aa1b8146106545780639e49fbf114610673578063a840fe4914610686578063ad077083146106a557610271565b80632f3f30c7116101dc57806357022451116101a05780635702245114610552578063598daac41461057157806360d2f33d146105905780636fd91454146105c35780637656d304146105e257806384b0196e1461060157610271565b80632f3f30c7146104c057806335058501146104da5780633e1b0812146104f45780634223b5c214610513578063515c9d6d1461053257610271565b806317e69ab81161022e57806317e69ab8146103a95780631a912f3e146103d857806320606b70146104195780632081a2781461044c5780632150c5181461046b5780632f1d14cb1461048d57610271565b80630cef73b4146102aa57806311a86fd6146102e557806312aaac7014610324578063136a12f7146103505780631626ba7e1461037157610271565b3661027157005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a028214171561029c57806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102b5575f5ffd5b506102c96102c4366004614fa8565b610905565b6040805192151583526020830191909152015b60405180910390f35b3480156102f0575f5ffd5b5061030c73323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102dc565b34801561032f575f5ffd5b5061034361033e366004614fef565b610c06565b6040516102dc9190615095565b34801561035b575f5ffd5b5061036f61036a3660046150d3565b610cf5565b005b34801561037c575f5ffd5b5061039061038b366004614fa8565b610e1f565b6040516001600160e01b031990911681526020016102dc565b3480156103b4575f5ffd5b506103c86103c3366004614fef565b610f04565b60405190151581526020016102dc565b3480156103e3575f5ffd5b5061040b7f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102dc565b348015610424575f5ffd5b5061040b7f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b348015610457575f5ffd5b5061036f61046636600461513d565b610fcb565b348015610476575f5ffd5b5061047f61111a565b6040516102dc9291906151b2565b348015610498575f5ffd5b5061040b7feff7fda3af271797e53f62724a17c2e5c118cf95ac65e8274759fcfff97bf1fe81565b3480156104cb575f5ffd5b50610390630707070760e51b81565b3480156104e5575f5ffd5b50610390631919191960e11b81565b3480156104ff575f5ffd5b5061040b61050e36600461521f565b611284565b34801561051e575f5ffd5b5061034361052d366004614fef565b6112bc565b34801561053d575f5ffd5b5061040b5f516020615b645f395f51905f5281565b34801561055d575f5ffd5b5061036f61056c366004615245565b6112f4565b34801561057c575f5ffd5b5061036f61058b366004615284565b6113e1565b34801561059b575f5ffd5b5061040b7f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b3480156105ce575f5ffd5b5061040b6105dd366004615307565b611533565b3480156105ed575f5ffd5b5061036f6105fc36600461534e565b611672565b34801561060c575f5ffd5b5061061561172c565b6040516102dc9796959493929190615382565b348015610633575f5ffd5b50610647610642366004614fef565b611752565b6040516102dc9190615418565b34801561065f575f5ffd5b5061036f61066e366004615472565b61183a565b61036f610681366004614fef565b611990565b348015610691575f5ffd5b5061040b6106a0366004615552565b6119f2565b3480156106b0575f5ffd5b506106c46106bf366004614fef565b611a2b565b6040516102dc91906155ff565b3480156106dc575f5ffd5b5061036f6106eb366004614fef565b611a3e565b3480156106fb575f5ffd5b5061036f61070a366004614fef565b611aa6565b34801561071a575f5ffd5b5061072e61072936600461563f565b611afb565b6040516102dc929190615717565b348015610747575f5ffd5b5061040b611c32565b34801561075b575f5ffd5b5061036f61076a3660046157d5565b611c87565b34801561077a575f5ffd5b5061030c7f000000000000000000000000000000000000000000000000000000000000000081565b3480156107ad575f5ffd5b506107b6611d2b565b6040516102dc9190615807565b3480156107ce575f5ffd5b5061040b6107dd366004615552565b611d44565b3480156107ed575f5ffd5b506103c86107fc366004614fef565b611dac565b34801561080c575f5ffd5b5061082061081b366004614fef565b611dbe565b6040516102dc9190615819565b348015610838575f5ffd5b5061084c610847366004614fef565b611f82565b6040516102dc919061582b565b61036f610867366004614fa8565b611f95565b348015610877575f5ffd5b5061036f61088636600461583d565b612017565b348015610896575f5ffd5b5061040b6108a5366004615898565b6121cf565b3480156108b5575f5ffd5b5061040b612307565b3480156108c9575f5ffd5b506108d361c1d081565b60405161ffff90911681526020016102dc565b3480156108f1575f5ffd5b506103c86109003660046158c2565b61231a565b63060f052a5f908152807f00000000000000000000000000000000000000000000000000000000000000006020826004601c845afa80155f51171561095157639e87fac85f526004601cfd5b5060418414604085141715610982573061096c8787876125ee565b6001600160a01b03161492505f9150610bfe9050565b602184101561099757505f9150819050610bfe565b60201984810185811181871802811895870191820135935090601f19013560ff16156109c9576109c687612676565b96505b505f6109d483610c06565b805190915064ffffffffff1642811090151516156109f6575f93505050610bfe565b5f81602001516003811115610a0d57610a0d615006565b03610a68575f80603f8711883581029060208a013502915091505f5f610a4c856060015180516020820151604090920151603f90911191820292910290565b91509150610a5d8b8585858561268f565b975050505050610bfb565b600181602001516003811115610a8057610a80615006565b03610b0557606081810151805160208083015160409384015184518084018e9052855180820385018152601f8d018590049094028101870186529485018b8152603f9490941091820295910293610afc935f92610af5928e918e918291018382808284375f9201919091525061272892505050565b8585612810565b95505050610bfb565b600281602001516003811115610b1d57610b1d615006565b03610b4c57610b458160600151806020019051810190610b3d9190615919565b88888861292f565b9350610bfb565b600381602001516003811115610b6457610b64615006565b03610bfb57806060015151602014610b8f5760405163145a1fdd60e31b815260040160405180910390fd5b5f8160600151610b9e90615934565b60601c9050604051638afc93b48152886020820152846040820152606080820152866080820152868860a08301375f5f526084870160205f82601c8501865afa915050638afc93b45f5160e01c14811615610bf857600195505b50505b50505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f82815268448e3efef2f6a7f2f960205260408120610c4690612a0f565b8051909150610c685760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610c7c8383016020015190565b60d881901c855260c881901c915060d01c60ff166003811115610ca157610ca1615006565b84602001906003811115610cb757610cb7615006565b90816003811115610cca57610cca615006565b90525060ff811615156040850152610ce783838151811082025290565b606085015250919392505050565b333014610d14576040516282b42960e81b815260040160405180910390fd5b8380610d3357604051638707510560e01b815260040160405180910390fd5b5f516020615b645f395f51905f528514610d6e57610d5085612a75565b15610d6e57604051630442081560e01b815260040160405180910390fd5b610d788484612ad9565b15610d96576040516303a6f8c760e21b815260040160405180910390fd5b610db960e084901c606086901b1783610800610db189612b01565b929190612b50565b50604080518681526001600160a01b03861660208201526001600160e01b031985169181019190915282151560608201527f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e1906080015b60405180910390a15050505050565b5f5f610e547feff7fda3af271797e53f62724a17c2e5c118cf95ac65e8274759fcfff97bf1fe865f9182526020526040902090565b604080517f035aff83d86937d35b32e04f0ddc6ff469290eef2f1b692d8a815c89404d47495f908152306020908152838220905261190190528282526042601e20915290915094505f5f610ea9878787610905565b90925090508115158115151615610edf57610ec381612a75565b80610edc5750610edc33610ed683612b79565b90612ba8565b91505b81610eee5763ffffffff610ef4565b631626ba7e5b60e01b93505050505b9392505050565b5f333014610f24576040516282b42960e81b815260040160405180910390fd5b5f610f5d610f59610f5660017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a61598c565b90565b5c90565b90507f0a9f35b227e9f474cb86caa2e9b62847626fede22333cf52c7abea325d2eaa358114610f8a575f5ffd5b610fc0610fbb610f5660017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a61598c565b612c52565b60019150505b919050565b333014610fea576040516282b42960e81b815260040160405180910390fd5b828061100957604051638707510560e01b815260040160405180910390fd5b61101284612a75565b156110305760405163f2fee1e160e01b815260040160405180910390fd5b5f61103a85612b01565b6001600160a01b0385165f90815260028201602052604090206001909101915061108884600681111561106f5761106f615006565b8254600160ff9092169190911b80198216845516151590565b156110a8575f61109782612c58565b036110a8576110a68286612c73565b505b6110d7816001015f8660068111156110c2576110c2615006565b60ff1681526020019081526020015f205f9055565b7fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a2786868660405161110a9392919061599f565b60405180910390a1505050505050565b6060805f611126612307565b9050806001600160401b038111156111405761114061548d565b60405190808252806020026020018201604052801561118f57816020015b604080516080810182525f80825260208083018290529282015260608082015282525f1990920191018161115e5790505b509250806001600160401b038111156111aa576111aa61548d565b6040519080825280602002602001820160405280156111d3578160200160208202803683370190505b5091505f805b82811015611279575f6111fa8268448e3efef2f6a7f2f65b60020190612da8565b90505f61120682610c06565b805190915064ffffffffff164281109015151615611225575050611271565b80878581518110611238576112386159c2565b602002602001018190525081868581518110611256576112566159c2565b60209081029190910101528361126b816159d6565b94505050505b6001016111d9565b508084528252509091565b6001600160c01b0381165f90815268448e3efef2f6a7f2f76020526040808220549083901b67ffffffffffffffff1916175b92915050565b604080516080810182525f80825260208201819052918101919091526060808201526112b661033e8368448e3efef2f6a7f2f66111f1565b333014611313576040516282b42960e81b815260040160405180910390fd5b828061133257604051638707510560e01b815260040160405180910390fd5b5f516020615b645f395f51905f52841461136d5761134f84612a75565b1561136d5760405163f2fee1e160e01b815260040160405180910390fd5b5f61137785612b01565b60030190506113968185856001600160a01b0381161515610800612df1565b50604080518681526001600160a01b0380871660208301528516918101919091527f7e2baa9c3a554d7c6587682e28fe9607c29d1d8c8a46968368d5614607c6079990606001610e10565b333014611400576040516282b42960e81b815260040160405180910390fd5b838061141f57604051638707510560e01b815260040160405180910390fd5b61142885612a75565b156114465760405163f2fee1e160e01b815260040160405180910390fd5b5f61145086612b01565b600101905061146181866040612e1c565b506001600160a01b0385165f90815260018201602052604090206114a785600681111561149057611490615006565b8254600160ff9092169190911b8082178455161590565b505f816001015f8760068111156114c0576114c0615006565b60ff1681526020019081526020015f2090505f6114dc82612e58565b86815290506114eb8282612ea2565b7f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a8989898960405161152094939291906159ee565b60405180910390a1505050505050505050565b5f8061154f8460408051828152600190920160051b8201905290565b90505f5b848110156115ef575f5f365f61156a8a8a87612ee7565b929650909450925090506115df856115d07f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876115b18888612f19565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b5050505050806001019050611553565b5061c1d060f084901c145f6116497f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b90508161165e5761165981612f2a565b611667565b61166781613040565b979650505050505050565b333014611691576040516282b42960e81b815260040160405180910390fd5b5f83815268448e3efef2f6a7f2f9602052604090205460ff166116c75760405163395ed8c160e21b815260040160405180910390fd5b6116e082826102006116d887612b79565b9291906130b4565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc998360405161171f911515815260200190565b60405180910390a3505050565b600f60f81b6060805f8080836117406130cf565b97989097965046955030945091925090565b60605f61175e83612b01565b600301905061176c81613113565b6001600160401b038111156117835761178361548d565b6040519080825280602002602001820160405280156117c757816020015b604080518082019091525f80825260208201528152602001906001900390816117a15790505b5091505f5b8251811015611833576117df828261311d565b8483815181106117f1576117f16159c2565b60200260200101515f0185848151811061180d5761180d6159c2565b6020908102919091018101516001600160a01b03938416910152911690526001016117cc565b5050919050565b333014611859576040516282b42960e81b815260040160405180910390fd5b6001600160a01b03811661188057604051634adebaa360e11b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c525190555f6118bb6130cf565b915061191790507f0a9f35b227e9f474cb86caa2e9b62847626fede22333cf52c7abea325d2eaa35611911610f5660017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a61598c565b90613157565b306317e69ab86119268361315e565b6040518263ffffffff1660e01b815260040161194491815260200190565b6020604051808303815f875af1158015611960573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906119849190615a20565b61198c575f5ffd5b5050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146119d8576040516282b42960e81b815260040160405180910390fd5b6119ef68448e3efef2f6a7f2f65b60010182613186565b50565b5f6112b682602001516003811115611a0c57611a0c615006565b60ff168360600151805190602001205f1c5f9182526020526040902090565b60606112b6611a3983612b79565b61319d565b333014611a5d576040516282b42960e81b815260040160405180910390fd5b611a7068448e3efef2f6a7f2f782613271565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b333014611ac5576040516282b42960e81b815260040160405180910390fd5b611ace816132db565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b03811115611b1757611b1761548d565b604051908082528060200260200182016040528015611b4a57816020015b6060815260200190600190039081611b355790505b509250806001600160401b03811115611b6557611b6561548d565b604051908082528060200260200182016040528015611b9857816020015b6060815260200190600190039081611b835790505b5091505f5b81811015611c2957611bc6868683818110611bba57611bba6159c2565b90506020020135611dbe565b848281518110611bd857611bd86159c2565b6020026020010181905250611c04868683818110611bf857611bf86159c2565b90506020020135611f82565b838281518110611c1657611c166159c2565b6020908102919091010152600101611b9d565b50509250929050565b5f80611c60611c4f60015f516020615b845f395f51905f5261598c565b604080516020810190915290815290565b9050611c6b81515c90565b5f03611c7857505f919050565b611c8181613346565b91505090565b333014611ca6576040516282b42960e81b815260040160405180910390fd5b611cee82828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250611ce89250612a02915050565b90613366565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611d1f929190615a63565b60405180910390a15050565b6060611d3f68448e3efef2f6a7f2f6612a0f565b905090565b5f333014611d64576040516282b42960e81b815260040160405180910390fd5b611d6d826133be565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611d9f9190615095565b60405180910390a2919050565b5f611db682613460565b151592915050565b60605f611dca83612b01565b6001019050611de56040518060200160405280606081525090565b5f611def836134a9565b90505f5b81811015611f78575f611e0685836134fa565b6001600160a01b0381165f9081526001870160205260408120919250611e2b82613553565b90505f5b8151811015611f69575f828281518110611e4b57611e4b6159c2565b602002602001015190505f611e74856001015f8460ff1681526020019081526020015f20612e58565b9050611eb16040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166006811115611ec657611ec6615006565b81602001906006811115611edc57611edc615006565b90816006811115611eef57611eef615006565b9052506001600160a01b03871681528151604080830191909152820151608082015260208201516060820152611f344260ff851660068111156108a5576108a5615006565b60c08201819052608082015160608301519111150260a082015280611f598b826135ac565b5050505050806001019050611e2f565b50505050806001019050611df3565b5050519392505050565b60606112b6611f9083612b01565b613655565b5f611f9f84613460565b905080600303611fba57611fb484848461370e565b50505050565b365f365f84611fd057637f1812755f526004601cfd5b5085358087016020810194503592505f90604011600286141115611ffe575050602080860135860190810190355b61200d888888878787876137a6565b5050505050505050565b813580830190604081901c602084101715612030575f5ffd5b506120a5336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461209c306120716020860186615472565b6001600160a01b0316143061208c6080870160608801615472565b6001600160a01b03161417151590565b15159015151690565b6120c1576040516282b42960e81b815260040160405180910390fd5b306120d26080830160608401615472565b6001600160a01b03160361212f575f806120f4866102c4610240860186615a76565b975091508690506001600160c01b0332311061210f57600191505b8161212c576040516282b42960e81b815260040160405180910390fd5b50505b61215a61214260a0830160808401615472565b61215461022084016102008501615472565b886139be565b84158061216b575061216b85612a75565b6121c7575f61217986612b01565b6001810191506121c5906002015f61219760a0860160808701615472565b6001600160a01b0316815260208101919091526040015f206121bf60a0850160808601615472565b896139e6565b505b505050505050565b5f808260068111156121e3576121e3615006565b036121f657603c808404025b90506112b6565b600182600681111561220a5761220a615006565b0361221b57610e10808404026121ef565b600282600681111561222f5761222f615006565b036122415762015180808404026121ef565b600382600681111561225557612255615006565b0361227b576007600362015180808604918201929092069003620545ff851102026121ef565b5f5f61228685613b0b565b50909250905060048460068111156122a0576122a0615006565b036122ba576122b182826001613bb5565b925050506112b6565b60058460068111156122ce576122ce615006565b036122df576122b182600180613bb5565b60068460068111156122f3576122f3615006565b03612303576001925050506112b6565b5f5ffd5b5f611d3f68448e3efef2f6a7f2f8613c0c565b5f84612328575060016125e6565b61233185612a75565b1561233e575060016125e6565b631919191960e11b60048310612352575082355b826123615750630707070760e51b5b61236b8582612ad9565b15612379575f9150506125e6565b5f61238387612b01565b905061238e81613c0c565b1561244b576123a960e083901c606088901b175b8290613c58565b156123b9576001925050506125e6565b6123cc6332323232606088901b176123a2565b156123dc576001925050506125e6565b61240260e083901c73191919191919191919191919191919191919191960611b176123a2565b15612412576001925050506125e6565b61243b7f32323232323232323232323232323232323232320000000000000000323232326123a2565b1561244b576001925050506125e6565b6124615f516020615b645f395f51905f52612b01565b905061246c81613c0c565b156125265761248460e083901c606088901b176123a2565b15612494576001925050506125e6565b6124a76332323232606088901b176123a2565b156124b7576001925050506125e6565b6124dd60e083901c73191919191919191919191919191919191919191960611b176123a2565b156124ed576001925050506125e6565b6125167f32323232323232323232323232323232323232320000000000000000323232326123a2565b15612526576001925050506125e6565b612534878888898989613cdc565b15612544576001925050506125e6565b6125668788733232323232323232323232323232323232323232898989613cdc565b15612576576001925050506125e6565b6125915f516020615b645f395f51905f528888808989613cdc565b156125a1576001925050506125e6565b6125d05f516020615b645f395f51905f5288733232323232323232323232323232323232323232898989613cdc565b156125e0576001925050506125e6565b5f925050505b949350505050565b5f604051826040811461260957604181146126305750612661565b60208581013560ff81901c601b0190915285356040526001600160ff1b0316606052612641565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d61266e575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d610fc657fe5b5f6040518681528560208201528460408201528360608201528260808201525f5f5260205f60a0836101005afa503d6126f3576d1ab2e8006fd8b71907bf06a5bdee3b6126f35760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa6126f357fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b61275d6040518060c0016040528060608152602001606081526020015f81526020015f81526020015f81526020015f81525090565b815160c0811061280a5760208301818101818251018281108260c083011117156127895750505061280a565b80815101925080602082015101818110838211178285108486111717156127b3575050505061280a565b82815160208301011183855160208701011117156127d4575050505061280a565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f5f5f61281f88600180613d8a565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561290357602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061290357fe5b5050508215612924576129218287608001518860a00151888861268f565b92505b505095945050505050565b5f6001600160a01b038516156125e657604051853b6129bf57826040811461295f576041811461298657506129f9565b60208581013560ff81901c601b0190915285356040526001600160ff1b0316606052612997565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f606052806040526129f9565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b68448e3efef2f6a7f2f690565b60405181546020820190600881901c5f8260ff841714612a3d57505080825260ff8116601f80821115612a5f575b855f5260205f205b8160051c81015482860152602082019150828210612a4557505b508084525f920191825250602001604052919050565b5f81815268448e3efef2f6a7f2f960205260408120805460ff808216908114801590910260089290921c021780612abf5760405163395ed8c160e21b815260040160405180910390fd5b612acc825f198301613e7b565b60ff161515949350505050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f516020615b645f395f51905f528314612b2557612b2083613ee8565b612b34565b5f516020615b645f395f51905f525b68b11ddb8fabd886bebb6009525f908152602990209392505050565b5f82612b6557612b608585613f15565b612b70565b612b70858584614013565b95945050505050565b5f81815268448e3efef2f6a7f2fa602052604081208054601f5263d4203f8b6004528152603f81208190610efd565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612be35763f5a267f15f526004601cfd5b82612bf55768fbb67fda52d4bfb8bf92505b80546001600160601b038116612c395760019250838160601c0315612c4a57600182015460601c8414612c4a57600282015460601c8414612c4a575b5f9250612c4a565b81602052835f5260405f2054151592505b505092915050565b5f815d50565b5f81545b801561280a57600191820191811901811618612c5c565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612cae5763f5a267f15f526004601cfd5b82612cc05768fbb67fda52d4bfb8bf92505b80546001600160601b03811680612d3a5760019350848260601c03612cf85760018301805484556002840180549091555f9055612d9f565b84600184015460601c03612d195760028301805460018501555f9055612d9f565b84600284015460601c03612d32575f6002840155612d9f565b5f9350612d9f565b82602052845f5260405f20805480612d53575050612d9f565b60018360011c039250826001820314612d83578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612dd283613c0c565b82106112b657604051634e23d03560e01b815260040160405180910390fd5b5f82612e0657612e018686614030565b612e12565b612e1286868685614061565b9695505050505050565b5f612e27848461409c565b90508015610efd5781612e39856134a9565b1115610efd5760405163155176b960e11b815260040160405180910390fd5b612e7960405180606001604052805f81526020015f81526020015f81525090565b5f612e8383612a0f565b905080515f1461280a575f612e97826141f7565b602001949350505050565b6040805182516020808301919091528301518183015290820151606082015261198c908390612ee290608001604051602081830303815290604052614343565b613366565b60051b82013590910180356001600160a01b031680153002179260208083013593506040830135909201918201913590565b5f8183604051375060405120919050565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f000000000000000000000000000000000000000000000000000000000000000046141661301d5750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f5f5f61304b6130cf565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b5f826130c457612b608585612c73565b612b70858584612e1c565b604080518082018252600d81526c125d1a1858d85058d8dbdd5b9d609a1b60208083019190915282518084019093526006835265036392e302e360d41b9083015291565b5f6112b6826134a9565b5f80600184018161312e86866134fa565b6001600160a01b038082168352602083019390935260409091015f205490969116945092505050565b80825d5050565b8051602181106131755763ec92f9a35f526004601cfd5b9081015160209190910360031b1b90565b5f5f6131928484614570565b600101905550505050565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c925083831415830281528161322b57821561322657600191508185015460601c92508215613226578284141590920260208301525060028381015460601c918215613226576003915083831415830260408201525b61325b565b600191821c915b82811015613259578581015460601c858114158102600583901b8401529350600101613232565b505b8186528160051b81016040525050505050919050565b604081811c5f90815260208490522080546001600160401b03831610156132ab576040516312ee5c9360e01b815260040160405180910390fd5b6132d56132cf836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f81815268448e3efef2f6a7f2f96020908152604080832083905568448e3efef2f6a7f2fa90915290208054600101905568448e3efef2f6a7f2f661332968448e3efef2f6a7f2f883613f15565b61198c5760405163395ed8c160e21b815260040160405180910390fd5b80515f90805c8061335e5763bc7ec7795f526004601cfd5b015c92915050565b80518060081b60ff175f60fe831161338f575050601f8281015160081b821790808311156133b6575b60208401855f5260205f205b828201518360051c82015560208301925084831061339b5750505b509092555050565b5f8160400151156133f3576133d682602001516145b6565b6133f3576040516321b9b33960e21b815260040160405180910390fd5b6133fc826119f2565b90505f68448e3efef2f6a7f2f66060840151845160208087015160408089015190519596506134539561343195949301615ab8565b60408051601f198184030181529181525f858152600385016020522090613366565b61183360028201836145d2565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c15176134f2576001935083830154156134f2576002935083830154156134f257600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf8214158202915061352d846134a9565b831061354c57604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b80156135965761ffff811661357b576010918201911c613560565b8183526020600582901b16909201916001918201911c613560565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c5536020840351818106158282040290508083106136445782811781018115826020018701604051181761361057828102601f198701528501602001604052613644565b602060405101816020018101604052808a52601f19855b888101518382015281018061362757509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf9060208401816136ce57835480156136c8578084141502815260018481015490925080156136c8578084141502602082015260028481015490925080156136c8576003925083811415810260408301525b506136f9565b8160011c91505f5b828110156136f757848101548481141502600582901b8301526001016136d6565b505b8185528160051b810160405250505050919050565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c171561375357633995943b5f526004601cfd5b505f5b8381146121c557365f8260051b850135808601602081019350803592505084828401118160401c171561379057633995943b5f526004601cfd5b5061379c898383611f95565b5050600101613756565b6001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016330361386c57602081146137f75760405163438e981560e11b815260040160405180910390fd5b604080516020810190915282359061382c9082908061382460015f516020615b845f395f51905f5261598c565b9052906146e4565b6138378585836146fe565b6040805160208101909152613866908061385f60015f516020615b845f395f51905f5261598c565b9052614bc7565b506121c5565b806138a057333014613890576040516282b42960e81b815260040160405180910390fd5b61389b84845f6146fe565b6121c5565b60208110156138c25760405163438e981560e11b815260040160405180910390fd5b81356138d668448e3efef2f6a7f2f66119e6565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f5f613933613919888886611533565b602080871081881802188088019080880390881102610905565b9150915081613954576040516282b42960e81b815260040160405180910390fd5b61397f81604051806020016040528060015f516020615b845f395f51905f525f1c613824919061598c565b61398a8787836146fe565b60408051602081019091526139b2908061385f60015f516020615b845f395f51905f5261598c565b50505050505050505050565b6001600160a01b0383166139db576139d68282614be8565b505050565b6139d6838383614c01565b806139f057505050565b5f6139fa84613553565b905080515f03613a1d57604051635ee7e5b160e01b815260040160405180910390fd5b5f5b8151811015613b04575f828281518110613a3b57613a3b6159c2565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f613a6882612e58565b90505f613a84428560ff1660068111156108a5576108a5615006565b90508082604001511015613aa057604082018190525f60208301525b815f01518783602001818151613ab69190615b07565b9150818152501115613aeb5760405163482a648960e11b81526001600160a01b03891660048201526024015b60405180910390fd5b613af58383612ea2565b50505050806001019050613a1f565b5050505050565b5f8080613ba8613b1e6201518086615b1a565b5f5f5f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c9250806118335781545f9350156118335760019250828201541561183357600292508282015415611833575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613c855763f5a267f15f526004601cfd5b82613c975768fbb67fda52d4bfb8bf92505b801954613cc857805460019250831461354c576001810154831461354c576002810154831461354c575f915061354c565b602052505f90815260409020541515919050565b5f5f5f613cf587613cec8b612b01565b60030190614c4b565b915091508115613d7c576040516001629e639560e01b031981526001600160a01b0382169063ff619c6b90613d34908b908a908a908a90600401615b39565b602060405180830381865afa158015613d4f573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190613d739190615a20565b92505050612e12565b505f98975050505050505050565b60608351801561266e576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613e05579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f82548060ff821714613ec357601e8311613e9a5780831a915061354c565b8060ff168311613ebe57835f52601f83038060051c60205f200154601f82161a9250505b61354c565b8060081c831161354c57835f528260051c60205f200154601f84161a91505092915050565b5f81815268448e3efef2f6a7f2fa602052604081208054601f5263d4203f8b6004528152603f81206112b6565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613f425763f5a267f15f526004601cfd5b82613f545768fbb67fda52d4bfb8bf92505b80195480613fb5576001925083825403613f815760018201805483556002830180549091555f9055612c4a565b83600183015403613f9f5760028201805460018401555f9055612c4a565b83600283015403612c31575f6002830155612c4a565b81602052835f5260405f20805480613fce575050612c4a565b60018360011c039250826001820314613ff857828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f61401e84846145d2565b90508015610efd5781612e3985613c0c565b6001600160a01b0381165f908152600183016020526040812080546001600160a01b0319169055610efd8383612c73565b6001600160a01b038381165f908152600186016020526040812080546001600160a01b03191692851692909217909155612b70858584612e1c565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016140d75763f5a267f15f526004601cfd5b826140e95768fbb67fda52d4bfb8bf92505b80546001600160601b03811682602052806141ab578160601c80614117578560601b84556001945050612d9f565b8581036141245750612d9f565b600184015460601c80614145578660601b6001860155600195505050612d9f565b868103614153575050612d9f565b600285015460601c80614175578760601b600287015560019650505050612d9f565b87810361418457505050612d9f565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f2080546141ed57600191821c8083018255919450816141d9578560601b600317845550612d9f565b8560601b8285015582600201845550612d9f565b5050505092915050565b6060815115610fc6576040519050600482018051835184602001017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f6020850183198552866020015b8051805f1a61429857600190811a01608081116142785760028201915080368437918201918482106142725750614325565b50614240565b5f198352918201607f190191600291909101908482106142725750614325565b80835283811684011783171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f8601f6f8421084210842108cc6318c6db6d54be660204081020408185821060071b86811c6001600160401b031060061b1795861c0260181a1c161a90911860031c019182019101838110614240578381111561432557838103820391505b509290935250601f198382030183525f815260200160405250919050565b606061439b565b6fffffffffffffffffffffffffffffffff811160071b81811c6001600160401b031060061b1781811c63ffffffff1060051b1781811c61ffff1060041b1790811c60ff1060039190911c17601f1890565b50604051815182017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f60208301845b83811461454c57600101805160ff1680614454575b6020820151806144235782860360208181189082110218607f839003818111818318021893840193928301929050601f811161441c575050614444565b50506143df565b61442c8161434a565b90508286038181118183180218928301929190910190505b60f01b82526002909101906143ca565b60ff81036144a757602080830151198015614475576144728161434a565b91505b508286038181118282180218601f81811890821102186080811760f01b85526002909401939290920191506143ca9050565b80835350602081015160018381018290528482168501821791198581168601179190911684171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f86f8421084210842108cc6318c6db6d54be660204081020408184821060071b85811c6001600160401b031060061b1794851c0260181a1c601f161a90911860031c0182860381811191811891909102189283010191016143ca565b50600484018051199052601f198482030184525f8152602001604052509092915050565b604081811c5f90815260208490522080546001600160401b038084168214908210166145af57604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f808260038111156145ca576145ca615006565b141592915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036145ff5763f5a267f15f526004601cfd5b826146115768fbb67fda52d4bfb8bf92505b80195481602052806146b557815480614631578483556001935050612c4a565b84810361463e5750612c4a565b60018301548061465957856001850155600194505050612c4a565b858103614667575050612c4a565b6002840154806146835786600286015560019550505050612c4a565b86810361469257505050612c4a565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f208054612d9f57600191821c8381018690558083019182905590821b8217831955909250612c4a565b5f825f015190506001815c01828183015d80825d50505050565b80158061470f575061470f81612a75565b1561471f576139d6838383614c85565b5f61472982612b01565b60010190506147976040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f6147a1836134a9565b90505f5b818110156147f3575f6147b885836134fa565b90506001600160a01b038116156147ea5760408401516147d89082614ccf565b5060608401516147e8905f6135ac565b505b506001016147a5565b505f5f5b868110156149e4575f5f365f61480e8c8c87612ee7565b9350935093509350825f1461482a576148278387615b07565b95505b600481101561483c57505050506149dc565b813560e01c63a9059cbb81900361487357604089015161485c9086614ccf565b5061487160248401355b60608b015190614cee565b505b8063ffffffff166323b872dd036148d6573060248401356001600160a01b0316036148a25750505050506149dc565b60448301355f036148b75750505050506149dc565b60408901516148c69086614ccf565b506148d46044840135614866565b505b8063ffffffff1663095ea7b30361493c5760248301355f036148fc5750505050506149dc565b88516149089086614ccf565b5061491c600484013560208b015190614ccf565b50604089015161492c9086614ccf565b5061493a6024840135614866565b505b8063ffffffff166387517c45036149d6576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba3146149765750505050506149dc565b60448301355f0361498b5750505050506149dc565b61499e600484013560808b015190614ccf565b506149b2602484013560a08b015190614ccf565b506149c6600484013560408b015190614ccf565b506149d46044840135614866565b505b50505050505b6001016147f7565b506040830151516060840151516149fb9190614d04565b5f614a2e614a0c8560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b60408501515151811015614a7a57604085015151600582901b0160200151614a7082614a5e8330614e47565b85919060059190911b82016020015290565b5050600101614a32565b50614a86888888614c85565b5f8080526001860160205260408120614a9f91846139e6565b5f5b84515151811015614ae357845151600582901b0160200151614ada81614ad4848960200151614e3790919063ffffffff16565b5f614e71565b50600101614aa1565b505f5b60808501515151811015614b2d57608085015151600582901b0160200151614b2481614b1f848960a00151614e3790919063ffffffff16565b614eb1565b50600101614ae6565b505f5b60408501515151811015614bbc57604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b018352939093206060890151518301820151928601909101519091614bb29183918591614bad9190614ba290614b998930614e47565b80821191030290565b808218908210021890565b6139e6565b5050600101614b30565b505050505050505050565b8051805c80614bdd5763bc7ec7795f526004601cfd5b60018103825d505050565b5f385f3884865af161198c5763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416614c4157803d853b151710614c41576390b8ec185f526004601cfd5b505f603452505050565b6001600160a01b038181165f90815260018401602052604081205490911680151580614c7c5750614c7c8484614f0c565b91509250929050565b5f82614c915750505050565b5f5f365f614ca0888887612ee7565b9350935093509350614cb5848484848a614f17565b50505050838390508160010191508103614c915750505050565b604080516060815290819052610efd83836001600160a01b03166135ac565b604080516060815290819052610efd83836135ac565b614d91565b805181602083015b8281511015614d3d57805160209290920180518252918252614d3d868301878301805182519091529052565b602001848110614d1157508251815184528152614d64858201868501805182519091529052565b808360400111614d7957614d79858285614d09565b838160600111613b0457613b04858560208401614d09565b805180835114614dad57634e487b715f5260326020526024601cfd5b600281106139d657828203602084018260051b8101614dcd838284614d09565b82820151604087015b8051845114614df25781858501525f9150602084019350805184525b8085015191820191821015614e1357634e487b715f5260116020526024601cfd5b602081019050828103614dd657509282019290925284900360051c93849052505052565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f511416614c4157803d853b151710614c4157633e3f8f735f526004601cfd5b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af16139d6576396b3de235f526004601cfd5b5f610efd8383612ba8565b614f238186858561231a565b614f48578085848460405163f78c1b5360e01b8152600401613ae29493929190615b39565b613b048585858585604051828482375f388483888a5af16121c7573d5f823e3d81fd5b5f5f83601f840112614f7b575f5ffd5b5081356001600160401b03811115614f91575f5ffd5b6020830191508360208285010111156145af575f5ffd5b5f5f5f60408486031215614fba575f5ffd5b8335925060208401356001600160401b03811115614fd6575f5ffd5b614fe286828701614f6b565b9497909650939450505050565b5f60208284031215614fff575f5ffd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f60208201516004811061506957615069615006565b806020850152506040820151151560408401526060820151608060608501526125e6608085018261501a565b602081525f610efd6020830184615048565b6001600160a01b03811681146119ef575f5ffd5b80151581146119ef575f5ffd5b8035610fc6816150bb565b5f5f5f5f608085870312156150e6575f5ffd5b8435935060208501356150f8816150a7565b925060408501356001600160e01b031981168114615114575f5ffd5b91506060850135615124816150bb565b939692955090935050565b803560078110610fc6575f5ffd5b5f5f5f6060848603121561514f575f5ffd5b833592506020840135615161816150a7565b915061516f6040850161512f565b90509250925092565b5f8151808452602084019350602083015f5b828110156151a857815186526020958601959091019060010161518a565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561520957605f198786030184526151f4858351615048565b945060209384019391909101906001016151d8565b505050508281036020840152612b708185615178565b5f6020828403121561522f575f5ffd5b81356001600160c01b0381168114610efd575f5ffd5b5f5f5f60608486031215615257575f5ffd5b833592506020840135615269816150a7565b91506040840135615279816150a7565b809150509250925092565b5f5f5f5f60808587031215615297575f5ffd5b8435935060208501356152a9816150a7565b92506152b76040860161512f565b9396929550929360600135925050565b5f5f83601f8401126152d7575f5ffd5b5081356001600160401b038111156152ed575f5ffd5b6020830191508360208260051b85010111156145af575f5ffd5b5f5f5f60408486031215615319575f5ffd5b83356001600160401b0381111561532e575f5ffd5b61533a868287016152c7565b909790965060209590950135949350505050565b5f5f5f60608486031215615360575f5ffd5b833592506020840135615372816150a7565b91506040840135615279816150bb565b60ff60f81b8816815260e060208201525f6153a060e083018961501a565b82810360408401526153b2818961501a565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b818110156154075783518352602093840193909201916001016153e9565b50909b9a5050505050505050505050565b602080825282518282018190525f918401906040840190835b8181101561546757835180516001600160a01b039081168552602091820151168185015290930192604090920191600101615431565b509095945050505050565b5f60208284031215615482575f5ffd5b8135610efd816150a7565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b03811182821017156154c3576154c361548d565b60405290565b5f82601f8301126154d8575f5ffd5b81356001600160401b038111156154f1576154f161548d565b604051601f8201601f19908116603f011681016001600160401b038111828210171561551f5761551f61548d565b604052818152838201602001851015615536575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f60208284031215615562575f5ffd5b81356001600160401b03811115615577575f5ffd5b820160808185031215615588575f5ffd5b6155906154a1565b813564ffffffffff811681146155a4575f5ffd5b81526020820135600481106155b7575f5ffd5b60208201526155c8604083016150c8565b604082015260608201356001600160401b038111156155e5575f5ffd5b6155f1868285016154c9565b606083015250949350505050565b602080825282518282018190525f918401906040840190835b818110156154675783516001600160a01b0316835260209384019390920191600101615618565b5f5f60208385031215615650575f5ffd5b82356001600160401b03811115615665575f5ffd5b615671858286016152c7565b90969095509350505050565b6007811061568d5761568d615006565b9052565b5f8151808452602084019350602083015f5b828110156151a857815180516001600160a01b031687526020808201515f916156ce908a018261567d565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e090950194602091909101906001016156a3565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561576e57605f19878603018452615759858351615691565b9450602093840193919091019060010161573d565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b838110156157c757601f198684030185526157b1838351615178565b6020958601959093509190910190600101615795565b509098975050505050505050565b5f5f602083850312156157e6575f5ffd5b82356001600160401b038111156157fb575f5ffd5b61567185828601614f6b565b602081525f610efd602083018461501a565b602081525f610efd6020830184615691565b602081525f610efd6020830184615178565b5f5f5f5f5f60808688031215615851575f5ffd5b85359450602086013593506040860135925060608601356001600160401b0381111561587b575f5ffd5b61588788828901614f6b565b969995985093965092949392505050565b5f5f604083850312156158a9575f5ffd5b823591506158b96020840161512f565b90509250929050565b5f5f5f5f606085870312156158d5575f5ffd5b8435935060208501356158e7816150a7565b925060408501356001600160401b03811115615901575f5ffd5b61590d87828801614f6b565b95989497509550505050565b5f60208284031215615929575f5ffd5b8151610efd816150a7565b805160208201516bffffffffffffffffffffffff19811691906014821015611833576bffffffffffffffffffffffff1960149290920360031b82901b161692915050565b634e487b7160e01b5f52601160045260245ffd5b818103818111156112b6576112b6615978565b8381526001600160a01b0383166020820152606081016125e6604083018461567d565b634e487b7160e01b5f52603260045260245ffd5b5f600182016159e7576159e7615978565b5060010190565b8481526001600160a01b038416602082015260808101615a11604083018561567d565b82606083015295945050505050565b5f60208284031215615a30575f5ffd5b8151610efd816150bb565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f6125e6602083018486615a3b565b5f5f8335601e19843603018112615a8b575f5ffd5b8301803591506001600160401b03821115615aa4575f5ffd5b6020019150368190038213156145af575f5ffd5b5f85518060208801845e60d886901b6001600160d81b03191690830190815260048510615ae757615ae7615006565b60f894851b600582015292151590931b6006830152506007019392505050565b808201808211156112b6576112b6615978565b5f82615b3457634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f90612e129083018486615a3b56fe3232323232323232323232323232323232323232323232323232323232323232def24cb3236edf62937b12ea8dc676927599974e90729c6e9eafa9f05b03eab8a26469706673582212209e49e3337e8d3f7cad3ee9988ba2103cef2c20332680e0bb7cbce34f4ccc879964736f6c634300081c0033" as const;


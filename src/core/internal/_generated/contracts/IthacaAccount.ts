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
        "internalType": "struct IthacaAccount.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccount.KeyType"
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
        "internalType": "struct IthacaAccount.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccount.KeyType"
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
        "internalType": "struct IthacaAccount.Key[]",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccount.KeyType"
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
        "internalType": "struct IthacaAccount.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccount.KeyType"
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
    "name": "isValidSignature8010",
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
      },
      {
        "name": "initData",
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
    "stateMutability": "payable"
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
        "internalType": "struct IthacaAccount.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccount.KeyType"
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
        "internalType": "struct IthacaAccount.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccount.KeyType"
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

export const code = "0x610140604052604051615e30380380615e30833981016040819052610023916100e9565b306080524660a052606080610074604080518082018252600d81526c125d1a1858d85058d8dbdd5b9d609a1b6020808301919091528251808401909352600583526418171a971960d91b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610116565b5f602082840312156100f9575f5ffd5b81516001600160a01b038116811461010f575f5ffd5b9392505050565b60805160a05160c05160e0516101005161012051615cb76101795f395f818161079e0152818161092f01528181611a11015281816120b5015261382501525f61301601525f6130d001525f6130aa01525f61305a01525f6130370152615cb75ff3fe608060405260043610610275575f3560e01c806384b0196e1161014e578063c885f95a116100c0578063e9ae5c5311610079578063e9ae5c5314610877578063f81d87a71461088a578063faba56d8146108a9578063fac750e0146108c8578063fcd4e707146108dc578063ff619c6b146109045761027c565b8063c885f95a1461078d578063cb4774c4146107c0578063cebfe336146107e1578063d03c791414610800578063dcc09ebf1461081f578063e5adda711461084b5761027c565b8063ad07708311610112578063ad077083146106c3578063b70e36f0146106ef578063b75c7dc61461070e578063bc2c554a1461072d578063be766d151461075a578063bf5309691461076e5761027c565b806384b0196e1461061f5780638e87cf4714610646578063912aa1b8146106725780639e49fbf114610691578063a840fe49146106a45761027c565b80632f3f30c7116101e7578063515c9d6d116101ab578063515c9d6d146105505780635702245114610570578063598daac41461058f57806360d2f33d146105ae5780636fd91454146105e15780637656d304146106005761027c565b80632f3f30c7146104cb57806335058501146104e557806335780551146104ff5780633e1b0812146105125780634223b5c2146105315761027c565b806317e69ab81161023957806317e69ab8146103b45780631a912f3e146103e357806320606b70146104245780632081a278146104575780632150c518146104765780632f1d14cb146104985761027c565b80630cef73b4146102b557806311a86fd6146102f057806312aaac701461032f578063136a12f71461035b5780631626ba7e1461037c5761027c565b3661027c57005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a02821417156102a757806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102c0575f5ffd5b506102d46102cf36600461501d565b610923565b6040805192151583526020830191909152015b60405180910390f35b3480156102fb575f5ffd5b5061031773323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102e7565b34801561033a575f5ffd5b5061034e610349366004615064565b610c24565b6040516102e7919061510a565b348015610366575f5ffd5b5061037a610375366004615148565b610d13565b005b348015610387575f5ffd5b5061039b61039636600461501d565b610e3d565b6040516001600160e01b031990911681526020016102e7565b3480156103bf575f5ffd5b506103d36103ce366004615064565b610ee7565b60405190151581526020016102e7565b3480156103ee575f5ffd5b506104167f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102e7565b34801561042f575f5ffd5b506104167f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b348015610462575f5ffd5b5061037a6104713660046151b2565b610fae565b348015610481575f5ffd5b5061048a6110fd565b6040516102e7929190615227565b3480156104a3575f5ffd5b506104167feff7fda3af271797e53f62724a17c2e5c118cf95ac65e8274759fcfff97bf1fe81565b3480156104d6575f5ffd5b5061039b630707070760e51b81565b3480156104f0575f5ffd5b5061039b631919191960e11b81565b61039b61050d366004615294565b611267565b34801561051d575f5ffd5b5061041661052c36600461530b565b611305565b34801561053c575f5ffd5b5061034e61054b366004615064565b61133d565b34801561055b575f5ffd5b506104165f516020615c425f395f51905f5281565b34801561057b575f5ffd5b5061037a61058a366004615331565b611375565b34801561059a575f5ffd5b5061037a6105a9366004615370565b611462565b3480156105b9575f5ffd5b506104167f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b3480156105ec575f5ffd5b506104166105fb3660046153f3565b6115b4565b34801561060b575f5ffd5b5061037a61061a36600461543a565b6116e8565b34801561062a575f5ffd5b506106336117a2565b6040516102e7979695949392919061546e565b348015610651575f5ffd5b50610665610660366004615064565b6117c8565b6040516102e79190615504565b34801561067d575f5ffd5b5061037a61068c36600461555e565b6118b0565b61037a61069f366004615064565b611a06565b3480156106af575f5ffd5b506104166106be36600461563e565b611a68565b3480156106ce575f5ffd5b506106e26106dd366004615064565b611aa1565b6040516102e791906156eb565b3480156106fa575f5ffd5b5061037a610709366004615064565b611ab4565b348015610719575f5ffd5b5061037a610728366004615064565b611b1c565b348015610738575f5ffd5b5061074c61074736600461572b565b611b71565b6040516102e7929190615803565b348015610765575f5ffd5b50610416611ca8565b348015610779575f5ffd5b5061037a6107883660046158c1565b611cfd565b348015610798575f5ffd5b506103177f000000000000000000000000000000000000000000000000000000000000000081565b3480156107cb575f5ffd5b506107d4611da1565b6040516102e791906158f3565b3480156107ec575f5ffd5b506104166107fb36600461563e565b611dba565b34801561080b575f5ffd5b506103d361081a366004615064565b611e22565b34801561082a575f5ffd5b5061083e610839366004615064565b611e34565b6040516102e79190615905565b348015610856575f5ffd5b5061086a610865366004615064565b611ff8565b6040516102e79190615917565b61037a61088536600461501d565b61200b565b348015610895575f5ffd5b5061037a6108a4366004615929565b61208d565b3480156108b4575f5ffd5b506104166108c3366004615967565b612245565b3480156108d3575f5ffd5b5061041661237d565b3480156108e7575f5ffd5b506108f161c1d081565b60405161ffff90911681526020016102e7565b34801561090f575f5ffd5b506103d361091e366004615991565b612390565b63060f052a5f908152807f00000000000000000000000000000000000000000000000000000000000000006020826004601c845afa80155f51171561096f57639e87fac85f526004601cfd5b50604184146040851417156109a0573061098a878787612664565b6001600160a01b03161492505f9150610c1c9050565b60218410156109b557505f9150819050610c1c565b60201984810185811181871802811895870191820135935090601f19013560ff16156109e7576109e4876126ec565b96505b505f6109f283610c24565b805190915064ffffffffff164281109015151615610a14575f93505050610c1c565b5f81602001516003811115610a2b57610a2b61507b565b03610a86575f80603f8711883581029060208a013502915091505f5f610a6a856060015180516020820151604090920151603f90911191820292910290565b91509150610a7b8b85858585612705565b975050505050610c19565b600181602001516003811115610a9e57610a9e61507b565b03610b2357606081810151805160208083015160409384015184518084018e9052855180820385018152601f8d018590049094028101870186529485018b8152603f9490941091820295910293610b1a935f92610b13928e918e918291018382808284375f9201919091525061279e92505050565b8585612886565b95505050610c19565b600281602001516003811115610b3b57610b3b61507b565b03610b6a57610b638160600151806020019051810190610b5b91906159e8565b8888886129a5565b9350610c19565b600381602001516003811115610b8257610b8261507b565b03610c1957806060015151602014610bad5760405163145a1fdd60e31b815260040160405180910390fd5b5f8160600151610bbc90615a03565b60601c9050604051638afc93b48152886020820152846040820152606080820152866080820152868860a08301375f5f526084870160205f82601c8501865afa915050638afc93b45f5160e01c14811615610c1657600195505b50505b50505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f82815268448e3efef2f6a7f2f960205260408120610c6490612a85565b8051909150610c865760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610c9a8383016020015190565b60d881901c855260c881901c915060d01c60ff166003811115610cbf57610cbf61507b565b84602001906003811115610cd557610cd561507b565b90816003811115610ce857610ce861507b565b90525060ff811615156040850152610d0583838151811082025290565b606085015250919392505050565b333014610d32576040516282b42960e81b815260040160405180910390fd5b8380610d5157604051638707510560e01b815260040160405180910390fd5b5f516020615c425f395f51905f528514610d8c57610d6e85612aeb565b15610d8c57604051630442081560e01b815260040160405180910390fd5b610d968484612b4f565b15610db4576040516303a6f8c760e21b815260040160405180910390fd5b610dd760e084901c606086901b1783610800610dcf89612b77565b929190612bc6565b50604080518681526001600160a01b03861660208201526001600160e01b031985169181019190915282151560608201527f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e1906080015b60405180910390a15050505050565b5f5f610e727feff7fda3af271797e53f62724a17c2e5c118cf95ac65e8274759fcfff97bf1fe865f9182526020526040902090565b9050610e7d81612bef565b94505f5f610e8c878787610923565b90925090508115158115151615610ec257610ea681612aeb565b80610ebf5750610ebf33610eb983612c63565b90612c92565b91505b81610ed15763ffffffff610ed7565b631626ba7e5b60e01b93505050505b9392505050565b5f333014610f07576040516282b42960e81b815260040160405180910390fd5b5f610f40610f3c610f3960017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615a5b565b90565b5c90565b90507f0a9f35b227e9f474cb86caa2e9b62847626fede22333cf52c7abea325d2eaa358114610f6d575f5ffd5b610fa3610f9e610f3960017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615a5b565b612d3c565b60019150505b919050565b333014610fcd576040516282b42960e81b815260040160405180910390fd5b8280610fec57604051638707510560e01b815260040160405180910390fd5b610ff584612aeb565b156110135760405163f2fee1e160e01b815260040160405180910390fd5b5f61101d85612b77565b6001600160a01b0385165f90815260028201602052604090206001909101915061106b8460068111156110525761105261507b565b8254600160ff9092169190911b80198216845516151590565b1561108b575f61107a82612d42565b0361108b576110898286612d5d565b505b6110ba816001015f8660068111156110a5576110a561507b565b60ff1681526020019081526020015f205f9055565b7fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a278686866040516110ed93929190615a6e565b60405180910390a1505050505050565b6060805f61110961237d565b9050806001600160401b0381111561112357611123615579565b60405190808252806020026020018201604052801561117257816020015b604080516080810182525f80825260208083018290529282015260608082015282525f199092019101816111415790505b509250806001600160401b0381111561118d5761118d615579565b6040519080825280602002602001820160405280156111b6578160200160208202803683370190505b5091505f805b8281101561125c575f6111dd8268448e3efef2f6a7f2f65b60020190612e92565b90505f6111e982610c24565b805190915064ffffffffff164281109015151615611208575050611254565b8087858151811061121b5761121b615a91565b60200260200101819052508186858151811061123957611239615a91565b60209081029190910101528361124e81615aa5565b94505050505b6001016111bc565b508084528252509091565b5f333014611287576040516282b42960e81b815260040160405180910390fd5b5f306001600160a01b03163485856040516112a3929190615abd565b5f6040518083038185875af1925050503d805f81146112dd576040519150601f19603f3d011682016040523d82523d5f602084013e6112e2565b606091505b50509050806112ef575f5ffd5b6112fa878787610e3d565b979650505050505050565b6001600160c01b0381165f90815268448e3efef2f6a7f2f76020526040808220549083901b67ffffffffffffffff1916175b92915050565b604080516080810182525f80825260208201819052918101919091526060808201526113376103498368448e3efef2f6a7f2f66111d4565b333014611394576040516282b42960e81b815260040160405180910390fd5b82806113b357604051638707510560e01b815260040160405180910390fd5b5f516020615c425f395f51905f5284146113ee576113d084612aeb565b156113ee5760405163f2fee1e160e01b815260040160405180910390fd5b5f6113f885612b77565b60030190506114178185856001600160a01b0381161515610800612edb565b50604080518681526001600160a01b0380871660208301528516918101919091527f7e2baa9c3a554d7c6587682e28fe9607c29d1d8c8a46968368d5614607c6079990606001610e2e565b333014611481576040516282b42960e81b815260040160405180910390fd5b83806114a057604051638707510560e01b815260040160405180910390fd5b6114a985612aeb565b156114c75760405163f2fee1e160e01b815260040160405180910390fd5b5f6114d186612b77565b60010190506114e281866040612f06565b506001600160a01b0385165f90815260018201602052604090206115288560068111156115115761151161507b565b8254600160ff9092169190911b8082178455161590565b505f816001015f8760068111156115415761154161507b565b60ff1681526020019081526020015f2090505f61155d82612f42565b868152905061156c8282612f8c565b7f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a898989896040516115a19493929190615acc565b60405180910390a1505050505050505050565b5f806115d08460408051828152600190920160051b8201905290565b90505f5b84811015611670575f5f365f6115eb8a8a87612fd1565b92965090945092509050611660856116517f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876116328888613003565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b50505050508060010190506115d4565b5061c1d060f084901c145f6116ca7f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b9050816116df576116da81613014565b6112fa565b6112fa81612bef565b333014611707576040516282b42960e81b815260040160405180910390fd5b5f83815268448e3efef2f6a7f2f9602052604090205460ff1661173d5760405163395ed8c160e21b815260040160405180910390fd5b611756828261020061174e87612c63565b92919061312a565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc9983604051611795911515815260200190565b60405180910390a3505050565b600f60f81b6060805f8080836117b6613145565b97989097965046955030945091925090565b60605f6117d483612b77565b60030190506117e281613188565b6001600160401b038111156117f9576117f9615579565b60405190808252806020026020018201604052801561183d57816020015b604080518082019091525f80825260208201528152602001906001900390816118175790505b5091505f5b82518110156118a9576118558282613192565b84838151811061186757611867615a91565b60200260200101515f0185848151811061188357611883615a91565b6020908102919091018101516001600160a01b0393841691015291169052600101611842565b5050919050565b3330146118cf576040516282b42960e81b815260040160405180910390fd5b6001600160a01b0381166118f657604051634adebaa360e11b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c525190555f611931613145565b915061198d90507f0a9f35b227e9f474cb86caa2e9b62847626fede22333cf52c7abea325d2eaa35611987610f3960017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615a5b565b906131cc565b306317e69ab861199c836131d3565b6040518263ffffffff1660e01b81526004016119ba91815260200190565b6020604051808303815f875af11580156119d6573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906119fa9190615afe565b611a02575f5ffd5b5050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611a4e576040516282b42960e81b815260040160405180910390fd5b611a6568448e3efef2f6a7f2f65b600101826131fb565b50565b5f61133782602001516003811115611a8257611a8261507b565b60ff168360600151805190602001205f1c5f9182526020526040902090565b6060611337611aaf83612c63565b613212565b333014611ad3576040516282b42960e81b815260040160405180910390fd5b611ae668448e3efef2f6a7f2f7826132e6565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b333014611b3b576040516282b42960e81b815260040160405180910390fd5b611b4481613350565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b03811115611b8d57611b8d615579565b604051908082528060200260200182016040528015611bc057816020015b6060815260200190600190039081611bab5790505b509250806001600160401b03811115611bdb57611bdb615579565b604051908082528060200260200182016040528015611c0e57816020015b6060815260200190600190039081611bf95790505b5091505f5b81811015611c9f57611c3c868683818110611c3057611c30615a91565b90506020020135611e34565b848281518110611c4e57611c4e615a91565b6020026020010181905250611c7a868683818110611c6e57611c6e615a91565b90506020020135611ff8565b838281518110611c8c57611c8c615a91565b6020908102919091010152600101611c13565b50509250929050565b5f80611cd6611cc560015f516020615c625f395f51905f52615a5b565b604080516020810190915290815290565b9050611ce181515c90565b5f03611cee57505f919050565b611cf7816133bb565b91505090565b333014611d1c576040516282b42960e81b815260040160405180910390fd5b611d6482828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250611d5e9250612a78915050565b906133db565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611d95929190615b41565b60405180910390a15050565b6060611db568448e3efef2f6a7f2f6612a85565b905090565b5f333014611dda576040516282b42960e81b815260040160405180910390fd5b611de382613433565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611e15919061510a565b60405180910390a2919050565b5f611e2c826134d5565b151592915050565b60605f611e4083612b77565b6001019050611e5b6040518060200160405280606081525090565b5f611e658361351e565b90505f5b81811015611fee575f611e7c858361356f565b6001600160a01b0381165f9081526001870160205260408120919250611ea1826135c8565b90505f5b8151811015611fdf575f828281518110611ec157611ec1615a91565b602002602001015190505f611eea856001015f8460ff1681526020019081526020015f20612f42565b9050611f276040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166006811115611f3c57611f3c61507b565b81602001906006811115611f5257611f5261507b565b90816006811115611f6557611f6561507b565b9052506001600160a01b03871681528151604080830191909152820151608082015260208201516060820152611faa4260ff851660068111156108c3576108c361507b565b60c08201819052608082015160608301519111150260a082015280611fcf8b82613621565b5050505050806001019050611ea5565b50505050806001019050611e69565b5050519392505050565b606061133761200683612b77565b6136ca565b5f612015846134d5565b9050806003036120305761202a848484613783565b50505050565b365f365f8461204657637f1812755f526004601cfd5b5085358087016020810194503592505f90604011600286141115612074575050602080860135860190810190355b6120838888888787878761381b565b5050505050505050565b813580830190604081901c6020841017156120a6575f5ffd5b5061211b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614612112306120e7602086018661555e565b6001600160a01b03161430612102608087016060880161555e565b6001600160a01b03161417151590565b15159015151690565b612137576040516282b42960e81b815260040160405180910390fd5b30612148608083016060840161555e565b6001600160a01b0316036121a5575f8061216a866102cf610240860186615b54565b975091508690506001600160c01b0332311061218557600191505b816121a2576040516282b42960e81b815260040160405180910390fd5b50505b6121d06121b860a083016080840161555e565b6121ca6102208401610200850161555e565b88613a33565b8415806121e157506121e185612aeb565b61223d575f6121ef86612b77565b60018101915061223b906002015f61220d60a086016080870161555e565b6001600160a01b0316815260208101919091526040015f2061223560a085016080860161555e565b89613a5b565b505b505050505050565b5f808260068111156122595761225961507b565b0361226c57603c808404025b9050611337565b60018260068111156122805761228061507b565b0361229157610e1080840402612265565b60028260068111156122a5576122a561507b565b036122b7576201518080840402612265565b60038260068111156122cb576122cb61507b565b036122f1576007600362015180808604918201929092069003620545ff85110202612265565b5f5f6122fc85613b80565b50909250905060048460068111156123165761231661507b565b036123305761232782826001613c2a565b92505050611337565b60058460068111156123445761234461507b565b036123555761232782600180613c2a565b60068460068111156123695761236961507b565b0361237957600192505050611337565b5f5ffd5b5f611db568448e3efef2f6a7f2f8613c81565b5f8461239e5750600161265c565b6123a785612aeb565b156123b45750600161265c565b631919191960e11b600483106123c8575082355b826123d75750630707070760e51b5b6123e18582612b4f565b156123ef575f91505061265c565b5f6123f987612b77565b905061240481613c81565b156124c15761241f60e083901c606088901b175b8290613ccd565b1561242f5760019250505061265c565b6124426332323232606088901b17612418565b156124525760019250505061265c565b61247860e083901c73191919191919191919191919191919191919191960611b17612418565b156124885760019250505061265c565b6124b17f3232323232323232323232323232323232323232000000000000000032323232612418565b156124c15760019250505061265c565b6124d75f516020615c425f395f51905f52612b77565b90506124e281613c81565b1561259c576124fa60e083901c606088901b17612418565b1561250a5760019250505061265c565b61251d6332323232606088901b17612418565b1561252d5760019250505061265c565b61255360e083901c73191919191919191919191919191919191919191960611b17612418565b156125635760019250505061265c565b61258c7f3232323232323232323232323232323232323232000000000000000032323232612418565b1561259c5760019250505061265c565b6125aa878888898989613d51565b156125ba5760019250505061265c565b6125dc8788733232323232323232323232323232323232323232898989613d51565b156125ec5760019250505061265c565b6126075f516020615c425f395f51905f528888808989613d51565b156126175760019250505061265c565b6126465f516020615c425f395f51905f5288733232323232323232323232323232323232323232898989613d51565b156126565760019250505061265c565b5f925050505b949350505050565b5f604051826040811461267f57604181146126a657506126d7565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526126b7565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d6126e4575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d610fa957fe5b5f6040518681528560208201528460408201528360608201528260808201525f5f5260205f60a0836101005afa503d612769576d1ab2e8006fd8b71907bf06a5bdee3b6127695760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa61276957fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6127d36040518060c0016040528060608152602001606081526020015f81526020015f81526020015f81526020015f81525090565b815160c081106128805760208301818101818251018281108260c083011117156127ff57505050612880565b80815101925080602082015101818110838211178285108486111717156128295750505050612880565b828151602083010111838551602087010111171561284a5750505050612880565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f5f5f61289588600180613dff565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561297957602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061297957fe5b505050821561299a576129978287608001518860a001518888612705565b92505b505095945050505050565b5f6001600160a01b0385161561265c57604051853b612a355782604081146129d557604181146129fc5750612a6f565b60208581013560ff81901c601b0190915285356040526001600160ff1b0316606052612a0d565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f60605280604052612a6f565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b68448e3efef2f6a7f2f690565b60405181546020820190600881901c5f8260ff841714612ab357505080825260ff8116601f80821115612ad5575b855f5260205f205b8160051c81015482860152602082019150828210612abb57505b508084525f920191825250602001604052919050565b5f81815268448e3efef2f6a7f2f960205260408120805460ff808216908114801590910260089290921c021780612b355760405163395ed8c160e21b815260040160405180910390fd5b612b42825f198301613ef0565b60ff161515949350505050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f516020615c425f395f51905f528314612b9b57612b9683613f5d565b612baa565b5f516020615c425f395f51905f525b68b11ddb8fabd886bebb6009525f908152602990209392505050565b5f82612bdb57612bd68585613f8a565b612be6565b612be6858584614088565b95945050505050565b5f5f5f612bfa613145565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b5f81815268448e3efef2f6a7f2fa602052604081208054601f5263d4203f8b6004528152603f81208190610ee0565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612ccd5763f5a267f15f526004601cfd5b82612cdf5768fbb67fda52d4bfb8bf92505b80546001600160601b038116612d235760019250838160601c0315612d3457600182015460601c8414612d3457600282015460601c8414612d34575b5f9250612d34565b81602052835f5260405f2054151592505b505092915050565b5f815d50565b5f81545b801561288057600191820191811901811618612d46565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612d985763f5a267f15f526004601cfd5b82612daa5768fbb67fda52d4bfb8bf92505b80546001600160601b03811680612e245760019350848260601c03612de25760018301805484556002840180549091555f9055612e89565b84600184015460601c03612e035760028301805460018501555f9055612e89565b84600284015460601c03612e1c575f6002840155612e89565b5f9350612e89565b82602052845f5260405f20805480612e3d575050612e89565b60018360011c039250826001820314612e6d578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612ebc83613c81565b821061133757604051634e23d03560e01b815260040160405180910390fd5b5f82612ef057612eeb86866140a5565b612efc565b612efc868686856140d6565b9695505050505050565b5f612f118484614111565b90508015610ee05781612f238561351e565b1115610ee05760405163155176b960e11b815260040160405180910390fd5b612f6360405180606001604052805f81526020015f81526020015f81525090565b5f612f6d83612a85565b905080515f14612880575f612f818261426c565b602001949350505050565b60408051825160208083019190915283015181830152908201516060820152611a02908390612fcc906080016040516020818303038152906040526143b8565b6133db565b60051b82013590910180356001600160a01b031680153002179260208083013593506040830135909201918201913590565b5f8183604051375060405120919050565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f00000000000000000000000000000000000000000000000000000000000000004614166131075750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f8261313a57612bd68585612d5d565b612be6858584612f06565b604080518082018252600d81526c125d1a1858d85058d8dbdd5b9d609a1b6020808301919091528251808401909352600583526418171a971960d91b9083015291565b5f6113378261351e565b5f8060018401816131a3868661356f565b6001600160a01b038082168352602083019390935260409091015f205490969116945092505050565b80825d5050565b8051602181106131ea5763ec92f9a35f526004601cfd5b9081015160209190910360031b1b90565b5f5f61320784846145e5565b600101905550505050565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c92508383141583028152816132a057821561329b57600191508185015460601c9250821561329b578284141590920260208301525060028381015460601c91821561329b576003915083831415830260408201525b6132d0565b600191821c915b828110156132ce578581015460601c858114158102600583901b84015293506001016132a7565b505b8186528160051b81016040525050505050919050565b604081811c5f90815260208490522080546001600160401b0383161015613320576040516312ee5c9360e01b815260040160405180910390fd5b61334a613344836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f81815268448e3efef2f6a7f2f96020908152604080832083905568448e3efef2f6a7f2fa90915290208054600101905568448e3efef2f6a7f2f661339e68448e3efef2f6a7f2f883613f8a565b611a025760405163395ed8c160e21b815260040160405180910390fd5b80515f90805c806133d35763bc7ec7795f526004601cfd5b015c92915050565b80518060081b60ff175f60fe8311613404575050601f8281015160081b8217908083111561342b575b60208401855f5260205f205b828201518360051c8201556020830192508483106134105750505b509092555050565b5f8160400151156134685761344b826020015161462b565b613468576040516321b9b33960e21b815260040160405180910390fd5b61347182611a68565b90505f68448e3efef2f6a7f2f66060840151845160208087015160408089015190519596506134c8956134a695949301615b96565b60408051601f198184030181529181525f8581526003850160205220906133db565b6118a96002820183614647565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c1517613567576001935083830154156135675760029350838301541561356757600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf821415820291506135a28461351e565b83106135c157604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b801561360b5761ffff81166135f0576010918201911c6135d5565b8183526020600582901b16909201916001918201911c6135d5565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c5536020840351818106158282040290508083106136b95782811781018115826020018701604051181761368557828102601f1987015285016020016040526136b9565b602060405101816020018101604052808a52601f19855b888101518382015281018061369c57509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf906020840181613743578354801561373d5780841415028152600184810154909250801561373d5780841415026020820152600284810154909250801561373d576003925083811415810260408301525b5061376e565b8160011c91505f5b8281101561376c57848101548481141502600582901b83015260010161374b565b505b8185528160051b810160405250505050919050565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c17156137c857633995943b5f526004601cfd5b505f5b83811461223b57365f8260051b850135808601602081019350803592505084828401118160401c171561380557633995943b5f526004601cfd5b5061381189838361200b565b50506001016137cb565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001633036138e1576020811461386c5760405163438e981560e11b815260040160405180910390fd5b60408051602081019091528235906138a19082908061389960015f516020615c625f395f51905f52615a5b565b905290614759565b6138ac858583614773565b60408051602081019091526138db90806138d460015f516020615c625f395f51905f52615a5b565b9052614c3c565b5061223b565b8061391557333014613905576040516282b42960e81b815260040160405180910390fd5b61391084845f614773565b61223b565b60208110156139375760405163438e981560e11b815260040160405180910390fd5b813561394b68448e3efef2f6a7f2f6611a5c565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f5f6139a861398e8888866115b4565b602080871081881802188088019080880390881102610923565b91509150816139c9576040516282b42960e81b815260040160405180910390fd5b6139f481604051806020016040528060015f516020615c625f395f51905f525f1c6138999190615a5b565b6139ff878783614773565b6040805160208101909152613a2790806138d460015f516020615c625f395f51905f52615a5b565b50505050505050505050565b6001600160a01b038316613a5057613a4b8282614c5d565b505050565b613a4b838383614c76565b80613a6557505050565b5f613a6f846135c8565b905080515f03613a9257604051635ee7e5b160e01b815260040160405180910390fd5b5f5b8151811015613b79575f828281518110613ab057613ab0615a91565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f613add82612f42565b90505f613af9428560ff1660068111156108c3576108c361507b565b90508082604001511015613b1557604082018190525f60208301525b815f01518783602001818151613b2b9190615be5565b9150818152501115613b605760405163482a648960e11b81526001600160a01b03891660048201526024015b60405180910390fd5b613b6a8383612f8c565b50505050806001019050613a94565b5050505050565b5f8080613c1d613b936201518086615bf8565b5f5f5f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c9250806118a95781545f9350156118a9576001925082820154156118a9576002925082820154156118a9575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613cfa5763f5a267f15f526004601cfd5b82613d0c5768fbb67fda52d4bfb8bf92505b801954613d3d5780546001925083146135c157600181015483146135c157600281015483146135c1575f91506135c1565b602052505f90815260409020541515919050565b5f5f5f613d6a87613d618b612b77565b60030190614cc0565b915091508115613df1576040516001629e639560e01b031981526001600160a01b0382169063ff619c6b90613da9908b908a908a908a90600401615c17565b602060405180830381865afa158015613dc4573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190613de89190615afe565b92505050612efc565b505f98975050505050505050565b6060835180156126e4576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613e7a579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f82548060ff821714613f3857601e8311613f0f5780831a91506135c1565b8060ff168311613f3357835f52601f83038060051c60205f200154601f82161a9250505b6135c1565b8060081c83116135c157835f528260051c60205f200154601f84161a91505092915050565b5f81815268448e3efef2f6a7f2fa602052604081208054601f5263d4203f8b6004528152603f8120611337565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613fb75763f5a267f15f526004601cfd5b82613fc95768fbb67fda52d4bfb8bf92505b8019548061402a576001925083825403613ff65760018201805483556002830180549091555f9055612d34565b836001830154036140145760028201805460018401555f9055612d34565b83600283015403612d1b575f6002830155612d34565b81602052835f5260405f20805480614043575050612d34565b60018360011c03925082600182031461406d57828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f6140938484614647565b90508015610ee05781612f2385613c81565b6001600160a01b0381165f908152600183016020526040812080546001600160a01b0319169055610ee08383612d5d565b6001600160a01b038381165f908152600186016020526040812080546001600160a01b03191692851692909217909155612be6858584612f06565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be19830161414c5763f5a267f15f526004601cfd5b8261415e5768fbb67fda52d4bfb8bf92505b80546001600160601b0381168260205280614220578160601c8061418c578560601b84556001945050612e89565b8581036141995750612e89565b600184015460601c806141ba578660601b6001860155600195505050612e89565b8681036141c8575050612e89565b600285015460601c806141ea578760601b600287015560019650505050612e89565b8781036141f957505050612e89565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f20805461426257600191821c80830182559194508161424e578560601b600317845550612e89565b8560601b8285015582600201845550612e89565b5050505092915050565b6060815115610fa9576040519050600482018051835184602001017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f6020850183198552866020015b8051805f1a61430d57600190811a01608081116142ed5760028201915080368437918201918482106142e7575061439a565b506142b5565b5f198352918201607f190191600291909101908482106142e7575061439a565b80835283811684011783171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f8601f6f8421084210842108cc6318c6db6d54be660204081020408185821060071b86811c6001600160401b031060061b1795861c0260181a1c161a90911860031c0191820191018381106142b5578381111561439a57838103820391505b509290935250601f198382030183525f815260200160405250919050565b6060614410565b6fffffffffffffffffffffffffffffffff811160071b81811c6001600160401b031060061b1781811c63ffffffff1060051b1781811c61ffff1060041b1790811c60ff1060039190911c17601f1890565b50604051815182017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f60208301845b8381146145c157600101805160ff16806144c9575b6020820151806144985782860360208181189082110218607f839003818111818318021893840193928301929050601f81116144915750506144b9565b5050614454565b6144a1816143bf565b90508286038181118183180218928301929190910190505b60f01b825260029091019061443f565b60ff810361451c576020808301511980156144ea576144e7816143bf565b91505b508286038181118282180218601f81811890821102186080811760f01b855260029094019392909201915061443f9050565b80835350602081015160018381018290528482168501821791198581168601179190911684171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f86f8421084210842108cc6318c6db6d54be660204081020408184821060071b85811c6001600160401b031060061b1794851c0260181a1c601f161a90911860031c01828603818111918118919091021892830101910161443f565b50600484018051199052601f198482030184525f8152602001604052509092915050565b604081811c5f90815260208490522080546001600160401b0380841682149082101661462457604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f8082600381111561463f5761463f61507b565b141592915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036146745763f5a267f15f526004601cfd5b826146865768fbb67fda52d4bfb8bf92505b801954816020528061472a578154806146a6578483556001935050612d34565b8481036146b35750612d34565b6001830154806146ce57856001850155600194505050612d34565b8581036146dc575050612d34565b6002840154806146f85786600286015560019550505050612d34565b86810361470757505050612d34565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f208054612e8957600191821c8381018690558083019182905590821b8217831955909250612d34565b5f825f015190506001815c01828183015d80825d50505050565b801580614784575061478481612aeb565b1561479457613a4b838383614cfa565b5f61479e82612b77565b600101905061480c6040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f6148168361351e565b90505f5b81811015614868575f61482d858361356f565b90506001600160a01b0381161561485f57604084015161484d9082614d44565b50606084015161485d905f613621565b505b5060010161481a565b505f5f5b86811015614a59575f5f365f6148838c8c87612fd1565b9350935093509350825f1461489f5761489c8387615be5565b95505b60048110156148b15750505050614a51565b813560e01c63a9059cbb8190036148e85760408901516148d19086614d44565b506148e660248401355b60608b015190614d63565b505b8063ffffffff166323b872dd0361494b573060248401356001600160a01b031603614917575050505050614a51565b60448301355f0361492c575050505050614a51565b604089015161493b9086614d44565b5061494960448401356148db565b505b8063ffffffff1663095ea7b3036149b15760248301355f03614971575050505050614a51565b885161497d9086614d44565b50614991600484013560208b015190614d44565b5060408901516149a19086614d44565b506149af60248401356148db565b505b8063ffffffff166387517c4503614a4b576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba3146149eb575050505050614a51565b60448301355f03614a00575050505050614a51565b614a13600484013560808b015190614d44565b50614a27602484013560a08b015190614d44565b50614a3b600484013560408b015190614d44565b50614a4960448401356148db565b505b50505050505b60010161486c565b50604083015151606084015151614a709190614d79565b5f614aa3614a818560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b60408501515151811015614aef57604085015151600582901b0160200151614ae582614ad38330614ebc565b85919060059190911b82016020015290565b5050600101614aa7565b50614afb888888614cfa565b5f8080526001860160205260408120614b149184613a5b565b5f5b84515151811015614b5857845151600582901b0160200151614b4f81614b49848960200151614eac90919063ffffffff16565b5f614ee6565b50600101614b16565b505f5b60808501515151811015614ba257608085015151600582901b0160200151614b9981614b94848960a00151614eac90919063ffffffff16565b614f26565b50600101614b5b565b505f5b60408501515151811015614c3157604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b018352939093206060890151518301820151928601909101519091614c279183918591614c229190614c1790614c0e8930614ebc565b80821191030290565b808218908210021890565b613a5b565b5050600101614ba5565b505050505050505050565b8051805c80614c525763bc7ec7795f526004601cfd5b60018103825d505050565b5f385f3884865af1611a025763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416614cb657803d853b151710614cb6576390b8ec185f526004601cfd5b505f603452505050565b6001600160a01b038181165f90815260018401602052604081205490911680151580614cf15750614cf18484614f81565b91509250929050565b5f82614d065750505050565b5f5f365f614d15888887612fd1565b9350935093509350614d2a848484848a614f8c565b50505050838390508160010191508103614d065750505050565b604080516060815290819052610ee083836001600160a01b0316613621565b604080516060815290819052610ee08383613621565b614e06565b805181602083015b8281511015614db257805160209290920180518252918252614db2868301878301805182519091529052565b602001848110614d8657508251815184528152614dd9858201868501805182519091529052565b808360400111614dee57614dee858285614d7e565b838160600111613b7957613b79858560208401614d7e565b805180835114614e2257634e487b715f5260326020526024601cfd5b60028110613a4b57828203602084018260051b8101614e42838284614d7e565b82820151604087015b8051845114614e675781858501525f9150602084019350805184525b8085015191820191821015614e8857634e487b715f5260116020526024601cfd5b602081019050828103614e4b57509282019290925284900360051c93849052505052565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f511416614cb657803d853b151710614cb657633e3f8f735f526004601cfd5b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af1613a4b576396b3de235f526004601cfd5b5f610ee08383612c92565b614f9881868585612390565b614fbd578085848460405163f78c1b5360e01b8152600401613b579493929190615c17565b613b798585858585604051828482375f388483888a5af161223d573d5f823e3d81fd5b5f5f83601f840112614ff0575f5ffd5b5081356001600160401b03811115615006575f5ffd5b602083019150836020828501011115614624575f5ffd5b5f5f5f6040848603121561502f575f5ffd5b8335925060208401356001600160401b0381111561504b575f5ffd5b61505786828701614fe0565b9497909650939450505050565b5f60208284031215615074575f5ffd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f6020820151600481106150de576150de61507b565b8060208501525060408201511515604084015260608201516080606085015261265c608085018261508f565b602081525f610ee060208301846150bd565b6001600160a01b0381168114611a65575f5ffd5b8015158114611a65575f5ffd5b8035610fa981615130565b5f5f5f5f6080858703121561515b575f5ffd5b84359350602085013561516d8161511c565b925060408501356001600160e01b031981168114615189575f5ffd5b9150606085013561519981615130565b939692955090935050565b803560078110610fa9575f5ffd5b5f5f5f606084860312156151c4575f5ffd5b8335925060208401356151d68161511c565b91506151e4604085016151a4565b90509250925092565b5f8151808452602084019350602083015f5b8281101561521d5781518652602095860195909101906001016151ff565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561527e57605f198786030184526152698583516150bd565b9450602093840193919091019060010161524d565b505050508281036020840152612be681856151ed565b5f5f5f5f5f606086880312156152a8575f5ffd5b8535945060208601356001600160401b038111156152c4575f5ffd5b6152d088828901614fe0565b90955093505060408601356001600160401b038111156152ee575f5ffd5b6152fa88828901614fe0565b969995985093965092949392505050565b5f6020828403121561531b575f5ffd5b81356001600160c01b0381168114610ee0575f5ffd5b5f5f5f60608486031215615343575f5ffd5b8335925060208401356153558161511c565b915060408401356153658161511c565b809150509250925092565b5f5f5f5f60808587031215615383575f5ffd5b8435935060208501356153958161511c565b92506153a3604086016151a4565b9396929550929360600135925050565b5f5f83601f8401126153c3575f5ffd5b5081356001600160401b038111156153d9575f5ffd5b6020830191508360208260051b8501011115614624575f5ffd5b5f5f5f60408486031215615405575f5ffd5b83356001600160401b0381111561541a575f5ffd5b615426868287016153b3565b909790965060209590950135949350505050565b5f5f5f6060848603121561544c575f5ffd5b83359250602084013561545e8161511c565b9150604084013561536581615130565b60ff60f81b8816815260e060208201525f61548c60e083018961508f565b828103604084015261549e818961508f565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b818110156154f35783518352602093840193909201916001016154d5565b50909b9a5050505050505050505050565b602080825282518282018190525f918401906040840190835b8181101561555357835180516001600160a01b03908116855260209182015116818501529093019260409092019160010161551d565b509095945050505050565b5f6020828403121561556e575f5ffd5b8135610ee08161511c565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b03811182821017156155af576155af615579565b60405290565b5f82601f8301126155c4575f5ffd5b81356001600160401b038111156155dd576155dd615579565b604051601f8201601f19908116603f011681016001600160401b038111828210171561560b5761560b615579565b604052818152838201602001851015615622575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f6020828403121561564e575f5ffd5b81356001600160401b03811115615663575f5ffd5b820160808185031215615674575f5ffd5b61567c61558d565b813564ffffffffff81168114615690575f5ffd5b81526020820135600481106156a3575f5ffd5b60208201526156b46040830161513d565b604082015260608201356001600160401b038111156156d1575f5ffd5b6156dd868285016155b5565b606083015250949350505050565b602080825282518282018190525f918401906040840190835b818110156155535783516001600160a01b0316835260209384019390920191600101615704565b5f5f6020838503121561573c575f5ffd5b82356001600160401b03811115615751575f5ffd5b61575d858286016153b3565b90969095509350505050565b600781106157795761577961507b565b9052565b5f8151808452602084019350602083015f5b8281101561521d57815180516001600160a01b031687526020808201515f916157ba908a0182615769565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e0909501946020919091019060010161578f565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561585a57605f1987860301845261584585835161577d565b94506020938401939190910190600101615829565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b838110156158b357601f1986840301855261589d8383516151ed565b6020958601959093509190910190600101615881565b509098975050505050505050565b5f5f602083850312156158d2575f5ffd5b82356001600160401b038111156158e7575f5ffd5b61575d85828601614fe0565b602081525f610ee0602083018461508f565b602081525f610ee0602083018461577d565b602081525f610ee060208301846151ed565b5f5f5f5f5f6080868803121561593d575f5ffd5b85359450602086013593506040860135925060608601356001600160401b038111156152ee575f5ffd5b5f5f60408385031215615978575f5ffd5b82359150615988602084016151a4565b90509250929050565b5f5f5f5f606085870312156159a4575f5ffd5b8435935060208501356159b68161511c565b925060408501356001600160401b038111156159d0575f5ffd5b6159dc87828801614fe0565b95989497509550505050565b5f602082840312156159f8575f5ffd5b8151610ee08161511c565b805160208201516bffffffffffffffffffffffff198116919060148210156118a9576bffffffffffffffffffffffff1960149290920360031b82901b161692915050565b634e487b7160e01b5f52601160045260245ffd5b8181038181111561133757611337615a47565b8381526001600160a01b03831660208201526060810161265c6040830184615769565b634e487b7160e01b5f52603260045260245ffd5b5f60018201615ab657615ab6615a47565b5060010190565b818382375f9101908152919050565b8481526001600160a01b038416602082015260808101615aef6040830185615769565b82606083015295945050505050565b5f60208284031215615b0e575f5ffd5b8151610ee081615130565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f61265c602083018486615b19565b5f5f8335601e19843603018112615b69575f5ffd5b8301803591506001600160401b03821115615b82575f5ffd5b602001915036819003821315614624575f5ffd5b5f85518060208801845e60d886901b6001600160d81b03191690830190815260048510615bc557615bc561507b565b60f894851b600582015292151590931b6006830152506007019392505050565b8082018082111561133757611337615a47565b5f82615c1257634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f90612efc9083018486615b1956fe3232323232323232323232323232323232323232323232323232323232323232def24cb3236edf62937b12ea8dc676927599974e90729c6e9eafa9f05b03eab8a26469706673582212206f37d858535574e85fcfd23046e1f1d4e60d212c33693798ca736032febac99064736f6c634300081c0033" as const;


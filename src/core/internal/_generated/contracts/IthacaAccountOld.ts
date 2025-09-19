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
        "internalType": "struct IthacaAccountOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccountOld.KeyType"
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
        "internalType": "struct IthacaAccountOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccountOld.KeyType"
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
        "internalType": "struct IthacaAccountOld.Key[]",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccountOld.KeyType"
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
        "internalType": "struct IthacaAccountOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccountOld.KeyType"
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
        "internalType": "struct IthacaAccountOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccountOld.KeyType"
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
        "internalType": "struct IthacaAccountOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum IthacaAccountOld.KeyType"
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
    "name": "PaymasterNonceError",
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

export const code = "0x610140604052604051615cc9380380615cc9833981016040819052610023916100e9565b306080524660a052606080610074604080518082018252600d81526c125d1a1858d85058d8dbdd5b9d609a1b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610116565b5f602082840312156100f9575f5ffd5b81516001600160a01b038116811461010f575f5ffd5b9392505050565b60805160a05160c05160e0516101005161012051615b576101725f395f81816107800152818161194901528181611fed015261377f01525f612f3001525f612fea01525f612fc401525f612f7401525f612f510152615b575ff3fe60806040526004361061026a575f3560e01c80638e87cf4711610143578063cb4774c4116100b5578063e9ae5c5311610079578063e9ae5c5314610859578063f81d87a71461086c578063faba56d81461088b578063fac750e0146108aa578063fcd4e707146108be578063ff619c6b146108e657610271565b8063cb4774c4146107a2578063cebfe336146107c3578063d03c7914146107e2578063dcc09ebf14610801578063e5adda711461082d57610271565b8063b70e36f011610107578063b70e36f0146106d1578063b75c7dc6146106f0578063bc2c554a1461070f578063be766d151461073c578063bf53096914610750578063c885f95a1461076f57610271565b80638e87cf4714610628578063912aa1b8146106545780639e49fbf114610673578063a840fe4914610686578063ad077083146106a557610271565b80632f3f30c7116101dc57806357022451116101a05780635702245114610552578063598daac41461057157806360d2f33d146105905780636fd91454146105c35780637656d304146105e257806384b0196e1461060157610271565b80632f3f30c7146104c057806335058501146104da5780633e1b0812146104f45780634223b5c214610513578063515c9d6d1461053257610271565b806317e69ab81161022e57806317e69ab8146103a95780631a912f3e146103d857806320606b70146104195780632081a2781461044c5780632150c5181461046b5780632f1d14cb1461048d57610271565b80630cef73b4146102aa57806311a86fd6146102e557806312aaac7014610324578063136a12f7146103505780631626ba7e1461037157610271565b3661027157005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a028214171561029c57806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102b5575f5ffd5b506102c96102c4366004614f5b565b610905565b6040805192151583526020830191909152015b60405180910390f35b3480156102f0575f5ffd5b5061030c73323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102dc565b34801561032f575f5ffd5b5061034361033e366004614fa2565b610bb4565b6040516102dc9190615048565b34801561035b575f5ffd5b5061036f61036a366004615086565b610ca3565b005b34801561037c575f5ffd5b5061039061038b366004614f5b565b610dcd565b6040516001600160e01b031990911681526020016102dc565b3480156103b4575f5ffd5b506103c86103c3366004614fa2565b610eb2565b60405190151581526020016102dc565b3480156103e3575f5ffd5b5061040b7f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102dc565b348015610424575f5ffd5b5061040b7f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b348015610457575f5ffd5b5061036f6104663660046150f0565b610f79565b348015610476575f5ffd5b5061047f6110c8565b6040516102dc929190615165565b348015610498575f5ffd5b5061040b7feff7fda3af271797e53f62724a17c2e5c118cf95ac65e8274759fcfff97bf1fe81565b3480156104cb575f5ffd5b50610390630707070760e51b81565b3480156104e5575f5ffd5b50610390631919191960e11b81565b3480156104ff575f5ffd5b5061040b61050e3660046151d2565b611232565b34801561051e575f5ffd5b5061034361052d366004614fa2565b61126a565b34801561053d575f5ffd5b5061040b5f516020615b175f395f51905f5281565b34801561055d575f5ffd5b5061036f61056c3660046151f8565b6112a2565b34801561057c575f5ffd5b5061036f61058b366004615237565b61138f565b34801561059b575f5ffd5b5061040b7f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b3480156105ce575f5ffd5b5061040b6105dd3660046152ba565b6114e1565b3480156105ed575f5ffd5b5061036f6105fc366004615301565b611620565b34801561060c575f5ffd5b506106156116da565b6040516102dc9796959493929190615335565b348015610633575f5ffd5b50610647610642366004614fa2565b611700565b6040516102dc91906153cb565b34801561065f575f5ffd5b5061036f61066e366004615425565b6117e8565b61036f610681366004614fa2565b61193e565b348015610691575f5ffd5b5061040b6106a0366004615505565b6119a0565b3480156106b0575f5ffd5b506106c46106bf366004614fa2565b6119d9565b6040516102dc91906155b2565b3480156106dc575f5ffd5b5061036f6106eb366004614fa2565b6119ec565b3480156106fb575f5ffd5b5061036f61070a366004614fa2565b611a54565b34801561071a575f5ffd5b5061072e6107293660046155f2565b611aa9565b6040516102dc9291906156ca565b348015610747575f5ffd5b5061040b611be0565b34801561075b575f5ffd5b5061036f61076a366004615788565b611c35565b34801561077a575f5ffd5b5061030c7f000000000000000000000000000000000000000000000000000000000000000081565b3480156107ad575f5ffd5b506107b6611cd9565b6040516102dc91906157ba565b3480156107ce575f5ffd5b5061040b6107dd366004615505565b611cf2565b3480156107ed575f5ffd5b506103c86107fc366004614fa2565b611d5a565b34801561080c575f5ffd5b5061082061081b366004614fa2565b611d6c565b6040516102dc91906157cc565b348015610838575f5ffd5b5061084c610847366004614fa2565b611f30565b6040516102dc91906157de565b61036f610867366004614f5b565b611f43565b348015610877575f5ffd5b5061036f6108863660046157f0565b611fc5565b348015610896575f5ffd5b5061040b6108a536600461584b565b6121d3565b3480156108b5575f5ffd5b5061040b61230b565b3480156108c9575f5ffd5b506108d361c1d081565b60405161ffff90911681526020016102dc565b3480156108f1575f5ffd5b506103c8610900366004615875565b61231e565b5f80602183101561091a57505f905080610bac565b6041831460408414171561094857306109348686866125f2565b6001600160a01b03161491505f9050610bac565b506020198281018381118185180281189385019182013591601f19013560ff1615610979576109768661267a565b95505b505f61098482610bb4565b805190915064ffffffffff1642811090151516156109a5575f925050610bac565b5f816020015160038111156109bc576109bc614fb9565b03610a17575f80603f86118735810290602089013502915091505f5f6109fb856060015180516020820151604090920151603f90911191820292910290565b91509150610a0c8a85858585612693565b965050505050610baa565b600181602001516003811115610a2f57610a2f614fb9565b03610ab457606081810151805160208083015160409384015184518084018d9052855180820385018152601f8c018590049094028101870186529485018a8152603f9490941091820295910293610aab935f92610aa4928d918d918291018382808284375f9201919091525061272c92505050565b8585612814565b94505050610baa565b600281602001516003811115610acc57610acc614fb9565b03610afb57610af48160600151806020019051810190610aec91906158cc565b878787612933565b9250610baa565b600381602001516003811115610b1357610b13614fb9565b03610baa57806060015151602014610b3e5760405163145a1fdd60e31b815260040160405180910390fd5b5f8160600151610b4d906158e7565b60601c9050604051638afc93b48152876020820152836040820152606080820152856080820152858760a08301375f5f526084860160205f82601c8501865afa915050638afc93b45f5160e01c14811615610ba757600194505b50505b505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f82815268448e3efef2f6a7f2f960205260408120610bf490612a13565b8051909150610c165760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610c2a8383016020015190565b60d881901c855260c881901c915060d01c60ff166003811115610c4f57610c4f614fb9565b84602001906003811115610c6557610c65614fb9565b90816003811115610c7857610c78614fb9565b90525060ff811615156040850152610c9583838151811082025290565b606085015250919392505050565b333014610cc2576040516282b42960e81b815260040160405180910390fd5b8380610ce157604051638707510560e01b815260040160405180910390fd5b5f516020615b175f395f51905f528514610d1c57610cfe85612a79565b15610d1c57604051630442081560e01b815260040160405180910390fd5b610d268484612add565b15610d44576040516303a6f8c760e21b815260040160405180910390fd5b610d6760e084901c606086901b1783610800610d5f89612b05565b929190612b54565b50604080518681526001600160a01b03861660208201526001600160e01b031985169181019190915282151560608201527f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e1906080015b60405180910390a15050505050565b5f5f610e027feff7fda3af271797e53f62724a17c2e5c118cf95ac65e8274759fcfff97bf1fe865f9182526020526040902090565b604080517f035aff83d86937d35b32e04f0ddc6ff469290eef2f1b692d8a815c89404d47495f908152306020908152838220905261190190528282526042601e20915290915094505f5f610e57878787610905565b90925090508115158115151615610e8d57610e7181612a79565b80610e8a5750610e8a33610e8483612b7d565b90612bac565b91505b81610e9c5763ffffffff610ea2565b631626ba7e5b60e01b93505050505b9392505050565b5f333014610ed2576040516282b42960e81b815260040160405180910390fd5b5f610f0b610f07610f0460017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a61593f565b90565b5c90565b90507f0a9f35b227e9f474cb86caa2e9b62847626fede22333cf52c7abea325d2eaa358114610f38575f5ffd5b610f6e610f69610f0460017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a61593f565b612c56565b60019150505b919050565b333014610f98576040516282b42960e81b815260040160405180910390fd5b8280610fb757604051638707510560e01b815260040160405180910390fd5b610fc084612a79565b15610fde5760405163f2fee1e160e01b815260040160405180910390fd5b5f610fe885612b05565b6001600160a01b0385165f90815260028201602052604090206001909101915061103684600681111561101d5761101d614fb9565b8254600160ff9092169190911b80198216845516151590565b15611056575f61104582612c5c565b03611056576110548286612c77565b505b611085816001015f86600681111561107057611070614fb9565b60ff1681526020019081526020015f205f9055565b7fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a278686866040516110b893929190615952565b60405180910390a1505050505050565b6060805f6110d461230b565b9050806001600160401b038111156110ee576110ee615440565b60405190808252806020026020018201604052801561113d57816020015b604080516080810182525f80825260208083018290529282015260608082015282525f1990920191018161110c5790505b509250806001600160401b0381111561115857611158615440565b604051908082528060200260200182016040528015611181578160200160208202803683370190505b5091505f805b82811015611227575f6111a88268448e3efef2f6a7f2f65b60020190612dac565b90505f6111b482610bb4565b805190915064ffffffffff1642811090151516156111d357505061121f565b808785815181106111e6576111e6615975565b60200260200101819052508186858151811061120457611204615975565b60209081029190910101528361121981615989565b94505050505b600101611187565b508084528252509091565b6001600160c01b0381165f90815268448e3efef2f6a7f2f76020526040808220549083901b67ffffffffffffffff1916175b92915050565b604080516080810182525f808252602082018190529181019190915260608082015261126461033e8368448e3efef2f6a7f2f661119f565b3330146112c1576040516282b42960e81b815260040160405180910390fd5b82806112e057604051638707510560e01b815260040160405180910390fd5b5f516020615b175f395f51905f52841461131b576112fd84612a79565b1561131b5760405163f2fee1e160e01b815260040160405180910390fd5b5f61132585612b05565b60030190506113448185856001600160a01b0381161515610800612df5565b50604080518681526001600160a01b0380871660208301528516918101919091527f7e2baa9c3a554d7c6587682e28fe9607c29d1d8c8a46968368d5614607c6079990606001610dbe565b3330146113ae576040516282b42960e81b815260040160405180910390fd5b83806113cd57604051638707510560e01b815260040160405180910390fd5b6113d685612a79565b156113f45760405163f2fee1e160e01b815260040160405180910390fd5b5f6113fe86612b05565b600101905061140f81866040612e20565b506001600160a01b0385165f908152600182016020526040902061145585600681111561143e5761143e614fb9565b8254600160ff9092169190911b8082178455161590565b505f816001015f87600681111561146e5761146e614fb9565b60ff1681526020019081526020015f2090505f61148a82612e5c565b86815290506114998282612ea6565b7f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a898989896040516114ce94939291906159a1565b60405180910390a1505050505050505050565b5f806114fd8460408051828152600190920160051b8201905290565b90505f5b8481101561159d575f5f365f6115188a8a87612eeb565b9296509094509250905061158d8561157e7f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b0388168761155f8888612f1d565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b5050505050806001019050611501565b5061c1d060f084901c145f6115f77f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b90508161160c5761160781612f2e565b611615565b61161581613044565b979650505050505050565b33301461163f576040516282b42960e81b815260040160405180910390fd5b5f83815268448e3efef2f6a7f2f9602052604090205460ff166116755760405163395ed8c160e21b815260040160405180910390fd5b61168e828261020061168687612b7d565b9291906130b8565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc99836040516116cd911515815260200190565b60405180910390a3505050565b600f60f81b6060805f8080836116ee6130d3565b97989097965046955030945091925090565b60605f61170c83612b05565b600301905061171a81613116565b6001600160401b0381111561173157611731615440565b60405190808252806020026020018201604052801561177557816020015b604080518082019091525f808252602082015281526020019060019003908161174f5790505b5091505f5b82518110156117e15761178d8282613120565b84838151811061179f5761179f615975565b60200260200101515f018584815181106117bb576117bb615975565b6020908102919091018101516001600160a01b039384169101529116905260010161177a565b5050919050565b333014611807576040516282b42960e81b815260040160405180910390fd5b6001600160a01b03811661182e57604051634adebaa360e11b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c525190555f6118696130d3565b91506118c590507f0a9f35b227e9f474cb86caa2e9b62847626fede22333cf52c7abea325d2eaa356118bf610f0460017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a61593f565b9061315a565b306317e69ab86118d483613161565b6040518263ffffffff1660e01b81526004016118f291815260200190565b6020604051808303815f875af115801561190e573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061193291906159d3565b61193a575f5ffd5b5050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611986576040516282b42960e81b815260040160405180910390fd5b61199d68448e3efef2f6a7f2f65b60010182613189565b50565b5f611264826020015160038111156119ba576119ba614fb9565b60ff168360600151805190602001205f1c5f9182526020526040902090565b60606112646119e783612b7d565b6131a0565b333014611a0b576040516282b42960e81b815260040160405180910390fd5b611a1e68448e3efef2f6a7f2f782613274565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b333014611a73576040516282b42960e81b815260040160405180910390fd5b611a7c816132de565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b03811115611ac557611ac5615440565b604051908082528060200260200182016040528015611af857816020015b6060815260200190600190039081611ae35790505b509250806001600160401b03811115611b1357611b13615440565b604051908082528060200260200182016040528015611b4657816020015b6060815260200190600190039081611b315790505b5091505f5b81811015611bd757611b74868683818110611b6857611b68615975565b90506020020135611d6c565b848281518110611b8657611b86615975565b6020026020010181905250611bb2868683818110611ba657611ba6615975565b90506020020135611f30565b838281518110611bc457611bc4615975565b6020908102919091010152600101611b4b565b50509250929050565b5f80611c0e611bfd60015f516020615b375f395f51905f5261593f565b604080516020810190915290815290565b9050611c1981515c90565b5f03611c2657505f919050565b611c2f81613349565b91505090565b333014611c54576040516282b42960e81b815260040160405180910390fd5b611c9c82828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250611c969250612a06915050565b90613369565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611ccd929190615a16565b60405180910390a15050565b6060611ced68448e3efef2f6a7f2f6612a13565b905090565b5f333014611d12576040516282b42960e81b815260040160405180910390fd5b611d1b826133c1565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611d4d9190615048565b60405180910390a2919050565b5f611d648261342f565b151592915050565b60605f611d7883612b05565b6001019050611d936040518060200160405280606081525090565b5f611d9d83613478565b90505f5b81811015611f26575f611db485836134c9565b6001600160a01b0381165f9081526001870160205260408120919250611dd982613522565b90505f5b8151811015611f17575f828281518110611df957611df9615975565b602002602001015190505f611e22856001015f8460ff1681526020019081526020015f20612e5c565b9050611e5f6040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166006811115611e7457611e74614fb9565b81602001906006811115611e8a57611e8a614fb9565b90816006811115611e9d57611e9d614fb9565b9052506001600160a01b03871681528151604080830191909152820151608082015260208201516060820152611ee24260ff851660068111156108a5576108a5614fb9565b60c08201819052608082015160608301519111150260a082015280611f078b8261357b565b5050505050806001019050611ddd565b50505050806001019050611da1565b5050519392505050565b6060611264611f3e83612b05565b613624565b5f611f4d8461342f565b905080600303611f6857611f628484846136dd565b50505050565b365f365f84611f7e57637f1812755f526004601cfd5b5085358087016020810194503592505f90604011600286141115611fac575050602080860135860190810190355b611fbb88888887878787613775565b5050505050505050565b813580830190604081901c602084101715611fde575f5ffd5b50612053336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461204a3061201f6020860186615425565b6001600160a01b0316143061203a6080870160608801615425565b6001600160a01b03161417151590565b15159015151690565b61206f576040516282b42960e81b815260040160405180910390fd5b306120806080830160608401615425565b6001600160a01b031603612133575f84815268448e3efef2f6a7f2fb602052604090205460ff16156120c557604051638f56f14960e01b815260040160405180910390fd5b5f84815268448e3efef2f6a7f2fb60205260408120805460ff19166001179055806120f8866102c4610240860186615a29565b975091508690506001600160c01b0332311061211357600191505b81612130576040516282b42960e81b815260040160405180910390fd5b50505b61215e61214660a0830160808401615425565b61215861022084016102008501615425565b8861398d565b84158061216f575061216f85612a79565b6121cb575f61217d86612b05565b6001810191506121c9906002015f61219b60a0860160808701615425565b6001600160a01b0316815260208101919091526040015f206121c360a0850160808601615425565b896139b5565b505b505050505050565b5f808260068111156121e7576121e7614fb9565b036121fa57603c808404025b9050611264565b600182600681111561220e5761220e614fb9565b0361221f57610e10808404026121f3565b600282600681111561223357612233614fb9565b036122455762015180808404026121f3565b600382600681111561225957612259614fb9565b0361227f576007600362015180808604918201929092069003620545ff851102026121f3565b5f5f61228a85613ada565b50909250905060048460068111156122a4576122a4614fb9565b036122be576122b582826001613b84565b92505050611264565b60058460068111156122d2576122d2614fb9565b036122e3576122b582600180613b84565b60068460068111156122f7576122f7614fb9565b0361230757600192505050611264565b5f5ffd5b5f611ced68448e3efef2f6a7f2f8613bdb565b5f8461232c575060016125ea565b61233585612a79565b15612342575060016125ea565b631919191960e11b60048310612356575082355b826123655750630707070760e51b5b61236f8582612add565b1561237d575f9150506125ea565b5f61238787612b05565b905061239281613bdb565b1561244f576123ad60e083901c606088901b175b8290613c27565b156123bd576001925050506125ea565b6123d06332323232606088901b176123a6565b156123e0576001925050506125ea565b61240660e083901c73191919191919191919191919191919191919191960611b176123a6565b15612416576001925050506125ea565b61243f7f32323232323232323232323232323232323232320000000000000000323232326123a6565b1561244f576001925050506125ea565b6124655f516020615b175f395f51905f52612b05565b905061247081613bdb565b1561252a5761248860e083901c606088901b176123a6565b15612498576001925050506125ea565b6124ab6332323232606088901b176123a6565b156124bb576001925050506125ea565b6124e160e083901c73191919191919191919191919191919191919191960611b176123a6565b156124f1576001925050506125ea565b61251a7f32323232323232323232323232323232323232320000000000000000323232326123a6565b1561252a576001925050506125ea565b612538878888898989613cab565b15612548576001925050506125ea565b61256a8788733232323232323232323232323232323232323232898989613cab565b1561257a576001925050506125ea565b6125955f516020615b175f395f51905f528888808989613cab565b156125a5576001925050506125ea565b6125d45f516020615b175f395f51905f5288733232323232323232323232323232323232323232898989613cab565b156125e4576001925050506125ea565b5f925050505b949350505050565b5f604051826040811461260d57604181146126345750612665565b60208581013560ff81901c601b0190915285356040526001600160ff1b0316606052612645565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d612672575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d610f7457fe5b5f6040518681528560208201528460408201528360608201528260808201525f5f5260205f60a0836101005afa503d6126f7576d1ab2e8006fd8b71907bf06a5bdee3b6126f75760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa6126f757fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6127616040518060c0016040528060608152602001606081526020015f81526020015f81526020015f81526020015f81525090565b815160c0811061280e5760208301818101818251018281108260c0830111171561278d5750505061280e565b80815101925080602082015101818110838211178285108486111717156127b7575050505061280e565b82815160208301011183855160208701011117156127d8575050505061280e565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f5f5f61282388600180613d59565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561290757602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061290757fe5b5050508215612928576129258287608001518860a001518888612693565b92505b505095945050505050565b5f6001600160a01b038516156125ea57604051853b6129c3578260408114612963576041811461298a57506129fd565b60208581013560ff81901c601b0190915285356040526001600160ff1b031660605261299b565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f606052806040526129fd565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b68448e3efef2f6a7f2f690565b60405181546020820190600881901c5f8260ff841714612a4157505080825260ff8116601f80821115612a63575b855f5260205f205b8160051c81015482860152602082019150828210612a4957505b508084525f920191825250602001604052919050565b5f81815268448e3efef2f6a7f2f960205260408120805460ff808216908114801590910260089290921c021780612ac35760405163395ed8c160e21b815260040160405180910390fd5b612ad0825f198301613e4a565b60ff161515949350505050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f516020615b175f395f51905f528314612b2957612b2483613eb7565b612b38565b5f516020615b175f395f51905f525b68b11ddb8fabd886bebb6009525f908152602990209392505050565b5f82612b6957612b648585613ee4565b612b74565b612b74858584613fe2565b95945050505050565b5f81815268448e3efef2f6a7f2fa602052604081208054601f5263d4203f8b6004528152603f81208190610eab565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612be75763f5a267f15f526004601cfd5b82612bf95768fbb67fda52d4bfb8bf92505b80546001600160601b038116612c3d5760019250838160601c0315612c4e57600182015460601c8414612c4e57600282015460601c8414612c4e575b5f9250612c4e565b81602052835f5260405f2054151592505b505092915050565b5f815d50565b5f81545b801561280e57600191820191811901811618612c60565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612cb25763f5a267f15f526004601cfd5b82612cc45768fbb67fda52d4bfb8bf92505b80546001600160601b03811680612d3e5760019350848260601c03612cfc5760018301805484556002840180549091555f9055612da3565b84600184015460601c03612d1d5760028301805460018501555f9055612da3565b84600284015460601c03612d36575f6002840155612da3565b5f9350612da3565b82602052845f5260405f20805480612d57575050612da3565b60018360011c039250826001820314612d87578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612dd683613bdb565b821061126457604051634e23d03560e01b815260040160405180910390fd5b5f82612e0a57612e058686613fff565b612e16565b612e1686868685614030565b9695505050505050565b5f612e2b848461406b565b90508015610eab5781612e3d85613478565b1115610eab5760405163155176b960e11b815260040160405180910390fd5b612e7d60405180606001604052805f81526020015f81526020015f81525090565b5f612e8783612a13565b905080515f1461280e575f612e9b826141c6565b602001949350505050565b6040805182516020808301919091528301518183015290820151606082015261193a908390612ee690608001604051602081830303815290604052614312565b613369565b60051b82013590910180356001600160a01b031680153002179260208083013593506040830135909201918201913590565b5f8183604051375060405120919050565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f00000000000000000000000000000000000000000000000000000000000000004614166130215750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f5f5f61304f6130d3565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b5f826130c857612b648585612c77565b612b74858584612e20565b604080518082018252600d81526c125d1a1858d85058d8dbdd5b9d609a1b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b5f61126482613478565b5f80600184018161313186866134c9565b6001600160a01b038082168352602083019390935260409091015f205490969116945092505050565b80825d5050565b8051602181106131785763ec92f9a35f526004601cfd5b9081015160209190910360031b1b90565b5f5f613195848461453f565b600101905550505050565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c925083831415830281528161322e57821561322957600191508185015460601c92508215613229578284141590920260208301525060028381015460601c918215613229576003915083831415830260408201525b61325e565b600191821c915b8281101561325c578581015460601c858114158102600583901b8401529350600101613235565b505b8186528160051b81016040525050505050919050565b604081811c5f90815260208490522080546001600160401b03831610156132ae576040516312ee5c9360e01b815260040160405180910390fd5b6132d86132d2836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f81815268448e3efef2f6a7f2f96020908152604080832083905568448e3efef2f6a7f2fa90915290208054600101905568448e3efef2f6a7f2f661332c68448e3efef2f6a7f2f883613ee4565b61193a5760405163395ed8c160e21b815260040160405180910390fd5b80515f90805c806133615763bc7ec7795f526004601cfd5b015c92915050565b80518060081b60ff175f60fe8311613392575050601f8281015160081b821790808311156133b9575b60208401855f5260205f205b828201518360051c82015560208301925084831061339e5750505b509092555050565b5f6133cb826119a0565b90505f68448e3efef2f6a7f2f66060840151845160208087015160408089015190519596506134229561340095949301615a6b565b60408051601f198184030181529181525f858152600385016020522090613369565b6117e16002820183614585565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c15176134c1576001935083830154156134c1576002935083830154156134c157600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf821415820291506134fc84613478565b831061351b57604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b80156135655761ffff811661354a576010918201911c61352f565b8183526020600582901b16909201916001918201911c61352f565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c553602084035181810615828204029050808310613613578281178101811582602001870160405118176135df57828102601f198701528501602001604052613613565b602060405101816020018101604052808a52601f19855b88810151838201528101806135f657509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf90602084018161369d57835480156136975780841415028152600184810154909250801561369757808414150260208201526002848101549092508015613697576003925083811415810260408301525b506136c8565b8160011c91505f5b828110156136c657848101548481141502600582901b8301526001016136a5565b505b8185528160051b810160405250505050919050565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c171561372257633995943b5f526004601cfd5b505f5b8381146121c957365f8260051b850135808601602081019350803592505084828401118160401c171561375f57633995943b5f526004601cfd5b5061376b898383611f43565b5050600101613725565b6001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016330361383b57602081146137c65760405163438e981560e11b815260040160405180910390fd5b60408051602081019091528235906137fb908290806137f360015f516020615b375f395f51905f5261593f565b905290614697565b6138068585836146b1565b6040805160208101909152613835908061382e60015f516020615b375f395f51905f5261593f565b9052614b7a565b506121c9565b8061386f5733301461385f576040516282b42960e81b815260040160405180910390fd5b61386a84845f6146b1565b6121c9565b60208110156138915760405163438e981560e11b815260040160405180910390fd5b81356138a568448e3efef2f6a7f2f6611994565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f5f6139026138e88888866114e1565b602080871081881802188088019080880390881102610905565b9150915081613923576040516282b42960e81b815260040160405180910390fd5b61394e81604051806020016040528060015f516020615b375f395f51905f525f1c6137f3919061593f565b6139598787836146b1565b6040805160208101909152613981908061382e60015f516020615b375f395f51905f5261593f565b50505050505050505050565b6001600160a01b0383166139aa576139a58282614b9b565b505050565b6139a5838383614bb4565b806139bf57505050565b5f6139c984613522565b905080515f036139ec57604051635ee7e5b160e01b815260040160405180910390fd5b5f5b8151811015613ad3575f828281518110613a0a57613a0a615975565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f613a3782612e5c565b90505f613a53428560ff1660068111156108a5576108a5614fb9565b90508082604001511015613a6f57604082018190525f60208301525b815f01518783602001818151613a859190615aba565b9150818152501115613aba5760405163482a648960e11b81526001600160a01b03891660048201526024015b60405180910390fd5b613ac48383612ea6565b505050508060010190506139ee565b5050505050565b5f8080613b77613aed6201518086615acd565b5f5f5f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c9250806117e15781545f9350156117e1576001925082820154156117e1576002925082820154156117e1575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613c545763f5a267f15f526004601cfd5b82613c665768fbb67fda52d4bfb8bf92505b801954613c9757805460019250831461351b576001810154831461351b576002810154831461351b575f915061351b565b602052505f90815260409020541515919050565b5f5f5f613cc487613cbb8b612b05565b60030190614bfe565b915091508115613d4b576040516001629e639560e01b031981526001600160a01b0382169063ff619c6b90613d03908b908a908a908a90600401615aec565b602060405180830381865afa158015613d1e573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190613d4291906159d3565b92505050612e16565b505f98975050505050505050565b606083518015612672576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613dd4579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f82548060ff821714613e9257601e8311613e695780831a915061351b565b8060ff168311613e8d57835f52601f83038060051c60205f200154601f82161a9250505b61351b565b8060081c831161351b57835f528260051c60205f200154601f84161a91505092915050565b5f81815268448e3efef2f6a7f2fa602052604081208054601f5263d4203f8b6004528152603f8120611264565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613f115763f5a267f15f526004601cfd5b82613f235768fbb67fda52d4bfb8bf92505b80195480613f84576001925083825403613f505760018201805483556002830180549091555f9055612c4e565b83600183015403613f6e5760028201805460018401555f9055612c4e565b83600283015403612c35575f6002830155612c4e565b81602052835f5260405f20805480613f9d575050612c4e565b60018360011c039250826001820314613fc757828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f613fed8484614585565b90508015610eab5781612e3d85613bdb565b6001600160a01b0381165f908152600183016020526040812080546001600160a01b0319169055610eab8383612c77565b6001600160a01b038381165f908152600186016020526040812080546001600160a01b03191692851692909217909155612b74858584612e20565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016140a65763f5a267f15f526004601cfd5b826140b85768fbb67fda52d4bfb8bf92505b80546001600160601b038116826020528061417a578160601c806140e6578560601b84556001945050612da3565b8581036140f35750612da3565b600184015460601c80614114578660601b6001860155600195505050612da3565b868103614122575050612da3565b600285015460601c80614144578760601b600287015560019650505050612da3565b87810361415357505050612da3565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f2080546141bc57600191821c8083018255919450816141a8578560601b600317845550612da3565b8560601b8285015582600201845550612da3565b5050505092915050565b6060815115610f74576040519050600482018051835184602001017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f6020850183198552866020015b8051805f1a61426757600190811a016080811161424757600282019150803684379182019184821061424157506142f4565b5061420f565b5f198352918201607f1901916002919091019084821061424157506142f4565b80835283811684011783171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f8601f6f8421084210842108cc6318c6db6d54be660204081020408185821060071b86811c6001600160401b031060061b1795861c0260181a1c161a90911860031c01918201910183811061420f57838111156142f457838103820391505b509290935250601f198382030183525f815260200160405250919050565b606061436a565b6fffffffffffffffffffffffffffffffff811160071b81811c6001600160401b031060061b1781811c63ffffffff1060051b1781811c61ffff1060041b1790811c60ff1060039190911c17601f1890565b50604051815182017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f60208301845b83811461451b57600101805160ff1680614423575b6020820151806143f25782860360208181189082110218607f839003818111818318021893840193928301929050601f81116143eb575050614413565b50506143ae565b6143fb81614319565b90508286038181118183180218928301929190910190505b60f01b8252600290910190614399565b60ff8103614476576020808301511980156144445761444181614319565b91505b508286038181118282180218601f81811890821102186080811760f01b85526002909401939290920191506143999050565b80835350602081015160018381018290528482168501821791198581168601179190911684171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f86f8421084210842108cc6318c6db6d54be660204081020408184821060071b85811c6001600160401b031060061b1794851c0260181a1c601f161a90911860031c018286038181119181189190910218928301019101614399565b50600484018051199052601f198482030184525f8152602001604052509092915050565b604081811c5f90815260208490522080546001600160401b0380841682149082101661457e57604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036145b25763f5a267f15f526004601cfd5b826145c45768fbb67fda52d4bfb8bf92505b8019548160205280614668578154806145e4578483556001935050612c4e565b8481036145f15750612c4e565b60018301548061460c57856001850155600194505050612c4e565b85810361461a575050612c4e565b6002840154806146365786600286015560019550505050612c4e565b86810361464557505050612c4e565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f208054612da357600191821c8381018690558083019182905590821b8217831955909250612c4e565b5f825f015190506001815c01828183015d80825d50505050565b8015806146c257506146c281612a79565b156146d2576139a5838383614c38565b5f6146dc82612b05565b600101905061474a6040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f61475483613478565b90505f5b818110156147a6575f61476b85836134c9565b90506001600160a01b0381161561479d57604084015161478b9082614c82565b50606084015161479b905f61357b565b505b50600101614758565b505f5f5b86811015614997575f5f365f6147c18c8c87612eeb565b9350935093509350825f146147dd576147da8387615aba565b95505b60048110156147ef575050505061498f565b813560e01c63a9059cbb81900361482657604089015161480f9086614c82565b5061482460248401355b60608b015190614ca1565b505b8063ffffffff166323b872dd03614889573060248401356001600160a01b03160361485557505050505061498f565b60448301355f0361486a57505050505061498f565b60408901516148799086614c82565b506148876044840135614819565b505b8063ffffffff1663095ea7b3036148ef5760248301355f036148af57505050505061498f565b88516148bb9086614c82565b506148cf600484013560208b015190614c82565b5060408901516148df9086614c82565b506148ed6024840135614819565b505b8063ffffffff166387517c4503614989576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba31461492957505050505061498f565b60448301355f0361493e57505050505061498f565b614951600484013560808b015190614c82565b50614965602484013560a08b015190614c82565b50614979600484013560408b015190614c82565b506149876044840135614819565b505b50505050505b6001016147aa565b506040830151516060840151516149ae9190614cb7565b5f6149e16149bf8560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b60408501515151811015614a2d57604085015151600582901b0160200151614a2382614a118330614dfa565b85919060059190911b82016020015290565b50506001016149e5565b50614a39888888614c38565b5f8080526001860160205260408120614a5291846139b5565b5f5b84515151811015614a9657845151600582901b0160200151614a8d81614a87848960200151614dea90919063ffffffff16565b5f614e24565b50600101614a54565b505f5b60808501515151811015614ae057608085015151600582901b0160200151614ad781614ad2848960a00151614dea90919063ffffffff16565b614e64565b50600101614a99565b505f5b60408501515151811015614b6f57604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b018352939093206060890151518301820151928601909101519091614b659183918591614b609190614b5590614b4c8930614dfa565b80821191030290565b808218908210021890565b6139b5565b5050600101614ae3565b505050505050505050565b8051805c80614b905763bc7ec7795f526004601cfd5b60018103825d505050565b5f385f3884865af161193a5763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416614bf457803d853b151710614bf4576390b8ec185f526004601cfd5b505f603452505050565b6001600160a01b038181165f90815260018401602052604081205490911680151580614c2f5750614c2f8484614ebf565b91509250929050565b5f82614c445750505050565b5f5f365f614c53888887612eeb565b9350935093509350614c68848484848a614eca565b50505050838390508160010191508103614c445750505050565b604080516060815290819052610eab83836001600160a01b031661357b565b604080516060815290819052610eab838361357b565b614d44565b805181602083015b8281511015614cf057805160209290920180518252918252614cf0868301878301805182519091529052565b602001848110614cc457508251815184528152614d17858201868501805182519091529052565b808360400111614d2c57614d2c858285614cbc565b838160600111613ad357613ad3858560208401614cbc565b805180835114614d6057634e487b715f5260326020526024601cfd5b600281106139a557828203602084018260051b8101614d80838284614cbc565b82820151604087015b8051845114614da55781858501525f9150602084019350805184525b8085015191820191821015614dc657634e487b715f5260116020526024601cfd5b602081019050828103614d8957509282019290925284900360051c93849052505052565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f511416614bf457803d853b151710614bf457633e3f8f735f526004601cfd5b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af16139a5576396b3de235f526004601cfd5b5f610eab8383612bac565b614ed68186858561231e565b614efb578085848460405163f78c1b5360e01b8152600401613ab19493929190615aec565b613ad38585858585604051828482375f388483888a5af16121cb573d5f823e3d81fd5b5f5f83601f840112614f2e575f5ffd5b5081356001600160401b03811115614f44575f5ffd5b60208301915083602082850101111561457e575f5ffd5b5f5f5f60408486031215614f6d575f5ffd5b8335925060208401356001600160401b03811115614f89575f5ffd5b614f9586828701614f1e565b9497909650939450505050565b5f60208284031215614fb2575f5ffd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f60208201516004811061501c5761501c614fb9565b806020850152506040820151151560408401526060820151608060608501526125ea6080850182614fcd565b602081525f610eab6020830184614ffb565b6001600160a01b038116811461199d575f5ffd5b801515811461199d575f5ffd5b8035610f748161506e565b5f5f5f5f60808587031215615099575f5ffd5b8435935060208501356150ab8161505a565b925060408501356001600160e01b0319811681146150c7575f5ffd5b915060608501356150d78161506e565b939692955090935050565b803560078110610f74575f5ffd5b5f5f5f60608486031215615102575f5ffd5b8335925060208401356151148161505a565b9150615122604085016150e2565b90509250925092565b5f8151808452602084019350602083015f5b8281101561515b57815186526020958601959091019060010161513d565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b828110156151bc57605f198786030184526151a7858351614ffb565b9450602093840193919091019060010161518b565b505050508281036020840152612b74818561512b565b5f602082840312156151e2575f5ffd5b81356001600160c01b0381168114610eab575f5ffd5b5f5f5f6060848603121561520a575f5ffd5b83359250602084013561521c8161505a565b9150604084013561522c8161505a565b809150509250925092565b5f5f5f5f6080858703121561524a575f5ffd5b84359350602085013561525c8161505a565b925061526a604086016150e2565b9396929550929360600135925050565b5f5f83601f84011261528a575f5ffd5b5081356001600160401b038111156152a0575f5ffd5b6020830191508360208260051b850101111561457e575f5ffd5b5f5f5f604084860312156152cc575f5ffd5b83356001600160401b038111156152e1575f5ffd5b6152ed8682870161527a565b909790965060209590950135949350505050565b5f5f5f60608486031215615313575f5ffd5b8335925060208401356153258161505a565b9150604084013561522c8161506e565b60ff60f81b8816815260e060208201525f61535360e0830189614fcd565b82810360408401526153658189614fcd565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b818110156153ba57835183526020938401939092019160010161539c565b50909b9a5050505050505050505050565b602080825282518282018190525f918401906040840190835b8181101561541a57835180516001600160a01b0390811685526020918201511681850152909301926040909201916001016153e4565b509095945050505050565b5f60208284031215615435575f5ffd5b8135610eab8161505a565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b038111828210171561547657615476615440565b60405290565b5f82601f83011261548b575f5ffd5b81356001600160401b038111156154a4576154a4615440565b604051601f8201601f19908116603f011681016001600160401b03811182821017156154d2576154d2615440565b6040528181528382016020018510156154e9575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f60208284031215615515575f5ffd5b81356001600160401b0381111561552a575f5ffd5b82016080818503121561553b575f5ffd5b615543615454565b813564ffffffffff81168114615557575f5ffd5b815260208201356004811061556a575f5ffd5b602082015261557b6040830161507b565b604082015260608201356001600160401b03811115615598575f5ffd5b6155a48682850161547c565b606083015250949350505050565b602080825282518282018190525f918401906040840190835b8181101561541a5783516001600160a01b03168352602093840193909201916001016155cb565b5f5f60208385031215615603575f5ffd5b82356001600160401b03811115615618575f5ffd5b6156248582860161527a565b90969095509350505050565b6007811061564057615640614fb9565b9052565b5f8151808452602084019350602083015f5b8281101561515b57815180516001600160a01b031687526020808201515f91615681908a0182615630565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e09095019460209190910190600101615656565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561572157605f1987860301845261570c858351615644565b945060209384019391909101906001016156f0565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b8381101561577a57601f1986840301855261576483835161512b565b6020958601959093509190910190600101615748565b509098975050505050505050565b5f5f60208385031215615799575f5ffd5b82356001600160401b038111156157ae575f5ffd5b61562485828601614f1e565b602081525f610eab6020830184614fcd565b602081525f610eab6020830184615644565b602081525f610eab602083018461512b565b5f5f5f5f5f60808688031215615804575f5ffd5b85359450602086013593506040860135925060608601356001600160401b0381111561582e575f5ffd5b61583a88828901614f1e565b969995985093965092949392505050565b5f5f6040838503121561585c575f5ffd5b8235915061586c602084016150e2565b90509250929050565b5f5f5f5f60608587031215615888575f5ffd5b84359350602085013561589a8161505a565b925060408501356001600160401b038111156158b4575f5ffd5b6158c087828801614f1e565b95989497509550505050565b5f602082840312156158dc575f5ffd5b8151610eab8161505a565b805160208201516bffffffffffffffffffffffff198116919060148210156117e1576bffffffffffffffffffffffff1960149290920360031b82901b161692915050565b634e487b7160e01b5f52601160045260245ffd5b818103818111156112645761126461592b565b8381526001600160a01b0383166020820152606081016125ea6040830184615630565b634e487b7160e01b5f52603260045260245ffd5b5f6001820161599a5761599a61592b565b5060010190565b8481526001600160a01b0384166020820152608081016159c46040830185615630565b82606083015295945050505050565b5f602082840312156159e3575f5ffd5b8151610eab8161506e565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f6125ea6020830184866159ee565b5f5f8335601e19843603018112615a3e575f5ffd5b8301803591506001600160401b03821115615a57575f5ffd5b60200191503681900382131561457e575f5ffd5b5f85518060208801845e60d886901b6001600160d81b03191690830190815260048510615a9a57615a9a614fb9565b60f894851b600582015292151590931b6006830152506007019392505050565b808201808211156112645761126461592b565b5f82615ae757634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f90612e1690830184866159ee56fe3232323232323232323232323232323232323232323232323232323232323232def24cb3236edf62937b12ea8dc676927599974e90729c6e9eafa9f05b03eab8" as const;


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

export const code = "0x610140604052604051615be4380380615be4833981016040819052610023916100e9565b306080524660a052606080610074604080518082018252600d81526c125d1a1858d85058d8dbdd5b9d609a1b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610116565b5f602082840312156100f9575f5ffd5b81516001600160a01b038116811461010f575f5ffd5b9392505050565b60805160a05160c05160e0516101005161012051615a646101805f395f8181610742015281816108d3015281816118c101528181611f650152818161202501526136c601525f612e4301525f612efd01525f612ed701525f612e8701525f612e640152615a645ff3fe60806040526004361061025f575f3560e01c80638e87cf4711610143578063cb4774c4116100b5578063e9ae5c5311610079578063e9ae5c531461081b578063f81d87a71461082e578063faba56d81461084d578063fac750e01461086c578063fcd4e70714610880578063ff619c6b146108a857610266565b8063cb4774c414610764578063cebfe33614610785578063d03c7914146107a4578063dcc09ebf146107c3578063e5adda71146107ef57610266565b8063b70e36f011610107578063b70e36f014610693578063b75c7dc6146106b2578063bc2c554a146106d1578063be766d15146106fe578063bf53096914610712578063c885f95a1461073157610266565b80638e87cf47146105ea578063912aa1b8146106165780639e49fbf114610635578063a840fe4914610648578063ad0770831461066757610266565b80632f3f30c7116101dc57806357022451116101a05780635702245114610514578063598daac41461053357806360d2f33d146105525780636fd91454146105855780637656d304146105a457806384b0196e146105c357610266565b80632f3f30c714610482578063350585011461049c5780633e1b0812146104b65780634223b5c2146104d5578063515c9d6d146104f457610266565b806317e69ab81161022357806317e69ab81461039e5780631a912f3e146103cd57806320606b701461040e5780632081a278146104415780632150c5181461046057610266565b80630cef73b41461029f57806311a86fd6146102da57806312aaac7014610319578063136a12f7146103455780631626ba7e1461036657610266565b3661026657005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a028214171561029157806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102aa575f5ffd5b506102be6102b9366004614e33565b6108c7565b6040805192151583526020830191909152015b60405180910390f35b3480156102e5575f5ffd5b5061030173323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102d1565b348015610324575f5ffd5b50610338610333366004614e7a565b610bc5565b6040516102d19190614f20565b348015610350575f5ffd5b5061036461035f366004614f5e565b610cb4565b005b348015610371575f5ffd5b50610385610380366004614e33565b610dde565b6040516001600160e01b031990911681526020016102d1565b3480156103a9575f5ffd5b506103bd6103b8366004614e7a565b610e46565b60405190151581526020016102d1565b3480156103d8575f5ffd5b506104007f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102d1565b348015610419575f5ffd5b506104007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b34801561044c575f5ffd5b5061036461045b366004614fc8565b610f0d565b34801561046b575f5ffd5b5061047461105c565b6040516102d192919061503d565b34801561048d575f5ffd5b50610385630707070760e51b81565b3480156104a7575f5ffd5b50610385631919191960e11b81565b3480156104c1575f5ffd5b506104006104d03660046150aa565b6111c6565b3480156104e0575f5ffd5b506103386104ef366004614e7a565b6111fe565b3480156104ff575f5ffd5b506104005f5160206159ef5f395f51905f5281565b34801561051f575f5ffd5b5061036461052e3660046150d0565b611236565b34801561053e575f5ffd5b5061036461054d36600461510f565b611323565b34801561055d575f5ffd5b506104007f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b348015610590575f5ffd5b5061040061059f366004615192565b611475565b3480156105af575f5ffd5b506103646105be3660046151d9565b6115bf565b3480156105ce575f5ffd5b506105d7611679565b6040516102d1979695949392919061520d565b3480156105f5575f5ffd5b50610609610604366004614e7a565b61169f565b6040516102d191906152a3565b348015610621575f5ffd5b506103646106303660046152fd565b611787565b610364610643366004614e7a565b6118b6565b348015610653575f5ffd5b506104006106623660046153dd565b611918565b348015610672575f5ffd5b50610686610681366004614e7a565b611951565b6040516102d1919061548a565b34801561069e575f5ffd5b506103646106ad366004614e7a565b611964565b3480156106bd575f5ffd5b506103646106cc366004614e7a565b6119cc565b3480156106dc575f5ffd5b506106f06106eb3660046154ca565b611a21565b6040516102d19291906155a2565b348015610709575f5ffd5b50610400611b58565b34801561071d575f5ffd5b5061036461072c366004615660565b611bad565b34801561073c575f5ffd5b506103017f000000000000000000000000000000000000000000000000000000000000000081565b34801561076f575f5ffd5b50610778611c51565b6040516102d19190615692565b348015610790575f5ffd5b5061040061079f3660046153dd565b611c6a565b3480156107af575f5ffd5b506103bd6107be366004614e7a565b611cd2565b3480156107ce575f5ffd5b506107e26107dd366004614e7a565b611ce4565b6040516102d191906156a4565b3480156107fa575f5ffd5b5061080e610809366004614e7a565b611ea8565b6040516102d191906156b6565b610364610829366004614e33565b611ebb565b348015610839575f5ffd5b506103646108483660046156c8565b611f3d565b348015610858575f5ffd5b50610400610867366004615723565b612118565b348015610877575f5ffd5b50610400612250565b34801561088b575f5ffd5b5061089561c1d081565b60405161ffff90911681526020016102d1565b3480156108b3575f5ffd5b506103bd6108c236600461574d565b612263565b63060f052a5f908152807f00000000000000000000000000000000000000000000000000000000000000006020826004601c845afa80155f51171561091357639e87fac85f526004601cfd5b5060418414604085141715610944573061092e878787612537565b6001600160a01b03161492505f9150610bbd9050565b602184101561095957505f9150819050610bbd565b60201984810185811181871802811895870191820135935090601f19013560ff161561098b57610988876125bf565b96505b505f61099683610bc5565b805190915064ffffffffff1642811090151516156109b8575f93505050610bbd565b5f816020015160038111156109cf576109cf614e91565b03610a2a575f80603f8711883581029060208a013502915091505f5f610a0e856060015180516020820151604090920151603f90911191820292910290565b91509150610a1f8b858585856125d8565b975050505050610bba565b600181602001516003811115610a4257610a42614e91565b03610ac757606081810151805160208083015160409384015184518084018e9052855180820385018152601f8d018590049094028101870186529485018b8152603f9490941091820295910293610abe935f92610ab7928e918e918291018382808284375f9201919091525061267192505050565b8585612759565b95505050610bba565b600281602001516003811115610adf57610adf614e91565b03610b0e57610b078160600151806020019051810190610aff91906157a4565b888888612878565b9350610bba565b600381602001516003811115610b2657610b26614e91565b03610bba57806060015151602014610b515760405163145a1fdd60e31b815260040160405180910390fd5b5f8160600151610b60906157bf565b60601c9050604051638afc93b48152886020820152846040820152606080820152866080820152868860a08301376084870160205f82601c8501865afa915050638afc93b45f5160e01c14811615610bb757600195505b50505b50505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f82815268448e3efef2f6a7f2f960205260408120610c0590612958565b8051909150610c275760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610c3b8383016020015190565b60d881901c855260c881901c915060d01c60ff166003811115610c6057610c60614e91565b84602001906003811115610c7657610c76614e91565b90816003811115610c8957610c89614e91565b90525060ff811615156040850152610ca683838151811082025290565b606085015250919392505050565b333014610cd3576040516282b42960e81b815260040160405180910390fd5b8380610cf257604051638707510560e01b815260040160405180910390fd5b5f5160206159ef5f395f51905f528514610d2d57610d0f856129be565b15610d2d57604051630442081560e01b815260040160405180910390fd5b610d378484612a22565b15610d55576040516303a6f8c760e21b815260040160405180910390fd5b610d7860e084901c606086901b1783610800610d7089612a4a565b929190612a99565b50604080518681526001600160a01b03861660208201526001600160e01b031985169181019190915282151560608201527f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e1906080015b60405180910390a15050505050565b5f5f5f610dec8686866108c7565b90925090508115158115151615610e2257610e06816129be565b80610e1f5750610e1f33610e1983612ac2565b90612af1565b91505b81610e315763ffffffff610e37565b631626ba7e5b60e01b925050505b9392505050565b5f333014610e66576040516282b42960e81b815260040160405180910390fd5b5f610e9f610e9b610e9860017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615817565b90565b5c90565b90507f0a9f35b227e9f474cb86caa2e9b62847626fede22333cf52c7abea325d2eaa358114610ecc575f5ffd5b610f02610efd610e9860017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615817565b612b9b565b60019150505b919050565b333014610f2c576040516282b42960e81b815260040160405180910390fd5b8280610f4b57604051638707510560e01b815260040160405180910390fd5b610f54846129be565b15610f725760405163f2fee1e160e01b815260040160405180910390fd5b5f610f7c85612a4a565b6001600160a01b0385165f908152600282016020526040902060019091019150610fca846006811115610fb157610fb1614e91565b8254600160ff9092169190911b80198216845516151590565b15610fea575f610fd982612ba1565b03610fea57610fe88286612bbc565b505b611019816001015f86600681111561100457611004614e91565b60ff1681526020019081526020015f205f9055565b7fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a2786868660405161104c9392919061582a565b60405180910390a1505050505050565b6060805f611068612250565b9050806001600160401b0381111561108257611082615318565b6040519080825280602002602001820160405280156110d157816020015b604080516080810182525f80825260208083018290529282015260608082015282525f199092019101816110a05790505b509250806001600160401b038111156110ec576110ec615318565b604051908082528060200260200182016040528015611115578160200160208202803683370190505b5091505f805b828110156111bb575f61113c8268448e3efef2f6a7f2f65b60020190612cf1565b90505f61114882610bc5565b805190915064ffffffffff1642811090151516156111675750506111b3565b8087858151811061117a5761117a61584d565b6020026020010181905250818685815181106111985761119861584d565b6020908102919091010152836111ad81615861565b94505050505b60010161111b565b508084528252509091565b6001600160c01b0381165f90815268448e3efef2f6a7f2f76020526040808220549083901b67ffffffffffffffff1916175b92915050565b604080516080810182525f80825260208201819052918101919091526060808201526111f86103338368448e3efef2f6a7f2f6611133565b333014611255576040516282b42960e81b815260040160405180910390fd5b828061127457604051638707510560e01b815260040160405180910390fd5b5f5160206159ef5f395f51905f5284146112af57611291846129be565b156112af5760405163f2fee1e160e01b815260040160405180910390fd5b5f6112b985612a4a565b60030190506112d88185856001600160a01b0381161515610800612d3a565b50604080518681526001600160a01b0380871660208301528516918101919091527f7e2baa9c3a554d7c6587682e28fe9607c29d1d8c8a46968368d5614607c6079990606001610dcf565b333014611342576040516282b42960e81b815260040160405180910390fd5b838061136157604051638707510560e01b815260040160405180910390fd5b61136a856129be565b156113885760405163f2fee1e160e01b815260040160405180910390fd5b5f61139286612a4a565b60010190506113a381866040612d65565b506001600160a01b0385165f90815260018201602052604090206113e98560068111156113d2576113d2614e91565b8254600160ff9092169190911b8082178455161590565b505f816001015f87600681111561140257611402614e91565b60ff1681526020019081526020015f2090505f61141e82612da1565b868152905061142d8282612deb565b7f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a898989896040516114629493929190615879565b60405180910390a1505050505050505050565b5f806114918460408051828152600190920160051b8201905290565b90505f5b8481101561153c57600581901b8601358601803580153002179060208082013591604081013501908101903561152c8561151d7f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876114fe8888612e30565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b5050505050806001019050611495565b5061c1d060f084901c145f6115967f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b9050816115ab576115a681612e41565b6115b4565b6115b481612f57565b979650505050505050565b3330146115de576040516282b42960e81b815260040160405180910390fd5b5f83815268448e3efef2f6a7f2f9602052604090205460ff166116145760405163395ed8c160e21b815260040160405180910390fd5b61162d828261020061162587612ac2565b929190612fcb565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc998360405161166c911515815260200190565b60405180910390a3505050565b600f60f81b6060805f80808361168d612fe6565b97989097965046955030945091925090565b60605f6116ab83612a4a565b60030190506116b981613029565b6001600160401b038111156116d0576116d0615318565b60405190808252806020026020018201604052801561171457816020015b604080518082019091525f80825260208201528152602001906001900390816116ee5790505b5091505f5b82518110156117805761172c8282613033565b84838151811061173e5761173e61584d565b60200260200101515f0185848151811061175a5761175a61584d565b6020908102919091018101516001600160a01b0393841691015291169052600101611719565b5050919050565b3330146117a6576040516282b42960e81b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c525190555f6117e1612fe6565b915061183d90507f0a9f35b227e9f474cb86caa2e9b62847626fede22333cf52c7abea325d2eaa35611837610e9860017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615817565b9061306d565b306317e69ab861184c83613074565b6040518263ffffffff1660e01b815260040161186a91815260200190565b6020604051808303815f875af1158015611886573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906118aa91906158ab565b6118b2575f5ffd5b5050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146118fe576040516282b42960e81b815260040160405180910390fd5b61191568448e3efef2f6a7f2f65b6001018261309c565b50565b5f6111f88260200151600381111561193257611932614e91565b60ff168360600151805190602001205f1c5f9182526020526040902090565b60606111f861195f83612ac2565b6130b3565b333014611983576040516282b42960e81b815260040160405180910390fd5b61199668448e3efef2f6a7f2f782613187565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b3330146119eb576040516282b42960e81b815260040160405180910390fd5b6119f4816131f1565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b03811115611a3d57611a3d615318565b604051908082528060200260200182016040528015611a7057816020015b6060815260200190600190039081611a5b5790505b509250806001600160401b03811115611a8b57611a8b615318565b604051908082528060200260200182016040528015611abe57816020015b6060815260200190600190039081611aa95790505b5091505f5b81811015611b4f57611aec868683818110611ae057611ae061584d565b90506020020135611ce4565b848281518110611afe57611afe61584d565b6020026020010181905250611b2a868683818110611b1e57611b1e61584d565b90506020020135611ea8565b838281518110611b3c57611b3c61584d565b6020908102919091010152600101611ac3565b50509250929050565b5f80611b86611b7560015f516020615a0f5f395f51905f52615817565b604080516020810190915290815290565b9050611b9181515c90565b5f03611b9e57505f919050565b611ba78161325c565b91505090565b333014611bcc576040516282b42960e81b815260040160405180910390fd5b611c1482828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250611c0e925061294b915050565b9061327c565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611c459291906158ee565b60405180910390a15050565b6060611c6568448e3efef2f6a7f2f6612958565b905090565b5f333014611c8a576040516282b42960e81b815260040160405180910390fd5b611c93826132d4565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611cc59190614f20565b60405180910390a2919050565b5f611cdc82613376565b151592915050565b60605f611cf083612a4a565b6001019050611d0b6040518060200160405280606081525090565b5f611d15836133bf565b90505f5b81811015611e9e575f611d2c8583613410565b6001600160a01b0381165f9081526001870160205260408120919250611d5182613469565b90505f5b8151811015611e8f575f828281518110611d7157611d7161584d565b602002602001015190505f611d9a856001015f8460ff1681526020019081526020015f20612da1565b9050611dd76040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166006811115611dec57611dec614e91565b81602001906006811115611e0257611e02614e91565b90816006811115611e1557611e15614e91565b9052506001600160a01b03871681528151604080830191909152820151608082015260208201516060820152611e5a4260ff8516600681111561086757610867614e91565b60c08201819052608082015160608301519111150260a082015280611e7f8b826134c2565b5050505050806001019050611d55565b50505050806001019050611d19565b5050519392505050565b60606111f8611eb683612a4a565b61356b565b5f611ec584613376565b905080600303611ee057611eda848484613624565b50505050565b365f365f84611ef657637f1812755f526004601cfd5b5085358087016020810194503592505f90604011600286141115611f24575050602080860135860190810190355b611f33888888878787876136bc565b5050505050505050565b813580830190604081901c602084101715611f56575f5ffd5b50611fcb336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611fc230611f9760208601866152fd565b6001600160a01b03161430611fb260808701606088016152fd565b6001600160a01b03161417151590565b15159015151690565b611fe7576040516282b42960e81b815260040160405180910390fd5b30611ff860808301606084016152fd565b6001600160a01b031603612078575f8061201a866102b9610280860186615901565b915091508096505f197f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316310361205857600191505b81612075576040516282b42960e81b815260040160405180910390fd5b50505b6120a361208b60a08301608084016152fd565b61209d610260840161024085016152fd565b886138d4565b8415806120b457506120b4856129be565b612110575f6120c286612a4a565b60018101915061210e906002015f6120e060a08601608087016152fd565b6001600160a01b0316815260208101919091526040015f2061210860a08501608086016152fd565b896138fc565b505b505050505050565b5f8082600681111561212c5761212c614e91565b0361213f57603c808404025b90506111f8565b600182600681111561215357612153614e91565b0361216457610e1080840402612138565b600282600681111561217857612178614e91565b0361218a576201518080840402612138565b600382600681111561219e5761219e614e91565b036121c4576007600362015180808604918201929092069003620545ff85110202612138565b5f5f6121cf85613a21565b50909250905060048460068111156121e9576121e9614e91565b03612203576121fa82826001613acb565b925050506111f8565b600584600681111561221757612217614e91565b03612228576121fa82600180613acb565b600684600681111561223c5761223c614e91565b0361224c576001925050506111f8565b5f5ffd5b5f611c6568448e3efef2f6a7f2f8613b22565b5f846122715750600161252f565b61227a856129be565b156122875750600161252f565b631919191960e11b6004831061229b575082355b826122aa5750630707070760e51b5b6122b48582612a22565b156122c2575f91505061252f565b5f6122cc87612a4a565b90506122d781613b22565b15612394576122f260e083901c606088901b175b8290613b6e565b156123025760019250505061252f565b6123156332323232606088901b176122eb565b156123255760019250505061252f565b61234b60e083901c73191919191919191919191919191919191919191960611b176122eb565b1561235b5760019250505061252f565b6123847f32323232323232323232323232323232323232320000000000000000323232326122eb565b156123945760019250505061252f565b6123aa5f5160206159ef5f395f51905f52612a4a565b90506123b581613b22565b1561246f576123cd60e083901c606088901b176122eb565b156123dd5760019250505061252f565b6123f06332323232606088901b176122eb565b156124005760019250505061252f565b61242660e083901c73191919191919191919191919191919191919191960611b176122eb565b156124365760019250505061252f565b61245f7f32323232323232323232323232323232323232320000000000000000323232326122eb565b1561246f5760019250505061252f565b61247d878888898989613bf2565b1561248d5760019250505061252f565b6124af8788733232323232323232323232323232323232323232898989613bf2565b156124bf5760019250505061252f565b6124da5f5160206159ef5f395f51905f528888808989613bf2565b156124ea5760019250505061252f565b6125195f5160206159ef5f395f51905f5288733232323232323232323232323232323232323232898989613bf2565b156125295760019250505061252f565b5f925050505b949350505050565b5f6040518260408114612552576041811461257957506125aa565b60208581013560ff81901c601b0190915285356040526001600160ff1b031660605261258a565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d6125b7575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d610f0857fe5b5f6040518681528560208201528460408201528360608201528260808201525f5f5260205f60a0836101005afa503d61263c576d1ab2e8006fd8b71907bf06a5bdee3b61263c5760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa61263c57fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6126a66040518060c0016040528060608152602001606081526020015f81526020015f81526020015f81526020015f81525090565b815160c081106127535760208301818101818251018281108260c083011117156126d257505050612753565b80815101925080602082015101818110838211178285108486111717156126fc5750505050612753565b828151602083010111838551602087010111171561271d5750505050612753565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f5f5f61276888600180613ca0565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561284c57602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061284c57fe5b505050821561286d5761286a8287608001518860a0015188886125d8565b92505b505095945050505050565b5f6001600160a01b0385161561252f57604051853b6129085782604081146128a857604181146128cf5750612942565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526128e0565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f60605280604052612942565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b68448e3efef2f6a7f2f690565b60405181546020820190600881901c5f8260ff84171461298657505080825260ff8116601f808211156129a8575b855f5260205f205b8160051c8101548286015260208201915082821061298e57505b508084525f920191825250602001604052919050565b5f81815268448e3efef2f6a7f2f960205260408120805460ff808216908114801590910260089290921c021780612a085760405163395ed8c160e21b815260040160405180910390fd5b612a15825f198301613d91565b60ff161515949350505050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f5160206159ef5f395f51905f528314612a6e57612a6983613dfe565b612a7d565b5f5160206159ef5f395f51905f525b68b11ddb8fabd886bebb6009525f908152602990209392505050565b5f82612aae57612aa98585613e2b565b612ab9565b612ab9858584613f29565b95945050505050565b5f81815268448e3efef2f6a7f2fa602052604081208054601f5263d4203f8b6004528152603f81208190610e3f565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612b2c5763f5a267f15f526004601cfd5b82612b3e5768fbb67fda52d4bfb8bf92505b80546001600160601b038116612b825760019250838160601c0315612b9357600182015460601c8414612b9357600282015460601c8414612b93575b5f9250612b93565b81602052835f5260405f2054151592505b505092915050565b5f815d50565b5f81545b801561275357600191820191811901811618612ba5565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612bf75763f5a267f15f526004601cfd5b82612c095768fbb67fda52d4bfb8bf92505b80546001600160601b03811680612c835760019350848260601c03612c415760018301805484556002840180549091555f9055612ce8565b84600184015460601c03612c625760028301805460018501555f9055612ce8565b84600284015460601c03612c7b575f6002840155612ce8565b5f9350612ce8565b82602052845f5260405f20805480612c9c575050612ce8565b60018360011c039250826001820314612ccc578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612d1b83613b22565b82106111f857604051634e23d03560e01b815260040160405180910390fd5b5f82612d4f57612d4a8686613f46565b612d5b565b612d5b86868685613f77565b9695505050505050565b5f612d708484613fb2565b90508015610e3f5781612d82856133bf565b1115610e3f5760405163155176b960e11b815260040160405180910390fd5b612dc260405180606001604052805f81526020015f81526020015f81525090565b5f612dcc83612958565b905080515f14612753575f612de08261410d565b602001949350505050565b604080518251602080830191909152830151818301529082015160608201526118b2908390612e2b90608001604051602081830303815290604052614259565b61327c565b5f8183604051375060405120919050565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f0000000000000000000000000000000000000000000000000000000000000000461416612f345750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f5f5f612f62612fe6565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b5f82612fdb57612aa98585612bbc565b612ab9858584612d65565b604080518082018252600d81526c125d1a1858d85058d8dbdd5b9d609a1b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b5f6111f8826133bf565b5f8060018401816130448686613410565b6001600160a01b038082168352602083019390935260409091015f205490969116945092505050565b80825d5050565b80516021811061308b5763ec92f9a35f526004601cfd5b9081015160209190910360031b1b90565b5f5f6130a88484614486565b600101905550505050565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c925083831415830281528161314157821561313c57600191508185015460601c9250821561313c578284141590920260208301525060028381015460601c91821561313c576003915083831415830260408201525b613171565b600191821c915b8281101561316f578581015460601c858114158102600583901b8401529350600101613148565b505b8186528160051b81016040525050505050919050565b604081811c5f90815260208490522080546001600160401b03831610156131c1576040516312ee5c9360e01b815260040160405180910390fd5b6131eb6131e5836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f81815268448e3efef2f6a7f2f96020908152604080832083905568448e3efef2f6a7f2fa90915290208054600101905568448e3efef2f6a7f2f661323f68448e3efef2f6a7f2f883613e2b565b6118b25760405163395ed8c160e21b815260040160405180910390fd5b80515f90805c806132745763bc7ec7795f526004601cfd5b015c92915050565b80518060081b60ff175f60fe83116132a5575050601f8281015160081b821790808311156132cc575b60208401855f5260205f205b828201518360051c8201556020830192508483106132b15750505b509092555050565b5f816040015115613309576132ec82602001516144cc565b613309576040516321b9b33960e21b815260040160405180910390fd5b61331282611918565b90505f68448e3efef2f6a7f2f66060840151845160208087015160408089015190519596506133699561334795949301615943565b60408051601f198184030181529181525f85815260038501602052209061327c565b61178060028201836144e8565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c1517613408576001935083830154156134085760029350838301541561340857600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf82141582029150613443846133bf565b831061346257604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b80156134ac5761ffff8116613491576010918201911c613476565b8183526020600582901b16909201916001918201911c613476565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c55360208403518181061582820402905080831061355a5782811781018115826020018701604051181761352657828102601f19870152850160200160405261355a565b602060405101816020018101604052808a52601f19855b888101518382015281018061353d57509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf9060208401816135e457835480156135de578084141502815260018481015490925080156135de578084141502602082015260028481015490925080156135de576003925083811415810260408301525b5061360f565b8160011c91505f5b8281101561360d57848101548481141502600582901b8301526001016135ec565b505b8185528160051b810160405250505050919050565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c171561366957633995943b5f526004601cfd5b505f5b83811461210e57365f8260051b850135808601602081019350803592505084828401118160401c17156136a657633995943b5f526004601cfd5b506136b2898383611ebb565b505060010161366c565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163303613782576020811461370d5760405163438e981560e11b815260040160405180910390fd5b60408051602081019091528235906137429082908061373a60015f516020615a0f5f395f51905f52615817565b9052906145fa565b61374d858583614614565b604080516020810190915261377c908061377560015f516020615a0f5f395f51905f52615817565b9052614a45565b5061210e565b806137b6573330146137a6576040516282b42960e81b815260040160405180910390fd5b6137b184845f614614565b61210e565b60208110156137d85760405163438e981560e11b815260040160405180910390fd5b81356137ec68448e3efef2f6a7f2f661190c565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f5f61384961382f888886611475565b6020808710818818021880880190808803908811026108c7565b915091508161386a576040516282b42960e81b815260040160405180910390fd5b61389581604051806020016040528060015f516020615a0f5f395f51905f525f1c61373a9190615817565b6138a0878783614614565b60408051602081019091526138c8908061377560015f516020615a0f5f395f51905f52615817565b50505050505050505050565b6001600160a01b0383166138f1576138ec8282614a66565b505050565b6138ec838383614a7f565b8061390657505050565b5f61391084613469565b905080515f0361393357604051635ee7e5b160e01b815260040160405180910390fd5b5f5b8151811015613a1a575f8282815181106139515761395161584d565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f61397e82612da1565b90505f61399a428560ff16600681111561086757610867614e91565b905080826040015110156139b657604082018190525f60208301525b815f015187836020018181516139cc9190615992565b9150818152501115613a015760405163482a648960e11b81526001600160a01b03891660048201526024015b60405180910390fd5b613a0b8383612deb565b50505050806001019050613935565b5050505050565b5f8080613abe613a3462015180866159a5565b5f5f5f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c9250806117805781545f9350156117805760019250828201541561178057600292508282015415611780575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613b9b5763f5a267f15f526004601cfd5b82613bad5768fbb67fda52d4bfb8bf92505b801954613bde57805460019250831461346257600181015483146134625760028101548314613462575f9150613462565b602052505f90815260409020541515919050565b5f5f5f613c0b87613c028b612a4a565b60030190614ac9565b915091508115613c92576040516001629e639560e01b031981526001600160a01b0382169063ff619c6b90613c4a908b908a908a908a906004016159c4565b602060405180830381865afa158015613c65573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190613c8991906158ab565b92505050612d5b565b505f98975050505050505050565b6060835180156125b7576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613d1b579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f82548060ff821714613dd957601e8311613db05780831a9150613462565b8060ff168311613dd457835f52601f83038060051c60205f200154601f82161a9250505b613462565b8060081c831161346257835f528260051c60205f200154601f84161a91505092915050565b5f81815268448e3efef2f6a7f2fa602052604081208054601f5263d4203f8b6004528152603f81206111f8565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613e585763f5a267f15f526004601cfd5b82613e6a5768fbb67fda52d4bfb8bf92505b80195480613ecb576001925083825403613e975760018201805483556002830180549091555f9055612b93565b83600183015403613eb55760028201805460018401555f9055612b93565b83600283015403612b7a575f6002830155612b93565b81602052835f5260405f20805480613ee4575050612b93565b60018360011c039250826001820314613f0e57828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f613f3484846144e8565b90508015610e3f5781612d8285613b22565b6001600160a01b0381165f908152600183016020526040812080546001600160a01b0319169055610e3f8383612bbc565b6001600160a01b038381165f908152600186016020526040812080546001600160a01b03191692851692909217909155612ab9858584612d65565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301613fed5763f5a267f15f526004601cfd5b82613fff5768fbb67fda52d4bfb8bf92505b80546001600160601b03811682602052806140c1578160601c8061402d578560601b84556001945050612ce8565b85810361403a5750612ce8565b600184015460601c8061405b578660601b6001860155600195505050612ce8565b868103614069575050612ce8565b600285015460601c8061408b578760601b600287015560019650505050612ce8565b87810361409a57505050612ce8565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f20805461410357600191821c8083018255919450816140ef578560601b600317845550612ce8565b8560601b8285015582600201845550612ce8565b5050505092915050565b6060815115610f08576040519050600482018051835184602001017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f6020850183198552866020015b8051805f1a6141ae57600190811a016080811161418e576002820191508036843791820191848210614188575061423b565b50614156565b5f198352918201607f19019160029190910190848210614188575061423b565b80835283811684011783171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f8601f6f8421084210842108cc6318c6db6d54be660204081020408185821060071b86811c6001600160401b031060061b1795861c0260181a1c161a90911860031c019182019101838110614156578381111561423b57838103820391505b509290935250601f198382030183525f815260200160405250919050565b60606142b1565b6fffffffffffffffffffffffffffffffff811160071b81811c6001600160401b031060061b1781811c63ffffffff1060051b1781811c61ffff1060041b1790811c60ff1060039190911c17601f1890565b50604051815182017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f60208301845b83811461446257600101805160ff168061436a575b6020820151806143395782860360208181189082110218607f839003818111818318021893840193928301929050601f811161433257505061435a565b50506142f5565b61434281614260565b90508286038181118183180218928301929190910190505b60f01b82526002909101906142e0565b60ff81036143bd5760208083015119801561438b5761438881614260565b91505b508286038181118282180218601f81811890821102186080811760f01b85526002909401939290920191506142e09050565b80835350602081015160018381018290528482168501821791198581168601179190911684171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f86f8421084210842108cc6318c6db6d54be660204081020408184821060071b85811c6001600160401b031060061b1794851c0260181a1c601f161a90911860031c0182860381811191811891909102189283010191016142e0565b50600484018051199052601f198482030184525f8152602001604052509092915050565b604081811c5f90815260208490522080546001600160401b038084168214908210166144c557604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f808260038111156144e0576144e0614e91565b141592915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036145155763f5a267f15f526004601cfd5b826145275768fbb67fda52d4bfb8bf92505b80195481602052806145cb57815480614547578483556001935050612b93565b8481036145545750612b93565b60018301548061456f57856001850155600194505050612b93565b85810361457d575050612b93565b6002840154806145995786600286015560019550505050612b93565b8681036145a857505050612b93565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f208054612ce857600191821c8381018690558083019182905590821b8217831955909250612b93565b5f825f015190506001815c01828183015d80825d50505050565b8015806146255750614625816129be565b15614635576138ec838383614b03565b5f61463f82612a4a565b60010190506146ad6040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f6146b7836133bf565b90505f5b81811015614709575f6146ce8583613410565b90506001600160a01b038116156147005760408401516146ee9082614b5a565b5060608401516146fe905f6134c2565b505b506001016146bb565b505f5f5b8681101561486257600581901b88013588018035801530021790602080820135916040810135019081019035821561474c576147498387615992565b95505b600481101561475e575050505061485a565b813560e01c63a9059cbb81900361479457604089015161477e9086614b5a565b50614792602484013560608b015190614b79565b505b8063ffffffff1663095ea7b3036147dc5760248301355f036147ba57505050505061485a565b88516147c69086614b5a565b506147da600484013560208b015190614b79565b505b8063ffffffff166387517c4503614854576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba31461481657505050505061485a565b60448301355f0361482b57505050505061485a565b61483e600484013560808b015190614b79565b50614852602484013560a08b015190614b79565b505b50505050505b60010161470d565b506040830151516060840151516148799190614b8f565b5f6148ac61488a8560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b604085015151518110156148f857604085015151600582901b01602001516148ee826148dc8330614cd2565b85919060059190911b82016020015290565b50506001016148b0565b50614904888888614b03565b5f808052600186016020526040812061491d91846138fc565b5f5b604085015151518110156149ab57604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b0183529390932060608901515183018201519286019091015190916149a1918391859161499c9190614991906149888930614cd2565b80821191030290565b808218908210021890565b6138fc565b505060010161491f565b505f5b845151518110156149f057845151600582901b01602001516149e7816149e1848960200151614cc290919063ffffffff16565b5f614cfc565b506001016149ae565b505f5b60808501515151811015614a3a57608085015151600582901b0160200151614a3181614a2c848960a00151614cc290919063ffffffff16565b614d3c565b506001016149f3565b505050505050505050565b8051805c80614a5b5763bc7ec7795f526004601cfd5b60018103825d505050565b5f385f3884865af16118b25763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416614abf57803d853b151710614abf576390b8ec185f526004601cfd5b505f603452505050565b6001600160a01b038181165f90815260018401602052604081205490911680151580614afa5750614afa8484614d97565b91509250929050565b5f82614b0f5750505050565b600581901b84013584018035801530021790602080820135916040810135019081019035614b40848484848a614da2565b50505050838390508160010191508103614b0f5750505050565b604080516060815290819052610e3f83836001600160a01b03166134c2565b604080516060815290819052610e3f83836134c2565b614c1c565b805181602083015b8281511015614bc857805160209290920180518252918252614bc8868301878301805182519091529052565b602001848110614b9c57508251815184528152614bef858201868501805182519091529052565b808360400111614c0457614c04858285614b94565b838160600111613a1a57613a1a858560208401614b94565b805180835114614c3857634e487b715f5260326020526024601cfd5b600281106138ec57828203602084018260051b8101614c58838284614b94565b82820151604087015b8051845114614c7d5781858501525f9150602084019350805184525b8085015191820191821015614c9e57634e487b715f5260116020526024601cfd5b602081019050828103614c6157509282019290925284900360051c93849052505052565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f511416614abf57803d853b151710614abf57633e3f8f735f526004601cfd5b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af16138ec576396b3de235f526004601cfd5b5f610e3f8383612af1565b614dae81868585612263565b614dd3578085848460405163f78c1b5360e01b81526004016139f894939291906159c4565b613a1a8585858585604051828482375f388483888a5af1612110573d5f823e3d81fd5b5f5f83601f840112614e06575f5ffd5b5081356001600160401b03811115614e1c575f5ffd5b6020830191508360208285010111156144c5575f5ffd5b5f5f5f60408486031215614e45575f5ffd5b8335925060208401356001600160401b03811115614e61575f5ffd5b614e6d86828701614df6565b9497909650939450505050565b5f60208284031215614e8a575f5ffd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f602082015160048110614ef457614ef4614e91565b8060208501525060408201511515604084015260608201516080606085015261252f6080850182614ea5565b602081525f610e3f6020830184614ed3565b6001600160a01b0381168114611915575f5ffd5b8015158114611915575f5ffd5b8035610f0881614f46565b5f5f5f5f60808587031215614f71575f5ffd5b843593506020850135614f8381614f32565b925060408501356001600160e01b031981168114614f9f575f5ffd5b91506060850135614faf81614f46565b939692955090935050565b803560078110610f08575f5ffd5b5f5f5f60608486031215614fda575f5ffd5b833592506020840135614fec81614f32565b9150614ffa60408501614fba565b90509250925092565b5f8151808452602084019350602083015f5b82811015615033578151865260209586019590910190600101615015565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561509457605f1987860301845261507f858351614ed3565b94506020938401939190910190600101615063565b505050508281036020840152612ab98185615003565b5f602082840312156150ba575f5ffd5b81356001600160c01b0381168114610e3f575f5ffd5b5f5f5f606084860312156150e2575f5ffd5b8335925060208401356150f481614f32565b9150604084013561510481614f32565b809150509250925092565b5f5f5f5f60808587031215615122575f5ffd5b84359350602085013561513481614f32565b925061514260408601614fba565b9396929550929360600135925050565b5f5f83601f840112615162575f5ffd5b5081356001600160401b03811115615178575f5ffd5b6020830191508360208260051b85010111156144c5575f5ffd5b5f5f5f604084860312156151a4575f5ffd5b83356001600160401b038111156151b9575f5ffd5b6151c586828701615152565b909790965060209590950135949350505050565b5f5f5f606084860312156151eb575f5ffd5b8335925060208401356151fd81614f32565b9150604084013561510481614f46565b60ff60f81b8816815260e060208201525f61522b60e0830189614ea5565b828103604084015261523d8189614ea5565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b81811015615292578351835260209384019390920191600101615274565b50909b9a5050505050505050505050565b602080825282518282018190525f918401906040840190835b818110156152f257835180516001600160a01b0390811685526020918201511681850152909301926040909201916001016152bc565b509095945050505050565b5f6020828403121561530d575f5ffd5b8135610e3f81614f32565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b038111828210171561534e5761534e615318565b60405290565b5f82601f830112615363575f5ffd5b81356001600160401b0381111561537c5761537c615318565b604051601f8201601f19908116603f011681016001600160401b03811182821017156153aa576153aa615318565b6040528181528382016020018510156153c1575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f602082840312156153ed575f5ffd5b81356001600160401b03811115615402575f5ffd5b820160808185031215615413575f5ffd5b61541b61532c565b813564ffffffffff8116811461542f575f5ffd5b8152602082013560048110615442575f5ffd5b602082015261545360408301614f53565b604082015260608201356001600160401b03811115615470575f5ffd5b61547c86828501615354565b606083015250949350505050565b602080825282518282018190525f918401906040840190835b818110156152f25783516001600160a01b03168352602093840193909201916001016154a3565b5f5f602083850312156154db575f5ffd5b82356001600160401b038111156154f0575f5ffd5b6154fc85828601615152565b90969095509350505050565b6007811061551857615518614e91565b9052565b5f8151808452602084019350602083015f5b8281101561503357815180516001600160a01b031687526020808201515f91615559908a0182615508565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e0909501946020919091019060010161552e565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b828110156155f957605f198786030184526155e485835161551c565b945060209384019391909101906001016155c8565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b8381101561565257601f1986840301855261563c838351615003565b6020958601959093509190910190600101615620565b509098975050505050505050565b5f5f60208385031215615671575f5ffd5b82356001600160401b03811115615686575f5ffd5b6154fc85828601614df6565b602081525f610e3f6020830184614ea5565b602081525f610e3f602083018461551c565b602081525f610e3f6020830184615003565b5f5f5f5f5f608086880312156156dc575f5ffd5b85359450602086013593506040860135925060608601356001600160401b03811115615706575f5ffd5b61571288828901614df6565b969995985093965092949392505050565b5f5f60408385031215615734575f5ffd5b8235915061574460208401614fba565b90509250929050565b5f5f5f5f60608587031215615760575f5ffd5b84359350602085013561577281614f32565b925060408501356001600160401b0381111561578c575f5ffd5b61579887828801614df6565b95989497509550505050565b5f602082840312156157b4575f5ffd5b8151610e3f81614f32565b805160208201516bffffffffffffffffffffffff19811691906014821015611780576bffffffffffffffffffffffff1960149290920360031b82901b161692915050565b634e487b7160e01b5f52601160045260245ffd5b818103818111156111f8576111f8615803565b8381526001600160a01b03831660208201526060810161252f6040830184615508565b634e487b7160e01b5f52603260045260245ffd5b5f6001820161587257615872615803565b5060010190565b8481526001600160a01b03841660208201526080810161589c6040830185615508565b82606083015295945050505050565b5f602082840312156158bb575f5ffd5b8151610e3f81614f46565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f61252f6020830184866158c6565b5f5f8335601e19843603018112615916575f5ffd5b8301803591506001600160401b0382111561592f575f5ffd5b6020019150368190038213156144c5575f5ffd5b5f85518060208801845e60d886901b6001600160d81b0319169083019081526004851061597257615972614e91565b60f894851b600582015292151590931b6006830152506007019392505050565b808201808211156111f8576111f8615803565b5f826159bf57634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f90612d5b90830184866158c656fe3232323232323232323232323232323232323232323232323232323232323232def24cb3236edf62937b12ea8dc676927599974e90729c6e9eafa9f05b03eab8a26469706673582212207819c488c52de9f8169c0319a15ea111bf01ef64355a91998b1935efbd5fd74f64736f6c634300081d0033" as const;


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

export const code = "0x610140604052604051615779380380615779833981016040819052610023916100e9565b306080524660a052606080610074604080518082018252600d81526c125d1a1858d85058d8dbdd5b9d609a1b60208083019190915282518084019093526005835264302e332e3360d81b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610116565b5f602082840312156100f9575f5ffd5b81516001600160a01b038116811461010f575f5ffd5b9392505050565b60805160a05160c05160e05161010051610120516155f96101805f395f81816106e1015281816108720152818161168601528181611d2a01528181611dea015261336901525f612b2301525f612bdd01525f612bb701525f612b6701525f612b4401526155f95ff3fe608060405260043610610249575f3560e01c8063912aa1b811610138578063cb4774c4116100b5578063e9ae5c5311610079578063e9ae5c53146107ba578063f81d87a7146107cd578063faba56d8146107ec578063fac750e01461080b578063fcd4e7071461081f578063ff619c6b1461084757610250565b8063cb4774c414610703578063cebfe33614610724578063d03c791414610743578063dcc09ebf14610762578063e5adda711461078e57610250565b8063b75c7dc6116100fc578063b75c7dc614610651578063bc2c554a14610670578063be766d151461069d578063bf530969146106b1578063c885f95a146106d057610250565b8063912aa1b8146105b55780639e49fbf1146105d4578063a840fe49146105e7578063ad07708314610606578063b70e36f01461063257610250565b80632f3f30c7116101c6578063598daac41161018a578063598daac4146104fe57806360d2f33d1461051d5780636fd91454146105505780637656d3041461056f57806384b0196e1461058e57610250565b80632f3f30c71461046c57806335058501146104865780633e1b0812146104a05780634223b5c2146104bf578063515c9d6d146104de57610250565b806317e69ab81161020d57806317e69ab8146103885780631a912f3e146103b757806320606b70146103f85780632081a2781461042b5780632150c5181461044a57610250565b80630cef73b41461028957806311a86fd6146102c457806312aaac7014610303578063136a12f71461032f5780631626ba7e1461035057610250565b3661025057005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a028214171561027b57806020526020603cf35b50633c10b94e5f526004601cfd5b348015610294575f5ffd5b506102a86102a3366004614a41565b610866565b6040805192151583526020830191909152015b60405180910390f35b3480156102cf575f5ffd5b506102eb73323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102bb565b34801561030e575f5ffd5b5061032261031d366004614a88565b610b64565b6040516102bb9190614b2e565b34801561033a575f5ffd5b5061034e610349366004614b6c565b610c53565b005b34801561035b575f5ffd5b5061036f61036a366004614a41565b610d78565b6040516001600160e01b031990911681526020016102bb565b348015610393575f5ffd5b506103a76103a2366004614a88565b610de0565b60405190151581526020016102bb565b3480156103c2575f5ffd5b506103ea7f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102bb565b348015610403575f5ffd5b506103ea7f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b348015610436575f5ffd5b5061034e610445366004614bd6565b610ea7565b348015610455575f5ffd5b5061045e610ff6565b6040516102bb929190614c4b565b348015610477575f5ffd5b5061036f630707070760e51b81565b348015610491575f5ffd5b5061036f631919191960e11b81565b3480156104ab575f5ffd5b506103ea6104ba366004614cb8565b611160565b3480156104ca575f5ffd5b506103226104d9366004614a88565b611198565b3480156104e9575f5ffd5b506103ea5f5160206155845f395f51905f5281565b348015610509575f5ffd5b5061034e610518366004614cde565b6111d0565b348015610528575f5ffd5b506103ea7f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b34801561055b575f5ffd5b506103ea61056a366004614d61565b611322565b34801561057a575f5ffd5b5061034e610589366004614da8565b61146c565b348015610599575f5ffd5b506105a2611526565b6040516102bb9796959493929190614de7565b3480156105c0575f5ffd5b5061034e6105cf366004614e7d565b61154c565b61034e6105e2366004614a88565b61167b565b3480156105f2575f5ffd5b506103ea610601366004614f5d565b6116dd565b348015610611575f5ffd5b50610625610620366004614a88565b611716565b6040516102bb919061500a565b34801561063d575f5ffd5b5061034e61064c366004614a88565b611729565b34801561065c575f5ffd5b5061034e61066b366004614a88565b611791565b34801561067b575f5ffd5b5061068f61068a366004615055565b6117e6565b6040516102bb92919061512d565b3480156106a8575f5ffd5b506103ea61191d565b3480156106bc575f5ffd5b5061034e6106cb3660046151eb565b611972565b3480156106db575f5ffd5b506102eb7f000000000000000000000000000000000000000000000000000000000000000081565b34801561070e575f5ffd5b50610717611a16565b6040516102bb919061521d565b34801561072f575f5ffd5b506103ea61073e366004614f5d565b611a2f565b34801561074e575f5ffd5b506103a761075d366004614a88565b611a97565b34801561076d575f5ffd5b5061078161077c366004614a88565b611aa9565b6040516102bb919061522f565b348015610799575f5ffd5b506107ad6107a8366004614a88565b611c6d565b6040516102bb9190615241565b61034e6107c8366004614a41565b611c80565b3480156107d8575f5ffd5b5061034e6107e7366004615253565b611d02565b3480156107f7575f5ffd5b506103ea6108063660046152ae565b611edd565b348015610816575f5ffd5b506103ea612015565b34801561082a575f5ffd5b5061083461c1d081565b60405161ffff90911681526020016102bb565b348015610852575f5ffd5b506103a76108613660046152d8565b612028565b63060f052a5f908152807f00000000000000000000000000000000000000000000000000000000000000006020826004601c845afa80155f5117156108b257639e87fac85f526004601cfd5b50604184146040851417156108e357306108cd878787612242565b6001600160a01b03161492505f9150610b5c9050565b60218410156108f857505f9150819050610b5c565b60201984810185811181871802811895870191820135935090601f19013560ff161561092a57610927876122ca565b96505b505f61093583610b64565b805190915064ffffffffff164281109015151615610957575f93505050610b5c565b5f8160200151600381111561096e5761096e614a9f565b036109c9575f80603f8711883581029060208a013502915091505f5f6109ad856060015180516020820151604090920151603f90911191820292910290565b915091506109be8b858585856122e3565b975050505050610b59565b6001816020015160038111156109e1576109e1614a9f565b03610a6657606081810151805160208083015160409384015184518084018e9052855180820385018152601f8d018590049094028101870186529485018b8152603f9490941091820295910293610a5d935f92610a56928e918e918291018382808284375f9201919091525061237c92505050565b8585612464565b95505050610b59565b600281602001516003811115610a7e57610a7e614a9f565b03610aad57610aa68160600151806020019051810190610a9e919061532f565b888888612583565b9350610b59565b600381602001516003811115610ac557610ac5614a9f565b03610b5957806060015151602014610af05760405163145a1fdd60e31b815260040160405180910390fd5b5f8160600151610aff9061534a565b60601c9050604051638afc93b48152886020820152846040820152606080820152866080820152868860a08301376084870160205f82601c8501865afa915050638afc93b45f5160e01c14811615610b5657600195505b50505b50505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f82815268448e3efef2f6a7f2f960205260408120610ba490612663565b8051909150610bc65760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610bda8383016020015190565b60d881901c855260c881901c915060d01c60ff166003811115610bff57610bff614a9f565b84602001906003811115610c1557610c15614a9f565b90816003811115610c2857610c28614a9f565b90525060ff811615156040850152610c4583838151811082025290565b606085015250919392505050565b333014610c72576040516282b42960e81b815260040160405180910390fd5b8380610c9157604051638707510560e01b815260040160405180910390fd5b5f5160206155845f395f51905f528514610ccc57610cae856126c9565b15610ccc57604051630442081560e01b815260040160405180910390fd5b610cd6848461272d565b15610cf4576040516303a6f8c760e21b815260040160405180910390fd5b610d1760e084901c606086901b1783610800610d0f89612755565b9291906127a4565b50604080518681526001600160a01b03861660208201526001600160e01b0319851681830152831515606082015290517f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e19181900360800190a15050505050565b5f5f5f610d86868686610866565b90925090508115158115151615610dbc57610da0816126c9565b80610db95750610db933610db3836127cd565b906127fc565b91505b81610dcb5763ffffffff610dd1565b631626ba7e5b60e01b925050505b9392505050565b5f333014610e00576040516282b42960e81b815260040160405180910390fd5b5f610e39610e35610e3260017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a6153a2565b90565b5c90565b90507f0a9f35b227e9f474cb86caa2e9b62847626fede22333cf52c7abea325d2eaa358114610e66575f5ffd5b610e9c610e97610e3260017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a6153a2565b6128a6565b60019150505b919050565b333014610ec6576040516282b42960e81b815260040160405180910390fd5b8280610ee557604051638707510560e01b815260040160405180910390fd5b610eee846126c9565b15610f0c5760405163f2fee1e160e01b815260040160405180910390fd5b5f610f1685612755565b6001600160a01b0385165f908152600282016020526040902060019091019150610f64846006811115610f4b57610f4b614a9f565b8254600160ff9092169190911b80198216845516151590565b15610f84575f610f73826128ac565b03610f8457610f8282866128c7565b505b610fb3816001015f866006811115610f9e57610f9e614a9f565b60ff1681526020019081526020015f205f9055565b7fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a27868686604051610fe6939291906153b5565b60405180910390a1505050505050565b6060805f611002612015565b9050806001600160401b0381111561101c5761101c614e98565b60405190808252806020026020018201604052801561106b57816020015b604080516080810182525f80825260208083018290529282015260608082015282525f1990920191018161103a5790505b509250806001600160401b0381111561108657611086614e98565b6040519080825280602002602001820160405280156110af578160200160208202803683370190505b5091505f805b82811015611155575f6110d68268448e3efef2f6a7f2f65b600201906129fc565b90505f6110e282610b64565b805190915064ffffffffff16428110901515161561110157505061114d565b80878581518110611114576111146153d8565b602002602001018190525081868581518110611132576111326153d8565b602090810291909101015283611147816153ec565b94505050505b6001016110b5565b508084528252509091565b6001600160c01b0381165f90815268448e3efef2f6a7f2f76020526040808220549083901b67ffffffffffffffff1916175b92915050565b604080516080810182525f808252602082018190529181019190915260608082015261119261031d8368448e3efef2f6a7f2f66110cd565b3330146111ef576040516282b42960e81b815260040160405180910390fd5b838061120e57604051638707510560e01b815260040160405180910390fd5b611217856126c9565b156112355760405163f2fee1e160e01b815260040160405180910390fd5b5f61123f86612755565b600101905061125081866040612a45565b506001600160a01b0385165f908152600182016020526040902061129685600681111561127f5761127f614a9f565b8254600160ff9092169190911b8082178455161590565b505f816001015f8760068111156112af576112af614a9f565b60ff1681526020019081526020015f2090505f6112cb82612a81565b86815290506112da8282612acb565b7f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a8989898960405161130f9493929190615404565b60405180910390a1505050505050505050565b5f8061133e8460408051828152600190920160051b8201905290565b90505f5b848110156113e957600581901b860135860180358015300217906020808201359160408101350190810190356113d9856113ca7f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876113ab8888612b10565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b5050505050806001019050611342565b5061c1d060f084901c145f6114437f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b9050816114585761145381612b21565b611461565b61146181612c37565b979650505050505050565b33301461148b576040516282b42960e81b815260040160405180910390fd5b5f83815268448e3efef2f6a7f2f9602052604090205460ff166114c15760405163395ed8c160e21b815260040160405180910390fd5b6114da82826102006114d2876127cd565b929190612cab565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc9983604051611519911515815260200190565b60405180910390a3505050565b600f60f81b6060805f80808361153a612cc6565b97989097965046955030945091925090565b33301461156b576040516282b42960e81b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c525190555f6115a6612cc6565b915061160290507f0a9f35b227e9f474cb86caa2e9b62847626fede22333cf52c7abea325d2eaa356115fc610e3260017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a6153a2565b90612d09565b306317e69ab861161183612d10565b6040518263ffffffff1660e01b815260040161162f91815260200190565b6020604051808303815f875af115801561164b573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061166f9190615436565b611677575f5ffd5b5050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146116c3576040516282b42960e81b815260040160405180910390fd5b6116da68448e3efef2f6a7f2f65b60010182612d38565b50565b5f611192826020015160038111156116f7576116f7614a9f565b60ff168360600151805190602001205f1c5f9182526020526040902090565b6060611192611724836127cd565b612d4f565b333014611748576040516282b42960e81b815260040160405180910390fd5b61175b68448e3efef2f6a7f2f782612e23565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b3330146117b0576040516282b42960e81b815260040160405180910390fd5b6117b981612e8d565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b0381111561180257611802614e98565b60405190808252806020026020018201604052801561183557816020015b60608152602001906001900390816118205790505b509250806001600160401b0381111561185057611850614e98565b60405190808252806020026020018201604052801561188357816020015b606081526020019060019003908161186e5790505b5091505f5b81811015611914576118b18686838181106118a5576118a56153d8565b90506020020135611aa9565b8482815181106118c3576118c36153d8565b60200260200101819052506118ef8686838181106118e3576118e36153d8565b90506020020135611c6d565b838281518110611901576119016153d8565b6020908102919091010152600101611888565b50509250929050565b5f8061194b61193a60015f5160206155a45f395f51905f526153a2565b604080516020810190915290815290565b905061195681515c90565b5f0361196357505f919050565b61196c81612ef8565b91505090565b333014611991576040516282b42960e81b815260040160405180910390fd5b6119d982828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f920191909152506119d39250612656915050565b90612f18565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611a0a929190615479565b60405180910390a15050565b6060611a2a68448e3efef2f6a7f2f6612663565b905090565b5f333014611a4f576040516282b42960e81b815260040160405180910390fd5b611a5882612f70565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611a8a9190614b2e565b60405180910390a2919050565b5f611aa182613019565b151592915050565b60605f611ab583612755565b6001019050611ad06040518060200160405280606081525090565b5f611ada83613062565b90505f5b81811015611c63575f611af185836130b3565b6001600160a01b0381165f9081526001870160205260408120919250611b168261310c565b90505f5b8151811015611c54575f828281518110611b3657611b366153d8565b602002602001015190505f611b5f856001015f8460ff1681526020019081526020015f20612a81565b9050611b9c6040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166006811115611bb157611bb1614a9f565b81602001906006811115611bc757611bc7614a9f565b90816006811115611bda57611bda614a9f565b9052506001600160a01b03871681528151604080830191909152820151608082015260208201516060820152611c1f4260ff8516600681111561080657610806614a9f565b60c08201819052608082015160608301519111150260a082015280611c448b82613165565b5050505050806001019050611b1a565b50505050806001019050611ade565b5050519392505050565b6060611192611c7b83612755565b61320e565b5f611c8a84613019565b905080600303611ca557611c9f8484846132c7565b50505050565b365f365f84611cbb57637f1812755f526004601cfd5b5085358087016020810194503592505f90604011600286141115611ce9575050602080860135860190810190355b611cf88888888787878761335f565b5050505050505050565b813580830190604081901c602084101715611d1b575f5ffd5b50611d90336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611d8730611d5c6020860186614e7d565b6001600160a01b03161430611d776080870160608801614e7d565b6001600160a01b03161417151590565b15159015151690565b611dac576040516282b42960e81b815260040160405180910390fd5b30611dbd6080830160608401614e7d565b6001600160a01b031603611e3d575f80611ddf866102a36101a086018661548c565b915091508096505f197f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03163103611e1d57600191505b81611e3a576040516282b42960e81b815260040160405180910390fd5b50505b611e68611e5060a0830160808401614e7d565b611e6261018084016101608501614e7d565b88613577565b841580611e795750611e79856126c9565b611ed5575f611e8786612755565b600181019150611ed3906002015f611ea560a0860160808701614e7d565b6001600160a01b0316815260208101919091526040015f20611ecd60a0850160808601614e7d565b8961359f565b505b505050505050565b5f80826006811115611ef157611ef1614a9f565b03611f0457603c808404025b9050611192565b6001826006811115611f1857611f18614a9f565b03611f2957610e1080840402611efd565b6002826006811115611f3d57611f3d614a9f565b03611f4f576201518080840402611efd565b6003826006811115611f6357611f63614a9f565b03611f89576007600362015180808604918201929092069003620545ff85110202611efd565b5f5f611f94856136c4565b5090925090506004846006811115611fae57611fae614a9f565b03611fc857611fbf8282600161376e565b92505050611192565b6005846006811115611fdc57611fdc614a9f565b03611fed57611fbf8260018061376e565b600684600681111561200157612001614a9f565b0361201157600192505050611192565b5f5ffd5b5f611a2a68448e3efef2f6a7f2f86137c5565b5f846120365750600161223a565b61203f856126c9565b1561204c5750600161223a565b631919191960e11b60048310612060575082355b8261206f5750630707070760e51b5b612079858261272d565b15612087575f91505061223a565b5f61209187612755565b905061209c816137c5565b15612159576120b760e083901c606088901b175b8290613811565b156120c75760019250505061223a565b6120da6332323232606088901b176120b0565b156120ea5760019250505061223a565b61211060e083901c73191919191919191919191919191919191919191960611b176120b0565b156121205760019250505061223a565b6121497f32323232323232323232323232323232323232320000000000000000323232326120b0565b156121595760019250505061223a565b61216f5f5160206155845f395f51905f52612755565b905061217a816137c5565b156122345761219260e083901c606088901b176120b0565b156121a25760019250505061223a565b6121b56332323232606088901b176120b0565b156121c55760019250505061223a565b6121eb60e083901c73191919191919191919191919191919191919191960611b176120b0565b156121fb5760019250505061223a565b6122247f32323232323232323232323232323232323232320000000000000000323232326120b0565b156122345760019250505061223a565b5f925050505b949350505050565b5f604051826040811461225d576041811461228457506122b5565b60208581013560ff81901c601b0190915285356040526001600160ff1b0316606052612295565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d6122c2575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d610ea257fe5b5f6040518681528560208201528460408201528360608201528260808201525f5f5260205f60a0836101005afa503d612347576d1ab2e8006fd8b71907bf06a5bdee3b6123475760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa61234757fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b6123b16040518060c0016040528060608152602001606081526020015f81526020015f81526020015f81526020015f81525090565b815160c0811061245e5760208301818101818251018281108260c083011117156123dd5750505061245e565b8081510192508060208201510181811083821117828510848611171715612407575050505061245e565b8281516020830101118385516020870101111715612428575050505061245e565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f5f5f61247388600180613895565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561255757602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061255757fe5b5050508215612578576125758287608001518860a0015188886122e3565b92505b505095945050505050565b5f6001600160a01b0385161561223a57604051853b6126135782604081146125b357604181146125da575061264d565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526125eb565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f6060528060405261264d565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b68448e3efef2f6a7f2f690565b60405181546020820190600881901c5f8260ff84171461269157505080825260ff8116601f808211156126b3575b855f5260205f205b8160051c8101548286015260208201915082821061269957505b508084525f920191825250602001604052919050565b5f81815268448e3efef2f6a7f2f960205260408120805460ff808216908114801590910260089290921c0217806127135760405163395ed8c160e21b815260040160405180910390fd5b612720825f198301613986565b60ff161515949350505050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f5160206155845f395f51905f52831461277957612774836139f3565b612788565b5f5160206155845f395f51905f525b68b11ddb8fabd886bebb6009525f908152602990209392505050565b5f826127b9576127b48585613a20565b6127c4565b6127c4858584613b1e565b95945050505050565b5f81815268448e3efef2f6a7f2fa602052604081208054601f5263d4203f8b6004528152603f81208190610dd9565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016128375763f5a267f15f526004601cfd5b826128495768fbb67fda52d4bfb8bf92505b80546001600160601b03811661288d5760019250838160601c031561289e57600182015460601c841461289e57600282015460601c841461289e575b5f925061289e565b81602052835f5260405f2054151592505b505092915050565b5f815d50565b5f81545b801561245e576001918201918119018116186128b0565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016129025763f5a267f15f526004601cfd5b826129145768fbb67fda52d4bfb8bf92505b80546001600160601b0381168061298e5760019350848260601c0361294c5760018301805484556002840180549091555f90556129f3565b84600184015460601c0361296d5760028301805460018501555f90556129f3565b84600284015460601c03612986575f60028401556129f3565b5f93506129f3565b82602052845f5260405f208054806129a75750506129f3565b60018360011c0392508260018203146129d7578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612a26836137c5565b821061119257604051634e23d03560e01b815260040160405180910390fd5b5f612a508484613b3b565b90508015610dd95781612a6285613062565b1115610dd95760405163155176b960e11b815260040160405180910390fd5b612aa260405180606001604052805f81526020015f81526020015f81525090565b5f612aac83612663565b905080515f1461245e575f612ac082613c96565b602001949350505050565b60408051825160208083019190915283015181830152908201516060820152611677908390612b0b90608001604051602081830303815290604052613de2565b612f18565b5f8183604051375060405120919050565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f0000000000000000000000000000000000000000000000000000000000000000461416612c145750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f5f5f612c42612cc6565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b5f82612cbb576127b485856128c7565b6127c4858584612a45565b604080518082018252600d81526c125d1a1858d85058d8dbdd5b9d609a1b60208083019190915282518084019093526005835264302e332e3360d81b9083015291565b80825d5050565b805160218110612d275763ec92f9a35f526004601cfd5b9081015160209190910360031b1b90565b5f5f612d44848461400f565b600101905550505050565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c9250838314158302815281612ddd578215612dd857600191508185015460601c92508215612dd8578284141590920260208301525060028381015460601c918215612dd8576003915083831415830260408201525b612e0d565b600191821c915b82811015612e0b578581015460601c858114158102600583901b8401529350600101612de4565b505b8186528160051b81016040525050505050919050565b604081811c5f90815260208490522080546001600160401b0383161015612e5d576040516312ee5c9360e01b815260040160405180910390fd5b612e87612e81836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f81815268448e3efef2f6a7f2f96020908152604080832083905568448e3efef2f6a7f2fa90915290208054600101905568448e3efef2f6a7f2f6612edb68448e3efef2f6a7f2f883613a20565b6116775760405163395ed8c160e21b815260040160405180910390fd5b80515f90805c80612f105763bc7ec7795f526004601cfd5b015c92915050565b80518060081b60ff175f60fe8311612f41575050601f8281015160081b82179080831115612f68575b60208401855f5260205f205b828201518360051c820155602083019250848310612f4d5750505b509092555050565b5f816040015115612fa557612f888260200151614055565b612fa5576040516321b9b33960e21b815260040160405180910390fd5b612fae826116dd565b90505f68448e3efef2f6a7f2f660608401518451602080870151604080890151905195965061300595612fe3959493016154ce565b60408051601f198184030181529181525f858152600385016020522090612f18565b6130126002820183614071565b5050919050565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c15176130ab576001935083830154156130ab576002935083830154156130ab57600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf821415820291506130e684613062565b831061310557604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b801561314f5761ffff8116613134576010918201911c613119565b8183526020600582901b16909201916001918201911c613119565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c5536020840351818106158282040290508083106131fd578281178101811582602001870160405118176131c957828102601f1987015285016020016040526131fd565b602060405101816020018101604052808a52601f19855b88810151838201528101806131e057509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf90602084018161328757835480156132815780841415028152600184810154909250801561328157808414150260208201526002848101549092508015613281576003925083811415810260408301525b506132b2565b8160011c91505f5b828110156132b057848101548481141502600582901b83015260010161328f565b505b8185528160051b810160405250505050919050565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c171561330c57633995943b5f526004601cfd5b505f5b838114611ed357365f8260051b850135808601602081019350803592505084828401118160401c171561334957633995943b5f526004601cfd5b50613355898383611c80565b505060010161330f565b6001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016330361342557602081146133b05760405163438e981560e11b815260040160405180910390fd5b60408051602081019091528235906133e5908290806133dd60015f5160206155a45f395f51905f526153a2565b905290614183565b6133f085858361419d565b604080516020810190915261341f908061341860015f5160206155a45f395f51905f526153a2565b9052614633565b50611ed3565b8061345957333014613449576040516282b42960e81b815260040160405180910390fd5b61345484845f61419d565b611ed3565b602081101561347b5760405163438e981560e11b815260040160405180910390fd5b813561348f68448e3efef2f6a7f2f66116d1565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f5f6134ec6134d2888886611322565b602080871081881802188088019080880390881102610866565b915091508161350d576040516282b42960e81b815260040160405180910390fd5b61353881604051806020016040528060015f5160206155a45f395f51905f525f1c6133dd91906153a2565b61354387878361419d565b604080516020810190915261356b908061341860015f5160206155a45f395f51905f526153a2565b50505050505050505050565b6001600160a01b0383166135945761358f8282614654565b505050565b61358f83838361466d565b806135a957505050565b5f6135b38461310c565b905080515f036135d657604051635ee7e5b160e01b815260040160405180910390fd5b5f5b81518110156136bd575f8282815181106135f4576135f46153d8565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f61362182612a81565b90505f61363d428560ff16600681111561080657610806614a9f565b9050808260400151101561365957604082018190525f60208301525b815f0151878360200181815161366f919061551d565b91508181525011156136a45760405163482a648960e11b81526001600160a01b03891660048201526024015b60405180910390fd5b6136ae8383612acb565b505050508060010190506135d8565b5050505050565b5f80806137616136d76201518086615530565b5f5f5f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c9250806130125781545f9350156130125760019250828201541561301257600292508282015415613012575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf830361383e5763f5a267f15f526004601cfd5b826138505768fbb67fda52d4bfb8bf92505b80195461388157805460019250831461310557600181015483146131055760028101548314613105575f9150613105565b602052505f90815260409020541515919050565b6060835180156122c2576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f518452600484019350828410613910579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f82548060ff8217146139ce57601e83116139a55780831a9150613105565b8060ff1683116139c957835f52601f83038060051c60205f200154601f82161a9250505b613105565b8060081c831161310557835f528260051c60205f200154601f84161a91505092915050565b5f81815268448e3efef2f6a7f2fa602052604081208054601f5263d4203f8b6004528152603f8120611192565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613a4d5763f5a267f15f526004601cfd5b82613a5f5768fbb67fda52d4bfb8bf92505b80195480613ac0576001925083825403613a8c5760018201805483556002830180549091555f905561289e565b83600183015403613aaa5760028201805460018401555f905561289e565b83600283015403612885575f600283015561289e565b81602052835f5260405f20805480613ad957505061289e565b60018360011c039250826001820314613b0357828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f613b298484614071565b90508015610dd95781612a62856137c5565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301613b765763f5a267f15f526004601cfd5b82613b885768fbb67fda52d4bfb8bf92505b80546001600160601b0381168260205280613c4a578160601c80613bb6578560601b845560019450506129f3565b858103613bc357506129f3565b600184015460601c80613be4578660601b60018601556001955050506129f3565b868103613bf25750506129f3565b600285015460601c80613c14578760601b6002870155600196505050506129f3565b878103613c23575050506129f3565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f208054613c8c57600191821c808301825591945081613c78578560601b6003178455506129f3565b8560601b82850155826002018455506129f3565b5050505092915050565b6060815115610ea2576040519050600482018051835184602001017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f6020850183198552866020015b8051805f1a613d3757600190811a0160808111613d17576002820191508036843791820191848210613d115750613dc4565b50613cdf565b5f198352918201607f19019160029190910190848210613d115750613dc4565b80835283811684011783171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f8601f6f8421084210842108cc6318c6db6d54be660204081020408185821060071b86811c6001600160401b031060061b1795861c0260181a1c161a90911860031c019182019101838110613cdf5783811115613dc457838103820391505b509290935250601f198382030183525f815260200160405250919050565b6060613e3a565b6fffffffffffffffffffffffffffffffff811160071b81811c6001600160401b031060061b1781811c63ffffffff1060051b1781811c61ffff1060041b1790811c60ff1060039190911c17601f1890565b50604051815182017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f60208301845b838114613feb57600101805160ff1680613ef3575b602082015180613ec25782860360208181189082110218607f839003818111818318021893840193928301929050601f8111613ebb575050613ee3565b5050613e7e565b613ecb81613de9565b90508286038181118183180218928301929190910190505b60f01b8252600290910190613e69565b60ff8103613f4657602080830151198015613f1457613f1181613de9565b91505b508286038181118282180218601f81811890821102186080811760f01b8552600290940193929092019150613e699050565b80835350602081015160018381018290528482168501821791198581168601179190911684171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f86f8421084210842108cc6318c6db6d54be660204081020408184821060071b85811c6001600160401b031060061b1794851c0260181a1c601f161a90911860031c018286038181119181189190910218928301019101613e69565b50600484018051199052601f198482030184525f8152602001604052509092915050565b604081811c5f90815260208490522080546001600160401b0380841682149082101661404e57604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f8082600381111561406957614069614a9f565b141592915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf830361409e5763f5a267f15f526004601cfd5b826140b05768fbb67fda52d4bfb8bf92505b8019548160205280614154578154806140d057848355600193505061289e565b8481036140dd575061289e565b6001830154806140f85785600185015560019450505061289e565b85810361410657505061289e565b600284015480614122578660028601556001955050505061289e565b8681036141315750505061289e565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f2080546129f357600191821c8381018690558083019182905590821b821783195590925061289e565b5f825f015190506001815c01828183015d80825d50505050565b8015806141ae57506141ae816126c9565b156141be5761358f8383836146b7565b5f6141c882612755565b60010190506142366040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f61424083613062565b90505f5b81811015614292575f61425785836130b3565b90506001600160a01b03811615614289576040840151614277908261470e565b506060840151614287905f613165565b505b50600101614244565b505f5f5b8681101561445057600581901b8801358801803580153002179060208082013591604081013501908101903582156142d5576142d2838761551d565b95505b60048110156142e75750505050614448565b813560e01c63a9059cbb81900361431d576040890151614307908661470e565b5061431b602484013560608b01519061472d565b505b8063ffffffff1663095ea7b3036143655760248301355f03614343575050505050614448565b885161434f908661470e565b50614363600484013560208b01519061472d565b505b8063ffffffff166387517c45036143dd576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba31461439f575050505050614448565b60448301355f036143b4575050505050614448565b6143c7600484013560808b01519061472d565b506143db602484013560a08b01519061472d565b505b8063ffffffff1663598daac403614442576001600160a01b0385163014614408575050505050614448565b8a60048401351461441d575050505050614448565b614430602484013560408b01519061472d565b506060890151614440905f613165565b505b50505050505b600101614296565b506040830151516060840151516144679190614743565b5f61449a6144788560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b604085015151518110156144e657604085015151600582901b01602001516144dc826144ca8330614819565b85919060059190911b82016020015290565b505060010161449e565b506144f28888886146b7565b5f808052600186016020526040812061450b918461359f565b5f5b6040850151515181101561459957604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b01835293909320606089015151830182015192860190910151909161458f918391859161458a919061457f906145768930614819565b80821191030290565b808218908210021890565b61359f565b505060010161450d565b505f5b845151518110156145de57845151600582901b01602001516145d5816145cf84896020015161480990919063ffffffff16565b5f614843565b5060010161459c565b505f5b6080850151515181101561462857608085015151600582901b016020015161461f8161461a848960a0015161480990919063ffffffff16565b614883565b506001016145e1565b505050505050505050565b8051805c806146495763bc7ec7795f526004601cfd5b60018103825d505050565b5f385f3884865af16116775763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f5114166146ad57803d853b1517106146ad576390b8ec185f526004601cfd5b505f603452505050565b5f826146c35750505050565b600581901b840135840180358015300217906020808201359160408101350190810190356146f4848484848a6148de565b505050508383905081600101915081036146c35750505050565b604080516060815290819052610dd983836001600160a01b0316613165565b604080516060815290819052610dd98383613165565b604051815183511461476157634e487b715f5260326020526024601cfd5b825161476c57505050565b5f5f6147778561491c565b6147808561491c565b9150915061478d8561494b565b614796856149a0565b848403601f196020870187518752875160051b3684830137845160051b5b8086015181860151835b828151146147ce576020016147be565b8601805182018082528211156147f057634e487b715f5260116020526024601cfd5b5050508201806147b45750505050826040525050505050565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f5114166146ad57803d853b1517106146ad57633e3f8f735f526004601cfd5b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af161358f576396b3de235f526004601cfd5b6148ea81868585612028565b61490f578085848460405163f78c1b5360e01b815260040161369b949392919061554f565b6136bd85858585856149e9565b604051815160051b8101602001818084035b80820151825281602001915082820361492e575060405250919050565b80515f82528060051b8201601f19602084015b602001828111614999578051828201805182811161497e5750505061495e565b5b60208201528301805182811161497f57506020015261495e565b5050509052565b60028151106116da576020810160408201600183510160051b83015b81518351146149d057602083019250815183525b6020820191508082036149bc57505081900360051c9052565b604051828482375f388483888a5af1611ed5573d5f823e3d81fd5b5f5f83601f840112614a14575f5ffd5b5081356001600160401b03811115614a2a575f5ffd5b60208301915083602082850101111561404e575f5ffd5b5f5f5f60408486031215614a53575f5ffd5b8335925060208401356001600160401b03811115614a6f575f5ffd5b614a7b86828701614a04565b9497909650939450505050565b5f60208284031215614a98575f5ffd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f602082015160048110614b0257614b02614a9f565b8060208501525060408201511515604084015260608201516080606085015261223a6080850182614ab3565b602081525f610dd96020830184614ae1565b6001600160a01b03811681146116da575f5ffd5b80151581146116da575f5ffd5b8035610ea281614b54565b5f5f5f5f60808587031215614b7f575f5ffd5b843593506020850135614b9181614b40565b925060408501356001600160e01b031981168114614bad575f5ffd5b91506060850135614bbd81614b54565b939692955090935050565b803560078110610ea2575f5ffd5b5f5f5f60608486031215614be8575f5ffd5b833592506020840135614bfa81614b40565b9150614c0860408501614bc8565b90509250925092565b5f8151808452602084019350602083015f5b82811015614c41578151865260209586019590910190600101614c23565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b82811015614ca257605f19878603018452614c8d858351614ae1565b94506020938401939190910190600101614c71565b5050505082810360208401526127c48185614c11565b5f60208284031215614cc8575f5ffd5b81356001600160c01b0381168114610dd9575f5ffd5b5f5f5f5f60808587031215614cf1575f5ffd5b843593506020850135614d0381614b40565b9250614d1160408601614bc8565b9396929550929360600135925050565b5f5f83601f840112614d31575f5ffd5b5081356001600160401b03811115614d47575f5ffd5b6020830191508360208260051b850101111561404e575f5ffd5b5f5f5f60408486031215614d73575f5ffd5b83356001600160401b03811115614d88575f5ffd5b614d9486828701614d21565b909790965060209590950135949350505050565b5f5f5f60608486031215614dba575f5ffd5b833592506020840135614dcc81614b40565b91506040840135614ddc81614b54565b809150509250925092565b60ff60f81b8816815260e060208201525f614e0560e0830189614ab3565b8281036040840152614e178189614ab3565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b81811015614e6c578351835260209384019390920191600101614e4e565b50909b9a5050505050505050505050565b5f60208284031215614e8d575f5ffd5b8135610dd981614b40565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b0381118282101715614ece57614ece614e98565b60405290565b5f82601f830112614ee3575f5ffd5b81356001600160401b03811115614efc57614efc614e98565b604051601f8201601f19908116603f011681016001600160401b0381118282101715614f2a57614f2a614e98565b604052818152838201602001851015614f41575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f60208284031215614f6d575f5ffd5b81356001600160401b03811115614f82575f5ffd5b820160808185031215614f93575f5ffd5b614f9b614eac565b813564ffffffffff81168114614faf575f5ffd5b8152602082013560048110614fc2575f5ffd5b6020820152614fd360408301614b61565b604082015260608201356001600160401b03811115614ff0575f5ffd5b614ffc86828501614ed4565b606083015250949350505050565b602080825282518282018190525f918401906040840190835b8181101561504a5783516001600160a01b0316835260209384019390920191600101615023565b509095945050505050565b5f5f60208385031215615066575f5ffd5b82356001600160401b0381111561507b575f5ffd5b61508785828601614d21565b90969095509350505050565b600781106150a3576150a3614a9f565b9052565b5f8151808452602084019350602083015f5b82811015614c4157815180516001600160a01b031687526020808201515f916150e4908a0182615093565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e090950194602091909101906001016150b9565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561518457605f1987860301845261516f8583516150a7565b94506020938401939190910190600101615153565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b838110156151dd57601f198684030185526151c7838351614c11565b60209586019590935091909101906001016151ab565b509098975050505050505050565b5f5f602083850312156151fc575f5ffd5b82356001600160401b03811115615211575f5ffd5b61508785828601614a04565b602081525f610dd96020830184614ab3565b602081525f610dd960208301846150a7565b602081525f610dd96020830184614c11565b5f5f5f5f5f60808688031215615267575f5ffd5b85359450602086013593506040860135925060608601356001600160401b03811115615291575f5ffd5b61529d88828901614a04565b969995985093965092949392505050565b5f5f604083850312156152bf575f5ffd5b823591506152cf60208401614bc8565b90509250929050565b5f5f5f5f606085870312156152eb575f5ffd5b8435935060208501356152fd81614b40565b925060408501356001600160401b03811115615317575f5ffd5b61532387828801614a04565b95989497509550505050565b5f6020828403121561533f575f5ffd5b8151610dd981614b40565b805160208201516bffffffffffffffffffffffff19811691906014821015613012576bffffffffffffffffffffffff1960149290920360031b82901b161692915050565b634e487b7160e01b5f52601160045260245ffd5b818103818111156111925761119261538e565b8381526001600160a01b03831660208201526060810161223a6040830184615093565b634e487b7160e01b5f52603260045260245ffd5b5f600182016153fd576153fd61538e565b5060010190565b8481526001600160a01b0384166020820152608081016154276040830185615093565b82606083015295945050505050565b5f60208284031215615446575f5ffd5b8151610dd981614b54565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f61223a602083018486615451565b5f5f8335601e198436030181126154a1575f5ffd5b8301803591506001600160401b038211156154ba575f5ffd5b60200191503681900382131561404e575f5ffd5b5f85518060208801845e60d886901b6001600160d81b031916908301908152600485106154fd576154fd614a9f565b60f894851b600582015292151590931b6006830152506007019392505050565b808201808211156111925761119261538e565b5f8261554a57634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f906155799083018486615451565b969550505050505056fe3232323232323232323232323232323232323232323232323232323232323232def24cb3236edf62937b12ea8dc676927599974e90729c6e9eafa9f05b03eab8a26469706673582212209ce7fe8980529f5a41ed4f6d3ab5da5eb4cec1fef0300aa0daaa0a63b743b02064736f6c634300081d0033" as const;


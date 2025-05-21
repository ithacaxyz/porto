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
        "internalType": "struct PortoAccountOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum PortoAccountOld.KeyType"
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
        "internalType": "struct PortoAccountOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum PortoAccountOld.KeyType"
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
        "internalType": "struct PortoAccountOld.Key[]",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum PortoAccountOld.KeyType"
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
        "internalType": "struct PortoAccountOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum PortoAccountOld.KeyType"
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
        "internalType": "struct PortoAccountOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum PortoAccountOld.KeyType"
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
        "internalType": "struct PortoAccountOld.Key",
        "components": [
          {
            "name": "expiry",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "keyType",
            "type": "uint8",
            "internalType": "enum PortoAccountOld.KeyType"
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

export const code = "0x610140604052604051615b3e380380615b3e833981016040819052610023916100e8565b306080524660a052606080610073604080518082018252600c81526b141bdc9d1bd058d8dbdd5b9d60a21b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250506001600160a01b031661012052610115565b5f602082840312156100f8575f5ffd5b81516001600160a01b038116811461010e575f5ffd5b9392505050565b60805160a05160c05160e05161010051610120516159bf61017f5f395f8181610735015281816108e20152818161184701528181611ee601528181611fa60152613a8a01525f61324501525f6132ff01525f6132d901525f61328901525f61326601526159bf5ff3fe60806040526004361061026a575f3560e01c8063912aa1b811610143578063cebfe336116100b5578063e9ae5c5311610079578063e9ae5c531461082a578063f81d87a71461083d578063faba56d81461085c578063fac750e01461087b578063fcd4e7071461088f578063ff619c6b146108b757610271565b8063cebfe33614610778578063d03c791414610797578063dcc09ebf146107b6578063e28250b4146107e2578063e5adda71146107fe57610271565b8063b75c7dc611610107578063b75c7dc6146106a5578063bc2c554a146106c4578063be766d15146106f1578063bf53096914610705578063c885f95a14610724578063cb4774c41461075757610271565b8063912aa1b8146106095780639e49fbf114610628578063a840fe491461063b578063ad0770831461065a578063b70e36f01461068657610271565b806335058501116101dc578063598daac4116101a0578063598daac41461053e57806360d2f33d1461055d5780636c95d5a7146105905780636fd91454146105a45780637656d304146105c357806384b0196e146105e257610271565b806335058501146104a757806336745d10146104c15780633e1b0812146104e05780634223b5c2146104ff578063515c9d6d1461051e57610271565b806317e69ab81161022e57806317e69ab8146103a95780631a912f3e146103d857806320606b70146104195780632081a2781461044c5780632150c5181461046b5780632f3f30c71461048d57610271565b80630cef73b4146102aa57806311a86fd6146102e557806312aaac7014610324578063136a12f7146103505780631626ba7e1461037157610271565b3661027157005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a028214171561029c57806020526020603cf35b50633c10b94e5f526004601cfd5b3480156102b5575f5ffd5b506102c96102c4366004614e11565b6108d6565b6040805192151583526020830191909152015b60405180910390f35b3480156102f0575f5ffd5b5061030c73323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020016102dc565b34801561032f575f5ffd5b5061034361033e366004614e58565b610bd4565b6040516102dc9190614efe565b34801561035b575f5ffd5b5061036f61036a366004614f3c565b610cc3565b005b34801561037c575f5ffd5b5061039061038b366004614e11565b610de8565b6040516001600160e01b031990911681526020016102dc565b3480156103b4575f5ffd5b506103c86103c3366004614e58565b610e50565b60405190151581526020016102dc565b3480156103e3575f5ffd5b5061040b7f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac848381565b6040519081526020016102dc565b348015610424575f5ffd5b5061040b7f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b348015610457575f5ffd5b5061036f610466366004614fa6565b610f17565b348015610476575f5ffd5b5061047f611066565b6040516102dc92919061501b565b348015610498575f5ffd5b50610390630707070760e51b81565b3480156104b2575f5ffd5b50610390631919191960e11b81565b3480156104cc575f5ffd5b506103c86104db366004615088565b6111d0565b3480156104eb575f5ffd5b5061040b6104fa3660046150c6565b611334565b34801561050a575f5ffd5b50610343610519366004614e58565b61136a565b348015610529575f5ffd5b5061040b5f51602061594a5f395f51905f5281565b348015610549575f5ffd5b5061036f6105583660046150ec565b6113a2565b348015610568575f5ffd5b5061040b7f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5781565b34801561059b575f5ffd5b506103c86114f4565b3480156105af575f5ffd5b5061040b6105be36600461516f565b611511565b3480156105ce575f5ffd5b5061036f6105dd3660046151b6565b61162d565b3480156105ed575f5ffd5b506105f66116e7565b6040516102dc97969594939291906151f5565b348015610614575f5ffd5b5061036f61062336600461528b565b61170d565b61036f610636366004614e58565b61183c565b348015610646575f5ffd5b5061040b61065536600461536b565b61189e565b348015610665575f5ffd5b50610679610674366004614e58565b6118d7565b6040516102dc9190615418565b348015610691575f5ffd5b5061036f6106a0366004614e58565b6118ea565b3480156106b0575f5ffd5b5061036f6106bf366004614e58565b611952565b3480156106cf575f5ffd5b506106e36106de366004615463565b6119a7565b6040516102dc92919061552f565b3480156106fc575f5ffd5b5061040b611ade565b348015610710575f5ffd5b5061036f61071f366004615088565b611b33565b34801561072f575f5ffd5b5061030c7f000000000000000000000000000000000000000000000000000000000000000081565b348015610762575f5ffd5b5061076b611bd7565b6040516102dc91906155ed565b348015610783575f5ffd5b5061040b61079236600461536b565b611beb565b3480156107a2575f5ffd5b506103c86107b1366004614e58565b611c53565b3480156107c1575f5ffd5b506107d56107d0366004614e58565b611c65565b6040516102dc91906155ff565b3480156107ed575f5ffd5b50684622cad2e2306de4d05461040b565b348015610809575f5ffd5b5061081d610818366004614e58565b611e29565b6040516102dc9190615611565b61036f610838366004614e11565b611e3c565b348015610848575f5ffd5b5061036f610857366004615623565b611ebe565b348015610867575f5ffd5b5061040b61087636600461567e565b612099565b348015610886575f5ffd5b5061040b6121d1565b34801561089a575f5ffd5b506108a461c1d081565b60405161ffff90911681526020016102dc565b3480156108c2575f5ffd5b506103c86108d13660046156a8565b6121e4565b63060f052a5f908152807f00000000000000000000000000000000000000000000000000000000000000006020826004601c845afa80155f51171561092257639e87fac85f526004601cfd5b5060418414604085141715610953573061093d8787876123fe565b6001600160a01b03161492505f9150610bcc9050565b602184101561096857505f9150819050610bcc565b60201984810185811181871802811895870191820135935090601f19013560ff161561099a5761099787612486565b96505b505f6109a583610bd4565b805190915064ffffffffff1642811090151516156109c7575f93505050610bcc565b5f816020015160038111156109de576109de614e6f565b03610a39575f80603f8711883581029060208a013502915091505f5f610a1d856060015180516020820151604090920151603f90911191820292910290565b91509150610a2e8b8585858561249f565b975050505050610bc9565b600181602001516003811115610a5157610a51614e6f565b03610ad657606081810151805160208083015160409384015184518084018e9052855180820385018152601f8d018590049094028101870186529485018b8152603f9490941091820295910293610acd935f92610ac6928e918e918291018382808284375f9201919091525061253892505050565b8585612620565b95505050610bc9565b600281602001516003811115610aee57610aee614e6f565b03610b1d57610b168160600151806020019051810190610b0e91906156ff565b88888861273f565b9350610bc9565b600381602001516003811115610b3557610b35614e6f565b03610bc957806060015151602014610b605760405163145a1fdd60e31b815260040160405180910390fd5b5f8160600151610b6f9061571a565b60601c9050604051638afc93b48152886020820152846040820152606080820152866080820152868860a08301376084870160205f82601c8501865afa915050638afc93b45f5160e01c14811615610bc657600195505b50505b50505b935093915050565b604080516080810182525f80825260208201819052918101919091526060808201525f828152684622cad2e2306de4d360205260408120610c149061281f565b8051909150610c365760405163395ed8c160e21b815260040160405180910390fd5b8051600619015f610c4a8383016020015190565b60d881901c855260c881901c915060d01c60ff166003811115610c6f57610c6f614e6f565b84602001906003811115610c8557610c85614e6f565b90816003811115610c9857610c98614e6f565b90525060ff811615156040850152610cb583838151811082025290565b606085015250919392505050565b333014610ce2576040516282b42960e81b815260040160405180910390fd5b8380610d0157604051638707510560e01b815260040160405180910390fd5b5f51602061594a5f395f51905f528514610d3c57610d1e85612885565b15610d3c57604051630442081560e01b815260040160405180910390fd5b610d4684846128e9565b15610d64576040516303a6f8c760e21b815260040160405180910390fd5b610d8760e084901c606086901b1783610800610d7f89612911565b929190612960565b50604080518681526001600160a01b03861660208201526001600160e01b0319851681830152831515606082015290517f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e19181900360800190a15050505050565b5f5f5f610df68686866108d6565b90925090508115158115151615610e2c57610e1081612885565b80610e295750610e2933610e2383612989565b906129b8565b91505b81610e3b5763ffffffff610e41565b631626ba7e5b60e01b925050505b9392505050565b5f333014610e70576040516282b42960e81b815260040160405180910390fd5b5f610ea9610ea5610ea260017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615772565b90565b5c90565b90507fdc3468f88c25eb554ba89310e62685429c392569524d86fbee8c635a205f68f08114610ed6575f5ffd5b610f0c610f07610ea260017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615772565b612a62565b60019150505b919050565b333014610f36576040516282b42960e81b815260040160405180910390fd5b8280610f5557604051638707510560e01b815260040160405180910390fd5b610f5e84612885565b15610f7c5760405163f2fee1e160e01b815260040160405180910390fd5b5f610f8685612911565b6001600160a01b0385165f908152600282016020526040902060019091019150610fd4846006811115610fbb57610fbb614e6f565b8254600160ff9092169190911b80198216845516151590565b15610ff4575f610fe382612a68565b03610ff457610ff28286612a83565b505b611023816001015f86600681111561100e5761100e614e6f565b60ff1681526020019081526020015f205f9055565b7fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a2786868660405161105693929190615785565b60405180910390a1505050505050565b6060805f6110726121d1565b9050806001600160401b0381111561108c5761108c6152a6565b6040519080825280602002602001820160405280156110db57816020015b604080516080810182525f80825260208083018290529282015260608082015282525f199092019101816110aa5790505b509250806001600160401b038111156110f6576110f66152a6565b60405190808252806020026020018201604052801561111f578160200160208202803683370190505b5091505f805b828110156111c5575f61114682684622cad2e2306de4cf5b60030190612bb8565b90505f61115282610bd4565b805190915064ffffffffff1642811090151516156111715750506111bd565b80878581518110611184576111846157a8565b6020026020010181905250818685815181106111a2576111a26157a8565b6020908102919091010152836111b7816157bc565b94505050505b600101611125565b508084528252509091565b684622cad2e2306de4d0545f90684622cad2e2306de4cf90156111f757600191505061132e565b365f365f6112058888612c01565b604080518481526001850160051b8101909152939750919550935091505f5b848110156112c657600581901b86013586018035906020808201359160408101350190810190356112b6856112a77f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876112888888612c6d565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b5050505050806001019050611224565b505f6112e5306112de84805160051b60209091012090565b8635612c7e565b9050801560208410171561130c5760405163e483bbcb60e01b815260040160405180910390fd5b60018701819055858561132082825f612caf565b600199505050505050505050505b92915050565b6001600160c01b0381165f908152684622cad2e2306de4d16020526040808220549083901b67ffffffffffffffff19161761132e565b604080516080810182525f808252602082018190529181019190915260608082015261132e61033e83684622cad2e2306de4cf61113d565b3330146113c1576040516282b42960e81b815260040160405180910390fd5b83806113e057604051638707510560e01b815260040160405180910390fd5b6113e985612885565b156114075760405163f2fee1e160e01b815260040160405180910390fd5b5f61141186612911565b60010190506114228186604061314a565b506001600160a01b0385165f908152600182016020526040902061146885600681111561145157611451614e6f565b8254600160ff9092169190911b8082178455161590565b505f816001015f87600681111561148157611481614e6f565b60ff1681526020019081526020015f2090505f61149d82613186565b86815290506114ac82826131d0565b7f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a898989896040516114e194939291906157d4565b60405180910390a1505050505050505050565b5f61150c30684622cad2e2306de4cf60010154613215565b905090565b5f8061152d8460408051828152600190920160051b8201905290565b90505f5b848110156115aa57600581901b8601358601803580153002179060208082013591604081013501908101903561159a856112a77f9085b19ea56248c94d86174b3784cfaaa8673d1041d6441f61ff52752dac84836001600160a01b038816876112888888612c6d565b5050505050806001019050611531565b5061c1d060f084901c145f6116047f9a5906d05ceef8b2885ad4b95ec46e2570079e7f040193be5767e1329736de5783855160051b6020870120886040805194855260208501939093529183015260608201526080902090565b9050816116195761161481613243565b611622565b61162281613359565b979650505050505050565b33301461164c576040516282b42960e81b815260040160405180910390fd5b5f838152684622cad2e2306de4d3602052604090205460ff166116825760405163395ed8c160e21b815260040160405180910390fd5b61169b828261020061169387612989565b9291906133cd565b50816001600160a01b0316837f30653b7562c17b712ebc81c7a2373ea1c255cf2a055380385273b5bf7192cc99836040516116da911515815260200190565b60405180910390a3505050565b600f60f81b6060805f8080836116fb6133e8565b97989097965046955030945091925090565b33301461172c576040516282b42960e81b815260040160405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80545f908152606083901b600c525190555f6117676133e8565b91506117c390507fdc3468f88c25eb554ba89310e62685429c392569524d86fbee8c635a205f68f06117bd610ea260017fa7d540c151934097be66b966a69e67d3055ab4350de7ff57a5f5cb2284ad4a5a615772565b9061342a565b306317e69ab86117d283613431565b6040518263ffffffff1660e01b81526004016117f091815260200190565b6020604051808303815f875af115801561180c573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906118309190615806565b611838575f5ffd5b5050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611884576040516282b42960e81b815260040160405180910390fd5b61189b684622cad2e2306de4cf5b60020182613459565b50565b5f61132e826020015160038111156118b8576118b8614e6f565b60ff168360600151805190602001205f1c5f9182526020526040902090565b606061132e6118e583612989565b613470565b333014611909576040516282b42960e81b815260040160405180910390fd5b61191c684622cad2e2306de4d182613544565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a150565b333014611971576040516282b42960e81b815260040160405180910390fd5b61197a816135ae565b60405181907fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab3905f90a250565b60608082806001600160401b038111156119c3576119c36152a6565b6040519080825280602002602001820160405280156119f657816020015b60608152602001906001900390816119e15790505b509250806001600160401b03811115611a1157611a116152a6565b604051908082528060200260200182016040528015611a4457816020015b6060815260200190600190039081611a2f5790505b5091505f5b81811015611ad557611a72868683818110611a6657611a666157a8565b90506020020135611c65565b848281518110611a8457611a846157a8565b6020026020010181905250611ab0868683818110611aa457611aa46157a8565b90506020020135611e29565b838281518110611ac257611ac26157a8565b6020908102919091010152600101611a49565b50509250929050565b5f80611b0c611afb60015f51602061596a5f395f51905f52615772565b604080516020810190915290815290565b9050611b1781515c90565b5f03611b2457505f919050565b611b2d81613619565b91505090565b333014611b52576040516282b42960e81b815260040160405180910390fd5b611b9a82828080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250611b949250612812915050565b90613639565b7faec6ef4baadc9acbdf52442522dfffda03abe29adba8d4af611bcef4cbe0c9ad8282604051611bcb929190615849565b60405180910390a15050565b606061150c684622cad2e2306de4cf61281f565b5f333014611c0b576040516282b42960e81b815260040160405180910390fd5b611c1482613691565b9050807f3d3a48be5a98628ecf98a6201185102da78bbab8f63a4b2d6b9eef354f5131f583604051611c469190614efe565b60405180910390a2919050565b5f611c5d8261373a565b151592915050565b60605f611c7183612911565b6001019050611c8c6040518060200160405280606081525090565b5f611c9683613783565b90505f5b81811015611e1f575f611cad85836137d4565b6001600160a01b0381165f9081526001870160205260408120919250611cd28261382d565b90505f5b8151811015611e10575f828281518110611cf257611cf26157a8565b602002602001015190505f611d1b856001015f8460ff1681526020019081526020015f20613186565b9050611d586040805160e081019091525f808252602082019081526020015f81526020015f81526020015f81526020015f81526020015f81525090565b8260ff166006811115611d6d57611d6d614e6f565b81602001906006811115611d8357611d83614e6f565b90816006811115611d9657611d96614e6f565b9052506001600160a01b03871681528151604080830191909152820151608082015260208201516060820152611ddb4260ff8516600681111561087657610876614e6f565b60c08201819052608082015160608301519111150260a082015280611e008b82613886565b5050505050806001019050611cd6565b50505050806001019050611c9a565b5050519392505050565b606061132e611e3783612911565b61392f565b5f611e468461373a565b905080600303611e6157611e5b8484846139e8565b50505050565b365f365f84611e7757637f1812755f526004601cfd5b5085358087016020810194503592505f90604011600286141115611ea5575050602080860135860190810190355b611eb488888887878787613a80565b5050505050505050565b813580830190604081901c602084101715611ed7575f5ffd5b50611f4c336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611f4330611f18602086018661528b565b6001600160a01b03161430611f33608087016060880161528b565b6001600160a01b03161417151590565b15159015151690565b611f68576040516282b42960e81b815260040160405180910390fd5b30611f79608083016060840161528b565b6001600160a01b031603611ff9575f80611f9b866102c46101c086018661585c565b915091508096505f197f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03163103611fd957600191505b81611ff6576040516282b42960e81b815260040160405180910390fd5b50505b61202461200c60a083016080840161528b565b61201e6101a08401610180850161528b565b88613c98565b841580612035575061203585612885565b612091575f61204386612911565b60018101915061208f906002015f61206160a086016080870161528b565b6001600160a01b0316815260208101919091526040015f2061208960a085016080860161528b565b89613cbb565b505b505050505050565b5f808260068111156120ad576120ad614e6f565b036120c057603c808404025b905061132e565b60018260068111156120d4576120d4614e6f565b036120e557610e10808404026120b9565b60028260068111156120f9576120f9614e6f565b0361210b5762015180808404026120b9565b600382600681111561211f5761211f614e6f565b03612145576007600362015180808604918201929092069003620545ff851102026120b9565b5f5f61215085613de0565b509092509050600484600681111561216a5761216a614e6f565b036121845761217b82826001613e8a565b9250505061132e565b600584600681111561219857612198614e6f565b036121a95761217b82600180613e8a565b60068460068111156121bd576121bd614e6f565b036121cd5760019250505061132e565b5f5ffd5b5f61150c684622cad2e2306de4d2613ee1565b5f846121f2575060016123f6565b6121fb85612885565b15612208575060016123f6565b631919191960e11b6004831061221c575082355b8261222b5750630707070760e51b5b61223585826128e9565b15612243575f9150506123f6565b5f61224d87612911565b905061225881613ee1565b156123155761227360e083901c606088901b175b8290613f2d565b15612283576001925050506123f6565b6122966332323232606088901b1761226c565b156122a6576001925050506123f6565b6122cc60e083901c73191919191919191919191919191919191919191960611b1761226c565b156122dc576001925050506123f6565b6123057f323232323232323232323232323232323232323200000000000000003232323261226c565b15612315576001925050506123f6565b61232b5f51602061594a5f395f51905f52612911565b905061233681613ee1565b156123f05761234e60e083901c606088901b1761226c565b1561235e576001925050506123f6565b6123716332323232606088901b1761226c565b15612381576001925050506123f6565b6123a760e083901c73191919191919191919191919191919191919191960611b1761226c565b156123b7576001925050506123f6565b6123e07f323232323232323232323232323232323232323200000000000000003232323261226c565b156123f0576001925050506123f6565b5f925050505b949350505050565b5f604051826040811461241957604181146124405750612471565b60208581013560ff81901c601b0190915285356040526001600160ff1b0316606052612451565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d61247e575b638baa579f5f526004601cfd5b509392505050565b5f815f526020600160205f60025afa5190503d610f1257fe5b5f6040518681528560208201528460408201528360608201528260808201525f5f5260205f60a0836101005afa503d612503576d1ab2e8006fd8b71907bf06a5bdee3b6125035760205f60a0836dd01ea45f9efd5c54f037fa57ea1a5afa61250357fe5b505f516001147f7fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a8851110905095945050505050565b61256d6040518060c0016040528060608152602001606081526020015f81526020015f81526020015f81526020015f81525090565b815160c0811061261a5760208301818101818251018281108260c083011117156125995750505061261a565b80815101925080602082015101818110838211178285108486111717156125c3575050505061261a565b82815160208301011183855160208701011117156125e4575050505061261a565b8386528060208701525060408101516040860152606081015160608601526080810151608086015260a081015160a08601525050505b50919050565b5f5f5f61262f88600180613fb1565b905060208601518051602082019150604088015160608901518451600d81016c1131b430b63632b733b2911d1160991b60981c8752848482011060228286890101515f1a14168160138901208286890120141685846014011085851760801c1074113a3cb832911d113bb2b130baba34371733b2ba1160591b60581c8589015160581c14161698505080865250505087515189151560021b600117808160218c510151161460208311881616965050851561271357602089510181810180516020600160208601856020868a8c60025afa60011b5afa51915295503d905061271357fe5b5050508215612734576127318287608001518860a00151888861249f565b92505b505095945050505050565b5f6001600160a01b038516156123f657604051853b6127cf57826040811461276f57604181146127965750612809565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526127a7565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5180871860601b3d119250505f60605280604052612809565b631626ba7e60e01b80825285600483015260248201604081528460448401528486606485013760208160648701858b5afa90519091141691505b50949350505050565b684622cad2e2306de4cf90565b60405181546020820190600881901c5f8260ff84171461284d57505080825260ff8116601f8082111561286f575b855f5260205f205b8160051c8101548286015260208201915082821061285557505b508084525f920191825250602001604052919050565b5f818152684622cad2e2306de4d360205260408120805460ff808216908114801590910260089290921c0217806128cf5760405163395ed8c160e21b815260040160405180910390fd5b6128dc825f1983016140a2565b60ff161515949350505050565b6001600160a01b039190911630146001600160e01b03199190911663e9ae5c5360e01b141690565b5f805f51602061594a5f395f51905f528314612935576129308361410f565b612944565b5f51602061594a5f395f51905f525b68a3bbbebc65eb8804df6009525f908152602990209392505050565b5f8261297557612970858561413c565b612980565b61298085858461423a565b95945050505050565b5f818152684622cad2e2306de4d4602052604081208054601f5263d4203f8b6004528152603f81208190610e49565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016129f35763f5a267f15f526004601cfd5b82612a055768fbb67fda52d4bfb8bf92505b80546001600160601b038116612a495760019250838160601c0315612a5a57600182015460601c8414612a5a57600282015460601c8414612a5a575b5f9250612a5a565b81602052835f5260405f2054151592505b505092915050565b5f815d50565b5f81545b801561261a57600191820191811901811618612a6c565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301612abe5763f5a267f15f526004601cfd5b82612ad05768fbb67fda52d4bfb8bf92505b80546001600160601b03811680612b4a5760019350848260601c03612b085760018301805484556002840180549091555f9055612baf565b84600184015460601c03612b295760028301805460018501555f9055612baf565b84600284015460601c03612b42575f6002840155612baf565b5f9350612baf565b82602052845f5260405f20805480612b63575050612baf565b60018360011c039250826001820314612b93578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b6318fb58646004525f8281526024902081015468fbb67fda52d4bfb8bf81141502612be283613ee1565b821061132e57604051634e23d03560e01b815260040160405180910390fd5b365f8080612c0f8686614257565b93509350612c2586866040908111913510171590565b15612c6457602085870103866020013580880160208101945080359350828482011182851760401c1715612c605763ba597e7e5f526004601cfd5b5050505b92959194509250565b5f8183604051375060405120919050565b5f82815260a082901c602052604090206001600160a01b0316612ca28482846142ed565b610e4957505f9392505050565b801580612cc05750612cc081612885565b15612cd557612cd0838383614349565b505050565b5f612cdf82612911565b6001019050612d4d6040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f612d5783613783565b90505f5b81811015612da9575f612d6e85836137d4565b90506001600160a01b03811615612da0576040840151612d8e90826143a0565b506060840151612d9e905f613886565b505b50600101612d5b565b505f5f5b86811015612f6757600581901b880135880180358015300217906020808201359160408101350190810190358215612dec57612de9838761589e565b95505b6004811015612dfe5750505050612f5f565b813560e01c63a9059cbb819003612e34576040890151612e1e90866143a0565b50612e32602484013560608b0151906143bf565b505b8063ffffffff1663095ea7b303612e7c5760248301355f03612e5a575050505050612f5f565b8851612e6690866143a0565b50612e7a600484013560208b0151906143bf565b505b8063ffffffff166387517c4503612ef4576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba314612eb6575050505050612f5f565b60448301355f03612ecb575050505050612f5f565b612ede600484013560808b0151906143bf565b50612ef2602484013560a08b0151906143bf565b505b8063ffffffff1663598daac403612f59576001600160a01b0385163014612f1f575050505050612f5f565b8a600484013514612f34575050505050612f5f565b612f47602484013560408b0151906143bf565b506060890151612f57905f613886565b505b50505050505b600101612dad565b50604083015151606084015151612f7e91906143d5565b5f612fb1612f8f8560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b60408501515151811015612ffd57604085015151600582901b0160200151612ff382612fe183306144ab565b85919060059190911b82016020015290565b5050600101612fb5565b50613009888888614349565b5f80805260018601602052604081206130229184613cbb565b5f5b604085015151518110156130b057604085810151516020600584901b9182018101516001600160a01b0381165f90815260018b0183529390932060608901515183018201519286019091015190916130a691839185916130a191906130969061308d89306144ab565b80821191030290565b808218908210021890565b613cbb565b5050600101613024565b505f5b845151518110156130f557845151600582901b01602001516130ec816130e684896020015161449b90919063ffffffff16565b5f6144d5565b506001016130b3565b505f5b6080850151515181101561313f57608085015151600582901b016020015161313681613131848960a0015161449b90919063ffffffff16565b61451f565b506001016130f8565b505050505050505050565b5f613155848461457a565b90508015610e49578161316785613783565b1115610e495760405163155176b960e11b815260040160405180910390fd5b6131a760405180606001604052805f81526020015f81526020015f81525090565b5f6131b18361281f565b905080515f1461261a575f6131c5826146d5565b602001949350505050565b6040805182516020808301919091528301518183015290820151606082015261183890839061321090608001604051602081830303815290604052614821565b613639565b5f5f61322084614a4e565b90506001600160a01b038116158315171580156123f657506123f68484836142ed565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f00000000000000000000000000000000000000000000000000000000000000004614166133365750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f5f5f6133646133e8565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b5f826133dd576129708585612a83565b61298085858461314a565b604080518082018252600c81526b141bdc9d1bd058d8dbdd5b9d60a21b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b80825d5050565b8051602181106134485763ec92f9a35f526004601cfd5b9081015160209190910360031b1b90565b5f5f6134658484614a6c565b600101905550505050565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c92508383141583028152816134fe5782156134f957600191508185015460601c925082156134f9578284141590920260208301525060028381015460601c9182156134f9576003915083831415830260408201525b61352e565b600191821c915b8281101561352c578581015460601c858114158102600583901b8401529350600101613505565b505b8186528160051b81016040525050505050919050565b604081811c5f90815260208490522080546001600160401b038316101561357e576040516312ee5c9360e01b815260040160405180910390fd5b6135a86135a2836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b5f818152684622cad2e2306de4d360209081526040808320839055684622cad2e2306de4d4909152902080546001019055684622cad2e2306de4cf6135fc684622cad2e2306de4d28361413c565b6118385760405163395ed8c160e21b815260040160405180910390fd5b80515f90805c806136315763bc7ec7795f526004601cfd5b015c92915050565b80518060081b60ff175f60fe8311613662575050601f8281015160081b82179080831115613689575b60208401855f5260205f205b828201518360051c82015560208301925084831061366e5750505b509092555050565b5f8160400151156136c6576136a98260200151614ab2565b6136c6576040516321b9b33960e21b815260040160405180910390fd5b6136cf8261189e565b90505f684622cad2e2306de4cf60608401518451602080870151604080890151905195965061372695613704959493016158b1565b60408051601f198184030181529181525f858152600485016020522090613639565b6137336003820183614ace565b5050919050565b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c15176137cc576001935083830154156137cc576002935083830154156137cc57600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf8214158202915061380784613783565b831061382657604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b80156138705761ffff8116613855576010918201911c61383a565b8183526020600582901b16909201916001918201911c61383a565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c55360208403518181061582820402905080831061391e578281178101811582602001870160405118176138ea57828102601f19870152850160200160405261391e565b602060405101816020018101604052808a52601f19855b888101518382015281018061390157509184029181019190915294505b505082019390935291909152919050565b6318fb58646004525f81815260249020801954604051919068fbb67fda52d4bfb8bf9060208401816139a857835480156139a2578084141502815260018481015490925080156139a2578084141502602082015260028481015490925080156139a2576003925083811415810260408301525b506139d3565b8160011c91505f5b828110156139d157848101548481141502600582901b8301526001016139b0565b505b8185528160051b810160405250505050919050565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c1715613a2d57633995943b5f526004601cfd5b505f5b83811461208f57365f8260051b850135808601602081019350803592505084828401118160401c1715613a6a57633995943b5f526004601cfd5b50613a76898383611e3c565b5050600101613a30565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163303613b465760208114613ad15760405163438e981560e11b815260040160405180910390fd5b6040805160208101909152823590613b0690829080613afe60015f51602061596a5f395f51905f52615772565b905290614be0565b613b11858583612caf565b6040805160208101909152613b409080613b3960015f51602061596a5f395f51905f52615772565b9052614bfa565b5061208f565b80613b7a57333014613b6a576040516282b42960e81b815260040160405180910390fd5b613b7584845f612caf565b61208f565b6020811015613b9c5760405163438e981560e11b815260040160405180910390fd5b8135613bb0684622cad2e2306de4cf611892565b6040518181527f4d9dbebf1d909894d9c26fe228c27cec643b2cb490124e5b658f4edd203c20c19060200160405180910390a15f5f613c0d613bf3888886611511565b6020808710818818021880880190808803908811026108d6565b9150915081613c2e576040516282b42960e81b815260040160405180910390fd5b613c5981604051806020016040528060015f51602061596a5f395f51905f525f1c613afe9190615772565b613c64878783612caf565b6040805160208101909152613c8c9080613b3960015f51602061596a5f395f51905f52615772565b50505050505050505050565b6001600160a01b038316613cb057612cd08282614c1b565b612cd0838383614c34565b80613cc557505050565b5f613ccf8461382d565b905080515f03613cf257604051635ee7e5b160e01b815260040160405180910390fd5b5f5b8151811015613dd9575f828281518110613d1057613d106157a8565b602002602001015190505f866001015f8360ff1681526020019081526020015f2090505f613d3d82613186565b90505f613d59428560ff16600681111561087657610876614e6f565b90508082604001511015613d7557604082018190525f60208301525b815f01518783602001818151613d8b919061589e565b9150818152501115613dc05760405163482a648960e11b81526001600160a01b03891660048201526024015b60405180910390fd5b613dca83836131d0565b50505050806001019050613cf4565b5050505050565b5f8080613e7d613df36201518086615900565b5f5f5f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b6318fb58646004525f818152602481208019548060011c9250806137335781545f9350156137335760019250828201541561373357600292508282015415613733575060039392505050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303613f5a5763f5a267f15f526004601cfd5b82613f6c5768fbb67fda52d4bfb8bf92505b801954613f9d57805460019250831461382657600181015483146138265760028101548314613826575f9150613826565b602052505f90815260409020541515919050565b60608351801561247e576003600282010460021b60405192507f4142434445464748494a4b4c4d4e4f505152535455565758595a616263646566601f526106708515027f6768696a6b6c6d6e6f707172737475767778797a303132333435363738392d5f18603f526020830181810183886020010180515f82525b60038a0199508951603f8160121c16515f53603f81600c1c1651600153603f8160061c1651600253603f811651600353505f51845260048401935082841061402c579052602001604052613d3d60f01b60038406600204808303919091525f861515909102918290035290038252509392505050565b5f82548060ff8217146140ea57601e83116140c15780831a9150613826565b8060ff1683116140e557835f52601f83038060051c60205f200154601f82161a9250505b613826565b8060081c831161382657835f528260051c60205f200154601f84161a91505092915050565b5f818152684622cad2e2306de4d4602052604081208054601f5263d4203f8b6004528152603f812061132e565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf83036141695763f5a267f15f526004601cfd5b8261417b5768fbb67fda52d4bfb8bf92505b801954806141dc5760019250838254036141a85760018201805483556002830180549091555f9055612a5a565b836001830154036141c65760028201805460018401555f9055612a5a565b83600283015403612a41575f6002830155612a5a565b81602052835f5260405f208054806141f5575050612a5a565b60018360011c03925082600182031461421f57828401548060018303860155805f52508060405f20555b5060018260011b178319555f81555060019250505092915050565b5f6142458484614ace565b90508015610e49578161316785613ee1565b365f833580850160208587010360208201945081359350808460051b8301118360401c171561428d5763ba597e7e5f526004601cfd5b83156142e3578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c17156142da5763ba597e7e5f526004601cfd5b50505082614297575b5050509250929050565b5f82815260208082206080909152601f8390526305d78094600b52601960272061433f6001600160a01b0387168015159061432b84601b8a88614c74565b6001600160a01b0316149015159015151690565b9695505050505050565b5f826143555750505050565b600581901b84013584018035801530021790602080820135916040810135019081019035614386848484848a614cae565b505050508383905081600101915081036143555750505050565b604080516060815290819052610e4983836001600160a01b0316613886565b604080516060815290819052610e498383613886565b60405181518351146143f357634e487b715f5260326020526024601cfd5b82516143fe57505050565b5f5f61440985614cec565b61441285614cec565b9150915061441f85614d1b565b61442885614d70565b848403601f196020870187518752875160051b3684830137845160051b5b8086015181860151835b8281511461446057602001614450565b86018051820180825282111561448257634e487b715f5260116020526024601cfd5b5050508201806144465750505050826040525050505050565b905160059190911b016020015190565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f51141661451557803d853b15171061451557633e3f8f735f526004601cfd5b505f603452505050565b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af1612cd0576396b3de235f526004601cfd5b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016145b55763f5a267f15f526004601cfd5b826145c75768fbb67fda52d4bfb8bf92505b80546001600160601b0381168260205280614689578160601c806145f5578560601b84556001945050612baf565b8581036146025750612baf565b600184015460601c80614623578660601b6001860155600195505050612baf565b868103614631575050612baf565b600285015460601c80614653578760601b600287015560019650505050612baf565b87810361466257505050612baf565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f2080546146cb57600191821c8083018255919450816146b7578560601b600317845550612baf565b8560601b8285015582600201845550612baf565b5050505092915050565b6060815115610f12576040519050600482018051835184602001017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f6020850183198552866020015b8051805f1a61477657600190811a01608081116147565760028201915080368437918201918482106147505750614803565b5061471e565b5f198352918201607f190191600291909101908482106147505750614803565b80835283811684011783171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f8601f6f8421084210842108cc6318c6db6d54be660204081020408185821060071b86811c6001600160401b031060061b1795861c0260181a1c161a90911860031c01918201910183811061471e578381111561480357838103820391505b509290935250601f198382030183525f815260200160405250919050565b6060614879565b6fffffffffffffffffffffffffffffffff811160071b81811c6001600160401b031060061b1781811c63ffffffff1060051b1781811c61ffff1060041b1790811c60ff1060039190911c17601f1890565b50604051815182017f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f60208301845b838114614a2a57600101805160ff1680614932575b6020820151806149015782860360208181189082110218607f839003818111818318021893840193928301929050601f81116148fa575050614922565b50506148bd565b61490a81614828565b90508286038181118183180218928301929190910190505b60f01b82526002909101906148a8565b60ff8103614985576020808301511980156149535761495081614828565b91505b508286038181118282180218601f81811890821102186080811760f01b85526002909401939290920191506148a89050565b80835350602081015160018381018290528482168501821791198581168601179190911684171980157fc0c8c8d0c8e8d0d8c8e8e0e8d0d8e0f0c8d0e8d0e0e0d8f0d0d0e0d8f8f8f8f86f8421084210842108cc6318c6db6d54be660204081020408184821060071b85811c6001600160401b031060061b1794851c0260181a1c601f161a90911860031c0182860381811191811891909102189283010191016148a8565b50600484018051199052601f198482030184525f8152602001604052509092915050565b5f60205f5f843c5f5160f01c61ef011460035160601c029050919050565b604081811c5f90815260208490522080546001600160401b03808416821490821016614aab57604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f80826003811115614ac657614ac6614e6f565b141592915050565b6318fb58646004525f8281526024812068fbb67fda52d4bfb8bf8303614afb5763f5a267f15f526004601cfd5b82614b0d5768fbb67fda52d4bfb8bf92505b8019548160205280614bb157815480614b2d578483556001935050612a5a565b848103614b3a5750612a5a565b600183015480614b5557856001850155600194505050612a5a565b858103614b63575050612a5a565b600284015480614b7f5786600286015560019550505050612a5a565b868103614b8e57505050612a5a565b5f9283526040808420600190559183528183206002905582529020600390555060075b835f5260405f208054612baf57600191821c8381018690558083019182905590821b8217831955909250612a5a565b5f825f015190506001815c01828183015d80825d50505050565b8051805c80614c105763bc7ec7795f526004601cfd5b60018103825d505050565b5f385f3884865af16118385763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f51141661451557803d853b151710614515576390b8ec185f526004601cfd5b5f604051855f5260ff851660205283604052826060526020604060805f60015afa505f6060523d6060185191508060405250949350505050565b614cba818685856121e4565b614cdf578085848460405163f78c1b5360e01b8152600401613db7949392919061591f565b613dd98585858585614db9565b604051815160051b8101602001818084035b808201518252816020019150828203614cfe575060405250919050565b80515f82528060051b8201601f19602084015b602001828111614d695780518282018051828111614d4e57505050614d2e565b5b602082015283018051828111614d4f575060200152614d2e565b5050509052565b600281511061189b576020810160408201600183510160051b83015b8151835114614da057602083019250815183525b602082019150808203614d8c57505081900360051c9052565b604051828482375f388483888a5af1612091573d5f823e3d81fd5b5f5f83601f840112614de4575f5ffd5b5081356001600160401b03811115614dfa575f5ffd5b602083019150836020828501011115614aab575f5ffd5b5f5f5f60408486031215614e23575f5ffd5b8335925060208401356001600160401b03811115614e3f575f5ffd5b614e4b86828701614dd4565b9497909650939450505050565b5f60208284031215614e68575f5ffd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b64ffffffffff81511682525f602082015160048110614ed257614ed2614e6f565b806020850152506040820151151560408401526060820151608060608501526123f66080850182614e83565b602081525f610e496020830184614eb1565b6001600160a01b038116811461189b575f5ffd5b801515811461189b575f5ffd5b8035610f1281614f24565b5f5f5f5f60808587031215614f4f575f5ffd5b843593506020850135614f6181614f10565b925060408501356001600160e01b031981168114614f7d575f5ffd5b91506060850135614f8d81614f24565b939692955090935050565b803560078110610f12575f5ffd5b5f5f5f60608486031215614fb8575f5ffd5b833592506020840135614fca81614f10565b9150614fd860408501614f98565b90509250925092565b5f8151808452602084019350602083015f5b82811015615011578151865260209586019590910190600101614ff3565b5093949350505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561507257605f1987860301845261505d858351614eb1565b94506020938401939190910190600101615041565b5050505082810360208401526129808185614fe1565b5f5f60208385031215615099575f5ffd5b82356001600160401b038111156150ae575f5ffd5b6150ba85828601614dd4565b90969095509350505050565b5f602082840312156150d6575f5ffd5b81356001600160c01b0381168114610e49575f5ffd5b5f5f5f5f608085870312156150ff575f5ffd5b84359350602085013561511181614f10565b925061511f60408601614f98565b9396929550929360600135925050565b5f5f83601f84011261513f575f5ffd5b5081356001600160401b03811115615155575f5ffd5b6020830191508360208260051b8501011115614aab575f5ffd5b5f5f5f60408486031215615181575f5ffd5b83356001600160401b03811115615196575f5ffd5b6151a28682870161512f565b909790965060209590950135949350505050565b5f5f5f606084860312156151c8575f5ffd5b8335925060208401356151da81614f10565b915060408401356151ea81614f24565b809150509250925092565b60ff60f81b8816815260e060208201525f61521360e0830189614e83565b82810360408401526152258189614e83565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b8181101561527a57835183526020938401939092019160010161525c565b50909b9a5050505050505050505050565b5f6020828403121561529b575f5ffd5b8135610e4981614f10565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b03811182821017156152dc576152dc6152a6565b60405290565b5f82601f8301126152f1575f5ffd5b81356001600160401b0381111561530a5761530a6152a6565b604051601f8201601f19908116603f011681016001600160401b0381118282101715615338576153386152a6565b60405281815283820160200185101561534f575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f6020828403121561537b575f5ffd5b81356001600160401b03811115615390575f5ffd5b8201608081850312156153a1575f5ffd5b6153a96152ba565b813564ffffffffff811681146153bd575f5ffd5b81526020820135600481106153d0575f5ffd5b60208201526153e160408301614f31565b604082015260608201356001600160401b038111156153fe575f5ffd5b61540a868285016152e2565b606083015250949350505050565b602080825282518282018190525f918401906040840190835b818110156154585783516001600160a01b0316835260209384019390920191600101615431565b509095945050505050565b5f5f60208385031215615474575f5ffd5b82356001600160401b03811115615489575f5ffd5b6150ba8582860161512f565b600781106154a5576154a5614e6f565b9052565b5f8151808452602084019350602083015f5b8281101561501157815180516001600160a01b031687526020808201515f916154e6908a0182615495565b505060408181015190880152606080820151908801526080808201519088015260a0808201519088015260c0908101519087015260e090950194602091909101906001016154bb565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b8281101561558657605f198786030184526155718583516154a9565b94506020938401939190910190600101615555565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b838110156155df57601f198684030185526155c9838351614fe1565b60209586019590935091909101906001016155ad565b509098975050505050505050565b602081525f610e496020830184614e83565b602081525f610e4960208301846154a9565b602081525f610e496020830184614fe1565b5f5f5f5f5f60808688031215615637575f5ffd5b85359450602086013593506040860135925060608601356001600160401b03811115615661575f5ffd5b61566d88828901614dd4565b969995985093965092949392505050565b5f5f6040838503121561568f575f5ffd5b8235915061569f60208401614f98565b90509250929050565b5f5f5f5f606085870312156156bb575f5ffd5b8435935060208501356156cd81614f10565b925060408501356001600160401b038111156156e7575f5ffd5b6156f387828801614dd4565b95989497509550505050565b5f6020828403121561570f575f5ffd5b8151610e4981614f10565b805160208201516bffffffffffffffffffffffff19811691906014821015613733576bffffffffffffffffffffffff1960149290920360031b82901b161692915050565b634e487b7160e01b5f52601160045260245ffd5b8181038181111561132e5761132e61575e565b8381526001600160a01b0383166020820152606081016123f66040830184615495565b634e487b7160e01b5f52603260045260245ffd5b5f600182016157cd576157cd61575e565b5060010190565b8481526001600160a01b0384166020820152608081016157f76040830185615495565b82606083015295945050505050565b5f60208284031215615816575f5ffd5b8151610e4981614f24565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f6123f6602083018486615821565b5f5f8335601e19843603018112615871575f5ffd5b8301803591506001600160401b0382111561588a575f5ffd5b602001915036819003821315614aab575f5ffd5b8082018082111561132e5761132e61575e565b5f85518060208801845e60d886901b6001600160d81b031916908301908152600485106158e0576158e0614e6f565b60f894851b600582015292151590931b6006830152506007019392505050565b5f8261591a57634e487b7160e01b5f52601260045260245ffd5b500490565b8481526001600160a01b03841660208201526060604082018190525f9061433f908301848661582156fe3232323232323232323232323232323232323232323232323232323232323232def24cb3236edf62937b12ea8dc676927599974e90729c6e9eafa9f05b03eab8a26469706673582212208e7bbf0f24aed9cb06429fca5eb5c092ac425f702ad52e4ed4c315d629a91a4664736f6c634300081d0033" as const;


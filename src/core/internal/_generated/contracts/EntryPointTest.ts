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
    "name": "IS_TEST",
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
    "name": "excludeArtifacts",
    "inputs": [],
    "outputs": [
      {
        "name": "excludedArtifacts_",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "excludeContracts",
    "inputs": [],
    "outputs": [
      {
        "name": "excludedContracts_",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "excludeSelectors",
    "inputs": [],
    "outputs": [
      {
        "name": "excludedSelectors_",
        "type": "tuple[]",
        "internalType": "struct StdInvariant.FuzzSelector[]",
        "components": [
          {
            "name": "addr",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "selectors",
            "type": "bytes4[]",
            "internalType": "bytes4[]"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "excludeSenders",
    "inputs": [],
    "outputs": [
      {
        "name": "excludedSenders_",
        "type": "address[]",
        "internalType": "address[]"
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
    "name": "failed",
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
    "name": "targetArtifactSelectors",
    "inputs": [],
    "outputs": [
      {
        "name": "targetedArtifactSelectors_",
        "type": "tuple[]",
        "internalType": "struct StdInvariant.FuzzArtifactSelector[]",
        "components": [
          {
            "name": "artifact",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "selectors",
            "type": "bytes4[]",
            "internalType": "bytes4[]"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "targetArtifacts",
    "inputs": [],
    "outputs": [
      {
        "name": "targetedArtifacts_",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "targetContracts",
    "inputs": [],
    "outputs": [
      {
        "name": "targetedContracts_",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "targetInterfaces",
    "inputs": [],
    "outputs": [
      {
        "name": "targetedInterfaces_",
        "type": "tuple[]",
        "internalType": "struct StdInvariant.FuzzInterface[]",
        "components": [
          {
            "name": "addr",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "artifacts",
            "type": "string[]",
            "internalType": "string[]"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "targetSelectors",
    "inputs": [],
    "outputs": [
      {
        "name": "targetedSelectors_",
        "type": "tuple[]",
        "internalType": "struct StdInvariant.FuzzSelector[]",
        "components": [
          {
            "name": "addr",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "selectors",
            "type": "bytes4[]",
            "internalType": "bytes4[]"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "targetSenders",
    "inputs": [],
    "outputs": [
      {
        "name": "targetedSenders_",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "testHash",
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
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "testIsSelfExecute",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "fnSel",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "test__codesize",
    "inputs": [],
    "outputs": [],
    "stateMutability": "view"
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
    "name": "LogAddress",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogAddress",
    "inputs": [
      {
        "name": "value",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogAddressArray",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "address[]",
        "indexed": false,
        "internalType": "address[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogAddressArray",
    "inputs": [
      {
        "name": "value",
        "type": "address[]",
        "indexed": false,
        "internalType": "address[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogBool",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogBool",
    "inputs": [
      {
        "name": "value",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogBoolArray",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "bool[]",
        "indexed": false,
        "internalType": "bool[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogBoolArray",
    "inputs": [
      {
        "name": "value",
        "type": "bool[]",
        "indexed": false,
        "internalType": "bool[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogBytes",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogBytes",
    "inputs": [
      {
        "name": "value",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogBytes32",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogBytes32",
    "inputs": [
      {
        "name": "value",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogBytes32Array",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "bytes32[]",
        "indexed": false,
        "internalType": "bytes32[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogBytes32Array",
    "inputs": [
      {
        "name": "value",
        "type": "bytes32[]",
        "indexed": false,
        "internalType": "bytes32[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogBytesArray",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "bytes[]",
        "indexed": false,
        "internalType": "bytes[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogBytesArray",
    "inputs": [
      {
        "name": "value",
        "type": "bytes[]",
        "indexed": false,
        "internalType": "bytes[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogInt",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogInt",
    "inputs": [
      {
        "name": "value",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogIntArray",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "int256[]",
        "indexed": false,
        "internalType": "int256[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogIntArray",
    "inputs": [
      {
        "name": "value",
        "type": "int256[]",
        "indexed": false,
        "internalType": "int256[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogString",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogString",
    "inputs": [
      {
        "name": "value",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogStringArray",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "string[]",
        "indexed": false,
        "internalType": "string[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogStringArray",
    "inputs": [
      {
        "name": "value",
        "type": "string[]",
        "indexed": false,
        "internalType": "string[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogUint",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogUint",
    "inputs": [
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogUintArray",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogUintArray",
    "inputs": [
      {
        "name": "value",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
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
    "type": "event",
    "name": "log",
    "inputs": [
      {
        "name": "",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_address",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_array",
    "inputs": [
      {
        "name": "val",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_array",
    "inputs": [
      {
        "name": "val",
        "type": "int256[]",
        "indexed": false,
        "internalType": "int256[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_array",
    "inputs": [
      {
        "name": "val",
        "type": "address[]",
        "indexed": false,
        "internalType": "address[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_bytes",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_bytes32",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_int",
    "inputs": [
      {
        "name": "",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_named_address",
    "inputs": [
      {
        "name": "key",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "val",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_named_array",
    "inputs": [
      {
        "name": "key",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "val",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_named_array",
    "inputs": [
      {
        "name": "key",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "val",
        "type": "int256[]",
        "indexed": false,
        "internalType": "int256[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_named_array",
    "inputs": [
      {
        "name": "key",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "val",
        "type": "address[]",
        "indexed": false,
        "internalType": "address[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_named_bytes",
    "inputs": [
      {
        "name": "key",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "val",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_named_bytes32",
    "inputs": [
      {
        "name": "key",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "val",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_named_decimal_int",
    "inputs": [
      {
        "name": "key",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "val",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_named_decimal_uint",
    "inputs": [
      {
        "name": "key",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "val",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_named_int",
    "inputs": [
      {
        "name": "key",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "val",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_named_string",
    "inputs": [
      {
        "name": "key",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "val",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_named_uint",
    "inputs": [
      {
        "name": "key",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "val",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_string",
    "inputs": [
      {
        "name": "",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "log_uint",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "logs",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
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
    "name": "KeyHashIsZero",
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

export const code = "0x6080604052600c8054600160ff199182168117909255601f80549091169091179055348015602b575f80fd5b50612fbe806100395f395ff3fe60806040526004361061019f575f3560e01c806385226c81116100eb578063e20c9f7111610089578063f667a98b11610063578063f667a98b146104bb578063fa7626d4146104da578063faba56d8146104f3578063ff619c6b14610512576101a6565b8063e20c9f7114610480578063e9ae5c5314610494578063f09ff470146104a7576101a6565b8063b5508aa9116100c5578063b5508aa9146103fd578063ba414fa614610411578063d03c791414610435578063dcc09ebf14610454576101a6565b806385226c81146103a7578063916a17c6146103c8578063b0464fdc146103e9576101a6565b80633505850111610158578063515c9d6d11610132578063515c9d6d1461031a57806354881e0214610348578063598daac41461036757806366d9a9a014610386576101a6565b806335058501146102d85780633e5e3c23146102f25780633f7286f414610306576101a6565b806311a86fd6146101df578063136a12f7146102235780631ed7831c146102445780632081a278146102655780632ade3880146102845780632f3f30c7146102a5576101a6565b366101a657005b5f3560e01c63bc197c81811463f23a6e6182141763150b7a02821417156101d157806020526020603cf35b50633c10b94e5f526004601cfd5b3480156101ea575f80fd5b5061020673323232323232323232323232323232323232323281565b6040516001600160a01b0390911681526020015b60405180910390f35b34801561022e575f80fd5b5061024261023d3660046128a4565b610531565b005b34801561024f575f80fd5b50610258610636565b60405161021a91906128f4565b348015610270575f80fd5b5061024261027f36600461294d565b610696565b34801561028f575f80fd5b506102986107a9565b60405161021a91906129b4565b3480156102b0575f80fd5b506102bf630707070760e51b81565b6040516001600160e01b0319909116815260200161021a565b3480156102e3575f80fd5b506102bf631919191960e11b81565b3480156102fd575f80fd5b506102586108e5565b348015610311575f80fd5b50610258610943565b348015610325575f80fd5b5061033a5f80516020612f6983398151915281565b60405190815260200161021a565b348015610353575f80fd5b50610242610362366004612a7d565b6109a1565b348015610372575f80fd5b50610242610381366004612aae565b6109ec565b348015610391575f80fd5b5061039a610b0a565b60405161021a9190612b33565b3480156103b2575f80fd5b506103bb610c6e565b60405161021a9190612bb1565b3480156103d3575f80fd5b506103dc610d39565b60405161021a9190612c08565b3480156103f4575f80fd5b506103dc610e1a565b348015610408575f80fd5b506103bb610efb565b34801561041c575f80fd5b50610425610fc6565b604051901515815260200161021a565b348015610440575f80fd5b5061042561044f366004612c7f565b611066565b34801561045f575f80fd5b5061047361046e366004612c7f565b611078565b60405161021a9190612cca565b34801561048b575f80fd5b506102586111ea565b6102426104a2366004612d89565b611248565b3480156104b2575f80fd5b506102426112ca565b3480156104c6575f80fd5b506102426104d5366004612dd1565b6112e6565b3480156104e5575f80fd5b50601f546104259060ff1681565b3480156104fe575f80fd5b5061033a61050d366004612e01565b611355565b34801561051d575f80fd5b5061042561052c366004612e22565b61146f565b333014610550576040516282b42960e81b815260040160405180910390fd5b838061056f57604051638707510560e01b815260040160405180910390fd5b61057984846116f5565b15610597576040516303a6f8c760e21b815260040160405180910390fd5b5f83815260188590526004869052603881208152683c149ebf7b8e6c5e226020818152604092839020805460ff191686151590811790915583518981526001600160a01b038916928101929092526001600160e01b03198716938201939093526060810192909252907f7eb91b8ac56c0864a4e4f5598082d140d04bed1a4dd62a41d605be2430c494e1906080015b60405180910390a1505050505050565b6060601680548060200260200160405190810160405280929190818152602001828054801561068c57602002820191905f5260205f20905b81546001600160a01b0316815260019091019060200180831161066e575b5050505050905090565b3330146106b5576040516282b42960e81b815260040160405180910390fd5b82806106d457604051638707510560e01b815260040160405180910390fd5b5f848152683c149ebf7b8e6c5e23602052604090206106f3818561171f565b506001600160a01b0384165f908152600182016020526040902061073b84600581111561072257610722612c96565b8254600160ff9092169190911b80198216845516151590565b50806001015f85600581111561075357610753612c96565b60ff168152602081019190915260409081015f9081208181556001810182905560020155517fa17fd662986af6bbcda33ce6b68c967b609aebe07da86cd25ee7bfbd01a65a279061062690889088908890612e78565b6060601e805480602002602001604051908101604052809291908181526020015f905b828210156108dc575f84815260208082206040805180820182526002870290920180546001600160a01b03168352600181018054835181870281018701909452808452939591948681019491929084015b828210156108c5578382905f5260205f2001805461083a90612e9b565b80601f016020809104026020016040519081016040528092919081815260200182805461086690612e9b565b80156108b15780601f10610888576101008083540402835291602001916108b1565b820191905f5260205f20905b81548152906001019060200180831161089457829003601f168201915b50505050508152602001906001019061081d565b5050505081525050815260200190600101906107cc565b50505050905090565b6060601880548060200260200160405190810160405280929190818152602001828054801561068c57602002820191905f5260205f209081546001600160a01b0316815260019091019060200180831161066e575050505050905090565b6060601780548060200260200160405190810160405280929190818152602001828054801561068c57602002820191905f5260205f209081546001600160a01b0316815260019091019060200180831161066e575050505050905090565b5f6001600160a01b038316301480156109ca575063e9ae5c5360e01b6001600160e01b03198316145b90506109e76109e16109db85611854565b846116f5565b82611875565b505050565b333014610a0b576040516282b42960e81b815260040160405180910390fd5b8380610a2a57604051638707510560e01b815260040160405180910390fd5b5f858152683c149ebf7b8e6c5e2360205260409081902090610a4f90829087906118e2565b506001600160a01b0385165f9081526001820160205260409020610a95856005811115610a7e57610a7e612c96565b8254600160ff9092169190911b8082178455161590565b5083816001015f876005811115610aae57610aae612c96565b60ff1681526020019081526020015f205f01819055507f68c781b0acb659616fc73da877ee77ae95c51ce973b6c7a762c8692058351b4a87878787604051610af99493929190612ecd565b60405180910390a150505050505050565b6060601b805480602002602001604051908101604052809291908181526020015f905b828210156108dc578382905f5260205f2090600202016040518060400160405290815f82018054610b5d90612e9b565b80601f0160208091040260200160405190810160405280929190818152602001828054610b8990612e9b565b8015610bd45780601f10610bab57610100808354040283529160200191610bd4565b820191905f5260205f20905b815481529060010190602001808311610bb757829003601f168201915b5050505050815260200160018201805480602002602001604051908101604052809291908181526020018280548015610c5657602002820191905f5260205f20905f905b82829054906101000a900460e01b6001600160e01b03191681526020019060040190602082600301049283019260010382029150808411610c185790505b50505050508152505081526020019060010190610b2d565b6060601a805480602002602001604051908101604052809291908181526020015f905b828210156108dc578382905f5260205f20018054610cae90612e9b565b80601f0160208091040260200160405190810160405280929190818152602001828054610cda90612e9b565b8015610d255780601f10610cfc57610100808354040283529160200191610d25565b820191905f5260205f20905b815481529060010190602001808311610d0857829003601f168201915b505050505081526020019060010190610c91565b6060601d805480602002602001604051908101604052809291908181526020015f905b828210156108dc575f8481526020908190206040805180820182526002860290920180546001600160a01b03168352600181018054835181870281018701909452808452939491938583019392830182828015610e0257602002820191905f5260205f20905f905b82829054906101000a900460e01b6001600160e01b03191681526020019060040190602082600301049283019260010382029150808411610dc45790505b50505050508152505081526020019060010190610d5c565b6060601c805480602002602001604051908101604052809291908181526020015f905b828210156108dc575f8481526020908190206040805180820182526002860290920180546001600160a01b03168352600181018054835181870281018701909452808452939491938583019392830182828015610ee357602002820191905f5260205f20905f905b82829054906101000a900460e01b6001600160e01b03191681526020019060040190602082600301049283019260010382029150808411610ea55790505b50505050508152505081526020019060010190610e3d565b60606019805480602002602001604051908101604052809291908181526020015f905b828210156108dc578382905f5260205f20018054610f3b90612e9b565b80601f0160208091040260200160405190810160405280929190818152602001828054610f6790612e9b565b8015610fb25780601f10610f8957610100808354040283529160200191610fb2565b820191905f5260205f20905b815481529060010190602001808311610f9557829003601f168201915b505050505081526020019060010190610f1e565b6008545f9060ff1615610fdd575060085460ff1690565b604051630667f9d760e41b8152737109709ecfa91a80626ff3989d68f67f5b1dd12d600482018190526519985a5b195960d21b60248301525f9163667f9d7090604401602060405180830381865afa15801561103b573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061105f9190612eff565b1415905090565b5f6110708261191e565b151592915050565b5f818152683c149ebf7b8e6c5e2360209081526040918290208251918201909252606080825291905f6110aa83611967565b90505f5b818110156111e0575f6110c185836119b8565b6001600160a01b0381165f90815260018701602052604081209192506110e682611a11565b90505f5b81518110156111d1575f82828151811061110657611106612f16565b602002602001015190505f846001015f8360ff1681526020019081526020015f2090506111586040805160a081019091525f808252602082019081526020015f81526020015f81526020015f81525090565b8260ff16600581111561116d5761116d612c96565b8160200190600581111561118357611183612c96565b9081600581111561119657611196612c96565b9052506001600160a01b03871681528154604082015260028201546080820152806111c18b82611a6a565b50505050508060010190506110ea565b505050508060010190506110ae565b5050519392505050565b6060601580548060200260200160405190810160405280929190818152602001828054801561068c57602002820191905f5260205f209081546001600160a01b0316815260019091019060200180831161066e575050505050905090565b5f6112528461191e565b90508060030361126d57611267848484611b15565b50505050565b365f365f8461128357637f1812755f526004601cfd5b5085358087016020810194503592505f906040116002861411156112b1575050602080860135860190810190355b6112c088888887878787611bb6565b5050505050505050565b3033036112d357fe5b63f09ff4705f525f806004601c3038fa50565b6040516001600160e01b031982166020820152602481018490526bffffffffffffffffffffffff19606084901b1660448201525f9060580160408051601f1981840301815291905280516020909101205f83815260188590526004869052603890209091506112679082611bd6565b5f8082600581111561136957611369612c96565b0361137c57603c808404025b9050611469565b600182600581111561139057611390612c96565b036113a157610e1080840402611375565b60028260058111156113b5576113b5612c96565b036113c7576201518080840402611375565b60038260058111156113db576113db612c96565b03611401576007600362015180808604918201929092069003620545ff85110202611375565b5f8061140c85611c15565b509092509050600484600581111561142657611426612c96565b036114405761143782826001611cbf565b92505050611469565b600584600581111561145457611454612c96565b036114655761143782600180611cbf565b5f80fd5b92915050565b5f8461147d575060016116ed565b683c149ebf7b8e6c5e22631919191960e11b6004841061149b575083355b836114aa5750630707070760e51b5b6114b486826116f5565b156114c3575f925050506116ed565b5f818152601887905260048890526038812081526020839052604090205460ff16156114f4576001925050506116ed565b631919191960e11b5f908152601887905260048890526038812081526020839052604090205460ff161561152d576001925050506116ed565b5f81815273323232323232323232323232323232323232323260185260048890526038812081526020839052604090205460ff1615611571576001925050506116ed565b631919191960e11b5f90815273323232323232323232323232323232323232323260185260048890526038812081526020839052604090205460ff16156115bd576001925050506116ed565b5f81815260188790525f80516020612f698339815191526004526038812081526020839052604090205460ff16156115fa576001925050506116ed565b631919191960e11b5f90815260188790525f80516020612f698339815191526004526038812081526020839052604090205460ff161561163f576001925050506116ed565b5f8181527332323232323232323232323232323232323232326018525f80516020612f698339815191526004526038812081526020839052604090205460ff161561168f576001925050506116ed565b631919191960e11b5f9081527332323232323232323232323232323232323232326018525f80516020612f698339815191526004526038812081526020839052604090205460ff16156116e7576001925050506116ed565b5f925050505b949350505050565b5f63e9ae5c5360e01b6001600160e01b0319831614306001600160a01b03851614165b9392505050565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be19830161175a5763f5a267f15f526004601cfd5b8261176c5768fbb67fda52d4bfb8bf92505b80546001600160601b038116806117e65760019350848260601c036117a45760018301805484556002840180549091555f905561184b565b84600184015460601c036117c55760028301805460018501555f905561184b565b84600284015460601c036117de575f600284015561184b565b5f935061184b565b82602052845f5260405f208054806117ff57505061184b565b60018360011c03925082600182031461182f578285015460601c8060601b60018303870155805f52508060405f20555b5060018260011b17845460601c60601b1784555f815550600193505b50505092915050565b5f6001600160a01b0382168060a061186b82611d16565b901b189392505050565b60405163f7fe347760e01b815282151560048201528115156024820152737109709ecfa91a80626ff3989d68f67f5b1dd12d9063f7fe3477906044015b5f6040518083038186803b1580156118c8575f80fd5b505afa1580156118da573d5f803e3d5ffd5b505050505050565b5f6118ed8484611d5e565b9050801561171857816118ff85611967565b11156117185760405163155176b960e11b815260040160405180910390fd5b6003690100000000007821000260b09290921c69ffff00000000ffffffff16918214026901000000000078210001821460011b6901000000000000000000909214919091171790565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c15176119b0576001935083830154156119b0576002935083830154156119b057600393505b505050919050565b63978aab926004525f828152602481208281015460601c915068fbb67fda52d4bfb8bf821415820291506119eb84611967565b8310611a0a57604051634e23d03560e01b815260040160405180910390fd5b5092915050565b604051815460208201905f905b8015611a545761ffff8116611a39576010918201911c611a1e565b8183526020600582901b16909201916001918201911c611a1e565b5050601f198282030160051c8252604052919050565b604080516060815290819052829050825160018151018060051b661d174b32e2c553602084035181810615828204029050808310611b04578281178101606086148260200187016040511817611ad057828102601f198701528501602001604052611b04565b602060405101816020018101604052808a52601f19855b8881015183820152810180611ae757509184029181019190915294505b505082019390935291909152919050565b600360b01b929092189181358083018035916020808301928686019291600586901b9091018101831090861017604082901c1715611b5a57633995943b5f526004601cfd5b505f5b838114611bad57365f8260051b850135808601602081019350803592505084828401118160401c1715611b9757633995943b5f526004601cfd5b50611ba3898383611248565b5050600101611b5d565b50505050505050565b8061146557333014611bc6575f80fd5b611bd184845f611eb9565b611bad565b604051637c84c69b60e01b81526004810183905260248101829052737109709ecfa91a80626ff3989d68f67f5b1dd12d90637c84c69b906044016118b2565b5f8080611cb2611c286201518086612f2a565b5f805f620afa6c8401935062023ab1840661016d62023ab082146105b48304618eac84048401030304606481048160021c8261016d0201038203915060996002836005020104600161030161f4ff830201600b1c84030193506b030405060708090a0b0c010260a01b811a9450506003841061019062023ab1880402820101945050509193909250565b9196909550909350915050565b5f620afa6c1961019060038510860381810462023ab10260649290910691820461016d830260029390931c9290920161f4ff600c60098901060261030101600b1c8601019190910301016201518002949350505050565b604051365f8237368120602052601051821860105260885f2090508060105260bc19700100000000000000000000000000000051820960801c600716611d5957505f5b919050565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301611d995763f5a267f15f526004601cfd5b82611dab5768fbb67fda52d4bfb8bf92505b80546001600160601b0381168260205280611e6d578160601c80611dd9578560601b8455600194505061184b565b858103611de6575061184b565b600184015460601c80611e07578660601b600186015560019550505061184b565b868103611e1557505061184b565b600285015460601c80611e37578760601b60028701556001965050505061184b565b878103611e465750505061184b565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f208054611eaf57600191821c808301825591945081611e9b578560601b60031784555061184b565b8560601b828501558260020184555061184b565b5050505092915050565b80611ec9576109e7838383612309565b5f818152683c149ebf7b8e6c5e2360205260409020611f476040805160e081018252606060c0820181815282528251602080820185528282528084019190915283518082018552828152838501528351808201855282815282840152835180820185528281526080840152835190810190935282529060a082015290565b5f611f5183611967565b90505f5b81811015611fa3575f611f6885836119b8565b90506001600160a01b03811615611f9a576040840151611f889082612360565b506060840151611f98905f611a6a565b505b50600101611f55565b505f805b8681101561212c57600581901b880135880180358015300217906020808201359160408101350190810190358215611fe657611fe38387612f49565b95505b6004811015611ff85750505050612124565b813560e01c63a9059cbb819003612046576120138a8661237f565b612021575050505050612124565b60408901516120309086612360565b50612044602484013560608b015190612428565b505b8063ffffffff1663095ea7b3036120a6576120618a8661237f565b61206f575050505050612124565b60248301355f03612084575050505050612124565b88516120909086612360565b506120a4600484013560208b015190612428565b505b8063ffffffff166387517c450361211e576001600160a01b0385166e22d473030f116ddee9f6b43ac78ba3146120e0575050505050612124565b60448301355f036120f5575050505050612124565b612108600484013560808b015190612428565b5061211c602484013560a08b015190612428565b505b50505050505b600101611fa7565b505f8080526001850160205260409020612146908261243e565b60408301515160608401515161215c91906124fc565b5f61218f61216d8560400151515190565b60606040518260201c5f031790508181528160051b6020820101604052919050565b90505f5b604085015151518110156121db57604085015151600582901b01602001516121d1826121bf83306125c2565b85919060059190911b82016020015290565b5050600101612193565b506121e7888888612309565b5f5b6040850151515181101561228057604085015151600582901b01602001515f61221282306125c2565b6001600160a01b0383165f90815260018a016020908152604090912060608a015151600587901b0190910151919250612276916122719061226661225c898960051b016020015190565b8680821191030290565b808218908210021890565b61243e565b50506001016121e9565b505f5b845151518110156122bc57845151600582901b01602001516122b49060208781015151600585901b0101515f6125ec565b600101612283565b505f5b608085015151518110156122fe57608085015151600582901b01602001516122f69060a087015151600584901b0160200151612636565b6001016122bf565b505050505050505050565b5f826123155750505050565b600581901b84013584018035801530021790602080820135916040810135019081019035612346848484848a612691565b505050508383905081600101915081036123155750505050565b60408051606081529081905261171883836001600160a01b0316611a6a565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016123ba5763f5a267f15f526004601cfd5b826123cc5768fbb67fda52d4bfb8bf92505b80546001600160601b03811661240f5760019250838160601c031561242057600182015460601c841461242057600282015460601c8414612420575f9250612420565b81602052835f5260405f2054151592505b505092915050565b6040805160608152908190526117188383611a6a565b80612447575050565b5f612451836126cd565b90505f5b81811015611267575f61246885836126ee565b60ff81165f818152600188016020526040812092935090612496904290600581111561050d5761050d612c96565b905080826002015410156124b257600282018190555f60018301555b815f015486836001015f8282546124c99190612f49565b92505081905511156124ee5760405163483f424d60e11b815260040160405180910390fd5b505050806001019050612455565b604051815183511461251a57634e487b715f5260326020526024601cfd5b825161252557505050565b5f806125308561278d565b6125398561278d565b91509150612546856127bc565b61254f85612811565b848403601f196020870187518752875160051b3684830137845160051b5b8086015181860151835b8281511461258757602001612577565b8601805182018082528211156125a957634e487b715f5260116020526024601cfd5b50505082018061256d5750505050826040525050505050565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b816014528060345263095ea7b360601b5f5260205f604460105f875af18060015f51141661262c57803d853b15171061262c57633e3f8f735f526004601cfd5b505f603452505050565b60405163cc53287f8152602080820152600160408201528260601b60601c60608201528160601b60601c60808201525f3860a0601c84015f6e22d473030f116ddee9f6b43ac78ba35af16109e7576396b3de235f526004601cfd5b61269d8186858561146f565b6126b9576040516282b42960e81b815260040160405180910390fd5b6126c6858585858561285c565b5050505050565b5f81545b80156126e8576001918201918119018116186126d1565b50919050565b5f825461010083101561271d575f5b80841461271657600182198101831690921891016126fd565b508061272a575b634e23d0355f526004601cfd5b7e1f0d1e100c1d070f090b19131c1706010e11080a1a141802121b15031604056001821901909116608081901c151560071b81811c60401c151560061b1781811c63ffffffff1060051b1790811c63d76453e004601f169190911a179392505050565b604051815160051b8101602001818084035b80820151825281602001915082820361279f575060405250919050565b80515f82528060051b8201601f19602084015b60200182811161280a57805182820180518281116127ef575050506127cf565b5b6020820152830180518281116127f05750602001526127cf565b5050509052565b6002815110612859576020810160408201600183510160051b83015b815183511461284157602083019250815183525b60208201915080820361282d57505081900360051c81525b50565b604051828482375f388483888a5af16118da573d5f823e3d81fd5b80356001600160a01b0381168114611d59575f80fd5b80356001600160e01b031981168114611d59575f80fd5b5f805f80608085870312156128b7575f80fd5b843593506128c760208601612877565b92506128d56040860161288d565b9150606085013580151581146128e9575f80fd5b939692955090935050565b602080825282518282018190525f918401906040840190835b818110156129345783516001600160a01b031683526020938401939092019160010161290d565b509095945050505050565b803560068110611d59575f80fd5b5f805f6060848603121561295f575f80fd5b8335925061296f60208501612877565b915061297d6040850161293f565b90509250925092565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b5f602082016020835280845180835260408501915060408160051b8601019250602086015f5b82811015612a7157603f19878603018452815180516001600160a01b03168652602090810151604082880181905281519088018190529101906060600582901b8801810191908801905f5b81811015612a5757605f198a8503018352612a41848651612986565b6020958601959094509290920191600101612a25565b5091975050506020948501949290920191506001016129da565b50929695505050505050565b5f8060408385031215612a8e575f80fd5b612a9783612877565b9150612aa56020840161288d565b90509250929050565b5f805f8060808587031215612ac1575f80fd5b84359350612ad160208601612877565b9250612adf6040860161293f565b9396929550929360600135925050565b5f8151808452602084019350602083015f5b82811015612b295781516001600160e01b031916865260209586019590910190600101612b01565b5093949350505050565b5f602082016020835280845180835260408501915060408160051b8601019250602086015f5b82811015612a7157603f198786030184528151805160408752612b7f6040880182612986565b9050602082015191508681036020880152612b9a8183612aef565b965050506020938401939190910190600101612b59565b5f602082016020835280845180835260408501915060408160051b8601019250602086015f5b82811015612a7157603f19878603018452612bf3858351612986565b94506020938401939190910190600101612bd7565b5f602082016020835280845180835260408501915060408160051b8601019250602086015f5b82811015612a7157868503603f19018452815180516001600160a01b03168652602090810151604091870182905290612c6990870182612aef565b9550506020938401939190910190600101612c2e565b5f60208284031215612c8f575f80fd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b60068110612cc657634e487b7160e01b5f52602160045260245ffd5b9052565b602080825282518282018190525f918401906040840190835b8181101561293457835180516001600160a01b0316845260208082015190612d0d90860182612caa565b506040810151604085015260608101516060850152608081015160808501525060a083019250602084019350600181019050612ce3565b5f8083601f840112612d54575f80fd5b50813567ffffffffffffffff811115612d6b575f80fd5b602083019150836020828501011115612d82575f80fd5b9250929050565b5f805f60408486031215612d9b575f80fd5b83359250602084013567ffffffffffffffff811115612db8575f80fd5b612dc486828701612d44565b9497909650939450505050565b5f805f60608486031215612de3575f80fd5b83359250612df360208501612877565b915061297d6040850161288d565b5f8060408385031215612e12575f80fd5b82359150612aa56020840161293f565b5f805f8060608587031215612e35575f80fd5b84359350612e4560208601612877565b9250604085013567ffffffffffffffff811115612e60575f80fd5b612e6c87828801612d44565b95989497509550505050565b8381526001600160a01b0383166020820152606081016116ed6040830184612caa565b600181811c90821680612eaf57607f821691505b6020821081036126e857634e487b7160e01b5f52602260045260245ffd5b8481526001600160a01b038416602082015260808101612ef06040830185612caa565b82606083015295945050505050565b5f60208284031215612f0f575f80fd5b5051919050565b634e487b7160e01b5f52603260045260245ffd5b5f82612f4457634e487b7160e01b5f52601260045260245ffd5b500490565b8082018082111561146957634e487b7160e01b5f52601160045260245ffdfe3232323232323232323232323232323232323232323232323232323232323232a2646970667358221220b69f351f6c77cc949e01f9cdaebab8a67939656c0681f0cda1726a5d2506b13964736f6c634300081a0033" as const;


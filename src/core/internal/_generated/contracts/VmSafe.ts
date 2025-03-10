export const abi = [
  {
    "type": "function",
    "name": "accesses",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "readSlots",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      },
      {
        "name": "writeSlots",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "addr",
    "inputs": [
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "keyAddr",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqAbs",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxDelta",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqAbs",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "maxDelta",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqAbs",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "maxDelta",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqAbs",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxDelta",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqAbsDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxDelta",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqAbsDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "maxDelta",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqAbsDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxDelta",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqAbsDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "maxDelta",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqRel",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxPercentDelta",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqRel",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxPercentDelta",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqRel",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "maxPercentDelta",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqRel",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "maxPercentDelta",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqRelDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxPercentDelta",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqRelDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxPercentDelta",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqRelDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "maxPercentDelta",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertApproxEqRelDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "maxPercentDelta",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      },
      {
        "name": "right",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "int256[]",
        "internalType": "int256[]"
      },
      {
        "name": "right",
        "type": "int256[]",
        "internalType": "int256[]"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "right",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "right",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "right",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "right",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "right",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "right",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "right",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "bool[]",
        "internalType": "bool[]"
      },
      {
        "name": "right",
        "type": "bool[]",
        "internalType": "bool[]"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "int256[]",
        "internalType": "int256[]"
      },
      {
        "name": "right",
        "type": "int256[]",
        "internalType": "int256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "right",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "right",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "right",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "right",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "right",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      },
      {
        "name": "right",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "right",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "bool[]",
        "internalType": "bool[]"
      },
      {
        "name": "right",
        "type": "bool[]",
        "internalType": "bool[]"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "right",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "right",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "right",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "right",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "right",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEq",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEqDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEqDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEqDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertEqDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertFalse",
    "inputs": [
      {
        "name": "condition",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertFalse",
    "inputs": [
      {
        "name": "condition",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGe",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGe",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGe",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGe",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGeDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGeDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGeDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGeDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGt",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGt",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGt",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGt",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGtDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGtDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGtDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertGtDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLe",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLe",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLe",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLe",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLeDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLeDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLeDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLeDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLt",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLt",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLt",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLt",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLtDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLtDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLtDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertLtDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      },
      {
        "name": "right",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "int256[]",
        "internalType": "int256[]"
      },
      {
        "name": "right",
        "type": "int256[]",
        "internalType": "int256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "right",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "right",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "right",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "bool[]",
        "internalType": "bool[]"
      },
      {
        "name": "right",
        "type": "bool[]",
        "internalType": "bool[]"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "right",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "right",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "right",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "bool[]",
        "internalType": "bool[]"
      },
      {
        "name": "right",
        "type": "bool[]",
        "internalType": "bool[]"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "right",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "right",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "right",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "right",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "right",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "right",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "right",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "right",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "right",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "right",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      },
      {
        "name": "right",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "right",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "int256[]",
        "internalType": "int256[]"
      },
      {
        "name": "right",
        "type": "int256[]",
        "internalType": "int256[]"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "right",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEq",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEqDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEqDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "right",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEqDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertNotEqDecimal",
    "inputs": [
      {
        "name": "left",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "right",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "decimals",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertTrue",
    "inputs": [
      {
        "name": "condition",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assertTrue",
    "inputs": [
      {
        "name": "condition",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "error",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assume",
    "inputs": [
      {
        "name": "condition",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assumeNoRevert",
    "inputs": [],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assumeNoRevert",
    "inputs": [
      {
        "name": "potentialReverts",
        "type": "tuple[]",
        "internalType": "struct VmSafe.PotentialRevert[]",
        "components": [
          {
            "name": "reverter",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "partialMatch",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "revertData",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "assumeNoRevert",
    "inputs": [
      {
        "name": "potentialRevert",
        "type": "tuple",
        "internalType": "struct VmSafe.PotentialRevert",
        "components": [
          {
            "name": "reverter",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "partialMatch",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "revertData",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "attachDelegation",
    "inputs": [
      {
        "name": "signedDelegation",
        "type": "tuple",
        "internalType": "struct VmSafe.SignedDelegation",
        "components": [
          {
            "name": "v",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "r",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "s",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "nonce",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "implementation",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "breakpoint",
    "inputs": [
      {
        "name": "char",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "breakpoint",
    "inputs": [
      {
        "name": "char",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "broadcast",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "broadcast",
    "inputs": [
      {
        "name": "signer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "broadcast",
    "inputs": [
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "broadcastRawTransaction",
    "inputs": [
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "closeFile",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "computeCreate2Address",
    "inputs": [
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "initCodeHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "computeCreate2Address",
    "inputs": [
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "initCodeHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "deployer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "computeCreateAddress",
    "inputs": [
      {
        "name": "deployer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "contains",
    "inputs": [
      {
        "name": "subject",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "search",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "result",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "copyFile",
    "inputs": [
      {
        "name": "from",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "to",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "copied",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "copyStorage",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createDir",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "recursive",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createWallet",
    "inputs": [
      {
        "name": "walletLabel",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "wallet",
        "type": "tuple",
        "internalType": "struct VmSafe.Wallet",
        "components": [
          {
            "name": "addr",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "publicKeyX",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "publicKeyY",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "privateKey",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createWallet",
    "inputs": [
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "wallet",
        "type": "tuple",
        "internalType": "struct VmSafe.Wallet",
        "components": [
          {
            "name": "addr",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "publicKeyX",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "publicKeyY",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "privateKey",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createWallet",
    "inputs": [
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "walletLabel",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "wallet",
        "type": "tuple",
        "internalType": "struct VmSafe.Wallet",
        "components": [
          {
            "name": "addr",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "publicKeyX",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "publicKeyY",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "privateKey",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deployCode",
    "inputs": [
      {
        "name": "artifactPath",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "constructorArgs",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "deployedAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deployCode",
    "inputs": [
      {
        "name": "artifactPath",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "deployedAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deriveKey",
    "inputs": [
      {
        "name": "mnemonic",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "derivationPath",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "index",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "language",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "deriveKey",
    "inputs": [
      {
        "name": "mnemonic",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "index",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "language",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "deriveKey",
    "inputs": [
      {
        "name": "mnemonic",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "index",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "outputs": [
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "deriveKey",
    "inputs": [
      {
        "name": "mnemonic",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "derivationPath",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "index",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "outputs": [
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "ensNamehash",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
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
    "name": "envAddress",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envAddress",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delim",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envBool",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envBool",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delim",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "bool[]",
        "internalType": "bool[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envBytes",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envBytes",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delim",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envBytes32",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delim",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envBytes32",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envExists",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
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
    "name": "envInt",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delim",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "int256[]",
        "internalType": "int256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envInt",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envOr",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delim",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "defaultValue",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envOr",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delim",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "defaultValue",
        "type": "int256[]",
        "internalType": "int256[]"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "int256[]",
        "internalType": "int256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envOr",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "defaultValue",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envOr",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "defaultValue",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envOr",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "defaultValue",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envOr",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delim",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "defaultValue",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envOr",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delim",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "defaultValue",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envOr",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delim",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "defaultValue",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envOr",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "defaultValue",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envOr",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "defaultValue",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envOr",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "defaultValue",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envOr",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delim",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "defaultValue",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envOr",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "defaultValue",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envOr",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delim",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "defaultValue",
        "type": "bool[]",
        "internalType": "bool[]"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "bool[]",
        "internalType": "bool[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envString",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delim",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envString",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envUint",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "envUint",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delim",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "eth_getLogs",
    "inputs": [
      {
        "name": "fromBlock",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "toBlock",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "topics",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "outputs": [
      {
        "name": "logs",
        "type": "tuple[]",
        "internalType": "struct VmSafe.EthGetLogs[]",
        "components": [
          {
            "name": "emitter",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "topics",
            "type": "bytes32[]",
            "internalType": "bytes32[]"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "blockHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "blockNumber",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "transactionHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "transactionIndex",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "logIndex",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "removed",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "exists",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
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
    "name": "ffi",
    "inputs": [
      {
        "name": "commandInput",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "outputs": [
      {
        "name": "result",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "fsMetadata",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "metadata",
        "type": "tuple",
        "internalType": "struct VmSafe.FsMetadata",
        "components": [
          {
            "name": "isDir",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "isSymlink",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "length",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "readOnly",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "modified",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "accessed",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "created",
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
    "name": "getArtifactPathByCode",
    "inputs": [
      {
        "name": "code",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getArtifactPathByDeployedCode",
    "inputs": [
      {
        "name": "deployedCode",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBlobBaseFee",
    "inputs": [],
    "outputs": [
      {
        "name": "blobBaseFee",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBlockNumber",
    "inputs": [],
    "outputs": [
      {
        "name": "height",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBlockTimestamp",
    "inputs": [],
    "outputs": [
      {
        "name": "timestamp",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBroadcast",
    "inputs": [
      {
        "name": "contractName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "txType",
        "type": "uint8",
        "internalType": "enum VmSafe.BroadcastTxType"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct VmSafe.BroadcastTxSummary",
        "components": [
          {
            "name": "txHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "txType",
            "type": "uint8",
            "internalType": "enum VmSafe.BroadcastTxType"
          },
          {
            "name": "contractAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "blockNumber",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "success",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBroadcasts",
    "inputs": [
      {
        "name": "contractName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct VmSafe.BroadcastTxSummary[]",
        "components": [
          {
            "name": "txHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "txType",
            "type": "uint8",
            "internalType": "enum VmSafe.BroadcastTxType"
          },
          {
            "name": "contractAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "blockNumber",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "success",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBroadcasts",
    "inputs": [
      {
        "name": "contractName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "txType",
        "type": "uint8",
        "internalType": "enum VmSafe.BroadcastTxType"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct VmSafe.BroadcastTxSummary[]",
        "components": [
          {
            "name": "txHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "txType",
            "type": "uint8",
            "internalType": "enum VmSafe.BroadcastTxType"
          },
          {
            "name": "contractAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "blockNumber",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "success",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCode",
    "inputs": [
      {
        "name": "artifactPath",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "creationBytecode",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDeployedCode",
    "inputs": [
      {
        "name": "artifactPath",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "runtimeBytecode",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDeployment",
    "inputs": [
      {
        "name": "contractName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [
      {
        "name": "deployedAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDeployment",
    "inputs": [
      {
        "name": "contractName",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "deployedAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDeployments",
    "inputs": [
      {
        "name": "contractName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [
      {
        "name": "deployedAddresses",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getFoundryVersion",
    "inputs": [],
    "outputs": [
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getLabel",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "currentLabel",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMappingKeyAndParentOf",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "elementSlot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "found",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "key",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "parent",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getMappingLength",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "mappingSlot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "length",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getMappingSlotAt",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "mappingSlot",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "idx",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "nonce",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "wallet",
        "type": "tuple",
        "internalType": "struct VmSafe.Wallet",
        "components": [
          {
            "name": "addr",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "publicKeyX",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "publicKeyY",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "privateKey",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "nonce",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getRecordedLogs",
    "inputs": [],
    "outputs": [
      {
        "name": "logs",
        "type": "tuple[]",
        "internalType": "struct VmSafe.Log[]",
        "components": [
          {
            "name": "topics",
            "type": "bytes32[]",
            "internalType": "bytes32[]"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "emitter",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getStateDiff",
    "inputs": [],
    "outputs": [
      {
        "name": "diff",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getStateDiffJson",
    "inputs": [],
    "outputs": [
      {
        "name": "diff",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getWallets",
    "inputs": [],
    "outputs": [
      {
        "name": "wallets",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "indexOf",
    "inputs": [
      {
        "name": "input",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
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
    "name": "isContext",
    "inputs": [
      {
        "name": "context",
        "type": "uint8",
        "internalType": "enum VmSafe.ForgeContext"
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
    "name": "isDir",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
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
    "name": "isFile",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
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
    "name": "keyExists",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
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
    "name": "keyExistsJson",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
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
    "name": "keyExistsToml",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
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
    "name": "label",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
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
    "name": "lastCallGas",
    "inputs": [],
    "outputs": [
      {
        "name": "gas",
        "type": "tuple",
        "internalType": "struct VmSafe.Gas",
        "components": [
          {
            "name": "gasLimit",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "gasTotalUsed",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "gasMemoryUsed",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "gasRefunded",
            "type": "int64",
            "internalType": "int64"
          },
          {
            "name": "gasRemaining",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "load",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "slot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "data",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "parseAddress",
    "inputs": [
      {
        "name": "stringifiedValue",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "parsedValue",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseBool",
    "inputs": [
      {
        "name": "stringifiedValue",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "parsedValue",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseBytes",
    "inputs": [
      {
        "name": "stringifiedValue",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "parsedValue",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseBytes32",
    "inputs": [
      {
        "name": "stringifiedValue",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "parsedValue",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseInt",
    "inputs": [
      {
        "name": "stringifiedValue",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "parsedValue",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJson",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "abiEncodedData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJson",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "abiEncodedData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonAddress",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonAddressArray",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonBool",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonBoolArray",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool[]",
        "internalType": "bool[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonBytes",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonBytes32",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
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
    "name": "parseJsonBytes32Array",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonBytesArray",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonInt",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonIntArray",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "int256[]",
        "internalType": "int256[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonKeys",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "keys",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonString",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonStringArray",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonType",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "typeDescription",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonType",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "typeDescription",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonTypeArray",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "typeDescription",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseJsonUint",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
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
    "name": "parseJsonUintArray",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseToml",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "abiEncodedData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseToml",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "abiEncodedData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlAddress",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlAddressArray",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlBool",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlBoolArray",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool[]",
        "internalType": "bool[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlBytes",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlBytes32",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
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
    "name": "parseTomlBytes32Array",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlBytesArray",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlInt",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlIntArray",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "int256[]",
        "internalType": "int256[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlKeys",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "keys",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlString",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlStringArray",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlType",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "typeDescription",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlType",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "typeDescription",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlTypeArray",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "typeDescription",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseTomlUint",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
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
    "name": "parseTomlUintArray",
    "inputs": [
      {
        "name": "toml",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "key",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseUint",
    "inputs": [
      {
        "name": "stringifiedValue",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "parsedValue",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "pauseGasMetering",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "pauseTracing",
    "inputs": [],
    "outputs": [],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "projectRoot",
    "inputs": [],
    "outputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "prompt",
    "inputs": [
      {
        "name": "promptText",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "input",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "promptAddress",
    "inputs": [
      {
        "name": "promptText",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "promptSecret",
    "inputs": [
      {
        "name": "promptText",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "input",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "promptSecretUint",
    "inputs": [
      {
        "name": "promptText",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "promptUint",
    "inputs": [
      {
        "name": "promptText",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "publicKeyP256",
    "inputs": [
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "publicKeyX",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "publicKeyY",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "randomAddress",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "randomBool",
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
    "name": "randomBytes",
    "inputs": [
      {
        "name": "len",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "randomBytes4",
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
    "name": "randomBytes8",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes8",
        "internalType": "bytes8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "randomInt",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "randomInt",
    "inputs": [
      {
        "name": "bits",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "randomUint",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "randomUint",
    "inputs": [
      {
        "name": "bits",
        "type": "uint256",
        "internalType": "uint256"
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
    "name": "randomUint",
    "inputs": [
      {
        "name": "min",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "max",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "readDir",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "maxDepth",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [
      {
        "name": "entries",
        "type": "tuple[]",
        "internalType": "struct VmSafe.DirEntry[]",
        "components": [
          {
            "name": "errorMessage",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "path",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "depth",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "isDir",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "isSymlink",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "readDir",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "maxDepth",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "followLinks",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [
      {
        "name": "entries",
        "type": "tuple[]",
        "internalType": "struct VmSafe.DirEntry[]",
        "components": [
          {
            "name": "errorMessage",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "path",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "depth",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "isDir",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "isSymlink",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "readDir",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "entries",
        "type": "tuple[]",
        "internalType": "struct VmSafe.DirEntry[]",
        "components": [
          {
            "name": "errorMessage",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "path",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "depth",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "isDir",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "isSymlink",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "readFile",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "data",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "readFileBinary",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "readLine",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "line",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "readLink",
    "inputs": [
      {
        "name": "linkPath",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "targetPath",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "record",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "recordLogs",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rememberKey",
    "inputs": [
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "keyAddr",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rememberKeys",
    "inputs": [
      {
        "name": "mnemonic",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "derivationPath",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "count",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "outputs": [
      {
        "name": "keyAddrs",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rememberKeys",
    "inputs": [
      {
        "name": "mnemonic",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "derivationPath",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "language",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "count",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "outputs": [
      {
        "name": "keyAddrs",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeDir",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "recursive",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeFile",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "replace",
    "inputs": [
      {
        "name": "input",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "from",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "to",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "output",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "resetGasMetering",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resumeGasMetering",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resumeTracing",
    "inputs": [],
    "outputs": [],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "rpc",
    "inputs": [
      {
        "name": "urlOrAlias",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "method",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "params",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rpc",
    "inputs": [
      {
        "name": "method",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "params",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rpcUrl",
    "inputs": [
      {
        "name": "rpcAlias",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "rpcUrlStructs",
    "inputs": [],
    "outputs": [
      {
        "name": "urls",
        "type": "tuple[]",
        "internalType": "struct VmSafe.Rpc[]",
        "components": [
          {
            "name": "key",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "url",
            "type": "string",
            "internalType": "string"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "rpcUrls",
    "inputs": [],
    "outputs": [
      {
        "name": "urls",
        "type": "string[2][]",
        "internalType": "string[2][]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "serializeAddress",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "values",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeAddress",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeBool",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "values",
        "type": "bool[]",
        "internalType": "bool[]"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeBool",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeBytes",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "values",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeBytes",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeBytes32",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "values",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeBytes32",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeInt",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeInt",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "values",
        "type": "int256[]",
        "internalType": "int256[]"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeJson",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeJsonType",
    "inputs": [
      {
        "name": "typeDescription",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "serializeJsonType",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "typeDescription",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeString",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "values",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeString",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeUint",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeUint",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "values",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serializeUintToHex",
    "inputs": [
      {
        "name": "objectKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setArbitraryStorage",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setEnv",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "value",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "sign",
    "inputs": [
      {
        "name": "digest",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "v",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "r",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "sign",
    "inputs": [
      {
        "name": "signer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "digest",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "v",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "r",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "sign",
    "inputs": [
      {
        "name": "wallet",
        "type": "tuple",
        "internalType": "struct VmSafe.Wallet",
        "components": [
          {
            "name": "addr",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "publicKeyX",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "publicKeyY",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "privateKey",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "digest",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "v",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "r",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "sign",
    "inputs": [
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "digest",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "v",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "r",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "signAndAttachDelegation",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "signedDelegation",
        "type": "tuple",
        "internalType": "struct VmSafe.SignedDelegation",
        "components": [
          {
            "name": "v",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "r",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "s",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "nonce",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "implementation",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "signCompact",
    "inputs": [
      {
        "name": "wallet",
        "type": "tuple",
        "internalType": "struct VmSafe.Wallet",
        "components": [
          {
            "name": "addr",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "publicKeyX",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "publicKeyY",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "privateKey",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "digest",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "r",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "vs",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "signCompact",
    "inputs": [
      {
        "name": "signer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "digest",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "r",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "vs",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "signCompact",
    "inputs": [
      {
        "name": "digest",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "r",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "vs",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "signCompact",
    "inputs": [
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "digest",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "r",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "vs",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "signDelegation",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "signedDelegation",
        "type": "tuple",
        "internalType": "struct VmSafe.SignedDelegation",
        "components": [
          {
            "name": "v",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "r",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "s",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "nonce",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "implementation",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "signP256",
    "inputs": [
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "digest",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "r",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "sleep",
    "inputs": [
      {
        "name": "duration",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "split",
    "inputs": [
      {
        "name": "input",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delimiter",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "outputs",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "startBroadcast",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "startBroadcast",
    "inputs": [
      {
        "name": "signer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "startBroadcast",
    "inputs": [
      {
        "name": "privateKey",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "startDebugTraceRecording",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "startMappingRecording",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "startStateDiffRecording",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "stopAndReturnDebugTraceRecording",
    "inputs": [],
    "outputs": [
      {
        "name": "step",
        "type": "tuple[]",
        "internalType": "struct VmSafe.DebugStep[]",
        "components": [
          {
            "name": "stack",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "memoryInput",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "opcode",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "depth",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "isOutOfGas",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "contractAddr",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "stopAndReturnStateDiff",
    "inputs": [],
    "outputs": [
      {
        "name": "accountAccesses",
        "type": "tuple[]",
        "internalType": "struct VmSafe.AccountAccess[]",
        "components": [
          {
            "name": "chainInfo",
            "type": "tuple",
            "internalType": "struct VmSafe.ChainInfo",
            "components": [
              {
                "name": "forkId",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "chainId",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "kind",
            "type": "uint8",
            "internalType": "enum VmSafe.AccountAccessKind"
          },
          {
            "name": "account",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "accessor",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "initialized",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "oldBalance",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "newBalance",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "deployedCode",
            "type": "bytes",
            "internalType": "bytes"
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
          },
          {
            "name": "reverted",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "storageAccesses",
            "type": "tuple[]",
            "internalType": "struct VmSafe.StorageAccess[]",
            "components": [
              {
                "name": "account",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "slot",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "isWrite",
                "type": "bool",
                "internalType": "bool"
              },
              {
                "name": "previousValue",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "newValue",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "reverted",
                "type": "bool",
                "internalType": "bool"
              }
            ]
          },
          {
            "name": "depth",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "stopBroadcast",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "stopMappingRecording",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "toBase64",
    "inputs": [
      {
        "name": "data",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "toBase64",
    "inputs": [
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "toBase64URL",
    "inputs": [
      {
        "name": "data",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "toBase64URL",
    "inputs": [
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "toLowercase",
    "inputs": [
      {
        "name": "input",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "output",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "toString",
    "inputs": [
      {
        "name": "value",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "stringifiedValue",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "toString",
    "inputs": [
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "stringifiedValue",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "toString",
    "inputs": [
      {
        "name": "value",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "stringifiedValue",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "toString",
    "inputs": [
      {
        "name": "value",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [
      {
        "name": "stringifiedValue",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "toString",
    "inputs": [
      {
        "name": "value",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "outputs": [
      {
        "name": "stringifiedValue",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "toString",
    "inputs": [
      {
        "name": "value",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "stringifiedValue",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "toUppercase",
    "inputs": [
      {
        "name": "input",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "output",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "trim",
    "inputs": [
      {
        "name": "input",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "output",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "tryFfi",
    "inputs": [
      {
        "name": "commandInput",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "outputs": [
      {
        "name": "result",
        "type": "tuple",
        "internalType": "struct VmSafe.FfiResult",
        "components": [
          {
            "name": "exitCode",
            "type": "int32",
            "internalType": "int32"
          },
          {
            "name": "stdout",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "stderr",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "unixTime",
    "inputs": [],
    "outputs": [
      {
        "name": "milliseconds",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "writeFile",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "data",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "writeFileBinary",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "writeJson",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "writeJson",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "writeLine",
    "inputs": [
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "data",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "writeToml",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "valueKey",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "writeToml",
    "inputs": [
      {
        "name": "json",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "path",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const;

export const code = "0x" as const;


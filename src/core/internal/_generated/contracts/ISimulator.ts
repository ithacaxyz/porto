export const abi = [
  {
    "type": "function",
    "name": "simulateCombinedGas",
    "inputs": [
      {
        "name": "ep",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "isPrePayment",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "paymentPerGas",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "combinedGasIncrement",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "encodedUserOp",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "gasUsed",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "combinedGas",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "simulateGasUsed",
    "inputs": [
      {
        "name": "ep",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "overrideCombinedGas",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "encodedUserOp",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "gasUsed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "payable"
  }
] as const;

export const code = "0x" as const;


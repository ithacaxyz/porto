export const abi = [
  {
    "type": "function",
    "name": "read",
    "inputs": [
      {
        "name": "settlementId",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "attester",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "isSettled",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "send",
    "inputs": [
      {
        "name": "settlementId",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "settlerContext",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  }
] as const;

export const code = "0x" as const;


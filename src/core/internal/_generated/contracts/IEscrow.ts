export const abi = [
  {
    "type": "function",
    "name": "escrow",
    "inputs": [
      {
        "name": "_escrows",
        "type": "tuple[]",
        "internalType": "struct IEscrow.Escrow[]",
        "components": [
          {
            "name": "salt",
            "type": "bytes12",
            "internalType": "bytes12"
          },
          {
            "name": "depositor",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "recipient",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "token",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "escrowAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "refundAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "refundTimestamp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "settler",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "settlementId",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "senderChainId",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "refundDepositor",
    "inputs": [
      {
        "name": "escrowIds",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "refundRecipient",
    "inputs": [
      {
        "name": "escrowIds",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "settle",
    "inputs": [
      {
        "name": "escrowIds",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const;

export const code = "0x" as const;


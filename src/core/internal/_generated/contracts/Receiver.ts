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
    "type": "error",
    "name": "FnSelectorNotRecognized",
    "inputs": []
  }
] as const;

export const code = "0x" as const;


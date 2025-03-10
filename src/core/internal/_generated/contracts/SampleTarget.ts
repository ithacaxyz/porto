export const abi = [
  {
    "type": "function",
    "name": "setX",
    "inputs": [
      {
        "name": "newX",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "x",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  }
] as const;

export const code = "0x6080604052348015600e575f80fd5b5060aa80601a5f395ff3fe6080604052348015600e575f80fd5b50600436106030575f3560e01c80630c55699c1460345780634018d9aa14604d575b5f80fd5b603b5f5481565b60405190815260200160405180910390f35b605c6058366004605e565b5f55565b005b5f60208284031215606d575f80fd5b503591905056fea26469706673582212202e1fe6444172a499847710c9b3fb0c32244800ee5cd8ab278dce74fc598b517064736f6c634300081a0033" as const;


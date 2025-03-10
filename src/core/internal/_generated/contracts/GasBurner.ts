export const abi = [
  {
    "type": "function",
    "name": "burnGas",
    "inputs": [
      {
        "name": "x",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "r",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "randomness",
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
    "name": "setRandomness",
    "inputs": [
      {
        "name": "r",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const;

export const code = "0x6080604052348015600e575f80fd5b5061019b8061001c5f395ff3fe608060405234801561000f575f80fd5b506004361061003f575f3560e01c80633601318914610043578063388b608b1461005d578063fdd198c314610072575b5f80fd5b61004b5f5481565b60405190815260200160405180910390f35b61007061006b36600461012e565b610084565b005b61007061008036600461014e565b5f55565b806001165f0361009c57610097826100f8565b6100f3565b60405163388b608b60e01b815260048101839052600182901c6024820152309063388b608b906044015f604051808303815f87803b1580156100dc575f80fd5b505af11580156100ee573d5f803e3d5ffd5b505050505b5f5550565b80600117601052605b810460788211025f5b818114610120576010808020905260010161010a565b505060105161012b57fe5b50565b5f806040838503121561013f575f80fd5b50508035926020909101359150565b5f6020828403121561015e575f80fd5b503591905056fea2646970667358221220dd8350da1a3a79385541e93984ecf6d040cb3c87a1252ff7719a5bbb7dc7d17b64736f6c634300081a0033" as const;


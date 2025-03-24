export const abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "initialOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
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
    "name": "USER_OP_TYPEHASH",
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
    "name": "appendAccount",
    "inputs": [
      {
        "name": "id",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "cancelOwnershipHandover",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "completeOwnershipHandover",
    "inputs": [
      {
        "name": "pendingOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
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
        "name": "encodedUserOp",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "err",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "encodedUserOps",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [
      {
        "name": "errs",
        "type": "bytes4[]",
        "internalType": "bytes4[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "fill",
    "inputs": [
      {
        "name": "orderId",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "originData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
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
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "eoa",
        "type": "address",
        "internalType": "address"
      },
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
    "name": "idInfos",
    "inputs": [
      {
        "name": "ids",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [
      {
        "name": "datas",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "accounts",
        "type": "address[][]",
        "internalType": "address[][]"
      }
    ],
    "stateMutability": "view"
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
    "name": "orderIdIsFilled",
    "inputs": [
      {
        "name": "orderId",
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
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "result",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ownershipHandoverExpiresAt",
    "inputs": [
      {
        "name": "pendingOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "result",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "register",
    "inputs": [
      {
        "name": "signature",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeAccount",
    "inputs": [
      {
        "name": "id",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "requestOwnershipHandover",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "selfCallPayVerifyCall537021665",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "selfCallSimulateExecute565348489",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "simulateExecute",
    "inputs": [
      {
        "name": "encodedUserOp",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "simulateFailed",
    "inputs": [
      {
        "name": "encodedUserOp",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "withdrawTokens",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "recipient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "NonceInvalidated",
    "inputs": [
      {
        "name": "eoa",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
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
    "name": "OwnershipHandoverCanceled",
    "inputs": [
      {
        "name": "pendingOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipHandoverRequested",
    "inputs": [
      {
        "name": "pendingOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "oldOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserOpExecuted",
    "inputs": [
      {
        "name": "eoa",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "incremented",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "err",
        "type": "bytes4",
        "indexed": false,
        "internalType": "bytes4"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AlreadyInitialized",
    "inputs": []
  },
  {
    "type": "error",
    "name": "AlreadyRegistered",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CallError",
    "inputs": []
  },
  {
    "type": "error",
    "name": "IDOccupied",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InsufficientGas",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidCaller",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidNonce",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NewOwnerIsZeroAddress",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NewSequenceMustBeLarger",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NoHandoverRequest",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NoRevertEncountered",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OrderAlreadyFilled",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PaymentError",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Reentrancy",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SimulateExecuteFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SimulationResult",
    "inputs": [
      {
        "name": "gExecute",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "gCombined",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "gUsed",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "err",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ]
  },
  {
    "type": "error",
    "name": "Unauthorized",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UnauthorizedCallContext",
    "inputs": []
  },
  {
    "type": "error",
    "name": "VerificationError",
    "inputs": []
  },
  {
    "type": "error",
    "name": "VerifiedCallError",
    "inputs": []
  }
] as const;

export const code = "0x61014060408190523061012052612a813881900390819083398101604081905261002891610124565b306080524660a052606080610076604080518082018252600a815269115b9d1c9e541bda5b9d60b21b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a0902061010052506100e39050816100e9565b50610151565b6001600160a01b0316638b78c6d819819055805f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08180a350565b5f60208284031215610134575f80fd5b81516001600160a01b038116811461014a575f80fd5b9392505050565b60805160a05160c05160e05161010051610120516128ec6101955f395f50505f611ffd01525f6120b701525f61209101525f61204101525f61201e01526128ec5ff3fe608060405260043610610193575f3560e01c806379907891116100e7578063c4740a9511610087578063f2fde38b11610062578063f2fde38b1461046c578063fcd4e7071461047f578063fee81cf4146104a7578063ffffffff146104d8575f80fd5b8063c4740a951461040b578063dd139f5d1461042a578063f04e283e14610459575f80fd5b8063874dfaaf116100c2578063874dfaaf1461037b5780638da5cb5b146103ae578063b70e36f0146103d9578063bd6e9b89146103f8575f80fd5b8063799078911461032257806382e2c43f1461034157806384b0196e14610354575f80fd5b806344471415116101525780635e35359e1161012d5780635e35359e146102af578063703a60cd146102ce578063715018a6146102ed57806374513492146102f5575f80fd5b8063444714151461027457806354d1f13d146102945780635da4d9791461029c575f80fd5b801561019e57806309c5eabe146101a85780631a912f3e146101d957806320606b701461021a578063256929621461024d57806335567e1a14610255575f80fd5b3661019a57005b5f80fd5b6101a66104e0565b005b6101bb6101b6366004612236565b610694565b6040516001600160e01b031990911681526020015b60405180910390f35b3480156101e4575f80fd5b5061020c7f84fa2cf05cd88e992eae77e851af68a4ee278dcff6ef504e487a55b3baadfbe581565b6040519081526020016101d0565b348015610225575f80fd5b5061020c7f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b6101a661070b565b348015610260575f80fd5b5061020c61026f36600461228f565b610757565b61028761028236600461230f565b6107a4565b6040516101d09190612341565b6101a6610886565b6101a66102aa366004612236565b6108bf565b3480156102ba575f80fd5b506101a66102c936600461238d565b610a3a565b3480156102d9575f80fd5b506101a66102e83660046123c7565b610a52565b6101a6610af9565b348015610300575f80fd5b5061031461030f36600461230f565b610b0c565b6040516101d0929190612473565b34801561032d575f80fd5b506101a661033c366004612562565b610cea565b6101bb61034f366004612593565b610d71565b34801561035f575f80fd5b50610368610e29565b6040516101d0979695949392919061260a565b348015610386575f80fd5b5061020c7fa4d40a46e03a4a680843fcbc2b3e68b95946b4c85520ac6d413b6b1db1d1c16f81565b3480156103b9575f80fd5b50638b78c6d819546040516001600160a01b0390911681526020016101d0565b3480156103e4575f80fd5b506101a66103f33660046126a0565b610e4f565b6101a6610406366004612236565b610ea7565b348015610416575f80fd5b506101a66104253660046126b7565b610eef565b348015610435575f80fd5b506104496104443660046126a0565b610fb9565b60405190151581526020016101d0565b6101a66104673660046126b7565b610fee565b6101a661047a3660046126b7565b61102b565b34801561048a575f80fd5b5061049461c1d081565b60405161ffff90911681526020016101d0565b3480156104b2575f80fd5b5061020c6104c13660046126b7565b63389a75e1600c9081525f91909152602090205490565b6101a6611051565b3330146104eb575f80fd5b6024803590810190600435905f9061050690604401846126b7565b90505f8061053a6847a69e8902384d5aa16001600160a01b0385165f908152602091909152604090819020908701356110c0565b909250905061054d6101608601866126d0565b1590506105be57365f6105646101608801886126d0565b915091506040516336745d1081526020808201528160408201528183606083013760208183606401601c84015f8a5af1806001835114166105b95760028816156105b4573d5f6040513e3d604051fd5b60205ffd5b505050505b5f806105c987611106565b91509150816105f557856001165f036105f557604051633ef2c2cd60e21b815260040160405180910390fd5b60c0870135156106085761060887611189565b6001830184555f61064d690100000000007821000160b01b61062d60208b018b6126d0565b604080516020810188905201604051602081830303815290604052611291565b90505f805260205f8251836020015f8a5af161068e576002871615610678573d5f6040513e3d604051fd5b5f5161068957630d93a8fd60e31b5f525b60205ff35b60206060f35b5f688000000000ab143c065c156106b25763ab143c065f526004601cfd5b30688000000000ab143c065d6106c983835f6112ce565b91505f90505b156106f857688000000000ab143c06466001036106ee575f815d6106f2565b8081555b50610705565b5f688000000000ab143c065d5b92915050565b5f6202a3006001600160401b03164201905063389a75e1600c52335f52806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d5f80a250565b6001600160a01b0382165f9081526847a69e8902384d5aa1602090815260408083206001600160c01b0385168452909152808220549083901b67ffffffffffffffff1916175b9392505050565b6060688000000000ab143c065c156107c35763ab143c065f526004601cfd5b30688000000000ab143c065d816001600160401b038111156107e7576107e7612712565b604051908082528060200260200182016040528015610810578160200160208202803683370190505b5090505f5b8281101561087f5761084a84848381811061083257610832612726565b905060200281019061084491906126d0565b5f6112ce565b905082828151811061085e5761085e612726565b6001600160e01b031990921660209283029190910190910152600101610815565b505f6106cf565b63389a75e1600c52335f525f6020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c925f80a2565b5f5a90505f805f6108fc565b6040365f3760405f8351602085015f3086f150505f5160e01c63ffffffff14919050565b63234e352e5f526004601cfd5b60405163ffffffff600482015285876044830137602480870182526bffffffffffffffffffffffff600160fe1b0190820152610938815a6108cb565b610944576109446108ef565b60045192506024519150816109fb57666756657269667960c81b602482015261096d815a6108cb565b610979576109796108ef565b60045161ea6081116201adb002840194505b600160fe1b600486901c90950194851760248301526109aa825a6108cb565b6109b6576109b66108ef565b60245161098b575083600160ff1b1760248201528394505b8460051c850194506109e081866108cb565b156109ee57602451156109f3575b6109ce565b6101f4850194505b5060405163e33c2c7360e01b81526004810185905260248101849052604481018390526001600160e01b03198216606482015260840160405180910390fd5b610a42611546565b610a4d838383611560565b505050565b5f610a88848484604051602001610a6b9392919061273a565b604051602081830303815290604052805190602001208787611583565b6001600160a01b0381165f9081526890c43f55cf16b227d260205260408120919250610ab66001830161160b565b1115610ad557604051632b9a450560e21b815260040160405180910390fd5b80610ae18587836127fd565b50610aef600182018461165c565b5050505050505050565b610b01611546565b610b0a5f6117b8565b565b606080826001600160401b03811115610b2757610b27612712565b604051908082528060200260200182016040528015610b5a57816020015b6060815260200190600190039081610b455790505b509150826001600160401b03811115610b7557610b75612712565b604051908082528060200260200182016040528015610ba857816020015b6060815260200190600190039081610b935790505b5090505f5b83811015610ce2575f6890c43f55cf16b227d25f878785818110610bd357610bd3612726565b9050602002016020810190610be891906126b7565b6001600160a01b03166001600160a01b031681526020019081526020015f209050805f018054610c179061277a565b80601f0160208091040260200160405190810160405280929190818152602001828054610c439061277a565b8015610c8e5780601f10610c6557610100808354040283529160200191610c8e565b820191905f5260205f20905b815481529060010190602001808311610c7157829003601f168201915b5050505050848381518110610ca557610ca5612726565b6020026020010181905250610cbc816001016117f5565b838381518110610cce57610cce612726565b602090810291909101015250600101610bad565b509250929050565b6001600160a01b0382165f9081526890c43f55cf16b227d260205260409020610d1660018201336118c9565b610d33576040516348f5c3ed60e01b815260040160405180910390fd5b610d4060018201836118c9565b15610d5e57604051630ea075bf60e21b815260040160405180910390fd5b610d6b600182018361165c565b50505050565b5f8515610dc5576847a69e8902384d5aa3602052600886901c5f908152604090208054600160ff891681811b9092189283905591901c16610dc55760405163ee3b3d4b60e01b815260040160405180910390fd5b6060841015610dd2575f80fd5b365f610ddf87875f611972565b909250905060208701356040880135365f610dfb8686836119ae565b90925090508135610e0e853383876119d5565b610e188787610694565b9d9c50505050505050505050505050565b600f60f81b6060805f808083610e3d6119fe565b97989097965046955030945091925090565b335f9081526847a69e8902384d5aa160205260409020610e6f9082611a3e565b60405181815233907f1800cd2301fbc20790ed94f3d55a28ef2306a9c31cd3c72b5b71b6e4cf5c62419060200160405180910390a250565b604051818360408301375f8152600260208201525f8060448401601c84015f305af1610ed5573d5f823e3d81fd5b5060405163b70edd5960e01b815260040160405180910390fd5b6001600160a01b0381165f9081526890c43f55cf16b227d260208190526040909120610f1e90600101336118c9565b610f3b576040516348f5c3ed60e01b815260040160405180910390fd5b6001600160a01b0382165f908152602082905260409020610f5f9060010133611aa8565b506001600160a01b0382165f908152602082905260409020610f839060010161160b565b5f03610fb5576001600160a01b0382165f90815260208290526040812090610fab82826121af565b505f600191909101555b5050565b5f81610fc657505f919050565b600882901c5f9081526847a69e8902384d5aa3602052604090205460ff83161c600116610705565b610ff6611546565b63389a75e1600c52805f526020600c20805442111561101c57636f5e88185f526004601cfd5b5f9055611028816117b8565b50565b611033611546565b8060601b61104857637448fbae5f526004601cfd5b611028816117b8565b602460231936016004355f806698a99a8d96998760c81b8301611098575f5a905061108461107f8787611be1565b611106565b5050611090815a900390565b9250506110a9565b6110a38585856112ce565b90925090505b5f195f52816004528060e01c60e01b60245260445ffd5b604081811c5f90815260208490522080546001600160401b038084168214908210166110ff57604051633ab3447f60e11b815260040160405180910390fd5b9250929050565b5f8036816111186101408601866126d0565b90925090505f61112b60208701876126b7565b90505f61113787611c01565b9050604051630cef73b481528160208201526040808201528360608201528385608083013760405f60648601601c8401865afa96505085603f3d111660015f5114169550602051945050505050915091565b60c08101355f61119f60a08401608085016126b7565b90505f6111bb6111af8330611e03565b8481019081105f031790565b90505f6111cb60208601866126b7565b90505f6111ed6111e160808801606089016126b7565b83606082901b15021790565b90508560e001358511156112145760405163abab8fc960e01b815260040160405180910390fd5b6040516356298c9881528460601b60601c60208201523060408201528560608201528260601b60601c60808201526004360380600460a08401375f8082608401601c85015f875af15050508261126a8530611e03565b10156112895760405163abab8fc960e01b815260040160405180910390fd5b505050505050565b606061129e848484611e2d565b905080516064820391506040604483015285602483015263e9ae5c53600483015280606401825250949350505050565b5f80366112db8686611be1565b90505f6001600160601b0385168015610120840135021790505f5a9050620186a082018281105f031760065a603f02901c10156113395760fe86901c6001165f03611339576040516307099c5360e21b815260040160405180910390fd5b60ff86901c1561135257505f935083925061153e915050565b5f61137e61136660808601606087016126b7565b61137360208701876126b7565b606082901b15021790565b905060c084013580156113b657806113a561139f60a08801608089016126b7565b84611e03565b10156113b65763abab8fc960e01b95505b5f86611400576040518a8c60408301375f81528960fe1c60208201525f805260205f60448d01601c84015f308bf19150505f51965080611400578661140057632b536c8960e21b96505b604086013561141260208801886126b7565b6001600160a01b03167f31e2fdd22f7eeca688d70008a7bee8e41aa5640885c2bc592419ae8d09d889f1838a60405161146192919091151582526001600160e01b031916602082015260400190565b60405180910390a3801561153757611479845a900390565b975081156115375761010086013580155f908103909117906114bb8461c3508c018c81108403178085028581049091148515175f190117808218908211021890565b90505f6114dd6114d160c08b0160a08c016126b7565b30606082901b15021790565b9050306001600160a01b0382161415821515161561150f5761150f61150860a08b0160808c016126b7565b8284611560565b818511156115335761153361152a60a08b0160808c016126b7565b87848803611560565b5050505b5050505050505b935093915050565b638b78c6d819543314610b0a576382b429005f526004601cfd5b6001600160a01b03831661157857610a4d8282611e98565b610a4d838383611eb1565b5f604051826040811461159e57604181146115c557506115f6565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526115d6565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d611603575b638baa579f5f526004601cfd5b509392505050565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c1517611654576001935083830154156116545760029350838301541561165457600393505b505050919050565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016116975763f5a267f15f526004601cfd5b826116a95768fbb67fda52d4bfb8bf92505b80546001600160601b038116826020528061176b578160601c806116d7578560601b845560019450506117af565b8581036116e457506117af565b600184015460601c80611705578660601b60018601556001955050506117af565b8681036117135750506117af565b600285015460601c80611735578760601b6002870155600196505050506117af565b878103611744575050506117af565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f2080546117ad57600191821c808301825591945081611799578560601b6003178455506117af565b8560601b82850155826002018455506117af565b505b50505092915050565b638b78c6d81980546001600160a01b039092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a355565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c925083831415830281528161188357821561187e57600191508185015460601c9250821561187e578284141590920260208301525060028381015460601c91821561187e576003915083831415830260408201525b6118b3565b600191821c915b828110156118b1578581015460601c858114158102600583901b840152935060010161188a565b505b8186528160051b81016040525050505050919050565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016119045763f5a267f15f526004601cfd5b826119165768fbb67fda52d4bfb8bf92505b80546001600160601b0381166119595760019250838160601c031561196a57600182015460601c841461196a57600282015460601c841461196a575f925061196a565b81602052835f5260405f2054151592505b505092915050565b828101358084016020810191903590601f198501908682178117831760401c83820183108387111717156119a4575f82fd5b5050935093915050565b828101358084019080840390601f19850190868217811760401c82861117156119a4575f82fd5b6001600160a01b0384166119f2576119ed8282611e98565b610d6b565b610d6b84848484611efb565b604080518082018252600a815269115b9d1c9e541bda5b9d60b21b60208083019190915282518084019093526005835264302e302e3160d81b9083015291565b604081811c5f90815260208490522080546001600160401b0383161015611a78576040516312ee5c9360e01b815260040160405180910390fd5b611aa2611a9c836001600160401b031667fffffffffffffffe808218908211021890565b60010190565b90555050565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be198301611ae35763f5a267f15f526004601cfd5b82611af55768fbb67fda52d4bfb8bf92505b80546001600160601b03811680611b6f5760019350848260601c03611b2d5760018301805484556002840180549091555f90556117af565b84600184015460601c03611b4e5760028301805460018501555f90556117af565b84600284015460601c03611b67575f60028401556117af565b5f93506117af565b82602052845f5260405f20805480611b885750506117af565b60018360011c039250826001820314611bb8578285015460601c8060601b60018303870155805f52508060405f20555b5083546bffffffffffffffffffffffff1916600192831b1782179093555f909255509392505050565b813580830190604081901c602084101715611bfa575f80fd5b5092915050565b5f3681611c19611c1460208601866126d0565b611f54565b604080518281526001830160051b810190915291935091505f5b808314611cd457600581901b8401358401803590602080820135916040810135019081019035611cc485611cb57f84fa2cf05cd88e992eae77e851af68a4ee278dcff6ef504e487a55b3baadfbe56001600160a01b03881687611c968888611fea565b6040805194855260208501939093529183015260608201526080902090565b600190910160051b8801528690565b5050505050806001019050611c33565b5060408051600a8152610160810182527fa4d40a46e03a4a680843fcbc2b3e68b95946b4c85520ac6d413b6b1db1d1c16f60208201529086013560f01c61c1d01490611d2c6001835b600190910160051b8301528190565b50611d576002611d3f60208a018a6126b7565b6001600160a01b0316600190910160051b8301528190565b50825160051b6020840120611d6e90600390611d1d565b50604087013560a0820152611d8e6005611d3f60808a0160608b016126b7565b50611da46006611d3f60a08a0160808b016126b7565b5060e087013561010082015261010087013561012082015261012087013561014082015281611de557805160051b6020820120611de090611ffb565b611df8565b805160051b6020820120611df890612111565b979650505050505050565b5f6001600160a01b038316611e2357506001600160a01b03811631610705565b61079d8383612185565b60606040516064019050833580840360406020840152808287016060850137806040016040840152806060840101915050808303816020018451015b818301518352602083019250808310611e69576020840183038452604036823750506020016040529392505050565b5f385f3884865af1610fb55763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416611ef157803d853b151710611ef1576390b8ec185f526004601cfd5b505f603452505050565b60405181606052826040528360601b602c526323b872dd60601b600c5260205f6064601c5f895af18060015f511416611f4657803d873b151710611f4657637939f4245f526004601cfd5b505f60605260405250505050565b365f833580850160208587010360208201945081359350808460051b8301118360401c1715611f8a5763ba597e7e5f526004601cfd5b8315611fe0578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c1715611fd75763ba597e7e5f526004601cfd5b50505082611f94575b5050509250929050565b5f8183604051375060405120919050565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f00000000000000000000000000000000000000000000000000000000000000004614166120ee5750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f805f61211c6119fe565b915091506040517f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27665f5282516020840120602052815160208301206040523060605260805f206020526119015f52846040526042601e20935080604052505f6060525050919050565b5f816014526370a0823160601b5f5260208060246010865afa601f3d111660205102905092915050565b5080546121bb9061277a565b5f825580601f106121ca575050565b601f0160209004905f5260205f209081019061102891905b808211156121f5575f81556001016121e2565b5090565b5f8083601f840112612209575f80fd5b5081356001600160401b0381111561221f575f80fd5b6020830191508360208285010111156110ff575f80fd5b5f8060208385031215612247575f80fd5b82356001600160401b0381111561225c575f80fd5b612268858286016121f9565b90969095509350505050565b80356001600160a01b038116811461228a575f80fd5b919050565b5f80604083850312156122a0575f80fd5b6122a983612274565b915060208301356001600160c01b03811681146122c4575f80fd5b809150509250929050565b5f8083601f8401126122df575f80fd5b5081356001600160401b038111156122f5575f80fd5b6020830191508360208260051b85010111156110ff575f80fd5b5f8060208385031215612320575f80fd5b82356001600160401b03811115612335575f80fd5b612268858286016122cf565b602080825282518282018190525f918401906040840190835b818110156123825783516001600160e01b03191683526020938401939092019160010161235a565b509095945050505050565b5f805f6060848603121561239f575f80fd5b6123a884612274565b92506123b660208501612274565b929592945050506040919091013590565b5f805f805f606086880312156123db575f80fd5b85356001600160401b038111156123f0575f80fd5b6123fc888289016121f9565b90965094505060208601356001600160401b0381111561241a575f80fd5b612426888289016121f9565b9094509250612439905060408701612274565b90509295509295909350565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b828110156124ca57605f198786030184526124b5858351612445565b94506020938401939190910190600101612499565b50505050828103602084015280845180835260208301915060208160051b840101602087015f5b8381101561255457858303601f19018552815180518085526020918201918501905f5b8181101561253b5783516001600160a01b0316835260209384019390920191600101612514565b50506020968701969094509290920191506001016124f1565b509098975050505050505050565b5f8060408385031215612573575f80fd5b61257c83612274565b915061258a60208401612274565b90509250929050565b5f805f805f606086880312156125a7575f80fd5b8535945060208601356001600160401b038111156125c3575f80fd5b6125cf888289016121f9565b90955093505060408601356001600160401b038111156125ed575f80fd5b6125f9888289016121f9565b969995985093965092949392505050565b60ff60f81b8816815260e060208201525f61262860e0830189612445565b828103604084015261263a8189612445565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b8181101561268f578351835260209384019390920191600101612671565b50909b9a5050505050505050505050565b5f602082840312156126b0575f80fd5b5035919050565b5f602082840312156126c7575f80fd5b61079d82612274565b5f808335601e198436030181126126e5575f80fd5b8301803591506001600160401b038211156126fe575f80fd5b6020019150368190038213156110ff575f80fd5b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52603260045260245ffd5b60408152826040820152828460608301375f60608483018101919091526001600160a01b03929092166020820152601f909201601f191690910101919050565b600181811c9082168061278e57607f821691505b6020821081036127ac57634e487b7160e01b5f52602260045260245ffd5b50919050565b601f821115610a4d57805f5260205f20601f840160051c810160208510156127d75750805b601f840160051c820191505b818110156127f6575f81556001016127e3565b5050505050565b6001600160401b0383111561281457612814612712565b61282883612822835461277a565b836127b2565b5f601f841160018114612859575f85156128425750838201355b5f19600387901b1c1916600186901b1783556127f6565b5f83815260208120601f198716915b828110156128885786850135825560209485019460019092019101612868565b50868210156128a4575f1960f88860031b161c19848701351681555b505060018560011b018355505050505056fea2646970667358221220b145831978a737b5bcc9e2cba5603cba7235a2b50acfd1e33c2cf76fe88e17d264736f6c634300081a0033" as const;


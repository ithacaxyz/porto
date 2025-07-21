export const abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_funder",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_orchestrator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
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
    "name": "fund",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "digest",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "transfers",
        "type": "tuple[]",
        "internalType": "struct ICommon.Transfer[]",
        "components": [
          {
            "name": "token",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "funderSignature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "funder",
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
    "name": "gasWallets",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
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
    "name": "nonces",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
    "name": "pullGas",
    "inputs": [
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
    "name": "setFunder",
    "inputs": [
      {
        "name": "newFunder",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setGasWallet",
    "inputs": [
      {
        "name": "wallets",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "isGasWallet",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
    "type": "function",
    "name": "withdrawTokensWithSignature",
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
      },
      {
        "name": "deadline",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
    "type": "error",
    "name": "AlreadyInitialized",
    "inputs": []
  },
  {
    "type": "error",
    "name": "DeadlineExpired",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidFunderSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidNonce",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidWithdrawalSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NewOwnerIsZeroAddress",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NoHandoverRequest",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OnlyGasWallet",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OnlyOrchestrator",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Unauthorized",
    "inputs": []
  }
] as const;

export const code = "0x610140604052348015610010575f5ffd5b506040516111bd3803806111bd83398101604081905261002f9161016e565b306080524660a05260608061007f604080518082018252600c81526b29b4b6b83632a33ab73232b960a11b60208083019190915282518084019093526005835264302e312e3160d81b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250505f80546001600160a01b0319166001600160a01b038581169190911790915582166101205261011081610118565b5050506101ae565b6001600160a01b0316638b78c6d819819055805f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08180a350565b80516001600160a01b0381168114610169575f5ffd5b919050565b5f5f5f60608486031215610180575f5ffd5b61018984610153565b925061019760208501610153565b91506101a560408501610153565b90509250925092565b60805160a05160c05160e0516101005161012051610fc16101fc5f395f81816102b0015261054b01525f61080e01525f6108c801525f6108a201525f61085201525f61082f0152610fc15ff3fe608060405260043610610108575f3560e01c806384b0196e11610092578063c885f95a11610062578063c885f95a1461029f578063f04e283e146102d2578063f2fde38b146102e5578063fc361cb5146102f8578063fee81cf414610326575f5ffd5b806384b0196e146102225780638da5cb5b14610249578063aa6a57c714610261578063bc83e85114610280575f5ffd5b806325692962116100d857806325692962146101cc5780633a046959146101d457806354d1f13d146101f35780635e35359e146101fb578063715018a61461021a575f5ffd5b8063041ae880146101135780630acc8cd11461014e5780631297bad61461016f578063141a468c1461018e575f5ffd5b3661010f57005b5f5ffd5b34801561011e575f5ffd5b505f54610131906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b348015610159575f5ffd5b5061016d610168366004610ae2565b610365565b005b34801561017a575f5ffd5b5061016d610189366004610afb565b61038e565b348015610199575f5ffd5b506101bc6101a8366004610ba6565b60026020525f908152604090205460ff1681565b6040519015158152602001610145565b61016d6104f3565b3480156101df575f5ffd5b5061016d6101ee366004610cba565b610540565b61016d61062c565b348015610206575f5ffd5b5061016d610215366004610dc0565b610665565b61016d61067d565b34801561022d575f5ffd5b50610236610690565b6040516101459796959493929190610e28565b348015610254575f5ffd5b50638b78c6d81954610131565b34801561026c575f5ffd5b5061016d61027b366004610ecd565b6106f3565b34801561028b575f5ffd5b5061016d61029a366004610ba6565b610755565b3480156102aa575f5ffd5b506101317f000000000000000000000000000000000000000000000000000000000000000081565b61016d6102e0366004610ae2565b610792565b61016d6102f3366004610ae2565b6107cc565b348015610303575f5ffd5b506101bc610312366004610ae2565b60016020525f908152604090205460ff1681565b348015610331575f5ffd5b50610357610340366004610ae2565b63389a75e1600c9081525f91909152602090205490565b604051908152602001610145565b61036d6107f2565b5f80546001600160a01b0319166001600160a01b0392909216919091179055565b5f8381526002602052604090205460ff16156103bd57604051633ab3447f60e11b815260040160405180910390fd5b834211156103de57604051631ab7da6b60e01b815260040160405180910390fd5b604080517fb8ad6c296cb3f339f49ca8ddb6cbd07a7e70787b9236d1e5917014ad241a097960208201526001600160a01b03808a169282019290925290871660608201526080810186905260a0810185905260c081018490525f9061045b9060e0016040516020818303038152906040528051906020012061080c565b90506104a961046d638b78c6d8195490565b8285858080601f0160208091040260200160405190810160405280939291908181526020018383808284375f9201919091525061092292505050565b6104c657604051635f3b6d9360e01b815260040160405180910390fd5b5f848152600260205260409020805460ff191660011790556104e9888888610a00565b5050505050505050565b5f6202a30067ffffffffffffffff164201905063389a75e1600c52335f52806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d5f5fa250565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146105895760405163de23df5d60e01b815260040160405180910390fd5b5f80546105a0906001600160a01b03168584610922565b905060013331016105af575060015b806105cd5760405163ee3af24f60e01b815260040160405180910390fd5b5f5b83518110156106245761061c8482815181106105ed576105ed610f77565b60200260200101515f01518786848151811061060b5761060b610f77565b602002602001015160200151610a00565b6001016105cf565b505050505050565b63389a75e1600c52335f525f6020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c925f5fa2565b61066d6107f2565b610678838383610a00565b505050565b6106856107f2565b61068e5f610a23565b565b600f60f81b6060805f8080836106e1604080518082018252600c81526b29b4b6b83632a33ab73232b960a11b60208083019190915282518084019093526005835264302e312e3160d81b9083015291565b97989097965046955030945091925090565b6106fb6107f2565b5f5b8251811015610678578160015f85848151811061071c5761071c610f77565b6020908102919091018101516001600160a01b031682528101919091526040015f20805460ff19169115159190911790556001016106fd565b335f9081526001602052604090205460ff166107845760405163022cc82d60e21b815260040160405180910390fd5b61078f5f3383610a00565b50565b61079a6107f2565b63389a75e1600c52805f526020600c2080544211156107c057636f5e88185f526004601cfd5b5f905561078f81610a23565b6107d46107f2565b8060601b6107e957637448fbae5f526004601cfd5b61078f81610a23565b638b78c6d81954331461068e576382b429005f526004601cfd5b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f00000000000000000000000000000000000000000000000000000000000000004614166108ff5750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f6001600160a01b038416156109f957604051843b6109b757825160408114610953576041811461097457506109f7565b604084015160ff81901c601b016020526001600160ff1b0316606052610987565b60608401515f1a60205260408401516060525b50835f5260208301516040526020600160805f60015afa5180861860601b3d119250505f606052806040526109f7565b631626ba7e60e01b808252846004830152602482016040815284516020018060448501828860045afa905060208260443d01868b5afa9151911691141691505b505b9392505050565b6001600160a01b038316610a18576106788282610a60565b610678838383610a7d565b638b78c6d81980546001600160a01b039092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a355565b5f385f3884865af1610a795763b12d13eb5f526004601cfd5b5050565b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416610abd57803d853b151710610abd576390b8ec185f526004601cfd5b505f603452505050565b80356001600160a01b0381168114610add575f5ffd5b919050565b5f60208284031215610af2575f5ffd5b6109f982610ac7565b5f5f5f5f5f5f5f60c0888a031215610b11575f5ffd5b610b1a88610ac7565b9650610b2860208901610ac7565b955060408801359450606088013593506080880135925060a088013567ffffffffffffffff811115610b58575f5ffd5b8801601f81018a13610b68575f5ffd5b803567ffffffffffffffff811115610b7e575f5ffd5b8a6020828401011115610b8f575f5ffd5b602082019350809250505092959891949750929550565b5f60208284031215610bb6575f5ffd5b5035919050565b634e487b7160e01b5f52604160045260245ffd5b6040805190810167ffffffffffffffff81118282101715610bf457610bf4610bbd565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610c2357610c23610bbd565b604052919050565b5f67ffffffffffffffff821115610c4457610c44610bbd565b5060051b60200190565b5f82601f830112610c5d575f5ffd5b813567ffffffffffffffff811115610c7757610c77610bbd565b610c8a601f8201601f1916602001610bfa565b818152846020838601011115610c9e575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f5f5f5f60808587031215610ccd575f5ffd5b610cd685610ac7565b935060208501359250604085013567ffffffffffffffff811115610cf8575f5ffd5b8501601f81018713610d08575f5ffd5b8035610d1b610d1682610c2b565b610bfa565b8082825260208201915060208360061b850101925089831115610d3c575f5ffd5b6020840193505b82841015610d8a576040848b031215610d5a575f5ffd5b610d62610bd1565b610d6b85610ac7565b8152602085810135818301529083526040909401939190910190610d43565b9450505050606085013567ffffffffffffffff811115610da8575f5ffd5b610db487828801610c4e565b91505092959194509250565b5f5f5f60608486031215610dd2575f5ffd5b610ddb84610ac7565b9250610de960208501610ac7565b929592945050506040919091013590565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b60ff60f81b8816815260e060208201525f610e4660e0830189610dfa565b8281036040840152610e588189610dfa565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b81811015610ead578351835260209384019390920191600101610e8f565b50909b9a5050505050505050505050565b80358015158114610add575f5ffd5b5f5f60408385031215610ede575f5ffd5b823567ffffffffffffffff811115610ef4575f5ffd5b8301601f81018513610f04575f5ffd5b8035610f12610d1682610c2b565b8082825260208201915060208360051b850101925087831115610f33575f5ffd5b6020840193505b82841015610f5c57610f4b84610ac7565b825260209384019390910190610f3a565b9450610f6e9250505060208401610ebe565b90509250929050565b634e487b7160e01b5f52603260045260245ffdfea264697066735822122039844ebcb8108d247be3117d7e353c94eaff20ee9b0e1d34f471cc1f5c18811464736f6c634300081d0033" as const;


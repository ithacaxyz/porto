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
        "name": "",
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
    "name": "fund",
    "inputs": [
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
    "name": "orchestrators",
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
    "name": "setOrchestrators",
    "inputs": [
      {
        "name": "ocs",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "val",
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
    "name": "usedDigests",
    "inputs": [
      {
        "name": "",
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
    "name": "DigestUsed",
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

export const code = "0x610120604052348015610010575f5ffd5b5060405161142f38038061142f83398101604081905261002f91610162565b306080524660a05260608061007f604080518082018252600c81526b29b4b6b83632a33ab73232b960a11b602080830191909152825180840190935260058352640605c625c760db1b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a090206101005250505f80546001600160a01b0319166001600160a01b0384161790556101058161010c565b5050610193565b6001600160a01b0316638b78c6d819819055805f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08180a350565b80516001600160a01b038116811461015d575f5ffd5b919050565b5f5f60408385031215610173575f5ffd5b61017c83610147565b915061018a60208401610147565b90509250929050565b60805160a05160c05160e0516101005161125f6101d05f395f610a4301525f610afd01525f610ad701525f610a8701525f610a64015261125f5ff3fe608060405260043610610129575f3560e01c806384b0196e116100a8578063d39c4de71161006d578063d39c4de71461030d578063dd16ec871461033b578063f04e283e1461035a578063f2fde38b1461036d578063fc361cb514610380578063fee81cf4146103ae575f5ffd5b806384b0196e1461027157806388a8251e146102985780638da5cb5b146102b7578063aa6a57c7146102cf578063bc83e851146102ee575f5ffd5b80633a046959116100ee5780633a046959146101f557806354d1f13d146102145780635e35359e1461021c578063715018a61461023b5780637f63602514610243575f5ffd5b8063041ae880146101345780630acc8cd11461016f5780631297bad614610190578063141a468c146101af57806325692962146101ed575f5ffd5b3661013057005b5f5ffd5b34801561013f575f5ffd5b505f54610152906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b34801561017a575f5ffd5b5061018e610189366004610d17565b6103ed565b005b34801561019b575f5ffd5b5061018e6101aa366004610d30565b610416565b3480156101ba575f5ffd5b506101dd6101c9366004610ddb565b60026020525f908152604090205460ff1681565b6040519015158152602001610166565b61018e61057b565b348015610200575f5ffd5b5061018e61020f366004610f85565b6105c8565b61018e6105d9565b348015610227575f5ffd5b5061018e610236366004611003565b610612565b61018e61062a565b34801561024e575f5ffd5b506101dd61025d366004610d17565b60036020525f908152604090205460ff1681565b34801561027c575f5ffd5b5061028561063d565b604051610166979695949392919061106b565b3480156102a3575f5ffd5b5061018e6102b2366004611110565b6106a0565b3480156102c2575f5ffd5b50638b78c6d81954610152565b3480156102da575f5ffd5b5061018e6102e9366004611110565b610702565b3480156102f9575f5ffd5b5061018e610308366004610ddb565b610764565b348015610318575f5ffd5b506101dd610327366004610ddb565b60046020525f908152604090205460ff1681565b348015610346575f5ffd5b5061018e6103553660046111ba565b6107a1565b61018e610368366004610d17565b6109c7565b61018e61037b366004610d17565b610a01565b34801561038b575f5ffd5b506101dd61039a366004610d17565b60016020525f908152604090205460ff1681565b3480156103b9575f5ffd5b506103df6103c8366004610d17565b63389a75e1600c9081525f91909152602090205490565b604051908152602001610166565b6103f5610a27565b5f80546001600160a01b0319166001600160a01b0392909216919091179055565b5f8381526002602052604090205460ff161561044557604051633ab3447f60e11b815260040160405180910390fd5b8342111561046657604051631ab7da6b60e01b815260040160405180910390fd5b604080517fb8ad6c296cb3f339f49ca8ddb6cbd07a7e70787b9236d1e5917014ad241a097960208201526001600160a01b03808a169282019290925290871660608201526080810186905260a0810185905260c081018490525f906104e39060e00160405160208183030381529060405280519060200120610a41565b90506105316104f5638b78c6d8195490565b8285858080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250610b5792505050565b61054e57604051635f3b6d9360e01b815260040160405180910390fd5b5f848152600260205260409020805460ff19166001179055610571888888610c35565b5050505050505050565b5f6202a30067ffffffffffffffff164201905063389a75e1600c52335f52806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d5f5fa250565b6105d38383836107a1565b50505050565b63389a75e1600c52335f525f6020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c925f5fa2565b61061a610a27565b610625838383610c35565b505050565b610632610a27565b61063b5f610c58565b565b600f60f81b6060805f80808361068e604080518082018252600c81526b29b4b6b83632a33ab73232b960a11b602080830191909152825180840190935260058352640605c625c760db1b9083015291565b97989097965046955030945091925090565b6106a8610a27565b5f5b8251811015610625578160035f8584815181106106c9576106c9611227565b6020908102919091018101516001600160a01b031682528101919091526040015f20805460ff19169115159190911790556001016106aa565b61070a610a27565b5f5b8251811015610625578160015f85848151811061072b5761072b611227565b6020908102919091018101516001600160a01b031682528101919091526040015f20805460ff191691151591909117905560010161070c565b335f9081526001602052604090205460ff166107935760405163022cc82d60e21b815260040160405180910390fd5b61079e5f3383610c35565b50565b335f9081526003602052604090205460ff166107d05760405163de23df5d60e01b815260040160405180910390fd5b5f8381526004602052604090205460ff16156107ff57604051632b02a8ad60e11b815260040160405180910390fd5b5f838152600460205260408120805460ff19166001179055805461082d906001600160a01b03168584610b57565b90506001600160c01b03323110610842575060015b806108605760405163ee3af24f60e01b815260040160405180910390fd5b82515f9081908590829061087657610876611227565b60200260200101515f01516001600160a01b03160361090e575f336001600160a01b0316855f815181106108ac576108ac611227565b6020026020010151602001516040515f6040518083038185875af1925050503d805f81146108f5576040519150601f19603f3d011682016040523d82523d5f602084013e6108fa565b606091505b5050905081806109099061123b565b925050505b83518110156109c0575f84828151811061092a5761092a611227565b60200260200101515f015190505f85838151811061094a5761094a611227565b602002602001015160200151905060405163dd62ed3e81523060208201523360408201525f5f5260205f6044601c84015f875af1505f51808311156109b15763095ea7b382523360208301526001600160a81b0360408301525f5f6044601c85015f885af1505b5050505080600101905061090e565b5050505050565b6109cf610a27565b63389a75e1600c52805f526020600c2080544211156109f557636f5e88185f526004601cfd5b5f905561079e81610c58565b610a09610a27565b8060601b610a1e57637448fbae5f526004601cfd5b61079e81610c58565b638b78c6d81954331461063b576382b429005f526004601cfd5b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f0000000000000000000000000000000000000000000000000000000000000000461416610b345750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f6001600160a01b03841615610c2e57604051843b610bec57825160408114610b885760418114610ba95750610c2c565b604084015160ff81901c601b016020526001600160ff1b0316606052610bbc565b60608401515f1a60205260408401516060525b50835f5260208301516040526020600160805f60015afa5180861860601b3d119250505f60605280604052610c2c565b631626ba7e60e01b808252846004830152602482016040815284516020018060448501828860045afa905060208260443d01868b5afa9151911691141691505b505b9392505050565b6001600160a01b038316610c4d576106258282610c95565b610625838383610cb2565b638b78c6d81980546001600160a01b039092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a355565b5f385f3884865af1610cae5763b12d13eb5f526004601cfd5b5050565b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416610cf257803d853b151710610cf2576390b8ec185f526004601cfd5b505f603452505050565b80356001600160a01b0381168114610d12575f5ffd5b919050565b5f60208284031215610d27575f5ffd5b610c2e82610cfc565b5f5f5f5f5f5f5f60c0888a031215610d46575f5ffd5b610d4f88610cfc565b9650610d5d60208901610cfc565b955060408801359450606088013593506080880135925060a088013567ffffffffffffffff811115610d8d575f5ffd5b8801601f81018a13610d9d575f5ffd5b803567ffffffffffffffff811115610db3575f5ffd5b8a6020828401011115610dc4575f5ffd5b602082019350809250505092959891949750929550565b5f60208284031215610deb575f5ffd5b5035919050565b634e487b7160e01b5f52604160045260245ffd5b6040805190810167ffffffffffffffff81118282101715610e2957610e29610df2565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610e5857610e58610df2565b604052919050565b5f67ffffffffffffffff821115610e7957610e79610df2565b5060051b60200190565b5f82601f830112610e92575f5ffd5b8135610ea5610ea082610e60565b610e2f565b8082825260208201915060208360061b860101925085831115610ec6575f5ffd5b602085015b83811015610f0f5760408188031215610ee2575f5ffd5b610eea610e06565b610ef382610cfc565b8152602082810135818301529084529290920191604001610ecb565b5095945050505050565b5f82601f830112610f28575f5ffd5b813567ffffffffffffffff811115610f4257610f42610df2565b610f55601f8201601f1916602001610e2f565b818152846020838601011115610f69575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f5f5f5f60808587031215610f98575f5ffd5b610fa185610cfc565b935060208501359250604085013567ffffffffffffffff811115610fc3575f5ffd5b610fcf87828801610e83565b925050606085013567ffffffffffffffff811115610feb575f5ffd5b610ff787828801610f19565b91505092959194509250565b5f5f5f60608486031215611015575f5ffd5b61101e84610cfc565b925061102c60208501610cfc565b929592945050506040919091013590565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b60ff60f81b8816815260e060208201525f61108960e083018961103d565b828103604084015261109b818961103d565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b818110156110f05783518352602093840193909201916001016110d2565b50909b9a5050505050505050505050565b80358015158114610d12575f5ffd5b5f5f60408385031215611121575f5ffd5b823567ffffffffffffffff811115611137575f5ffd5b8301601f81018513611147575f5ffd5b8035611155610ea082610e60565b8082825260208201915060208360051b850101925087831115611176575f5ffd5b6020840193505b8284101561119f5761118e84610cfc565b82526020938401939091019061117d565b94506111b19250505060208401611101565b90509250929050565b5f5f5f606084860312156111cc575f5ffd5b83359250602084013567ffffffffffffffff8111156111e9575f5ffd5b6111f586828701610e83565b925050604084013567ffffffffffffffff811115611211575f5ffd5b61121d86828701610f19565b9150509250925092565b634e487b7160e01b5f52603260045260245ffd5b5f6001820161125857634e487b7160e01b5f52601160045260245ffd5b506001019056" as const;


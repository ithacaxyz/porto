export const abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      }
    ],
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
  },
  {
    "type": "function",
    "name": "settled",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
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
    "name": "write",
    "inputs": [
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
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "write",
    "inputs": [
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
        "name": "chainId",
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
    "type": "event",
    "name": "Sent",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "settlementId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "receiverChainId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
    "name": "InvalidSettlementSignature",
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
    "name": "Unauthorized",
    "inputs": []
  }
] as const;

export const code = "0x610120604052348015610010575f5ffd5b50604051610cd6380380610cd683398101604081905261002f9161012e565b306080524660a052606080610080604080518082018252600d81526c29b4b6b83632a9b2ba3a3632b960991b60208083019190915282518084019093526005835264181718971960d91b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a0902061010052506100ed9050816100f3565b5061015b565b6001600160a01b0316638b78c6d819819055805f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08180a350565b5f6020828403121561013e575f5ffd5b81516001600160a01b0381168114610154575f5ffd5b9392505050565b60805160a05160c05160e05161010051610b3e6101985f395f61061201525f6106cc01525f6106a601525f61065601525f6106330152610b3e5ff3fe6080604052600436106100bf575f3560e01c8063715018a61161007c5780638da5cb5b116100575780638da5cb5b146101c7578063f04e283e146101f2578063f2fde38b14610205578063fee81cf414610218575f5ffd5b8063715018a61461017957806384523a301461018157806384b0196e146101a0575f5ffd5b80631945237a146100c357806325692962146100e45780634fdf7085146100ec57806354d1f13d146100ff578063586a609414610107578063665749dd1461013b575b5f5ffd5b3480156100ce575f5ffd5b506100e26100dd36600461081e565b610257565b005b6100e2610292565b6100e26100fa366004610893565b6102df565b6100e2610365565b348015610112575f5ffd5b506101266101213660046108db565b61039e565b60405190151581526020015b60405180910390f35b348015610146575f5ffd5b506101266101553660046108db565b5f602081815293815260408082208552928152828120909352825290205460ff1681565b6100e26103d1565b34801561018c575f5ffd5b506100e261019b36600461090e565b6103e4565b3480156101ab575f5ffd5b506101b46104f2565b604051610132979695949392919061099f565b3480156101d2575f5ffd5b50638b78c6d819546040516001600160a01b039091168152602001610132565b6100e2610200366004610a35565b610556565b6100e2610213366004610a35565b610593565b348015610223575f5ffd5b50610249610232366004610a35565b63389a75e1600c9081525f91909152602090205490565b604051908152602001610132565b61025f6105b9565b5f918252602082815260408084206001600160a01b0390951684529381528383209183525220805460ff19166001179055565b5f6202a30067ffffffffffffffff164201905063389a75e1600c52335f52806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d5f5fa250565b5f6102ec82840184610a62565b90505f5b815181101561035e5784336001600160a01b03167f52f98d9cd05b904d19a1e162baec7dfe23848626128315ee94832701b8ac6ec384848151811061033757610337610b2a565b602002602001015160405161034e91815260200190565b60405180910390a36001016102f0565b5050505050565b63389a75e1600c52335f525f6020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c925f5fa2565b5f838152602081815260408083206001600160a01b0386168452825280832084845290915290205460ff165b9392505050565b6103d96105b9565b6103e25f6105d3565b565b604080517fe86d8f4007184db478927a1b63b0a046c3f888b6b81eb323e306221b81c8733c60208201526001600160a01b0387169181019190915260608101859052608081018490525f906104519060a00160405160208183030381529060405280519060200120610610565b905061049f610463638b78c6d8195490565b8285858080601f0160208091040260200160405190810160405280939291908181526020018383808284375f9201919091525061072692505050565b6104bc5760405163734b928960e11b815260040160405180910390fd5b5050505f918252602082815260408084206001600160a01b0390951684529381528383209183525220805460ff19166001179055565b600f60f81b6060805f808083610544604080518082018252600d81526c29b4b6b83632a9b2ba3a3632b960991b60208083019190915282518084019093526005835264181718971960d91b9083015291565b97989097965046955030945091925090565b61055e6105b9565b63389a75e1600c52805f526020600c20805442111561058457636f5e88185f526004601cfd5b5f9055610590816105d3565b50565b61059b6105b9565b8060601b6105b057637448fbae5f526004601cfd5b610590816105d3565b638b78c6d8195433146103e2576382b429005f526004601cfd5b638b78c6d81980546001600160a01b039092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a355565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f00000000000000000000000000000000000000000000000000000000000000004614166107035750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b5f6001600160a01b038416156103ca57604051843b6107bb57825160408114610757576041811461077857506107fb565b604084015160ff81901c601b016020526001600160ff1b031660605261078b565b60608401515f1a60205260408401516060525b50835f5260208301516040526020600160805f60015afa5180861860601b3d119250505f606052806040526107fb565b631626ba7e60e01b808252846004830152602482016040815284516020018060448501828860045afa905060208260443d01868b5afa9151911691141691505b509392505050565b80356001600160a01b0381168114610819575f5ffd5b919050565b5f5f5f60608486031215610830575f5ffd5b61083984610803565b95602085013595506040909401359392505050565b5f5f83601f84011261085e575f5ffd5b50813567ffffffffffffffff811115610875575f5ffd5b60208301915083602082850101111561088c575f5ffd5b9250929050565b5f5f5f604084860312156108a5575f5ffd5b83359250602084013567ffffffffffffffff8111156108c2575f5ffd5b6108ce8682870161084e565b9497909650939450505050565b5f5f5f606084860312156108ed575f5ffd5b833592506108fd60208501610803565b929592945050506040919091013590565b5f5f5f5f5f60808688031215610922575f5ffd5b61092b86610803565b94506020860135935060408601359250606086013567ffffffffffffffff811115610954575f5ffd5b6109608882890161084e565b969995985093965092949392505050565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b60ff60f81b8816815260e060208201525f6109bd60e0830189610971565b82810360408401526109cf8189610971565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b81811015610a24578351835260209384019390920191600101610a06565b50909b9a5050505050505050505050565b5f60208284031215610a45575f5ffd5b6103ca82610803565b634e487b7160e01b5f52604160045260245ffd5b5f60208284031215610a72575f5ffd5b813567ffffffffffffffff811115610a88575f5ffd5b8201601f81018413610a98575f5ffd5b803567ffffffffffffffff811115610ab257610ab2610a4e565b8060051b604051601f19603f830116810181811067ffffffffffffffff82111715610adf57610adf610a4e565b604052918252602081840181019290810187841115610afc575f5ffd5b6020850194505b83851015610b1f57843580825260209586019590935001610b03565b509695505050505050565b634e487b7160e01b5f52603260045260245ffd" as const;


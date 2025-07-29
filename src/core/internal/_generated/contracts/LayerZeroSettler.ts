export const abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_endpoint",
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
    "name": "allowInitializePath",
    "inputs": [
      {
        "name": "origin",
        "type": "tuple",
        "internalType": "struct Origin",
        "components": [
          {
            "name": "srcEid",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "sender",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "nonce",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
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
    "name": "assignJob",
    "inputs": [
      {
        "name": "",
        "type": "uint32",
        "internalType": "uint32"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "combineOptions",
    "inputs": [
      {
        "name": "_eid",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "_msgType",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "_extraOptions",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
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
    "name": "endpoint",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract ILayerZeroEndpointV2"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "enforcedOptions",
    "inputs": [
      {
        "name": "eid",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "msgType",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "outputs": [
      {
        "name": "enforcedOption",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "executeSend",
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
    "name": "getFee",
    "inputs": [
      {
        "name": "",
        "type": "uint32",
        "internalType": "uint32"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isComposeMsgSender",
    "inputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Origin",
        "components": [
          {
            "name": "srcEid",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "sender",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "nonce",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_sender",
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
    "name": "lzReceive",
    "inputs": [
      {
        "name": "_origin",
        "type": "tuple",
        "internalType": "struct Origin",
        "components": [
          {
            "name": "srcEid",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "sender",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "nonce",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      },
      {
        "name": "_guid",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_message",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_executor",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_extraData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "nextNonce",
    "inputs": [
      {
        "name": "",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "nonce",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "oAppVersion",
    "inputs": [],
    "outputs": [
      {
        "name": "senderVersion",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "receiverVersion",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "owner",
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
    "name": "peers",
    "inputs": [
      {
        "name": "eid",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "outputs": [
      {
        "name": "peer",
        "type": "bytes32",
        "internalType": "bytes32"
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
        "name": "sender",
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
    "stateMutability": "nonpayable"
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
    "name": "setDelegate",
    "inputs": [
      {
        "name": "_delegate",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setEnforcedOptions",
    "inputs": [
      {
        "name": "_enforcedOptions",
        "type": "tuple[]",
        "internalType": "struct EnforcedOptionParam[]",
        "components": [
          {
            "name": "eid",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "msgType",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "options",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setPeer",
    "inputs": [
      {
        "name": "_eid",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "_peer",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "validSend",
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
    "name": "withdraw",
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
    "name": "EnforcedOptionSet",
    "inputs": [
      {
        "name": "_enforcedOptions",
        "type": "tuple[]",
        "indexed": false,
        "internalType": "struct EnforcedOptionParam[]",
        "components": [
          {
            "name": "eid",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "msgType",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "options",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
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
    "name": "PeerSet",
    "inputs": [
      {
        "name": "eid",
        "type": "uint32",
        "indexed": false,
        "internalType": "uint32"
      },
      {
        "name": "peer",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Settled",
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
        "name": "senderChainId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "InsufficientFee",
    "inputs": [
      {
        "name": "provided",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "required",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidDelegate",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidEndpointCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidEndpointId",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidOptions",
    "inputs": [
      {
        "name": "options",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidSettlementId",
    "inputs": []
  },
  {
    "type": "error",
    "name": "LzTokenUnavailable",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NoPeer",
    "inputs": [
      {
        "name": "eid",
        "type": "uint32",
        "internalType": "uint32"
      }
    ]
  },
  {
    "type": "error",
    "name": "NotEnoughNative",
    "inputs": [
      {
        "name": "msgValue",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "OnlyEndpoint",
    "inputs": [
      {
        "name": "addr",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OnlyPeer",
    "inputs": [
      {
        "name": "eid",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "sender",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "SafeERC20FailedOperation",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const;

export const code = "0x60a060405234801561000f575f5ffd5b50604051611fc4380380611fc483398101604081905261002e91610166565b81818181806001600160a01b03811661006057604051631e4fbdf760e01b81525f600482015260240160405180910390fd5b610069816100fc565b506001600160a01b03808316608052811661009757604051632d618d8160e21b815260040160405180910390fd5b60805160405163ca5eb5e160e01b81526001600160a01b0383811660048301529091169063ca5eb5e1906024015f604051808303815f87803b1580156100db575f5ffd5b505af11580156100ed573d5f5f3e3d5ffd5b50505050505050505050610197565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b0381168114610161575f5ffd5b919050565b5f5f60408385031215610177575f5ffd5b6101808361014b565b915061018e6020840161014b565b90509250929050565b608051611deb6101d95f395f818161026d0152818161052401528181610a4701528181610c1601528181610d020152818161100401526110bb0152611deb5ff3fe60806040526004361061014a575f3560e01c8063717e8a42116100b3578063bb0b6a531161006d578063bb0b6a531461045c578063bc70b35414610487578063ca5eb5e1146104a6578063d9caed12146104c5578063f2fde38b146104e4578063ff7bd03d14610503575f5ffd5b8063717e8a42146103145780637d25a05e1461035a57806382413eac1461039357806384b0196e146103b25780638da5cb5b14610421578063b98bd0701461043d575f5ffd5b8063586a609411610104578063586a6094146102015780635e280f111461025c578063665749dd146102a75780636f0e1a9a146102e6578063709eb66414610314578063715018a614610346575f5ffd5b806313137d651461015557806317442b701461016a5780632e34723b146101905780633400288b146101a35780634fdf7085146101c25780635535d461146101d5575f5ffd5b3661015157005b5f5ffd5b6101686101633660046112bd565b610522565b005b348015610175575f5ffd5b50604080516001815260026020820152015b60405180910390f35b61016861019e366004611357565b6105e2565b3480156101ae575f5ffd5b506101686101bd3660046113c6565b610731565b6101686101d03660046113ee565b610747565b3480156101e0575f5ffd5b506101f46101ef366004611446565b61079b565b60405161018791906114a5565b34801561020c575f5ffd5b5061024c61021b3660046114be565b5f9283526003602090815260408085206001600160a01b039490941685529281528284209184525290205460ff1690565b6040519015158152602001610187565b348015610267575f5ffd5b5061028f7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610187565b3480156102b2575f5ffd5b5061024c6102c13660046114be565b600360209081525f938452604080852082529284528284209052825290205460ff1681565b3480156102f1575f5ffd5b5061024c6103003660046114f3565b60046020525f908152604090205460ff1681565b34801561031f575f5ffd5b5061033861032e36600461150a565b5f95945050505050565b604051908152602001610187565b348015610351575f5ffd5b5061016861083d565b348015610365575f5ffd5b5061037b6103743660046113c6565b5f92915050565b6040516001600160401b039091168152602001610187565b34801561039e575f5ffd5b5061024c6103ad366004611575565b610850565b3480156103bd575f5ffd5b50604080518082018252601081526f2630bcb2b92d32b937a9b2ba3a3632b960811b602080830191909152825180840184526005815264302e302e3160d81b8183015283515f8082529281019485905261018794600f60f81b9493469230926115d7565b34801561042c575f5ffd5b505f546001600160a01b031661028f565b348015610448575f5ffd5b5061016861045736600461166d565b610865565b348015610467575f5ffd5b506103386104763660046116dc565b60016020525f908152604090205481565b348015610492575f5ffd5b506101f46104a13660046116f5565b61087f565b3480156104b1575f5ffd5b506101686104c0366004611739565b610a20565b3480156104d0575f5ffd5b506101686104df366004611754565b610aa1565b3480156104ef575f5ffd5b506101686104fe366004611739565b610ab9565b34801561050e575f5ffd5b5061024c61051d366004611781565b610af6565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03163314610572576040516391ac5e4f60e01b81523360048201526024015b60405180910390fd5b6020870180359061058c90610587908a6116dc565b610b2a565b146105ca5761059e60208801886116dc565b60405163309afaf360e21b815263ffffffff909116600482015260208801356024820152604401610569565b6105d987878787878787610b6b565b50505050505050565b60045f858585856040516020016105fc94939291906117c3565b60408051601f198184030181529181528151602092830120835290820192909252015f205460ff1661064157604051630523e26360e11b815260040160405180910390fd5b5f61064e82840184611882565b60408051602081018790526001600160a01b038816918101919091524660608201529091505f9060800160408051601f1981840301815282820190915260028252600360f01b602083015291505f5b8351811015610727575f8482815181106106b9576106b9611914565b602002602001015190508063ffffffff165f036106e957604051637dbc055960e11b815260040160405180910390fd5b5f6106f68286865f610c01565b905061071c8286866040518060400160405280865f015181526020015f81525033610cdf565b50505060010161069d565b5050505050505050565b610739610dd7565b6107438282610e03565b5050565b600160045f3386868660405160200161076394939291906117c3565b60408051808303601f190181529181528151602092830120835290820192909252015f20805460ff1916911515919091179055505050565b600260209081525f9283526040808420909152908252902080546107be90611928565b80601f01602080910402602001604051908101604052809291908181526020018280546107ea90611928565b80156108355780601f1061080c57610100808354040283529160200191610835565b820191905f5260205f20905b81548152906001019060200180831161081857829003601f168201915b505050505081565b610845610dd7565b61084e5f610e57565b565b6001600160a01b03811630145b949350505050565b61086d610dd7565b61074361087a828461195a565b610ea6565b63ffffffff84165f90815260026020908152604080832061ffff871684529091528120805460609291906108b290611928565b80601f01602080910402602001604051908101604052809291908181526020018280546108de90611928565b80156109295780601f1061090057610100808354040283529160200191610929565b820191905f5260205f20905b81548152906001019060200180831161090c57829003601f168201915b5050505050905080515f036109775783838080601f0160208091040260200160405190810160405280939291908181526020018383808284375f9201919091525092945061085d9350505050565b5f83900361098657905061085d565b60028310610a03576109cc84848080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250610fb292505050565b806109da8460028188611a7d565b6040516020016109ec93929190611aa4565b60405160208183030381529060405291505061085d565b8383604051639a6d49cd60e01b8152600401610569929190611ac8565b610a28610dd7565b60405163ca5eb5e160e01b81526001600160a01b0382811660048301527f0000000000000000000000000000000000000000000000000000000000000000169063ca5eb5e1906024015f604051808303815f87803b158015610a88575f5ffd5b505af1158015610a9a573d5f5f3e3d5ffd5b5050505050565b610aa9610dd7565b610ab4838383610fde565b505050565b610ac1610dd7565b6001600160a01b038116610aea57604051631e4fbdf760e01b81525f6004820152602401610569565b610af381610e57565b50565b5f602082018035906001908390610b0d90866116dc565b63ffffffff16815260208101919091526040015f20541492915050565b63ffffffff81165f9081526001602052604081205480610b655760405163f6ff4fb760e01b815263ffffffff84166004820152602401610569565b92915050565b5f8080610b7a878901896114be565b5f8381526003602090815260408083206001600160a01b03861680855290835281842085855290925291829020805460ff191660011790559051939650919450925084917f8ec0095f0a0abbc8db397cd5246942293ac1a755825eba51c0ca828ec2102b6490610bed9085815260200190565b60405180910390a350505050505050505050565b604080518082019091525f80825260208201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663ddc28c586040518060a001604052808863ffffffff168152602001610c6389610b2a565b8152602001878152602001868152602001851515815250306040518363ffffffff1660e01b8152600401610c98929190611adb565b6040805180830381865afa158015610cb2573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610cd69190611b9f565b95945050505050565b610ce761120f565b8251602084015115610d0057610d008460200151611001565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632637a450826040518060a001604052808b63ffffffff168152602001610d508c610b2a565b81526020018a81526020018981526020015f8960200151111515815250866040518463ffffffff1660e01b8152600401610d8b929190611adb565b60806040518083038185885af1158015610da7573d5f5f3e3d5ffd5b50505050506040513d601f19601f82011682018060405250810190610dcc9190611bb9565b979650505050505050565b5f546001600160a01b0316331461084e5760405163118cdaa760e01b8152336004820152602401610569565b63ffffffff82165f81815260016020908152604091829020849055815192835282018390527f238399d427b947898edb290f5ff0f9109849b1c3ba196a42e35f00c50a54b98b910160405180910390a15050565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b5f5b8151811015610f7757610ed7828281518110610ec657610ec6611914565b602002602001015160400151610fb2565b818181518110610ee957610ee9611914565b60200260200101516040015160025f848481518110610f0a57610f0a611914565b60200260200101515f015163ffffffff1663ffffffff1681526020019081526020015f205f848481518110610f4157610f41611914565b60200260200101516020015161ffff1661ffff1681526020019081526020015f209081610f6e9190611c52565b50600101610ea8565b507fbe4864a8e820971c0247f5992e2da559595f7bf076a21cb5928d443d2a13b67481604051610fa79190611d0c565b60405180910390a150565b600281015161ffff81166003146107435781604051639a6d49cd60e01b815260040161056991906114a5565b6001600160a01b038316610ff657610ab482826110e0565b610ab48383836110f9565b5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663e4fe1d946040518163ffffffff1660e01b8152600401602060405180830381865afa15801561105e573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906110829190611d9a565b90506001600160a01b0381166110ab576040516329b99a9560e11b815260040160405180910390fd5b6107436001600160a01b038216337f000000000000000000000000000000000000000000000000000000000000000085611143565b5f385f3884865af16107435763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f51141661113957803d853b151710611139576390b8ec185f526004601cfd5b505f603452505050565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b17905261119d9085906111a3565b50505050565b5f5f60205f8451602086015f885af1806111c2576040513d5f823e3d81fd5b50505f513d915081156111d95780600114156111e6565b6001600160a01b0384163b155b1561119d57604051635274afe760e01b81526001600160a01b0385166004820152602401610569565b60405180606001604052805f81526020015f6001600160401b0316815260200161124a60405180604001604052805f81526020015f81525090565b905290565b5f6060828403121561125f575f5ffd5b50919050565b5f5f83601f840112611275575f5ffd5b5081356001600160401b0381111561128b575f5ffd5b6020830191508360208285010111156112a2575f5ffd5b9250929050565b6001600160a01b0381168114610af3575f5ffd5b5f5f5f5f5f5f5f60e0888a0312156112d3575f5ffd5b6112dd898961124f565b96506060880135955060808801356001600160401b038111156112fe575f5ffd5b61130a8a828b01611265565b90965094505060a088013561131e816112a9565b925060c08801356001600160401b03811115611338575f5ffd5b6113448a828b01611265565b989b979a50959850939692959293505050565b5f5f5f5f6060858703121561136a575f5ffd5b8435611375816112a9565b93506020850135925060408501356001600160401b03811115611396575f5ffd5b6113a287828801611265565b95989497509550505050565b803563ffffffff811681146113c1575f5ffd5b919050565b5f5f604083850312156113d7575f5ffd5b6113e0836113ae565b946020939093013593505050565b5f5f5f60408486031215611400575f5ffd5b8335925060208401356001600160401b0381111561141c575f5ffd5b61142886828701611265565b9497909650939450505050565b803561ffff811681146113c1575f5ffd5b5f5f60408385031215611457575f5ffd5b611460836113ae565b915061146e60208401611435565b90509250929050565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b602081525f6114b76020830184611477565b9392505050565b5f5f5f606084860312156114d0575f5ffd5b8335925060208401356114e2816112a9565b929592945050506040919091013590565b5f60208284031215611503575f5ffd5b5035919050565b5f5f5f5f5f6080868803121561151e575f5ffd5b611527866113ae565b94506020860135611537816112a9565b93506040860135925060608601356001600160401b03811115611558575f5ffd5b61156488828901611265565b969995985093965092949392505050565b5f5f5f5f60a08587031215611588575f5ffd5b611592868661124f565b935060608501356001600160401b038111156115ac575f5ffd5b6115b887828801611265565b90945092505060808501356115cc816112a9565b939692955090935050565b60ff60f81b8816815260e060208201525f6115f560e0830189611477565b82810360408401526116078189611477565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b8181101561165c57835183526020938401939092019160010161163e565b50909b9a5050505050505050505050565b5f5f6020838503121561167e575f5ffd5b82356001600160401b03811115611693575f5ffd5b8301601f810185136116a3575f5ffd5b80356001600160401b038111156116b8575f5ffd5b8560208260051b84010111156116cc575f5ffd5b6020919091019590945092505050565b5f602082840312156116ec575f5ffd5b6114b7826113ae565b5f5f5f5f60608587031215611708575f5ffd5b611711856113ae565b935061171f60208601611435565b925060408501356001600160401b03811115611396575f5ffd5b5f60208284031215611749575f5ffd5b81356114b7816112a9565b5f5f5f60608486031215611766575f5ffd5b8335611771816112a9565b925060208401356114e2816112a9565b5f60608284031215611791575f5ffd5b6114b7838361124f565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b60018060a01b0385168152836020820152606060408201525f6117ea60608301848661179b565b9695505050505050565b634e487b7160e01b5f52604160045260245ffd5b604051606081016001600160401b038111828210171561182a5761182a6117f4565b60405290565b604051601f8201601f191681016001600160401b0381118282101715611858576118586117f4565b604052919050565b5f6001600160401b03821115611878576118786117f4565b5060051b60200190565b5f60208284031215611892575f5ffd5b81356001600160401b038111156118a7575f5ffd5b8201601f810184136118b7575f5ffd5b80356118ca6118c582611860565b611830565b8082825260208201915060208360051b8501019250868311156118eb575f5ffd5b6020840193505b828410156117ea57611903846113ae565b8252602093840193909101906118f2565b634e487b7160e01b5f52603260045260245ffd5b600181811c9082168061193c57607f821691505b60208210810361125f57634e487b7160e01b5f52602260045260245ffd5b5f6119676118c584611860565b8381526020810190600585901b840136811115611982575f5ffd5b845b81811015611a725780356001600160401b038111156119a1575f5ffd5b860160603682900312156119b3575f5ffd5b6119bb611808565b6119c4826113ae565b81526119d260208301611435565b602082015260408201356001600160401b038111156119ef575f5ffd5b919091019036601f830112611a02575f5ffd5b81356001600160401b03811115611a1b57611a1b6117f4565b611a2e601f8201601f1916602001611830565b818152366020838601011115611a42575f5ffd5b816020850160208301375f6020838301015280604084015250508086525050602084019350602081019050611984565b509095945050505050565b5f5f85851115611a8b575f5ffd5b83861115611a97575f5ffd5b5050820193919092039150565b5f84518060208701845e5f908301908152838582375f930192835250909392505050565b602081525f61085d60208301848661179b565b6040815263ffffffff8351166040820152602083015160608201525f604084015160a06080840152611b1060e0840182611477565b90506060850151603f198483030160a0850152611b2d8282611477565b60809690960151151560c08501525050506001600160a01b039190911660209091015290565b5f60408284031215611b63575f5ffd5b604080519081016001600160401b0381118282101715611b8557611b856117f4565b604052825181526020928301519281019290925250919050565b5f60408284031215611baf575f5ffd5b6114b78383611b53565b5f6080828403128015611bca575f5ffd5b50611bd3611808565b8251815260208301516001600160401b0381168114611bf0575f5ffd5b6020820152611c028460408501611b53565b60408201529392505050565b601f821115610ab457805f5260205f20601f840160051c81016020851015611c335750805b601f840160051c820191505b81811015610a9a575f8155600101611c3f565b81516001600160401b03811115611c6b57611c6b6117f4565b611c7f81611c798454611928565b84611c0e565b6020601f821160018114611cb1575f8315611c9a5750848201515b5f19600385901b1c1916600184901b178455610a9a565b5f84815260208120601f198516915b82811015611ce05787850151825560209485019460019092019101611cc0565b5084821015611cfd57868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b5f602082016020835280845180835260408501915060408160051b8601019250602086015f5b82811015611d8e57603f19878603018452815163ffffffff815116865261ffff60208201511660208701526040810151905060606040870152611d786060870182611477565b9550506020938401939190910190600101611d32565b50929695505050505050565b5f60208284031215611daa575f5ffd5b81516114b7816112a956fea26469706673582212207edfc06d9b9d0b582cfab8f33fe304beaf2e53f4c69f4794ec970811caf2b10b64736f6c634300081d0033" as const;


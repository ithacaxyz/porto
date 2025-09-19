export const abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_l0SettlerSigner",
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
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "computeExecuteSendDigest",
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
      },
      {
        "name": "signature",
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
    "stateMutability": "pure"
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
    "name": "l0SettlerSigner",
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
        "name": "_eid",
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
    "name": "setEndpoint",
    "inputs": [
      {
        "name": "_endpoint",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setL0SettlerSigner",
    "inputs": [
      {
        "name": "newL0SettlerSigner",
        "type": "address",
        "internalType": "address"
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
    "name": "InvalidL0SettlerSignature",
    "inputs": []
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

export const code = "0x610120604052348015610010575f5ffd5b50604051611bf5380380611bf583398101604081905261002f916101e2565b8180806001600160a01b03811661005f57604051631e4fbdf760e01b81525f600482015260240160405180910390fd5b61006881610178565b506001600160a01b03811661009057604051632d618d8160e21b815260040160405180910390fd5b61009981610178565b5050306080524660a0526060806100ef604080518082018252601081526f2630bcb2b92d32b937a9b2ba3a3632b960811b60208083019190915282518084019093526005835264302e312e3160d81b9083015291565b815160209283012081519183019190912060c082905260e0819052604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8152938401929092529082015246606082015230608082015260a09020610100525050600580546001600160a01b0319166001600160a01b039290921691909117905550610213565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b03811681146101dd575f5ffd5b919050565b5f5f604083850312156101f3575f5ffd5b6101fc836101c7565b915061020a602084016101c7565b90509250929050565b60805160a05160c05160e051610100516119a56102505f395f610e8601525f610f4001525f610f1a01525f610eca01525f610ea701526119a55ff3fe608060405260043610610164575f3560e01c80637d25a05e116100cd578063bb0b6a5311610087578063dbbb415511610062578063dbbb41551461044d578063f2fde38b1461046c578063ff7bd03d1461048b578063ffe3c8eb146104aa575f5ffd5b8063bb0b6a53146103f0578063ca5eb5e11461040f578063d9caed121461042e575f5ffd5b80637d25a05e146103085780638069edd21461034157806382413eac1461036057806384b0196e1461038e57806386f2a60d146103b55780638da5cb5b146103d4575f5ffd5b80635e280f111161011e5780635e280f111461021e578063665749dd146102555780636f0e1a9a14610294578063709eb664146102c2578063715018a6146102f4578063717e8a42146102c2575f5ffd5b806313137d651461016f57806317442b70146101845780633400288b146101aa57806347e98ff7146101c95780634fdf7085146101dc578063586a6094146101ef575f5ffd5b3661016b57005b5f5ffd5b61018261017d36600461124a565b6104c9565b005b34801561018f575f5ffd5b50604080516001815260026020820152015b60405180910390f35b3480156101b5575f5ffd5b506101826101c43660046112fc565b610566565b6101826101d7366004611324565b61057c565b6101826101ea3660046113ad565b610791565b3480156101fa575f5ffd5b5061020e6102093660046113f4565b6107e5565b60405190151581526020016101a1565b348015610229575f5ffd5b5060015461023d906001600160a01b031681565b6040516001600160a01b0390911681526020016101a1565b348015610260575f5ffd5b5061020e61026f3660046113f4565b600360209081525f938452604080852082529284528284209052825290205460ff1681565b34801561029f575f5ffd5b5061020e6102ae366004611429565b60046020525f908152604090205460ff1681565b3480156102cd575f5ffd5b506102e66102dc366004611440565b5f95945050505050565b6040519081526020016101a1565b3480156102ff575f5ffd5b5061018261081a565b348015610313575f5ffd5b506103296103223660046112fc565b5f92915050565b6040516001600160401b0390911681526020016101a1565b34801561034c575f5ffd5b506102e661035b3660046114ef565b61082d565b34801561036b575f5ffd5b5061020e61037a36600461159c565b6001600160a01b0381163014949350505050565b348015610399575f5ffd5b506103a26108b1565b6040516101a1979695949392919061162c565b3480156103c0575f5ffd5b5060055461023d906001600160a01b031681565b3480156103df575f5ffd5b505f546001600160a01b031661023d565b3480156103fb575f5ffd5b506102e661040a3660046116c2565b503090565b34801561041a575f5ffd5b506101826104293660046116db565b610918565b348015610439575f5ffd5b506101826104483660046116f6565b6109a7565b348015610458575f5ffd5b506101826104673660046116db565b6109bf565b348015610477575f5ffd5b506101826104863660046116db565b610a2d565b348015610496575f5ffd5b5061020e6104a5366004611723565b610a6a565b3480156104b5575f5ffd5b506101826104c43660046116db565b610a8b565b6001546001600160a01b031633146104fb576040516391ac5e4f60e01b81523360048201526024015b60405180910390fd5b602087018035906105109061040a908a6116c2565b1461054e5761052260208801886116c2565b60405163309afaf360e21b815263ffffffff9091166004820152602088013560248201526044016104f2565b61055d87878787878787610ab5565b50505050505050565b61056e610b4b565b6105788282610b77565b5050565b5f86868686604051602001610594949392919061173d565b60408051601f1981840301815291815281516020928301205f818152600490935291205490915060ff166105db57604051630523e26360e11b815260040160405180910390fd5b5f61061c888888888080601f0160208091040260200160405190810160405280939291908181526020018383808284375f9201919091525061082d92505050565b600554604080516020601f880181900481028201810190925286815292935061066c926001600160a01b0390921691849188908890819084018382808284375f92019190915250610bcb92505050565b61068957604051633d7bbe2360e01b815260040160405180910390fd5b5f828152600460205260408120805460ff191690556106aa86880188611784565b60408051602081018b90526001600160a01b038c16918101919091524660608201529091505f9060800160408051601f1981840301815282820190915260028252600360f01b602083015291505f5b8351811015610783575f84828151811061071557610715611826565b602002602001015190508063ffffffff165f0361074557604051637dbc055960e11b815260040160405180910390fd5b5f6107528286865f610ca8565b90506107788286866040518060400160405280865f015181526020015f81525033610d62565b5050506001016106f9565b505050505050505050505050565b600160045f338686866040516020016107ad949392919061173d565b60408051808303601f190181529181528151602092830120835290820192909252015f20805460ff1916911515919091179055505050565b5f8381526003602090815260408083206001600160a01b0386168452825280832084845290915290205460ff165b9392505050565b610822610b4b565b61082b5f610e35565b565b5f6108a97f868cb391c50a3311dbd1a7d91a9d3f79813b9dc47fbdfa4598dc0070a3b3ab518585858051906020012060405160200161088e94939291909384526001600160a01b039290921660208401526040830152606082015260800190565b60405160208183030381529060405280519060200120610e84565b949350505050565b600f60f81b6060805f808083610906604080518082018252601081526f2630bcb2b92d32b937a9b2ba3a3632b960811b60208083019190915282518084019093526005835264302e312e3160d81b9083015291565b97989097965046955030945091925090565b610920610b4b565b6001546001600160a01b031661094957604051632d618d8160e21b815260040160405180910390fd5b60015460405163ca5eb5e160e01b81526001600160a01b0383811660048301529091169063ca5eb5e1906024015b5f604051808303815f87803b15801561098e575f5ffd5b505af11580156109a0573d5f5f3e3d5ffd5b5050505050565b6109af610b4b565b6109ba838383610f9a565b505050565b6109c7610b4b565b6001600160a01b0381166109ee57604051632d618d8160e21b815260040160405180910390fd5b600180546001600160a01b0319166001600160a01b03831690811790915560405163ca5eb5e160e01b815233600482015263ca5eb5e190602401610977565b610a35610b4b565b6001600160a01b038116610a5e57604051631e4fbdf760e01b81525f60048201526024016104f2565b610a6781610e35565b50565b5f80610a7c61040a60208501856116c2565b60209093013590921492915050565b610a93610b4b565b600580546001600160a01b0319166001600160a01b0392909216919091179055565b5f8080610ac4878901896113f4565b5f8381526003602090815260408083206001600160a01b03861680855290835281842085855290925291829020805460ff191660011790559051939650919450925084917f8ec0095f0a0abbc8db397cd5246942293ac1a755825eba51c0ca828ec2102b6490610b379085815260200190565b60405180910390a350505050505050505050565b5f546001600160a01b0316331461082b5760405163118cdaa760e01b81523360048201526024016104f2565b63ffffffff82165f81815260026020908152604091829020849055815192835282018390527f238399d427b947898edb290f5ff0f9109849b1c3ba196a42e35f00c50a54b98b910160405180910390a15050565b5f6001600160a01b0384161561081357604051843b610c6057825160408114610bfc5760418114610c1d5750610ca0565b604084015160ff81901c601b016020526001600160ff1b0316606052610c30565b60608401515f1a60205260408401516060525b50835f5260208301516040526020600160805f60015afa5180861860601b3d119250505f60605280604052610ca0565b631626ba7e60e01b808252846004830152602482016040815284516020018060448501828860045afa905060208260443d01868b5afa9151911691141691505b509392505050565b6040805180820182525f808252602080830191909152600154835160a08101855263ffffffff89168152309281018390528085018890526060810187905285151560808201529351631bb8518b60e31b815292936001600160a01b039091169263ddc28c5892610d1b929160040161183a565b6040805180830381865afa158015610d35573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610d5991906118fe565b95945050505050565b610d6a61119c565b8251602084015115610d8357610d838460200151610fbd565b6001546040805160a08101825263ffffffff8a168152306020808301919091528183018a9052606082018990528701511515608082015290516302637a4560e41b81526001600160a01b0390921691632637a450918491610de99190889060040161183a565b60806040518083038185885af1158015610e05573d5f5f3e3d5ffd5b50505050506040513d601f19601f82011682018060405250810190610e2a9190611918565b979650505050505050565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f0000000000000000000000000000000000000000000000000000000000000000461416610f775750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b6719010000000000005f5280601a5281603a52604260182090505f603a52919050565b6001600160a01b038316610fb2576109ba828261106d565b6109ba838383611086565b6001546040805163393f876560e21b815290515f926001600160a01b03169163e4fe1d949160048083019260209291908290030181865afa158015611004573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611028919061198a565b90506001600160a01b038116611051576040516329b99a9560e11b815260040160405180910390fd5b600154610578906001600160a01b0383811691339116856110d0565b5f385f3884865af16105785763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f5114166110c657803d853b1517106110c6576390b8ec185f526004601cfd5b505f603452505050565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b17905261112a908590611130565b50505050565b5f5f60205f8451602086015f885af18061114f576040513d5f823e3d81fd5b50505f513d91508115611166578060011415611173565b6001600160a01b0384163b155b1561112a57604051635274afe760e01b81526001600160a01b03851660048201526024016104f2565b60405180606001604052805f81526020015f6001600160401b031681526020016111d760405180604001604052805f81526020015f81525090565b905290565b5f606082840312156111ec575f5ffd5b50919050565b5f5f83601f840112611202575f5ffd5b5081356001600160401b03811115611218575f5ffd5b60208301915083602082850101111561122f575f5ffd5b9250929050565b6001600160a01b0381168114610a67575f5ffd5b5f5f5f5f5f5f5f60e0888a031215611260575f5ffd5b61126a89896111dc565b96506060880135955060808801356001600160401b0381111561128b575f5ffd5b6112978a828b016111f2565b90965094505060a08801356112ab81611236565b925060c08801356001600160401b038111156112c5575f5ffd5b6112d18a828b016111f2565b989b979a50959850939692959293505050565b803563ffffffff811681146112f7575f5ffd5b919050565b5f5f6040838503121561130d575f5ffd5b611316836112e4565b946020939093013593505050565b5f5f5f5f5f5f60808789031215611339575f5ffd5b863561134481611236565b95506020870135945060408701356001600160401b03811115611365575f5ffd5b61137189828a016111f2565b90955093505060608701356001600160401b0381111561138f575f5ffd5b61139b89828a016111f2565b979a9699509497509295939492505050565b5f5f5f604084860312156113bf575f5ffd5b8335925060208401356001600160401b038111156113db575f5ffd5b6113e7868287016111f2565b9497909650939450505050565b5f5f5f60608486031215611406575f5ffd5b83359250602084013561141881611236565b929592945050506040919091013590565b5f60208284031215611439575f5ffd5b5035919050565b5f5f5f5f5f60808688031215611454575f5ffd5b61145d866112e4565b9450602086013561146d81611236565b93506040860135925060608601356001600160401b0381111561148e575f5ffd5b61149a888289016111f2565b969995985093965092949392505050565b634e487b7160e01b5f52604160045260245ffd5b604051601f8201601f191681016001600160401b03811182821017156114e7576114e76114ab565b604052919050565b5f5f5f60608486031215611501575f5ffd5b833561150c81611236565b92506020840135915060408401356001600160401b0381111561152d575f5ffd5b8401601f8101861361153d575f5ffd5b80356001600160401b03811115611556576115566114ab565b611569601f8201601f19166020016114bf565b81815287602083850101111561157d575f5ffd5b816020840160208301375f602083830101528093505050509250925092565b5f5f5f5f60a085870312156115af575f5ffd5b6115b986866111dc565b935060608501356001600160401b038111156115d3575f5ffd5b6115df878288016111f2565b90945092505060808501356115f381611236565b939692955090935050565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b60ff60f81b8816815260e060208201525f61164a60e08301896115fe565b828103604084015261165c81896115fe565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b818110156116b1578351835260209384019390920191600101611693565b50909b9a5050505050505050505050565b5f602082840312156116d2575f5ffd5b610813826112e4565b5f602082840312156116eb575f5ffd5b813561081381611236565b5f5f5f60608486031215611708575f5ffd5b833561171381611236565b9250602084013561141881611236565b5f60608284031215611733575f5ffd5b61081383836111dc565b6001600160a01b0385168152602081018490526060604082018190528101829052818360808301375f818301608090810191909152601f909201601f191601019392505050565b5f60208284031215611794575f5ffd5b81356001600160401b038111156117a9575f5ffd5b8201601f810184136117b9575f5ffd5b80356001600160401b038111156117d2576117d26114ab565b8060051b6117e2602082016114bf565b918252602081840181019290810190878411156117fd575f5ffd5b6020850194505b83851015610e2a57611815856112e4565b825260209485019490910190611804565b634e487b7160e01b5f52603260045260245ffd5b6040815263ffffffff8351166040820152602083015160608201525f604084015160a0608084015261186f60e08401826115fe565b90506060850151603f198483030160a085015261188c82826115fe565b60809690960151151560c08501525050506001600160a01b039190911660209091015290565b5f604082840312156118c2575f5ffd5b604080519081016001600160401b03811182821017156118e4576118e46114ab565b604052825181526020928301519281019290925250919050565b5f6040828403121561190e575f5ffd5b61081383836118b2565b5f6080828403128015611929575f5ffd5b50604051606081016001600160401b038111828210171561194c5761194c6114ab565b6040528251815260208301516001600160401b038116811461196c575f5ffd5b602082015261197e84604085016118b2565b60408201529392505050565b5f6020828403121561199a575f5ffd5b81516108138161123656" as const;


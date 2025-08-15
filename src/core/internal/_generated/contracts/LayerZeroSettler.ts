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
    "stateMutability": "nonpayable"
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

export const code = "0x60a060405234801561000f575f80fd5b5060405161172f38038061172f83398101604081905261002e91610166565b81818181806001600160a01b03811661006057604051631e4fbdf760e01b81525f600482015260240160405180910390fd5b610069816100fc565b506001600160a01b03808316608052811661009757604051632d618d8160e21b815260040160405180910390fd5b60805160405163ca5eb5e160e01b81526001600160a01b0383811660048301529091169063ca5eb5e1906024015f604051808303815f87803b1580156100db575f80fd5b505af11580156100ed573d5f803e3d5ffd5b50505050505050505050610197565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b0381168114610161575f80fd5b919050565b5f8060408385031215610177575f80fd5b6101808361014b565b915061018e6020840161014b565b90509250929050565b6080516115566101d95f395f8181610220015281816104a8015281816107590152818161092b01528181610a1701528181610be10152610c9801526115565ff3fe608060405260043610610129575f3560e01c8063715018a6116100a85780638da5cb5b1161006d5780638da5cb5b146103e3578063bb0b6a53146103ff578063ca5eb5e11461042a578063d9caed1214610449578063f2fde38b14610468578063ff7bd03d14610487575f80fd5b8063715018a6146102f9578063717e8a42146102c75780637d25a05e1461030d57806382413eac1461034657806384b0196e14610374575f80fd5b8063586a6094116100ee578063586a6094146101b45780635e280f111461020f578063665749dd1461025a5780636f0e1a9a14610299578063709eb664146102c7575f80fd5b806313137d651461013457806317442b70146101495780632e34723b1461016f5780633400288b146101825780634fdf7085146101a1575f80fd5b3661013057005b5f80fd5b610147610142366004610e9d565b6104a6565b005b348015610154575f80fd5b50604080516001815260026020820152015b60405180910390f35b61014761017d366004610f37565b610566565b34801561018d575f80fd5b5061014761019c366004610fa6565b6106b5565b6101476101af366004610fce565b6106cb565b3480156101bf575f80fd5b506101ff6101ce366004611015565b5f9283526002602090815260408085206001600160a01b039490941685529281528284209184525290205460ff1690565b6040519015158152602001610166565b34801561021a575f80fd5b506102427f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610166565b348015610265575f80fd5b506101ff610274366004611015565b600260209081525f938452604080852082529284528284209052825290205460ff1681565b3480156102a4575f80fd5b506101ff6102b336600461104a565b60036020525f908152604090205460ff1681565b3480156102d2575f80fd5b506102eb6102e1366004611061565b5f95945050505050565b604051908152602001610166565b348015610304575f80fd5b5061014761071f565b348015610318575f80fd5b5061032e610327366004610fa6565b5f92915050565b6040516001600160401b039091168152602001610166565b348015610351575f80fd5b506101ff6103603660046110cc565b6001600160a01b0381163014949350505050565b34801561037f575f80fd5b50604080518082018252601081526f2630bcb2b92d32b937a9b2ba3a3632b960811b602080830191909152825180840184526005815264302e302e3160d81b8183015283515f8082529281019485905261016694600f60f81b94934692309261115c565b3480156103ee575f80fd5b505f546001600160a01b0316610242565b34801561040a575f80fd5b506102eb6104193660046111f2565b60016020525f908152604090205481565b348015610435575f80fd5b50610147610444366004611212565b610732565b348015610454575f80fd5b5061014761046336600461122d565b6107b3565b348015610473575f80fd5b50610147610482366004611212565b6107cb565b348015610492575f80fd5b506101ff6104a136600461125a565b610808565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031633146104f6576040516391ac5e4f60e01b81523360048201526024015b60405180910390fd5b602087018035906105109061050b908a6111f2565b610858565b1461054e5761052260208801886111f2565b60405163309afaf360e21b815263ffffffff9091166004820152602088013560248201526044016104ed565b61055d87878787878787610880565b50505050505050565b60035f858585856040516020016105809493929190611274565b60408051601f198184030181529181528151602092830120835290820192909252015f205460ff166105c557604051630523e26360e11b815260040160405180910390fd5b5f6105d2828401846112ff565b60408051602081018790526001600160a01b038816918101919091524660608201529091505f9060800160408051601f1981840301815282820190915260028252600360f01b602083015291505f5b83518110156106ab575f84828151811061063d5761063d6113a1565b602002602001015190508063ffffffff165f0361066d57604051637dbc055960e11b815260040160405180910390fd5b5f61067a8286865f610916565b90506106a08286866040518060400160405280865f015181526020015f815250336109f4565b505050600101610621565b5050505050505050565b6106bd610aec565b6106c78282610b18565b5050565b600160035f338686866040516020016106e79493929190611274565b60408051808303601f190181529181528151602092830120835290820192909252015f20805460ff1916911515919091179055505050565b610727610aec565b6107305f610b6c565b565b61073a610aec565b60405163ca5eb5e160e01b81526001600160a01b0382811660048301527f0000000000000000000000000000000000000000000000000000000000000000169063ca5eb5e1906024015f604051808303815f87803b15801561079a575f80fd5b505af11580156107ac573d5f803e3d5ffd5b5050505050565b6107bb610aec565b6107c6838383610bbb565b505050565b6107d3610aec565b6001600160a01b0381166107fc57604051631e4fbdf760e01b81525f60048201526024016104ed565b61080581610b6c565b50565b5f8060018161081a60208601866111f2565b63ffffffff16815260208101919091526040015f205490508061084a5761084761050b60208501856111f2565b90505b602090920135909114919050565b63ffffffff81165f908152600160205260408120548061087a57503092915050565b92915050565b5f808061088f87890189611015565b5f8381526002602090815260408083206001600160a01b03861680855290835281842085855290925291829020805460ff191660011790559051939650919450925084917f8ec0095f0a0abbc8db397cd5246942293ac1a755825eba51c0ca828ec2102b64906109029085815260200190565b60405180910390a350505050505050505050565b604080518082019091525f80825260208201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663ddc28c586040518060a001604052808863ffffffff16815260200161097889610858565b8152602001878152602001868152602001851515815250306040518363ffffffff1660e01b81526004016109ad9291906113b5565b6040805180830381865afa1580156109c7573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906109eb9190611479565b95945050505050565b6109fc610dec565b8251602084015115610a1557610a158460200151610bde565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632637a450826040518060a001604052808b63ffffffff168152602001610a658c610858565b81526020018a81526020018981526020015f8960200151111515815250866040518463ffffffff1660e01b8152600401610aa09291906113b5565b60806040518083038185885af1158015610abc573d5f803e3d5ffd5b50505050506040513d601f19601f82011682018060405250810190610ae19190611493565b979650505050505050565b5f546001600160a01b031633146107305760405163118cdaa760e01b81523360048201526024016104ed565b63ffffffff82165f81815260016020908152604091829020849055815192835282018390527f238399d427b947898edb290f5ff0f9109849b1c3ba196a42e35f00c50a54b98b910160405180910390a15050565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b038316610bd3576107c68282610cbd565b6107c6838383610cd6565b5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663e4fe1d946040518163ffffffff1660e01b8152600401602060405180830381865afa158015610c3b573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610c5f9190611505565b90506001600160a01b038116610c88576040516329b99a9560e11b815260040160405180910390fd5b6106c76001600160a01b038216337f000000000000000000000000000000000000000000000000000000000000000085610d20565b5f385f3884865af16106c75763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416610d1657803d853b151710610d16576390b8ec185f526004601cfd5b505f603452505050565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b179052610d7a908590610d80565b50505050565b5f8060205f8451602086015f885af180610d9f576040513d5f823e3d81fd5b50505f513d91508115610db6578060011415610dc3565b6001600160a01b0384163b155b15610d7a57604051635274afe760e01b81526001600160a01b03851660048201526024016104ed565b60405180606001604052805f80191681526020015f6001600160401b03168152602001610e2a60405180604001604052805f81526020015f81525090565b905290565b5f60608284031215610e3f575f80fd5b50919050565b5f8083601f840112610e55575f80fd5b5081356001600160401b03811115610e6b575f80fd5b602083019150836020828501011115610e82575f80fd5b9250929050565b6001600160a01b0381168114610805575f80fd5b5f805f805f805f60e0888a031215610eb3575f80fd5b610ebd8989610e2f565b96506060880135955060808801356001600160401b03811115610ede575f80fd5b610eea8a828b01610e45565b90965094505060a0880135610efe81610e89565b925060c08801356001600160401b03811115610f18575f80fd5b610f248a828b01610e45565b989b979a50959850939692959293505050565b5f805f8060608587031215610f4a575f80fd5b8435610f5581610e89565b93506020850135925060408501356001600160401b03811115610f76575f80fd5b610f8287828801610e45565b95989497509550505050565b803563ffffffff81168114610fa1575f80fd5b919050565b5f8060408385031215610fb7575f80fd5b610fc083610f8e565b946020939093013593505050565b5f805f60408486031215610fe0575f80fd5b8335925060208401356001600160401b03811115610ffc575f80fd5b61100886828701610e45565b9497909650939450505050565b5f805f60608486031215611027575f80fd5b83359250602084013561103981610e89565b929592945050506040919091013590565b5f6020828403121561105a575f80fd5b5035919050565b5f805f805f60808688031215611075575f80fd5b61107e86610f8e565b9450602086013561108e81610e89565b93506040860135925060608601356001600160401b038111156110af575f80fd5b6110bb88828901610e45565b969995985093965092949392505050565b5f805f8060a085870312156110df575f80fd5b6110e98686610e2f565b935060608501356001600160401b03811115611103575f80fd5b61110f87828801610e45565b909450925050608085013561112381610e89565b939692955090935050565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b60ff60f81b8816815260e060208201525f61117a60e083018961112e565b828103604084015261118c818961112e565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b818110156111e15783518352602093840193909201916001016111c3565b50909b9a5050505050505050505050565b5f60208284031215611202575f80fd5b61120b82610f8e565b9392505050565b5f60208284031215611222575f80fd5b813561120b81610e89565b5f805f6060848603121561123f575f80fd5b833561124a81610e89565b9250602084013561103981610e89565b5f6060828403121561126a575f80fd5b61120b8383610e2f565b6001600160a01b0385168152602081018490526060604082018190528101829052818360808301375f818301608090810191909152601f909201601f191601019392505050565b634e487b7160e01b5f52604160045260245ffd5b604051601f8201601f191681016001600160401b03811182821017156112f7576112f76112bb565b604052919050565b5f6020828403121561130f575f80fd5b81356001600160401b03811115611324575f80fd5b8201601f81018413611334575f80fd5b80356001600160401b0381111561134d5761134d6112bb565b8060051b61135d602082016112cf565b91825260208184018101929081019087841115611378575f80fd5b6020850194505b83851015610ae15761139085610f8e565b82526020948501949091019061137f565b634e487b7160e01b5f52603260045260245ffd5b6040815263ffffffff8351166040820152602083015160608201525f604084015160a060808401526113ea60e084018261112e565b90506060850151603f198483030160a0850152611407828261112e565b60809690960151151560c08501525050506001600160a01b039190911660209091015290565b5f6040828403121561143d575f80fd5b604080519081016001600160401b038111828210171561145f5761145f6112bb565b604052825181526020928301519281019290925250919050565b5f60408284031215611489575f80fd5b61120b838361142d565b5f60808284031280156114a4575f80fd5b50604051606081016001600160401b03811182821017156114c7576114c76112bb565b6040528251815260208301516001600160401b03811681146114e7575f80fd5b60208201526114f9846040850161142d565b60408201529392505050565b5f60208284031215611515575f80fd5b815161120b81610e8956fea2646970667358221220f01490c5a282e70436c62c26682c89e4eb4e25ae50410229643183cc865d974064736f6c634300081a0033" as const;


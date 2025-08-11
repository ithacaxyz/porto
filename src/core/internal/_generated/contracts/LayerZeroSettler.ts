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

export const code = "0x60a060405234801561000f575f5ffd5b5060405161172c38038061172c83398101604081905261002e91610166565b81818181806001600160a01b03811661006057604051631e4fbdf760e01b81525f600482015260240160405180910390fd5b610069816100fc565b506001600160a01b03808316608052811661009757604051632d618d8160e21b815260040160405180910390fd5b60805160405163ca5eb5e160e01b81526001600160a01b0383811660048301529091169063ca5eb5e1906024015f604051808303815f87803b1580156100db575f5ffd5b505af11580156100ed573d5f5f3e3d5ffd5b50505050505050505050610197565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b0381168114610161575f5ffd5b919050565b5f5f60408385031215610177575f5ffd5b6101808361014b565b915061018e6020840161014b565b90509250929050565b6080516115536101d95f395f8181610220015281816104a8015281816107590152818161092b01528181610a1701528181610be10152610c9801526115535ff3fe608060405260043610610129575f3560e01c8063715018a6116100a85780638da5cb5b1161006d5780638da5cb5b146103e3578063bb0b6a53146103ff578063ca5eb5e11461042a578063d9caed1214610449578063f2fde38b14610468578063ff7bd03d14610487575f5ffd5b8063715018a6146102f9578063717e8a42146102c75780637d25a05e1461030d57806382413eac1461034657806384b0196e14610374575f5ffd5b8063586a6094116100ee578063586a6094146101b45780635e280f111461020f578063665749dd1461025a5780636f0e1a9a14610299578063709eb664146102c7575f5ffd5b806313137d651461013457806317442b70146101495780632e34723b1461016f5780633400288b146101825780634fdf7085146101a1575f5ffd5b3661013057005b5f5ffd5b610147610142366004610e9a565b6104a6565b005b348015610154575f5ffd5b50604080516001815260026020820152015b60405180910390f35b61014761017d366004610f34565b610566565b34801561018d575f5ffd5b5061014761019c366004610fa3565b6106b5565b6101476101af366004610fcb565b6106cb565b3480156101bf575f5ffd5b506101ff6101ce366004611012565b5f9283526002602090815260408085206001600160a01b039490941685529281528284209184525290205460ff1690565b6040519015158152602001610166565b34801561021a575f5ffd5b506102427f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610166565b348015610265575f5ffd5b506101ff610274366004611012565b600260209081525f938452604080852082529284528284209052825290205460ff1681565b3480156102a4575f5ffd5b506101ff6102b3366004611047565b60036020525f908152604090205460ff1681565b3480156102d2575f5ffd5b506102eb6102e136600461105e565b5f95945050505050565b604051908152602001610166565b348015610304575f5ffd5b5061014761071f565b348015610318575f5ffd5b5061032e610327366004610fa3565b5f92915050565b6040516001600160401b039091168152602001610166565b348015610351575f5ffd5b506101ff6103603660046110c9565b6001600160a01b0381163014949350505050565b34801561037f575f5ffd5b50604080518082018252601081526f2630bcb2b92d32b937a9b2ba3a3632b960811b602080830191909152825180840184526005815264302e302e3160d81b8183015283515f8082529281019485905261016694600f60f81b949346923092611159565b3480156103ee575f5ffd5b505f546001600160a01b0316610242565b34801561040a575f5ffd5b506102eb6104193660046111ef565b60016020525f908152604090205481565b348015610435575f5ffd5b5061014761044436600461120f565b610732565b348015610454575f5ffd5b5061014761046336600461122a565b6107b3565b348015610473575f5ffd5b5061014761048236600461120f565b6107cb565b348015610492575f5ffd5b506101ff6104a1366004611257565b610808565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031633146104f6576040516391ac5e4f60e01b81523360048201526024015b60405180910390fd5b602087018035906105109061050b908a6111ef565b610858565b1461054e5761052260208801886111ef565b60405163309afaf360e21b815263ffffffff9091166004820152602088013560248201526044016104ed565b61055d87878787878787610880565b50505050505050565b60035f858585856040516020016105809493929190611271565b60408051601f198184030181529181528151602092830120835290820192909252015f205460ff166105c557604051630523e26360e11b815260040160405180910390fd5b5f6105d2828401846112fc565b60408051602081018790526001600160a01b038816918101919091524660608201529091505f9060800160408051601f1981840301815282820190915260028252600360f01b602083015291505f5b83518110156106ab575f84828151811061063d5761063d61139e565b602002602001015190508063ffffffff165f0361066d57604051637dbc055960e11b815260040160405180910390fd5b5f61067a8286865f610916565b90506106a08286866040518060400160405280865f015181526020015f815250336109f4565b505050600101610621565b5050505050505050565b6106bd610aec565b6106c78282610b18565b5050565b600160035f338686866040516020016106e79493929190611271565b60408051808303601f190181529181528151602092830120835290820192909252015f20805460ff1916911515919091179055505050565b610727610aec565b6107305f610b6c565b565b61073a610aec565b60405163ca5eb5e160e01b81526001600160a01b0382811660048301527f0000000000000000000000000000000000000000000000000000000000000000169063ca5eb5e1906024015f604051808303815f87803b15801561079a575f5ffd5b505af11580156107ac573d5f5f3e3d5ffd5b5050505050565b6107bb610aec565b6107c6838383610bbb565b505050565b6107d3610aec565b6001600160a01b0381166107fc57604051631e4fbdf760e01b81525f60048201526024016104ed565b61080581610b6c565b50565b5f8060018161081a60208601866111ef565b63ffffffff16815260208101919091526040015f205490508061084a5761084761050b60208501856111ef565b90505b602090920135909114919050565b63ffffffff81165f908152600160205260408120548061087a57503092915050565b92915050565b5f808061088f87890189611012565b5f8381526002602090815260408083206001600160a01b03861680855290835281842085855290925291829020805460ff191660011790559051939650919450925084917f8ec0095f0a0abbc8db397cd5246942293ac1a755825eba51c0ca828ec2102b64906109029085815260200190565b60405180910390a350505050505050505050565b604080518082019091525f80825260208201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663ddc28c586040518060a001604052808863ffffffff16815260200161097889610858565b8152602001878152602001868152602001851515815250306040518363ffffffff1660e01b81526004016109ad9291906113b2565b6040805180830381865afa1580156109c7573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906109eb9190611476565b95945050505050565b6109fc610dec565b8251602084015115610a1557610a158460200151610bde565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632637a450826040518060a001604052808b63ffffffff168152602001610a658c610858565b81526020018a81526020018981526020015f8960200151111515815250866040518463ffffffff1660e01b8152600401610aa09291906113b2565b60806040518083038185885af1158015610abc573d5f5f3e3d5ffd5b50505050506040513d601f19601f82011682018060405250810190610ae19190611490565b979650505050505050565b5f546001600160a01b031633146107305760405163118cdaa760e01b81523360048201526024016104ed565b63ffffffff82165f81815260016020908152604091829020849055815192835282018390527f238399d427b947898edb290f5ff0f9109849b1c3ba196a42e35f00c50a54b98b910160405180910390a15050565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b038316610bd3576107c68282610cbd565b6107c6838383610cd6565b5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663e4fe1d946040518163ffffffff1660e01b8152600401602060405180830381865afa158015610c3b573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610c5f9190611502565b90506001600160a01b038116610c88576040516329b99a9560e11b815260040160405180910390fd5b6106c76001600160a01b038216337f000000000000000000000000000000000000000000000000000000000000000085610d20565b5f385f3884865af16106c75763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416610d1657803d853b151710610d16576390b8ec185f526004601cfd5b505f603452505050565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b179052610d7a908590610d80565b50505050565b5f5f60205f8451602086015f885af180610d9f576040513d5f823e3d81fd5b50505f513d91508115610db6578060011415610dc3565b6001600160a01b0384163b155b15610d7a57604051635274afe760e01b81526001600160a01b03851660048201526024016104ed565b60405180606001604052805f81526020015f6001600160401b03168152602001610e2760405180604001604052805f81526020015f81525090565b905290565b5f60608284031215610e3c575f5ffd5b50919050565b5f5f83601f840112610e52575f5ffd5b5081356001600160401b03811115610e68575f5ffd5b602083019150836020828501011115610e7f575f5ffd5b9250929050565b6001600160a01b0381168114610805575f5ffd5b5f5f5f5f5f5f5f60e0888a031215610eb0575f5ffd5b610eba8989610e2c565b96506060880135955060808801356001600160401b03811115610edb575f5ffd5b610ee78a828b01610e42565b90965094505060a0880135610efb81610e86565b925060c08801356001600160401b03811115610f15575f5ffd5b610f218a828b01610e42565b989b979a50959850939692959293505050565b5f5f5f5f60608587031215610f47575f5ffd5b8435610f5281610e86565b93506020850135925060408501356001600160401b03811115610f73575f5ffd5b610f7f87828801610e42565b95989497509550505050565b803563ffffffff81168114610f9e575f5ffd5b919050565b5f5f60408385031215610fb4575f5ffd5b610fbd83610f8b565b946020939093013593505050565b5f5f5f60408486031215610fdd575f5ffd5b8335925060208401356001600160401b03811115610ff9575f5ffd5b61100586828701610e42565b9497909650939450505050565b5f5f5f60608486031215611024575f5ffd5b83359250602084013561103681610e86565b929592945050506040919091013590565b5f60208284031215611057575f5ffd5b5035919050565b5f5f5f5f5f60808688031215611072575f5ffd5b61107b86610f8b565b9450602086013561108b81610e86565b93506040860135925060608601356001600160401b038111156110ac575f5ffd5b6110b888828901610e42565b969995985093965092949392505050565b5f5f5f5f60a085870312156110dc575f5ffd5b6110e68686610e2c565b935060608501356001600160401b03811115611100575f5ffd5b61110c87828801610e42565b909450925050608085013561112081610e86565b939692955090935050565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b60ff60f81b8816815260e060208201525f61117760e083018961112b565b8281036040840152611189818961112b565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b818110156111de5783518352602093840193909201916001016111c0565b50909b9a5050505050505050505050565b5f602082840312156111ff575f5ffd5b61120882610f8b565b9392505050565b5f6020828403121561121f575f5ffd5b813561120881610e86565b5f5f5f6060848603121561123c575f5ffd5b833561124781610e86565b9250602084013561103681610e86565b5f60608284031215611267575f5ffd5b6112088383610e2c565b6001600160a01b0385168152602081018490526060604082018190528101829052818360808301375f818301608090810191909152601f909201601f191601019392505050565b634e487b7160e01b5f52604160045260245ffd5b604051601f8201601f191681016001600160401b03811182821017156112f4576112f46112b8565b604052919050565b5f6020828403121561130c575f5ffd5b81356001600160401b03811115611321575f5ffd5b8201601f81018413611331575f5ffd5b80356001600160401b0381111561134a5761134a6112b8565b8060051b61135a602082016112cc565b91825260208184018101929081019087841115611375575f5ffd5b6020850194505b83851015610ae15761138d85610f8b565b82526020948501949091019061137c565b634e487b7160e01b5f52603260045260245ffd5b6040815263ffffffff8351166040820152602083015160608201525f604084015160a060808401526113e760e084018261112b565b90506060850151603f198483030160a0850152611404828261112b565b60809690960151151560c08501525050506001600160a01b039190911660209091015290565b5f6040828403121561143a575f5ffd5b604080519081016001600160401b038111828210171561145c5761145c6112b8565b604052825181526020928301519281019290925250919050565b5f60408284031215611486575f5ffd5b611208838361142a565b5f60808284031280156114a1575f5ffd5b50604051606081016001600160401b03811182821017156114c4576114c46112b8565b6040528251815260208301516001600160401b03811681146114e4575f5ffd5b60208201526114f6846040850161142a565b60408201529392505050565b5f60208284031215611512575f5ffd5b815161120881610e8656fea2646970667358221220697d5dd3714052fb26d3c8af02fd1bde94312058b3fa95dd6ee7385b3567b3b164736f6c634300081d0033" as const;


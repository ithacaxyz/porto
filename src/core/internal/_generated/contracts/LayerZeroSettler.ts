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

export const code = "0x60a060405234801561000f575f5ffd5b5060405161156b38038061156b83398101604081905261002e91610166565b81818181806001600160a01b03811661006057604051631e4fbdf760e01b81525f600482015260240160405180910390fd5b610069816100fc565b506001600160a01b03808316608052811661009757604051632d618d8160e21b815260040160405180910390fd5b60805160405163ca5eb5e160e01b81526001600160a01b0383811660048301529091169063ca5eb5e1906024015f604051808303815f87803b1580156100db575f5ffd5b505af11580156100ed573d5f5f3e3d5ffd5b50505050505050505050610197565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b0381168114610161575f5ffd5b919050565b5f5f60408385031215610177575f5ffd5b6101808361014b565b915061018e6020840161014b565b90509250929050565b6080516113926101d95f395f81816101ff015281816103f40152818161069c0152818161086b0152818161095701528181610b210152610bd801526113925ff3fe608060405260043610610108575f3560e01c8063715018a611610092578063bb0b6a5311610062578063bb0b6a531461033d578063ca5eb5e114610376578063d9caed1214610395578063f2fde38b146103b4578063ff7bd03d146103d3575f5ffd5b8063715018a6146102a65780637d25a05e146102ba57806382413eac146102f35780638da5cb5b14610321575f5ffd5b80634fdf7085116100d85780634fdf708514610180578063586a6094146101935780635e280f11146101ee578063665749dd146102395780636f0e1a9a14610278575f5ffd5b806313137d651461011357806317442b70146101285780632e34723b1461014e5780633400288b14610161575f5ffd5b3661010f57005b5f5ffd5b610126610121366004610dda565b6103f2565b005b348015610133575f5ffd5b50604080516001815260026020820152015b60405180910390f35b61012661015c366004610e74565b6104b2565b34801561016c575f5ffd5b5061012661017b366004610ee3565b6105f8565b61012661018e366004610f0b565b61060e565b34801561019e575f5ffd5b506101de6101ad366004610f52565b5f9283526002602090815260408085206001600160a01b039490941685529281528284209184525290205460ff1690565b6040519015158152602001610145565b3480156101f9575f5ffd5b506102217f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610145565b348015610244575f5ffd5b506101de610253366004610f52565b600260209081525f938452604080852082529284528284209052825290205460ff1681565b348015610283575f5ffd5b506101de610292366004610f87565b60036020525f908152604090205460ff1681565b3480156102b1575f5ffd5b50610126610662565b3480156102c5575f5ffd5b506102db6102d4366004610ee3565b5f92915050565b6040516001600160401b039091168152602001610145565b3480156102fe575f5ffd5b506101de61030d366004610f9e565b6001600160a01b0381163014949350505050565b34801561032c575f5ffd5b505f546001600160a01b0316610221565b348015610348575f5ffd5b50610368610357366004611000565b60016020525f908152604090205481565b604051908152602001610145565b348015610381575f5ffd5b50610126610390366004611020565b610675565b3480156103a0575f5ffd5b506101266103af36600461103b565b6106f6565b3480156103bf575f5ffd5b506101266103ce366004611020565b61070e565b3480156103de575f5ffd5b506101de6103ed366004611068565b61074b565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03163314610442576040516391ac5e4f60e01b81523360048201526024015b60405180910390fd5b6020870180359061045c90610457908a611000565b61077f565b1461049a5761046e6020880188611000565b60405163309afaf360e21b815263ffffffff909116600482015260208801356024820152604401610439565b6104a9878787878787876107c0565b50505050505050565b60035f858585856040516020016104cc9493929190611082565b60408051601f198184030181529181528151602092830120835290820192909252015f205460ff1661051157604051630523e26360e11b815260040160405180910390fd5b5f61051e8284018461110d565b60408051602081018790526001600160a01b038816918101919091524660608201529091505f9060800160408051601f19818403018152602083019091525f8083529092505b83518110156105ee575f848281518110610580576105806111af565b602002602001015190508063ffffffff165f036105b057604051637dbc055960e11b815260040160405180910390fd5b5f6105bd8286865f610856565b90506105e38286866040518060400160405280865f015181526020015f81525033610934565b505050600101610564565b5050505050505050565b610600610a2c565b61060a8282610a58565b5050565b600160035f3386868660405160200161062a9493929190611082565b60408051808303601f190181529181528151602092830120835290820192909252015f20805460ff1916911515919091179055505050565b61066a610a2c565b6106735f610aac565b565b61067d610a2c565b60405163ca5eb5e160e01b81526001600160a01b0382811660048301527f0000000000000000000000000000000000000000000000000000000000000000169063ca5eb5e1906024015f604051808303815f87803b1580156106dd575f5ffd5b505af11580156106ef573d5f5f3e3d5ffd5b5050505050565b6106fe610a2c565b610709838383610afb565b505050565b610716610a2c565b6001600160a01b03811661073f57604051631e4fbdf760e01b81525f6004820152602401610439565b61074881610aac565b50565b5f6020820180359060019083906107629086611000565b63ffffffff16815260208101919091526040015f20541492915050565b63ffffffff81165f90815260016020526040812054806107ba5760405163f6ff4fb760e01b815263ffffffff84166004820152602401610439565b92915050565b5f80806107cf87890189610f52565b5f8381526002602090815260408083206001600160a01b03861680855290835281842085855290925291829020805460ff191660011790559051939650919450925084917f8ec0095f0a0abbc8db397cd5246942293ac1a755825eba51c0ca828ec2102b64906108429085815260200190565b60405180910390a350505050505050505050565b604080518082019091525f80825260208201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663ddc28c586040518060a001604052808863ffffffff1681526020016108b88961077f565b8152602001878152602001868152602001851515815250306040518363ffffffff1660e01b81526004016108ed9291906111f1565b6040805180830381865afa158015610907573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061092b91906112b5565b95945050505050565b61093c610d2c565b8251602084015115610955576109558460200151610b1e565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632637a450826040518060a001604052808b63ffffffff1681526020016109a58c61077f565b81526020018a81526020018981526020015f8960200151111515815250866040518463ffffffff1660e01b81526004016109e09291906111f1565b60806040518083038185885af11580156109fc573d5f5f3e3d5ffd5b50505050506040513d601f19601f82011682018060405250810190610a2191906112cf565b979650505050505050565b5f546001600160a01b031633146106735760405163118cdaa760e01b8152336004820152602401610439565b63ffffffff82165f81815260016020908152604091829020849055815192835282018390527f238399d427b947898edb290f5ff0f9109849b1c3ba196a42e35f00c50a54b98b910160405180910390a15050565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b038316610b13576107098282610bfd565b610709838383610c16565b5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663e4fe1d946040518163ffffffff1660e01b8152600401602060405180830381865afa158015610b7b573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610b9f9190611341565b90506001600160a01b038116610bc8576040516329b99a9560e11b815260040160405180910390fd5b61060a6001600160a01b038216337f000000000000000000000000000000000000000000000000000000000000000085610c60565b5f385f3884865af161060a5763b12d13eb5f526004601cfd5b816014528060345263a9059cbb60601b5f5260205f604460105f875af18060015f511416610c5657803d853b151710610c56576390b8ec185f526004601cfd5b505f603452505050565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b179052610cba908590610cc0565b50505050565b5f5f60205f8451602086015f885af180610cdf576040513d5f823e3d81fd5b50505f513d91508115610cf6578060011415610d03565b6001600160a01b0384163b155b15610cba57604051635274afe760e01b81526001600160a01b0385166004820152602401610439565b60405180606001604052805f81526020015f6001600160401b03168152602001610d6760405180604001604052805f81526020015f81525090565b905290565b5f60608284031215610d7c575f5ffd5b50919050565b5f5f83601f840112610d92575f5ffd5b5081356001600160401b03811115610da8575f5ffd5b602083019150836020828501011115610dbf575f5ffd5b9250929050565b6001600160a01b0381168114610748575f5ffd5b5f5f5f5f5f5f5f60e0888a031215610df0575f5ffd5b610dfa8989610d6c565b96506060880135955060808801356001600160401b03811115610e1b575f5ffd5b610e278a828b01610d82565b90965094505060a0880135610e3b81610dc6565b925060c08801356001600160401b03811115610e55575f5ffd5b610e618a828b01610d82565b989b979a50959850939692959293505050565b5f5f5f5f60608587031215610e87575f5ffd5b8435610e9281610dc6565b93506020850135925060408501356001600160401b03811115610eb3575f5ffd5b610ebf87828801610d82565b95989497509550505050565b803563ffffffff81168114610ede575f5ffd5b919050565b5f5f60408385031215610ef4575f5ffd5b610efd83610ecb565b946020939093013593505050565b5f5f5f60408486031215610f1d575f5ffd5b8335925060208401356001600160401b03811115610f39575f5ffd5b610f4586828701610d82565b9497909650939450505050565b5f5f5f60608486031215610f64575f5ffd5b833592506020840135610f7681610dc6565b929592945050506040919091013590565b5f60208284031215610f97575f5ffd5b5035919050565b5f5f5f5f60a08587031215610fb1575f5ffd5b610fbb8686610d6c565b935060608501356001600160401b03811115610fd5575f5ffd5b610fe187828801610d82565b9094509250506080850135610ff581610dc6565b939692955090935050565b5f60208284031215611010575f5ffd5b61101982610ecb565b9392505050565b5f60208284031215611030575f5ffd5b813561101981610dc6565b5f5f5f6060848603121561104d575f5ffd5b833561105881610dc6565b92506020840135610f7681610dc6565b5f60608284031215611078575f5ffd5b6110198383610d6c565b6001600160a01b0385168152602081018490526060604082018190528101829052818360808301375f818301608090810191909152601f909201601f191601019392505050565b634e487b7160e01b5f52604160045260245ffd5b604051601f8201601f191681016001600160401b0381118282101715611105576111056110c9565b604052919050565b5f6020828403121561111d575f5ffd5b81356001600160401b03811115611132575f5ffd5b8201601f81018413611142575f5ffd5b80356001600160401b0381111561115b5761115b6110c9565b8060051b61116b602082016110dd565b91825260208184018101929081019087841115611186575f5ffd5b6020850194505b83851015610a215761119e85610ecb565b82526020948501949091019061118d565b634e487b7160e01b5f52603260045260245ffd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b6040815263ffffffff8351166040820152602083015160608201525f604084015160a0608084015261122660e08401826111c3565b90506060850151603f198483030160a085015261124382826111c3565b60809690960151151560c08501525050506001600160a01b039190911660209091015290565b5f60408284031215611279575f5ffd5b604080519081016001600160401b038111828210171561129b5761129b6110c9565b604052825181526020928301519281019290925250919050565b5f604082840312156112c5575f5ffd5b6110198383611269565b5f60808284031280156112e0575f5ffd5b50604051606081016001600160401b0381118282101715611303576113036110c9565b6040528251815260208301516001600160401b0381168114611323575f5ffd5b60208201526113358460408501611269565b60408201529392505050565b5f60208284031215611351575f5ffd5b815161101981610dc656fea264697066735822122068b8ed62c923a1089cc2aef185ef4e76e35cf9c012363bc05958c6b7cb103e0964736f6c634300081d0033" as const;


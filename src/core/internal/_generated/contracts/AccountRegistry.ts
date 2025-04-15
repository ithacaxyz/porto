export const abi = [
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
    "type": "error",
    "name": "AlreadyRegistered",
    "inputs": []
  },
  {
    "type": "error",
    "name": "IDOccupied",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidCaller",
    "inputs": []
  }
] as const;

export const code = "0x6080604052348015600e575f80fd5b50610e688061001c5f395ff3fe608060405234801561000f575f80fd5b506004361061004a575f3560e01c8063703a60cd1461004e5780637451349214610063578063799078911461008d578063c4740a95146100a0575b5f80fd5b61006161005c366004610a28565b6100b3565b005b610076610071366004610aa8565b61015a565b604051610084929190610ba4565b60405180910390f35b61006161009b366004610c3b565b61033a565b6100616100ae366004610c6c565b6103c1565b5f6100e98484846040516020016100cc93929190610c8c565b60405160208183030381529060405280519060200120878761048b565b6001600160a01b0381165f9081526890c43f55cf16b227d26020526040812091925061011760018301610513565b111561013657604051632b9a450560e21b815260040160405180910390fd5b80610142858783610d64565b506101506001820184610564565b5050505050505050565b6060808267ffffffffffffffff81111561017657610176610ccc565b6040519080825280602002602001820160405280156101a957816020015b60608152602001906001900390816101945790505b5091508267ffffffffffffffff8111156101c5576101c5610ccc565b6040519080825280602002602001820160405280156101f857816020015b60608152602001906001900390816101e35790505b5090505f5b83811015610332575f6890c43f55cf16b227d25f87878581811061022357610223610e1e565b90506020020160208101906102389190610c6c565b6001600160a01b03166001600160a01b031681526020019081526020015f209050805f01805461026790610ce0565b80601f016020809104026020016040519081016040528092919081815260200182805461029390610ce0565b80156102de5780601f106102b5576101008083540402835291602001916102de565b820191905f5260205f20905b8154815290600101906020018083116102c157829003601f168201915b50505050508483815181106102f5576102f5610e1e565b602002602001018190525061030c816001016106c0565b83838151811061031e5761031e610e1e565b6020908102919091010152506001016101fd565b509250929050565b6001600160a01b0382165f9081526890c43f55cf16b227d2602052604090206103666001820133610794565b610383576040516348f5c3ed60e01b815260040160405180910390fd5b6103906001820183610794565b156103ae57604051630ea075bf60e21b815260040160405180910390fd5b6103bb6001820183610564565b50505050565b6001600160a01b0381165f9081526890c43f55cf16b227d2602081905260409091206103f09060010133610794565b61040d576040516348f5c3ed60e01b815260040160405180910390fd5b6001600160a01b0382165f908152602082905260409020610431906001013361083d565b506001600160a01b0382165f90815260208290526040902061045590600101610513565b5f03610487576001600160a01b0382165f9081526020829052604081209061047d8282610976565b505f600191909101555b5050565b5f60405182604081146104a657604181146104cd57506104fe565b60208581013560ff81901c601b0190915285356040526001600160ff1b03166060526104de565b60408501355f1a6020526040856040375b50845f526020600160805f60015afa5191505f606052806040523d61050b575b638baa579f5f526004601cfd5b509392505050565b63978aab926004525f8181526024812080548060a01b60a01c8060011c9350808260601c151761055c5760019350838301541561055c5760029350838301541561055c57600393505b505050919050565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be19830161059f5763f5a267f15f526004601cfd5b826105b15768fbb67fda52d4bfb8bf92505b80546001600160601b0381168260205280610673578160601c806105df578560601b845560019450506106b7565b8581036105ec57506106b7565b600184015460601c8061060d578660601b60018601556001955050506106b7565b86810361061b5750506106b7565b600285015460601c8061063d578760601b6002870155600196505050506106b7565b87810361064c575050506106b7565b5f928352604080842060019055918352818320600290558252902060039055506007908117905b845f5260405f2080546106b557600191821c8083018255919450816106a1578560601b6003178455506106b7565b8560601b82850155826002018455506106b7565b505b50505092915050565b63978aab926004525f818152602481206060915068fbb67fda52d4bfb8bf81548060a01b60a01c6040519450846020018260601c925083831415830281528161074e57821561074957600191508185015460601c92508215610749578284141590920260208301525060028381015460601c918215610749576003915083831415830260408201525b61077e565b600191821c915b8281101561077c578581015460601c858114158102600583901b8401529350600101610755565b505b8186528160051b81016040525050505050919050565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016107cf5763f5a267f15f526004601cfd5b826107e15768fbb67fda52d4bfb8bf92505b80546001600160601b0381166108245760019250838160601c031561083557600182015460601c841461083557600282015460601c8414610835575f9250610835565b81602052835f5260405f2054151592505b505092915050565b63978aab926004525f828152602481206001600160a01b03929092169168fbb67fda52d4bfb8be1983016108785763f5a267f15f526004601cfd5b8261088a5768fbb67fda52d4bfb8bf92505b80546001600160601b038116806109045760019350848260601c036108c25760018301805484556002840180549091555f90556106b7565b84600184015460601c036108e35760028301805460018501555f90556106b7565b84600284015460601c036108fc575f60028401556106b7565b5f93506106b7565b82602052845f5260405f2080548061091d5750506106b7565b60018360011c03925082600182031461094d578285015460601c8060601b60018303870155805f52508060405f20555b5083546bffffffffffffffffffffffff1916600192831b1782179093555f909255509392505050565b50805461098290610ce0565b5f825580601f10610991575050565b601f0160209004905f5260205f20908101906109ad91906109b0565b50565b5b808211156109c4575f81556001016109b1565b5090565b5f8083601f8401126109d8575f80fd5b50813567ffffffffffffffff8111156109ef575f80fd5b602083019150836020828501011115610a06575f80fd5b9250929050565b80356001600160a01b0381168114610a23575f80fd5b919050565b5f805f805f60608688031215610a3c575f80fd5b853567ffffffffffffffff811115610a52575f80fd5b610a5e888289016109c8565b909650945050602086013567ffffffffffffffff811115610a7d575f80fd5b610a89888289016109c8565b9094509250610a9c905060408701610a0d565b90509295509295909350565b5f8060208385031215610ab9575f80fd5b823567ffffffffffffffff811115610acf575f80fd5b8301601f81018513610adf575f80fd5b803567ffffffffffffffff811115610af5575f80fd5b8560208260051b8401011115610b09575f80fd5b6020919091019590945092505050565b5f82825180855260208501945060208160051b830101602085015f5b83811015610b9857848303601f19018852815180518085526020918201918501905f5b81811015610b7f5783516001600160a01b0316835260209384019390920191600101610b58565b50506020998a0199909450929092019150600101610b35565b50909695505050505050565b5f604082016040835280855180835260608501915060608160051b8601019250602087015f5b82811015610c1c57605f19878603018452815180518087528060208301602089015e5f602082890101526020601f19601f83011688010196505050602082019150602084019350600181019050610bca565b505050508281036020840152610c328185610b19565b95945050505050565b5f8060408385031215610c4c575f80fd5b610c5583610a0d565b9150610c6360208401610a0d565b90509250929050565b5f60208284031215610c7c575f80fd5b610c8582610a0d565b9392505050565b60408152826040820152828460608301375f60608483018101919091526001600160a01b03929092166020820152601f909201601f191690910101919050565b634e487b7160e01b5f52604160045260245ffd5b600181811c90821680610cf457607f821691505b602082108103610d1257634e487b7160e01b5f52602260045260245ffd5b50919050565b601f821115610d5f57805f5260205f20601f840160051c81016020851015610d3d5750805b601f840160051c820191505b81811015610d5c575f8155600101610d49565b50505b505050565b67ffffffffffffffff831115610d7c57610d7c610ccc565b610d9083610d8a8354610ce0565b83610d18565b5f601f841160018114610dc1575f8515610daa5750838201355b5f19600387901b1c1916600186901b178355610d5c565b5f83815260208120601f198716915b82811015610df05786850135825560209485019460019092019101610dd0565b5086821015610e0c575f1960f88860031b161c19848701351681555b505060018560011b0183555050505050565b634e487b7160e01b5f52603260045260245ffdfea26469706673582212209e9df7ed75f462d76ec5d09355098af26765dfa19d6b3eb89f957a856318c90064736f6c634300081a0033" as const;


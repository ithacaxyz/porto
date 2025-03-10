export const abi = [
  {
    "type": "function",
    "name": "adminOf",
    "inputs": [
      {
        "name": "proxy",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "admin",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "changeAdmin",
    "inputs": [
      {
        "name": "proxy",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "admin",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deploy",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "admin",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "proxy",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "deployAndCall",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "admin",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "proxy",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "deployDeterministic",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "admin",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "proxy",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "deployDeterministicAndCall",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "admin",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "proxy",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "initCodeHash",
    "inputs": [],
    "outputs": [
      {
        "name": "result",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "predictDeterministicAddress",
    "inputs": [
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "predicted",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "upgrade",
    "inputs": [
      {
        "name": "proxy",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "upgradeAndCall",
    "inputs": [
      {
        "name": "proxy",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "event",
    "name": "AdminChanged",
    "inputs": [
      {
        "name": "proxy",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "admin",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Deployed",
    "inputs": [
      {
        "name": "proxy",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "admin",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Upgraded",
    "inputs": [
      {
        "name": "proxy",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "DeploymentFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SaltDoesNotStartWithCaller",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Unauthorized",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UpgradeFailed",
    "inputs": []
  }
] as const;

export const code = "0x6080604052348015600e575f80fd5b5061075f8061001c5f395ff3fe60806040526004361061008f575f3560e01c8063545e7c6111610057578063545e7c61146101375780639623609d1461014a57806399a88ec41461015d578063a97b90d514610170578063db4c545e14610183575f80fd5b80631acfd02a146100935780632abbef15146100b45780633729f922146100f25780634314f120146101055780635414dff014610118575b5f80fd5b34801561009e575f80fd5b506100b26100ad366004610582565b6101a5565b005b3480156100bf575f80fd5b506100d56100ce3660046105b3565b60601b5490565b6040516001600160a01b0390911681526020015b60405180910390f35b6100d56101003660046105cc565b6101ed565b6100d561011336600461064b565b610203565b348015610123575f80fd5b506100d56101323660046106a8565b61021b565b6100d5610145366004610582565b61024a565b6100b261015836600461064b565b61025e565b6100b261016b366004610582565b6102ff565b6100d561017e3660046106bf565b61030f565b34801561018e575f80fd5b50610197610346565b6040519081526020016100e9565b338260601b54146101bd576382b429005f526004601cfd5b808260601b5580827f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f5f80a35050565b5f6101fb848484368561030f565b949350505050565b5f61021285858380878761035e565b95945050505050565b5f80610225610346565b905060ff5f53806035523060601b6001528260155260555f2091505f60355250919050565b5f61025783833684610203565b9392505050565b338460601b5414610276576382b429005f526004601cfd5b6040518381527f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc6020820152818360408301375f80836040018334895af16102d2573d6102ca576355299b495f526004601cfd5b3d5f803e3d5ffd5b5082847f5d611f318680d00598bb735d61bacf0c514c6b50e1e5ad30040a4df2b12791c75f80a350505050565b61030b8282365f61025e565b5050565b5f8360601c33148460601c151761032d57632f6348365f526004601cfd5b61033c8686866001878761035e565b9695505050505050565b5f80610350610428565b608860139091012092915050565b5f80610368610428565b905084801561038157866088601384015ff5925061038c565b6088601383015ff092505b508161039f5763301164255f526004601cfd5b8781527f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc6020820152828460408301375f80846040018334865af16103f0573d6102ca5763301164255f526004601cfd5b868260601b558688837fc95935a66d15e0da5e412aca0ad27ae891d20b2fb91cf3994b6a3bf2b81780825f80a4509695505050505050565b6040513060701c80156104ce57666052573d6000fd607b8301527f3d356020355560408036111560525736038060403d373d3d355af43d6000803e60748301527f3735a920a3ca505d382bbc545af43d6000803e6052573d6000fd5b3d6000f35b60548301527f14605757363d3d37363d7f360894a13ba1a3210667c828492db98dca3e2076cc60348301523060148301526c607f3d8160093d39f33d3d337382525090565b66604c573d6000fd60758301527f3d3560203555604080361115604c5736038060403d373d3d355af43d6000803e606e8301527f3735a920a3ca505d382bbc545af43d6000803e604c573d6000fd5b3d6000f35b604e8301527f14605157363d3d37363d7f360894a13ba1a3210667c828492db98dca3e2076cc602e83015230600e8301526c60793d8160093d39f33d3d336d82525090565b80356001600160a01b038116811461057d575f80fd5b919050565b5f8060408385031215610593575f80fd5b61059c83610567565b91506105aa60208401610567565b90509250929050565b5f602082840312156105c3575f80fd5b61025782610567565b5f805f606084860312156105de575f80fd5b6105e784610567565b92506105f560208501610567565b929592945050506040919091013590565b5f8083601f840112610616575f80fd5b50813567ffffffffffffffff81111561062d575f80fd5b602083019150836020828501011115610644575f80fd5b9250929050565b5f805f806060858703121561065e575f80fd5b61066785610567565b935061067560208601610567565b9250604085013567ffffffffffffffff811115610690575f80fd5b61069c87828801610606565b95989497509550505050565b5f602082840312156106b8575f80fd5b5035919050565b5f805f805f608086880312156106d3575f80fd5b6106dc86610567565b94506106ea60208701610567565b935060408601359250606086013567ffffffffffffffff81111561070c575f80fd5b61071888828901610606565b96999598509396509294939250505056fea264697066735822122081c48dd94df36999df0f73f2b0010a84ca18a7b674f56651640c0cc79fb36a0364736f6c634300081a0033" as const;


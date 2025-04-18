import type { Address } from 'ox'
import { Provider, RpcTransport } from 'ox'
import { createServer } from 'prool'
import { type AnvilParameters, anvil } from 'prool/instances'
import {
  createClient,
  createTestClient,
  formatTransaction,
  http,
  type TransactionRequest,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { prepareTransactionRequest, signTransaction } from 'viem/actions'
import {
  deployContract,
  getCode,
  getTransactionReceipt,
  setCode,
} from 'viem/actions'
import { odysseyTestnet } from 'viem/chains'

import * as AccountRegistry from '../../src/core/internal/_generated/contracts/AccountRegistry.js'
import * as Delegation from '../../src/core/internal/_generated/contracts/Delegation.js'
import * as EIP7702Proxy from '../../src/core/internal/_generated/contracts/EIP7702Proxy.js'
import * as EntryPoint from '../../src/core/internal/_generated/contracts/EntryPoint.js'
import { exp1Address, exp2Address } from '../src/_generated/contracts.js'

import { poolId } from './prool.js'

export const instances = {
  odyssey: defineAnvil({
    chainId: odysseyTestnet.id,
    port: 8545,
  }),
} as const

export const accounts = [
  {
    address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    balance: 10000000000000000000000n,
    privateKey:
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  },
  {
    address: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    balance: 10000000000000000000000n,
    privateKey:
      '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  },
  {
    address: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
    balance: 10000000000000000000000n,
    privateKey:
      '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
  },
  {
    address: '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
    balance: 10000000000000000000000n,
    privateKey:
      '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
  },
  {
    address: '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
    balance: 10000000000000000000000n,
    privateKey:
      '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
  },
  {
    address: '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
    balance: 10000000000000000000000n,
    privateKey:
      '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba',
  },
  {
    address: '0x976ea74026e726554db657fa54763abd0c3a0aa9',
    balance: 10000000000000000000000n,
    privateKey:
      '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e',
  },
  {
    address: '0x14dc79964da2c08b23698b3d3cc7ca32193d9955',
    balance: 10000000000000000000000n,
    privateKey:
      '0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356',
  },
  {
    address: '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f',
    balance: 10000000000000000000000n,
    privateKey:
      '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97',
  },
  {
    address: '0xa0ee7a142d267c1f36714e4a8f75612f20a79720',
    balance: 10000000000000000000000n,
    privateKey:
      '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6',
  },
] as const

export const enabled = process.env.VITE_LOCAL !== 'false'

export async function loadState(parameters: {
  accountRegistryAddress: Address.Address
  entryPointAddress: Address.Address
  delegationAddress: Address.Address
  rpcUrl: string
}) {
  const {
    accountRegistryAddress,
    entryPointAddress,
    delegationAddress,
    rpcUrl,
  } = parameters

  const account = privateKeyToAccount(accounts[0]!.privateKey)
  const client = createTestClient({
    account,
    mode: 'anvil',
    transport: http(rpcUrl),
  })

  {
    // Deploy AccountRegistry contract.
    const hash = await deployContract(client, {
      abi: AccountRegistry.abi,
      bytecode: AccountRegistry.code,
      chain: null,
    })
    const { contractAddress } = await getTransactionReceipt(client, {
      hash,
    })
    const code = await getCode(client, {
      address: contractAddress!,
    })
    await setCode(client, {
      address: accountRegistryAddress,
      bytecode: code!,
    })
  }

  {
    // Deploy EntryPoint contract.
    const hash = await deployContract(client, {
      abi: EntryPoint.abi,
      args: [account.address],
      bytecode: EntryPoint.code,
      chain: null,
    })
    const { contractAddress } = await getTransactionReceipt(client, {
      hash,
    })
    const code = await getCode(client, {
      address: contractAddress!,
    })
    await setCode(client, {
      address: entryPointAddress,
      bytecode: code!,
    })
  }

  {
    // Deploy Delegation contract.
    const hash = await deployContract(client, {
      abi: Delegation.abi,
      args: [entryPointAddress],
      bytecode: Delegation.code,
      chain: null,
    })
    const { contractAddress } = await getTransactionReceipt(client, {
      hash,
    })

    // Deploy EIP7702Proxy contract.
    const hash_2 = await deployContract(client, {
      abi: EIP7702Proxy.abi,
      args: [contractAddress!, account.address],
      bytecode: EIP7702Proxy.code,
      chain: null,
    })
    const { contractAddress: contractAddress_2 } = await getTransactionReceipt(
      client,
      {
        hash: hash_2,
      },
    )
    const code = await getCode(client, {
      address: contractAddress_2!,
    })
    await setCode(client, {
      address: delegationAddress,
      bytecode: code!,
    })
  }

  // Deploy ExperimentalERC20 contract.
  for (const address of [exp1Address, exp2Address]) {
    await setCode(client, {
      address: address[odysseyTestnet.id],
      bytecode:
        '0x60806040526004361015610018575b361561001657005b005b5f803560e01c806306fdde03146107d6578063095ea7b31461076b57806318160ddd1461074657806323b872dd14610696578063313ce5671461067b5780633644e515146105f357806340c10f191461057657806370a08231146105445780637ecebe001461051257806395d89b411461040e578063a9059cbb1461039f578063d505accf14610203578063dd62ed3e146101c55763df791e50146100bd575061000e565b346101a0576100cb36610847565b916387a211a2600c52335f526020600c2080548085116101b8578490039055826805345cdf77eb68f44c54036805345cdf77eb68f44c55825f525f335f80516020610983833981519152602083a36002546001600160a01b0391909116928181029181159183041417156101a457823b156101a0576040516340c10f1960e01b81526001600160a01b039092166004830152670de0b6b3a764000090046024820152905f908290604490829084905af1801561019557610189575080f35b61001691505f90610881565b6040513d5f823e3d90fd5b5f80fd5b634e487b7160e01b5f52601160045260245ffd5b63f4d678b85f526004601cfd5b346101a05760403660031901126101a0576101de61081b565b6101e6610831565b602052637f5e9f20600c525f5260206034600c2054604051908152f35b346101a05760e03660031901126101a05761021c61081b565b610224610831565b6084359160643560443560ff851685036101a0576102406108b7565b6020815191012090824211610392576040519360018060a01b03169460018060a01b03169565383775081901600e52855f5260c06020600c20958654957f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8252602082019586528660408301967fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc688528b6060850198468a528c608087019330855260a08820602e527f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9885252528688525260a082015220604e526042602c205f5260ff1660205260a43560405260c43560605260208060805f60015afa93853d5103610385577f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92594602094019055856303faf4f960a51b176040526034602c2055a3005b63ddafbaef5f526004601cfd5b631a15a3cc5f526004601cfd5b346101a05760403660031901126101a0576103b861081b565b602435906387a211a2600c52335f526020600c2080548084116101b85783900390555f526020600c20818154019055602052600c5160601c335f80516020610983833981519152602080a3602060405160018152f35b346101a0575f3660031901126101a0576040515f6001548060011c90600181168015610508575b6020831081146104f4578285529081156104d05750600114610472575b61046e8361046281850382610881565b604051918291826107f1565b0390f35b60015f9081527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6939250905b8082106104b657509091508101602001610462610452565b91926001816020925483858801015201910190929161049e565b60ff191660208086019190915291151560051b840190910191506104629050610452565b634e487b7160e01b5f52602260045260245ffd5b91607f1691610435565b346101a05760203660031901126101a05761052b61081b565b6338377508600c525f52602080600c2054604051908152f35b346101a05760203660031901126101a05761055d61081b565b6387a211a2600c525f52602080600c2054604051908152f35b346101a05760403660031901126101a05761058f61081b565b602435906805345cdf77eb68f44c548281019081106105e6576805345cdf77eb68f44c556387a211a2600c525f526020600c20818154019055602052600c5160601c5f5f80516020610983833981519152602080a3005b63e5cfe9575f526004601cfd5b346101a0575f3660031901126101a057602060a061060f6108b7565b828151910120604051907f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8252838201527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6604082015246606082015230608082015220604051908152f35b346101a0575f3660031901126101a057602060405160128152f35b346101a0576106a436610847565b908260601b33602052637f5e9f208117600c526034600c20908154918219610722575b506387a211a2915017600c526020600c2080548084116101b85783900390555f526020600c20818154019055602052600c5160601c9060018060a01b03165f80516020610983833981519152602080a3602060405160018152f35b82851161073957846387a211a293039055856106c7565b6313be252b5f526004601cfd5b346101a0575f3660031901126101a05760206805345cdf77eb68f44c54604051908152f35b346101a05760403660031901126101a05761078461081b565b60243590602052637f5e9f20600c52335f52806034600c20555f52602c5160601c337f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560205fa3602060405160018152f35b346101a0575f3660031901126101a05761046e6104626108b7565b602060409281835280519182918282860152018484015e5f828201840152601f01601f1916010190565b600435906001600160a01b03821682036101a057565b602435906001600160a01b03821682036101a057565b60609060031901126101a0576004356001600160a01b03811681036101a057906024356001600160a01b03811681036101a0579060443590565b90601f8019910116810190811067ffffffffffffffff8211176108a357604052565b634e487b7160e01b5f52604160045260245ffd5b604051905f80548060011c9160018216918215610978575b6020841083146104f457838652859290811561095957506001146108fc575b6108fa92500383610881565b565b505f80805290917f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5635b81831061093d5750509060206108fa928201016108ee565b6020919350806001915483858901015201910190918492610925565b602092506108fa94915060ff191682840152151560051b8201016108ee565b92607f16926108cf56feddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa2646970667358221220e65efc8668f2d4dd693032cabf3678c5354b6005a959e17f7fb7cd287d7fefd564736f6c634300081a0033',
    })
  }
}

/////////////////////////////////////////////////////////////////
// Utilities
/////////////////////////////////////////////////////////////////

function defineAnvil(parameters: AnvilParameters) {
  const { port } = parameters
  const rpcUrl = `http://127.0.0.1:${port}/${poolId}`

  const config = {
    ...parameters,
    odyssey: true,
  } as const

  const client = createClient({
    transport: http(rpcUrl),
  })

  const transport = RpcTransport.fromHttp(rpcUrl)
  const provider = Provider.from({
    async request(args) {
      if (args.method === 'eth_sendTransaction') {
        const transaction = formatTransaction(
          (args.params as any)[0],
        ) as TransactionRequest

        const request = await prepareTransactionRequest(client, {
          ...transaction,
          account: privateKeyToAccount(
            '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
          ),
          chain: null,
        })

        const serialized = await signTransaction(client, request)

        args.method = 'eth_sendRawTransaction' as any
        args.params = [serialized] as any
      }

      return transport.request(args as any)
    },
  })

  return {
    config,
    port,
    request: provider.request,
    async restart() {
      await fetch(`${rpcUrl}/restart`)
    },
    rpcUrl,
    async start() {
      return await createServer({
        instance: anvil(config),
        port,
      }).start()
    },
  }
}

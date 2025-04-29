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
import {
  deployContract,
  getCode,
  getTransactionReceipt,
  prepareTransactionRequest,
  setCode,
  signTransaction,
} from 'viem/actions'

import * as AccountRegistry from '../../src/core/internal/_generated/contracts/AccountRegistry.js'
import * as Delegation from '../../src/core/internal/_generated/contracts/Delegation.js'
import * as DelegationOld from '../../src/core/internal/_generated/contracts/DelegationOld.js'
import * as EIP7702Proxy from '../../src/core/internal/_generated/contracts/EIP7702Proxy.js'
import * as EntryPoint from '../../src/core/internal/_generated/contracts/EntryPoint.js'
import * as ExperimentERC20 from '../../src/core/internal/_generated/contracts/ExperimentERC20.js'
import * as ExperimentERC721 from '../../src/core/internal/_generated/contracts/ExperimentERC721.js'
import * as Simulator from '../../src/core/internal/_generated/contracts/Simulator.js'
import {
  exp1Abi,
  exp1Address,
  exp2Address,
  expNftAddress,
} from '../src/_generated/contracts.js'

import { poolId } from './prool.js'

export const enabled = process.env.VITE_LOCAL !== 'false'

export const instances = {
  odyssey: defineAnvil({
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

export const delegation001Address = '0xed1db453c3156ff3155a97ad217b3087d5dc5f6e'

export async function loadState(parameters: { rpcUrl: string }) {
  const { rpcUrl } = parameters

  const account = privateKeyToAccount(accounts[9]!.privateKey)
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
    await getTransactionReceipt(client, {
      hash,
    })
  }

  let entryPointAddress: Address.Address | null | undefined
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
    entryPointAddress = contractAddress
  }

  {
    // Deploy Delegation contract.
    const hash = await deployContract(client, {
      abi: Delegation.abi,
      args: [entryPointAddress!],
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
    await getTransactionReceipt(client, {
      hash: hash_2,
    })
  }
  // Deploy ExperimentalERC20 contract.
  for (const address of [exp1Address, exp2Address]) {
    const isExp1 = address === exp1Address
    const hash = await deployContract(client, {
      abi: exp1Abi,
      args: [
        isExp1 ? 'Exp1' : 'Exp2',
        isExp1 ? 'EXP1' : 'EXP2',
        isExp1 ? 100n : 1n,
      ],
      bytecode: ExperimentERC20.code,
      chain: null,
    })
    await getTransactionReceipt(client, {
      hash,
    })
  }

  {
    // Deploy DelegationOld contract.
    const hash = await deployContract(client, {
      abi: DelegationOld.abi,
      args: [entryPointAddress!],
      bytecode: DelegationOld.code,
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
    await getTransactionReceipt(client, {
      hash: hash_2,
    })
  }

  {
    // Deploy ExperimentERC721 contract.
    const hash = await deployContract(client, {
      abi: ExperimentERC721.abi,
      args: [
        'GEN',
        'Ithaca Genesis',
        '',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0IiBoZWlnaHQ9IjE0NCIgdmlld0JveD0iMCAwIDE0NCAxNDQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDQiIGhlaWdodD0iMTQ0IiBmaWxsPSIjMDA5MEZGIi8+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF80MDFfNCkiPgo8cGF0aCBkPSJNOTIuMTEzNiA3Mi41NzM0Qzk0Ljc5NTkgNzEuNzczNCA5Ny43MDE4IDcyLjg1OTEgOTkuMDk4OSA3NS4yMDJMMTE0LjYzNCAxMDEuMjAyQzExNi41OSAxMDQuNDU5IDExNC4xODcgMTA4LjYzIDExMC4yNzUgMTA4LjYzSDMwLjAyODRDMjUuOTQ5IDEwOC42MyAyMy41NDYxIDEwNC4wNTkgMjUuOTQ5IDEwMC44MDJMMzMuMDQ2MSA5MS4wODc0QzMzLjgyODQgODkuOTQ0NiAzNC45NDYxIDg5LjIwMTcgMzYuMjMxNCA4OC44MDJMOTIuMDU3NyA3Mi41NzM0SDkyLjExMzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBvcGFjaXR5PSIwLjc1IiBkPSJNNjMuMjc5NiAzNS44ODI5QzY0LjM5NzIgMzMuODgyOSA2Ny41MjY2IDM0LjM5NzIgNjcuOTczNyAzNi42MjU4TDc0LjU2NzggNzAuMTExNUM3NC43Mzc4IDcwLjk3MzUgNzQuNTc3NCA3MS44NjkyIDc0LjExOTcgNzIuNjEzN0M3My42NjIxIDczLjM1ODIgNzIuOTQyMyA3My44OTQzIDcyLjEwOSA3NC4xMTE1TDQwLjk4MjUgODMuMzY4NkMzOC44MDMxIDg0LjA1NDMgMzYuOTU5IDgxLjc2ODYgMzguMDc2NiA3OS44MjU4TDYzLjI3OTYgMzUuODgyOVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIG9wYWNpdHk9IjAuNSIgZD0iTTcxLjI3MDcgMzMuNzE0NUM3MC45MzU0IDMyLjExNDUgNzMuMTcwNyAzMS4zMTQ1IDc0LjA2NDggMzIuNzQzMUw5My43OTEyIDY2LjA1NzRDOTQuMjk0MSA2Ni45MTQ1IDkzLjc5MTIgNjguMDAwMiA5Mi44OTcxIDY4LjIyODhMODEuNDQxMiA3MS4zNzE3QzgxLjExMDkgNzEuNDY1IDgwLjc2NSA3MS40ODgzIDgwLjQyNTQgNzEuNDQwMUM4MC4wODU4IDcxLjM5MTkgNzkuNzU5NCA3MS4yNzMxIDc5LjQ2NjMgNzEuMDkxMUM3OS4xNzMyIDcwLjkwOTIgNzguOTE5NiA3MC42Njc4IDc4LjcyMSA3MC4zODJDNzguNTIyNSA3MC4wOTYxIDc4LjM4MzMgNjkuNzcxNyA3OC4zMTE4IDY5LjQyODhMNzEuMjcwNyAzMy43NzE2VjMzLjcxNDVaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzQwMV80Ij4KPHJlY3Qgd2lkdGg9Ijk1IiBoZWlnaHQ9IjgwIiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjUgMzIpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==',
      ],
      bytecode: ExperimentERC721.code,
      chain: null,
    })
    const { contractAddress } = await getTransactionReceipt(client, {
      hash,
    })
    const code = await getCode(client, {
      address: contractAddress!,
    })
    await setCode(client, {
      address: expNftAddress[31337],
      bytecode: code!,
    })
  }

  {
    // Deploy Simulator contract.
    const hash = await deployContract(client, {
      abi: Simulator.abi,
      args: [],
      bytecode: Simulator.code,
      chain: null,
    })
    await getTransactionReceipt(client, {
      hash,
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

import { anvil } from 'prool/instances'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createTestClient, http } from 'viem'
import {
  deployContract,
  setBalance,
  setCode,
  waitForTransactionReceipt,
  writeContract,
} from 'viem/actions'
import { type Address, Value } from 'ox'

import * as Anvil from '../test/src/anvil.js'
import * as EIP7702Proxy from '../src/core/internal/_generated/contracts/EIP7702Proxy.js'
import * as Escrow from '../src/core/internal/_generated/contracts/Escrow.js'
import * as IthacaAccount from '../src/core/internal/_generated/contracts/PortoAccount.js'
import * as IthacaAccountOld from '../src/core/internal/_generated/contracts/IthacaAccountOld.js'
import * as IthacaAccountNew from '../src/core/internal/_generated/contracts/IthacaAccountNew.js'
import * as Orchestrator from '../src/core/internal/_generated/contracts/Orchestrator.js'
import * as ExperimentERC20 from '../src/core/internal/_generated/contracts/ExperimentERC20.js'
import * as ExperimentERC721 from '../src/core/internal/_generated/contracts/ExperimentERC721.js'
import * as SimpleSettler from '../src/core/internal/_generated/contracts/SimpleSettler.js'
import * as SimpleFunder from '../src/core/internal/_generated/contracts/SimpleFunder.js'
import * as Simulator from '../src/core/internal/_generated/contracts/Simulator.js'

const port = 8595
const rpcUrl = `http://127.0.0.1:${port}`

const stop = await anvil({
  accounts: Anvil.accounts.length,
  port,
  dumpState: resolve(import.meta.dirname, '../test/src/_generated/anvil.json'),
}).start()

const account = Anvil.account.relay
const client = createTestClient({
  account,
  mode: 'anvil',
  pollingInterval: 100,
  transport: http(rpcUrl),
})

const exports = []

let orchestratorAddress: Address.Address | null | undefined
{
  // Deploy Orchestrator contract.
  const hash = await deployContract(client, {
    abi: Orchestrator.abi,
    bytecode: Orchestrator.code,
    chain: null,
    args: ['0x0000000000000000000000000000000000000000'],
  })
  const { contractAddress } = await waitForTransactionReceipt(client, {
    hash,
  })
  orchestratorAddress = contractAddress
  exports.push(`export const orchestratorAddress = '${contractAddress}'`)
}

{
  // Deploy IthacaAccount contract.
  const hash = await deployContract(client, {
    abi: IthacaAccount.abi,
    args: [orchestratorAddress!],
    bytecode: IthacaAccount.code,
    chain: null,
  })
  const { contractAddress } = await waitForTransactionReceipt(client, {
    hash,
  })
  exports.push(
    `export const accountImplementationAddress = '${contractAddress}'`,
  )

  // Deploy EIP7702Proxy contract.
  const hash_2 = await deployContract(client, {
    abi: EIP7702Proxy.abi,
    args: [contractAddress!, account.address],
    bytecode: EIP7702Proxy.code,
    chain: null,
  })
  const { contractAddress: contractAddress_2 } =
    await waitForTransactionReceipt(client, {
      hash: hash_2,
    })
  exports.push(`export const accountProxyAddress = '${contractAddress_2}'`)
}

let exp1Address: Address.Address | null | undefined

// Deploy ExperimentalERC20 contract.
for (const i of Array.from({ length: 2 }, (_, i) => i + 1)) {
  const hash = await deployContract(client, {
    abi: ExperimentERC20.abi,
    args: ['ExperimentERC20', 'EXP', i === 0 ? 100n : 1n],
    bytecode: ExperimentERC20.code,
    chain: null,
  })
  const { contractAddress } = await waitForTransactionReceipt(client, {
    hash,
  })
  if (i === 1) exp1Address = contractAddress
  exports.push(`export const exp${i}Address = '${contractAddress}'`)
}

{
  // Deploy IthacaAccountOld contract.
  const hash = await deployContract(client, {
    abi: IthacaAccountOld.abi,
    args: [orchestratorAddress!],
    bytecode: IthacaAccountOld.code,
    chain: null,
  })
  const { contractAddress } = await waitForTransactionReceipt(client, {
    hash,
  })

  // Deploy EIP7702Proxy contract.
  const hash_2 = await deployContract(client, {
    abi: EIP7702Proxy.abi,
    args: [contractAddress!, account.address],
    bytecode: EIP7702Proxy.code,
    chain: null,
  })
  const { contractAddress: contractAddress_2 } =
    await waitForTransactionReceipt(client, {
      hash: hash_2,
    })
  exports.push(`export const accountOldProxyAddress = '${contractAddress_2}'`)
}

{
  // Deploy IthacaAccountNew contract.
  const hash = await deployContract(client, {
    abi: IthacaAccountNew.abi,
    args: [orchestratorAddress!],
    bytecode: IthacaAccountNew.code,
    chain: null,
  })
  const { contractAddress } = await waitForTransactionReceipt(client, {
    hash,
  })

  // Deploy EIP7702Proxy contract.
  const hash_2 = await deployContract(client, {
    abi: EIP7702Proxy.abi,
    args: [contractAddress!, account.address],
    bytecode: EIP7702Proxy.code,
    chain: null,
  })
  const { contractAddress: contractAddress_2 } =
    await waitForTransactionReceipt(client, {
      hash: hash_2,
    })
  exports.push(`export const accountNewProxyAddress = '${contractAddress_2}'`)
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
      exp1Address!,
      Value.fromEther('10'),
    ],
    bytecode: ExperimentERC721.code,
    chain: null,
  })
  const { contractAddress } = await waitForTransactionReceipt(client, {
    hash,
  })
  exports.push(`export const expNftAddress = '${contractAddress}'`)
}

{
  // Deploy Simulator contract.
  const hash = await deployContract(client, {
    abi: Simulator.abi,
    args: [],
    bytecode: Simulator.code,
    chain: null,
  })
  const { contractAddress } = await waitForTransactionReceipt(client, {
    hash,
  })
  exports.push(`export const simulatorAddress = '${contractAddress}'`)
}

{
  // Deploy SimpleFunder contract.
  const hash = await deployContract(client, {
    abi: SimpleFunder.abi,
    args: [account.address, orchestratorAddress!, account.address],
    bytecode: SimpleFunder.code,
    chain: null,
  })
  const { contractAddress } = await waitForTransactionReceipt(client, {
    hash,
  })
  exports.push(`export const funderAddress = '${contractAddress}'`)

  // Fund contract.
  await setBalance(client, {
    address: contractAddress!,
    value: Value.fromEther('10000'),
  })
  await writeContract(client, {
    abi: ExperimentERC20.abi,
    address: exp1Address!,
    args: [contractAddress!, Value.fromEther('10000')],
    functionName: 'mint',
    chain: null,
  })

  // Set gas wallets.
  const hash_2 = await writeContract(client, {
    abi: SimpleFunder.abi,
    address: contractAddress!,
    args: [Anvil.accounts.map((x) => x.address), true],
    chain: null,
    functionName: 'setGasWallet',
  })
  await waitForTransactionReceipt(client, {
    hash: hash_2,
  })
}

{
  // Deploy Escrow contract.
  const hash = await deployContract(client, {
    abi: Escrow.abi,
    args: [],
    bytecode: Escrow.code,
    chain: null,
  })
  const { contractAddress } = await waitForTransactionReceipt(client, {
    hash,
  })
  exports.push(`export const escrowAddress = '${contractAddress}'`)
}

{
  // Deploy SimpleSettler contract.
  const hash = await deployContract(client, {
    abi: SimpleSettler.abi,
    args: [account.address],
    bytecode: SimpleSettler.code,
    chain: null,
  })
  const { contractAddress } = await waitForTransactionReceipt(client, {
    hash,
  })
  exports.push(`export const settlerAddress = '${contractAddress}'`)
}

// Deploy Multicall contract.
await setCode(client, {
  address: '0xcA11bde05977b3631167028862bE2a173976CA11',
  bytecode:
    '0x6080604052600436106100f35760003560e01c80634d2301cc1161008a578063a8b0574e11610059578063a8b0574e1461025a578063bce38bd714610275578063c3077fa914610288578063ee82ac5e1461029b57600080fd5b80634d2301cc146101ec57806372425d9d1461022157806382ad56cb1461023457806386d516e81461024757600080fd5b80633408e470116100c65780633408e47014610191578063399542e9146101a45780633e64a696146101c657806342cbb15c146101d957600080fd5b80630f28c97d146100f8578063174dea711461011a578063252dba421461013a57806327e86d6e1461015b575b600080fd5b34801561010457600080fd5b50425b6040519081526020015b60405180910390f35b61012d610128366004610a85565b6102ba565b6040516101119190610bbe565b61014d610148366004610a85565b6104ef565b604051610111929190610bd8565b34801561016757600080fd5b50437fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0140610107565b34801561019d57600080fd5b5046610107565b6101b76101b2366004610c60565b610690565b60405161011193929190610cba565b3480156101d257600080fd5b5048610107565b3480156101e557600080fd5b5043610107565b3480156101f857600080fd5b50610107610207366004610ce2565b73ffffffffffffffffffffffffffffffffffffffff163190565b34801561022d57600080fd5b5044610107565b61012d610242366004610a85565b6106ab565b34801561025357600080fd5b5045610107565b34801561026657600080fd5b50604051418152602001610111565b61012d610283366004610c60565b61085a565b6101b7610296366004610a85565b610a1a565b3480156102a757600080fd5b506101076102b6366004610d18565b4090565b60606000828067ffffffffffffffff8111156102d8576102d8610d31565b60405190808252806020026020018201604052801561031e57816020015b6040805180820190915260008152606060208201528152602001906001900390816102f65790505b5092503660005b8281101561047757600085828151811061034157610341610d60565b6020026020010151905087878381811061035d5761035d610d60565b905060200281019061036f9190610d8f565b6040810135958601959093506103886020850185610ce2565b73ffffffffffffffffffffffffffffffffffffffff16816103ac6060870187610dcd565b6040516103ba929190610e32565b60006040518083038185875af1925050503d80600081146103f7576040519150601f19603f3d011682016040523d82523d6000602084013e6103fc565b606091505b50602080850191909152901515808452908501351761046d577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260846000fd5b5050600101610325565b508234146104e6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601a60248201527f4d756c746963616c6c333a2076616c7565206d69736d6174636800000000000060448201526064015b60405180910390fd5b50505092915050565b436060828067ffffffffffffffff81111561050c5761050c610d31565b60405190808252806020026020018201604052801561053f57816020015b606081526020019060019003908161052a5790505b5091503660005b8281101561068657600087878381811061056257610562610d60565b90506020028101906105749190610e42565b92506105836020840184610ce2565b73ffffffffffffffffffffffffffffffffffffffff166105a66020850185610dcd565b6040516105b4929190610e32565b6000604051808303816000865af19150503d80600081146105f1576040519150601f19603f3d011682016040523d82523d6000602084013e6105f6565b606091505b5086848151811061060957610609610d60565b602090810291909101015290508061067d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060448201526064016104dd565b50600101610546565b5050509250929050565b43804060606106a086868661085a565b905093509350939050565b6060818067ffffffffffffffff8111156106c7576106c7610d31565b60405190808252806020026020018201604052801561070d57816020015b6040805180820190915260008152606060208201528152602001906001900390816106e55790505b5091503660005b828110156104e657600084828151811061073057610730610d60565b6020026020010151905086868381811061074c5761074c610d60565b905060200281019061075e9190610e76565b925061076d6020840184610ce2565b73ffffffffffffffffffffffffffffffffffffffff166107906040850185610dcd565b60405161079e929190610e32565b6000604051808303816000865af19150503d80600081146107db576040519150601f19603f3d011682016040523d82523d6000602084013e6107e0565b606091505b506020808401919091529015158083529084013517610851577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260646000fd5b50600101610714565b6060818067ffffffffffffffff81111561087657610876610d31565b6040519080825280602002602001820160405280156108bc57816020015b6040805180820190915260008152606060208201528152602001906001900390816108945790505b5091503660005b82811015610a105760008482815181106108df576108df610d60565b602002602001015190508686838181106108fb576108fb610d60565b905060200281019061090d9190610e42565b925061091c6020840184610ce2565b73ffffffffffffffffffffffffffffffffffffffff1661093f6020850185610dcd565b60405161094d929190610e32565b6000604051808303816000865af19150503d806000811461098a576040519150601f19603f3d011682016040523d82523d6000602084013e61098f565b606091505b506020830152151581528715610a07578051610a07576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060448201526064016104dd565b506001016108c3565b5050509392505050565b6000806060610a2b60018686610690565b919790965090945092505050565b60008083601f840112610a4b57600080fd5b50813567ffffffffffffffff811115610a6357600080fd5b6020830191508360208260051b8501011115610a7e57600080fd5b9250929050565b60008060208385031215610a9857600080fd5b823567ffffffffffffffff811115610aaf57600080fd5b610abb85828601610a39565b90969095509350505050565b6000815180845260005b81811015610aed57602081850181015186830182015201610ad1565b81811115610aff576000602083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b600082825180855260208086019550808260051b84010181860160005b84811015610bb1578583037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe001895281518051151584528401516040858501819052610b9d81860183610ac7565b9a86019a9450505090830190600101610b4f565b5090979650505050505050565b602081526000610bd16020830184610b32565b9392505050565b600060408201848352602060408185015281855180845260608601915060608160051b870101935082870160005b82811015610c52577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0888703018452610c40868351610ac7565b95509284019290840190600101610c06565b509398975050505050505050565b600080600060408486031215610c7557600080fd5b83358015158114610c8557600080fd5b9250602084013567ffffffffffffffff811115610ca157600080fd5b610cad86828701610a39565b9497909650939450505050565b838152826020820152606060408201526000610cd96060830184610b32565b95945050505050565b600060208284031215610cf457600080fd5b813573ffffffffffffffffffffffffffffffffffffffff81168114610bd157600080fd5b600060208284031215610d2a57600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81833603018112610dc357600080fd5b9190910192915050565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1843603018112610e0257600080fd5b83018035915067ffffffffffffffff821115610e1d57600080fd5b602001915036819003821315610a7e57600080fd5b8183823760009101908152919050565b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc1833603018112610dc357600080fd5b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa1833603018112610dc357600080fdfea2646970667358221220bb2b5c71a328032f97c676ae39a1ec2148d3e5d6f73d95e9b17910152d61f16264736f6c634300080c0033',
})

writeFileSync(
  resolve(import.meta.dirname, '../test/src/_generated/addresses.ts'),
  exports.join('\n'),
)

stop()

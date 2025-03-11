import { http, createTestClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import {
  deployContract,
  getCode,
  getTransactionReceipt,
  setCode,
} from 'viem/actions'
import { afterAll, beforeAll, vi } from 'vitest'

import * as Chains from '../src/core/Chains.js'
import * as Delegation from '../src/core/internal/_generated/contracts/Delegation.js'
import * as EntryPoint from '../src/core/internal/_generated/contracts/EntryPoint.js'

import * as Anvil from './src/anvil.js'
import { ExperimentERC20 } from './src/contracts.js'
import * as Relay from './src/relay.js'

const account = privateKeyToAccount(Anvil.accounts[0]!.privateKey)

beforeAll(async () => {
  await Promise.all(
    Object.values(Anvil.instances).map(async (instance) => {
      await fetch(`${instance.rpcUrl}/start`)

      const chain = Object.values(Chains).find(
        (x) => 'rpcUrls' in x && x.id === instance.config.chainId,
      ) as Chains.Chain
      if (!chain) throw new Error('Chain not found')

      const client = createTestClient({
        mode: 'anvil',
        transport: http(instance.rpcUrl),
      })

      {
        // Deploy EntryPoint contract.
        const hash = await deployContract(client, {
          abi: EntryPoint.abi,
          bytecode: EntryPoint.code,
          account: privateKeyToAccount(Anvil.accounts[0]!.privateKey),
          chain: null,
          args: [account.address],
        })
        const { contractAddress } = await getTransactionReceipt(client, {
          hash,
        })
        const code = await getCode(client, {
          address: contractAddress!,
        })
        await setCode(client, {
          address: chain.contracts.entryPoint.address,
          bytecode: code!,
        })
      }

      {
        // Deploy Delegation contract.
        const hash = await deployContract(client, {
          abi: Delegation.abi,
          bytecode: Delegation.code,
          args: [chain.contracts.entryPoint.address],
          account,
          chain: null,
        })
        const { contractAddress } = await getTransactionReceipt(client, {
          hash,
        })
        const code = await getCode(client, {
          address: contractAddress!,
        })
        await setCode(client, {
          address: chain.contracts.delegation.address,
          bytecode: code!,
        })
      }

      // Deploy ExperimentalERC20 contract.
      for (const address of ExperimentERC20.address) {
        await setCode(client, {
          address,
          bytecode: ExperimentERC20.code,
        })
      }
    }),
  )

  await Promise.all(
    Object.values(Relay.instances).map(async (instance) => {
      await fetch(`${instance.rpcUrl}/start`)
    }),
  )
})

afterAll(async () => {
  vi.restoreAllMocks()
})

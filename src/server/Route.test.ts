import { Hex, Value } from 'ox'
import { Key } from 'porto'
import { Route } from 'porto/server'
import { readContract, waitForCallsStatus } from 'viem/actions'
import { describe, expect, test } from 'vitest'
import * as TestActions from '../../test/src/actions.js'
import * as TestConfig from '../../test/src/config.js'
import * as Http from '../../test/src/http.js'
import type { ExactPartial } from '../core/internal/types.js'
import * as RelayActions from '../viem/RelayActions.js'

const porto = TestConfig.getPorto()
const client = TestConfig.getRelayClient(porto)
const contracts = await TestConfig.getContracts(porto)

describe('merchant', () => {
  let server: Http.Server | undefined
  async function setup(options: ExactPartial<Route.merchant.Options> = {}) {
    const merchantKey = Key.createSecp256k1()
    const merchantAccount = await TestActions.createAccount(client, {
      deploy: true,
      keys: [merchantKey],
    })

    const route = Route.merchant({
      ...porto.config,
      ...options,
      address: merchantAccount.address,
      key: merchantKey.privateKey!(),
    })

    if (server) await server.closeAsync()
    server = await Http.createServer(route.listener)

    return { merchantAccount, route, server }
  }

  test('behavior: simple sponsor', async () => {
    const { server, merchantAccount } = await setup()

    const userKey = Key.createHeadlessWebAuthnP256()
    const userAccount = await TestActions.createAccount(client, {
      keys: [userKey],
    })

    const userBalance_pre = await readContract(client, {
      ...contracts.exp1,
      args: [userAccount.address],
      functionName: 'balanceOf',
    })
    const merchantBalance_pre = await readContract(client, {
      ...contracts.exp1,
      args: [merchantAccount.address],
      functionName: 'balanceOf',
    })

    const result = await RelayActions.sendCalls(client, {
      account: userAccount,
      calls: [
        {
          abi: contracts.exp1.abi,
          args: [userAccount.address, Value.fromEther('1')],
          functionName: 'mint',
          to: contracts.exp1.address,
        },
      ],
      merchantUrl: server.url,
    })

    await waitForCallsStatus(client, {
      id: result.id,
    })

    const userBalance_post = await readContract(client, {
      ...contracts.exp1,
      args: [userAccount.address],
      functionName: 'balanceOf',
    })
    const merchantBalance_post = await readContract(client, {
      ...contracts.exp1,
      args: [merchantAccount.address],
      functionName: 'balanceOf',
    })

    // Check if user was credited with 1 EXP.
    expect(userBalance_post).toBe(userBalance_pre + Value.fromEther('1'))

    // Check if merchant was debited the fee payment.
    expect(merchantBalance_post).toBeLessThan(merchantBalance_pre)
  })

  test('behavior: conditional sponsoring', async () => {
    const { server, merchantAccount } = await setup({
      sponsor: (request) =>
        // Only sponsor calls targeting the exp1Address
        request.calls.every((call) => call.to === contracts.exp1.address),
    })

    const userKey = Key.createHeadlessWebAuthnP256()
    const userAccount = await TestActions.createAccount(client, {
      keys: [userKey],
    })

    {
      // Test 1: Calls satisfy the sponsor condition.
      const userBalance_pre = await readContract(client, {
        ...contracts.exp1,
        args: [userAccount.address],
        functionName: 'balanceOf',
      })
      const merchantBalance_pre = await readContract(client, {
        ...contracts.exp1,
        args: [merchantAccount.address],
        functionName: 'balanceOf',
      })

      const result = await RelayActions.sendCalls(client, {
        account: userAccount,
        calls: [
          {
            abi: contracts.exp1.abi,
            args: [userAccount.address, Value.fromEther('1')],
            functionName: 'mint',
            to: contracts.exp1.address,
          },
        ],
        merchantUrl: server.url,
      })

      await waitForCallsStatus(client, {
        id: result.id,
      })

      const userBalance_post = await readContract(client, {
        ...contracts.exp1,
        args: [userAccount.address],
        functionName: 'balanceOf',
      })
      const merchantBalance_post = await readContract(client, {
        ...contracts.exp1,
        args: [merchantAccount.address],
        functionName: 'balanceOf',
      })

      // Check if user was credited with 1 EXP.
      expect(userBalance_post).toBe(userBalance_pre + Value.fromEther('1'))

      // Check if merchant was debited the fee payment.
      expect(merchantBalance_post).toBeLessThan(merchantBalance_pre)
    }

    {
      // Test 2: Calls do not satisfy the sponsor condition.
      const userBalance_pre = await readContract(client, {
        ...contracts.exp2,
        args: [userAccount.address],
        functionName: 'balanceOf',
      })
      const merchantBalance_pre = await readContract(client, {
        ...contracts.exp1,
        args: [merchantAccount.address],
        functionName: 'balanceOf',
      })

      const result = await RelayActions.sendCalls(client, {
        account: userAccount,
        calls: [
          {
            abi: contracts.exp2.abi,
            args: [userAccount.address, Value.fromEther('1')],
            functionName: 'mint',
            to: contracts.exp2.address,
          },
        ],
        merchantUrl: server.url,
      })

      await waitForCallsStatus(client, {
        id: result.id,
      })

      const userBalance_post = await readContract(client, {
        ...contracts.exp2,
        args: [userAccount.address],
        functionName: 'balanceOf',
      })
      const merchantBalance_post = await readContract(client, {
        ...contracts.exp1,
        args: [merchantAccount.address],
        functionName: 'balanceOf',
      })

      // Check if user was credited with 1 EXP.
      expect(userBalance_post).toBe(userBalance_pre + Value.fromEther('1'))

      // Check if merchant was NOT debited the fee payment.
      expect(merchantBalance_post).toEqual(merchantBalance_pre)
    }
  })

  // TODO: unskip when merchant account works with interop
  test.skip('behavior: sponsor w/ required funds', async () => {
    const { server, merchantAccount } = await setup()

    const chain_dest = TestConfig.chains[1]
    const client_dest = TestConfig.getRelayClient(porto, {
      chainId: chain_dest!.id,
    })

    // Deploy merchant account on destination chain.
    const { id } = await RelayActions.sendCalls(client_dest, {
      account: merchantAccount,
      calls: [],
    })
    await waitForCallsStatus(client_dest, {
      id,
    })

    await TestActions.setBalance(client_dest, {
      address: merchantAccount.address,
    })

    const userKey = Key.createHeadlessWebAuthnP256()
    const userAccount = await TestActions.createAccount(client, {
      keys: [userKey],
    })

    const userBalance_pre = await readContract(client, {
      ...contracts.exp1,
      args: [userAccount.address],
      functionName: 'balanceOf',
    })
    const merchantBalance_pre = await readContract(client, {
      ...contracts.exp1,
      args: [merchantAccount.address],
      functionName: 'balanceOf',
    })

    const alice = Hex.random(20)

    const result = await RelayActions.sendCalls(client, {
      account: userAccount,
      calls: [
        {
          abi: contracts.exp1.abi,
          args: [alice, Value.fromEther('50')],
          functionName: 'transfer',
          to: contracts.exp1.address,
        },
      ],
      chain: chain_dest,
      merchantUrl: server.url,
      requiredFunds: [
        {
          address: contracts.exp1.address,
          value: Value.fromEther('50'),
        },
      ],
    })

    await waitForCallsStatus(client, {
      id: result.id,
    })

    const userBalance_post = await readContract(client, {
      ...contracts.exp1,
      args: [userAccount.address],
      functionName: 'balanceOf',
    })
    const merchantBalance_post = await readContract(client, {
      ...contracts.exp1,
      args: [merchantAccount.address],
      functionName: 'balanceOf',
    })

    // Check if user was credited with 1 EXP.
    expect(userBalance_post).toBeLessThanOrEqual(
      userBalance_pre - Value.fromEther('50'),
    )

    // Check if merchant was debited the fee payment.
    expect(merchantBalance_post).toBeLessThan(merchantBalance_pre)
  })

  test('behavior: route response (GET)', async () => {
    const { route } = await setup()

    const response = await route.hono.request('http://localhost')
    expect(response.status).toBe(200)
    expect(response.headers.get('access-control-allow-origin')).toBe('*')
    expect(await response.text()).toBe('ok')
  })

  test('error: contract error', async () => {
    const { server } = await setup()

    const userKey = Key.createHeadlessWebAuthnP256()
    const userAccount = await TestActions.createAccount(client, {
      keys: [userKey],
    })

    await expect(() =>
      RelayActions.sendCalls(client, {
        account: userAccount,
        calls: [
          {
            abi: contracts.exp1.abi,
            args: [
              '0x0000000000000000000000000000000000000000',
              userAccount.address,
              Value.fromEther('1'),
            ],
            functionName: 'transferFrom',
            to: contracts.exp1.address,
          },
        ],
        merchantUrl: server.url,
      }),
    ).rejects.toThrowError('InsufficientAllowance')
  })

  test('error: invalid params', async () => {
    const { server } = await setup()

    const response = await fetch(server.url, {
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'wallet_prepareCalls',
        params: ['foo'],
      }),
      method: 'POST',
    }).then((r) => r.json())
    expect(response).toMatchInlineSnapshot(`
      {
        "error": {
          "code": -32602,
          "message": "Validation failed with 1 error:

      - at \`params[0]\`: Expected object. ",
        },
        "id": 1,
        "jsonrpc": "2.0",
      }
    `)
  })
})

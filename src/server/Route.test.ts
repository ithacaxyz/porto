import { Value } from 'ox'
import { Key, ServerActions } from 'porto'
import { Route } from 'porto/server'
import { readContract, waitForCallsStatus } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import * as TestActions from '../../test/src/actions.js'
import * as Http from '../../test/src/http.js'
import {
  exp1Abi,
  exp1Address,
  exp2Abi,
  exp2Address,
  getPorto,
} from '../../test/src/porto.js'
import type { ExactPartial } from '../core/internal/types.js'

const { client, porto } = getPorto()

const feeToken = exp1Address

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

describe('merchant', () => {
  test('behavior: simple', async () => {
    const { server, merchantAccount } = await setup()

    const userKey = Key.createHeadlessWebAuthnP256()
    const userAccount = await TestActions.createAccount(client, {
      keys: [userKey],
    })

    const userBalance_pre = await readContract(client, {
      abi: exp1Abi,
      address: exp1Address,
      args: [userAccount.address],
      functionName: 'balanceOf',
    })
    const merchantBalance_pre = await readContract(client, {
      abi: exp1Abi,
      address: exp1Address,
      args: [merchantAccount.address],
      functionName: 'balanceOf',
    })

    const result = await ServerActions.sendCalls(client, {
      account: userAccount,
      calls: [
        {
          abi: exp1Abi,
          args: [userAccount.address, Value.fromEther('1')],
          functionName: 'mint',
          to: exp1Address,
        },
      ],
      feeToken,
      merchantRpcUrl: server.url,
    })

    await waitForCallsStatus(client, {
      id: result.id,
    })

    const userBalance_post = await readContract(client, {
      abi: exp1Abi,
      address: exp1Address,
      args: [userAccount.address],
      functionName: 'balanceOf',
    })
    const merchantBalance_post = await readContract(client, {
      abi: exp1Abi,
      address: exp1Address,
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
        request.calls.every((call) => call.to === exp1Address),
    })

    const userKey = Key.createHeadlessWebAuthnP256()
    const userAccount = await TestActions.createAccount(client, {
      keys: [userKey],
    })

    {
      // Test 1: Calls satisfy the sponsor condition.
      const userBalance_pre = await readContract(client, {
        abi: exp1Abi,
        address: exp1Address,
        args: [userAccount.address],
        functionName: 'balanceOf',
      })
      const merchantBalance_pre = await readContract(client, {
        abi: exp1Abi,
        address: exp1Address,
        args: [merchantAccount.address],
        functionName: 'balanceOf',
      })

      const result = await ServerActions.sendCalls(client, {
        account: userAccount,
        calls: [
          {
            abi: exp1Abi,
            args: [userAccount.address, Value.fromEther('1')],
            functionName: 'mint',
            to: exp1Address,
          },
        ],
        feeToken,
        merchantRpcUrl: server.url,
      })

      await waitForCallsStatus(client, {
        id: result.id,
      })

      const userBalance_post = await readContract(client, {
        abi: exp1Abi,
        address: exp1Address,
        args: [userAccount.address],
        functionName: 'balanceOf',
      })
      const merchantBalance_post = await readContract(client, {
        abi: exp1Abi,
        address: exp1Address,
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
        abi: exp2Abi,
        address: exp2Address,
        args: [userAccount.address],
        functionName: 'balanceOf',
      })
      const merchantBalance_pre = await readContract(client, {
        abi: exp1Abi,
        address: exp1Address,
        args: [merchantAccount.address],
        functionName: 'balanceOf',
      })

      const result = await ServerActions.sendCalls(client, {
        account: userAccount,
        calls: [
          {
            abi: exp2Abi,
            args: [userAccount.address, Value.fromEther('1')],
            functionName: 'mint',
            to: exp2Address,
          },
        ],
        feeToken,
        merchantRpcUrl: server.url,
      })

      await waitForCallsStatus(client, {
        id: result.id,
      })

      const userBalance_post = await readContract(client, {
        abi: exp2Abi,
        address: exp2Address,
        args: [userAccount.address],
        functionName: 'balanceOf',
      })
      const merchantBalance_post = await readContract(client, {
        abi: exp1Abi,
        address: exp1Address,
        args: [merchantAccount.address],
        functionName: 'balanceOf',
      })

      // Check if user was credited with 1 EXP.
      expect(userBalance_post).toBe(userBalance_pre + Value.fromEther('1'))

      // Check if merchant was NOT debited the fee payment.
      expect(merchantBalance_post).toEqual(merchantBalance_pre)
    }
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
      ServerActions.sendCalls(client, {
        account: userAccount,
        calls: [
          {
            abi: exp1Abi,
            args: [
              '0x0000000000000000000000000000000000000000',
              userAccount.address,
              Value.fromEther('1'),
            ],
            functionName: 'transferFrom',
            to: exp1Address,
          },
        ],
        feeToken,
        merchantRpcUrl: server.url,
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
          "message": "Expected wallet_prepareCalls.Parameters, actual "foo"
      Path: params.0

      Details: Request.Request
      └─ { readonly method: "wallet_prepareCalls"; readonly params: readonly [wallet_prepareCalls.Parameters]; readonly _returnType: unknown; readonly id: number; readonly jsonrpc: "2.0" }
         └─ ["params"]
            └─ readonly [wallet_prepareCalls.Parameters]
               └─ [0]
                  └─ Expected wallet_prepareCalls.Parameters, actual "foo"",
        },
        "id": 1,
        "jsonrpc": "2.0",
      }
    `)
  })
})

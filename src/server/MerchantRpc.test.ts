import { createRequestListener } from '@mjackson/node-fetch-server'
import { Value } from 'ox'
import { Key, ServerActions } from 'porto'
import { MerchantRpc } from 'porto/server'
import { readContract, waitForCallsStatus } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import * as TestActions from '../../test/src/actions.js'
import * as Anvil from '../../test/src/anvil.js'
import * as Http from '../../test/src/http.js'
import { exp1Abi, exp1Address, getPorto } from '../../test/src/porto.js'

const { client, porto } = getPorto()

const feeToken = exp1Address

let server: Http.Server | undefined
async function setup() {
  const merchantKey = Key.createSecp256k1()
  const merchantAccount = await TestActions.createAccount(client, {
    deploy: true,
    keys: [merchantKey],
  })

  const handler = MerchantRpc.requestHandler({
    address: merchantAccount.address,
    key: {
      privateKey: merchantKey.privateKey!(),
      type: merchantKey.type,
    },
    transports: porto._internal.config.transports,
  })

  if (server) await server.closeAsync()
  server = await Http.createServer(createRequestListener(handler))

  return { merchantAccount, server }
}

describe.runIf(Anvil.enabled)('rpcHandler', () => {
  test('default', async () => {
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

  test('error: eoa is merchant', async () => {
    const { server, merchantAccount } = await setup()

    await expect(() =>
      ServerActions.sendCalls(client, {
        account: merchantAccount,
        calls: [],
        feeToken,
        merchantRpcUrl: server.url,
      }),
    ).rejects.toThrowError()
  })
})

import { createRequestListener } from '@mjackson/node-fetch-server'
import { Value } from 'ox'
import { Key, RpcServer } from 'porto'
import { Sponsor } from 'porto/server'
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
  const sponsorKey = Key.createSecp256k1()
  const sponsorAccount = await TestActions.createAccount(client, {
    deploy: true,
    keys: [sponsorKey],
  })

  const handler = Sponsor.rpcHandler({
    address: sponsorAccount.address,
    key: {
      privateKey: sponsorKey.privateKey!(),
      type: sponsorKey.type,
    },
    transports: porto._internal.config.transports,
  })

  if (server) await server.closeAsync()
  server = await Http.createServer(createRequestListener(handler))

  return { server, sponsorAccount }
}

describe.runIf(Anvil.enabled)('rpcHandler', () => {
  test('default', async () => {
    const { server, sponsorAccount } = await setup()

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
    const sponsorBalance_pre = await readContract(client, {
      abi: exp1Abi,
      address: exp1Address,
      args: [sponsorAccount.address],
      functionName: 'balanceOf',
    })

    const result = await RpcServer.sendCalls(client, {
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
      sponsorUrl: server.url,
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
    const sponsorBalance_post = await readContract(client, {
      abi: exp1Abi,
      address: exp1Address,
      args: [sponsorAccount.address],
      functionName: 'balanceOf',
    })

    // Check if user was credited with 1 EXP.
    expect(userBalance_post).toBe(userBalance_pre + Value.fromEther('1'))

    // Check if sponsor was debited the fee payment.
    expect(sponsorBalance_post).toBeLessThan(sponsorBalance_pre)
  })

  test('error: contract error', async () => {
    const { server } = await setup()

    const userKey = Key.createHeadlessWebAuthnP256()
    const userAccount = await TestActions.createAccount(client, {
      keys: [userKey],
    })

    await expect(() =>
      RpcServer.sendCalls(client, {
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
        sponsorUrl: server.url,
      }),
    ).rejects.toThrowError('InsufficientAllowance')
  })

  test('error: eoa is sponsor', async () => {
    const { server, sponsorAccount } = await setup()

    await expect(() =>
      RpcServer.sendCalls(client, {
        account: sponsorAccount,
        calls: [],
        feeToken,
        sponsorUrl: server.url,
      }),
    ).rejects.toThrowError()
  })
})

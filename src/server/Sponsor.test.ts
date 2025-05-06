import * as Msw from 'msw'
import { setupServer } from 'msw/node'
import { Value } from 'ox'
import { Key } from 'porto/internal'
import { waitForCallsStatus } from 'viem/actions'
import { readContract } from 'viem/actions'
import { describe, expect, test } from 'vitest'
import * as TestActions from '../../test/src/actions.js'
import { exp1Abi, exp1Address, getPorto } from '../../test/src/porto.js'
import * as Relay from '../core/internal/relay.js'
import * as Sponsor from './Sponsor.js'

const { client, porto } = getPorto()

const feeToken = exp1Address
const sponsorUrl = 'https://mys1cksponsor.com/'

describe('rpcHandler', () => {
  test('default', async () => {
    const sponsorKey = Key.createSecp256k1()
    const sponsorAccount = await TestActions.createAccount(client, {
      deploy: true,
      keys: [sponsorKey],
    })

    const handle = Sponsor.rpcHandler({
      address: sponsorAccount.address,
      key: {
        privateKey: sponsorKey.privateKey!(),
        type: sponsorKey.type,
      },
      transports: porto._internal.config.transports,
    })
    setupServer(
      Msw.http.post(sponsorUrl, ({ request }) => handle(request)),
    ).listen({
      onUnhandledRequest: 'bypass',
    })

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

    const result = await Relay.sendCalls(client, {
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
      sponsorUrl,
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
})

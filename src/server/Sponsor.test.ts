import * as Msw from 'msw'
import { SetupServerApi, setupServer } from 'msw/node'
import { Value } from 'ox'
import { Key } from 'porto/internal'
import { maxUint256 } from 'viem'
import { setBalance, waitForCallsStatus } from 'viem/actions'
import { readContract } from 'viem/actions'
import { beforeEach, describe, expect, test } from 'vitest'
import { entryPointAddress } from '../../test/src/_generated/addresses.js'
import * as TestActions from '../../test/src/actions.js'
import * as Anvil from '../../test/src/anvil.js'
import { exp1Abi, exp1Address, getPorto } from '../../test/src/porto.js'
import * as Relay from '../core/internal/relay.js'
import * as Sponsor from './Sponsor.js'

const { client, porto } = getPorto()

const feeToken = exp1Address
const sponsorUrl = 'https://mys1cksponsor.com/'

beforeEach(async () => {
  // TODO: remove this once relay adds support.
  // ref: https://github.com/ithacaxyz/account/pull/147/files#diff-83bc094c48a5467697336e47dba6e1bc868967fa192c85cf282937a6946ba18bR544-R549
  await setBalance(client, {
    address: entryPointAddress,
    value: maxUint256,
  })
})

let server: SetupServerApi | undefined
async function setup() {
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

  server?.close()
  server = setupServer(
    Msw.http.post(sponsorUrl, ({ request }) => handle(request)),
  )
  server.listen({
    onUnhandledRequest: 'bypass',
  })

  return { server, sponsorAccount }
}

describe.runIf(Anvil.enabled)('rpcHandler', () => {
  test('default', async () => {
    const { sponsorAccount } = await setup()

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

  test('error: contract error', async () => {
    await setup()

    const userKey = Key.createHeadlessWebAuthnP256()
    const userAccount = await TestActions.createAccount(client, {
      keys: [userKey],
    })

    await expect(() =>
      Relay.sendCalls(client, {
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
        sponsorUrl,
      }),
    ).rejects.toThrowError('InsufficientAllowance')
  })

  test('error: eoa is sponsor', async () => {
    const { sponsorAccount } = await setup()

    await expect(() =>
      Relay.sendCalls(client, {
        account: sponsorAccount,
        calls: [],
        feeToken,
        sponsorUrl,
      }),
    ).rejects.toThrowError()
  })
})

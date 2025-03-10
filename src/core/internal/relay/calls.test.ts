import { Hex } from 'ox'
import { readContract } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import * as TestActions from '../../../../test/src/actions.js'
import { ExperimentERC20 } from '../../../../test/src/contracts.js'
import { getPorto } from '../../../../test/src/porto.js'
import * as Delegation from '../delegation.js'
import * as Key from '../key.js'
import * as Calls from './calls.js'

const { client } = getPorto({
  transports: {
    relay: true,
  },
})

describe('send', () => {
  test('default', async () => {
    const key = Key.createP256({ role: 'admin' })
    const { account } = await TestActions.createRelayAccount(client, {
      keys: [key],
    })

    const result = await Calls.send(client, {
      account,
      calls: [
        {
          to: ExperimentERC20.address[1],
          abi: ExperimentERC20.abi,
          functionName: 'mint',
          args: [account.address, 100n],
        },
      ],
      feeToken: ExperimentERC20.address[0],
      nonce: randomNonce(),
    })

    expect(result.id).toBeDefined()

    expect(
      await readContract(client, {
        address: ExperimentERC20.address[1],
        abi: ExperimentERC20.abi,
        functionName: 'balanceOf',
        args: [account.address],
      }),
    ).toBe(100n)
  })
})

describe('prepare + sendPrepared', () => {
  test('default', async () => {
    const key = Key.createP256({ role: 'admin' })
    const { account } = await TestActions.createRelayAccount(client, {
      keys: [key],
    })

    const request = await Calls.prepare(client, {
      account,
      calls: [
        {
          to: ExperimentERC20.address[1],
          abi: ExperimentERC20.abi,
          functionName: 'mint',
          args: [account.address, 100n],
        },
      ],
      feeToken: ExperimentERC20.address[0],
      key,
      nonce: randomNonce(),
    })

    const signature = await Key.sign(key, {
      payload: request.digest,
    })

    const result = await Calls.sendPrepared(client, {
      ...request,
      signature,
    })

    expect(result.id).toBeDefined()

    expect(
      await readContract(client, {
        address: ExperimentERC20.address[1],
        abi: ExperimentERC20.abi,
        functionName: 'balanceOf',
        args: [account.address],
      }),
    ).toBe(100n)
  })
})

describe('e2e', () => {
  describe('behavior: arbitrary calls', () => {
    test('mint erc20', async () => {
      const key = Key.createP256({ role: 'admin' })
      const { account } = await TestActions.createRelayAccount(client, {
        keys: [key],
      })

      const result = await Calls.send(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'mint',
            args: [account.address, 100n],
          },
        ],
        feeToken: ExperimentERC20.address[0],
        nonce: randomNonce(),
      })

      expect(result.id).toBeDefined()

      expect(
        await readContract(client, {
          address: ExperimentERC20.address[1],
          abi: ExperimentERC20.abi,
          functionName: 'balanceOf',
          args: [account.address],
        }),
      ).toBe(100n)
    })

    // TODO: unskip when feeToken optional
    test.skip('mint erc20; no fee token (ETH)', async () => {
      const key = Key.createP256({ role: 'admin' })
      const { account } = await TestActions.createRelayAccount(client, {
        keys: [key],
      })

      const result = await Calls.send(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'mint',
            args: [account.address, 100n],
          },
        ],
        nonce: randomNonce(),
      })

      expect(result.id).toBeDefined()

      expect(
        await readContract(client, {
          address: ExperimentERC20.address[1],
          abi: ExperimentERC20.abi,
          functionName: 'balanceOf',
          args: [account.address],
        }),
      ).toBe(100n)
    })

    test('noop', async () => {
      const key = Key.createP256({ role: 'admin' })
      const { account } = await TestActions.createRelayAccount(client, {
        keys: [key],
      })

      const result = await Calls.send(client, {
        account,
        calls: [
          {
            to: '0x0000000000000000000000000000000000000000',
          },
        ],
        feeToken: ExperimentERC20.address[0],
        nonce: randomNonce(),
      })

      expect(result.id).toBeDefined()
    })
  })

  describe('behavior: authorize keys', () => {
    test('authorize admin keys', async () => {
      const key = Key.createP256({ role: 'admin' })
      const { account } = await TestActions.createRelayAccount(client, {
        keys: [key],
      })

      const keys = [
        Key.createP256({ role: 'admin' }),
        await Key.createWebCryptoP256({ role: 'admin' }),
      ] as const

      const result = await Calls.send(client, {
        account,
        authorizeKeys: keys,
        calls: [],
        feeToken: ExperimentERC20.address[0],
        nonce: randomNonce(),
      })

      expect(result.id).toBeDefined()

      const [key_1, key_2, key_3] = [
        await Delegation.keyAt(client, {
          account,
          index: 0,
        }),
        await Delegation.keyAt(client, {
          account,
          index: 1,
        }),
        await Delegation.keyAt(client, {
          account,
          index: 2,
        }),
      ]

      expect(key_1.publicKey).toBe(key.publicKey)
      expect(key_2.publicKey).toBe(keys[0].publicKey)
      expect(key_3.publicKey).toBe(keys[1].publicKey)
    })

    test('authorize key with previous key', async () => {
      const key = Key.createP256({ role: 'admin' })
      const { account } = await TestActions.createRelayAccount(client, {
        keys: [key],
      })

      // Authorize new key
      const newKey = Key.createP256({ role: 'admin' })
      {
        const result = await Calls.send(client, {
          account,
          authorizeKeys: [newKey],
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })

        expect(result.id).toBeDefined()
      }

      // Call with new key
      {
        const result = await Calls.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: newKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })

        expect(result.id).toBeDefined()

        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }
    })
  })

  describe('behavior: call permissions', () => {
    // failing
    test.skip('primary admin key', async () => {
      const adminKey = Key.createP256({
        permissions: { calls: [{ to: ExperimentERC20.address[1] }] },
        role: 'admin',
      })

      const { account } = await TestActions.createRelayAccount(client, {
        keys: [adminKey],
      })

      {
        const result = await Calls.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(result.id).toBeDefined()
        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }
    })

    test('session key', async () => {
      const adminKey = Key.createP256({ role: 'admin' })
      const sessionKey = await Key.createWebCryptoP256({
        role: 'session',
        permissions: {
          calls: [
            {
              to: ExperimentERC20.address[1],
            },
          ],
        },
      })

      const { account } = await TestActions.createRelayAccount(client, {
        keys: [adminKey, sessionKey],
      })

      {
        const result = await Calls.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(result.id).toBeDefined()
        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }
    })

    // failing
    test.skip('session key; multiple calls', async () => {
      const adminKey = Key.createP256({ role: 'admin' })
      const sessionKey = await Key.createWebCryptoP256({
        role: 'session',
        permissions: {
          calls: [
            {
              to: ExperimentERC20.address[1],
            },
          ],
        },
      })

      const { account } = await TestActions.createRelayAccount(client, {
        keys: [adminKey, sessionKey],
      })

      {
        const result = await Calls.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(result.id).toBeDefined()
        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }

      {
        const result = await Calls.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(result.id).toBeDefined()
        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(200n)
      }
    })
  })

  describe('behavior: spend permissions', () => {
    // failing
    test.skip('admin key', async () => {
      const adminKey = Key.createP256({
        permissions: {
          spend: [
            { limit: 100n, token: ExperimentERC20.address[1], period: 'day' },
          ],
        },
        role: 'admin',
      })

      const { account } = await TestActions.createRelayAccount(client, {
        keys: [adminKey],
      })

      await Calls.send(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'mint',
            args: [account.address, 100n],
          },
        ],
        feeToken: ExperimentERC20.address[0],
        nonce: randomNonce(),
      })

      await Calls.send(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'transfer',
            args: ['0x0000000000000000000000000000000000000000', 50n],
          },
        ],
        feeToken: ExperimentERC20.address[0],
        nonce: randomNonce(),
      })

      await Calls.send(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'transfer',
            args: ['0x0000000000000000000000000000000000000000', 100n],
          },
        ],
        feeToken: ExperimentERC20.address[0],
        nonce: randomNonce(),
      })
    })
  })

  // failing
  test.skip('behavior: spend permissions; account: new; signer: P256 session key', async () => {
    const adminKey = Key.createP256({ role: 'admin' })

    const sessionKey = await Key.createWebCryptoP256({
      role: 'session',
      permissions: {
        calls: [
          {
            to: ExperimentERC20.address[1],
          },
        ],
        spend: [
          { limit: 100n, token: ExperimentERC20.address[1], period: 'day' },
        ],
      },
    })

    const { account } = await TestActions.createRelayAccount(client, {
      keys: [adminKey, sessionKey],
    })

    {
      const result = await Calls.send(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'mint',
            args: [account.address, 100n],
          },
        ],
        key: sessionKey,
        feeToken: ExperimentERC20.address[0],
        nonce: randomNonce(),
      })
      expect(result.id).toBeDefined()
      expect(
        await readContract(client, {
          address: ExperimentERC20.address[1],
          abi: ExperimentERC20.abi,
          functionName: 'balanceOf',
          args: [account.address],
        }),
      ).toBe(100n)
    }

    await Calls.send(client, {
      account,
      calls: [
        {
          to: ExperimentERC20.address[1],
          abi: ExperimentERC20.abi,
          functionName: 'transfer',
          args: [account.address, 1n],
        },
      ],
      key: sessionKey,
      feeToken: ExperimentERC20.address[0],
      nonce: randomNonce(),
    })
  })
})

function randomNonce() {
  return Hex.toBigInt(
    Hex.concat(
      // multichain flag (0 = single chain, 0xc1d0 = multi-chain)
      Hex.fromNumber(0, { size: 2 }),
      // sequence key
      Hex.random(22),
      // sequential nonce
      Hex.fromNumber(0, { size: 8 }),
    ),
  )
}

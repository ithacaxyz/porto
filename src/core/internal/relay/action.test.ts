import { AbiFunction, Hex, Value } from 'ox'
import { readContract, waitForTransactionReceipt } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import { getAccount } from '../../../../test/src/account.js'
import { ExperimentERC20 } from '../../../../test/src/contracts.js'
import { getPorto } from '../../../../test/src/porto.js'
import * as Account from '../account.js'
import * as Call from '../call.js'
import * as Delegation from '../delegation.js'
import * as Key from '../key.js'
import * as Action from './action.js'

const { client, delegation } = getPorto({
  transports: {
    relay: true,
  },
})
// const { client, delegation } = getPorto({
//   chain: Chains.odysseyTestnet,
//   transports: {
//     default: http(),
//     relay: http('https://relay-staging.ithaca.xyz'),
//   },
// })

describe('send', () => {
  test('default', async () => {
    const { account } = await getAccount(client)

    // delegate
    {
      const { hash } = await Action.send(client, {
        account,
        delegation,
        calls: [],
        gasToken: ExperimentERC20.address[0],
      })
      await waitForTransactionReceipt(client, { hash })
    }

    const alice = Hex.random(20)
    const value = Value.fromEther('0.0001')

    const { hash } = await Action.send(client, {
      account,
      calls: [
        {
          to: ExperimentERC20.address[0],
          abi: ExperimentERC20.abi,
          functionName: 'transfer',
          args: [alice, value],
        },
      ],
      gasToken: ExperimentERC20.address[0],
    })

    await waitForTransactionReceipt(client, { hash })

    expect(
      await readContract(client, {
        abi: ExperimentERC20.abi,
        address: ExperimentERC20.address[0],
        functionName: 'balanceOf',
        args: [alice],
      }),
    ).toBe(value)
  })

  test('behavior: delegation', async () => {
    const { account } = await getAccount(client)

    const key = Key.createP256({
      role: 'admin',
    })

    const { hash } = await Action.send(client, {
      account,
      delegation,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      gasToken: ExperimentERC20.address[0],
    })

    await waitForTransactionReceipt(client, { hash })

    const { publicKey } = await Delegation.keyAt(client, {
      account: account.address,
      index: 0,
    })

    expect(publicKey).toEqual(key.publicKey)
  })

  describe('behavior: authorize', () => {
    test('delegated: false, key: EOA, keyToAuthorize: P256', async () => {
      const { account } = await getAccount(client)

      const key = Key.createP256({
        role: 'admin',
      })

      const { hash } = await Action.send(client, {
        account,
        delegation,
        calls: [
          Call.authorize({
            key,
          }),
        ],
        gasToken: ExperimentERC20.address[0],
      })

      await waitForTransactionReceipt(client, { hash })

      const { publicKey } = await Delegation.keyAt(client, {
        account: account.address,
        index: 0,
      })

      expect(publicKey).toEqual(key.publicKey)

      // test an arbitrary action
      {
        const alice = Hex.random(20)
        const value = Value.fromEther('0.0001')

        const { hash } = await Action.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[0],
              abi: ExperimentERC20.abi,
              functionName: 'transfer',
              args: [alice, value],
            },
          ],
          key,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })

        expect(
          await readContract(client, {
            abi: ExperimentERC20.abi,
            address: ExperimentERC20.address[0],
            functionName: 'balanceOf',
            args: [alice],
          }),
        ).toBe(value)
      }
    })

    test('delegated: true, key: EOA, keyToAuthorize: P256', async () => {
      const { account } = await getAccount(client)

      // delegate
      {
        const { hash } = await Action.send(client, {
          account,
          delegation,
          calls: [],
          gasToken: ExperimentERC20.address[0],
        })
        await waitForTransactionReceipt(client, { hash })
      }

      const key = Key.createP256({
        role: 'admin',
      })

      const { hash } = await Action.send(client, {
        account,
        calls: [
          Call.authorize({
            key,
          }),
        ],
        gasToken: ExperimentERC20.address[0],
      })

      await waitForTransactionReceipt(client, { hash })

      const { publicKey } = await Delegation.keyAt(client, {
        account: account.address,
        index: 0,
      })

      expect(publicKey).toEqual(key.publicKey)

      // test an arbitrary action
      {
        const alice = Hex.random(20)
        const value = Value.fromEther('0.0001')

        const { hash } = await Action.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[0],
              abi: ExperimentERC20.abi,
              functionName: 'transfer',
              args: [alice, value],
            },
          ],
          key,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })

        expect(
          await readContract(client, {
            abi: ExperimentERC20.abi,
            address: ExperimentERC20.address[0],
            functionName: 'balanceOf',
            args: [alice],
          }),
        ).toBe(value)
      }
    })

    test('key: P256, keyToAuthorize: P256', async () => {
      const { account } = await getAccount(client)

      // delegate
      {
        const { hash } = await Action.send(client, {
          account,
          delegation,
          calls: [],
          gasToken: ExperimentERC20.address[0],
        })
        await waitForTransactionReceipt(client, { hash })
      }

      const key = Key.createP256({
        role: 'admin',
      })

      // authorize P256 key
      {
        const { hash } = await Action.send(client, {
          account,
          calls: [
            Call.authorize({
              key,
            }),
          ],
          gasToken: ExperimentERC20.address[0],
        })
        await waitForTransactionReceipt(client, { hash })
      }

      const anotherKey = Key.createP256({
        role: 'admin',
      })

      // authorize another P256 key with previously authorized key
      {
        const { hash } = await Action.send(client, {
          account,
          calls: [
            Call.authorize({
              key: anotherKey,
            }),
          ],
          key,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })

        expect(
          (
            await Delegation.keyAt(client, {
              account: account.address,
              index: 1,
            })
          ).publicKey,
        ).toEqual(anotherKey.publicKey)
      }

      // test an arbitrary action
      {
        const alice = Hex.random(20)
        const value = Value.fromEther('0.0001')

        const { hash } = await Action.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[0],
              abi: ExperimentERC20.abi,
              functionName: 'transfer',
              args: [alice, value],
            },
          ],
          key: anotherKey,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })

        expect(
          await readContract(client, {
            abi: ExperimentERC20.abi,
            address: ExperimentERC20.address[0],
            functionName: 'balanceOf',
            args: [alice],
          }),
        ).toBe(value)
      }
    })

    test('key: P256, keyToAuthorize: WebCryptoP256', async () => {
      const { account } = await getAccount(client)

      // delegate
      {
        const { hash } = await Action.send(client, {
          account,
          delegation,
          calls: [],
          gasToken: ExperimentERC20.address[0],
        })
        await waitForTransactionReceipt(client, { hash })
      }

      const key = Key.createP256({
        role: 'admin',
      })

      // authorize P256 key
      {
        const { hash } = await Action.send(client, {
          account,
          calls: [
            Call.authorize({
              key,
            }),
          ],
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })
      }

      const anotherKey = await Key.createWebCryptoP256({
        role: 'admin',
      })

      // authorize another P256 key with previously authorized key
      {
        const { hash } = await Action.send(client, {
          account,
          calls: [
            Call.authorize({
              key: anotherKey,
            }),
          ],
          key,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })

        expect(
          (
            await Delegation.keyAt(client, {
              account: account.address,
              index: 1,
            })
          ).publicKey,
        ).toEqual(anotherKey.publicKey)
      }

      // test an arbitrary action
      {
        const alice = Hex.random(20)
        const value = Value.fromEther('0.0001')

        const { hash } = await Action.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[0],
              abi: ExperimentERC20.abi,
              functionName: 'transfer',
              args: [alice, value],
            },
          ],
          key: anotherKey,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })

        expect(
          await readContract(client, {
            abi: ExperimentERC20.abi,
            address: ExperimentERC20.address[0],
            functionName: 'balanceOf',
            args: [alice],
          }),
        ).toBe(value)
      }
    })

    test('key: P256, keyToAuthorize: P256 (session)', async () => {
      const { account } = await getAccount(client)

      // delegate
      {
        const { hash } = await Action.send(client, {
          account,
          delegation,
          calls: [],
          gasToken: ExperimentERC20.address[0],
        })
        await waitForTransactionReceipt(client, { hash })
      }

      const key = Key.createP256({
        role: 'admin',
      })

      // authorize P256 key
      {
        const { hash } = await Action.send(client, {
          account,
          calls: [
            Call.authorize({
              key,
            }),
          ],
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })
      }

      const anotherKey = Key.createP256({
        role: 'session',
      })

      // authorize another P256 key with previously authorized key
      {
        const { hash } = await Action.send(client, {
          account,
          calls: [
            Call.authorize({
              key: anotherKey,
            }),
            Call.setCanExecute({
              key: anotherKey,
            }),
          ],
          key,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })

        expect(
          (
            await Delegation.keyAt(client, {
              account: account.address,
              index: 1,
            })
          ).publicKey,
        ).toEqual(anotherKey.publicKey)
      }

      // test an arbitrary action
      {
        const alice = Hex.random(20)
        const value = Value.fromEther('0.0001')

        const { hash } = await Action.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[0],
              abi: ExperimentERC20.abi,
              functionName: 'transfer',
              args: [alice, value],
            },
          ],
          key: anotherKey,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })

        expect(
          await readContract(client, {
            abi: ExperimentERC20.abi,
            address: ExperimentERC20.address[0],
            functionName: 'balanceOf',
            args: [alice],
          }),
        ).toBe(value)
      }
    })
  })

  test('behavior: spend limits', async () => {
    const key = Key.createP256({
      role: 'admin',
    })
    const { account } = await getAccount(client, { keys: [key] })

    // delegate, authorize, and set spend limit.
    {
      const { hash } = await Action.send(client, {
        account,
        calls: [
          Call.authorize({
            key,
          }),
          Call.setSpendLimit({
            key,
            period: 'day',
            limit: Value.fromEther('1.5'),
            token: ExperimentERC20.address[0],
          }),
        ],
        delegation,
        gasToken: ExperimentERC20.address[0],
        multichain: false,
      })

      await waitForTransactionReceipt(client, { hash })
    }

    const alice = Hex.random(20)

    // successful transfer.
    {
      const { hash } = await Action.send(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[0],
            abi: ExperimentERC20.abi,
            functionName: 'transfer',
            args: [alice, Value.fromEther('1')],
          },
        ],
        gasToken: ExperimentERC20.address[0],
      })
      await waitForTransactionReceipt(client, { hash })
      expect(
        await readContract(client, {
          abi: ExperimentERC20.abi,
          address: ExperimentERC20.address[0],
          functionName: 'balanceOf',
          args: [alice],
        }),
      ).toEqual(Value.fromEther('1'))
    }

    // spend limit exceeded (2 EXP > 1.5 EXP).
    await expect(() =>
      Action.send(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[0],
            abi: ExperimentERC20.abi,
            functionName: 'transfer',
            args: [alice, Value.fromEther('1')],
          },
        ],
        gasToken: ExperimentERC20.address[0],
      }),
    ).rejects.toThrowError('ExceededSpendLimit')
  })

  describe('behavior: execution guards', async () => {
    test('default', async () => {
      const { account } = await getAccount(client)

      const key = Key.createP256({
        role: 'admin',
      })

      // authorize admin P256 key
      {
        const { hash } = await Action.send(client, {
          account,
          calls: [
            Call.authorize({
              key,
            }),
          ],
          delegation,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })
      }

      const anotherKey = Key.createP256({
        role: 'session',
      })

      // authorize and set guard.
      {
        const { hash } = await Action.send(client, {
          account,
          calls: [
            Call.authorize({
              key: anotherKey,
            }),
            Call.setCanExecute({
              key: anotherKey,
            }),
          ],
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })

        expect(
          (
            await Delegation.keyAt(client, {
              account: account.address,
              index: 1,
            })
          ).publicKey,
        ).toEqual(anotherKey.publicKey)
      }

      // test an arbitrary action
      {
        const alice = Hex.random(20)
        const value = Value.fromEther('0.0001')

        const { hash } = await Action.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[0],
              abi: ExperimentERC20.abi,
              functionName: 'transfer',
              args: [alice, value],
            },
          ],
          key: anotherKey,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })

        expect(
          await readContract(client, {
            abi: ExperimentERC20.abi,
            address: ExperimentERC20.address[0],
            functionName: 'balanceOf',
            args: [alice],
          }),
        ).toBe(value)
      }
    })

    test('behavior: target scope', async () => {
      const { account } = await getAccount(client)

      const key = Key.createP256({
        role: 'admin',
      })

      // authorize admin P256 key
      {
        const { hash } = await Action.send(client, {
          account,
          calls: [
            Call.authorize({
              key,
            }),
          ],
          delegation,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })
      }

      const anotherKey = Key.createP256({
        role: 'session',
      })

      // authorize and set guard.
      {
        const { hash } = await Action.send(client, {
          account,
          calls: [
            Call.authorize({
              key: anotherKey,
            }),
            Call.setCanExecute({
              key: anotherKey,
              to: ExperimentERC20.address[0],
            }),
          ],
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })

        expect(
          (
            await Delegation.keyAt(client, {
              account: account.address,
              index: 1,
            })
          ).publicKey,
        ).toEqual(anotherKey.publicKey)
      }

      const alice = Hex.random(20)
      const value = Value.fromEther('0.0001')

      // test an arbitrary action
      {
        const { hash } = await Action.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[0],
              abi: ExperimentERC20.abi,
              functionName: 'transfer',
              args: [alice, value],
            },
          ],
          key: anotherKey,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })

        expect(
          await readContract(client, {
            abi: ExperimentERC20.abi,
            address: ExperimentERC20.address[0],
            functionName: 'balanceOf',
            args: [alice],
          }),
        ).toBe(value)
      }

      // fails on different target
      await expect(() =>
        Action.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'transfer',
              args: [alice, value],
            },
          ],
          key: anotherKey,
          gasToken: ExperimentERC20.address[0],
        }),
      ).rejects.toThrowError('Unauthorized')
    })

    test('behavior: target scope + selector', async () => {
      const { account } = await getAccount(client)

      const key = Key.createP256({
        role: 'admin',
      })

      // authorize admin P256 key
      {
        const { hash } = await Action.send(client, {
          account,
          calls: [
            Call.authorize({
              key,
            }),
          ],
          delegation,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })
      }

      const anotherKey = Key.createP256({
        role: 'session',
      })

      // authorize and set guard.
      {
        const { hash } = await Action.send(client, {
          account,
          calls: [
            Call.authorize({
              key: anotherKey,
            }),
            Call.setCanExecute({
              key: anotherKey,
              to: ExperimentERC20.address[0],
              selector: AbiFunction.getSelector(
                AbiFunction.fromAbi(ExperimentERC20.abi, 'transfer'),
              ),
            }),
          ],
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })

        expect(
          (
            await Delegation.keyAt(client, {
              account: account.address,
              index: 1,
            })
          ).publicKey,
        ).toEqual(anotherKey.publicKey)
      }

      const alice = Hex.random(20)
      const value = Value.fromEther('0.0001')

      // test an arbitrary action
      {
        const { hash } = await Action.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[0],
              abi: ExperimentERC20.abi,
              functionName: 'transfer',
              args: [alice, value],
            },
          ],
          key: anotherKey,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })

        expect(
          await readContract(client, {
            abi: ExperimentERC20.abi,
            address: ExperimentERC20.address[0],
            functionName: 'balanceOf',
            args: [alice],
          }),
        ).toBe(value)
      }

      // fails on different selector
      await expect(() =>
        Action.send(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[0],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [alice, value],
            },
          ],
          key: anotherKey,
          gasToken: ExperimentERC20.address[0],
        }),
      ).rejects.toThrowError('Unauthorized')
    })
  })

  test('behavior: spend limit + execution guard', async () => {
    const { account } = await getAccount(client)

    const key = Key.createP256({
      role: 'admin',
    })

    // authorize admin P256 key
    {
      const { hash } = await Action.send(client, {
        account,
        calls: [
          Call.authorize({
            key,
          }),
        ],
        delegation,
        gasToken: ExperimentERC20.address[0],
      })

      await waitForTransactionReceipt(client, { hash })
    }

    const anotherKey = Key.createP256({
      role: 'session',
    })

    // authorize and set guard.
    {
      const { hash } = await Action.send(client, {
        account,
        calls: [
          Call.authorize({
            key: anotherKey,
          }),
          Call.setCanExecute({
            key: anotherKey,
            to: ExperimentERC20.address[0],
          }),
          Call.setSpendLimit({
            key: anotherKey,
            limit: Value.fromEther('1.5'),
            period: 'day',
            token: ExperimentERC20.address[0],
          }),
        ],
        gasToken: ExperimentERC20.address[0],
      })

      await waitForTransactionReceipt(client, { hash })

      expect(
        (
          await Delegation.keyAt(client, {
            account: account.address,
            index: 1,
          })
        ).publicKey,
      ).toEqual(anotherKey.publicKey)
    }

    const alice = Hex.random(20)
    const value = Value.fromEther('1')

    {
      const { hash } = await Action.send(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[0],
            abi: ExperimentERC20.abi,
            functionName: 'transfer',
            args: [alice, value],
          },
        ],
        key: anotherKey,
        gasToken: ExperimentERC20.address[0],
      })

      await waitForTransactionReceipt(client, { hash })

      expect(
        await readContract(client, {
          abi: ExperimentERC20.abi,
          address: ExperimentERC20.address[0],
          functionName: 'balanceOf',
          args: [alice],
        }),
      ).toBe(value)
    }

    await expect(() =>
      Action.send(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[0],
            abi: ExperimentERC20.abi,
            functionName: 'transfer',
            args: [alice, value],
          },
        ],
        key: anotherKey,
        gasToken: ExperimentERC20.address[0],
      }),
    ).rejects.toThrowError('ExceededSpendLimit')
  })

  test('error: contract error (insufficient erc20 balance)', async () => {
    const { account } = await getAccount(client)

    // delegate
    {
      const { hash } = await Action.send(client, {
        account,
        delegation,
        calls: [],
        gasToken: ExperimentERC20.address[0],
      })
      await waitForTransactionReceipt(client, { hash })
    }

    const alice = Hex.random(20)
    const value = Value.fromEther('9999999999')

    await expect(() =>
      Action.send(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[0],
            abi: ExperimentERC20.abi,
            functionName: 'transfer',
            args: [alice, value],
          },
        ],
        gasToken: ExperimentERC20.address[0],
      }),
    ).rejects.toThrowError('InsufficientBalance')
  })

  test('error: insufficient eth balance', async () => {
    const { account } = await getAccount(client)

    // delegate
    {
      const { hash } = await Action.send(client, {
        account,
        delegation,
        calls: [],
        gasToken: ExperimentERC20.address[0],
      })
      await waitForTransactionReceipt(client, { hash })
    }

    const alice = Hex.random(20)
    const value = Value.fromEther('9999999999')

    await expect(() =>
      Action.send(client, {
        account,
        calls: [
          {
            to: alice,
            value,
          },
        ],
        gasToken: ExperimentERC20.address[0],
      }),
    ).rejects.toThrowError('CallError')
  })
})

describe('prepare, sendPrepared', () => {
  test('default', async () => {
    const { account } = await getAccount(client)

    // delegate
    {
      const { hash } = await Action.send(client, {
        account,
        delegation,
        calls: [],
        gasToken: ExperimentERC20.address[0],
      })
      await waitForTransactionReceipt(client, { hash })
    }

    const alice = Hex.random(20)
    const value = Value.fromEther('0.0001')

    const { context, signPayloads } = await Action.prepare(client, {
      account,
      calls: [
        {
          to: ExperimentERC20.address[0],
          abi: ExperimentERC20.abi,
          functionName: 'transfer',
          args: [alice, value],
        },
      ],
      gasToken: ExperimentERC20.address[0],
    })

    const signatures = await Account.sign(account, {
      payloads: signPayloads,
    })

    const { hash } = await Action.sendPrepared(client, {
      ...context,
      signatures,
    })

    await waitForTransactionReceipt(client, { hash })

    expect(
      await readContract(client, {
        abi: ExperimentERC20.abi,
        address: ExperimentERC20.address[0],
        functionName: 'balanceOf',
        args: [alice],
      }),
    ).toBe(value)
  })
})

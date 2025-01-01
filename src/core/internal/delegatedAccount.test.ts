import { AbiFunction, P256, Secp256k1, Value } from 'ox'
import { privateKeyToAccount } from 'viem/accounts'
import { getBalance, readContract, setBalance } from 'viem/actions'
import {
  type SignAuthorizationParameters,
  signAuthorization,
} from 'viem/experimental'
import { describe, expect, test } from 'vitest'

import { porto } from '../../../test/src/config.js'
import * as DelegatedAccount from './delegatedAccount.js'
import { delegationAbi } from './generated.js'
import * as Key from './key.js'

const state = porto._internal.store.getState()
const client = state.client.extend(() => ({ mode: 'anvil' }))

async function setup(
  parameters: {
    delegate?: SignAuthorizationParameters['delegate'] | undefined
  } = {},
) {
  const { delegate } = parameters

  const privateKey = Secp256k1.randomPrivateKey()
  const eoa = privateKeyToAccount(privateKey)

  await setBalance(client, {
    address: eoa.address,
    value: Value.fromEther('2'),
  })

  const authorization = await signAuthorization(client, {
    account: eoa,
    contractAddress: state.delegation,
    delegate,
  })

  return { authorization, eoa }
}

describe('authorize', () => {
  test('sender = EOA, keysToAuthorize = [P256], executor = EOA', async () => {
    const { authorization, eoa } = await setup()

    const key = Key.fromP256({
      privateKey: P256.randomPrivateKey(),
      role: 'admin',
    })

    const account = DelegatedAccount.from({
      address: eoa.address,
      keys: [key],
    })

    await DelegatedAccount.execute(client, {
      account,
      authorizationList: [authorization],
      executor: eoa,
      calls: [
        {
          data: AbiFunction.encodeData(
            AbiFunction.fromAbi(delegationAbi, 'authorize'),
            [Key.serialize(key)],
          ),
          to: account.address,
        },
      ],
    })

    const serializedKey = await readContract(client, {
      abi: delegationAbi,
      address: account.address,
      functionName: 'keyAt',
      args: [0n],
    })

    expect(Key.deserialize(serializedKey)).toEqual({ ...key, sign: undefined })
  })
})

describe('execute', () => {
  test.skip('sender = EOA, executor = JSON-RPC', async () => {
    const { authorization, eoa } = await setup({ delegate: true })

    const alice = privateKeyToAccount(Secp256k1.randomPrivateKey())
    const bob = privateKeyToAccount(Secp256k1.randomPrivateKey())

    const balances_before = await Promise.all([
      getBalance(client, { address: eoa.address }),
      getBalance(client, { address: alice.address }),
      getBalance(client, { address: bob.address }),
    ])

    expect(balances_before[0]).toEqual(Value.fromEther('2'))
    expect(balances_before[1]).toEqual(Value.fromEther('0'))
    expect(balances_before[2]).toEqual(Value.fromEther('0'))

    await DelegatedAccount.execute(client, {
      account: eoa,
      authorizationList: [authorization],
      executor: null,
      calls: [
        { to: alice.address, value: Value.fromEther('1') },
        { to: bob.address, value: Value.fromEther('0.5') },
      ],
    })

    const balances_after = await Promise.all([
      getBalance(client, { address: eoa.address }),
      getBalance(client, { address: alice.address }),
      getBalance(client, { address: bob.address }),
    ])

    expect(balances_after[0]).not.toBeGreaterThan(
      balances_before[0] - Value.fromEther('1'),
    )
    expect(balances_after[1]).toEqual(Value.fromEther('1'))
    expect(balances_after[2]).toEqual(Value.fromEther('0.5'))
  })

  test('sender = EOA, executor = EOA', async () => {
    const { authorization, eoa } = await setup()

    const alice = privateKeyToAccount(Secp256k1.randomPrivateKey())
    const bob = privateKeyToAccount(Secp256k1.randomPrivateKey())

    const balances_before = await Promise.all([
      getBalance(client, { address: eoa.address }),
      getBalance(client, { address: alice.address }),
      getBalance(client, { address: bob.address }),
    ])

    expect(balances_before[0]).toEqual(Value.fromEther('2'))
    expect(balances_before[1]).toEqual(Value.fromEther('0'))
    expect(balances_before[2]).toEqual(Value.fromEther('0'))

    await DelegatedAccount.execute(client, {
      account: eoa,
      authorizationList: [authorization],
      calls: [
        { to: alice.address, value: Value.fromEther('1') },
        { to: bob.address, value: Value.fromEther('0.5') },
      ],
    })

    const balances_after = await Promise.all([
      getBalance(client, { address: eoa.address }),
      getBalance(client, { address: alice.address }),
      getBalance(client, { address: bob.address }),
    ])

    expect(balances_after[0]).not.toBeGreaterThan(
      balances_before[0] - Value.fromEther('1'),
    )
    expect(balances_after[1]).toEqual(Value.fromEther('1'))
    expect(balances_after[2]).toEqual(Value.fromEther('0.5'))
  })
})

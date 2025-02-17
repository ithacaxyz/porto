import { AbiFunction, Hex, Secp256k1, Value } from 'ox'
import { Chains, Delegation, Implementation, Porto, Storage } from 'porto'
import { http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { readContract, waitForTransactionReceipt } from 'viem/actions'
import { signAuthorization } from 'viem/experimental'
import { encodeCalls } from 'viem/experimental/erc7821'
import { describe, expect, test } from 'vitest'

import { getAccount } from '../../../../test/src/account.js'
import { ExperimentERC20 } from '../../../../test/src/contracts.js'
import { delegation } from '../../../../test/src/porto.js'
import * as Account from '../account.js'
import * as Call from '../call.js'
import * as Key from '../key.js'
import * as Relay from './relay.js'
import * as UserOp from './userOp.js'
import * as UserOpRequest from './userOpRequest.js'

// TODO: move to test/src/porto.ts
const porto = Porto.create({
  implementation: Implementation.local(),
  storage: Storage.memory(),
  transports: {
    [Chains.odysseyTestnet.id]: {
      default: http(),
      relay: http('https://relay-staging.ithaca.xyz'),
    },
  },
})
const client = Porto.getClient(porto)

describe('estimateFee', () => {
  test('behavior: new account', async () => {
    const { account } = await getAccount(client, {
      setBalance: false,
    })

    const key = Key.createP256({
      role: 'admin',
    })

    const request = UserOpRequest.prepare({
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      multichain: true,
    })

    const result = await Relay.estimateFee(client, {
      authorization: delegation,
      token: ExperimentERC20.address[0],
      request,
    })

    expect(result.amount).toBeGreaterThan(0n)
    expect(result.digest).toBeDefined()
    expect(result.gasEstimate).toBeGreaterThan(0)
    expect(result.nativeFeeEstimate).toMatchInlineSnapshot(`
      {
        "maxFeePerGas": 505n,
        "maxPriorityFeePerGas": 1n,
      }
    `)
    expect(result.token).toBeDefined()
    expect(result.ttl).toBeGreaterThan(0)
  })

  test('behavior: existing account', async () => {
    const account = Account.from('0x23ed230396be45ea109410276df89fe8d1ed95be')

    const request = UserOpRequest.prepare({
      account,
      calls: [
        {
          to: '0x0000000000000000000000000000000000000001',
        },
      ],
      multichain: true,
    })

    const result = await Relay.estimateFee(client, {
      token: ExperimentERC20.address[0],
      request,
    })

    expect(result.amount).toBeGreaterThan(0n)
    expect(result.digest).toBeDefined()
    expect(result.gasEstimate).toBeGreaterThan(0)
    expect(result.nativeFeeEstimate).toMatchInlineSnapshot(`
      {
        "maxFeePerGas": 505n,
        "maxPriorityFeePerGas": 1n,
      }
    `)
    expect(result.token).toBeDefined()
    expect(result.ttl).toBeGreaterThan(0)
  })
})

describe('e2e playground', () => {
  test.skip('existing', async () => {
    const key = Key.fromP256({
      privateKey: process.env.VITE_P256_PRIVATE_KEY as Hex.Hex,
      role: 'admin',
    })
    const account = Account.from({
      address: process.env.VITE_EOA_PRIVATE_KEY as Hex.Hex,
      keys: [key],
    })

    const alice = Hex.random(20)
    const value = Value.fromEther('0.0001')
    const transfer = AbiFunction.encodeData(
      AbiFunction.from('function transfer(address,uint256)'),
      [alice, value],
    )

    const request = UserOpRequest.prepare({
      account,
      calls: [
        {
          data: transfer,
          to: ExperimentERC20.address[0],
        },
      ],
    })

    const quote = await Relay.estimateFee(client, {
      request,
      token: ExperimentERC20.address[0],
    })

    const userOp = UserOp.from({
      ...request,
      combinedGas: quote.gasEstimate,
      paymentAmount: quote.amount,
      paymentToken: quote.token,
    })

    const payload = await UserOp.getSignPayload(client, userOp)

    const [signature] = await Account.sign(account, {
      payloads: [payload],
    })

    const userOp_signed = UserOp.from(userOp, { signature })

    const hash = await Relay.sendAction(client, {
      userOp: userOp_signed,
      quote,
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

  test.skip('behavior: new account', async () => {
    const privateKey = Secp256k1.randomPrivateKey()
    const account = Account.fromPrivateKey(privateKey)

    const key = Key.createP256({
      role: 'admin',
    })

    const calls = [
      Call.authorize({
        key,
      }),
    ]
    const data = encodeCalls(
      calls.map((c) => ({
        ...c,
        to: c.to === Call.self ? account.address : c.to,
      })),
    )

    let nonce = Hex.toBigInt(Hex.random(32))
    if (!(nonce & 1n)) nonce += 1n

    const userOpRequest = {
      eoa: account.address,
      executionData: data,
      nonce,
    } as const satisfies UserOpRequest.UserOpRequest

    const quote = await Relay.estimateFee(client, {
      authorization: delegation,
      token: ExperimentERC20.address[0],
      request: userOpRequest,
    })

    const userOp = {
      ...userOpRequest,
      combinedGas: quote.gasEstimate,
      payer: '0x0000000000000000000000000000000000000000',
      paymentAmount: quote.amount,
      paymentMaxAmount: quote.amount,
      paymentPerGas: 0n,
      paymentRecipient: '0x0000000000000000000000000000000000000000',
      paymentToken: ExperimentERC20.address[0],
    } as const satisfies UserOp.UserOp

    const payload = await UserOp.getSignPayload(client, userOp)

    const authorization = await signAuthorization(client, {
      account: privateKeyToAccount(privateKey),
      contractAddress: delegation,
      chainId: 0,
      sponsor: true,
    })

    const [signature] = await Account.sign(account, {
      payloads: [payload],
    })

    const userOp_signed = {
      ...userOp,
      signature,
    } as const satisfies UserOp.UserOp

    const hash = await Relay.sendAction(client, {
      authorization,
      userOp: userOp_signed,
      quote,
    })

    await waitForTransactionReceipt(client, { hash })

    const { publicKey } = await Delegation.keyAt(client, {
      account: account.address,
      index: 0,
    })

    expect(publicKey).toEqual(key.publicKey)
  })
})

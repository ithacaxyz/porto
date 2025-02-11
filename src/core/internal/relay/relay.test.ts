import { AbiFunction, Hex, Signature, Value } from 'ox'
import { Chains, Implementation, Porto, Storage } from 'porto'
import { http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { readContract, waitForTransactionReceipt } from 'viem/actions'
import { signAuthorization } from 'viem/experimental'
import { encodeCalls } from 'viem/experimental/erc7821'
import { describe, expect, test } from 'vitest'

import { getAccount } from '../../../../test/src/account.js'
import { ExperimentERC20 } from '../../../../test/src/contracts.js'
import { delegation } from '../../../../test/src/porto.js'
import * as Delegation from '../../Delegation.js'
import * as Account from '../account.js'
import * as Call from '../call.js'
import * as Key from '../key.js'
import * as Relay from './relay.js'
import type * as UserOp from './userOp.js'
import type * as UserOpRequest from './userOpRequest.js'

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
  test('default', async () => {
    const { account } = await getAccount(client, { setBalance: false })

    const key = Key.createP256({
      role: 'admin',
    })

    const { request, signPayloads } = await Delegation.prepareExecute(client, {
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      delegation,
    })

    const signature = Signature.from(
      await account.sign({ payload: signPayloads[1]! }),
    )

    const authorization = {
      contractAddress: request.authorization!.contractAddress,
      chainId: request.authorization!.chainId,
      nonce: request.authorization!.nonce,
      r: Hex.fromNumber(signature.r),
      s: Hex.fromNumber(signature.s),
      yParity: signature.yParity,
    } as const

    const data = encodeCalls(request.calls)

    const result = await Relay.estimateFee(client, {
      authorization,
      userOp: {
        eoa: account.address,
        executionData: data,
        nonce: request.nonce,
      },
    })

    expect(result.amount).toBe(0n)
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

describe('e2e', () => {
  test.skip('setup', async () => {
    const porto = Porto.create({
      implementation: Implementation.local(),
      storage: Storage.memory(),
    })
    const client = Porto.getClient(porto)

    const key = Key.createP256({
      role: 'admin',
    })

    const { account } = await getAccount(client, {
      keys: [key],
      setBalance: false,
    })

    await Delegation.execute(client, {
      account,
      calls: [Call.setCanExecute(), Call.authorize({ key })],
      delegation: '0xabe148edaa9046303c9b9d42243c23b9599484cd',
    })

    const mint = AbiFunction.encodeData(
      AbiFunction.from('function mint(address,uint256)'),
      [account.address, Value.fromEther('1000')],
    )

    const hash = await Delegation.execute(client, {
      account,
      calls: [{ data: mint, to: ExperimentERC20.address[0] }],
      key,
    })

    await waitForTransactionReceipt(client, {
      hash,
    })

    const balance = await readContract(client, {
      address: ExperimentERC20.address[0],
      abi: ExperimentERC20.abi,
      functionName: 'balanceOf',
      args: [account.address],
    })

    expect(balance).toEqual(Value.fromEther('1000'))
  })

  test('existing', async () => {
    // admin (p256) private key
    const privateKey =
      '0x255c21d50c3e743e5fb4dd3edc7196a70537486d8a27bb2ee096d68dd554c0cd' as const
    // eoa address
    const account = Account.from('0x54cfcc1ceb3354a500f19e7f6acb8917945731cc')

    const key = Key.fromP256({
      privateKey,
      role: 'admin',
    })

    const transfer = AbiFunction.encodeData(
      AbiFunction.from('function transfer(address,uint256)'),
      ['0x0000000000000000000000000000000000000000', Value.fromEther('1')],
    )

    const data = encodeCalls([
      {
        data: transfer,
        to: ExperimentERC20.address[0],
      },
    ])
    let nonce = Hex.toBigInt(Hex.random(32))
    if (nonce & 0n) nonce += 1n

    const userOp = {
      eoa: account.address,
      executionData: data,
      nonce,
    } as const satisfies UserOpRequest.UserOpRequest

    const quote = await Relay.estimateFee(client, {
      token: ExperimentERC20.address[0],
      userOp,
    })

    const [signature] = await Account.sign(account, {
      key,
      payloads: [quote.digest],
    })

    const userOp_signed = {
      ...userOp,
      combinedGas: quote.gasEstimate,
      payer: '0x0000000000000000000000000000000000000000',
      paymentAmount: quote.amount,
      paymentMaxAmount: quote.amount,
      paymentPerGas: 0n,
      paymentRecipient: '0x0000000000000000000000000000000000000000',
      paymentToken: ExperimentERC20.address[0],
      signature,
    } as const satisfies UserOp.UserOp

    const hash = await Relay.sendAction(client, {
      userOp: userOp_signed,
      quote,
    })
  })

  test.skip('new', async () => {
    // const { account } = await getAccount(client, { setBalance: false })

    const privateKey =
      '0xb80a420b66df4bd911e59393866dd90c33fa9440a9a4f4819d03f67f76285fdf' as const
    const account = privateKeyToAccount(privateKey)

    const key = Key.createP256({
      role: 'admin',
    })

    const authorization = await signAuthorization(client, {
      account,
      contractAddress: delegation,
      sponsor: true,
    })

    const data = encodeCalls([
      Call.authorize({
        key,
      }),
    ])

    let nonce = Hex.toBigInt(Hex.random(32))
    if (nonce & 0n) nonce += 1n

    const result = await Relay.estimateFee(client, {
      authorization,
      token: ExperimentERC20.address[0],
      userOp: {
        eoa: account.address,
        executionData: data,
        nonce,
      },
    })

    // const quote = await Relay.sendAction(relay, {
    //   userOp
    // })
  })
})

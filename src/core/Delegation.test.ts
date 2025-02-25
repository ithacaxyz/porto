import { AbiFunction, Value } from 'ox'
import { http, createClient } from 'viem'
import { odysseyTestnet } from 'viem/chains'
import { describe, expect, test } from 'vitest'

import * as Delegation from './Delegation.js'
import * as Account from './internal/account.js'

describe('simulate', () => {
  const account = Account.from({
    address: '0xb1596E2aD207c2Df8FA791A1a8a422E4146C5228',
  })
  const client = createClient({
    chain: odysseyTestnet,
    transport: http(),
  })
  const experimentalErc20 = '0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c'

  const stateOverrides = [
    {
      address: account.address,
      balance: Value.fromEther('10000'),
    },
  ]

  test('default', async () => {
    const { balances, results } = await Delegation.simulate(client, {
      account,
      calls: [
        // Out: 1 ETH (-1 ETH)
        {
          to: '0x0000000000000000000000000000000000000001',
          value: Value.fromEther('1'),
        },
        // Out: 2 ETH (-3 ETH)
        {
          to: '0x0000000000000000000000000000000000000002',
          value: Value.fromEther('2'),
        },
        // Out: 2 EXP (-2 EXP)
        {
          abi: [AbiFunction.from('function transfer(address, uint256)')],
          functionName: 'transfer',
          args: [
            '0x0000000000000000000000000000000000000003',
            Value.fromEther('2'),
          ],
          to: experimentalErc20,
        },
        // In: 1 EXP (-1 EXP)
        {
          abi: [AbiFunction.from('function mint(address, uint256)')],
          functionName: 'mint',
          args: [account.address, Value.fromEther('1')],
          to: experimentalErc20,
        },
      ],
      stateOverrides,
    })

    expect(balances[0]?.token).toMatchInlineSnapshot(`
      {
        "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "decimals": 18,
        "symbol": "ETH",
      }
    `)
    expect(balances[0]?.value.diff).toBeLessThan(-3)
    expect(balances[1]).toMatchInlineSnapshot(`
      {
        "token": {
          "address": "0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c",
          "decimals": 18,
          "symbol": "EXP",
        },
        "value": {
          "diff": -1000000000000000000n,
          "post": 99000000000000000000n,
          "pre": 100000000000000000000n,
        },
      }
    `)
    expect(
      results.map((x) => ({
        ...x,
        logs: x.logs?.map((x) => ({
          ...x,
          blockHash: null,
          blockNumber: null,
          blockTimestamp: null,
          transactionHash: null,
        })),
      })),
    ).toMatchInlineSnapshot(`
      [
        {
          "data": "0x",
          "gasUsed": 24000n,
          "logs": [],
          "result": null,
          "status": "success",
        },
        {
          "data": "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          "gasUsed": 21060n,
          "logs": [],
          "result": null,
          "status": "success",
        },
        {
          "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
          "gasUsed": 50926n,
          "logs": [
            {
              "address": "0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c",
              "blockHash": null,
              "blockNumber": null,
              "blockTimestamp": null,
              "data": "0x0000000000000000000000000000000000000000000000001bc16d674ec80000",
              "logIndex": 0,
              "removed": false,
              "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x000000000000000000000000b1596e2ad207c2df8fa791a1a8a422e4146c5228",
                "0x0000000000000000000000000000000000000000000000000000000000000003",
              ],
              "transactionHash": null,
              "transactionIndex": 2,
            },
          ],
          "result": undefined,
          "status": "success",
        },
        {
          "data": "0x",
          "gasUsed": 33893n,
          "logs": [
            {
              "address": "0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c",
              "blockHash": null,
              "blockNumber": null,
              "blockTimestamp": null,
              "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
              "logIndex": 1,
              "removed": false,
              "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                "0x000000000000000000000000b1596e2ad207c2df8fa791a1a8a422e4146c5228",
              ],
              "transactionHash": null,
              "transactionIndex": 3,
            },
          ],
          "result": undefined,
          "status": "success",
        },
      ]
    `)
  })
})

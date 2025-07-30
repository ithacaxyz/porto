import { describe, expect, test } from 'vitest'
import * as TestConfig from '../../../test/src/config.js'
import * as FeeTokens from './feeTokens.js'
import * as RequiredFunds from './requiredFunds.js'

const porto = TestConfig.getPorto()
const client = TestConfig.getServerClient(porto)
const feeTokens = await FeeTokens.fetch(client)

describe('toRpcServer', () => {
  test('param: empty requiredFunds array', async () => {
    const result = RequiredFunds.toRpcServer([], { feeTokens })

    expect(result).toMatchInlineSnapshot('[]')
  })

  test('behavior: with address - returns unchanged', async () => {
    const requiredFunds = [
      {
        address: '0x1234567890123456789012345678901234567890' as const,
        value: 1000000000000000000n,
      },
    ]

    const result = RequiredFunds.toRpcServer(requiredFunds, { feeTokens })

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "address": "0x1234567890123456789012345678901234567890",
          "value": 1000000000000000000n,
        },
      ]
    `)
  })

  test('behavior: with symbol - converts to address and value', async () => {
    const requiredFunds = [
      {
        symbol: 'EXP' as const,
        value: '1.5' as const,
      },
    ]

    const result = RequiredFunds.toRpcServer(requiredFunds, { feeTokens })

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "address": "0xaf3b0a5b4becc4fa1dfafe74580efa19a2ea49fa",
          "value": 1500000000000000000n,
        },
      ]
    `)
  })

  test('behavior: with integer value string', async () => {
    const result = RequiredFunds.toRpcServer(
      [
        {
          symbol: 'EXP',
          value: '2',
        },
      ],
      { feeTokens },
    )

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "address": "0xaf3b0a5b4becc4fa1dfafe74580efa19a2ea49fa",
          "value": 2000000000000000000n,
        },
      ]
    `)
  })

  test('behavior: mixed address and symbol entries', async () => {
    const result = RequiredFunds.toRpcServer(
      [
        {
          address: '0x1234567890123456789012345678901234567890',
          value: 1000000000000000000n,
        },
        {
          symbol: 'EXP',
          value: '0.5',
        },
        {
          symbol: 'USDC',
          value: '1',
        },
      ],
      { feeTokens },
    )

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "address": "0x1234567890123456789012345678901234567890",
          "value": 1000000000000000000n,
        },
        {
          "address": "0xaf3b0a5b4becc4fa1dfafe74580efa19a2ea49fa",
          "value": 500000000000000000n,
        },
        {
          "address": "0x036cbd53842c5426634e7929541ec2318f3dcf7e",
          "value": 1000000n,
        },
      ]
    `)
  })

  test('behavior: only non-interop tokens available', async () => {
    expect(() =>
      RequiredFunds.toRpcServer(
        [
          {
            symbol: 'ETH',
            value: '1.0',
          },
        ],
        { feeTokens },
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Interop token not found: ETH]',
    )
  })

  test('error: symbol not found in interop tokens', async () => {
    expect(() =>
      RequiredFunds.toRpcServer(
        [
          {
            symbol: 'UNKNOWN',
            value: '1.0',
          },
        ],
        { feeTokens },
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Interop token not found: UNKNOWN]',
    )
  })

  test('error: non-existent symbol with existing addresses', async () => {
    expect(() =>
      RequiredFunds.toRpcServer(
        [
          {
            address: '0x1234567890123456789012345678901234567890',
            value: 1000000000000000000n,
          },
          {
            symbol: 'NONEXISTENT',
            value: '1.0',
          },
        ],
        { feeTokens },
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Interop token not found: NONEXISTENT]',
    )
  })
})

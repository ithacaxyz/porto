import { describe, expect, test } from 'vitest'
import * as Anvil from '../../../test/src/anvil.js'
import * as TestConfig from '../../../test/src/config.js'
import * as RequiredFunds from './requiredFunds.js'
import * as Tokens from './tokens.js'

const porto = TestConfig.getPorto()
const client = TestConfig.getRelayClient(porto)
const tokens = await Tokens.getTokens(client)

// TODO: unskip when interop supported
describe.skip('toRelay', () => {
  test('param: empty requiredFunds array', async () => {
    const result = RequiredFunds.toRelay([], { tokens })

    expect(result).toMatchInlineSnapshot('[]')
  })

  test('behavior: with address - returns unchanged', async () => {
    const result = RequiredFunds.toRelay(
      [
        {
          address: '0x1234567890123456789012345678901234567890' as const,
          value: 1000000000000000000n,
        },
      ],
      { tokens },
    )

    expect(result.map((x) => x.value)).toMatchInlineSnapshot(`
      [
        1000000000000000000n,
      ]
    `)
  })

  test('behavior: with symbol - converts to address and value', async () => {
    const result = RequiredFunds.toRelay(
      [
        {
          symbol: 'EXP',
          value: '1.5',
        },
      ],
      { tokens },
    )

    expect(result[0]!.address).toBeDefined()
    expect(result[0]!.value).toMatchInlineSnapshot('1500000000000000000n')
  })

  test('behavior: with integer value string', async () => {
    const result = RequiredFunds.toRelay(
      [
        {
          symbol: 'EXP',
          value: '2',
        },
      ],
      { tokens },
    )

    expect(result[0]!.address).toBeDefined()
    expect(result[0]!.value).toMatchInlineSnapshot('2000000000000000000n')
  })

  test('behavior: mixed address and symbol entries', async () => {
    const result = RequiredFunds.toRelay(
      [
        {
          address: '0x1234567890123456789012345678901234567890',
          value: 1000000000000000000n,
        },
        {
          symbol: 'EXP',
          value: '0.5',
        },
      ],
      { tokens },
    )

    expect(result[0]!.address).toBeDefined()
    expect(result[0]!.value).toMatchInlineSnapshot('1000000000000000000n')
    expect(result[1]!.address).toBeDefined()
    expect(result[1]!.value).toMatchInlineSnapshot('500000000000000000n')
  })

  test('behavior: only non-interop tokens available', async () => {
    try {
      RequiredFunds.toRelay(
        [
          {
            symbol: Anvil.enabled ? 'ETH' : 'USDT',
            value: '1.0',
          },
        ],
        { tokens },
      )
    } catch (error) {
      expect((error as Error).message).toMatch(
        /interop token not found: (ETH|USDT)/,
      )
    }
  })

  test('error: symbol not found in interop tokens', async () => {
    expect(() =>
      RequiredFunds.toRelay(
        [
          {
            symbol: 'UNKNOWN',
            value: '1.0',
          },
        ],
        { tokens },
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: interop token not found: UNKNOWN]',
    )
  })

  test('error: non-existent symbol with existing addresses', async () => {
    expect(() =>
      RequiredFunds.toRelay(
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
        { tokens },
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: interop token not found: NONEXISTENT]',
    )
  })
})

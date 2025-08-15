import { describe, expect, test } from 'vitest'
import * as Anvil from '../../../test/src/anvil.js'
import * as TestConfig from '../../../test/src/config.js'
import * as FeeTokens from './feeTokens.js'

describe.runIf(Anvil.enabled)('resolve', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getServerClient(porto)

    const feeTokens = await FeeTokens.fetch(client)

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
          "uid": "ethereum",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "interop": true,
          "nativeRate": 1000000000000000000n,
          "symbol": "EXP",
          "uid": "exp",
        },
      ]
    `)
  })

  test('param: feeToken (as symbol)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getServerClient(porto)

    const feeTokens = await FeeTokens.fetch(client, {
      addressOrSymbol: 'ETH',
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
          "uid": "ethereum",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "interop": true,
          "nativeRate": 1000000000000000000n,
          "symbol": "EXP",
          "uid": "exp",
        },
      ]
    `)
  })

  test('param: feeToken (as address)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getServerClient(porto)

    const feeTokens = await FeeTokens.fetch(client, {
      addressOrSymbol: '0x0000000000000000000000000000000000000000',
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
          "uid": "ethereum",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "interop": true,
          "nativeRate": 1000000000000000000n,
          "symbol": "EXP",
          "uid": "exp",
        },
      ]
    `)
  })

  test('behavior: falls back to first fee token if override/default not found', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getServerClient(porto)

    const feeTokens = await FeeTokens.fetch(client, {
      addressOrSymbol: 'WAGMI',
    })
    expect(feeTokens.length).toBeGreaterThanOrEqual(1)
    expect(feeTokens[0]).toBeDefined()
  })
})

import { describe, expect, test } from 'vitest'
import * as Anvil from '../../../test/src/anvil.js'
import { getPorto } from '../../../test/src/porto.js'
import * as FeeTokens from './feeTokens.js'

describe.runIf(Anvil.enabled)('resolve', () => {
  test('default', async () => {
    const { client } = getPorto()

    const feeTokens = await FeeTokens.fetch(client)

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "kind": "ETH",
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "kind": "USDT",
          "nativeRate": 1000000000000000000n,
          "symbol": "EXP",
        },
      ]
    `)
  })

  test('behavior: with store', async () => {
    const { porto, client } = getPorto()

    const feeTokens = await FeeTokens.fetch(client, {
      store: porto._internal.store,
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "kind": "USDT",
          "nativeRate": 1000000000000000000n,
          "symbol": "EXP",
        },
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "kind": "ETH",
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
        },
      ]
    `)
  })

  test('param: feeToken (as symbol)', async () => {
    const { porto, client } = getPorto()

    const feeTokens = await FeeTokens.fetch(client, {
      addressOrSymbol: 'ETH',
      store: porto._internal.store,
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "kind": "ETH",
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "kind": "USDT",
          "nativeRate": 1000000000000000000n,
          "symbol": "EXP",
        },
      ]
    `)
  })

  test('param: feeToken (as address)', async () => {
    const { porto, client } = getPorto()

    const feeTokens = await FeeTokens.fetch(client, {
      addressOrSymbol: '0x0000000000000000000000000000000000000000',
      store: porto._internal.store,
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "kind": "ETH",
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "kind": "USDT",
          "nativeRate": 1000000000000000000n,
          "symbol": "EXP",
        },
      ]
    `)
  })

  test('behavior: default fee token', async () => {
    const { porto, client } = getPorto()

    porto._internal.store.setState({
      feeToken: 'ETH',
    })

    const feeTokens = await FeeTokens.fetch(client, {
      store: porto._internal.store,
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "kind": "ETH",
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "kind": "USDT",
          "nativeRate": 1000000000000000000n,
          "symbol": "EXP",
        },
      ]
    `)
  })
})

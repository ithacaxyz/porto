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
          "uid": "ethereum",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "interop": true,
          "nativeRate": 1000000000000000000n,
          "uid": "exp1",
        },
      ]
    `)
  })

  test('behavior: with store', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getServerClient(porto)

    const feeTokens = await FeeTokens.fetch(client, {
      store: porto._internal.store,
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "interop": true,
          "nativeRate": 1000000000000000000n,
          "uid": "exp1",
        },
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "uid": "ethereum",
        },
      ]
    `)
  })

  test('param: feeToken (as symbol)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getServerClient(porto)

    const feeTokens = await FeeTokens.fetch(client, {
      addressOrUid: 'ethereum',
      store: porto._internal.store,
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "uid": "ethereum",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "interop": true,
          "nativeRate": 1000000000000000000n,
          "uid": "exp1",
        },
      ]
    `)
  })

  test('param: feeToken (as address)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getServerClient(porto)

    const feeTokens = await FeeTokens.fetch(client, {
      addressOrUid: '0x0000000000000000000000000000000000000000',
      store: porto._internal.store,
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "uid": "ethereum",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "interop": true,
          "nativeRate": 1000000000000000000n,
          "uid": "exp1",
        },
      ]
    `)
  })

  test('behavior: default fee token', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getServerClient(porto)

    porto._internal.store.setState({
      feeToken: 'ethereum',
    })

    const feeTokens = await FeeTokens.fetch(client, {
      store: porto._internal.store,
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "uid": "ethereum",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "interop": true,
          "nativeRate": 1000000000000000000n,
          "uid": "exp1",
        },
      ]
    `)
  })

  test('behavior: falls back to first fee token if override/default not found', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getServerClient(porto)

    const feeTokens = await FeeTokens.fetch(client, {
      addressOrUid: 'wagmi',
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "interop": true,
          "nativeRate": 1000000000000000000n,
          "uid": "exp1",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "interop": true,
          "nativeRate": 1000000000000000000n,
          "uid": "exp1",
        },
      ]
    `)
  })
})

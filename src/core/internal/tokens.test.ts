import { describe, expect, test } from 'vitest'
import * as Anvil from '../../../test/src/anvil.js'
import * as TestConfig from '../../../test/src/config.js'
<<<<<<< HEAD
import * as Chains from '../Chains.js'
import * as Tokens from './tokens.js'

describe.runIf(!Anvil.enabled)('getTokens', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const tokens = await Tokens.getTokens(client)

    expect(
      tokens.map((x) => ({ ...x, nativeRate: null })),
    ).toMatchInlineSnapshot(`
      [
        {
          "address": "0x7c61733e8a9c6dac20afeb46e9c4ba96c5a9f7cf",
          "decimals": 18,
          "feeToken": true,
          "interop": true,
          "nativeRate": null,
          "symbol": "EXP2",
          "uid": "exp2",
        },
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "feeToken": true,
          "interop": true,
          "nativeRate": null,
          "symbol": "ETH",
          "uid": "teth",
        },
        {
          "address": "0x2d49a0e75c86779c391418214ec7e1b18e58bb34",
          "decimals": 18,
          "feeToken": true,
          "interop": true,
          "nativeRate": null,
          "symbol": "EXP",
          "uid": "exp1",
        },
      ]
    `)
  })

  test('behavior: chain', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const tokens = await Tokens.getTokens(client, { chain: Chains.polygon })

    expect(
      tokens.map((x) => ({ ...x, nativeRate: null })),
    ).toMatchInlineSnapshot(`
      [
        {
          "address": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
          "decimals": 6,
          "feeToken": true,
          "interop": true,
          "nativeRate": null,
          "symbol": "USDT0",
          "uid": "tether",
        },
        {
          "address": "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
          "decimals": 6,
          "feeToken": true,
          "interop": true,
          "nativeRate": null,
          "symbol": "USDC",
          "uid": "usd-coin",
        },
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "feeToken": true,
          "interop": false,
          "nativeRate": null,
          "symbol": "POL",
          "uid": "matic-network",
        },
      ]
    `)
  })
})

describe.runIf(!Anvil.enabled)('getToken', () => {
  test('param: addressOrSymbol (as symbol)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const token = await Tokens.getToken(client, { addressOrSymbol: 'EXP' })

    expect({ ...token, nativeRate: null }).toMatchInlineSnapshot(`
      {
        "address": "0x2d49a0e75c86779c391418214ec7e1b18e58bb34",
        "decimals": 18,
        "feeToken": true,
        "interop": true,
        "nativeRate": null,
        "symbol": "EXP",
        "uid": "exp1",
      }
    `)
  })

  test('param: addressOrSymbol (as native)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const token = await Tokens.getToken(client, {
      addressOrSymbol: 'native',
      chain: Chains.polygon,
    })

    expect({ ...token, nativeRate: null }).toMatchInlineSnapshot(`
      {
        "address": "0x0000000000000000000000000000000000000000",
        "decimals": 18,
        "feeToken": true,
        "interop": false,
        "nativeRate": null,
        "symbol": "POL",
        "uid": "matic-network",
      }
    `)
  })

  test('param: addressOrSymbol (as address)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const token = await Tokens.getToken(client, {
      addressOrSymbol: '0x0000000000000000000000000000000000000000',
    })

    expect({ ...token, nativeRate: null }).toMatchInlineSnapshot(`
      {
        "address": "0x0000000000000000000000000000000000000000",
        "decimals": 18,
        "feeToken": true,
        "interop": true,
        "nativeRate": null,
        "symbol": "ETH",
        "uid": "teth",
      }
    `)
  })
})

describe.runIf(!Anvil.enabled)('resolveFeeToken', () => {
  test('behavior: with store', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    porto._internal.store.setState({
      feeToken: 'EXP',
    })

    const feeToken = await Tokens.resolveFeeToken(client, {
      store: porto._internal.store,
    })

    expect({ ...feeToken, nativeRate: null }).toMatchInlineSnapshot(`
      {
        "address": "0x2d49a0e75c86779c391418214ec7e1b18e58bb34",
        "decimals": 18,
        "feeToken": true,
        "interop": true,
        "nativeRate": null,
        "symbol": "EXP",
        "uid": "exp1",
      }
    `)
  })

  test('param: feeToken (as symbol)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const feeToken = await Tokens.resolveFeeToken(client, {
      addressOrSymbol: 'ETH',
      store: porto._internal.store,
    })

    expect({ ...feeToken, nativeRate: null }).toMatchInlineSnapshot(`
      {
        "address": "0x0000000000000000000000000000000000000000",
        "decimals": 18,
        "feeToken": true,
        "interop": true,
        "nativeRate": null,
        "symbol": "ETH",
        "uid": "teth",
      }
    `)
  })

  test('param: feeToken (as native)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const feeToken = await Tokens.resolveFeeToken(client, {
      addressOrSymbol: 'native',
      chain: Chains.polygon,
      store: porto._internal.store,
    })

    expect({ ...feeToken, nativeRate: null }).toMatchInlineSnapshot(`
      {
        "address": "0x0000000000000000000000000000000000000000",
        "decimals": 18,
        "feeToken": true,
        "interop": false,
        "nativeRate": null,
        "symbol": "POL",
        "uid": "matic-network",
      }
    `)
  })

  test('param: feeToken (as address)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const feeToken = await Tokens.resolveFeeToken(client, {
      addressOrSymbol: '0x0000000000000000000000000000000000000000',
      store: porto._internal.store,
    })

    expect({ ...feeToken, nativeRate: null }).toMatchInlineSnapshot(`
      {
        "address": "0x0000000000000000000000000000000000000000",
        "decimals": 18,
        "feeToken": true,
        "interop": true,
        "nativeRate": null,
        "symbol": "ETH",
        "uid": "teth",
      }
    `)
  })

  test('param: feeToken (as address)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const feeToken = await Tokens.resolveFeeToken(client, {
      addressOrSymbol: '0x2d49a0e75c86779c391418214ec7e1b18e58bb34',
      store: porto._internal.store,
    })

    expect({ ...feeToken, nativeRate: null }).toMatchInlineSnapshot(`
      {
        "address": "0x2d49a0e75c86779c391418214ec7e1b18e58bb34",
        "decimals": 18,
        "feeToken": true,
        "interop": true,
        "nativeRate": null,
        "symbol": "EXP",
        "uid": "exp1",
      }
    `)
  })

  test('behavior: default fee token', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    porto._internal.store.setState({
      feeToken: 'ETH',
    })

    const feeToken = await Tokens.resolveFeeToken(client, {
      store: porto._internal.store,
    })

    expect({ ...feeToken, nativeRate: null }).toMatchInlineSnapshot(`
      {
        "address": "0x0000000000000000000000000000000000000000",
        "decimals": 18,
        "feeToken": true,
        "interop": true,
        "nativeRate": null,
        "symbol": "ETH",
        "uid": "teth",
      }
    `)
  })

  test('behavior: falls back to storage fee token if override/default not found', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    porto._internal.store.setState({
      feeToken: 'EXP',
    })

    const feeToken = await Tokens.resolveFeeToken(client, {
      addressOrSymbol: 'WAGMI',
      store: porto._internal.store,
    })
    expect({ ...feeToken, nativeRate: null }).toMatchInlineSnapshot(`
      {
        "nativeRate": null,
      }
    `)
||||||| parent of bc3f8c7c (refactor: `Tokens` module)
=======

import * as Tokens from './tokens.js'

describe.runIf(Anvil.enabled)('getTokens', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const tokens = await Tokens.getTokens(client)

    expect(tokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "feeToken": true,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
          "uid": "ethereum",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "feeToken": true,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "EXP",
          "uid": "exp",
        },
      ]
    `)
  })
})

describe.runIf(Anvil.enabled)('getToken', () => {
  test('param: addressOrSymbol (as symbol)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const token = await Tokens.getToken(client, { addressOrSymbol: 'EXP' })

    expect(token).toMatchInlineSnapshot(`
      {
        "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
        "decimals": 18,
        "feeToken": true,
        "interop": false,
        "nativeRate": 1000000000000000000n,
        "symbol": "EXP",
        "uid": "exp",
      }
    `)
  })

  test('param: addressOrSymbol (as address)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const token = await Tokens.getToken(client, {
      addressOrSymbol: '0x0000000000000000000000000000000000000000',
    })

    expect(token).toMatchInlineSnapshot(`
      {
        "address": "0x0000000000000000000000000000000000000000",
        "decimals": 18,
        "feeToken": true,
        "interop": false,
        "nativeRate": 1000000000000000000n,
        "symbol": "ETH",
        "uid": "ethereum",
      }
    `)
  })
})

describe.runIf(Anvil.enabled)('resolveFeeTokens', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const feeTokens = await Tokens.resolveFeeTokens(client)

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "feeToken": true,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
          "uid": "ethereum",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "feeToken": true,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "EXP",
          "uid": "exp",
        },
      ]
    `)
  })

  test('behavior: with store', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const feeTokens = await Tokens.resolveFeeTokens(client, {
      store: porto._internal.store,
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "feeToken": true,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "EXP",
          "uid": "exp",
        },
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "feeToken": true,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
          "uid": "ethereum",
        },
      ]
    `)
  })

  test('param: feeToken (as symbol)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const feeTokens = await Tokens.resolveFeeTokens(client, {
      addressOrSymbol: 'ETH',
      store: porto._internal.store,
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "feeToken": true,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
          "uid": "ethereum",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "feeToken": true,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "EXP",
          "uid": "exp",
        },
      ]
    `)
  })

  test('param: feeToken (as address)', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const feeTokens = await Tokens.resolveFeeTokens(client, {
      addressOrSymbol: '0x0000000000000000000000000000000000000000',
      store: porto._internal.store,
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "feeToken": true,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
          "uid": "ethereum",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "feeToken": true,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "EXP",
          "uid": "exp",
        },
      ]
    `)
  })

  test('behavior: default fee token', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    porto._internal.store.setState({
      feeToken: 'ETH',
    })

    const feeTokens = await Tokens.resolveFeeTokens(client, {
      store: porto._internal.store,
    })

    expect(feeTokens).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "feeToken": true,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
          "uid": "ethereum",
        },
        {
          "address": "0x8ce361602b935680e8dec218b820ff5056beb7af",
          "decimals": 18,
          "feeToken": true,
          "interop": false,
          "nativeRate": 1000000000000000000n,
          "symbol": "EXP",
          "uid": "exp",
        },
      ]
    `)
  })

  test('behavior: falls back to first fee token if override/default not found', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const feeTokens = await Tokens.resolveFeeTokens(client, {
      addressOrSymbol: 'WAGMI',
    })
    expect(feeTokens.length).toBeGreaterThanOrEqual(1)
    expect(feeTokens[0]).toBeDefined()
>>>>>>> bc3f8c7c (refactor: `Tokens` module)
  })
})

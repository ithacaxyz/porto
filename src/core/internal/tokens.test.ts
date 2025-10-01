import { describe, expect, test } from 'vitest'
import * as Anvil from '../../../test/src/anvil.js'
import * as TestConfig from '../../../test/src/config.js'
import * as Chains from '../Chains.js'
import * as Tokens from './tokens.js'

describe.runIf(!Anvil.enabled)('getTokens', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const tokens = await Tokens.getTokens(client)

    expect(
      tokens
        .toSorted((a, b) => a.symbol.localeCompare(b.symbol))
        .map((x) => ({ ...x, nativeRate: null })),
    ).toMatchInlineSnapshot(`
      [
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
          "address": "0xfca413a634c4df6b98ebb970a44d9a32f8f5c64e",
          "decimals": 18,
          "feeToken": true,
          "interop": true,
          "nativeRate": null,
          "symbol": "EXP",
          "uid": "exp1",
        },
        {
          "address": "0xacb60ce1e9d71c15a34c3afd903f552520b4a28f",
          "decimals": 18,
          "feeToken": true,
          "interop": true,
          "nativeRate": null,
          "symbol": "EXP2",
          "uid": "exp2",
        },
      ]
    `)
  })

  test('behavior: chain', async () => {
    const porto = TestConfig.getPorto()
    const client = TestConfig.getRelayClient(porto)

    const tokens = await Tokens.getTokens(client, { chain: Chains.polygon })

    expect(
      tokens
        .toSorted((a, b) => a.symbol.localeCompare(b.symbol))
        .map((x) => ({ ...x, nativeRate: null })),
    ).toMatchInlineSnapshot(`
      [
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "feeToken": true,
          "interop": false,
          "nativeRate": null,
          "symbol": "POL",
          "uid": "matic-network",
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
          "address": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
          "decimals": 6,
          "feeToken": true,
          "interop": true,
          "nativeRate": null,
          "symbol": "USDT0",
          "uid": "tether",
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
        "address": "0xfca413a634c4df6b98ebb970a44d9a32f8f5c64e",
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
        "address": "0xfca413a634c4df6b98ebb970a44d9a32f8f5c64e",
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
      addressOrSymbol: '0xfCA413a634C4dF6B98ebb970A44d9a32F8f5c64E',
      store: porto._internal.store,
    })

    expect({ ...feeToken, nativeRate: null }).toMatchInlineSnapshot(`
      {
        "address": "0xfca413a634c4df6b98ebb970a44d9a32f8f5c64e",
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
  })
})

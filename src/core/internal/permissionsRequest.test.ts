import { Value } from 'ox'
import { describe, expect, test } from 'vitest'
import type * as FeeTokens from './feeTokens.js'
import * as PermissionsRequest from './permissionsRequest.js'

const feeTokens = [
  {
    address: '0x97870b32890d3f1f089489a29007863a5678089d',
    decimals: 6,
    kind: 'USDC',
    nativeRate: 387750000000000n,
    symbol: 'EXP',
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    kind: 'ETH',
    nativeRate: 10n ** 18n,
    symbol: 'ETH',
  },
] as const satisfies FeeTokens.FeeTokens

describe('resolvePermissions', () => {
  test('default', () => {
    const result = PermissionsRequest.resolvePermissions(
      {
        expiry: 1714857600,
        feeLimit: {
          currency: 'USDC',
          value: '10',
        },
        permissions: {
          calls: [],
          spend: [
            {
              limit: Value.from('15', 6),
              period: 'year',
              token: '0x97870b32890d3f1f089489a29007863a5678089d',
            },
          ],
        },
      },
      {
        feeTokens,
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 25000000n,
            "period": "year",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
        ],
      }
    `)
  })

  test('behavior: no fee tokens provided', async () => {
    const result = PermissionsRequest.resolvePermissions(
      {
        expiry: 1714857600,
        permissions: {
          calls: [],
          spend: [
            {
              limit: Value.from('15', 6),
              period: 'year',
              token: '0x97870b32890d3f1f089489a29007863a5678089d',
            },
          ],
        },
      },
      {},
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 15000000n,
            "period": "year",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
        ],
      }
    `)
  })

  test('behavior: empty fee tokens array', async () => {
    const result = PermissionsRequest.resolvePermissions(
      {
        expiry: 1714857600,
        permissions: {
          calls: [],
          spend: [
            {
              limit: Value.from('15', 6),
              period: 'year',
              token: '0x97870b32890d3f1f089489a29007863a5678089d',
            },
          ],
        },
      },
      {
        feeTokens: [],
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 15000000n,
            "period": "year",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
        ],
      }
    `)
  })

  test('behavior: no existing spend permissions', async () => {
    const result = PermissionsRequest.resolvePermissions(
      {
        expiry: 1714857600,
        feeLimit: {
          currency: 'USDC',
          value: '5',
        },
        permissions: {
          calls: [],
        },
      },
      {
        feeTokens,
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 5000000n,
            "period": "year",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
        ],
      }
    `)
  })

  test('behavior: no matching spend permission but has other permissions', async () => {
    const result = PermissionsRequest.resolvePermissions(
      {
        expiry: 1714857600,
        feeLimit: {
          currency: 'USDC',
          value: '5',
        },
        permissions: {
          calls: [],
          spend: [
            {
              limit: Value.from('10', 18),
              period: 'month',
              token: '0x0000000000000000000000000000000000000000',
            },
            {
              limit: Value.from('20', 18),
              period: 'day',
              token: '0x1111111111111111111111111111111111111111',
            },
          ],
        },
      },
      {
        feeTokens,
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 10000000000000000000n,
            "period": "month",
            "token": "0x0000000000000000000000000000000000000000",
          },
          {
            "limit": 20000000000000000000n,
            "period": "day",
            "token": "0x1111111111111111111111111111111111111111",
          },
          {
            "limit": 5000000n,
            "period": "day",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
        ],
      }
    `)
  })

  test('behavior: updates existing spend permission with matching fee token', async () => {
    const result = PermissionsRequest.resolvePermissions(
      {
        expiry: 1714857600,
        feeLimit: {
          currency: 'USDC',
          value: '3',
        },
        permissions: {
          calls: [],
          spend: [
            {
              limit: Value.from('10', 6),
              period: 'month',
              token: '0x97870b32890d3f1f089489a29007863a5678089d',
            },
            {
              limit: Value.from('5', 18),
              period: 'day',
              token: '0x0000000000000000000000000000000000000000',
            },
          ],
        },
      },
      {
        feeTokens,
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 13000000n,
            "period": "month",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
          {
            "limit": 5000000000000000000n,
            "period": "day",
            "token": "0x0000000000000000000000000000000000000000",
          },
        ],
      }
    `)
  })

  test('behavior: handles ETH spend permission (ETH fee token)', async () => {
    const result = PermissionsRequest.resolvePermissions(
      {
        expiry: 1714857600,
        feeLimit: {
          currency: 'USDC',
          value: '2',
        },
        permissions: {
          calls: [],
          spend: [
            {
              limit: Value.from('10', 18),
              period: 'week',
            },
          ],
        },
      },
      {
        feeTokens: feeTokens.toReversed(),
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 10000775500000000000n,
            "period": "week",
          },
        ],
      }
    `)
  })

  test('behavior: preserves other permission fields', async () => {
    const result = PermissionsRequest.resolvePermissions(
      {
        expiry: 1714857600,
        feeLimit: {
          currency: 'USDC',
          value: '1',
        },
        permissions: {
          calls: [
            {
              signature: '0x12345678',
              to: '0x1234567890123456789012345678901234567890',
            },
          ],
          spend: [],
        },
      },
      {
        feeTokens,
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [
          {
            "signature": "0x12345678",
            "to": "0x1234567890123456789012345678901234567890",
          },
        ],
        "spend": [
          {
            "limit": 1000000n,
            "period": "year",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
        ],
      }
    `)
  })

  test('behavior: handles zero fee limit', async () => {
    const result = PermissionsRequest.resolvePermissions(
      {
        expiry: 1714857600,
        feeLimit: {
          currency: 'USDC',
          value: '0',
        },
        permissions: {
          calls: [],
          spend: [
            {
              limit: Value.from('5', 6),
              period: 'day',
              token: '0x97870b32890d3f1f089489a29007863a5678089d',
            },
          ],
        },
      },
      {
        feeTokens,
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 5000000n,
            "period": "day",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
        ],
      }
    `)
  })
})

describe('getFeeLimit', () => {
  test('default', () => {
    const feeLimit = PermissionsRequest.getFeeLimit(
      {
        expiry: 10000000000,
        feeLimit: {
          currency: 'ETH',
          value: '0.01',
        },
        permissions: {
          calls: [],
          spend: [
            {
              limit: 1000000000000000000n,
              period: 'year',
            },
          ],
        },
      },
      {
        feeTokens,
      },
    )

    expect(feeLimit).toMatchInlineSnapshot(`
      {
        "token": {
          "address": "0x97870b32890d3f1f089489a29007863a5678089d",
          "decimals": 6,
          "kind": "USDC",
          "nativeRate": 387750000000000n,
          "symbol": "EXP",
        },
        "value": 25789813n,
      }
    `)
  })

  test('behavior: returns default when no fee limit', () => {
    const request = {
      expiry: 1714857600,
      permissions: {
        calls: [],
      },
    } as const
    const result = PermissionsRequest.getFeeLimit(request, {
      feeTokens,
    })
    expect(result).toMatchInlineSnapshot('undefined')
  })

  test('behavior: returns zero when null fee limit', () => {
    const request = {
      expiry: 1714857600,
      permissions: {
        calls: [],
        feeLimit: null,
      },
    } as const
    const result = PermissionsRequest.getFeeLimit(request, {
      feeTokens,
    })
    expect(result).toMatchInlineSnapshot('undefined')
  })

  test('behavior: returns zero value when limit token not found', () => {
    const feeTokens = [
      {
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        kind: 'ETH',
        nativeRate: 10n ** 18n,
        symbol: 'ETH',
      },
    ] as const satisfies FeeTokens.FeeTokens

    const result = PermissionsRequest.getFeeLimit(
      {
        expiry: 1714857600,
        feeLimit: {
          currency: 'USDC',
          value: '0.01',
        },
        permissions: {
          calls: [],
        },
      },
      {
        feeTokens,
      },
    )
    expect(result).toMatchInlineSnapshot('undefined')
  })

  test('behavior: handles same token as fee token', () => {
    const result = PermissionsRequest.getFeeLimit(
      {
        expiry: 1714857600,
        feeLimit: {
          currency: 'USDC',
          value: '0.01',
        },
        permissions: {
          calls: [],
        },
      },
      {
        feeTokens,
      },
    )
    expect(result).toMatchInlineSnapshot(`
      {
        "token": {
          "address": "0x97870b32890d3f1f089489a29007863a5678089d",
          "decimals": 6,
          "kind": "USDC",
          "nativeRate": 387750000000000n,
          "symbol": "EXP",
        },
        "value": 10000n,
      }
    `)
  })

  test('behavior: converts between different tokens', () => {
    const feeLimit = PermissionsRequest.getFeeLimit(
      {
        expiry: 10000000000,
        feeLimit: {
          currency: 'USDC',
          value: '10',
        },
        permissions: {
          calls: [],
          spend: [
            {
              limit: 1000000000000000000n,
              period: 'year',
            },
          ],
        },
      },
      {
        feeTokens: feeTokens.toReversed(),
      },
    )

    expect(feeLimit).toMatchInlineSnapshot(`
      {
        "token": {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "kind": "ETH",
          "nativeRate": 1000000000000000000n,
          "symbol": "ETH",
        },
        "value": 3877500000000000n,
      }
    `)
  })

  test('behavior: converts between different tokens', () => {
    const result = PermissionsRequest.getFeeLimit(
      {
        expiry: 1714857600,
        feeLimit: {
          currency: 'ETH',
          value: '0.01',
        },
        permissions: {
          calls: [],
        },
      },
      {
        feeTokens,
      },
    )
    expect(result).toMatchInlineSnapshot(`
      {
        "token": {
          "address": "0x97870b32890d3f1f089489a29007863a5678089d",
          "decimals": 6,
          "kind": "USDC",
          "nativeRate": 387750000000000n,
          "symbol": "EXP",
        },
        "value": 25789813n,
      }
    `)
  })

  test('behavior: finds token by USD currency', () => {
    const result = PermissionsRequest.getFeeLimit(
      {
        expiry: 1714857600,
        feeLimit: {
          currency: 'USDC',
          value: '0.01',
        },
        permissions: {
          calls: [],
        },
      },
      {
        feeTokens,
      },
    )
    expect(result?.token.kind).toMatchInlineSnapshot(`"USDC"`)
  })

  test('behavior: handles tokens without native rate', () => {
    const feeTokens = [
      {
        address: '0x97870b32890d3f1f089489a29007863a5678089d',
        decimals: 18,
        kind: 'USDC',
        symbol: 'EXP',
      },
      {
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        kind: 'ETH',
        symbol: 'ETH',
      },
    ] as const satisfies FeeTokens.FeeTokens

    const result = PermissionsRequest.getFeeLimit(
      {
        expiry: 1714857600,
        feeLimit: {
          currency: 'ETH',
          value: '0.01',
        },
        permissions: {
          calls: [],
        },
      },
      {
        feeTokens,
      },
    )
    expect(result?.value).toMatchInlineSnapshot('10000000000000000n')
  })
})

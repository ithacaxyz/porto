import { describe, expect, test } from 'vitest'
import * as z from 'zod/mini'
import * as Permissions from './permissions.js'
import * as u from './utils.js'

describe('Permissions', () => {
  test('behavior: parses valid permissions with all fields', () => {
    const result = z.parse(Permissions.Permissions, {
      address: '0x1234567890123456789012345678901234567890',
      chainId: '0x1',
      expiry: 1000,
      id: '0xabc123',
      key: {
        publicKey: '0xdeadbeef',
        type: 'secp256k1',
      },
      permissions: {
        calls: [
          {
            signature: 'transfer(address,uint256)',
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
        signatureVerification: {
          addresses: ['0x1234567890123456789012345678901234567890'],
        },
        spend: [
          {
            limit: '0x64',
            period: 'day',
            token: '0x1234567890123456789012345678901234567890',
          },
        ],
      },
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "address": "0x1234567890123456789012345678901234567890",
        "chainId": 1,
        "expiry": 1000,
        "id": "0xabc123",
        "key": {
          "publicKey": "0xdeadbeef",
          "type": "secp256k1",
        },
        "permissions": {
          "calls": [
            {
              "signature": "transfer(address,uint256)",
              "to": "0x1234567890123456789012345678901234567890",
            },
          ],
          "signatureVerification": {
            "addresses": [
              "0x1234567890123456789012345678901234567890",
            ],
          },
          "spend": [
            {
              "limit": 100n,
              "period": "day",
              "token": "0x1234567890123456789012345678901234567890",
            },
          ],
        },
      }
    `)
  })

  test('behavior: parses valid permissions with minimal fields', () => {
    const result = z.parse(Permissions.Permissions, {
      address: '0x1234567890123456789012345678901234567890',
      expiry: 1000,
      id: '0xabc123',
      key: {
        publicKey: '0xdeadbeef',
        type: 'secp256k1',
      },
      permissions: {
        calls: [
          {
            signature: 'transfer(address,uint256)',
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
      },
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "address": "0x1234567890123456789012345678901234567890",
        "expiry": 1000,
        "id": "0xabc123",
        "key": {
          "publicKey": "0xdeadbeef",
          "type": "secp256k1",
        },
        "permissions": {
          "calls": [
            {
              "signature": "transfer(address,uint256)",
              "to": "0x1234567890123456789012345678901234567890",
            },
          ],
        },
      }
    `)
  })

  test.each([
    { case: 'address', keyType: 'address' as const },
    { case: 'p256', keyType: 'p256' as const },
    { case: 'secp256k1', keyType: 'secp256k1' as const },
    { case: 'webauthn-p256', keyType: 'webauthn-p256' as const },
  ])(
    'behavior: parses valid permissions with key type $case',
    ({ keyType }) => {
      const result = z.parse(Permissions.Permissions, {
        address: '0x1234567890123456789012345678901234567890',
        expiry: 1000,
        id: '0xabc123',
        key: {
          publicKey: '0xdeadbeef',
          type: keyType,
        },
        permissions: {
          calls: [
            {
              signature: 'transfer(address,uint256)',
              to: '0x1234567890123456789012345678901234567890',
            },
          ],
        },
      })
      expect(result.key.type).toBe(keyType)
    },
  )

  test('behavior: parses valid permissions with different call permission types', () => {
    const result = z.parse(Permissions.Permissions, {
      address: '0x1234567890123456789012345678901234567890',
      expiry: 1000,
      id: '0xabc123',
      key: {
        publicKey: '0xdeadbeef',
        type: 'secp256k1',
      },
      permissions: {
        calls: [
          {
            signature: 'transfer(address,uint256)',
            to: '0x1234567890123456789012345678901234567890',
          },
          {
            signature: 'approve(address,uint256)',
          },
          {
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
      },
    })
    expect(result.permissions.calls).toHaveLength(3)
  })

  test('behavior: encodes chainId number to hex', () => {
    const result = z.encode(Permissions.Permissions, {
      address: '0x1234567890123456789012345678901234567890',
      chainId: 1,
      expiry: 1000,
      id: '0xabc123',
      key: {
        publicKey: '0xdeadbeef',
        type: 'secp256k1',
      },
      permissions: {
        calls: [
          {
            signature: 'transfer(address,uint256)',
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
      },
    })
    expect(result.chainId).toBe('0x1')
  })

  test('behavior: encodes spend limit bigint to hex', () => {
    const result = z.encode(Permissions.Permissions, {
      address: '0x1234567890123456789012345678901234567890',
      expiry: 1000,
      id: '0xabc123',
      key: {
        publicKey: '0xdeadbeef',
        type: 'secp256k1',
      },
      permissions: {
        calls: [
          {
            signature: 'transfer(address,uint256)',
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
        spend: [
          {
            limit: 1000n,
            period: 'day',
          },
        ],
      },
    })
    expect(result.permissions.spend?.[0]?.limit).toBe('0x3e8')
  })

  test('behavior: encodes large spend limit bigint to hex', () => {
    const result = z.encode(Permissions.Permissions, {
      address: '0x1234567890123456789012345678901234567890',
      expiry: 1000,
      id: '0xabc123',
      key: {
        publicKey: '0xdeadbeef',
        type: 'secp256k1',
      },
      permissions: {
        calls: [
          {
            signature: 'transfer(address,uint256)',
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
        spend: [
          {
            limit: 18446744073709551615n,
            period: 'day',
          },
        ],
      },
    })
    expect(result.permissions.spend?.[0]?.limit).toBe('0xffffffffffffffff')
  })

  test('behavior: encodes zero spend limit to 0x0', () => {
    const result = z.encode(Permissions.Permissions, {
      address: '0x1234567890123456789012345678901234567890',
      expiry: 1000,
      id: '0xabc123',
      key: {
        publicKey: '0xdeadbeef',
        type: 'secp256k1',
      },
      permissions: {
        calls: [
          {
            signature: 'transfer(address,uint256)',
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
        spend: [
          {
            limit: 0n,
            period: 'day',
          },
        ],
      },
    })
    expect(result.permissions.spend?.[0]?.limit).toBe('0x0')
  })

  test('behavior: encodes permissions without optional fields', () => {
    const result = z.encode(Permissions.Permissions, {
      address: '0x1234567890123456789012345678901234567890',
      expiry: 1000,
      id: '0xabc123',
      key: {
        publicKey: '0xdeadbeef',
        type: 'secp256k1',
      },
      permissions: {
        calls: [
          {
            signature: 'transfer(address,uint256)',
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
      },
    })
    expect(result).toMatchInlineSnapshot(`
        {
          "address": "0x1234567890123456789012345678901234567890",
          "expiry": 1000,
          "id": "0xabc123",
          "key": {
            "publicKey": "0xdeadbeef",
            "type": "secp256k1",
          },
          "permissions": {
            "calls": [
              {
                "signature": "transfer(address,uint256)",
                "to": "0x1234567890123456789012345678901234567890",
              },
            ],
          },
        }
      `)
  })

  test.each([
    { chainId: 1, expected: '0x1' },
    { chainId: 137, expected: '0x89' },
    { chainId: 42161, expected: '0xa4b1' },
    { chainId: 0, expected: '0x0' },
  ])(
    'behavior: encodes chainId $chainId to $expected',
    ({ chainId, expected }) => {
      const result = z.encode(Permissions.Permissions, {
        address: '0x1234567890123456789012345678901234567890',
        chainId,
        expiry: 1000,
        id: '0xabc123',
        key: {
          publicKey: '0xdeadbeef',
          type: 'secp256k1',
        },
        permissions: {
          calls: [
            {
              signature: 'transfer(address,uint256)',
              to: '0x1234567890123456789012345678901234567890',
            },
          ],
        },
      })
      expect(result.chainId).toBe(expected)
    },
  )

  test('error: rejects invalid address format', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permissions.Permissions, {
          address: 'invalid-address',
          expiry: 1000,
          id: '0xabc123',
          key: {
            publicKey: '0xdeadbeef',
            type: 'secp256k1',
          },
          permissions: {
            calls: [
              {
                signature: 'transfer(address,uint256)',
                to: '0x1234567890123456789012345678901234567890',
              },
            ],
          },
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`address\`: Must match pattern: ^0x[\\s\\S]{0,}$]
    `,
    )
  })

  test('error: rejects invalid key type', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permissions.Permissions, {
          address: '0x1234567890123456789012345678901234567890',
          expiry: 1000,
          id: '0xabc123',
          key: {
            publicKey: '0xdeadbeef',
            type: 'invalid-key-type',
          },
          permissions: {
            calls: [
              {
                signature: 'transfer(address,uint256)',
                to: '0x1234567890123456789012345678901234567890',
              },
            ],
          },
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`key.type\`: Invalid union value.
        - Expected "address"
        - Expected "p256"
        - Expected "secp256k1"
        - Expected "webauthn-p256"]
    `,
    )
  })

  test('error: rejects missing required fields', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permissions.Permissions, {
          address: '0x1234567890123456789012345678901234567890',
          // Missing expiry, id, key, permissions
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 4 errors:

      - at \`expiry\`: Expected number. 
      - at \`id\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
      - at \`key\`: Expected object. 
      - at \`permissions\`: Expected object. ]
    `,
    )
  })

  test('error: rejects empty calls array', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permissions.Permissions, {
          address: '0x1234567890123456789012345678901234567890',
          expiry: 1000,
          id: '0xabc123',
          key: {
            publicKey: '0xdeadbeef',
            type: 'secp256k1',
          },
          permissions: {
            calls: [],
          },
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`permissions.calls\`: array must be at least 1]
    `,
    )
  })
})

describe('Request', () => {
  test('behavior: parses valid request with all fields', () => {
    const result = z.parse(Permissions.Request, {
      address: '0x1234567890123456789012345678901234567890',
      chainId: '0x1',
      expiry: 1000,
      feeToken: {
        limit: '1',
        symbol: 'USDC',
      },
      key: {
        publicKey: '0xdeadbeef',
        type: 'secp256k1',
      },
      permissions: {
        calls: [
          {
            signature: 'transfer(address,uint256)',
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
        signatureVerification: {
          addresses: ['0x1234567890123456789012345678901234567890'],
        },
        spend: [
          {
            limit: '0x64',
            period: 'day',
            token: '0x1234567890123456789012345678901234567890',
          },
        ],
      },
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "address": "0x1234567890123456789012345678901234567890",
        "chainId": 1,
        "expiry": 1000,
        "feeToken": {
          "limit": "1",
          "symbol": "USDC",
        },
        "key": {
          "publicKey": "0xdeadbeef",
          "type": "secp256k1",
        },
        "permissions": {
          "calls": [
            {
              "signature": "transfer(address,uint256)",
              "to": "0x1234567890123456789012345678901234567890",
            },
          ],
          "signatureVerification": {
            "addresses": [
              "0x1234567890123456789012345678901234567890",
            ],
          },
          "spend": [
            {
              "limit": 100n,
              "period": "day",
              "token": "0x1234567890123456789012345678901234567890",
            },
          ],
        },
      }
    `)
  })

  test('behavior: parses valid request with minimal fields', () => {
    const result = z.parse(Permissions.Request, {
      expiry: 1000,
      feeToken: {
        limit: '1',
        symbol: 'USDC',
      },
      permissions: {
        calls: [
          {
            signature: 'transfer(address,uint256)',
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
      },
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "expiry": 1000,
        "feeToken": {
          "limit": "1",
          "symbol": "USDC",
        },
        "permissions": {
          "calls": [
            {
              "signature": "transfer(address,uint256)",
              "to": "0x1234567890123456789012345678901234567890",
            },
          ],
        },
      }
    `)
  })

  test('behavior: parses valid request with different spend periods', () => {
    const periods = ['minute', 'hour', 'day', 'week', 'month', 'year'] as const

    for (const period of periods) {
      const result = z.parse(Permissions.Request, {
        expiry: 1000,
        feeToken: {
          limit: '1',
          symbol: 'USDC',
        },
        permissions: {
          calls: [
            {
              signature: 'transfer(address,uint256)',
              to: '0x1234567890123456789012345678901234567890',
            },
          ],
          spend: [
            {
              limit: '0x64',
              period,
            },
          ],
        },
      })
      expect(result.permissions.spend?.[0]?.period).toBe(period)
    }
  })

  test('behavior: encodes chainId number to hex', () => {
    const result = z.encode(Permissions.Request, {
      address: '0x1234567890123456789012345678901234567890',
      chainId: 1,
      expiry: 1000,
      feeToken: {
        limit: '1',
        symbol: 'USDC',
      },
      permissions: {
        calls: [
          {
            signature: 'transfer(address,uint256)',
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
      },
    })
    expect(result.chainId).toBe('0x1')
  })

  test('behavior: encodes spend limit bigint to hex', () => {
    const result = z.encode(Permissions.Request, {
      expiry: 1000,
      feeToken: {
        limit: '1',
        symbol: 'USDC',
      },
      permissions: {
        calls: [
          {
            signature: 'transfer(address,uint256)',
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
        spend: [
          {
            limit: 255n,
            period: 'hour',
          },
        ],
      },
    })
    expect(result.permissions.spend?.[0]?.limit).toBe('0xff')
  })

  test('behavior: encodes request with all optional fields', () => {
    const result = z.encode(Permissions.Request, {
      address: '0x1234567890123456789012345678901234567890',
      chainId: 42161,
      expiry: 2000,
      feeToken: {
        limit: '1',
        symbol: 'USDC',
      },
      key: {
        publicKey: '0xabcdef',
        type: 'p256',
      },
      permissions: {
        calls: [
          {
            signature: 'approve(address,uint256)',
          },
        ],
        signatureVerification: {
          addresses: ['0x1234567890123456789012345678901234567890'],
        },
        spend: [
          {
            limit: 1000n,
            period: 'week',
            token: '0x1234567890123456789012345678901234567890',
          },
        ],
      },
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "address": "0x1234567890123456789012345678901234567890",
        "chainId": "0xa4b1",
        "expiry": 2000,
        "feeToken": {
          "limit": "1",
          "symbol": "USDC",
        },
        "key": {
          "publicKey": "0xabcdef",
          "type": "p256",
        },
        "permissions": {
          "calls": [
            {
              "signature": "approve(address,uint256)",
            },
          ],
          "signatureVerification": {
            "addresses": [
              "0x1234567890123456789012345678901234567890",
            ],
          },
          "spend": [
            {
              "limit": "0x3e8",
              "period": "week",
              "token": "0x1234567890123456789012345678901234567890",
            },
          ],
        },
      }
    `)
  })

  test('behavior: encodes request with minimal fields', () => {
    const result = z.encode(Permissions.Request, {
      expiry: 500,
      feeToken: {
        limit: '1',
        symbol: 'USDC',
      },
      permissions: {
        calls: [
          {
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
      },
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "expiry": 500,
        "feeToken": {
          "limit": "1",
          "symbol": "USDC",
        },
        "permissions": {
          "calls": [
            {
              "to": "0x1234567890123456789012345678901234567890",
            },
          ],
        },
      }
    `)
  })

  test.each([
    { expected: '0x1', limit: 1n },
    { expected: '0xff', limit: 255n },
    { expected: '0x3e8', limit: 1000n },
    { expected: '0x0', limit: 0n },
  ])(
    'behavior: encodes spend limit $limit to $expected',
    ({ limit, expected }) => {
      const result = z.encode(Permissions.Request, {
        expiry: 1000,
        feeToken: {
          limit: '1',
          symbol: 'USDC',
        },
        permissions: {
          calls: [
            {
              signature: 'transfer(address,uint256)',
              to: '0x1234567890123456789012345678901234567890',
            },
          ],
          spend: [
            {
              limit,
              period: 'day',
            },
          ],
        },
      })
      expect(result.permissions.spend?.[0]?.limit).toBe(expected)
    },
  )

  test('error: rejects invalid expiry (zero)', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permissions.Request, {
          expiry: 0,
          permissions: {
            calls: [
              {
                signature: 'transfer(address,uint256)',
                to: '0x1234567890123456789012345678901234567890',
              },
            ],
          },
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 2 errors:

      - at \`expiry\`: number must be at least 1
      - at \`feeToken\`: Expected object. ]
    `,
    )
  })

  test('error: rejects invalid expiry (negative)', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permissions.Request, {
          expiry: -1,
          permissions: {
            calls: [
              {
                signature: 'transfer(address,uint256)',
                to: '0x1234567890123456789012345678901234567890',
              },
            ],
          },
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 2 errors:

      - at \`expiry\`: number must be at least 1
      - at \`feeToken\`: Expected object. ]
    `,
    )
  })

  test('error: rejects missing required permissions', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permissions.Request, {
          expiry: 1000,
          // Missing permissions
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 2 errors:

      - at \`feeToken\`: Expected object. 
      - at \`permissions\`: Expected object. ]
    `,
    )
  })

  test('error: rejects invalid spend period', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permissions.Request, {
          expiry: 1000,
          permissions: {
            calls: [
              {
                signature: 'transfer(address,uint256)',
                to: '0x1234567890123456789012345678901234567890',
              },
            ],
            spend: [
              {
                limit: '0x64',
                period: 'invalid-period',
              },
            ],
          },
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 2 errors:

      - at \`feeToken\`: Expected object. 
      - at \`permissions.spend[0].period\`: Invalid union value.
        - Expected "minute"
        - Expected "hour"
        - Expected "day"
        - Expected "week"
        - Expected "month"
        - Expected "year"]
    `,
    )
  })

  test('error: rejects invalid feeLimit currency', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permissions.Request, {
          expiry: 1000,
          feeLimit: {
            currency: 'BTC',
            value: '1',
          },
          permissions: {
            calls: [
              {
                signature: 'transfer(address,uint256)',
                to: '0x1234567890123456789012345678901234567890',
              },
            ],
          },
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`feeToken\`: Expected object. ]
    `,
    )
  })

  test('error: rejects invalid feeLimit value format', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permissions.Request, {
          expiry: 1000,
          feeLimit: {
            currency: 'ETH',
            value: 'invalid-number',
          },
          permissions: {
            calls: [
              {
                signature: 'transfer(address,uint256)',
                to: '0x1234567890123456789012345678901234567890',
              },
            ],
          },
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`feeToken\`: Expected object. ]
    `,
    )
  })

  test('error: rejects feeLimit with multiple decimal points', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permissions.Request, {
          expiry: 1000,
          feeLimit: {
            currency: 'USDC',
            value: '1.5.0',
          },
          permissions: {
            calls: [
              {
                signature: 'transfer(address,uint256)',
                to: '0x1234567890123456789012345678901234567890',
              },
            ],
          },
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`feeToken\`: Expected object. ]
    `,
    )
  })
})

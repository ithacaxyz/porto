import { describe, expect, test } from 'vitest'
import * as Permissions from './permissions.js'
import * as Schema from './schema.js'

describe('Permissions', () => {
  test('behavior: parses valid permissions with all fields', () => {
    const result = Schema.decodeUnknownSync(Permissions.Permissions)({
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
    const result = Schema.decodeUnknownSync(Permissions.Permissions)({
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
      const result = Schema.decodeUnknownSync(Permissions.Permissions)({
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
    const result = Schema.decodeUnknownSync(Permissions.Permissions)({
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
    const result = Schema.encodeSync(Permissions.Permissions)({
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
    const result = Schema.encodeSync(Permissions.Permissions)({
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
    const result = Schema.encodeSync(Permissions.Permissions)({
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
    const result = Schema.encodeSync(Permissions.Permissions)({
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
    const result = Schema.encodeSync(Permissions.Permissions)({
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
      const result = Schema.encodeSync(Permissions.Permissions)({
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
    expect(() =>
      Schema.decodeUnknownSync(Permissions.Permissions)({
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
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-address"
      Path: address

      Details: { readonly address: \`0x\${string}\`; readonly chainId?: (\`0x\${string}\` <-> number) | undefined; readonly expiry: number; readonly id: \`0x\${string}\`; readonly key: { readonly publicKey: \`0x\${string}\`; readonly type: "address" | "p256" | "secp256k1" | "webauthn-p256" }; readonly permissions: { readonly calls: minItems(1); readonly signatureVerification?: { readonly addresses: ReadonlyArray<\`0x\${string}\`> } | undefined; readonly spend?: ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }> | undefined } }
      └─ ["address"]
         └─ Expected \`0x\${string}\`, actual "invalid-address"]
    `)
  })

  test('error: rejects invalid key type', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permissions.Permissions)({
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
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected "address", actual "invalid-key-type"
      Path: key.type

      Details: { readonly address: \`0x\${string}\`; readonly chainId?: (\`0x\${string}\` <-> number) | undefined; readonly expiry: number; readonly id: \`0x\${string}\`; readonly key: { readonly publicKey: \`0x\${string}\`; readonly type: "address" | "p256" | "secp256k1" | "webauthn-p256" }; readonly permissions: { readonly calls: minItems(1); readonly signatureVerification?: { readonly addresses: ReadonlyArray<\`0x\${string}\`> } | undefined; readonly spend?: ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }> | undefined } }
      └─ ["key"]
         └─ { readonly publicKey: \`0x\${string}\`; readonly type: "address" | "p256" | "secp256k1" | "webauthn-p256" }
            └─ ["type"]
               └─ "address" | "p256" | "secp256k1" | "webauthn-p256"
                  ├─ Expected "address", actual "invalid-key-type"
                  ├─ Expected "p256", actual "invalid-key-type"
                  ├─ Expected "secp256k1", actual "invalid-key-type"
                  └─ Expected "webauthn-p256", actual "invalid-key-type"]
    `)
  })

  test('error: rejects missing required fields', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permissions.Permissions)({
        address: '0x1234567890123456789012345678901234567890',
        // Missing expiry, id, key, permissions
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`expiry\` is missing
      Path: expiry

      Details: { readonly address: \`0x\${string}\`; readonly chainId?: (\`0x\${string}\` <-> number) | undefined; readonly expiry: number; readonly id: \`0x\${string}\`; readonly key: { readonly publicKey: \`0x\${string}\`; readonly type: "address" | "p256" | "secp256k1" | "webauthn-p256" }; readonly permissions: { readonly calls: minItems(1); readonly signatureVerification?: { readonly addresses: ReadonlyArray<\`0x\${string}\`> } | undefined; readonly spend?: ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }> | undefined } }
      └─ ["expiry"]
         └─ is missing]
    `)
  })

  test('error: rejects empty calls array', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permissions.Permissions)({
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
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected an array of at least 1 item(s), actual []
      Path: permissions.calls

      Details: { readonly address: \`0x\${string}\`; readonly chainId?: (\`0x\${string}\` <-> number) | undefined; readonly expiry: number; readonly id: \`0x\${string}\`; readonly key: { readonly publicKey: \`0x\${string}\`; readonly type: "address" | "p256" | "secp256k1" | "webauthn-p256" }; readonly permissions: { readonly calls: minItems(1); readonly signatureVerification?: { readonly addresses: ReadonlyArray<\`0x\${string}\`> } | undefined; readonly spend?: ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }> | undefined } }
      └─ ["permissions"]
         └─ { readonly calls: minItems(1); readonly signatureVerification?: { readonly addresses: ReadonlyArray<\`0x\${string}\`> } | undefined; readonly spend?: ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }> | undefined }
            └─ ["calls"]
               └─ minItems(1)
                  └─ Predicate refinement failure
                     └─ Expected an array of at least 1 item(s), actual []]
    `)
  })
})

describe('Request', () => {
  test('behavior: parses valid request with all fields', () => {
    const result = Schema.decodeUnknownSync(Permissions.Request)({
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
    const result = Schema.decodeUnknownSync(Permissions.Request)({
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
      const result = Schema.decodeUnknownSync(Permissions.Request)({
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
    const result = Schema.encodeSync(Permissions.Request)({
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
    const result = Schema.encodeSync(Permissions.Request)({
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
    const result = Schema.encodeSync(Permissions.Request)({
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
    const result = Schema.encodeSync(Permissions.Request)({
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
      const result = Schema.encodeSync(Permissions.Request)({
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
    expect(() =>
      Schema.decodeUnknownSync(Permissions.Request)({
        expiry: 0,
        permissions: {
          calls: [
            {
              signature: 'transfer(address,uint256)',
              to: '0x1234567890123456789012345678901234567890',
            },
          ],
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected a number greater than or equal to 1, actual 0
      Path: expiry

      Details: { readonly address?: \`0x\${string}\` | undefined; readonly chainId?: (\`0x\${string}\` <-> number) | undefined; readonly expiry: greaterThanOrEqualTo(1); readonly feeToken: { readonly limit: a string matching the pattern ^\\d+(\\.\\d+)?$; readonly symbol?: "native" | a string matching the pattern ^[A-Z0-9]+$ | undefined } | null; readonly key?: { readonly publicKey: \`0x\${string}\`; readonly type: "address" | "p256" | "secp256k1" | "webauthn-p256" } | undefined; readonly permissions: { readonly calls: minItems(1); readonly signatureVerification?: { readonly addresses: ReadonlyArray<\`0x\${string}\`> } | undefined; readonly spend?: ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }> | undefined } }
      └─ ["expiry"]
         └─ greaterThanOrEqualTo(1)
            └─ Predicate refinement failure
               └─ Expected a number greater than or equal to 1, actual 0]
    `)
  })

  test('error: rejects invalid expiry (negative)', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permissions.Request)({
        expiry: -1,
        permissions: {
          calls: [
            {
              signature: 'transfer(address,uint256)',
              to: '0x1234567890123456789012345678901234567890',
            },
          ],
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected a number greater than or equal to 1, actual -1
      Path: expiry

      Details: { readonly address?: \`0x\${string}\` | undefined; readonly chainId?: (\`0x\${string}\` <-> number) | undefined; readonly expiry: greaterThanOrEqualTo(1); readonly feeToken: { readonly limit: a string matching the pattern ^\\d+(\\.\\d+)?$; readonly symbol?: "native" | a string matching the pattern ^[A-Z0-9]+$ | undefined } | null; readonly key?: { readonly publicKey: \`0x\${string}\`; readonly type: "address" | "p256" | "secp256k1" | "webauthn-p256" } | undefined; readonly permissions: { readonly calls: minItems(1); readonly signatureVerification?: { readonly addresses: ReadonlyArray<\`0x\${string}\`> } | undefined; readonly spend?: ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }> | undefined } }
      └─ ["expiry"]
         └─ greaterThanOrEqualTo(1)
            └─ Predicate refinement failure
               └─ Expected a number greater than or equal to 1, actual -1]
    `)
  })

  test('error: rejects missing required permissions', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permissions.Request)({
        expiry: 1000,
        feeToken: {
          limit: '1',
          symbol: 'USDC',
        },
        // Missing permissions
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`permissions\` is missing
      Path: permissions

      Details: { readonly address?: \`0x\${string}\` | undefined; readonly chainId?: (\`0x\${string}\` <-> number) | undefined; readonly expiry: greaterThanOrEqualTo(1); readonly feeToken: { readonly limit: a string matching the pattern ^\\d+(\\.\\d+)?$; readonly symbol?: "native" | a string matching the pattern ^[A-Z0-9]+$ | undefined } | null; readonly key?: { readonly publicKey: \`0x\${string}\`; readonly type: "address" | "p256" | "secp256k1" | "webauthn-p256" } | undefined; readonly permissions: { readonly calls: minItems(1); readonly signatureVerification?: { readonly addresses: ReadonlyArray<\`0x\${string}\`> } | undefined; readonly spend?: ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }> | undefined } }
      └─ ["permissions"]
         └─ is missing]
    `)
  })

  test('error: rejects invalid spend period', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permissions.Request)({
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
              period: 'invalid-period',
            },
          ],
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected "minute", actual "invalid-period"
      Path: permissions.spend.0.period

      Details: { readonly address?: \`0x\${string}\` | undefined; readonly chainId?: (\`0x\${string}\` <-> number) | undefined; readonly expiry: greaterThanOrEqualTo(1); readonly feeToken: { readonly limit: a string matching the pattern ^\\d+(\\.\\d+)?$; readonly symbol?: "native" | a string matching the pattern ^[A-Z0-9]+$ | undefined } | null; readonly key?: { readonly publicKey: \`0x\${string}\`; readonly type: "address" | "p256" | "secp256k1" | "webauthn-p256" } | undefined; readonly permissions: { readonly calls: minItems(1); readonly signatureVerification?: { readonly addresses: ReadonlyArray<\`0x\${string}\`> } | undefined; readonly spend?: ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }> | undefined } }
      └─ ["permissions"]
         └─ { readonly calls: minItems(1); readonly signatureVerification?: { readonly addresses: ReadonlyArray<\`0x\${string}\`> } | undefined; readonly spend?: ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }> | undefined }
            └─ ["spend"]
               └─ ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }> | undefined
                  ├─ ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }>
                  │  └─ [0]
                  │     └─ { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }
                  │        └─ ["period"]
                  │           └─ "minute" | "hour" | "day" | "week" | "month" | "year"
                  │              ├─ Expected "minute", actual "invalid-period"
                  │              ├─ Expected "hour", actual "invalid-period"
                  │              ├─ Expected "day", actual "invalid-period"
                  │              ├─ Expected "week", actual "invalid-period"
                  │              ├─ Expected "month", actual "invalid-period"
                  │              └─ Expected "year", actual "invalid-period"
                  └─ Expected undefined, actual [{"limit":"0x64","period":"invalid-period"}]]
    `)
  })

  test('error: rejects invalid feeToken token', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permissions.Request)({
        expiry: 1000,
        feeToken: {
          limit: '1',
          symbol: '0x0000000000000000000000000000000000000000',
        },
        permissions: {
          calls: [
            {
              signature: 'transfer(address,uint256)',
              to: '0x1234567890123456789012345678901234567890',
            },
          ],
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected "native", actual "0x0000000000000000000000000000000000000000"
      Path: feeToken.symbol

      Details: { readonly address?: \`0x\${string}\` | undefined; readonly chainId?: (\`0x\${string}\` <-> number) | undefined; readonly expiry: greaterThanOrEqualTo(1); readonly feeToken: { readonly limit: a string matching the pattern ^\\d+(\\.\\d+)?$; readonly symbol?: "native" | a string matching the pattern ^[A-Z0-9]+$ | undefined } | null; readonly key?: { readonly publicKey: \`0x\${string}\`; readonly type: "address" | "p256" | "secp256k1" | "webauthn-p256" } | undefined; readonly permissions: { readonly calls: minItems(1); readonly signatureVerification?: { readonly addresses: ReadonlyArray<\`0x\${string}\`> } | undefined; readonly spend?: ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }> | undefined } }
      └─ ["feeToken"]
         └─ { readonly limit: a string matching the pattern ^\\d+(\\.\\d+)?$; readonly symbol?: "native" | a string matching the pattern ^[A-Z0-9]+$ | undefined } | null
            ├─ { readonly limit: a string matching the pattern ^\\d+(\\.\\d+)?$; readonly symbol?: "native" | a string matching the pattern ^[A-Z0-9]+$ | undefined }
            │  └─ ["symbol"]
            │     └─ "native" | a string matching the pattern ^[A-Z0-9]+$ | undefined
            │        ├─ "native" | a string matching the pattern ^[A-Z0-9]+$
            │        │  ├─ Expected "native", actual "0x0000000000000000000000000000000000000000"
            │        │  └─ a string matching the pattern ^[A-Z0-9]+$
            │        │     └─ Predicate refinement failure
            │        │        └─ Expected a string matching the pattern ^[A-Z0-9]+$, actual "0x0000000000000000000000000000000000000000"
            │        └─ Expected undefined, actual "0x0000000000000000000000000000000000000000"
            └─ Expected null, actual {"limit":"1","symbol":"0x0000000000000000000000000000000000000000"}]
    `)
  })

  test('error: rejects invalid feeToken value format', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permissions.Request)({
        expiry: 1000,
        feeToken: {
          limit: 'invalid-number',
          symbol: 'ETH',
        },
        permissions: {
          calls: [
            {
              signature: 'transfer(address,uint256)',
              to: '0x1234567890123456789012345678901234567890',
            },
          ],
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`\${number}.\${number}\`, actual "invalid-number"
      Path: feeToken.limit

      Details: { readonly address?: \`0x\${string}\` | undefined; readonly chainId?: (\`0x\${string}\` <-> number) | undefined; readonly expiry: greaterThanOrEqualTo(1); readonly feeToken: { readonly limit: a string matching the pattern ^\\d+(\\.\\d+)?$; readonly symbol?: "native" | a string matching the pattern ^[A-Z0-9]+$ | undefined } | null; readonly key?: { readonly publicKey: \`0x\${string}\`; readonly type: "address" | "p256" | "secp256k1" | "webauthn-p256" } | undefined; readonly permissions: { readonly calls: minItems(1); readonly signatureVerification?: { readonly addresses: ReadonlyArray<\`0x\${string}\`> } | undefined; readonly spend?: ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }> | undefined } }
      └─ ["feeToken"]
         └─ { readonly limit: a string matching the pattern ^\\d+(\\.\\d+)?$; readonly symbol?: "native" | a string matching the pattern ^[A-Z0-9]+$ | undefined } | null
            ├─ { readonly limit: a string matching the pattern ^\\d+(\\.\\d+)?$; readonly symbol?: "native" | a string matching the pattern ^[A-Z0-9]+$ | undefined }
            │  └─ ["limit"]
            │     └─ a string matching the pattern ^\\d+(\\.\\d+)?$
            │        └─ From side refinement failure
            │           └─ \`\${number}.\${number}\` | \`\${number}\`
            │              ├─ Expected \`\${number}.\${number}\`, actual "invalid-number"
            │              └─ Expected \`\${number}\`, actual "invalid-number"
            └─ Expected null, actual {"limit":"invalid-number","symbol":"ETH"}]
    `)
  })

  test('error: rejects feeToken with multiple decimal points', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permissions.Request)({
        expiry: 1000,
        feeToken: {
          limit: '1.5.0',
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
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected a string matching the pattern ^\\d+(\\.\\d+)?$, actual "1.5.0"
      Path: feeToken.limit

      Details: { readonly address?: \`0x\${string}\` | undefined; readonly chainId?: (\`0x\${string}\` <-> number) | undefined; readonly expiry: greaterThanOrEqualTo(1); readonly feeToken: { readonly limit: a string matching the pattern ^\\d+(\\.\\d+)?$; readonly symbol?: "native" | a string matching the pattern ^[A-Z0-9]+$ | undefined } | null; readonly key?: { readonly publicKey: \`0x\${string}\`; readonly type: "address" | "p256" | "secp256k1" | "webauthn-p256" } | undefined; readonly permissions: { readonly calls: minItems(1); readonly signatureVerification?: { readonly addresses: ReadonlyArray<\`0x\${string}\`> } | undefined; readonly spend?: ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }> | undefined } }
      └─ ["feeToken"]
         └─ { readonly limit: a string matching the pattern ^\\d+(\\.\\d+)?$; readonly symbol?: "native" | a string matching the pattern ^[A-Z0-9]+$ | undefined } | null
            ├─ { readonly limit: a string matching the pattern ^\\d+(\\.\\d+)?$; readonly symbol?: "native" | a string matching the pattern ^[A-Z0-9]+$ | undefined }
            │  └─ ["limit"]
            │     └─ a string matching the pattern ^\\d+(\\.\\d+)?$
            │        └─ Predicate refinement failure
            │           └─ Expected a string matching the pattern ^\\d+(\\.\\d+)?$, actual "1.5.0"
            └─ Expected null, actual {"limit":"1.5.0","symbol":"USDC"}]
    `)
  })
})

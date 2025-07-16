import { describe, expect, test } from 'vitest'
import * as Schema from '../../schema/schema.js'
import * as Intent from './intent.js'

describe('Intent', () => {
  const validIntentData = {
    combinedGas: '0x5208',
    encodedPreCalls: ['0xdeadbeef', '0xcafebabe'],
    eoa: '0x1234567890123456789012345678901234567890',
    executionData: '0xabcdef',
    nonce: '0x1',
    payer: '0x1234567890123456789012345678901234567890',
    paymentRecipient: '0x9876543210987654321098765432109876543210',
    paymentSignature: '0x123456',
    paymentToken: '0xa0b86991c31cc0c7b6f931c7d751c635d989dc1bb',
    prePaymentAmount: '0x64',
    prePaymentMaxAmount: '0xc8',
    signature: '0xsignature123',
    supportedAccountImplementation:
      '0x0000000000000000000000000000000000000000',
    totalPaymentAmount: '0x12c',
    totalPaymentMaxAmount: '0x190',
  }

  test('behavior: decodes valid intent with all fields', () => {
    const result = Schema.decodeUnknownSync(Intent.Intent)(validIntentData)
    expect(result).toMatchInlineSnapshot(`
      {
        "combinedGas": 21000n,
        "encodedPreCalls": [
          "0xdeadbeef",
          "0xcafebabe",
        ],
        "eoa": "0x1234567890123456789012345678901234567890",
        "executionData": "0xabcdef",
        "nonce": 1n,
        "payer": "0x1234567890123456789012345678901234567890",
        "paymentRecipient": "0x9876543210987654321098765432109876543210",
        "paymentSignature": "0x123456",
        "paymentToken": "0xa0b86991c31cc0c7b6f931c7d751c635d989dc1bb",
        "prePaymentAmount": 100n,
        "prePaymentMaxAmount": 200n,
        "signature": "0xsignature123",
        "supportedAccountImplementation": "0x0000000000000000000000000000000000000000",
        "totalPaymentAmount": 300n,
        "totalPaymentMaxAmount": 400n,
      }
    `)
  })

  test('behavior: encodes valid intent data', () => {
    const decodedData = Schema.decodeUnknownSync(Intent.Intent)(validIntentData)
    const encodedData = Schema.encodeSync(Intent.Intent)(decodedData)
    expect(encodedData).toMatchInlineSnapshot(`
      {
        "combinedGas": "0x5208",
        "encodedPreCalls": [
          "0xdeadbeef",
          "0xcafebabe",
        ],
        "eoa": "0x1234567890123456789012345678901234567890",
        "executionData": "0xabcdef",
        "nonce": "0x1",
        "payer": "0x1234567890123456789012345678901234567890",
        "paymentRecipient": "0x9876543210987654321098765432109876543210",
        "paymentSignature": "0x123456",
        "paymentToken": "0xa0b86991c31cc0c7b6f931c7d751c635d989dc1bb",
        "prePaymentAmount": "0x64",
        "prePaymentMaxAmount": "0xc8",
        "signature": "0xsignature123",
        "supportedAccountImplementation": "0x0000000000000000000000000000000000000000",
        "totalPaymentAmount": "0x12c",
        "totalPaymentMaxAmount": "0x190",
      }
    `)
  })

  test('behavior: round-trip encoding/decoding preserves data', () => {
    const originalDecoded = Schema.decodeUnknownSync(Intent.Intent)(
      validIntentData,
    )
    const encoded = Schema.encodeSync(Intent.Intent)(originalDecoded)
    const reDecoded = Schema.decodeUnknownSync(Intent.Intent)(encoded)

    expect(reDecoded).toEqual(originalDecoded)
  })

  test('behavior: decodes intent with empty encodedPreCalls array', () => {
    const dataWithEmptyPreCalls = {
      ...validIntentData,
      encodedPreCalls: [],
    }
    const result = Schema.decodeUnknownSync(Intent.Intent)(
      dataWithEmptyPreCalls,
    )
    expect(result.encodedPreCalls).toEqual([])
  })

  test('behavior: decodes intent with large BigInt values', () => {
    const dataWithLargeBigInts = {
      ...validIntentData,
      combinedGas: '0xffffffffffffffffffffffffffffffffff',
      nonce: '0xffffffffffffffffffffffffffffffffffff',
      prePaymentAmount: '0xffffffffffffffffffffffffffffffff',
      prePaymentMaxAmount: '0xffffffffffffffffffffffffffffffffff',
      totalPaymentAmount: '0xffffffffffffffffffffffffffffffffffffff',
      totalPaymentMaxAmount: '0xffffffffffffffffffffffffffffffffffffffff',
    }
    const result = Schema.decodeUnknownSync(Intent.Intent)(dataWithLargeBigInts)
    expect(result.combinedGas).toBe(
      BigInt('0xffffffffffffffffffffffffffffffffff'),
    )
    expect(result.nonce).toBe(BigInt('0xffffffffffffffffffffffffffffffffffff'))
  })

  test('behavior: encodes large BigInt values back to hex', () => {
    const dataWithLargeBigInts = {
      ...validIntentData,
      combinedGas: '0xff',
      nonce: '0xffff',
    }
    const decoded = Schema.decodeUnknownSync(Intent.Intent)(
      dataWithLargeBigInts,
    )
    const encoded = Schema.encodeSync(Intent.Intent)(decoded)
    expect(encoded.combinedGas).toBe('0xff')
    expect(encoded.nonce).toBe('0xffff')
  })

  test('error: rejects invalid address format', () => {
    expect(() =>
      Schema.decodeUnknownSync(Intent.Intent)({
        ...validIntentData,
        eoa: 'invalid-address',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-address"
      Path: eoa

      Details: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }
      └─ ["eoa"]
         └─ Expected \`0x\${string}\`, actual "invalid-address"]
    `)
  })

  test('error: rejects invalid hex format for BigInt fields', () => {
    expect(() =>
      Schema.decodeUnknownSync(Intent.Intent)({
        ...validIntentData,
        combinedGas: 'not-hex',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "not-hex"
      Path: combinedGas

      Details: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }
      └─ ["combinedGas"]
         └─ (\`0x\${string}\` <-> bigint)
            └─ Encoded side transformation failure
               └─ Expected \`0x\${string}\`, actual "not-hex"]
    `)
  })

  test('error: rejects missing required fields', () => {
    expect(() =>
      Schema.decodeUnknownSync(Intent.Intent)({
        eoa: '0x1234567890123456789012345678901234567890',
        // Missing other required fields
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`combinedGas\` is missing
      Path: combinedGas

      Details: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }
      └─ ["combinedGas"]
         └─ is missing]
    `)
  })

  test('error: rejects invalid encodedPreCalls array items', () => {
    expect(() =>
      Schema.decodeUnknownSync(Intent.Intent)({
        ...validIntentData,
        encodedPreCalls: ['0xvalid', 'invalid-hex'],
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-hex"
      Path: encodedPreCalls.1

      Details: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }
      └─ ["encodedPreCalls"]
         └─ ReadonlyArray<\`0x\${string}\`>
            └─ [1]
               └─ Expected \`0x\${string}\`, actual "invalid-hex"]
    `)
  })
})

describe('Partial', () => {
  const validPartialData = {
    eoa: '0x1234567890123456789012345678901234567890',
    executionData: '0xabcdef',
    nonce: '0x1',
  }

  test('behavior: decodes valid partial intent', () => {
    const result = Schema.decodeUnknownSync(Intent.Partial)(validPartialData)
    expect(result).toMatchInlineSnapshot(`
      {
        "eoa": "0x1234567890123456789012345678901234567890",
        "executionData": "0xabcdef",
        "nonce": 1n,
      }
    `)
  })

  test('behavior: encodes valid partial intent data', () => {
    const decodedData = Schema.decodeUnknownSync(Intent.Partial)(
      validPartialData,
    )
    const encodedData = Schema.encodeSync(Intent.Partial)(decodedData)
    expect(encodedData).toMatchInlineSnapshot(`
      {
        "eoa": "0x1234567890123456789012345678901234567890",
        "executionData": "0xabcdef",
        "nonce": "0x1",
      }
    `)
  })

  test('behavior: round-trip encoding/decoding preserves partial data', () => {
    const originalDecoded = Schema.decodeUnknownSync(Intent.Partial)(
      validPartialData,
    )
    const encoded = Schema.encodeSync(Intent.Partial)(originalDecoded)
    const reDecoded = Schema.decodeUnknownSync(Intent.Partial)(encoded)

    expect(reDecoded).toEqual(originalDecoded)
  })

  test('behavior: decodes with different nonce values', () => {
    const testCases = [
      { expected: 0n, nonce: '0x0' },
      { expected: 1n, nonce: '0x1' },
      { expected: 255n, nonce: '0xff' },
      { expected: 4096n, nonce: '0x1000' },
    ]

    for (const { nonce, expected } of testCases) {
      const result = Schema.decodeUnknownSync(Intent.Partial)({
        ...validPartialData,
        nonce,
      })
      expect(result.nonce).toBe(expected)
    }
  })

  test('behavior: encodes different nonce values back to hex', () => {
    const testCases = [
      { nonce: '0x0' },
      { nonce: '0x1' },
      { nonce: '0xff' },
      { nonce: '0x1000' },
    ]

    for (const { nonce } of testCases) {
      const decoded = Schema.decodeUnknownSync(Intent.Partial)({
        ...validPartialData,
        nonce,
      })
      const encoded = Schema.encodeSync(Intent.Partial)(decoded)
      expect(encoded.nonce).toBe(nonce)
    }
  })

  test('error: rejects invalid address in partial', () => {
    expect(() =>
      Schema.decodeUnknownSync(Intent.Partial)({
        ...validPartialData,
        eoa: 'invalid-address',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-address"
      Path: eoa

      Details: { readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint) }
      └─ ["eoa"]
         └─ Expected \`0x\${string}\`, actual "invalid-address"]
    `)
  })

  test('error: rejects invalid hex for executionData', () => {
    expect(() =>
      Schema.decodeUnknownSync(Intent.Partial)({
        ...validPartialData,
        executionData: 'not-hex',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "not-hex"
      Path: executionData

      Details: { readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint) }
      └─ ["executionData"]
         └─ Expected \`0x\${string}\`, actual "not-hex"]
    `)
  })

  test('error: rejects invalid hex for nonce', () => {
    expect(() =>
      Schema.decodeUnknownSync(Intent.Partial)({
        ...validPartialData,
        nonce: 'not-hex',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "not-hex"
      Path: nonce

      Details: { readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint) }
      └─ ["nonce"]
         └─ (\`0x\${string}\` <-> bigint)
            └─ Encoded side transformation failure
               └─ Expected \`0x\${string}\`, actual "not-hex"]
    `)
  })

  test('error: rejects missing required fields in partial', () => {
    expect(() =>
      Schema.decodeUnknownSync(Intent.Partial)({
        eoa: '0x1234567890123456789012345678901234567890',
        // Missing executionData and nonce
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`executionData\` is missing
      Path: executionData

      Details: { readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint) }
      └─ ["executionData"]
         └─ is missing]
    `)
  })

  test('misc: partial intent contains subset of full intent fields', () => {
    const partialDecoded = Schema.decodeUnknownSync(Intent.Partial)(
      validPartialData,
    )
    const fullDecoded = Schema.decodeUnknownSync(Intent.Intent)({
      combinedGas: '0x5208',
      encodedPreCalls: [],
      ...validPartialData,
      payer: '0x1234567890123456789012345678901234567890',
      paymentRecipient: '0x9876543210987654321098765432109876543210',
      paymentSignature: '0x123456',
      paymentToken: '0xa0b86991c31cc0c7b6f931c7d751c635d989dc1bb',
      prePaymentAmount: '0x64',
      prePaymentMaxAmount: '0xc8',
      signature: '0xsignature123',
      supportedAccountImplementation:
        '0x0000000000000000000000000000000000000000',
      totalPaymentAmount: '0x12c',
      totalPaymentMaxAmount: '0x190',
    })

    // Verify that partial fields match the full intent
    expect(partialDecoded.eoa).toBe(fullDecoded.eoa)
    expect(partialDecoded.executionData).toBe(fullDecoded.executionData)
    expect(partialDecoded.nonce).toBe(fullDecoded.nonce)
  })
})

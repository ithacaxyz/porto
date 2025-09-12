import { describe, expect, test } from 'vitest'
import * as z from 'zod/mini'
import * as u from '../../schema/utils.js'
import * as Intent from './intent.js'

describe('Intent', () => {
  const validIntentData = {
    combinedGas: '0x5208',
    encodedFundTransfers: [],
    encodedPreCalls: ['0xdeadbeef', '0xcafebabe'],
    eoa: '0x1234567890123456789012345678901234567890',
    executionData: '0xabcdef',
    expiry: '0x1234567890',
    funder: '0x1234567890123456789012345678901234567890',
    funderSignature: '0xfundersig123',
    isMultichain: false,
    nonce: '0x1',
    payer: '0x1234567890123456789012345678901234567890',
    paymentAmount: '0x64',
    paymentMaxAmount: '0xc8',
    paymentRecipient: '0x9876543210987654321098765432109876543210',
    paymentSignature: '0x123456',
    paymentToken: '0xa0b86991c31cc0c7b6f931c7d751c635d989dc1bb',
    settler: '0x9876543210987654321098765432109876543210',
    settlerContext: '0xsettlercontext123',
    signature: '0xsignature123',
    supportedAccountImplementation:
      '0x0000000000000000000000000000000000000000',
  }

  test('behavior: decodes valid intent with all fields', () => {
    const result = z.decode(Intent.Intent, validIntentData as never)
    expect(result).toMatchInlineSnapshot(`
      {
        "combinedGas": 21000n,
        "encodedFundTransfers": [],
        "encodedPreCalls": [
          "0xdeadbeef",
          "0xcafebabe",
        ],
        "eoa": "0x1234567890123456789012345678901234567890",
        "executionData": "0xabcdef",
        "expiry": 78187493520n,
        "funder": "0x1234567890123456789012345678901234567890",
        "funderSignature": "0xfundersig123",
        "isMultichain": false,
        "nonce": 1n,
        "payer": "0x1234567890123456789012345678901234567890",
        "paymentAmount": 100n,
        "paymentMaxAmount": 200n,
        "paymentRecipient": "0x9876543210987654321098765432109876543210",
        "paymentSignature": "0x123456",
        "paymentToken": "0xa0b86991c31cc0c7b6f931c7d751c635d989dc1bb",
        "settler": "0x9876543210987654321098765432109876543210",
        "settlerContext": "0xsettlercontext123",
        "signature": "0xsignature123",
        "supportedAccountImplementation": "0x0000000000000000000000000000000000000000",
      }
    `)
  })

  test('behavior: encodes valid intent data', () => {
    const decodedData = z.decode(Intent.Intent, validIntentData as never)
    const encodedData = z.encode(Intent.Intent, decodedData)
    expect(encodedData).toMatchInlineSnapshot(`
      {
        "combinedGas": "0x5208",
        "encodedFundTransfers": [],
        "encodedPreCalls": [
          "0xdeadbeef",
          "0xcafebabe",
        ],
        "eoa": "0x1234567890123456789012345678901234567890",
        "executionData": "0xabcdef",
        "expiry": "0x1234567890",
        "funder": "0x1234567890123456789012345678901234567890",
        "funderSignature": "0xfundersig123",
        "isMultichain": false,
        "nonce": "0x1",
        "payer": "0x1234567890123456789012345678901234567890",
        "paymentAmount": "0x64",
        "paymentMaxAmount": "0xc8",
        "paymentRecipient": "0x9876543210987654321098765432109876543210",
        "paymentSignature": "0x123456",
        "paymentToken": "0xa0b86991c31cc0c7b6f931c7d751c635d989dc1bb",
        "settler": "0x9876543210987654321098765432109876543210",
        "settlerContext": "0xsettlercontext123",
        "signature": "0xsignature123",
        "supportedAccountImplementation": "0x0000000000000000000000000000000000000000",
      }
    `)
  })

  test('behavior: round-trip encoding/decoding preserves data', () => {
    const originalDecoded = z.decode(Intent.Intent, validIntentData as never)
    const encoded = z.encode(Intent.Intent, originalDecoded)
    const reDecoded = z.decode(Intent.Intent, encoded)

    expect(reDecoded).toEqual(originalDecoded)
  })

  test('behavior: decodes intent with empty encodedPreCalls array', () => {
    const dataWithEmptyPreCalls = {
      ...validIntentData,
      encodedPreCalls: [],
    }
    const result = z.decode(Intent.Intent, dataWithEmptyPreCalls as never)
    expect(result.encodedPreCalls).toEqual([])
  })

  test('behavior: decodes intent with large BigInt values', () => {
    const dataWithLargeBigInts = {
      ...validIntentData,
      combinedGas: '0xffffffffffffffffffffffffffffffffff',
      nonce: '0xffffffffffffffffffffffffffffffffffff',
      paymentAmount: '0xffffffffffffffffffffffffffffffff',
      paymentMaxAmount: '0xffffffffffffffffffffffffffffffffff',
    }
    const result = z.decode(Intent.Intent, dataWithLargeBigInts as never)
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
    const decoded = z.decode(Intent.Intent, dataWithLargeBigInts as never)
    const encoded = z.encode(Intent.Intent, decoded)
    expect(encoded.combinedGas).toBe('0xff')
    expect(encoded.nonce).toBe('0xffff')
  })

  test('error: rejects invalid address format', () => {
    expect(
      u.toValidationError(
        z.safeDecode(Intent.Intent, {
          ...validIntentData,
          eoa: 'invalid-address',
        } as never).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - Invalid union value.
        - at \`eoa\`: Must match pattern: ^0x[\\s\\S]{0,}$
        - at \`eoa\`: Must match pattern: ^0x[\\s\\S]{0,}$
        - at \`prePaymentAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`prePaymentMaxAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`totalPaymentAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`totalPaymentMaxAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.]
    `,
    )
  })

  test('error: rejects invalid hex format for BigInt fields', () => {
    expect(
      u.toValidationError(
        z.safeDecode(Intent.Intent, {
          ...validIntentData,
          combinedGas: 'not-hex',
        } as never).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - Invalid union value.
        - at \`combinedGas\`: Must match pattern: ^0x[\\s\\S]{0,}$
        - at \`combinedGas\`: Must match pattern: ^0x[\\s\\S]{0,}$
        - at \`prePaymentAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`prePaymentMaxAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`totalPaymentAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`totalPaymentMaxAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.]
    `,
    )
  })

  test('error: rejects missing required fields', () => {
    expect(
      u.toValidationError(
        z.safeDecode(Intent.Intent, {
          eoa: '0x1234567890123456789012345678901234567890',
          // Missing other required fields
        } as never).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - Invalid union value.
        - at \`combinedGas\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`encodedFundTransfers\`: Expected array. 
        - at \`encodedPreCalls\`: Expected array. 
        - at \`executionData\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`expiry\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`funder\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`funderSignature\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`isMultichain\`: Expected boolean. 
        - at \`nonce\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`payer\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`paymentAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`paymentMaxAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`paymentRecipient\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`paymentSignature\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`paymentToken\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`settler\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`settlerContext\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`signature\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`supportedAccountImplementation\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`combinedGas\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`encodedFundTransfers\`: Expected array. 
        - at \`encodedPreCalls\`: Expected array. 
        - at \`executionData\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`expiry\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`funder\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`funderSignature\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`isMultichain\`: Expected boolean. 
        - at \`nonce\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`payer\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`paymentRecipient\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`paymentSignature\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`paymentToken\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`prePaymentAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`prePaymentMaxAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`settler\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`settlerContext\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`signature\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`supportedAccountImplementation\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`totalPaymentAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`totalPaymentMaxAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.]
    `,
    )
  })

  test('error: rejects invalid encodedPreCalls array items', async () => {
    const { error } = z.safeParse(Intent.Intent, {
      ...validIntentData,
      encodedPreCalls: ['0xvalid', 'invalid-hex'],
    } as never)
    expect(u.toValidationError(error as never)).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - Invalid union value.
        - at \`encodedPreCalls[1]\`: Must match pattern: ^0x[\\s\\S]{0,}$
        - at \`encodedPreCalls[1]\`: Must match pattern: ^0x[\\s\\S]{0,}$
        - at \`prePaymentAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`prePaymentMaxAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`totalPaymentAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`totalPaymentMaxAmount\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.]
    `,
    )
  })
})

describe('Partial', () => {
  const validPartialData = {
    eoa: '0x1234567890123456789012345678901234567890',
    executionData: '0xabcdef',
    nonce: '0x1',
  }

  test('behavior: decodes valid partial intent', () => {
    const result = z.decode(Intent.Partial, validPartialData as never)
    expect(result).toMatchInlineSnapshot(`
      {
        "eoa": "0x1234567890123456789012345678901234567890",
        "executionData": "0xabcdef",
        "nonce": 1n,
      }
    `)
  })

  test('behavior: encodes valid partial intent data', () => {
    const decodedData = z.decode(Intent.Partial, validPartialData as never)
    const encodedData = z.encode(Intent.Partial, decodedData)
    expect(encodedData).toMatchInlineSnapshot(`
      {
        "eoa": "0x1234567890123456789012345678901234567890",
        "executionData": "0xabcdef",
        "nonce": "0x1",
      }
    `)
  })

  test('behavior: round-trip encoding/decoding preserves partial data', () => {
    const originalDecoded = z.decode(Intent.Partial, validPartialData as never)
    const encoded = z.encode(Intent.Partial, originalDecoded)
    const reDecoded = z.decode(Intent.Partial, encoded)

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
      const result = z.decode(Intent.Partial, {
        ...validPartialData,
        nonce,
      } as never)
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
      const decoded = z.decode(Intent.Partial, {
        ...validPartialData,
        nonce,
      } as never)
      const encoded = z.encode(Intent.Partial, decoded)
      expect(encoded.nonce).toBe(nonce)
    }
  })

  test('error: rejects invalid address in partial', () => {
    expect(
      u.toValidationError(
        z.safeDecode(Intent.Partial, {
          ...validPartialData,
          eoa: 'invalid-address',
        } as never).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`eoa\`: Must match pattern: ^0x[\\s\\S]{0,}$]
    `,
    )
  })

  test('error: rejects invalid hex for executionData', () => {
    expect(
      u.toValidationError(
        z.safeDecode(Intent.Partial, {
          ...validPartialData,
          executionData: 'not-hex',
        } as never).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`executionData\`: Must match pattern: ^0x[\\s\\S]{0,}$]
    `,
    )
  })

  test('error: rejects invalid hex for nonce', () => {
    expect(
      u.toValidationError(
        z.safeDecode(Intent.Partial, {
          ...validPartialData,
          nonce: 'not-hex',
        } as never).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`nonce\`: Must match pattern: ^0x[\\s\\S]{0,}$]
    `,
    )
  })

  test('error: rejects missing required fields in partial', () => {
    expect(
      u.toValidationError(
        z.safeDecode(Intent.Partial, {
          eoa: '0x1234567890123456789012345678901234567890',
          // Missing executionData and nonce
        } as never).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 2 errors:

      - at \`executionData\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
      - at \`nonce\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.]
    `,
    )
  })

  test('misc: partial intent contains subset of full intent fields', () => {
    const partialDecoded = z.decode(Intent.Partial, validPartialData as never)
    const fullDecoded = z.decode(Intent.Intent, {
      combinedGas: '0x5208',
      encodedFundTransfers: [],
      encodedPreCalls: [],
      ...validPartialData,
      expiry: '0x1234567890',
      funder: '0x1234567890123456789012345678901234567890',
      funderSignature: '0xfundersig123',
      isMultichain: false,
      payer: '0x1234567890123456789012345678901234567890',
      paymentAmount: '0x64',
      paymentMaxAmount: '0xc8',
      paymentRecipient: '0x9876543210987654321098765432109876543210',
      paymentSignature: '0x123456',
      paymentToken: '0xa0b86991c31cc0c7b6f931c7d751c635d989dc1bb',
      settler: '0x9876543210987654321098765432109876543210',
      settlerContext: '0xsettlercontext123',
      signature: '0xsignature123',
      supportedAccountImplementation:
        '0x0000000000000000000000000000000000000000',
    } as never)

    // Verify that partial fields match the full intent
    expect(partialDecoded.eoa).toBe(fullDecoded.eoa)
    expect(partialDecoded.executionData).toBe(fullDecoded.executionData)
    expect(partialDecoded.nonce).toBe(fullDecoded.nonce)
  })
})

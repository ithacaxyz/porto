import { describe, expect, test } from 'vitest'
import * as Schema from '../../schema/schema.js'
import * as Quote from './quote.js'

describe('Quote', () => {
  const validQuoteData = {
    authorizationAddress: '0x1234567890123456789012345678901234567890',
    chainId: 1,
    ethPrice: '0x1bc16d674ec80000',
    extraPayment: '0x0',
    intent: {
      combinedGas: '0x5208',
      encodedPreCalls: [],
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
    },
    nativeFeeEstimate: {
      maxFeePerGas: '0x3b9aca00',
      maxPriorityFeePerGas: '0x59682f00',
    },
    orchestrator: '0x9876543210987654321098765432109876543210',
    paymentTokenDecimals: 18,
    ttl: 300,
    txGas: '0x5208',
  }

  test('behavior: decodes valid quote with all fields', () => {
    const result = Schema.decodeUnknownSync(Quote.Quote)(validQuoteData)
    expect(result).toMatchInlineSnapshot(`
      {
        "authorizationAddress": "0x1234567890123456789012345678901234567890",
        "chainId": 1,
        "ethPrice": 2000000000000000000n,
        "extraPayment": 0n,
        "intent": {
          "combinedGas": 21000n,
          "encodedPreCalls": [],
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
        },
        "nativeFeeEstimate": {
          "maxFeePerGas": 1000000000n,
          "maxPriorityFeePerGas": 1500000000n,
        },
        "orchestrator": "0x9876543210987654321098765432109876543210",
        "paymentTokenDecimals": 18,
        "ttl": 300,
        "txGas": 21000n,
      }
    `)
  })

  test('behavior: encodes valid quote data', () => {
    const decodedData = Schema.decodeUnknownSync(Quote.Quote)(validQuoteData)
    const encodedData = Schema.encodeSync(Quote.Quote)(decodedData)
    expect(encodedData).toMatchInlineSnapshot(`
      {
        "authorizationAddress": "0x1234567890123456789012345678901234567890",
        "chainId": 1,
        "ethPrice": "0x1bc16d674ec80000",
        "extraPayment": "0x0",
        "intent": {
          "combinedGas": "0x5208",
          "encodedPreCalls": [],
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
        },
        "nativeFeeEstimate": {
          "maxFeePerGas": "0x3b9aca00",
          "maxPriorityFeePerGas": "0x59682f00",
        },
        "orchestrator": "0x9876543210987654321098765432109876543210",
        "paymentTokenDecimals": 18,
        "ttl": 300,
        "txGas": "0x5208",
      }
    `)
  })

  test('behavior: round-trip encoding/decoding preserves data', () => {
    const originalDecoded = Schema.decodeUnknownSync(Quote.Quote)(
      validQuoteData,
    )
    const encoded = Schema.encodeSync(Quote.Quote)(originalDecoded)
    const reDecoded = Schema.decodeUnknownSync(Quote.Quote)(encoded)

    expect(reDecoded).toEqual(originalDecoded)
  })

  test('behavior: decodes quote with null authorizationAddress', () => {
    const dataWithNullAuth = {
      ...validQuoteData,
      authorizationAddress: null,
    }
    const result = Schema.decodeUnknownSync(Quote.Quote)(dataWithNullAuth)
    expect(result.authorizationAddress).toBeNull()
  })

  test('behavior: decodes quote with undefined authorizationAddress', () => {
    const dataWithUndefinedAuth = {
      ...validQuoteData,
      authorizationAddress: undefined,
    }
    const result = Schema.decodeUnknownSync(Quote.Quote)(dataWithUndefinedAuth)
    expect(result.authorizationAddress).toBeUndefined()
  })

  test('behavior: decodes quote with large BigInt values', () => {
    const dataWithLargeBigInts = {
      ...validQuoteData,
      ethPrice: '0xffffffffffffffffffffffffffffffffff',
      extraPayment: '0xffffffffffffffffffffffffffffffffffff',
      txGas: '0xffffffffffffffffffffffffffffffff',
    }
    const result = Schema.decodeUnknownSync(Quote.Quote)(dataWithLargeBigInts)
    expect(result.ethPrice).toBe(BigInt('0xffffffffffffffffffffffffffffffffff'))
    expect(result.extraPayment).toBe(
      BigInt('0xffffffffffffffffffffffffffffffffffff'),
    )
    expect(result.txGas).toBe(BigInt('0xffffffffffffffffffffffffffffffff'))
  })

  test('behavior: encodes large BigInt values back to hex', () => {
    const dataWithLargeBigInts = {
      ...validQuoteData,
      ethPrice: '0xff',
      extraPayment: '0xffff',
      txGas: '0xffffff',
    }
    const decoded = Schema.decodeUnknownSync(Quote.Quote)(dataWithLargeBigInts)
    const encoded = Schema.encodeSync(Quote.Quote)(decoded)
    expect(encoded.ethPrice).toBe('0xff')
    expect(encoded.extraPayment).toBe('0xffff')
    expect(encoded.txGas).toBe('0xffffff')
  })

  test.each([
    { chainId: 1, expected: 1 },
    { chainId: 5, expected: 5 },
    { chainId: 137, expected: 137 },
    { chainId: 42161, expected: 42161 },
  ])(
    'behavior: decodes quote with chainId $chainId',
    ({ chainId, expected }) => {
      const result = Schema.decodeUnknownSync(Quote.Quote)({
        ...validQuoteData,
        chainId,
      })
      expect(result.chainId).toBe(expected)
    },
  )

  test.each([
    { expected: 6, paymentTokenDecimals: 6 },
    { expected: 8, paymentTokenDecimals: 8 },
    { expected: 18, paymentTokenDecimals: 18 },
  ])(
    'behavior: decodes quote with paymentTokenDecimals $paymentTokenDecimals',
    ({ paymentTokenDecimals, expected }) => {
      const result = Schema.decodeUnknownSync(Quote.Quote)({
        ...validQuoteData,
        paymentTokenDecimals,
      })
      expect(result.paymentTokenDecimals).toBe(expected)
    },
  )

  test.each([
    { expected: 60, ttl: 60 },
    { expected: 300, ttl: 300 },
    { expected: 3600, ttl: 3600 },
  ])('behavior: decodes quote with ttl $ttl', ({ ttl, expected }) => {
    const result = Schema.decodeUnknownSync(Quote.Quote)({
      ...validQuoteData,
      ttl,
    })
    expect(result.ttl).toBe(expected)
  })

  test('error: rejects invalid address format for authorizationAddress', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quote.Quote)({
        ...validQuoteData,
        authorizationAddress: 'invalid-address',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-address"
      Path: authorizationAddress

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: number; readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly ttl: number; readonly txGas: (\`0x\${string}\` <-> bigint) }
      └─ ["authorizationAddress"]
         └─ \`0x\${string}\` | null | undefined
            ├─ \`0x\${string}\` | null
            │  ├─ Expected \`0x\${string}\`, actual "invalid-address"
            │  └─ Expected null, actual "invalid-address"
            └─ Expected undefined, actual "invalid-address"]
    `)
  })

  test('error: rejects invalid address format for orchestrator', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quote.Quote)({
        ...validQuoteData,
        orchestrator: 'invalid-address',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-address"
      Path: orchestrator

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: number; readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly ttl: number; readonly txGas: (\`0x\${string}\` <-> bigint) }
      └─ ["orchestrator"]
         └─ Expected \`0x\${string}\`, actual "invalid-address"]
    `)
  })

  test('error: rejects invalid hex format for BigInt fields', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quote.Quote)({
        ...validQuoteData,
        ethPrice: 'not-hex',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "not-hex"
      Path: ethPrice

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: number; readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly ttl: number; readonly txGas: (\`0x\${string}\` <-> bigint) }
      └─ ["ethPrice"]
         └─ (\`0x\${string}\` <-> bigint)
            └─ Encoded side transformation failure
               └─ Expected \`0x\${string}\`, actual "not-hex"]
    `)
  })

  test('error: rejects invalid number format for chainId', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quote.Quote)({
        ...validQuoteData,
        chainId: 'not-a-number',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected number, actual "not-a-number"
      Path: chainId

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: number; readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly ttl: number; readonly txGas: (\`0x\${string}\` <-> bigint) }
      └─ ["chainId"]
         └─ Expected number, actual "not-a-number"]
    `)
  })

  test('error: rejects missing required fields', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quote.Quote)({
        chainId: 1,
        // Missing other required fields
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`ethPrice\` is missing
      Path: ethPrice

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: number; readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly ttl: number; readonly txGas: (\`0x\${string}\` <-> bigint) }
      └─ ["ethPrice"]
         └─ is missing]
    `)
  })

  test('error: rejects invalid nativeFeeEstimate structure', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quote.Quote)({
        ...validQuoteData,
        nativeFeeEstimate: {
          maxFeePerGas: 'not-hex',
          maxPriorityFeePerGas: '0x59682f00',
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "not-hex"
      Path: nativeFeeEstimate.maxFeePerGas

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: number; readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly ttl: number; readonly txGas: (\`0x\${string}\` <-> bigint) }
      └─ ["nativeFeeEstimate"]
         └─ { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }
            └─ ["maxFeePerGas"]
               └─ (\`0x\${string}\` <-> bigint)
                  └─ Encoded side transformation failure
                     └─ Expected \`0x\${string}\`, actual "not-hex"]
    `)
  })
})

describe('Signed', () => {
  const validSignedData = {
    authorizationAddress: '0x1234567890123456789012345678901234567890',
    chainId: 1,
    ethPrice: '0x1bc16d674ec80000',
    extraPayment: '0x0',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    intent: {
      combinedGas: '0x5208',
      encodedPreCalls: [],
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
    },
    nativeFeeEstimate: {
      maxFeePerGas: '0x3b9aca00',
      maxPriorityFeePerGas: '0x59682f00',
    },
    orchestrator: '0x9876543210987654321098765432109876543210',
    paymentTokenDecimals: 18,
    r: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    s: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    ttl: 300,
    txGas: '0x5208',
    v: '0x1b',
    yParity: '0x0',
  }

  test('behavior: decodes valid signed quote with all fields', () => {
    const result = Schema.decodeUnknownSync(Quote.Signed)(validSignedData)
    expect(result).toMatchInlineSnapshot(`
      {
        "authorizationAddress": "0x1234567890123456789012345678901234567890",
        "chainId": 1,
        "ethPrice": 2000000000000000000n,
        "extraPayment": 0n,
        "hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        "intent": {
          "combinedGas": 21000n,
          "encodedPreCalls": [],
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
        },
        "nativeFeeEstimate": {
          "maxFeePerGas": 1000000000n,
          "maxPriorityFeePerGas": 1500000000n,
        },
        "orchestrator": "0x9876543210987654321098765432109876543210",
        "paymentTokenDecimals": 18,
        "r": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "s": "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
        "ttl": 300,
        "txGas": 21000n,
        "v": "0x1b",
        "yParity": "0x0",
      }
    `)
  })

  test('behavior: encodes valid signed quote data', () => {
    const decodedData = Schema.decodeUnknownSync(Quote.Signed)(validSignedData)
    const encodedData = Schema.encodeSync(Quote.Signed)(decodedData)
    expect(encodedData).toMatchInlineSnapshot(`
      {
        "authorizationAddress": "0x1234567890123456789012345678901234567890",
        "chainId": 1,
        "ethPrice": "0x1bc16d674ec80000",
        "extraPayment": "0x0",
        "hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        "intent": {
          "combinedGas": "0x5208",
          "encodedPreCalls": [],
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
        },
        "nativeFeeEstimate": {
          "maxFeePerGas": "0x3b9aca00",
          "maxPriorityFeePerGas": "0x59682f00",
        },
        "orchestrator": "0x9876543210987654321098765432109876543210",
        "paymentTokenDecimals": 18,
        "r": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "s": "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
        "ttl": 300,
        "txGas": "0x5208",
        "v": "0x1b",
        "yParity": "0x0",
      }
    `)
  })

  test('behavior: round-trip encoding/decoding preserves signed data', () => {
    const originalDecoded = Schema.decodeUnknownSync(Quote.Signed)(
      validSignedData,
    )
    const encoded = Schema.encodeSync(Quote.Signed)(originalDecoded)
    const reDecoded = Schema.decodeUnknownSync(Quote.Signed)(encoded)

    expect(reDecoded).toEqual(originalDecoded)
  })

  test('behavior: decodes signed quote with optional v field undefined', () => {
    const dataWithUndefinedV = {
      ...validSignedData,
      v: undefined,
    }
    const result = Schema.decodeUnknownSync(Quote.Signed)(dataWithUndefinedV)
    expect(result.v).toBeUndefined()
    expect(result.yParity).toBe('0x0')
  })

  test('behavior: decodes signed quote with optional yParity field undefined', () => {
    const dataWithUndefinedYParity = {
      ...validSignedData,
      yParity: undefined,
    }
    const result = Schema.decodeUnknownSync(Quote.Signed)(
      dataWithUndefinedYParity,
    )
    expect(result.yParity).toBeUndefined()
    expect(result.v).toBe('0x1b')
  })

  test('behavior: decodes signed quote with both v and yParity undefined', () => {
    const dataWithBothUndefined = {
      ...validSignedData,
      v: undefined,
      yParity: undefined,
    }
    const result = Schema.decodeUnknownSync(Quote.Signed)(dataWithBothUndefined)
    expect(result.v).toBeUndefined()
    expect(result.yParity).toBeUndefined()
  })

  test.each([
    {
      data: {
        ...validSignedData,
        v: '0x1b',
        yParity: undefined,
      },
      expectedV: '0x1b',
      expectedYParity: undefined,
    },
    {
      data: {
        ...validSignedData,
        v: undefined,
        yParity: '0x1',
      },
      expectedV: undefined,
      expectedYParity: '0x1',
    },
  ])(
    'behavior: decodes signed quote with v=$expectedV yParity=$expectedYParity',
    ({ data, expectedV, expectedYParity }) => {
      const result = Schema.decodeUnknownSync(Quote.Signed)(data)
      expect(result.v).toBe(expectedV)
      expect(result.yParity).toBe(expectedYParity)
    },
  )

  test('behavior: inherits all base Quote fields', () => {
    const result = Schema.decodeUnknownSync(Quote.Signed)(validSignedData)

    // Verify all Quote fields are present
    expect(result.authorizationAddress).toBe(
      validSignedData.authorizationAddress,
    )
    expect(result.chainId).toBe(validSignedData.chainId)
    expect(result.ethPrice).toBe(2000000000000000000n)
    expect(result.extraPayment).toBe(0n)
    expect(result.intent).toBeDefined()
    expect(result.nativeFeeEstimate).toBeDefined()
    expect(result.orchestrator).toBe(validSignedData.orchestrator)
    expect(result.paymentTokenDecimals).toBe(
      validSignedData.paymentTokenDecimals,
    )
    expect(result.ttl).toBe(validSignedData.ttl)
    expect(result.txGas).toBe(21000n)

    // Verify signature fields are present
    expect(result.hash).toBe(validSignedData.hash)
    expect(result.r).toBe(validSignedData.r)
    expect(result.s).toBe(validSignedData.s)
    expect(result.v).toBe(validSignedData.v)
    expect(result.yParity).toBe(validSignedData.yParity)
  })

  test('error: rejects invalid hash format', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quote.Signed)({
        ...validSignedData,
        hash: 'invalid-hash',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-hash"
      Path: hash

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: number; readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly ttl: number; readonly txGas: (\`0x\${string}\` <-> bigint); readonly hash: \`0x\${string}\`; readonly r: \`0x\${string}\`; readonly s: \`0x\${string}\`; readonly v?: \`0x\${string}\` | undefined; readonly yParity?: \`0x\${string}\` | undefined }
      └─ ["hash"]
         └─ Expected \`0x\${string}\`, actual "invalid-hash"]
    `)
  })

  test('error: rejects invalid r signature component', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quote.Signed)({
        ...validSignedData,
        r: 'invalid-r',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-r"
      Path: r

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: number; readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly ttl: number; readonly txGas: (\`0x\${string}\` <-> bigint); readonly hash: \`0x\${string}\`; readonly r: \`0x\${string}\`; readonly s: \`0x\${string}\`; readonly v?: \`0x\${string}\` | undefined; readonly yParity?: \`0x\${string}\` | undefined }
      └─ ["r"]
         └─ Expected \`0x\${string}\`, actual "invalid-r"]
    `)
  })

  test('error: rejects invalid s signature component', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quote.Signed)({
        ...validSignedData,
        s: 'invalid-s',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-s"
      Path: s

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: number; readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly ttl: number; readonly txGas: (\`0x\${string}\` <-> bigint); readonly hash: \`0x\${string}\`; readonly r: \`0x\${string}\`; readonly s: \`0x\${string}\`; readonly v?: \`0x\${string}\` | undefined; readonly yParity?: \`0x\${string}\` | undefined }
      └─ ["s"]
         └─ Expected \`0x\${string}\`, actual "invalid-s"]
    `)
  })

  test('error: rejects invalid v signature component', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quote.Signed)({
        ...validSignedData,
        v: 'invalid-v',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-v"
      Path: v

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: number; readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly ttl: number; readonly txGas: (\`0x\${string}\` <-> bigint); readonly hash: \`0x\${string}\`; readonly r: \`0x\${string}\`; readonly s: \`0x\${string}\`; readonly v?: \`0x\${string}\` | undefined; readonly yParity?: \`0x\${string}\` | undefined }
      └─ ["v"]
         └─ \`0x\${string}\` | undefined
            ├─ Expected \`0x\${string}\`, actual "invalid-v"
            └─ Expected undefined, actual "invalid-v"]
    `)
  })

  test('error: rejects invalid yParity signature component', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quote.Signed)({
        ...validSignedData,
        yParity: 'invalid-yParity',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-yParity"
      Path: yParity

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: number; readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly ttl: number; readonly txGas: (\`0x\${string}\` <-> bigint); readonly hash: \`0x\${string}\`; readonly r: \`0x\${string}\`; readonly s: \`0x\${string}\`; readonly v?: \`0x\${string}\` | undefined; readonly yParity?: \`0x\${string}\` | undefined }
      └─ ["yParity"]
         └─ \`0x\${string}\` | undefined
            ├─ Expected \`0x\${string}\`, actual "invalid-yParity"
            └─ Expected undefined, actual "invalid-yParity"]
    `)
  })

  test('error: rejects missing required signature fields', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quote.Signed)({
        ...validSignedData,
        hash: undefined,
        r: undefined,
        s: undefined,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual undefined
      Path: hash

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: number; readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly prePaymentAmount: (\`0x\${string}\` <-> bigint); readonly prePaymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\`; readonly totalPaymentAmount: (\`0x\${string}\` <-> bigint); readonly totalPaymentMaxAmount: (\`0x\${string}\` <-> bigint) }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly ttl: number; readonly txGas: (\`0x\${string}\` <-> bigint); readonly hash: \`0x\${string}\`; readonly r: \`0x\${string}\`; readonly s: \`0x\${string}\`; readonly v?: \`0x\${string}\` | undefined; readonly yParity?: \`0x\${string}\` | undefined }
      └─ ["hash"]
         └─ Expected \`0x\${string}\`, actual undefined]
    `)
  })

  test('misc: signed quote contains all quote fields plus signature fields', () => {
    const signedDecoded = Schema.decodeUnknownSync(Quote.Signed)(
      validSignedData,
    )
    const { hash, r, s, v, yParity, ...quoteOnlyData } = validSignedData
    const quoteDecoded = Schema.decodeUnknownSync(Quote.Quote)(quoteOnlyData)

    // Verify all Quote fields match
    expect(signedDecoded.authorizationAddress).toBe(
      quoteDecoded.authorizationAddress,
    )
    expect(signedDecoded.chainId).toBe(quoteDecoded.chainId)
    expect(signedDecoded.ethPrice).toBe(quoteDecoded.ethPrice)
    expect(signedDecoded.extraPayment).toBe(quoteDecoded.extraPayment)
    expect(signedDecoded.intent).toEqual(quoteDecoded.intent)
    expect(signedDecoded.nativeFeeEstimate).toEqual(
      quoteDecoded.nativeFeeEstimate,
    )
    expect(signedDecoded.orchestrator).toBe(quoteDecoded.orchestrator)
    expect(signedDecoded.paymentTokenDecimals).toBe(
      quoteDecoded.paymentTokenDecimals,
    )
    expect(signedDecoded.ttl).toBe(quoteDecoded.ttl)
    expect(signedDecoded.txGas).toBe(quoteDecoded.txGas)

    // Verify signature fields are only present in signed quote
    expect(signedDecoded.hash).toBeDefined()
    expect(signedDecoded.r).toBeDefined()
    expect(signedDecoded.s).toBeDefined()
    expect(signedDecoded.v).toBeDefined()
    expect(signedDecoded.yParity).toBeDefined()
  })
})

import { describe, expect, test } from 'vitest'
import * as Schema from '../../schema/schema.js'
import * as Quotes from './quotes.js'

describe('Quote', () => {
  const validQuoteData = {
    authorizationAddress: '0x1234567890123456789012345678901234567890',
    chainId: '0x1',
    ethPrice: '0x1bc16d674ec80000',
    extraPayment: '0x0',
    feeTokenDeficit: '0x32',
    intent: {
      combinedGas: '0x5208',
      encodedFundTransfers: [],
      encodedPreCalls: [],
      eoa: '0x1234567890123456789012345678901234567890',
      executionData: '0xabcdef',
      expiry: '0x1234567890',
      funder: '0x1234567890123456789012345678901234567890',
      funderSignature: '0xfundersig123',
      isMultichain: false,
      nonce: '0x1',
      payer: '0x1234567890123456789012345678901234567890',
      paymentAmount: '0x12c',
      paymentMaxAmount: '0x190',
      paymentRecipient: '0x9876543210987654321098765432109876543210',
      paymentSignature: '0x123456',
      paymentToken: '0xa0b86991c31cc0c7b6f931c7d751c635d989dc1bb',
      settler: '0x9876543210987654321098765432109876543210',
      settlerContext: '0xsettlercontext123',
      signature: '0xsignature123',
      supportedAccountImplementation:
        '0x0000000000000000000000000000000000000000',
    },
    nativeFeeEstimate: {
      maxFeePerGas: '0x3b9aca00',
      maxPriorityFeePerGas: '0x59682f00',
    },
    orchestrator: '0x9876543210987654321098765432109876543210',
    paymentTokenDecimals: 18,
    txGas: '0x5208',
  }

  test('behavior: decodes valid quote with all fields', () => {
    const result = Schema.decodeUnknownSync(Quotes.Quote)(validQuoteData)
    expect(result).toMatchInlineSnapshot(`
      {
        "authorizationAddress": "0x1234567890123456789012345678901234567890",
        "chainId": 1,
        "ethPrice": 2000000000000000000n,
        "extraPayment": 0n,
        "feeTokenDeficit": 50n,
        "intent": {
          "combinedGas": 21000n,
          "encodedFundTransfers": [],
          "encodedPreCalls": [],
          "eoa": "0x1234567890123456789012345678901234567890",
          "executionData": "0xabcdef",
          "expiry": 78187493520n,
          "funder": "0x1234567890123456789012345678901234567890",
          "funderSignature": "0xfundersig123",
          "isMultichain": false,
          "nonce": 1n,
          "payer": "0x1234567890123456789012345678901234567890",
          "paymentAmount": 300n,
          "paymentMaxAmount": 400n,
          "paymentRecipient": "0x9876543210987654321098765432109876543210",
          "paymentSignature": "0x123456",
          "paymentToken": "0xa0b86991c31cc0c7b6f931c7d751c635d989dc1bb",
          "settler": "0x9876543210987654321098765432109876543210",
          "settlerContext": "0xsettlercontext123",
          "signature": "0xsignature123",
          "supportedAccountImplementation": "0x0000000000000000000000000000000000000000",
        },
        "nativeFeeEstimate": {
          "maxFeePerGas": 1000000000n,
          "maxPriorityFeePerGas": 1500000000n,
        },
        "orchestrator": "0x9876543210987654321098765432109876543210",
        "paymentTokenDecimals": 18,
        "txGas": 21000n,
      }
    `)
  })

  test('behavior: encodes valid quote data', () => {
    const decodedData = Schema.decodeUnknownSync(Quotes.Quote)(validQuoteData)
    const encodedData = Schema.encodeSync(Quotes.Quote)(decodedData)
    expect(encodedData).toMatchInlineSnapshot(`
      {
        "authorizationAddress": "0x1234567890123456789012345678901234567890",
        "chainId": "0x1",
        "ethPrice": "0x1bc16d674ec80000",
        "extraPayment": "0x0",
        "feeTokenDeficit": "0x32",
        "intent": {
          "combinedGas": "0x5208",
          "encodedFundTransfers": [],
          "encodedPreCalls": [],
          "eoa": "0x1234567890123456789012345678901234567890",
          "executionData": "0xabcdef",
          "expiry": "0x1234567890",
          "funder": "0x1234567890123456789012345678901234567890",
          "funderSignature": "0xfundersig123",
          "isMultichain": false,
          "nonce": "0x1",
          "payer": "0x1234567890123456789012345678901234567890",
          "paymentAmount": "0x12c",
          "paymentMaxAmount": "0x190",
          "paymentRecipient": "0x9876543210987654321098765432109876543210",
          "paymentSignature": "0x123456",
          "paymentToken": "0xa0b86991c31cc0c7b6f931c7d751c635d989dc1bb",
          "settler": "0x9876543210987654321098765432109876543210",
          "settlerContext": "0xsettlercontext123",
          "signature": "0xsignature123",
          "supportedAccountImplementation": "0x0000000000000000000000000000000000000000",
        },
        "nativeFeeEstimate": {
          "maxFeePerGas": "0x3b9aca00",
          "maxPriorityFeePerGas": "0x59682f00",
        },
        "orchestrator": "0x9876543210987654321098765432109876543210",
        "paymentTokenDecimals": 18,
        "txGas": "0x5208",
      }
    `)
  })

  test('behavior: round-trip encoding/decoding preserves data', () => {
    const originalDecoded = Schema.decodeUnknownSync(Quotes.Quote)(
      validQuoteData,
    )
    const encoded = Schema.encodeSync(Quotes.Quote)(originalDecoded)
    const reDecoded = Schema.decodeUnknownSync(Quotes.Quote)(encoded)

    expect(reDecoded).toEqual(originalDecoded)
  })

  test('behavior: decodes quote with null authorizationAddress', () => {
    const dataWithNullAuth = {
      ...validQuoteData,
      authorizationAddress: null,
    }
    const result = Schema.decodeUnknownSync(Quotes.Quote)(dataWithNullAuth)
    expect(result.authorizationAddress).toBeNull()
  })

  test('behavior: decodes quote with undefined authorizationAddress', () => {
    const dataWithUndefinedAuth = {
      ...validQuoteData,
      authorizationAddress: undefined,
    }
    const result = Schema.decodeUnknownSync(Quotes.Quote)(dataWithUndefinedAuth)
    expect(result.authorizationAddress).toBeUndefined()
  })

  test('behavior: decodes quote with large BigInt values', () => {
    const dataWithLargeBigInts = {
      ...validQuoteData,
      ethPrice: '0xffffffffffffffffffffffffffffffffff',
      extraPayment: '0xffffffffffffffffffffffffffffffffffff',
      feeTokenDeficit: '0xffffffffffffffffffffffffffffff',
      txGas: '0xffffffffffffffffffffffffffffffff',
    }
    const result = Schema.decodeUnknownSync(Quotes.Quote)(dataWithLargeBigInts)
    expect(result.ethPrice).toBe(BigInt('0xffffffffffffffffffffffffffffffffff'))
    expect(result.extraPayment).toBe(
      BigInt('0xffffffffffffffffffffffffffffffffffff'),
    )
    expect(result.feeTokenDeficit).toBe(
      BigInt('0xffffffffffffffffffffffffffffff'),
    )
    expect(result.txGas).toBe(BigInt('0xffffffffffffffffffffffffffffffff'))
  })

  test('behavior: encodes large BigInt values back to hex', () => {
    const dataWithLargeBigInts = {
      ...validQuoteData,
      ethPrice: '0xff',
      extraPayment: '0xffff',
      feeTokenDeficit: '0xfffff',
      txGas: '0xffffff',
    }
    const decoded = Schema.decodeUnknownSync(Quotes.Quote)(dataWithLargeBigInts)
    const encoded = Schema.encodeSync(Quotes.Quote)(decoded)
    expect(encoded.ethPrice).toBe('0xff')
    expect(encoded.extraPayment).toBe('0xffff')
    expect(encoded.feeTokenDeficit).toBe('0xfffff')
    expect(encoded.txGas).toBe('0xffffff')
  })

  test.each([
    { chainId: '0x1', expected: 1 },
    { chainId: '0x5', expected: 5 },
    { chainId: '0x89', expected: 137 },
    { chainId: '0x10435', expected: 66613 },
  ])(
    'behavior: decodes quote with chainId $chainId',
    ({ chainId, expected }) => {
      const result = Schema.decodeUnknownSync(Quotes.Quote)({
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
      const result = Schema.decodeUnknownSync(Quotes.Quote)({
        ...validQuoteData,
        paymentTokenDecimals,
      })
      expect(result.paymentTokenDecimals).toBe(expected)
    },
  )

  test('error: rejects invalid address format for authorizationAddress', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quotes.Quote)({
        ...validQuoteData,
        authorizationAddress: 'invalid-address',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-address"
      Path: authorizationAddress

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: (\`0x\${string}\` <-> number); readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly feeTokenDeficit: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedFundTransfers: ReadonlyArray<\`0x\${string}\`>; readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly expiry: (\`0x\${string}\` <-> bigint); readonly funder: \`0x\${string}\`; readonly funderSignature: \`0x\${string}\`; readonly isMultichain: boolean; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentAmount: (\`0x\${string}\` <-> bigint); readonly paymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly settler: \`0x\${string}\`; readonly settlerContext: \`0x\${string}\`; readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\` }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly txGas: (\`0x\${string}\` <-> bigint) }
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
      Schema.decodeUnknownSync(Quotes.Quote)({
        ...validQuoteData,
        orchestrator: 'invalid-address',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-address"
      Path: orchestrator

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: (\`0x\${string}\` <-> number); readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly feeTokenDeficit: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedFundTransfers: ReadonlyArray<\`0x\${string}\`>; readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly expiry: (\`0x\${string}\` <-> bigint); readonly funder: \`0x\${string}\`; readonly funderSignature: \`0x\${string}\`; readonly isMultichain: boolean; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentAmount: (\`0x\${string}\` <-> bigint); readonly paymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly settler: \`0x\${string}\`; readonly settlerContext: \`0x\${string}\`; readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\` }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly txGas: (\`0x\${string}\` <-> bigint) }
      └─ ["orchestrator"]
         └─ Expected \`0x\${string}\`, actual "invalid-address"]
    `)
  })

  test('error: rejects invalid hex format for BigInt fields', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quotes.Quote)({
        ...validQuoteData,
        ethPrice: 'not-hex',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "not-hex"
      Path: ethPrice

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: (\`0x\${string}\` <-> number); readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly feeTokenDeficit: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedFundTransfers: ReadonlyArray<\`0x\${string}\`>; readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly expiry: (\`0x\${string}\` <-> bigint); readonly funder: \`0x\${string}\`; readonly funderSignature: \`0x\${string}\`; readonly isMultichain: boolean; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentAmount: (\`0x\${string}\` <-> bigint); readonly paymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly settler: \`0x\${string}\`; readonly settlerContext: \`0x\${string}\`; readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\` }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly txGas: (\`0x\${string}\` <-> bigint) }
      └─ ["ethPrice"]
         └─ (\`0x\${string}\` <-> bigint)
            └─ Encoded side transformation failure
               └─ Expected \`0x\${string}\`, actual "not-hex"]
    `)
  })

  test('error: rejects invalid number format for chainId', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quotes.Quote)({
        ...validQuoteData,
        chainId: 'not-a-number',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "not-a-number"
      Path: chainId

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: (\`0x\${string}\` <-> number); readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly feeTokenDeficit: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedFundTransfers: ReadonlyArray<\`0x\${string}\`>; readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly expiry: (\`0x\${string}\` <-> bigint); readonly funder: \`0x\${string}\`; readonly funderSignature: \`0x\${string}\`; readonly isMultichain: boolean; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentAmount: (\`0x\${string}\` <-> bigint); readonly paymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly settler: \`0x\${string}\`; readonly settlerContext: \`0x\${string}\`; readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\` }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly txGas: (\`0x\${string}\` <-> bigint) }
      └─ ["chainId"]
         └─ (\`0x\${string}\` <-> number)
            └─ Encoded side transformation failure
               └─ Expected \`0x\${string}\`, actual "not-a-number"]
    `)
  })

  test('error: rejects missing required fields', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quotes.Quote)({
        chainId: 1,
        // Missing other required fields
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual 1
      Path: chainId

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: (\`0x\${string}\` <-> number); readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly feeTokenDeficit: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedFundTransfers: ReadonlyArray<\`0x\${string}\`>; readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly expiry: (\`0x\${string}\` <-> bigint); readonly funder: \`0x\${string}\`; readonly funderSignature: \`0x\${string}\`; readonly isMultichain: boolean; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentAmount: (\`0x\${string}\` <-> bigint); readonly paymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly settler: \`0x\${string}\`; readonly settlerContext: \`0x\${string}\`; readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\` }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly txGas: (\`0x\${string}\` <-> bigint) }
      └─ ["chainId"]
         └─ (\`0x\${string}\` <-> number)
            └─ Encoded side transformation failure
               └─ Expected \`0x\${string}\`, actual 1]
    `)
  })

  test('error: rejects invalid nativeFeeEstimate structure', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quotes.Quote)({
        ...validQuoteData,
        nativeFeeEstimate: {
          maxFeePerGas: 'not-hex',
          maxPriorityFeePerGas: '0x59682f00',
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "not-hex"
      Path: nativeFeeEstimate.maxFeePerGas

      Details: { readonly authorizationAddress?: \`0x\${string}\` | null | undefined; readonly chainId: (\`0x\${string}\` <-> number); readonly ethPrice: (\`0x\${string}\` <-> bigint); readonly extraPayment: (\`0x\${string}\` <-> bigint); readonly feeTokenDeficit: (\`0x\${string}\` <-> bigint); readonly intent: { readonly combinedGas: (\`0x\${string}\` <-> bigint); readonly encodedFundTransfers: ReadonlyArray<\`0x\${string}\`>; readonly encodedPreCalls: ReadonlyArray<\`0x\${string}\`>; readonly eoa: \`0x\${string}\`; readonly executionData: \`0x\${string}\`; readonly expiry: (\`0x\${string}\` <-> bigint); readonly funder: \`0x\${string}\`; readonly funderSignature: \`0x\${string}\`; readonly isMultichain: boolean; readonly nonce: (\`0x\${string}\` <-> bigint); readonly payer: \`0x\${string}\`; readonly paymentAmount: (\`0x\${string}\` <-> bigint); readonly paymentMaxAmount: (\`0x\${string}\` <-> bigint); readonly paymentRecipient: \`0x\${string}\`; readonly paymentSignature: \`0x\${string}\`; readonly paymentToken: \`0x\${string}\`; readonly settler: \`0x\${string}\`; readonly settlerContext: \`0x\${string}\`; readonly signature: \`0x\${string}\`; readonly supportedAccountImplementation: \`0x\${string}\` }; readonly nativeFeeEstimate: { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }; readonly orchestrator: \`0x\${string}\`; readonly paymentTokenDecimals: number; readonly txGas: (\`0x\${string}\` <-> bigint) }
      └─ ["nativeFeeEstimate"]
         └─ { readonly maxFeePerGas: (\`0x\${string}\` <-> bigint); readonly maxPriorityFeePerGas: (\`0x\${string}\` <-> bigint) }
            └─ ["maxFeePerGas"]
               └─ (\`0x\${string}\` <-> bigint)
                  └─ Encoded side transformation failure
                     └─ Expected \`0x\${string}\`, actual "not-hex"]
    `)
  })
})

describe('Quotes', () => {
  const validQuotesData = {
    multiChainRoot: '0xabcdef1234567890',
    quotes: [
      {
        authorizationAddress: '0x1234567890123456789012345678901234567890',
        chainId: '0x1',
        ethPrice: '0x1bc16d674ec80000',
        extraPayment: '0x0',
        feeTokenDeficit: '0x32',
        intent: {
          combinedGas: '0x5208',
          encodedFundTransfers: [],
          encodedPreCalls: [],
          eoa: '0x1234567890123456789012345678901234567890',
          executionData: '0xabcdef',
          expiry: '0x1234567890',
          funder: '0x1234567890123456789012345678901234567890',
          funderSignature: '0xfundersig123',
          isMultichain: false,
          nonce: '0x1',
          payer: '0x1234567890123456789012345678901234567890',
          paymentAmount: '0x12c',
          paymentMaxAmount: '0x190',
          paymentRecipient: '0x9876543210987654321098765432109876543210',
          paymentSignature: '0x123456',
          paymentToken: '0xa0b86991c31cc0c7b6f931c7d751c635d989dc1bb',
          settler: '0x9876543210987654321098765432109876543210',
          settlerContext: '0xsettlercontext123',
          signature: '0xsignature123',
          supportedAccountImplementation:
            '0x0000000000000000000000000000000000000000',
        },
        nativeFeeEstimate: {
          maxFeePerGas: '0x3b9aca00',
          maxPriorityFeePerGas: '0x59682f00',
        },
        orchestrator: '0x9876543210987654321098765432109876543210',
        paymentTokenDecimals: 18,
        txGas: '0x5208',
      },
    ],
    ttl: 300,
  }

  test('behavior: decodes valid quotes with all fields', () => {
    const result = Schema.decodeUnknownSync(Quotes.Quotes)(validQuotesData)
    expect(result.quotes).toHaveLength(1)
    expect(result.multiChainRoot).toBe('0xabcdef1234567890')
    expect(result.ttl).toBe(300)
  })

  test('behavior: decodes quotes without optional multiChainRoot', () => {
    const dataWithoutMultiChain = {
      ...validQuotesData,
      multiChainRoot: undefined,
    }
    const result = Schema.decodeUnknownSync(Quotes.Quotes)(
      dataWithoutMultiChain,
    )
    expect(result.multiChainRoot).toBeUndefined()
    expect(result.quotes).toHaveLength(1)
    expect(result.ttl).toBe(300)
  })

  test('behavior: encodes valid quotes data', () => {
    const decodedData = Schema.decodeUnknownSync(Quotes.Quotes)(validQuotesData)
    const encodedData = Schema.encodeSync(Quotes.Quotes)(decodedData)
    expect(encodedData.quotes).toHaveLength(1)
    expect(encodedData.multiChainRoot).toBe('0xabcdef1234567890')
    expect(encodedData.ttl).toBe(300)
  })

  test('error: rejects empty quotes array', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quotes.Quotes)({
        ...validQuotesData,
        quotes: [],
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected an array of at least 1 item(s), actual []
      Path: quotes

      Details: { readonly multiChainRoot?: \`0x\${string}\` | null | undefined; readonly quotes: minItems(1); readonly ttl: number }
      └─ ["quotes"]
         └─ minItems(1)
            └─ Predicate refinement failure
               └─ Expected an array of at least 1 item(s), actual []]
    `)
  })

  test('error: rejects missing required fields', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quotes.Quotes)({
        multiChainRoot: '0xabcdef1234567890',
        // Missing quotes and ttl
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`quotes\` is missing
      Path: quotes

      Details: { readonly multiChainRoot?: \`0x\${string}\` | null | undefined; readonly quotes: minItems(1); readonly ttl: number }
      └─ ["quotes"]
         └─ is missing]
    `)
  })
})

describe('Signed', () => {
  const validSignedData = {
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    multiChainRoot: '0xabcdef1234567890',
    quotes: [
      {
        authorizationAddress: '0x1234567890123456789012345678901234567890',
        chainId: '0x1',
        ethPrice: '0x1bc16d674ec80000',
        extraPayment: '0x0',
        feeTokenDeficit: '0x32',
        intent: {
          combinedGas: '0x5208',
          encodedFundTransfers: [],
          encodedPreCalls: [],
          eoa: '0x1234567890123456789012345678901234567890',
          executionData: '0xabcdef',
          expiry: '0x1234567890',
          funder: '0x1234567890123456789012345678901234567890',
          funderSignature: '0xfundersig123',
          isMultichain: false,
          nonce: '0x1',
          payer: '0x1234567890123456789012345678901234567890',
          paymentAmount: '0x12c',
          paymentMaxAmount: '0x190',
          paymentRecipient: '0x9876543210987654321098765432109876543210',
          paymentSignature: '0x123456',
          paymentToken: '0xa0b86991c31cc0c7b6f931c7d751c635d989dc1bb',
          settler: '0x9876543210987654321098765432109876543210',
          settlerContext: '0xsettlercontext123',
          signature: '0xsignature123',
          supportedAccountImplementation:
            '0x0000000000000000000000000000000000000000',
        },
        nativeFeeEstimate: {
          maxFeePerGas: '0x3b9aca00',
          maxPriorityFeePerGas: '0x59682f00',
        },
        orchestrator: '0x9876543210987654321098765432109876543210',
        paymentTokenDecimals: 18,
        txGas: '0x5208',
      },
    ],
    r: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    s: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    ttl: 300,
    v: '0x1b',
    yParity: '0x0',
  }

  test('behavior: decodes valid signed quotes with all fields', () => {
    const result = Schema.decodeUnknownSync(Quotes.Signed)(validSignedData)
    expect(result.quotes).toHaveLength(1)
    expect(result.multiChainRoot).toBe('0xabcdef1234567890')
    expect(result.ttl).toBe(300)
    expect(result.hash).toBe(
      '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    )
    expect(result.r).toBe(
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    )
    expect(result.s).toBe(
      '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    )
    expect(result.v).toBe('0x1b')
    expect(result.yParity).toBe('0x0')
  })

  test('behavior: encodes valid signed quotes data', () => {
    const decodedData = Schema.decodeUnknownSync(Quotes.Signed)(validSignedData)
    const encodedData = Schema.encodeSync(Quotes.Signed)(decodedData)
    expect(encodedData.quotes).toHaveLength(1)
    expect(encodedData.multiChainRoot).toBe('0xabcdef1234567890')
    expect(encodedData.ttl).toBe(300)
    expect(encodedData.hash).toBe(
      '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    )
    expect(encodedData.r).toBe(
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    )
    expect(encodedData.s).toBe(
      '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    )
    expect(encodedData.v).toBe('0x1b')
    expect(encodedData.yParity).toBe('0x0')
  })

  test('behavior: round-trip encoding/decoding preserves signed data', () => {
    const originalDecoded = Schema.decodeUnknownSync(Quotes.Signed)(
      validSignedData,
    )
    const encoded = Schema.encodeSync(Quotes.Signed)(originalDecoded)
    const reDecoded = Schema.decodeUnknownSync(Quotes.Signed)(encoded)

    expect(reDecoded).toEqual(originalDecoded)
  })

  test('behavior: decodes signed quotes with optional v field undefined', () => {
    const dataWithUndefinedV = {
      ...validSignedData,
      v: undefined,
    }
    const result = Schema.decodeUnknownSync(Quotes.Signed)(dataWithUndefinedV)
    expect(result.v).toBeUndefined()
    expect(result.yParity).toBe('0x0')
  })

  test('behavior: decodes signed quotes with optional yParity field undefined', () => {
    const dataWithUndefinedYParity = {
      ...validSignedData,
      yParity: undefined,
    }
    const result = Schema.decodeUnknownSync(Quotes.Signed)(
      dataWithUndefinedYParity,
    )
    expect(result.yParity).toBeUndefined()
    expect(result.v).toBe('0x1b')
  })

  test('behavior: decodes signed quotes with both v and yParity undefined', () => {
    const dataWithBothUndefined = {
      ...validSignedData,
      v: undefined,
      yParity: undefined,
    }
    const result = Schema.decodeUnknownSync(Quotes.Signed)(
      dataWithBothUndefined,
    )
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
    'behavior: decodes signed quotes with v=$expectedV yParity=$expectedYParity',
    ({ data, expectedV, expectedYParity }) => {
      const result = Schema.decodeUnknownSync(Quotes.Signed)(data)
      expect(result.v).toBe(expectedV)
      expect(result.yParity).toBe(expectedYParity)
    },
  )

  test('behavior: inherits all base Quotes fields', () => {
    const result = Schema.decodeUnknownSync(Quotes.Signed)(validSignedData)

    // Verify all Quotes fields are present
    expect(result.quotes).toHaveLength(1)
    expect(result.multiChainRoot).toBe(validSignedData.multiChainRoot)
    expect(result.ttl).toBe(validSignedData.ttl)

    // Verify signature fields are present
    expect(result.hash).toBe(validSignedData.hash)
    expect(result.r).toBe(validSignedData.r)
    expect(result.s).toBe(validSignedData.s)
    expect(result.v).toBe(validSignedData.v)
    expect(result.yParity).toBe(validSignedData.yParity)
  })

  test('error: rejects invalid hash format', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quotes.Signed)({
        ...validSignedData,
        hash: 'invalid-hash',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-hash"
      Path: hash

      Details: { readonly multiChainRoot?: \`0x\${string}\` | null | undefined; readonly quotes: minItems(1); readonly ttl: number; readonly hash: \`0x\${string}\`; readonly r: \`0x\${string}\`; readonly s: \`0x\${string}\`; readonly v?: \`0x\${string}\` | undefined; readonly yParity?: \`0x\${string}\` | undefined }
      └─ ["hash"]
         └─ Expected \`0x\${string}\`, actual "invalid-hash"]
    `)
  })

  test('error: rejects invalid r signature component', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quotes.Signed)({
        ...validSignedData,
        r: 'invalid-r',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-r"
      Path: r

      Details: { readonly multiChainRoot?: \`0x\${string}\` | null | undefined; readonly quotes: minItems(1); readonly ttl: number; readonly hash: \`0x\${string}\`; readonly r: \`0x\${string}\`; readonly s: \`0x\${string}\`; readonly v?: \`0x\${string}\` | undefined; readonly yParity?: \`0x\${string}\` | undefined }
      └─ ["r"]
         └─ Expected \`0x\${string}\`, actual "invalid-r"]
    `)
  })

  test('error: rejects invalid s signature component', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quotes.Signed)({
        ...validSignedData,
        s: 'invalid-s',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-s"
      Path: s

      Details: { readonly multiChainRoot?: \`0x\${string}\` | null | undefined; readonly quotes: minItems(1); readonly ttl: number; readonly hash: \`0x\${string}\`; readonly r: \`0x\${string}\`; readonly s: \`0x\${string}\`; readonly v?: \`0x\${string}\` | undefined; readonly yParity?: \`0x\${string}\` | undefined }
      └─ ["s"]
         └─ Expected \`0x\${string}\`, actual "invalid-s"]
    `)
  })

  test('error: rejects invalid v signature component', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quotes.Signed)({
        ...validSignedData,
        v: 'invalid-v',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-v"
      Path: v

      Details: { readonly multiChainRoot?: \`0x\${string}\` | null | undefined; readonly quotes: minItems(1); readonly ttl: number; readonly hash: \`0x\${string}\`; readonly r: \`0x\${string}\`; readonly s: \`0x\${string}\`; readonly v?: \`0x\${string}\` | undefined; readonly yParity?: \`0x\${string}\` | undefined }
      └─ ["v"]
         └─ \`0x\${string}\` | undefined
            ├─ Expected \`0x\${string}\`, actual "invalid-v"
            └─ Expected undefined, actual "invalid-v"]
    `)
  })

  test('error: rejects invalid yParity signature component', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quotes.Signed)({
        ...validSignedData,
        yParity: 'invalid-yParity',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-yParity"
      Path: yParity

      Details: { readonly multiChainRoot?: \`0x\${string}\` | null | undefined; readonly quotes: minItems(1); readonly ttl: number; readonly hash: \`0x\${string}\`; readonly r: \`0x\${string}\`; readonly s: \`0x\${string}\`; readonly v?: \`0x\${string}\` | undefined; readonly yParity?: \`0x\${string}\` | undefined }
      └─ ["yParity"]
         └─ \`0x\${string}\` | undefined
            ├─ Expected \`0x\${string}\`, actual "invalid-yParity"
            └─ Expected undefined, actual "invalid-yParity"]
    `)
  })

  test('error: rejects missing required signature fields', () => {
    expect(() =>
      Schema.decodeUnknownSync(Quotes.Signed)({
        ...validSignedData,
        hash: undefined,
        r: undefined,
        s: undefined,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual undefined
      Path: hash

      Details: { readonly multiChainRoot?: \`0x\${string}\` | null | undefined; readonly quotes: minItems(1); readonly ttl: number; readonly hash: \`0x\${string}\`; readonly r: \`0x\${string}\`; readonly s: \`0x\${string}\`; readonly v?: \`0x\${string}\` | undefined; readonly yParity?: \`0x\${string}\` | undefined }
      └─ ["hash"]
         └─ Expected \`0x\${string}\`, actual undefined]
    `)
  })

  test('misc: signed quotes contains all quotes fields plus signature fields', () => {
    const signedDecoded = Schema.decodeUnknownSync(Quotes.Signed)(
      validSignedData,
    )
    const { hash, r, s, v, yParity, ...quotesOnlyData } = validSignedData
    const quotesDecoded = Schema.decodeUnknownSync(Quotes.Quotes)(
      quotesOnlyData,
    )

    // Verify all Quotes fields match
    expect(signedDecoded.quotes).toEqual(quotesDecoded.quotes)
    expect(signedDecoded.multiChainRoot).toBe(quotesDecoded.multiChainRoot)
    expect(signedDecoded.ttl).toBe(quotesDecoded.ttl)

    // Verify signature fields are only present in signed quotes
    expect(signedDecoded.hash).toBeDefined()
    expect(signedDecoded.r).toBeDefined()
    expect(signedDecoded.s).toBeDefined()
    expect(signedDecoded.v).toBeDefined()
    expect(signedDecoded.yParity).toBeDefined()
  })
})

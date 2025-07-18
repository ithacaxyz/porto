/**
 * Protocol Decoder Example Usage
 * Demonstrates how to use the Protocol Decoder system with CoWSwap on Base
 */

import {
  decodeProtocolSignature,
  type SignatureInput,
} from './ProtocolDecoder.js'
import './detectors/index.js' // Initialize detectors

/**
 * Example 1: CoWSwap Direct Usage on Base
 */
export async function example_cowswap_direct() {
  const input: SignatureInput = {
    chainId: 8453,
    context: {
      origin: 'swap.cow.fi',
    },
    typedData: {
      domain: {
        chainId: 8453,
        name: 'Gnosis Protocol',
        verifyingContract: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41', // Base
        version: 'v2',
      },
      message: {
        appData:
          '0x0000000000000000000000000000000000000000000000000000000000000000', // USDC on Base
        buyAmount: '420000000000000000', // WETH on Base
        buyToken: '0x4200000000000000000000000000000000000006', // 1000 USDC (6 decimals)
        feeAmount: '1000000', // 0.42 WETH (18 decimals)
        kind: 'sell', // 1 hour from now
        partiallyFillable: false,
        sellAmount: '1000000000', // 1 USDC fee
        sellToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        user: '0x1F49737b9Ca352782550cF58cdBbA421C0A52dC1',
        validTo: Math.floor(Date.now() / 1000) + 3600,
      },
      primaryType: 'Order',
      types: {
        Order: [
          { name: 'sellToken', type: 'address' },
          { name: 'buyToken', type: 'address' },
          { name: 'sellAmount', type: 'uint256' },
          { name: 'buyAmount', type: 'uint256' },
          { name: 'validTo', type: 'uint32' },
          { name: 'appData', type: 'bytes32' },
          { name: 'feeAmount', type: 'uint256' },
          { name: 'kind', type: 'string' },
          { name: 'partiallyFillable', type: 'bool' },
          { name: 'user', type: 'address' },
        ],
      },
    },
  }

  const result = await decodeProtocolSignature(input)

  console.log('CoWSwap Direct Usage Result:')
  console.log('Protocol:', result.protocol) // "CoW Protocol"
  console.log('Summary:', result.summary) // "Sell 1000.0000 USDC for 0.4200 WETH"
  console.log('Assets:', result.details.assets.length) // 2 (send USDC, receive WETH)
  console.log('Fees:', result.details.fees.length) // 1 (protocol fee)
  console.log('Warnings:', result.warnings?.length || 0) // Security warnings if any

  return result
}

/**
 * Example 2: CoWSwap via Safe.global Integration
 */
export async function example_cowswap_via_safe() {
  const input: SignatureInput = {
    chainId: 8453,
    context: {
      origin: 'safe.global',
    },
    typedData: {
      domain: {
        chainId: 8453,
        name: 'Gnosis Protocol',
        verifyingContract: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
        version: 'v2',
      },
      message: {
        appData:
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // USDC
        buyAmount: '2100000000000000000', // WETH
        buyToken: '0x4200000000000000000000000000000000000006', // 5000 USDC
        feeAmount: '5000000', // 2.1 WETH
        kind: 'sell', // 30 minutes
        partiallyFillable: false,
        sellAmount: '5000000000', // 5 USDC fee
        sellToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        user: '0x1F49737b9Ca352782550cF58cdBbA421C0A52dC1',
        validTo: Math.floor(Date.now() / 1000) + 1800,
      },
      primaryType: 'Order',
      types: {
        Order: [
          { name: 'sellToken', type: 'address' },
          { name: 'buyToken', type: 'address' },
          { name: 'sellAmount', type: 'uint256' },
          { name: 'buyAmount', type: 'uint256' },
          { name: 'validTo', type: 'uint32' },
          { name: 'appData', type: 'bytes32' },
          { name: 'feeAmount', type: 'uint256' },
          { name: 'kind', type: 'string' },
          { name: 'partiallyFillable', type: 'bool' },
          { name: 'user', type: 'address' },
        ],
      },
    },
  }

  const result = await decodeProtocolSignature(input)

  console.log('\nCoWSwap via Safe.global Result:')
  console.log('Protocol:', result.protocol) // "CoW Protocol (via Safe)"
  console.log('Summary:', result.summary)
  console.log('Widget Integration:', result.metadata?.widgetIntegration) // "Safe"
  console.log('Is Direct Usage:', result.metadata?.isDirectUsage) // false

  return result
}

/**
 * Example 3: Cross-Chain Intent using ERC-7683
 */
export async function example_crosschain_intent() {
  const input: SignatureInput = {
    chainId: 8453,
    typedData: {
      domain: {
        chainId: 8453,
        name: 'CrossChainBridge',
        verifyingContract: '0x1234567890abcdef1234567890abcdef12345678',
        version: '1',
      },
      message: {
        destinationChainId: 1, // Base
        destinationTokens: [
          {
            amount: '9950000000', // USDC on Ethereum
            recipient: '0x1F49737b9Ca352782550cF58cdBbA421C0A52dC1', // 9,950 USDC (after bridge fees)
            token: '0xa0b86a33e6d2f6c68bf18ae9f4c94bcec7f5c5b3',
          },
        ], // Ethereum
        fillDeadline: Math.floor(Date.now() / 1000) + 7200, // 2 hours
        originChainId: 8453,
        originTokens: [
          {
            amount: '10000000000', // 10,000 USDC
            token: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // USDC on Base
          },
        ],
        user: '0x1F49737b9Ca352782550cF58cdBbA421C0A52dC1',
      },
      primaryType: 'CrossChainOrder',
      types: {
        CrossChainOrder: [
          { name: 'originChainId', type: 'uint256' },
          { name: 'destinationChainId', type: 'uint256' },
          { name: 'user', type: 'address' },
          { name: 'originTokens', type: 'OriginToken[]' },
          { name: 'destinationTokens', type: 'DestinationToken[]' },
          { name: 'fillDeadline', type: 'uint32' },
        ],
        DestinationToken: [
          { name: 'token', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'recipient', type: 'address' },
        ],
        OriginToken: [
          { name: 'token', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
      },
    },
  }

  const result = await decodeProtocolSignature(input)

  console.log('\nCross-Chain Intent Result:')
  console.log('Protocol:', result.protocol) // "ERC-7683 CrossChainIntent"
  console.log('Summary:', result.summary) // "Bridge 10000.0000 USDC from Base to 9950.0000 USDC on Ethereum"
  console.log('Cross-chain:', result.metadata?.isStandardCompliant) // true
  console.log(
    'Warnings about cross-chain:',
    result.warnings?.filter((w) => w.includes('Cross-chain')),
  )

  return result
}

/**
 * Example 4: Unknown Protocol (fallback behavior)
 */
export async function example_unknown_protocol() {
  const input: SignatureInput = {
    chainId: 8453,
    typedData: {
      domain: {
        chainId: 8453,
        name: 'MyCustomProtocol',
      },
      message: {
        data: '0x1234567890abcdef',
        nonce: 42,
      },
      primaryType: 'CustomOrder',
      types: {
        CustomOrder: [
          { name: 'data', type: 'bytes' },
          { name: 'nonce', type: 'uint256' },
        ],
      },
    },
  }

  const result = await decodeProtocolSignature(input)

  console.log('\nUnknown Protocol Result:')
  console.log('Protocol:', result.protocol) // "Unknown Protocol"
  console.log('Action:', result.action) // "unknown_signature"
  console.log('Warnings:', result.warnings) // Security warnings
  console.log('Detection failed:', result.metadata?.detectionFailed) // true

  return result
}

/**
 * Example 5: Receiver Mismatch Warning
 */
export async function example_receiver_mismatch() {
  const input: SignatureInput = {
    chainId: 8453,
    typedData: {
      domain: {
        chainId: 8453,
        name: 'Gnosis Protocol',
      },
      message: {
        appData:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        buyAmount: '420000000000000000',
        buyToken: '0x4200000000000000000000000000000000000006',
        receiver: '0x9999999999999999999999999999999999999999', // ⚠️ Different address!
        sellAmount: '1000000000',
        sellToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        user: '0x1F49737b9Ca352782550cF58cdBbA421C0A52dC1',
        validTo: Math.floor(Date.now() / 1000) + 3600,
      },
      primaryType: 'Order',
      types: {
        Order: [
          { name: 'sellToken', type: 'address' },
          { name: 'buyToken', type: 'address' },
          { name: 'sellAmount', type: 'uint256' },
          { name: 'buyAmount', type: 'uint256' },
          { name: 'validTo', type: 'uint32' },
          { name: 'appData', type: 'bytes32' },
          { name: 'user', type: 'address' },
          { name: 'receiver', type: 'address' }, // Different receiver!
        ],
      },
    },
  }

  const result = await decodeProtocolSignature(input)

  console.log('\nReceiver Mismatch Result:')
  console.log('Protocol:', result.protocol)
  console.log(
    'Receiver warnings:',
    result.warnings?.filter((w) => w.includes('different address')),
  )
  console.log(
    'Should show warning:',
    result.warnings?.some((w) => w.includes('ATTENTION')),
  )

  return result
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🔍 Porto Protocol Decoder Examples\n')
  console.log('='.repeat(50))

  await example_cowswap_direct()
  await example_cowswap_via_safe()
  await example_crosschain_intent()
  await example_unknown_protocol()
  await example_receiver_mismatch()

  console.log('\n✅ All examples completed!')
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error)
}

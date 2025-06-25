import { beforeAll, describe, expect, test } from 'vitest'
import { erc7683Detector } from './detectors/community/ERC7683Detector.js'
import { cowProtocolDetector } from './detectors/curated/CowProtocolDetector.js'
import { dummySwapDetector } from './detectors/curated/DummySwapDetector.js'
import type { SignatureInput } from './ProtocolDecoder.js'
import {
  decodeProtocolSignature,
  ProtocolRegistry,
  registerProtocolDetector,
} from './ProtocolDecoder.js'

// Ensure detectors are registered before tests run
beforeAll(() => {
  // Enable DummySwap for testing
  process.env.ENABLE_DUMMY_SWAP = '1'

  registerProtocolDetector(cowProtocolDetector)
  registerProtocolDetector(dummySwapDetector)
  registerProtocolDetector(erc7683Detector)
})

describe('ProtocolDecoder', () => {
  test('should detect CoW Protocol order via EIP-712 domain', async () => {
    const input: SignatureInput = {
      chainId: 8453,
      typedData: {
        domain: {
          chainId: 8453,
          name: 'Gnosis Protocol',
          verifyingContract: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
          version: 'v2',
        },
        message: {
          appData:
            '0x0000000000000000000000000000000000000000000000000000000000000000', // USDC on Base
          buyAmount: '420000000000000000', // WETH on Base
          buyToken: '0x4200000000000000000000000000000000000006', // 1000 USDC
          feeAmount: '1000000', // 0.42 ETH
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
          ],
        },
      },
    }

    const result = await decodeProtocolSignature(input)

    expect(result.protocol).toBe('CoW Protocol')
    expect(result.action).toBe('sell_order')
    expect(result.summary).toContain('Sell')
    expect(result.summary).toContain('USDC')
    expect(result.summary).toContain('WETH')
    expect(result.details.assets).toHaveLength(2)
    expect(result.details.fees).toHaveLength(1)
  })

  test('should detect CoW Protocol via widget integration (Safe)', async () => {
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
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          buyAmount: '420000000000000000',
          buyToken: '0x4200000000000000000000000000000000000006',
          feeAmount: '1000000',
          kind: 'sell',
          partiallyFillable: false,
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
            { name: 'feeAmount', type: 'uint256' },
            { name: 'kind', type: 'string' },
            { name: 'partiallyFillable', type: 'bool' },
          ],
        },
      },
    }

    const result = await decodeProtocolSignature(input)

    expect(result.protocol).toBe('CoW Protocol (via Safe)')
    expect(result.metadata?.widgetIntegration).toBe('Safe')
  })

  test('should detect ERC-7683 CrossChainIntent', async () => {
    const input: SignatureInput = {
      chainId: 8453,
      typedData: {
        domain: {
          chainId: 8453,
          name: 'CrossChainBridge',
        },
        message: {
          destinationChainId: 1, // Ethereum
          destinationTokens: [
            {
              amount: '999000000', // 999 USDC (after fees)
              recipient: '0x1F49737b9Ca352782550cF58cdBbA421C0A52dC1',
              token: '0xa0b86a33e6d2f6c68bf18ae9f4c94bcec7f5c5b3', // USDC on Ethereum
            },
          ],
          fillDeadline: Math.floor(Date.now() / 1000) + 7200, // 2 hours
          originChainId: 8453,
          originTokens: [
            {
              amount: '1000000000', // 1000 USDC
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

    expect(result.protocol).toBe('ERC-7683 CrossChainIntent')
    expect(result.action).toBe('cross_chain_intent')
    expect(result.summary).toContain('Bridge')
    expect(result.summary).toContain('Base')
    expect(result.summary).toContain('Ethereum')
    expect(result.details.assets).toHaveLength(2)
    expect(result.warnings).toContain(
      'Cross-chain transaction: tokens will arrive on Ethereum',
    )
  })

  test('should return unknown protocol response for unrecognized signature', async () => {
    const input: SignatureInput = {
      chainId: 8453,
      typedData: {
        domain: {
          chainId: 8453,
          name: 'UnknownProtocol',
        },
        message: {
          data: '0x1234567890abcdef',
        },
        primaryType: 'UnknownOrder',
        types: {
          UnknownOrder: [{ name: 'data', type: 'bytes' }],
        },
      },
    }

    const result = await decodeProtocolSignature(input)

    expect(result.protocol).toBe('Unknown Protocol')
    expect(result.action).toBe('unknown_signature')
    expect(result.warnings).toContain('Protocol not recognized by Porto wallet')
    expect(result.metadata?.detectionFailed).toBe(true)
  })

  test('should handle receiver warnings correctly', async () => {
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
          receiver: '0x9999999999999999999999999999999999999999', // Different receiver
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
            { name: 'receiver', type: 'address' },
          ],
        },
      },
    }

    const result = await decodeProtocolSignature(input)

    expect(
      result.warnings?.some((warning) =>
        warning.includes('different from your address'),
      ),
    ).toBe(true)
  })

  test('ProtocolRegistry should manage detectors correctly', async () => {
    const registry = new ProtocolRegistry()

    expect(registry.getDetectors()).toHaveLength(0)

    registry.register(cowProtocolDetector)
    expect(registry.getDetectors()).toHaveLength(1)
    expect(registry.getDetectors()[0]?.name).toBe('CoW Protocol')

    registry.register(erc7683Detector)
    expect(registry.getDetectors().length).toBe(2)
  })

  test('should detect via contract address', async () => {
    const input: SignatureInput = {
      calldata: '0x1234567890abcdef', // CoW contract on Base
      chainId: 8453,
      to: '0x9008d19f58aabd9ed0d60971565aa8510560ab41',
      typedData: {
        domain: { name: 'Test' },
        message: { test: '0x1234567890123456789012345678901234567890' },
        primaryType: 'Order',
        types: { Order: [{ name: 'test', type: 'address' }] },
      },
    }

    const detected = await cowProtocolDetector.detect(input)
    expect(detected).toBe(true)
  })

  test('should detect DummySwap Protocol on Base Sepolia', async () => {
    const input: SignatureInput = {
      chainId: 84532, // Base Sepolia
      typedData: {
        domain: {
          chainId: 84532,
          name: 'DummySwap Protocol',
          verifyingContract: '0x1234567890123456789012345678901234567890', // Base Sepolia
          version: 'v1',
        },
        message: {
          appData:
            '0x0000000000000000000000000000000000000000000000000000000000000000', // Base Sepolia USDC
          buyAmount: '420000000000000000', // Base Sepolia WETH
          buyToken: '0x4200000000000000000000000000000000000006', // 1000 USDC
          sellAmount: '1000000000', // 0.42 ETH
          sellToken: '0x036cbd53842c5426634e7929541ec2318f3dcf7e', // 1 hour from now
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
          ],
        },
      },
    }

    // Test detector directly first
    const dummyDetected = await dummySwapDetector.detect(input)
    expect(dummyDetected).toBe(true)

    const cowDetected = await cowProtocolDetector.detect(input)
    expect(cowDetected).toBe(false) // Should not detect as CoW

    const result = await decodeProtocolSignature(input)

    expect(result.protocol).toBe('DummySwap Protocol')
    expect(result.summary).toContain('Base Sepolia')
    expect(result.metadata?.isTestProtocol).toBe(true)
    expect(result.metadata?.chainId).toBe(84532)
  })

  test('should not detect DummySwap on mainnet chains', async () => {
    const input: SignatureInput = {
      chainId: 8453,
      typedData: {
        domain: {
          chainId: 8453,
          name: 'DummySwap Protocol',
        },
        message: {
          buyToken: '0x4200000000000000000000000000000000000006',
          sellToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        },
        primaryType: 'Order',
        types: {
          Order: [
            { name: 'sellToken', type: 'address' },
            { name: 'buyToken', type: 'address' },
          ],
        },
      },
    }

    const detected = await dummySwapDetector.detect(input)
    expect(detected).toBe(false)
  })
})

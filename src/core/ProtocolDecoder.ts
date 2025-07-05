import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'

/**
 * Input format for protocol signature decoding
 */
export interface SignatureInput {
  /** EIP-712 signature (optional) */
  signature?: Hex.Hex
  /** EIP-712 typed data structure */
  typedData?: {
    domain: TypedDataDomain
    types: Record<string, any>
    primaryType: string
    message: any
  }
  /** Call data for contract interactions (optional) */
  calldata?: Hex.Hex
  /** Target contract address (optional) */
  to?: Address.Address
  /** Chain ID */
  chainId: number
  /** Additional context for detection */
  context?: {
    /** Origin domain (e.g., "cowswap.exchange") */
    origin?: string
    /** User agent string */
    userAgent?: string
    /** Referrer URL */
    referrer?: string
  }
}

/**
 * EIP-712 Domain structure
 */
export interface TypedDataDomain {
  name?: string
  version?: string
  chainId?: number
  verifyingContract?: Address.Address
  salt?: Hex.Hex
}

/**
 * Decoded transaction result
 */
export interface DecodedTransaction {
  /** Protocol name (e.g., "CoW Protocol", "UniswapX") */
  protocol: string
  /** Action type (e.g., "sell_order", "cross_chain_intent") */
  action: string
  /** Human-readable summary */
  summary: string
  /** Detailed transaction information */
  details: {
    /** Asset transfers involved */
    assets: AssetTransfer[]
    /** Protocol and gas fees */
    fees: Fee[]
    /** Timing constraints */
    timing?: {
      validUntil?: Date
      deadline?: Date
    }
    /** Transaction sender */
    sender: Address.Address
    /** Token recipient */
    recipient: Address.Address
    /** Contract interactions */
    interactions: ContractInteraction[]
  }
  /** Security warnings */
  warnings?: string[]
  /** Protocol-specific metadata */
  metadata?: Record<string, any>
}

/**
 * Asset transfer information
 */
export interface AssetTransfer {
  /** Transfer type */
  type: 'send' | 'receive'
  /** Token information */
  token: {
    address: Address.Address
    symbol?: string
    name?: string
    decimals?: number
  }
  /** Amount in wei/smallest units */
  amount: bigint
  /** Formatted amount for display */
  amountFormatted?: string
  /** Specific recipient for this asset */
  recipient?: Address.Address
  /** Custom label for this transfer (e.g., "Send", "Receive (at least)", "Burn", "Mint") */
  label?: string
}

/**
 * Fee information
 */
export interface Fee {
  /** Fee type */
  type: 'protocol' | 'gas' | 'network'
  /** Fee amount */
  amount: bigint
  /** Fee token */
  token: Address.Address
  /** Formatted amount for display */
  amountFormatted?: string
  /** Fee description */
  description?: string
}

/**
 * Contract interaction information
 */
export interface ContractInteraction {
  /** Contract address */
  contract: Address.Address
  /** Function name */
  function: string
  /** Human-readable description */
  description: string
}

/**
 * Protocol detector interface
 */
export interface ProtocolDetector {
  /** Protocol name */
  name: string
  /** Detection function */
  detect: (input: SignatureInput) => Promise<boolean>
  /** Decoding function */
  decode: (input: SignatureInput) => Promise<DecodedTransaction>
}

/**
 * Protocol registry for managing detectors
 */
export class ProtocolRegistry {
  private detectors: ProtocolDetector[] = []

  /**
   * Register a protocol detector
   */
  register(detector: ProtocolDetector): void {
    this.detectors.push(detector)
  }

  /**
   * Get all registered detectors
   */
  getDetectors(): readonly ProtocolDetector[] {
    return [...this.detectors]
  }

  /**
   * Find detector for given input
   */
  async findDetector(input: SignatureInput): Promise<ProtocolDetector | null> {
    for (const detector of this.detectors) {
      try {
        if (await detector.detect(input)) {
          return detector
        }
      } catch (error) {
        // Log error but continue with other detectors
        console.warn(`Detector ${detector.name} failed:`, error)
      }
    }
    return null
  }
}

/**
 * Create a fallback response for unknown protocols
 */
export function createUnknownProtocolResponse(
  input: SignatureInput,
): DecodedTransaction {
  return {
    action: 'unknown_signature',
    details: {
      assets: [],
      fees: [],
      interactions: input.to
        ? [
            {
              contract: input.to,
              description: 'Contract interaction with unknown signature',
              function: 'unknown',
            },
          ]
        : [],
      recipient:
        input.typedData?.domain?.verifyingContract ??
        ('0x0000000000000000000000000000000000000000' as Address.Address),
      sender:
        input.typedData?.domain?.verifyingContract ??
        ('0x0000000000000000000000000000000000000000' as Address.Address),
    },
    metadata: {
      detectionFailed: true,
      rawTypedData: input.typedData,
    },
    protocol: 'Unknown Protocol',
    summary: 'Unknown EIP-712 signature - use at your own risk',
    warnings: [
      'Protocol not recognized by Porto wallet',
      'Cannot verify transaction details - proceed with caution',
      'Contact Porto team to request protocol support',
    ],
  }
}

/**
 * Main API function to decode protocol signatures
 * Uses enhanced two-tier detection when available
 */
export async function decodeProtocolSignature(
  input: SignatureInput,
  registry?: ProtocolRegistry,
  useEnhancedDetection = true,
): Promise<DecodedTransaction> {
  let detector: ProtocolDetector | null = null

  if (useEnhancedDetection) {
    // Use enhanced detection that handles curated/community tiers
    try {
      // Import detectProtocolEnhanced dynamically to avoid circular dependencies
      const { detectProtocolEnhanced } = await import('./detectors/index.js')
      detector = await detectProtocolEnhanced(input)
    } catch (error) {
      console.warn(
        'Enhanced detection failed, falling back to basic detection:',
        error,
      )
      // Fall back to basic detection
      const protocolRegistry = registry ?? getDefaultRegistry()
      detector = await protocolRegistry.findDetector(input)
    }
  } else {
    // Use basic detection with provided or default registry
    const protocolRegistry = registry ?? getDefaultRegistry()
    detector = await protocolRegistry.findDetector(input)
  }

  if (!detector) {
    return createUnknownProtocolResponse(input)
  }

  return await detector.decode(input)
}

// Global registry instance
let defaultRegistry: ProtocolRegistry | null = null

/**
 * Get or create the default registry
 */
export function getDefaultRegistry(): ProtocolRegistry {
  if (!defaultRegistry) {
    defaultRegistry = new ProtocolRegistry()
  }
  return defaultRegistry
}

/**
 * Register a protocol detector with the default registry
 */
export function registerProtocolDetector(detector: ProtocolDetector): void {
  getDefaultRegistry().register(detector)
}

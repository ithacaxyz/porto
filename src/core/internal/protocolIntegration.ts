/**
 * Protocol integration utilities for enhancing transaction previews
 * in Porto wallet dialogs and RPC responses
 */

import type * as Address from 'ox/Address'
import type { DecodedTransaction, SignatureInput } from '../ProtocolDecoder.js'
import { decodeProtocolSignature } from '../ProtocolDecoder.js'

/**
 * Extract SignatureInput from EIP-712 request for protocol decoding
 */
export function extractSignatureInput(
  typedDataString: string,
  chainId: number,
  context?: {
    origin?: string
    userAgent?: string
    referrer?: string
  },
): SignatureInput {
  let typedData: any
  try {
    typedData = JSON.parse(typedDataString)
  } catch (error) {
    throw new Error('Invalid typed data JSON')
  }

  return {
    chainId,
    typedData,
    ...(context && { context }),
  }
}

/**
 * Enhance EIP-712 request with protocol decoding for rich previews
 */
export async function enhanceTypedDataRequest(
  address: Address.Address,
  typedDataString: string,
  chainId: number,
  context?: {
    origin?: string
    userAgent?: string
    referrer?: string
  },
): Promise<{
  originalRequest: {
    address: Address.Address
    typedData: string
  }
  protocolDecoding?: DecodedTransaction
  hasProtocolSupport: boolean
}> {
  const originalRequest = {
    address,
    typedData: typedDataString,
  }

  try {
    const signatureInput = extractSignatureInput(
      typedDataString,
      chainId,
      context,
    )
    const protocolDecoding = await decodeProtocolSignature(signatureInput)

    // Check if we successfully decoded a known protocol
    const hasProtocolSupport = protocolDecoding.protocol !== 'Unknown Protocol'

    return {
      hasProtocolSupport,
      originalRequest,
      protocolDecoding,
    }
  } catch (error) {
    console.warn('Protocol decoding failed:', error)
    return {
      hasProtocolSupport: false,
      originalRequest,
    }
  }
}

/**
 * Create enhanced metadata for dialog display
 */
export function createDialogMetadata(
  decodedTransaction: DecodedTransaction,
): Record<string, any> {
  return {
    actionType: decodedTransaction.action,

    // Asset information formatted for UI
    assets: decodedTransaction.details.assets.map((asset) => ({
      address: asset.token.address,
      amount: asset.amountFormatted || asset.amount.toString(),
      recipient: asset.recipient,
      symbol: asset.token.symbol || 'UNKNOWN',
      type: asset.type,
    })),

    // Fee information
    fees: decodedTransaction.details.fees.map((fee) => ({
      amount: fee.amountFormatted || fee.amount.toString(),
      description: fee.description || `${fee.type} fee`,
      type: fee.type,
    })),
    interactions: decodedTransaction.details.interactions,

    // Cross-chain indicators
    isCrossChain:
      decodedTransaction.metadata?.destinationChainId &&
      decodedTransaction.metadata?.originChainId !==
        decodedTransaction.metadata?.destinationChainId,

    // UI hints
    isHighRisk: (decodedTransaction.warnings?.length ?? 0) > 0,

    // Protocol-specific metadata
    protocolMetadata: decodedTransaction.metadata || {},
    // Core transaction info for dialog display
    protocolName: decodedTransaction.protocol,
    recipient: decodedTransaction.details.recipient,
    requiresAttention:
      decodedTransaction.details.sender.toLowerCase() !==
      decodedTransaction.details.recipient.toLowerCase(),

    // Technical details
    sender: decodedTransaction.details.sender,
    summary: decodedTransaction.summary,

    // Timing constraints
    timing: decodedTransaction.details.timing
      ? {
          deadline: decodedTransaction.details.timing.deadline?.toISOString(),
          timeRemaining: decodedTransaction.details.timing.validUntil
            ? Math.max(
                0,
                decodedTransaction.details.timing.validUntil.getTime() -
                  Date.now(),
              )
            : undefined,
          validUntil:
            decodedTransaction.details.timing.validUntil?.toISOString(),
        }
      : undefined,

    // Security warnings
    warnings: decodedTransaction.warnings || [],
  }
}

/**
 * Extract context from request headers and origin
 */
export function extractRequestContext(): {
  origin?: string
  userAgent?: string
  referrer?: string
} {
  // In a real implementation, this would extract from HTTP headers
  // For now, we'll return empty context since Porto uses dialog mode
  const context: { origin?: string; userAgent?: string; referrer?: string } = {}

  if (typeof window !== 'undefined' && window.location.origin) {
    context.origin = window.location.origin
  }
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    context.userAgent = navigator.userAgent
  }
  if (typeof document !== 'undefined' && document.referrer) {
    context.referrer = document.referrer
  }

  return context
}

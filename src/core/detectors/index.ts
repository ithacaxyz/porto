/**
 * Protocol Detectors - Hybrid Two-Tier Architecture
 *
 * This module coordinates the detection system between curated and community detectors:
 * - Curated detectors are always loaded for high-traffic protocols
 * - Community detectors are lazy-loaded based on meta tags or fallback detection
 * - Meta tag detection allows applications to specify their preferred detector
 */

import { getDetectorMetaTag } from '../internal/metaTagDetection.js'
import type { ProtocolDetector, SignatureInput } from '../ProtocolDecoder.js'
import { getDefaultRegistry } from '../ProtocolDecoder.js'
import { loadCommunityDetector } from './community/index.js'
import {
  getCuratedDetectorNames,
  initializeCuratedDetectors,
  isCuratedDomain,
} from './curated/index.js'

// Export community management functions
export {
  getCommunityDetectorIds,
  loadCommunityDetector,
} from './community/index.js'
// Export curated detectors directly
export * from './curated/index.js'

// Re-export for future use (commented out to avoid unused export warnings)
// export {
//   hasCommunityDetector,
//   getCommunityDetectorInfo
// } from './community/index.js'

// Export meta tag detection
export { getDetectorMetaTag } from '../internal/metaTagDetection.js'

// Export the main API
export * from '../ProtocolDecoder.js'

/**
 * Enhanced protocol detection with two-tier architecture
 *
 * Detection strategy:
 * 1. Check curated detectors first (always loaded)
 * 2. Check for meta tag specification and lazy load community detector
 * 3. Fallback to unknown protocol handling
 */
export async function detectProtocolEnhanced(
  input: SignatureInput,
): Promise<ProtocolDetector | null> {
  const registry = getDefaultRegistry()

  // Step 1: Check curated detectors first
  // These are always loaded for immediate detection
  const curatedDetector = await registry.findDetector(input)
  if (curatedDetector) {
    console.info(
      `Detected protocol via curated detector: ${curatedDetector.name}`,
    )
    return curatedDetector
  }

  // Step 2: Check for meta tag specification
  if (input.context?.origin) {
    try {
      const metaTag = await getDetectorMetaTag(input.context.origin)
      if (metaTag?.detectorId) {
        console.info(`Meta tag specified detector: ${metaTag.detectorId}`)

        // Try to load the specified community detector
        const communityDetector = await loadCommunityDetector(
          metaTag.detectorId,
        )
        if (communityDetector) {
          // Test if this detector can handle the input
          if (await communityDetector.detect(input)) {
            console.info(
              `Successfully loaded and verified community detector: ${communityDetector.name}`,
            )
            return communityDetector
          }
          console.warn(
            `Meta tag detector '${metaTag.detectorId}' cannot handle this signature`,
          )
        }

        // If meta tag detector fails, try fallback if specified
        if (metaTag.fallback) {
          const fallbackDetector = await loadCommunityDetector(metaTag.fallback)
          if (fallbackDetector && (await fallbackDetector.detect(input))) {
            console.info(
              `Fallback detector '${metaTag.fallback}' handled the signature`,
            )
            return fallbackDetector
          }
        }
      }
    } catch (error) {
      console.warn(
        `Meta tag detection failed for ${input.context.origin}:`,
        error,
      )
    }
  }

  // Step 3: No detector found
  console.info(
    'No detector found for signature - will use unknown protocol response',
  )
  return null
}

/**
 * Get all registered detector names for debugging
 */
export function getRegisteredDetectors(): string[] {
  return getDefaultRegistry()
    .getDetectors()
    .map((d) => d.name)
}

/**
 * Get detection system status for debugging
 */
export function getDetectionSystemStatus(): {
  curatedDetectors: string[]
  totalRegistered: number
  curatedDomainCheck: boolean
} {
  return {
    curatedDetectors: getCuratedDetectorNames(),
    curatedDomainCheck: isCuratedDomain('swap.cow.fi'), // Test known domain
    totalRegistered: getDefaultRegistry().getDetectors().length,
  }
}

/**
 * Check if an origin should use enhanced detection
 * This can be used to decide whether to show "loading detector" UI
 */
export function shouldUseEnhancedDetection(origin?: string): boolean {
  if (!origin) return false

  // Always use enhanced detection for non-curated domains
  return !isCuratedDomain(origin)
}

// Initialize curated detectors when module is imported
// This ensures immediate availability for high-traffic protocols
initializeCuratedDetectors()

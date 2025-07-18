/**
 * Community Protocol Detectors - Lazy loaded, community verified
 *
 * These detectors are contributed by the community and loaded on-demand
 * when specified via meta tags or when curated detection fails.
 */

import type { ProtocolDetector } from '../../ProtocolDecoder.js'

// Detector registry for lazy loading
const COMMUNITY_DETECTORS: Record<string, () => Promise<ProtocolDetector>> = {
  'erc-7683': () =>
    import('./ERC7683Detector.js').then((m) => m.erc7683Detector),
  // Future community detectors can be added here
  // 'compound-v3': () => import('./CompoundDetector.js').then(m => m.compoundDetector),
  // 'aave-v3': () => import('./AaveDetector.js').then(m => m.aaveDetector),
}

/**
 * Get available community detector IDs
 */
export function getCommunityDetectorIds(): string[] {
  return Object.keys(COMMUNITY_DETECTORS)
}

/**
 * Lazy load a community detector by ID
 */
export async function loadCommunityDetector(
  detectorId: string,
): Promise<ProtocolDetector | null> {
  const loader = COMMUNITY_DETECTORS[detectorId]
  if (!loader) {
    console.warn(`Community detector '${detectorId}' not found`)
    return null
  }

  try {
    const detector = await loader()
    console.info(`Loaded community detector: ${detector.name}`)
    return detector
  } catch (error) {
    console.error(`Failed to load community detector '${detectorId}':`, error)
    return null
  }
}

/**
 * Check if a detector ID is available in the community registry
 */
export function hasCommunityDetector(detectorId: string): boolean {
  return detectorId in COMMUNITY_DETECTORS
}

/**
 * Get detector metadata for UI display
 */
export function getCommunityDetectorInfo(detectorId: string): {
  id: string
  name: string
  verificationLevel: 'community' | 'certified'
  description: string
} | null {
  // This would typically come from a registry file or API
  const detectorInfo: Record<string, any> = {
    'erc-7683': {
      description: 'Standard for cross-chain intent-based transactions',
      id: 'erc-7683',
      name: 'ERC-7683 CrossChainIntent',
      verificationLevel: 'community',
    },
  }

  return detectorInfo[detectorId] || null
}

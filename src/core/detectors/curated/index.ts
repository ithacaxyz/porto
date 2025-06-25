/**
 * Curated Protocol Detectors - Always loaded, verified by Porto Core Team
 *
 * These detectors are for high-traffic protocols that require immediate availability
 * and have been thoroughly reviewed by the Porto team.
 */

import { getDefaultRegistry } from '../../ProtocolDecoder.js'
import { cowProtocolDetector } from './CowProtocolDetector.js'
import { dummySwapDetector } from './DummySwapDetector.js'

// Export individual detectors
export { cowProtocolDetector } from './CowProtocolDetector.js'
export { dummySwapDetector } from './DummySwapDetector.js'

/**
 * Initialize curated detectors (always loaded)
 * These are registered immediately when the module is imported
 */
export function initializeCuratedDetectors() {
  const registry = getDefaultRegistry()

  // Register curated detectors in priority order
  registry.register(dummySwapDetector) // Test protocol for Base Sepolia
  registry.register(cowProtocolDetector) // Major DEX protocol
}

/**
 * Check if a domain should use curated detection
 */
export function isCuratedDomain(origin?: string): boolean {
  if (!origin) return false

  const curatedDomains = [
    'swap.cow.fi',
    'cowswap.exchange',
    'safe.global',
    'swap.defillama.com',
    'localhost', // For development/testing
    '127.0.0.1',
  ]

  return curatedDomains.some((domain) => origin.includes(domain))
}

/**
 * Get curated detector names for debugging
 */
export function getCuratedDetectorNames(): string[] {
  return [cowProtocolDetector.name, dummySwapDetector.name]
}

// Auto-initialize when module is imported
initializeCuratedDetectors()

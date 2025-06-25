/**
 * Meta Tag Detection System
 *
 * Handles detection and parsing of protocol detector meta tags from web pages.
 * This enables applications to specify which Porto detector should be used
 * for their signatures.
 */

/**
 * Meta tag configuration from HTML pages
 */
export interface DetectorMetaTag {
  /** Detector ID to load */
  detectorId: string
  /** Version requirement (optional) */
  version?: string | undefined
  /** Fallback detector type (optional) */
  fallback?: string | undefined
}

/**
 * Cache for meta tag results to avoid repeated fetches
 */
const metaTagCache = new Map<string, DetectorMetaTag | null>()

/**
 * Extract detector meta tags from an origin URL
 */
export async function getDetectorMetaTag(
  origin: string,
): Promise<DetectorMetaTag | null> {
  // Check cache first
  if (metaTagCache.has(origin)) {
    return metaTagCache.get(origin) || null
  }

  try {
    const metaTag = await fetchDetectorMetaTag(origin)

    // Cache the result (including null for "no meta tag found")
    metaTagCache.set(origin, metaTag)

    return metaTag
  } catch (error) {
    console.warn(`Failed to fetch meta tag from ${origin}:`, error)

    // Cache the failure to avoid repeated attempts
    metaTagCache.set(origin, null)

    return null
  }
}

/**
 * Fetch and parse detector meta tags from a web page
 */
async function fetchDetectorMetaTag(
  origin: string,
): Promise<DetectorMetaTag | null> {
  // In a browser environment, we can't directly fetch cross-origin HTML
  // This would need to be implemented via a proxy or browser extension API
  // For now, we'll simulate the detection based on known patterns

  return simulateMetaTagDetection(origin)
}

/**
 * Simulate meta tag detection for development/testing
 * In production, this would parse actual HTML content
 */
function simulateMetaTagDetection(origin: string): DetectorMetaTag | null {
  // Known applications with their detector configurations
  const knownApps: Record<string, DetectorMetaTag> = {
    'app.aave.com': {
      detectorId: 'aave-v3',
      fallback: 'lending',
      version: '1.0.0',
    },
    'app.compound.finance': {
      detectorId: 'compound-v3',
      fallback: 'lending',
      version: '1.0.0',
    },
    'app.sushi.com': {
      detectorId: 'sushiswap',
      fallback: 'dex',
      version: '1.0.0',
    },
    'curve.fi': {
      detectorId: 'curve-v2',
      fallback: 'dex',
      version: '1.0.0',
    },
  }

  // Check for exact domain matches
  for (const [domain, config] of Object.entries(knownApps)) {
    if (origin.includes(domain)) {
      return config
    }
  }

  return null
}

/**
 * Parse meta tags from HTML content (for future implementation)
 */
export function parseMetaTagsFromHTML(html: string): DetectorMetaTag | null {
  try {
    // This would parse HTML and extract meta tags like:
    // <meta name="porto-detector" content="compound-v3">
    // <meta name="porto-detector-version" content="1.0.0">
    // <meta name="porto-detector-fallback" content="lending">

    const detectorMatch = html.match(
      /<meta[^>]+name=["']porto-detector["'][^>]+content=["']([^"']+)["']/i,
    )
    const versionMatch = html.match(
      /<meta[^>]+name=["']porto-detector-version["'][^>]+content=["']([^"']+)["']/i,
    )
    const fallbackMatch = html.match(
      /<meta[^>]+name=["']porto-detector-fallback["'][^>]+content=["']([^"']+)["']/i,
    )

    if (!detectorMatch || !detectorMatch[1]) return null

    return {
      detectorId: detectorMatch[1],
      fallback: fallbackMatch?.[1],
      version: versionMatch?.[1],
    }
  } catch (error) {
    console.warn('Failed to parse meta tags from HTML:', error)
    return null
  }
}

/**
 * Clear meta tag cache (useful for testing)
 */
export function clearMetaTagCache(): void {
  metaTagCache.clear()
}

/**
 * Get cache statistics for debugging
 */
export function getMetaTagCacheStats(): {
  size: number
  entries: Array<{ origin: string; hasTag: boolean }>
} {
  return {
    entries: Array.from(metaTagCache.entries()).map(([origin, tag]) => ({
      hasTag: tag !== null,
      origin,
    })),
    size: metaTagCache.size,
  }
}

/**
 * Validate detector meta tag configuration
 */
export function validateMetaTag(metaTag: DetectorMetaTag): boolean {
  // Basic validation
  if (!metaTag.detectorId || typeof metaTag.detectorId !== 'string') {
    return false
  }

  // Detector ID should be alphanumeric with dashes
  if (!/^[a-z0-9-]+$/.test(metaTag.detectorId)) {
    return false
  }

  // Version should be semver-like if provided
  if (metaTag.version && !/^\d+\.\d+\.\d+/.test(metaTag.version)) {
    return false
  }

  return true
}

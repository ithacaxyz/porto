/**
 * Token information utilities for protocol decoders
 * Dynamically fetches token metadata from ERC20 contracts
 */

import type * as Address from 'ox/Address'
import { createPublicClient, erc20Abi, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'

/**
 * Token information interface
 */
export interface TokenInfo {
  symbol: string
  name: string
  decimals: number
  isNative?: boolean
}

/**
 * Native token addresses (zero address or wrapped versions)
 */
const NATIVE_TOKEN_ADDRESSES = [
  '0x0000000000000000000000000000000000000000',
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
]

/**
 * Wrapped native token addresses by chain ID
 */
const WRAPPED_NATIVE_TOKENS: Record<number, Address.Address> = {
  8453: '0x4200000000000000000000000000000000000006', // WETH on Base
  84532: '0x4200000000000000000000000000000000000006', // WETH on Base Sepolia
}

/**
 * Chain configurations for viem clients
 */
const CHAIN_CONFIGS: Record<number, any> = {
  8453: base,
  84532: baseSepolia,
}

/**
 * RPC URLs by chain ID (fallback if no default RPC)
 */
const RPC_URLS: Record<number, string> = {
  8453: 'https://mainnet.base.org',
  84532: 'https://sepolia.base.org',
}

/**
 * Cache for token information to avoid repeated calls
 */
const tokenInfoCache = new Map<string, TokenInfo>()

/**
 * Create a viem public client for the given chain
 */
function createClientForChain(chainId: number) {
  const chain = CHAIN_CONFIGS[chainId]
  const rpcUrl = RPC_URLS[chainId]

  if (!chain || !rpcUrl) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }

  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  })
}

/**
 * Check if an address represents a native token
 */
function isNativeToken(address: Address.Address): boolean {
  return NATIVE_TOKEN_ADDRESSES.includes(address.toLowerCase())
}

/**
 * Get native token info for a chain
 */
function getNativeTokenInfo(chainId: number): TokenInfo {
  switch (chainId) {
    case 8453: // Base
    case 84532: // Base Sepolia
      return {
        decimals: 18,
        isNative: true,
        name: 'Ethereum',
        symbol: 'ETH',
      }
    default:
      return {
        decimals: 18,
        isNative: true,
        name: 'Ethereum',
        symbol: 'ETH',
      }
  }
}

/**
 * Get token information from ERC20 contract
 */
async function fetchERC20TokenInfo(
  address: Address.Address,
  chainId: number,
): Promise<TokenInfo> {
  const client = createClientForChain(chainId)

  try {
    // Fetch all token info in parallel
    const [symbol, name, decimals] = await Promise.all([
      client.readContract({
        abi: erc20Abi,
        address,
        functionName: 'symbol',
      }),
      client.readContract({
        abi: erc20Abi,
        address,
        functionName: 'name',
      }),
      client.readContract({
        abi: erc20Abi,
        address,
        functionName: 'decimals',
      }),
    ])

    return {
      decimals,
      isNative: false,
      name,
      symbol,
    }
  } catch (error) {
    console.warn(`Failed to fetch token info for ${address}:`, error)

    // Return fallback info
    return {
      decimals: 18,
      isNative: false,
      name: 'Unknown Token',
      symbol: 'UNKNOWN',
    }
  }
}

/**
 * Get token information with caching
 */
export async function getTokenInfo(
  address: Address.Address,
  chainId: number,
): Promise<TokenInfo> {
  const cacheKey = `${chainId}:${address.toLowerCase()}`

  // Check cache first
  if (tokenInfoCache.has(cacheKey)) {
    return tokenInfoCache.get(cacheKey)!
  }

  let tokenInfo: TokenInfo

  // Handle native tokens
  if (isNativeToken(address)) {
    tokenInfo = getNativeTokenInfo(chainId)
  } else {
    // Handle wrapped native tokens
    const wrappedNative = WRAPPED_NATIVE_TOKENS[chainId]
    if (
      wrappedNative &&
      address.toLowerCase() === wrappedNative.toLowerCase()
    ) {
      tokenInfo = {
        decimals: 18,
        isNative: false,
        name: 'Wrapped Ethereum',
        symbol: 'WETH',
      }
    } else {
      // Fetch from ERC20 contract
      tokenInfo = await fetchERC20TokenInfo(address, chainId)
    }
  }

  // Cache the result
  tokenInfoCache.set(cacheKey, tokenInfo)

  return tokenInfo
}

/**
 * Format token amount using proper decimals
 */
export function formatTokenAmount(
  amount: string | bigint,
  decimals: number,
  precision = 4,
): string {
  const value = typeof amount === 'string' ? BigInt(amount) : amount
  const divisor = BigInt(10 ** decimals)

  // Convert to number for formatting (be careful with precision)
  const formatted = Number(value) / Number(divisor)

  // Format with specified precision
  return formatted.toFixed(precision).replace(/\.?0+$/, '')
}

/**
 * Clear the token info cache (useful for testing)
 */
export function clearTokenInfoCache(): void {
  tokenInfoCache.clear()
}

/**
 * Get cache statistics (useful for debugging)
 */
export function getTokenInfoCacheStats(): {
  size: number
  keys: string[]
} {
  return {
    keys: Array.from(tokenInfoCache.keys()),
    size: tokenInfoCache.size,
  }
}

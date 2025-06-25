import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import type {
  AssetTransfer,
  DecodedTransaction,
  ProtocolDetector,
  SignatureInput,
} from '../../ProtocolDecoder.js'

/**
 * ERC-7683 CrossChainOrder structure
 */
interface CrossChainOrder {
  originChainId: number
  destinationChainId: number
  user: Address.Address
  originTokens: Array<{
    token: Address.Address
    amount: string
  }>
  destinationTokens: Array<{
    token: Address.Address
    amount: string
    recipient: Address.Address
  }>
  fillDeadline: number
  orderDataType: string
  orderData: Hex.Hex
}

/**
 * Get chain name from chain ID
 */
function getChainName(chainId: number): string {
  const chainNames: Record<number, string> = {
    1: 'Ethereum',
    10: 'Optimism',
    56: 'BSC',
    100: 'Gnosis',
    137: 'Polygon',
    250: 'Fantom',
    8453: 'Base',
    42161: 'Arbitrum',
    43114: 'Avalanche',
    84532: 'Base Sepolia',
  }

  return chainNames[chainId] ?? `Chain ${chainId}`
}

/**
 * Get token info for cross-chain tokens
 */
async function getTokenInfo(
  address: Address.Address,
): Promise<{ symbol: string; decimals: number }> {
  // Common cross-chain tokens
  const tokens: Record<string, { symbol: string; decimals: number }> = {
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607': {
      decimals: 6,
      symbol: 'USDC',
    },

    // USDC across chains
    '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': {
      decimals: 6,
      symbol: 'USDC',
    }, // Base WETH
    // ETH/WETH across chains
    '0x0000000000000000000000000000000000000000': {
      decimals: 18,
      symbol: 'ETH',
    }, // Ethereum WETH
    '0x4200000000000000000000000000000000000006': {
      decimals: 18,
      symbol: 'WETH',
    }, // Base USDC
    '0xa0b86a33e6d2f6c68bf18ae9f4c94bcec7f5c5b3': {
      decimals: 6,
      symbol: 'USDC',
    }, // Ethereum USDC
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': {
      decimals: 18,
      symbol: 'WETH',
    }, // Optimism USDC

    // USDT across chains
    '0xdac17f958d2ee523a2206206994597c13d831ec7': {
      decimals: 6,
      symbol: 'USDT',
    }, // Ethereum USDT
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': {
      decimals: 6,
      symbol: 'USDT',
    }, // Arbitrum USDT
  }

  return tokens[address.toLowerCase()] ?? { decimals: 18, symbol: 'UNKNOWN' }
}

/**
 * Format token amount for display
 */
function formatTokenAmount(amount: string, decimals = 18): string {
  const value = BigInt(amount)
  const divisor = BigInt(10 ** decimals)
  return (Number(value) / Number(divisor)).toFixed(4)
}

/**
 * ERC-7683 CrossChainIntent detector implementation
 */
export const erc7683Detector: ProtocolDetector = {
  async decode(input: SignatureInput): Promise<DecodedTransaction> {
    const order = input.typedData!.message as CrossChainOrder

    const originChain = getChainName(order.originChainId)
    const destChain = getChainName(order.destinationChainId)

    // Process origin tokens (what user is sending)
    const originAssets: AssetTransfer[] = []
    for (const token of order.originTokens) {
      const tokenInfo = await getTokenInfo(token.token)
      originAssets.push({
        amount: BigInt(token.amount),
        amountFormatted: formatTokenAmount(token.amount, tokenInfo.decimals),
        label: 'Bridge from origin',
        recipient: order.user,
        token: {
          address: token.token,
          decimals: tokenInfo.decimals,
          symbol: tokenInfo.symbol,
        },
        type: 'send',
      })
    }

    // Process destination tokens (what user will receive)
    const destinationAssets: AssetTransfer[] = []
    for (const token of order.destinationTokens) {
      const tokenInfo = await getTokenInfo(token.token)
      destinationAssets.push({
        amount: BigInt(token.amount),
        amountFormatted: formatTokenAmount(token.amount, tokenInfo.decimals),
        label: 'Receive on destination',
        recipient: token.recipient,
        token: {
          address: token.token,
          decimals: tokenInfo.decimals,
          symbol: tokenInfo.symbol,
        },
        type: 'receive',
      })
    }

    const allAssets = [...originAssets, ...destinationAssets]

    // Generate summary
    const originToken = originAssets[0]
    const destToken = destinationAssets[0]
    const summary =
      originToken && destToken
        ? `Bridge ${originToken.amountFormatted} ${originToken.token.symbol} from ${originChain} to ${destToken.amountFormatted} ${destToken.token.symbol} on ${destChain}`
        : `Cross-chain transaction from ${originChain} to ${destChain}`

    // Generate warnings
    const warnings: string[] = [
      `Cross-chain transaction: tokens will arrive on ${destChain}`,
      'Verify the destination chain and recipient addresses carefully',
      'Cross-chain transactions may take time to complete',
    ]

    // Check for timing warnings
    const fillDeadline = new Date(order.fillDeadline * 1000)
    const timeUntilDeadline = fillDeadline.getTime() - Date.now()
    if (timeUntilDeadline < 10 * 60 * 1000) {
      // Less than 10 minutes
      warnings.push('⚠️ Order expires in less than 10 minutes')
    }

    // Check for recipient mismatches
    for (const destToken of destinationAssets) {
      if (
        destToken.recipient &&
        destToken.recipient.toLowerCase() !== order.user.toLowerCase()
      ) {
        warnings.push(
          `⚠️ ${destToken.token.symbol} will be sent to ${destToken.recipient} (different from sender)`,
        )
      }
    }

    return {
      action: 'cross_chain_intent',
      details: {
        assets: allAssets,
        fees: [],
        interactions: [
          {
            contract: input.typedData!.domain!
              .verifyingContract as Address.Address,
            description: `Cross-chain order execution from ${originChain} to ${destChain}`,
            function: 'fillCrossChainOrder',
          },
        ],
        recipient: destinationAssets[0]?.recipient ?? order.user, // ERC-7683 fees are typically embedded in the token amounts
        sender: order.user,
        timing: {
          deadline: fillDeadline,
          validUntil: fillDeadline,
        },
      },
      metadata: {
        destinationChain: destChain,
        destinationChainId: order.destinationChainId,
        fillDeadline: order.fillDeadline,
        isStandardCompliant: true,
        orderData: order.orderData,
        orderDataType: order.orderDataType,
        originChain,
        originChainId: order.originChainId,
        standardVersion: 'ERC-7683',
      },
      protocol: 'ERC-7683 CrossChainIntent',
      summary,
      warnings,
    }
  },

  async detect(input: SignatureInput): Promise<boolean> {
    const standardTypes = [
      'CrossChainOrder',
      'OnchainCrossChainOrder',
      'GaslessCrossChainOrder',
    ]

    return standardTypes.includes(input.typedData?.primaryType ?? '')
  },
  name: 'ERC-7683 CrossChainIntent',
}

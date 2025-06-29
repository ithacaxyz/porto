import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import { formatTokenAmount, getTokenInfo } from '../../internal/tokenInfo.js'
import type {
  AssetTransfer,
  DecodedTransaction,
  Fee,
  ProtocolDetector,
  SignatureInput,
} from '../../ProtocolDecoder.js'

/**
 * CoW Protocol contract addresses by chain ID
 */
const COW_CONTRACTS: Record<number, Address.Address[]> = {
  8453: ['0x9008d19f58aabd9ed0d60971565aa8510560ab41'], // Base mainnet
}

/**
 * Required fields for CoW Protocol orders
 */
const COW_ORDER_FIELDS = [
  'sellToken',
  'buyToken',
  'sellAmount',
  'buyAmount',
  'validTo',
  'appData',
]

/**
 * CoW Protocol order structure
 */
interface CoWOrder {
  sellToken: Address.Address
  buyToken: Address.Address
  sellAmount: string
  buyAmount: string
  validTo: number
  appData: Hex.Hex
  feeAmount: string
  kind: 'sell' | 'buy'
  partiallyFillable: boolean
  receiver?: Address.Address
  from?: Address.Address
  user?: Address.Address
  swapper?: Address.Address
}

/**
 * Helper function to check if order has required CoW fields
 */
function hasCoWOrderFields(orderFields: any[]): boolean {
  if (!orderFields) return false
  const fieldNames = orderFields.map((f) => f.name)
  return COW_ORDER_FIELDS.every((field) => fieldNames.includes(field))
}

/**
 * Detect widget integration from input context and domain
 */
function detectWidgetIntegration(input: SignatureInput): string | null {
  // Check origin-based detection for widget integrations
  if (input.context?.origin?.includes('safe.global')) return 'Safe'
  if (input.context?.origin?.includes('swap.defillama.com')) return 'DefiLlama'

  return null
}

/**
 * Generate CoW order UID for API calls
 */
function generateOrderUid(order: CoWOrder): string {
  // Simplified orderUid generation - in real implementation, this would use proper encoding
  const hash = `${order.sellToken}${order.buyToken}${order.sellAmount}${order.buyAmount}${order.validTo}`
  return `0x${hash.slice(0, 112)}` // Simplified for demo
}

/**
 * Get CoW API URL for chain
 */
function getCoWApiUrl(chainId: number): string {
  switch (chainId) {
    case 8453:
      return 'https://api.cow.fi/base/api/v1'
    default:
      return 'https://api.cow.fi/mainnet/api/v1' // fallback to mainnet
  }
}

/**
 * Generate receiver warnings for security
 */
function generateReceiverWarnings(
  sender: Address.Address,
  receiver: Address.Address,
): string[] {
  const warnings: string[] = []

  if (sender.toLowerCase() !== receiver.toLowerCase()) {
    warnings.push(
      `⚠️ ATTENTION: Tokens will be sent to ${receiver} (different from your address)`,
    )
    warnings.push(
      'Double-check this is intentional - this could be a social engineering attack',
    )
  }

  return warnings
}

/**
 * CoW Protocol detector implementation
 */
export const cowProtocolDetector: ProtocolDetector = {
  async decode(input: SignatureInput): Promise<DecodedTransaction> {
    const order = input.typedData!.message as CoWOrder

    // Detect if this came through a widget integration
    // Widget integrations can still use "Gnosis Protocol" domain, so check origin context
    const widgetName = detectWidgetIntegration(input)

    // Extract sender and receiver addresses
    const sender = (order.swapper ||
      order.user ||
      order.from ||
      input.typedData!.domain?.verifyingContract) as Address.Address
    const receiver = (order.receiver ||
      order.swapper ||
      order.user ||
      sender) as Address.Address

    // Get token information
    const sellTokenInfo = await getTokenInfo(order.sellToken, input.chainId)
    const buyTokenInfo = await getTokenInfo(order.buyToken, input.chainId)

    // Format amounts
    const sellAmountFormatted = formatTokenAmount(
      order.sellAmount,
      sellTokenInfo.decimals,
    )
    const buyAmountFormatted = formatTokenAmount(
      order.buyAmount,
      buyTokenInfo.decimals,
    )
    const feeAmountFormatted = order.feeAmount
      ? formatTokenAmount(order.feeAmount, sellTokenInfo.decimals)
      : '0'

    // Check for receiver mismatch warning
    const warnings = generateReceiverWarnings(sender, receiver)

    // Add timing warnings
    const validUntil = new Date(order.validTo * 1000)
    const timeUntilExpiry = validUntil.getTime() - Date.now()
    if (timeUntilExpiry < 5 * 60 * 1000) {
      // Less than 5 minutes
      warnings.push('⚠️ Order expires in less than 5 minutes')
    }

    const protocolName = widgetName
      ? `CoW Protocol (via ${widgetName})`
      : 'CoW Protocol'
    const action = order.kind === 'sell' ? 'sell_order' : 'buy_order'
    const verb = order.kind === 'sell' ? 'Sell' : 'Buy'

    // Build asset transfers
    const assets: AssetTransfer[] = [
      {
        amount: BigInt(order.sellAmount),
        amountFormatted: sellAmountFormatted,
        label: 'Send',
        recipient: receiver,
        token: {
          address: order.sellToken,
          decimals: sellTokenInfo.decimals,
          symbol: sellTokenInfo.symbol,
        },
        type: 'send',
      },
      {
        amount: BigInt(order.buyAmount),
        amountFormatted: buyAmountFormatted,
        label: 'Receive (at least)',
        recipient: receiver,
        token: {
          address: order.buyToken,
          decimals: buyTokenInfo.decimals,
          symbol: buyTokenInfo.symbol,
        },
        type: 'receive',
      },
    ]

    // Build fees
    const fees: Fee[] = []
    if (order.feeAmount && BigInt(order.feeAmount) > 0n) {
      fees.push({
        amount: BigInt(order.feeAmount),
        amountFormatted: feeAmountFormatted,
        description: 'CoW Protocol fee',
        token: order.sellToken,
        type: 'protocol',
      })
    }

    // Generate order UID for metadata
    const orderUid = generateOrderUid(order)

    return {
      action,
      details: {
        assets,
        fees,
        interactions: [
          {
            contract: input.typedData!.domain!
              .verifyingContract as Address.Address,
            description: 'CoW Protocol settlement execution',
            function: 'settlement',
          },
        ],
        recipient: receiver,
        sender,
        timing: { validUntil },
      },
      metadata: {
        apiUrl: `${getCoWApiUrl(input.chainId)}/orders/${orderUid}`,
        appData: order.appData,
        isDirectUsage: !widgetName,
        kind: order.kind,
        orderUid,
        partiallyFillable: order.partiallyFillable,
        widgetIntegration: widgetName,
      },
      protocol: protocolName,
      summary: `${verb} ${sellAmountFormatted} ${sellTokenInfo.symbol} for ${buyAmountFormatted} ${buyTokenInfo.symbol}`,
      warnings,
    }
  },

  async detect(input: SignatureInput): Promise<boolean> {
    // Exclude DummySwap Protocol to avoid conflicts
    if (input.typedData?.domain?.name === 'DummySwap Protocol') {
      return false
    }

    // Method 1: EIP-712 domain detection (direct frontend usage) - highest priority
    if (
      input.typedData?.domain?.name === 'Gnosis Protocol' &&
      input.typedData?.primaryType === 'Order'
    ) {
      return true
    }

    // Method 2: Contract address detection (direct contract calls)
    if (
      input.to &&
      COW_CONTRACTS[input.chainId]?.includes(
        input.to.toLowerCase() as Address.Address,
      )
    ) {
      return true
    }

    // Method 3: Origin + validation (known CoW integrations)
    if (
      input.context?.origin?.includes('swap.cow.fi') ||
      input.context?.origin?.includes('safe.global') ||
      input.context?.origin?.includes('swap.defillama.com')
    ) {
      return hasCoWOrderFields(input.typedData?.types?.Order)
    }

    // Method 4: ABI/Structure detection (catches other aggregator usage)
    // Only use this as last resort and exclude test environments
    if (
      input.typedData?.primaryType === 'Order' &&
      hasCoWOrderFields(input.typedData.types?.Order) &&
      input.chainId !== 84532 && // Exclude Base Sepolia (DummySwap territory)
      !input.context?.origin?.includes('localhost') &&
      !input.context?.origin?.includes('127.0.0.1')
    ) {
      return true
    }

    return false
  },
  name: 'CoW Protocol',
}

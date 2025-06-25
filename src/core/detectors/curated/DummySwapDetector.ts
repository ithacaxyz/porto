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
 * DummySwap Protocol contract addresses for Base Sepolia testing
 */
const DUMMYSWAP_CONTRACTS: Record<number, Address.Address[]> = {
  84532: ['0x1234567890123456789012345678901234567890'], // Base Sepolia dummy contract
}

/**
 * Required fields for DummySwap orders (same as CoW for simplicity)
 */
const DUMMYSWAP_ORDER_FIELDS = [
  'sellToken',
  'buyToken',
  'sellAmount',
  'buyAmount',
  'validTo',
  'appData',
]

/**
 * DummySwap order structure (same as CoW for simplicity)
 */
interface DummySwapOrder {
  sellToken: Address.Address
  buyToken: Address.Address
  sellAmount: string
  buyAmount: string
  validTo: number
  appData: Hex.Hex
  feeAmount?: string
  kind: 'sell' | 'buy'
  partiallyFillable: boolean
  receiver?: Address.Address
  from?: Address.Address
  user?: Address.Address
  swapper?: Address.Address
}

/**
 * Helper function to check if order has required DummySwap fields
 */
function hasDummySwapOrderFields(orderFields: any[]): boolean {
  if (!orderFields) return false
  const fieldNames = orderFields.map((f) => f.name)
  return DUMMYSWAP_ORDER_FIELDS.every((field) => fieldNames.includes(field))
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
 * Generate order UID for testing
 */
function generateOrderUid(order: DummySwapOrder): string {
  // Simplified orderUid generation for testing
  const hash = `${order.sellToken}${order.buyToken}${order.sellAmount}${order.buyAmount}${order.validTo}`
  return `0x${hash.slice(0, 56).padEnd(56, '0')}` // Make it look like a real order ID
}

/**
 * DummySwap Protocol detector implementation for Base Sepolia testing
 */
/**
 * Check if DummySwap should be enabled - only show on localhost
 */
function isDummySwapEnabled(): boolean {
  // In browser environment, only show on localhost
  if (typeof window !== 'undefined') {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    )
  }

  // In Node.js test environment, enable for testing
  const processEnv = (globalThis as any).process?.env
  if (
    processEnv &&
    (processEnv.NODE_ENV === 'test' || processEnv.VITEST === 'true')
  ) {
    return processEnv.ENABLE_DUMMY_SWAP === '1'
  }

  // For all other Node.js environments, default to disabled
  return false
}

export const dummySwapDetector: ProtocolDetector = {
  async decode(input: SignatureInput): Promise<DecodedTransaction> {
    const order = input.typedData!.message as DummySwapOrder

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
        description: 'DummySwap Protocol fee',
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
            description: 'DummySwap Protocol settlement execution',
            function: 'settlement',
          },
        ],
        recipient: receiver,
        sender,
        timing: { validUntil },
      },
      metadata: {
        appData: order.appData,
        chainId: input.chainId,
        isTestProtocol: true,
        kind: order.kind,
        orderUid,
        partiallyFillable: order.partiallyFillable,
      },
      protocol: 'DummySwap Protocol',
      summary: `${verb} ${sellAmountFormatted} ${sellTokenInfo.symbol} for ${buyAmountFormatted} ${buyTokenInfo.symbol} on Base Sepolia`,
      warnings,
    }
  },

  async detect(input: SignatureInput): Promise<boolean> {
    // Only activate on Base Sepolia (84532)
    if (input.chainId !== 84532) return false

    // Check if DummySwap is enabled via URL parameter
    if (!isDummySwapEnabled()) return false

    // Method 1: EIP-712 domain detection (highest priority for DummySwap)
    if (
      input.typedData?.domain?.name === 'DummySwap Protocol' &&
      input.typedData?.primaryType === 'Order'
    ) {
      return true
    }

    // Method 2: Contract address detection
    if (
      input.to &&
      DUMMYSWAP_CONTRACTS[input.chainId]?.includes(
        input.to.toLowerCase() as Address.Address,
      )
    ) {
      return true
    }

    // Method 3: Origin detection with DummySwap-specific context
    if (
      (input.context?.origin?.includes('localhost') ||
        input.context?.origin?.includes('127.0.0.1')) &&
      input.typedData?.domain?.name !== 'Gnosis Protocol'
    ) {
      // Avoid conflicts with CoW
      return hasDummySwapOrderFields(input.typedData?.types?.Order)
    }

    // Method 4: Only detect as DummySwap if explicitly specified via domain or context
    // Do NOT use generic ABI structure detection to avoid conflicts with CoW Protocol

    return false
  },
  name: 'DummySwap Protocol',
}

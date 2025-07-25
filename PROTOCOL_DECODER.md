# Protocol Signature Decoder

This implementation adds comprehensive protocol signature decoding to Porto wallet, enabling rich transaction previews for EIP-712 signatures from modern intent-based protocols.

## Overview

The Protocol Decoder system provides:

- ✅ **Rich previews** for CoW Protocol orders on Base
- ✅ **CoWSwap integration detection** (Safe.global, DefiLlama, etc.)
- ✅ **ERC-7683 standard support** for cross-chain intents
- ✅ **Hybrid two-tier architecture** for scalable protocol support
- ✅ **Meta tag detection** for application-specified detectors
- ✅ **Verification levels** (curated, community, certified)
- ✅ **Security warnings** for receiver mismatches and timing issues
- ✅ **Dynamic token fetching** via ERC20 contract queries
- ✅ **Lazy loading** for community-contributed detectors
- ✅ **Automatic integration** with Porto dialog system

## Architecture

### Two-Tier System

```
src/core/
├── ProtocolDecoder.ts                    # Core types and main API
├── detectors/
│   ├── index.ts                         # Enhanced detection system
│   ├── curated/                         # Always loaded (high-priority)
│   │   ├── index.ts                     # Auto-initialization
│   │   ├── CowProtocolDetector.ts       # CoW Protocol support
│   │   └── DummySwapDetector.ts         # Base Sepolia testing
│   └── community/                       # Lazy loaded (on-demand)
│       ├── index.ts                     # Dynamic loading system
│       └── ERC7683Detector.ts           # Cross-chain intent standard
└── internal/
    ├── tokenInfo.ts                     # Dynamic ERC20 token fetching
    └── metaTagDetection.ts              # HTML meta tag parsing
```

### Detection Strategy

The system uses a priority-based detection approach:

1. **Curated Detectors (Always Loaded)**: High-traffic protocols detected immediately
2. **Meta Tag Detection**: Applications specify their detector via HTML meta tags  
3. **Community Detectors (Lazy Loaded)**: On-demand loading based on meta tags
4. **Fallback**: Unknown protocol display with security warnings

## Supported Protocols

### CoW Protocol (Base Chain) - Curated Tier

Detects and decodes CoW Protocol orders with:

- **Direct usage**: `swap.cow.fi` with Gnosis Protocol domain
- **Platform integration**: Safe.global (widget), DefiLlama (SDK/API)
- **Contract detection**: Base mainnet (`0x9008D19f58AAbD9eD0D60971565AA8510560ab41`)
- **Dynamic token support**: All ERC20 tokens via contract queries
- **Custom labels**: "Send" and "Receive (at least)" for DEX semantics

**Example Output:**
```
Protocol: "CoW Protocol"
Summary: "Sell 1000.0000 USDC for 0.4200 WETH"
Assets: [
  { type: "send", label: "Send", symbol: "USDC", amount: "1000.0000" },
  { type: "receive", label: "Receive (at least)", symbol: "WETH", amount: "0.4200" }
]
Fees: [1.0000 USDC protocol fee]
Warnings: ["⚠️ Order expires in less than 5 minutes"]
```

### DummySwap Protocol (Base Sepolia) - Curated Tier

Testing protocol for Base Sepolia development:

- **Chain-specific**: Only activates on Base Sepolia (84532)
- **Localhost-only**: Only shows when running on `localhost` or `127.0.0.1`
- **Automatic**: No URL parameters needed - simply localhost detection
- **Same structure**: Uses CoW Protocol structure for compatibility
- **Dynamic tokens**: ERC20 contract integration
- **Conflict avoidance**: Specifically excluded from CoW Protocol detection

### ERC-7683 CrossChainIntent - Community Tier

Supports the emerging standard for cross-chain intents:

- **Standard compliance**: `CrossChainOrder`, `OnchainCrossChainOrder`, `GaslessCrossChainOrder`
- **Multi-chain support**: Base ↔ Ethereum, Arbitrum, Optimism, etc.
- **Bridge detection**: Automatic chain name resolution
- **Cross-chain warnings**: Clear indication of destination chain
- **Custom labels**: "Bridge from origin" and "Receive on destination"

**Example Output:**
```
Protocol: "ERC-7683 CrossChainIntent"
Summary: "Bridge 1000.0000 USDC from Base to 999.0000 USDC on Ethereum"
Assets: [
  { type: "send", label: "Bridge from origin", symbol: "USDC", amount: "1000.0000" },
  { type: "receive", label: "Receive on destination", symbol: "USDC", amount: "999.0000" }
]
Warnings: ["Cross-chain transaction: tokens will arrive on Ethereum"]
```

## Verification Levels

The system provides clear verification indicators to users:

### ✅ **Curated**: "Decoder verified by Porto Core Team"
- Top protocols reviewed and maintained by Porto team
- Always loaded, highest performance
- Guaranteed compatibility and security

### 🔍 **Community**: "Community verified detector"  
- Open source detectors reviewed by community maintainers
- Lazy loaded when needed
- Community-driven maintenance

### 🛡️ **Certified**: "Porto certified detector"
- Premium verification with commercial support
- Priority review and maintenance
- Revenue stream to fund Porto development

### ⚠️ **Unknown**: "Protocol not recognized"
- No detector available
- Raw signature display with security warnings
- Encourages protocol to add detector support

## Usage

### Enhanced Detection API

```typescript
import { 
  detectProtocolEnhanced, 
  decodeProtocolSignature 
} from 'porto/core/detectors'

const input = {
  typedData: {
    domain: { name: 'Gnosis Protocol', chainId: 8453 },
    types: { Order: [...] },
    primaryType: 'Order',
    message: { ... }
  },
  chainId: 8453,
  context: { origin: 'swap.cow.fi' }
}

// Enhanced detection with two-tier architecture
const detector = await detectProtocolEnhanced(input)
const result = await decodeProtocolSignature(input)
console.log(result.summary) // "Sell 1000 USDC for 0.42 ETH"
```

### DummySwap Testing

DummySwap is automatically available when running on localhost:

**Localhost**: Automatically enabled
```
# DummySwap available
http://localhost:5174
http://127.0.0.1:3000
```

**Production/Other domains**: Automatically hidden
```
# DummySwap not available  
https://id.porto.sh
https://example.com
```

**Test environment**: Hidden by default, enabled with `ENABLE_DUMMY_SWAP=1` environment variable

Simple and clean - no URL parameters needed!

### Meta Tag Specification

Applications can specify their protocol detector using HTML meta tags:

```html
<!-- Required: Detector ID -->
<meta name="porto-detector" content="compound-v3">

<!-- Optional: Version for compatibility -->
<meta name="porto-detector-version" content="1.0.0">

<!-- Optional: Fallback for older Porto versions -->
<meta name="porto-detector-fallback" content="lending">
```

### Adding Community Detectors

```typescript
// Register in community/index.ts
const COMMUNITY_DETECTORS = {
  'my-protocol': () => import('./MyProtocolDetector.js').then(m => m.myProtocolDetector),
}

// Detector implementation
export const myProtocolDetector: ProtocolDetector = {
  name: 'My Protocol',
  async detect(input) {
    return input.typedData?.domain?.name === 'MyProtocol'
  },
  async decode(input) {
    return {
      protocol: 'My Protocol',
      action: 'custom_action',
      summary: 'Custom transaction',
      details: { ... },
      metadata: {
        verificationLevel: 'community'
      }
    }
  }
}
```

## Integration with Porto Dialog

The system automatically enhances `eth_signTypedData_v4` requests in dialog mode:

1. **Enhanced Detection**: Uses two-tier architecture with loading states
2. **Verification Indicators**: Shows detector verification level
3. **Dynamic Token Data**: Fetches token information from contracts
4. **Fallback**: Gracefully handles unknown protocols
5. **Security**: Provides warnings for potential issues

### Dialog Enhancement

The SignTypedData component now includes:

- **Loading states** during protocol detection
- **Verification level badges** with color coding
- **Enhanced protocol data** with dynamic token information
- **Custom labels** for different protocol semantics
- **Backward compatibility** with existing detection

## Security Features

### Receiver Validation

```typescript
// Automatic detection of receiver mismatches
if (sender.toLowerCase() !== receiver.toLowerCase()) {
  warnings.push('⚠️ ATTENTION: Tokens will be sent to different address')
  warnings.push('Double-check this is intentional - could be social engineering')
}
```

### Timing Warnings

```typescript
// Alerts for short-lived orders
const timeUntilExpiry = validUntil.getTime() - Date.now()
if (timeUntilExpiry < 5 * 60 * 1000) {
  warnings.push('⚠️ Order expires in less than 5 minutes')
}
```

### Cross-Chain Safety

```typescript
// Clear cross-chain indicators
warnings: [
  'Cross-chain transaction: tokens will arrive on Ethereum',
  'Verify the destination chain and recipient addresses carefully'
]
```

## Detection Methods

### Multi-Layer Detection

The system uses multiple detection methods for maximum coverage:

1. **Curated Domain Detection**: High-traffic protocols by domain
2. **EIP-712 Domain**: `domain.name === 'Gnosis Protocol'`
3. **ABI Structure**: Presence of required order fields
4. **Contract Address**: Known protocol contract addresses
5. **Meta Tag Detection**: Application-specified detectors
6. **Origin Context**: Website origin with validation

### Platform Integration Support

Automatically detects when CoWSwap is used through platform integrations:

```typescript
// Safe.global using CoWSwap widget
{
  domain: { name: 'Gnosis Protocol' },
  types: { Order: [/* CoW fields */] },
  context: { origin: 'safe.global' }
}
// Result: "CoW Protocol (via Safe)"

// DefiLlama using CoWSwap SDK/API  
{
  domain: { name: 'Gnosis Protocol' },
  types: { Order: [/* CoW fields */] },
  context: { origin: 'swap.defillama.com' }
}
// Result: "CoW Protocol (via DefiLlama)"
```

## Dynamic Token Support

### ERC20 Contract Integration

The system automatically fetches token information:

```typescript
import { getTokenInfo, formatTokenAmount } from 'porto/core/internal/tokenInfo'

// Automatic token data fetching
const tokenInfo = await getTokenInfo(tokenAddress, chainId)
// Returns: { symbol: 'USDC', name: 'USD Coin', decimals: 6 }

// Proper amount formatting
const formatted = formatTokenAmount(rawAmount, tokenInfo.decimals)
// '1000000000' -> '1000.0000'
```

### Features

- **Symbol/Name/Decimals**: Fetched from ERC20 contracts
- **Native Token Handling**: ETH/WETH automatic detection  
- **Caching**: Performance optimization for repeated queries
- **Fallback**: Graceful handling of non-standard tokens

## Testing

Comprehensive test suite covering:

- ✅ Enhanced two-tier detection
- ✅ Curated detector priority
- ✅ Meta tag detection  
- ✅ Community detector lazy loading
- ✅ Direct protocol usage
- ✅ Platform integration detection
- ✅ Cross-chain intents
- ✅ Unknown protocol fallback
- ✅ Security warnings
- ✅ Registry management

```bash
# Run tests
pnpm test src/core/ProtocolDecoder.test.ts

# Type checking
pnpm check:types

# Full test suite
pnpm test
```

## Performance Considerations

### Optimization Strategy

- **Curated protocols**: Always loaded, zero lazy loading overhead
- **Community protocols**: Loaded only when specified via meta tags
- **Token data caching**: Reduces repeated ERC20 contract calls
- **Meta tag caching**: 15-minute cache for HTML meta tag results
- **Bundle size**: Core bundle only includes curated detectors

### Lazy Loading Benefits

- **Reduced initial bundle**: Community detectors not in main bundle
- **On-demand loading**: Only load what's needed for specific applications
- **Scalability**: Add protocols without impacting core performance
- **Caching**: Smart caching reduces repeated loads

## Migration & Expansion

### Current Implementation Status

1. **✅ Phase 1**: Two-tier architecture foundation
2. **✅ Phase 2**: Meta tag detection system  
3. **✅ Phase 3**: Enhanced UI with verification levels
4. **✅ Phase 4**: Dynamic token fetching integration

### Future Extensions

#### Additional Protocols (Community Tier)

The system is designed to easily support:

- **UniswapX**: Intent-based swapping
- **0x Protocol**: Limit orders  
- **Aave**: Supply/borrow intents
- **Compound**: Lending protocols
- **Curve**: DEX protocols
- **Custom protocols**: Via the registration API

#### Certification Program

- **Review process**: Establish criteria for certified detectors
- **Premium features**: Advanced detector capabilities
- **Commercial support**: Revenue generation for Porto
- **Priority maintenance**: Fast-track certified protocol updates

## Contributing

### Adding Community Detectors

1. Create detector in `src/core/detectors/community/`
2. Implement `ProtocolDetector` interface
3. Add to `COMMUNITY_DETECTORS` registry
4. Include verification level metadata
5. Write tests for detection and decoding
6. Add meta tag specification to your application

### Meta Tag Integration

Applications can integrate by adding meta tags:

```html
<!-- Specify your detector -->
<meta name="porto-detector" content="your-protocol-id">

<!-- Optional version and fallback -->
<meta name="porto-detector-version" content="1.0.0">
<meta name="porto-detector-fallback" content="dex">
```

### Review Process

- **Community detectors**: Open source review process
- **Security validation**: Code review for safety
- **Testing requirements**: Comprehensive test coverage
- **Documentation**: Clear integration guidelines

## Architecture Benefits

### For Users
- **Immediate recognition**: Curated protocols load instantly
- **Clear verification**: Know the trust level of each detector
- **Rich previews**: Detailed transaction information
- **Security warnings**: Protection against common attacks

### For Developers  
- **Easy integration**: Meta tag specification
- **Scalable architecture**: Add protocols without core changes
- **Community contributions**: Open source detector development
- **Clear upgrade path**: From community to certified tiers

### For Porto
- **Performance**: Core bundle stays small
- **Security**: All detectors controlled and reviewed
- **Revenue potential**: Certification program opportunities
- **Community growth**: Ecosystem expansion without overhead

The system provides a foundation for a comprehensive protocol ecosystem while maintaining Porto's security standards and performance requirements.
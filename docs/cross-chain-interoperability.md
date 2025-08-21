# Cross-Chain Interoperability in Porto

## Overview

Porto implements a sophisticated cross-chain interoperability system that enables seamless multi-chain transactions through a combination of smart contracts and cryptographic techniques. The system allows users to execute intents across multiple blockchain networks atomically, with built-in settlement and funding mechanisms.

## Architecture Components

### 1. Core Contracts

#### Orchestrator Contract (`src/Orchestrator.sol`)
The central coordinator that manages cross-chain intent execution, verification, and payment processing.

**Key Features:**
- Multi-chain intent verification using Merkle proofs
- Atomic execution across chains
- Gas compensation and payment management
- EIP-712 signature verification

#### SimpleFunder Contract (`src/SimpleFunder.sol`)
Manages the funding of cross-chain transactions by pulling funds from approved sources.

**Key Features:**
- Pull-based payment model for relayers
- Signature-based authorization for fund transfers
- Support for both native tokens (ETH) and ERC20 tokens
- Gas wallet management for native currency transfers
- Owner and funder role separation for security

**Security Model:**
- `owner`: Cold vault for admin operations
- `funder`: EOA for signing payment authorizations
- `gasWallets`: Authorized accounts for pulling native currency

#### Settlement Contracts

##### SimpleSettler (`src/SimpleSettler.sol`)
A basic settlement mechanism for recording cross-chain transaction completions.

**Key Features:**
- EIP-712 signature-based settlement attestation
- Owner can delegate settlement writing via signatures
- Mapping-based settlement tracking: `settlementId => sender => chainId => isSettled`
- Event emission for off-chain monitoring

##### LayerZeroSettler (`src/LayerZeroSettler.sol`)
Advanced cross-chain settlement using LayerZero v2 protocol.

**Key Features:**
- OApp (Omnichain Application) implementation
- Self-execution model for cross-chain messaging
- Automatic peer discovery (defaults to same contract address across chains)
- Built-in fee management for LayerZero messaging
- Support for multiple destination chains in a single transaction

## Cross-Chain Intent Flow

### 1. Intent Structure

Multi-chain intents are defined with the following key fields:

```solidity
struct Intent {
    bool isMultichain;           // Flag for multi-chain mode
    address eoa;                  // User's account address
    bytes executionData;          // Encoded batch of calls
    uint256 nonce;               // 2D nonce with multichain prefix
    bytes[] encodedFundTransfers; // Fund transfers (output chain)
    address settler;              // Settlement contract address
    bytes settlerContext;         // Chain IDs for settlement
    // ... other fields
}
```

### 2. Multi-Chain Execution Process

#### Phase 1: Intent Creation
1. User creates an intent with `isMultichain = true`
2. Intent is signed using EIP-712 standard
3. For multi-chain intents, a Merkle tree is constructed with:
   - Each leaf representing an intent digest for a specific chain
   - Root signed by the user

#### Phase 2: Input Chain Execution
Input chains execute the intent and verify funding:

```solidity
// Orchestrator verifies the Merkle proof
(isValid, keyHash) = _verifyMerkleSig(digest, eoa, signature);

// For input intents (no fund transfers)
// Wait for settlement from output chain
```

#### Phase 3: Output Chain Execution
Output chain processes funding and triggers settlement:

```solidity
// Fund the account
_fund(eoa, funder, digest, encodedFundTransfers, funderSignature);

// Send settlement to input chains
if (encodedFundTransfers.length > 0) {
    ISettler(settler).send(digest, settlerContext);
}
```

#### Phase 4: Settlement Propagation
Settlement is propagated to input chains via:

**SimpleSettler Method:**
- Off-chain oracle collects `Sent` events
- Oracle signs settlement attestations
- Anyone can submit signed attestations on-chain

**LayerZeroSettler Method:**
- Automatic cross-chain message passing
- Settlement recorded on destination chains
- No manual intervention required

### 3. Merkle Signature Verification

Multi-chain intents use Merkle trees for efficient verification:

```solidity
function _verifyMerkleSig(bytes32 digest, address eoa, bytes memory signature) 
    returns (bool isValid, bytes32 keyHash) 
{
    (bytes32[] memory proof, bytes32 root, bytes memory rootSig) = 
        abi.decode(signature, (bytes32[], bytes32, bytes));
    
    // Verify current chain's intent is in the Merkle tree
    if (MerkleProofLib.verify(proof, root, digest)) {
        // Verify root signature
        (isValid, keyHash) = IIthacaAccount(eoa).unwrapAndValidateSignature(
            root, 
            rootSig
        );
    }
}
```

## Fund Transfer Mechanism

### Transfer Ordering
Fund transfers must be strictly ordered to prevent manipulation:
- Transfers sorted by token address (ascending)
- No duplicate token addresses allowed
- `address(0)` represents native token

### Funding Process
1. Pre-balance snapshot of all tokens
2. Call to `IFunder.fund()` with transfers and signature
3. Post-balance verification to ensure sufficient funding
4. Revert if any transfer is insufficient

### SimpleFunder Implementation
```solidity
function fund(
    address account,
    bytes32 digest,
    Transfer[] memory transfers,
    bytes memory funderSignature
) external {
    // Verify orchestrator is caller
    require(msg.sender == ORCHESTRATOR);
    
    // Verify funder signature
    bool isValid = SignatureCheckerLib.isValidSignatureNow(
        funder, 
        digest, 
        funderSignature
    );
    
    // Transfer tokens to account
    for (uint256 i; i < transfers.length; ++i) {
        TokenTransferLib.safeTransfer(
            transfers[i].token, 
            account, 
            transfers[i].amount
        );
    }
}
```

## Settlement Mechanisms

### SimpleSettler Flow
1. **Event Emission**: Output chain emits `Sent` event with settlement details
2. **Oracle Collection**: Off-chain oracle monitors events
3. **Signature Generation**: Oracle signs settlement attestation
4. **On-chain Recording**: Anyone can submit signed attestation to input chains
5. **Verification**: Input chains verify settlement before proceeding

### LayerZeroSettler Flow
1. **Initiation**: Call `send()` to mark settlement as valid
2. **Execution**: Call `executeSend()` with fee to trigger cross-chain messages
3. **Message Routing**: LayerZero routes messages to destination chains
4. **Receipt Processing**: `_lzReceive()` records settlement on destination
5. **Verification**: Contracts can query settlement status via `read()`

### Settlement Data Structure
```solidity
// Mapping: settlementId => sender => chainId => isSettled
mapping(bytes32 => mapping(address => mapping(uint256 => bool))) public settled;
```

## Security Considerations

### 1. Signature Verification
- All cross-chain operations require cryptographic signatures
- EIP-712 structured data signing prevents replay attacks
- Merkle proofs ensure intent integrity across chains

### 2. Nonce Management
- 2D nonce system (sequence key + sequential nonce)
- Multi-chain intents use special prefix (`0xc1d0`)
- Prevents double-spending and replay attacks

### 3. Fund Safety
- Strict transfer ordering prevents manipulation
- Balance verification ensures sufficient funding
- Atomic execution prevents partial failures

### 4. Settlement Integrity
- Cryptographic attestation of settlements
- Multiple settlement mechanisms for redundancy
- Event-based monitoring for transparency

### 5. Gas Management
- Combined gas limits for predictable execution
- Pre-payment and post-payment separation
- Compensation caps to prevent drainage

## Integration Guidelines

### For DApp Developers

1. **Intent Construction**:
   - Set `isMultichain = true` for cross-chain intents
   - Include all target chain IDs in `settlerContext`
   - Construct Merkle tree with intent digests for each chain

2. **Funding Setup**:
   - Deploy or connect to a `SimpleFunder` contract
   - Ensure funder has approved tokens to Orchestrator
   - Sign fund transfer authorizations

3. **Settlement Choice**:
   - Use `SimpleSettler` for cost-effective, oracle-based settlement
   - Use `LayerZeroSettler` for automatic, trustless settlement

4. **Error Handling**:
   - Monitor `IntentExecuted` events for execution status
   - Check settlement status before dependent operations
   - Implement retry logic for failed settlements

### For Relayers

1. **Intent Submission**:
   - Verify intent signatures before submission
   - Calculate required gas for all chains
   - Ensure sufficient funding is available

2. **Settlement Monitoring**:
   - Watch for `Sent` events on output chains
   - Submit settlement attestations to input chains
   - Track settlement completion across all chains

3. **Gas Optimization**:
   - Batch multiple intents when possible
   - Use efficient routing for cross-chain messages
   - Monitor gas prices across chains

## Example Use Cases

### 1. Cross-Chain Token Swap
- User signs intent to swap tokens across chains
- Output chain receives tokens and initiates swap
- Settlement confirms swap completion
- Input chain releases swapped tokens

### 2. Multi-Chain DeFi Position
- User creates leveraged position across multiple chains
- Funds are distributed from output chain
- Each chain executes its portion of the strategy
- Settlement ensures atomic execution

### 3. Cross-Chain NFT Purchase
- User purchases NFT on different chain
- Payment processed on source chain
- NFT minted/transferred on destination chain
- Settlement confirms successful purchase

## Technical Specifications

### Contract Interfaces

#### IFunder
```solidity
interface IFunder {
    function fund(
        address account,
        bytes32 digest,
        Transfer[] memory transfers,
        bytes memory funderSignature
    ) external;
}
```

#### ISettler
```solidity
interface ISettler {
    function send(
        bytes32 settlementId, 
        bytes calldata settlerContext
    ) external payable;
    
    function read(
        bytes32 settlementId, 
        address attester, 
        uint256 chainId
    ) external view returns (bool isSettled);
}
```

### Event Definitions

```solidity
// SimpleSettler
event Sent(
    address indexed sender, 
    bytes32 indexed settlementId, 
    uint256 receiverChainId
);

// LayerZeroSettler
event Settled(
    address indexed sender, 
    bytes32 indexed settlementId, 
    uint256 senderChainId
);

// Orchestrator
event IntentExecuted(
    address indexed eoa, 
    uint256 indexed nonce, 
    bool incremented, 
    bytes4 err
);
```

## Conclusion

Porto's cross-chain interoperability system provides a robust, secure, and flexible framework for executing multi-chain transactions. Through the combination of Merkle-based verification, multiple settlement mechanisms, and secure funding protocols, Porto enables seamless cross-chain interactions while maintaining security and atomicity guarantees.

The modular design allows developers to choose appropriate settlement mechanisms based on their specific requirements, whether prioritizing cost-effectiveness with SimpleSettler or automation with LayerZeroSettler. This flexibility, combined with comprehensive security measures and clear integration patterns, makes Porto a powerful solution for building cross-chain applications in the Ethereum ecosystem.
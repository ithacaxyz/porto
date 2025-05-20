# Account

The Porto Account is a keychain that holds user funds, enforces permissions via [Keys](#key), manages nonces to prevent replay attacks, and enables secure executions from the account.

## Keys

A key is a fundamental signing unit. An account can `authorize` multiple keys with different limits and permissions.

```solidity
    /// @dev A key that can be used to authorize call.
    struct Key {
        /// @dev Unix timestamp at which the key expires (0 = never).
        uint40 expiry;
        /// @dev Type of key. See the {KeyType} enum.
        KeyType keyType;
        /// @dev Whether the key is a super admin key.
        /// Super admin keys are allowed to call into super admin functions such as
        /// `authorize` and `revoke` via `execute`.
        bool isSuperAdmin;
        /// @dev Public key in encoded form.
        bytes publicKey;
    }
```

#### Key Types

```solidity
    /// @dev The type of key.
    enum KeyType {
        P256,
        WebAuthnP256,
        Secp256k1,
        External
    }
```

The account supports 4 key types natively -

1. **P256**: Standard ECDSA key on the `secp256r1` curve. Mainly used for browser session keys.
2. **WebAuthnP256**: Enables passkey support, using the webauthn standard.
3. **Secp256k1**: Standard ECDSA key on the `secp256k1` curve. Can be used directly with Ethereum EOA private keys.
4. **External**: Allows devs to extend the verification capabilities of the account, by calling an external `Signer` contract for signature verification.

#### Key Hashes

Each key in the account is uniquely identified by its keyHash.

The keyHash is calculated as -

```solidity
    bytes32 keyHash = keccak256(abi.encode(key.keyType, keccak256(key.publicKey)))
```

### Super Admin Keys

- Highest permission tier in the account. Can `authorize` & `revoke` any other keys.
- Only super admin keys are allowed to sign 1271 `isValidSignature` data.
- The EOA private key is automatically considered a super admin key.

:::info
The default EOA key of a 7702 account, effectively has a keyHash of `bytes32(0)`, and automatically has super admin permissions.
:::

### External Key Type

:::info
Coming Soon
:::

## Nonce Management

The account supports 4337-style 2D nonce sequences.

A nonce is a `uint256` value, where the first 192 bits are the `sequence key` and the remaining 64 bits are treated as sequential incrementing nonces.

> **Example:**
>
> - If `nonce = 1`:
>   - `sequence key = 0`
>   - `incrementing value = 1`
>   - Next valid nonce for this sequence key: `2`
> - If `nonce = (1 << 64) + 1` (i.e., 2<sup>64</sup> + 1):
>   - `sequence key = 1`
>   - `incrementing value = 1`
>   - Next valid nonce for this sequence key: `(1 << 64) + 2`

It is recommended to use separate sequence keys for different backend services, to allow parallel transactions to go through.

:::note
There is a 20k gas overhead (cold SSTORE), the first time a new sequence key is used for a nonce.
:::

### MultiChain Prefix

When a nonce's sequence key begins with the prefix `0xc1d0` (a mnemonic for "chainID zero"), the Porto Account recognizes this as a multichain execution. Consequently, the `chainId` is omitted from the EIP-712 domain separator when constructing the digest for signature verification.

This allows the same signature to be valid across multiple chains.

## Execution

The Porto Account uses the [ERC 7821](https://eips.ethereum.org/EIPS/eip-7821) Executor interface.

Executions are accepted in the form of `Calls`

```solidity
    /// @dev Call struct for the `execute` function.
    struct Call {
        address to; // Replaced as `address(this)` if `address(0)`.
        uint256 value; // Amount of native currency (i.e. Ether) to send.
        bytes data; // Calldata to send with the call.
    }
```

The execution interface is

```solidity
    function execute(bytes32 mode, bytes calldata executionData) public payable virtual;
```

### Modes

The Porto Account supports the following execution mode.

- `0x01000000000000000000...`: Single batch. Does not support optional `opData`.
- `0x01000000000078210001...`: Single batch. Supports optional `opData`.
- `0x01000000000078210002...`: Batch of batches.

Delegate calls are **not** supported.

:::note
The single batch mode without `opData` is only supported for self calls. In 7702 Delegated accounts, a call originating from the EOA is also considered a self call because `msg.sender == address(this)` in the contract.
:::

### Execution senders and opData

The exact Op data depends on who is calling the `execute` function.

#### Self Call & EOA

No op data is needed, if this is a self call. This can happen in 2 cases -

1. The account recursively calls `execute`. We use these kinds of self calls for admin functions like `authorize` and `revoke`. So these should be handled carefully.
2. The sender is the 7702 authority

#### Orchestrator Intents

The orchestrator is given some special privileges in the account. These are dicussed in the [Orchestrator Integration](#orchestrator-integration) section.

One of these privileges is the ability to verify signature & incremenet nonces before calling `execute` on the account.

Therefore, the `opData` if the orchestrator is the sender is structured as `bytes opData = abi.encode(bytes32 keyHash)`

This execution type is exclusively used by the intent flow.

#### Others

Any other external caller, has to provide a nonce and a signature for any execution they want to do on the account.

Therefore, the `opData` is structured as `bytes opData = abi.encode(uint256 nonce, bytes signature)`

### Example

The execution data for a batch of calls being sent by an arbitrary sender would look like this
```solidity

    Call memory call = Call({
        to: <address>,
        value: 0,
        data: <swap tokens>
    });

    uint256 nonce = account.getNonce(0); // 0 is the uint192 sequence key
    bytes memory signature = _sign(computeDigest(calls, nonce));
    bytes memory opData = abi.encodePacked(nonce, signature);
    bytes memory executionData = abi.encode(calls, opData);

    account.execute(_ERC7821_BATCH_EXECUTION_MODE, executionData);
```

## Orchestrator Integration
At the time of deployment, an orchestrator address can be set in a porto account. 
The orchestrator is an immutable privileged entity, that facilitates trustless interactions between the relayer and the account.

To do this, it is given 3 special access points into the account. 
More details about the whole intent flow can be found in the #Orchestrator section.

### 1. Pay
```solidity
    /// @dev Pays `paymentAmount` of `paymentToken` to the `paymentRecipient`.
    function pay(
        uint256 paymentAmount,
        bytes32 keyHash,
        bytes32 intentDigest,
        bytes calldata encodedIntent
    ) public virtual
```
Allows the orchestrator to transfer the `paymentAmount` specified in the intent signed by the user, pre and post execution.

### 2. Check and Increment Nonce 
```solidity
    /// @dev Checks current nonce and increments the sequence for the `seqKey`.
    function checkAndIncrementNonce(uint256 nonce) public payable virtual
```

Checks if the `nonce` specified in the intent is valid, and increments the sequence if it is.

### 3. Execute
As discussed in the [execution](#orchestrator-intents) section above, the orchestrator verifies the intent signature and increments the nonce _before_ calling `execute`. 

So for execute calls coming from the orchestrator, these checks are skipped in the account.
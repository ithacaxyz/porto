# Account

The Porto Account is a keychain that holds user funds, enforces permissions via [Keys](#keys), manages nonces to prevent replay attacks, enables secure executions from the account, and provides native cross-chain interoperability.

## Concepts
### Keys

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

#### Public key encoding

The encoding of a key pair's public key depends on the key type:

| Key Type         | Encoding Format       | Description                                                                    |
| ---------------- | --------------------- | ------------------------------------------------------------------------------ |
| secp256r1 (P256) | `abi.encode(x, y) `   | Stores both x and y coordinates for the secp256r1 curve.                       |
| webAuthn          | `abi.encode(x, y)`    | Stores both x and y coordinates of the public key on the elliptic curve.      |
| secp256k1        | `abi.encode(address)` | Stores only the Ethereum address derived from the public key (truncated hash). |
| external | `abi.encodePacked(address(signer), bytes12(salt)) `| Stores the address of the external signer, and a bytes12 salt value | 

#### Signature encoding

The signature is encoded as follows: `abi.encodePacked(bytes(innerSignature), bytes32(keyHash), bool(prehash))`, where the key hash is `keccak(bytes32(keyType, publicKey))`.

The inner signature depends on the key type:

| Key Type | Signature |
| -------- | --------- |
| secp256r1 (p256) | `(r, s)` |
| webauthn | `(r, s)` |
| secp256k1 | `(r, s)` or `(r, vs)` |

#### Super Admin Keys

- Highest permission tier in the account. Can `authorize` and `revoke` any other keys.
- Only super admin keys are allowed to sign 1271 `isValidSignature` data.
- The EOA private key is automatically considered a super admin key.

:::info
The default EOA key of a 7702 account, effectively has a keyHash of `bytes32(0)`, and automatically has super admin permissions.
:::

#### External Key Type

:::info
Coming Soon
:::

### Nonce Management

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

#### MultiChain Prefix

When a nonce's sequence key begins with the prefix `0xc1d0` (a mnemonic for "chainID zero"), the Porto Account recognizes this as a multichain execution. Consequently, the `chainId` is omitted from the EIP-712 domain separator when constructing the digest for signature verification.

This allows the same signature to be valid across multiple chains.

#### Cross-Chain Features

The account includes native cross-chain interoperability capabilities:

- **Merkle Signature Verification**: Built-in support for merkle signature verification in multichain executions
- **Fund Transfers**: Cross-chain fund transfers with strictly ordered token addresses
- **Funder Integration**: Native integration with funder contracts for cross-chain execution funding and signature verification
- **Multichain Execution**: Multichain flag enables advanced signature verification modes for cross-chain operations

### Execution

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
function execute(bytes32 mode, bytes calldata executionData) public payable;
```

#### Modes

The Porto Account supports the following execution modes.

- `0x01000000000000000000...`: Single batch. Does not support optional `opData`.
- `0x01000000000078210001...`: Single batch. Supports optional `opData`.
- `0x01000000000078210002...`: Batch of batches.

Delegate calls are **not** supported.

:::note
The single batch mode without `opData` is only supported for self calls. 

In 7702 Delegated accounts, a call originating from the EOA is also considered a self call because `msg.sender == address(this)` in the contract.
:::

#### Execution senders and opData

The exact Op data depends on who is calling the `execute` function.

##### Self Call & EOA

No op data is needed, if this is a self call. This can happen in 2 cases -

1. The account performs recursive calls to `execute`. Administrative functions such as `authorize` and `revoke` utilize this self-call pattern and require careful handling.
2. The sender is the 7702 authority

##### Orchestrator Intents

The orchestrator is given some special privileges in the account. These are discussed in the [Orchestrator Integration](#orchestrator-integration) section.

One of these privileges is the ability to verify signature & increment nonces before calling `execute` on the account.

Therefore, the `opData` if the orchestrator is the sender is structured as 
```solidity
bytes opData = abi.encode(bytes32 keyHash)
```

This execution type is exclusively used by the intent flow.

##### Others

Any other external caller, has to provide a nonce and a signature for any execution they want to do on the account.

Therefore, the `opData` is structured as 
```solidity
bytes opData = abi.encodePacked(uint256 nonce, bytes signature)
```

#### Example

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

### Orchestrator Integration
At the time of deployment, an orchestrator address can be set in a porto account. 
The orchestrator is an immutable privileged entity that facilitates trustless interactions between the relayer and the account, including cross-chain executions.

To do this, it is given 3 special access points into the account. 
More details about the whole intent flow can be found in the [Orchestrator documentation](/contracts/orchestrator.md).

#### 1. Pay
```solidity
/// @dev Pays `paymentAmount` of `paymentToken` to the `paymentRecipient`.
function pay(
    uint256 paymentAmount,
    bytes32 keyHash,
    bytes32 intentDigest,
    bytes calldata encodedIntent
) public; 
```
Allows the orchestrator to transfer the `paymentAmount` specified in the intent signed by the user, pre and post execution.

#### 2. Check and Increment Nonce 
```solidity
/// @dev Checks current nonce and increments the sequence for the `seqKey`.
function checkAndIncrementNonce(uint256 nonce) public payable; 
```

Checks if the `nonce` specified in the intent is valid, and increments the sequence if it is.

#### 3. Execute
As discussed in the [execution](#orchestrator-intents) section above, the orchestrator verifies the intent signature and increments the nonce _before_ calling `execute`. 

So for execute calls coming from the orchestrator, these checks are skipped in the account.

## Endpoints

### Admin 

These functions are marked `public virtual onlyThis`, meaning they can only be called by the account itself. To invoke them, a super admin key must submit a transaction to the `execute` function, with the `calls` parameter encoding a call to one of these admin functions.

#### `setLabel`

  ```solidity
  function setLabel(string calldata newLabel) public virtual onlyThis
  ```
- **Access Control:** The account itself (via `execute` from an authorized super admin key).
- **Description:** Sets or updates the human-readable label for the account. Emits a `LabelSet` event.
- **Usage:**
    - Include a call to this function in the `calls` array of an `execute` transaction.
    - `newLabel`: The new string label for the account.

#### `revoke`

  ```solidity
  function revoke(bytes32 keyHash) public virtual onlyThis
  ```
- **Access Control:** The account itself (via `execute` from an authorized super admin key).
- **Description:** Revokes an existing authorized key. Removes the key from storage and emits a `Revoked` event.
- **Usage:**
    - Include a call to this function in the `calls` array of an `execute` transaction.
    - `keyHash`: The hash of the key to be revoked. The key must exist.

#### `authorize`

  ```solidity
  function authorize(Key memory key) public virtual onlyThis returns (bytes32 keyHash)
  ```
- **Access Control:** The account itself (via `execute` from an authorized super admin key).
- **Description:** Authorizes a new key or updates the expiry of an existing key. Emits an `Authorized` event.
- **Usage:**
    - Include a call to this function in the `calls` array of an `execute` transaction.
    - `key`: A `Key` struct containing:
        - `expiry`: Unix timestamp for key expiration (0 for never).
        - `keyType`: Type of key (`P256`, `WebAuthnP256`, `Secp256k1`, `External`).
        - `isSuperAdmin`: Boolean indicating if the key has super admin privileges. Note: `P256` key type cannot be super admin.
        - `publicKey`: The public key bytes.
    - Returns the `keyHash` of the authorized key.

#### `setSignatureCheckerApproval`

  ```solidity
  function setSignatureCheckerApproval(bytes32 keyHash, address checker, bool isApproved) public virtual onlyThis
  ```
- **Access Control:** The account itself (via `execute` from an authorized super admin key).
- **Description:** Approves or revokes an address (`checker`) to successfully validate signatures for a given `keyHash` via `isValidSignature`. Emits a `SignatureCheckerApprovalSet` event.
- **Usage:**
    - Include a call to this function in the `calls` array of an `execute` transaction.
    - `keyHash`: The hash of the key for which the checker approval is being set. The key must exist.
    - `checker`: The address of the contract or EOA being approved/revoked.
    - `isApproved`: `true` to approve, `false` to revoke.

#### `invalidateNonce`

  ```solidity
  function invalidateNonce(uint256 nonce) public virtual onlyThis
  ```
- **Access Control:** The account itself (via `execute` from an authorized super admin key).
- **Description:** Invalidates all nonces for a given sequence key up to and including the provided `nonce`. The upper 192 bits of `nonce` act as the sequence key (`seqKey`). Emits a `NonceInvalidated` event.
- **Usage:**
    - Include a call to this function in the `calls` array of an `execute` transaction.
    - `nonce`: The nonce to invalidate. The lower 64 bits are the sequential part, and the upper 192 bits are the sequence key.

#### `upgradeProxyAccount`

  ```solidity
  function upgradeProxyAccount(address newImplementation) public virtual onlyThis
  ```
- **Access Control:** The account itself (via `execute` from an authorized super admin key).
- **Description:** Upgrades the implementation of the proxy account if this account is used with an EIP-7702 proxy. It calls `LibEIP7702.upgradeProxyDelegation` and then calls `this.upgradeHook()` on the new implementation.
- **Usage:**
    - Include a call to this function in the `calls` array of an `execute` transaction.
    - `newImplementation`: The address of the new account implementation contract. The new implementation should have an `upgradeHook` function.

#### `upgradeHook`

  ```solidity
  function upgradeHook(bytes32 previousVersion) external virtual onlyThis returns (bool)
  ```
- **Access Control:** The account itself, specifically called during the `upgradeProxyAccount` process by the old implementation on the new implementation's context. It includes a guard to ensure it's called correctly.
- **Description:** A hook function called on the new implementation after an upgrade. It's intended for storage migrations or other setup tasks. The current version is a no-op but demonstrates the pattern.
- **Usage:**
    - This function is not called directly by users. It's part of the upgrade mechanism.
    - `previousVersion`: The version string of the old implementation.

---

### Execution 
Discussed [here](#execution)

---

### Signature Validation

#### `unwrapAndValidateSignature`
```solidity
function unwrapAndValidateSignature(bytes32 digest, bytes calldata signature) public view virtual returns (bool isValid, bytes32 keyHash)
```
- **Description:**
    - Checks if the Orchestrator is paused.
    - If the signature is 64 or 65 bytes, it's treated as a raw secp256k1 signature from `address(this)`.
    - Otherwise, it attempts to unwrap a packed signature: `abi.encodePacked(bytes(innerSignature), bytes32(keyHash), bool(prehash))`.
    - If `prehash` is true, `digest` is re-hashed with `sha256`.
    - Validates the `innerSignature` against the `digest` using the public key associated with the unwrapped `keyHash` and its `keyType`. Supports `P256`, `WebAuthnP256`, `Secp256k1` (delegated to an EOA), and `External` (delegated to another contract implementing `isValidSignatureWithKeyHash`).
    - Checks for key expiry.
- **Usage:**
    - `digest`: The digest that was signed.
    - `signature`: The signature data, potentially wrapped.
    - Returns `isValid` (boolean) and the `keyHash` used for validation.

#### `isValidSignature`

  ```solidity
  function isValidSignature(bytes32 digest, bytes calldata signature) public view virtual returns (bytes4)
  ```

- **Description:** Implements EIP-1271. Checks if a given signature is valid for the provided digest.
    - Signatures are replay-safe across accounts via a custom EIP-712 wrapper on the incoming digest.
    - It then uses `unwrapAndValidateSignature` to validate the signature.
    - If valid, it further checks if the key used is a super admin key OR if `msg.sender` is an approved checker for that key hash.
    - This restriction (super admin or approved checker) is to prevent session keys from approving infinite allowances via Permit2 by default.
- **Usage:**
    - Called by other contracts (e.g., Permit2, DEXes) to verify signatures on behalf of this account.
    - `digest`: The hash of the message that was signed.
    - `signature`: The wrapped signature (`abi.encodePacked(bytes(innerSignature), bytes32(keyHash), bool(prehash))`) or a raw secp256k1 signature.
    - Returns `0x1626ba7e` if valid, `0xffffffff` if invalid.

---

### View 
Functions to read data from the account.

#### `getNonce`

  ```solidity
  function getNonce(uint192 seqKey) public view virtual returns (uint256)
  ```

- **Description:** Returns the current nonce for a given sequence key. The full nonce is `(uint256(seqKey) << 64) | sequential_nonce`.
- **Usage:**
    - `seqKey`: The upper 192 bits of the nonce, identifying the nonce sequence. 
    - Returns the full 256-bit nonce, where the lower 64 bits are the next sequential value to be used.

#### `label`

  ```solidity
  function label() public view virtual returns (string memory)
  ```

- **Description:** Returns the human-readable label of the account.
- **Usage:** Call to retrieve the account's label.

#### `keyCount`

  ```solidity
  function keyCount() public view virtual returns (uint256)
  ```

- **Description:** Returns the total number of authorized keys (including potentially expired ones before filtering in `getKeys`).
- **Usage:** Call to get the count of all registered key hashes.

#### `keyAt`

  ```solidity
  function keyAt(uint256 i) public view virtual returns (Key memory)
  ```

- **Description:** Returns the `Key` struct at a specific index `i` from the enumerable set of key hashes.
- **Usage:**
    - `i`: The index of the key to retrieve.
    - Useful for enumerating keys off-chain, but `getKeys()` is generally preferred for fetching all valid keys.

#### `getKey`

  ```solidity
  function getKey(bytes32 keyHash) public view virtual returns (Key memory key)
  ```

- **Description:** Returns the `Key` struct for a given `keyHash`. Reverts if the key does not exist.
- **Usage:**
    - `keyHash`: The hash of the key to retrieve.

#### `getKeys`

  ```solidity
  function getKeys() public view virtual returns (Key[] memory keys, bytes32[] memory keyHashes)
  ```

- **Description:** Returns two arrays: one with all non-expired `Key` structs and another with their corresponding `keyHashes`.
- **Usage:** Call to get a list of all currently valid (non-expired) authorized keys.

#### `getContextKeyHash`

  ```solidity
  function getContextKeyHash() public view virtual returns (bytes32)
  ```

- **Description:** Returns the `keyHash` of the key that authorized the current execution context (i.e., the most recent key in the `_KEYHASH_STACK_TRANSIENT_SLOT`). Returns `bytes32(0)` if the EOA key was used or if not in an execution context initiated by a key.
- **Usage:** Can be called by modules or hooks executed via `execute` to determine which key authorized the call.

#### `approvedSignatureCheckers`

  ```solidity
  function approvedSignatureCheckers(bytes32 keyHash) public view virtual returns (address[] memory)
  ```

- **Description:** Returns an array of addresses that are approved to use `isValidSignature` for the given `keyHash`.
- **Usage:**
    - `keyHash`: The hash of the key.

---

### Helpers

These functions are helpers that can be called publicly.

#### `hash` (Key Hashing)

  ```solidity
  function hash(Key memory key) public pure virtual returns (bytes32)
  ```
- **Description:** Computes the `keyHash` for a given `Key` struct. The hash is `keccak256(abi.encode(key.keyType, keccak256(key.publicKey)))`. Note that `expiry` and `isSuperAdmin` are not part of this hash.
- **Usage:**
    - `key`: The `Key` struct to hash.
    - Useful for deriving a `keyHash` off-chain before authorization or for verification.

#### `computeDigest`

  ```solidity
  function computeDigest(Call[] calldata calls, uint256 nonce) public view virtual returns (bytes32 result)
  ```
- **Description:** Computes the EIP-712 typed data hash for an `Execute` operation with built-in cross-chain support.
    - If the `nonce` starts with `MULTICHAIN_NONCE_PREFIX` (0xc1d0), the digest is computed without the chain ID, enabling cross-chain signature replay.
    - Otherwise, the standard EIP-712 digest including the chain ID is computed for single-chain execution.
- **Usage:**
    - `calls`: Array of `Call` structs to be executed.
    - `nonce`: The nonce for this execution.
    - The returned digest should be signed by an authorized key to authorize the execution.

---

# `wallet_verifySignature`

Verify a signature against an account.

## Request

```ts
type Request = {
  method: 'wallet_verifySignature',
  params: [{
    /** Account address */
    address: `0x${string}`,
    /** Chain ID of the account with the given key configured */
    chainId: number,
    /** Digest of the message to verify */
    digest: `0x${string}`,
    /** Signature to verify */
    signature: `0x${string}`,
  }],
}
```

## Response

```ts
type Response = {
  /** Whether the signature is valid */
  valid: boolean,
  /** Proof that can be used to verify the signature */
  proof?: {
    /** Address of an account (either delegated or stored) that the signature was verified against */
    account: `0x${string}`,
    /** The key hash that signed the digest */
    keyHash: `0x${string}`,
    /** Initialization precall. Provided if account is a stored account which has not been delegated */
    initPreCall?: {
      calls: {
        data?: `0x${string}`,
        to: `0x${string}`,
        value?: bigint,
      }[],
      capabilities: object,
      from: `0x${string}`,
    } | null,
  } | null,
}
```

## Example

```sh
cast rpc --rpc-url https://rpc.ithaca.xyz wallet_verifySignature '[{"address": "0x1234567890123456789012345678901234567890", "chainId": 8453, "digest": "0xabcd", "signature": "0x1234"}]'
```

```json
{
  "valid": true,
  "proof": {
    "account": "0x1234567890123456789012345678901234567890",
    "keyHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    "initPreCall": null
  }
}
```

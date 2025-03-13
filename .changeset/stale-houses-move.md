---
"porto": patch
---

**Breaking:** Updated to [latest ERC-7836 edits](https://github.com/lukasrosario/ERCs/pull/2/commits/bc63d3ff07ac71c56719ffbfd47194cd986c393c). 

- Added required `key` parameter to `wallet_prepareCalls` + `wallet_sendPreparedCalls`.

Example:

```diff
type Request = {
  method: 'wallet_prepareCalls',
  params: [{
    // ...
+   key: {
+     publicKey: `0x${string}`,
+     type: 'address' | 'p256' | 'secp256k1' | 'webauthn-p256', 
+   }
  }]
}
```

- Modified `signature` parameters on `wallet_sendPreparedCalls` to be a hex value.

```diff
type Request = {
  method: 'wallet_sendPreparedCalls',
  params: [{
    // ...
    key: {
      publicKey: `0x${string}`,
      type: 'address' | 'p256' | 'secp256k1' | 'webauthn-p256', 
    }
+   signature: `0x${string}`,
-   signature: {
-     publicKey: `0x${string}`,
-     type: 'address' | 'p256' | 'secp256k1' | 'webauthn-p256',
-     value: `0x${string}`,
-   },
  }]
}
---
"porto": patch
---

Fix: forward `webAuthn` adapters into signing paths for `Mode.Relay`.

- This prevents WebAuthn signing on React Native from defaulting to `window.navigator.credentials`, which is undefined on native.

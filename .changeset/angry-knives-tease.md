---
"porto": patch
---

Forwarded `webAuthn` adapters into signing paths for `Mode.Relay`.
This prevents WebAuthn signing on React Native from defaulting to `window.navigator.credentials` when platform is `android` or `ios`.

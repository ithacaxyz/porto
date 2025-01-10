---
"porto": patch
---

**Breaking:** Renamed APIs:

- JSON-RPC Methods:
  - `experimental_grantSession` → `experimental_authorizeKey`
  - `experimental_importAccount` → `experimental_createAccount`
  - `experimental_prepareImportAccount` → `experimental_prepareCreateAccount`
  - `experimental_sessions` → `experimental_keys`
- Capabilities:
  - `grantSession` → `authorizeKey`
  - `sessions` → `keys`


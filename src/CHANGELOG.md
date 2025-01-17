# porto

## 0.0.5

### Patch Changes

- [#19](https://github.com/ithacaxyz/porto/pull/19) [`a2f01d4`](https://github.com/ithacaxyz/porto/commit/a2f01d48745e4aa046152cb566896e8993b87a58) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Renamed APIs:

  - JSON-RPC Methods:
    - `experimental_grantSession` → `experimental_authorizeKey`
    - `experimental_importAccount` → `experimental_createAccount`
    - `experimental_prepareImportAccount` → `experimental_prepareCreateAccount`
    - `experimental_sessions` → `experimental_keys`
  - Capabilities:
    - `grantSession` → `authorizeKey`
    - `sessions` → `keys`

- [#19](https://github.com/ithacaxyz/porto/pull/19) [`a2f01d4`](https://github.com/ithacaxyz/porto/commit/a2f01d48745e4aa046152cb566896e8993b87a58) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Migrated to new [Account contracts](https://github.com/ithacaxyz/account).

## 0.0.4

### Patch Changes

- [`394cc44`](https://github.com/ithacaxyz/porto/commit/394cc441bf0cf175cf669449be19490879714b74) Thanks [@jxom](https://github.com/jxom)! - Modified `porto/wagmi` entrypoint to export `Actions`, `Hooks`, and `Query` modules.

## 0.0.3

### Patch Changes

- [`f699e82`](https://github.com/ithacaxyz/porto/commit/f699e82453eb7051c93478dc2793a819e56bd985) Thanks [@tmm](https://github.com/tmm)! - Bumped Viem peer dependency version.

## 0.0.2

### Patch Changes

- [#3](https://github.com/ithacaxyz/porto/pull/3) [`f501aa4`](https://github.com/ithacaxyz/porto/commit/f501aa431e8b5f46575e6a144910726583bb09fb) Thanks [@jxom](https://github.com/jxom)! - Added `experimental_prepareImportAccount` & `experimental_importAccount` JSON-RPC methods to import external accounts (EOAs).

## 0.0.1

### Patch Changes

- [`a69b6ac`](https://github.com/ithacaxyz/porto/commit/a69b6ac65e14f8a9e6f7e39a59de0a591486fba4) Thanks [@jxom](https://github.com/jxom)! - Initial release.

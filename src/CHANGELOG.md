# porto

## 0.0.15

### Patch Changes

- [`e1257e1`](https://github.com/ithacaxyz/porto/commit/e1257e17db8f766aa6c206c74cd77cf317349ba1) Thanks [@jxom](https://github.com/jxom)! - Fixed a race condition where the porto instance was not ready when the routes were rendered.

- [`e1257e1`](https://github.com/ithacaxyz/porto/commit/e1257e17db8f766aa6c206c74cd77cf317349ba1) Thanks [@jxom](https://github.com/jxom)! - Fixed iframe display attributes.

## 0.0.14

### Patch Changes

- [`b02b8fd`](https://github.com/ithacaxyz/porto/commit/b02b8fd9ce2a2386da1fc54365e7cec03ab4bc10) Thanks [@jxom](https://github.com/jxom)! - Tightened `permissions` types.

## 0.0.13

### Patch Changes

- [#51](https://github.com/ithacaxyz/porto/pull/51) [`e37e70e`](https://github.com/ithacaxyz/porto/commit/e37e70e67a4f2361aa81a4b6d2dadd6ca0a105aa) Thanks [@o-az](https://github.com/o-az)! - Updated `wallet_prepareCalls` to not require account state.

## 0.0.12

### Patch Changes

- [#46](https://github.com/ithacaxyz/porto/pull/46) [`dd9b5b2`](https://github.com/ithacaxyz/porto/commit/dd9b5b20114e0514e842191da6d22d160ef61f8f) Thanks [@o-az](https://github.com/o-az)! - Added support for `wallet_prepareCalls` & `wallet_sendPreparedCalls`.

## 0.0.11

### Patch Changes

- [`89616dc`](https://github.com/ithacaxyz/porto/commit/89616dc283aff8f05fb57323de0a3132b300815e) Thanks [@jxom](https://github.com/jxom)! - **Breaking:**

  - Renamed `experimental_authorizeKey` to `experimental_grantPermissions`
  - Renamed `experimental_keys` to `experimental_permissions`
  - Renamed `experimental_revokeKey` to `experimental_revokePermissions`
  - Renamed `keys` capability to `permissions`
  - Renamed `authorizeKey` capability to `grantPermissions`

## 0.0.10

### Patch Changes

- [`515f8cc`](https://github.com/ithacaxyz/porto/commit/515f8cca9de6d1b171d0615ea191a2666f2b6174) Thanks [@jxom](https://github.com/jxom)! - Added support for authorizing/revoking Admin Key.

## 0.0.9

### Patch Changes

- [`001e2cd`](https://github.com/ithacaxyz/porto/commit/001e2cd69f81f4efcb8e7344839d97fa0ab0df0f) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Updated Account contracts.

- [`401d2dc`](https://github.com/ithacaxyz/porto/commit/401d2dcf3710195fe4aef82b59771fd383d538d3) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Simplified `experimental_authorizeKey` parameters.

  - Made `expiry` and `permissions` required.
  - Removed `role` – all keys are now `role="session"`.

## 0.0.8

### Patch Changes

- [`dffa6cd`](https://github.com/ithacaxyz/porto/commit/dffa6cdca17b3b8b1018ae0be1d180597eb4936e) Thanks [@jxom](https://github.com/jxom)! - Fixed session key extraction based on call permissions.

## 0.0.7

### Patch Changes

- [`1a3df65`](https://github.com/ithacaxyz/porto/commit/1a3df6555a526c9a006dab4e7876eaed37dd2f2c) Thanks [@jxom](https://github.com/jxom)! - Added `porto/remote` entrypoint.

## 0.0.6

### Patch Changes

- [#29](https://github.com/ithacaxyz/porto/pull/29) [`99bf5bf`](https://github.com/ithacaxyz/porto/commit/99bf5bf77a17d11859bece392811fe2314dd04e0) Thanks [@jxom](https://github.com/jxom)! - Added Spend Permissions via `permissions.spend` property on `wallet_authorizeKey` RPC and the `authorizeKey` capability.

  Example:

  ```ts
  const key = await porto.provider.request({
    method: "experimental_authorizeKey",
    params: [
      {
        permissions: {
          spend: [
            {
              limit: 100_000_000n, // 100 USDC
              period: "day",
              token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
            },
          ],
        },
      },
    ],
  });
  ```

- [#29](https://github.com/ithacaxyz/porto/pull/29) [`99bf5bf`](https://github.com/ithacaxyz/porto/commit/99bf5bf77a17d11859bece392811fe2314dd04e0) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Modified `wallet_authorizeKey` and `authorizeKey` capability APIs.

  - Moved `key.expiry` & `key.role` properties to root level:

  ```diff
  {
    address: '0x...',
  + expiry: 1716537600,
    key: {
  -   expiry: 1716537600,
      publicKey: '0x...',
      type: 'p256',
  -   role: 'admin',
    },
  + role: 'admin',
  }
  ```

  - Removed `callScopes` property in favor of `permissions.calls`:

  ```diff
  {
  - callScopes: [
  + permissions: {
  +   calls: [
        {
          signature: 'mint(address,uint256)',
          to: '0x...',
        },
      ],
  + }
  }
  ```

- [`ca849b3`](https://github.com/ithacaxyz/porto/commit/ca849b32caa93617fab397795805b2dec89b6284) Thanks [@jxom](https://github.com/jxom)! - Added support for Dialog Wallets (cross-origin iframes/popup) in Porto via `Implementation.dialog()`.

  - This feature is work-in-progress and currently has no UI.
  - In the future, `Implementation.dialog()` will be the default behavior in Porto to communicate with a Wallet.
  - Currently, the default implementation is `Implementation.local()` – where its behavior is to perform actions locally (ie. "blind sign").
  - In the future, it will be anticipated for App builders to use `Implementation.dialog()` (the default), and for Dialog Wallet builders to use `Implemetation.local()`.
  - Documentation for these patterns will emerge as this feature matures.

  If you would like to check out what the experience looks like currently with no UI:

  ```ts
  import { Porto } from "porto";

  const porto = Porto.create({
    implementation: Implementation.dialog(),
  });
  ```

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

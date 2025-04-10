# porto

## 0.0.20

### Patch Changes

- [`5b7f40d`](https://github.com/ithacaxyz/porto/commit/5b7f40d2fcd345728a2d160f5f58e339fd26b5c2) Thanks [@jxom](https://github.com/jxom)! - Updated to latest EIP-5792 spec.

- [`5b7f40d`](https://github.com/ithacaxyz/porto/commit/5b7f40d2fcd345728a2d160f5f58e339fd26b5c2) Thanks [@jxom](https://github.com/jxom)! - Ensured that the account active chain is synced with Porto consumers.

- Updated dependencies []:
  - wagmi@undefined

## 0.0.19

### Patch Changes

- [`79e1099`](https://github.com/ithacaxyz/porto/commit/79e10993ac164e381c2c1742536e751e16b561d3) Thanks [@jxom](https://github.com/jxom)! - Renamed `Implementation.local` to `Mode.contract`.

  ```diff
  - import { Implementation } from 'porto'
  + import { Mode } from 'porto'

  const porto = Porto.create({
  - implementation: Implementation.local(),
  + mode: Mode.contract(),
  })
  ```

- [`79e1099`](https://github.com/ithacaxyz/porto/commit/79e10993ac164e381c2c1742536e751e16b561d3) Thanks [@jxom](https://github.com/jxom)! - Renamed `implementation` to `mode`. It's cleaner.

  ```diff
  - import { Porto, Implementation } from 'porto'
  + import { Porto, Mode } from 'porto'

  const porto = Porto.create({
  - implementation: Implementation.dialog(),
  + mode: Mode.dialog(),
  })
  ```

- [#84](https://github.com/ithacaxyz/porto/pull/84) [`0f053cc`](https://github.com/ithacaxyz/porto/commit/0f053ccbadb04aea2cee005f239853c4b0d8f49f) Thanks [@jxom](https://github.com/jxom)! - Added new RPC methods:

  - `experimental_getAdmins`: Get admins of an account.
  - `experimental_grantAdmin`: Grant an admin to an account.
  - `experimental_revokeAdmin`: Revoke an admin from an account.

- [#84](https://github.com/ithacaxyz/porto/pull/84) [`0f053cc`](https://github.com/ithacaxyz/porto/commit/0f053ccbadb04aea2cee005f239853c4b0d8f49f) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Renamed `experimental_permissions` to `experimental_getPermissions`.

- [#86](https://github.com/ithacaxyz/porto/pull/86) [`54e0c4b`](https://github.com/ithacaxyz/porto/commit/54e0c4b5929ef98c99390b0b667315e689297266) Thanks [@tmm](https://github.com/tmm)! - Fixed 1Password adding `inert` attribute to `<dialog/>`.

## 0.0.18

### Patch Changes

- [`cbddfab`](https://github.com/ithacaxyz/porto/commit/cbddfab87ea77b70eccf0b787782656665f5c73e) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Updated RP from `exp.porto.sh` to `id.porto.sh`.

- [`cbddfab`](https://github.com/ithacaxyz/porto/commit/cbddfab87ea77b70eccf0b787782656665f5c73e) Thanks [@jxom](https://github.com/jxom)! - Added Safari dialog fallback & misc. tweaks.

## 0.0.17

### Patch Changes

- [#53](https://github.com/ithacaxyz/porto/pull/53) [`77d743e`](https://github.com/ithacaxyz/porto/commit/77d743e8671f5788b295c4180fa56d9fcd00df50) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Renamed `"contract"` to `"address"` on `key.type` on the `grantPermissions` capability & `wallet_grantPermissions` method.

  Example:

  ```diff
  type Request = {
    method: 'experimental_grantPermissions',
    params: [{
      // ...
      key?: {
        publicKey?: `0x${string}`,
  -     type?: 'contract' | 'p256' | 'secp256k1' | 'webauthn-p256',
  +     type?: 'address' | 'p256' | 'secp256k1' | 'webauthn-p256',
      }
    }]
  }
  ```

- [#53](https://github.com/ithacaxyz/porto/pull/53) [`77d743e`](https://github.com/ithacaxyz/porto/commit/77d743e8671f5788b295c4180fa56d9fcd00df50) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `wallet_prepareCreateAccount`. Use `wallet_prepareUpgradeAccount` and `wallet_upgradeAccount` instead.

- [#53](https://github.com/ithacaxyz/porto/pull/53) [`77d743e`](https://github.com/ithacaxyz/porto/commit/77d743e8671f5788b295c4180fa56d9fcd00df50) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Updated to [latest ERC-7836 edits](https://github.com/lukasrosario/ERCs/pull/2/commits/bc63d3ff07ac71c56719ffbfd47194cd986c393c).

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
  ```

## 0.0.16

### Patch Changes

- [`df20f1b`](https://github.com/ithacaxyz/porto/commit/df20f1b68e619904dd7fcffcb9a13b06637cb40a) Thanks [@jxom](https://github.com/jxom)! - Added `Storage.combine`.

- [`3ea75ee`](https://github.com/ithacaxyz/porto/commit/3ea75ee8ba63aaf859112a940b3a4e594aa83169) Thanks [@jxom](https://github.com/jxom)! - Loosened `version` validator on `wallet_sendCalls`.

- [`df20f1b`](https://github.com/ithacaxyz/porto/commit/df20f1b68e619904dd7fcffcb9a13b06637cb40a) Thanks [@jxom](https://github.com/jxom)! - Added default `max-age` to `Storage.cookie`.

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

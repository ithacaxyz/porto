# porto

## 0.2.19

### Patch Changes

- [`e349533`](https://github.com/ithacaxyz/porto/commit/e349533172d27d4786eb598f08f7c1597da77040) Thanks [@jxom](https://github.com/jxom)! - Added `crypto.randomUUID` fallbacks.

## 0.2.18

### Patch Changes

- [`02bf0a8`](https://github.com/ithacaxyz/porto/commit/02bf0a8c88d1fa698490a1d1f96a5967eb026e02) Thanks [@jxom](https://github.com/jxom)! - Tweaked `porto` connector.

## 0.2.17

### Patch Changes

- [`122c653`](https://github.com/ithacaxyz/porto/commit/122c6530758080229e3c594d1bcaba2bc4e5ddca) Thanks [@jxom](https://github.com/jxom)! - Added assertion for `indexedDB`.

## 0.2.16

### Patch Changes

- [`3a45b15`](https://github.com/ithacaxyz/porto/commit/3a45b15d2c2f69b48660913b44a776d4d82774b4) Thanks [@jxom](https://github.com/jxom)! - Removed implicit module declarations in favor of `porto/register` module.

## 0.2.15

### Patch Changes

- [`11b0845`](https://github.com/ithacaxyz/porto/commit/11b084547496e3144cff56a7e056d39a8c1a179f) Thanks [@jxom](https://github.com/jxom)! - Added export to fix inference.

## 0.2.14

### Patch Changes

- [`cb6cc99`](https://github.com/ithacaxyz/porto/commit/cb6cc995f0e56885b4f962a7f02f4824cedb3116) Thanks [@jxom](https://github.com/jxom)! - Added Zod export to `porto/internal`.

## 0.2.13

### Patch Changes

- [`21000cb`](https://github.com/ithacaxyz/porto/commit/21000cbb208abd1eb9810eec136bfa9283510ea7) Thanks [@jxom](https://github.com/jxom)! - Added listener for `ready` on CLI Dialog.

- [#909](https://github.com/ithacaxyz/porto/pull/909) [`6f79c12`](https://github.com/ithacaxyz/porto/commit/6f79c12a5cac3d078ada5a29f75b94a4f388ccc6) Thanks [@jxom](https://github.com/jxom)! - Inferred `Account#source` based on the `sign` parameter.

- [#905](https://github.com/ithacaxyz/porto/pull/905) [`bd9dce2`](https://github.com/ithacaxyz/porto/commit/bd9dce23a18f780aabca10f588f64de3e1d258a6) Thanks [@jxom](https://github.com/jxom)! - Removed trusted origin check for merchant RPCs in favor of verifying `wallet_prepareCalls` responses.

## 0.2.12

### Patch Changes

- [#902](https://github.com/ithacaxyz/porto/pull/902) [`cf8eeba`](https://github.com/ithacaxyz/porto/commit/cf8eebae7295fe28b730fbbe96bc71c5d4928168) Thanks [@jxom](https://github.com/jxom)! - Returned capabilities for all chains by default.

## 0.2.11

### Patch Changes

- [#887](https://github.com/ithacaxyz/porto/pull/887) [`47ef88a`](https://github.com/ithacaxyz/porto/commit/47ef88a4cc88736cec87da58177bedea2b4d0341) Thanks [@hazelnutcloud](https://github.com/hazelnutcloud)! - Added `webAuthn` usage downstream to `Mode.relay`.

- [#889](https://github.com/ithacaxyz/porto/pull/889) [`6f6c3a1`](https://github.com/ithacaxyz/porto/commit/6f6c3a134880b867e398338f3d67b441cc2aaa85) Thanks [@hazelnutcloud](https://github.com/hazelnutcloud)! - Fixed selector check on call permissions.

## 0.2.10

### Patch Changes

- [`cfcc90f`](https://github.com/ithacaxyz/porto/commit/cfcc90fed9f8dbdb56d8da1d7ecc3a90a9fd0066) Thanks [@jxom](https://github.com/jxom)! - Fixed issue where `chain` parameter was not being propagated in `RelayActions.{upgradeAccount}`

## 0.2.9

### Patch Changes

- [`698ab27`](https://github.com/ithacaxyz/porto/commit/698ab27f749c4fe80694d23c820a8a14d3d15641) Thanks [@jxom](https://github.com/jxom)! - Fixed issue where `chain` parameter was not being propagated in `RelayActions.{prepareCalls,sendCalls}`

## 0.2.8

### Patch Changes

- [`f102bf8`](https://github.com/ithacaxyz/porto/commit/f102bf8c87471a0e7ee3d60e7acb2a3233a33471) Thanks [@jxom](https://github.com/jxom)! - Removed dialog open/close animations.

## 0.2.7

### Patch Changes

- [#871](https://github.com/ithacaxyz/porto/pull/871) [`c84f63d`](https://github.com/ithacaxyz/porto/commit/c84f63d1f733ede09570fa4151ea479ef64e055f) Thanks [@o-az](https://github.com/o-az)! - Excluded `clipboard-write` permission from `allow` in `iframe` when browser is Firefox

## 0.2.6

### Patch Changes

- [`1387137`](https://github.com/ithacaxyz/porto/commit/13871375228e18640202e659f073786be09966c3) Thanks [@jxom](https://github.com/jxom)! - Disabled merchant hostname check for testnets.

- [`260e36c`](https://github.com/ithacaxyz/porto/commit/260e36c51ae19b74709057edf5876ba8b80f0998) Thanks [@jxom](https://github.com/jxom)! - Fixed serialization of CLI requests.

- [#862](https://github.com/ithacaxyz/porto/pull/862) [`19190ee`](https://github.com/ithacaxyz/porto/commit/19190eedcff54b9dc5aae7396d08082d003742cd) Thanks [@tmm](https://github.com/tmm)! - Added response capabilities support to Wagmi connector.

## 0.2.5

### Patch Changes

- [#853](https://github.com/ithacaxyz/porto/pull/853) [`7ab683a`](https://github.com/ithacaxyz/porto/commit/7ab683ab956a621fe1d62a4e20493f4a16a80c7e) Thanks [@jxom](https://github.com/jxom)! - Made `key` optional on `prepareCalls`, `sendCalls`, and `signCalls` actions.

## 0.2.4

### Patch Changes

- [#843](https://github.com/ithacaxyz/porto/pull/843) [`6b04676`](https://github.com/ithacaxyz/porto/commit/6b046766a062beb966c4fd5407ceb18573cc7c62) Thanks [@jxom](https://github.com/jxom)! - Migrated to `zod/mini`. Cut bundle size by 30%.

## 0.2.3

### Patch Changes

- [#848](https://github.com/ithacaxyz/porto/pull/848) [`8ecff2a`](https://github.com/ithacaxyz/porto/commit/8ecff2ab72eada9aa7cdbd5d6ff6c0c58caccafc) Thanks [@jxom](https://github.com/jxom)! - Deferred pre-call management to the Relay instead of the SDK.

## 0.2.2

### Patch Changes

- [`0853d71`](https://github.com/ithacaxyz/porto/commit/0853d71c67dc905ee2d543ec4e274adb1beb2551) Thanks [@jxom](https://github.com/jxom)! - Removed console log.

## 0.2.1

### Patch Changes

- [`1f7e601`](https://github.com/ithacaxyz/porto/commit/1f7e601c738940242c0c71cb3f0ff867d4f13987) Thanks [@jxom](https://github.com/jxom)! - Fixed `wagmi` Connector module imports.

## 0.2.0

### Minor Changes

- [#844](https://github.com/ithacaxyz/porto/pull/844) [`df2bdd8`](https://github.com/ithacaxyz/porto/commit/df2bdd84a37d3a8b03b99679108b902c2ca64bbc) Thanks [@jxom](https://github.com/jxom)! - **Breaking:**

  - Renamed `merchantRpcUrl` to `merchantUrl`.
  - Removed automatic `merchantUrl` inference to enhance clarity and avoid astonishment. If you have set up a Merchant API route via `Route.merchant`, you will need to explicitly pass the URL to `Porto.create(){:js}` or the `porto` Connector.

  See `config.ts` below (that uses the `api/worker.ts` server):

  ### `config.ts`

  ```diff
  const porto = Porto.create({
  + merchantUrl: '/porto/merchant'
  })
  ```

  ### `api/worker.ts`

  ```ts
  import { env } from "cloudflare:workers";
  import { Router, Route } from "porto/server";

  export default Router({ basePath: "/porto" }).route(
    "/merchant",
    Route.merchant({
      address: env.MERCHANT_ADDRESS,
      key: env.MERCHANT_PRIVATE_KEY,
    }),
  ) satisfies ExportedHandler<Env>;
  ```

## 0.1.0

### Minor Changes

- [#817](https://github.com/ithacaxyz/porto/pull/817) [`68cd125`](https://github.com/ithacaxyz/porto/commit/68cd125638dddc88a1fd39ee79daedfbd3d6d054) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Renamed `MerchantRpc.requestListener` to `Route.merchant`. [See docs](https://porto.sh/sdk/api/route/merchant).

- [#817](https://github.com/ithacaxyz/porto/pull/817) [`68cd125`](https://github.com/ithacaxyz/porto/commit/68cd125638dddc88a1fd39ee79daedfbd3d6d054) Thanks [@jxom](https://github.com/jxom)! - Added `Router` + `Route` modules to `porto/server`. [See docs](https://porto.sh/sdk/api/router)

  <img width="500px" alt="ray-so-export (15)" src="https://github.com/user-attachments/assets/4fc5bc98-8922-4a03-afe0-158a23697b0c" />

- [#817](https://github.com/ithacaxyz/porto/pull/817) [`68cd125`](https://github.com/ithacaxyz/porto/commit/68cd125638dddc88a1fd39ee79daedfbd3d6d054) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** The `feeLimit` property on the `wallet_grantPermissions` request has been repurposed to `feeToken`, and is now required.

  Instead of `feeLimit`'s currency automatically being matched with a fee token, you must now manually specify the fee token. This fee token will be used for calls that use this permission. In the future, we may have automatic inference of fee tokens for permissioned calls.

  ```diff
  provider.request({
    method: 'wallet_grantPermissions',
    params: [{
      expiry: 1715328000,
  -   feeLimit: {
  -     currency: 'USD',
  -     value: '1',
  -   },
  +   feeToken: {
  +     limit: '1',
  +     symbol: 'USDC',
  +   },
      permissions: { ... }
    }],
  })
  ```

## 0.0.93

### Patch Changes

- [#837](https://github.com/ithacaxyz/porto/pull/837) [`fdcd88b`](https://github.com/ithacaxyz/porto/commit/fdcd88b19e92a8cd9804a092f6f0984a1c61e88e) Thanks [@jxom](https://github.com/jxom)! - Added dynamic imports for Porto modules in `porto` Connector. Reduces static `porto` bundle size by 13x.

## 0.0.92

### Patch Changes

- [`3fbafa7`](https://github.com/ithacaxyz/porto/commit/3fbafa7e006c0203079a899e28d522b77ee4c3aa) Thanks [@jxom](https://github.com/jxom)! - Asserted that `key.id` is an address.

## 0.0.91

### Patch Changes

- [#831](https://github.com/ithacaxyz/porto/pull/831) [`5df2f5d`](https://github.com/ithacaxyz/porto/commit/5df2f5d8cf6d61a0c00bd546778047b96082f6f6) Thanks [@o-az](https://github.com/o-az)! - Prefixed `crypto.randomUUID()` with `globalThis` to make React Native friendly

## 0.0.90

### Patch Changes

- [`418bcaf`](https://github.com/ithacaxyz/porto/commit/418bcafd28b6e887690ebf57e440b82dd220e8a9) Thanks [@jxom](https://github.com/jxom)! - Fixed hostname check.

## 0.0.89

### Patch Changes

- [#825](https://github.com/ithacaxyz/porto/pull/825) [`4453819`](https://github.com/ithacaxyz/porto/commit/44538195ee25c4c87473246d44753e4e8f139526) Thanks [@o-az](https://github.com/o-az)! - Forwarded `webAuthn` adapters into signing paths for `Mode.Relay`.
  This prevents WebAuthn signing on React Native from defaulting to `window.navigator.credentials` when platform is `android` or `ios`.

- [#827](https://github.com/ithacaxyz/porto/pull/827) [`55cb72a`](https://github.com/ithacaxyz/porto/commit/55cb72a1b45d1907d7fd8e30147853768200b7eb) Thanks [@jxom](https://github.com/jxom)! - Added IntersectionObserver v2.

## 0.0.88

### Patch Changes

- [`a5929c6`](https://github.com/ithacaxyz/porto/commit/a5929c6a27f987ce022aa9db848e2a4ddf5428d4) Thanks [@jxom](https://github.com/jxom)! - Removed `open` dependency.

## 0.0.87

### Patch Changes

- [`81db062`](https://github.com/ithacaxyz/porto/commit/81db062e543c3d7744c23112b8978ac9541d025f) Thanks [@jxom](https://github.com/jxom)! - Updated trusted hosts.

## 0.0.86

### Patch Changes

- [`9fa05a6`](https://github.com/ithacaxyz/porto/commit/9fa05a6a2ee12e68d61f3979d28d2fc7b981c823) Thanks [@jxom](https://github.com/jxom)! - Added ability to pass EIP-6963 info to `Porto.create`.

## 0.0.85

### Patch Changes

- [#801](https://github.com/ithacaxyz/porto/pull/801) [`dc263bb`](https://github.com/ithacaxyz/porto/commit/dc263bb0fba5375c711e6e0574d36d8460485ccf) Thanks [@MagRelo](https://github.com/MagRelo)! - Updated trusted hosts

- [#775](https://github.com/ithacaxyz/porto/pull/775) [`3f90fec`](https://github.com/ithacaxyz/porto/commit/3f90fec7e530c9b3c9587accfc83068da703d3d1) Thanks [@jxom](https://github.com/jxom)! - Added `RelayActions.signCalls`.

- [#775](https://github.com/ithacaxyz/porto/pull/775) [`3f90fec`](https://github.com/ithacaxyz/porto/commit/3f90fec7e530c9b3c9587accfc83068da703d3d1) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Added required `address` parameter to `Key.sign` to support replay-safe signing.

- [#775](https://github.com/ithacaxyz/porto/pull/775) [`3f90fec`](https://github.com/ithacaxyz/porto/commit/3f90fec7e530c9b3c9587accfc83068da703d3d1) Thanks [@jxom](https://github.com/jxom)! - Removed `wallet_updateAccount`. All account upgrades are orchestrated internally by the Relay.

## 0.0.84

### Patch Changes

- [`33ec682`](https://github.com/ithacaxyz/porto/commit/33ec68294da58a5d909b936775119eb4cd6d8e15) Thanks [@jxom](https://github.com/jxom)! - Fixed issue where persisted current chain may not exist in app config.

## 0.0.83

### Patch Changes

- [#791](https://github.com/ithacaxyz/porto/pull/791) [`5a43dba`](https://github.com/ithacaxyz/porto/commit/5a43dba6c2e84611cd521b4f9dc4421820d1af3c) Thanks [@jxom](https://github.com/jxom)! - Added functionality to fetch `wallet_getCapabilities` eagerly when the provider is injected, and cache the response.

## 0.0.82

### Patch Changes

- [`acc1329`](https://github.com/ithacaxyz/porto/commit/acc132903a368f7f2b03b1cdcee7a840a1bb8a43) Thanks [@jxom](https://github.com/jxom)! - Added support for legacy `atomicBatch` capability.

## 0.0.81

### Patch Changes

- [#785](https://github.com/ithacaxyz/porto/pull/785) [`8648c5d`](https://github.com/ithacaxyz/porto/commit/8648c5dca986109620049cc93fb06d0f2dc91494) Thanks [@jxom](https://github.com/jxom)! - Added support for `merchantRpcUrl` on `eth_sendTransaction`

## 0.0.80

### Patch Changes

- [#767](https://github.com/ithacaxyz/porto/pull/767) [`4b1008a`](https://github.com/ithacaxyz/porto/commit/4b1008afaf4905409ff9c6861a98ba90761b6048) Thanks [@tmm](https://github.com/tmm)! - Switched requests from `rpc.ithaca.xyz` to `rpc.porto.sh`.

## 0.0.79

### Patch Changes

- [`e24b58b`](https://github.com/ithacaxyz/porto/commit/e24b58b9fefae38674c95d60ed706d7eea97e5e7) Thanks [@jxom](https://github.com/jxom)! - Fixed `undefined` capabilities issue.

## 0.0.78

### Patch Changes

- [`a9acd3f`](https://github.com/ithacaxyz/porto/commit/a9acd3f5b5e930405511e6864e67dcf0e731b153) Thanks [@jxom](https://github.com/jxom)! - Laxed `eth_chainId` and `eth_requestAccounts` schema.

- [#757](https://github.com/ithacaxyz/porto/pull/757) [`ef63343`](https://github.com/ithacaxyz/porto/commit/ef6334304b2e79f3f9455e3761f183082a85befe) Thanks [@jxom](https://github.com/jxom)! - Removed caching from `eth_requestAccounts`.

## 0.0.77

### Patch Changes

- [#749](https://github.com/ithacaxyz/porto/pull/749) [`342284b`](https://github.com/ithacaxyz/porto/commit/342284bc253da73b5f8e7746878affcf8b8a93af) Thanks [@bpierre](https://github.com/bpierre)! - Switched back to `<dialog>` for `iframe` renderer.

## 0.0.76

### Patch Changes

- [#744](https://github.com/ithacaxyz/porto/pull/744) [`073d0da`](https://github.com/ithacaxyz/porto/commit/073d0daec4bcefd5eb9af0b26f13e5d3d7979426) Thanks [@jxom](https://github.com/jxom)! - Ensured that chains are rehydrated on state initialization.

## 0.0.75

### Patch Changes

- [`9f28daf`](https://github.com/ithacaxyz/porto/commit/9f28daf21df4bfc32b408f89f66a7d644f6be487) Thanks [@jxom](https://github.com/jxom)! - Fixed `wallet_switchEthereumChain` in `popup` mode.

- [#741](https://github.com/ithacaxyz/porto/pull/741) [`412dc29`](https://github.com/ithacaxyz/porto/commit/412dc2998583f9636b794bdaf00941ce3e70a2f5) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `addFaucetFunds` from `Mode`.

- [`33ce384`](https://github.com/ithacaxyz/porto/commit/33ce3847b887c9b671ea31c37720284b088a600e) Thanks [@jxom](https://github.com/jxom)! - Fixed issue where `porto` Connector would not switch to target chain on reconnect.

## 0.0.74

### Patch Changes

- [#711](https://github.com/ithacaxyz/porto/pull/711) [`048f1af`](https://github.com/ithacaxyz/porto/commit/048f1af7f33fad65f9ae672537a27b843694e55d) Thanks [@o-az](https://github.com/o-az)! - Added support for Relay's `wallet_addFaucetFunds`.

- [`2822c03`](https://github.com/ithacaxyz/porto/commit/2822c034a137d4a935dd1996948eb7e18c134415) Thanks [@jxom](https://github.com/jxom)! - Tweaked error messaging for not found transaction hashes.

- [#731](https://github.com/ithacaxyz/porto/pull/731) [`4de8e3b`](https://github.com/ithacaxyz/porto/commit/4de8e3bc443e4a673972e0ed77ace6f79a1d285a) Thanks [@jxom](https://github.com/jxom)! - Passed through `chainIds` to `wallet_connect` on the `porto` Connector.

## 0.0.73

### Patch Changes

- [`63d8966`](https://github.com/ithacaxyz/porto/commit/63d8966380ca5bbde31ef7db3a1a180bbf54cf99) Thanks [@jxom](https://github.com/jxom)! - Added `mainnet` and `celo` chains.

## 0.0.72

### Patch Changes

- [`156b02f`](https://github.com/ithacaxyz/porto/commit/156b02f63bbe2c01be341d7cb529d0abf587b2d1) Thanks [@jxom](https://github.com/jxom)! - Loosened `eth_accounts` params.

## 0.0.71

### Patch Changes

- [#719](https://github.com/ithacaxyz/porto/pull/719) [`471d7c8`](https://github.com/ithacaxyz/porto/commit/471d7c8360280e9efba27be4517297d1b47a5774) Thanks [@jxom](https://github.com/jxom)! - Added support for `chainIds` on `wallet_connect`

- [#716](https://github.com/ithacaxyz/porto/pull/716) [`61805bf`](https://github.com/ithacaxyz/porto/commit/61805bfb49a2a027a8b5f16e1ebb39e639a759a8) Thanks [@tmm](https://github.com/tmm)! - **Breaking:** Defaulted Relay RPC URLs to `rpc.ithaca.xyz` (production) instead of `stg-rpc.ithaca.xyz` (staging).

  > [!WARNING]
  > This release will require you to recreate your testnet account with Porto. We've made fundamental improvements that ensure smoother upgrades in the future.

## 0.0.70

### Patch Changes

- [#710](https://github.com/ithacaxyz/porto/pull/710) [`f72e541`](https://github.com/ithacaxyz/porto/commit/f72e541d68f36602c06dac1b227102fd2298d809) Thanks [@jxom](https://github.com/jxom)! - Added support for more chains.

## 0.0.69

### Patch Changes

- [#706](https://github.com/ithacaxyz/porto/pull/706) [`954d291`](https://github.com/ithacaxyz/porto/commit/954d291c5d8fea6d58a19474cfe5334a9919d1b3) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Renamed "RPC Server"/"Server" terminology to "Relay".

  ```diff
  import {
    Mode,
  - ServerActions,
  - ServerClient,
  + RelayActions,
  + RelayClient,
  } from 'porto'

  - Mode.rpcServer(...)
  + Mode.relay(...)
  ```

## 0.0.68

### Patch Changes

- [`bfe750f`](https://github.com/ithacaxyz/porto/commit/bfe750f487251084fecdba05c89837a20452eade) Thanks [@tmm](https://github.com/tmm)! - Bumped extension defaults.

- [#694](https://github.com/ithacaxyz/porto/pull/694) [`6a19110`](https://github.com/ithacaxyz/porto/commit/6a19110ada4abe8b5fec48340b93c10c1260d89b) Thanks [@o-az](https://github.com/o-az)! - Default Chrome extension to production environment

- [`a4c2422`](https://github.com/ithacaxyz/porto/commit/a4c2422ef01072a40efe8c88cf7d9750e0f8aca4) Thanks [@tmm](https://github.com/tmm)! - Changed extension default fee token.

## 0.0.67

### Patch Changes

- [`4b5b188`](https://github.com/ithacaxyz/porto/commit/4b5b18876a4c9085086fa65beb29906947da6630) Thanks [@tmm](https://github.com/tmm)! - Added chains to `unstable_create`.

## 0.0.66

### Patch Changes

- [#678](https://github.com/ithacaxyz/porto/pull/678) [`fb24b62`](https://github.com/ithacaxyz/porto/commit/fb24b62c3ab62baf38f0e36a82580550d7ee4712) Thanks [@tmm](https://github.com/tmm)! - **Breaking:** Split RPC calls into relay and public RPC URLs. Calls to methods prefixed with `wallet_` and `account_` are sent to the transport defined by `relay` while other methods are sent to RPCs defined by `chains` and `transports`. There is a new optional `relay` property for `Porto.create` (for most users, you will not need to set this on your own and instead just use the defaults):

  ```ts
  import { Porto } from "porto";
  import { http } from "viem";

  const porto = Porto.create({ relay: http("https://rpc.porto.sh") });
  ```

  **Note:** `relay` supports multiple chains via `chainId`. If using your own relay implementation, make sure you take this into consideration.

- [#676](https://github.com/ithacaxyz/porto/pull/676) [`6108343`](https://github.com/ithacaxyz/porto/commit/61083437b10ddc0a5078476586c0e83ee85cce8f) Thanks [@tmm](https://github.com/tmm)! - Removed dev chains: `portoDevParos`, `portoDevLeros`, and `portoDevTinos`.

## 0.0.65

### Patch Changes

- [#673](https://github.com/ithacaxyz/porto/pull/673) [`239c294`](https://github.com/ithacaxyz/porto/commit/239c29490de70834bd25bca45f2791c2943bef15) Thanks [@tmm](https://github.com/tmm)! - **Breaking:** Removed `Mode.contract`. If you still need this, you can fork the [most recent implementation](https://github.com/ithacaxyz/porto/blob/porto%400.0.64/src/core/internal/modes/contract.ts).

## 0.0.64

### Patch Changes

- [#660](https://github.com/ithacaxyz/porto/pull/660) [`5f78ace`](https://github.com/ithacaxyz/porto/commit/5f78ace6b6e700c43329a5a3f70633de0fc9d7f6) Thanks [@bpierre](https://github.com/bpierre)! - Deprecated the `size` config option from `Dialog.popup()`.

- [#603](https://github.com/ithacaxyz/porto/pull/603) [`4e7aa3a`](https://github.com/ithacaxyz/porto/commit/4e7aa3a8873fc2919871adf1e2e1c0913c91b8f7) Thanks [@jxom](https://github.com/jxom)! - Added `wallet_switchEthereumChain`.

- [#603](https://github.com/ithacaxyz/porto/pull/603) [`4e7aa3a`](https://github.com/ithacaxyz/porto/commit/4e7aa3a8873fc2919871adf1e2e1c0913c91b8f7) Thanks [@jxom](https://github.com/jxom)! - Migrated to Relay v17.

- [#603](https://github.com/ithacaxyz/porto/pull/603) [`4e7aa3a`](https://github.com/ithacaxyz/porto/commit/4e7aa3a8873fc2919871adf1e2e1c0913c91b8f7) Thanks [@jxom](https://github.com/jxom)! - Added `chainId` to `Key`.

## 0.0.63

### Patch Changes

- [`022b5bc`](https://github.com/ithacaxyz/porto/commit/022b5bc67211f20a3b76d28cac57ab682db7da95) Thanks [@jxom](https://github.com/jxom)! - Added `webAuthn` config option to `Mode.relay`.

## 0.0.62

### Patch Changes

- [`7cee364`](https://github.com/ithacaxyz/porto/commit/7cee3643f4388939eb606a03678381722c24de02) Thanks [@jxom](https://github.com/jxom)! - Fixed `authUrl.logout` invocation.

## 0.0.61

### Patch Changes

- [#655](https://github.com/ithacaxyz/porto/pull/655) [`4f36751`](https://github.com/ithacaxyz/porto/commit/4f3675127cc83532054dea922f343d2fdc94e889) Thanks [@jxom](https://github.com/jxom)! - Fixed `signInWithEthereum` response capability not populating.

- [#650](https://github.com/ithacaxyz/porto/pull/650) [`b54742f`](https://github.com/ithacaxyz/porto/commit/b54742fcfac2ad3ee55e81193dae7253547a1970) Thanks [@DonGambas](https://github.com/DonGambas)! - Fixed access to `location.hostname` for non-browser environments.

## 0.0.60

### Patch Changes

- [#647](https://github.com/ithacaxyz/porto/pull/647) [`a7c9288`](https://github.com/ithacaxyz/porto/commit/a7c9288964edcb6b3e3795298ab49a33c04f7727) Thanks [@bpierre](https://github.com/bpierre)! - Fixed an issue where the Porto dialog rounded corners were opaque in certain cases.

- [#568](https://github.com/ithacaxyz/porto/pull/568) [`a33d5fc`](https://github.com/ithacaxyz/porto/commit/a33d5fc1c42ff2975cb0b85191db8b6a8b0e860b) Thanks [@frolic](https://github.com/frolic)! - Added additional mechanism to detect when popup is closed.

## 0.0.59

### Patch Changes

- [#631](https://github.com/ithacaxyz/porto/pull/631) [`0e03453`](https://github.com/ithacaxyz/porto/commit/0e0345374c02399510c4211d7878e17ed0992935) Thanks [@frolic](https://github.com/frolic)! - Added `origin` to `onDialogRequest`.

- [#633](https://github.com/ithacaxyz/porto/pull/633) [`cf4ebb2`](https://github.com/ithacaxyz/porto/commit/cf4ebb29b4f486eda015535127dd2cbfbe7e7832) Thanks [@bpierre](https://github.com/bpierre)! - Added new values to the theme:

  - Generic radiuses: `radiusSmall`, `radiusMedium` and `radiusLarge`.
  - A `basePlane` surface (used as a base surface in fullscreen mode).
  - A `negativeSecondary` surface (e.g. cancel buttons).
  - A `strong` surface (alternative to primary buttons).
  - `negativeBorder` and `positiveBorder` (to customize the outline of the corresponding buttons).

- [#640](https://github.com/ithacaxyz/porto/pull/640) [`21525bb`](https://github.com/ithacaxyz/porto/commit/21525bb28966523c95bd52af5858db3d4f25720e) Thanks [@bpierre](https://github.com/bpierre)! - Added a new surface color to the theme: `baseAltBackground`.

- [#635](https://github.com/ithacaxyz/porto/pull/635) [`4d5dcc6`](https://github.com/ithacaxyz/porto/commit/4d5dcc66de54691ff14ae5e43e1dd77746df2f4c) Thanks [@jxom](https://github.com/jxom)! - Added `token` property to `signInWithEthereum` response capability.

## 0.0.58

### Patch Changes

- [#625](https://github.com/ithacaxyz/porto/pull/625) [`ea729bd`](https://github.com/ithacaxyz/porto/commit/ea729bd4126c5685b0291c48b28b2f66052fd641) Thanks [@jxom](https://github.com/jxom)! - Modified SIWE handlers to be compatible with `better-auth`.

## 0.0.57

### Patch Changes

- [`5e38e1c`](https://github.com/ithacaxyz/porto/commit/5e38e1c9c38948755df41370b589e8aa59aa74e6) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: Modified SIWE `/nonce` endpoint to use a `POST` method instead of `GET`.

  ```diff
  - app.get('/siwe/nonce', ...)
  + app.post('/siwe/nonce', ...)
  ```

## 0.0.56

### Patch Changes

- [#620](https://github.com/ithacaxyz/porto/pull/620) [`b061c6b`](https://github.com/ithacaxyz/porto/commit/b061c6b89bf8700f71c3983a43bcb5497bcac733) Thanks [@jxom](https://github.com/jxom)! - Added ability to individually pass authentication endpoints to `signInWithEthereum.authUrl`, instead
  of defining the group path (e.g. `/auth/*`).

  ```diff
  connect({
    signInWithEthereum: {
  -   authUrl: '/auth'
  +   authUrl: {
  +     logout: '/logout',
  +     nonce: '/auth/nonce',
  +     verify: '/auth',
  +   },
    },
  })
  ```

- [#620](https://github.com/ithacaxyz/porto/pull/620) [`b061c6b`](https://github.com/ithacaxyz/porto/commit/b061c6b89bf8700f71c3983a43bcb5497bcac733) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Modified SIWE `authUrl` to verify & authenticate against `${path}/verify` instead of `${path}`.

  ```diff
  - server.post('/siwe', ...
  + server.post('/siwe/verify', ...
  ```

## 0.0.55

### Patch Changes

- [`c513774`](https://github.com/ithacaxyz/porto/commit/c5137746a319e791efe073b54f164698b6e8ac2f) Thanks [@jxom](https://github.com/jxom)! - Added [Theming](https://porto.sh/sdk/guides/theming) via a `theme` option on `Mode.dialog`.

## 0.0.54

### Patch Changes

- [#592](https://github.com/ithacaxyz/porto/pull/592) [`3525888`](https://github.com/ithacaxyz/porto/commit/35258885c0412a47cb714edc0b67c70fc88c0142) Thanks [@jxom](https://github.com/jxom)! - Added `key` as a parameter to `Mode#loadAccounts`.

- [#592](https://github.com/ithacaxyz/porto/pull/592) [`3525888`](https://github.com/ithacaxyz/porto/commit/35258885c0412a47cb714edc0b67c70fc88c0142) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `credentialId` from `Mode#loadAccounts`. Use `key` instead.

  ```diff
  const mode = Mode.from({
    actions: {
      loadAccounts(parameters) {
        const {
          address,
  -       credentialId
  +       key: { credentialId }
        } = parameters

        // ...
      }
    },
    ...
  })
  ```

- [#594](https://github.com/ithacaxyz/porto/pull/594) [`73f4ed7`](https://github.com/ithacaxyz/porto/commit/73f4ed7bceeb7f7a95a0df46cc52d6fec330767b) Thanks [@jxom](https://github.com/jxom)! - Fixed parsing of server key of an \`address\` type.

- [#565](https://github.com/ithacaxyz/porto/pull/565) [`9ea4d43`](https://github.com/ithacaxyz/porto/commit/9ea4d43cb6de16073d1f8c177575b830fc935992) Thanks [@frolic](https://github.com/frolic)! - Added `size` property to `Dialog` renderer instances.

## 0.0.53

### Patch Changes

- [#587](https://github.com/ithacaxyz/porto/pull/587) [`6785db3`](https://github.com/ithacaxyz/porto/commit/6785db3bac2a25f93f5b94d0fe517f8f40cc3a51) Thanks [@jxom](https://github.com/jxom)! - Removed extraneous background RPC requests that occurred outside of the dialog.

## 0.0.52

### Patch Changes

- [#585](https://github.com/ithacaxyz/porto/pull/585) [`cd56a7b`](https://github.com/ithacaxyz/porto/commit/cd56a7b4c622ef421ebe2d26ac606867d9d85827) Thanks [@jxom](https://github.com/jxom)! - Fixed decoding of `wallet_prepareCalls` response in `Mode.dialog`.

- [#583](https://github.com/ithacaxyz/porto/pull/583) [`fc4b9df`](https://github.com/ithacaxyz/porto/commit/fc4b9dfbcf7ec18808143095155a8fe1534f1b76) Thanks [@o-az](https://github.com/o-az)! - Made CLI terminate by dynamically importing commands.

## 0.0.51

### Patch Changes

- [`1e46693`](https://github.com/ithacaxyz/porto/commit/1e46693f43bde13769bb23d9db6ce6dca3419d1a) Thanks [@jxom](https://github.com/jxom)! - Tweaked extension to fall back to popup if host site blocks iframe due to CSP.

## 0.0.50

### Patch Changes

- [#575](https://github.com/ithacaxyz/porto/pull/575) [`e037d86`](https://github.com/ithacaxyz/porto/commit/e037d8653f093ce3d47b14bde3e7a47190fee791) Thanks [@jxom](https://github.com/jxom)! - Fixed issue where `eth_sendTransaction` response would be the bundle identifier, instead of the transaction hash.

- [#574](https://github.com/ithacaxyz/porto/pull/574) [`8c988ea`](https://github.com/ithacaxyz/porto/commit/8c988ea5b0569dc220b2b72c8377e18c8c2d29ae) Thanks [@jxom](https://github.com/jxom)! - Fixed an issue where headless methods on the `Dialog.popup` renderer would invoke
  a popup, instead of calling the method in the background.

## 0.0.49

### Patch Changes

- [`2202f8e`](https://github.com/ithacaxyz/porto/commit/2202f8e3f122f42d2be713280ffbe720f5394a4b) Thanks [@jxom](https://github.com/jxom)! - Added missing `credentials: 'include'` to SIWE.

## 0.0.48

### Patch Changes

- [`99f0857`](https://github.com/ithacaxyz/porto/commit/99f085712c574ffb5ba080b4c8d3d4017b9f5c2f) Thanks [@jxom](https://github.com/jxom)! - Added `Porto.unstable_create` and `unstable_porto` Wagmi connector.

## 0.0.47

### Patch Changes

- [`a8daa28`](https://github.com/ithacaxyz/porto/commit/a8daa2826a3e467e710e0f8938de85756aa4c05b) Thanks [@jxom](https://github.com/jxom)! - Optimized call permissions introspection.

- [#563](https://github.com/ithacaxyz/porto/pull/563) [`3cf0a7e`](https://github.com/ithacaxyz/porto/commit/3cf0a7e27a46206569524ba2f73d637d53e81f6c) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed implicit fee limits (defaulting to 1 USD of the fee token) when granting permissions.

  A new `feeLimit` property has been added on `wallet_grantPermissions` to assign fee limits. This converts to a spend permission that will be used to pay for fees (for permissioned calls) in the user's selected fee token (e.g. USDC).

  ```ts
  provider.request({
    method: "wallet_grantPermissions",
    params: [
      {
        expiry: 1715328000,
        // Assign a spend permission of $5 USD of the fee token.
        feeLimit: {
          currency: "USD",
          value: "5",
        },
        permissions: {
          calls: [{ signature: "mint()" }],
        },
      },
    ],
  });
  ```

- [#563](https://github.com/ithacaxyz/porto/pull/563) [`3cf0a7e`](https://github.com/ithacaxyz/porto/commit/3cf0a7e27a46206569524ba2f73d637d53e81f6c) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `permissionsFeeLimit` on `Mode.relay` in favor of:

  - `feeLimit` on the `wallet_grantPermissions` request
  - `feeLimit` on the `grantPermissions` capability

- [`4b65a65`](https://github.com/ithacaxyz/porto/commit/4b65a65d32790a0dd18e411d6a6df5c9274b1411) Thanks [@jxom](https://github.com/jxom)! - Fixed issue where a cached `chainId`s could become stale if a consumer omitted the target
  chain from the `chains` configuration.

## 0.0.46

### Patch Changes

- [#552](https://github.com/ithacaxyz/porto/pull/552) [`c3a56a2`](https://github.com/ithacaxyz/porto/commit/c3a56a2b79dd819f6218fd331927825eec3b5036) Thanks [@jxom](https://github.com/jxom)! - Migrated from TypeBox to `effect/schema` for schema validation.

- [#547](https://github.com/ithacaxyz/porto/pull/547) [`585be54`](https://github.com/ithacaxyz/porto/commit/585be5473e39e7110b965427ece28d218e1c8050) Thanks [@o-az](https://github.com/o-az)! - added `useAddFunds` porto/wagmi hook

## 0.0.45

### Patch Changes

- [`4b93cc8`](https://github.com/ithacaxyz/porto/commit/4b93cc81c5b2c4b21fa4ab836e2f332d2a808c49) Thanks [@jxom](https://github.com/jxom)! - Fixed `wallet_verifySignature` return type.

## 0.0.44

### Patch Changes

- [`f5a66e7`](https://github.com/ithacaxyz/porto/commit/f5a66e7e2d6ba47c4006120c571cb4a129f25e90) Thanks [@jxom](https://github.com/jxom)! - Fixed incompatible structured clone values.

## 0.0.43

### Patch Changes

- [#545](https://github.com/ithacaxyz/porto/pull/545) [`cc70616`](https://github.com/ithacaxyz/porto/commit/cc706167b33f7590ff113394e6e76ca232a87d57) Thanks [@jxom](https://github.com/jxom)! - Added `typedData` to `wallet_prepareCalls` return type.

- [`fdb6a58`](https://github.com/ithacaxyz/porto/commit/fdb6a583fda53c672311bbea3cba655aa112808a) Thanks [@jxom](https://github.com/jxom)! - Added `prepareCalls` and `sendPreparedCalls` to `WalletActions`.

## 0.0.42

### Patch Changes

- [#539](https://github.com/ithacaxyz/porto/pull/539) [`fa0dfb9`](https://github.com/ithacaxyz/porto/commit/fa0dfb98c00540930a298dac175cfbaeebea3ac1) Thanks [@o-az](https://github.com/o-az)! - Fixed SIWE auth url resolution.

## 0.0.41

### Patch Changes

- [#536](https://github.com/ithacaxyz/porto/pull/536) [`b0c33c0`](https://github.com/ithacaxyz/porto/commit/b0c33c0cc6fa30a40805dfdcf5ab36a2954b093f) Thanks [@jxom](https://github.com/jxom)! - Added `authUrl` property to `signInWithEthereum` capability.

- [`cdba3ca`](https://github.com/ithacaxyz/porto/commit/cdba3cae0ae45c0efdc4ef394750e11879e8031b) Thanks [@jxom](https://github.com/jxom)! - Added better error message.

## 0.0.40

### Patch Changes

- [`331bd67`](https://github.com/ithacaxyz/porto/commit/331bd6795139370823bee85975adbb797794c29b) Thanks [@jxom](https://github.com/jxom)! - Made `chainId` on `signInWithEthereum` capability optional.

## 0.0.39

### Patch Changes

- [#524](https://github.com/ithacaxyz/porto/pull/524) [`b2b7edc`](https://github.com/ithacaxyz/porto/commit/b2b7edc3660d2944699d3250119954c9b14038a0) Thanks [@jxom](https://github.com/jxom)! - **Breaking(`porto/wagmi`):** Tweaked return type of `Hooks.useConnect` & `Actions.connect` to match the return type of `wallet_connect`.

## 0.0.38

### Patch Changes

- [`57cc033`](https://github.com/ithacaxyz/porto/commit/57cc0335d3ee87cf77b28356ec70870e7a20edff) Thanks [@jxom](https://github.com/jxom)! - Fixed `@sinclair/typebox` imports.

## 0.0.37

### Patch Changes

- [#519](https://github.com/ithacaxyz/porto/pull/519) [`2fcca60`](https://github.com/ithacaxyz/porto/commit/2fcca6047f5b7b7b4aa69e8de64e50fae51ac15d) Thanks [@jxom](https://github.com/jxom)! - Exported `MerchantRpc.requestListener` for Node.js-based APIs

- [`df9583e`](https://github.com/ithacaxyz/porto/commit/df9583e5caf05d34ccb6c2722160df1c8f4394f5) Thanks [@jxom](https://github.com/jxom)! - Added `signInWithEthereum` capability to `wallet_connect`.

## 0.0.36

### Patch Changes

- [#517](https://github.com/ithacaxyz/porto/pull/517) [`a9583db`](https://github.com/ithacaxyz/porto/commit/a9583dba28b769d6f27549f69e21bebd15860c8e) Thanks [@jxom](https://github.com/jxom)! - Added conditional sponsoring to `MerchantRpc` via a `sponsor` option.

## 0.0.35

### Patch Changes

- [`6b65154`](https://github.com/ithacaxyz/porto/commit/6b65154a8979e7dd3c3894ac158e751b73804c89) Thanks [@jxom](https://github.com/jxom)! - **CLI:** Tweaked order of prompts.

## 0.0.34

### Patch Changes

- [#499](https://github.com/ithacaxyz/porto/pull/499) [`689ba2f`](https://github.com/ithacaxyz/porto/commit/689ba2f13be58d5312eb89f46a08eeb7c9e17d6d) Thanks [@jxom](https://github.com/jxom)! - Exported `MerchantRpc.POST` and `MerchantRpc.OPTIONS` functions for Next.js.

- [#501](https://github.com/ithacaxyz/porto/pull/501) [`8fca510`](https://github.com/ithacaxyz/porto/commit/8fca51007e014f5d48accedf6eabf53c5665e245) Thanks [@jxom](https://github.com/jxom)! - **CLI:** Added functionality to deploy account onchain on `porto onboard --admin-key` command.

## 0.0.33

### Patch Changes

- [#497](https://github.com/ithacaxyz/porto/pull/497) [`91627bf`](https://github.com/ithacaxyz/porto/commit/91627bf240fc5ef48567c8dfa4d99081d5542f25) Thanks [@jxom](https://github.com/jxom)! - Added `config` property to `Porto.create` return value.

- [#497](https://github.com/ithacaxyz/porto/pull/497) [`91627bf`](https://github.com/ithacaxyz/porto/commit/91627bf240fc5ef48567c8dfa4d99081d5542f25) Thanks [@jxom](https://github.com/jxom)! - Tweaked `MerchantRpc.requestHandler` parameters

## 0.0.32

### Patch Changes

- [`43eb41d`](https://github.com/ithacaxyz/porto/commit/43eb41d0c464360188665a15f9067504368cdb1c) Thanks [@jxom](https://github.com/jxom)! - **CLI:** Fixed id.porto.sh CTA on account creation.

## 0.0.31

### Patch Changes

- [#479](https://github.com/ithacaxyz/porto/pull/479) [`186b700`](https://github.com/ithacaxyz/porto/commit/186b7006cc4ff1c0f1ca20db50ad5cd576c10504) Thanks [@jxom](https://github.com/jxom)! - **CLI:** Refactored account onboarding.

## 0.0.30

### Patch Changes

- [#397](https://github.com/ithacaxyz/porto/pull/397) [`5c266d0`](https://github.com/ithacaxyz/porto/commit/5c266d0bde59f46e6e3bf97dc8b70c7c55a02aa8) Thanks [@jxom](https://github.com/jxom)! - **Breaking (`porto/viem`):** Removed `RelayActions.prepareCreateAccount`. Use `RelayActions.createAccount` or `RelayActions.upgradeAccount` instead.

- [#397](https://github.com/ithacaxyz/porto/pull/397) [`5c266d0`](https://github.com/ithacaxyz/porto/commit/5c266d0bde59f46e6e3bf97dc8b70c7c55a02aa8) Thanks [@jxom](https://github.com/jxom)! - **Breaking (`porto/viem`):** Renamed `keys` to `authorizeKeys` on `RelayActions.prepareUpgradeAccount` and `RelayActions.upgradeAccount`.

- [#397](https://github.com/ithacaxyz/porto/pull/397) [`5c266d0`](https://github.com/ithacaxyz/porto/commit/5c266d0bde59f46e6e3bf97dc8b70c7c55a02aa8) Thanks [@jxom](https://github.com/jxom)! - **Breaking (`porto/viem`):** Removed `RelayActions.getAccounts`.

- [#397](https://github.com/ithacaxyz/porto/pull/397) [`5c266d0`](https://github.com/ithacaxyz/porto/commit/5c266d0bde59f46e6e3bf97dc8b70c7c55a02aa8) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `wallet_createAccount`. Use `wallet_connect` with the `createAccount` capability instead.

  ```diff
  provider.request({
  - method: 'wallet_createAccount',
  + method: 'wallet_connect',
  + params: [
  +   {
  +     capabilities: {
  +       createAccount: true,
  +     },
  +   },
  + ],
  })
  ```

- [#397](https://github.com/ithacaxyz/porto/pull/397) [`5c266d0`](https://github.com/ithacaxyz/porto/commit/5c266d0bde59f46e6e3bf97dc8b70c7c55a02aa8) Thanks [@jxom](https://github.com/jxom)! - **Breaking (`porto/viem`):** Modified `ContractActions.execute#signatures` parameter to be an object instead of an array.

  ```diff
  ContractActions.execute({
    ...
  - signatures: ['0x...', '0x...']
  + signatures: {
  +   auth: '0x...',
  +   exec: '0x...',
  + },
  })
  ```

- [#397](https://github.com/ithacaxyz/porto/pull/397) [`5c266d0`](https://github.com/ithacaxyz/porto/commit/5c266d0bde59f46e6e3bf97dc8b70c7c55a02aa8) Thanks [@jxom](https://github.com/jxom)! - **Breaking (`porto/wagmi`):** Removed `useCreateAccount`/`createAccount` actions. Use `useConnect`/`connect` instead.

- [#397](https://github.com/ithacaxyz/porto/pull/397) [`5c266d0`](https://github.com/ithacaxyz/porto/commit/5c266d0bde59f46e6e3bf97dc8b70c7c55a02aa8) Thanks [@jxom](https://github.com/jxom)! - **Breaking (`porto/viem`):** Renamed `ContractActions.prepareExecute#signPayloads` to `ContractActions.prepareExecute#digests` parameter, and changed the type to be an object instead of an array.

  ```diff
  ContractActions.prepareExecute({
    ...
  - digests: ['0x...', '0x...']
  + digests: {
  +   auth: '0x...',
  +   exec: '0x...',
  + },
  })
  ```

## 0.0.29

### Patch Changes

- [`8275a95`](https://github.com/ithacaxyz/porto/commit/8275a9534ff48affeb940757c0884b09c2010973) Thanks [@jxom](https://github.com/jxom)! - Added `porto/viem` module. Documentation coming soon.

## 0.0.28

### Patch Changes

- [`87c88d2`](https://github.com/ithacaxyz/porto/commit/87c88d21dd4d2fe839e9a1d06da5cfab8044d1de) Thanks [@jxom](https://github.com/jxom)! - Fixed decoding of `adminsChanged` event.

## 0.0.27

### Patch Changes

- [#367](https://github.com/ithacaxyz/porto/pull/367) [`959faca`](https://github.com/ithacaxyz/porto/commit/959faca2d6388da187e80fe0936c1e08fcc9a5f0) Thanks [@jxom](https://github.com/jxom)! - Added remote fetch permissions on `wallet_getPermissions`.

- [#360](https://github.com/ithacaxyz/porto/pull/360) [`abf9e3b`](https://github.com/ithacaxyz/porto/commit/abf9e3bb84cdf98da97a3fffed13a9711dad729a) Thanks [@jxom](https://github.com/jxom)! - Improved `methodPolicies` handling in Dialog renderer.

- [#360](https://github.com/ithacaxyz/porto/pull/360) [`abf9e3b`](https://github.com/ithacaxyz/porto/commit/abf9e3bb84cdf98da97a3fffed13a9711dad729a) Thanks [@jxom](https://github.com/jxom)! - Added `waitForReady` property to `Bridge` messenger. This will return a pending promise if the receiving end has not instantiated yet, and will immediately resolve if it has.

- [#367](https://github.com/ithacaxyz/porto/pull/367) [`959faca`](https://github.com/ithacaxyz/porto/commit/959faca2d6388da187e80fe0936c1e08fcc9a5f0) Thanks [@jxom](https://github.com/jxom)! - Added remote fetch admins on `wallet_getAdmins`.

## 0.0.26

### Patch Changes

- [`d34baac`](https://github.com/ithacaxyz/porto/commit/d34baac8a78cf212532575f49ba2d079775a8ae8) Thanks [@jxom](https://github.com/jxom)! - Developer Preview.

## 0.0.25

### Patch Changes

- [#319](https://github.com/ithacaxyz/porto/pull/319) [`2e705ca`](https://github.com/ithacaxyz/porto/commit/2e705cae334a7c9d3ff3948bf81842d202fb3088) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Renamed `experimental_*` methods to `wallet_*`

## 0.0.24

### Patch Changes

- [`9f1fdda`](https://github.com/ithacaxyz/porto/commit/9f1fdda5e2e3469351bf0b81beb897a81a966f9c) Thanks [@jxom](https://github.com/jxom)! - Updated chain contract addresses.

- [#260](https://github.com/ithacaxyz/porto/pull/260) [`64de74b`](https://github.com/ithacaxyz/porto/commit/64de74bdc536241f1b11c1737ee32fe9dc4d3e88) Thanks [@jxom](https://github.com/jxom)! - Fall back to popup if iframe is embedded on an insecure origin (HTTP).

## 0.0.23

### Patch Changes

- [#232](https://github.com/ithacaxyz/porto/pull/232) [`e7d480c`](https://github.com/ithacaxyz/porto/commit/e7d480c7ebf4b77ed02778cbb6e8b8d76e06cbec) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `default` & `relay` attributes from `transports`. Use a single transport instead.

  ```diff
  Porto.create({
    ...
    transports: {
  -   1: {
  -     default: http('https://rpc.example.com'),
  -     relay: http('https://relay.example.com')
  -   },
  +   1: http('https://rpc.example.com')
    },
  })
  ```

- [#183](https://github.com/ithacaxyz/porto/pull/183) [`81792f5`](https://github.com/ithacaxyz/porto/commit/81792f5994756e42e2406aadd29b941870bae10e) Thanks [@tmm](https://github.com/tmm)! - Added support for dark/light icon types.

- [#234](https://github.com/ithacaxyz/porto/pull/234) [`8b2dff9`](https://github.com/ithacaxyz/porto/commit/8b2dff9095bfdb996747962883b7fd0b2da829a6) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Renames "Relay" keyword instances to "Relay".

  - `Mode.relay` → `Mode.relay`
  - `import { Relay } from 'porto'` → `import { RpcServer } from 'porto'`

- [`775a687`](https://github.com/ithacaxyz/porto/commit/775a6877920665a0e23ec9efe70945838c51386a) Thanks [@tmm](https://github.com/tmm)! - Added form support to inline iframe.

- [#237](https://github.com/ithacaxyz/porto/pull/237) [`6ce420e`](https://github.com/ithacaxyz/porto/commit/6ce420ef727aeb7ecc69cd5782c6deda9673f625) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `RpcServer.getFeeTokens` function. Use `RpcServer.getCapabilities` instead.

- [`c99968e`](https://github.com/ithacaxyz/porto/commit/c99968ea4ba343d434c1c7b48417641637d544b1) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Updated to Relay v7 APIs.

- [`2c445a1`](https://github.com/ithacaxyz/porto/commit/2c445a19a2af7a0bd9df6f72f071417d23f28ee7) Thanks [@jxom](https://github.com/jxom)! - Added `Account`, `Key`, `Relay` modules.

- [#237](https://github.com/ithacaxyz/porto/pull/237) [`6ce420e`](https://github.com/ithacaxyz/porto/commit/6ce420ef727aeb7ecc69cd5782c6deda9673f625) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed non-version attributes from `RpcServer.health`. It now returns a `string` indicating the current version of the Relay. To get the previous behavior, use `RpcServer.getCapabilities` instead.

- [`42107cb`](https://github.com/ithacaxyz/porto/commit/42107cb611533f14761259374c0e39be4391d627) Thanks [@o-az](https://github.com/o-az)! - Set porto default storage to memory on server-side

## 0.0.22

### Patch Changes

- [#172](https://github.com/ithacaxyz/porto/pull/172) [`c27df5e`](https://github.com/ithacaxyz/porto/commit/c27df5e736e182325de1b661f2e213434dff4ad5) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Pointed default configuration to Base Sepolia, and updated WebAuthn Relying Party to `stg.id.porto.sh`.

## 0.0.21

### Patch Changes

- [#127](https://github.com/ithacaxyz/porto/pull/127) [`3d51095`](https://github.com/ithacaxyz/porto/commit/3d510958b206bae18fe2231e3bbbca2fffe9a29c) Thanks [@jxom](https://github.com/jxom)! - Added `experimental_getAccountVersion`.

- [#144](https://github.com/ithacaxyz/porto/pull/144) [`88f33a5`](https://github.com/ithacaxyz/porto/commit/88f33a5b8ce51643cc25d286870d1732d3821a95) Thanks [@tmm](https://github.com/tmm)! - Fixed `wallet_getCallsStatus` response parsing.

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

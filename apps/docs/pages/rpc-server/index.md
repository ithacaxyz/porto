# Overview

The RPC server uses JSON-RPC 2.0 to facilitate communication between the Porto SDK and the blockchain. The RPC is responsible for building, simulating and sending intents to the contracts on behalf of a user.

Execution is paid for in one of the fee tokens accepted by the RPC on a given network. You can get the supported fee tokens for a chain by querying [`wallet_getCapabilities`].

The RPC server has passthrough to a standard Ethereum node.

:::note
We'd love to hear your feedback. Report any issues or feature suggestions [on the issue tracker](https://github.com/ithacaxyz/rpc-server-issues).
:::

## Endpoints

The RPC server has multiple endpoints, one for each chain/environment.

| RPC URL                       | Chain ID |
| ----------------------------- | -------- |
| `porto-dev.rpc.ithaca.xyz`    | `28404`  |
| `base-sepolia.rpc.ithaca.xyz` | `84532`  |

Each endpoint has passthrough to Ethereum RPCs for the corresponding network.

## Account management

Accounts are managed through the RPC using the following methods:

### Account creation

In order to facilitate account discovery, account creation is split into two steps:

- [`wallet_prepareCreateAccount`]: Generate an account and a corresponding address.
- [`wallet_createAccount`]: Create the account on chain.

Accounts are created using [PREP], which proves that neither the RPC server nor the user knows the underlying private key for the EOA.

[`wallet_prepareCreateAccount`] also returns a series of digests that must be signed with the admin keys of the account. These signatures are used to register the key and account in an on-chain registry, allowing users to discover their accounts using their keys later on.

### Account upgrade

Upgrading an existing EOA is split into two steps:

- [`wallet_prepareUpgradeAccount`]: Prepares an account for upgrade.
- [`wallet_upgradeAccount`]: Upgrades the account on chain.

### Account information

- [`wallet_getKeys`]: Get all keys attached to an account.
- [`wallet_getAccounts`]: Get all accounts a key is attached to.

For more details on how accounts work, see the [Account documentation](#TODO).

## Intent execution

Intents are executed in two steps. First, [`wallet_prepareCalls`] is called to simulate the call and estimate fees. A context is returned with the built intent, which also includes a quote signed by the RPC server, which expires after some time. The built intent is verified and signed by the user's key, and the quote plus the signed intent is sent to the RPC server with [`wallet_sendPreparedCalls`].

The RPC server will validate that the quote is still valid, that the intent was signed, and will then include it in a transaction on the destination chain. [`wallet_sendPreparedCalls`] returns an opaque identifier that is the equivalent of a transaction hash. To get the status of an intent, plus any transaction receipts for the intent, you must use [`wallet_getCallsStatus`].

## Passthrough

The RPC server passes through known Ethereum JSON-RPC methods to an underlying network of nodes for the corresponding chain. For example, you can query the block number or chain ID:

```sh
cast chain-id --rpc-url https://base-sepolia.rpc.ithaca.xyz

# 84532

```sh
cast block-number --rpc-url https://base-sepolia.rpc.ithaca.xyz

# 30568194
```

[`wallet_getCapabilities`]: /rpc-server/wallet_getCapabilities
[`wallet_prepareCreateAccount`]: /rpc-server/wallet_prepareCreateAccount
[`wallet_createAccount`]: /rpc-server/wallet_createAccount
[`wallet_prepareUpgradeAccount`]: /rpc-server/wallet_prepareUpgradeAccount
[`wallet_upgradeAccount`]: /rpc-server/wallet_upgradeAccount
[`wallet_getKeys`]: /rpc-server/wallet_getKeys
[`wallet_getAccounts`]: /rpc-server/wallet_getAccounts
[`wallet_prepareCalls`]: /rpc-server/wallet_prepareCalls
[`wallet_sendPreparedCalls`]: /rpc-server/wallet_sendPreparedCalls
[`wallet_getCallsStatus`]: /rpc-server/wallet_getCallsStatus
[PREP]: https://blog.biconomy.io/prep-deep-dive/

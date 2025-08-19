# Overview

The Relay uses JSON-RPC 2.0 to facilitate communication between the Porto SDK and the blockchain. The RPC is responsible for building, simulating and sending intents to the contracts on behalf of a user.

Execution is paid for in one of the fee tokens accepted by the RPC on a given network. You can get the supported fee tokens for a chain by querying [`wallet_getCapabilities`].

:::note
We'd love to hear your feedback. Report any issues or feature suggestions [on the issue tracker](https://github.com/ithacaxyz/relay-issues).
:::

## Endpoints

### Chain support

The Relay has a unified endpoint supporting the networks below: `https://rpc.ithaca.xyz`.

Supported mainnet chains:

- **Base** (Chain ID: 8453)
- **Optimism** (Chain ID: 10)
- **Arbitrum** (Chain ID: 42161)
- **BNB Chain** (Chain ID: 56)
- **Polygon** (Chain ID: 137)

Supported testnet chains:

- **Base Sepolia** (Chain ID: 84532)
- **Optimism Sepolia** (Chain ID: 11155420)
- **Arbitrum Sepolia** (Chain ID: 421614)

## Local Development

To run the Relay locally, you can use the following command:

```sh
curl -sSL s.porto.sh/docker | docker compose -f - up -d
```

Once complete, the Relay will be available at `http://localhost:9200`:

```sh
cast rpc --rpc-url http://localhost:9200 wallet_getCapabilities "[31337]"
```

:::tip
If you have [OrbStack](https://orbstack.dev/) installed, you can also query the Relay at `https://relay.local`.
:::

## Account management

Accounts are managed through the RPC using the following methods:

### Account upgrade

Upgrading an existing EOA is split into two steps:

- [`wallet_prepareUpgradeAccount`]: Prepares an account for upgrade.
- [`wallet_upgradeAccount`]: Upgrades the account on chain.

### Account information

- [`wallet_getKeys`]: Get all keys attached to an account.
- [`wallet_getAccounts`]: Get all accounts a key is attached to.

For more details on how accounts work, see the [Account documentation](#TODO).

## Intent execution

Intents are executed in two steps. First, [`wallet_prepareCalls`] is called to simulate the call and estimate fees. A context is returned with the built intent, which also includes a quote signed by the Relay, which expires after some time. The built intent is verified and signed by the user's key, and the quote plus the signed intent is sent to the Relay with [`wallet_sendPreparedCalls`].

The Relay will validate that the quote is still valid, that the intent was signed, and will then include it in a transaction on the destination chain. [`wallet_sendPreparedCalls`] returns an opaque identifier that is the equivalent of a transaction hash. To get the status of an intent, plus any transaction receipts for the intent, you must use [`wallet_getCallsStatus`].

[`wallet_getCapabilities`]: /relay/wallet_getCapabilities
[`wallet_prepareUpgradeAccount`]: /relay/wallet_prepareUpgradeAccount
[`wallet_upgradeAccount`]: /relay/wallet_upgradeAccount
[`wallet_getKeys`]: /relay/wallet_getKeys
[`wallet_getAccounts`]: /relay/wallet_getAccounts
[`wallet_prepareCalls`]: /relay/wallet_prepareCalls
[`wallet_sendPreparedCalls`]: /relay/wallet_sendPreparedCalls
[`wallet_getCallsStatus`]: /relay/wallet_getCallsStatus

# Overview

The Relay uses JSON-RPC 2.0 to facilitate communication between the Porto SDK and the blockchain. The RPC is responsible for building, simulating and sending intents to the contracts on behalf of a user.

Execution is paid for in one of the fee tokens accepted by the RPC on a given network. You can get the supported fee tokens for a chain by querying [`wallet_getCapabilities`].

:::note
We'd love to hear your feedback. Report any issues or feature suggestions [on the issue tracker](https://github.com/ithacaxyz/relay/issues).
:::

## Endpoints

### Chain support

The Relay exposes a unified JSON-RPC endpoint: `https://rpc.porto.sh`.

You can query supported chains, contracts, and fee tokens via `wallet_getCapabilities`.

Example:

```sh
cast rpc --rpc-url https://rpc.porto.sh wallet_getCapabilities
```

**Supported Networks:**

| Network | Chain ID | Fee Token Support | Interop Support |
|---------|----------|-------------------|-----------------|
| **Base** | 8453 | ETH, USDC, USDT | ETH, USDC, USDT |
| **Optimism** | 10 | ETH, USDC, USDT | ETH, USDC, USDT |
| **Arbitrum** | 42161 | ETH, USDC, USDT | ETH, USDC, USDT |
| **Ethereum** | 1 | ETH, USDC, USDT | ETH, USDC, USDT |
| **Celo** | 42220 | CELO, USDC, USDT | USDC, USDT |
| **BNB Chain** | 56 | BNB, USDT | No |
| **Polygon** | 137 | POL, USDC, USDT | USDC, USDT |
| **Katana** | 747474 | ETH | No |
| **Base Sepolia** | 84532 | tETH, EXP1, EXP2 | tETH, EXP1, EXP2 |
| **Optimism Sepolia** | 11155420 | tETH, EXP1, EXP2 | tETH, EXP1, EXP2 |
| **Arbitrum Sepolia** | 421614 | tETH | No |

- **Fee Token Support**: Tokens accepted to pay execution fees on that chain.
- **Interop Support**: Cross-chain supported tokens (from the Relay interop dashboard).

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

:::note
Production RPC URL: `https://rpc.porto.sh` (JSON-RPC 2.0 over HTTP). All examples on this page target this endpoint unless stated otherwise.
:::

## Testnet Faucet (dev)

Need test funds for Dialog/Playground flows? Use the development faucet RPC.

See: [`wallet_addFaucetFunds`](/relay/wallet_addFaucetFunds)

## Account management

Accounts are managed through the RPC using the following methods:

### Account upgrade

Upgrading an existing EOA is split into two steps:

- [`wallet_prepareUpgradeAccount`]: Prepares an account for upgrade.
- [`wallet_upgradeAccount`]: Upgrades the account on chain.

### Account information

- [`wallet_getKeys`]: Get all keys attached to an account.

For more details on how accounts work, see the [Account documentation](#TODO).

## Intent execution

Intents are executed in two steps. First, [`wallet_prepareCalls`] is called to simulate the call and estimate fees. A context is returned with the built intent, which also includes a quote signed by the Relay, which expires after some time. The built intent is verified and signed by the user's key, and the quote plus the signed intent is sent to the Relay with [`wallet_sendPreparedCalls`].

The Relay will validate that the quote is still valid, that the intent was signed, and will then include it in a transaction on the destination chain. [`wallet_sendPreparedCalls`] returns an opaque identifier that is the equivalent of a transaction hash. To get the status of an intent, plus any transaction receipts for the intent, you must use [`wallet_getCallsStatus`].

[`wallet_getCapabilities`]: /relay/wallet_getCapabilities
[`wallet_prepareUpgradeAccount`]: /relay/wallet_prepareUpgradeAccount
[`wallet_upgradeAccount`]: /relay/wallet_upgradeAccount
[`wallet_getKeys`]: /relay/wallet_getKeys
[`wallet_prepareCalls`]: /relay/wallet_prepareCalls
[`wallet_sendPreparedCalls`]: /relay/wallet_sendPreparedCalls
[`wallet_getCallsStatus`]: /relay/wallet_getCallsStatus

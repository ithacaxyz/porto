# `wallet_getCallsHistory`

Retrieve historical call bundles for an account. Results are returned in reverse chronological order by default.

Use this method to render activity feeds, audit execution history, or inspect which bundles were signed with a given key. For the current status of a specific bundle, prefer [`wallet_getCallsStatus`].

## Request

```ts
type Request = {
  method: 'wallet_getCallsHistory'
  params: [{
    /** Address to fetch call bundles for. */
    address: `0x${string}`
    /** Index to start from (cursor). Defaults to 0 for ascending and latest index for descending. */
    index?: number
    /** Maximum number of bundles to return. */
    limit: number
    /** Sort direction. Use 'desc' for most recent first. */
    sort: 'asc' | 'desc'
  }]
}
```

## Response

```ts
type Response = {
  /** Capabilities snapshot recorded for the bundle. */
  capabilities: {
    assetDiffs?: AssetDiffs
    feeTotals?: FeeTotals
    quotes?: Quote[]
  }
  /** Bundle identifier. */
  id: `0x${string}`
  /** Index of the bundle within the account's history. */
  index: number
  /** Hash of the key that signed the bundle. */
  keyHash: `0x${string}`
  /** Status code for the bundle (see [`wallet_getCallsStatus`]). */
  status: number
  /** UNIX timestamp (seconds) when the bundle was included. */
  timestamp: number
  /** Transactions broadcast as part of the bundle. */
  transactions: {
    chainId: number
    transactionHash: `0x${string}`
  }[]
}[]
```

## Example

```sh
cast rpc --rpc-url https://rpc.porto.sh \
    wallet_getCallsHistory '[{ "address": "0x391a3bFbd6555E74c771513b86A2e2a0356Ae1A0", "limit": 5, "sort": "desc" }]' --raw | jq
```

The `status` codes match the table documented on [`wallet_getCallsStatus`]. Use the `capabilities` object to render fee totals, asset diffs, and quotes captured at execution time.

See [`wallet_prepareCalls`](/relay/wallet_prepareCalls#response) for detailed capability schemas.

[`wallet_getCallsStatus`]: /relay/wallet_getCallsStatus
[`wallet_prepareCalls`]: /relay/wallet_prepareCalls

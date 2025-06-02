# `health`

Health check for the RPC server. Returns the version of the server.

## Request

```ts
type Request = {
  method: 'health',
}
```

## Response

```ts
type Response = string; // the version
```

## Example

```sh
cast rpc --rpc-url https://base-sepolia.rpc.ithaca.xyz health
```

```ts
"9.0.1-dev (f62ebc7)"
```

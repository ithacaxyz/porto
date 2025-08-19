# `health`

Health check for the Relay. Returns the version of the server.

## Request

```ts
type Request = {
  method: 'health',
}
```

## Response

```ts
dontype Response = {
  status: string;
  version: string;
}
```

## Example

```sh
cast rpc --rpc-url https://rpc.ithaca.xyz health
```

```json
{
  "status": "ok",
  "version": "21.0.2 (93ade40)"
}
```
